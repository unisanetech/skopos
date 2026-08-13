import { lstat, realpath } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';

const isContained = (root: string, candidate: string): boolean => {
  const pathFromRoot = relative(root, candidate);
  return pathFromRoot === '' || (!pathFromRoot.startsWith(`..${sep}`) && pathFromRoot !== '..');
};

const deepestExistingPath = async (path: string): Promise<string> => {
  let candidate = path;
  while (true) {
    try {
      await lstat(candidate);
      return candidate;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      const parent = dirname(candidate);
      if (parent === candidate) throw error;
      candidate = parent;
    }
  }
};

/**
 * Resolve a workspace-owned path and reject both lexical traversal and symlink escapes.
 * The deepest existing ancestor is resolved so a not-yet-created file beneath a symlink
 * cannot redirect a later mkdir/write outside the project.
 */
export const resolveWorkspaceContainedPath = async ({
  workspaceRoot,
  path,
  label,
}: {
  workspaceRoot: string;
  path: string;
  label: string;
}): Promise<string> => {
  const absoluteWorkspaceRoot = resolve(workspaceRoot);
  const absoluteCandidate = resolve(absoluteWorkspaceRoot, path);
  if (!isContained(absoluteWorkspaceRoot, absoluteCandidate)) {
    throw new Error(`${label} must stay inside the workspace: ${path}`);
  }

  const [realWorkspaceRoot, existingAncestor] = await Promise.all([
    realpath(absoluteWorkspaceRoot),
    deepestExistingPath(absoluteCandidate),
  ]);
  const realExistingAncestor = await realpath(existingAncestor);
  if (!isContained(realWorkspaceRoot, realExistingAncestor)) {
    throw new Error(`${label} resolves outside the workspace through a symbolic link: ${path}`);
  }

  return absoluteCandidate;
};
