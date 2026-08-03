import type { SkoposActionRequirement } from './skopos-action.js';
import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposResolvedScope } from './skopos-scope-lite.js';
import type { SkoposTaskIdentity } from './skopos-task-identity.js';
import type {
  SkoposDecisionEscalationClass,
  SkoposDecisionOption,
} from './skopos-decision-question.js';

export type SkoposTaskRisk = 'light' | 'standard' | 'high-impact';
export type SkoposTaskDetail = 'light' | 'standard' | 'detailed';
export type SkoposTaskState =
  | 'ready'
  | 'active'
  | 'blocked'
  | 'deferred'
  | 'verifying'
  | 'ready-to-integrate'
  | 'complete'
  | 'cancelled'
  | 'superseded';

export type SkoposTaskDispositionKind =
  | 'resume'
  | 'ready'
  | 'defer'
  | 'return-from-verification'
  | 'cancel'
  | 'supersede';

export interface SkoposTaskDispositionRecord {
  kind: SkoposTaskDispositionKind;
  reason: string;
  actorId: string;
  recordedAt: string;
  priorState: SkoposTaskState;
  nextState: SkoposTaskState;
  successorTaskId?: string;
}

export type SkoposTaskStepKind =
  | 'decision'
  | 'implementation'
  | 'verification'
  | 'docs'
  | 'action';

export type SkoposTaskStepStatus =
  | 'pending'
  | 'in-progress'
  | 'blocked'
  | 'complete'
  | 'skipped';

export interface SkoposTaskStep {
  id: string;
  kind: SkoposTaskStepKind;
  title: string;
  detail: string;
  status: SkoposTaskStepStatus;
}

export interface SkoposTaskClaim {
  actorId: string;
  claimedAt: string;
}

export interface SkoposTaskCoordination {
  claimedBy?: SkoposTaskClaim;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface SkoposChildTaskReference {
  taskId: string;
  title: string;
  goal: string;
  scopeId: string;
  state: SkoposTaskState;
  createdAt: string;
  createdByActorId?: string;
  claimedByActorId?: string;
}

export interface SkoposTaskPathState {
  path: string;
  digest: string;
}

export type SkoposTaskPathAttributionKind =
  | 'task-owned'
  | 'task-attributed'
  | 'pre-existing'
  | 'other-task'
  | 'external-unattributed';

export type SkoposTaskPathAttributionReason =
  | 'declared-task-ownership'
  | 'current-task-mutation'
  | 'unchanged-admission-baseline'
  | 'other-task-mutation'
  | 'unattributed-post-admission-change';

export interface SkoposTaskPathAttribution {
  path: string;
  kind: SkoposTaskPathAttributionKind;
  reason: SkoposTaskPathAttributionReason;
  attributedTaskId?: string;
}

export interface SkoposTaskPathMutationAttribution {
  path: string;
  taskId: string;
  digest: string;
  attributedAt: string;
}

export interface SkoposTaskChangeScope {
  capturedAt: string;
  trackingMode?: 'git' | 'unavailable';
  baselineRevision?: string;
  baselineDirtyPaths: SkoposTaskPathState[];
  declaredOwnedPaths: string[];
}

export interface SkoposTaskEvidenceRequirement {
  id: string;
  acceptanceCriterion: string;
  phase: 'admission' | 'iteration' | 'stabilization' | 'closure';
  actionIds: string[];
  guardIds: string[];
  evidence: 'source-bound-action' | 'agent-observation';
}

export interface SkoposTaskMemoryObligation {
  id: string;
  role: 'decision' | 'finding' | 'pattern' | 'architecture' | 'standard' | 'guide';
  reason: string;
  status: 'open' | 'complete';
  targetPath?: string;
  resolution?: 'memory-updated' | 'reviewed-no-change';
  resolutionReason?: string;
  resolvedAt?: string;
  resolvedByActorId?: string;
}

export interface SkoposTaskContractDeclaration {
  acceptanceCriteria: string[];
  nonGoals: string[];
  constraints: string[];
}

export interface SkoposTaskArtifact extends SkoposArtifactEnvelope<'task'> {
  workspaceRoot: string;
  taskIdentity: SkoposTaskIdentity;
  trackedDocumentPath?: string;
  planIds: string[];
  parentTaskId?: string;
  childTasks: SkoposChildTaskReference[];
  state: SkoposTaskState;
  disposition?: SkoposTaskDispositionRecord;
  supersededByTaskId?: string;
  detail: SkoposTaskDetail;
  title: string;
  goal: string;
  scope: SkoposResolvedScope;
  contract: SkoposTaskContractDeclaration;
  risk: SkoposTaskRisk;
  priority: number;
  dependencyTaskIds: string[];
  changeScope: SkoposTaskChangeScope;
  steps: SkoposTaskStep[];
  selectedActions: SkoposActionRequirement[];
  selectedGuardIds: string[];
  evidenceRequirements: SkoposTaskEvidenceRequirement[];
  memoryObligations: SkoposTaskMemoryObligation[];
  questions: SkoposTaskQuestion[];
  recommendations: SkoposTaskRecommendation[];
  coordination: SkoposTaskCoordination;
}

export interface SkoposTaskRunResult {
  workspaceRoot: string;
  actorId?: string;
  summary: string;
  taskPath: string;
  taskWrite: 'written' | 'dry-run';
  task: SkoposTaskArtifact;
  questionsPath: string;
  questionsWrite: 'written' | 'dry-run';
  questions: SkoposTaskQuestionArtifact;
  recommendationsPath: string;
  recommendationsWrite: 'written' | 'dry-run';
  recommendations: SkoposTaskRecommendationArtifact;
}

export interface SkoposTaskQuestion {
  id: string;
  category: string;
  escalation: SkoposDecisionEscalationClass;
  question: string;
  whyItMatters: string;
  blocking: boolean;
  recommendedOptionId: string;
  options: SkoposDecisionOption[];
  status: 'open' | 'resolved';
  resolvedOptionId?: string;
  resolvedAt?: string;
  resolvedByActorId?: string;
}

export interface SkoposTaskQuestionArtifact extends SkoposArtifactEnvelope<'task-questions'> {
  workspaceRoot: string;
  taskIdentity: SkoposTaskIdentity;
  taskId: string;
  entries: SkoposTaskQuestion[];
}

export interface SkoposTaskRecommendation {
  id: string;
  title: string;
  summary: string;
  priority: 'high' | 'medium' | 'low';
  actionKind: 'resolve-question' | 'implement' | 'run-action' | 'verify';
  linkedQuestionId?: string;
  actionId?: string;
  blocking: boolean;
  status: 'open' | 'complete' | 'dismissed';
}

export interface SkoposTaskRecommendationArtifact
  extends SkoposArtifactEnvelope<'task-recommendations'> {
  workspaceRoot: string;
  taskIdentity: SkoposTaskIdentity;
  taskId: string;
  entries: SkoposTaskRecommendation[];
}
