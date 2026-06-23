import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import type { SkoposGraphArtifact } from '@skopos/model';

import type { LoadedSkoposGraphArtifact } from '../contracts/skopos-ui-graph-view.js';

export const loadSkoposGraphArtifacts = async (
  workspaceRoot: string,
): Promise<LoadedSkoposGraphArtifact[]> => {
  const graphDir = join(resolve(workspaceRoot), '.skopos', 'graph');

  try {
    const entries = await readdir(graphDir);
    const artifacts = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map(async (entry) => {
          const artifactPath = join(graphDir, entry);
          const contents = await readFile(artifactPath, 'utf8');
          return {
            artifactPath,
            graph: JSON.parse(contents) as SkoposGraphArtifact,
          };
        }),
    );

    return artifacts.sort((left, right) => sortGraphArtifacts(left.graph, right.graph));
  } catch {
    return [];
  }
};

const sortGraphArtifacts = (left: SkoposGraphArtifact, right: SkoposGraphArtifact): number => {
  const kindOrder: Record<SkoposGraphArtifact['graphKind'], number> = {
    workspace: 0,
    docs: 1,
    commands: 2,
    'scope-relations': 3,
    impact: 4,
    mission: 5,
  };

  if (kindOrder[left.graphKind] !== kindOrder[right.graphKind]) {
    return kindOrder[left.graphKind] - kindOrder[right.graphKind];
  }

  return left.id.localeCompare(right.id);
};
