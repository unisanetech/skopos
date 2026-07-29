import { resolve } from 'node:path';

import { resolveSkoposGuardsRuntime } from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedGuardsArgs {
  subcommand?: string;
  cwd: string;
  actor?: string;
  dryRun: boolean;
  json: boolean;
}

export const runGuardsCommand = async (args: string[]): Promise<void> => {
  const parsed = parseGuardsArgs(args);

  if (parsed.subcommand !== 'resolve') {
    throw new Error(`Unknown Skopos guards subcommand: ${parsed.subcommand ?? '(missing)'}`);
  }

  const result = await resolveSkoposGuardsRuntime({
    cwd: parsed.cwd,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  const guards = result.artifact.guards;
  const available = guards.filter((guard) => guard.status === 'available');
  const manual = guards.filter((guard) => guard.status === 'manual');
  const missing = guards.filter((guard) => guard.status === 'missing');

  writeLines([
    'Skopos guards',
    `Status: ${result.artifactWrite}`,
    `Artifact: ${result.artifactPath}`,
    `Project commands found: ${result.artifact.detectedScripts.length}`,
    `Guard resolution: ${available.length} available, ${manual.length} manual, ${missing.length} missing`,
    '',
    'Available commands:',
    ...(available.length > 0
      ? available.map((guard) => `- ${guard.label}: ${guard.command}`)
      : ['- None found yet.']),
    '',
    'Manual/native guards:',
    ...(manual.length > 0
      ? manual.map((guard) => `- ${guard.label}: ${guard.summary}`)
      : ['- None.']),
    '',
    'Missing guards:',
    ...(missing.length > 0
      ? missing.map((guard) => `- ${guard.label}: ${guard.missingReason ?? guard.summary}`)
      : ['- None.']),
  ]);
};

const parseGuardsArgs = (args: string[]): ParsedGuardsArgs => {
  let subcommand: string | undefined;
  let cwd = process.cwd();
  let actor: string | undefined;
  let dryRun = false;
  let json = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (argument === '--actor') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --actor.');
      }
      actor = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--actor=')) {
      actor = argument.slice('--actor='.length);
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos guards flag: ${argument}`);
    }

    if (!subcommand) {
      subcommand = argument;
      continue;
    }

    cwd = resolve(argument);
  }

  return { subcommand, cwd, actor, dryRun, json };
};
