import { join } from 'node:path';

import type {
  SkoposAgentMissionBriefArtifact,
  SkoposAgentProgramBriefArtifact,
  SkoposDiscussionIndexArtifact,
  SkoposDiscussionHandoffArtifact,
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowRecommendationArtifact,
} from '@skopos/model';

import { writeJsonArtifact } from './write-json-artifact.js';
import {
  AGENT_MISSION_BRIEF_DIRECTORY,
  DISCUSSION_INDEX_ARTIFACT_PATH,
  LATEST_WORKFLOW_HANDOFF_ARTIFACT_PATH,
  PROGRAM_BRIEF_ARTIFACT_PATH,
  QUESTIONS_ARTIFACT_PATH,
  RECOMMENDATIONS_ARTIFACT_PATH,
  TOKEN_BUDGETS,
} from './token-control-constants.js';
import { estimateTokens, readJsonIfExists, resolveActiveMissionId } from './token-control-state.js';

export interface RefreshSkoposDiscussionHandoffResult {
  path: string;
  write: 'written' | 'dry-run';
  artifact: SkoposDiscussionHandoffArtifact;
}

export const refreshSkoposDiscussionHandoff = async ({
  workspaceRoot,
  dryRun = false,
}: {
  workspaceRoot: string;
  dryRun?: boolean;
}): Promise<RefreshSkoposDiscussionHandoffResult> => {
  const activeMissionId = await resolveActiveMissionId(workspaceRoot);
  const [programBrief, missionBrief, questions, recommendations, discussionIndex] = await Promise.all([
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
  const currentDirection =
    missionBrief?.recommendedActionSummary ??
    programBrief?.recommendedActionSummary ??
    recommendedAction?.summary ??
    'Keep the current active workflow state compact and resume from the latest mission routing state.';
  const linkedCheckpointIds =
    discussionIndex?.entries
      .filter((entry) => !activeMissionId || entry.activeMissionId === activeMissionId)
      .slice(0, 4)
      .map((entry) => entry.id) ?? [];
  const linkedArtifactPaths = [
    PROGRAM_BRIEF_ARTIFACT_PATH,
    activeMissionId ? `${AGENT_MISSION_BRIEF_DIRECTORY}/${activeMissionId}.json` : undefined,
    QUESTIONS_ARTIFACT_PATH,
    RECOMMENDATIONS_ARTIFACT_PATH,
    discussionIndex ? DISCUSSION_INDEX_ARTIFACT_PATH : undefined,
  ].filter((value): value is string => Boolean(value));
  const resumeSummary = buildResumeSummary({
    activeMissionId,
    currentDirection,
    openQuestions,
    acceptedDecisionCount: acceptedDecisions.length,
    nextCommand: recommendedAction?.command ?? missionBrief?.nextCommand ?? programBrief?.nextCommand,
  });
  const estimatedTokens = estimateTokens(resumeSummary);
  const artifact: SkoposDiscussionHandoffArtifact = {
    schemaVersion: 1,
    id: 'discussion-handoff-latest-workflow',
    type: 'discussion-handoff',
    status: 'generated',
    authority: 'generated',
    summary: `Compact workflow handoff for ${activeMissionId ?? 'the active workspace state'}.`,
    updatedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    handoffKind: 'workflow-resume',
    activeMissionId,
    currentDirection,
    acceptedDecisions,
    openQuestions,
    recommendedNextCommand:
      recommendedAction?.command ?? missionBrief?.nextCommand ?? programBrief?.nextCommand,
    linkedCheckpointIds,
    linkedArtifactPaths,
    resumeSummary,
    estimatedTokens,
    budgetTokens: TOKEN_BUDGETS.handoff,
    overBudget: estimatedTokens > TOKEN_BUDGETS.handoff,
  };
  const artifactPath = join(workspaceRoot, LATEST_WORKFLOW_HANDOFF_ARTIFACT_PATH);
  const write = await writeJsonArtifact({
    artifactPath,
    artifact,
    dryRun,
  });

  return {
    path: artifactPath,
    write,
    artifact,
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
