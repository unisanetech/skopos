import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type {
  SkoposDocumentKnowledgeEntry,
  SkoposDocumentRole,
} from './skopos-knowledge-state.js';
import type { SkoposDecisionOption } from './skopos-decision-question.js';

export const SKOPOS_SETUP_CERTIFICATION_CONSTRAINT =
  'skopos.setup-certification.v1' as const;

export type SkoposAdoptionState =
  | 'uninitialized'
  | 'discovered'
  | 'agent-analysis-required'
  | 'questions-open'
  | 'restructuring-proposed'
  | 'restructuring'
  | 'standard-verified'
  | 'agent-ready'
  | 'team-ready';

export type SkoposAdoptionReadinessLaneId =
  | 'memory'
  | 'scopes'
  | 'capabilities'
  | 'instructions'
  | 'configuration';

export interface SkoposAdoptionReadinessLane {
  id: SkoposAdoptionReadinessLaneId;
  status: 'ready' | 'stale';
  summary: string;
  affectedPaths: string[];
}

export interface SkoposTrackedAdoptionReadiness {
  source: 'tracked-reconstruction';
  state: Extract<SkoposAdoptionState, 'agent-ready' | 'agent-analysis-required'>;
  certificationTaskId: string;
  snapshotPath: string;
  lanes: SkoposAdoptionReadinessLane[];
}

export type SkoposAdoptionEvidenceProvenance = 'observed' | 'inferred';

export interface SkoposAdoptionPathEvidence {
  path: string;
  provenance: SkoposAdoptionEvidenceProvenance;
  reason: string;
}

export interface SkoposAdoptionCommandEvidence {
  name: string;
  command: string;
  provenance: 'observed';
}

export interface SkoposAdoptionRoleGap {
  role: SkoposDocumentRole;
  status: 'missing' | 'present-unverified';
  candidatePaths: string[];
  reason: string;
}

export interface SkoposAdoptionAuthorityConflict {
  code: string;
  paths: string[];
  summary: string;
  provenance: 'observed';
}

export interface SkoposAdoptionIntakeArtifact
  extends SkoposArtifactEnvelope<'adoption-intake'> {
  workspaceRoot: string;
  adoptionState: Extract<SkoposAdoptionState, 'agent-analysis-required'>;
  assessmentOnly: true;
  inputDigest: string;
  memoryRoots: Array<{
    scopeId: string;
    path: string;
  }>;
  documents: SkoposDocumentKnowledgeEntry[];
  codeRoots: SkoposAdoptionPathEvidence[];
  instructionFiles: SkoposAdoptionPathEvidence[];
  commands: SkoposAdoptionCommandEvidence[];
  ciPaths: SkoposAdoptionPathEvidence[];
  generatedSourcePaths: SkoposAdoptionPathEvidence[];
  authorityConflicts: SkoposAdoptionAuthorityConflict[];
  memoryRoleGaps: SkoposAdoptionRoleGap[];
}

export interface SkoposAdoptionAnalysisTask {
  id: string;
  title: string;
  instruction: string;
  requiredOutput: string;
}

export interface SkoposAdoptionAnalysisBriefArtifact
  extends SkoposArtifactEnvelope<'adoption-analysis-brief'> {
  workspaceRoot: string;
  adoptionState: Extract<SkoposAdoptionState, 'agent-analysis-required'>;
  assessmentOnly: true;
  intakePath: string;
  requiredReads: SkoposAdoptionPathEvidence[];
  analysisTasks: SkoposAdoptionAnalysisTask[];
  materialQuestionRule: string;
  prohibitedClaims: string[];
  nextAgentAction: string;
}

export interface SkoposAdoptionAssessmentRuntimeResult {
  workspaceRoot: string;
  adoptionState: Extract<SkoposAdoptionState, 'agent-analysis-required'>;
  assessmentOnly: true;
  intakePath: string;
  analysisBriefPath: string;
  intakeWrite: 'written' | 'dry-run';
  analysisBriefWrite: 'written' | 'dry-run';
  indexPath: string;
  indexWrite: 'written' | 'dry-run';
  logPath: string;
  logWrite: 'written' | 'dry-run';
  actorId?: string;
  intake: SkoposAdoptionIntakeArtifact;
  analysisBrief: SkoposAdoptionAnalysisBriefArtifact;
}

export type SkoposAdoptionClaimKind =
  | 'fact'
  | 'inference'
  | 'assumption'
  | 'contradiction';

export interface SkoposAdoptionAnalysisClaim {
  id: string;
  kind: SkoposAdoptionClaimKind;
  summary: string;
  evidencePaths: string[];
  confidence: 'low' | 'medium' | 'high';
}

export interface SkoposAdoptionMaterialQuestion {
  id: string;
  question: string;
  whyItMatters: string;
  evidencePaths: string[];
  material: true;
  recommendedOptionId: string;
  options: SkoposDecisionOption[];
  whatHappensAfterAnswer: string;
}

export type SkoposAdoptionDocumentOperationKind =
  | 'keep'
  | 'move'
  | 'merge'
  | 'split'
  | 'rewrite'
  | 'archive'
  | 'delete';

export interface SkoposAdoptionDocumentDisposition {
  id: string;
  operation: SkoposAdoptionDocumentOperationKind;
  sourcePaths: string[];
  targetPaths: string[];
  rationale: string;
  retainedTruth: string;
  informationLossRisk: 'none' | 'low' | 'material';
  linkImpact: string[];
  authorityImpact: string;
}

export interface SkoposAdoptionReviewedAnalysisInput {
  schemaVersion: 1;
  intakeDigest: string;
  claims: SkoposAdoptionAnalysisClaim[];
  materialQuestions: SkoposAdoptionMaterialQuestion[];
  documentDispositions: SkoposAdoptionDocumentDisposition[];
}

export interface SkoposAdoptionReviewedAnalysisArtifact
  extends SkoposArtifactEnvelope<'adoption-reviewed-analysis'> {
  workspaceRoot: string;
  intakeDigest: string;
  adoptionState: Extract<
    SkoposAdoptionState,
    'questions-open' | 'restructuring-proposed'
  >;
  reviewedByActorId: string;
  reviewedAt: string;
  claims: SkoposAdoptionAnalysisClaim[];
  materialQuestions: SkoposAdoptionMaterialQuestion[];
  documentDispositions: SkoposAdoptionDocumentDisposition[];
}

export interface SkoposAdoptionRestructuringProposalArtifact
  extends SkoposArtifactEnvelope<'adoption-restructuring-proposal'> {
  workspaceRoot: string;
  intakeDigest: string;
  proposalDigest: string;
  adoptionState: Extract<SkoposAdoptionState, 'restructuring-proposed'>;
  approval: 'pending';
  requiresApproval: true;
  operations: SkoposAdoptionDocumentDisposition[];
  targetTree: string[];
  linkImpact: Array<{
    operationId: string;
    references: string[];
  }>;
  authorityImpact: Array<{
    operationId: string;
    summary: string;
  }>;
  informationLossRisks: Array<{
    operationId: string;
    risk: 'low' | 'material';
    retainedTruth: string;
  }>;
}

export interface SkoposAdoptionProposalRuntimeResult {
  workspaceRoot: string;
  adoptionState: Extract<
    SkoposAdoptionState,
    'questions-open' | 'restructuring-proposed'
  >;
  analysisPath: string;
  proposalPath?: string;
  analysisWrite: 'written' | 'dry-run';
  proposalWrite?: 'written' | 'dry-run';
  logPath: string;
  logWrite: 'written' | 'dry-run';
  actorId: string;
  analysis: SkoposAdoptionReviewedAnalysisArtifact;
  proposal?: SkoposAdoptionRestructuringProposalArtifact;
}

export interface SkoposAdoptionApprovalArtifact
  extends SkoposArtifactEnvelope<'adoption-proposal-approval'> {
  workspaceRoot: string;
  adoptionState: Extract<SkoposAdoptionState, 'restructuring'>;
  proposalDigest: string;
  approvedOperationIds: string[];
  materialRiskAccepted: boolean;
  approvedAt: string;
  approvedByActorId: string;
  reason: string;
}

export interface SkoposAdoptionExecutionBriefArtifact
  extends SkoposArtifactEnvelope<'adoption-execution-brief'> {
  workspaceRoot: string;
  adoptionState: Extract<SkoposAdoptionState, 'restructuring'>;
  proposalDigest: string;
  approvedOperationIds: string[];
  instructions: string[];
  operations: SkoposAdoptionDocumentDisposition[];
  executionInputTemplate: SkoposAdoptionExecutionInput;
  verificationCommand: string;
}

export interface SkoposAdoptionApprovalRuntimeResult {
  workspaceRoot: string;
  adoptionState: Extract<SkoposAdoptionState, 'restructuring'>;
  proposalPath: string;
  approvalPath: string;
  approvalWrite: 'written' | 'dry-run';
  executionBriefPath: string;
  executionBriefWrite: 'written' | 'dry-run';
  logPath: string;
  logWrite: 'written' | 'dry-run';
  actorId: string;
  approval: SkoposAdoptionApprovalArtifact;
  executionBrief: SkoposAdoptionExecutionBriefArtifact;
}

export interface SkoposAdoptionOperationExecutionEvidence {
  operationId: string;
  resultPaths: string[];
  summary: string;
  retainedTruthVerified: true;
}

export interface SkoposAdoptionExecutionInput {
  schemaVersion: 1;
  proposalDigest: string;
  operations: SkoposAdoptionOperationExecutionEvidence[];
}

export interface SkoposAdoptionVerificationCheck {
  id: string;
  status: 'pass' | 'fail';
  summary: string;
  paths: string[];
}

export interface SkoposAdoptionVerificationArtifact
  extends SkoposArtifactEnvelope<'adoption-standard-verification'> {
  workspaceRoot: string;
  adoptionState: Extract<SkoposAdoptionState, 'standard-verified'>;
  proposalDigest: string;
  verifiedOperationIds: string[];
  verifiedByActorId: string;
  verifiedAt: string;
  executionEvidence: SkoposAdoptionOperationExecutionEvidence[];
  checks: SkoposAdoptionVerificationCheck[];
}

export interface SkoposAdoptionVerificationRuntimeResult {
  workspaceRoot: string;
  adoptionState: Extract<SkoposAdoptionState, 'standard-verified'>;
  proposalPath: string;
  approvalPath: string;
  verificationPath: string;
  verificationWrite: 'written' | 'dry-run';
  logPath: string;
  logWrite: 'written' | 'dry-run';
  actorId: string;
  verification: SkoposAdoptionVerificationArtifact;
}

export interface SkoposAdoptionActivationArtifact
  extends SkoposArtifactEnvelope<'adoption-activation'> {
  workspaceRoot: string;
  adoptionState: Extract<SkoposAdoptionState, 'agent-ready'>;
  proposalDigest: string;
  verifiedOperationIds: string[];
  activatedAt: string;
  activatedByActorId: string;
  reason: string;
}

export interface SkoposAdoptionActivationRuntimeResult {
  workspaceRoot: string;
  adoptionState: Extract<SkoposAdoptionState, 'agent-ready'>;
  activationPath: string;
  activationWrite: 'written' | 'dry-run';
  logPath: string;
  logWrite: 'written' | 'dry-run';
  actorId: string;
  activation: SkoposAdoptionActivationArtifact;
}
