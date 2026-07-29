import { resolve } from 'node:path';

import {
  listSkoposActionsRuntime,
  runSkoposActionRuntime,
  showSkoposActionRuntime,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedTargetArgs {
  cwd: string;
  json: boolean;
}

interface ParsedActionArgs {
  cwd: string;
  action?: string;
  dryRun: boolean;
  approve: boolean;
  force: boolean;
  actor?: string;
  json: boolean;
}

export const runActionsCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (subcommand === 'list') {
    const parsed = parseTargetArgs(rest);
    const result = await listSkoposActionsRuntime({
      cwd: parsed.cwd,
    });

    if (parsed.json) {
      writeJsonOutput(result.map(toPublicAction));
      return;
    }

    writeLines([
      'Skopos Actions',
      ...result.map((action) => `- ${action.id} [${action.category}/${action.safety}]`),
    ]);
    return;
  }

  if (subcommand === 'show') {
    const parsed = parseActionArgs(rest);
    if (!parsed.action) {
      throw new Error('Missing Action id or declaration path.');
    }

    const result = await showSkoposActionRuntime({
      cwd: parsed.cwd,
      action: parsed.action,
    });

    if (parsed.json) {
      writeJsonOutput(toPublicAction(result));
      return;
    }

    writeLines([
      'Skopos Action',
      `- id: ${result.id}`,
      `- category: ${result.category}`,
      `- safety: ${result.safety}`,
      `- command: ${result.command}`,
      `- source: ${result.sourcePath}`,
    ]);
    return;
  }

  if (subcommand === 'run') {
    const parsed = parseActionArgs(rest);
    if (!parsed.action) {
      throw new Error('Missing Action id or declaration path.');
    }

    const result = await runSkoposActionRuntime({
      cwd: parsed.cwd,
      action: parsed.action,
      dryRun: parsed.dryRun,
      approve: parsed.approve,
      actor: parsed.actor,
      force: parsed.force,
    });

    if (parsed.json) {
      writeJsonOutput({
        actionId: result.actionId,
        actionTitle: result.actionTitle,
        actionCategory: result.actionCategory,
        actionSafety: result.actionSafety,
        runId: result.id,
        status: result.runStatus,
        actorId: result.runByActorId,
        sourcePath: result.sourcePath,
        command: result.command,
        outputPaths: result.outputPaths,
        evidence: result.evidence,
        reusedFromRunId: result.reusedFromRunId,
      });
      return;
    }

    const lines = [
      'Skopos Action run',
      `- Action: ${result.actionId}`,
      `- status: ${result.runStatus}`,
      `- category: ${result.actionCategory}`,
      `- safety: ${result.actionSafety}`,
      `- actor: ${result.runByActorId ?? '(none)'}`,
    ];

    if (result.evidence) {
      lines.push(`- Evidence: ${result.reusedFromRunId ? 'reused' : 'recorded'}`);
      lines.push(`  execution key: ${result.evidence.executionKey}`);
      lines.push(`  source digest: ${result.evidence.sourceState.digest}`);
    }

    if (result.outputPaths.length > 0) {
      lines.push('- outputs:');
      for (const outputPath of result.outputPaths) {
        lines.push(`  - ${outputPath}`);
      }
    }

    writeLines(lines);
    return;
  }

  throw new Error(`Unknown Skopos actions subcommand: ${subcommand ?? '(missing)'}`);
};

const toPublicAction = (action: {
  id: string;
  title: string;
  description: string;
  category: string;
  scope: string[];
  command: string;
  cwd: string;
  inputs: string[];
  outputs: string[];
  affects: string[];
  safety: string;
  requiresApproval: boolean;
  whenToUse?: string;
  phases?: string[];
  risks?: string[];
  recommendedAfter: string[];
  owner: string;
  sourcePath: string;
}) => ({
  actionId: action.id,
  title: action.title,
  description: action.description,
  category: action.category,
  scopes: action.scope,
  execution: {
    command: action.command,
    cwd: action.cwd,
  },
  inputs: action.inputs,
  outputs: action.outputs,
  affects: action.affects,
  safety: action.safety,
  approval: action.requiresApproval ? 'explicit' : 'none',
  whenToUse: action.whenToUse,
  applicability: {
    phases: action.phases ?? ['iteration', 'closure'],
    risks: action.risks ?? ['light', 'standard', 'high-impact'],
  },
  recommendedAfter: action.recommendedAfter,
  owner: action.owner,
  sourcePath: action.sourcePath,
});

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

const parseActionArgs = (args: string[]): ParsedActionArgs => {
  let cwd = process.cwd();
  let action: string | undefined;
  let dryRun = false;
  let approve = false;
  let force = false;
  let actor: string | undefined;
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

    if (argument === '--approve') {
      approve = true;
      continue;
    }

    if (argument === '--force') {
      force = true;
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
      throw new Error(`Unknown Skopos actions flag: ${argument}`);
    }

    if (!action) {
      action = argument;
      continue;
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra actions target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  return { cwd, action, dryRun, approve, force, actor, json };
};
