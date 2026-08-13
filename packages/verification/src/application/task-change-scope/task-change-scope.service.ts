import { createHash } from 'node:crypto';
import { lstat, readFile, readdir, readlink } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

import type {
  SkoposImpactEntry,
  SkoposTaskChangeScope,
  SkoposTaskPathAttribution,
  SkoposTaskPathMutationAttribution,
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
  currentTaskId?: string;
  linkedChildTaskIds?: string[];
  mutationAttributions?: SkoposTaskPathMutationAttribution[];
  generatedOutputPaths?: string[];
}

export interface SkoposTaskChangedPaths {
  changedPaths: string[];
  ignoredPreExistingPaths: string[];
  excludedOtherTaskPaths: string[];
  externalUnattributedPaths: string[];
  pathAttributions: SkoposTaskPathAttribution[];
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
  currentTaskId,
  linkedChildTaskIds = [],
  mutationAttributions = [],
  generatedOutputPaths = [],
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
  const excludedOtherTaskPaths: string[] = [];
  const externalUnattributedPaths: string[] = [];
  const pathAttributions: SkoposTaskPathAttribution[] = [];
  const latestMutationByPath = selectLatestMutationAttributions({
    workspaceRoot,
    capturedAt: changeScope.capturedAt,
    mutationAttributions,
  });

  for (const current of currentStates) {
    const baselineDigest = baselineByPath.get(current.path);
    if (pathIsDeclaredOwned(current.path, changeScope.declaredOwnedPaths)) {
      changedPaths.push(current.path);
      pathAttributions.push({
        path: current.path,
        kind: 'task-owned',
        reason: 'declared-task-ownership',
        ...(currentTaskId ? { attributedTaskId: currentTaskId } : {}),
      });
      continue;
    }

    if (pathIsDeclaredOwned(current.path, generatedOutputPaths)) {
      changedPaths.push(current.path);
      pathAttributions.push({
        path: current.path,
        kind: 'task-attributed',
        reason: 'generated-output',
        ...(currentTaskId ? { attributedTaskId: currentTaskId } : {}),
      });
      continue;
    }

    if (
      currentTaskId &&
      linkedChildTaskIds.some((taskId) => isTaskOwnedProjection(current.path, taskId))
    ) {
      changedPaths.push(current.path);
      pathAttributions.push({
        path: current.path,
        kind: 'task-attributed',
        reason: 'linked-child-projection',
        attributedTaskId: currentTaskId,
      });
      continue;
    }

    const latestMutation = latestMutationByPath.get(current.path);
    if (latestMutation?.digest === current.digest) {
      if (currentTaskId && latestMutation.taskId === currentTaskId) {
        changedPaths.push(current.path);
        pathAttributions.push({
          path: current.path,
          kind: 'task-attributed',
          reason: 'current-task-mutation',
          attributedTaskId: latestMutation.taskId,
        });
      } else {
        excludedOtherTaskPaths.push(current.path);
        pathAttributions.push({
          path: current.path,
          kind: 'other-task',
          reason: 'other-task-mutation',
          attributedTaskId: latestMutation.taskId,
        });
      }
      continue;
    }

    if (baselineDigest === current.digest) {
      ignoredPreExistingPaths.push(current.path);
      pathAttributions.push({
        path: current.path,
        kind: 'pre-existing',
        reason: 'unchanged-admission-baseline',
      });
      continue;
    }

    externalUnattributedPaths.push(current.path);
    pathAttributions.push({
      path: current.path,
      kind: 'external-unattributed',
      reason: 'unattributed-post-admission-change',
    });
  }

  return {
    changedPaths,
    ignoredPreExistingPaths,
    excludedOtherTaskPaths,
    externalUnattributedPaths,
    pathAttributions,
  };
};

const selectLatestMutationAttributions = ({
  workspaceRoot,
  capturedAt,
  mutationAttributions,
}: {
  workspaceRoot: string;
  capturedAt: string;
  mutationAttributions: SkoposTaskPathMutationAttribution[];
}): Map<string, SkoposTaskPathMutationAttribution> => {
  const latestByPath = new Map<string, SkoposTaskPathMutationAttribution>();

  for (const attribution of mutationAttributions) {
    if (attribution.attributedAt < capturedAt) continue;
    const path = normalizeWorkspacePath(workspaceRoot, attribution.path);
    const current = latestByPath.get(path);
    if (!current || current.attributedAt < attribution.attributedAt) {
      latestByPath.set(path, { ...attribution, path });
    }
  }

  return latestByPath;
};

export const captureSkoposTaskPathStates = async ({
  workspaceRoot,
  paths,
  ignoredTaskId,
}: {
  workspaceRoot: string;
  paths: string[];
  ignoredTaskId?: string;
}): Promise<SkoposTaskPathState[]> =>
  Promise.all(
    [...new Set(paths.map((path) => normalizeWorkspacePath(workspaceRoot, path)))]
      .sort()
      .map(async (path) => ({
        path,
        digest: await digestWorkspacePath(workspaceRoot, path, ignoredTaskId),
      })),
  );

export const digestSkoposTaskPathStates = (
  states: SkoposTaskPathState[],
): string =>
  createHash('sha256')
    .update(states.map((entry) =>
      `${normalizePortableWorkspacePath(entry.path)}\0${entry.digest}`
    ).join('\n'))
    .digest('hex');

const digestWorkspacePath = async (
  workspaceRoot: string,
  workspacePath: string,
  ignoredTaskId?: string,
): Promise<string> => {
  try {
    const absolutePath = resolve(workspaceRoot, workspacePath);
    const info = await lstat(absolutePath);
    if (info.isDirectory()) {
      return digestWorkspaceDirectory(absolutePath, workspacePath, ignoredTaskId);
    }
    if (info.isSymbolicLink()) {
      return createHash('sha256')
        .update('symlink\0')
        .update(await readlink(absolutePath))
        .digest('hex');
    }
    const contents = await readFile(absolutePath);
    return createHash('sha256')
      .update('file\0')
      .update(contents.toString('base64'))
      .digest('hex');
  } catch {
    return createHash('sha256').update('missing').digest('hex');
  }
};

const TASK_PATH_DIGEST_EXCLUDES = new Set(['.git', '.skopos', 'node_modules']);

const digestWorkspaceDirectory = async (
  directory: string,
  workspacePath: string,
  ignoredTaskId?: string,
): Promise<string> => {
  const entries = await listDirectoryDigestEntries(
    directory,
    workspacePath === '.' ? '' : workspacePath,
    '',
    ignoredTaskId,
  );
  return createHash('sha256')
    .update('directory\0')
    .update(entries.map((entry) => `${entry.path}\0${entry.digest}`).join('\n'))
    .digest('hex');
};

const listDirectoryDigestEntries = async (
  directory: string,
  workspacePrefix: string,
  current = '',
  ignoredTaskId?: string,
): Promise<Array<{ path: string; digest: string }>> => {
  const entries = await readdir(current ? join(directory, current) : directory, {
    withFileTypes: true,
  });
  const result: Array<{ path: string; digest: string }> = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (TASK_PATH_DIGEST_EXCLUDES.has(entry.name)) continue;
    const path = current ? `${current}/${entry.name}` : entry.name;
    const projectPath = workspacePrefix ? `${workspacePrefix}/${path}` : path;
    if (ignoredTaskId && isTaskOwnedProjection(projectPath, ignoredTaskId)) continue;
    const absolutePath = join(directory, path);
    if (entry.isDirectory()) {
      result.push(...await listDirectoryDigestEntries(
        directory,
        workspacePrefix,
        path,
        ignoredTaskId,
      ));
    } else if (entry.isSymbolicLink()) {
      result.push({
        path,
        digest: createHash('sha256')
          .update('symlink\0')
          .update(await readlink(absolutePath))
          .digest('hex'),
      });
    } else {
      result.push({
        path,
        digest: createHash('sha256')
          .update('file\0')
          .update((await readFile(absolutePath)).toString('base64'))
          .digest('hex'),
      });
    }
  }
  return result;
};

const isTaskOwnedProjection = (path: string, taskId: string): boolean =>
  new RegExp(
    `(?:^|/)work/(?:archive/)?tasks/${escapeRegExp(taskId)}-[^/]+\\.md$|` +
    `(?:^|/)work/tasks/snapshots/${escapeRegExp(taskId)}-S-[^/]+\\.json$`,
    'u',
  ).test(path);

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');

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
): string => normalizePortableWorkspacePath(
  relative(
    resolve(workspaceRoot),
    resolve(workspaceRoot, normalizePortableWorkspacePath(path)),
  ) || '.',
);

const normalizePortableWorkspacePath = (path: string): string =>
  path.replaceAll('\\', '/');

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
