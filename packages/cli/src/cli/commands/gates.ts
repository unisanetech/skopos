import { resolve } from 'node:path';

import { resolveSkoposGatesRuntime } from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedGatesArgs {
  subcommand?: string;
  cwd: string;
  actor?: string;
  dryRun: boolean;
  json: boolean;
}

export const runGatesCommand = async (args: string[]): Promise<void> => {
  const parsed = parseGatesArgs(args);

  if (parsed.subcommand !== 'resolve') {
    throw new Error(`Unknown Skopos gates subcommand: ${parsed.subcommand ?? '(missing)'}`);
  }

  const result = await resolveSkoposGatesRuntime({
    cwd: parsed.cwd,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  const gates = result.artifact.gates;
  const available = gates.filter((gate) => gate.status === 'available');
  const manual = gates.filter((gate) => gate.status === 'manual');
  const missing = gates.filter((gate) => gate.status === 'missing');

  writeLines([
    'Skopos gates',
    `Status: ${result.artifactWrite}`,
    `Artifact: ${result.artifactPath}`,
    `Project commands found: ${result.artifact.detectedScripts.length}`,
    `Gate plan: ${available.length} available, ${manual.length} manual, ${missing.length} missing`,
    '',
    'Available commands:',
    ...(available.length > 0
      ? available.map((gate) => `- ${gate.label}: ${gate.command}`)
      : ['- None found yet.']),
    '',
    'Manual/native gates:',
    ...(manual.length > 0
      ? manual.map((gate) => `- ${gate.label}: ${gate.summary}`)
      : ['- None.']),
    '',
    'Missing gates:',
    ...(missing.length > 0
      ? missing.map((gate) => `- ${gate.label}: ${gate.missingReason ?? gate.summary}`)
      : ['- None.']),
  ]);
};

const parseGatesArgs = (args: string[]): ParsedGatesArgs => {
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
      throw new Error(`Unknown Skopos gates flag: ${argument}`);
    }

    if (!subcommand) {
      subcommand = argument;
      continue;
    }

    cwd = resolve(argument);
  }

  return { subcommand, cwd, actor, dryRun, json };
};
