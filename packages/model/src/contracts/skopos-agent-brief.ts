import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposClosureStatus } from './skopos-done-report.js';
import type { SkoposEvalStatus, SkoposEvalProofStatus } from './skopos-eval.js';
import type { SkoposMissionArtifact } from './skopos-plan.js';
import type {
  SkoposProgramRecommendedActionKind,
  SkoposProgramRoutingDecision,
} from './skopos-program.js';
import type { SkoposReadiness, SkoposTrustCheckStatus, SkoposTrustLevel } from './skopos-trust-report.js';
import type { SkoposWorkflowRecommendationEntry } from './skopos-workflow-recommendation.js';

export type SkoposAgentBriefKind = 'trust' | 'done' | 'program' | 'eval' | 'mission' | 'prompt';

interface SkoposAgentBriefBase<K extends SkoposAgentBriefKind>
  extends SkoposArtifactEnvelope<'agent-brief'> {
  workspaceRoot: string;
  briefKind: K;
  nextCommand?: string;
}

export interface SkoposAgentBriefCheckCounts {
  pass: number;
  warn: number;
  fail: number;
}

export interface SkoposAgentBriefAttentionCheck {
  id: string;
  status: SkoposTrustCheckStatus;
  summary: string;
}

export type SkoposAgentPromptLayerKind =
  | 'stable-system-tool-prefix'
  | 'stable-workspace-doctrine-prefix'
  | 'dynamic-execution-tail';

export interface SkoposAgentPromptLayerReference {
  id: string;
  title: string;
  role: string;
  path?: string;
  optional?: boolean;
  defaultIncluded: boolean;
  available: boolean;
  estimatedTokens?: number;
}

export interface SkoposAgentPromptLayer {
  id: string;
  kind: SkoposAgentPromptLayerKind;
  summary: string;
  estimatedTokens: number;
  references: SkoposAgentPromptLayerReference[];
}

export interface SkoposAgentPromptBudgetMeasurement {
  id: string;
  title: string;
  path?: string;
  estimatedTokens: number;
  budgetTokens: number;
  status: 'within-budget' | 'over-budget' | 'missing';
}

export interface SkoposAgentTrustBriefArtifact extends SkoposAgentBriefBase<'trust'> {
  trustLevel: SkoposTrustLevel;
  readiness: SkoposReadiness;
  checkCounts: SkoposAgentBriefCheckCounts;
  attentionChecks: SkoposAgentBriefAttentionCheck[];
  findingCount: number;
  unresolvedAssumptionCount: number;
}

export interface SkoposAgentDoneBriefArtifact extends SkoposAgentBriefBase<'done'> {
  closureStatus: SkoposClosureStatus;
  trustLevel: SkoposTrustLevel;
  readiness: SkoposReadiness;
  checkCounts: SkoposAgentBriefCheckCounts;
  attentionChecks: SkoposAgentBriefAttentionCheck[];
  requiredActions: string[];
  changedPathCount: number;
  missionId?: string;
  missionState?: SkoposMissionArtifact['state'];
  missionEvalStatus?: SkoposEvalStatus;
  blockingQuestionIds: string[];
}

export interface SkoposAgentProgramBriefArtifact extends SkoposAgentBriefBase<'program'> {
  currentDisposition: SkoposProgramRoutingDecision;
  currentMissionId?: string;
  doNowItemId?: string;
  doNextItemId?: string;
  openProgramQuestionIds: string[];
  openObligationCount: number;
  recommendedActionKind?: SkoposProgramRecommendedActionKind;
  recommendedActionSummary?: string;
  interruptSummary: string;
}

export interface SkoposAgentEvalBriefArtifact extends SkoposAgentBriefBase<'eval'> {
  missionId: string;
  evaluationStatus: SkoposEvalStatus;
  trustLevel: SkoposTrustLevel;
  readiness: SkoposReadiness;
  blockingQuestionIds: string[];
  pendingItemIds: string[];
  failingCheckCommands: string[];
  failingWorkflowIds: string[];
  proofStatus: SkoposEvalProofStatus;
}

export interface SkoposAgentMissionBriefArtifact extends SkoposAgentBriefBase<'mission'> {
  missionId: string;
  missionState: SkoposMissionArtifact['state'];
  scopeId: string;
  claimedByActorId?: string;
  codeAllowed: boolean;
  blockingQuestionIds: string[];
  pendingItemIds: string[];
  completedItemCount: number;
  totalItemCount: number;
  recommendedActionKind?: SkoposWorkflowRecommendationEntry['actionKind'];
  recommendedActionSummary?: string;
  executionSurfaceKind?: 'artifact-only' | 'artifact-plus-workpack-doc';
  nextItemId?: string;
  nextItemTitle?: string;
}

export interface SkoposAgentPromptBriefArtifact extends SkoposAgentBriefBase<'prompt'> {
  activeMissionId?: string;
  latestHandoffPath?: string;
  stablePrefixSummary: string;
  dynamicTailSummary: string;
  recommendedLoadSequence: string[];
  layers: SkoposAgentPromptLayer[];
  measurements: SkoposAgentPromptBudgetMeasurement[];
  defaultResumeEstimatedTokens: number;
  defaultResumeBudgetTokens: number;
  overBudgetIds: string[];
}

export type SkoposAgentBriefArtifact =
  | SkoposAgentTrustBriefArtifact
  | SkoposAgentDoneBriefArtifact
  | SkoposAgentProgramBriefArtifact
  | SkoposAgentEvalBriefArtifact
  | SkoposAgentMissionBriefArtifact
  | SkoposAgentPromptBriefArtifact;
