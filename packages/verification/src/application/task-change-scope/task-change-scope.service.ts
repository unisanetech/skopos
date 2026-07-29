import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

import type {
  SkoposImpactEntry,
  SkoposTaskChangeScope,
  SkoposTaskPathState,
} from '@skopos/model';

import {
  collectGitChangedPaths,
  collectGitChangedPathsSince,
  hasGitWorkspace,
  resolveGitHeadRevision,
} from '../../adapters/git-changed-paths.adapter.js';

export interface CaptureSkoposTaskChangeScopeOptions {
  workspaceRoot: string;
  declaredOwnedPaths?: string[];
  capturedAt?: string;
}

export interface ResolveSkoposTaskChangedPathsOptions {
  workspaceRoot: string;
  changeScope: SkoposTaskChangeScope;
}

export interface SkoposTaskChangedPaths {
  changedPaths: string[];
  ignoredPreExistingPaths: string[];
}

const TASK_TRACKED_IMPACT_CATEGORIES = new Set<SkoposImpactEntry['category']>([
  'instruction-source',
  'package-manifest',
  'scope-source',
  'root-config',
  'workspace-file',
]);

export const selectSkoposTaskTrackedPaths = (
  changed: SkoposImpactEntry[],
): string[] =>
  [...new Set(
    changed
      .filter((entry) => TASK_TRACKED_IMPACT_CATEGORIES.has(entry.category))
      .map((entry) => entry.path),
  )].sort();

export const captureSkoposTaskChangeScope = async ({
  workspaceRoot,
  declaredOwnedPaths = [],
  capturedAt = new Date().toISOString(),
}: CaptureSkoposTaskChangeScopeOptions): Promise<SkoposTaskChangeScope> => {
  const trackingMode = await hasGitWorkspace(workspaceRoot) ? 'git' : 'unavailable';
  const dirtyPaths =
    trackingMode === 'git' ? await collectGitChangedPaths(workspaceRoot) : [];
  const baselineDirtyPaths = await captureSkoposTaskPathStates({
    workspaceRoot,
    paths: dirtyPaths,
  });

  return {
    capturedAt,
    trackingMode,
    baselineRevision: await resolveGitHeadRevision(workspaceRoot),
    baselineDirtyPaths,
    declaredOwnedPaths: normalizeDeclaredPaths(workspaceRoot, declaredOwnedPaths),
  };
};

export const resolveSkoposTaskChangedPaths = async ({
  workspaceRoot,
  changeScope,
}: ResolveSkoposTaskChangedPathsOptions): Promise<SkoposTaskChangedPaths> => {
  const dirtyPaths =
    changeScope.trackingMode === 'unavailable'
      ? []
      : await collectGitChangedPaths(workspaceRoot);
  const committedPaths = changeScope.baselineRevision
    ? await collectGitChangedPathsSince(
        workspaceRoot,
        changeScope.baselineRevision,
      )
    : [];
  const currentStates = await captureSkoposTaskPathStates({
    workspaceRoot,
    paths: [...dirtyPaths, ...committedPaths],
  });
  const baselineByPath = new Map(
    changeScope.baselineDirtyPaths.map((entry) => [entry.path, entry.digest]),
  );
  const changedPaths: string[] = [];
  const ignoredPreExistingPaths: string[] = [];

  for (const current of currentStates) {
    const baselineDigest = baselineByPath.get(current.path);
    if (
      pathIsDeclaredOwned(current.path, changeScope.declaredOwnedPaths) ||
      baselineDigest === undefined ||
      baselineDigest !== current.digest
    ) {
      changedPaths.push(current.path);
    } else {
      ignoredPreExistingPaths.push(current.path);
    }
  }

  return {
    changedPaths,
    ignoredPreExistingPaths,
  };
};

export const captureSkoposTaskPathStates = async ({
  workspaceRoot,
  paths,
}: {
  workspaceRoot: string;
  paths: string[];
}): Promise<SkoposTaskPathState[]> =>
  Promise.all(
    [...new Set(paths.map((path) => normalizeWorkspacePath(workspaceRoot, path)))]
      .sort()
      .map(async (path) => ({
        path,
        digest: await digestWorkspacePath(workspaceRoot, path),
      })),
  );

export const digestSkoposTaskPathStates = (
  states: SkoposTaskPathState[],
): string =>
  createHash('sha256')
    .update(states.map((entry) => `${entry.path}\0${entry.digest}`).join('\n'))
    .digest('hex');

const digestWorkspacePath = async (
  workspaceRoot: string,
  workspacePath: string,
): Promise<string> => {
  try {
    const contents = await readFile(resolve(workspaceRoot, workspacePath));
    return createHash('sha256')
      .update('file\0')
      .update(contents.toString('base64'))
      .digest('hex');
  } catch {
    return createHash('sha256').update('missing').digest('hex');
  }
};

const normalizeDeclaredPaths = (
  workspaceRoot: string,
  paths: string[],
): string[] => {
  const normalizedPaths = paths
    .map((path) => normalizeWorkspacePath(workspaceRoot, path))
    .map((path) => path.replace(/\/\*\*$/, '').replace(/\/\*$/, ''))
    .filter((path) => path.length > 0);
  const outsidePath = normalizedPaths.find(
    (path) => path === '..' || path.startsWith('../'),
  );

  if (outsidePath) {
    throw new Error(
      `Task-owned path must stay inside the workspace: ${outsidePath}.`,
    );
  }

  return [...new Set(normalizedPaths)].sort();
};

const normalizeWorkspacePath = (
  workspaceRoot: string,
  path: string,
): string => relative(resolve(workspaceRoot), resolve(workspaceRoot, path)) || '.';

const pathIsDeclaredOwned = (
  path: string,
  declaredOwnedPaths: string[],
): boolean =>
  declaredOwnedPaths.some(
    (ownedPath) =>
      ownedPath === '.' ||
      path === ownedPath ||
      path.startsWith(`${ownedPath}/`),
  );
