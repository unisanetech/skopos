import type { Dirent } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

import type {
  SkoposTaskArtifact,
  SkoposTaskIdentity,
} from '@skopos/model';
import {
  resolveSkoposWorkspaceIdentity,
  taskIdentityMatchesWorkspace,
} from '@skopos/verification';

import {
  resolveSkoposTaskArtifactPath,
  resolveSkoposTaskDirectory,
  resolveSkoposTaskQuestionsPath,
  resolveSkoposTaskRecommendationsPath,
} from '../task/task-paths.js';
import { reconstructTrackedSkoposTasksRuntime } from '../task/task.service.js';

export interface SkoposCurrentTaskState {
  task: SkoposTaskArtifact;
  taskIdentity: SkoposTaskIdentity;
  authorityDirectory: string;
  taskPath: string;
  questionsPath: string;
  recommendationsPath: string;
  handoffPath: string;
}

export const resolveCurrentTaskState = async ({
  workspaceRoot,
  actorId,
  taskId,
  taskIdentity,
}: {
  workspaceRoot: string;
  actorId?: string;
  taskId?: string;
  taskIdentity?: SkoposTaskIdentity;
}): Promise<SkoposCurrentTaskState | undefined> => {
  await reconstructTrackedSkoposTasksRuntime({ cwd: workspaceRoot });
  const [workspace, tasks] = await Promise.all([
    resolveSkoposWorkspaceIdentity(workspaceRoot),
    loadTaskArtifacts(workspaceRoot),
  ]);
  const candidates = tasks
    .filter((task) =>
      taskIdentityMatchesWorkspace({
        taskIdentity: task.taskIdentity,
        workspace,
      }),
    )
    .filter((task) =>
      taskIdentity
        ? sameTaskIdentity(task.taskIdentity, taskIdentity)
        : taskId
          ? isCurrentTask(task) && task.id === taskId
        : actorId
          ? isCurrentTask(task) && task.coordination.claimedBy?.actorId === actorId
          : isCurrentTask(task),
    )
    .sort(
      (left, right) =>
        Date.parse(right.updatedAt ?? right.generatedAt ?? '') -
        Date.parse(left.updatedAt ?? left.generatedAt ?? ''),
    );
  if (candidates.length !== 1) {
    return undefined;
  }
  return buildCurrentTaskState({
    workspaceRoot,
    task: candidates[0]!,
  });
};

export const resolveLatestCompletedTaskState = async ({
  workspaceRoot,
  actorId,
}: {
  workspaceRoot: string;
  actorId?: string;
}): Promise<SkoposCurrentTaskState | undefined> => {
  await reconstructTrackedSkoposTasksRuntime({ cwd: workspaceRoot });
  const [workspace, tasks] = await Promise.all([
    resolveSkoposWorkspaceIdentity(workspaceRoot),
    loadTaskArtifacts(workspaceRoot),
  ]);
  const candidates = tasks
    .filter((task) =>
      taskIdentityMatchesWorkspace({
        taskIdentity: task.taskIdentity,
        workspace,
      }),
    )
    .filter(
      (task) =>
        task.state === 'complete' &&
        (!actorId || task.coordination.claimedBy?.actorId === actorId),
    )
    .sort(
      (left, right) =>
        Date.parse(right.updatedAt ?? right.generatedAt ?? '') -
        Date.parse(left.updatedAt ?? left.generatedAt ?? ''),
    );
  return candidates[0]
    ? buildCurrentTaskState({ workspaceRoot, task: candidates[0] })
    : undefined;
};

export const buildCurrentTaskState = ({
  workspaceRoot,
  task,
}: {
  workspaceRoot: string;
  task: SkoposTaskArtifact;
}): SkoposCurrentTaskState => {
  const authorityDirectory = resolveSkoposTaskDirectory(
    workspaceRoot,
    task.taskIdentity,
  );
  return {
    task,
    taskIdentity: task.taskIdentity,
    authorityDirectory,
    taskPath: resolveSkoposTaskArtifactPath(workspaceRoot, task.taskIdentity),
    questionsPath: resolveSkoposTaskQuestionsPath(workspaceRoot, task.taskIdentity),
    recommendationsPath: resolveSkoposTaskRecommendationsPath(
      workspaceRoot,
      task.taskIdentity,
    ),
    handoffPath: resolveTaskHandoffArtifactPath(workspaceRoot, task.taskIdentity),
  };
};

export const resolveTaskHandoffArtifactPath = (
  workspaceRoot: string,
  taskIdentity: SkoposTaskIdentity,
): string => {
  const taskRelativeDirectory = relative(
    join(workspaceRoot, '.skopos', 'tasks'),
    resolveSkoposTaskDirectory(workspaceRoot, taskIdentity),
  );
  return join(workspaceRoot, '.skopos', 'handoffs', taskRelativeDirectory, 'handoff.json');
};

const loadTaskArtifacts = async (workspaceRoot: string): Promise<SkoposTaskArtifact[]> => {
  const paths = await findTaskFiles(join(workspaceRoot, '.skopos', 'tasks'));
  return Promise.all(
    paths.map(async (path) => JSON.parse(await readFile(path, 'utf8')) as SkoposTaskArtifact),
  );
};

const findTaskFiles = async (directory: string): Promise<string[]> => {
  let entries: Dirent[];
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (isMissingFileError(error)) return [];
    throw error;
  }
  return (
    await Promise.all(
      entries.map(async (entry) => {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) return entry.name === 'plans' ? [] : findTaskFiles(path);
        return entry.isFile() && entry.name === 'task.json' ? [path] : [];
      }),
    )
  ).flat();
};

const isCurrentTask = (task: SkoposTaskArtifact): boolean =>
  ['active', 'blocked', 'verifying', 'ready-to-integrate'].includes(task.state);

const sameTaskIdentity = (
  left: SkoposTaskIdentity,
  right: SkoposTaskIdentity,
): boolean =>
  left.repositoryId === right.repositoryId &&
  left.worktreeId === right.worktreeId &&
  left.taskId === right.taskId &&
  left.actorId === right.actorId;

const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
