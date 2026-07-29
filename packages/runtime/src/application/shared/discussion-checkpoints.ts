import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

import type {
  SkoposDiscussionCheckpointArtifact,
  SkoposDiscussionCheckpointPromotionKind,
  SkoposDiscussionCheckpointPromotionTrigger,
  SkoposDiscussionIndexArtifact,
  SkoposTaskQuestionArtifact,
  SkoposTaskRecommendationArtifact,
  SkoposTaskIdentity,
} from '@skopos/model';

import { resolveCurrentTaskState } from './current-task-state.js';
import {
  DISCUSSION_CHECKPOINT_DIRECTORY,
  DISCUSSION_INDEX_ARTIFACT_PATH,
  TOKEN_BUDGETS,
} from './token-control-constants.js';
import { estimateTokens, readJsonIfExists } from './token-control-state.js';
import { writeJsonArtifact } from './write-json-artifact.js';

export interface RefreshSkoposDiscussionCheckpointResult {
  path: string;
  write: 'written' | 'dry-run' | 'unchanged';
  artifact: SkoposDiscussionCheckpointArtifact;
  indexPath: string;
  indexWrite: 'written' | 'dry-run' | 'unchanged';
  index: SkoposDiscussionIndexArtifact;
}

export const refreshSkoposDiscussionCheckpoints = async ({
  workspaceRoot,
  taskIdentity,
  dryRun = false,
  trigger = 'manual',
}: {
  workspaceRoot: string;
  taskIdentity?: SkoposTaskIdentity;
  dryRun?: boolean;
  trigger?: SkoposDiscussionCheckpointPromotionTrigger;
}): Promise<RefreshSkoposDiscussionCheckpointResult> => {
  const current = await resolveCurrentTaskState({ workspaceRoot, taskIdentity });
  if (!current) {
    throw new Error(
      'Task-scoped discussion checkpoint requires an exact current Task identity.',
    );
  }
  const task = current.task;
  const [questions, recommendations] = await Promise.all([
    readJsonIfExists<SkoposTaskQuestionArtifact>(current.questionsPath),
    readJsonIfExists<SkoposTaskRecommendationArtifact>(current.recommendationsPath),
  ]);
  if (!questions || !recommendations) {
    throw new Error(`Task ${task.id} is missing exact question or recommendation state.`);
  }
  const acceptedDecisions = questions.entries
    .filter((entry) => entry.status === 'resolved' && entry.resolvedOptionId)
    .map((entry) => ({
      id: entry.id,
      title: entry.question,
      resolvedOptionId: entry.resolvedOptionId!,
      resolvedOptionLabel: entry.options.find(
        (option) => option.id === entry.resolvedOptionId,
      )?.label,
    }));
  const openQuestions = questions.entries
    .filter((entry) => entry.status === 'open')
    .map((entry) => ({
      id: entry.id,
      title: entry.question,
      blocking: entry.blocking,
      recommendedOptionId: entry.recommendedOptionId,
    }));
  const recommendation = recommendations.entries.find(
    (entry) => entry.status === 'open',
  );
  const nextStep = task.steps.find(
    (step) => step.status !== 'complete' && step.status !== 'skipped',
  );
  const currentDirection =
    recommendation?.summary ??
    nextStep?.detail ??
    `Continue Task ${task.id} from its exact Task-local state.`;
  const recommendedNextCommand = `skopos task show ${task.id}`;
  const resumeSummary = buildResumeSummary({
    taskId: task.id,
    currentDirection,
    openQuestionCount: openQuestions.length,
    blockingQuestionCount: openQuestions.filter((entry) => entry.blocking).length,
    acceptedDecisionCount: acceptedDecisions.length,
    recommendedNextCommand,
  });
  const existingIndex = await readJsonIfExists<SkoposDiscussionIndexArtifact>(
    join(workspaceRoot, DISCUSSION_INDEX_ARTIFACT_PATH),
  );
  const latest = await loadLatestCheckpointArtifact(workspaceRoot, existingIndex);
  const promotionKinds = derivePromotionKinds(latest, {
    activeTaskId: task.id,
    currentDirection,
    acceptedDecisions,
    openQuestions,
    recommendedNextCommand,
  });
  if (latest && promotionKinds.length === 0) {
    const index = buildDiscussionIndexArtifact(workspaceRoot, latest, existingIndex?.entries ?? []);
    return {
      path: join(workspaceRoot, DISCUSSION_CHECKPOINT_DIRECTORY, `${latest.id}.json`),
      write: 'unchanged',
      artifact: latest,
      indexPath: join(workspaceRoot, DISCUSSION_INDEX_ARTIFACT_PATH),
      indexWrite: 'unchanged',
      index,
    };
  }
  const now = new Date().toISOString();
  const estimatedTokens = estimateTokens(resumeSummary);
  const artifact: SkoposDiscussionCheckpointArtifact = {
    schemaVersion: 1,
    id: `discussion-checkpoint-${now.replace(/[-:.]/g, '').replace('Z', 'z')}`,
    type: 'discussion-checkpoint',
    status: 'generated',
    authority: 'generated',
    summary: `Discussion checkpoint for Task ${task.id}.`,
    updatedAt: now,
    generatedAt: now,
    workspaceRoot,
    threadId: `task:${task.id}`,
    checkpointKind: 'task-state',
    activeTaskId: task.id,
    linkedPlanId: task.planIds[0],
    currentDirection,
    acceptedDecisions,
    openQuestions,
    recommendedNextCommand,
    linkedArtifactPaths: [
      relative(workspaceRoot, current.taskPath),
      relative(workspaceRoot, current.questionsPath),
      relative(workspaceRoot, current.recommendationsPath),
    ],
    resumeSummary,
    estimatedTokens,
    budgetTokens: TOKEN_BUDGETS.checkpoint,
    overBudget: estimatedTokens > TOKEN_BUDGETS.checkpoint,
    promotionTrigger: trigger,
    promotionKinds,
    supersedesCheckpointId: latest?.id,
  };
  const path = join(workspaceRoot, DISCUSSION_CHECKPOINT_DIRECTORY, `${artifact.id}.json`);
  const write = await writeJsonArtifact({ artifactPath: path, artifact, dryRun });
  const index = buildDiscussionIndexArtifact(
    workspaceRoot,
    artifact,
    existingIndex?.entries ?? [],
  );
  const indexPath = join(workspaceRoot, DISCUSSION_INDEX_ARTIFACT_PATH);
  const indexWrite = await writeJsonArtifact({
    artifactPath: indexPath,
    artifact: index,
    dryRun,
  });
  return { path, write, artifact, indexPath, indexWrite, index };
};

const loadLatestCheckpointArtifact = async (
  workspaceRoot: string,
  index?: SkoposDiscussionIndexArtifact,
): Promise<SkoposDiscussionCheckpointArtifact | undefined> => {
  if (index?.latestCheckpointPath) {
    return readJsonIfExists(
      join(workspaceRoot, index.latestCheckpointPath),
    );
  }
  try {
    const latest = (await readdir(join(workspaceRoot, DISCUSSION_CHECKPOINT_DIRECTORY)))
      .filter((entry) => entry.endsWith('.json'))
      .sort()
      .at(-1);
    return latest
      ? readJsonIfExists(join(workspaceRoot, DISCUSSION_CHECKPOINT_DIRECTORY, latest))
      : undefined;
  } catch {
    return undefined;
  }
};

const derivePromotionKinds = (
  previous: SkoposDiscussionCheckpointArtifact | undefined,
  next: Pick<
    SkoposDiscussionCheckpointArtifact,
    | 'activeTaskId'
    | 'currentDirection'
    | 'acceptedDecisions'
    | 'openQuestions'
    | 'recommendedNextCommand'
  >,
): SkoposDiscussionCheckpointPromotionKind[] => {
  if (!previous) return ['initial-state'];
  const kinds: SkoposDiscussionCheckpointPromotionKind[] = [];
  if (previous.activeTaskId !== next.activeTaskId) kinds.push('active-task-changed');
  if (previous.currentDirection !== next.currentDirection) {
    kinds.push('current-direction-changed');
  }
  if (JSON.stringify(previous.acceptedDecisions) !== JSON.stringify(next.acceptedDecisions)) {
    kinds.push('accepted-decisions-changed');
  }
  if (JSON.stringify(previous.openQuestions) !== JSON.stringify(next.openQuestions)) {
    kinds.push('open-questions-changed');
  }
  if (previous.recommendedNextCommand !== next.recommendedNextCommand) {
    kinds.push('recommended-next-command-changed');
  }
  return kinds;
};

const buildDiscussionIndexArtifact = (
  workspaceRoot: string,
  latest: SkoposDiscussionCheckpointArtifact,
  entries: SkoposDiscussionIndexArtifact['entries'],
): SkoposDiscussionIndexArtifact => {
  const latestCheckpointPath = `${DISCUSSION_CHECKPOINT_DIRECTORY}/${latest.id}.json`;
  const nextEntries = [
    {
      id: latest.id,
      threadId: latest.threadId,
      artifactPath: latestCheckpointPath,
      activeTaskId: latest.activeTaskId,
      linkedPlanId: latest.linkedPlanId,
      summary: latest.summary ?? latest.resumeSummary,
      currentDirection: latest.currentDirection,
      updatedAt: latest.updatedAt ?? latest.generatedAt ?? new Date().toISOString(),
    },
    ...entries.filter((entry) => entry.id !== latest.id),
  ].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    id: 'discussion-index',
    type: 'discussion-index',
    status: 'generated',
    authority: 'generated',
    summary: `${nextEntries.length} Task discussion checkpoint${nextEntries.length === 1 ? '' : 's'} available.`,
    updatedAt: latest.updatedAt,
    generatedAt: now,
    workspaceRoot,
    latestCheckpointId: latest.id,
    latestCheckpointPath,
    checkpointCount: nextEntries.length,
    entries: nextEntries,
  };
};

const buildResumeSummary = ({
  taskId,
  currentDirection,
  openQuestionCount,
  blockingQuestionCount,
  acceptedDecisionCount,
  recommendedNextCommand,
}: {
  taskId: string;
  currentDirection: string;
  openQuestionCount: number;
  blockingQuestionCount: number;
  acceptedDecisionCount: number;
  recommendedNextCommand: string;
}): string =>
  `Resume Task ${taskId}. ${currentDirection} ${acceptedDecisionCount} decision${acceptedDecisionCount === 1 ? '' : 's'} resolved; ${openQuestionCount} question${openQuestionCount === 1 ? '' : 's'} open (${blockingQuestionCount} blocking). Next command: ${recommendedNextCommand}.`;
