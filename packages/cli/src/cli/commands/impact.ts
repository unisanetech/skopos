import { resolve } from 'node:path';

import { buildSkoposImpactRuntime } from '@skopos/runtime';
import type { SkoposActionPhase, SkoposTaskRisk } from '@skopos/model';

import { writeJsonOutput, writeOptionalLines } from '../shared/output.js';
import { paginateCollection, parseCollectionLimit } from '../shared/pagination.js';

type ImpactCollection =
  | 'changed'
  | 'matched-guards'
  | 'required-actions'
  | 'guard-decisions'
  | 'action-decisions';

export const runImpactCommand = async (args: string[]): Promise<void> => {
  const parsed = parseImpactArgs(args);
  const result = await buildSkoposImpactRuntime({
    cwd: parsed.cwd,
    changedPaths: parsed.changedPaths,
    actor: parsed.actor,
    phase: parsed.phase,
    risk: parsed.risk,
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
    `- selection decisions: ${result.selectionExplanation.guards.filter((entry) => entry.status === 'selected').length} Guards selected, ${result.selectionExplanation.guards.filter((entry) => entry.status === 'skipped').length} skipped; ${result.selectionExplanation.actions.filter((entry) => entry.status === 'selected').length} Actions selected, ${result.selectionExplanation.actions.filter((entry) => entry.status === 'skipped').length} skipped`,
    ...(parsed.why
      ? [
          '- Guard decisions:',
          ...result.selectionExplanation.guards.map(
            (entry) => `  - ${entry.status === 'selected' ? 'selected' : 'skipped'} ${entry.id}: ${entry.reason}`,
          ),
          '- Action decisions:',
          ...result.selectionExplanation.actions.map(
            (entry) => `  - ${entry.status === 'selected' ? 'selected' : 'skipped'} ${entry.id}: ${entry.reason}`,
          ),
        ]
      : ['- use --why to show every selection and skip reason']),
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
        : collection === 'required-actions'
          ? result.requiredActions
          : collection === 'guard-decisions'
            ? result.selectionExplanation.guards
            : result.selectionExplanation.actions;
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
      guardDecisions: result.selectionExplanation.guards.length,
      actionDecisions: result.selectionExplanation.actions.length,
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
  phase?: SkoposActionPhase;
  risk?: SkoposTaskRisk;
  why: boolean;
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
  let why = false;
  let phase: SkoposActionPhase | undefined;
  let risk: SkoposTaskRisk | undefined;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') json = true;
    else if (argument === '--why') why = true;
    else if (argument === '--phase') phase = parseImpactPhase(requireValue(args, ++index, '--phase'));
    else if (argument.startsWith('--phase=')) phase = parseImpactPhase(argument.slice('--phase='.length));
    else if (argument === '--risk') risk = parseImpactRisk(requireValue(args, ++index, '--risk'));
    else if (argument.startsWith('--risk=')) risk = parseImpactRisk(argument.slice('--risk='.length));
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
  return { cwd, changedPaths, actor, phase, risk, why, collection, cursor, limit, json };
};

const parseImpactCollection = (value: string): ImpactCollection => {
  if (
    value === 'changed' ||
    value === 'matched-guards' ||
    value === 'required-actions' ||
    value === 'guard-decisions' ||
    value === 'action-decisions'
  ) {
    return value;
  }
  throw new Error(`Unknown Impact collection: ${value}.`);
};

const parseImpactPhase = (value: string): SkoposActionPhase => {
  if (value === 'admission' || value === 'iteration' || value === 'stabilization' || value === 'closure') {
    return value;
  }
  throw new Error('--phase requires admission, iteration, stabilization, or closure.');
};

const parseImpactRisk = (value: string): SkoposTaskRisk => {
  if (value === 'light' || value === 'standard' || value === 'high-impact') return value;
  throw new Error('--risk requires light, standard, or high-impact.');
};

const requireValue = (args: string[], index: number, flag: string): string => {
  const value = args[index];
  if (!value || value.startsWith('-')) throw new Error(`Missing value for ${flag}.`);
  return value;
};
