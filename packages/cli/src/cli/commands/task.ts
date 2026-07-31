import { resolve } from 'node:path';

import {
  claimSkoposTaskRuntime,
  completeSkoposTaskStepRuntime,
  moveSkoposTaskToVerificationRuntime,
  releaseSkoposTaskRuntime,
  showSkoposTaskRuntime,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

export const runTaskCommand = async (args: string[]): Promise<void> => {
  const parsed = parseTaskArgs(args);
  const common = {
    cwd: parsed.cwd,
    taskId: parsed.taskId,
    actor: parsed.actor,
  };
  const task =
    parsed.subcommand === 'show'
      ? await showSkoposTaskRuntime(common)
      : parsed.subcommand === 'claim'
        ? await claimSkoposTaskRuntime(common)
        : parsed.subcommand === 'release'
          ? await releaseSkoposTaskRuntime(common)
          : parsed.subcommand === 'verify'
            ? await moveSkoposTaskToVerificationRuntime(common)
            : parsed.subcommand === 'step' && parsed.action === 'complete'
              ? await completeSkoposTaskStepRuntime({
                  ...common,
                  stepId: parsed.stepId!,
                })
              : failUnknownTaskCommand(parsed);

  if (parsed.json) {
    writeJsonOutput(parsed.compact ? buildCompactTaskOutput(task) : task);
    return;
  }

  writeLines([
    'Skopos Task',
    `Task: ${task.id}`,
    `State: ${task.state}`,
    `Goal: ${task.goal}`,
    `Scope: ${task.scope.scope.id}`,
    `Risk/detail: ${task.risk} / ${task.detail}`,
    `Claimed by: ${task.coordination.claimedBy?.actorId ?? '(none)'}`,
    `Steps: ${task.steps.filter((step) => step.status === 'complete').length}/${task.steps.length} complete`,
  ]);
};

interface ParsedTaskArgs {
  subcommand?: string;
  action?: string;
  taskId: string;
  stepId?: string;
  cwd: string;
  actor?: string;
  compact: boolean;
  json: boolean;
}

const parseTaskArgs = (args: string[]): ParsedTaskArgs => {
  const positionals: string[] = [];
  let cwd = process.cwd();
  let actor: string | undefined;
  let compact = false;
  let json = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') {
      json = true;
    } else if (argument === '--compact') {
      compact = true;
    } else if (argument === '--actor') {
      actor = requireFlagValue(args, ++index, '--actor');
    } else if (argument.startsWith('--actor=')) {
      actor = argument.slice('--actor='.length);
    } else if (argument === '--cwd') {
      cwd = resolve(requireFlagValue(args, ++index, '--cwd'));
    } else if (argument.startsWith('--cwd=')) {
      cwd = resolve(argument.slice('--cwd='.length));
    } else if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos task flag: ${argument}`);
    } else {
      positionals.push(argument);
    }
  }

  const [subcommand, first, second, third] = positionals;
  if (!subcommand) {
    throw new Error('Missing Skopos task subcommand.');
  }
  if (subcommand === 'step') {
    if (first !== 'complete' || !second || !third) {
      throw new Error('Usage: skopos task step complete <task-id> <step-id>.');
    }
    return {
      subcommand,
      action: first,
      taskId: second,
      stepId: third,
      cwd,
      actor,
      compact,
      json,
    };
  }
  if (!first) {
    throw new Error(`Usage: skopos task ${subcommand} <task-id>.`);
  }
  if (second) {
    cwd = resolve(second);
  }
  return { subcommand, taskId: first, cwd, actor, compact, json };
};

export const buildCompactTaskOutput = (
  task: Awaited<ReturnType<typeof showSkoposTaskRuntime>>,
) => {
  const nextStep = task.steps.find(
    (step) => step.status !== 'complete' && step.status !== 'skipped',
  );
  const ownedPaths = task.changeScope.declaredOwnedPaths.slice(0, 12);
  return {
    schemaVersion: 1,
    id: task.id,
    type: 'task-summary',
    status: task.status,
    workspaceRoot: task.workspaceRoot,
    state: task.state,
    title: task.title,
    goal: task.goal,
    risk: task.risk,
    scopeId: task.scope.scope.id,
    trackedDocumentPath: task.trackedDocumentPath,
    progress: {
      completed: task.steps.filter((step) => step.status === 'complete').length,
      total: task.steps.length,
      nextStep: nextStep
        ? {
            id: nextStep.id,
            kind: nextStep.kind,
            title: nextStep.title,
          }
        : undefined,
    },
    ownedPaths,
    additionalOwnedPathCount:
      task.changeScope.declaredOwnedPaths.length - ownedPaths.length,
    selectedActionIds: task.selectedActions.map((action) => action.id),
    selectedGuardIds: task.selectedGuardIds,
    openQuestionCount: task.questions.filter((question) => question.status === 'open').length,
    openRecommendationCount: task.recommendations.filter(
      (recommendation) => recommendation.status === 'open',
    ).length,
  };
};

const requireFlagValue = (args: string[], index: number, flag: string): string => {
  const value = args[index];
  if (!value || value.startsWith('-')) {
    throw new Error(`Missing value for ${flag}.`);
  }
  return value;
};

const failUnknownTaskCommand = (parsed: ParsedTaskArgs): never => {
  throw new Error(
    `Unknown Skopos task command: ${[parsed.subcommand, parsed.action].filter(Boolean).join(' ')}`,
  );
};
