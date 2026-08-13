import { join, resolve } from 'node:path';

import type {
  SkoposDiscussionAppendTurnRunResult,
  SkoposDiscussionCheckpointRunResult,
  SkoposDiscussionHandoffRunResult,
  SkoposDiscussionRecentRunResult,
  SkoposDiscussionSyncCodexRunResult,
  SkoposDiscussionHandoffArtifact,
  SkoposDiscussionIndexArtifact,
  SkoposConversationCapsule,
  SkoposDiscussionHandoffInspectRunResult,
} from '@skopos/model';

import { refreshSkoposDiscussionCheckpoints } from '../shared/discussion-checkpoints.js';
import { resolveCurrentTaskState } from '../shared/current-task-state.js';
import { loadLatestSkoposDiscussionRawJournalInfo, appendSkoposDiscussionTurnRecord } from '../shared/discussion-raw-journal.js';
import { syncLatestCodexDiscussionJournal } from '../shared/codex-session-import.js';
import { refreshSkoposDiscussionResumeArtifacts } from '../shared/discussion-lifecycle.js';
import { readJsonIfExists } from '../shared/token-control-state.js';
import {
  DISCUSSION_INDEX_ARTIFACT_PATH,
} from '../shared/token-control-constants.js';
import {
  acceptSkoposDiscussionHandoff,
  loadSkoposDiscussionHandoff,
  renderSkoposDiscussionContinuationPrompt,
  verifySkoposDiscussionHandoff,
  recordSkoposDiscussionHandoffDelivery,
} from '../shared/discussion-handoff.js';

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
  taskId?: string;
  conversationCapsule?: SkoposConversationCapsule;
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
  taskId,
  conversationCapsule,
  dryRun = false,
}: BuildSkoposDiscussionHandoffRuntimeOptions): Promise<SkoposDiscussionHandoffRunResult> => {
  const workspaceRoot = resolve(cwd);
  const lifecycle = await refreshSkoposDiscussionResumeArtifacts({
    workspaceRoot,
    taskId,
    conversationCapsule,
    dryRun,
  });

  return lifecycle.handoff;
};

export const showSkoposDiscussionHandoffRuntime = async ({ cwd, taskId }: { cwd: string; taskId?: string }): Promise<SkoposDiscussionHandoffInspectRunResult> => {
  const workspaceRoot = resolve(cwd);
  const loaded = await loadSkoposDiscussionHandoff(workspaceRoot, taskId);
  return { workspaceRoot, summary: loaded.artifact.summary ?? `Handoff for ${loaded.artifact.activeTaskId}.`, handoffPath: loaded.path, handoff: loaded.artifact };
};

export const verifySkoposDiscussionHandoffRuntime = async ({ cwd, taskId }: { cwd: string; taskId?: string }): Promise<SkoposDiscussionHandoffInspectRunResult> => {
  const workspaceRoot = resolve(cwd);
  const verified = await verifySkoposDiscussionHandoff({ workspaceRoot, taskId });
  return { workspaceRoot, summary: `Handoff freshness is ${verified.validation.freshness}.`, handoffPath: verified.path, handoff: verified.artifact };
};

export const renderSkoposDiscussionHandoffRuntime = async ({ cwd, taskId }: { cwd: string; taskId?: string }): Promise<SkoposDiscussionHandoffInspectRunResult> => {
  const shown = await showSkoposDiscussionHandoffRuntime({ cwd, taskId });
  return { ...shown, summary: 'Rendered reviewed host-neutral continuation prompt.', prompt: renderSkoposDiscussionContinuationPrompt(shown.handoff) };
};

export const acceptSkoposDiscussionHandoffRuntime = async ({ cwd, taskId, actor, receivingSessionId, destinationHost, dryRun = false }: { cwd: string; taskId?: string; actor: string; receivingSessionId: string; destinationHost: string; dryRun?: boolean }): Promise<SkoposDiscussionHandoffRunResult> => {
  const workspaceRoot = resolve(cwd);
  const accepted = await acceptSkoposDiscussionHandoff({ workspaceRoot, taskId, actor, receivingSessionId, destinationHost, dryRun });
  return { workspaceRoot, summary: `Accepted current handoff for ${accepted.artifact.activeTaskId}.`, checkpointPath: accepted.path, checkpointWrite: 'unchanged', handoffPath: accepted.path, handoffWrite: accepted.write, handoff: accepted.artifact };
};

export const recordSkoposDiscussionHandoffDeliveryRuntime = async ({ cwd, taskId, actor, result, destinationRef, originMessageOutcome, detail, dryRun = false }: { cwd: string; taskId?: string; actor: string; result: 'pass' | 'fail'; destinationRef?: string; originMessageOutcome: 'succeeded' | 'failed' | 'unsupported'; detail: string; dryRun?: boolean }): Promise<SkoposDiscussionHandoffRunResult> => {
  const workspaceRoot = resolve(cwd);
  const recorded = await recordSkoposDiscussionHandoffDelivery({ workspaceRoot, taskId, actor, result, destinationRef, originMessageOutcome, detail, dryRun });
  return { workspaceRoot, summary: `Recorded ${result === 'pass' ? 'successful' : 'failed'} host delivery for ${recorded.artifact.activeTaskId}.`, checkpointPath: recorded.path, checkpointWrite: 'unchanged', handoffPath: recorded.path, handoffWrite: recorded.write, handoff: recorded.artifact };
};

export const buildSkoposDiscussionRecentRuntime = async ({
  cwd,
}: BuildSkoposDiscussionRecentRuntimeOptions): Promise<SkoposDiscussionRecentRunResult> => {
  const workspaceRoot = resolve(cwd);
  await syncLatestCodexDiscussionJournal({
    workspaceRoot,
  });
  const currentTask = await resolveCurrentTaskState({ workspaceRoot });
  const [latestHandoff, discussionIndex, latestJournal] = await Promise.all([
    currentTask
      ? readJsonIfExists<SkoposDiscussionHandoffArtifact>(currentTask.handoffPath)
      : Promise.resolve(undefined),
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
      'No Task handoff is available yet. Start or resume an exact Task before relying on discussion continuation.',
    latestHandoffPath: latestHandoff ? currentTask?.handoffPath : undefined,
    latestHandoff,
    recentCheckpoints,
    latestJournalPath: latestJournal?.path,
    latestJournalTurnCount: latestJournal?.turnCount ?? 0,
    latestJournalTurnAt: latestJournal?.latestTurnAt,
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
