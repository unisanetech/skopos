import { createHash } from 'node:crypto';
import type { Dirent, Stats } from 'node:fs';
import { lstat, readFile, readdir, readlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import type { SkoposSourceDependencyKind } from '@skopos/model';

export const buildSkoposSourceDependencyDigest = async (
  cwd: string,
  dependencyPath: string,
  kind?: SkoposSourceDependencyKind,
): Promise<string> => {
  const absolutePath = resolve(cwd, dependencyPath);
  const hash = createHash('sha256');
  hash.update(dependencyPath.replaceAll('\\', '/'));
  hash.update('\0');

  let sourceStat: Stats;
  try {
    sourceStat = await lstat(absolutePath);
  } catch (error) {
    if (!isMissingSourcePathError(error)) {
      throw error;
    }

    hash.update('missing');
    return `sha256:${hash.digest('hex')}`;
  }

  if (sourceStat.isSymbolicLink()) {
    hash.update('symlink\0');
    hash.update(await readlink(absolutePath));
    return `sha256:${hash.digest('hex')}`;
  }

  if (sourceStat.isFile()) {
    hash.update('file\0');
    hash.update((await readFile(absolutePath)).toString('base64'));
    return `sha256:${hash.digest('hex')}`;
  }

  if (sourceStat.isDirectory()) {
    if (kind === 'memory-root') {
      hash.update('memory-root-directory\0');
      await hashMemoryRootDirectory(hash, absolutePath, '');
      return `sha256:${hash.digest('hex')}`;
    }

    hash.update('directory\0');
    const entries = (await readdir(absolutePath, { withFileTypes: true })).sort((left, right) =>
      compareSourceEntryNames(left.name, right.name),
    );

    for (const entry of entries) {
      hash.update(entry.name);
      hash.update('\0');
      hash.update(sourceDirectoryEntryKind(entry));
      hash.update('\0');

      if (entry.isSymbolicLink()) {
        hash.update(await readlink(join(absolutePath, entry.name)));
        hash.update('\0');
      }
    }

    return `sha256:${hash.digest('hex')}`;
  }

  hash.update('other');
  return `sha256:${hash.digest('hex')}`;
};

const hashMemoryRootDirectory = async (
  hash: ReturnType<typeof createHash>,
  directoryPath: string,
  relativePath: string,
): Promise<void> => {
  const entries = (await readdir(directoryPath, { withFileTypes: true })).sort((left, right) =>
    compareSourceEntryNames(left.name, right.name),
  );

  for (const entry of entries) {
    if (entry.isDirectory() && MEMORY_ROOT_IGNORED_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const entryRelativePath = relativePath
      ? `${relativePath}/${entry.name}`
      : entry.name;
    const entryPath = join(directoryPath, entry.name);
    hash.update(entryRelativePath);
    hash.update('\0');
    hash.update(sourceDirectoryEntryKind(entry));
    hash.update('\0');

    if (entry.isDirectory()) {
      await hashMemoryRootDirectory(hash, entryPath, entryRelativePath);
    } else if (entry.isFile()) {
      if (isProjectMemoryContentFile(entry.name)) {
        hash.update((await readFile(entryPath)).toString('base64'));
      } else {
        hash.update('entry-only');
      }
      hash.update('\0');
    } else if (entry.isSymbolicLink()) {
      hash.update(await readlink(entryPath));
      hash.update('\0');
    }
  }
};

const MEMORY_ROOT_IGNORED_DIRECTORIES = new Set([
  '.git',
  '.skopos',
  'dist',
  'node_modules',
]);

const isProjectMemoryContentFile = (name: string): boolean => {
  const normalized = name.toLowerCase();
  return normalized.endsWith('.md') || normalized.endsWith('.mdx');
};

const sourceDirectoryEntryKind = (entry: Dirent): string => {
  if (entry.isFile()) {
    return 'file';
  }
  if (entry.isDirectory()) {
    return 'directory';
  }
  if (entry.isSymbolicLink()) {
    return 'symlink';
  }
  return 'other';
};

const compareSourceEntryNames = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const isMissingSourcePathError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error.code === 'ENOENT' || error.code === 'ENOTDIR');
