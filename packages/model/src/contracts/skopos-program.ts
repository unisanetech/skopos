import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposReadiness, SkoposTrustLevel } from './skopos-trust-report.js';

export type SkoposProgramItemSourceKind =
  | 'mission'
  | 'finding'
  | 'workflow-recommendation'
  | 'discussion-checkpoint'
  | 'trust-blocker'
  | 'roadmap-item'
  | 'manual';

export type SkoposProgramItemStatus =
  | 'candidate'
  | 'ready'
  | 'active'
  | 'blocked'
  | 'deferred'
  | 'done';

export type SkoposProgramPriority = 'critical' | 'high' | 'medium' | 'low';

export type SkoposProgramRecommendedDisposition =
  | 'do-now'
  | 'do-next'
  | 'defer'
  | 'interrupt-current';

export type SkoposProgramObligationKind =
  | 'docs'
  | 'ui'
  | 'runtime'
  | 'validation'
  | 'workflows';

export type SkoposProgramObligationStatus = 'open' | 'complete';

export type SkoposProgramRoutingDecision =
  | 'continue-current'
  | 'interrupt-current'
  | 'start-do-now'
  | 'idle';

export type SkoposProgramRecommendedActionKind =
  | 'continue-current-mission'
  | 'complete-current-mission'
  | 'start-mission'
  | 'run-workflow-recommendation'
  | 'review-program-state';

export interface SkoposProgramScopeRef {
  id: string;
  kind: string;
  title: string;
  path: string;
}

export interface SkoposProgramItem {
  id: string;
  title: string;
  summary: string;
  sourceKind: SkoposProgramItemSourceKind;
  sourceRef: string;
  scope: SkoposProgramScopeRef;
  status: SkoposProgramItemStatus;
  priority: SkoposProgramPriority;
  whyNow: string;
  dependencies: string[];
  interruptsCurrentMission: boolean;
  recommendedDisposition: SkoposProgramRecommendedDisposition;
  linkedPlanId?: string;
  linkedMissionId?: string;
  recommendedCommand?: string;
  obligationIds: string[];
}

export interface SkoposProgramObligation {
  id: string;
  kind: SkoposProgramObligationKind;
  title: string;
  reason: string;
  targetRef: string;
  linkedItemId: string;
  status: SkoposProgramObligationStatus;
}

export interface SkoposProgramInterruptRecommendation {
  decision: SkoposProgramRoutingDecision;
  summary: string;
  reason: string;
  itemId?: string;
}

export interface SkoposProgramSequence {
  currentActiveItemId?: string;
  doNow?: string;
  doNext?: string;
  deferred: string[];
  interruptRecommendation: SkoposProgramInterruptRecommendation;
  openProgramQuestions: string[];
}

export interface SkoposProgramAttention {
  title: string;
  summary: string;
  openItemCount: number;
  openObligationCount: number;
  interruptingItemCount: number;
}

export interface SkoposProgramSourcesDigest {
  activeFindingCount: number;
  activeMissionCount: number;
  promotedCheckpointCount: number;
  workflowQuestionCount: number;
  workflowRecommendationCount: number;
  trustLevel: SkoposTrustLevel | 'unknown';
  readiness: SkoposReadiness | 'unknown';
}

export interface SkoposProgramRecommendedAction {
  kind: SkoposProgramRecommendedActionKind;
  title: string;
  summary: string;
  command?: string;
  linkedItemId?: string;
}

export interface SkoposProgramStateArtifact extends SkoposArtifactEnvelope<'program-state'> {
  workspaceRoot: string;
  items: SkoposProgramItem[];
  sequence: SkoposProgramSequence;
  obligations: SkoposProgramObligation[];
  attention: SkoposProgramAttention;
  recommendedAction?: SkoposProgramRecommendedAction;
  sourcesDigest: SkoposProgramSourcesDigest;
}
