import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import type { SkoposMissionArtifact } from '@skopos/model';

export const loadMissionArtifact = async (
  workspaceRoot: string,
  mission: string,
): Promise<SkoposMissionArtifact> => {
  const missionPath = resolveMissionPath(workspaceRoot, mission);
  const contents = await readFile(missionPath, 'utf8');

  return JSON.parse(contents) as SkoposMissionArtifact;
};

export const loadMissionArtifacts = async (
  workspaceRoot: string,
): Promise<SkoposMissionArtifact[]> => {
  const missionsRoot = join(workspaceRoot, '.skopos', 'missions');

  try {
    const entries = await readdir(missionsRoot, { withFileTypes: true });
    const missionFilePaths = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map((entry) => join(missionsRoot, entry.name))
      .sort();

    return Promise.all(
      missionFilePaths.map(async (missionPath) =>
        JSON.parse(await readFile(missionPath, 'utf8')) as SkoposMissionArtifact,
      ),
    );
  } catch {
    return [];
  }
};

const resolveMissionPath = (workspaceRoot: string, mission: string): string => {
  if (mission.endsWith('.json') || mission.includes('/')) {
    return resolve(workspaceRoot, mission);
  }

  return join(workspaceRoot, '.skopos', 'missions', `${mission}.json`);
};
