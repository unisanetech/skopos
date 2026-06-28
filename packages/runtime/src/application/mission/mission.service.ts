import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { buildSkoposMissionGraph } from '@skopos/planner';
import type {
  SkoposMissionArtifact,
  SkoposMissionSliceLink,
  SkoposMissionSliceRunResult,
  SkoposPlanArtifact,
} from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import { buildSkoposPlanRuntime } from '../plan/plan.service.js';

export interface LoadSkoposMissionRuntimeOptions {
  cwd: string;
  mission: string;
}

export interface MutateSkoposMissionRuntimeOptions extends LoadSkoposMissionRuntimeOptions {
  actor?: string;
  force?: boolean;
}

export interface SliceSkoposMissionRuntimeOptions extends MutateSkoposMissionRuntimeOptions {
  goal: string;
  scope?: string;
  claim?: boolean;
}

export interface CompleteSkoposMissionItemRuntimeOptions extends MutateSkoposMissionRuntimeOptions {
  itemId: string;
}

export type ClaimSkoposMissionRuntimeOptions = MutateSkoposMissionRuntimeOptions;
export type ReleaseSkoposMissionRuntimeOptions = MutateSkoposMissionRuntimeOptions;
export type CompleteSkoposMissionRuntimeOptions = MutateSkoposMissionRuntimeOptions;
export type CompleteSkoposMissionItemRuntimeRunOptions = CompleteSkoposMissionItemRuntimeOptions;
export type SliceSkoposMissionRuntimeRunOptions = SliceSkoposMissionRuntimeOptions;

export const loadSkoposMissionRuntime = async ({
  cwd,
  mission,
}: LoadSkoposMissionRuntimeOptions): Promise<SkoposMissionArtifact> => {
  const missionPath = resolveMissionPath(resolve(cwd), mission);
  const contents = await readFile(missionPath, 'utf8');

  return JSON.parse(contents) as SkoposMissionArtifact;
};

export const claimSkoposMissionRuntime = async ({
  cwd,
  mission,
  actor,
  force = false,
}: ClaimSkoposMissionRuntimeOptions): Promise<SkoposMissionArtifact> => {
  const workspaceRoot = resolve(cwd);
  const missionPath = resolveMissionPath(workspaceRoot, mission);
  const existingMission = await loadSkoposMissionRuntime({
    cwd: workspaceRoot,
    mission,
  });
  const actorId = requireMissionActorId(actor);
  const activeClaim = existingMission.coordination.claimedBy;

  if (existingMission.state === 'complete') {
    throw new Error(`Mission ${existingMission.id} is already complete and cannot be claimed.`);
  }

  if (activeClaim && activeClaim.actorId !== actorId && !force) {
    throw new Error(
      `Mission ${existingMission.id} is currently claimed by ${activeClaim.actorId}. Re-run with --actor ${activeClaim.actorId} or use --force to transfer the claim.`,
    );
  }

  const claimedAt = new Date().toISOString();
  const claimedMission: SkoposMissionArtifact = {
    ...existingMission,
    state: existingMission.state === 'planned' ? 'active' : existingMission.state,
    updatedAt: claimedAt,
    coordination: {
      claimedBy: {
        actorId,
        claimedAt,
      },
      lastUpdatedBy: actorId,
      lastUpdatedAt: claimedAt,
    },
  };

  await writeMissionArtifact(missionPath, claimedMission);
  const parentSync = await syncParentMissionLinkFromChildMission({
    workspaceRoot,
    mission: claimedMission,
    actorId,
  });
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'mission-claim',
    status: 'succeeded',
    summary: `Mission ${claimedMission.id} claimed by ${actorId}.`,
    relatedArtifactPaths: [missionPath, ...parentSync.relatedArtifactPaths],
    metadata: {
      missionId: claimedMission.id,
      parentMissionId: claimedMission.parentMissionId ?? null,
      actorId,
      forceClaim: force,
      previousActorId: activeClaim?.actorId ?? null,
    },
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
  });

  return claimedMission;
};

export const releaseSkoposMissionRuntime = async ({
  cwd,
  mission,
  actor,
  force = false,
}: ReleaseSkoposMissionRuntimeOptions): Promise<SkoposMissionArtifact> => {
  const workspaceRoot = resolve(cwd);
  const missionPath = resolveMissionPath(workspaceRoot, mission);
  const existingMission = await loadSkoposMissionRuntime({
    cwd: workspaceRoot,
    mission,
  });
  const actorId = requireMissionActorId(actor);
  const activeClaim = existingMission.coordination.claimedBy;

  if (!activeClaim) {
    throw new Error(`Mission ${existingMission.id} is not currently claimed.`);
  }

  if (activeClaim.actorId !== actorId && !force) {
    throw new Error(
      `Mission ${existingMission.id} is currently claimed by ${activeClaim.actorId}. Re-run with --actor ${activeClaim.actorId} or use --force to release it.`,
    );
  }

  const releasedAt = new Date().toISOString();
  const releasedMission: SkoposMissionArtifact = {
    ...existingMission,
    state: existingMission.state === 'complete' ? 'complete' : 'planned',
    updatedAt: releasedAt,
    coordination: {
      lastUpdatedBy: actorId,
      lastUpdatedAt: releasedAt,
    },
  };

  await writeMissionArtifact(missionPath, releasedMission);
  const parentSync = await syncParentMissionLinkFromChildMission({
    workspaceRoot,
    mission: releasedMission,
    actorId,
  });
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'mission-release',
    status: 'succeeded',
    summary: `Mission ${releasedMission.id} released by ${actorId}.`,
    relatedArtifactPaths: [missionPath, ...parentSync.relatedArtifactPaths],
    metadata: {
      missionId: releasedMission.id,
      parentMissionId: releasedMission.parentMissionId ?? null,
      actorId,
      forceRelease: force,
      previousActorId: activeClaim.actorId,
    },
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
  });

  return releasedMission;
};

export const completeSkoposMissionRuntime = async ({
  cwd,
  mission,
  actor,
  force = false,
}: CompleteSkoposMissionRuntimeOptions): Promise<SkoposMissionArtifact> => {
  const workspaceRoot = resolve(cwd);
  const missionPath = resolveMissionPath(workspaceRoot, mission);
  const existingMission = await loadSkoposMissionRuntime({
    cwd: workspaceRoot,
    mission,
  });
  const actorId = resolveMissionActorId(actor);
  const activeClaim = existingMission.coordination.claimedBy;

  if (activeClaim && activeClaim.actorId !== actorId && !force) {
    throw new Error(
      `Mission ${existingMission.id} is currently claimed by ${activeClaim.actorId}. Re-run with --actor ${activeClaim.actorId} or use --force to complete it.`,
    );
  }

  if (force && !actorId && activeClaim) {
    throw new Error(
      `Mission ${existingMission.id} is currently claimed by ${activeClaim.actorId}. Use --actor <id> together with --force to record who is taking over the mission.`,
    );
  }

  const completedAt = new Date().toISOString();
  const completedMission: SkoposMissionArtifact = {
    ...existingMission,
    state: 'complete',
    updatedAt: completedAt,
    items: existingMission.items.map((item) => ({
      ...item,
      status: 'complete',
    })),
    coordination: {
      claimedBy:
        actorId === undefined
          ? activeClaim
          : {
              actorId,
              claimedAt: activeClaim?.claimedAt ?? completedAt,
            },
      lastUpdatedBy: actorId,
      lastUpdatedAt: completedAt,
    },
  };

  await writeMissionArtifact(missionPath, completedMission);
  const parentSync = await syncParentMissionLinkFromChildMission({
    workspaceRoot,
    mission: completedMission,
    actorId,
  });
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'mission-complete',
    status: 'succeeded',
    summary: `Mission ${completedMission.id} marked complete.`,
    relatedArtifactPaths: [missionPath, ...parentSync.relatedArtifactPaths],
    metadata: {
      missionId: completedMission.id,
      parentMissionId: completedMission.parentMissionId ?? null,
      scopeId: completedMission.scope.scope.id,
      itemCount: completedMission.items.length,
      actorId: actorId ?? null,
      forceComplete: force,
    },
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
  });

  return completedMission;
};

export const completeSkoposMissionItemRuntime = async ({
  cwd,
  mission,
  itemId,
  actor,
  force = false,
}: CompleteSkoposMissionItemRuntimeRunOptions): Promise<SkoposMissionArtifact> => {
  const workspaceRoot = resolve(cwd);
  const missionPath = resolveMissionPath(workspaceRoot, mission);
  const existingMission = await loadSkoposMissionRuntime({
    cwd: workspaceRoot,
    mission,
  });
  const actorId = requireMissionActorId(actor);
  const activeClaim = existingMission.coordination.claimedBy;
  const targetItem = existingMission.items.find((item) => item.id === itemId);

  if (!targetItem) {
    throw new Error(`Mission ${existingMission.id} has no checklist item ${itemId}.`);
  }

  if (existingMission.state === 'complete') {
    throw new Error(`Mission ${existingMission.id} is already complete.`);
  }

  if (activeClaim && activeClaim.actorId !== actorId && !force) {
    throw new Error(
      `Mission ${existingMission.id} is currently claimed by ${activeClaim.actorId}. Re-run with --actor ${activeClaim.actorId} or use --force to update the checklist item.`,
    );
  }

  const completedAt = new Date().toISOString();
  const completedMission: SkoposMissionArtifact = {
    ...existingMission,
    state: existingMission.state === 'planned' ? 'active' : existingMission.state,
    updatedAt: completedAt,
    items: existingMission.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            status: 'complete',
          }
        : item,
    ),
    coordination: {
      claimedBy: activeClaim
        ? {
            actorId,
            claimedAt: activeClaim.claimedAt,
          }
        : {
            actorId,
            claimedAt: completedAt,
          },
      lastUpdatedBy: actorId,
      lastUpdatedAt: completedAt,
    },
  };

  await writeMissionArtifact(missionPath, completedMission);
  const parentSync = await syncParentMissionLinkFromChildMission({
    workspaceRoot,
    mission: completedMission,
    actorId,
  });
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'mission-item-complete',
    status: 'succeeded',
    summary: `Mission ${completedMission.id} checklist item ${itemId} marked complete.`,
    relatedArtifactPaths: [missionPath, ...parentSync.relatedArtifactPaths],
    metadata: {
      missionId: completedMission.id,
      parentMissionId: completedMission.parentMissionId ?? null,
      itemId,
      itemKind: targetItem.kind,
      actorId,
      forceComplete: force,
    },
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
  });

  return completedMission;
};

export const sliceSkoposMissionRuntime = async ({
  cwd,
  mission,
  goal,
  scope,
  actor,
  claim = false,
  force = false,
}: SliceSkoposMissionRuntimeRunOptions): Promise<SkoposMissionSliceRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireMissionActorId(actor);
  const parentMissionPath = resolveMissionPath(workspaceRoot, mission);
  const parentMission = await loadSkoposMissionRuntime({
    cwd: workspaceRoot,
    mission,
  });
  const activeClaim = parentMission.coordination.claimedBy;

  if (parentMission.state === 'complete') {
    throw new Error(`Mission ${parentMission.id} is already complete and cannot be sliced.`);
  }

  if (activeClaim && activeClaim.actorId !== actorId && !force) {
    throw new Error(
      `Mission ${parentMission.id} is currently claimed by ${activeClaim.actorId}. Re-run with --actor ${activeClaim.actorId} or use --force to create a linked slice.`,
    );
  }

  const targetScope = resolveSliceScope({
    mission: parentMission,
    requestedScope: scope,
  });
  const parentPlan = await loadSkoposPlanArtifact(workspaceRoot, parentMission.planId);
  const slicePlan = await buildSkoposPlanRuntime({
    cwd: workspaceRoot,
    goal,
    scope: targetScope,
    actor: actorId,
    parentPlanId: parentPlan.id,
    parentMissionId: parentMission.id,
  });
  const sliceMission = claim
    ? await claimSkoposMissionRuntime({
        cwd: workspaceRoot,
        mission: slicePlan.missionId,
        actor: actorId,
      })
    : slicePlan.mission;
  const updatedAt = new Date().toISOString();
  const updatedParentMission = buildUpdatedParentMission({
    mission: parentMission,
    actorId,
    updatedAt,
    transferredClaim: Boolean(activeClaim && activeClaim.actorId !== actorId && force),
    linkedSlice: buildMissionSliceLink({
      plan: slicePlan,
      mission: sliceMission,
    }),
  });
  const parentGraphPath = join(workspaceRoot, '.skopos', 'graph', `${updatedParentMission.id}.json`);
  const parentGraph = buildSkoposMissionGraph({
    workspaceRoot,
    plan: parentPlan,
    mission: updatedParentMission,
  });

  await writeMissionArtifact(parentMissionPath, updatedParentMission);
  const parentGraphWrite = await writeJsonArtifact({
    artifactPath: parentGraphPath,
    artifact: parentGraph,
  });
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'mission-slice',
    status: 'succeeded',
    summary: `Created linked slice ${sliceMission.id} from mission ${updatedParentMission.id}.`,
    relatedArtifactPaths: [
      parentMissionPath,
      parentGraphPath,
      slicePlan.planPath,
      slicePlan.missionPath,
      slicePlan.graphPath,
    ],
    metadata: {
      actorId,
      parentMissionId: updatedParentMission.id,
      parentPlanId: updatedParentMission.planId,
      childMissionId: sliceMission.id,
      childPlanId: slicePlan.planId,
      scopeId: sliceMission.scope.scope.id,
      claimedChildMission: claim,
      forceTransfer: Boolean(activeClaim && activeClaim.actorId !== actorId && force),
    },
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
  });

  return {
    workspaceRoot,
    actorId,
    parentMission: updatedParentMission,
    parentMissionPath,
    parentMissionWrite: 'written',
    parentGraphPath,
    parentGraphWrite,
    slicePlan,
    sliceMission,
  };
};

export const resolveMissionPath = (workspaceRoot: string, mission: string): string => {
  if (mission.endsWith('.json') || mission.includes('/')) {
    return resolve(workspaceRoot, mission);
  }

  return join(workspaceRoot, '.skopos', 'missions', `${mission}.json`);
};

const requireMissionActorId = (actor?: string): string => {
  const actorId = resolveMissionActorId(actor);

  if (!actorId) {
    throw new Error('Missing mission actor id. Pass --actor <id> or set SKOPOS_ACTOR.');
  }

  return actorId;
};

const resolveMissionActorId = (actor?: string): string | undefined => {
  const candidate = actor ?? process.env.SKOPOS_ACTOR;
  if (typeof candidate !== 'string') {
    return undefined;
  }

  const normalized = candidate.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const resolveSliceScope = ({
  mission,
  requestedScope,
}: {
  mission: SkoposMissionArtifact;
  requestedScope?: string;
}): string => {
  const parentScopeId = mission.scope.scope.id;
  const normalizedRequestedScope = requestedScope?.trim();

  if (parentScopeId === 'workspace') {
    if (!normalizedRequestedScope || normalizedRequestedScope === 'workspace') {
      throw new Error(
        `Mission ${mission.id} is workspace-scoped. Pass --scope <scope-id> to create a narrower linked slice.`,
      );
    }
  }

  return normalizedRequestedScope && normalizedRequestedScope.length > 0
    ? normalizedRequestedScope
    : parentScopeId;
};

const buildUpdatedParentMission = ({
  mission,
  actorId,
  updatedAt,
  transferredClaim,
  linkedSlice,
}: {
  mission: SkoposMissionArtifact;
  actorId: string;
  updatedAt: string;
  transferredClaim: boolean;
  linkedSlice: SkoposMissionSliceLink;
}): SkoposMissionArtifact => {
  const linkedSlices = [
    ...(mission.linkedSlices ?? []).filter((entry) => entry.missionId !== linkedSlice.missionId),
  ];
  linkedSlices.push(linkedSlice);

  return {
    ...mission,
    state: mission.state === 'planned' ? 'active' : mission.state,
    updatedAt,
    items: mission.items.map((item) =>
      item.id === 'decision-plan.scope-confirmation' || item.id === 'step-resolve-decisions'
        ? {
            ...item,
            status: 'complete',
          }
        : item,
    ),
    linkedSlices,
    coordination: {
      claimedBy: transferredClaim
        ? {
            actorId,
            claimedAt: updatedAt,
          }
        : mission.coordination.claimedBy,
      lastUpdatedBy: actorId,
      lastUpdatedAt: updatedAt,
    },
  };
};

const buildMissionSliceLink = ({
  plan,
  mission,
}: {
  plan: Awaited<ReturnType<typeof buildSkoposPlanRuntime>>;
  mission: SkoposMissionArtifact;
}): SkoposMissionSliceLink => ({
  planId: plan.planId,
  missionId: mission.id,
  title: mission.title,
  goal: plan.goal,
  scopeId: mission.scope.scope.id,
  scopeTitle: mission.scope.scope.title,
  scopeKind: mission.scope.scope.kind,
  scopePath: mission.scope.scope.path,
  state: mission.state,
  createdAt: mission.generatedAt ?? mission.updatedAt ?? new Date().toISOString(),
  createdByActorId: plan.actorId,
  claimedByActorId: mission.coordination.claimedBy?.actorId,
});

const syncParentMissionLinkFromChildMission = async ({
  workspaceRoot,
  mission,
  actorId,
}: {
  workspaceRoot: string;
  mission: SkoposMissionArtifact;
  actorId?: string;
}): Promise<{ relatedArtifactPaths: string[] }> => {
  if (!mission.parentMissionId) {
    return {
      relatedArtifactPaths: [],
    };
  }

  const parentMissionPath = resolveMissionPath(workspaceRoot, mission.parentMissionId);
  const parentMission = await loadSkoposMissionRuntime({
    cwd: workspaceRoot,
    mission: mission.parentMissionId,
  });
  const matchingLinkedSlice = (parentMission.linkedSlices ?? []).find(
    (entry) => entry.missionId === mission.id,
  );

  if (!matchingLinkedSlice) {
    return {
      relatedArtifactPaths: [],
    };
  }

  const updatedAt = mission.updatedAt ?? new Date().toISOString();
  const updatedParentMission: SkoposMissionArtifact = {
    ...parentMission,
    updatedAt,
    linkedSlices: (parentMission.linkedSlices ?? []).map((entry) =>
      entry.missionId === mission.id
        ? {
            ...entry,
            state: mission.state,
            claimedByActorId: mission.coordination.claimedBy?.actorId,
          }
        : entry,
    ),
    coordination: {
      ...parentMission.coordination,
      lastUpdatedBy: actorId ?? parentMission.coordination.lastUpdatedBy,
      lastUpdatedAt: updatedAt,
    },
  };

  const parentPlan = await loadSkoposPlanArtifact(workspaceRoot, updatedParentMission.planId);
  const parentGraphPath = join(workspaceRoot, '.skopos', 'graph', `${updatedParentMission.id}.json`);
  const parentGraph = buildSkoposMissionGraph({
    workspaceRoot,
    plan: parentPlan,
    mission: updatedParentMission,
  });

  await writeMissionArtifact(parentMissionPath, updatedParentMission);
  await writeJsonArtifact({
    artifactPath: parentGraphPath,
    artifact: parentGraph,
  });

  return {
    relatedArtifactPaths: [parentMissionPath, parentGraphPath],
  };
};

const loadSkoposPlanArtifact = async (
  workspaceRoot: string,
  planId: string,
): Promise<SkoposPlanArtifact> => {
  const planPath = join(workspaceRoot, '.skopos', 'plans', `${planId}.json`);
  const contents = await readFile(planPath, 'utf8');

  return JSON.parse(contents) as SkoposPlanArtifact;
};

const writeMissionArtifact = async (
  missionPath: string,
  mission: SkoposMissionArtifact,
): Promise<void> => {
  await writeJsonArtifact({
    artifactPath: missionPath,
    artifact: mission,
  });
};
