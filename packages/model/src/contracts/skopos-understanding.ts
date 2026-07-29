import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposMemoryRoleKind } from './skopos-memory-state.js';
import type { SkoposDecisionQuestion } from './skopos-decision-question.js';
import type { SkoposProjectMode } from './skopos-root-config.js';
import type { SkoposConfidence } from './skopos-scan-summary.js';

export interface SkoposUnderstandingEvidence {
  label: string;
  path: string;
}

export interface SkoposRepoSummaryArea {
  title: string;
  path: string;
  summary: string;
  confidence: SkoposConfidence;
}

export interface SkoposRepoUnderstandingSummaryArtifact
  extends SkoposArtifactEnvelope<'repo-understanding-summary'> {
  workspaceRoot: string;
  projectName: string;
  repoMode: string;
  archetype: string;
  stack: string[];
  purpose: string;
  mainAreas: SkoposRepoSummaryArea[];
  docsEntrypoints: SkoposUnderstandingEvidence[];
  commandSurface: Array<{
    name: string;
    command: string;
  }>;
  uncertainties: string[];
}

export interface SkoposFeatureInventoryEntry {
  id: string;
  title: string;
  ownerPath: string;
  summary: string;
  confidence: SkoposConfidence;
  relatedDocs: SkoposUnderstandingEvidence[];
}

export interface SkoposFeatureInventoryArtifact
  extends SkoposArtifactEnvelope<'feature-inventory'> {
  workspaceRoot: string;
  features: SkoposFeatureInventoryEntry[];
}

export interface SkoposImplementationHotspot {
  id: string;
  title: string;
  path: string;
  reason: string;
  confidence: SkoposConfidence;
  evidence: SkoposUnderstandingEvidence[];
}

export interface SkoposImplementationHotspotsArtifact
  extends SkoposArtifactEnvelope<'implementation-hotspots'> {
  workspaceRoot: string;
  hotspots: SkoposImplementationHotspot[];
}

export type SkoposUnderstandingSetupReviewReadiness =
  | 'ready'
  | 'needs-confirmation';

export type SkoposUnderstandingSetupClaimKind =
  | 'fact'
  | 'inference'
  | 'assumption';

export interface SkoposUnderstandingSetupClaim {
  id: string;
  kind: SkoposUnderstandingSetupClaimKind;
  title: string;
  summary: string;
  confidence: SkoposConfidence;
  evidence: SkoposUnderstandingEvidence[];
}

export interface SkoposUnderstandingSetupAppliedEffect {
  kind: 'config-updated' | 'answer-recorded';
  path?: string;
  summary: string;
}

export interface SkoposUnderstandingSetupAnswerEntry {
  questionId: string;
  optionId: string;
  question: string;
  optionLabel: string;
  rationale: string;
  answeredAt: string;
  actorId?: string;
  appliedEffects: SkoposUnderstandingSetupAppliedEffect[];
}

export interface SkoposUnderstandingSetupAnswersArtifact
  extends SkoposArtifactEnvelope<'understanding-setup-answers'> {
  workspaceRoot: string;
  answers: SkoposUnderstandingSetupAnswerEntry[];
}


export type SkoposAgentAnalysisStatus = 'brief-ready' | 'agent-reviewed';

export interface SkoposAgentAnalysisRead {
  path: string;
  reason: string;
  priority: 'must-read' | 'should-read';
}

export interface SkoposAgentAnalysisTask {
  id: string;
  title: string;
  prompt: string;
  outputExpectation: string;
}

export interface SkoposAgentAnalysisDurableOutput {
  id: string;
  title: string;
  path: string;
  recommendedPath?: string;
  mappedPaths?: string[];
  sourceRole?: SkoposMemoryRoleKind;
  purpose: string;
  status: 'present' | 'missing';
  required: boolean;
}

export interface SkoposAgentAnalysisBriefArtifact
  extends SkoposArtifactEnvelope<'agent-analysis-brief'> {
  workspaceRoot: string;
  analysisStatus: SkoposAgentAnalysisStatus;
  summary: string;
  scannerLimitations: string[];
  requiredReads: SkoposAgentAnalysisRead[];
  analysisTasks: SkoposAgentAnalysisTask[];
  durableOutputs: SkoposAgentAnalysisDurableOutput[];
  nextAgentAction: string;
  nextCommand: string;
}

export interface SkoposUnderstandingSetupReviewArtifact
  extends SkoposArtifactEnvelope<'understanding-setup-review'> {
  workspaceRoot: string;
  readiness: SkoposUnderstandingSetupReviewReadiness;
  lifecycle: 'greenfield' | 'brownfield';
  projectMode?: SkoposProjectMode;
  facts: SkoposUnderstandingSetupClaim[];
  inferences: SkoposUnderstandingSetupClaim[];
  assumptions: SkoposUnderstandingSetupClaim[];
  confirmationQuestions: SkoposDecisionQuestion[];
  openConfirmationQuestions: SkoposDecisionQuestion[];
  answeredQuestions: SkoposUnderstandingSetupAnswerEntry[];
  recommendedActions: string[];
  nextCommand: string;
}

export interface SkoposUnderstandingRuntimeResult {
  workspaceRoot: string;
  summaryPath: string;
  featureInventoryPath: string;
  hotspotsPath: string;
  setupReviewPath: string;
  setupAnswersPath: string;
  agentAnalysisBriefPath: string;
  indexPath: string;
  logPath: string;
  summaryWrite: 'written' | 'dry-run';
  featureInventoryWrite: 'written' | 'dry-run';
  hotspotsWrite: 'written' | 'dry-run';
  setupReviewWrite: 'written' | 'dry-run';
  setupAnswersWrite?: 'written' | 'dry-run';
  agentAnalysisBriefWrite: 'written' | 'dry-run';
  indexWrite: 'written' | 'dry-run';
  logWrite: 'written' | 'dry-run';
  actorId?: string;
  summary: SkoposRepoUnderstandingSummaryArtifact;
  featureInventory: SkoposFeatureInventoryArtifact;
  hotspots: SkoposImplementationHotspotsArtifact;
  setupReview: SkoposUnderstandingSetupReviewArtifact;
  setupAnswers: SkoposUnderstandingSetupAnswersArtifact;
  agentAnalysisBrief: SkoposAgentAnalysisBriefArtifact;
}

export interface SkoposSetupReviewRuntimeResult {
  workspaceRoot: string;
  setupReviewPath: string;
  setupAnswersPath: string;
  agentAnalysisBriefPath: string;
  setupReview: SkoposUnderstandingSetupReviewArtifact;
  setupAnswers: SkoposUnderstandingSetupAnswersArtifact;
  agentAnalysisBrief: SkoposAgentAnalysisBriefArtifact;
}

export interface SkoposSetupAnswerRuntimeResult extends SkoposSetupReviewRuntimeResult {
  questionId: string;
  optionId: string;
  answer: SkoposUnderstandingSetupAnswerEntry;
  configWrite?: 'written' | 'dry-run' | 'unchanged';
  setupAnswersWrite: 'written' | 'dry-run';
  setupReviewWrite: 'written' | 'dry-run';
  indexWrite: 'written' | 'dry-run';
  logWrite: 'written' | 'dry-run';
}
