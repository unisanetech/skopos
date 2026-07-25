import { resolve } from 'node:path';

import {
  listSkoposWorkflowsRuntime,
  runSkoposWorkflowRuntime,
  showSkoposWorkflowRuntime,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedTargetArgs {
  cwd: string;
  json: boolean;
}

interface ParsedWorkflowArgs {
  cwd: string;
  workflow?: string;
  dryRun: boolean;
  approve: boolean;
  force: boolean;
  actor?: string;
  json: boolean;
}

export const runWorkflowsCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (subcommand === 'list') {
    const parsed = parseTargetArgs(rest);
    const result = await listSkoposWorkflowsRuntime({
      cwd: parsed.cwd,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos workflows',
      ...result.map((workflow) => `- ${workflow.id} [${workflow.category}/${workflow.safety}]`),
    ]);
    return;
  }

  if (subcommand === 'show') {
    const parsed = parseWorkflowArgs(rest);
    if (!parsed.workflow) {
      throw new Error('Missing workflow id or manifest path.');
    }

    const result = await showSkoposWorkflowRuntime({
      cwd: parsed.cwd,
      workflow: parsed.workflow,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos workflow',
      `- id: ${result.id}`,
      `- category: ${result.category}`,
      `- safety: ${result.safety}`,
      `- command: ${result.command}`,
      `- source: ${result.sourcePath}`,
    ]);
    return;
  }

  if (subcommand === 'run') {
    const parsed = parseWorkflowArgs(rest);
    if (!parsed.workflow) {
      throw new Error('Missing workflow id or manifest path.');
    }

    const result = await runSkoposWorkflowRuntime({
      cwd: parsed.cwd,
      workflow: parsed.workflow,
      dryRun: parsed.dryRun,
      approve: parsed.approve,
      actor: parsed.actor,
      force: parsed.force,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    const lines = [
      'Skopos workflow run',
      `- workflow: ${result.workflowId}`,
      `- status: ${result.runStatus}`,
      `- category: ${result.workflowCategory}`,
      `- safety: ${result.workflowSafety}`,
      `- actor: ${result.runByActorId ?? '(none)'}`,
    ];

    if (result.receipt) {
      lines.push(`- receipt: ${result.reusedFromRunId ? 'reused' : 'recorded'}`);
      lines.push(`  execution key: ${result.receipt.executionKey}`);
      lines.push(`  source digest: ${result.receipt.sourceState.digest}`);
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

  throw new Error(`Unknown Skopos workflows subcommand: ${subcommand ?? '(missing)'}`);
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

const parseWorkflowArgs = (args: string[]): ParsedWorkflowArgs => {
  let cwd = process.cwd();
  let workflow: string | undefined;
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
      throw new Error(`Unknown Skopos workflows flag: ${argument}`);
    }

    if (!workflow) {
      workflow = argument;
      continue;
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra workflows target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  return { cwd, workflow, dryRun, approve, force, actor, json };
};
