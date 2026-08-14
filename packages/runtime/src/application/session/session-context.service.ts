import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import {
  SKOPOS_COMMUNICATION_CONTRACT,
  SKOPOS_COMMUNICATION_CONTRACT_VERSION,
  resolveSkoposCommunicationResponseModeRules,
  resolveDecisionDefaultBehavior,
} from '@skopos/instructions';
import type {
  SkoposAgentResponseMode,
  SkoposActionRunArtifact,
  SkoposSessionContextRunResult,
  SkoposSessionPendingDecision,
  SkoposTaskQuestionArtifact,
  SkoposTaskQuestion,
  SkoposSetupStateArtifact,
} from '@skopos/model';

import { buildSkoposDiscussionRecentRuntime } from '../discussion/discussion.service.js';
import { reconstructTrackedSkoposAdoptionReadinessRuntime } from '../adoption/adoption.service.js';
import { buildSkoposWorkQueueRuntime } from '../work-queue/work-queue.service.js';
import {
  resolveCurrentTaskState,
  resolveLatestCompletedTaskState,
} from '../shared/current-task-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import {
  ensureSkoposCoordinationSession,
  getSkoposCoordinationStatus,
} from '../coordination/coordination.service.js';

export interface BuildSkoposSessionContextRuntimeOptions {
  cwd: string;
  actor?: string;
  dryRun?: boolean;
  sessionId?: string;
  host?: string;
  leaseSeconds?: number;
}

export const buildSkoposSessionContextRuntime = async ({
  cwd,
  actor,
  dryRun = false,
  sessionId,
  host = 'manual-cli',
  leaseSeconds,
}: BuildSkoposSessionContextRuntimeOptions): Promise<SkoposSessionContextRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const warnings: string[] = [];
  let coordination: SkoposSessionContextRunResult['coordination'];
  if (sessionId && !actorId) {
    warnings.push(
      'Coordination Session identity was provided without an actor; no Session was opened or renewed.',
    );
  } else if (sessionId && actorId && !dryRun) {
    try {
      const initialStatus = await getSkoposCoordinationStatus({ cwd: workspaceRoot });
      const existingSession = initialStatus.sessions.find(
        (candidate) => candidate.sessionId === sessionId,
      );
      const ensured = await ensureSkoposCoordinationSession({
        cwd: workspaceRoot,
        actorId,
        host,
        sessionId,
        mode: existingSession?.mode ?? 'writer',
        leaseSeconds,
      });
      const status = await getSkoposCoordinationStatus({ cwd: workspaceRoot });
      const reservation = status.reservations.find(
        (candidate) => candidate.sessionId === sessionId,
      );
      coordination = {
        enforcementLevel: ensured.enforcementLevel,
        preventiveSafety: ensured.preventiveSafety,
        session: ensured.session,
        reservation,
        claims: reservation
          ? status.claims.filter(
              (claim) => claim.taskId === reservation.taskId,
            )
          : [],
      };
    } catch (error) {
      warnings.push(`Coordination context unavailable: ${errorMessage(error)}`);
    }
  }
  const discussion = await buildSkoposDiscussionRecentRuntime({ cwd: workspaceRoot }).catch(
    (error: unknown) => {
      warnings.push(`Discussion context unavailable: ${errorMessage(error)}`);
      return undefined;
    },
  );
  const workQueue = await buildSkoposWorkQueueRuntime({
    cwd: workspaceRoot,
    actor: actorId,
    dryRun,
  }).catch((error: unknown) => {
    warnings.push(`Work Queue unavailable: ${errorMessage(error)}`);
    return undefined;
  });
  const currentTask = await resolveCurrentTaskState({
    workspaceRoot,
    actorId,
  }).catch(() => undefined);
  const latestCompletedTask = currentTask
    ? undefined
    : await resolveLatestCompletedTaskState({ workspaceRoot, actorId }).catch(
        () => undefined,
      );
  const completedTask = isCompletionPending({
    completedAt: latestCompletedTask?.task.updatedAt,
    latestJournalTurnAt: discussion?.latestJournalTurnAt,
  })
    ? buildCompletedTaskContext(latestCompletedTask!.task)
    : undefined;
  const openQuestions = currentTask
    ? await loadOpenQuestions(currentTask.questionsPath, warnings)
    : [];
  const orderedQuestions = [...openQuestions].sort(
    (left, right) => Number(right.blocking) - Number(left.blocking),
  );
  const taskPendingDecision = orderedQuestions[0]
    ? buildPendingDecision(orderedQuestions[0])
    : undefined;
  const setup = await readOptionalJson<SkoposSetupStateArtifact>(
    join(workspaceRoot, '.skopos/setup/state.json'),
    warnings,
    'Unified setup state',
  );
  const setupActive = setup && !['setup-ready', 'setup-ready-with-deferred-options'].includes(setup.stage)
    ? setup
    : undefined;
  // Setup state is checkout-local derived data and may have been written by an
  // earlier candidate. Treat newly added collections as empty so upgrading the
  // CLI cannot make Session context unusable before the next setup refresh.
  const setupQuestions = setupActive?.materialQuestions ?? [];
  const setupQuestion = setupQuestions[0];
  const setupPendingDecision = setupQuestion
    ? buildSetupPendingDecision(setupQuestion)
    : undefined;
  const setupReadiness = await buildSkoposSetupReadinessSessionState(
    workspaceRoot,
    warnings,
  );
  const pendingDecision = setupPendingDecision ?? taskPendingDecision;
  const resumeSummary = compactText(
    discussion?.latestHandoff?.resumeSummary ?? discussion?.additionalContext,
    420,
  );
  const workQueueSummary = compactText(workQueue?.summary, 420);
  const currentTaskId = workQueue?.currentTaskId ?? currentTask?.task.id;
  const currentTaskContext = currentTask
    ? buildSessionTaskContext(currentTask.task)
    : undefined;
  const recommendedWork =
    !currentTaskContext && !completedTask && workQueue?.recommendedEntry
      ? {
          id: workQueue.recommendedEntry.id,
          sourceKind: workQueue.recommendedEntry.sourceKind,
          title: workQueue.recommendedEntry.title,
          reason: workQueue.recommendedEntry.reason,
          scopeId: workQueue.recommendedEntry.scopeId,
        }
      : undefined;
  const taskNextCommand = resolveTaskNextCommand(currentTask?.task, actorId);
  const interruptedAction = currentTask
    ? await loadLatestInterruptedAction({
        workspaceRoot,
        taskId: currentTask.task.id,
        selectedActionIds: currentTask.task.selectedActions.map((action) => action.id),
      })
    : undefined;
  const nextCommand = pendingDecision
    ? undefined
    : currentTask
      ? interruptedAction?.resumeCommand ?? taskNextCommand
      : setupActive?.nextCommand
        ? setupActive.nextCommand
        : setupReadiness.state !== 'ready'
        ? `skopos setup . --actor ${actorId ?? '<id>'} --json`
        : recommendedWork
          ? `skopos work next . --actor ${actorId ?? '<id>'} --json`
          : undefined;
  const responseMode = resolveSkoposResponseMode({
    pendingDecision,
    currentTaskState: currentTask?.task.state,
    completionPending: Boolean(completedTask),
    resumeSummary,
  });
  const additionalPendingDecisionCount = setupPendingDecision
    ? Math.max(0, setupQuestions.length - 1) + orderedQuestions.length
    : Math.max(0, orderedQuestions.length - 1);
  const result: SkoposSessionContextRunResult = {
    schemaVersion: SKOPOS_COMMUNICATION_CONTRACT_VERSION,
    workspaceRoot,
    summary: pendingDecision
      ? `A ${pendingDecision.blocking ? 'blocking ' : ''}user decision is pending.`
      : currentTaskId
        ? 'Current work and response guidance are ready.'
        : completedTask
          ? 'The latest Task is complete; closure response guidance is ready.'
          : 'Response guidance is ready; no current Task is selected.',
    responseMode,
    communicationContract: {
      marker: SKOPOS_COMMUNICATION_CONTRACT.marker,
      tokenBudget: SKOPOS_COMMUNICATION_CONTRACT.tokenBudget,
      coreRules: SKOPOS_COMMUNICATION_CONTRACT.coreRules,
      modeRules: resolveSkoposCommunicationResponseModeRules(responseMode),
    },
    currentTaskId,
    currentTask: currentTaskContext,
    completedTask,
    interruptedAction,
    recommendedWork,
    workQueueSummary,
    nextCommand,
    resumeSummary,
    pendingDecision,
    setup: setupActive
      ? {
          stage: setupActive.stage,
          currentStep: setupActive.currentStep,
          lanes: setupActive.lanes,
          agentPacketPath: setupActive.agentPacketPath,
          conversation: setupActive.conversation ?? buildCompatibleSetupConversation({
            setup: setupActive,
            actorId,
          }),
        }
      : undefined,
    setupReadiness,
    coordination,
    additionalPendingDecisionCount,
    warnings,
    additionalContext: '',
  };

  result.additionalContext = renderSkoposSessionAdditionalContext(result);
  return result;
};

const buildSetupPendingDecision = (
  question: SkoposSetupStateArtifact['materialQuestions'][number],
): SkoposSessionPendingDecision => {
  const recommendedOption = question.options.find(
    (option) => option.id === question.recommendedOptionId,
  );
  return {
    id: question.id,
    question: question.question,
    escalation: 'must-ask',
    blocking: true,
    whyItMatters: question.whyItMatters,
    recommendedOptionId: question.recommendedOptionId,
    recommendedOption,
    alternatives: question.options.filter(
      (option) => option.id !== question.recommendedOptionId,
    ),
    defaultBehavior: 'wait-for-answer',
    whatHappensAfterAnswer: question.answerCommand,
    source: 'setup-question',
  };
};

const buildCompatibleSetupConversation = ({
  setup,
  actorId,
}: {
  setup: SkoposSetupStateArtifact;
  actorId?: string;
}): NonNullable<SkoposSessionContextRunResult['setup']>['conversation'] => {
  const currentQuestion = setup.materialQuestions?.[0];
  if (setup.stage === 'questions-open') {
    return {
      mode: 'ask-and-wait',
      instruction: currentQuestion
        ? 'Ask exactly the current material question and wait. Do not infer the answer, batch later questions, or present the consolidated setup plan.'
        : 'Material setup questions remain unresolved, but this older local state does not contain the current question. Refresh setup before review and do not infer an answer.',
      finalPlanAllowed: false,
      ...(currentQuestion ? { currentQuestion } : {}),
    };
  }
  if (setup.stage === 'inspection-required') {
    return {
      mode: 'inspect-and-submit',
      instruction: 'Follow the generated agent packet and submit the required analysis to Skopos before review.',
      finalPlanAllowed: false,
      submissionPath: '.skopos/setup/analysis-input.json',
      submissionCommand: `skopos setup submit .skopos/setup/analysis-input.json . --actor ${actorId ?? '<id>'}`,
    };
  }
  if (setup.stage === 'plan-ready') {
    return {
      mode: 'review',
      instruction: 'Present the consolidated setup review with independent accept, edit, defer, or reject choices.',
      finalPlanAllowed: true,
    };
  }
  if (setup.stage === 'applying') {
    return {
      mode: 'apply',
      instruction: 'Apply only accepted recommendations through their existing authority.',
      finalPlanAllowed: false,
    };
  }
  if (setup.stage === 'verification-blocked') {
    return {
      mode: 'verify',
      instruction: 'Explain the exact readiness blocker and do not claim setup is ready.',
      finalPlanAllowed: false,
    };
  }
  return {
    mode: 'complete',
    instruction: 'Report the verified setup outcome and any deferred optional improvements.',
    finalPlanAllowed: false,
  };
};

export const buildSkoposSetupReadinessSessionState = async (
  workspaceRoot: string,
  warnings: string[],
): Promise<SkoposSessionContextRunResult['setupReadiness']> => {
  const tracked = await reconstructTrackedSkoposAdoptionReadinessRuntime({
    cwd: workspaceRoot,
  }).catch((error: unknown) => {
    warnings.push(`Tracked setup readiness unavailable: ${errorMessage(error)}`);
    return undefined;
  });
  if (!tracked) {
    return {
      state: 'uncertified',
      source: 'missing-certification',
    };
  }
  return {
    state: tracked.state === 'agent-ready' ? 'ready' : 'stale',
    source: 'tracked-certification',
    certificationTaskId: tracked.certificationTaskId,
    readinessLanes: tracked.lanes,
  };
};

const readOptionalJson = async <T>(
  path: string,
  warnings: string[],
  label: string,
): Promise<T | undefined> => {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (error) {
    if (isMissingFileError(error)) return undefined;
    warnings.push(`${label} unavailable: ${errorMessage(error)}`);
    return undefined;
  }
};

const loadOpenQuestions = async (
  questionsPath: string,
  warnings: string[],
): Promise<SkoposTaskQuestion[]> => {
  try {
    const artifact = JSON.parse(
      await readFile(questionsPath, 'utf8'),
    ) as SkoposTaskQuestionArtifact;
    return artifact.entries.filter((entry) => entry.status === 'open');
  } catch (error) {
    if (isMissingFileError(error)) {
      return [];
    }
    warnings.push(`Pending decisions unavailable: ${errorMessage(error)}`);
    return [];
  }
};

const buildPendingDecision = (
  question: SkoposTaskQuestion,
): SkoposSessionPendingDecision => {
  const recommendedOption = question.options.find(
    (option) => option.id === question.recommendedOptionId,
  );

  return {
    id: question.id,
    question: question.question,
    escalation: question.escalation,
    blocking: question.blocking,
    whyItMatters: question.whyItMatters,
    recommendedOptionId: question.recommendedOptionId,
    recommendedOption,
    alternatives: question.options.filter(
      (option) => option.id !== question.recommendedOptionId,
    ),
    defaultBehavior: resolveDecisionDefaultBehavior(question.escalation),
    whatHappensAfterAnswer: 'Skopos updates the Task admission state and recomputes the Work Queue.',
    source: 'task',
  };
};

export const resolveSkoposResponseMode = ({
  pendingDecision,
  currentTaskState,
  completionPending,
  resumeSummary,
}: {
  pendingDecision?: SkoposSessionPendingDecision;
  currentTaskState?: SkoposSessionContextRunResult['currentTask'] extends infer _Current
    ? NonNullable<SkoposSessionContextRunResult['currentTask']>['state']
    : never;
  completionPending?: boolean;
  resumeSummary?: string;
}): SkoposAgentResponseMode => {
  if (pendingDecision) {
    return 'decision';
  }
  if (currentTaskState) {
    return resumeSummary ? 'progress' : 'work-start';
  }
  if (completionPending) {
    return 'completion';
  }
  return 'direct-answer';
};

export const renderSkoposSessionAdditionalContext = (
  context: SkoposSessionContextRunResult,
): string => {
  const lines = [
    context.communicationContract.marker,
    `Response mode: ${context.responseMode}`,
    ...context.communicationContract.coreRules.map((rule) => `- ${rule}`),
    ...(context.communicationContract.modeRules ??
      resolveSkoposCommunicationResponseModeRules(context.responseMode)
    ).map((rule) => `- ${rule}`),
  ];

  if (context.resumeSummary) {
    lines.push('', `Resume: ${context.resumeSummary}`);
  }
  if (context.currentTask) {
    lines.push(
      '',
      `Current Task: ${context.currentTask.id} — ${context.currentTask.title}`,
      `Task state: ${context.currentTask.state}; Scope: ${context.currentTask.scopeId}; risk: ${context.currentTask.risk}; steps: ${context.currentTask.completedStepCount}/${context.currentTask.totalStepCount}.`,
    );
    if (context.currentTask.nextStep) {
      lines.push(
        `Next Task step: ${context.currentTask.nextStep.title} (${context.currentTask.nextStep.kind}).`,
      );
    }
    if (context.interruptedAction) {
      lines.push(
        `Interrupted Action: ${context.interruptedAction.actionId} after ${context.interruptedAction.elapsedMs}ms.`,
        `Resume Action: ${context.interruptedAction.resumeCommand}`,
      );
    }
    if (context.currentTask.ownedPaths.length > 0) {
      lines.push(
        `Owned paths: ${context.currentTask.ownedPaths.join(', ')}${context.currentTask.additionalOwnedPathCount > 0 ? ` (+${context.currentTask.additionalOwnedPathCount} more)` : ''}.`,
      );
    }
  } else if (context.completedTask) {
    lines.push(
      '',
      `Completed Task: ${context.completedTask.id} — ${context.completedTask.title}`,
      `Outcome: ${context.completedTask.goal}`,
      `Scope: ${context.completedTask.scopeId}; completed: ${context.completedTask.completedAt}.`,
    );
  } else if (context.recommendedWork) {
    lines.push(
      '',
      `Recommended work: ${context.recommendedWork.id} — ${context.recommendedWork.title}`,
      `Reason: ${context.recommendedWork.reason}`,
    );
  }
  if (context.workQueueSummary) {
    lines.push(`Work Queue: ${context.workQueueSummary}`);
  }
  if (context.nextCommand) {
    lines.push(`Next command: ${context.nextCommand}`);
  }
  if (context.setup) {
    lines.push(
      `Setup stage: ${context.setup.stage}; current step: ${context.setup.currentStep}.`,
      `Setup response: ${context.setup.conversation.instruction}`,
      `Consolidated setup plan allowed: ${context.setup.conversation.finalPlanAllowed ? 'yes' : 'no'}.`,
      `Setup brief: ${context.setup.agentPacketPath}`,
    );
    if (context.setup.conversation.submissionCommand) {
      lines.push(`Submit analyzed project evidence: ${context.setup.conversation.submissionCommand}`);
    }
  }
  if (context.setupReadiness.state !== 'ready') {
    lines.push(`Setup readiness: ${context.setupReadiness.state}.`);
    if (context.setupReadiness.certificationTaskId) {
      lines.push(`Setup certification: ${context.setupReadiness.certificationTaskId}.`);
    }
  }
  if (context.coordination) {
    lines.push(
      `Coordination: ${context.coordination.enforcementLevel}; Session ${context.coordination.session.sessionId} is ${context.coordination.session.state} in ${context.coordination.session.mode} mode; preventive safety: no.`,
    );
    if (context.coordination.reservation) {
      lines.push(
        `Reserved Task: ${context.coordination.reservation.taskId}; resource claims: ${context.coordination.claims.length}.`,
      );
    } else if (context.coordination.session.mode === 'writer') {
      lines.push(
        'No writing Task is reserved. Pass this Session id to `skopos start --session-id <id> --host <host>` before editing.',
      );
    } else if (context.coordination.session.mode === 'reviewer') {
      lines.push(
        'Reviewer mode preserves this Session without writing authority. Use `skopos coordination session transition . --session <id> --actor <id> --mode writer --reason <text>` before reserving or claiming Task work.',
      );
    } else {
      lines.push('Read-only mode preserves this Session without writing authority.');
    }
  }

  const decision = context.pendingDecision;
  if (decision) {
    lines.push(
      '',
      'Pending decision:',
      `Question: ${decision.question}`,
      `Recommended: ${decision.recommendedOption?.label ?? decision.recommendedOptionId}`,
      `Reason: ${decision.whyItMatters}`,
      `Default behavior: ${decision.defaultBehavior}`,
      `Blocking: ${decision.blocking ? 'yes' : 'no'}`,
    );
    if (decision.recommendedOption?.rationale) {
      lines.push(`Recommendation tradeoff: ${decision.recommendedOption.rationale}`);
    }
    if (decision.alternatives.length > 0) {
      lines.push(
        'Alternatives:',
        ...decision.alternatives.map(
          (option) => `- ${option.label}: ${option.rationale}`,
        ),
      );
    }
    lines.push(`After the answer: ${decision.whatHappensAfterAnswer}`);
    if (context.additionalPendingDecisionCount > 0) {
      lines.push(
        `${context.additionalPendingDecisionCount} additional decision${context.additionalPendingDecisionCount === 1 ? '' : 's'} remain queued; ask one directional question at a time.`,
      );
    }
  }

  if (context.warnings.length > 0) {
    lines.push('', ...context.warnings.map((warning) => `Context warning: ${warning}`));
  }

  return lines.join('\n');
};

const isCompletionPending = ({
  completedAt,
  latestJournalTurnAt,
}: {
  completedAt?: string;
  latestJournalTurnAt?: string;
}): boolean => {
  if (!completedAt) return false;
  if (!latestJournalTurnAt) return true;
  return Date.parse(completedAt) > Date.parse(latestJournalTurnAt);
};

const buildCompletedTaskContext = (
  task: NonNullable<Awaited<ReturnType<typeof resolveLatestCompletedTaskState>>>['task'],
): NonNullable<SkoposSessionContextRunResult['completedTask']> => ({
  id: task.id,
  title: task.title,
  goal: task.goal,
  scopeId: task.scope.scope.id,
  completedAt: task.updatedAt ?? task.generatedAt ?? new Date(0).toISOString(),
});

const compactText = (value: string | undefined, limit: number): string | undefined => {
  const compact = value?.replace(/\s+/g, ' ').trim();
  if (!compact) {
    return undefined;
  }
  return compact.length <= limit ? compact : `${compact.slice(0, limit - 1)}…`;
};

const buildSessionTaskContext = (
  task: NonNullable<Awaited<ReturnType<typeof resolveCurrentTaskState>>>['task'],
): NonNullable<SkoposSessionContextRunResult['currentTask']> => {
  const ownedPaths = task.changeScope.declaredOwnedPaths.slice(0, 12);
  const nextStep = task.steps.find(
    (step) => step.status !== 'complete' && step.status !== 'skipped',
  );
  return {
    id: task.id,
    title: task.title,
    goal: task.goal,
    state: task.state,
    risk: task.risk,
    scopeId: task.scope.scope.id,
    ownedPaths,
    additionalOwnedPathCount:
      task.changeScope.declaredOwnedPaths.length - ownedPaths.length,
    completedStepCount: task.steps.filter((step) => step.status === 'complete').length,
    totalStepCount: task.steps.length,
    nextStep: nextStep
      ? {
          id: nextStep.id,
          kind: nextStep.kind,
          title: nextStep.title,
        }
      : undefined,
    selectedActionIds: task.selectedActions.map((action) => action.id).slice(0, 8),
  };
};

const resolveTaskNextCommand = (
  task: NonNullable<Awaited<ReturnType<typeof resolveCurrentTaskState>>>['task'] | undefined,
  actorId: string | undefined,
): string | undefined => {
  if (!task) {
    return undefined;
  }
  const actor = actorId ?? '<id>';
  if (task.state === 'verifying' || task.state === 'ready-to-integrate') {
    return `skopos finish ${task.id} . --actor ${actor} --json`;
  }
  const actionRecommendation = task.recommendations.find(
    (recommendation) =>
      recommendation.status === 'open' &&
      recommendation.actionKind === 'run-action' &&
      recommendation.actionId,
  );
  if (actionRecommendation?.actionId) {
    return `skopos actions run ${actionRecommendation.actionId} . --task ${task.id} --actor ${actor} --json`;
  }
  const unfinishedStep = task.steps.find(
    (step) =>
      step.kind !== 'verification' &&
      step.status !== 'complete' &&
      step.status !== 'skipped',
  );
  if (!unfinishedStep && task.state === 'active') {
    return `skopos finish ${task.id} . --actor ${actor} --json`;
  }
  return `skopos task show ${task.id} . --json`;
};

const loadLatestInterruptedAction = async ({
  workspaceRoot,
  taskId,
  selectedActionIds,
}: {
  workspaceRoot: string;
  taskId: string;
  selectedActionIds: string[];
}): Promise<SkoposSessionContextRunResult['interruptedAction']> => {
  const runsRoot = join(workspaceRoot, '.skopos', 'runs');
  try {
    const entries = await readdir(runsRoot);
    const runs = (
      await Promise.all(
        entries
          .filter((entry) => entry.endsWith('.json'))
          .map(async (entry) => {
            try {
              return JSON.parse(
                await readFile(join(runsRoot, entry), 'utf8'),
              ) as SkoposActionRunArtifact;
            } catch {
              return undefined;
            }
          }),
      )
    )
      .filter((run): run is SkoposActionRunArtifact =>
        Boolean(
          run?.type === 'action-run' &&
          run.taskId === taskId &&
          selectedActionIds.includes(run.actionId),
        ),
      )
      .sort((left, right) =>
        Date.parse(right.finishedAt ?? right.updatedAt ?? '') -
        Date.parse(left.finishedAt ?? left.updatedAt ?? ''),
      );
    const latestByAction = new Map<string, SkoposActionRunArtifact>();
    for (const run of runs) {
      if (!latestByAction.has(run.actionId)) latestByAction.set(run.actionId, run);
    }
    const interrupted = [...latestByAction.values()]
      .filter((run) => run.runStatus === 'interrupted' && run.progress?.resume)
      .sort((left, right) =>
        Date.parse(right.finishedAt ?? right.updatedAt ?? '') -
        Date.parse(left.finishedAt ?? left.updatedAt ?? ''),
      )[0];
    if (!interrupted?.progress?.resume) return undefined;
    const lastEvent = interrupted.progress.events.at(-1);
    return {
      runId: interrupted.id,
      actionId: interrupted.actionId,
      interruptedAt: interrupted.finishedAt,
      elapsedMs: lastEvent?.elapsedMs ?? Math.max(
        0,
        Date.parse(interrupted.finishedAt ?? '') - Date.parse(interrupted.startedAt ?? ''),
      ),
      resumeCommand: interrupted.progress.resume.command,
      requiresApproval: interrupted.progress.resume.requiresApproval,
    };
  } catch {
    return undefined;
  }
};

const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);
