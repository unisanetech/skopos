import { resolve } from 'node:path';

import { setSkoposOverrideRuntime, showSkoposOverridesRuntime } from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedTargetArgs {
  cwd: string;
  json: boolean;
}

interface ParsedOverridesArgs {
  cwd: string;
  key?: string;
  value?: string;
  reason?: string;
  actor?: string;
  force: boolean;
  json: boolean;
}

export const runOverridesCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (subcommand === 'show') {
    const parsed = parseTargetArgs(rest);
    const result = await showSkoposOverridesRuntime({
      cwd: parsed.cwd,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    const lines = [
      'Skopos overrides',
      `- workspace: ${result.workspaceRoot}`,
      `- entries: ${result.entries.length}`,
    ];

    if (result.entries.length > 0) {
      lines.push('- declared canonicals:');
      for (const entry of result.entries) {
        lines.push(`  - ${entry.key}=${entry.value}${entry.updatedBy ? ` [${entry.updatedBy}]` : ''}`);
      }
    }

    writeLines(lines);
    return;
  }

  if (subcommand === 'set') {
    const parsed = parseOverridesArgs(rest);
    if (!parsed.key || !parsed.value) {
      throw new Error('Missing override key or value.');
    }

    const result = await setSkoposOverrideRuntime({
      cwd: parsed.cwd,
      key: parsed.key as 'project.archetype' | 'project.repoMode' | 'docs.root',
      value: parsed.value,
      reason: parsed.reason,
      actor: parsed.actor,
      force: parsed.force,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos override set',
      `- workspace: ${result.overrides.workspaceRoot}`,
      `- key: ${result.updatedEntry.key}`,
      `- value: ${result.updatedEntry.value}`,
      `- actor: ${result.updatedEntry.updatedBy ?? '(unknown)'}`,
      `- path: ${result.overridePath}`,
    ]);
    return;
  }

  throw new Error(`Unknown Skopos overrides subcommand: ${subcommand ?? '(missing)'}`);
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
      throw new Error(`Unknown Skopos flag: ${argument}`);
    }

    cwd = resolve(argument);
  }

  return { cwd, json };
};

const parseOverridesArgs = (args: string[]): ParsedOverridesArgs => {
  let cwd = process.cwd();
  let key: string | undefined;
  let value: string | undefined;
  let reason: string | undefined;
  let actor: string | undefined;
  let force = false;
  let json = false;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--force') {
      force = true;
      continue;
    }

    if (argument === '--reason') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --reason.');
      }
      reason = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--reason=')) {
      reason = argument.slice('--reason='.length);
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
      throw new Error(`Unknown Skopos overrides flag: ${argument}`);
    }

    if (!key) {
      key = argument;
      continue;
    }

    if (!value) {
      value = argument;
      continue;
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra overrides target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  return { cwd, key, value, reason, actor, force, json };
};
