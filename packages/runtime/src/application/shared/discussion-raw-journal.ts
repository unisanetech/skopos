import { appendFile, mkdir, readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import type {
  SkoposDiscussionRawJournalTurn,
  SkoposDiscussionTurnRole,
  SkoposDiscussionTurnSourceEvent,
} from '@skopos/model';

import { DISCUSSION_RAW_DIRECTORY } from './token-control-constants.js';
import { estimateTokens, resolveActiveMissionId } from './token-control-state.js';

export interface AppendSkoposDiscussionTurnRecordResult {
  path: string;
  write: 'written' | 'dry-run' | 'skipped';
  record?: SkoposDiscussionRawJournalTurn;
}

export interface SkoposDiscussionRawJournalInfo {
  path: string;
  threadId: string;
  turnCount: number;
  latestTurnAt?: string;
}

export const appendSkoposDiscussionTurnRecord = async ({
  workspaceRoot,
  threadId,
  sessionId,
  role,
  sourceEvent,
  message,
  transcriptPath,
  dryRun = false,
}: {
  workspaceRoot: string;
  threadId?: string;
  sessionId?: string;
  role: SkoposDiscussionTurnRole;
  sourceEvent: SkoposDiscussionTurnSourceEvent;
  message?: string;
  transcriptPath?: string;
  dryRun?: boolean;
}): Promise<AppendSkoposDiscussionTurnRecordResult> => {
  const normalizedMessage = (message ?? '').trim();
  if (normalizedMessage.length === 0) {
    return {
      path: join(workspaceRoot, resolveDiscussionRawJournalRelativePath(threadId ?? sessionId)),
      write: 'skipped',
    };
  }

  const normalizedThreadId = resolveDiscussionThreadId({ threadId, sessionId });
  const artifactPath = join(workspaceRoot, resolveDiscussionRawJournalRelativePath(normalizedThreadId));
  const recordedAt = new Date().toISOString();
  const record: SkoposDiscussionRawJournalTurn = {
    schemaVersion: 1,
    id: toTurnId(recordedAt, role),
    type: 'discussion-turn',
    recordedAt,
    workspaceRoot,
    threadId: normalizedThreadId,
    sessionId,
    role,
    sourceEvent,
    message: normalizedMessage,
    excerpt: buildExcerpt(normalizedMessage),
    estimatedTokens: estimateTokens(normalizedMessage),
    transcriptPath,
    activeMissionId: await resolveActiveMissionId(workspaceRoot),
  };

  if (dryRun) {
    return {
      path: artifactPath,
      write: 'dry-run',
      record,
    };
  }

  await mkdir(dirname(artifactPath), { recursive: true });
  await appendFile(artifactPath, `${JSON.stringify(record)}\n`, 'utf8');

  return {
    path: artifactPath,
    write: 'written',
    record,
  };
};

export const loadLatestSkoposDiscussionRawJournalInfo = async (
  workspaceRoot: string,
): Promise<SkoposDiscussionRawJournalInfo | undefined> => {
  const root = join(workspaceRoot, DISCUSSION_RAW_DIRECTORY);
  try {
    const entries = (await readdir(root)).filter((entry) => entry.endsWith('.jsonl'));
    if (entries.length === 0) {
      return undefined;
    }

    const rankedEntries = await Promise.all(
      entries.map(async (entry) => ({
        entry,
        stats: await stat(join(root, entry)),
      })),
    );
    rankedEntries.sort((left, right) => right.stats.mtimeMs - left.stats.mtimeMs);
    const latestEntry = rankedEntries[0]?.entry;
    if (!latestEntry) {
      return undefined;
    }

    const artifactPath = join(root, latestEntry);
    const contents = await readFile(artifactPath, 'utf8');
    const turns = contents
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => JSON.parse(line) as SkoposDiscussionRawJournalTurn);
    const latestTurn = turns.at(-1);

    return {
      path: artifactPath,
      threadId: turns[0]?.threadId ?? latestEntry.replace(/\.jsonl$/, ''),
      turnCount: turns.length,
      latestTurnAt: latestTurn?.recordedAt,
    };
  } catch {
    return undefined;
  }
};

export const resolveDiscussionRawJournalRelativePath = (threadId?: string): string =>
  `${DISCUSSION_RAW_DIRECTORY}/${sanitizeDiscussionThreadId(threadId ?? 'workspace-current')}.jsonl`;

const resolveDiscussionThreadId = ({
  threadId,
  sessionId,
}: {
  threadId?: string;
  sessionId?: string;
}): string => {
  if (threadId && threadId.trim().length > 0) {
    return threadId.trim();
  }

  if (sessionId && sessionId.trim().length > 0) {
    return `session:${sessionId.trim()}`;
  }

  return 'workspace:current';
};

const sanitizeDiscussionThreadId = (threadId: string): string => {
  const sanitized = threadId.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return sanitized.length > 0 ? sanitized : 'workspace-current';
};

const toTurnId = (timestamp: string, role: SkoposDiscussionTurnRole): string =>
  `discussion-turn-${role}-${timestamp.replace(/[^0-9]/g, '')}-${Math.random().toString(36).slice(2, 8)}`;

const buildExcerpt = (message: string): string => {
  const normalized = message.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 240) {
    return normalized;
  }

  return `${normalized.slice(0, 237)}...`;
};
