import { resolve } from 'node:path';

import { scaffoldSkoposProjectInstructions, syncSkoposInstructions } from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedInstructionSyncArgs {
  cwd: string;
  dryRun: boolean;
  actor?: string;
  json: boolean;
}

interface ParsedInstructionScaffoldArgs extends ParsedInstructionSyncArgs {
  mode: 'existing' | 'greenfield';
  force: boolean;
}

export const runInstructionsCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (subcommand === 'sync') {
    await runInstructionsSyncCommand(rest);
    return;
  }

  if (subcommand === 'scaffold') {
    await runInstructionsScaffoldCommand(rest);
    return;
  }

  throw new Error(`Unknown Skopos instructions subcommand: ${subcommand ?? '(missing)'}`);
};

const runInstructionsSyncCommand = async (args: string[]): Promise<void> => {
  const parsed = parseInstructionSyncArgs(args);
  const result = await syncSkoposInstructions({
    cwd: parsed.cwd,
    dryRun: parsed.dryRun,
    actor: parsed.actor,
  });

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  writeLines([
    'Skopos instructions sync',
    `- source: ${result.sourcePath}`,
    `- actor: ${result.actorId ?? '(none)'}`,
    '- writes:',
    ...result.writes.map((write) => `  - ${write.path} (${write.status})`),
  ]);
};

const runInstructionsScaffoldCommand = async (args: string[]): Promise<void> => {
  const parsed = parseInstructionScaffoldArgs(args);
  const result = await scaffoldSkoposProjectInstructions({
    cwd: parsed.cwd,
    mode: parsed.mode,
    dryRun: parsed.dryRun,
    actor: parsed.actor,
    force: parsed.force,
  });

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  writeLines([
    'Skopos instructions scaffold',
    `- path: ${result.path}`,
    `- status: ${result.status}`,
    `- mode: ${result.mode}`,
    `- actor: ${result.actorId ?? '(none)'}`,
    `- template version: ${result.templateVersion}`,
    '- sections:',
    ...result.sections.map((section) => `  - ${section}`),
  ]);
};

const parseInstructionSyncArgs = (args: string[]): ParsedInstructionSyncArgs => {
  const parsed = parseCommonInstructionArgs(args);

  return {
    cwd: parsed.cwd,
    dryRun: parsed.dryRun,
    actor: parsed.actor,
    json: parsed.json,
  };
};

const parseInstructionScaffoldArgs = (args: string[]): ParsedInstructionScaffoldArgs => {
  const parsed = parseCommonInstructionArgs(args, { allowMode: true, allowForce: true });

  return {
    cwd: parsed.cwd,
    dryRun: parsed.dryRun,
    actor: parsed.actor,
    json: parsed.json,
    mode: parsed.mode ?? 'existing',
    force: parsed.force,
  };
};

interface ParseCommonInstructionArgsOptions {
  allowMode?: boolean;
  allowForce?: boolean;
}

interface ParsedCommonInstructionArgs {
  cwd: string;
  dryRun: boolean;
  actor?: string;
  json: boolean;
  mode?: 'existing' | 'greenfield';
  force: boolean;
}

const parseCommonInstructionArgs = (
  args: string[],
  options: ParseCommonInstructionArgsOptions = {},
): ParsedCommonInstructionArgs => {
  let cwd = process.cwd();
  let dryRun = false;
  let actor: string | undefined;
  let json = false;
  let mode: ParsedCommonInstructionArgs['mode'];
  let force = false;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

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

    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--force') {
      if (!options.allowForce) {
        throw new Error('Unknown Skopos instructions flag: --force');
      }
      force = true;
      continue;
    }

    if (argument === '--mode') {
      if (!options.allowMode) {
        throw new Error('Unknown Skopos instructions flag: --mode');
      }
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --mode.');
      }
      mode = parseMode(nextValue);
      index += 1;
      continue;
    }

    if (argument.startsWith('--mode=')) {
      if (!options.allowMode) {
        throw new Error(`Unknown Skopos instructions flag: ${argument}`);
      }
      mode = parseMode(argument.slice('--mode='.length));
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos instructions flag: ${argument}`);
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra instructions target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  return { cwd, dryRun, actor, json, mode, force };
};

const parseMode = (value: string): 'existing' | 'greenfield' => {
  if (value === 'existing' || value === 'greenfield') {
    return value;
  }

  throw new Error(`Unsupported instructions scaffold mode: ${value}`);
};
