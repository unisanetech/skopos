import { createHash } from 'node:crypto';
import { lstat, readFile, readdir, readlink } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

export interface BuildSkoposSkillSourceDigestOptions {
  cwd: string;
  sourcePaths: string[];
}

export interface SkoposSkillSourceDigestResult {
  digest: string;
  sourcePaths: string[];
  missingPaths: string[];
}

export interface SkoposCombinedSkillDigestEntry {
  packId: string;
  version: string;
  bindingId: string;
  sourceDigest: string;
  capabilities: {
    actionIds: string[];
    guardIds: string[];
  };
}

export const buildSkoposSkillSourceDigest = async ({
  cwd,
  sourcePaths,
}: BuildSkoposSkillSourceDigestOptions): Promise<SkoposSkillSourceDigestResult> => {
  const workspaceRoot = resolve(cwd);
  const normalizedPaths = [...new Set(sourcePaths)].sort();
  const missingPaths: string[] = [];
  const hash = createHash('sha256');

  for (const sourcePath of normalizedPaths) {
    const absolutePath = resolve(workspaceRoot, sourcePath);
    const entries = await collectDigestEntries(workspaceRoot, absolutePath).catch(
      (error: unknown) => {
        if (isMissingFileError(error)) {
          missingPaths.push(sourcePath);
          return [];
        }
        throw error;
      },
    );
    for (const entry of entries) {
      hash.update(entry.path);
      hash.update('\0');
      hash.update(entry.kind);
      hash.update('\0');
      hash.update(entry.contents);
      hash.update('\0');
    }
  }

  return {
    digest: `sha256:${hash.digest('hex')}`,
    sourcePaths: normalizedPaths,
    missingPaths,
  };
};

export const buildSkoposCombinedSkillSourceDigest = (
  entries: SkoposCombinedSkillDigestEntry[],
): string =>
  `sha256:${createHash('sha256')
    .update(
      JSON.stringify(
        entries.map((entry) => ({
          packId: entry.packId,
          version: entry.version,
          bindingId: entry.bindingId,
          sourceDigest: entry.sourceDigest,
          capabilities: entry.capabilities,
        })),
      ),
    )
    .digest('hex')}`;

interface DigestEntry {
  path: string;
  kind: 'file' | 'symlink';
  contents: string;
}

const collectDigestEntries = async (
  workspaceRoot: string,
  absolutePath: string,
): Promise<DigestEntry[]> => {
  const entryStat = await lstat(absolutePath);
  if (entryStat.isSymbolicLink()) {
    return [
      {
        path: relative(workspaceRoot, absolutePath),
        kind: 'symlink',
        contents: await readlink(absolutePath),
      },
    ];
  }
  if (entryStat.isFile()) {
    return [
      {
        path: relative(workspaceRoot, absolutePath),
        kind: 'file',
        contents: (await readFile(absolutePath)).toString('base64'),
      },
    ];
  }
  if (!entryStat.isDirectory()) return [];

  const entries: DigestEntry[] = [];
  for (const child of (await readdir(absolutePath)).sort()) {
    entries.push(...(await collectDigestEntries(workspaceRoot, join(absolutePath, child))));
  }
  return entries;
};

const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
