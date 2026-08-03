import { resolve } from 'node:path';

import { buildSkoposImpactRuntime } from '@skopos/runtime';

import { writeJsonOutput, writeOptionalLines } from '../shared/output.js';
import { paginateCollection, parseCollectionLimit } from '../shared/pagination.js';

type ImpactCollection = 'changed' | 'matched-guards' | 'required-actions';

export const runImpactCommand = async (args: string[]): Promise<void> => {
  const parsed = parseImpactArgs(args);
  const result = await buildSkoposImpactRuntime({
    cwd: parsed.cwd,
    changedPaths: parsed.changedPaths,
    actor: parsed.actor,
  });
  if (parsed.json) {
    writeJsonOutput(
      buildPagedImpactOutput(result, parsed.collection, parsed.cursor, parsed.limit),
    );
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

export const buildPagedImpactOutput = (
  result: Awaited<ReturnType<typeof buildSkoposImpactRuntime>>,
  collection: ImpactCollection = 'changed',
  cursor?: string,
  limit?: number,
) => {
  const source: unknown[] =
    collection === 'changed'
      ? result.changed
      : collection === 'matched-guards'
        ? result.matchedGuards
        : result.requiredActions;
  const page = paginateCollection(source, {
    collection: `impact.${collection}`,
    cursor,
    limit,
  });
  return {
    schemaVersion: 1,
    type: 'impact-page',
    workspaceRoot: result.workspaceRoot,
    actorId: result.actorId,
    summary: result.summary,
    counts: {
      changed: result.changed.length,
      matchedGuards: result.matchedGuards.length,
      requiredActions: result.requiredActions.length,
    },
    collection,
    items: page.items,
    page: page.page,
    graphPath: result.graphPath,
  };
};

const parseImpactArgs = (
  args: string[],
): {
  cwd: string;
  changedPaths: string[];
  actor?: string;
  collection: ImpactCollection;
  cursor?: string;
  limit?: number;
  json: boolean;
} => {
  let cwd = process.cwd();
  const changedPaths: string[] = [];
  let actor: string | undefined;
  let collection: ImpactCollection = 'changed';
  let cursor: string | undefined;
  let limit: number | undefined;
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') json = true;
    else if (argument === '--actor') actor = requireValue(args, ++index, '--actor');
    else if (argument.startsWith('--actor=')) actor = argument.slice('--actor='.length);
    else if (argument === '--collection') collection = parseImpactCollection(requireValue(args, ++index, '--collection'));
    else if (argument.startsWith('--collection=')) collection = parseImpactCollection(argument.slice('--collection='.length));
    else if (argument === '--cursor') cursor = requireValue(args, ++index, '--cursor');
    else if (argument.startsWith('--cursor=')) cursor = argument.slice('--cursor='.length);
    else if (argument === '--limit') limit = parseCollectionLimit(requireValue(args, ++index, '--limit'));
    else if (argument.startsWith('--limit=')) limit = parseCollectionLimit(argument.slice('--limit='.length));
    else if (argument === '--cwd') cwd = resolve(requireValue(args, ++index, '--cwd'));
    else if (argument.startsWith('--cwd=')) cwd = resolve(argument.slice('--cwd='.length));
    else if (argument.startsWith('-')) throw new Error(`Unknown Skopos impact flag: ${argument}`);
    else changedPaths.push(argument);
  }
  return { cwd, changedPaths, actor, collection, cursor, limit, json };
};

const parseImpactCollection = (value: string): ImpactCollection => {
  if (value === 'changed' || value === 'matched-guards' || value === 'required-actions') {
    return value;
  }
  throw new Error(`Unknown Impact collection: ${value}.`);
};

const requireValue = (args: string[], index: number, flag: string): string => {
  const value = args[index];
  if (!value || value.startsWith('-')) throw new Error(`Missing value for ${flag}.`);
  return value;
};
