import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { SkoposActionRunArtifact } from '@skopos/model';

export const loadActionRunArtifacts = async (
  workspaceRoot: string,
): Promise<SkoposActionRunArtifact[]> => {
  const runsDir = join(workspaceRoot, '.skopos', 'runs');

  try {
    const entries = await readdir(runsDir);
    const artifacts = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map(async (entry) => {
          const filePath = join(runsDir, entry);
          const contents = await readFile(filePath, 'utf8');
          return JSON.parse(contents) as SkoposActionRunArtifact;
        }),
    );

    return artifacts.sort(compareActionRunsDescending);
  } catch {
    return [];
  }
};

const compareActionRunsDescending = (
  left: SkoposActionRunArtifact,
  right: SkoposActionRunArtifact,
): number => {
  const leftTime = Date.parse(left.finishedAt ?? left.updatedAt ?? left.generatedAt ?? '');
  const rightTime = Date.parse(right.finishedAt ?? right.updatedAt ?? right.generatedAt ?? '');
  return rightTime - leftTime;
};
