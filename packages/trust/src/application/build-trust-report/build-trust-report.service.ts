import { access, readFile, stat } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';

import {
  checkInstructionMirrorParity,
  validateSkoposHostProjectionModel,
} from '@skopos/instructions';
import {
  buildSkoposCombinedSkillSourceDigest,
  buildSkoposSkillSourceDigest,
  loadSkoposPolicyPacks,
  loadSkoposWorkflowManifests,
} from '@skopos/indexer';
import { loadSkoposQueryState } from '@skopos/query';
import type {
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowQuestionEntry,
  SkoposCompactProjectArtifact,
  SkoposImpactEntry,
  SkoposEnforcementProfileArtifact,
  SkoposDriftReportArtifact,
  SkoposAgentAnalysisBriefArtifact,
  SkoposAgentCommunicationBriefArtifact,
  SkoposMemoryStateArtifact,
  SkoposResolvedPolicyArtifact,
  SkoposResolvedGatesArtifact,
  SkoposResolvedSkillArtifact,
  SkoposProjectSkillBinding,
  SkoposSkillHostProjectionArtifact,
  SkoposSkillHostProjectionEntry,
  SkoposSkillPackManifest,
  SkoposReadiness,
  SkoposTrustCheck,
  SkoposTrustCheckStatus,
  SkoposTrustLevel,
  SkoposTrustReport,
} from '@skopos/model';
import { SKOPOS_SKILL_PROJECTION_HOST_IDS } from '@skopos/model';

import { loadEvalArtifact } from '../../adapters/eval-artifact.adapter.js';
import { loadMissionArtifacts } from '../../adapters/mission-artifact.adapter.js';
import { loadWorkflowQuestionsArtifact } from '../../adapters/workflow-router-artifact.adapter.js';
import { buildSkoposImpactReport } from '../build-impact-report/build-impact-report.service.js';
import { validateSkoposCompactProjectArtifact } from '../artifact-lifecycle/artifact-lifecycle.service.js';

export interface BuildSkoposTrustReportOptions {
  cwd: string;
  ignoreMissionEvalForMissionId?: string;
}

export const buildSkoposTrustReport = async ({
  cwd,
  ignoreMissionEvalForMissionId,
}: BuildSkoposTrustReportOptions): Promise<SkoposTrustReport> => {
  const workspaceRoot = resolve(cwd);
  const configPath = join(workspaceRoot, 'skopos.config.yaml');
  const bootstrapPath = join(workspaceRoot, '.skopos', 'bootstrap.json');
  const scopesLitePath = join(workspaceRoot, '.skopos', 'scopes-lite.json');
  const architecturePath = join(workspaceRoot, '.skopos', 'architecture.json');
  const enforcementPath = join(workspaceRoot, '.skopos', 'enforcement.json');
  const compactProjectPath = join(workspaceRoot, '.skopos', 'project.json');
  const resolvedPolicyPath = join(workspaceRoot, '.skopos', 'policies', 'resolved.json');
  const resolvedSkillsPath = join(workspaceRoot, '.skopos', 'skills', 'resolved.json');
  const driftReportPath = join(workspaceRoot, '.skopos', 'drift', 'report.json');
  const policyBriefPath = join(workspaceRoot, '.skopos', 'agent', 'policy-brief.json');
  const memoryStatePath = join(workspaceRoot, '.skopos', 'memory', 'state.json');
  const agentAnalysisBriefPath = join(workspaceRoot, '.skopos', 'understanding', 'agent-analysis-brief.json');
  const communicationBriefPath = join(workspaceRoot, '.skopos', 'agent', 'communication-brief.json');
  const fallbackRegistryPath = join(workspaceRoot, '.skopos', 'fallbacks', 'registry.json');
  const { bootstrap } = await loadSkoposQueryState({
    cwd: workspaceRoot,
  });
  const enforcement = await loadJsonArtifact<SkoposEnforcementProfileArtifact>(enforcementPath);
  const compactProject =
    await loadJsonArtifact<SkoposCompactProjectArtifact>(compactProjectPath);
  const resolvedPolicy = await loadJsonArtifact<SkoposResolvedPolicyArtifact>(resolvedPolicyPath);
  const resolvedSkills = await loadJsonArtifact<SkoposResolvedSkillArtifact>(resolvedSkillsPath);
  const driftReport = await loadJsonArtifact<SkoposDriftReportArtifact>(driftReportPath);
  const memoryState = await loadJsonArtifact<SkoposMemoryStateArtifact>(memoryStatePath);
  const communicationBrief = await loadJsonArtifact<SkoposAgentCommunicationBriefArtifact>(communicationBriefPath);
  const agentAnalysisBrief = await loadJsonArtifact<SkoposAgentAnalysisBriefArtifact>(agentAnalysisBriefPath);
  const availablePolicyPacks = await loadPolicyPacksIfAvailable(workspaceRoot);

  const docsRoot = bootstrap.recommendedConfig.docs.root;
  const docsStartHerePath =
    bootstrap.recommendedConfig.docs.startHerePath ?? `${docsRoot}/00-start-here.md`;
  const docsRootPath = resolve(workspaceRoot, docsRoot);
  const docsStartHereAbsolutePath = resolve(workspaceRoot, docsStartHerePath);
  const configExists = await pathExists(configPath);
  const bootstrapExists = await pathExists(bootstrapPath);
  const scopesLiteExists = await pathExists(scopesLitePath);
  const architectureExists = await pathExists(architecturePath);
  const docsRootExists = await pathExists(docsRootPath);
  const docsRouterExists =
    docsRootExists &&
    bootstrap.detected.docsHealth.hasStartHere &&
    (await pathExists(docsStartHereAbsolutePath));
  const staleDocs = bootstrap.detected.docsHealth.staleDocPaths;
  const canonicalInstructionSource = bootstrap.recommendedConfig.agents.canonicalInstructions;
  const instructionSourceExists = bootstrap.detected.instructionFiles.some(
    (instructionFile) =>
      instructionFile === canonicalInstructionSource || basename(instructionFile) === 'AGENTS.md',
  );
  const mirrorParity = instructionSourceExists
    ? await checkInstructionMirrorParity({
        cwd: workspaceRoot,
        instructionSourcePath: canonicalInstructionSource,
        projectionModel: enforcement?.hostProjectionModel,
      })
    : null;
  const mirrorIssues =
    mirrorParity?.issues.map((issue) => issue.path.replace(`${workspaceRoot}/`, '')) ?? [];
  const appliedOverrides = bootstrap.detected.appliedOverrides;
  const activeMissionCoverage = await buildActiveMissionCoverageSummary(workspaceRoot);
  const workflowQuestions = await loadWorkflowQuestionsArtifact(workspaceRoot);
  const openWorkflowQuestions = workflowQuestions?.entries.filter((entry) => entry.status === 'open') ?? [];
  const missionEvalPressure = await buildMissionEvalPressure({
    workspaceRoot,
    workflowQuestions,
    ignoreMissionEvalForMissionId,
  });
  const workflowRouterAdapterCoverage = buildWorkflowRouterAdapterCoverageSummary(enforcement);
  const hostProjectionParity = enforcement
    ? validateSkoposHostProjectionModel(enforcement)
    : {
        status: 'fail' as const,
        diagnostics: ['Enforcement profile is unavailable.'],
      };
  const hostProjectionStatus =
    !enforcement ||
    (hostProjectionParity.diagnostics.length === 1 &&
      hostProjectionParity.diagnostics[0] ===
        'Host projection model is missing from the enforcement profile.')
      ? 'warn'
      : hostProjectionParity.status;
  const acceptedPolicyCoverage = await buildAcceptedPolicyCoverageSummary({
    workspaceRoot,
    resolvedPolicy,
    resolvedPolicyPath,
    policyBriefPath,
    availablePolicyPackCount: availablePolicyPacks.length,
  });
  const driftCoverage = buildPolicyDriftCoverageSummary({
    resolvedPolicy,
    driftReport,
  });
  const memoryCoverage = buildMemoryCoverageSummary({
    memoryState,
    communicationBrief,
  });
  const projectModeCoverage = await buildProjectModeCoverageSummary({
    projectMode: bootstrap.recommendedConfig.project.mode,
    fallbackRegistryPath,
  });
  const skillPackCoverage = await buildSkillPackCoverageSummary({
    workspaceRoot,
    resolvedSkills,
    resolvedSkillsPath,
  });
  const artifactLifecycle = compactProject
    ? validateSkoposCompactProjectArtifact(compactProject)
    : {
        status: 'fail' as const,
        diagnostics: ['Compact project artifact is not generated yet.'],
      };

  const checks: SkoposTrustCheck[] = [
    createCheck(
      'root-config',
      configExists ? 'pass' : 'fail',
      configExists
        ? 'Root Skopos config is present.'
        : 'Root Skopos config is missing. Run `skopos init` to establish shared project policy.',
    ),
    createCheck(
      'generated-bootstrap',
      bootstrapExists && scopesLiteExists && architectureExists ? 'pass' : 'fail',
      bootstrapExists && scopesLiteExists && architectureExists
        ? 'Bootstrap, scopes-lite, and architecture artifacts are present.'
        : 'Generated bootstrap artifacts are incomplete. Run `skopos init` to refresh `.skopos/` state.',
    ),
    createCheck(
      'docs-root',
      docsRootExists ? 'pass' : 'fail',
      docsRootExists
        ? `Canonical docs root \`${docsRoot}\` is present.`
        : `Canonical docs root \`${docsRoot}\` is missing.`,
    ),
    createCheck(
      'docs-router',
      docsRootExists && docsRouterExists ? 'pass' : docsRootExists ? 'warn' : 'fail',
      docsRootExists && docsRouterExists
        ? `Canonical docs router \`${docsStartHerePath}\` is present.`
        : docsRootExists
          ? `Canonical docs root exists, but \`${docsStartHerePath}\` is missing.`
          : 'Canonical docs router cannot be verified because the docs root is missing.',
    ),
    createCheck(
      'docs-freshness',
      staleDocs.length === 0 ? 'pass' : 'warn',
      staleDocs.length === 0
        ? 'No stale tracked docs were detected in the canonical docs root.'
        : `Tracked docs marked stale or overdue review: ${staleDocs.join(', ')}.`,
    ),
    createCheck(
      'instruction-source',
      instructionSourceExists ? 'pass' : 'fail',
      instructionSourceExists
        ? `Canonical instruction source \`${canonicalInstructionSource}\` is present.`
        : `Canonical instruction source \`${canonicalInstructionSource}\` is missing, so tool instruction mirrors cannot be trusted.`,
    ),
    createCheck(
      'declared-overrides',
      'pass',
      appliedOverrides.length > 0
        ? `Declared canonical overrides are active: ${appliedOverrides.map((entry) => `${entry.key}=${entry.value}`).join(', ')}.`
        : 'No declared canonical overrides are currently active.',
    ),
    createCheck('project-mode', projectModeCoverage.projectMode.status, projectModeCoverage.projectMode.summary),
    createCheck('fallback-policy', projectModeCoverage.fallbackPolicy.status, projectModeCoverage.fallbackPolicy.summary),
    createCheck('accepted-policy', acceptedPolicyCoverage.acceptedPolicy.status, acceptedPolicyCoverage.acceptedPolicy.summary),
    createCheck('policy-brief', acceptedPolicyCoverage.policyBrief.status, acceptedPolicyCoverage.policyBrief.summary),
    createCheck('policy-source-freshness', acceptedPolicyCoverage.sourceFreshness.status, acceptedPolicyCoverage.sourceFreshness.summary),
    createCheck('policy-drift', driftCoverage.status, driftCoverage.summary),
    createCheck('accepted-skills', skillPackCoverage.acceptedSkills.status, skillPackCoverage.acceptedSkills.summary),
    createCheck('skill-bindings', skillPackCoverage.bindings.status, skillPackCoverage.bindings.summary),
    createCheck('skill-projections', skillPackCoverage.projections.status, skillPackCoverage.projections.summary),
    createCheck('memory-map', memoryCoverage.memoryMap.status, memoryCoverage.memoryMap.summary),
    createCheck('memory-roles', memoryCoverage.memoryRoles.status, memoryCoverage.memoryRoles.summary),
    createCheck('agent-communication', memoryCoverage.communication.status, memoryCoverage.communication.summary),
    createCheck('understanding-depth', buildUnderstandingDepthStatus(agentAnalysisBrief), buildUnderstandingDepthSummary(agentAnalysisBrief)),
    createCheck('active-mission', activeMissionCoverage.status, activeMissionCoverage.summary),
    createCheck(
      'workflow-questions',
      openWorkflowQuestions.length === 0 ? 'pass' : 'warn',
      buildWorkflowQuestionSummary(openWorkflowQuestions),
    ),
    createCheck('mission-evals', missionEvalPressure.status, missionEvalPressure.summary),
    createCheck(
      'instruction-mirrors',
      mirrorParity && mirrorParity.issues.length === 0 ? 'pass' : 'warn',
      mirrorParity && mirrorParity.issues.length === 0
        ? 'Instruction mirrors are present and in sync for the configured coding tools.'
        : `Instruction mirrors are missing or out of sync for: ${mirrorIssues.join(', ')}.`,
    ),
    createCheck(
      'workflow-router-adapters',
      workflowRouterAdapterCoverage.status,
      workflowRouterAdapterCoverage.summary,
    ),
    createCheck(
      'host-projection-parity',
      hostProjectionStatus,
      hostProjectionParity.status === 'pass'
        ? 'All host projections derive from the current Skopos project model.'
        : `${hostProjectionParity.diagnostics.join(' ')}${
            hostProjectionStatus === 'warn'
              ? ' Regenerate instructions to migrate this legacy profile.'
              : ''
          }`,
    ),
    createCheck(
      'artifact-lifecycle',
      compactProject ? artifactLifecycle.status : 'warn',
      artifactLifecycle.status === 'pass'
        ? 'Compact project, current-task, receipt, compatibility, and cache lifecycles are staged without a second workflow authority.'
        : `${artifactLifecycle.diagnostics.join(' ')}${
            compactProject ? '' : ' Run `skopos start` or `skopos next` to generate it.'
          }`,
    ),
    createCheck(
      'scan-findings',
      bootstrap.detected.findings.length === 0 ? 'pass' : 'warn',
      bootstrap.detected.findings.length === 0
        ? 'Bootstrap scan surfaced no blocking structural findings.'
        : `Bootstrap scan findings need review: ${bootstrap.detected.findings.join(' | ')}`,
    ),
  ];

  const unresolvedAssumptions = bootstrap.recommendedQuestions
    .filter((question) => question.escalation === 'must-ask')
    .map((question) => question.question);
  const trustLevel = deriveTrustLevel(checks, unresolvedAssumptions.length);
  const readiness = deriveReadiness(checks, unresolvedAssumptions.length);

  return {
    workspaceRoot,
    trustLevel,
    readiness,
    summary: buildTrustSummary(trustLevel, readiness, checks),
    checks,
    unresolvedAssumptions,
    findings: bootstrap.detected.findings,
    detected: bootstrap.detected,
  };
};


const buildUnderstandingDepthStatus = (
  artifact: SkoposAgentAnalysisBriefArtifact | null,
): SkoposTrustCheckStatus => {
  if (!artifact) {
    return 'warn';
  }

  return artifact.analysisStatus === 'agent-reviewed' ? 'pass' : 'warn';
};

const buildUnderstandingDepthSummary = (
  artifact: SkoposAgentAnalysisBriefArtifact | null,
): string => {
  if (!artifact) {
    return 'Agent-guided understanding brief is missing. Run `skopos understand .` before broad agent work.';
  }

  if (artifact.analysisStatus === 'agent-reviewed') {
    return 'Agent-reviewed project understanding docs are present.';
  }

  const missing = artifact.durableOutputs
    .filter((entry) => entry.required && entry.status !== 'present')
    .map((entry) => entry.path);

  return `Project understanding is scanner-only. Have an agent follow .skopos/understanding/agent-analysis-brief.json and create/update: ${missing.join(', ')}.`;
};

const buildProjectModeCoverageSummary = async ({
  projectMode,
  fallbackRegistryPath,
}: {
  projectMode: string | undefined;
  fallbackRegistryPath: string;
}): Promise<{
  projectMode: { status: SkoposTrustCheckStatus; summary: string };
  fallbackPolicy: { status: SkoposTrustCheckStatus; summary: string };
}> => {
  const cleanupMode = projectMode === 'clean-refactor' || projectMode === 'greenfield-in-existing-repo';
  const fallbackRegistryExists = await pathExists(fallbackRegistryPath);

  return {
    projectMode: projectMode
      ? {
          status: 'pass',
          summary: `Project mode is confirmed as ${projectMode}.`,
        }
      : {
          status: 'warn',
          summary:
            'Project mode is not confirmed. Run `skopos setup review .` and answer `project.mode` before broad agent work.',
        },
    fallbackPolicy:
      cleanupMode && !fallbackRegistryExists
        ? {
            status: 'warn',
            summary:
              'Cleanup-oriented mode is active, but no fallback metadata registry exists yet. Track durable fallbacks with owner, reason, affected surface, and removal condition or compatibility note.',
          }
        : {
            status: 'pass',
            summary: cleanupMode
              ? 'Cleanup-oriented mode has fallback metadata available.'
              : 'Fallback metadata is not required for the current project mode.',
          },
  };
};

const createCheck = (
  id: string,
  status: SkoposTrustCheckStatus,
  summary: string,
): SkoposTrustCheck => ({
  id,
  status,
  summary,
});

const deriveTrustLevel = (
  checks: SkoposTrustCheck[],
  unresolvedCount: number,
): SkoposTrustLevel => {
  const failCount = checks.filter((check) => check.status === 'fail').length;
  const warnCount = checks.filter((check) => check.status === 'warn').length;

  if (failCount > 0) {
    return 'low';
  }

  if (warnCount > 0 || unresolvedCount > 0) {
    return 'medium';
  }

  return 'high';
};

const deriveReadiness = (checks: SkoposTrustCheck[], unresolvedCount: number): SkoposReadiness => {
  const failCount = checks.filter((check) => check.status === 'fail').length;
  const warnCount = checks.filter((check) => check.status === 'warn').length;

  if (failCount > 0) {
    return 'bootstrap-needed';
  }

  if (warnCount > 0 || unresolvedCount > 0) {
    return 'needs-review';
  }

  return 'agent-ready';
};

const buildTrustSummary = (
  trustLevel: SkoposTrustLevel,
  readiness: SkoposReadiness,
  checks: SkoposTrustCheck[],
): string => {
  const passCount = checks.filter((check) => check.status === 'pass').length;
  const warnCount = checks.filter((check) => check.status === 'warn').length;
  const failCount = checks.filter((check) => check.status === 'fail').length;

  return `Trust ${trustLevel} (${readiness}) with ${passCount} ${pluralize('passing check', passCount)}, ${warnCount} ${pluralize('warning', warnCount)}, and ${failCount} ${pluralize('failure', failCount)}.`;
};

const pluralize = (label: string, count: number): string =>
  count === 1 ? label : `${label}s`;

const pathExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const loadJsonArtifact = async <TValue>(filePath: string): Promise<TValue | null> => {
  try {
    const contents = await readFile(filePath, 'utf8');
    return JSON.parse(contents) as TValue;
  } catch {
    return null;
  }
};

const ACTIVE_MISSION_TRACKED_CATEGORIES = new Set<SkoposImpactEntry['category']>([
  'instruction-source',
  'package-manifest',
  'package-source',
  'root-config',
  'workspace-file',
]);

const FRESH_ONBOARDING_REQUIRED_PATH = 'skopos.config.yaml';
const FRESH_ONBOARDING_TRACKED_PATHS = new Set([
  '.cursor/rules/project.mdc',
  '.github/copilot-instructions.md',
  '.gitignore',
  'AGENTS.md',
  'CLAUDE.md',
  'docs/00-start-here.md',
  FRESH_ONBOARDING_REQUIRED_PATH,
]);

interface ActiveMissionCoverageSummary {
  status: SkoposTrustCheckStatus;
  summary: string;
}

interface WorkflowRouterAdapterCoverageSummary {
  status: SkoposTrustCheckStatus;
  summary: string;
}

interface AcceptedPolicyCoverageSummary {
  acceptedPolicy: {
    status: SkoposTrustCheckStatus;
    summary: string;
  };
  policyBrief: {
    status: SkoposTrustCheckStatus;
    summary: string;
  };
  sourceFreshness: {
    status: SkoposTrustCheckStatus;
    summary: string;
  };
}

interface PolicyDriftCoverageSummary {
  status: SkoposTrustCheckStatus;
  summary: string;
}

interface MemoryCoverageSummary {
  memoryMap: {
    status: SkoposTrustCheckStatus;
    summary: string;
  };
  memoryRoles: {
    status: SkoposTrustCheckStatus;
    summary: string;
  };
  communication: {
    status: SkoposTrustCheckStatus;
    summary: string;
  };
}

const buildMemoryCoverageSummary = ({
  memoryState,
  communicationBrief,
}: {
  memoryState: SkoposMemoryStateArtifact | null;
  communicationBrief: SkoposAgentCommunicationBriefArtifact | null;
}): MemoryCoverageSummary => {
  if (!memoryState) {
    return {
      memoryMap: {
        status: 'warn',
        summary: 'Project memory map is missing. Run `skopos init` or refresh memory before broad agent work.',
      },
      memoryRoles: {
        status: 'warn',
        summary: 'Memory roles cannot be checked until `.skopos/memory/state.json` exists.',
      },
      communication: {
        status: communicationBrief ? 'pass' : 'warn',
        summary: communicationBrief
          ? 'Agent communication guidance is available.'
          : 'Agent communication guidance is missing. Refresh Skopos memory to generate it.',
      },
    };
  }

  const missingRoles = memoryState.roles.filter((role) => role.status === 'missing');
  const reviewRoles = memoryState.roles.filter((role) => role.status === 'needs-review');
  const staleRoles = memoryState.roles.filter((role) => role.status === 'stale');

  return {
    memoryMap: {
      status: memoryState.freshness === 'stale' ? 'warn' : 'pass',
      summary:
        memoryState.freshness === 'stale'
          ? 'Project memory map has stale sources. Refresh Skopos memory before relying on it.'
          : `Project memory map is available with ${memoryState.roles.length} mapped role checks.`,
    },
    memoryRoles: {
      status: missingRoles.length > 0 || staleRoles.length > 0 ? 'warn' : 'pass',
      summary:
        missingRoles.length > 0 || staleRoles.length > 0 || reviewRoles.length > 0
          ? `Memory roles need review: ${missingRoles.length} missing, ${reviewRoles.length} review, ${staleRoles.length} stale.`
          : 'All tracked memory roles are mapped.',
    },
    communication: {
      status: communicationBrief ? 'pass' : 'warn',
      summary: communicationBrief
        ? 'Agent communication guidance is available for lane explanations, guided questions, progress, proof, and closure.'
        : 'Agent communication guidance is missing. Refresh Skopos memory to generate it.',
    },
  };
};

interface SkillPackCoverageSummary {
  acceptedSkills: {
    status: SkoposTrustCheckStatus;
    summary: string;
  };
  bindings: {
    status: SkoposTrustCheckStatus;
    summary: string;
  };
  projections: {
    status: SkoposTrustCheckStatus;
    summary: string;
  };
}

const buildSkillPackCoverageSummary = async ({
  workspaceRoot,
  resolvedSkills,
  resolvedSkillsPath,
}: {
  workspaceRoot: string;
  resolvedSkills: SkoposResolvedSkillArtifact | null;
  resolvedSkillsPath: string;
}): Promise<SkillPackCoverageSummary> => {
  if (!resolvedSkills || resolvedSkills.acceptedSkills.length === 0) {
    const localPacksExist = await pathExists(join(workspaceRoot, 'skill-packs'));
    return {
      acceptedSkills: {
        status: localPacksExist ? 'warn' : 'pass',
        summary: localPacksExist
          ? 'Project skill packs are available but none are accepted. Run `skopos skills recommend .` before broad matching work.'
          : 'No project skill packs are accepted or locally registered.',
      },
      bindings: {
        status: 'pass',
        summary: 'Skill binding validation is not required until a skill pack is accepted.',
      },
      projections: {
        status: 'pass',
        summary: 'Skill host projection parity is not required until a skill pack is accepted.',
      },
    };
  }

  const [workflows, resolvedGates] = await Promise.all([
    loadSkoposWorkflowManifests({ cwd: workspaceRoot }),
    loadJsonArtifact<SkoposResolvedGatesArtifact>(
      join(workspaceRoot, '.skopos', 'gates', 'resolved.json'),
    ),
  ]);
  const actionIds = new Set(workflows.map((workflow) => workflow.id));
  const guardIds = new Set((resolvedGates?.gates ?? []).map((guard) => guard.id));
  const bindingDiagnostics: string[] = [];
  const expectedSkills: SkoposSkillHostProjectionEntry[] = [];

  for (const accepted of resolvedSkills.acceptedSkills) {
    const [pack, binding] = await Promise.all([
      loadJsonArtifact<SkoposSkillPackManifest>(resolve(workspaceRoot, accepted.sourcePath)),
      loadJsonArtifact<SkoposProjectSkillBinding>(
        resolve(workspaceRoot, accepted.bindingPath),
      ),
    ]);
    if (!pack) {
      bindingDiagnostics.push(`Accepted skill ${accepted.packId} is missing ${accepted.sourcePath}.`);
      continue;
    }
    if (!binding) {
      bindingDiagnostics.push(
        `Accepted skill ${accepted.packId} is missing ${accepted.bindingPath}.`,
      );
      continue;
    }
    if (pack.packId !== accepted.packId || pack.version !== accepted.version) {
      bindingDiagnostics.push(
        `Accepted skill ${accepted.packId} no longer matches its recorded pack id and version.`,
      );
    }
    if (
      binding.bindingId !== accepted.bindingId ||
      binding.packId !== pack.packId ||
      binding.packVersion !== pack.version
    ) {
      bindingDiagnostics.push(
        `Accepted skill ${accepted.packId} no longer matches binding ${accepted.bindingId}.`,
      );
    }
    const boundActionIds = [...new Set(Object.values(binding.actionBindings))].sort();
    const boundGuardIds = [...new Set(Object.values(binding.guardBindings))].sort();
    for (const actionId of boundActionIds) {
      if (!actionIds.has(actionId)) {
        bindingDiagnostics.push(
          `Accepted skill ${accepted.packId} references unknown action ${actionId}.`,
        );
      }
    }
    for (const guardId of boundGuardIds) {
      if (!guardIds.has(guardId)) {
        bindingDiagnostics.push(
          `Accepted skill ${accepted.packId} references unknown guard ${guardId}.`,
        );
      }
    }
    const packDirectory = dirname(accepted.sourcePath);
    const sourcePaths = [
      accepted.sourcePath,
      accepted.bindingPath,
      join(packDirectory, pack.rubricPath),
      ...pack.contextModules.map((module) => join(packDirectory, module.path)),
      ...pack.researchSources
        .map((source) => source.path)
        .filter((path): path is string => Boolean(path))
        .map((path) => join(packDirectory, path)),
      ...Object.values(binding.sourceBindings).flat(),
    ];
    const digest = await buildSkoposSkillSourceDigest({
      cwd: workspaceRoot,
      sourcePaths,
    });
    if (digest.missingPaths.length > 0) {
      bindingDiagnostics.push(
        `Accepted skill ${accepted.packId} has missing project sources: ${digest.missingPaths.join(', ')}.`,
      );
    }
    expectedSkills.push({
      packId: pack.packId,
      version: pack.version,
      bindingId: binding.bindingId,
      selectedBy: 'skopos-task-admission',
      moduleIds: pack.contextModules.map((module) => module.id),
      capabilities: {
        actionIds: boundActionIds,
        guardIds: boundGuardIds,
      },
      sourcePaths: digest.sourcePaths,
      sourceDigest: digest.digest,
    });
  }

  expectedSkills.sort((left, right) => left.packId.localeCompare(right.packId));
  const expectedPackIds = expectedSkills.map((skill) => skill.packId);
  const expectedSourceDigest = buildSkoposCombinedSkillSourceDigest(expectedSkills);
  const projectionDiagnostics: string[] = [];
  for (const hostId of SKOPOS_SKILL_PROJECTION_HOST_IDS) {
    const projectionPath = join(
      workspaceRoot,
      '.skopos',
      'skills',
      'projections',
      `${hostId}.json`,
    );
    const projection =
      await loadJsonArtifact<SkoposSkillHostProjectionArtifact>(projectionPath);
    if (!projection) {
      projectionDiagnostics.push(`Skill projection ${hostId} is missing.`);
      continue;
    }
    if (
      projection.hostId !== hostId ||
      projection.sourceAuthority !== 'skopos-resolved-skills' ||
      projection.resolvedSkillsPath !== '.skopos/skills/resolved.json'
    ) {
      projectionDiagnostics.push(
        `Skill projection ${hostId} does not derive from the resolved Skopos skill source.`,
      );
    }
    if (!sameStrings(projection.acceptedSkillPackIds, expectedPackIds)) {
      projectionDiagnostics.push(
        `Skill projection ${hostId} carries different accepted pack ids.`,
      );
    }
    if (projection.sourceDigest !== expectedSourceDigest) {
      projectionDiagnostics.push(
        `Skill projection ${hostId} is stale against current pack, binding, capability, or source content.`,
      );
    }
    if (
      JSON.stringify(normalizeSkillProjectionEntries(projection.skills)) !==
      JSON.stringify(normalizeSkillProjectionEntries(expectedSkills))
    ) {
      projectionDiagnostics.push(
        `Skill projection ${hostId} does not preserve pack, binding, capability, and source parity.`,
      );
    }
  }

  return {
    acceptedSkills: {
      status: 'pass',
      summary: `Accepted skill state is recorded at \`${resolvedSkillsPath.replace(`${workspaceRoot}/`, '')}\` with ${resolvedSkills.acceptedSkills.length} pack${resolvedSkills.acceptedSkills.length === 1 ? '' : 's'}.`,
    },
    bindings: {
      status: bindingDiagnostics.length === 0 ? 'pass' : 'fail',
      summary:
        bindingDiagnostics.length === 0
          ? 'Accepted skill bindings resolve current project sources and existing actions and guards.'
          : bindingDiagnostics.join(' '),
    },
    projections: {
      status:
        bindingDiagnostics.length === 0 && projectionDiagnostics.length === 0
          ? 'pass'
          : 'fail',
      summary:
        bindingDiagnostics.length === 0 && projectionDiagnostics.length === 0
          ? 'All skill host projections preserve the current accepted source and capability digest.'
          : [...bindingDiagnostics, ...projectionDiagnostics].join(' '),
    },
  };
};

const normalizeSkillProjectionEntries = (
  entries: SkoposSkillHostProjectionEntry[],
): SkoposSkillHostProjectionEntry[] =>
  entries
    .map((entry) => ({
      ...entry,
      moduleIds: [...entry.moduleIds],
      capabilities: {
        actionIds: [...entry.capabilities.actionIds].sort(),
        guardIds: [...entry.capabilities.guardIds].sort(),
      },
      sourcePaths: [...entry.sourcePaths].sort(),
    }))
    .sort((left, right) => left.packId.localeCompare(right.packId));

const sameStrings = (left: string[], right: string[]): boolean => {
  const normalizedLeft = [...new Set(left)].sort();
  const normalizedRight = [...new Set(right)].sort();
  return (
    normalizedLeft.length === normalizedRight.length &&
    normalizedLeft.every((entry, index) => entry === normalizedRight[index])
  );
};

const buildPolicyDriftCoverageSummary = ({
  resolvedPolicy,
  driftReport,
}: {
  resolvedPolicy: SkoposResolvedPolicyArtifact | null;
  driftReport: SkoposDriftReportArtifact | null;
}): PolicyDriftCoverageSummary => {
  if (!resolvedPolicy || resolvedPolicy.acceptedPacks.length === 0) {
    return {
      status: 'pass',
      summary: 'Policy drift is not required until a policy pack is accepted.',
    };
  }

  if (!driftReport) {
    return {
      status: 'warn',
      summary: 'Accepted policy exists, but no drift report is present. Run `skopos policies drift .`.',
    };
  }

  const driftUpdatedAt = Date.parse(driftReport.updatedAt ?? driftReport.generatedAt ?? '');
  const policyUpdatedAt = Date.parse(resolvedPolicy.updatedAt ?? resolvedPolicy.generatedAt ?? '');
  if (!Number.isNaN(policyUpdatedAt) && (Number.isNaN(driftUpdatedAt) || driftUpdatedAt < policyUpdatedAt)) {
    return {
      status: 'warn',
      summary: 'Policy drift report is older than accepted policy. Re-run `skopos policies drift .`.',
    };
  }

  if (driftReport.counts.openMustCount > 0) {
    return {
      status: 'fail',
      summary: `Accepted policy drift has ${driftReport.counts.openMustCount} open must finding${driftReport.counts.openMustCount === 1 ? '' : 's'}.`,
    };
  }

  if (driftReport.counts.openShouldCount > 0) {
    return {
      status: 'warn',
      summary: `Accepted policy drift has ${driftReport.counts.openShouldCount} open should finding${driftReport.counts.openShouldCount === 1 ? '' : 's'}.`,
    };
  }

  return {
    status: 'pass',
    summary: 'No blocking accepted-policy drift is open.',
  };
};

const buildAcceptedPolicyCoverageSummary = async ({
  workspaceRoot,
  resolvedPolicy,
  resolvedPolicyPath,
  policyBriefPath,
  availablePolicyPackCount,
}: {
  workspaceRoot: string;
  resolvedPolicy: SkoposResolvedPolicyArtifact | null;
  resolvedPolicyPath: string;
  policyBriefPath: string;
  availablePolicyPackCount: number;
}): Promise<AcceptedPolicyCoverageSummary> => {
  if (!resolvedPolicy || resolvedPolicy.acceptedPacks.length === 0) {
    if (availablePolicyPackCount === 0) {
      return {
        acceptedPolicy: {
          status: 'pass',
          summary:
            'No policy packs are registered in this workspace, so accepted policy is not required for current trust readiness.',
        },
        policyBrief: {
          status: 'pass',
          summary: 'Policy brief is not required because no policy packs are registered.',
        },
        sourceFreshness: {
          status: 'pass',
          summary: 'Policy source freshness is not applicable because no policy packs are registered.',
        },
      };
    }

    return {
      acceptedPolicy: {
        status: 'warn',
        summary:
          'No accepted policy pack is recorded. Run `skopos policies recommend .` and accept a suitable pack before broad agent work.',
      },
      policyBrief: {
        status: 'warn',
        summary: 'No policy brief can be trusted until `.skopos/policies/resolved.json` exists.',
      },
      sourceFreshness: {
        status: 'pass',
        summary: 'Policy source freshness is not applicable until a policy pack is accepted.',
      },
    };
  }

  const policyBriefExists = await pathExists(policyBriefPath);
  const staleSourcePaths = await findStalePolicySourcePaths({
    workspaceRoot,
    resolvedPolicy,
  });

  return {
    acceptedPolicy: {
      status: 'pass',
      summary: `Accepted policy is recorded at \`${resolvedPolicyPath.replace(`${workspaceRoot}/`, '')}\` with ${resolvedPolicy.acceptedPacks.length} pack${resolvedPolicy.acceptedPacks.length === 1 ? '' : 's'}.`,
    },
    policyBrief: {
      status: policyBriefExists ? 'pass' : 'warn',
      summary: policyBriefExists
        ? 'Compact policy brief is available for agent prompt layering.'
        : 'Accepted policy exists, but `.skopos/agent/policy-brief.json` is missing. Re-apply or refresh policy memory.',
    },
    sourceFreshness: {
      status: staleSourcePaths.length === 0 ? 'pass' : 'warn',
      summary:
        staleSourcePaths.length === 0
          ? 'Accepted policy source files are not newer than the resolved policy artifact.'
          : `Accepted policy source changed after resolution: ${staleSourcePaths.join(', ')}. Re-run \`skopos policies apply\` to refresh policy memory.`,
    },
  };
};

const findStalePolicySourcePaths = async ({
  workspaceRoot,
  resolvedPolicy,
}: {
  workspaceRoot: string;
  resolvedPolicy: SkoposResolvedPolicyArtifact;
}): Promise<string[]> => {
  const resolvedUpdatedAt = Date.parse(resolvedPolicy.updatedAt ?? resolvedPolicy.generatedAt ?? '');
  if (Number.isNaN(resolvedUpdatedAt)) {
    return resolvedPolicy.sourcePaths;
  }

  const stalePaths: string[] = [];
  for (const sourcePath of resolvedPolicy.sourcePaths) {
    try {
      const sourceStat = await stat(resolve(workspaceRoot, sourcePath));
      if (sourceStat.mtimeMs > resolvedUpdatedAt) {
        stalePaths.push(sourcePath);
      }
    } catch {
      stalePaths.push(sourcePath);
    }
  }

  return stalePaths;
};

const loadPolicyPacksIfAvailable = async (workspaceRoot: string) => {
  try {
    return await loadSkoposPolicyPacks({ cwd: workspaceRoot });
  } catch {
    return [];
  }
};

const buildWorkflowRouterAdapterCoverageSummary = (
  enforcement: SkoposEnforcementProfileArtifact | null,
): WorkflowRouterAdapterCoverageSummary => {
  if (!enforcement || enforcement.toolAdapters.length === 0) {
    return {
      status: 'warn',
      summary:
        'No generated tool adapter coverage is recorded in `.skopos/enforcement.json`, so workflow-router adoption remains manual outside direct CLI use.',
    };
  }

  const implementedAdapters = enforcement.toolAdapters.filter(
    (adapter) => adapter.supportStatus === 'implemented',
  );
  const fullCoverageAdapters = implementedAdapters.filter(
    (adapter) => adapter.workflowRouterCoverage.sessionStart && adapter.workflowRouterCoverage.stopBoundary,
  );
  const fullCoverageNames = fullCoverageAdapters.map((adapter) => adapter.displayName);

  if (fullCoverageAdapters.length === 0) {
    return {
      status: 'warn',
      summary:
        'Generated tool adapters exist, but none currently enforce the workflow router at both session start and stop.',
    };
  }

  if (fullCoverageAdapters.length < implementedAdapters.length) {
    const partialNames = implementedAdapters
      .filter((adapter) => !fullCoverageAdapters.some((covered) => covered.toolId === adapter.toolId))
      .map((adapter) => adapter.displayName);
    return {
      status: 'warn',
      summary: `Full workflow-router automation is available for ${fullCoverageNames.join(', ')}, but partial coverage remains for ${partialNames.join(', ')}.`,
    };
  }

  return {
    status: 'pass',
    summary: `Full workflow-router automation is available for ${fullCoverageNames.join(', ')}. Other hosts still require manual router use until they adopt the shared adapter contract.`,
  };
};

const buildActiveMissionCoverageSummary = async (
  workspaceRoot: string,
): Promise<ActiveMissionCoverageSummary> => {
  try {
    const impact = await buildSkoposImpactReport({
      cwd: workspaceRoot,
    });
    const trackedChangedPaths = impact.changed
      .filter((entry) => ACTIVE_MISSION_TRACKED_CATEGORIES.has(entry.category))
      .map((entry) => entry.path);

    if (trackedChangedPaths.length === 0) {
      return {
        status: 'pass',
        summary: 'No local source or workflow changes currently require mission tracking.',
      };
    }

    if (isFreshSkoposOnboardingChangeSet(trackedChangedPaths)) {
      return {
        status: 'pass',
        summary:
          'Fresh Skopos onboarding files are present. Review and commit the generated setup files when ready.',
      };
    }

    const missionArtifacts = await loadMissionArtifacts(workspaceRoot);
    const activeClaimedMissions = missionArtifacts.filter(
      (mission) => mission.state === 'active' && typeof mission.coordination.claimedBy?.actorId === 'string',
    );

    if (activeClaimedMissions.length > 0) {
      return {
        status: 'pass',
        summary: `Tracked local work is covered by active claimed mission ${summarizeMissionRefs(activeClaimedMissions.map((mission) => ({
          id: mission.id,
          actorId: mission.coordination.claimedBy?.actorId ?? 'unknown',
        })))}.`,
      };
    }

    const completedCoverage = await findCompletedMissionCoverage({
      workspaceRoot,
      trackedChangedPaths,
      missionArtifacts,
    });
    if (completedCoverage) {
      return {
        status: 'pass',
        summary: `Tracked local work is covered by completed claimed mission ${completedCoverage.missionId} (${completedCoverage.actorId}); no newer tracked edits were detected after closure evidence was recorded.`,
      };
    }

    return {
      status: 'warn',
      summary: `Tracked local work is present (${summarizePaths(trackedChangedPaths)}), but no active claimed mission was found. Create a plan or claim an existing mission before continuing workspace changes.`,
    };
  } catch {
    return {
      status: 'pass',
      summary:
        'Git-backed mission coverage could not be evaluated for this workspace, so no local mission-tracking warning was emitted.',
    };
  }
};

const isFreshSkoposOnboardingChangeSet = (trackedChangedPaths: string[]): boolean =>
  trackedChangedPaths.includes(FRESH_ONBOARDING_REQUIRED_PATH) &&
  trackedChangedPaths.every((path) => FRESH_ONBOARDING_TRACKED_PATHS.has(path));

const summarizePaths = (paths: string[]): string => {
  const preview = paths.slice(0, 3).join(', ');
  return paths.length <= 3 ? preview : `${preview}, +${paths.length - 3} more`;
};

const summarizeMissionRefs = (
  missions: Array<{ id: string; actorId: string }>,
): string => {
  const preview = missions
    .slice(0, 2)
    .map((mission) => `${mission.id} (${mission.actorId})`)
    .join(', ');

  return missions.length <= 2 ? preview : `${preview}, +${missions.length - 2} more`;
};

const findCompletedMissionCoverage = async ({
  workspaceRoot,
  trackedChangedPaths,
  missionArtifacts,
}: {
  workspaceRoot: string;
  trackedChangedPaths: string[];
  missionArtifacts: Awaited<ReturnType<typeof loadMissionArtifacts>>;
}): Promise<{ missionId: string; actorId: string } | null> => {
  const candidates = await Promise.all(
    missionArtifacts
      .filter(
        (mission) =>
          mission.state === 'complete' &&
          typeof mission.coordination.claimedBy?.actorId === 'string',
      )
      .map(async (mission) => {
        const evalArtifact = await loadEvalArtifact(workspaceRoot, mission.id);
        if (
          !evalArtifact ||
          (evalArtifact.executionPhase ?? 'closure') !== 'closure' ||
          evalArtifact.evaluationStatus !== 'complete' ||
          evalArtifact.pendingItemIds.length > 0 ||
          evalArtifact.blockingQuestionIds.length > 0
        ) {
          return null;
        }

        const missionUpdatedAt = Date.parse(mission.updatedAt ?? '');
        const evalUpdatedAt = Date.parse(evalArtifact.updatedAt ?? '');
        const coveredAt = Math.max(
          Number.isFinite(missionUpdatedAt) ? missionUpdatedAt : 0,
          Number.isFinite(evalUpdatedAt) ? evalUpdatedAt : 0,
        );
        if (coveredAt <= 0) {
          return null;
        }

        return {
          missionId: mission.id,
          actorId: mission.coordination.claimedBy?.actorId ?? 'unknown',
          coveredAt,
        };
      }),
  );

  const orderedCandidates = candidates
    .filter((entry): entry is { missionId: string; actorId: string; coveredAt: number } => Boolean(entry))
    .sort((left, right) => right.coveredAt - left.coveredAt);

  for (const candidate of orderedCandidates) {
    const allTrackedPathsPrecedeCoverage = await trackedPathsAreOlderThan({
      workspaceRoot,
      trackedChangedPaths,
      coveredAt: candidate.coveredAt,
    });
    if (allTrackedPathsPrecedeCoverage) {
      return {
        missionId: candidate.missionId,
        actorId: candidate.actorId,
      };
    }
  }

  return null;
};

const trackedPathsAreOlderThan = async ({
  workspaceRoot,
  trackedChangedPaths,
  coveredAt,
}: {
  workspaceRoot: string;
  trackedChangedPaths: string[];
  coveredAt: number;
}): Promise<boolean> => {
  for (const relativePath of trackedChangedPaths) {
    const absolutePath = resolve(workspaceRoot, relativePath);
    try {
      const fileStat = await stat(absolutePath);
      if (fileStat.mtimeMs > coveredAt) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
};

const buildWorkflowQuestionSummary = (
  openWorkflowQuestions: SkoposWorkflowQuestionEntry[],
): string => {
  if (openWorkflowQuestions.length === 0) {
    return 'No open workflow questions are currently active.';
  }

  const blockingQuestions = openWorkflowQuestions.filter((entry) => entry.blocking);
  if (blockingQuestions.length > 0) {
    return `Open blocking workflow questions still need resolution: ${blockingQuestions.map((entry) => entry.id).join(', ')}.`;
  }

  return `Open workflow questions still need review: ${openWorkflowQuestions.map((entry) => entry.id).join(', ')}.`;
};

interface MissionEvalPressureSummary {
  status: SkoposTrustCheckStatus;
  summary: string;
}

const buildMissionEvalPressure = async ({
  workspaceRoot,
  workflowQuestions,
  ignoreMissionEvalForMissionId,
}: {
  workspaceRoot: string;
  workflowQuestions: SkoposWorkflowQuestionArtifact | null;
  ignoreMissionEvalForMissionId?: string;
}): Promise<MissionEvalPressureSummary> => {
  const missionId = workflowQuestions?.generatedForMissionId;
  if (!missionId) {
    return {
      status: 'pass',
      summary: 'No current started mission is asking for eval-backed closure evidence.',
    };
  }

  if (ignoreMissionEvalForMissionId === missionId) {
    return {
      status: 'pass',
      summary: `Mission ${missionId} is currently being evaluated, so mission-eval closure pressure is deferred to the eval result.`,
    };
  }

  const missionArtifact = (await loadMissionArtifacts(workspaceRoot)).find(
    (mission) => mission.id === missionId,
  );
  if (!missionArtifact) {
    return {
      status: 'pass',
      summary: `Current workflow-router mission ${missionId} is not available for eval-pressure checks.`,
    };
  }

  const closureReady =
    missionArtifact.state === 'complete' ||
    missionArtifact.items
      .filter((item) => item.kind !== 'decision')
      .every((item) => item.status === 'complete');
  if (!closureReady) {
    return {
      status: 'pass',
      summary: `Mission ${missionId} is still in progress, so eval-backed closure evidence is not required yet.`,
    };
  }

  const evalArtifact = await loadEvalArtifact(workspaceRoot, missionId);
  if (!evalArtifact) {
    return {
      status: 'warn',
      summary: `Mission ${missionId} is ready for closure, but no eval artifact exists yet.`,
    };
  }

  if ((evalArtifact.executionPhase ?? 'closure') !== 'closure') {
    return {
      status: 'warn',
      summary: `Mission ${missionId} latest eval is for ${evalArtifact.executionPhase}; closure evidence still requires \`skopos eval --phase closure\`.`,
    };
  }

  if (evalArtifact.evaluationStatus !== 'complete') {
    return {
      status: 'warn',
      summary: `Mission ${missionId} has eval status ${evalArtifact.evaluationStatus}, so closure evidence is still incomplete.`,
    };
  }

  return {
    status: 'pass',
    summary: `Mission ${missionId} has complete eval-backed closure evidence.`,
  };
};
