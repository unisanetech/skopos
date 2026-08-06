import type {
  SkoposDiscussionCheckpointRunResult,
  SkoposDiscussionHandoffRunResult,
  SkoposDiscussionCheckpointPromotionTrigger,
  SkoposTaskIdentity,
  SkoposConversationCapsule,
} from '@skopos/model';

import { refreshSkoposDiscussionCheckpoints } from './discussion-checkpoints.js';
import { refreshSkoposDiscussionHandoff } from './discussion-handoff.js';
import { refreshSkoposAgentPromptBrief } from './agent-briefs.js';
import { refreshSkoposTokenTelemetry } from './token-telemetry.js';

export const refreshSkoposDiscussionResumeArtifacts = async ({
  workspaceRoot,
  taskId,
  taskIdentity,
  conversationCapsule,
  dryRun = false,
}: {
  workspaceRoot: string;
  taskId?: string;
  taskIdentity?: SkoposTaskIdentity;
  conversationCapsule?: SkoposConversationCapsule;
  dryRun?: boolean;
}): Promise<{
  handoff: SkoposDiscussionHandoffRunResult;
}> => {
  const handoff = await refreshSkoposDiscussionHandoff({
    workspaceRoot,
    taskId,
    taskIdentity,
    conversationCapsule,
    dryRun,
  });

  await refreshSkoposAgentPromptBrief({
    workspaceRoot,
    taskIdentity,
    dryRun,
  });
  await refreshSkoposTokenTelemetry({
    workspaceRoot,
    taskIdentity,
    dryRun,
  });

  return {
    handoff: {
      workspaceRoot,
      summary: handoff.artifact.resumeSummary,
      checkpointPath: handoff.path,
      checkpointWrite: 'unchanged',
      handoffPath: handoff.path,
      handoffWrite: handoff.write,
      handoff: handoff.artifact,
    },
  };
};

export const refreshSkoposDiscussionLifecycleArtifacts = async ({
  workspaceRoot,
  taskIdentity,
  dryRun = false,
  checkpointTrigger = 'manual',
}: {
  workspaceRoot: string;
  taskIdentity?: SkoposTaskIdentity;
  dryRun?: boolean;
  checkpointTrigger?: SkoposDiscussionCheckpointPromotionTrigger;
}): Promise<{
  checkpoint: SkoposDiscussionCheckpointRunResult;
  handoff: SkoposDiscussionHandoffRunResult;
}> => {
  const checkpoint = await refreshSkoposDiscussionCheckpoints({
    workspaceRoot,
    taskIdentity,
    dryRun,
    trigger: checkpointTrigger,
  });
  const { handoff } = await refreshSkoposDiscussionResumeArtifacts({
    workspaceRoot,
    taskIdentity,
    dryRun,
  });

  return {
    checkpoint: {
      workspaceRoot,
      summary: checkpoint.artifact.resumeSummary,
      checkpointPath: checkpoint.path,
      checkpointWrite: checkpoint.write,
      checkpoint: checkpoint.artifact,
      indexPath: checkpoint.indexPath,
      indexWrite: checkpoint.indexWrite,
    },
    handoff: {
      ...handoff,
      checkpointPath: checkpoint.path,
      checkpointWrite: checkpoint.write,
    },
  };
};
