import { access, readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import { loadSkoposWorkflowManifests } from '@skopos/indexer';
import { buildSkoposTrustReport } from '@skopos/trust';
import type {
  SkoposEvalArtifact,
  SkoposEvalCheckRun,
  SkoposEvalProofEvidence,
  SkoposEvalRunResult,
  SkoposMissionArtifact,
  SkoposProofReportArtifact,
  SkoposWorkflowManifest,
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowRunArtifact,
  SkoposWorkflowRequirementEvidence,
} from '@skopos/model';

import { resolveMissionPath } from '../mission/mission.service.js';
import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { resolveCurrentMissionRuntime } from '../shared/current-mission.js';
import { refreshSkoposDiscussionLifecycleArtifacts } from '../shared/discussion-lifecycle.js';
import { executeSkoposShellCommand } from '../shared/execute-shell-command.js';
import {
  buildSkoposAgentEvalBrief,
  buildSkoposAgentMissionBrief,
  resolveAgentEvalBriefArtifactPath,
  resolveAgentMissionBriefArtifactPath,
  writeSkoposAgentBrief,
} from '../shared/agent-briefs.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import {
  buildWorkflowQuestionsSummary,
  buildWorkflowRecommendationsArtifact,
  filterWorkflowQuestionsForMission,
  getBlockingWorkflowQuestions,
  loadWorkflowQuestionsArtifact,
  loadWorkflowRecommendationsArtifact,
  QUESTIONS_ARTIFACT_PATH,
  RECOMMENDATIONS_ARTIFACT_PATH,
} from '../workflow-router/workflow-router-state.service.js';

export interface BuildSkoposEvalRuntimeOptions {
  cwd: string;
  mission?: string;
  actor?: string;
  dryRun?: boolean;
  checkTimeoutMs?: number;
}

const DEFAULT_EVAL_CHECK_TIMEOUT_MS = 120_000;

export const buildSkoposEvalRuntime = async ({
  cwd,
  mission,
  actor,
  dryRun = false,
  checkTimeoutMs = DEFAULT_EVAL_CHECK_TIMEOUT_MS,
}: BuildSkoposEvalRuntimeOptions): Promise<SkoposEvalRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireActorId(actor);
  const loadedQuestions = await loadOptionalWorkflowQuestionsArtifact(workspaceRoot);
  const loadedRecommendations = await loadOptionalWorkflowRecommendationsArtifact(workspaceRoot);
  const currentMission = await resolveCurrentMissionRuntime({
    workspaceRoot,
    mission,
    actorId,
    questions: loadedQuestions,
    recommendations: loadedRecommendations,
  });
  const questions = loadedQuestions
    ? filterWorkflowQuestionsForMission({
        artifact: loadedQuestions,
        missionId: currentMission.id,
      })
    : buildEmptyWorkflowQuestionsArtifact({
        workspaceRoot,
        mission: currentMission,
      });
  const blockingQuestions = getBlockingWorkflowQuestions(questions);
  const evaluationAllowed = isMissionEvaluationAllowed({
    mission: currentMission,
    questions,
  });
  const checkRuns = evaluationAllowed
    ? await runMissionChecks({
        workspaceRoot,
        mission: currentMission,
        dryRun,
        checkTimeoutMs,
      })
    : buildSkippedCheckRuns({
        mission: currentMission,
        reason:
          'Evaluation is blocked until the active mission is claimed and all blocking workflow questions are resolved.',
      });
  const workflows = await loadSkoposWorkflowManifests({
    cwd: workspaceRoot,
  });
  const workflowEvidence = await buildMissionWorkflowEvidence({
    workspaceRoot,
    mission: currentMission,
    workflows,
  });
  const proof = await buildProofEvidence({
    workspaceRoot,
  });
  const proofRequiredForDone = await resolveRequireProofForDone({
    workspaceRoot,
    workflows,
  });
  const trustReport = await buildSkoposTrustReport({
    cwd: workspaceRoot,
    ignoreMissionEvalForMissionId: currentMission.id,
  });
  const evaluationStatus = deriveEvaluationStatus({
    evaluationAllowed,
    blockingQuestions,
    checkRuns,
    workflowEvidence,
    proof,
    proofRequiredForDone,
    trustLevel: trustReport.trustLevel,
  });
  const evaluatedAt = new Date().toISOString();
  const updatedMission = buildUpdatedMission({
    mission: currentMission,
    questions,
    actorId,
    updatedAt: evaluatedAt,
    checkRuns,
    workflowEvidence,
    evaluationStatus,
  });
  const recommendations = buildWorkflowRecommendationsArtifact({
    workspaceRoot,
    actorId,
    planId: updatedMission.planId,
    mission: updatedMission,
    questions,
  });
  const recommendedAction = recommendations.entries.find((entry) => entry.status === 'open');
  const pendingItemIds = updatedMission.items
    .filter((item) => item.status !== 'complete')
    .map((item) => item.id);
  const summary = buildSummary({
    mission: updatedMission,
    evaluationStatus,
    checkRuns,
    workflowEvidence,
    proof,
    proofRequiredForDone,
  });
  const missionPath = resolveMissionPath(workspaceRoot, updatedMission.id);
  const evalArtifact = buildEvalArtifact({
    workspaceRoot,
    actorId,
    mission: updatedMission,
    missionPath,
    questions,
    blockingQuestions,
    checkRuns,
    workflowEvidence,
    proof,
    trustReport,
    evaluationStatus,
    pendingItemIds,
    summary,
    generatedAt: evaluatedAt,
  });
  const missionWrite = await writeJsonArtifact({
    artifactPath: missionPath,
    artifact: updatedMission,
    dryRun,
  });
  const evalPath = join(workspaceRoot, '.skopos', 'evals', `${updatedMission.id}.json`);
  const evalWrite = await writeJsonArtifact({
    artifactPath: evalPath,
    artifact: evalArtifact,
    dryRun,
  });
  const recommendationsPath = join(workspaceRoot, RECOMMENDATIONS_ARTIFACT_PATH);
  const recommendationsWrite = await writeJsonArtifact({
    artifactPath: recommendationsPath,
    artifact: recommendations,
    dryRun,
  });
  await writeSkoposAgentBrief({
    artifactPath: resolveAgentEvalBriefArtifactPath(workspaceRoot, updatedMission.id),
    artifact: buildSkoposAgentEvalBrief({
      workspaceRoot,
      result: {
        summary,
        eval: evalArtifact,
        nextCommand: recommendedAction?.command,
      },
    }),
    dryRun,
  });
  await writeSkoposAgentBrief({
    artifactPath: resolveAgentMissionBriefArtifactPath(workspaceRoot, updatedMission.id),
    artifact: buildSkoposAgentMissionBrief({
      workspaceRoot,
      mission: updatedMission,
      questions,
      recommendations,
      codeAllowed: evaluationAllowed,
    }),
    dryRun,
  });
  await refreshSkoposDiscussionLifecycleArtifacts({
    workspaceRoot,
    dryRun,
    checkpointTrigger: 'workflow-eval',
  });

  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'eval',
    status: dryRun ? 'dry-run' : evaluationStatus === 'blocked' ? 'failed' : 'succeeded',
    summary,
    relatedArtifactPaths: [missionPath, evalPath, recommendationsPath],
    metadata: {
      actorId,
      missionId: updatedMission.id,
      planId: updatedMission.planId,
      evaluationStatus,
      codeAllowed: evaluationAllowed,
      blockingQuestionCount: blockingQuestions.length,
      checkPassCount: checkRuns.filter((entry) => entry.status === 'pass').length,
      checkFailCount: checkRuns.filter((entry) => entry.status === 'fail').length,
      workflowFailCount: workflowEvidence.filter((entry) => entry.status === 'fail').length,
      proofStatus: proof.status,
      trustLevel: trustReport.trustLevel,
      readiness: trustReport.readiness,
    },
    dryRun,
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
    dryRun,
  });

  return {
    workspaceRoot,
    actorId,
    summary,
    missionId: updatedMission.id,
    missionPath,
    missionWrite,
    mission: updatedMission,
    evalPath,
    evalWrite,
    eval: evalArtifact,
    questionsPath: join(workspaceRoot, QUESTIONS_ARTIFACT_PATH),
    questions,
    blockingQuestions,
    recommendationsPath,
    recommendationsWrite,
    executionSurface: recommendations.executionSurface,
    recommendations,
    recommendedAction,
    nextCommand: recommendedAction?.command,
  };
};

const buildEvalArtifact = ({
  workspaceRoot,
  actorId,
  mission,
  missionPath,
  questions,
  blockingQuestions,
  checkRuns,
  workflowEvidence,
  proof,
  trustReport,
  evaluationStatus,
  pendingItemIds,
  summary,
  generatedAt,
}: {
  workspaceRoot: string;
  actorId: string;
  mission: SkoposMissionArtifact;
  missionPath: string;
  questions: SkoposWorkflowQuestionArtifact;
  blockingQuestions: Array<{ id: string }>;
  checkRuns: SkoposEvalCheckRun[];
  workflowEvidence: SkoposWorkflowRequirementEvidence[];
  proof: SkoposEvalProofEvidence;
  trustReport: Awaited<ReturnType<typeof buildSkoposTrustReport>>;
  evaluationStatus: SkoposEvalArtifact['evaluationStatus'];
  pendingItemIds: string[];
  summary: string;
  generatedAt: string;
}): SkoposEvalArtifact => ({
  schemaVersion: 1,
  id: `eval-${mission.id}`,
  type: 'eval',
  status: 'generated',
  authority: 'generated',
  summary,
  updatedAt: generatedAt,
  generatedAt,
  workspaceRoot,
  actorId,
  missionId: mission.id,
  missionTitle: mission.title,
  missionPath: relative(workspaceRoot, missionPath),
  planId: mission.planId,
  codeAllowed: isMissionEvaluationAllowed({
    mission,
    questions,
  }),
  evaluationStatus,
  blockingQuestionIds: blockingQuestions.map((entry) => entry.id),
  pendingItemIds,
  checkRuns,
  workflowEvidence,
  proof,
  trust: {
    trustLevel: trustReport.trustLevel,
    readiness: trustReport.readiness,
    summary: trustReport.summary,
    checks: trustReport.checks,
  },
});

const isMissionEvaluationAllowed = ({
  mission,
  questions,
}: {
  mission: SkoposMissionArtifact;
  questions: SkoposWorkflowQuestionArtifact;
}): boolean =>
  questions.entries.every((entry) => !entry.blocking || entry.status === 'resolved') &&
  Boolean(mission.coordination.claimedBy?.actorId);

const buildUpdatedMission = ({
  mission,
  questions,
  actorId,
  updatedAt,
  checkRuns,
  workflowEvidence,
  evaluationStatus,
}: {
  mission: SkoposMissionArtifact;
  questions: SkoposWorkflowQuestionArtifact;
  actorId: string;
  updatedAt: string;
  checkRuns: SkoposEvalCheckRun[];
  workflowEvidence: SkoposWorkflowRequirementEvidence[];
  evaluationStatus: SkoposEvalArtifact['evaluationStatus'];
}): SkoposMissionArtifact => {
  const checksPassed = checkRuns.every(
    (entry) => entry.status !== 'fail' && entry.status !== 'timed-out',
  );
  const workflowsPassed = workflowEvidence.every((entry) => entry.status === 'pass');
  const workflowPassIds = new Set(
    workflowEvidence.filter((entry) => entry.status === 'pass').map((entry) => entry.id),
  );
  const hasExecutedChecks = checkRuns.some((entry) => entry.status !== 'skipped');

  return {
    ...mission,
    updatedAt,
    items: mission.items.map((item) => {
      if (item.kind === 'decision' && isDecisionItemResolved({ itemId: item.id, questions })) {
        return {
          ...item,
          status: 'complete',
        };
      }

      if (
        hasExecutedChecks &&
        (item.id === 'step-review-current-pattern' ||
          item.id === 'step-implement-scoped-change' ||
          item.id === 'step-sync-knowledge')
      ) {
        return {
          ...item,
          status: 'complete',
        };
      }

      if (item.id === 'step-run-checks') {
        return {
          ...item,
          status: checksPassed ? 'complete' : 'pending',
        };
      }

      if (item.id === 'step-run-workflows') {
        return {
          ...item,
          status: workflowsPassed ? 'complete' : 'pending',
        };
      }

      if (item.kind === 'workflow' && item.id.startsWith('workflow-')) {
        return {
          ...item,
          status: workflowPassIds.has(item.id.slice('workflow-'.length)) ? 'complete' : 'pending',
        };
      }

      if (
        evaluationStatus === 'complete' &&
        item.kind !== 'decision' &&
        item.status !== 'complete'
      ) {
        return {
          ...item,
          status: 'complete',
        };
      }

      return item;
    }),
    coordination: {
      ...mission.coordination,
      lastUpdatedBy: actorId,
      lastUpdatedAt: updatedAt,
    },
  };
};

const isDecisionItemResolved = ({
  itemId,
  questions,
}: {
  itemId: string;
  questions: SkoposWorkflowQuestionArtifact;
}): boolean => {
  if (!itemId.startsWith('decision-')) {
    return false;
  }

  const questionId = itemId.slice('decision-'.length);
  const linkedQuestion = questions.entries.find((entry) => entry.id === questionId);

  return !linkedQuestion || linkedQuestion.status === 'resolved';
};

const deriveEvaluationStatus = ({
  evaluationAllowed,
  blockingQuestions,
  checkRuns,
  workflowEvidence,
  proof,
  proofRequiredForDone,
  trustLevel,
}: {
  evaluationAllowed: boolean;
  blockingQuestions: Array<{ id: string }>;
  checkRuns: SkoposEvalCheckRun[];
  workflowEvidence: SkoposWorkflowRequirementEvidence[];
  proof: SkoposEvalProofEvidence;
  proofRequiredForDone: boolean;
  trustLevel: 'high' | 'medium' | 'low';
}): SkoposEvalArtifact['evaluationStatus'] => {
  if (!evaluationAllowed || blockingQuestions.length > 0) {
    return 'blocked';
  }

  if (checkRuns.some((entry) => entry.status === 'fail')) {
    return 'blocked';
  }

  if (checkRuns.some((entry) => entry.status === 'timed-out')) {
    return 'needs-review';
  }

  if (proof.status === 'fail' || trustLevel === 'low') {
    return 'blocked';
  }

  if (
    workflowEvidence.some((entry) => entry.status === 'fail') ||
    (proofRequiredForDone && proof.status === 'missing')
  ) {
    return 'needs-review';
  }

  return 'complete';
};

const buildSummary = ({
  mission,
  evaluationStatus,
  checkRuns,
  workflowEvidence,
  proof,
  proofRequiredForDone,
}: {
  mission: SkoposMissionArtifact;
  evaluationStatus: SkoposEvalArtifact['evaluationStatus'];
  checkRuns: SkoposEvalCheckRun[];
  workflowEvidence: SkoposWorkflowRequirementEvidence[];
  proof: SkoposEvalProofEvidence;
  proofRequiredForDone: boolean;
}): string => {
  const passingChecks = checkRuns.filter((entry) => entry.status === 'pass').length;
  const failedChecks = checkRuns.filter((entry) => entry.status === 'fail').length;
  const timedOutChecks = checkRuns.filter((entry) => entry.status === 'timed-out').length;
  const failedWorkflowEvidence = workflowEvidence.filter((entry) => entry.status === 'fail').length;
  const proofSummary =
    proof.status === 'missing' && !proofRequiredForDone ? 'optional-proof missing' : `proof ${proof.status}`;

  return `Eval ${evaluationStatus} for ${mission.id} with ${passingChecks} passing checks, ${failedChecks} failed checks, ${timedOutChecks} timed-out checks, ${failedWorkflowEvidence} workflow evidence gaps, and ${proofSummary}.`;
};

const runMissionChecks = async ({
  workspaceRoot,
  mission,
  dryRun,
  checkTimeoutMs,
}: {
  workspaceRoot: string;
  mission: SkoposMissionArtifact;
  dryRun: boolean;
  checkTimeoutMs: number;
}): Promise<SkoposEvalCheckRun[]> => {
  const runs: SkoposEvalCheckRun[] = [];

  for (const command of mission.recommendedChecks) {
    if (dryRun) {
      runs.push({
        command,
        status: 'skipped',
        summary: 'Check execution skipped because eval ran in dry-run mode.',
        exitCode: null,
      });
      continue;
    }

    const execution = await executeSkoposShellCommand({
      command,
      cwd: workspaceRoot,
      timeoutMs: checkTimeoutMs,
    });
    runs.push({
      command,
      status: execution.timedOut ? 'timed-out' : execution.exitCode === 0 ? 'pass' : 'fail',
      summary:
        execution.timedOut
          ? `Validation command exceeded the ${formatTimeout(checkTimeoutMs)} eval timeout. Record partial proof and rerun this command directly or with a larger --check-timeout-ms value.`
          : execution.exitCode === 0
          ? 'Validation command completed successfully.'
          : `Validation command failed with exit code ${execution.exitCode}.`,
      exitCode: execution.exitCode,
      timeoutMs: execution.timeoutMs,
      startedAt: execution.startedAt,
      finishedAt: execution.finishedAt,
      stdoutExcerpt: execution.stdoutExcerpt,
      stderrExcerpt: execution.stderrExcerpt,
    });
  }

  return runs;
};

const formatTimeout = (timeoutMs: number): string => {
  if (timeoutMs >= 60_000 && timeoutMs % 60_000 === 0) {
    return `${timeoutMs / 60_000} minute${timeoutMs === 60_000 ? '' : 's'}`;
  }

  if (timeoutMs >= 1000 && timeoutMs % 1000 === 0) {
    return `${timeoutMs / 1000} second${timeoutMs === 1000 ? '' : 's'}`;
  }

  return `${timeoutMs}ms`;
};

const buildSkippedCheckRuns = ({
  mission,
  reason,
}: {
  mission: SkoposMissionArtifact;
  reason: string;
}): SkoposEvalCheckRun[] =>
  mission.recommendedChecks.map((command) => ({
    command,
    status: 'skipped',
    summary: reason,
    exitCode: null,
  }));

const buildMissionWorkflowEvidence = async ({
  workspaceRoot,
  mission,
  workflows,
}: {
  workspaceRoot: string;
  mission: SkoposMissionArtifact;
  workflows: SkoposWorkflowManifest[];
}): Promise<SkoposWorkflowRequirementEvidence[]> => {
  if (mission.recommendedWorkflowIds.length === 0) {
    return [];
  }

  const runArtifacts = await loadWorkflowRunArtifacts(workspaceRoot);

  return Promise.all(
    mission.recommendedWorkflowIds.map(async (workflowId) => {
      const workflow = workflows.find((entry) => entry.id === workflowId);
      if (!workflow) {
        return {
          id: workflowId,
          title: workflowId,
          category: 'maintenance',
          safety: 'read-only',
          sourcePath: `.skopos/workflows/${workflowId}.yaml`,
          reason: 'Recommended workflow recorded on the active mission.',
          matchedPaths: [],
          outputPaths: [],
          requiredForDone: true,
          requiresApproval: false,
          status: 'fail',
          summary: 'The mission references a workflow id that is not currently registered.',
        } satisfies SkoposWorkflowRequirementEvidence;
      }

      const baseEvidence = {
        id: workflow.id,
        title: workflow.title,
        category: workflow.category,
        safety: workflow.safety,
        sourcePath: workflow.sourcePath,
        reason: 'Recommended workflow recorded on the active mission.',
        matchedPaths: workflow.affects,
        outputPaths: workflow.outputs.map((outputPath) =>
          relative(workspaceRoot, resolve(workspaceRoot, workflow.cwd, outputPath)),
        ),
        requiredForDone: workflow.requiredForDone,
        requiresApproval: workflow.requiresApproval,
      };
      const latestSuccessfulRun = runArtifacts.find(
        (artifact) => artifact.workflowId === workflow.id && artifact.runStatus === 'succeeded',
      );

      if (!latestSuccessfulRun) {
        return {
          ...baseEvidence,
          status: 'fail',
          summary: 'No successful workflow run evidence was found for this mission workflow.',
        } satisfies SkoposWorkflowRequirementEvidence;
      }

      const outputsPresent = await Promise.all(
        baseEvidence.outputPaths.map(async (outputPath) => {
          try {
            await access(resolve(workspaceRoot, outputPath));
            return true;
          } catch {
            return false;
          }
        }),
      );

      if (baseEvidence.outputPaths.length > 0 && outputsPresent.includes(false)) {
        return {
          ...baseEvidence,
          status: 'fail',
          summary:
            'The workflow has successful run evidence, but one or more declared outputs are missing.',
          latestSuccessfulRunId: latestSuccessfulRun.id,
          latestSuccessfulRunAt: latestSuccessfulRun.finishedAt ?? latestSuccessfulRun.updatedAt,
          latestSuccessfulRunByActorId: latestSuccessfulRun.runByActorId,
        } satisfies SkoposWorkflowRequirementEvidence;
      }

      return {
        ...baseEvidence,
        status: 'pass',
        summary: 'A successful workflow run exists for this mission workflow.',
        latestSuccessfulRunId: latestSuccessfulRun.id,
        latestSuccessfulRunAt: latestSuccessfulRun.finishedAt ?? latestSuccessfulRun.updatedAt,
        latestSuccessfulRunByActorId: latestSuccessfulRun.runByActorId,
      } satisfies SkoposWorkflowRequirementEvidence;
    }),
  );
};

const resolveRequireProofForDone = async ({
  workspaceRoot,
  workflows,
}: {
  workspaceRoot: string;
  workflows: SkoposWorkflowManifest[];
}): Promise<boolean> => {
  const config = await loadSkoposConfig(join(workspaceRoot, 'skopos.config.yaml'));
  if (!config?.trust.requireProofForDone) {
    return false;
  }

  return hasRegisteredProofWorkflow(workflows);
};

const hasRegisteredProofWorkflow = (workflows: SkoposWorkflowManifest[]): boolean =>
  workflows.some(
    (workflow) =>
      workflow.id.includes('proof') ||
      workflow.command.includes('proof') ||
      workflow.outputs.some((outputPath) => outputPath.includes('.skopos/proof')),
  );

const buildProofEvidence = async ({
  workspaceRoot,
}: {
  workspaceRoot: string;
}): Promise<SkoposEvalProofEvidence> => {
  const proofPath = join(workspaceRoot, '.skopos', 'proof', 'latest-report.json');

  try {
    const proof = JSON.parse(await readFile(proofPath, 'utf8')) as SkoposProofReportArtifact;
    const passed = proof.scorecard.status === 'pass' && proof.comparison.status === 'pass';

    return {
      path: relative(workspaceRoot, proofPath),
      status: passed ? 'pass' : 'fail',
      summary: passed
        ? 'Latest proof scorecard matches its committed baseline.'
        : 'Latest proof scorecard or baseline comparison is failing.',
      updatedAt: proof.updatedAt,
      scorecardStatus: proof.scorecard.status,
      comparisonStatus: proof.comparison.status,
      weightedPassRate: proof.scorecard.weightedPassRate,
      regressedBenchmarkCount: proof.comparison.regressedBenchmarks.length,
      regressedCategoryCount: proof.comparison.regressedCategories.length,
    };
  } catch {
    return {
      path: relative(workspaceRoot, proofPath),
      status: 'missing',
      summary: 'No proof report is currently available for mission evaluation.',
    };
  }
};

const loadWorkflowRunArtifacts = async (
  workspaceRoot: string,
): Promise<SkoposWorkflowRunArtifact[]> => {
  const runsRoot = join(workspaceRoot, '.skopos', 'runs');

  try {
    const entries = await readdir(runsRoot);
    const artifacts = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map(async (entry) => {
          const artifactPath = join(runsRoot, entry);
          return JSON.parse(await readFile(artifactPath, 'utf8')) as SkoposWorkflowRunArtifact;
        }),
    );

    return artifacts.sort((left, right) => {
      const leftTime = Date.parse(left.finishedAt ?? left.updatedAt ?? left.generatedAt ?? '');
      const rightTime = Date.parse(right.finishedAt ?? right.updatedAt ?? right.generatedAt ?? '');
      return rightTime - leftTime;
    });
  } catch {
    return [];
  }
};

const loadOptionalWorkflowQuestionsArtifact = async (
  workspaceRoot: string,
): Promise<SkoposWorkflowQuestionArtifact | undefined> => {
  try {
    return await loadWorkflowQuestionsArtifact(workspaceRoot);
  } catch {
    return undefined;
  }
};

const loadOptionalWorkflowRecommendationsArtifact = async (
  workspaceRoot: string,
): Promise<{ generatedForMissionId?: string } | undefined> => {
  try {
    return await loadWorkflowRecommendationsArtifact(workspaceRoot);
  } catch {
    return undefined;
  }
};

const buildEmptyWorkflowQuestionsArtifact = ({
  workspaceRoot,
  mission,
}: {
  workspaceRoot: string;
  mission: SkoposMissionArtifact;
}): SkoposWorkflowQuestionArtifact => ({
  schemaVersion: 1,
  id: 'questions',
  type: 'questions',
  status: 'generated',
  authority: 'generated',
  summary: buildWorkflowQuestionsSummary({
    totalCount: 0,
    openCount: 0,
  }),
  updatedAt: mission.updatedAt,
  generatedAt: mission.generatedAt ?? mission.updatedAt,
  workspaceRoot,
  generatedForPlanId: mission.planId,
  generatedForMissionId: mission.id,
  entries: [],
});

const requireActorId = (actor?: string): string => {
  const candidate = actor ?? process.env.SKOPOS_ACTOR;
  if (typeof candidate !== 'string') {
    throw new Error('Missing workflow actor id. Pass --actor <id> or set SKOPOS_ACTOR.');
  }

  const normalized = candidate.trim();
  if (normalized.length === 0) {
    throw new Error('Missing workflow actor id. Pass --actor <id> or set SKOPOS_ACTOR.');
  }

  return normalized;
};
