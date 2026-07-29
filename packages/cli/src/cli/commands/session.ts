import { resolve } from 'node:path';

import { buildSkoposSessionContextRuntime } from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedSessionContextArgs {
  cwd: string;
  actor?: string;
  sessionId?: string;
  host?: string;
  leaseSeconds?: number;
  dryRun: boolean;
  json: boolean;
}

export const runSessionCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;
  if (subcommand !== 'context') {
    throw new Error(`Unknown Skopos session subcommand: ${subcommand ?? '(missing)'}`);
  }

  const parsed = parseSessionContextArgs(rest);
  const result = await buildSkoposSessionContextRuntime(parsed);
  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  writeLines([
    'Skopos session context',
    `- summary: ${result.summary}`,
    `- response mode: ${result.responseMode}`,
    `- current Task: ${result.currentTaskId ?? '(none)'}`,
    `- coordination Session: ${result.coordination?.session.sessionId ?? '(none)'}`,
    `- reserved Task: ${result.coordination?.reservation?.taskId ?? '(none)'}`,
    `- pending decision: ${result.pendingDecision?.id ?? '(none)'}`,
    `- next command: ${result.nextCommand ?? '(none)'}`,
    `- warnings: ${result.warnings.length}`,
  ]);
};

const parseSessionContextArgs = (args: string[]): ParsedSessionContextArgs => {
  let cwd = process.cwd();
  let actor: string | undefined;
  let sessionId: string | undefined;
  let host: string | undefined;
  let leaseSeconds: number | undefined;
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
    if (argument === '--actor') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --actor.');
      }
      actor = value;
      index += 1;
      continue;
    }
    if (argument === '--session-id' || argument === '--host' || argument === '--lease-seconds') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error(`Missing value for ${argument}.`);
      }
      if (argument === '--session-id') sessionId = value;
      if (argument === '--host') host = value;
      if (argument === '--lease-seconds') {
        leaseSeconds = Number(value);
        if (!Number.isInteger(leaseSeconds)) {
          throw new Error('--lease-seconds requires an integer.');
        }
      }
      index += 1;
      continue;
    }
    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos session flag: ${argument}`);
    }
    if (targetProvided) {
      throw new Error(`Unexpected extra session target: ${argument}`);
    }
    cwd = resolve(argument);
    targetProvided = true;
  }

  return { cwd, actor, sessionId, host, leaseSeconds, dryRun, json };
};
