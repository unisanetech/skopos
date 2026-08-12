import { join } from 'node:path';

import type { SkoposTaskIdentity } from '@skopos/model';

export const TASK_ARTIFACT_ROOT = '.skopos/tasks';

export const resolveSkoposTaskDirectory = (
  workspaceRoot: string,
  taskIdentity: SkoposTaskIdentity,
): string =>
  join(
    workspaceRoot,
    TASK_ARTIFACT_ROOT,
    safeTaskPathSegment(taskIdentity.worktreeId),
    safeTaskPathSegment(taskIdentity.taskId),
  );

export const resolveSkoposTaskArtifactPath = (
  workspaceRoot: string,
  taskIdentity: SkoposTaskIdentity,
): string => join(resolveSkoposTaskDirectory(workspaceRoot, taskIdentity), 'task.json');

export const resolveSkoposTaskQuestionsPath = (
  workspaceRoot: string,
  taskIdentity: SkoposTaskIdentity,
): string => join(resolveSkoposTaskDirectory(workspaceRoot, taskIdentity), 'questions.json');

export const resolveSkoposTaskRecommendationsPath = (
  workspaceRoot: string,
  taskIdentity: SkoposTaskIdentity,
): string => join(resolveSkoposTaskDirectory(workspaceRoot, taskIdentity), 'recommendations.json');

export const resolveSkoposTaskSplitProposalPath = (
  workspaceRoot: string,
  taskIdentity: SkoposTaskIdentity,
): string => join(resolveSkoposTaskDirectory(workspaceRoot, taskIdentity), 'split-proposal.json');

export const resolveSkoposTaskSplitActivationPath = (
  workspaceRoot: string,
  taskIdentity: SkoposTaskIdentity,
): string => join(resolveSkoposTaskDirectory(workspaceRoot, taskIdentity), 'split-activation.json');

const safeTaskPathSegment = (value: string): string => {
  if (value === '.') {
    return '%2E';
  }
  if (value === '..') {
    return '%2E%2E';
  }
  return encodeURIComponent(value) || 'task';
};
