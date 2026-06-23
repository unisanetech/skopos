import type { SkoposMissionItem, SkoposPlanArtifacts, SkoposPlanResult } from '@skopos/model';

export interface BuildSkoposPlanArtifactsOptions {
  plan: SkoposPlanResult;
  now?: Date;
  actorId?: string;
  parentPlanId?: string;
  parentMissionId?: string;
}

export const buildSkoposPlanArtifacts = ({
  plan,
  now = new Date(),
  actorId,
  parentPlanId,
  parentMissionId,
}: BuildSkoposPlanArtifactsOptions): SkoposPlanArtifacts => {
  const generatedAt = now.toISOString();
  const timestamp = formatTimestamp(now);
  const scopeSlug = slugify(plan.scope.scope.id);
  const goalSlug = slugify(plan.goal).slice(0, 48) || 'plan';
  const planId = `plan-${timestamp}-${scopeSlug}-${goalSlug}`;
  const missionId = `mission-${timestamp}-${scopeSlug}-${goalSlug}`;

  return {
    planArtifact: {
      schemaVersion: 1,
      id: planId,
      type: 'plan',
      status: 'generated',
      authority: 'generated',
      updatedAt: generatedAt,
      generatedAt,
      workspaceRoot: plan.workspaceRoot,
      goal: plan.goal,
      title: plan.title,
      summary: plan.summary,
      createdByActorId: actorId,
      parentPlanId,
      parentMissionId,
      scope: plan.scope,
      confidence: plan.confidence,
      references: plan.references,
      implementationSteps: plan.implementationSteps,
      recommendedChecks: plan.recommendedChecks,
      recommendedWorkflows: plan.recommendedWorkflows,
      decisionQuestions: plan.decisionQuestions,
      risks: plan.risks,
      nextSteps: plan.nextSteps,
      missionId,
    },
    missionArtifact: {
      schemaVersion: 1,
      id: missionId,
      type: 'mission',
      status: 'generated',
      authority: 'generated',
      updatedAt: generatedAt,
      generatedAt,
      workspaceRoot: plan.workspaceRoot,
      planId,
      parentMissionId,
      state: 'planned',
      title: `Mission: ${plan.title}`,
      summary: `Execution checklist for ${plan.title}.`,
      objective: plan.goal,
      scope: plan.scope,
      items: buildMissionItems(plan),
      recommendedChecks: plan.recommendedChecks,
      recommendedWorkflowIds: plan.recommendedWorkflows.map((workflow) => workflow.id),
      decisionQuestionIds: plan.decisionQuestions.map((question) => question.id),
      linkedSlices: [],
      coordination: actorId
        ? {
            lastUpdatedBy: actorId,
            lastUpdatedAt: generatedAt,
          }
        : {},
    },
  };
};

const buildMissionItems = (plan: SkoposPlanResult): SkoposMissionItem[] => {
  const items: SkoposMissionItem[] = [];

  for (const question of plan.decisionQuestions) {
    items.push({
      id: `decision-${question.id}`,
      kind: 'decision',
      title: question.question,
      detail: question.whyItMatters,
      status: 'pending',
    });
  }

  for (const step of plan.implementationSteps) {
    items.push({
      id: `step-${step.id}`,
      kind: classifyMissionItemKind(step.id),
      title: step.title,
      detail: step.detail,
      status: 'pending',
    });
  }

  for (const workflow of plan.recommendedWorkflows) {
    items.push({
      id: `workflow-${workflow.id}`,
      kind: 'workflow',
      title: workflow.title,
      detail: workflow.reason,
      status: 'pending',
    });
  }

  return items;
};

const classifyMissionItemKind = (stepId: string): SkoposMissionItem['kind'] => {
  if (stepId === 'run-checks') {
    return 'validation';
  }

  if (stepId === 'sync-knowledge') {
    return 'docs';
  }

  if (stepId === 'run-workflows') {
    return 'workflow';
  }

  return 'implementation';
};

const formatTimestamp = (now: Date): string => {
  const iso = now.toISOString();
  return iso.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
