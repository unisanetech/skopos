import { resolve } from 'node:path';

import type { SkoposProgramNextRunResult } from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { buildProgramNextSummary, PROGRAM_STATE_ARTIFACT_PATH } from './program-state.service.js';
import { buildSkoposProgramSyncRuntime } from './program-sync.service.js';

export interface BuildSkoposProgramNextRuntimeOptions {
  cwd: string;
  actor?: string;
  dryRun?: boolean;
}

export const buildSkoposProgramNextRuntime = async ({
  cwd,
  actor,
  dryRun = false,
}: BuildSkoposProgramNextRuntimeOptions): Promise<SkoposProgramNextRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const synced = await buildSkoposProgramSyncRuntime({
    cwd: workspaceRoot,
    actor: actorId,
    dryRun,
  });
  const summary = buildProgramNextSummary({
    recommendedAction: synced.recommendedAction,
    currentDisposition: synced.state.sequence.interruptRecommendation.decision,
  });

  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'program-next',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary,
    relatedArtifactPaths: [synced.statePath],
    metadata: {
      actorId: actorId ?? null,
      currentMissionId: synced.currentMissionId ?? null,
      currentDisposition: synced.state.sequence.interruptRecommendation.decision,
      recommendedItemId: synced.doNowItem?.id ?? null,
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
    statePath: resolve(workspaceRoot, PROGRAM_STATE_ARTIFACT_PATH),
    stateWrite: synced.stateWrite,
    state: synced.state,
    currentDisposition: synced.state.sequence.interruptRecommendation.decision,
    currentMissionId: synced.currentMissionId,
    recommendedItem: synced.doNowItem,
    obligations: synced.state.obligations.filter((entry) => entry.status === 'open'),
    recommendedAction: synced.recommendedAction,
    nextCommand: synced.nextCommand,
  };
};
