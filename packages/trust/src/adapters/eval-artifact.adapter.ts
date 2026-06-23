import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { SkoposEvalArtifact } from '@skopos/model';

export const loadEvalArtifact = async (
  workspaceRoot: string,
  missionId: string,
): Promise<SkoposEvalArtifact | null> => {
  const artifactPath = join(workspaceRoot, '.skopos', 'evals', `${missionId}.json`);

  try {
    const contents = await readFile(artifactPath, 'utf8');
    return JSON.parse(contents) as SkoposEvalArtifact;
  } catch {
    return null;
  }
};
