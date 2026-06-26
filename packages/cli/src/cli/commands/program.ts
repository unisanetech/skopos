import { resolve } from 'node:path';

import {
  buildSkoposProgramNextRuntime,
  buildSkoposProgramSyncRuntime,
} from '@skopos/runtime';

import {
  buildCompactProgramNextLines,
  buildCompactProgramNextOutput,
  buildCompactProgramSyncLines,
  buildCompactProgramSyncOutput,
} from '../shared/compact-output.js';
import {
  buildSummaryLines,
  parseFieldList,
  projectJsonOutput,
  writeJsonOutput,
  writeLines,
} from '../shared/output.js';

interface ParsedProgramArgs {
  cwd: string;
  actor?: string;
  dryRun: boolean;
  compact: boolean;
  summary: boolean;
  fields: string[];
  json: boolean;
}

export const runProgramCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (subcommand === 'sync') {
    const parsed = parseProgramArgs(rest);
    const result = await buildSkoposProgramSyncRuntime({
      cwd: parsed.cwd,
      actor: parsed.actor,
      dryRun: parsed.dryRun,
    });
    const output = parsed.compact ? buildCompactProgramSyncOutput(result) : result;

    if (parsed.json) {
      writeJsonOutput(
        projectJsonOutput(output, {
          summary: parsed.summary,
          fields: parsed.fields,
        }),
      );
      return;
    }

    if (parsed.summary) {
      writeLines(buildSummaryLines(output));
      return;
    }

    if (parsed.compact) {
      writeLines(buildCompactProgramSyncLines(result));
      return;
    }

    const lines = [
      ...buildCompactProgramSyncLines(result),
      '',
      'Details:',
      `- actor: ${result.actorId ?? '(none)'}`,
      `- state: ${result.statePath} (${result.stateWrite})`,
      `- items: ${result.state.items.length}`,
      `- open obligations: ${result.state.obligations.filter((entry) => entry.status === 'open').length}`,
      `- do now: ${result.doNowItem?.title ?? '(none)'}`,
      `- do next: ${result.doNextItem?.title ?? '(none)'}`,
    ];

    if (result.recommendedAction) {
      lines.push(`- next: ${result.recommendedAction.title}`);
      lines.push(`  summary: ${result.recommendedAction.summary}`);
      if (result.recommendedAction.command) {
        lines.push(`  command: ${result.recommendedAction.command}`);
      }
    }

    writeLines(lines);
    return;
  }

  if (subcommand === 'next') {
    const parsed = parseProgramArgs(rest);
    const result = await buildSkoposProgramNextRuntime({
      cwd: parsed.cwd,
      actor: parsed.actor,
      dryRun: parsed.dryRun,
    });
    const output = parsed.compact ? buildCompactProgramNextOutput(result) : result;

    if (parsed.json) {
      writeJsonOutput(
        projectJsonOutput(output, {
          summary: parsed.summary,
          fields: parsed.fields,
        }),
      );
      return;
    }

    if (parsed.summary) {
      writeLines(buildSummaryLines(output));
      return;
    }

    if (parsed.compact) {
      writeLines(buildCompactProgramNextLines(result));
      return;
    }

    const lines = [
      ...buildCompactProgramNextLines(result),
      '',
      'Details:',
      `- actor: ${result.actorId ?? '(none)'}`,
      `- disposition: ${result.currentDisposition}`,
      `- current mission: ${result.currentMissionId ?? '(none)'}`,
      `- state: ${result.statePath} (${result.stateWrite})`,
      `- recommended item: ${result.recommendedItem?.title ?? '(none)'}`,
      `- open obligations: ${result.obligations.length}`,
    ];

    if (result.recommendedAction) {
      lines.push(`- next: ${result.recommendedAction.title}`);
      lines.push(`  summary: ${result.recommendedAction.summary}`);
      if (result.recommendedAction.command) {
        lines.push(`  command: ${result.recommendedAction.command}`);
      }
    }

    writeLines(lines);
    return;
  }

  throw new Error(`Unknown Skopos program subcommand: ${subcommand ?? '(missing)'}`);
};

const parseProgramArgs = (args: string[]): ParsedProgramArgs => {
  let cwd = process.cwd();
  let actor: string | undefined;
  let dryRun = false;
  let compact = false;
  let summary = false;
  let fields: string[] = [];
  let json = false;
  let targetProvided = false;

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

    if (argument === '--compact') {
      compact = true;
      continue;
    }

    if (argument === '--summary') {
      summary = true;
      continue;
    }

    if (argument === '--fields') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --fields.');
      }
      fields = parseFieldList(nextValue);
      index += 1;
      continue;
    }

    if (argument.startsWith('--fields=')) {
      fields = parseFieldList(argument.slice('--fields='.length));
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
      throw new Error(`Unknown Skopos program flag: ${argument}`);
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra program target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  if (summary && fields.length > 0) {
    throw new Error('Use either --summary or --fields, not both.');
  }

  if (fields.length > 0 && !json) {
    throw new Error('Field selection requires --json.');
  }

  return {
    cwd,
    actor,
    dryRun,
    compact,
    summary,
    fields,
    json,
  };
};
