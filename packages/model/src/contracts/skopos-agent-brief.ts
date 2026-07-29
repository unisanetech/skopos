import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type {
  SkoposResolvedPolicyArtifact,
} from './skopos-policy-pack.js';
import type { SkoposTaskRisk, SkoposTaskState } from './skopos-task.js';

export type SkoposAgentBriefKind =
  | 'task'
  | 'readiness'
  | 'prompt'
  | 'policy'
  | 'communication';

interface SkoposAgentBriefBase<K extends SkoposAgentBriefKind>
  extends SkoposArtifactEnvelope<'agent-brief'> {
  workspaceRoot: string;
  briefKind: K;
  nextCommand?: string;
}

export type SkoposAgentPromptLayerKind =
  | 'stable-system-tool-prefix'
  | 'stable-workspace-doctrine-prefix'
  | 'stable-project-policy-prefix'
  | 'dynamic-task-tail';

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

export interface SkoposAgentTaskBriefArtifact extends SkoposAgentBriefBase<'task'> {
  taskId: string;
  taskState: SkoposTaskState;
  scopeId: string;
  claimedByActorId?: string;
  blockingQuestionIds: string[];
  nextStepId?: string;
  nextStepTitle?: string;
}

export interface SkoposAgentReadinessBriefArtifact
  extends SkoposAgentBriefBase<'readiness'> {
  taskId: string;
  target: 'continue' | 'integrate' | 'close';
  readiness: 'ready' | 'blocked';
  blockerCount: number;
}

export interface SkoposAgentPolicyBriefArtifact extends SkoposAgentBriefBase<'policy'> {
  projectLifecycle: SkoposResolvedPolicyArtifact['projectLifecycle'];
  acceptedPackIds: string[];
  activeRuleCount: number;
  mustRuleCount: number;
  defaultTaskRisk: SkoposTaskRisk;
  detailedTaskTriggers: string[];
  sourcePaths: string[];
  roleMappingPath?: string;
  mappedRoleCount?: number;
  missingRequiredRoleCount?: number;
}

export interface SkoposAgentPromptBriefArtifact extends SkoposAgentBriefBase<'prompt'> {
  currentTaskId?: string;
  currentHandoffPath?: string;
  stablePrefixSummary: string;
  dynamicTailSummary: string;
  recommendedLoadSequence: string[];
  layers: SkoposAgentPromptLayer[];
  measurements: SkoposAgentPromptBudgetMeasurement[];
  defaultResumeEstimatedTokens: number;
  defaultResumeBudgetTokens: number;
  overBudgetIds: string[];
}

export interface SkoposAgentCommunicationRule {
  id: string;
  situation: string;
  agentShouldDo: string;
  userFacingTemplate?: string;
}

export interface SkoposAgentCommunicationBriefArtifact
  extends SkoposAgentBriefBase<'communication'> {
  audience: 'beginner-mid-level' | 'expert' | 'mixed';
  startupRules: string[];
  tone: string[];
  defaultResponseShape: string[];
  questionRules: string[];
  progressRules: string[];
  closureRules: string[];
  memoryUpdateRules: string[];
  escalationRules: SkoposAgentCommunicationRule[];
}

export type SkoposAgentBriefArtifact =
  | SkoposAgentTaskBriefArtifact
  | SkoposAgentReadinessBriefArtifact
  | SkoposAgentPolicyBriefArtifact
  | SkoposAgentPromptBriefArtifact
  | SkoposAgentCommunicationBriefArtifact;
