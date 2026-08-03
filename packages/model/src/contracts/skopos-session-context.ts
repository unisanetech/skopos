import type {
  SkoposDecisionEscalationClass,
  SkoposDecisionOption,
} from './skopos-decision-question.js';
import type { SkoposAdoptionState } from './skopos-adoption.js';
import type { SkoposTaskCoordinationState } from './skopos-coordination.js';
import type {
  SkoposTaskRisk,
  SkoposTaskState,
  SkoposTaskStepKind,
} from './skopos-task.js';

export type SkoposAgentResponseMode =
  | 'direct-answer'
  | 'work-start'
  | 'progress'
  | 'decision'
  | 'completion';

export type SkoposDecisionDefaultBehavior =
  | 'proceed-with-recommended'
  | 'proceed-with-recommended-if-no-preference'
  | 'wait-for-answer'
  | 'require-explicit-approval';

export interface SkoposSessionPendingDecision {
  id: string;
  question: string;
  escalation: SkoposDecisionEscalationClass;
  blocking: boolean;
  whyItMatters: string;
  recommendedOptionId: string;
  recommendedOption?: SkoposDecisionOption;
  alternatives: SkoposDecisionOption[];
  defaultBehavior: SkoposDecisionDefaultBehavior;
  whatHappensAfterAnswer: string;
  source?: 'task' | 'adoption-question' | 'adoption-approval';
}

export interface SkoposSessionTaskContext {
  id: string;
  title: string;
  goal: string;
  state: SkoposTaskState;
  risk: SkoposTaskRisk;
  scopeId: string;
  ownedPaths: string[];
  additionalOwnedPathCount: number;
  completedStepCount: number;
  totalStepCount: number;
  nextStep?: {
    id: string;
    kind: SkoposTaskStepKind;
    title: string;
  };
  selectedActionIds: string[];
}

export interface SkoposSessionRecommendedWork {
  id: string;
  sourceKind: 'task' | 'plan' | 'finding' | 'question' | 'readiness-blocker';
  title: string;
  reason: string;
  scopeId: string;
}

export interface SkoposSessionInterruptedAction {
  runId: string;
  actionId: string;
  interruptedAt?: string;
  elapsedMs: number;
  resumeCommand: string;
  requiresApproval: boolean;
}

export interface SkoposSessionContextRunResult {
  schemaVersion: 1;
  workspaceRoot: string;
  summary: string;
  responseMode: SkoposAgentResponseMode;
  communicationContract: {
    marker: string;
    tokenBudget: number;
    coreRules: readonly string[];
  };
  currentTaskId?: string;
  currentTask?: SkoposSessionTaskContext;
  interruptedAction?: SkoposSessionInterruptedAction;
  recommendedWork?: SkoposSessionRecommendedWork;
  workQueueSummary?: string;
  nextCommand?: string;
  resumeSummary?: string;
  pendingDecision?: SkoposSessionPendingDecision;
  adoption?: {
    state: SkoposAdoptionState;
    assessmentOnly: boolean;
    proposalDigest?: string;
  };
  coordination?: SkoposTaskCoordinationState;
  additionalPendingDecisionCount: number;
  warnings: string[];
  additionalContext: string;
}
