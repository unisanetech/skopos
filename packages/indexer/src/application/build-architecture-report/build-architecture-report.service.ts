import { basename, join } from 'node:path';

import type {
  SkoposArchitectureAlignmentStatus,
  SkoposArchitectureBoundaryQuality,
  SkoposArchitectureDecision,
  SkoposArchitectureReport,
  SkoposArchitectureTopology,
  SkoposArchitectureUnit,
  SkoposArchitectureUnitRole,
  SkoposArchitectureView,
  SkoposDiagnosisReport,
  SkoposScopeLite,
  SkoposScopesLiteArtifact,
  SkoposScanSummary,
} from '@skopos/model';

import { readJsonFile } from '../../adapters/workspace-filesystem.adapter.js';
import { buildSkoposDiagnosisReport } from '../build-diagnosis-report/build-diagnosis-report.service.js';
import { buildSkoposScopesLite } from '../build-scopes-lite/build-scopes-lite.service.js';
import { scanRepo } from '../scan-repo/scan-repo.service.js';

export interface BuildSkoposArchitectureReportOptions {
  cwd: string;
  scanSummary?: SkoposScanSummary;
  diagnosis?: SkoposDiagnosisReport;
  scopesLite?: SkoposScopesLiteArtifact;
  subtreeTarget?: string;
}

interface PackageSignals {
  scripts: Record<string, unknown>;
  dependencies: Set<string>;
}

export const buildSkoposArchitectureReport = async ({
  cwd,
  scanSummary,
  diagnosis,
  scopesLite,
  subtreeTarget,
}: BuildSkoposArchitectureReportOptions): Promise<SkoposArchitectureReport> => {
  const detected = scanSummary ?? (await scanRepo({ cwd, subtreeTarget }));
  const resolvedDiagnosis =
    diagnosis ??
    (await buildSkoposDiagnosisReport({
      cwd,
      scanSummary: detected,
      subtreeTarget,
    }));
  const resolvedScopesLite =
    scopesLite ??
    (await buildSkoposScopesLite({
      cwd,
      scanSummary: detected,
      subtreeTarget,
    }));
  const units = await buildArchitectureUnits({
    cwd,
    detected,
    scopesLite: resolvedScopesLite,
  });
  const unresolvedDecisions = buildUnresolvedDecisions(resolvedDiagnosis);
  const current = buildCurrentArchitectureView({
    detected,
    diagnosis: resolvedDiagnosis,
    units,
  });
  const recommended = buildRecommendedArchitectureView({
    detected,
    diagnosis: resolvedDiagnosis,
    units,
    unresolvedDecisions,
  });
  const alignmentStatus = deriveAlignmentStatus({
    current,
    recommended,
    unresolvedDecisionCount: unresolvedDecisions.length,
  });
  const now = new Date().toISOString();

  return {
    schemaVersion: 1,
    id: 'architecture',
    type: 'architecture',
    status: 'generated',
    authority: 'generated',
    summary: buildArchitectureSummary(alignmentStatus, current, recommended),
    updatedAt: now,
    generatedAt: now,
    workspaceRoot: cwd,
    focusSubtree: detected.focusSubtree,
    repoMode: detected.repoMode,
    archetypeSuggestion: detected.archetypeSuggestion,
    alignmentStatus,
    current,
    recommended,
    unresolvedDecisions,
  };
};

interface BuildArchitectureUnitsInput {
  cwd: string;
  detected: SkoposScanSummary;
  scopesLite: SkoposScopesLiteArtifact;
}

const buildArchitectureUnits = async ({
  cwd,
  detected,
  scopesLite,
}: BuildArchitectureUnitsInput): Promise<SkoposArchitectureUnit[]> => {
  const workspaceScope = scopesLite.scopes.find((scope) => scope.kind === 'workspace');
  const units: SkoposArchitectureUnit[] = [
    {
      scopeId: workspaceScope?.id ?? 'workspace',
      title: workspaceScope?.title ?? basename(cwd),
      path: workspaceScope?.path ?? '.',
      role: detectWorkspaceRole(detected),
      confidence: workspaceScope?.confidence ?? detected.confidence,
      summary: workspaceScope?.summary ?? buildWorkspaceUnitSummary(detected),
    },
  ];

  const projectScopes = scopesLite.scopes.filter((scope) => scope.kind !== 'workspace');

  for (const scope of projectScopes) {
    const role = await detectScopeRole({ cwd, scope });

    units.push({
      scopeId: scope.id,
      title: scope.title,
      path: scope.path,
      role,
      confidence: scope.confidence,
      summary: buildScopeUnitSummary(scope, role),
    });
  }

  return units;
};

const detectScopeRole = async ({
  cwd,
  scope,
}: {
  cwd: string;
  scope: SkoposScopeLite;
}): Promise<SkoposArchitectureUnitRole> => {
  if (scope.kind === 'workspace') {
    return 'workspace-root';
  }
  if (scope.kind === 'package') {
    return detectPackageRole(await loadPackageSignals({ cwd, scope }));
  }

  return scope.kind;
};

const loadPackageSignals = async ({
  cwd,
  scope,
}: {
  cwd: string;
  scope: SkoposScopeLite;
}): Promise<PackageSignals> => {
  const packageJson = await readJsonFile<Record<string, unknown>>(
    join(cwd, scope.path, 'package.json'),
  );
  const scriptsValue = packageJson?.scripts;
  const scripts =
    typeof scriptsValue === 'object' && scriptsValue !== null
      ? (scriptsValue as Record<string, unknown>)
      : {};
  const dependencies = new Set<string>();

  for (const field of ['dependencies', 'devDependencies', 'peerDependencies'] as const) {
    const value = packageJson?.[field];
    if (typeof value !== 'object' || value === null) {
      continue;
    }

    for (const dependencyName of Object.keys(value)) {
      dependencies.add(dependencyName);
    }
  }

  return {
    scripts,
    dependencies,
  };
};

const detectWorkspaceRole = (detected: SkoposScanSummary): SkoposArchitectureUnitRole => {
  if (detected.repoMode !== 'single') {
    return 'workspace-root';
  }

  if (hasServiceFramework(detected.frameworks)) {
    return 'service';
  }

  if (hasWebFramework(detected.frameworks)) {
    return 'web-app';
  }

  if (detected.archetypeSuggestion === 'library') {
    return 'library';
  }

  if (detected.archetypeSuggestion === 'internal-tool') {
    return 'support';
  }

  return 'unknown';
};

const buildWorkspaceUnitSummary = (detected: SkoposScanSummary): string => {
  if (detected.repoMode === 'single' && hasServiceFramework(detected.frameworks)) {
    return 'Workspace root behaves like a single service entrypoint.';
  }

  if (detected.repoMode === 'single' && hasWebFramework(detected.frameworks)) {
    return 'Workspace root behaves like a single web app entrypoint.';
  }

  if (detected.repoMode !== 'single') {
    return 'Workspace root behaves like the composition and workflow surface for multiple declared Scopes.';
  }

  return 'Workspace root role is present but still weakly classified.';
};

const detectPackageRole = (packageSignals: PackageSignals): SkoposArchitectureUnitRole => {
  if (hasDependency(packageSignals.dependencies, ['express', 'fastify', 'hono'])) {
    return 'service';
  }

  if (hasDependency(packageSignals.dependencies, ['next', 'react'])) {
    return 'web-app';
  }

  if (hasDependency(packageSignals.dependencies, ['tsup', 'vite'])) {
    return 'library';
  }

  if (
    typeof packageSignals.scripts.dev === 'string' &&
    packageSignals.scripts.dev.includes('next')
  ) {
    return 'web-app';
  }

  return 'package';
};

const buildScopeUnitSummary = (
  scope: SkoposScopeLite,
  role: SkoposArchitectureUnitRole,
): string => {
  if (scope.kind !== 'package') {
    return `${scope.title} is the declared ${scope.kind} Scope at ${scope.path}.`;
  }

  if (role === 'service') {
    return `Package ${scope.id} behaves like a service/runtime boundary.`;
  }

  if (role === 'web-app') {
    return `Package ${scope.id} behaves like a web application boundary.`;
  }

  if (role === 'library') {
    return `Package ${scope.id} behaves like a shared library boundary.`;
  }

  return `Package ${scope.id} is a declared package boundary without stronger runtime-role signals.`;
};

const buildUnresolvedDecisions = (diagnosis: SkoposDiagnosisReport): SkoposArchitectureDecision[] =>
  diagnosis.findings
    .filter((finding) => finding.requiresHumanDecision)
    .map((finding) => ({
      id: `decision:${finding.id}`,
      summary: `Confirm the canonical path for ${finding.family}.`,
      reason: finding.summary,
      confidence: finding.confidence,
      relatedFindingIds: [finding.id],
      recommendedAction: finding.recommendedAction,
    }));

interface BuildArchitectureViewInput {
  detected: SkoposScanSummary;
  diagnosis: SkoposDiagnosisReport;
  units: SkoposArchitectureUnit[];
}

const buildCurrentArchitectureView = ({
  detected,
  diagnosis,
  units,
}: BuildArchitectureViewInput): SkoposArchitectureView => {
  const topology = deriveCurrentTopology({
    detected,
    diagnosis,
    units,
  });
  const boundaryQuality = deriveCurrentBoundaryQuality(diagnosis);

  return {
    topology,
    boundaryQuality,
    summary: buildCurrentViewSummary(topology, boundaryQuality),
    units,
    evidence: buildCurrentEvidence({
      detected,
      diagnosis,
      units,
    }),
  };
};

interface BuildRecommendedArchitectureViewInput extends BuildArchitectureViewInput {
  unresolvedDecisions: SkoposArchitectureDecision[];
}

const buildRecommendedArchitectureView = ({
  detected,
  diagnosis,
  units,
  unresolvedDecisions,
}: BuildRecommendedArchitectureViewInput): SkoposArchitectureView => {
  const topology = deriveRecommendedTopology({
    detected,
    units,
  });
  const boundaryQuality = unresolvedDecisions.length > 0 ? 'mixed' : 'clear';

  return {
    topology,
    boundaryQuality,
    summary: buildRecommendedViewSummary(topology, boundaryQuality, unresolvedDecisions),
    units,
    evidence: buildRecommendedEvidence({
      detected,
      diagnosis,
      unresolvedDecisions,
    }),
  };
};

const deriveCurrentTopology = ({
  detected,
  diagnosis,
  units,
}: BuildArchitectureViewInput): SkoposArchitectureTopology => {
  const scopeRoles = units.slice(1).map((unit) => unit.role);

  if (detected.repoMode === 'single') {
    return deriveSingleTopology(detected);
  }

  if (scopeRoles.includes('service') && scopeRoles.includes('web-app')) {
    return diagnosis.health === 'healthy' ? 'platform-monorepo' : 'mixed-monorepo';
  }

  if (scopeRoles.includes('service')) {
    return 'service-monorepo';
  }

  if (scopeRoles.includes('web-app')) {
    return 'web-monorepo';
  }

  if (scopeRoles.includes('library')) {
    return 'library-monorepo';
  }

  return detected.archetypeSuggestion === 'internal-tool'
    ? 'internal-tool-workspace'
    : 'mixed-monorepo';
};

const deriveRecommendedTopology = ({
  detected,
  units,
}: {
  detected: SkoposScanSummary;
  units: SkoposArchitectureUnit[];
}): SkoposArchitectureTopology => {
  const scopeRoles = units.slice(1).map((unit) => unit.role);

  if (detected.repoMode === 'single') {
    return deriveSingleTopology(detected);
  }

  if (scopeRoles.includes('service') && scopeRoles.includes('web-app')) {
    return 'platform-monorepo';
  }

  if (scopeRoles.includes('service')) {
    return 'service-monorepo';
  }

  if (scopeRoles.includes('web-app')) {
    return 'web-monorepo';
  }

  if (scopeRoles.includes('library')) {
    return 'library-monorepo';
  }

  return detected.archetypeSuggestion === 'internal-tool'
    ? 'internal-tool-workspace'
    : 'mixed-monorepo';
};

const deriveSingleTopology = (detected: SkoposScanSummary): SkoposArchitectureTopology => {
  if (hasServiceFramework(detected.frameworks)) {
    return 'single-service';
  }

  if (hasWebFramework(detected.frameworks)) {
    return 'single-web-app';
  }

  if (detected.archetypeSuggestion === 'library') {
    return 'single-library';
  }

  if (detected.archetypeSuggestion === 'internal-tool') {
    return 'internal-tool-workspace';
  }

  return 'single-workspace';
};

const deriveCurrentBoundaryQuality = (
  diagnosis: SkoposDiagnosisReport,
): SkoposArchitectureBoundaryQuality => {
  const hasWeakSignals = diagnosis.findings.some(
    (finding) =>
      finding.classification === 'conflicting' ||
      finding.classification === 'poor' ||
      finding.severity === 'high',
  );

  if (hasWeakSignals) {
    return 'weak';
  }

  const hasMixedSignals = diagnosis.findings.some(
    (finding) => finding.classification !== 'canonical' || finding.severity !== 'low',
  );

  return hasMixedSignals ? 'mixed' : 'clear';
};

const deriveAlignmentStatus = ({
  current,
  recommended,
  unresolvedDecisionCount,
}: {
  current: SkoposArchitectureView;
  recommended: SkoposArchitectureView;
  unresolvedDecisionCount: number;
}): SkoposArchitectureAlignmentStatus => {
  if (
    current.topology === recommended.topology &&
    current.boundaryQuality === recommended.boundaryQuality &&
    unresolvedDecisionCount === 0
  ) {
    return 'aligned';
  }

  if (
    current.topology !== recommended.topology ||
    current.boundaryQuality === 'weak' ||
    unresolvedDecisionCount > 1
  ) {
    return 'divergent';
  }

  return 'partial';
};

const buildArchitectureSummary = (
  alignmentStatus: SkoposArchitectureAlignmentStatus,
  current: SkoposArchitectureView,
  recommended: SkoposArchitectureView,
): string => {
  if (alignmentStatus === 'aligned') {
    return `Current architecture already aligns with the recommended ${recommended.topology} shape.`;
  }

  if (alignmentStatus === 'partial') {
    return `Current architecture is close to the recommended ${recommended.topology} shape, but some boundaries still need cleanup.`;
  }

  return `Current architecture diverges from the recommended ${recommended.topology} target and should be stabilized before broad agent autonomy.`;
};

const buildCurrentViewSummary = (
  topology: SkoposArchitectureTopology,
  boundaryQuality: SkoposArchitectureBoundaryQuality,
): string => {
  if (boundaryQuality === 'clear') {
    return `Current repo structure reads as a ${topology} with clear enough boundaries for normal agent use.`;
  }

  if (boundaryQuality === 'mixed') {
    return `Current repo structure reads as a ${topology}, but some boundaries or canonical surfaces are only partially established.`;
  }

  return `Current repo structure reads as a ${topology}, but weak or conflicting patterns make the architecture hard to trust as-is.`;
};

const buildRecommendedViewSummary = (
  topology: SkoposArchitectureTopology,
  boundaryQuality: SkoposArchitectureBoundaryQuality,
  unresolvedDecisions: SkoposArchitectureDecision[],
): string => {
  if (boundaryQuality === 'clear') {
    return `Recommended target architecture is a ${topology} with explicit canonical surfaces and no remaining human decisions in the current diagnosis pass.`;
  }

  return `Recommended target architecture is a ${topology}, but ${unresolvedDecisions.length} human decision(s) still need confirmation before Skopos can treat it as canonical.`;
};

const buildCurrentEvidence = ({
  detected,
  diagnosis,
  units,
}: {
  detected: SkoposScanSummary;
  diagnosis: SkoposDiagnosisReport;
  units: SkoposArchitectureUnit[];
}): string[] => {
  const evidence = [
    `repo mode: ${detected.repoMode}`,
    `archetype suggestion: ${detected.archetypeSuggestion}`,
    `package count: ${detected.packageCount}`,
    `units: ${units.map((unit) => `${unit.path}:${unit.role}`).join(', ') || 'workspace-root only'}`,
  ];

  for (const finding of diagnosis.findings.filter(
    (finding) => finding.classification !== 'canonical',
  )) {
    evidence.push(`finding:${finding.id}=${finding.classification}/${finding.severity}`);
  }

  return evidence;
};

const buildRecommendedEvidence = ({
  detected,
  diagnosis,
  unresolvedDecisions,
}: {
  detected: SkoposScanSummary;
  diagnosis: SkoposDiagnosisReport;
  unresolvedDecisions: SkoposArchitectureDecision[];
}): string[] => {
  const evidence = [
    `target repo mode: ${detected.repoMode}`,
    `target archetype: ${detected.archetypeSuggestion}`,
  ];

  for (const decision of unresolvedDecisions) {
    evidence.push(`decision:${decision.id}`);
  }

  for (const finding of diagnosis.findings) {
    if (finding.recommendedAction) {
      evidence.push(`action:${finding.id}=${finding.recommendedAction}`);
    }
  }

  return evidence;
};

const hasServiceFramework = (frameworks: string[]): boolean =>
  frameworks.some(
    (framework) => framework === 'express' || framework === 'fastify' || framework === 'hono',
  );

const hasWebFramework = (frameworks: string[]): boolean =>
  frameworks.some(
    (framework) =>
      framework === 'nextjs' ||
      framework === 'react' ||
      framework === 'svelte' ||
      framework === 'vue',
  );

const hasDependency = (dependencies: Set<string>, names: string[]): boolean =>
  names.some((name) => dependencies.has(name));
