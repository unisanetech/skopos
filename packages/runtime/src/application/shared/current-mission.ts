import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { SkoposMissionArtifact, SkoposWorkflowQuestionArtifact } from '@skopos/model';
import {
  resolveSkoposWorkspaceIdentity,
  taskIdentityMatchesWorkspace,
} from '@skopos/trust';

import { loadSkoposMissionRuntime } from '../mission/mission.service.js';

export const resolveCurrentMissionRuntime = async ({
  workspaceRoot,
  mission,
  actorId,
  questions,
  recommendations,
}: {
  workspaceRoot: string;
  mission?: string;
  actorId?: string;
  questions?: SkoposWorkflowQuestionArtifact;
  recommendations?: { generatedForMissionId?: string };
}): Promise<SkoposMissionArtifact> => {
  const workspaceIdentity = await resolveSkoposWorkspaceIdentity(workspaceRoot);
  if (mission) {
    const explicitMission = await loadSkoposMissionRuntime({
      cwd: workspaceRoot,
      mission,
    });
    assertMissionMatchesWorkspace(explicitMission, workspaceIdentity);
    return explicitMission;
  }

  const candidateMissionIds = [
    questions?.generatedForMissionId,
    recommendations?.generatedForMissionId,
  ].filter((entry): entry is string => Boolean(entry));

  for (const missionId of candidateMissionIds) {
    try {
      const candidate = await loadSkoposMissionRuntime({
        cwd: workspaceRoot,
        mission: missionId,
      });
      assertMissionMatchesWorkspace(candidate, workspaceIdentity);
      return candidate;
    } catch {
      continue;
    }
  }

  const missions = await loadMissionArtifacts(workspaceRoot);
  const identityMatchedMissions = missions.filter(
    (entry) =>
      entry.taskIdentity &&
      taskIdentityMatchesWorkspace({
        taskIdentity: entry.taskIdentity,
        workspace: workspaceIdentity,
      }),
  );
  const legacyMissions = missions.filter((entry) => !entry.taskIdentity);
  const currentCandidateMissions = filterSupersededActiveMissions(
    identityMatchedMissions.length > 0 ? identityMatchedMissions : legacyMissions,
  );
  const activeClaimedMissions = currentCandidateMissions
    .filter(
      (entry) =>
        entry.state === 'active' &&
        Boolean(entry.coordination.claimedBy?.actorId) &&
        (actorId ? entry.coordination.claimedBy?.actorId === actorId : true),
    )
    .sort(sortMissionsByUpdatedAtDesc);
  if (activeClaimedMissions.length > 0) {
    return activeClaimedMissions[0];
  }

  const activeMissions = currentCandidateMissions
    .filter((entry) => entry.state === 'active')
    .sort(sortMissionsByUpdatedAtDesc);
  if (activeMissions.length > 0) {
    return activeMissions[0];
  }

  throw new Error('No active mission could be resolved. Pass --mission <id> or start new work first.');
};

const assertMissionMatchesWorkspace = (
  mission: SkoposMissionArtifact,
  workspace: Awaited<ReturnType<typeof resolveSkoposWorkspaceIdentity>>,
): void => {
  if (
    mission.taskIdentity &&
    !taskIdentityMatchesWorkspace({ taskIdentity: mission.taskIdentity, workspace })
  ) {
    throw new Error(
      `Mission ${mission.id} belongs to branch ${mission.taskIdentity.branch ?? '(detached)'} in worktree ${mission.taskIdentity.worktreeId}, not the current branch/worktree.`,
    );
  }
};

const loadMissionArtifacts = async (workspaceRoot: string): Promise<SkoposMissionArtifact[]> => {
  const missionsRoot = join(workspaceRoot, '.skopos', 'missions');

  try {
    const entries = await readdir(missionsRoot, { withFileTypes: true });
    const missionPaths = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map((entry) => join(missionsRoot, entry.name));

    return Promise.all(
      missionPaths.map(async (missionPath) =>
        JSON.parse(await readFile(missionPath, 'utf8')) as SkoposMissionArtifact,
      ),
    );
  } catch {
    return [];
  }
};

const sortMissionsByUpdatedAtDesc = (
  left: SkoposMissionArtifact,
  right: SkoposMissionArtifact,
): number => {
  const leftUpdatedAt = Date.parse(left.updatedAt ?? left.generatedAt ?? '1970-01-01T00:00:00.000Z');
  const rightUpdatedAt = Date.parse(
    right.updatedAt ?? right.generatedAt ?? '1970-01-01T00:00:00.000Z',
  );

  return rightUpdatedAt - leftUpdatedAt;
};

const filterSupersededActiveMissions = (
  missions: SkoposMissionArtifact[],
): SkoposMissionArtifact[] => {
  const latestCompletedMissionByIdentity = new Map<string, SkoposMissionArtifact>();

  for (const mission of missions) {
    if (mission.state !== 'complete') {
      continue;
    }

    const missionIdentity = buildMissionIdentity(mission);
    const currentLatest = latestCompletedMissionByIdentity.get(missionIdentity);
    if (!currentLatest || sortMissionsByUpdatedAtDesc(currentLatest, mission) > 0) {
      latestCompletedMissionByIdentity.set(missionIdentity, mission);
    }
  }

  return missions.filter((mission) => {
    if (mission.state !== 'active') {
      return true;
    }

    const latestCompleted = latestCompletedMissionByIdentity.get(buildMissionIdentity(mission));
    if (!latestCompleted) {
      return true;
    }

    return sortMissionsByUpdatedAtDesc(mission, latestCompleted) <= 0;
  });
};

const buildMissionIdentity = (mission: SkoposMissionArtifact): string =>
  [mission.title, mission.objective, mission.summary]
    .map((entry) => normalizeMissionIdentityPart(entry))
    .filter((entry) => entry.length > 0)
    .join(' | ');

const normalizeMissionIdentityPart = (value: string | undefined): string =>
  (value ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
