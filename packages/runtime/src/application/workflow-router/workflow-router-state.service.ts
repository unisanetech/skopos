import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import type {
  SkoposDecisionQuestion,
  SkoposMissionArtifact,
  SkoposMissionItem,
  SkoposWorkflowExecutionSurfaceRecommendation,
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowQuestionEntry,
  SkoposWorkflowRecommendationArtifact,
  SkoposWorkflowRecommendationEntry,
} from '@skopos/model';

export const QUESTIONS_ARTIFACT_PATH = '.skopos/questions.json';
export const RECOMMENDATIONS_ARTIFACT_PATH = '.skopos/recommendations.json';

export const buildWorkflowQuestionsArtifact = ({
  workspaceRoot,
  planId,
  missionId,
  decisionQuestions,
  planPath,
  missionPath,
}: {
  workspaceRoot: string;
  planId: string;
  missionId: string;
  decisionQuestions: SkoposDecisionQuestion[];
  planPath: string;
  missionPath: string;
}): SkoposWorkflowQuestionArtifact => {
  const timestamp = new Date().toISOString();

  return {
    schemaVersion: 1,
    id: 'questions',
    type: 'questions',
    status: 'generated',
    authority: 'generated',
    summary: buildWorkflowQuestionsSummary({
      totalCount: decisionQuestions.length,
      openCount: decisionQuestions.length,
    }),
    updatedAt: timestamp,
    generatedAt: timestamp,
    workspaceRoot,
    generatedForPlanId: planId,
    generatedForMissionId: missionId,
    entries: decisionQuestions.map((question) =>
      buildWorkflowQuestionEntry({
        question,
        planId,
        missionId,
        evidenceRefs: [relative(workspaceRoot, planPath), relative(workspaceRoot, missionPath)],
      }),
    ),
  };
};

export const buildWorkflowRecommendationsArtifact = ({
  workspaceRoot,
  actorId,
  planId,
  mission,
  questions,
}: {
  workspaceRoot: string;
  actorId?: string;
  planId: string;
  mission: SkoposMissionArtifact;
  questions: SkoposWorkflowQuestionArtifact;
}): SkoposWorkflowRecommendationArtifact => {
  const timestamp = new Date().toISOString();
  const entries: SkoposWorkflowRecommendationEntry[] = [];
  const executionSurface = buildExecutionSurfaceRecommendation(mission);

  if (!mission.coordination.claimedBy?.actorId) {
    entries.push({
      id: `recommendation.claim-mission.${mission.id}`,
      title: 'Claim the mission',
      summary: 'Claim the generated mission before implementation so the work is owned in Skopos state.',
      priority: 'high',
      reason:
        'Tracked implementation should not continue without an active claimed mission for the current work.',
      actionKind: 'claim-mission',
      command: actorId
        ? `skopos mission claim ${mission.id} ${workspaceRoot} --actor ${actorId}`
        : undefined,
      linkedPlanId: planId,
      linkedMissionId: mission.id,
      blocking: true,
      status: 'open',
    });
  }

  for (const question of questions.entries) {
    if (question.status !== 'open') {
      continue;
    }

    const recommendedOption = question.options.find(
      (option) => option.id === question.recommendedOptionId,
    );
    entries.push({
      id: `recommendation.${question.id}`,
      title: question.title,
      summary: question.question,
      priority: question.blocking ? 'high' : 'medium',
      reason: `${question.whyItMatters} Recommended: ${recommendedOption?.label ?? question.recommendedOptionId}.`,
      actionKind: 'resolve-question',
      command: buildResolveQuestionCommand({
        workspaceRoot,
        actorId,
        questionId: question.id,
        optionId: question.recommendedOptionId,
      }),
      linkedQuestionId: question.id,
      linkedPlanId: planId,
      linkedMissionId: mission.id,
      blocking: question.blocking,
      status: 'open',
    });
  }

  if (isImplementationAllowed({ mission, questions })) {
    entries.push(
      buildNextMissionRecommendation({
        workspaceRoot,
        actorId,
        planId,
        mission,
      }),
    );
  }

  return {
    schemaVersion: 1,
    id: 'recommendations',
    type: 'recommendations',
    status: 'generated',
    authority: 'generated',
    summary: buildWorkflowRecommendationsSummary(entries.length),
    updatedAt: timestamp,
    generatedAt: timestamp,
    workspaceRoot,
    generatedForPlanId: planId,
    generatedForMissionId: mission.id,
    executionSurface,
    entries: sortRecommendations(entries),
  };
};

export const isImplementationAllowed = ({
  mission,
  questions,
}: {
  mission: SkoposMissionArtifact;
  questions: SkoposWorkflowQuestionArtifact;
}): boolean =>
  questions.entries.every((entry) => !entry.blocking || entry.status === 'resolved') &&
  mission.state === 'active' &&
  Boolean(mission.coordination.claimedBy?.actorId);

export const titleFromQuestionId = (id: string): string => {
  const suffix = id.split('.').at(-1) ?? id;

  return suffix
    .split('-')
    .map((part) => (part.length > 0 ? `${part.slice(0, 1).toUpperCase()}${part.slice(1)}` : part))
    .join(' ');
};

export const buildWorkflowQuestionsSummary = ({
  totalCount,
  openCount,
}: {
  totalCount: number;
  openCount: number;
}): string => {
  if (totalCount === 0) {
    return 'No open workflow questions for the current started work.';
  }

  if (openCount === 0) {
    return `All ${totalCount} workflow question${totalCount === 1 ? '' : 's'} ${totalCount === 1 ? 'is' : 'are'} resolved for the current started work.`;
  }

  return `${openCount} of ${totalCount} workflow question${totalCount === 1 ? '' : 's'} ${openCount === 1 ? 'is' : 'are'} still open for the current started work.`;
};

export const buildWorkflowRecommendationsSummary = (openCount: number): string => {
  if (openCount === 0) {
    return 'No workflow recommendations are currently open.';
  }

  return `${openCount} workflow recommendation${openCount === 1 ? '' : 's'} generated for the current started work.`;
};

export const getBlockingWorkflowQuestions = (
  artifact: SkoposWorkflowQuestionArtifact,
): SkoposWorkflowQuestionEntry[] =>
  artifact.entries.filter((entry) => entry.status === 'open' && entry.blocking);

export const filterWorkflowQuestionsForMission = ({
  artifact,
  missionId,
}: {
  artifact: SkoposWorkflowQuestionArtifact;
  missionId: string;
}): SkoposWorkflowQuestionArtifact => {
  const entries = artifact.entries.filter((entry) => entry.linkedMissionId === missionId);
  const openCount = entries.filter((entry) => entry.status === 'open').length;

  return {
    ...artifact,
    generatedForMissionId: missionId,
    summary: buildWorkflowQuestionsSummary({
      totalCount: entries.length,
      openCount,
    }),
    entries,
  };
};

export const getNextPendingMissionItem = (
  mission: SkoposMissionArtifact,
): SkoposMissionItem | undefined =>
  mission.items.find((item) => item.kind !== 'decision' && item.status !== 'complete');

export const loadWorkflowQuestionsArtifact = async (
  workspaceRoot: string,
): Promise<SkoposWorkflowQuestionArtifact> => {
  const contents = await readFile(join(workspaceRoot, QUESTIONS_ARTIFACT_PATH), 'utf8');
  return JSON.parse(contents) as SkoposWorkflowQuestionArtifact;
};

export const loadWorkflowRecommendationsArtifact = async (
  workspaceRoot: string,
): Promise<SkoposWorkflowRecommendationArtifact> => {
  const contents = await readFile(join(workspaceRoot, RECOMMENDATIONS_ARTIFACT_PATH), 'utf8');
  return JSON.parse(contents) as SkoposWorkflowRecommendationArtifact;
};

export const resolveWorkflowQuestionArtifact = ({
  artifact,
  questionId,
  optionId,
  actorId,
  resolvedAt,
}: {
  artifact: SkoposWorkflowQuestionArtifact;
  questionId: string;
  optionId: string;
  actorId: string;
  resolvedAt: string;
}): {
  artifact: SkoposWorkflowQuestionArtifact;
  resolvedQuestion: SkoposWorkflowQuestionEntry;
} => {
  const question = artifact.entries.find((entry) => entry.id === questionId);
  if (!question) {
    throw new Error(`Unknown workflow question: ${questionId}`);
  }

  const option = question.options.find((entry) => entry.id === optionId);
  if (!option) {
    throw new Error(
      `Workflow question ${questionId} does not support option ${optionId}. Expected one of: ${question.options.map((entry) => entry.id).join(', ')}`,
    );
  }

  if (question.status === 'resolved') {
    if (question.resolvedOptionId === optionId) {
      const openCount = artifact.entries.filter((entry) => entry.status === 'open').length;
      return {
        artifact: {
          ...artifact,
          summary: buildWorkflowQuestionsSummary({
            totalCount: artifact.entries.length,
            openCount,
          }),
        },
        resolvedQuestion: question,
      };
    }

    throw new Error(
      `Workflow question ${questionId} is already resolved as ${question.resolvedOptionId}. Re-opening or changing a recorded decision is not supported yet.`,
    );
  }

  const entries = artifact.entries.map((entry) =>
    entry.id === questionId
      ? {
          ...entry,
          status: 'resolved' as const,
          resolvedOptionId: optionId,
          resolvedAt,
          resolvedByActorId: actorId,
        }
      : entry,
  );
  const openCount = entries.filter((entry) => entry.status === 'open').length;
  const updatedArtifact: SkoposWorkflowQuestionArtifact = {
    ...artifact,
    summary: buildWorkflowQuestionsSummary({
      totalCount: entries.length,
      openCount,
    }),
    updatedAt: resolvedAt,
    entries,
  };
  const resolvedQuestion = entries.find((entry) => entry.id === questionId);
  if (!resolvedQuestion) {
    throw new Error(`Resolved workflow question ${questionId} could not be reloaded.`);
  }

  return {
    artifact: updatedArtifact,
    resolvedQuestion,
  };
};

const buildWorkflowQuestionEntry = ({
  question,
  planId,
  missionId,
  evidenceRefs,
}: {
  question: SkoposDecisionQuestion;
  planId: string;
  missionId: string;
  evidenceRefs: string[];
}): SkoposWorkflowQuestionEntry => ({
  id: question.id,
  title: titleFromQuestionId(question.id),
  question: question.question,
  category: question.category,
  escalation: question.escalation,
  blocking: isBlockingQuestion(question),
  recommendedOptionId: question.recommendedOptionId,
  options: question.options,
  whyItMatters: question.whyItMatters,
  whatHappensAfterAnswer: isBlockingQuestion(question)
    ? 'Skopos can continue into implementation once this choice is explicitly confirmed.'
    : 'Skopos can continue with a clearer scope or execution path after this choice is answered.',
  linkedPlanId: planId,
  linkedMissionId: missionId,
  evidenceRefs,
  status: 'open',
});

const sortRecommendations = (
  entries: SkoposWorkflowRecommendationEntry[],
): SkoposWorkflowRecommendationEntry[] => {
  const priorityWeight: Record<SkoposWorkflowRecommendationEntry['priority'], number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return [...entries].sort((left, right) => {
    if (left.blocking !== right.blocking) {
      return left.blocking ? -1 : 1;
    }

    const priorityDelta = priorityWeight[left.priority] - priorityWeight[right.priority];
    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    return left.title.localeCompare(right.title);
  });
};

const buildExecutionSurfaceRecommendation = (
  mission: SkoposMissionArtifact,
): SkoposWorkflowExecutionSurfaceRecommendation => {
  const signals: string[] = [];
  const implementationItemCount = mission.items.filter(
    (item) => item.kind === 'implementation',
  ).length;
  const validationSurfaceCount =
    mission.recommendedWorkflowIds.length + mission.recommendedChecks.length;

  if (mission.scope.scope.kind === 'workspace') {
    signals.push('workspace scope');
  }

  if (mission.parentMissionId || mission.linkedSlices.length > 0) {
    signals.push('mission coordination across slices');
  }

  if (mission.decisionQuestionIds.length >= 2) {
    signals.push(`${mission.decisionQuestionIds.length} decision gates`);
  }

  if (validationSurfaceCount >= 6) {
    signals.push(`${validationSurfaceCount} workflow and validation steps`);
  }

  if (implementationItemCount >= 5) {
    signals.push(`${implementationItemCount} implementation checklist items`);
  }

  if (signals.length >= 2) {
    return {
      kind: 'artifact-plus-workpack-doc',
      summary:
        'This batch is broad enough that a temporary human-readable workpack doc may help coordination.',
      reason:
        'Keep plan and mission artifacts primary, but add a temporary workpack doc when coordination, sequencing, or reviewer handoff is likely to outgrow the JSON workflow artifacts alone.',
      signals,
    };
  }

  return {
    kind: 'artifact-only',
    summary: 'Plan and mission artifacts are enough for this batch.',
    reason:
      'Default to artifact-only so Skopos does not create duplicate planning surfaces for bounded work.',
    signals,
  };
};

const buildNextMissionRecommendation = ({
  workspaceRoot,
  actorId,
  planId,
  mission,
}: {
  workspaceRoot: string;
  actorId?: string;
  planId: string;
  mission: SkoposMissionArtifact;
}): SkoposWorkflowRecommendationEntry => {
  const nextItem = getNextPendingMissionItem(mission);
  if (!nextItem) {
    return {
      id: `recommendation.complete-mission.${mission.id}`,
      title: 'Complete the mission',
      summary: 'The checklist is fully reconciled. Record explicit closure on the active mission.',
      priority: 'medium',
      reason: 'No mission checklist items remain pending after workflow, validation, and knowledge reconciliation.',
      actionKind: 'complete-mission',
      command: buildCompleteMissionCommand({
        workspaceRoot,
        actorId,
        missionId: mission.id,
      }),
      linkedPlanId: planId,
      linkedMissionId: mission.id,
      blocking: false,
      status: 'open',
    };
  }

  return {
    id: `recommendation.${nextItem.id}`,
    title: nextItem.title,
    summary: nextItem.detail,
    priority: nextItem.kind === 'implementation' ? 'high' : 'medium',
    reason: 'This is the first pending mission item in the current execution checklist.',
    actionKind: toRecommendationActionKind(nextItem),
    command: buildMissionItemCommand({
      workspaceRoot,
      actorId,
      mission,
      item: nextItem,
    }),
    linkedPlanId: planId,
    linkedMissionId: mission.id,
    blocking: false,
    status: 'open',
  };
};

const buildResolveQuestionCommand = ({
  workspaceRoot,
  actorId,
  questionId,
  optionId,
}: {
  workspaceRoot: string;
  actorId?: string;
  questionId: string;
  optionId: string;
}): string => {
  const command = ['skopos', 'decide', questionId, optionId, workspaceRoot];
  if (actorId) {
    command.push('--actor', actorId);
  }

  return command.join(' ');
};

const buildCompleteMissionCommand = ({
  workspaceRoot,
  actorId,
  missionId,
}: {
  workspaceRoot: string;
  actorId?: string;
  missionId: string;
}): string => {
  const command = ['skopos', 'mission', 'complete', missionId, workspaceRoot];
  if (actorId) {
    command.push('--actor', actorId);
  }

  return command.join(' ');
};

const toRecommendationActionKind = (
  item: SkoposMissionItem,
): SkoposWorkflowRecommendationEntry['actionKind'] => {
  if (item.kind === 'workflow') {
    return 'run-workflow';
  }

  if (item.kind === 'validation') {
    return 'run-eval';
  }

  return 'implement';
};

const buildMissionItemCommand = ({
  workspaceRoot,
  actorId,
  mission,
  item,
}: {
  workspaceRoot: string;
  actorId?: string;
  mission: SkoposMissionArtifact;
  item: SkoposMissionItem;
}): string | undefined => {
  if (item.kind === 'workflow' && item.id.startsWith('workflow-')) {
    const workflowId = item.id.slice('workflow-'.length);
    const command = ['skopos', 'workflows', 'run', workflowId, workspaceRoot];
    if (actorId) {
      command.push('--actor', actorId);
    }

    return command.join(' ');
  }

  if (item.kind === 'validation') {
    const command = ['skopos', 'eval', workspaceRoot, '--mission', mission.id];
    if (actorId) {
      command.push('--actor', actorId);
    }

    return command.join(' ');
  }

  return undefined;
};

const isBlockingQuestion = (question: SkoposDecisionQuestion): boolean =>
  question.escalation === 'must-ask' || question.escalation === 'forbidden-without-approval';
