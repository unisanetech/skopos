import { join, resolve } from 'node:path';

import type { SkoposProgramSyncRunResult } from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { buildSkoposAgentProgramBrief, writeSkoposAgentBrief } from '../shared/agent-briefs.js';
import { refreshSkoposDiscussionResumeArtifacts } from '../shared/discussion-lifecycle.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { PROGRAM_BRIEF_ARTIFACT_PATH } from '../shared/token-control-constants.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import {
  buildProgramSyncSummary,
  buildSkoposProgramState,
  PROGRAM_STATE_ARTIFACT_PATH,
} from './program-state.service.js';

export interface BuildSkoposProgramSyncRuntimeOptions {
  cwd: string;
  actor?: string;
  dryRun?: boolean;
}

export const buildSkoposProgramSyncRuntime = async ({
  cwd,
  actor,
  dryRun = false,
}: BuildSkoposProgramSyncRuntimeOptions): Promise<SkoposProgramSyncRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const { artifact, currentMission, doNowItem, doNextItem, recommendedAction } =
    await buildSkoposProgramState({
      workspaceRoot,
      actorId,
    });
  const statePath = join(workspaceRoot, PROGRAM_STATE_ARTIFACT_PATH);
  const stateWrite = await writeJsonArtifact({
    artifactPath: statePath,
    artifact,
    dryRun,
  });
  const summary = buildProgramSyncSummary({
    currentMission,
    doNowItem,
    doNextItem,
    recommendedAction,
    currentDisposition: artifact.sequence.interruptRecommendation.decision,
  });
  await writeSkoposAgentBrief({
    artifactPath: join(workspaceRoot, PROGRAM_BRIEF_ARTIFACT_PATH),
    artifact: buildSkoposAgentProgramBrief({
      workspaceRoot,
      result: {
        summary,
        state: artifact,
        currentMissionId: currentMission?.id,
        doNowItem,
        doNextItem,
        recommendedAction,
        nextCommand: recommendedAction?.command,
      },
    }),
    dryRun,
  });
  await refreshSkoposDiscussionResumeArtifacts({
    workspaceRoot,
    dryRun,
  });

  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'program-sync',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary,
    relatedArtifactPaths: [statePath],
    metadata: {
      actorId: actorId ?? null,
      currentMissionId: currentMission?.id ?? null,
      doNowItemId: doNowItem?.id ?? null,
      doNextItemId: doNextItem?.id ?? null,
      openObligationCount: artifact.obligations.filter((entry) => entry.status === 'open').length,
    },
    dryRun,
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
    dryRun,
  });

  return {
    workspaceRoot,
    actorId,
    summary,
    statePath,
    stateWrite,
    state: artifact,
    currentMissionId: currentMission?.id,
    doNowItem,
    doNextItem,
    recommendedAction,
    nextCommand: recommendedAction?.command,
  };
};
