import { resolve } from 'node:path';

import {
  buildSkoposStorageInspectRuntime,
  buildSkoposStoragePinRuntime,
  buildSkoposStoragePolicyRuntime,
  buildSkoposStoragePruneRuntime,
  buildSkoposStorageStatusRuntime,
  buildSkoposStorageUnpinRuntime,
  type SkoposStorageClassSummary,
  type SkoposStorageUnit,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

const HELP_FLAGS = new Set(['--help', '-h']);
const STORAGE_SUBCOMMANDS = new Set(['status', 'inspect', 'prune', 'pin', 'unpin', 'policy']);

interface ParsedStorageArgs {
  cwd: string;
  json: boolean;
  apply: boolean;
  limit: number;
  actor?: string;
  reason?: string;
  positional: string[];
}

export const runStorageCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (!subcommand || HELP_FLAGS.has(subcommand)) {
    printStorageHelp();
    return;
  }

  if (!STORAGE_SUBCOMMANDS.has(subcommand)) {
    throw new Error(`Unknown Skopos storage subcommand: ${subcommand}`);
  }

  if (rest.some((argument) => HELP_FLAGS.has(argument))) {
    printStorageHelp(subcommand);
    return;
  }

  if (subcommand === 'status') {
    const parsed = parseStorageArgs(rest);
    rejectUnexpectedPositionals(parsed, 0, 'storage status');
    const result = await buildSkoposStorageStatusRuntime({ cwd: parsed.cwd });
    if (parsed.json) writeJsonOutput(result);
    else writeStorageStatus(result);
    return;
  }

  if (subcommand === 'inspect') {
    const parsed = parseStorageArgs(rest);
    rejectUnexpectedPositionals(parsed, 0, 'storage inspect');
    const result = await buildSkoposStorageInspectRuntime({
      cwd: parsed.cwd,
      limit: parsed.limit,
    });
    if (parsed.json) writeJsonOutput(result);
    else {
      writeStorageStatus(result);
      writeLines([
        `Largest ${result.largest.length} managed storage units`,
        ...result.largest.map(formatUnit),
      ]);
    }
    return;
  }

  if (subcommand === 'prune') {
    const parsed = parseStorageArgs(rest);
    rejectUnexpectedPositionals(parsed, 0, 'storage prune');
    const result = await buildSkoposStoragePruneRuntime({
      cwd: parsed.cwd,
      apply: parsed.apply,
      actor: parsed.actor,
    });
    if (parsed.json) writeJsonOutput(result);
    else {
      writeLines([
        `Skopos storage prune (${result.mode})`,
        `- workspace: ${result.workspaceRoot}`,
        `- planned: ${result.plannedUnitCount} units (${formatBytes(result.plannedBytes)})`,
        `- deleted: ${result.deletedUnitCount} units (${formatBytes(result.deletedBytes)})`,
        `- failed: ${result.failedUnitCount}`,
        `- protected: ${result.protectedUnitCount}`,
        ...(result.receiptPath ? [`- receipt: ${result.receiptPath}`] : []),
        ...(result.mode === 'dry-run'
          ? ['- no files changed; repeat with --apply --actor <id> to delete eligible units']
          : []),
        `- privacy: ${result.privacyWarning}`,
      ]);
    }
    return;
  }

  if (subcommand === 'pin') {
    const parsed = parseStorageArgs(rest, { targetPosition: 1 });
    const [path] = parsed.positional;
    if (!path) throw new Error('Missing .skopos path to pin.');
    rejectUnexpectedPositionals(parsed, 1, 'storage pin');
    if (!parsed.actor) throw new Error('Missing --actor for storage pin.');
    if (!parsed.reason) throw new Error('Missing --reason for storage pin.');
    const result = await buildSkoposStoragePinRuntime({
      cwd: parsed.cwd,
      path,
      actor: parsed.actor,
      reason: parsed.reason,
    });
    if (parsed.json) writeJsonOutput(result);
    else {
      writeLines([
        result.reused ? 'Skopos storage pin already exists' : 'Skopos storage pin created',
        `- id: ${result.pin.id}`,
        `- path: ${result.pin.path}`,
        `- reason: ${result.pin.reason}`,
      ]);
    }
    return;
  }

  if (subcommand === 'unpin') {
    const parsed = parseStorageArgs(rest, { targetPosition: 1 });
    const [pin] = parsed.positional;
    if (!pin) throw new Error('Missing storage pin id or .skopos path.');
    rejectUnexpectedPositionals(parsed, 1, 'storage unpin');
    if (!parsed.actor) throw new Error('Missing --actor for storage unpin.');
    const result = await buildSkoposStorageUnpinRuntime({
      cwd: parsed.cwd,
      pin,
      actor: parsed.actor,
    });
    if (parsed.json) writeJsonOutput(result);
    else writeLines(['Skopos storage pin removed', `- id: ${result.removed.id}`, `- path: ${result.removed.path}`]);
    return;
  }

  const [policySubcommand = 'show', ...policyRest] = rest;
  if (policySubcommand !== 'show') {
    throw new Error(`Unknown Skopos storage policy subcommand: ${policySubcommand}`);
  }
  const parsed = parseStorageArgs(policyRest);
  rejectUnexpectedPositionals(parsed, 0, 'storage policy show');
  const result = await buildSkoposStoragePolicyRuntime({ cwd: parsed.cwd });
  if (parsed.json) writeJsonOutput(result);
  else {
    writeLines([
      'Skopos storage policy',
      `- workspace: ${result.workspaceRoot}`,
      `- soft limit: ${result.policy.softLimitMb} MiB`,
      `- hard limit: ${result.policy.hardLimitMb} MiB`,
      `- retention: temporary ${result.policy.retentionDays.temporary}d, cache ${result.policy.retentionDays.cache}d, diagnostic ${result.policy.retentionDays.diagnostic}d, task evidence ${result.policy.retentionDays.taskEvidence}d, release evidence ${result.policy.retentionDays.releaseEvidence}d`,
      `- privacy: ${result.privacyWarning}`,
    ]);
  }
};

export const printStorageHelp = (subcommand?: string): void => {
  if (subcommand) {
    const usage: Record<string, string[]> = {
      status: ['skopos storage status [target] [--json]'],
      inspect: ['skopos storage inspect [target] [--limit <1-200>] [--json]'],
      prune: [
        'skopos storage prune [target] [--dry-run] [--json]',
        'skopos storage prune [target] --apply --actor <id> [--json]',
      ],
      pin: ['skopos storage pin <.skopos-path> [target] --actor <id> --reason <text> [--json]'],
      unpin: ['skopos storage unpin <pin-id|.skopos-path> [target] --actor <id> [--json]'],
      policy: ['skopos storage policy show [target] [--json]'],
    };
    writeLines([`Skopos storage ${subcommand}`, '', ...(usage[subcommand] ?? [])]);
    return;
  }

  writeLines([
    'Skopos storage lifecycle',
    '',
    '  skopos storage status [target]                 Show size, classes, limits, and cleanup eligibility',
    '  skopos storage inspect [target] [--limit <n>]  Show the largest managed units',
    '  skopos storage prune [target] [--dry-run]      Preview safe cleanup (default)',
    '  skopos storage prune [target] --apply          Delete only eligible, unprotected units',
    '  skopos storage pin <path> [target]             Protect storage from cleanup',
    '  skopos storage unpin <id|path> [target]        Remove explicit protection',
    '  skopos storage policy show [target]            Show configured limits and retention',
  ]);
};

const parseStorageArgs = (
  args: string[],
  { targetPosition = 0 }: { targetPosition?: number } = {},
): ParsedStorageArgs => {
  let cwd = process.cwd();
  let json = false;
  let apply = false;
  let limit = 20;
  let actor: string | undefined;
  let reason: string | undefined;
  const positional: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--json') json = true;
    else if (argument === '--apply') apply = true;
    else if (argument === '--dry-run') apply = false;
    else if (argument === '--limit') limit = Number(requireOptionValue(args, ++index, '--limit'));
    else if (argument === '--actor') actor = requireOptionValue(args, ++index, '--actor');
    else if (argument === '--reason') reason = requireOptionValue(args, ++index, '--reason');
    else if (argument.startsWith('-')) throw new Error(`Unknown storage option: ${argument}`);
    else positional.push(argument);
  }

  if (positional.length > targetPosition) {
    cwd = resolve(positional.splice(targetPosition, 1)[0]);
  }

  if (apply && !actor) throw new Error('Storage prune --apply requires --actor <id>.');
  return { cwd, json, apply, limit, actor, reason, positional };
};

const requireOptionValue = (args: string[], index: number, option: string): string => {
  const value = args[index];
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${option}.`);
  return value;
};

const rejectUnexpectedPositionals = (
  parsed: ParsedStorageArgs,
  expected: number,
  command: string,
): void => {
  if (parsed.positional.length > expected) {
    throw new Error(`Too many positional arguments for skopos ${command}.`);
  }
};

const writeStorageStatus = (result: {
  workspaceRoot: string;
  totalBytes: number;
  limitState: string;
  protectedUnitCount: number;
  eligibleUnitCount: number;
  privacyWarning: string;
  classSummaries: SkoposStorageClassSummary[];
}): void => {
  writeLines([
    'Skopos storage status',
    `- workspace: ${result.workspaceRoot}`,
    `- managed size: ${formatBytes(result.totalBytes)} (${result.limitState})`,
    `- protected: ${result.protectedUnitCount} units`,
    `- cleanup eligible: ${result.eligibleUnitCount} units`,
    '- classes:',
    ...result.classSummaries.map(
      (summary) =>
        `  - ${summary.storageClass}: ${summary.unitCount} units, ${formatBytes(summary.bytes)}, ${summary.protectedUnitCount} protected, ${summary.eligibleUnitCount} eligible`,
    ),
    `- privacy: ${result.privacyWarning}`,
  ]);
};

const formatUnit = (unit: SkoposStorageUnit): string =>
  `- ${unit.path}: ${formatBytes(unit.bytes)}, ${unit.storageClass}, ${unit.protected ? 'protected' : unit.eligible ? 'eligible' : 'retained'}`;

const formatBytes = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${round(bytes / (1024 * 1024))} MiB`;
  if (bytes >= 1024) return `${round(bytes / 1024)} KiB`;
  return `${bytes} B`;
};

const round = (value: number): number => Math.round(value * 100) / 100;
