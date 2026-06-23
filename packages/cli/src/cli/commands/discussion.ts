import { resolve } from 'node:path';

import {
  buildSkoposDiscussionAppendTurnRuntime,
  buildSkoposDiscussionCheckpointRuntime,
  buildSkoposDiscussionHandoffRuntime,
  buildSkoposDiscussionRecentRuntime,
  buildSkoposDiscussionSyncCodexRuntime,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedDiscussionTargetArgs {
  cwd: string;
  dryRun: boolean;
  json: boolean;
}

interface ParsedAppendTurnArgs extends ParsedDiscussionTargetArgs {
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
  transcriptPath?: string;
  message?: string;
  messageStdin: boolean;
}

export const runDiscussionCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (subcommand === 'append-turn') {
    const parsed = parseAppendTurnArgs(rest);
    const message = parsed.messageStdin ? await readStdinText() : parsed.message;
    const result = await buildSkoposDiscussionAppendTurnRuntime({
      cwd: parsed.cwd,
      threadId: parsed.threadId,
      sessionId: parsed.sessionId,
      role: parsed.role,
      sourceEvent: parsed.sourceEvent,
      transcriptPath: parsed.transcriptPath,
      message,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos discuss append-turn',
      `- summary: ${result.summary}`,
      `- thread: ${result.threadId}`,
      `- journal: ${result.journalPath} (${result.journalWrite})`,
    ]);
    return;
  }

  if (subcommand === 'checkpoint') {
    const parsed = parseDiscussionTargetArgs(rest);
    const result = await buildSkoposDiscussionCheckpointRuntime({
      cwd: parsed.cwd,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos discuss checkpoint',
      `- summary: ${result.summary}`,
      `- checkpoint: ${result.checkpointPath} (${result.checkpointWrite})`,
      `- index: ${result.indexPath} (${result.indexWrite})`,
    ]);
    return;
  }

  if (subcommand === 'handoff') {
    const parsed = parseDiscussionTargetArgs(rest);
    const result = await buildSkoposDiscussionHandoffRuntime({
      cwd: parsed.cwd,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos discuss handoff',
      `- summary: ${result.summary}`,
      `- checkpoint: ${result.checkpointPath} (${result.checkpointWrite})`,
      `- handoff: ${result.handoffPath} (${result.handoffWrite})`,
    ]);
    return;
  }

  if (subcommand === 'recent') {
    const parsed = parseDiscussionTargetArgs(rest);
    const result = await buildSkoposDiscussionRecentRuntime({
      cwd: parsed.cwd,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    const lines = [
      'Skopos discuss recent',
      `- summary: ${result.summary}`,
      `- latest handoff: ${result.latestHandoffPath ?? '(none)'}`,
      `- recent checkpoints: ${result.recentCheckpoints.length}`,
      `- latest raw journal: ${result.latestJournalPath ?? '(none)'}`,
      `- latest raw journal turns: ${result.latestJournalTurnCount}`,
    ];
    if (result.additionalContext) {
      lines.push(`- additional context: ${result.additionalContext}`);
    }
    writeLines(lines);
    return;
  }

  if (subcommand === 'sync-codex') {
    const parsed = parseDiscussionTargetArgs(rest);
    const result = await buildSkoposDiscussionSyncCodexRuntime({
      cwd: parsed.cwd,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos discuss sync-codex',
      `- summary: ${result.summary}`,
      `- source session: ${result.sourceSessionId ?? '(none)'}`,
      `- journal: ${result.journalPath ?? '(none)'} (${result.journalWrite})`,
      `- imported turns: ${result.importedTurnCount}`,
      `- total journal turns: ${result.totalJournalTurnCount}`,
    ]);
    return;
  }

  throw new Error(`Unknown Skopos discuss subcommand: ${subcommand ?? '(missing)'}`);
};

const parseDiscussionTargetArgs = (args: string[]): ParsedDiscussionTargetArgs => {
  let cwd = process.cwd();
  let dryRun = false;
  let json = false;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos discuss flag: ${argument}`);
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra discuss target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  return {
    cwd,
    dryRun,
    json,
  };
};

const parseAppendTurnArgs = (args: string[]): ParsedAppendTurnArgs => {
  let cwd = process.cwd();
  let dryRun = false;
  let json = false;
  let threadId: string | undefined;
  let sessionId: string | undefined;
  let role: ParsedAppendTurnArgs['role'] = 'user';
  let sourceEvent: ParsedAppendTurnArgs['sourceEvent'] = 'manual';
  let transcriptPath: string | undefined;
  let message: string | undefined;
  let messageStdin = false;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--message-stdin') {
      messageStdin = true;
      continue;
    }

    if (argument === '--thread') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --thread.');
      }
      threadId = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--thread=')) {
      threadId = argument.slice('--thread='.length);
      continue;
    }

    if (argument === '--session-id') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --session-id.');
      }
      sessionId = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--session-id=')) {
      sessionId = argument.slice('--session-id='.length);
      continue;
    }

    if (argument === '--role') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --role.');
      }
      role = parseRole(nextValue);
      index += 1;
      continue;
    }

    if (argument.startsWith('--role=')) {
      role = parseRole(argument.slice('--role='.length));
      continue;
    }

    if (argument === '--source-event') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --source-event.');
      }
      sourceEvent = parseSourceEvent(nextValue);
      index += 1;
      continue;
    }

    if (argument.startsWith('--source-event=')) {
      sourceEvent = parseSourceEvent(argument.slice('--source-event='.length));
      continue;
    }

    if (argument === '--transcript-path') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --transcript-path.');
      }
      transcriptPath = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--transcript-path=')) {
      transcriptPath = argument.slice('--transcript-path='.length);
      continue;
    }

    if (argument === '--message') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --message.');
      }
      message = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--message=')) {
      message = argument.slice('--message='.length);
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos discuss append-turn flag: ${argument}`);
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra discuss target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  if (message && messageStdin) {
    throw new Error('Use either --message or --message-stdin, not both.');
  }

  return {
    cwd,
    dryRun,
    json,
    threadId,
    sessionId,
    role,
    sourceEvent,
    transcriptPath,
    message,
    messageStdin,
  };
};

const parseRole = (value: string): ParsedAppendTurnArgs['role'] => {
  if (value === 'user' || value === 'assistant' || value === 'system') {
    return value;
  }

  throw new Error(`Unsupported discussion role: ${value}`);
};

const parseSourceEvent = (value: string): ParsedAppendTurnArgs['sourceEvent'] => {
  if (
    value === 'manual' ||
    value === 'session-start' ||
    value === 'user-prompt-submit' ||
    value === 'assistant-turn' ||
    value === 'stop' ||
    value === 'major-state-change' ||
    value === 'pre-compact' ||
    value === 'post-compact'
  ) {
    return value;
  }

  throw new Error(`Unsupported discussion source event: ${value}`);
};

const readStdinText = async (): Promise<string> => {
  const decoder = new TextDecoder();
  let text = '';

  for await (const chunk of process.stdin) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
    text += decoder.decode(bytes, { stream: true });
  }

  return text + decoder.decode();
};
