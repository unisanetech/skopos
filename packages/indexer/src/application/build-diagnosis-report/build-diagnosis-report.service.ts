import { basename, relative } from 'node:path';

import type {
  SkoposCommandName,
  SkoposConfidence,
  SkoposDiagnosisFinding,
  SkoposDiagnosisReport,
  SkoposDiagnosisSeverity,
  SkoposPatternClassification,
  SkoposScanSummary,
} from '@skopos/model';

import { findFilesNamed, readJsonFile } from '../../adapters/workspace-filesystem.adapter.js';
import { scanRepo } from '../scan-repo/scan-repo.service.js';
import { isPackageScopePath } from '../shared/package-scope-path.policy.js';
import { isWithinSubtree, normalizeSubtreeTarget } from '../shared/subtree-target.policy.js';

const COMMAND_NAMES: SkoposCommandName[] = ['dev', 'build', 'test', 'typecheck', 'lint'];

interface PackageCommandSurface {
  name: string;
  path: string;
  commandNames: SkoposCommandName[];
}

export interface BuildSkoposDiagnosisReportOptions {
  cwd: string;
  scanSummary?: SkoposScanSummary;
  subtreeTarget?: string;
}

export const buildSkoposDiagnosisReport = async ({
  cwd,
  scanSummary,
  subtreeTarget,
}: BuildSkoposDiagnosisReportOptions): Promise<SkoposDiagnosisReport> => {
  const detected = scanSummary ?? (await scanRepo({ cwd, subtreeTarget }));
  const focusSubtree = normalizeSubtreeTarget(cwd, subtreeTarget ?? detected.focusSubtree);
  const packageSurfaces = await collectPackageCommandSurfaces(
    cwd,
    focusSubtree,
    detected.ignoredPaths,
  );
  const findings = buildDiagnosisFindings({
    cwd,
    detected,
    packageSurfaces,
  });
  const remediationMissions = buildRemediationMissions(findings);
  const health = deriveRepoHealth(findings);
  const summary =
    health === 'healthy'
      ? 'Detected repo patterns are stable enough for normal agent use.'
      : health === 'needs-stabilization'
        ? 'Repo structure is usable, but conflicting or weak patterns should be stabilized before broad agent autonomy.'
        : 'Repo structure is at risk; establish canonical docs, instructions, and commands before relying on agents broadly.';

  return {
    schemaVersion: 1,
    id: 'diagnosis',
    type: 'diagnosis',
    status: 'generated',
    authority: 'generated',
    summary,
    updatedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    workspaceRoot: cwd,
    focusSubtree,
    repoMode: detected.repoMode,
    archetypeSuggestion: detected.archetypeSuggestion,
    confidence: detected.confidence,
    packageCount: detected.packageCount,
    workspacePackageCount: detected.workspacePackageCount,
    health,
    findings,
    remediationMissions,
  };
};

interface BuildDiagnosisFindingsInput {
  cwd: string;
  detected: SkoposScanSummary;
  packageSurfaces: PackageCommandSurface[];
}

const buildDiagnosisFindings = ({
  cwd,
  detected,
  packageSurfaces,
}: BuildDiagnosisFindingsInput): SkoposDiagnosisFinding[] => [
  buildWorkspaceStructureFinding(detected),
  buildDocsRootFinding(detected),
  buildDocsFreshnessFinding(detected),
  buildInstructionSurfaceFinding(detected),
  buildCommandSurfaceFinding({
    cwd,
    detected,
    packageSurfaces,
  }),
];

const buildWorkspaceStructureFinding = (detected: SkoposScanSummary): SkoposDiagnosisFinding => {
  const overrideEvidence = overrideEvidenceFor(detected, 'project.repoMode');

  if (detected.focusSubtree && detected.workspacePackageCount > detected.packageCount) {
    return createFinding({
      id: 'workspace-structure',
      family: 'workspace-structure',
      classification: 'canonical',
      severity: 'low',
      confidence: detected.confidence,
      summary: `Focused subtree scan is active at ${detected.focusSubtree}.`,
      evidence: [
        `workspace package count: ${detected.workspacePackageCount}`,
        `slice package count: ${detected.packageCount}`,
        ...overrideEvidence,
      ],
      recommendedAction:
        'Use subtree-targeted scans for large workspaces, then fall back to full-workspace scans when changing shared root policy.',
      requiresHumanDecision: false,
    });
  }

  if (detected.repoMode === 'monorepo' && detected.packageCount < 3) {
    return createFinding({
      id: 'workspace-structure',
      family: 'workspace-structure',
      classification: 'poor',
      severity: 'medium',
      confidence: detected.confidence,
      summary: 'Monorepo signals are present, but package discovery is still sparse.',
      evidence: [
        `repo mode: ${detected.repoMode}`,
        `package count: ${detected.packageCount}`,
        detected.hasPnpmWorkspace ? 'workspace manifest detected' : 'workspace manifest missing',
        ...overrideEvidence,
      ],
      recommendedAction:
        'Confirm whether this should stay a monorepo and standardize the expected package boundaries.',
      requiresHumanDecision: true,
    });
  }

  if (detected.repoMode === 'multi-package' && !detected.hasPnpmWorkspace) {
    return createFinding({
      id: 'workspace-structure',
      family: 'workspace-structure',
      classification: 'recommended',
      severity: 'medium',
      confidence: detected.confidence,
      summary:
        'Multiple package surfaces exist without a workspace manifest to make boundaries explicit.',
      evidence: [
        `repo mode: ${detected.repoMode}`,
        `package count: ${detected.packageCount}`,
        ...overrideEvidence,
      ],
      recommendedAction:
        'Adopt a workspace manifest or collapse packages until the intended package topology is clear.',
      requiresHumanDecision: true,
    });
  }

  return createFinding({
    id: 'workspace-structure',
    family: 'workspace-structure',
    classification: 'canonical',
    severity: 'low',
    confidence: detected.confidence,
    summary:
      detected.repoMode === 'single'
        ? 'Workspace structure is simple and predictable.'
        : 'Workspace boundaries are explicit enough for agent scope resolution.',
    evidence: [
      `repo mode: ${detected.repoMode}`,
      `package count: ${detected.packageCount}`,
      ...overrideEvidence,
    ],
    requiresHumanDecision: false,
  });
};

const buildDocsRootFinding = (detected: SkoposScanSummary): SkoposDiagnosisFinding => {
  const overrideEvidence = overrideEvidenceFor(detected, 'docs.root');

  if (detected.docsRoots.length === 0) {
    return createFinding({
      id: 'docs-root',
      family: 'docs-root',
      classification: 'poor',
      severity: 'high',
      confidence: detected.confidence,
      summary: 'No canonical docs root was detected.',
      evidence: ['expected docs root: docs/', 'detected docs roots: none', ...overrideEvidence],
      recommendedAction:
        'Create a canonical docs root and a deterministic start-here router before relying on repo knowledge.',
      requiresHumanDecision: false,
    });
  }

  if (!detected.docsHealth.hasStartHere) {
    return createFinding({
      id: 'docs-root',
      family: 'docs-root',
      classification: 'recommended',
      severity: 'medium',
      confidence: detected.confidence,
      summary: 'A docs root exists, but a deterministic start-here router is missing.',
      evidence: [
        ...detected.docsRoots.map((docsRoot) => `docs root: ${docsRoot}`),
        'missing router: no deterministic docs start-here path was detected',
        ...overrideEvidence,
      ],
      recommendedAction:
        'Add or declare a deterministic docs start-here router so humans and agents have one canonical entrypoint into project knowledge.',
      requiresHumanDecision: false,
    });
  }

  return createFinding({
    id: 'docs-root',
    family: 'docs-root',
    classification: 'canonical',
    severity: 'low',
    confidence: detected.confidence,
    summary: 'A canonical docs root is present.',
    evidence: [
      ...detected.docsRoots.map((docsRoot) => `docs root: ${docsRoot}`),
      ...overrideEvidence,
    ],
    requiresHumanDecision: false,
  });
};

const buildDocsFreshnessFinding = (detected: SkoposScanSummary): SkoposDiagnosisFinding => {
  const overrideEvidence = overrideEvidenceFor(detected, 'docs.root');

  if (detected.docsRoots.length === 0) {
    return createFinding({
      id: 'docs-freshness',
      family: 'docs-freshness',
      classification: 'unknown',
      severity: 'low',
      confidence: detected.confidence,
      summary: 'Docs freshness cannot be evaluated until a canonical docs root exists.',
      evidence: ['docs root missing', ...overrideEvidence],
      requiresHumanDecision: false,
    });
  }

  if (detected.docsHealth.staleDocPaths.length > 0) {
    return createFinding({
      id: 'docs-freshness',
      family: 'docs-freshness',
      classification: 'recommended',
      severity: 'medium',
      confidence: detected.confidence,
      summary: 'Docs freshness metadata indicates stale human-readable guidance.',
      evidence: [
        ...detected.docsHealth.staleDocPaths.map((filePath) => `stale doc: ${filePath}`),
        ...overrideEvidence,
      ],
      recommendedAction:
        'Review and refresh the stale docs before trusting them as canonical guidance for agents.',
      requiresHumanDecision: false,
    });
  }

  return createFinding({
    id: 'docs-freshness',
    family: 'docs-freshness',
    classification: 'canonical',
    severity: 'low',
    confidence: detected.confidence,
    summary:
      detected.docsHealth.freshnessTrackedCount > 0
        ? 'Tracked docs freshness metadata is current.'
        : 'No stale tracked docs were detected in the canonical docs root.',
    evidence: [
      `docs root: ${detected.docsHealth.root ?? detected.docsRoots[0]}`,
      `tracked docs: ${detected.docsHealth.freshnessTrackedCount}`,
      `stale docs: ${detected.docsHealth.staleDocPaths.length}`,
      ...overrideEvidence,
    ],
    requiresHumanDecision: false,
  });
};

const buildInstructionSurfaceFinding = (detected: SkoposScanSummary): SkoposDiagnosisFinding => {
  const canonicalAgentsPath = detected.instructionFiles.find(
    (filePath) => basename(filePath) === 'AGENTS.md',
  );
  const hasCanonicalAgents = Boolean(canonicalAgentsPath);
  const toolSpecificMirrors = detected.instructionFiles.filter(
    (filePath) => filePath !== canonicalAgentsPath,
  );

  if (!hasCanonicalAgents && toolSpecificMirrors.length > 0) {
    return createFinding({
      id: 'instruction-surface',
      family: 'instruction-surface',
      classification: 'conflicting',
      severity: 'high',
      confidence: detected.confidence,
      summary:
        'Tool-specific instruction files exist without AGENTS.md as the canonical instruction source.',
      evidence: toolSpecificMirrors.map((filePath) => `instruction file: ${filePath}`),
      recommendedAction:
        'Add AGENTS.md as the canonical instruction contract, then regenerate tool-specific mirrors from it.',
      requiresHumanDecision: true,
    });
  }

  if (!hasCanonicalAgents) {
    return createFinding({
      id: 'instruction-surface',
      family: 'instruction-surface',
      classification: 'poor',
      severity: 'high',
      confidence: detected.confidence,
      summary: 'No canonical agent instruction source was detected.',
      evidence: ['no AGENTS.md path detected'],
      recommendedAction:
        'Add AGENTS.md before trusting agents to follow project-specific workflow rules.',
      requiresHumanDecision: false,
    });
  }

  return createFinding({
    id: 'instruction-surface',
    family: 'instruction-surface',
    classification: 'canonical',
    severity: 'low',
    confidence: detected.confidence,
    summary:
      toolSpecificMirrors.length > 0
        ? `AGENTS.md is present as the canonical instruction source at ${canonicalAgentsPath}.`
        : `AGENTS.md is present at ${canonicalAgentsPath}; tool-specific mirrors can be generated from it as needed.`,
    evidence: detected.instructionFiles.map((filePath) => `instruction file: ${filePath}`),
    requiresHumanDecision: false,
  });
};

interface BuildCommandSurfaceFindingInput {
  cwd: string;
  detected: SkoposScanSummary;
  packageSurfaces: PackageCommandSurface[];
}

const buildCommandSurfaceFinding = ({
  cwd,
  detected,
  packageSurfaces,
}: BuildCommandSurfaceFindingInput): SkoposDiagnosisFinding => {
  const rootCommandNames = COMMAND_NAMES.filter((commandName) => detected.commands[commandName]);
  const packageOwnersByCommand = collectPackageOwnersByCommand(packageSurfaces);
  const duplicatedPackageCommands = COMMAND_NAMES.filter(
    (commandName) => (packageOwnersByCommand[commandName]?.length ?? 0) > 1,
  );

  if (rootCommandNames.length >= 3) {
    return createFinding({
      id: 'command-surface',
      family: 'command-surface',
      classification: 'canonical',
      severity: 'low',
      confidence: detected.confidence,
      summary: 'A canonical root command surface is present.',
      evidence: rootCommandNames.map((commandName) => `root command: ${commandName}`),
      requiresHumanDecision: false,
    });
  }

  if (rootCommandNames.length === 0 && duplicatedPackageCommands.length > 0) {
    return createFinding({
      id: 'command-surface',
      family: 'command-surface',
      classification: 'conflicting',
      severity: 'high',
      confidence: detected.confidence,
      summary: 'Package-level scripts exist without a canonical root command surface.',
      evidence: duplicatedPackageCommands.flatMap((commandName) =>
        (packageOwnersByCommand[commandName] ?? []).map((owner) => `${commandName}: ${owner}`),
      ),
      recommendedAction:
        'Promote one root command surface for shared workflows so agents do not guess between package-local scripts.',
      requiresHumanDecision: true,
    });
  }

  if (rootCommandNames.length > 0 && rootCommandNames.length < COMMAND_NAMES.length) {
    return createFinding({
      id: 'command-surface',
      family: 'command-surface',
      classification: 'recommended',
      severity: 'medium',
      confidence: detected.confidence,
      summary:
        'A partial root command surface exists, but some canonical workflow lanes are still missing.',
      evidence: [
        ...rootCommandNames.map((commandName) => `root command: ${commandName}`),
        ...COMMAND_NAMES.filter((commandName) => !rootCommandNames.includes(commandName)).map(
          (commandName) => `missing root command: ${commandName}`,
        ),
      ],
      recommendedAction:
        'Complete the shared dev/build/test/typecheck/lint command surface at the workspace root.',
      requiresHumanDecision: false,
    });
  }

  return createFinding({
    id: 'command-surface',
    family: 'command-surface',
    classification: 'poor',
    severity: 'medium',
    confidence: detected.confidence,
    summary: 'No canonical command surface was detected.',
    evidence:
      packageSurfaces.length > 0
        ? packageSurfaces.map(
            (surface) => `${relative(cwd, surface.path)}: ${surface.commandNames.join(', ')}`,
          )
        : ['no matching scripts detected in root or package manifests'],
    recommendedAction: 'Define canonical root commands for dev, build, test, typecheck, and lint.',
    requiresHumanDecision: false,
  });
};

const collectPackageCommandSurfaces = async (
  cwd: string,
  subtreeTarget?: string,
  ignoredPaths: string[] = [],
): Promise<PackageCommandSurface[]> => {
  const packageJsonPaths = (await findFilesNamed(cwd, 'package.json')).filter((filePath) =>
    isPackageScopePath(relative(cwd, filePath.replace(/\/package\.json$/, '')) || '.', ignoredPaths),
  );
  const surfaces: PackageCommandSurface[] = [];

  for (const packageJsonPath of packageJsonPaths) {
    const packageDir = relative(cwd, packageJsonPath.replace(/\/package\.json$/, '')) || '.';
    if (!isWithinSubtree(packageDir, subtreeTarget)) {
      continue;
    }

    const packageJson = await readJsonFile<Record<string, unknown>>(packageJsonPath);
    if (!packageJson) {
      continue;
    }

    const scripts = packageJson.scripts;
    const commandNames = COMMAND_NAMES.filter(
      (commandName) =>
        typeof (scripts as Record<string, unknown> | null | undefined)?.[commandName] ===
          'string' &&
        ((scripts as Record<string, unknown>)[commandName] as string).trim().length > 0,
    );

    if (commandNames.length === 0) {
      continue;
    }

    surfaces.push({
      name:
        typeof packageJson.name === 'string'
          ? packageJson.name
          : basename(relative(cwd, packageJsonPath), '/package.json'),
      path: packageJsonPath,
      commandNames,
    });
  }

  return surfaces;
};

const collectPackageOwnersByCommand = (
  packageSurfaces: PackageCommandSurface[],
): Partial<Record<SkoposCommandName, string[]>> => {
  const ownersByCommand: Partial<Record<SkoposCommandName, string[]>> = {};

  for (const surface of packageSurfaces) {
    for (const commandName of surface.commandNames) {
      const owners = ownersByCommand[commandName] ?? [];
      owners.push(surface.name);
      ownersByCommand[commandName] = owners;
    }
  }

  return ownersByCommand;
};

const buildRemediationMissions = (findings: SkoposDiagnosisFinding[]) =>
  findings
    .filter(
      (finding) => finding.classification !== 'canonical' && finding.classification !== 'unknown',
    )
    .map((finding) => ({
      id: `remediate.${finding.family}`,
      title: remediationTitleForFamily(finding.id, finding.family),
      detail: finding.recommendedAction ?? finding.summary,
      priority: finding.severity,
      relatedFindingIds: [finding.id],
      recommendedCommand: remediationCommandForFamily(finding.id),
    }));

const remediationTitleForFamily = (
  findingId: string,
  family: SkoposDiagnosisFinding['family'],
): string => {
  if (findingId === 'docs-root') {
    return 'Define the canonical docs root';
  }

  if (findingId === 'instruction-surface') {
    return 'Establish AGENTS.md as the canonical instruction source';
  }

  if (findingId === 'docs-freshness') {
    return 'Refresh stale docs guidance';
  }

  if (findingId === 'command-surface') {
    return 'Consolidate canonical root commands';
  }

  if (family === 'workspace-structure') {
    return 'Stabilize workspace boundaries';
  }

  return 'Review repo diagnosis';
};

const remediationCommandForFamily = (findingId: string): string | undefined => {
  if (findingId === 'instruction-surface') {
    return 'skopos instructions sync';
  }

  if (findingId === 'docs-root') {
    return 'skopos init --dry-run --json <repo-root>';
  }

  if (findingId === 'docs-freshness') {
    return 'skopos trust --cwd <repo-root> --json';
  }

  return undefined;
};

const deriveRepoHealth = (findings: SkoposDiagnosisFinding[]) => {
  const highRiskCount = findings.filter(
    (finding) =>
      finding.severity === 'high' &&
      (finding.classification === 'poor' || finding.classification === 'conflicting'),
  ).length;
  const nonCanonicalCount = findings.filter(
    (finding) => finding.classification !== 'canonical',
  ).length;

  if (highRiskCount >= 2) {
    return 'at-risk';
  }

  if (nonCanonicalCount > 0) {
    return 'needs-stabilization';
  }

  return 'healthy';
};

interface CreateFindingInput {
  id: string;
  family: SkoposDiagnosisFinding['family'];
  classification: SkoposPatternClassification;
  severity: SkoposDiagnosisSeverity;
  confidence: SkoposConfidence;
  summary: string;
  evidence: string[];
  recommendedAction?: string;
  requiresHumanDecision: boolean;
}

const createFinding = ({
  id,
  family,
  classification,
  severity,
  confidence,
  summary,
  evidence,
  recommendedAction,
  requiresHumanDecision,
}: CreateFindingInput): SkoposDiagnosisFinding => ({
  id,
  family,
  classification,
  severity,
  confidence,
  summary,
  evidence,
  recommendedAction,
  requiresHumanDecision,
});

const overrideEvidenceFor = (
  detected: SkoposScanSummary,
  key: 'project.repoMode' | 'docs.root',
): string[] =>
  detected.appliedOverrides
    .filter((entry) => entry.key === key)
    .map((entry) => `override: ${entry.key}=${entry.value}`);
