import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type {
  SkoposMissionArtifact,
  SkoposOperationalLogEntry,
  SkoposPlanArtifact,
  SkoposWorkflowRunArtifact,
} from '@skopos/model';

export interface LoadedActivityArtifacts {
  plans: SkoposPlanArtifact[];
  missions: SkoposMissionArtifact[];
  workflowRuns: SkoposWorkflowRunArtifact[];
  operationalLog: SkoposOperationalLogEntry[];
}

export const loadSkoposActivityArtifacts = async (
  workspaceRoot: string,
): Promise<LoadedActivityArtifacts> => ({
  plans: await loadJsonArtifacts<SkoposPlanArtifact>(join(workspaceRoot, '.skopos', 'plans')),
  missions: await loadJsonArtifacts<SkoposMissionArtifact>(
    join(workspaceRoot, '.skopos', 'missions'),
  ),
  workflowRuns: await loadJsonArtifacts<SkoposWorkflowRunArtifact>(
    join(workspaceRoot, '.skopos', 'runs'),
  ),
  operationalLog: await loadJsonLinesArtifacts<SkoposOperationalLogEntry>(
    join(workspaceRoot, '.skopos', 'log.jsonl'),
  ),
});

const loadJsonArtifacts = async <T>(directoryPath: string): Promise<T[]> => {
  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });
    const jsonFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map((entry) => entry.name)
      .sort();
    const artifacts = await Promise.all(
      jsonFiles.map(
        async (fileName) => JSON.parse(await readFile(join(directoryPath, fileName), 'utf8')) as T,
      ),
    );

    return artifacts;
  } catch {
    return [];
  }
};

const loadJsonLinesArtifacts = async <T>(filePath: string): Promise<T[]> => {
  try {
    const content = await readFile(filePath, 'utf8');
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => JSON.parse(line) as T);
  } catch {
    return [];
  }
};
