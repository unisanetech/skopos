import type {
  SkoposDecisionEscalationClass,
  SkoposDecisionOption,
} from './skopos-decision-question.js';
import type { SkoposAdoptionState } from './skopos-adoption.js';
import type { SkoposTaskCoordinationState } from './skopos-coordination.js';

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
