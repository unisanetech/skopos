import { resolve } from 'node:path';

import { buildSkoposDoneRuntime, buildSkoposImpactRuntime } from '@skopos/runtime';

import { buildCompactDoneLines, buildCompactDoneOutput } from '../shared/compact-output.js';
import {
  buildSummaryLines,
  parseFieldList,
  projectJsonOutput,
  writeJsonOutput,
  writeOptionalLines,
  writeLines,
} from '../shared/output.js';

interface ParsedChangedPathArgs {
  cwd: string;
  changedPaths: string[];
  mission?: string;
  actor?: string;
  compact: boolean;
  summary: boolean;
  fields: string[];
  json: boolean;
}

export const runImpactCommand = async (args: string[]): Promise<void> => {
  const parsed = parseChangedPathArgs(args, 'impact');
  const result = await buildSkoposImpactRuntime({
    cwd: parsed.cwd,
    changedPaths: parsed.changedPaths,
    actor: parsed.actor,
  });

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  const lines = [
    'Skopos impact',
    `- workspace: ${result.workspaceRoot}`,
    `- actor: ${result.actorId ?? '(none)'}`,
    `- summary: ${result.summary}`,
    result.graphPath
      ? `- graph: ${result.graphPath} (${result.graphWrite ?? 'written'})`
      : undefined,
    '- changed:',
    ...result.changed.map((entry) => `  - ${entry.path} [${entry.category}]`),
  ];

  if (result.requiredActions.length > 0) {
    lines.push('- required actions:');
    for (const action of result.requiredActions) {
      lines.push(`  - ${action}`);
    }
  }

  if (result.requiredWorkflows.length > 0) {
    lines.push('- required workflows:');
    for (const workflow of result.requiredWorkflows) {
      lines.push(`  - ${workflow.id}: ${workflow.reason}`);
    }
  }

  writeOptionalLines(lines);
};

export const runDoneCommand = async (args: string[]): Promise<void> => {
  const parsed = parseChangedPathArgs(args, 'done');
  const result = await buildSkoposDoneRuntime({
    cwd: parsed.cwd,
    changedPaths: parsed.changedPaths,
    mission: parsed.mission,
    actor: parsed.actor,
  });
  const output = parsed.compact ? buildCompactDoneOutput(result) : result;

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
    writeLines(buildCompactDoneLines(result));
    return;
  }

  const lines = [
    'Skopos done',
    `- workspace: ${result.workspaceRoot}`,
    `- closure: ${result.closureStatus}`,
    `- summary: ${result.summary}`,
    result.impact.graphPath
      ? `- impact graph: ${result.impact.graphPath} (${result.impact.graphWrite ?? 'written'})`
      : undefined,
    '- checks:',
    ...result.checks.map((check) => `  - [${check.status}] ${check.id}: ${check.summary}`),
  ];

  if (result.requiredActions.length > 0) {
    lines.push('- required actions:');
    for (const action of result.requiredActions) {
      lines.push(`  - ${action}`);
    }
  }

  if (result.missionEvidence) {
    lines.push(
      `- mission: ${result.missionEvidence.mission.id} [${result.missionEvidence.mission.state}]`,
    );
    if (result.missionEvidence.claimedByActorId) {
      lines.push(`- mission owner: ${result.missionEvidence.claimedByActorId}`);
    }
  }

  if (result.workflowEvidence.length > 0) {
    lines.push('- workflow evidence:');
    for (const entry of result.workflowEvidence) {
      lines.push(
        `  - [${entry.status}] ${entry.id}: ${entry.summary}${entry.latestSuccessfulRunByActorId ? ` (actor: ${entry.latestSuccessfulRunByActorId})` : ''}`,
      );
    }
  }

  writeOptionalLines(lines);
};

const parseChangedPathArgs = (
  args: string[],
  commandName: 'impact' | 'done',
): ParsedChangedPathArgs => {
  let cwd = process.cwd();
  const changedPaths: string[] = [];
  let mission: string | undefined;
  let actor: string | undefined;
  let compact = false;
  let summary = false;
  let fields: string[] = [];
  let json = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--compact' && commandName === 'done') {
      compact = true;
      continue;
    }

    if (argument === '--summary' && commandName === 'done') {
      summary = true;
      continue;
    }

    if (argument === '--fields' && commandName === 'done') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --fields.');
      }
      fields = parseFieldList(nextValue);
      index += 1;
      continue;
    }

    if (argument.startsWith('--fields=') && commandName === 'done') {
      fields = parseFieldList(argument.slice('--fields='.length));
      continue;
    }

    if (argument === '--mission' && commandName === 'done') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --mission.');
      }
      mission = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--mission=') && commandName === 'done') {
      mission = argument.slice('--mission='.length);
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

    if (argument === '--cwd') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --cwd.');
      }
      cwd = resolve(nextValue);
      index += 1;
      continue;
    }

    if (argument.startsWith('--cwd=')) {
      cwd = resolve(argument.slice('--cwd='.length));
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos ${commandName} flag: ${argument}`);
    }

    changedPaths.push(argument);
  }

  if (summary && fields.length > 0) {
    throw new Error('Use either --summary or --fields, not both.');
  }

  if (fields.length > 0 && !json) {
    throw new Error('Field selection requires --json.');
  }

  return { cwd, changedPaths, mission, actor, compact, summary, fields, json };
};
