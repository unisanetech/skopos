import { join, resolve } from 'node:path';

import type {
  SkoposDiscussionAppendTurnRunResult,
  SkoposDiscussionCheckpointRunResult,
  SkoposDiscussionHandoffRunResult,
  SkoposDiscussionRecentRunResult,
  SkoposDiscussionSyncCodexRunResult,
  SkoposDiscussionHandoffArtifact,
  SkoposDiscussionIndexArtifact,
} from '@skopos/model';

import { refreshSkoposDiscussionCheckpoints } from '../shared/discussion-checkpoints.js';
import { loadLatestSkoposDiscussionRawJournalInfo, appendSkoposDiscussionTurnRecord } from '../shared/discussion-raw-journal.js';
import { syncLatestCodexDiscussionJournal } from '../shared/codex-session-import.js';
import { refreshSkoposDiscussionResumeArtifacts } from '../shared/discussion-lifecycle.js';
import { readJsonIfExists } from '../shared/token-control-state.js';
import {
  DISCUSSION_INDEX_ARTIFACT_PATH,
  LATEST_WORKFLOW_HANDOFF_ARTIFACT_PATH,
} from '../shared/token-control-constants.js';

export interface BuildSkoposDiscussionAppendTurnRuntimeOptions {
  cwd: string;
  threadId?: string;
  sessionId?: string;
  role: 'user' | 'assistant' | 'system';
  sourceEvent:
    | 'manual'
    | 'session-start'
    | 'user-prompt-submit'
    | 'assistant-turn'
    | 'stop'
    | 'major-state-change'
    | 'pre-compact'
    | 'post-compact';
  message?: string;
  transcriptPath?: string;
  dryRun?: boolean;
}

export interface BuildSkoposDiscussionCheckpointRuntimeOptions {
  cwd: string;
  dryRun?: boolean;
}

export interface BuildSkoposDiscussionHandoffRuntimeOptions {
  cwd: string;
  dryRun?: boolean;
}

export interface BuildSkoposDiscussionRecentRuntimeOptions {
  cwd: string;
}

export interface BuildSkoposDiscussionSyncCodexRuntimeOptions {
  cwd: string;
  dryRun?: boolean;
}

export const buildSkoposDiscussionAppendTurnRuntime = async ({
  cwd,
  threadId,
  sessionId,
  role,
  sourceEvent,
  message,
  transcriptPath,
  dryRun = false,
}: BuildSkoposDiscussionAppendTurnRuntimeOptions): Promise<SkoposDiscussionAppendTurnRunResult> => {
  const workspaceRoot = resolve(cwd);
  const journal = await appendSkoposDiscussionTurnRecord({
    workspaceRoot,
    threadId,
    sessionId,
    role,
    sourceEvent,
    message,
    transcriptPath,
    dryRun,
  });

  return {
    workspaceRoot,
    summary:
      journal.write === 'skipped'
        ? 'Skipped discussion turn append because no message content was available.'
        : `Appended ${role} discussion turn to ${journal.path}.`,
    threadId: journal.record?.threadId ?? threadId ?? (sessionId ? `session:${sessionId}` : 'workspace:current'),
    journalPath: journal.path,
    journalWrite: journal.write,
    record: journal.record,
  };
};

export const buildSkoposDiscussionCheckpointRuntime = async ({
  cwd,
  dryRun = false,
}: BuildSkoposDiscussionCheckpointRuntimeOptions): Promise<SkoposDiscussionCheckpointRunResult> => {
  const workspaceRoot = resolve(cwd);
  const result = await refreshSkoposDiscussionCheckpoints({
    workspaceRoot,
    dryRun,
  });

  return {
    workspaceRoot,
    summary: result.artifact.resumeSummary,
    checkpointPath: result.path,
    checkpointWrite: result.write,
    checkpoint: result.artifact,
    indexPath: result.indexPath,
    indexWrite: result.indexWrite,
  };
};

export const buildSkoposDiscussionHandoffRuntime = async ({
  cwd,
  dryRun = false,
}: BuildSkoposDiscussionHandoffRuntimeOptions): Promise<SkoposDiscussionHandoffRunResult> => {
  const workspaceRoot = resolve(cwd);
  const lifecycle = await refreshSkoposDiscussionResumeArtifacts({
    workspaceRoot,
    dryRun,
  });

  return lifecycle.handoff;
};

export const buildSkoposDiscussionRecentRuntime = async ({
  cwd,
}: BuildSkoposDiscussionRecentRuntimeOptions): Promise<SkoposDiscussionRecentRunResult> => {
  const workspaceRoot = resolve(cwd);
  await syncLatestCodexDiscussionJournal({
    workspaceRoot,
  });
  const [latestHandoff, discussionIndex, latestJournal] = await Promise.all([
    readJsonIfExists<SkoposDiscussionHandoffArtifact>(
      join(workspaceRoot, LATEST_WORKFLOW_HANDOFF_ARTIFACT_PATH),
    ),
    readJsonIfExists<SkoposDiscussionIndexArtifact>(join(workspaceRoot, DISCUSSION_INDEX_ARTIFACT_PATH)),
    loadLatestSkoposDiscussionRawJournalInfo(workspaceRoot),
  ]);

  const recentCheckpoints =
    discussionIndex?.entries.slice(0, 5).map((entry) => ({
      id: entry.id,
      summary: entry.summary,
      currentDirection: entry.currentDirection,
      updatedAt: entry.updatedAt,
      artifactPath: entry.artifactPath,
    })) ?? [];
  const additionalContext = latestHandoff
    ? `Skopos resume context: ${latestHandoff.resumeSummary}`
    : undefined;

  return {
    workspaceRoot,
    summary:
      latestHandoff?.summary ??
      'No workflow handoff is available yet. Start or refresh mission routing before resuming from discussion context.',
    latestHandoffPath: latestHandoff ? join(workspaceRoot, LATEST_WORKFLOW_HANDOFF_ARTIFACT_PATH) : undefined,
    latestHandoff,
    recentCheckpoints,
    latestJournalPath: latestJournal?.path,
    latestJournalTurnCount: latestJournal?.turnCount ?? 0,
    additionalContext,
  };
};

export const buildSkoposDiscussionSyncCodexRuntime = async ({
  cwd,
  dryRun = false,
}: BuildSkoposDiscussionSyncCodexRuntimeOptions): Promise<SkoposDiscussionSyncCodexRunResult> => {
  const workspaceRoot = resolve(cwd);
  const syncResult = await syncLatestCodexDiscussionJournal({
    workspaceRoot,
    dryRun,
  });

  return {
    workspaceRoot,
    summary: syncResult.summary,
    source: syncResult.source,
    matchMode: syncResult.matchMode,
    sourceSessionId: syncResult.sourceSessionId,
    sourceSessionPath: syncResult.sourceSessionPath,
    threadId: syncResult.threadId,
    journalPath: syncResult.journalPath,
    importedTurnCount: syncResult.importedTurnCount,
    totalJournalTurnCount: syncResult.totalJournalTurnCount,
    journalWrite: syncResult.journalWrite,
  };
};
