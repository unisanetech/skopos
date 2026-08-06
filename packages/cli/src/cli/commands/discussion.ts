import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import type { SkoposConversationCapsule } from '@skopos/model';

import {
  buildSkoposDiscussionAppendTurnRuntime,
  buildSkoposDiscussionCheckpointRuntime,
  buildSkoposDiscussionHandoffRuntime,
  buildSkoposDiscussionRecentRuntime,
  buildSkoposDiscussionSyncCodexRuntime,
  acceptSkoposDiscussionHandoffRuntime,
  renderSkoposDiscussionHandoffRuntime,
  showSkoposDiscussionHandoffRuntime,
  verifySkoposDiscussionHandoffRuntime,
  recordSkoposDiscussionHandoffDeliveryRuntime,
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
    const [operation, ...handoffArgs] = rest;
    if (!operation || !['create', 'refresh', 'show', 'verify', 'accept', 'render', 'deliver'].includes(operation)) {
      throw new Error('Use skopos discuss handoff <create|refresh|show|verify|accept|render|deliver>.');
    }
    const parsed = parseHandoffArgs(handoffArgs);
    let result: Awaited<ReturnType<typeof buildSkoposDiscussionHandoffRuntime>> | Awaited<ReturnType<typeof showSkoposDiscussionHandoffRuntime>>;
    if (operation === 'create') {
      if (!parsed.contextPath) throw new Error('Handoff create requires --context <agent-authored-capsule.json>.');
      const capsule = JSON.parse(await readFile(resolve(parsed.cwd, parsed.contextPath), 'utf8')) as SkoposConversationCapsule;
      result = await buildSkoposDiscussionHandoffRuntime({ cwd: parsed.cwd, taskId: parsed.taskId, conversationCapsule: capsule, dryRun: parsed.dryRun });
    } else if (operation === 'refresh') {
      result = await buildSkoposDiscussionHandoffRuntime({ cwd: parsed.cwd, taskId: parsed.taskId, dryRun: parsed.dryRun });
    } else if (operation === 'show') {
      result = await showSkoposDiscussionHandoffRuntime({ cwd: parsed.cwd, taskId: parsed.taskId });
    } else if (operation === 'verify') {
      result = await verifySkoposDiscussionHandoffRuntime({ cwd: parsed.cwd, taskId: parsed.taskId });
    } else if (operation === 'render') {
      result = await renderSkoposDiscussionHandoffRuntime({ cwd: parsed.cwd, taskId: parsed.taskId });
    } else if (operation === 'accept') {
      if (!parsed.actor || !parsed.receivingSessionId || !parsed.destinationHost) throw new Error('Handoff accept requires --actor, --receiving-session, and --host.');
      result = await acceptSkoposDiscussionHandoffRuntime({ cwd: parsed.cwd, taskId: parsed.taskId, actor: parsed.actor, receivingSessionId: parsed.receivingSessionId, destinationHost: parsed.destinationHost, dryRun: parsed.dryRun });
    } else {
      if (!parsed.actor || !parsed.deliveryResult || !parsed.originMessageOutcome || !parsed.detail) throw new Error('Handoff deliver requires --actor, --result, --origin-message, and --detail.');
      result = await recordSkoposDiscussionHandoffDeliveryRuntime({ cwd: parsed.cwd, taskId: parsed.taskId, actor: parsed.actor, result: parsed.deliveryResult, destinationRef: parsed.destinationRef, originMessageOutcome: parsed.originMessageOutcome, detail: parsed.detail, dryRun: parsed.dryRun });
    }

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      `Skopos discuss handoff ${operation}`,
      `- summary: ${result.summary}`,
      `- handoff: ${result.handoffPath}`,
      `- freshness: ${result.handoff.validation.freshness}`,
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

interface ParsedHandoffArgs extends ParsedDiscussionTargetArgs {
  taskId?: string;
  contextPath?: string;
  actor?: string;
  receivingSessionId?: string;
  destinationHost?: string;
  deliveryResult?: 'pass' | 'fail';
  destinationRef?: string;
  originMessageOutcome?: 'succeeded' | 'failed' | 'unsupported';
  detail?: string;
}

const parseHandoffArgs = (args: string[]): ParsedHandoffArgs => {
  const values: ParsedHandoffArgs = { cwd: process.cwd(), dryRun: false, json: false };
  let targetProvided = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--dry-run') { values.dryRun = true; continue; }
    if (argument === '--json') { values.json = true; continue; }
    const named: Record<string, keyof ParsedHandoffArgs> = { '--task': 'taskId', '--context': 'contextPath', '--actor': 'actor', '--receiving-session': 'receivingSessionId', '--host': 'destinationHost', '--destination-ref': 'destinationRef', '--detail': 'detail' };
    const key = named[argument];
    if (key) {
      const next = args[index + 1];
      if (!next || next.startsWith('-')) throw new Error(`Missing value for ${argument}.`);
      (values as unknown as Record<string, unknown>)[key] = next;
      index += 1;
      continue;
    }
    if (argument === '--result') {
      const next = args[index + 1]; if (next !== 'pass' && next !== 'fail') throw new Error('Handoff --result must be pass or fail.'); values.deliveryResult = next; index += 1; continue;
    }
    if (argument === '--origin-message') {
      const next = args[index + 1]; if (next !== 'succeeded' && next !== 'failed' && next !== 'unsupported') throw new Error('Handoff --origin-message must be succeeded, failed, or unsupported.'); values.originMessageOutcome = next; index += 1; continue;
    }
    if (argument.startsWith('-')) throw new Error(`Unknown Skopos discuss handoff flag: ${argument}`);
    if (targetProvided) throw new Error(`Unexpected extra discuss handoff target: ${argument}`);
    values.cwd = resolve(argument); targetProvided = true;
  }
  return values;
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
