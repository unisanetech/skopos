const normalizePolicyPath = (path: string): string =>
  path.replaceAll('\\', '/').replace(/^\.\/+/, '').replace(/\/+$/, '').trim();

export const normalizeWorkspaceIgnorePaths = (ignoredPaths: string[]): string[] => [
  ...new Set(
    ignoredPaths
      .map((ignoredPath) => normalizePolicyPath(ignoredPath))
      .filter((ignoredPath) => ignoredPath.length > 0 && ignoredPath !== '.'),
  ),
].sort((left, right) => left.localeCompare(right));

export const isWorkspaceIgnoredPath = (
  relativePath: string,
  ignoredPaths: string[] = [],
): boolean => {
  const normalizedPath = normalizePolicyPath(relativePath);

  if (normalizedPath.length === 0 || normalizedPath === '.') {
    return false;
  }

  return ignoredPaths.some(
    (ignoredPath) =>
      normalizedPath === ignoredPath || normalizedPath.startsWith(`${ignoredPath}/`),
  );
};

export const isPackageScopePath = (
  relativePath: string,
  ignoredPaths: string[] = [],
): boolean => {
  const normalizedPath = normalizePolicyPath(relativePath);

  if (normalizedPath === '.' || normalizedPath.length === 0) {
    return false;
  }

  if (normalizedPath.startsWith('.tmp/')) {
    return false;
  }

  if (normalizedPath.startsWith('references/')) {
    return false;
  }

  if (normalizedPath.includes('/templates/')) {
    return false;
  }

  if (isWorkspaceIgnoredPath(normalizedPath, ignoredPaths)) {
    return false;
  }

  return true;
};
