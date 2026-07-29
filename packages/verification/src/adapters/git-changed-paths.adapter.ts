import { execFile } from 'node:child_process';
import { realpath } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export const collectGitChangedPaths = async (workspaceRoot: string): Promise<string[]> => {
  const resolvedWorkspaceRoot = await normalizePath(resolve(workspaceRoot));
  const gitRoot = await resolveGitRoot(resolvedWorkspaceRoot);

  if (!gitRoot) {
    throw new Error(
      'No changed paths were provided and the workspace is not inside a git repository.',
    );
  }

  const [staged, unstaged, untracked] = await Promise.all([
    runGitPathList(gitRoot, ['diff', '--name-only', '--cached', '--diff-filter=ACDMRTUXB']),
    runGitPathList(gitRoot, ['diff', '--name-only', '--diff-filter=ACDMRTUXB']),
    runGitPathList(gitRoot, ['ls-files', '--others', '--exclude-standard']),
  ]);

  const changedPaths = new Set<string>();

  for (const repoRelativePath of [...staged, ...unstaged, ...untracked]) {
    const absolutePath = resolve(gitRoot, repoRelativePath);
    const workspaceRelativePath = relative(resolvedWorkspaceRoot, absolutePath);

    if (workspaceRelativePath.startsWith('..') || workspaceRelativePath === '') {
      continue;
    }

    changedPaths.add(workspaceRelativePath);
  }

  return [...changedPaths].sort();
};

export const collectGitChangedPathsSince = async (
  workspaceRoot: string,
  revision: string,
): Promise<string[]> => {
  const resolvedWorkspaceRoot = await normalizePath(resolve(workspaceRoot));
  const gitRoot = await resolveGitRoot(resolvedWorkspaceRoot);

  if (!gitRoot) {
    return [];
  }

  const repoRelativePaths = await runGitPathList(gitRoot, [
    'diff',
    '--name-only',
    '--diff-filter=ACDMRTUXB',
    revision,
    'HEAD',
  ]);

  return normalizeRepoPaths({
    gitRoot,
    workspaceRoot: resolvedWorkspaceRoot,
    repoRelativePaths,
  });
};

export const resolveGitHeadRevision = async (
  workspaceRoot: string,
): Promise<string | undefined> => {
  const resolvedWorkspaceRoot = await normalizePath(resolve(workspaceRoot));
  const gitRoot = await resolveGitRoot(resolvedWorkspaceRoot);

  if (!gitRoot) {
    return undefined;
  }

  try {
    const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], {
      cwd: gitRoot,
    });
    return stdout.trim() || undefined;
  } catch {
    return undefined;
  }
};

export const hasGitWorkspace = async (workspaceRoot: string): Promise<boolean> => {
  const resolvedWorkspaceRoot = await normalizePath(resolve(workspaceRoot));
  return Boolean(await resolveGitRoot(resolvedWorkspaceRoot));
};

const resolveGitRoot = async (cwd: string): Promise<string | null> => {
  try {
    const { stdout } = await execFileAsync('git', ['rev-parse', '--show-toplevel'], { cwd });
    const gitRoot = stdout.trim();
    return gitRoot.length > 0 ? await normalizePath(gitRoot) : null;
  } catch {
    return null;
  }
};

const runGitPathList = async (cwd: string, args: string[]): Promise<string[]> => {
  const { stdout } = await execFileAsync('git', args, { cwd });
  return stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

const normalizeRepoPaths = ({
  gitRoot,
  workspaceRoot,
  repoRelativePaths,
}: {
  gitRoot: string;
  workspaceRoot: string;
  repoRelativePaths: string[];
}): string[] => {
  const workspacePaths = new Set<string>();

  for (const repoRelativePath of repoRelativePaths) {
    const absolutePath = resolve(gitRoot, repoRelativePath);
    const workspaceRelativePath = relative(workspaceRoot, absolutePath);
    if (workspaceRelativePath.startsWith('..') || workspaceRelativePath === '') {
      continue;
    }
    workspacePaths.add(workspaceRelativePath);
  }

  return [...workspacePaths].sort();
};

const normalizePath = async (path: string): Promise<string> => {
  try {
    return await realpath(path);
  } catch {
    return path;
  }
};
