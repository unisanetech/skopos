import { resolve } from 'node:path';

import { buildSkoposContextRuntime, resolveSkoposScopeRuntime } from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedQueryArgs {
  cwd: string;
  query?: string;
  json: boolean;
}

export const runResolveCommand = async (args: string[]): Promise<void> => {
  const parsed = parseQueryArgs(args);
  const result = await resolveSkoposScopeRuntime({
    cwd: parsed.cwd,
    query: parsed.query,
  });

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  writeLines([
    'Skopos resolve',
    `- query: ${result.query}`,
    `- matched by: ${result.matchedBy}`,
    `- id: ${result.scope.id}`,
    `- kind: ${result.scope.kind}`,
    `- path: ${result.scope.path}`,
  ]);
};

export const runContextCommand = async (args: string[]): Promise<void> => {
  const parsed = parseQueryArgs(args);
  const result = await buildSkoposContextRuntime({
    cwd: parsed.cwd,
    scope: parsed.query,
  });

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  writeLines([
    'Skopos context',
    `- scope: ${result.scope.scope.id}`,
    `- kind: ${result.scope.scope.kind}`,
    `- summary: ${result.summary}`,
    '- references:',
    ...result.references.map((reference) => `  - ${reference.kind}: ${reference.path}`),
  ]);
};

const parseQueryArgs = (args: string[]): ParsedQueryArgs => {
  let cwd = process.cwd();
  let query: string | undefined;
  let json = false;

  for (const argument of args) {
    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos flag: ${argument}`);
    }

    if (!query) {
      query = argument;
      continue;
    }

    cwd = resolve(argument);
  }

  return { cwd, query, json };
};
