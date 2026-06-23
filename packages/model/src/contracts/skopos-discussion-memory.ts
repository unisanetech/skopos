import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';

export type SkoposDiscussionTurnRole = 'user' | 'assistant' | 'system';

export type SkoposDiscussionTurnSourceEvent =
  | 'manual'
  | 'session-start'
  | 'user-prompt-submit'
  | 'assistant-turn'
  | 'stop'
  | 'major-state-change'
  | 'pre-compact'
  | 'post-compact';

export interface SkoposDiscussionRawJournalTurn {
  schemaVersion: 1;
  id: string;
  type: 'discussion-turn';
  recordedAt: string;
  workspaceRoot: string;
  threadId: string;
  sessionId?: string;
  role: SkoposDiscussionTurnRole;
  sourceEvent: SkoposDiscussionTurnSourceEvent;
  message: string;
  excerpt: string;
  estimatedTokens: number;
  transcriptPath?: string;
  activeMissionId?: string;
}

export interface SkoposDiscussionHandoffDecision {
  id: string;
  title: string;
  resolvedOptionId: string;
  resolvedOptionLabel?: string;
}

export interface SkoposDiscussionHandoffQuestion {
  id: string;
  title: string;
  blocking: boolean;
  recommendedOptionId: string;
}

export type SkoposDiscussionCheckpointDecision = SkoposDiscussionHandoffDecision;
export type SkoposDiscussionCheckpointQuestion = SkoposDiscussionHandoffQuestion;

export type SkoposDiscussionCheckpointPromotionTrigger =
  | 'manual'
  | 'workflow-start'
  | 'workflow-decision'
  | 'workflow-eval'
  | 'major-state-change';

export type SkoposDiscussionCheckpointPromotionKind =
  | 'initial-state'
  | 'active-mission-changed'
  | 'current-direction-changed'
  | 'accepted-decisions-changed'
  | 'open-questions-changed'
  | 'recommended-next-command-changed';

export interface SkoposDiscussionCheckpointArtifact
  extends SkoposArtifactEnvelope<'discussion-checkpoint'> {
  workspaceRoot: string;
  threadId: string;
  checkpointKind: 'workflow-state';
  activeMissionId?: string;
  linkedPlanId?: string;
  currentDirection: string;
  acceptedDecisions: SkoposDiscussionCheckpointDecision[];
  openQuestions: SkoposDiscussionCheckpointQuestion[];
  recommendedNextCommand?: string;
  linkedArtifactPaths: string[];
  resumeSummary: string;
  estimatedTokens: number;
  budgetTokens: number;
  overBudget: boolean;
  promotionTrigger?: SkoposDiscussionCheckpointPromotionTrigger;
  promotionKinds?: SkoposDiscussionCheckpointPromotionKind[];
  supersedesCheckpointId?: string;
}

export interface SkoposDiscussionCheckpointIndexEntry {
  id: string;
  threadId: string;
  artifactPath: string;
  activeMissionId?: string;
  linkedPlanId?: string;
  summary: string;
  currentDirection: string;
  updatedAt: string;
}

export interface SkoposDiscussionIndexArtifact
  extends SkoposArtifactEnvelope<'discussion-index'> {
  workspaceRoot: string;
  latestCheckpointId?: string;
  latestCheckpointPath?: string;
  checkpointCount: number;
  entries: SkoposDiscussionCheckpointIndexEntry[];
}

export interface SkoposDiscussionHandoffArtifact
  extends SkoposArtifactEnvelope<'discussion-handoff'> {
  workspaceRoot: string;
  handoffKind: 'workflow-resume';
  activeMissionId?: string;
  currentDirection: string;
  acceptedDecisions: SkoposDiscussionHandoffDecision[];
  openQuestions: SkoposDiscussionHandoffQuestion[];
  recommendedNextCommand?: string;
  linkedCheckpointIds: string[];
  linkedArtifactPaths: string[];
  resumeSummary: string;
  estimatedTokens: number;
  budgetTokens: number;
  overBudget: boolean;
}
