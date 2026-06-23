import { join, resolve } from 'node:path';

import type {
  SkoposDecideRunResult,
  SkoposMissionArtifact,
  SkoposWorkflowQuestionArtifact,
} from '@skopos/model';

import {
  loadSkoposMissionRuntime,
  resolveMissionPath,
} from '../mission/mission.service.js';
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
import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import {
  buildWorkflowRecommendationsArtifact,
  getBlockingWorkflowQuestions,
  isImplementationAllowed,
  loadWorkflowQuestionsArtifact,
  QUESTIONS_ARTIFACT_PATH,
  RECOMMENDATIONS_ARTIFACT_PATH,
  resolveWorkflowQuestionArtifact,
} from '../workflow-router/workflow-router-state.service.js';

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
  const existingQuestions = await loadWorkflowQuestionsArtifact(workspaceRoot);
  const resolvedAt = new Date().toISOString();
  const { artifact: questions, resolvedQuestion } = resolveWorkflowQuestionArtifact({
    artifact: existingQuestions,
    questionId,
    optionId,
    actorId,
    resolvedAt,
  });
  const mission = await loadLinkedMission({
    workspaceRoot,
    questions,
    resolvedQuestionId: questionId,
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
  });
  const questionsPath = join(workspaceRoot, QUESTIONS_ARTIFACT_PATH);
  const questionsWrite = await writeJsonArtifact({
    artifactPath: questionsPath,
    artifact: questions,
    dryRun,
  });
  const recommendationsPath = join(workspaceRoot, RECOMMENDATIONS_ARTIFACT_PATH);
  const recommendationsWrite = await writeJsonArtifact({
    artifactPath: recommendationsPath,
    artifact: recommendations,
    dryRun,
  });
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
    relatedArtifactPaths: [questionsPath, recommendationsPath, missionPath],
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

const loadLinkedMission = async ({
  workspaceRoot,
  questions,
  resolvedQuestionId,
}: {
  workspaceRoot: string;
  questions: SkoposWorkflowQuestionArtifact;
  resolvedQuestionId: string;
}): Promise<SkoposMissionArtifact> => {
  const resolvedQuestion = questions.entries.find((entry) => entry.id === resolvedQuestionId);
  const missionId = resolvedQuestion?.linkedMissionId ?? questions.generatedForMissionId;
  if (!missionId) {
    throw new Error(
      `Workflow question ${resolvedQuestionId} is not linked to a mission, so Skopos cannot update the active execution state.`,
    );
  }

  return loadSkoposMissionRuntime({
    cwd: workspaceRoot,
    mission: missionId,
  });
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
