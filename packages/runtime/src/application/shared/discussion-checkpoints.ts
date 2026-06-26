import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import type {
  SkoposAgentMissionBriefArtifact,
  SkoposAgentProgramBriefArtifact,
  SkoposDiscussionCheckpointArtifact,
  SkoposDiscussionCheckpointPromotionKind,
  SkoposDiscussionCheckpointPromotionTrigger,
  SkoposDiscussionIndexArtifact,
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowRecommendationArtifact,
} from '@skopos/model';

import { writeJsonArtifact } from './write-json-artifact.js';
import {
  AGENT_MISSION_BRIEF_DIRECTORY,
  DISCUSSION_CHECKPOINT_DIRECTORY,
  DISCUSSION_INDEX_ARTIFACT_PATH,
  PROGRAM_BRIEF_ARTIFACT_PATH,
  QUESTIONS_ARTIFACT_PATH,
  RECOMMENDATIONS_ARTIFACT_PATH,
  TOKEN_BUDGETS,
} from './token-control-constants.js';
import { estimateTokens, readJsonIfExists, resolveActiveMissionId } from './token-control-state.js';

export interface RefreshSkoposDiscussionCheckpointResult {
  path: string;
  write: 'written' | 'dry-run' | 'unchanged';
  artifact: SkoposDiscussionCheckpointArtifact;
  indexPath: string;
  indexWrite: 'written' | 'dry-run' | 'unchanged';
  index: SkoposDiscussionIndexArtifact;
}

export const refreshSkoposDiscussionCheckpoints = async ({
  workspaceRoot,
  dryRun = false,
  trigger = 'manual',
}: {
  workspaceRoot: string;
  dryRun?: boolean;
  trigger?: SkoposDiscussionCheckpointPromotionTrigger;
}): Promise<RefreshSkoposDiscussionCheckpointResult> => {
  const activeMissionId = await resolveActiveMissionId(workspaceRoot);
  const [programBrief, missionBrief, questions, recommendations, existingIndex] = await Promise.all([
    readJsonIfExists<SkoposAgentProgramBriefArtifact>(join(workspaceRoot, PROGRAM_BRIEF_ARTIFACT_PATH)),
    activeMissionId
      ? readJsonIfExists<SkoposAgentMissionBriefArtifact>(
          join(workspaceRoot, AGENT_MISSION_BRIEF_DIRECTORY, `${activeMissionId}.json`),
        )
      : Promise.resolve(undefined),
    readJsonIfExists<SkoposWorkflowQuestionArtifact>(join(workspaceRoot, QUESTIONS_ARTIFACT_PATH)),
    readJsonIfExists<SkoposWorkflowRecommendationArtifact>(
      join(workspaceRoot, RECOMMENDATIONS_ARTIFACT_PATH),
    ),
    readJsonIfExists<SkoposDiscussionIndexArtifact>(join(workspaceRoot, DISCUSSION_INDEX_ARTIFACT_PATH)),
  ]);

  const acceptedDecisions =
    questions?.entries
      .filter((entry) => entry.status === 'resolved' && entry.resolvedOptionId)
      .map((entry) => ({
        id: entry.id,
        title: entry.title,
        resolvedOptionId: entry.resolvedOptionId!,
        resolvedOptionLabel: entry.options.find((option) => option.id === entry.resolvedOptionId)?.label,
      })) ?? [];
  const openQuestions =
    questions?.entries
      .filter((entry) => entry.status === 'open')
      .map((entry) => ({
        id: entry.id,
        title: entry.title,
        blocking: entry.blocking,
        recommendedOptionId: entry.recommendedOptionId,
      })) ?? [];
  const recommendedAction = recommendations?.entries.find((entry) => entry.status === 'open');
  const linkedPlanId = questions?.generatedForPlanId;
  const currentDirection =
    missionBrief?.recommendedActionSummary ??
    programBrief?.recommendedActionSummary ??
    recommendedAction?.summary ??
    'Keep the current active workflow state compact and resume from the latest mission routing state.';
  const linkedArtifactPaths = [
    PROGRAM_BRIEF_ARTIFACT_PATH,
    activeMissionId ? `${AGENT_MISSION_BRIEF_DIRECTORY}/${activeMissionId}.json` : undefined,
    QUESTIONS_ARTIFACT_PATH,
    RECOMMENDATIONS_ARTIFACT_PATH,
  ].filter((value): value is string => Boolean(value));
  const resumeSummary = buildResumeSummary({
    activeMissionId,
    currentDirection,
    openQuestions,
    acceptedDecisionCount: acceptedDecisions.length,
    nextCommand: recommendedAction?.command ?? missionBrief?.nextCommand ?? programBrief?.nextCommand,
  });
  const threadId = activeMissionId ? `mission:${activeMissionId}` : 'workspace:current';
  const estimatedTokens = estimateTokens(resumeSummary);
  const nextCommand = recommendedAction?.command ?? missionBrief?.nextCommand ?? programBrief?.nextCommand;
  const latestCheckpoint = await loadLatestCheckpointArtifact(workspaceRoot, existingIndex);
  const nextCheckpointShape = {
    threadId,
    activeMissionId,
    currentDirection,
    acceptedDecisions,
    openQuestions,
    recommendedNextCommand: nextCommand,
  };
  const promotionKinds = derivePromotionKinds({
    workspaceRoot,
    latestCheckpoint,
    nextShape: nextCheckpointShape,
  });

  if (latestCheckpoint && promotionKinds.length === 0) {
    const index = buildDiscussionIndexArtifact({
      workspaceRoot,
      latestCheckpoint,
      entries: existingIndex?.entries ?? [],
    });
    const indexPath = join(workspaceRoot, DISCUSSION_INDEX_ARTIFACT_PATH);
    const needsIndexWrite =
      !existingIndex ||
      existingIndex.latestCheckpointId !== index.latestCheckpointId ||
      existingIndex.latestCheckpointPath !== index.latestCheckpointPath ||
      existingIndex.checkpointCount !== index.checkpointCount;

    const indexWrite =
      needsIndexWrite && !dryRun
        ? await writeJsonArtifact({
            artifactPath: indexPath,
            artifact: index,
            dryRun,
          })
        : needsIndexWrite
          ? 'dry-run'
          : 'unchanged';

    return {
      path: join(workspaceRoot, DISCUSSION_CHECKPOINT_DIRECTORY, `${latestCheckpoint.id}.json`),
      write: 'unchanged',
      artifact: latestCheckpoint,
      indexPath,
      indexWrite,
      index,
    };
  }

  const timestamp = new Date().toISOString();
  const checkpointId = toCheckpointId(timestamp);
  const artifact: SkoposDiscussionCheckpointArtifact = {
    schemaVersion: 1,
    id: checkpointId,
    type: 'discussion-checkpoint',
    status: 'generated',
    authority: 'generated',
    summary: `Discussion checkpoint for ${activeMissionId ?? 'the active workspace workflow state'}.`,
    updatedAt: timestamp,
    generatedAt: timestamp,
    workspaceRoot,
    threadId,
    checkpointKind: 'workflow-state',
    activeMissionId,
    linkedPlanId,
    currentDirection,
    acceptedDecisions,
    openQuestions,
    recommendedNextCommand: nextCommand,
    linkedArtifactPaths,
    resumeSummary,
    estimatedTokens,
    budgetTokens: TOKEN_BUDGETS.checkpoint,
    overBudget: estimatedTokens > TOKEN_BUDGETS.checkpoint,
    promotionTrigger: trigger,
    promotionKinds,
    supersedesCheckpointId: latestCheckpoint?.id,
  };

  const relativeArtifactPath = `${DISCUSSION_CHECKPOINT_DIRECTORY}/${artifact.id}.json`;
  const artifactPath = join(workspaceRoot, relativeArtifactPath);
  const write = await writeJsonArtifact({
    artifactPath,
    artifact,
    dryRun,
  });
  const index = buildDiscussionIndexArtifact({
    workspaceRoot,
    latestCheckpoint: artifact,
    entries: existingIndex?.entries ?? [],
  });
  const indexPath = join(workspaceRoot, DISCUSSION_INDEX_ARTIFACT_PATH);
  const indexWrite = await writeJsonArtifact({
    artifactPath: indexPath,
    artifact: index,
    dryRun,
  });

  return {
    path: artifactPath,
    write,
    artifact,
    indexPath,
    indexWrite,
    index,
  };
};

const loadLatestCheckpointArtifact = async (
  workspaceRoot: string,
  existingIndex?: SkoposDiscussionIndexArtifact,
): Promise<SkoposDiscussionCheckpointArtifact | undefined> => {
  const indexedLatest = existingIndex?.latestCheckpointPath;
  if (indexedLatest) {
    return readJsonIfExists<SkoposDiscussionCheckpointArtifact>(join(workspaceRoot, indexedLatest));
  }

  try {
    const entries = (await readdir(join(workspaceRoot, DISCUSSION_CHECKPOINT_DIRECTORY)))
      .filter((entry) => entry.endsWith('.json'))
      .sort()
      .reverse();
    const latest = entries.at(0);
    return latest
      ? readJsonIfExists<SkoposDiscussionCheckpointArtifact>(
          join(workspaceRoot, DISCUSSION_CHECKPOINT_DIRECTORY, latest),
        )
      : undefined;
  } catch {
    return undefined;
  }
};

const derivePromotionKinds = ({
  workspaceRoot,
  latestCheckpoint,
  nextShape: {
    threadId,
    activeMissionId,
    currentDirection,
    acceptedDecisions,
    openQuestions,
    recommendedNextCommand,
  },
}: {
  workspaceRoot: string;
  latestCheckpoint?: SkoposDiscussionCheckpointArtifact;
  nextShape: {
    threadId: string;
    activeMissionId?: string;
    currentDirection: string;
    acceptedDecisions: SkoposDiscussionCheckpointArtifact['acceptedDecisions'];
    openQuestions: SkoposDiscussionCheckpointArtifact['openQuestions'];
    recommendedNextCommand?: string;
  };
}): SkoposDiscussionCheckpointPromotionKind[] => {
  if (!latestCheckpoint) {
    return ['initial-state'];
  }

  const promotionKinds: SkoposDiscussionCheckpointPromotionKind[] = [];

  if (
    latestCheckpoint.threadId !== threadId ||
    latestCheckpoint.activeMissionId !== activeMissionId
  ) {
    promotionKinds.push('active-mission-changed');
  }
  if (latestCheckpoint.currentDirection !== currentDirection) {
    promotionKinds.push('current-direction-changed');
  }
  if (JSON.stringify(latestCheckpoint.acceptedDecisions) !== JSON.stringify(acceptedDecisions)) {
    promotionKinds.push('accepted-decisions-changed');
  }
  if (JSON.stringify(latestCheckpoint.openQuestions) !== JSON.stringify(openQuestions)) {
    promotionKinds.push('open-questions-changed');
  }
  if (
    normalizeRecommendedCommandForPromotion(latestCheckpoint.recommendedNextCommand, workspaceRoot) !==
    normalizeRecommendedCommandForPromotion(recommendedNextCommand, workspaceRoot)
  ) {
    promotionKinds.push('recommended-next-command-changed');
  }

  return promotionKinds;
};

const normalizeRecommendedCommandForPromotion = (
  command: string | undefined,
  workspaceRoot: string,
): string | undefined => {
  if (!command) {
    return undefined;
  }

  return command
    .replaceAll(workspaceRoot, '<project-root>')
    .replace(/\s+--actor\s+(?:"[^"]*"|'[^']*'|\S+)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const buildDiscussionIndexArtifact = ({
  workspaceRoot,
  latestCheckpoint,
  entries,
}: {
  workspaceRoot: string;
  latestCheckpoint: SkoposDiscussionCheckpointArtifact;
  entries: SkoposDiscussionIndexArtifact['entries'];
}): SkoposDiscussionIndexArtifact => {
  const latestCheckpointPath = `${DISCUSSION_CHECKPOINT_DIRECTORY}/${latestCheckpoint.id}.json`;
  const dedupedEntries = [
    {
      id: latestCheckpoint.id,
      threadId: latestCheckpoint.threadId,
      artifactPath: latestCheckpointPath,
      activeMissionId: latestCheckpoint.activeMissionId,
      linkedPlanId: latestCheckpoint.linkedPlanId,
      summary: latestCheckpoint.summary ?? latestCheckpoint.resumeSummary,
      currentDirection: latestCheckpoint.currentDirection,
      updatedAt: latestCheckpoint.updatedAt ?? latestCheckpoint.generatedAt ?? new Date().toISOString(),
    },
    ...entries.filter((entry) => entry.id !== latestCheckpoint.id),
  ].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));

  return {
    schemaVersion: 1,
    id: 'discussion-index',
    type: 'discussion-index',
    status: 'generated',
    authority: 'generated',
    summary:
      dedupedEntries.length === 0
        ? 'No discussion checkpoints have been generated yet.'
        : `${dedupedEntries.length} discussion checkpoint${dedupedEntries.length === 1 ? '' : 's'} are available for routed history and resume state.`,
    updatedAt: latestCheckpoint.updatedAt,
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    latestCheckpointId: latestCheckpoint.id,
    latestCheckpointPath,
    checkpointCount: dedupedEntries.length,
    entries: dedupedEntries,
  };
};

const buildResumeSummary = ({
  activeMissionId,
  currentDirection,
  openQuestions,
  acceptedDecisionCount,
  nextCommand,
}: {
  activeMissionId?: string;
  currentDirection: string;
  openQuestions: Array<{ id: string; blocking: boolean }>;
  acceptedDecisionCount: number;
  nextCommand?: string;
}): string => {
  const openQuestionSummary =
    openQuestions.length === 0
      ? 'No workflow questions remain open.'
      : `${openQuestions.length} workflow question${openQuestions.length === 1 ? '' : 's'} remain open, including ${openQuestions.filter((entry) => entry.blocking).length} blocking.`;
  const missionSummary = activeMissionId
    ? `Resume mission ${activeMissionId}.`
    : 'Resume from the latest workspace workflow state.';
  const nextStepSummary = nextCommand ? `Next command: ${nextCommand}.` : 'No next command is currently suggested.';

  return `${missionSummary} ${currentDirection} ${acceptedDecisionCount} decision${acceptedDecisionCount === 1 ? '' : 's'} already resolved. ${openQuestionSummary} ${nextStepSummary}`;
};

const toCheckpointId = (timestamp: string): string =>
  `discussion-checkpoint-${timestamp.replace(/[-:.]/g, '').replace('Z', 'z')}`;
