import { createHash } from 'node:crypto';

import type { SkoposPlanArtifacts, SkoposPlanResult } from '@skopos/model';

export interface BuildSkoposPlanArtifactsOptions {
  plan: SkoposPlanResult;
  now?: Date;
  actorId?: string;
  parentPlanId?: string;
}

export const buildSkoposPlanArtifacts = ({
  plan,
  now = new Date(),
  actorId,
  parentPlanId,
}: BuildSkoposPlanArtifactsOptions): SkoposPlanArtifacts => {
  const generatedAt = now.toISOString();
  const planId = `P-${createHash('sha256')
    .update(`${now.toISOString()}\0${plan.scope.scope.id}\0${plan.goal}`)
    .digest('hex')
    .slice(0, 8)}`;

  return {
    planArtifact: {
      schemaVersion: 1,
      id: planId,
      type: 'plan',
      status: 'active',
      authority: 'canonical',
      updatedAt: generatedAt,
      generatedAt,
      workspaceRoot: plan.workspaceRoot,
      goal: plan.goal,
      title: plan.title,
      summary: plan.summary,
      createdByActorId: actorId,
      parentPlanId,
      scope: plan.scope,
      confidence: plan.confidence,
      references: plan.references,
      implementationSteps: plan.implementationSteps,
      recommendedChecks: plan.recommendedChecks,
      recommendedActions: plan.recommendedActions,
      decisionQuestions: plan.decisionQuestions,
      risks: plan.risks,
      nextSteps: plan.nextSteps,
      taskIds: [],
    },
  };
};
