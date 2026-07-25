import { dirname, join, resolve } from 'node:path';

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
import {
  resolveTaskProgramBriefArtifactPath,
  resolveTaskProgramStateArtifactPath,
  resolveTaskQuestionsArtifactPath,
  resolveTaskRecommendationsArtifactPath,
} from '../workflow-router/workflow-router-state.service.js';

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
  const authorityStatePath = artifact.taskIdentity
    ? resolveTaskProgramStateArtifactPath(workspaceRoot, artifact.taskIdentity)
    : statePath;
  const stateWrite = await writeJsonArtifact({
    artifactPath: authorityStatePath,
    artifact,
    dryRun,
  });
  if (authorityStatePath !== statePath) {
    await writeJsonArtifact({
      artifactPath: statePath,
      artifact,
      dryRun,
    });
  }
  const summary = buildProgramSyncSummary({
    currentMission,
    doNowItem,
    doNextItem,
    recommendedAction,
    currentDisposition: artifact.sequence.interruptRecommendation.decision,
  });
  const programBrief = buildSkoposAgentProgramBrief({
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
  });
  const compatibilityProgramBriefPath = join(workspaceRoot, PROGRAM_BRIEF_ARTIFACT_PATH);
  const authorityProgramBriefPath = artifact.taskIdentity
    ? resolveTaskProgramBriefArtifactPath(workspaceRoot, artifact.taskIdentity)
    : compatibilityProgramBriefPath;
  await writeSkoposAgentBrief({
    artifactPath: authorityProgramBriefPath,
    artifact: programBrief,
    dryRun,
  });
  if (authorityProgramBriefPath !== compatibilityProgramBriefPath) {
    await writeSkoposAgentBrief({
      artifactPath: compatibilityProgramBriefPath,
      artifact: programBrief,
      dryRun,
    });
  }
  await refreshSkoposDiscussionResumeArtifacts({
    workspaceRoot,
    dryRun,
  });

  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'program-sync',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary,
    relatedArtifactPaths: [
      authorityStatePath,
      statePath,
      authorityProgramBriefPath,
      compatibilityProgramBriefPath,
    ],
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
    taskState: artifact.taskIdentity
      ? {
          authorityDirectory: dirname(authorityStatePath),
          questionsPath: resolveTaskQuestionsArtifactPath(workspaceRoot, artifact.taskIdentity),
          recommendationsPath: resolveTaskRecommendationsArtifactPath(
            workspaceRoot,
            artifact.taskIdentity,
          ),
          compatibilityQuestionsPath: join(workspaceRoot, '.skopos', 'questions.json'),
          compatibilityRecommendationsPath: join(
            workspaceRoot,
            '.skopos',
            'recommendations.json',
          ),
          programStatePath: authorityStatePath,
          programBriefPath: authorityProgramBriefPath,
          compatibilityProgramStatePath: statePath,
          compatibilityProgramBriefPath,
        }
      : undefined,
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
