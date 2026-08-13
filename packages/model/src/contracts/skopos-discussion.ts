import type {
  SkoposDiscussionCheckpointArtifact,
  SkoposDiscussionHandoffArtifact,
  SkoposDiscussionRawJournalTurn,
} from './skopos-discussion-memory.js';

export interface SkoposDiscussionAppendTurnRunResult {
  workspaceRoot: string;
  summary: string;
  threadId: string;
  journalPath: string;
  journalWrite: 'written' | 'dry-run' | 'skipped';
  record?: SkoposDiscussionRawJournalTurn;
}

export interface SkoposDiscussionCheckpointRunResult {
  workspaceRoot: string;
  summary: string;
  checkpointPath: string;
  checkpointWrite: 'written' | 'dry-run' | 'unchanged';
  checkpoint: SkoposDiscussionCheckpointArtifact;
  indexPath: string;
  indexWrite: 'written' | 'dry-run' | 'unchanged';
}

export interface SkoposDiscussionHandoffRunResult {
  workspaceRoot: string;
  summary: string;
  checkpointPath: string;
  checkpointWrite: 'written' | 'dry-run' | 'unchanged';
  handoffPath: string;
  handoffWrite: 'written' | 'dry-run';
  handoff: SkoposDiscussionHandoffArtifact;
}

export interface SkoposDiscussionHandoffInspectRunResult {
  workspaceRoot: string;
  summary: string;
  handoffPath: string;
  handoff: SkoposDiscussionHandoffArtifact;
  prompt?: string;
}

export interface SkoposDiscussionRecentEntry {
  id: string;
  summary: string;
  currentDirection: string;
  updatedAt: string;
  artifactPath: string;
}

export interface SkoposDiscussionRecentRunResult {
  workspaceRoot: string;
  summary: string;
  latestHandoffPath?: string;
  latestHandoff?: SkoposDiscussionHandoffArtifact;
  recentCheckpoints: SkoposDiscussionRecentEntry[];
  latestJournalPath?: string;
  latestJournalTurnCount: number;
  latestJournalTurnAt?: string;
  additionalContext?: string;
}

export interface SkoposDiscussionSyncCodexRunResult {
  workspaceRoot: string;
  summary: string;
  source: 'codex-session-log';
  matchMode?: 'exact-session' | 'segmented-parent-session';
  sourceSessionId?: string;
  sourceSessionPath?: string;
  threadId?: string;
  journalPath?: string;
  importedTurnCount: number;
  totalJournalTurnCount: number;
  journalWrite: 'written' | 'dry-run' | 'unchanged' | 'skipped';
}
