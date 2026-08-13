import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposDecisionOption } from './skopos-decision-question.js';
import type { SkoposTaskPathState } from './skopos-task.js';

export type SkoposSetupStage =
  | 'inspection-required'
  | 'questions-open'
  | 'plan-ready'
  | 'applying'
  | 'verification-blocked'
  | 'setup-ready'
  | 'setup-ready-with-deferred-options';

export type SkoposSetupLaneId =
  | 'understanding'
  | 'scopes'
  | 'memory'
  | 'capabilities'
  | 'policies'
  | 'skills'
  | 'instructions'
  | 'host-delivery';

export type SkoposSetupLaneStatus =
  | 'ready'
  | 'needs-review'
  | 'blocked'
  | 'deferred';

export type SkoposSetupDispositionKind =
  | 'accept'
  | 'edit'
  | 'defer'
  | 'reject';

export interface SkoposSetupLane {
  id: SkoposSetupLaneId;
  title: string;
  status: SkoposSetupLaneStatus;
  summary: string;
  required: boolean;
  evidencePaths: string[];
  blocker?: string;
}

export interface SkoposSetupRecommendation {
  id: string;
  laneId: SkoposSetupLaneId;
  title: string;
  summary: string;
  reason: string;
  sourceDigest: string;
  required: boolean;
  risk: 'low' | 'medium' | 'high';
  defaultDisposition: Extract<SkoposSetupDispositionKind, 'accept' | 'defer'>;
  options: SkoposDecisionOption[];
  applyKind:
    | 'setup-bootstrap'
    | 'agent-memory-work'
    | 'scope-review'
    | 'capability-candidate'
    | 'policy-pack'
    | 'skill-pack'
    | 'instruction-sync'
    | 'host-proof';
  applyRef?: string;
}

export interface SkoposSetupDisposition {
  recommendationId: string;
  sourceDigest: string;
  disposition: SkoposSetupDispositionKind;
  note?: string;
  decidedAt: string;
  actorId?: string;
}

export interface SkoposSetupStateArtifact
  extends SkoposArtifactEnvelope<'setup-state'> {
  workspaceRoot: string;
  stage: SkoposSetupStage;
  currentStep: string;
  lanes: SkoposSetupLane[];
  recommendations: SkoposSetupRecommendation[];
  dispositions: SkoposSetupDisposition[];
  openQuestionCount: number;
  materialQuestions: Array<{
    id: string;
    question: string;
    whyItMatters: string;
    evidencePaths: string[];
    recommendedOptionId: string;
    options: SkoposDecisionOption[];
    answerCommand: string;
    blocking: true;
    interaction: 'must-ask-and-wait';
  }>;
  deferredRecommendationCount: number;
  invalidatedDispositionIds: string[];
  completedApplyIds: string[];
  certificationTaskId?: string;
  failedApply?: {
    recommendationId: string;
    message: string;
    failedAt: string;
  };
  agentPacketPath: string;
  hostDeliveryReceiptPath: string;
  nextCommand: string;
}

export interface SkoposSetupAgentPacketArtifact
  extends SkoposArtifactEnvelope<'setup-agent-packet'> {
  workspaceRoot: string;
  stage: SkoposSetupStage;
  objective: string;
  responseObjective: string;
  requiredReads: Array<{
    path: string;
    reason: string;
    priority: 'must-read' | 'should-read';
  }>;
  workItems: Array<{
    id: string;
    laneId: SkoposSetupLaneId;
    title: string;
    instruction: string;
    targetPath?: string;
    operation:
      | 'inspect'
      | 'keep'
      | 'move'
      | 'merge'
      | 'split'
      | 'rewrite'
      | 'archive'
      | 'delete'
      | 'create-from-evidence'
      | 'review-scope'
      | 'apply-approved'
      | 'verify-host';
    approvalRequired: boolean;
    sourcePaths?: string[];
    targetPaths?: string[];
    evidencePaths?: string[];
    retainedTruth?: string;
    informationLossRisk?: 'none' | 'low' | 'material';
    scopeProposal?: {
      kind: string;
      codeRoots: string[];
      memoryRoot: string;
      rationale: string;
    };
    completionRequirements?: {
      recommendationId: string;
      recommendationSourceDigest: string;
      expectedPathStates: Array<{
        path: string;
        expectation: 'present' | 'missing';
      }>;
      submitCommand: string;
    };
  }>;
  approvalBoundaries: string[];
  prohibitedClaims: string[];
  responseSections: string[];
  submissionPath: string;
  submissionSchema: {
    claims: 'fact | inference | contradiction | unknown, each with evidencePaths';
    materialQuestions: 'question, whyItMatters, evidencePaths, recommended option and alternatives';
    scopeProposals: 'id, title, kind, codeRoots, memoryRoot, evidencePaths and rationale';
    documentOperations: 'keep | move | merge | split | rewrite | archive | delete | create-from-evidence with source/target paths and retained truth';
  };
  exactContinuation: string;
}

export interface SkoposSetupAnalysisArtifact
  extends SkoposArtifactEnvelope<'setup-analysis'> {
  workspaceRoot: string;
  sourceDigest: string;
  sourcePathStates: SkoposTaskPathState[];
  submittedByActorId: string;
  claims: Array<{
    id: string;
    kind: 'fact' | 'inference' | 'contradiction' | 'unknown';
    summary: string;
    evidencePaths: string[];
  }>;
  materialQuestions: Array<{
    id: string;
    question: string;
    whyItMatters: string;
    evidencePaths: string[];
    recommendedOptionId: string;
    options: SkoposDecisionOption[];
  }>;
  scopeProposals: Array<{
    id: string;
    title: string;
    kind: string;
    codeRoots: string[];
    memoryRoot: string;
    evidencePaths: string[];
    rationale: string;
  }>;
  documentOperations: Array<{
    id: string;
    operation: 'keep' | 'move' | 'merge' | 'split' | 'rewrite' | 'archive' | 'delete' | 'create-from-evidence';
    sourcePaths: string[];
    targetPaths: string[];
    rationale: string;
    retainedTruth: string;
    evidencePaths: string[];
    informationLossRisk: 'none' | 'low' | 'material';
  }>;
  recommendationRevisions?: Array<{
    recommendationId: string;
    title?: string;
    summary?: string;
    reason?: string;
    applyRef?: string;
    evidencePaths: string[];
  }>;
}

export interface SkoposSetupHostDeliveryReceiptArtifact
  extends SkoposArtifactEnvelope<'setup-host-delivery-receipt'> {
  workspaceRoot: string;
  host: string;
  sessionId: string;
  actorId: string;
  communicationContractMarker: string;
  communicationContractDigest: string;
  instructionSourcePath: string;
  instructionSourceDigest: string;
  deliveredAt: string;
  deliveryAuthority: 'host-confirmed';
}

export interface SkoposSetupCompletionReceiptArtifact
  extends SkoposArtifactEnvelope<'setup-completion-receipt'> {
  workspaceRoot: string;
  recommendationId: string;
  recommendationSourceDigest: string;
  statement: string;
  sourcePathStates: SkoposTaskPathState[];
  sourceStateDigest: string;
  submittedByActorId: string;
  submittedAt: string;
}

export interface SkoposSetupRuntimeResult {
  workspaceRoot: string;
  statePath: string;
  stateWrite: 'written' | 'dry-run';
  state: SkoposSetupStateArtifact;
  actorId?: string;
}

export interface SkoposSetupDispositionRuntimeResult extends SkoposSetupRuntimeResult {
  disposition: SkoposSetupDisposition;
}
