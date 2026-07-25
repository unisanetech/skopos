import { dirname, join, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

import { buildSkoposTrustReport } from '@skopos/trust';
import type {
  SkoposMissionArtifact,
  SkoposNextRunResult,
  SkoposUnderstandingSetupReviewArtifact,
  SkoposWorkflowQuestionArtifact,
} from '@skopos/model';

import { resolveMissionPath } from '../mission/mission.service.js';
import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { buildSkoposProjectKnowledgeGuidance } from '../shared/memory-state.js';
import {
  buildSkoposAgentMissionBrief,
  resolveAgentMissionBriefArtifactPath,
  writeSkoposAgentBrief,
} from '../shared/agent-briefs.js';
import { refreshSkoposDiscussionResumeArtifacts } from '../shared/discussion-lifecycle.js';
import { resolveCurrentMissionRuntime } from '../shared/current-mission.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import {
  buildWorkflowQuestionsSummary,
  buildWorkflowRecommendationsArtifact,
  filterWorkflowQuestionsForMission,
  getBlockingWorkflowQuestions,
  getNextPendingMissionItem,
  isImplementationAllowed,
} from '../workflow-router/workflow-router-state.service.js';
import {
  loadWorkflowQuestionsForMission,
  resolveMissionTaskIdentity,
  writeWorkflowQuestionsState,
  writeWorkflowRecommendationsState,
} from '../workflow-router/workflow-router-task-state.service.js';
import {
  buildSkoposCompactTaskBriefRuntime,
  writeSkoposCurrentTaskProjections,
} from '../agent-native/agent-native-operating-model.service.js';

export interface BuildSkoposNextRuntimeOptions {
  cwd: string;
  mission?: string;
  actor?: string;
  dryRun?: boolean;
}

export const buildSkoposNextRuntime = async ({
  cwd,
  mission,
  actor,
  dryRun = false,
}: BuildSkoposNextRuntimeOptions): Promise<SkoposNextRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const resolvedMission = await resolveCurrentMissionRuntime({
    workspaceRoot,
    mission,
    actorId,
  });
  const taskIdentity = await resolveMissionTaskIdentity({
    workspaceRoot,
    mission: resolvedMission,
    actorId,
  });
  const currentMission = { ...resolvedMission, taskIdentity };
  const loadedQuestions = await loadWorkflowQuestionsForMission({
    workspaceRoot,
    mission: currentMission,
    actorId,
  });
  const questions = loadedQuestions
    ? filterWorkflowQuestionsForMission({
        artifact: loadedQuestions,
        missionId: currentMission.id,
      })
    : buildEmptyWorkflowQuestionsArtifact({
        workspaceRoot,
        mission: currentMission,
      });
  const questionsState = await writeWorkflowQuestionsState({
    workspaceRoot,
    artifact: { ...questions, taskIdentity },
    dryRun,
  });
  const recommendations = buildWorkflowRecommendationsArtifact({
    workspaceRoot,
    actorId,
    planId: currentMission.planId,
    mission: currentMission,
    questions,
    taskIdentity,
  });
  const recommendationsState = await writeWorkflowRecommendationsState({
    workspaceRoot,
    artifact: recommendations,
    dryRun,
  });
  const recommendationsPath = recommendationsState.compatibilityPath;
  const recommendationsWrite = recommendationsState.write;
  const blockingQuestions = getBlockingWorkflowQuestions(questions);
  const codeAllowed = isImplementationAllowed({
    mission: currentMission,
    questions,
  });
  const recommendedAction = recommendations.entries.find((entry) => entry.status === 'open');
  const nextItem =
    blockingQuestions.length > 0 ? undefined : getNextPendingMissionItem(currentMission);
  const pendingItems = currentMission.items.filter(
    (item) => item.kind !== 'decision' && item.status !== 'complete',
  );
  const trustReport = await buildSkoposTrustReport({
    cwd: workspaceRoot,
  });
  const setupReviewPath = join(workspaceRoot, '.skopos', 'understanding', 'setup-review.json');
  const setupReview = await loadOptionalJson<SkoposUnderstandingSetupReviewArtifact>(setupReviewPath);
  const projectKnowledge = await buildSkoposProjectKnowledgeGuidance({
    workspaceRoot,
    trustLevel: trustReport.trustLevel,
    readiness: trustReport.readiness,
    dryRun,
  });
  const taskBrief = await buildSkoposCompactTaskBriefRuntime({
    cwd: workspaceRoot,
    mission: currentMission,
    questions,
    phase: resolveExecutionPhase(nextItem),
  });
  const compactArtifacts = await writeSkoposCurrentTaskProjections({
    workspaceRoot,
    mission: currentMission,
    brief: taskBrief,
    dryRun,
  });
  const summary = buildSummary({
    mission: currentMission,
    blockingQuestionCount: blockingQuestions.length,
    nextItemTitle: nextItem?.title,
    codeAllowed,
  });
  await writeSkoposAgentBrief({
    artifactPath: resolveAgentMissionBriefArtifactPath(workspaceRoot, currentMission.id),
    artifact: buildSkoposAgentMissionBrief({
      workspaceRoot,
      mission: currentMission,
      questions,
      recommendations,
      codeAllowed,
      nextItem,
    }),
    dryRun,
  });
  await refreshSkoposDiscussionResumeArtifacts({
    workspaceRoot,
    dryRun,
  });

  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'next',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary,
    relatedArtifactPaths: [
      resolveMissionPath(workspaceRoot, currentMission.id),
      questionsState.authorityPath,
      questionsState.compatibilityPath,
      recommendationsState.authorityPath,
      recommendationsPath,
      projectKnowledge.memoryPath,
      projectKnowledge.communicationBriefPath,
      compactArtifacts.projectPath,
      compactArtifacts.taskPath,
      compactArtifacts.briefPath,
    ],
    metadata: {
      actorId: actorId ?? null,
      missionId: currentMission.id,
      planId: currentMission.planId,
      codeAllowed,
      blockingQuestionCount: blockingQuestions.length,
      pendingItemCount: pendingItems.length,
      readiness: trustReport.readiness,
      trustLevel: trustReport.trustLevel,
      projectKnowledgeKnownAreaCount: projectKnowledge.knownAreaCount,
      projectKnowledgeAttentionAreaCount: projectKnowledge.attentionAreaCount,
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
    codeAllowed,
    taskState: {
      authorityDirectory: dirname(questionsState.authorityPath),
      questionsPath: questionsState.authorityPath,
      recommendationsPath: recommendationsState.authorityPath,
      compatibilityQuestionsPath: questionsState.compatibilityPath,
      compatibilityRecommendationsPath: recommendationsState.compatibilityPath,
    },
    missionId: currentMission.id,
    missionPath: resolveMissionPath(workspaceRoot, currentMission.id),
    mission: currentMission,
    questionsPath: questionsState.compatibilityPath,
    questions,
    blockingQuestions,
    recommendationsPath,
    recommendationsWrite,
    executionSurface: recommendations.executionSurface,
    taskBrief,
    recommendations,
    setupReview: setupReview
      ? {
          path: setupReviewPath,
          readiness: setupReview.readiness,
          openQuestionCount: setupReview.openConfirmationQuestions.length,
          answeredQuestionCount: setupReview.answeredQuestions.length,
          nextCommand: setupReview.nextCommand,
          openQuestions: setupReview.openConfirmationQuestions,
        }
      : undefined,
    projectKnowledge,
    recommendedAction,
    nextCommand: recommendedAction?.command,
    nextItem,
    pendingItems,
    trust: {
      trustLevel: trustReport.trustLevel,
      readiness: trustReport.readiness,
      summary: trustReport.summary,
      checks: trustReport.checks,
    },
  };
};

const resolveExecutionPhase = (
  nextItem: SkoposMissionArtifact['items'][number] | undefined,
): 'iteration' | 'stabilization' | 'closure' => {
  if (!nextItem) {
    return 'closure';
  }

  if (nextItem.kind === 'docs' || nextItem.kind === 'workflow') {
    return 'stabilization';
  }

  return 'iteration';
};

const loadOptionalJson = async <T>(artifactPath: string): Promise<T | undefined> => {
  try {
    return JSON.parse(await readFile(artifactPath, 'utf8')) as T;
  } catch (error) {
    if (isMissingFileError(error)) {
      return undefined;
    }

    throw error;
  }
};

const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';

const buildEmptyWorkflowQuestionsArtifact = ({
  workspaceRoot,
  mission,
}: {
  workspaceRoot: string;
  mission: SkoposMissionArtifact;
}): SkoposWorkflowQuestionArtifact => ({
  schemaVersion: 1,
  id: 'questions',
  type: 'questions',
  status: 'generated',
  authority: 'generated',
  summary: buildWorkflowQuestionsSummary({
    totalCount: 0,
    openCount: 0,
  }),
  updatedAt: mission.updatedAt,
  generatedAt: mission.generatedAt ?? mission.updatedAt,
  workspaceRoot,
  taskIdentity: mission.taskIdentity,
  generatedForPlanId: mission.planId,
  generatedForMissionId: mission.id,
  entries: [],
});

const buildSummary = ({
  mission,
  blockingQuestionCount,
  nextItemTitle,
  codeAllowed,
}: {
  mission: SkoposMissionArtifact;
  blockingQuestionCount: number;
  nextItemTitle?: string;
  codeAllowed: boolean;
}): string => {
  if (blockingQuestionCount > 0) {
    return `Next action for ${mission.id} is to resolve ${blockingQuestionCount} blocking workflow question${blockingQuestionCount === 1 ? '' : 's'}.`;
  }

  if (!codeAllowed) {
    return `Skopos next inspected ${mission.id}, but implementation is still not allowed.`;
  }

  if (nextItemTitle) {
    return `Next action for ${mission.id}: ${nextItemTitle}.`;
  }

  return `No pending non-decision mission items remain for ${mission.id}; continue toward eval and closure.`;
};
