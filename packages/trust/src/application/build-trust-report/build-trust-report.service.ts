import { access, readFile, stat } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

import { checkInstructionMirrorParity } from '@skopos/instructions';
import { loadSkoposQueryState } from '@skopos/query';
import type {
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowQuestionEntry,
  SkoposImpactEntry,
  SkoposEnforcementProfileArtifact,
  SkoposReadiness,
  SkoposTrustCheck,
  SkoposTrustCheckStatus,
  SkoposTrustLevel,
  SkoposTrustReport,
} from '@skopos/model';

import { loadEvalArtifact } from '../../adapters/eval-artifact.adapter.js';
import { loadMissionArtifacts } from '../../adapters/mission-artifact.adapter.js';
import { loadWorkflowQuestionsArtifact } from '../../adapters/workflow-router-artifact.adapter.js';
import { buildSkoposImpactReport } from '../build-impact-report/build-impact-report.service.js';

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
  const { bootstrap } = await loadSkoposQueryState({
    cwd: workspaceRoot,
  });
  const enforcement = await loadJsonArtifact<SkoposEnforcementProfileArtifact>(enforcementPath);

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
  const docsRouterExists = docsRootExists && (await pathExists(docsStartHereAbsolutePath));
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

  return `Trust ${trustLevel} (${readiness}) with ${passCount} passing checks, ${warnCount} warnings, and ${failCount} failures.`;
};

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

interface ActiveMissionCoverageSummary {
  status: SkoposTrustCheckStatus;
  summary: string;
}

interface WorkflowRouterAdapterCoverageSummary {
  status: SkoposTrustCheckStatus;
  summary: string;
}

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
