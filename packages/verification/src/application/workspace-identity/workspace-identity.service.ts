import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { realpath } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { promisify } from 'node:util';

import type { SkoposTaskIdentity, SkoposWorkspaceIdentity } from '@skopos/model';

const execFileAsync = promisify(execFile);

export const resolveSkoposWorkspaceIdentity = async (
  cwd: string,
): Promise<SkoposWorkspaceIdentity> => {
  const fallbackRoot = await canonicalizePath(resolve(cwd));

  try {
    const worktreeRoot = await canonicalizePath(
      await runGit(cwd, ['rev-parse', '--show-toplevel']),
    );
    const commonGitDirectory = await canonicalizePath(
      resolve(worktreeRoot, await runGit(worktreeRoot, ['rev-parse', '--git-common-dir'])),
    );
    const repositoryRoot =
      commonGitDirectory.endsWith('/.git') || commonGitDirectory.endsWith('\\.git')
        ? dirname(commonGitDirectory)
        : worktreeRoot;
    const repositoryId = digestIdentity(`repository\0${commonGitDirectory}`);
    const branch = await runGitOptional(worktreeRoot, ['branch', '--show-current']);

    return {
      repositoryId,
      repositoryRoot,
      worktreeId: digestIdentity(`worktree\0${repositoryId}\0${worktreeRoot}`),
      worktreeRoot,
      branch: branch || undefined,
    };
  } catch {
    const repositoryId = digestIdentity(`repository\0${fallbackRoot}`);
    return {
      repositoryId,
      repositoryRoot: fallbackRoot,
      worktreeId: digestIdentity(`worktree\0${repositoryId}\0${fallbackRoot}`),
      worktreeRoot: fallbackRoot,
    };
  }
};

export const buildSkoposTaskIdentity = ({
  workspace,
  taskId,
  actorId,
}: {
  workspace: SkoposWorkspaceIdentity;
  taskId: string;
  actorId?: string;
}): SkoposTaskIdentity => ({
  ...workspace,
  taskId,
  actorId,
});

export const taskIdentityMatchesWorkspace = ({
  taskIdentity,
  workspace,
}: {
  taskIdentity: SkoposTaskIdentity;
  workspace: SkoposWorkspaceIdentity;
}): boolean =>
  taskIdentity.repositoryId === workspace.repositoryId &&
  taskIdentity.worktreeId === workspace.worktreeId &&
  taskIdentity.branch === workspace.branch;

const runGit = async (cwd: string, args: string[]): Promise<string> => {
  const { stdout } = await execFileAsync('git', args, {
    cwd,
    encoding: 'utf8',
  });
  return stdout.trim();
};

const runGitOptional = async (cwd: string, args: string[]): Promise<string | undefined> => {
  try {
    return await runGit(cwd, args);
  } catch {
    return undefined;
  }
};

const canonicalizePath = async (path: string): Promise<string> => {
  try {
    return await realpath(path);
  } catch {
    return resolve(path);
  }
};

const digestIdentity = (value: string): string =>
  createHash('sha256').update(value).digest('hex').slice(0, 24);
