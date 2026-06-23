import { relative, resolve } from 'node:path';

export const normalizeSubtreeTarget = (cwd: string, subtreeTarget?: string): string | undefined => {
  if (!subtreeTarget || subtreeTarget.trim().length === 0) {
    return undefined;
  }

  const normalized = relative(cwd, resolve(cwd, subtreeTarget)).replaceAll('\\', '/');
  return normalized === '.' || normalized.length === 0 ? undefined : normalized;
};

export const isWithinSubtree = (relativePath: string, subtreeTarget?: string): boolean => {
  if (!subtreeTarget) {
    return true;
  }

  return relativePath === subtreeTarget || relativePath.startsWith(`${subtreeTarget}/`);
};
