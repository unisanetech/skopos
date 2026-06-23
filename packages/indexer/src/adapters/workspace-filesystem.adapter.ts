import { access, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const IGNORED_DIRS = new Set([
  '.git',
  '.next',
  '.skopos',
  '.tmp',
  '.turbo',
  'coverage',
  'dist',
  'node_modules',
]);

export const findFilesNamed = async (root: string, fileName: string): Promise<string[]> => {
  const results: string[] = [];

  const visit = async (dir: string): Promise<void> => {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) {
          await visit(join(dir, entry.name));
        }
        continue;
      }

      if (entry.isFile() && entry.name === fileName) {
        results.push(join(dir, entry.name));
      }
    }
  };

  await visit(root);

  return results.sort();
};

export const listFilesUnder = async (
  root: string,
  extensions: string[] = [],
): Promise<string[]> => {
  if (!(await pathExists(root))) {
    return [];
  }

  const results: string[] = [];
  const normalizedExtensions = extensions.map((extension) => extension.toLowerCase());

  const visit = async (dir: string): Promise<void> => {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) {
          await visit(entryPath);
        }
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (
        normalizedExtensions.length === 0 ||
        normalizedExtensions.some((extension) => entry.name.toLowerCase().endsWith(extension))
      ) {
        results.push(entryPath);
      }
    }
  };

  await visit(root);

  return results.sort();
};

export const pathExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch (error) {
    if (isMissingFileError(error)) {
      return false;
    }

    throw error;
  }
};

export const readJsonFile = async <TValue>(filePath: string): Promise<TValue | null> => {
  try {
    const contents = await readFile(filePath, 'utf8');
    return JSON.parse(contents) as TValue;
  } catch (error) {
    if (isMissingFileError(error)) {
      return null;
    }

    throw error;
  }
};

export const readTextFile = async (filePath: string): Promise<string | null> => {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if (isMissingFileError(error)) {
      return null;
    }

    throw error;
  }
};

export const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error.code === 'ENOENT' || error.code === 'ENOTDIR');
