import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import type {
  SkoposProjectArtifact,
  SkoposProjectSourceFile,
  SkoposRootConfig,
} from '@skopos/model';
import { buildSkoposProjectArtifact } from '@skopos/verification';

import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export const PROJECT_ARTIFACT_PATH = '.skopos/project.json';

export const writeSkoposProjectArtifact = async ({
  workspaceRoot: providedWorkspaceRoot,
  dryRun = false,
  config: providedConfig,
}: {
  workspaceRoot: string;
  dryRun?: boolean;
  config?: SkoposRootConfig;
}): Promise<{
  projectPath: string;
  write: 'written' | 'dry-run';
  artifact: SkoposProjectArtifact;
}> => {
  const workspaceRoot = resolve(providedWorkspaceRoot);
  const configPath = join(workspaceRoot, 'skopos.config.yaml');
  const config = providedConfig ?? await loadSkoposConfig(configPath);
  if (!config) {
    throw new Error('Cannot compile .skopos/project.json without skopos.config.yaml.');
  }

  const trackedRoots = [
    'skopos.config.yaml',
    config.agents.canonicalInstructions,
    'tools/skopos',
    config.docs.root,
  ];
  const sourceState = await buildProjectSourceState({
    workspaceRoot,
    trackedRoots,
  });
  const artifact = buildSkoposProjectArtifact({
    projectName: config.project.name,
    instructionsPath: config.agents.canonicalInstructions,
    docsRoot: config.docs.root,
    trackedRoots,
    sourceState,
  });
  const projectPath = join(workspaceRoot, PROJECT_ARTIFACT_PATH);
  const write = await writeJsonArtifact({
    artifactPath: projectPath,
    artifact,
    dryRun,
  });

  return { projectPath, write, artifact };
};

const buildProjectSourceState = async ({
  workspaceRoot,
  trackedRoots,
}: {
  workspaceRoot: string;
  trackedRoots: string[];
}): Promise<SkoposProjectArtifact['sourceState']> => {
  const files: SkoposProjectSourceFile[] = [];
  const missingRoots: string[] = [];

  for (const trackedRoot of [...new Set(trackedRoots)].sort()) {
    const rootFiles = await listSourceFiles(resolve(workspaceRoot, trackedRoot));
    if (rootFiles === null) {
      missingRoots.push(trackedRoot);
      continue;
    }

    for (const filePath of rootFiles) {
      const path = relative(workspaceRoot, filePath).split('\\').join('/');
      const contents = await readFile(filePath);
      files.push({
        path,
        digest: createHash('sha256').update(contents.toString('base64')).digest('hex'),
      });
    }
  }

  files.sort((left, right) => left.path.localeCompare(right.path));
  missingRoots.sort();
  const digest = createHash('sha256');
  for (const file of files) {
    digest.update(`file\0${file.path}\0${file.digest}\n`);
  }
  for (const missingRoot of missingRoots) {
    digest.update(`missing\0${missingRoot}\n`);
  }

  return {
    algorithm: 'sha256',
    digest: digest.digest('hex'),
    files,
    missingRoots,
  };
};

const listSourceFiles = async (rootPath: string): Promise<string[] | null> => {
  try {
    const entries = await readdir(rootPath, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      const entryPath = join(rootPath, entry.name);
      if (entry.isDirectory()) {
        files.push(...((await listSourceFiles(entryPath)) ?? []));
      } else if (entry.isFile()) {
        files.push(entryPath);
      }
    }
    return files;
  } catch (error) {
    if (isNotDirectoryError(error)) {
      try {
        await readFile(rootPath);
        return [rootPath];
      } catch (fileError) {
        if (isMissingFileError(fileError)) return null;
        throw fileError;
      }
    }
    if (isMissingFileError(error)) return null;
    throw error;
  }
};

const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  error.code === 'ENOENT';

const isNotDirectoryError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  error.code === 'ENOTDIR';
