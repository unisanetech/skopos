import { dirname, resolve } from 'node:path';

import type {
  SkoposDecideRunResult,
  SkoposMissionArtifact,
  SkoposWorkflowQuestionArtifact,
} from '@skopos/model';

import { resolveMissionPath } from '../mission/mission.service.js';
import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import {
  buildSkoposAgentMissionBrief,
  resolveAgentMissionBriefArtifactPath,
  writeSkoposAgentBrief,
} from '../shared/agent-briefs.js';
import { refreshSkoposDiscussionLifecycleArtifacts } from '../shared/discussion-lifecycle.js';
import { resolveCurrentMissionRuntime } from '../shared/current-mission.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import {
  buildWorkflowRecommendationsArtifact,
  getBlockingWorkflowQuestions,
  isImplementationAllowed,
  resolveWorkflowQuestionArtifact,
} from '../workflow-router/workflow-router-state.service.js';
import {
  loadWorkflowQuestionsForMission,
  resolveMissionTaskIdentity,
  writeWorkflowQuestionsState,
  writeWorkflowRecommendationsState,
} from '../workflow-router/workflow-router-task-state.service.js';

export interface BuildSkoposDecideRuntimeOptions {
  cwd: string;
  questionId: string;
  optionId: string;
  actor?: string;
  dryRun?: boolean;
}

export const buildSkoposDecideRuntime = async ({
  cwd,
  questionId,
  optionId,
  actor,
  dryRun = false,
}: BuildSkoposDecideRuntimeOptions): Promise<SkoposDecideRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireActorId(actor);
  const resolvedMission = await resolveCurrentMissionRuntime({
    workspaceRoot,
    actorId,
  });
  const taskIdentity = await resolveMissionTaskIdentity({
    workspaceRoot,
    mission: resolvedMission,
    actorId,
  });
  const mission = { ...resolvedMission, taskIdentity };
  const existingQuestions = await loadWorkflowQuestionsForMission({
    workspaceRoot,
    mission,
    actorId,
  });
  if (!existingQuestions) {
    throw new Error(`No workflow questions exist for mission ${mission.id}.`);
  }
  const resolvedAt = new Date().toISOString();
  const { artifact: questions, resolvedQuestion } = resolveWorkflowQuestionArtifact({
    artifact: existingQuestions,
    questionId,
    optionId,
    actorId,
    resolvedAt,
  });
  const updatedMission = buildUpdatedMission({
    mission,
    questions,
    resolvedQuestionId: questionId,
    actorId,
    updatedAt: resolvedAt,
  });
  const recommendations = buildWorkflowRecommendationsArtifact({
    workspaceRoot,
    actorId,
    planId: updatedMission.planId,
    mission: updatedMission,
    questions,
    taskIdentity,
  });
  const questionsState = await writeWorkflowQuestionsState({
    workspaceRoot,
    artifact: { ...questions, taskIdentity },
    dryRun,
  });
  const questionsPath = questionsState.compatibilityPath;
  const questionsWrite = questionsState.write;
  const recommendationsState = await writeWorkflowRecommendationsState({
    workspaceRoot,
    artifact: recommendations,
    dryRun,
  });
  const recommendationsPath = recommendationsState.compatibilityPath;
  const recommendationsWrite = recommendationsState.write;
  const missionPath = resolveMissionPath(workspaceRoot, updatedMission.id);
  const missionWrite = await writeJsonArtifact({
    artifactPath: missionPath,
    artifact: updatedMission,
    dryRun,
  });
  const blockingQuestions = getBlockingWorkflowQuestions(questions);
  const codeAllowed = isImplementationAllowed({
    mission: updatedMission,
    questions,
  });
  const recommendedAction = recommendations.entries.find((entry) => entry.status === 'open');
  const summary = buildSummary({
    questionId,
    optionId,
    mission: updatedMission,
    blockingQuestionCount: blockingQuestions.length,
    codeAllowed,
  });
  await writeSkoposAgentBrief({
    artifactPath: resolveAgentMissionBriefArtifactPath(workspaceRoot, updatedMission.id),
    artifact: buildSkoposAgentMissionBrief({
      workspaceRoot,
      mission: updatedMission,
      questions,
      recommendations,
      codeAllowed,
    }),
    dryRun,
  });
  await refreshSkoposDiscussionLifecycleArtifacts({
    workspaceRoot,
    dryRun,
    checkpointTrigger: 'workflow-decision',
  });

  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'decision',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary,
    relatedArtifactPaths: [
      questionsState.authorityPath,
      questionsPath,
      recommendationsState.authorityPath,
      recommendationsPath,
      missionPath,
    ],
    metadata: {
      actorId,
      questionId,
      selectedOptionId: optionId,
      planId: updatedMission.planId,
      missionId: updatedMission.id,
      codeAllowed,
      blockingQuestionCount: blockingQuestions.length,
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
    questionId,
    selectedOptionId: optionId,
    summary,
    codeAllowed,
    taskState: {
      authorityDirectory: dirname(questionsState.authorityPath),
      questionsPath: questionsState.authorityPath,
      recommendationsPath: recommendationsState.authorityPath,
      compatibilityQuestionsPath: questionsPath,
      compatibilityRecommendationsPath: recommendationsPath,
    },
    questionsPath,
    questionsWrite,
    questions,
    recommendationsPath,
    recommendationsWrite,
    executionSurface: recommendations.executionSurface,
    recommendations,
    resolvedQuestion,
    recommendedAction,
    nextCommand: recommendedAction?.command,
    mission: updatedMission,
    missionPath,
    missionWrite,
  };
};

const buildUpdatedMission = ({
  mission,
  questions,
  resolvedQuestionId,
  actorId,
  updatedAt,
}: {
  mission: SkoposMissionArtifact;
  questions: SkoposWorkflowQuestionArtifact;
  resolvedQuestionId: string;
  actorId: string;
  updatedAt: string;
}): SkoposMissionArtifact => {
  const resolvedDecisionItemId = `decision-${resolvedQuestionId}`;
  const allDecisionQuestionsResolved =
    mission.decisionQuestionIds.length === 0 ||
    mission.decisionQuestionIds.every((id) =>
      questions.entries.some((entry) => entry.id === id && entry.status === 'resolved'),
    );

  return {
    ...mission,
    updatedAt,
    items: mission.items.map((item) => {
      if (item.id === resolvedDecisionItemId) {
        return {
          ...item,
          status: 'complete',
        };
      }

      if (item.id === 'step-resolve-decisions' && allDecisionQuestionsResolved) {
        return {
          ...item,
          status: 'complete',
        };
      }

      return item;
    }),
    coordination: {
      ...mission.coordination,
      lastUpdatedBy: actorId,
      lastUpdatedAt: updatedAt,
    },
  };
};

const buildSummary = ({
  questionId,
  optionId,
  mission,
  blockingQuestionCount,
  codeAllowed,
}: {
  questionId: string;
  optionId: string;
  mission: SkoposMissionArtifact;
  blockingQuestionCount: number;
  codeAllowed: boolean;
}): string => {
  if (codeAllowed) {
    return `Resolved ${questionId} as ${optionId}; implementation is now allowed for ${mission.id}.`;
  }

  return `Resolved ${questionId} as ${optionId}; ${blockingQuestionCount} blocking workflow question${blockingQuestionCount === 1 ? '' : 's'} still remain for ${mission.id}.`;
};

const requireActorId = (actor?: string): string => {
  const candidate = actor ?? process.env.SKOPOS_ACTOR;
  if (typeof candidate !== 'string') {
    throw new Error('Missing workflow actor id. Pass --actor <id> or set SKOPOS_ACTOR.');
  }

  const normalized = candidate.trim();
  if (normalized.length === 0) {
    throw new Error('Missing workflow actor id. Pass --actor <id> or set SKOPOS_ACTOR.');
  }

  return normalized;
};
