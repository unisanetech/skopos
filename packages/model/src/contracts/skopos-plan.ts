import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposContextReference } from './skopos-context-bundle.js';
import type { SkoposDecisionQuestion } from './skopos-decision-question.js';
import type { SkoposResolvedScope } from './skopos-scope-lite.js';
import type { SkoposConfidence } from './skopos-scan-summary.js';
import type { SkoposActionRequirement } from './skopos-action.js';

export interface SkoposPlanStep {
  id: string;
  title: string;
  detail: string;
}

export interface SkoposPlanResult {
  workspaceRoot: string;
  goal: string;
  title: string;
  summary: string;
  scope: SkoposResolvedScope;
  confidence: SkoposConfidence;
  references: SkoposContextReference[];
  implementationSteps: SkoposPlanStep[];
  recommendedChecks: string[];
  recommendedActions: SkoposActionRequirement[];
  decisionQuestions: SkoposDecisionQuestion[];
  risks: string[];
  nextSteps: string[];
}

export interface SkoposPlanArtifact extends SkoposArtifactEnvelope<'plan'> {
  workspaceRoot: string;
  goal: string;
  title: string;
  summary: string;
  createdByActorId?: string;
  parentPlanId?: string;
  scope: SkoposResolvedScope;
  confidence: SkoposConfidence;
  references: SkoposContextReference[];
  implementationSteps: SkoposPlanStep[];
  recommendedChecks: string[];
  recommendedActions: SkoposActionRequirement[];
  decisionQuestions: SkoposDecisionQuestion[];
  risks: string[];
  nextSteps: string[];
  taskIds: string[];
}

export interface SkoposPlanArtifacts {
  planArtifact: SkoposPlanArtifact;
}

export interface SkoposPlanRunResult extends SkoposPlanResult {
  planId: string;
  planPath: string;
  planWrite: 'written' | 'dry-run';
  actorId?: string;
  parentPlanId?: string;
}
