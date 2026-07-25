import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposContextReference } from './skopos-context-bundle.js';
import type { SkoposDecisionQuestion } from './skopos-decision-question.js';
import type { SkoposResolvedScope } from './skopos-scope-lite.js';
import type { SkoposConfidence } from './skopos-scan-summary.js';
import type { SkoposWorkflowRequirement } from './skopos-workflow.js';
import type { SkoposTaskIdentity } from './skopos-task-identity.js';

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
  recommendedWorkflows: SkoposWorkflowRequirement[];
  decisionQuestions: SkoposDecisionQuestion[];
  risks: string[];
  nextSteps: string[];
}

export interface SkoposMissionItem {
  id: string;
  kind: 'decision' | 'implementation' | 'validation' | 'docs' | 'workflow';
  title: string;
  detail: string;
  status: 'pending' | 'complete';
}

export interface SkoposMissionClaim {
  actorId: string;
  claimedAt: string;
}

export interface SkoposMissionCoordination {
  claimedBy?: SkoposMissionClaim;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface SkoposMissionSliceLink {
  planId: string;
  missionId: string;
  title: string;
  goal: string;
  scopeId: string;
  scopeTitle: string;
  scopeKind: SkoposResolvedScope['scope']['kind'];
  scopePath: string;
  state: 'planned' | 'active' | 'blocked' | 'complete';
  createdAt: string;
  createdByActorId?: string;
  claimedByActorId?: string;
}

export interface SkoposMissionArtifact extends SkoposArtifactEnvelope<'mission'> {
  workspaceRoot: string;
  taskIdentity?: SkoposTaskIdentity;
  planId: string;
  parentMissionId?: string;
  state: 'planned' | 'active' | 'blocked' | 'complete';
  title: string;
  summary: string;
  objective: string;
  scope: SkoposResolvedScope;
  items: SkoposMissionItem[];
  recommendedChecks: string[];
  recommendedWorkflowIds: string[];
  decisionQuestionIds: string[];
  linkedSlices: SkoposMissionSliceLink[];
  coordination: SkoposMissionCoordination;
}

export interface SkoposPlanArtifact extends SkoposArtifactEnvelope<'plan'> {
  workspaceRoot: string;
  taskIdentity?: SkoposTaskIdentity;
  goal: string;
  title: string;
  summary: string;
  createdByActorId?: string;
  parentPlanId?: string;
  parentMissionId?: string;
  scope: SkoposResolvedScope;
  confidence: SkoposConfidence;
  references: SkoposContextReference[];
  implementationSteps: SkoposPlanStep[];
  recommendedChecks: string[];
  recommendedWorkflows: SkoposWorkflowRequirement[];
  decisionQuestions: SkoposDecisionQuestion[];
  risks: string[];
  nextSteps: string[];
  missionId: string;
}

export interface SkoposPlanArtifacts {
  planArtifact: SkoposPlanArtifact;
  missionArtifact: SkoposMissionArtifact;
}

export interface SkoposPlanRunResult extends SkoposPlanResult {
  planId: string;
  planPath: string;
  planWrite: 'written' | 'dry-run';
  actorId?: string;
  parentPlanId?: string;
  parentMissionId?: string;
  missionId: string;
  missionPath: string;
  missionWrite: 'written' | 'dry-run';
  graphPath: string;
  graphWrite: 'written' | 'dry-run';
  mission: SkoposMissionArtifact;
}

export interface SkoposMissionSliceRunResult {
  workspaceRoot: string;
  actorId: string;
  parentMission: SkoposMissionArtifact;
  parentMissionPath: string;
  parentMissionWrite: 'written';
  parentGraphPath: string;
  parentGraphWrite: 'written' | 'dry-run';
  slicePlan: SkoposPlanRunResult;
  sliceMission: SkoposMissionArtifact;
}
