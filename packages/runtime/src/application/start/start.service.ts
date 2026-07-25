import { dirname, resolve } from 'node:path';

import type {
  SkoposMissionArtifact,
  SkoposStartRunResult,
} from '@skopos/model';

import { claimSkoposMissionRuntime } from '../mission/mission.service.js';
import { buildSkoposPlanRuntime } from '../plan/plan.service.js';
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
import { refreshSkoposDiscussionLifecycleArtifacts } from '../shared/discussion-lifecycle.js';
import {
  buildWorkflowQuestionsArtifact,
  buildWorkflowRecommendationsArtifact,
  isImplementationAllowed,
} from '../workflow-router/workflow-router-state.service.js';
import {
  resolveMissionTaskIdentity,
  writeWorkflowQuestionsState,
  writeWorkflowRecommendationsState,
} from '../workflow-router/workflow-router-task-state.service.js';
import {
  buildSkoposCompactTaskBriefRuntime,
  writeSkoposCurrentTaskProjections,
} from '../agent-native/agent-native-operating-model.service.js';

export interface BuildSkoposStartRuntimeOptions {
  cwd: string;
  goal: string;
  scope?: string;
  actor?: string;
  dryRun?: boolean;
}

export const buildSkoposStartRuntime = async ({
  cwd,
  goal,
  scope,
  actor,
  dryRun = false,
}: BuildSkoposStartRuntimeOptions): Promise<SkoposStartRunResult> => {
  const workspaceRoot = resolve(cwd);
  const plan = await buildSkoposPlanRuntime({
    cwd: workspaceRoot,
    goal,
    scope,
    actor,
    dryRun,
  });
  const actorId = resolveActorId(actor);
  const mission =
    actorId && !dryRun
      ? await claimSkoposMissionRuntime({
          cwd: workspaceRoot,
          mission: plan.missionId,
          actor: actorId,
        })
      : plan.mission;

  const taskIdentity = await resolveMissionTaskIdentity({
    workspaceRoot,
    mission,
    actorId,
  });
  const activeMission = {
    ...mission,
    taskIdentity,
  };
  const questions = buildWorkflowQuestionsArtifact({
    workspaceRoot,
    planId: plan.planId,
    missionId: activeMission.id,
    decisionQuestions: plan.decisionQuestions,
    planPath: plan.planPath,
    missionPath: plan.missionPath,
    taskIdentity,
  });
  const recommendations = buildWorkflowRecommendationsArtifact({
    workspaceRoot,
    actorId,
    planId: plan.planId,
    mission: activeMission,
    questions,
    taskIdentity,
  });
  const questionsState = await writeWorkflowQuestionsState({
    workspaceRoot,
    artifact: questions,
    dryRun,
  });
  const recommendationsState = await writeWorkflowRecommendationsState({
    workspaceRoot,
    artifact: recommendations,
    dryRun,
  });
  const questionsPath = questionsState.compatibilityPath;
  const questionsWrite = questionsState.write;
  const recommendationsPath = recommendationsState.compatibilityPath;
  const recommendationsWrite = recommendationsState.write;
  const blockingQuestions = questions.entries.filter(
    (entry) => entry.status === 'open' && entry.blocking,
  );
  const recommendedAction = recommendations.entries.find((entry) => entry.status === 'open');
  const codeAllowed = isImplementationAllowed({ mission: activeMission, questions });
  const summary = buildStartSummary({
    mission: activeMission,
    blockingQuestionCount: blockingQuestions.length,
    codeAllowed,
  });
  const projectKnowledge = await buildSkoposProjectKnowledgeGuidance({
    workspaceRoot,
    dryRun,
  });
  const taskBrief = await buildSkoposCompactTaskBriefRuntime({
    cwd: workspaceRoot,
    mission: activeMission,
    questions,
    phase: 'admission',
  });
  const compactArtifacts = await writeSkoposCurrentTaskProjections({
    workspaceRoot,
    mission: activeMission,
    brief: taskBrief,
    dryRun,
  });
  await writeSkoposAgentBrief({
    artifactPath: resolveAgentMissionBriefArtifactPath(workspaceRoot, mission.id),
    artifact: buildSkoposAgentMissionBrief({
      workspaceRoot,
      mission: activeMission,
      questions,
      recommendations,
      codeAllowed,
    }),
    dryRun,
  });
  await refreshSkoposDiscussionLifecycleArtifacts({
    workspaceRoot,
    dryRun,
    checkpointTrigger: 'workflow-start',
  });

  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'start',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary,
    relatedArtifactPaths: [
      plan.planPath,
      plan.missionPath,
      plan.graphPath,
      questionsState.authorityPath,
      questionsPath,
      recommendationsState.authorityPath,
      recommendationsPath,
      projectKnowledge.memoryPath,
      projectKnowledge.communicationBriefPath,
      compactArtifacts.projectPath,
      compactArtifacts.taskPath,
      compactArtifacts.briefPath,
    ],
    metadata: {
      goal: plan.goal,
      scopeId: plan.scope.scope.id,
      actorId: actorId ?? null,
      planId: plan.planId,
      missionId: mission.id,
      codeAllowed,
      blockingQuestionCount: blockingQuestions.length,
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
    goal: plan.goal,
    summary,
    actorId,
    scope: plan.scope,
    codeAllowed,
    taskState: {
      authorityDirectory: dirname(questionsState.authorityPath),
      questionsPath: questionsState.authorityPath,
      recommendationsPath: recommendationsState.authorityPath,
      compatibilityQuestionsPath: questionsPath,
      compatibilityRecommendationsPath: recommendationsPath,
    },
    planId: plan.planId,
    planPath: plan.planPath,
    missionId: mission.id,
    missionPath: plan.missionPath,
    missionState: activeMission.state,
    missionClaimedByActorId: activeMission.coordination.claimedBy?.actorId,
    questionsPath,
    questionsWrite,
    questions,
    recommendationsPath,
    recommendationsWrite,
    executionSurface: recommendations.executionSurface,
    taskBrief,
    recommendations,
    projectKnowledge,
    blockingQuestions,
    recommendedAction,
    nextCommand: recommendedAction?.command,
    plan: {
      ...plan,
      mission: activeMission,
    },
    mission: activeMission,
  };
};

const buildStartSummary = ({
  mission,
  blockingQuestionCount,
  codeAllowed,
}: {
  mission: SkoposMissionArtifact;
  blockingQuestionCount: number;
  codeAllowed: boolean;
}): string => {
  if (!mission.coordination.claimedBy?.actorId) {
    return `Started ${mission.id} without an active claim; mission ownership still needs to be recorded.`;
  }

  if (blockingQuestionCount > 0) {
    return `Started ${mission.id} with ${blockingQuestionCount} blocking workflow question${blockingQuestionCount === 1 ? '' : 's'} still open.`;
  }

  if (codeAllowed) {
    return `Started ${mission.id}; implementation is allowed for the claimed mission.`;
  }

  return `Started ${mission.id}; further workflow guidance is still required before implementation.`;
};

const resolveActorId = (actor?: string): string | undefined => {
  const candidate = actor ?? process.env.SKOPOS_ACTOR;
  if (typeof candidate !== 'string') {
    return undefined;
  }

  const normalized = candidate.trim();
  return normalized.length > 0 ? normalized : undefined;
};
