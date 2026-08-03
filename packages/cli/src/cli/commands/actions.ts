import { resolve } from 'node:path';

import {
  listSkoposActionsRuntime,
  runSkoposActionRuntime,
  showSkoposActionRuntime,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';
import { paginateCollection, parseCollectionLimit } from '../shared/pagination.js';

interface ParsedTargetArgs {
  cwd: string;
  json: boolean;
  full: boolean;
  cursor?: string;
  limit?: number;
}

interface ParsedActionArgs {
  cwd: string;
  action?: string;
  dryRun: boolean;
  approve: boolean;
  force: boolean;
  actor?: string;
  taskId?: string;
  json: boolean;
  full: boolean;
}

export const runActionsCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (subcommand === 'list') {
    const parsed = parseTargetArgs(rest);
    const result = await listSkoposActionsRuntime({
      cwd: parsed.cwd,
    });
    const page = buildPagedActionCatalogOutput(
      parsed.cwd,
      result,
      parsed.cursor,
      parsed.limit,
    );

    if (parsed.json) {
      writeJsonOutput(page);
      return;
    }

    writeLines([
      'Skopos Actions',
      ...page.actions.map(
        (action) => `- ${action.actionId} [${action.category}/${action.safety}]`,
      ),
      page.page.nextCursor
        ? `Next cursor: ${page.page.nextCursor}`
        : 'End of Action catalog.',
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
      taskId: parsed.taskId,
    });
    const run = result.run;

    if (parsed.json) {
      const fullOutput = {
        actionId: run.actionId,
        actionTitle: run.actionTitle,
        actionCategory: run.actionCategory,
        actionSafety: run.actionSafety,
        runId: run.id,
        status: run.runStatus,
        actorId: run.runByActorId,
        sourcePath: run.sourcePath,
        command: run.command,
        outputPaths: run.outputPaths,
        evidence: run.evidence,
        reusedFromRunId: run.reusedFromRunId,
        taskEvidenceLink: result.taskEvidenceLink,
        taskEvidenceLinkPath: result.taskEvidenceLinkPath,
      };
      writeJsonOutput(
        parsed.full
          ? fullOutput
          : {
              actionId: run.actionId,
              actionTitle: run.actionTitle,
              actionCategory: run.actionCategory,
              actionSafety: run.actionSafety,
              runId: run.id,
              status: run.runStatus,
              actorId: run.runByActorId,
              reusedFromRunId: run.reusedFromRunId,
              outputPaths: run.outputPaths,
              evidence: run.evidence
                ? {
                    executionKey: run.evidence.executionKey,
                    sourceDigest: run.evidence.sourceState.digest,
                    sourcePathCount: run.evidence.sourceState.paths.length,
                    capturedAt: run.evidence.freshness.capturedAt,
                  }
                : undefined,
              taskEvidenceLink: result.taskEvidenceLink
                ? {
                    taskId: result.taskEvidenceLink.taskId,
                    actionId: result.taskEvidenceLink.actionId,
                    runId: result.taskEvidenceLink.runId,
                  }
                : undefined,
            },
      );
      return;
    }

    const lines = [
      'Skopos Action run',
      `- Action: ${run.actionId}`,
      `- status: ${run.runStatus}`,
      `- category: ${run.actionCategory}`,
      `- safety: ${run.actionSafety}`,
      `- actor: ${run.runByActorId ?? '(none)'}`,
    ];

    if (run.evidence) {
      lines.push(`- Evidence: ${run.reusedFromRunId ? 'reused' : 'recorded'}`);
      lines.push(`  execution key: ${run.evidence.executionKey}`);
      lines.push(`  source digest: ${run.evidence.sourceState.digest}`);
    }

    if (result.taskEvidenceLink) {
      lines.push(`- Task Evidence: linked to ${result.taskEvidenceLink.taskId}`);
    }

    if (run.outputPaths.length > 0) {
      lines.push('- outputs:');
      for (const outputPath of run.outputPaths) {
        lines.push(`  - ${outputPath}`);
      }
    }

    writeLines(lines);
    return;
  }

  throw new Error(`Unknown Skopos actions subcommand: ${subcommand ?? '(missing)'}`);
};

export const buildPagedActionCatalogOutput = (
  workspaceRoot: string,
  actions: Parameters<typeof toPublicAction>[0][],
  cursor?: string,
  limit?: number,
) => {
  const page = paginateCollection(actions.map(toActionCatalogEntry), {
    collection: 'actions.catalog',
    cursor,
    limit,
  });
  return {
    schemaVersion: 1,
    type: 'action-catalog-page',
    workspaceRoot,
    totalActionCount: actions.length,
    actions: page.items,
    page: page.page,
  };
};

const toActionCatalogEntry = (action: Parameters<typeof toPublicAction>[0]) => ({
  actionId: action.id,
  title: action.title,
  category: action.category,
  safety: action.safety,
  capabilities: action.capabilities,
  effects: action.effects,
  concurrency: action.concurrency,
  approval: action.requiresApproval ? 'explicit' : 'none',
  sourcePath: action.sourcePath,
});

const toPublicAction = (action: {
  id: string;
  title: string;
  description: string;
  category: string;
  scope: string[];
  command: string;
  cwd: string;
  inputs: string[];
  sourceExcludes?: string[];
  outputs: string[];
  affects: string[];
  capabilities: {
    process: 'required';
    network: 'none' | 'required';
    browser: 'none' | 'required';
    tools: string[];
    secrets: string[];
    services: string[];
  };
  effects: {
    workspace: 'none' | 'declared';
    artifacts: 'none' | 'isolated';
    external: 'none' | 'declared';
  };
  concurrency: 'shared' | 'exclusive';
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
  sourceExcludes: action.sourceExcludes ?? [],
  outputs: action.outputs,
  affects: action.affects,
  capabilities: action.capabilities,
  effects: action.effects,
  concurrency: action.concurrency,
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
  let full = false;
  let cursor: string | undefined;
  let limit: number | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') {
      json = true;
      continue;
    }
    if (argument === '--full') {
      full = true;
      continue;
    }
    if (argument === '--cursor') {
      const value = args[++index];
      if (!value || value.startsWith('-')) throw new Error('Missing value for --cursor.');
      cursor = value;
      continue;
    }
    if (argument.startsWith('--cursor=')) {
      cursor = argument.slice('--cursor='.length);
      continue;
    }
    if (argument === '--limit') {
      const value = args[++index];
      if (!value || value.startsWith('-')) throw new Error('Missing value for --limit.');
      limit = parseCollectionLimit(value);
      continue;
    }
    if (argument.startsWith('--limit=')) {
      limit = parseCollectionLimit(argument.slice('--limit='.length));
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos flag: ${argument}`);
    }

    cwd = resolve(argument);
  }

  return { cwd, json, full, cursor, limit };
};

const parseActionArgs = (args: string[]): ParsedActionArgs => {
  let cwd = process.cwd();
  let action: string | undefined;
  let dryRun = false;
  let approve = false;
  let force = false;
  let actor: string | undefined;
  let taskId: string | undefined;
  let json = false;
  let full = false;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--json') {
      json = true;
      continue;
    }
    if (argument === '--full') {
      full = true;
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

    if (argument === '--task') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --task.');
      }
      taskId = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--task=')) {
      taskId = argument.slice('--task='.length);
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

  return { cwd, action, dryRun, approve, force, actor, taskId, json, full };
};
