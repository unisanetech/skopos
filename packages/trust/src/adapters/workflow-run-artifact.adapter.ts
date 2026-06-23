import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import type { SkoposWorkflowRunArtifact } from '@skopos/model';

export const loadWorkflowRunArtifacts = async (
  workspaceRoot: string,
): Promise<SkoposWorkflowRunArtifact[]> => {
  const runsDir = join(workspaceRoot, '.skopos', 'runs');

  try {
    const entries = await readdir(runsDir);
    const artifacts = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map(async (entry) => {
          const filePath = join(runsDir, entry);
          const contents = await readFile(filePath, 'utf8');
          return JSON.parse(contents) as SkoposWorkflowRunArtifact;
        }),
    );

    return artifacts.sort(compareWorkflowRunsDescending);
  } catch {
    return [];
  }
};

export const getLatestChangedAt = async (
  workspaceRoot: string,
  changedPaths: string[],
): Promise<number> => {
  const timestamps = await Promise.all(
    changedPaths.map(async (changedPath) => {
      const absolutePath = resolve(workspaceRoot, changedPath);

      try {
        const fileStat = await stat(absolutePath);
        return fileStat.mtimeMs;
      } catch {
        return Date.now();
      }
    }),
  );

  return timestamps.reduce((latest, current) => Math.max(latest, current), 0);
};

const compareWorkflowRunsDescending = (
  left: SkoposWorkflowRunArtifact,
  right: SkoposWorkflowRunArtifact,
): number => {
  const leftTime = Date.parse(left.finishedAt ?? left.updatedAt ?? left.generatedAt ?? '');
  const rightTime = Date.parse(right.finishedAt ?? right.updatedAt ?? right.generatedAt ?? '');
  return rightTime - leftTime;
};
