import { resolve } from 'node:path';

import {
  applySkoposTaskDispositionRuntime,
  claimSkoposTaskRuntime,
  completeSkoposTaskStepRuntime,
  moveSkoposTaskToVerificationRuntime,
  releaseSkoposTaskRuntime,
  resolveSkoposTaskMemoryObligationRuntime,
  showSkoposTaskRuntime,
} from '@skopos/runtime';
import type { SkoposTaskDispositionKind } from '@skopos/model';

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
            : parsed.subcommand === 'disposition'
              ? await applySkoposTaskDispositionRuntime({
                  ...common,
                  disposition: parsed.disposition!,
                  reason: parsed.reason!,
                  successorTaskId: parsed.successorTaskId,
                })
            : parsed.subcommand === 'step' && parsed.action === 'complete'
              ? await completeSkoposTaskStepRuntime({
                  ...common,
                  stepId: parsed.stepId!,
                })
              : parsed.subcommand === 'memory' && parsed.action === 'resolve'
                ? await resolveSkoposTaskMemoryObligationRuntime({
                    ...common,
                    obligationId: parsed.obligationId!,
                    resolution: parsed.resolution!,
                    reason: parsed.reason!,
                    targetPath: parsed.targetPath,
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
    `Memory obligations: ${task.memoryObligations.filter((entry) => entry.status === 'open').length}/${task.memoryObligations.length} open`,
  ]);
};

interface ParsedTaskArgs {
  subcommand?: string;
  action?: string;
  taskId: string;
  stepId?: string;
  obligationId?: string;
  disposition?: SkoposTaskDispositionKind;
  resolution?: 'memory-updated' | 'reviewed-no-change';
  reason?: string;
  targetPath?: string;
  successorTaskId?: string;
  cwd: string;
  actor?: string;
  compact: boolean;
  json: boolean;
}

const parseTaskArgs = (args: string[]): ParsedTaskArgs => {
  const positionals: string[] = [];
  let cwd = process.cwd();
  let actor: string | undefined;
  let compact = true;
  let json = false;
  let resolution: ParsedTaskArgs['resolution'];
  let reason: string | undefined;
  let targetPath: string | undefined;
  let successorTaskId: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') {
      json = true;
    } else if (argument === '--compact') {
      compact = true;
    } else if (argument === '--full') {
      compact = false;
    } else if (argument === '--actor') {
      actor = requireFlagValue(args, ++index, '--actor');
    } else if (argument.startsWith('--actor=')) {
      actor = argument.slice('--actor='.length);
    } else if (argument === '--resolution') {
      resolution = parseMemoryResolution(requireFlagValue(args, ++index, '--resolution'));
    } else if (argument.startsWith('--resolution=')) {
      resolution = parseMemoryResolution(argument.slice('--resolution='.length));
    } else if (argument === '--reason') {
      reason = requireFlagValue(args, ++index, '--reason');
    } else if (argument.startsWith('--reason=')) {
      reason = argument.slice('--reason='.length);
    } else if (argument === '--target') {
      targetPath = requireFlagValue(args, ++index, '--target');
    } else if (argument.startsWith('--target=')) {
      targetPath = argument.slice('--target='.length);
    } else if (argument === '--successor') {
      successorTaskId = requireFlagValue(args, ++index, '--successor');
    } else if (argument.startsWith('--successor=')) {
      successorTaskId = argument.slice('--successor='.length);
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
  if (subcommand === 'memory') {
    if (first !== 'resolve' || !second || !third || !resolution || !reason) {
      throw new Error(
        'Usage: skopos task memory resolve <task-id> <obligation-id> --resolution memory-updated|reviewed-no-change --reason <text> [--target <path>].',
      );
    }
    return {
      subcommand,
      action: first,
      taskId: second,
      obligationId: third,
      resolution,
      reason,
      targetPath,
      cwd,
      actor,
      compact,
      json,
    };
  }
  if (subcommand === 'disposition') {
    if (!first || !second || !reason) {
      throw new Error(
        'Usage: skopos task disposition <task-id> <resume|ready|defer|return-from-verification|cancel|supersede> --reason <text> [--successor <task-id>].',
      );
    }
    const dispositions = [
      'resume',
      'ready',
      'defer',
      'return-from-verification',
      'cancel',
      'supersede',
    ] as const;
    if (!dispositions.includes(second as typeof dispositions[number])) {
      throw new Error(`Unknown Task disposition: ${second}.`);
    }
    return {
      subcommand,
      taskId: first,
      disposition: second as typeof dispositions[number],
      reason,
      successorTaskId,
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
    memory: {
      open: task.memoryObligations.filter(
        (obligation) => obligation.status === 'open',
      ).length,
      total: task.memoryObligations.length,
      openObligations: task.memoryObligations
        .filter((obligation) => obligation.status === 'open')
        .slice(0, 6)
        .map((obligation) => ({
          id: obligation.id,
          role: obligation.role,
          targetPath: obligation.targetPath,
          reason: obligation.reason,
        })),
    },
  };
};

const parseMemoryResolution = (
  value: string,
): ParsedTaskArgs['resolution'] => {
  if (value === 'memory-updated' || value === 'reviewed-no-change') {
    return value;
  }
  throw new Error(
    'Memory resolution must be memory-updated or reviewed-no-change.',
  );
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
