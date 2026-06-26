import { access, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import type {
  SkoposDoneReport,
  SkoposDriftReportArtifact,
  SkoposEvalArtifact,
  SkoposTrustCheck,
  SkoposWorkflowRequirementEvidence,
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowQuestionEntry,
} from '@skopos/model';

import { loadEvalArtifact } from '../../adapters/eval-artifact.adapter.js';
import { loadMissionArtifact } from '../../adapters/mission-artifact.adapter.js';
import { loadWorkflowQuestionsArtifact } from '../../adapters/workflow-router-artifact.adapter.js';
import {
  getLatestChangedAt,
  loadWorkflowRunArtifacts,
} from '../../adapters/workflow-run-artifact.adapter.js';
import { buildSkoposImpactReport } from '../build-impact-report/build-impact-report.service.js';
import { buildSkoposTrustReport } from '../build-trust-report/build-trust-report.service.js';

export interface BuildSkoposDoneReportOptions {
  cwd: string;
  changedPaths?: string[];
  mission?: string;
  actor?: string;
}

export const buildSkoposDoneReport = async ({
  cwd,
  changedPaths = [],
  mission,
  actor,
}: BuildSkoposDoneReportOptions): Promise<SkoposDoneReport> => {
  const workspaceRoot = resolve(cwd);
  const [impact, trust] = await Promise.all([
    buildSkoposImpactReport({
      cwd: workspaceRoot,
      changedPaths,
    }),
    buildSkoposTrustReport({
      cwd: workspaceRoot,
    }),
  ]);
  const missionArtifact = mission ? await loadMissionArtifact(workspaceRoot, mission) : null;
  const pendingMissionItems =
    missionArtifact?.items.filter((item) => item.status !== 'complete') ?? [];
  const workflowQuestionsArtifact = await loadWorkflowQuestionsArtifact(workspaceRoot);
  const openWorkflowQuestions = filterOpenWorkflowQuestions({
    artifact: workflowQuestionsArtifact,
    missionId: missionArtifact?.id,
  });
  const blockingWorkflowQuestions = openWorkflowQuestions.filter((entry) => entry.blocking);
  const advisoryWorkflowQuestions = openWorkflowQuestions.filter((entry) => !entry.blocking);
  const requestedActorId = resolveActorId(actor);
  const claimedByActorId = missionArtifact?.coordination.claimedBy?.actorId;
  const workflowEvidence = await buildWorkflowEvidence({
    workspaceRoot,
    requiredWorkflows: impact.requiredWorkflows,
  });
  const failedWorkflowEvidence = workflowEvidence.filter((entry) => entry.status === 'fail');
  const missionEval = missionArtifact
    ? await loadEvalArtifact(workspaceRoot, missionArtifact.id)
    : null;
  const missionEvalPath = missionArtifact
    ? join(workspaceRoot, '.skopos', 'evals', `${missionArtifact.id}.json`)
    : undefined;
  const policyDrift = await loadPolicyDriftReport(workspaceRoot);
  const openMustPolicyDriftCount = policyDrift?.counts.openMustCount ?? 0;

  const checks: SkoposTrustCheck[] = [
    createCheck(
      'workspace-trust',
      trust.trustLevel === 'high' ? 'pass' : trust.trustLevel === 'medium' ? 'warn' : 'fail',
      trust.summary,
    ),
    createCheck(
      'generated-artifact-edits',
      impact.changed.some((entry) => entry.category === 'generated-artifact') ? 'fail' : 'pass',
      impact.changed.some((entry) => entry.category === 'generated-artifact')
        ? 'Derived `.skopos/**` artifacts were listed as changed and should be regenerated instead of edited directly.'
        : 'No derived `.skopos/**` artifacts were listed as changed.',
    ),
    createCheck(
      'instruction-mirror-parity',
      impact.instructionMirrorIssues.length === 0 ? 'pass' : 'fail',
      impact.instructionMirrorIssues.length === 0
        ? 'Instruction mirrors are in parity with `AGENTS.md`.'
        : `Instruction mirrors are missing or out of sync: ${impact.instructionMirrorIssues.join(', ')}.`,
    ),
    createCheck(
      'docs-sync-review',
      impact.requiredActions.some((action) => action.includes('Review docs impact'))
        ? 'warn'
        : 'pass',
      impact.requiredActions.some((action) => action.includes('Review docs impact'))
        ? 'Docs review is still required before closure.'
        : 'No docs-review requirement is currently outstanding.',
    ),
    createCheck(
      'workflow-questions',
      blockingWorkflowQuestions.length > 0
        ? 'fail'
        : advisoryWorkflowQuestions.length > 0
          ? 'warn'
          : 'pass',
      buildWorkflowQuestionClosureSummary({
        openWorkflowQuestions,
        blockingWorkflowQuestions,
        advisoryWorkflowQuestions,
        missionId: missionArtifact?.id,
      }),
    ),
    createCheck(
      'accepted-must-policy-drift',
      openMustPolicyDriftCount > 0 ? 'fail' : 'pass',
      openMustPolicyDriftCount > 0
        ? `Accepted policy has ${openMustPolicyDriftCount} open must drift finding${openMustPolicyDriftCount === 1 ? '' : 's'}. Fix it or add an explicit local policy override before closure.`
        : 'No open accepted must policy drift is blocking closure.',
    ),
    createCheck(
      'required-workflows',
      failedWorkflowEvidence.length === 0 ? 'pass' : 'fail',
      failedWorkflowEvidence.length === 0
        ? impact.requiredWorkflows.length > 0
          ? 'Required registered workflows have fresh successful run evidence.'
          : 'No required registered workflows were inferred for this change.'
        : `Required workflows are missing fresh successful run evidence: ${failedWorkflowEvidence.map((entry) => entry.id).join(', ')}.`,
    ),
    createCheck(
      'mission-eval',
      !missionArtifact
        ? 'pass'
        : missionEval?.evaluationStatus === 'complete' &&
            missionEval.pendingItemIds.length === 0 &&
            missionEval.blockingQuestionIds.length === 0
          ? 'pass'
          : 'fail',
      buildMissionEvalSummary({
        missionArtifact,
        missionEval,
      }),
    ),
    createCheck(
      'mission-evidence',
      !missionArtifact
        ? 'pass'
        : missionArtifact.state === 'complete' && pendingMissionItems.length === 0
          ? 'pass'
          : 'fail',
      !missionArtifact
        ? 'No explicit mission evidence was requested for this closure check.'
        : missionArtifact.state === 'complete' && pendingMissionItems.length === 0
          ? `Mission ${missionArtifact.id} is complete with no pending execution items.`
          : `Mission ${missionArtifact.id} is not complete. Pending items: ${pendingMissionItems.map((item) => item.id).join(', ')}.`,
    ),
    createCheck(
      'mission-ownership',
      !missionArtifact
        ? 'pass'
        : !claimedByActorId
          ? 'pass'
          : !requestedActorId
            ? 'warn'
            : claimedByActorId === requestedActorId
              ? 'pass'
              : 'fail',
      !missionArtifact
        ? 'No explicit mission ownership evidence was requested for this closure check.'
        : !claimedByActorId
          ? `Mission ${missionArtifact.id} is currently unclaimed.`
          : !requestedActorId
            ? `Mission ${missionArtifact.id} is claimed by ${claimedByActorId}. Re-run with --actor ${claimedByActorId} to verify ownership before closure.`
            : claimedByActorId === requestedActorId
              ? `Mission ${missionArtifact.id} is claimed by the requested actor ${requestedActorId}.`
              : `Mission ${missionArtifact.id} is claimed by ${claimedByActorId}, not ${requestedActorId}.`,
    ),
  ];
  const requiredActions = [...impact.requiredActions];

  for (const question of openWorkflowQuestions) {
    requiredActions.push(
      `Resolve workflow question ${question.id} via \`skopos decide ${question.id} ${question.recommendedOptionId} ${workspaceRoot}${requestedActorId ? ` --actor ${requestedActorId}` : ''}\` before closure.`,
    );
  }

  if (missionArtifact && (missionArtifact.state !== 'complete' || pendingMissionItems.length > 0)) {
    requiredActions.push(
      `Complete mission ${missionArtifact.id} before claiming closure evidence.`,
    );
  }

  if (openMustPolicyDriftCount > 0) {
    requiredActions.push(
      'Fix open accepted `must` policy drift or add a clear local policy override, then run `skopos policies drift .` before closure.',
    );
  }

  if (missionArtifact && (!missionEval || missionEval.evaluationStatus !== 'complete')) {
    requiredActions.push(
      `Run \`skopos eval ${workspaceRoot} --mission ${missionArtifact.id}${requestedActorId ? ` --actor ${requestedActorId}` : claimedByActorId ? ` --actor ${claimedByActorId}` : ''}\` before closure.`,
    );
  }

  if (missionArtifact && claimedByActorId && !requestedActorId) {
    requiredActions.push(
      `Re-run \`skopos done --mission ${missionArtifact.id} --actor ${claimedByActorId}\` so closure can verify mission ownership.`,
    );
  }

  if (missionArtifact && claimedByActorId && requestedActorId && claimedByActorId !== requestedActorId) {
    requiredActions.push(
      `Mission ${missionArtifact.id} is claimed by ${claimedByActorId}. Transfer ownership or re-run closure as that actor before claiming completion.`,
    );
  }

  for (const entry of failedWorkflowEvidence) {
    requiredActions.push(
      `Run \`skopos workflows run ${entry.id}\` and refresh its outputs before closure.`,
    );
  }

  const failCount = checks.filter((check) => check.status === 'fail').length;
  const warnCount = checks.filter((check) => check.status === 'warn').length;
  const closureStatus = failCount > 0 ? 'blocked' : warnCount > 0 ? 'needs-review' : 'complete';

  return {
    workspaceRoot,
    closureStatus,
    summary: `Closure ${closureStatus} with ${checks.filter((check) => check.status === 'pass').length} passing checks, ${warnCount} warnings, and ${failCount} failures.`,
    checks,
    requiredActions,
    impact,
    trust,
    missionEvidence: missionArtifact
      ? {
          mission: {
            id: missionArtifact.id,
            title: missionArtifact.title,
            state: missionArtifact.state,
          },
          pendingItemIds: pendingMissionItems.map((item) => item.id),
          claimedByActorId,
          requestedActorId,
        }
      : undefined,
    workflowQuestions: {
      openQuestionIds: openWorkflowQuestions.map((entry) => entry.id),
      blockingQuestionIds: blockingWorkflowQuestions.map((entry) => entry.id),
      advisoryQuestionIds: advisoryWorkflowQuestions.map((entry) => entry.id),
    },
    missionEval: missionArtifact
      ? {
          missionId: missionArtifact.id,
          evalPath: missionEvalPath,
          evaluationStatus: missionEval?.evaluationStatus,
          blockingQuestionIds: missionEval?.blockingQuestionIds ?? [],
          pendingItemIds: missionEval?.pendingItemIds ?? [],
        }
      : undefined,
    workflowEvidence,
  };
};

const resolveActorId = (actor?: string): string | undefined => {
  const candidate = actor ?? process.env.SKOPOS_ACTOR;
  if (typeof candidate !== 'string') {
    return undefined;
  }

  const normalized = candidate.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const loadPolicyDriftReport = async (
  workspaceRoot: string,
): Promise<SkoposDriftReportArtifact | null> => {
  try {
    const contents = await readFile(join(workspaceRoot, '.skopos', 'drift', 'report.json'), 'utf8');
    return JSON.parse(contents) as SkoposDriftReportArtifact;
  } catch {
    return null;
  }
};

const createCheck = (
  id: string,
  status: SkoposTrustCheck['status'],
  summary: string,
): SkoposTrustCheck => ({
  id,
  status,
  summary,
});

const filterOpenWorkflowQuestions = ({
  artifact,
  missionId,
}: {
  artifact: SkoposWorkflowQuestionArtifact | null;
  missionId?: string;
}): SkoposWorkflowQuestionEntry[] => {
  if (!artifact) {
    return [];
  }

  return artifact.entries.filter((entry) => {
    if (entry.status !== 'open') {
      return false;
    }

    if (!missionId) {
      return true;
    }

    if (entry.linkedMissionId === missionId) {
      return true;
    }

    return !entry.linkedMissionId && artifact.generatedForMissionId === missionId;
  });
};

const buildWorkflowQuestionClosureSummary = ({
  openWorkflowQuestions,
  blockingWorkflowQuestions,
  advisoryWorkflowQuestions,
  missionId,
}: {
  openWorkflowQuestions: SkoposWorkflowQuestionEntry[];
  blockingWorkflowQuestions: SkoposWorkflowQuestionEntry[];
  advisoryWorkflowQuestions: SkoposWorkflowQuestionEntry[];
  missionId?: string;
}): string => {
  if (openWorkflowQuestions.length === 0) {
    return missionId
      ? `No open workflow questions remain for mission ${missionId}.`
      : 'No open workflow questions remain for this closure check.';
  }

  if (blockingWorkflowQuestions.length > 0) {
    return `Blocking workflow questions still need resolution before closure: ${blockingWorkflowQuestions.map((entry) => entry.id).join(', ')}.`;
  }

  return `Advisory workflow questions still need review before closure: ${advisoryWorkflowQuestions.map((entry) => entry.id).join(', ')}.`;
};

const buildMissionEvalSummary = ({
  missionArtifact,
  missionEval,
}: {
  missionArtifact: Awaited<ReturnType<typeof loadMissionArtifact>> | null;
  missionEval: SkoposEvalArtifact | null;
}): string => {
  if (!missionArtifact) {
    return 'No explicit mission eval evidence was requested for this closure check.';
  }

  if (!missionEval) {
    return `Mission ${missionArtifact.id} has no eval artifact yet. Run \`skopos eval\` before closure.`;
  }

  if (missionEval.evaluationStatus !== 'complete') {
    return `Mission ${missionArtifact.id} eval status is ${missionEval.evaluationStatus}. Pending eval items: ${missionEval.pendingItemIds.join(', ') || 'none'}.`;
  }

  if (missionEval.blockingQuestionIds.length > 0 || missionEval.pendingItemIds.length > 0) {
    return `Mission ${missionArtifact.id} eval artifact is not fully reconciled. Blocking questions: ${missionEval.blockingQuestionIds.join(', ') || 'none'}. Pending items: ${missionEval.pendingItemIds.join(', ') || 'none'}.`;
  }

  return `Mission ${missionArtifact.id} has complete eval-backed closure evidence.`;
};

interface BuildWorkflowEvidenceOptions {
  workspaceRoot: string;
  requiredWorkflows: Awaited<ReturnType<typeof buildSkoposImpactReport>>['requiredWorkflows'];
}

const buildWorkflowEvidence = async ({
  workspaceRoot,
  requiredWorkflows,
}: BuildWorkflowEvidenceOptions): Promise<SkoposWorkflowRequirementEvidence[]> => {
  if (requiredWorkflows.length === 0) {
    return [];
  }

  const runArtifacts = await loadWorkflowRunArtifacts(workspaceRoot);

  return Promise.all(
    requiredWorkflows.map(async (workflow) => {
      const latestSuccessfulRun = runArtifacts.find(
        (artifact) => artifact.workflowId === workflow.id && artifact.runStatus === 'succeeded',
      );

      if (!latestSuccessfulRun) {
        return {
          ...workflow,
          status: 'fail',
          summary: 'No successful workflow run evidence was found for this required workflow.',
        };
      }

      const latestChangedAt = await getLatestChangedAt(workspaceRoot, workflow.matchedPaths);
      const latestRunAt = Date.parse(
        latestSuccessfulRun.finishedAt ?? latestSuccessfulRun.updatedAt ?? '',
      );
      const outputsPresent = await Promise.all(
        workflow.outputPaths.map(async (outputPath) => {
          try {
            await access(resolve(workspaceRoot, outputPath));
            return true;
          } catch {
            return false;
          }
        }),
      );

      if (workflow.outputPaths.length > 0 && outputsPresent.includes(false)) {
        return {
          ...workflow,
          status: 'fail',
          summary:
            'The workflow ran successfully, but one or more declared outputs are missing from the workspace.',
          latestSuccessfulRunId: latestSuccessfulRun.id,
          latestSuccessfulRunAt: latestSuccessfulRun.finishedAt ?? latestSuccessfulRun.updatedAt,
          latestSuccessfulRunByActorId: latestSuccessfulRun.runByActorId,
        };
      }

      if (Number.isFinite(latestRunAt) && latestRunAt < latestChangedAt) {
        return {
          ...workflow,
          status: 'fail',
          summary:
            'The latest successful workflow run is older than the changed surfaces that require it.',
          latestSuccessfulRunId: latestSuccessfulRun.id,
          latestSuccessfulRunAt: latestSuccessfulRun.finishedAt ?? latestSuccessfulRun.updatedAt,
          latestSuccessfulRunByActorId: latestSuccessfulRun.runByActorId,
        };
      }

      return {
        ...workflow,
        status: 'pass',
        summary:
          'A fresh successful workflow run exists for the changed surfaces that require this workflow.',
        latestSuccessfulRunId: latestSuccessfulRun.id,
        latestSuccessfulRunAt: latestSuccessfulRun.finishedAt ?? latestSuccessfulRun.updatedAt,
        latestSuccessfulRunByActorId: latestSuccessfulRun.runByActorId,
      };
    }),
  );
};
