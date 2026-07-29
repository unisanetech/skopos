import { resolve } from 'node:path';

import { buildSkoposImpactRuntime } from '@skopos/runtime';

import { writeJsonOutput, writeOptionalLines } from '../shared/output.js';

export const runImpactCommand = async (args: string[]): Promise<void> => {
  const parsed = parseImpactArgs(args);
  const result = await buildSkoposImpactRuntime({
    cwd: parsed.cwd,
    changedPaths: parsed.changedPaths,
    actor: parsed.actor,
  });
  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }
  writeOptionalLines([
    'Skopos impact',
    `- workspace: ${result.workspaceRoot}`,
    `- actor: ${result.actorId ?? '(none)'}`,
    `- summary: ${result.summary}`,
    result.graphPath
      ? `- graph: ${result.graphPath} (${result.graphWrite ?? 'written'})`
      : undefined,
    '- changed:',
    ...result.changed.map((entry) => `  - ${entry.path} [${entry.category}]`),
    ...(result.matchedGuards.length > 0
      ? ['- matched Guards:', ...result.matchedGuards.map((guard) => `  - ${guard.id}: ${guard.reason}`)]
      : []),
    ...(result.requiredActions.length > 0
      ? ['- required Actions:', ...result.requiredActions.map((action) => `  - ${action.id}: ${action.reason}`)]
      : []),
  ]);
};

const parseImpactArgs = (
  args: string[],
): { cwd: string; changedPaths: string[]; actor?: string; json: boolean } => {
  let cwd = process.cwd();
  const changedPaths: string[] = [];
  let actor: string | undefined;
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') json = true;
    else if (argument === '--actor') actor = requireValue(args, ++index, '--actor');
    else if (argument.startsWith('--actor=')) actor = argument.slice('--actor='.length);
    else if (argument === '--cwd') cwd = resolve(requireValue(args, ++index, '--cwd'));
    else if (argument.startsWith('--cwd=')) cwd = resolve(argument.slice('--cwd='.length));
    else if (argument.startsWith('-')) throw new Error(`Unknown Skopos impact flag: ${argument}`);
    else changedPaths.push(argument);
  }
  return { cwd, changedPaths, actor, json };
};

const requireValue = (args: string[], index: number, flag: string): string => {
  const value = args[index];
  if (!value || value.startsWith('-')) throw new Error(`Missing value for ${flag}.`);
  return value;
};
