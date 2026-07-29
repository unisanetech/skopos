import { access, readFile } from 'node:fs/promises';
import { relative } from 'node:path';

import type { SkoposTaskIdentity } from '@skopos/model';

import { resolveCurrentTaskState } from './current-task-state.js';

export const estimateTokens = (value: string): number => {
  const normalized = value.trim();
  return normalized.length === 0 ? 0 : Math.ceil(normalized.length / 4);
};

export const readTextIfExists = async (path: string): Promise<string | undefined> => {
  try {
    await access(path);
    return await readFile(path, 'utf8');
  } catch {
    return undefined;
  }
};

export const readJsonIfExists = async <T>(path: string): Promise<T | undefined> => {
  const contents = await readTextIfExists(path);
  if (!contents) {
    return undefined;
  }

  return JSON.parse(contents) as T;
};

export const resolveCurrentTaskId = async (
  workspaceRoot: string,
  taskIdentity?: SkoposTaskIdentity,
): Promise<string | undefined> => {
  const currentTask = await resolveCurrentTaskState({ workspaceRoot, taskIdentity });
  return currentTask?.task.id;
};

export const resolveCurrentTaskHandoffPath = async (
  workspaceRoot: string,
  taskIdentity?: SkoposTaskIdentity,
): Promise<string | undefined> => {
  const currentTask = await resolveCurrentTaskState({ workspaceRoot, taskIdentity });
  if (!currentTask || !(await pathExists(currentTask.handoffPath))) {
    return undefined;
  }

  return relative(workspaceRoot, currentTask.handoffPath);
};

const pathExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};
