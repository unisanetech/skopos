import { resolve } from 'node:path';

import { buildSkoposWorkQueueRuntime } from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';
import { paginateCollection, parseCollectionLimit } from '../shared/pagination.js';

export const runWorkCommand = async (args: string[]): Promise<void> => {
  const parsed = parseWorkArgs(args);
  if (parsed.subcommand !== 'queue' && parsed.subcommand !== 'next') {
    throw new Error(`Unknown Skopos work subcommand: ${parsed.subcommand ?? '(missing)'}`);
  }
  const result = await buildSkoposWorkQueueRuntime({
    cwd: parsed.cwd,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });
  if (parsed.json) {
    writeJsonOutput(
      parsed.subcommand === 'next'
        ? buildCompactWorkNextOutput(result)
        : buildPagedWorkQueueOutput(result, parsed.cursor, parsed.limit),
    );
    return;
  }
  const entry = result.recommendedEntry;
  writeLines([
    'Skopos Work Queue',
    `Status: ${result.artifactWrite}`,
    `Summary: ${result.summary}`,
    `Items: ${result.workQueue.entries.length}`,
    `Active: ${result.workQueue.counts['in-progress']}`,
    `Ready: ${result.workQueue.counts.ready}`,
    `Blocked: ${result.workQueue.counts.blocked}`,
    `Verifying: ${result.workQueue.counts.verifying}`,
    `Ready to integrate: ${result.workQueue.counts['ready-to-integrate']}`,
    'Next:',
    entry
      ? `${entry.id}: ${entry.title} — ${entry.reason}`
      : 'No ready or active Task is available.',
  ]);
};

export const buildCompactWorkNextOutput = (
  result: Awaited<ReturnType<typeof buildSkoposWorkQueueRuntime>>,
) => ({
  schemaVersion: 1,
  workspaceRoot: result.workspaceRoot,
  actorId: result.actorId,
  summary: result.summary,
  currentTaskId: result.currentTaskId,
  recommendedEntry: result.recommendedEntry,
  counts: result.workQueue.counts,
  queueItemCount: result.workQueue.entries.length,
});

export const buildPagedWorkQueueOutput = (
  result: Awaited<ReturnType<typeof buildSkoposWorkQueueRuntime>>,
  cursor?: string,
  limit?: number,
) => {
  const entries = paginateCollection(result.workQueue.entries, {
    collection: 'work-queue.entries',
    cursor,
    limit,
  });
  return {
    schemaVersion: 1,
    type: 'work-queue-page',
    workspaceRoot: result.workspaceRoot,
    actorId: result.actorId,
    summary: result.summary,
    currentTaskId: result.currentTaskId,
    recommendedEntry: result.recommendedEntry,
    counts: result.workQueue.counts,
    entries: entries.items,
    page: entries.page,
    artifactPath: result.artifactPath,
  };
};

const parseWorkArgs = (
  args: string[],
): {
  subcommand?: string;
  cwd: string;
  actor?: string;
  dryRun: boolean;
  cursor?: string;
  limit?: number;
  json: boolean;
} => {
  let subcommand: string | undefined;
  let cwd = process.cwd();
  let actor: string | undefined;
  let dryRun = false;
  let cursor: string | undefined;
  let limit: number | undefined;
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') json = true;
    else if (argument === '--dry-run') dryRun = true;
    else if (argument === '--cursor') cursor = requireValue(args, ++index, '--cursor');
    else if (argument.startsWith('--cursor=')) cursor = argument.slice('--cursor='.length);
    else if (argument === '--limit') limit = parseCollectionLimit(requireValue(args, ++index, '--limit'));
    else if (argument.startsWith('--limit=')) limit = parseCollectionLimit(argument.slice('--limit='.length));
    else if (argument === '--actor') actor = requireValue(args, ++index, '--actor');
    else if (argument.startsWith('--actor=')) actor = argument.slice('--actor='.length);
    else if (argument.startsWith('-')) throw new Error(`Unknown Skopos work flag: ${argument}`);
    else if (!subcommand) subcommand = argument;
    else cwd = resolve(argument);
  }
  return { subcommand, cwd, actor, dryRun, cursor, limit, json };
};

const requireValue = (args: string[], index: number, flag: string): string => {
  const value = args[index];
  if (!value || value.startsWith('-')) throw new Error(`Missing value for ${flag}.`);
  return value;
};
