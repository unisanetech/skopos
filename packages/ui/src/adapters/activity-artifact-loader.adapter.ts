import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import type {
  SkoposActionRunArtifact,
  SkoposOperationalLogEntry,
  SkoposTaskArtifact,
} from '@skopos/model';

export interface LoadedActivityArtifacts {
  tasks: SkoposTaskArtifact[];
  actionRuns: SkoposActionRunArtifact[];
  operationalLog: SkoposOperationalLogEntry[];
}

export const loadSkoposActivityArtifacts = async (
  workspaceRoot: string,
): Promise<LoadedActivityArtifacts> => ({
  tasks: await loadJsonArtifacts<SkoposTaskArtifact>(
    join(workspaceRoot, '.skopos/tasks'),
    true,
    (name) => name === 'task.json',
  ),
  actionRuns: await loadJsonArtifacts<SkoposActionRunArtifact>(
    join(workspaceRoot, '.skopos/runs'),
    false,
  ),
  operationalLog: await loadJsonLinesArtifacts<SkoposOperationalLogEntry>(
    join(workspaceRoot, '.skopos/runs/operations.jsonl'),
  ),
});

const loadJsonArtifacts = async <T>(
  directoryPath: string,
  recursive: boolean,
  include: (name: string) => boolean = (name) => name.endsWith('.json'),
): Promise<T[]> => {
  const paths = await collectJsonPaths(directoryPath, recursive, include);
  return Promise.all(
    paths.map(async (path) => JSON.parse(await readFile(path, 'utf8')) as T),
  );
};

const collectJsonPaths = async (
  directoryPath: string,
  recursive: boolean,
  include: (name: string) => boolean,
): Promise<string[]> => {
  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });
    return (
      await Promise.all(
        entries.map((entry) => {
          const path = join(directoryPath, entry.name);
          if (recursive && entry.isDirectory()) {
            return collectJsonPaths(path, true, include);
          }
          return entry.isFile() && include(entry.name) ? [path] : [];
        }),
      )
    ).flat();
  } catch {
    return [];
  }
};

const loadJsonLinesArtifacts = async <T>(filePath: string): Promise<T[]> => {
  try {
    return (await readFile(filePath, 'utf8'))
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as T);
  } catch {
    return [];
  }
};
