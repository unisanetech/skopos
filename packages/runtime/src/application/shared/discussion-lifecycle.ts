import type {
  SkoposDiscussionCheckpointRunResult,
  SkoposDiscussionHandoffRunResult,
  SkoposDiscussionCheckpointPromotionTrigger,
} from '@skopos/model';

import { refreshSkoposDiscussionCheckpoints } from './discussion-checkpoints.js';
import { refreshSkoposDiscussionHandoff } from './discussion-handoff.js';
import { refreshSkoposAgentPromptBrief } from './agent-briefs.js';
import { refreshSkoposTokenTelemetry } from './token-telemetry.js';

export const refreshSkoposDiscussionResumeArtifacts = async ({
  workspaceRoot,
  dryRun = false,
}: {
  workspaceRoot: string;
  dryRun?: boolean;
}): Promise<{
  handoff: SkoposDiscussionHandoffRunResult;
}> => {
  const handoff = await refreshSkoposDiscussionHandoff({
    workspaceRoot,
    dryRun,
  });

  await refreshSkoposAgentPromptBrief({
    workspaceRoot,
    dryRun,
  });
  await refreshSkoposTokenTelemetry({
    workspaceRoot,
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
  dryRun = false,
  checkpointTrigger = 'manual',
}: {
  workspaceRoot: string;
  dryRun?: boolean;
  checkpointTrigger?: SkoposDiscussionCheckpointPromotionTrigger;
}): Promise<{
  checkpoint: SkoposDiscussionCheckpointRunResult;
  handoff: SkoposDiscussionHandoffRunResult;
}> => {
  const checkpoint = await refreshSkoposDiscussionCheckpoints({
    workspaceRoot,
    dryRun,
    trigger: checkpointTrigger,
  });
  const { handoff } = await refreshSkoposDiscussionResumeArtifacts({
    workspaceRoot,
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
