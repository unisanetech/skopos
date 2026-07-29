import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';

import type { SkoposDiscussionRawJournalTurn } from '@skopos/model';

import { resolveDiscussionRawJournalRelativePath } from './discussion-raw-journal.js';
import { estimateTokens, resolveCurrentTaskId } from './token-control-state.js';

export interface SyncLatestCodexDiscussionJournalResult {
  source: 'codex-session-log';
  matchMode?: 'exact-session' | 'segmented-parent-session';
  sourceSessionId?: string;
  sourceSessionPath?: string;
  threadId?: string;
  journalPath?: string;
  importedTurnCount: number;
  totalJournalTurnCount: number;
  journalWrite: 'written' | 'dry-run' | 'unchanged' | 'skipped';
  summary: string;
}

interface CodexSessionMessage {
  recordedAt: string;
  role: 'user' | 'assistant';
  sourceEvent: 'user-prompt-submit' | 'assistant-turn';
  message: string;
}

interface CodexSessionMatch {
  sessionId: string;
  sessionPath: string;
  matchMode: 'exact-session' | 'segmented-parent-session';
  messages: CodexSessionMessage[];
}

interface CodexSessionTurnBlock {
  entries: CodexSessionEnvelope[];
  messages: CodexSessionMessage[];
}

const DEFAULT_CODEX_HOME = join(homedir(), '.codex');
const CODEX_SESSIONS_DIRECTORY = 'sessions';

export const syncLatestCodexDiscussionJournal = async ({
  workspaceRoot,
  dryRun = false,
  codexHome = process.env.CODEX_HOME || DEFAULT_CODEX_HOME,
}: {
  workspaceRoot: string;
  dryRun?: boolean;
  codexHome?: string;
}): Promise<SyncLatestCodexDiscussionJournalResult> => {
  const latestSession = await loadLatestCodexSessionMatch({
    workspaceRoot,
    codexHome,
  });

  if (!latestSession || latestSession.messages.length === 0) {
    return {
      source: 'codex-session-log',
      importedTurnCount: 0,
      totalJournalTurnCount: 0,
      journalWrite: 'skipped',
      summary:
        'Skipped Codex discussion sync because no matching local Codex session with user or assistant messages was found.',
    };
  }

  const threadId = `session:${latestSession.sessionId}`;
  const journalPath = join(workspaceRoot, resolveDiscussionRawJournalRelativePath(threadId));
  const existingTurns = await loadExistingDiscussionTurns(journalPath);
  const existingTurnByKey = new Map(
    existingTurns.map((turn) => [`${turn.recordedAt}|${turn.role}|${turn.message}`, turn]),
  );
  const activeTaskId = await resolveCurrentTaskId(workspaceRoot);

  const nextTurns = latestSession.messages.map<SkoposDiscussionRawJournalTurn>((message) => {
    const turnKey = `${message.recordedAt}|${message.role}|${message.message}`;
    return (
      existingTurnByKey.get(turnKey) ?? {
        schemaVersion: 1,
        id: buildDeterministicTurnId(message.recordedAt, message.role, message.message),
        type: 'discussion-turn',
        recordedAt: message.recordedAt,
        workspaceRoot,
        threadId,
        sessionId: latestSession.sessionId,
        role: message.role,
        sourceEvent: message.sourceEvent,
        message: message.message,
        excerpt: buildExcerpt(message.message),
        estimatedTokens: estimateTokens(message.message),
        transcriptPath: latestSession.sessionPath,
        activeTaskId,
      }
    );
  });
  const importedTurnCount = nextTurns.filter((turn) => !existingTurnByKey.has(buildTurnKey(turn))).length;
  const journalChanged =
    existingTurns.length !== nextTurns.length ||
    existingTurns.some((turn, index) => buildTurnKey(turn) !== buildTurnKey(nextTurns[index]));

  if (!journalChanged) {
    return {
      source: 'codex-session-log',
      matchMode: latestSession.matchMode,
      sourceSessionId: latestSession.sessionId,
      sourceSessionPath: latestSession.sessionPath,
      threadId,
      journalPath,
      importedTurnCount,
      totalJournalTurnCount: nextTurns.length,
      journalWrite: 'unchanged',
      summary: 'Codex discussion sync found no new turns to import.',
    };
  }

  if (!dryRun) {
    await mkdir(dirname(journalPath), { recursive: true });
    await writeFile(
      journalPath,
      nextTurns.map((record) => JSON.stringify(record)).join('\n').concat('\n'),
      'utf8',
    );
  }

  return {
    source: 'codex-session-log',
    matchMode: latestSession.matchMode,
    sourceSessionId: latestSession.sessionId,
    sourceSessionPath: latestSession.sessionPath,
    threadId,
    journalPath,
    importedTurnCount,
    totalJournalTurnCount: nextTurns.length,
    journalWrite: dryRun ? 'dry-run' : 'written',
    summary: `Synchronized ${nextTurns.length} Codex discussion turns from the latest matching local session log.`,
  };
};

const loadLatestCodexSessionMatch = async ({
  workspaceRoot,
  codexHome,
}: {
  workspaceRoot: string;
  codexHome: string;
}): Promise<CodexSessionMatch | undefined> => {
  const sessionsRoot = join(codexHome, CODEX_SESSIONS_DIRECTORY);
  const sessionFiles = await listCodexSessionFiles(sessionsRoot);

  for (const sessionFile of sessionFiles) {
    const sessionMatch = await parseCodexSessionMatch({
      sessionFile,
      workspaceRoot,
    });
    if (sessionMatch) {
      return sessionMatch;
    }
  }

  return undefined;
};

const listCodexSessionFiles = async (rootDirectory: string): Promise<string[]> => {
  const files = await collectJsonlFiles(rootDirectory).catch(() => []);
  return files.sort((left, right) => right.localeCompare(left));
};

const collectJsonlFiles = async (directoryPath: string): Promise<string[]> => {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        return collectJsonlFiles(entryPath);
      }
      return entry.isFile() && entry.name.endsWith('.jsonl') ? [entryPath] : [];
    }),
  );

  return nestedFiles.flat();
};

const parseCodexSessionMatch = async ({
  sessionFile,
  workspaceRoot,
}: {
  sessionFile: string;
  workspaceRoot: string;
}): Promise<CodexSessionMatch | undefined> => {
  const contents = await readFile(sessionFile, 'utf8').catch(() => undefined);
  if (!contents) {
    return undefined;
  }

  const lines = contents
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length === 0) {
    return undefined;
  }

  const parsedRecords = lines
    .map((line) => parseCodexSessionEnvelope(line))
    .filter((entry): entry is CodexSessionEnvelope => Boolean(entry));
  if (parsedRecords.length === 0) {
    return undefined;
  }

  const sessionMeta = parsedRecords.find((entry) => entry.type === 'session_meta');
  const sessionId = sessionMeta?.payload?.id;
  const sessionCwd = sessionMeta?.payload?.cwd;
  const matchMode = classifyCodexSessionMatchMode(sessionCwd, workspaceRoot);
  if (!sessionId || !matchMode) {
    return undefined;
  }

  const messages =
    matchMode === 'exact-session'
      ? parsedRecords
          .flatMap((entry) => toCodexSessionMessages(entry))
          .filter((message) => !isInjectedCodexBootstrapMessage(message))
      : collectSegmentedCodexSessionMessages({
          entries: parsedRecords,
          workspaceRoot,
          sessionCwd: sessionCwd ?? workspaceRoot,
        });

  return {
    sessionId,
    sessionPath: sessionFile,
    matchMode,
    messages,
  };
};

const parseCodexSessionEnvelope = (line: string): CodexSessionEnvelope | undefined => {
  try {
    return JSON.parse(line) as CodexSessionEnvelope;
  } catch {
    return undefined;
  }
};

const classifyCodexSessionMatchMode = (
  sessionCwd: string | undefined,
  workspaceRoot: string,
): CodexSessionMatch['matchMode'] | undefined => {
  if (!sessionCwd) {
    return undefined;
  }
  if (sessionCwd === workspaceRoot) {
    return 'exact-session';
  }
  if (workspaceRoot.startsWith(`${sessionCwd}${sep}`)) {
    return 'segmented-parent-session';
  }
  return undefined;
};

const collectSegmentedCodexSessionMessages = ({
  entries,
  workspaceRoot,
  sessionCwd,
}: {
  entries: CodexSessionEnvelope[];
  workspaceRoot: string;
  sessionCwd: string;
}): CodexSessionMessage[] => {
  const turnBlocks = toCodexSessionTurnBlocks(entries);
  return turnBlocks
    .filter((block) =>
      isCodexTurnBlockRelevantToWorkspace({
        block,
        workspaceRoot,
        sessionCwd,
      }),
    )
    .flatMap((block) => block.messages);
};

const toCodexSessionTurnBlocks = (entries: CodexSessionEnvelope[]): CodexSessionTurnBlock[] => {
  const blocks: CodexSessionTurnBlock[] = [];
  let currentBlock: CodexSessionTurnBlock | undefined;

  for (const entry of entries) {
    const message = toCodexSessionMessages(entry)[0];

    if (message?.role === 'user') {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      currentBlock = {
        entries: [entry],
        messages: isInjectedCodexBootstrapMessage(message) ? [] : [message],
      };
      continue;
    }

    if (!currentBlock) {
      continue;
    }

    currentBlock.entries.push(entry);
    if (message?.role === 'assistant') {
      currentBlock.messages.push(message);
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
};

const isCodexTurnBlockRelevantToWorkspace = ({
  block,
  workspaceRoot,
  sessionCwd,
}: {
  block: CodexSessionTurnBlock;
  workspaceRoot: string;
  sessionCwd: string;
}): boolean => {
  return (
    blockTouchesWorkspaceViaTooling({
      entries: block.entries,
      workspaceRoot,
      sessionCwd,
    }) || blockMentionsWorkspaceInConversation(block.messages, workspaceRoot)
  );
};

const blockTouchesWorkspaceViaTooling = ({
  entries,
  workspaceRoot,
  sessionCwd,
}: {
  entries: CodexSessionEnvelope[];
  workspaceRoot: string;
  sessionCwd: string;
}): boolean => {
  for (const entry of entries) {
    const payload = entry.payload;
    if (!payload || typeof payload !== 'object') {
      continue;
    }

    const entryCwd = typeof payload.cwd === 'string' ? payload.cwd : undefined;
    if (entryCwd && pathBelongsToWorkspace(entryCwd, workspaceRoot, sessionCwd)) {
      return true;
    }

    const parsedCommands = Array.isArray(payload.parsed_cmd) ? payload.parsed_cmd : [];
    for (const parsedCommand of parsedCommands) {
      if (
        parsedCommand &&
        typeof parsedCommand === 'object' &&
        typeof parsedCommand.path === 'string' &&
        pathBelongsToWorkspace(parsedCommand.path, workspaceRoot, sessionCwd)
      ) {
        return true;
      }
    }
  }

  return false;
};

const blockMentionsWorkspaceInConversation = (
  messages: CodexSessionMessage[],
  workspaceRoot: string,
): boolean => {
  const workspaceName = workspaceRoot.split(sep).at(-1);
  if (!workspaceName) {
    return false;
  }

  const workspacePattern = new RegExp(`\\b${escapeRegExp(workspaceName)}\\b`, 'i');
  return messages.some((message) => workspacePattern.test(message.message));
};

const pathBelongsToWorkspace = (
  candidatePath: string,
  workspaceRoot: string,
  sessionCwd: string,
): boolean => {
  const normalizedPath =
    candidatePath.startsWith(sep) || /^[A-Za-z]:[\\/]/.test(candidatePath)
      ? candidatePath
      : join(sessionCwd, candidatePath);
  return normalizedPath === workspaceRoot || normalizedPath.startsWith(`${workspaceRoot}${sep}`);
};


interface CodexSessionEnvelope {
  type?: string;
  timestamp?: string;
  payload?: {
    id?: string;
    cwd?: string;
    type?: string;
    role?: string;
    parsed_cmd?: Array<{
      path?: string;
    }>;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  };
}

const toCodexSessionMessages = (entry: CodexSessionEnvelope): CodexSessionMessage[] => {
  const role = entry.payload?.role;
  if (
    entry.payload?.type !== 'message' ||
    (role !== 'user' && role !== 'assistant') ||
    typeof entry.timestamp !== 'string'
  ) {
    return [];
  }

  const message = (entry.payload.content ?? [])
    .flatMap((contentPart) =>
      contentPart.type === 'input_text' || contentPart.type === 'output_text'
        ? [contentPart.text ?? '']
        : [],
    )
    .join('\n\n')
    .trim();
  if (message.length === 0) {
    return [];
  }

  return [
    {
      recordedAt: entry.timestamp,
      role,
      sourceEvent: role === 'user' ? 'user-prompt-submit' : 'assistant-turn',
      message,
    },
  ];
};

const isInjectedCodexBootstrapMessage = (message: CodexSessionMessage): boolean =>
  message.role === 'user' && message.message.startsWith('# AGENTS.md instructions for ');

const loadExistingDiscussionTurns = async (
  journalPath: string,
): Promise<SkoposDiscussionRawJournalTurn[]> => {
  const contents = await readFile(journalPath, 'utf8').catch(() => undefined);
  if (!contents) {
    return [];
  }

  return contents
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as SkoposDiscussionRawJournalTurn);
};

const buildDeterministicTurnId = (
  recordedAt: string,
  role: 'user' | 'assistant',
  message: string,
): string => {
  const digest = createHash('sha1').update(`${recordedAt}:${role}:${message}`).digest('hex').slice(0, 10);
  return `discussion-turn-${role}-${recordedAt.replace(/[^0-9]/g, '')}-${digest}`;
};

const buildExcerpt = (message: string): string => {
  const normalized = message.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 240) {
    return normalized;
  }

  return `${normalized.slice(0, 237)}...`;
};

const buildTurnKey = (turn: Pick<SkoposDiscussionRawJournalTurn, 'recordedAt' | 'role' | 'message'>): string =>
  `${turn.recordedAt}|${turn.role}|${turn.message}`;

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
