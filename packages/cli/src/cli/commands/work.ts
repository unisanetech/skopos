import { resolve } from 'node:path';

import { buildSkoposWorkQueueRuntime } from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

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
    writeJsonOutput(result);
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

const parseWorkArgs = (
  args: string[],
): {
  subcommand?: string;
  cwd: string;
  actor?: string;
  dryRun: boolean;
  json: boolean;
} => {
  let subcommand: string | undefined;
  let cwd = process.cwd();
  let actor: string | undefined;
  let dryRun = false;
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') json = true;
    else if (argument === '--dry-run') dryRun = true;
    else if (argument === '--actor') actor = requireValue(args, ++index, '--actor');
    else if (argument.startsWith('--actor=')) actor = argument.slice('--actor='.length);
    else if (argument.startsWith('-')) throw new Error(`Unknown Skopos work flag: ${argument}`);
    else if (!subcommand) subcommand = argument;
    else cwd = resolve(argument);
  }
  return { subcommand, cwd, actor, dryRun, json };
};

const requireValue = (args: string[], index: number, flag: string): string => {
  const value = args[index];
  if (!value || value.startsWith('-')) throw new Error(`Missing value for ${flag}.`);
  return value;
};
