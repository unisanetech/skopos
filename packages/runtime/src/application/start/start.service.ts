import { join, resolve } from 'node:path';

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
import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import {
  buildWorkflowQuestionsArtifact,
  buildWorkflowRecommendationsArtifact,
  isImplementationAllowed,
  QUESTIONS_ARTIFACT_PATH,
  RECOMMENDATIONS_ARTIFACT_PATH,
} from '../workflow-router/workflow-router-state.service.js';

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

  const questions = buildWorkflowQuestionsArtifact({
    workspaceRoot,
    planId: plan.planId,
    missionId: mission.id,
    decisionQuestions: plan.decisionQuestions,
    planPath: plan.planPath,
    missionPath: plan.missionPath,
  });
  const recommendations = buildWorkflowRecommendationsArtifact({
    workspaceRoot,
    actorId,
    planId: plan.planId,
    mission,
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
  const blockingQuestions = questions.entries.filter(
    (entry) => entry.status === 'open' && entry.blocking,
  );
  const recommendedAction = recommendations.entries.find((entry) => entry.status === 'open');
  const codeAllowed = isImplementationAllowed({ mission, questions });
  const summary = buildStartSummary({
    mission,
    blockingQuestionCount: blockingQuestions.length,
    codeAllowed,
  });
  const projectKnowledge = await buildSkoposProjectKnowledgeGuidance({
    workspaceRoot,
    dryRun,
  });
  await writeSkoposAgentBrief({
    artifactPath: resolveAgentMissionBriefArtifactPath(workspaceRoot, mission.id),
    artifact: buildSkoposAgentMissionBrief({
      workspaceRoot,
      mission,
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
      questionsPath,
      recommendationsPath,
      projectKnowledge.memoryPath,
      projectKnowledge.communicationBriefPath,
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
    planId: plan.planId,
    planPath: plan.planPath,
    missionId: mission.id,
    missionPath: plan.missionPath,
    missionState: mission.state,
    missionClaimedByActorId: mission.coordination.claimedBy?.actorId,
    questionsPath,
    questionsWrite,
    questions,
    recommendationsPath,
    recommendationsWrite,
    executionSurface: recommendations.executionSurface,
    recommendations,
    projectKnowledge,
    blockingQuestions,
    recommendedAction,
    nextCommand: recommendedAction?.command,
    plan: {
      ...plan,
      mission,
    },
    mission,
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
