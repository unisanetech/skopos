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
export type SkoposProofSubjectKind = 'task-closure' | 'project-integration';
export type SkoposTaskWorkflowKind = 'fast-path' | 'tracked' | 'strict';
export type SkoposTaskRiskSelectionSource =
  | 'automatic'
  | 'explicit-override'
  | 'proof-subject';

export interface SkoposTaskAdmissionAssessment {
  recommendedRisk: SkoposTaskRisk;
  recommendedDetail: SkoposTaskDetail;
  selectedRisk: SkoposTaskRisk;
  selectedDetail: SkoposTaskDetail;
  selectionSource: SkoposTaskRiskSelectionSource;
  workflow: SkoposTaskWorkflowKind;
  reasons: string[];
  signals: {
    goalSignals: string[];
    ownedPathCount: number;
    affectedScopeIds: string[];
    impactCategories: string[];
    proofSubjectKind: SkoposProofSubjectKind;
  };
}

export interface SkoposProofSubject {
  kind: SkoposProofSubjectKind;
  baselineId: string;
}
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
  ownedPaths: string[];
  dependencyTaskIds: string[];
  parentAcceptanceRequirementIds: string[];
}

export interface SkoposTaskSplitChildDraft {
  key: string;
  goal: string;
  scopeId?: string;
  acceptanceCriteria?: string[];
  nonGoals?: string[];
  constraints?: string[];
  ownedPaths: string[];
  dependsOnKeys?: string[];
  dependencyTaskIds?: string[];
  parentAcceptanceRequirementIds?: string[];
  risk?: Exclude<SkoposTaskRisk, 'light'>;
  priority?: number;
}

export interface SkoposTaskSplitChildPlan {
  key: string;
  goal: string;
  scopeId?: string;
  acceptanceCriteria: string[];
  nonGoals: string[];
  constraints: string[];
  ownedPaths: string[];
  dependsOnKeys: string[];
  dependencyTaskIds: string[];
  parentAcceptanceRequirementIds: string[];
  risk: Exclude<SkoposTaskRisk, 'light'>;
  priority: number;
}

export interface SkoposTaskSplitProposal
  extends SkoposArtifactEnvelope<'task-split-proposal'> {
  workspaceRoot: string;
  parentTaskId: string;
  parentUpdatedAt: string;
  proposalDigest: string;
  proposedByActorId: string;
  proposalReason: string;
  children: SkoposTaskSplitChildPlan[];
  reviewRequired: true;
  taskAuthoritiesWritten: false;
}

export interface SkoposTaskAssignmentInstruction {
  taskId: string;
  title: string;
  projectShort: string;
  reviewer: {
    parentTaskId: string;
    actorId: string;
  };
  childActorId: string;
  sessionLeaseSeconds: number;
  hostContract: {
    requiredCapabilities: Array<
      | 'create-session'
      | 'inject-initial-prompt'
      | 'return-session-identity'
      | 'send-follow-up'
      | 'wait-for-result'
    >;
    sessionIdSource: 'returned-host-session-identity';
    deliveryStatus: 'not-attempted';
  };
  cliCommand: string;
  sessionContextCommand: string;
  reviewCommand: string;
  mcpTool: 'skopos_task_assign';
  prompt: string;
  sessionBindingFollowUp: string;
  manualFallback: {
    reason: string;
    prompt: string;
    sessionBindingFollowUp: string;
  };
}

export interface SkoposTaskSplitActivation
  extends SkoposArtifactEnvelope<'task-split-activation'> {
  workspaceRoot: string;
  parentTaskId: string;
  proposalDigest: string;
  appliedByActorId: string;
  approvalReason: string;
  childTaskIds: string[];
  assignments: SkoposTaskAssignmentInstruction[];
}

export interface SkoposTaskSplitProposalResult {
  proposal: SkoposTaskSplitProposal;
  proposalPath: string;
  proposalWrite: 'written' | 'dry-run';
}

export interface SkoposTaskSplitActivationResult {
  activation: SkoposTaskSplitActivation;
  activationPath: string;
  activationWrite: 'written' | 'dry-run';
  parentTask: SkoposTaskArtifact;
  childTasks: SkoposTaskArtifact[];
}

export interface SkoposTaskPathState {
  path: string;
  digest: string;
}

export interface SkoposTaskOwnershipExpansion {
  paths: string[];
  reason: string;
  actorId: string;
  recordedAt: string;
  baselinePaths: SkoposTaskPathState[];
  classification?:
    | 'within-scope'
    | 'declared-dependency'
    | 'common-ancestor'
    | 'explicit-multi-scope';
  priorScopeId?: string;
  nextScopeId?: string;
  affectedScopeIds?: string[];
}

export interface SkoposTaskOwnershipSuggestion {
  paths: string[];
  reason: string;
  command: string;
  confirmationRequired: boolean;
}

export interface SkoposTaskWorkflowAssessment {
  taskId: string;
  workflow: SkoposTaskWorkflowKind;
  readiness: 'blocked' | 'work-in-progress' | 'ready-for-closure';
  nextCommand: string;
  nextReason: string;
  ownershipSuggestion?: SkoposTaskOwnershipSuggestion;
  evidence: {
    requiredActionIds: string[];
    acceptanceRequirementIds: string[];
  };
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
  | 'generated-output'
  | 'linked-child-projection'
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
  admission?: SkoposTaskAdmissionAssessment;
  proofSubject: SkoposProofSubject;
  priority: number;
  dependencyTaskIds: string[];
  changeScope: SkoposTaskChangeScope;
  ownershipExpansions?: SkoposTaskOwnershipExpansion[];
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
  status: 'open' | 'resolved' | 'dismissed' | 'promoted';
  resolvedOptionId?: string;
  resolvedAt?: string;
  resolvedByActorId?: string;
  disposition?: SkoposTaskQuestionDisposition;
}

export type SkoposTaskQuestionDispositionKind =
  | 'answered'
  | 'dismissed'
  | 'promoted';

export interface SkoposTaskQuestionDispositionTarget {
  kind: 'option' | 'document' | 'task';
  ref: string;
}

export interface SkoposTaskQuestionDisposition {
  kind: SkoposTaskQuestionDispositionKind;
  reason: string;
  actorId: string;
  recordedAt: string;
  target?: SkoposTaskQuestionDispositionTarget;
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
  actionKind:
    | 'resolve-question'
    | 'implement'
    | 'run-action'
    | 'verify'
    | 'start-child-task';
  linkedQuestionId?: string;
  actionId?: string;
  command?: string;
  ownedPaths?: string[];
  scopeId?: string;
  reason?: string;
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
