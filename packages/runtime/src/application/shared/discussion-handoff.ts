import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';

import type {
  SkoposDiscussionHandoffArtifact,
  SkoposDiscussionIndexArtifact,
  SkoposTaskQuestionArtifact,
  SkoposTaskRecommendationArtifact,
  SkoposTaskIdentity,
} from '@skopos/model';

import { resolveCurrentTaskState } from './current-task-state.js';
import {
  DISCUSSION_INDEX_ARTIFACT_PATH,
  TOKEN_BUDGETS,
} from './token-control-constants.js';
import { estimateTokens, readJsonIfExists } from './token-control-state.js';
import { writeJsonArtifact } from './write-json-artifact.js';

export interface RefreshSkoposDiscussionHandoffResult {
  path: string;
  write: 'written' | 'dry-run';
  artifact: SkoposDiscussionHandoffArtifact;
}

export const refreshSkoposDiscussionHandoff = async ({
  workspaceRoot,
  taskIdentity,
  dryRun = false,
}: {
  workspaceRoot: string;
  taskIdentity?: SkoposTaskIdentity;
  dryRun?: boolean;
}): Promise<RefreshSkoposDiscussionHandoffResult> => {
  const current = await resolveCurrentTaskState({ workspaceRoot, taskIdentity });
  if (!current) {
    throw new Error(
      'Task-scoped discussion handoff requires an exact current Task identity.',
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
  const index = await readJsonIfExists<SkoposDiscussionIndexArtifact>(
    join(workspaceRoot, DISCUSSION_INDEX_ARTIFACT_PATH),
  );
  const linkedCheckpointIds =
    index?.entries
      .filter((entry) => entry.activeTaskId === task.id)
      .slice(0, 4)
      .map((entry) => entry.id) ?? [];
  const resumeSummary = `Resume Task ${task.id}. ${currentDirection} ${acceptedDecisions.length} decision${acceptedDecisions.length === 1 ? '' : 's'} resolved; ${openQuestions.length} question${openQuestions.length === 1 ? '' : 's'} open. Next command: ${recommendedNextCommand}.`;
  const estimatedTokens = estimateTokens(resumeSummary);
  const now = new Date().toISOString();
  const artifact: SkoposDiscussionHandoffArtifact = {
    schemaVersion: 1,
    id: `discussion-handoff-${createHash('sha256')
      .update(`${task.taskIdentity.worktreeId}\0${task.id}`)
      .digest('hex')
      .slice(0, 16)}`,
    type: 'discussion-handoff',
    status: 'generated',
    authority: 'generated',
    summary: `Task continuation handoff for ${task.id}.`,
    updatedAt: now,
    generatedAt: now,
    workspaceRoot,
    handoffKind: 'task-resume',
    activeTaskId: task.id,
    currentDirection,
    acceptedDecisions,
    openQuestions,
    recommendedNextCommand,
    linkedCheckpointIds,
    linkedArtifactPaths: [
      relative(workspaceRoot, current.taskPath),
      relative(workspaceRoot, current.questionsPath),
      relative(workspaceRoot, current.recommendationsPath),
      ...(index ? [DISCUSSION_INDEX_ARTIFACT_PATH] : []),
    ],
    resumeSummary,
    estimatedTokens,
    budgetTokens: TOKEN_BUDGETS.handoff,
    overBudget: estimatedTokens > TOKEN_BUDGETS.handoff,
  };
  const write = await writeJsonArtifact({
    artifactPath: current.handoffPath,
    artifact,
    dryRun,
  });
  return { path: current.handoffPath, write, artifact };
};
