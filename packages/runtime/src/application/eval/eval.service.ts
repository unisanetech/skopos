import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import { loadSkoposWorkflowManifests } from '@skopos/indexer';
import {
  buildSkoposImpactReport,
  buildSkoposTrustReport,
  validateSkoposWorkflowReceipt,
} from '@skopos/trust';
import type {
  SkoposEvalArtifact,
  SkoposEvalCheckRun,
  SkoposEvalExecutionPhase,
  SkoposEvalProofEvidence,
  SkoposEvalRunResult,
  SkoposMissionArtifact,
  SkoposProofReportArtifact,
  SkoposWorkflowManifest,
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowRunArtifact,
  SkoposWorkflowRequirementEvidence,
} from '@skopos/model';

import {
  selectSkoposEvalCheckCommands,
  selectSkoposEvalWorkflowIds,
} from '../agent-native/phase-execution.js';
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
} from '../workflow-router/workflow-router-state.service.js';
import {
  loadWorkflowQuestionsForMission,
  resolveMissionTaskIdentity,
  writeWorkflowQuestionsState,
  writeWorkflowRecommendationsState,
} from '../workflow-router/workflow-router-task-state.service.js';

export interface BuildSkoposEvalRuntimeOptions {
  cwd: string;
  mission?: string;
  actor?: string;
  dryRun?: boolean;
  checkTimeoutMs?: number;
  executionPhase?: SkoposEvalExecutionPhase;
}

const DEFAULT_EVAL_CHECK_TIMEOUT_MS = 120_000;

export const buildSkoposEvalRuntime = async ({
  cwd,
  mission,
  actor,
  dryRun = false,
  checkTimeoutMs = DEFAULT_EVAL_CHECK_TIMEOUT_MS,
  executionPhase = 'closure',
}: BuildSkoposEvalRuntimeOptions): Promise<SkoposEvalRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireActorId(actor);
  const resolvedMission = await resolveCurrentMissionRuntime({
    workspaceRoot,
    mission,
    actorId,
  });
  const taskIdentity = await resolveMissionTaskIdentity({
    workspaceRoot,
    mission: resolvedMission,
    actorId,
  });
  const currentMission = { ...resolvedMission, taskIdentity };
  const loadedQuestions = await loadWorkflowQuestionsForMission({
    workspaceRoot,
    mission: currentMission,
    actorId,
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
  const workflows = await loadSkoposWorkflowManifests({
    cwd: workspaceRoot,
  });
  const changedScopeImpact =
    executionPhase === 'iteration'
      ? await buildSkoposImpactReport({
          cwd: workspaceRoot,
        })
      : undefined;
  const changedPaths = changedScopeImpact?.changedPaths ?? [];
  const selectedCheckCommands = selectSkoposEvalCheckCommands({
    executionPhase,
    missionChecks: currentMission.recommendedChecks,
    changedScopeChecks: changedScopeImpact?.recommendedChecks,
  });
  const selectedWorkflowIds = selectSkoposEvalWorkflowIds({
    executionPhase,
    missionWorkflowIds: currentMission.recommendedWorkflowIds,
    workflows,
  });
  const checkRuns = evaluationAllowed
    ? await runMissionChecks({
        workspaceRoot,
        commands: selectedCheckCommands,
        executionPhase,
        dryRun,
        checkTimeoutMs,
      })
    : buildSkippedCheckRuns({
        commands: selectedCheckCommands,
        executionPhase,
        reason:
          'Evaluation is blocked until the active mission is claimed and all blocking workflow questions are resolved.',
      });
  const workflowEvidence = await buildMissionWorkflowEvidence({
    workspaceRoot,
    workflowIds: selectedWorkflowIds,
    workflows,
  });
  const proof =
    executionPhase === 'closure'
      ? await buildProofEvidence({
          workspaceRoot,
        })
      : buildPhaseDeferredProofEvidence({
          workspaceRoot,
          executionPhase,
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
    executionPhase,
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
    executionPhase,
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
    taskIdentity,
  });
  const recommendedAction = recommendations.entries.find((entry) => entry.status === 'open');
  const pendingItemIds = updatedMission.items
    .filter((item) => item.status !== 'complete')
    .map((item) => item.id);
  const summary = buildSummary({
    mission: updatedMission,
    evaluationStatus,
    executionPhase,
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
    executionPhase,
    changedPaths,
    selectedCheckCommands,
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
  const questionsState = await writeWorkflowQuestionsState({
    workspaceRoot,
    artifact: { ...questions, taskIdentity },
    dryRun,
  });
  const recommendationsState = await writeWorkflowRecommendationsState({
    workspaceRoot,
    artifact: recommendations,
    dryRun,
  });
  const recommendationsPath = recommendationsState.compatibilityPath;
  const recommendationsWrite = recommendationsState.write;
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
    relatedArtifactPaths: [
      missionPath,
      evalPath,
      questionsState.authorityPath,
      questionsState.compatibilityPath,
      recommendationsState.authorityPath,
      recommendationsPath,
    ],
    metadata: {
      actorId,
      missionId: updatedMission.id,
      planId: updatedMission.planId,
      evaluationStatus,
      executionPhase,
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
    taskState: {
      authorityDirectory: dirname(questionsState.authorityPath),
      questionsPath: questionsState.authorityPath,
      recommendationsPath: recommendationsState.authorityPath,
      compatibilityQuestionsPath: questionsState.compatibilityPath,
      compatibilityRecommendationsPath: recommendationsState.compatibilityPath,
    },
    missionId: updatedMission.id,
    missionPath,
    missionWrite,
    mission: updatedMission,
    evalPath,
    evalWrite,
    eval: evalArtifact,
    questionsPath: questionsState.compatibilityPath,
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
  executionPhase,
  changedPaths,
  selectedCheckCommands,
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
  executionPhase: SkoposEvalExecutionPhase;
  changedPaths: string[];
  selectedCheckCommands: string[];
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
  taskIdentity: mission.taskIdentity,
  actorId,
  missionId: mission.id,
  missionTitle: mission.title,
  missionPath: relative(workspaceRoot, missionPath),
  planId: mission.planId,
  codeAllowed: isMissionEvaluationAllowed({
    mission,
    questions,
  }),
  executionPhase,
  changedPaths,
  selectedCheckCommands,
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
  executionPhase,
  checkRuns,
  workflowEvidence,
  evaluationStatus,
}: {
  mission: SkoposMissionArtifact;
  questions: SkoposWorkflowQuestionArtifact;
  actorId: string;
  updatedAt: string;
  executionPhase: SkoposEvalExecutionPhase;
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

      if (executionPhase === 'iteration') {
        return item;
      }

      if (executionPhase === 'stabilization') {
        if (item.id === 'step-run-workflows' && workflowEvidence.length > 0) {
          return {
            ...item,
            status: workflowsPassed ? 'complete' : 'pending',
          };
        }

        if (item.kind === 'workflow' && item.id.startsWith('workflow-')) {
          return {
            ...item,
            status: workflowPassIds.has(item.id.slice('workflow-'.length))
              ? 'complete'
              : item.status,
          };
        }

        return item;
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
  executionPhase,
  blockingQuestions,
  checkRuns,
  workflowEvidence,
  proof,
  proofRequiredForDone,
  trustLevel,
}: {
  evaluationAllowed: boolean;
  executionPhase: SkoposEvalExecutionPhase;
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

  if (trustLevel === 'low') {
    return 'blocked';
  }

  if (workflowEvidence.some((entry) => entry.status === 'fail')) {
    return 'needs-review';
  }

  if (executionPhase === 'closure') {
    if (proof.status === 'fail') {
      return 'blocked';
    }

    if (proofRequiredForDone && proof.status === 'missing') {
      return 'needs-review';
    }
  }

  return 'complete';
};

const buildSummary = ({
  mission,
  evaluationStatus,
  executionPhase,
  checkRuns,
  workflowEvidence,
  proof,
  proofRequiredForDone,
}: {
  mission: SkoposMissionArtifact;
  evaluationStatus: SkoposEvalArtifact['evaluationStatus'];
  executionPhase: SkoposEvalExecutionPhase;
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
  const phaseLabel = executionPhase === 'closure' ? 'Eval' : `Eval ${executionPhase}`;

  return `${phaseLabel} ${evaluationStatus} for ${mission.id} with ${passingChecks} passing checks, ${failedChecks} failed checks, ${timedOutChecks} timed-out checks, ${failedWorkflowEvidence} workflow evidence gaps, and ${proofSummary}.`;
};

const runMissionChecks = async ({
  workspaceRoot,
  commands,
  executionPhase,
  dryRun,
  checkTimeoutMs,
}: {
  workspaceRoot: string;
  commands: string[];
  executionPhase: SkoposEvalExecutionPhase;
  dryRun: boolean;
  checkTimeoutMs: number;
}): Promise<SkoposEvalCheckRun[]> => {
  const runs: SkoposEvalCheckRun[] = [];

  for (const command of commands) {
    if (dryRun) {
      runs.push({
        command,
        executionPhase,
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
      executionPhase,
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
  commands,
  executionPhase,
  reason,
}: {
  commands: string[];
  executionPhase: SkoposEvalExecutionPhase;
  reason: string;
}): SkoposEvalCheckRun[] =>
  commands.map((command) => ({
    command,
    executionPhase,
    status: 'skipped',
    summary: reason,
    exitCode: null,
  }));

const buildMissionWorkflowEvidence = async ({
  workspaceRoot,
  workflowIds,
  workflows,
}: {
  workspaceRoot: string;
  workflowIds: string[];
  workflows: SkoposWorkflowManifest[];
}): Promise<SkoposWorkflowRequirementEvidence[]> => {
  if (workflowIds.length === 0) {
    return [];
  }

  const runArtifacts = await loadWorkflowRunArtifacts(workspaceRoot);

  return Promise.all(
    workflowIds.map(async (workflowId) => {
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

      const receiptValidation = await validateSkoposWorkflowReceipt({
        workspaceRoot,
        manifest: workflow,
        artifact: latestSuccessfulRun,
      });
      if (receiptValidation.status === 'stale') {
        return {
          ...baseEvidence,
          status: 'fail',
          summary: receiptValidation.summary,
          receiptStatus: receiptValidation.status,
          receiptExecutionKey: latestSuccessfulRun.receipt?.executionKey,
          receiptSourceDigest: latestSuccessfulRun.receipt?.sourceState.digest,
          latestSuccessfulRunId: latestSuccessfulRun.id,
          latestSuccessfulRunAt: latestSuccessfulRun.finishedAt ?? latestSuccessfulRun.updatedAt,
          latestSuccessfulRunByActorId: latestSuccessfulRun.runByActorId,
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
          receiptStatus: receiptValidation.status,
          receiptExecutionKey: latestSuccessfulRun.receipt?.executionKey,
          receiptSourceDigest: latestSuccessfulRun.receipt?.sourceState.digest,
          latestSuccessfulRunId: latestSuccessfulRun.id,
          latestSuccessfulRunAt: latestSuccessfulRun.finishedAt ?? latestSuccessfulRun.updatedAt,
          latestSuccessfulRunByActorId: latestSuccessfulRun.runByActorId,
        } satisfies SkoposWorkflowRequirementEvidence;
      }

      return {
        ...baseEvidence,
        status: 'pass',
        summary:
          receiptValidation.status === 'valid'
            ? 'A valid source-bound workflow receipt exists for this mission workflow.'
            : 'A legacy successful workflow run exists; source-bound reuse requires a new receipt.',
        receiptStatus: receiptValidation.status,
        receiptExecutionKey: latestSuccessfulRun.receipt?.executionKey,
        receiptSourceDigest: latestSuccessfulRun.receipt?.sourceState.digest,
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

const buildPhaseDeferredProofEvidence = ({
  workspaceRoot,
  executionPhase,
}: {
  workspaceRoot: string;
  executionPhase: Exclude<SkoposEvalExecutionPhase, 'closure'>;
}): SkoposEvalProofEvidence => ({
  path: relative(workspaceRoot, join(workspaceRoot, '.skopos', 'proof', 'latest-report.json')),
  status: 'not-required',
  summary: `Final proof is not required during ${executionPhase}; closure remains the only final proof phase.`,
});

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
  taskIdentity: mission.taskIdentity,
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
