import { resolve } from 'node:path';

import { listSkoposPolicyPacksRuntime, showSkoposPolicyPackRuntime } from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedTargetArgs {
  cwd: string;
  json: boolean;
}

interface ParsedPackArgs extends ParsedTargetArgs {
  pack?: string;
}

export const runPoliciesCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (subcommand === 'list') {
    const parsed = parseTargetArgs(rest);
    const result = await listSkoposPolicyPacksRuntime({ cwd: parsed.cwd });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos policy packs',
      ...result.map(
        (pack) =>
          `- ${pack.packId} [${pack.family}/${pack.variant}] ${pack.status} (${pack.rules.length} rules)`,
      ),
    ]);
    return;
  }

  if (subcommand === 'show') {
    const parsed = parsePackArgs(rest);
    if (!parsed.pack) {
      throw new Error('Missing policy pack id or manifest path.');
    }

    const result = await showSkoposPolicyPackRuntime({ cwd: parsed.cwd, pack: parsed.pack });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos policy pack',
      `- id: ${result.packId}`,
      `- family: ${result.family}`,
      `- variant: ${result.variant}`,
      `- version: ${result.version}`,
      `- status: ${result.status}`,
      `- source: ${result.sourcePath}`,
      `- rules: ${result.rules.length}`,
      `- drift checks: ${result.driftCheckIds.length}`,
      `- fixtures: ${result.proofFixtureIds.length}`,
    ]);
    return;
  }

  throw new Error(`Unknown Skopos policies subcommand: ${subcommand ?? '(missing)'}`);
};

const parseTargetArgs = (args: string[]): ParsedTargetArgs => {
  let cwd = process.cwd();
  let json = false;

  for (const argument of args) {
    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos policies flag: ${argument}`);
    }

    cwd = resolve(argument);
  }

  return { cwd, json };
};

const parsePackArgs = (args: string[]): ParsedPackArgs => {
  let cwd = process.cwd();
  let pack: string | undefined;
  let json = false;
  let targetProvided = false;

  for (const argument of args) {
    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos policies flag: ${argument}`);
    }

    if (!pack) {
      pack = argument;
      continue;
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra policies target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  return { cwd, pack, json };
};
