import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  applySkoposTaskSplitRuntime,
  assignSkoposTaskToSessionRuntime,
  assessSkoposTaskWorkflowRuntime,
  applySkoposTaskDispositionRuntime,
  claimSkoposTaskRuntime,
  completeSkoposTaskStepRuntime,
  disposeSkoposTaskQuestionRuntime,
  expandSkoposTaskOwnershipRuntime,
  moveSkoposTaskToVerificationRuntime,
  proposeSkoposTaskSplitRuntime,
  releaseSkoposTaskRuntime,
  resolveSkoposTaskMemoryObligationRuntime,
  showSkoposTaskRuntime,
  startSkoposLinkedChildTaskRuntime,
} from '@skopos/runtime';
import type {
  SkoposTaskSplitChildDraft,
  SkoposTaskDispositionKind,
  SkoposTaskWorkflowAssessment,
} from '@skopos/model';

import { writeJsonOutput, writeLines } from '../shared/output.js';
import { paginateCollection, parseCollectionLimit } from '../shared/pagination.js';

type TaskDetailCollection =
  | 'owned-paths'
  | 'steps'
  | 'actions'
  | 'guards'
  | 'evidence-requirements'
  | 'questions'
  | 'recommendations'
  | 'memory-obligations'
  | 'children'
  | 'dependencies'
  | 'plans';

export const runTaskCommand = async (args: string[]): Promise<void> => {
  if (args[0] === 'split') {
    await runTaskSplitCommand(args.slice(1));
    return;
  }
  if (args[0] === 'assign') {
    await runTaskAssignCommand(args.slice(1));
    return;
  }
  if (args[0] === 'child' && args[1] === 'start') {
    await runTaskChildStartCommand(args.slice(2));
    return;
  }
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
            : parsed.subcommand === 'ownership' && parsed.action === 'add'
              ? await expandSkoposTaskOwnershipRuntime({
                  ...common,
                  ownedPaths: parsed.ownedPaths!,
                  reason: parsed.reason!,
                })
            : parsed.subcommand === 'question' && parsed.action === 'dispose'
              ? await disposeSkoposTaskQuestionRuntime({
                  ...common,
                  questionId: parsed.questionId!,
                  disposition: parsed.questionDisposition!,
                  reason: parsed.reason!,
                  targetPath: parsed.targetPath,
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
  const workflow = await assessSkoposTaskWorkflowRuntime({
    cwd: parsed.cwd,
    taskId: task.id,
  });

  if (parsed.json) {
    writeJsonOutput(
      parsed.collection
        ? buildPagedTaskDetailOutput(task, parsed.collection, parsed.cursor, parsed.limit)
        : parsed.full
          ? buildTaskDetailIndex(task, workflow)
          : buildCompactTaskOutput(task, workflow),
    );
    return;
  }

  writeLines([
    'Skopos Task',
    `Task: ${task.id}`,
    `State: ${task.state}`,
    `Goal: ${task.goal}`,
    `Scope: ${task.scope.scope.id}`,
    `Risk/detail: ${task.risk} / ${task.detail}`,
    `Workflow: ${workflow.workflow}`,
    `Readiness: ${workflow.readiness}`,
    `Claimed by: ${task.coordination.claimedBy?.actorId ?? '(none)'}`,
    `Steps: ${task.steps.filter((step) => step.status === 'complete').length}/${task.steps.length} complete`,
    `Memory obligations: ${task.memoryObligations.filter((entry) => entry.status === 'open').length}/${task.memoryObligations.length} open`,
    'Next step:',
    workflow.nextCommand,
    `Why: ${workflow.nextReason}`,
    ...(workflow.ownershipSuggestion
      ? [
          `Unowned changed paths: ${workflow.ownershipSuggestion.paths.length}`,
          ...workflow.ownershipSuggestion.paths.map((path) => `- ${path}`),
        ]
      : []),
    ...(parsed.subcommand === 'ownership'
      ? [
          `Added owned paths: ${parsed.ownedPaths!.join(', ')}`,
          `Reason: ${parsed.reason}`,
        ]
      : []),
  ]);
};

const runTaskSplitCommand = async (args: string[]): Promise<void> => {
  const parsed = parseTaskSplitArgs(args);
  if (parsed.operation === 'propose') {
    const source = JSON.parse(await readFile(parsed.fromPath!, 'utf8')) as
      | SkoposTaskSplitChildDraft[]
      | { children: SkoposTaskSplitChildDraft[]; reason?: string };
    const children = Array.isArray(source) ? source : source.children;
    const reason = parsed.reason ?? (Array.isArray(source) ? undefined : source.reason);
    if (!reason) {
      throw new Error('Task split proposal requires --reason <text> or a reason in the proposal file.');
    }
    const result = await proposeSkoposTaskSplitRuntime({
      cwd: parsed.cwd,
      parentTaskId: parsed.parentTaskId,
      children,
      actor: parsed.actor,
      reason,
      dryRun: parsed.dryRun,
    });
    if (parsed.json) return writeJsonOutput(result);
    writeLines([
      'Skopos Task split proposal',
      `Parent: ${result.proposal.parentTaskId}`,
      `Children: ${result.proposal.children.length}`,
      `Proposal: ${result.proposal.proposalDigest}`,
      `Review required: ${result.proposal.reviewRequired ? 'yes' : 'no'}`,
      `Task authorities changed: ${result.proposal.taskAuthoritiesWritten ? 'yes' : 'no'}`,
      'Next step:',
      `skopos task split apply ${result.proposal.parentTaskId} . --proposal ${result.proposal.proposalDigest} --actor ${parsed.actor ?? '<id>'} --reason <approval-reason>`,
    ]);
    return;
  }
  const result = await applySkoposTaskSplitRuntime({
    cwd: parsed.cwd,
    parentTaskId: parsed.parentTaskId,
    proposalDigest: parsed.proposalDigest!,
    actor: parsed.actor,
    reason: parsed.reason!,
    dryRun: parsed.dryRun,
  });
  if (parsed.json) return writeJsonOutput(result);
  writeLines([
    'Skopos Task split applied',
    `Parent: ${result.activation.parentTaskId}`,
    `Children: ${result.activation.childTaskIds.join(', ')}`,
    'Host-neutral child assignments (not delivered):',
    ...result.activation.assignments.flatMap((assignment) => [
      `- ${assignment.title}; Task ${assignment.taskId}; reviewer ${assignment.reviewer.actorId} on ${assignment.reviewer.parentTaskId}`,
      `  Prompt: ${assignment.prompt.replaceAll('\n', ' ')}`,
      `  Bind returned Session: ${assignment.cliCommand}`,
      `  Manual fallback: ${assignment.manualFallback.reason}`,
    ]),
  ]);
};

const runTaskAssignCommand = async (args: string[]): Promise<void> => {
  const parsed = parseTaskAssignArgs(args);
  const result = await assignSkoposTaskToSessionRuntime(parsed);
  if (parsed.json) return writeJsonOutput(result);
  writeLines([
    'Skopos Task assignment',
    `Task: ${result.task.id}`,
    `Session: ${result.coordination.session.sessionId}`,
    `Actor: ${result.coordination.session.actorId}`,
    `Claims: ${result.coordination.claims.length}`,
    'Next step:',
    result.nextCommand,
  ]);
};

const runTaskChildStartCommand = async (args: string[]): Promise<void> => {
  const parsed = parseTaskChildStartArgs(args);
  const result = await startSkoposLinkedChildTaskRuntime(parsed);
  if (parsed.json) return writeJsonOutput(result);
  writeLines([
    'Skopos linked child Task',
    `Parent: ${result.activation.parentTaskId}`,
    `Child: ${result.activation.childTaskIds[0]}`,
    `Title: ${result.activation.assignments[0]!.title}`,
    'Host-neutral assignment (not delivered):',
    result.activation.assignments[0]!.prompt,
    result.activation.assignments[0]!.sessionBindingFollowUp,
    `Manual fallback: ${result.activation.assignments[0]!.manualFallback.reason}`,
  ]);
};

interface ParsedTaskSplitArgs {
  operation: 'propose' | 'apply';
  parentTaskId: string;
  cwd: string;
  actor?: string;
  reason?: string;
  fromPath?: string;
  proposalDigest?: string;
  dryRun: boolean;
  json: boolean;
}

const parseTaskSplitArgs = (args: string[]): ParsedTaskSplitArgs => {
  const positionals: string[] = [];
  let cwd = process.cwd();
  let actor: string | undefined;
  let reason: string | undefined;
  let fromPath: string | undefined;
  let proposalDigest: string | undefined;
  let dryRun = false;
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') json = true;
    else if (argument === '--dry-run') dryRun = true;
    else if (argument === '--actor') actor = requireFlagValue(args, ++index, '--actor');
    else if (argument.startsWith('--actor=')) actor = argument.slice('--actor='.length);
    else if (argument === '--reason') reason = requireFlagValue(args, ++index, '--reason');
    else if (argument.startsWith('--reason=')) reason = argument.slice('--reason='.length);
    else if (argument === '--from') fromPath = resolve(requireFlagValue(args, ++index, '--from'));
    else if (argument.startsWith('--from=')) fromPath = resolve(argument.slice('--from='.length));
    else if (argument === '--proposal') proposalDigest = requireFlagValue(args, ++index, '--proposal');
    else if (argument.startsWith('--proposal=')) proposalDigest = argument.slice('--proposal='.length);
    else if (argument === '--cwd') cwd = resolve(requireFlagValue(args, ++index, '--cwd'));
    else if (argument.startsWith('--cwd=')) cwd = resolve(argument.slice('--cwd='.length));
    else if (argument.startsWith('-')) throw new Error(`Unknown Task split flag: ${argument}.`);
    else positionals.push(argument);
  }
  const [operation, parentTaskId, target] = positionals;
  if ((operation !== 'propose' && operation !== 'apply') || !parentTaskId) {
    throw new Error('Usage: skopos task split <propose|apply> <parent-task-id> [target] ...');
  }
  if (target) cwd = resolve(target);
  if (operation === 'propose' && !fromPath) {
    throw new Error('Task split propose requires --from <proposal.json>.');
  }
  if (operation === 'apply' && (!proposalDigest || !reason)) {
    throw new Error('Task split apply requires --proposal <digest> --reason <text>.');
  }
  return {
    operation,
    parentTaskId,
    cwd,
    actor,
    reason,
    fromPath,
    proposalDigest,
    dryRun,
    json,
  };
};

const parseTaskAssignArgs = (args: string[]) => {
  const positionals: string[] = [];
  let cwd = process.cwd();
  let actor: string | undefined;
  let sessionId: string | undefined;
  let host: string | undefined;
  let leaseSeconds: number | undefined;
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') json = true;
    else if (argument === '--actor') actor = requireFlagValue(args, ++index, '--actor');
    else if (argument.startsWith('--actor=')) actor = argument.slice('--actor='.length);
    else if (argument === '--session-id') sessionId = requireFlagValue(args, ++index, '--session-id');
    else if (argument.startsWith('--session-id=')) sessionId = argument.slice('--session-id='.length);
    else if (argument === '--host') host = requireFlagValue(args, ++index, '--host');
    else if (argument.startsWith('--host=')) host = argument.slice('--host='.length);
    else if (argument === '--lease-seconds') leaseSeconds = Number(requireFlagValue(args, ++index, '--lease-seconds'));
    else if (argument.startsWith('--lease-seconds=')) leaseSeconds = Number(argument.slice('--lease-seconds='.length));
    else if (argument === '--cwd') cwd = resolve(requireFlagValue(args, ++index, '--cwd'));
    else if (argument.startsWith('--cwd=')) cwd = resolve(argument.slice('--cwd='.length));
    else if (argument.startsWith('-')) throw new Error(`Unknown Task assignment flag: ${argument}.`);
    else positionals.push(argument);
  }
  const [taskId, target] = positionals;
  if (!taskId || !actor || !sessionId) {
    throw new Error('Usage: skopos task assign <task-id> [target] --actor <id> --session-id <id> [--host <name>].');
  }
  if (target) cwd = resolve(target);
  if (leaseSeconds !== undefined && (!Number.isFinite(leaseSeconds) || leaseSeconds <= 0)) {
    throw new Error('--lease-seconds must be a positive number.');
  }
  return { cwd, taskId, actor, sessionId, host, leaseSeconds, json };
};

const parseTaskChildStartArgs = (args: string[]) => {
  const positionals: string[] = [];
  const ownedPaths: string[] = [];
  const acceptanceCriteria: string[] = [];
  const nonGoals: string[] = [];
  const constraints: string[] = [];
  const dependencyTaskIds: string[] = [];
  const parentAcceptanceRequirementIds: string[] = [];
  let cwd = process.cwd();
  let actor: string | undefined;
  let reason: string | undefined;
  let scopeId: string | undefined;
  let risk: 'standard' | 'high-impact' = 'standard';
  let priority: number | undefined;
  let json = false;
  const listFlags = new Map<string, string[]>([
    ['--own', ownedPaths],
    ['--accept', acceptanceCriteria],
    ['--non-goal', nonGoals],
    ['--constraint', constraints],
    ['--depends-on', dependencyTaskIds],
    ['--parent-acceptance', parentAcceptanceRequirementIds],
  ]);
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    const list = listFlags.get(argument);
    if (list) {
      list.push(requireFlagValue(args, ++index, argument));
    } else if (argument === '--json') json = true;
    else if (argument === '--actor') actor = requireFlagValue(args, ++index, '--actor');
    else if (argument.startsWith('--actor=')) actor = argument.slice('--actor='.length);
    else if (argument === '--reason') reason = requireFlagValue(args, ++index, '--reason');
    else if (argument.startsWith('--reason=')) reason = argument.slice('--reason='.length);
    else if (argument === '--scope') scopeId = requireFlagValue(args, ++index, '--scope');
    else if (argument.startsWith('--scope=')) scopeId = argument.slice('--scope='.length);
    else if (argument === '--risk') risk = parseChildRisk(requireFlagValue(args, ++index, '--risk'));
    else if (argument.startsWith('--risk=')) risk = parseChildRisk(argument.slice('--risk='.length));
    else if (argument === '--priority') priority = Number(requireFlagValue(args, ++index, '--priority'));
    else if (argument.startsWith('--priority=')) priority = Number(argument.slice('--priority='.length));
    else if (argument === '--cwd') cwd = resolve(requireFlagValue(args, ++index, '--cwd'));
    else if (argument.startsWith('--cwd=')) cwd = resolve(argument.slice('--cwd='.length));
    else if (argument.startsWith('-')) throw new Error(`Unknown linked child Task flag: ${argument}.`);
    else positionals.push(argument);
  }
  const [parentTaskId, goal, target] = positionals;
  if (!parentTaskId || !goal || !actor || !reason || ownedPaths.length === 0) {
    throw new Error('Usage: skopos task child start <parent-task-id> <goal> [target] --own <path> --reason <text> --actor <id>.');
  }
  if (target) cwd = resolve(target);
  return {
    cwd,
    parentTaskId,
    goal,
    ownedPaths,
    actor,
    reason,
    scopeId,
    acceptanceCriteria,
    nonGoals,
    constraints,
    dependencyTaskIds,
    parentAcceptanceRequirementIds,
    risk,
    priority,
    json,
  };
};

const parseChildRisk = (value: string): 'standard' | 'high-impact' => {
  if (value === 'standard' || value === 'high-impact') return value;
  throw new Error('Linked child Task risk must be standard or high-impact.');
};

interface ParsedTaskArgs {
  subcommand?: string;
  action?: string;
  taskId: string;
  stepId?: string;
  questionId?: string;
  obligationId?: string;
  disposition?: SkoposTaskDispositionKind;
  questionDisposition?: 'dismissed' | 'promoted';
  resolution?: 'memory-updated' | 'reviewed-no-change';
  reason?: string;
  targetPath?: string;
  successorTaskId?: string;
  ownedPaths?: string[];
  cwd: string;
  actor?: string;
  compact: boolean;
  full: boolean;
  collection?: TaskDetailCollection;
  cursor?: string;
  limit?: number;
  json: boolean;
}

const parseTaskArgs = (args: string[]): ParsedTaskArgs => {
  const positionals: string[] = [];
  let cwd = process.cwd();
  let actor: string | undefined;
  let compact = true;
  let full = false;
  let collection: TaskDetailCollection | undefined;
  let cursor: string | undefined;
  let limit: number | undefined;
  let json = false;
  let resolution: ParsedTaskArgs['resolution'];
  let questionDisposition: ParsedTaskArgs['questionDisposition'];
  let reason: string | undefined;
  let targetPath: string | undefined;
  let successorTaskId: string | undefined;
  const ownedPaths: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') {
      json = true;
    } else if (argument === '--compact') {
      compact = true;
      full = false;
    } else if (argument === '--full') {
      compact = false;
      full = true;
    } else if (argument === '--collection') {
      collection = parseTaskDetailCollection(requireFlagValue(args, ++index, '--collection'));
    } else if (argument.startsWith('--collection=')) {
      collection = parseTaskDetailCollection(argument.slice('--collection='.length));
    } else if (argument === '--cursor') {
      cursor = requireFlagValue(args, ++index, '--cursor');
    } else if (argument.startsWith('--cursor=')) {
      cursor = argument.slice('--cursor='.length);
    } else if (argument === '--limit') {
      limit = parseCollectionLimit(requireFlagValue(args, ++index, '--limit'));
    } else if (argument.startsWith('--limit=')) {
      limit = parseCollectionLimit(argument.slice('--limit='.length));
    } else if (argument === '--actor') {
      actor = requireFlagValue(args, ++index, '--actor');
    } else if (argument.startsWith('--actor=')) {
      actor = argument.slice('--actor='.length);
    } else if (argument === '--resolution') {
      resolution = parseMemoryResolution(requireFlagValue(args, ++index, '--resolution'));
    } else if (argument.startsWith('--resolution=')) {
      resolution = parseMemoryResolution(argument.slice('--resolution='.length));
    } else if (argument === '--disposition') {
      questionDisposition = parseQuestionDisposition(
        requireFlagValue(args, ++index, '--disposition'),
      );
    } else if (argument.startsWith('--disposition=')) {
      questionDisposition = parseQuestionDisposition(
        argument.slice('--disposition='.length),
      );
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
    } else if (argument === '--own') {
      ownedPaths.push(requireFlagValue(args, ++index, '--own'));
    } else if (argument.startsWith('--own=')) {
      ownedPaths.push(argument.slice('--own='.length));
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
      full,
      collection,
      cursor,
      limit,
      json,
    };
  }
  if (subcommand === 'question') {
    if (
      first !== 'dispose' ||
      !second ||
      !third ||
      !questionDisposition ||
      !reason
    ) {
      throw new Error(
        'Usage: skopos task question dispose <task-id> <question-id> --disposition dismissed|promoted --reason <text> [--target <path>].',
      );
    }
    return {
      subcommand,
      action: first,
      taskId: second,
      questionId: third,
      questionDisposition,
      reason,
      targetPath,
      cwd,
      actor,
      compact,
      full,
      collection,
      cursor,
      limit,
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
      full,
      collection,
      cursor,
      limit,
      json,
    };
  }
  if (subcommand === 'ownership') {
    if (first !== 'add' || !second || ownedPaths.length === 0 || !reason) {
      throw new Error(
        'Usage: skopos task ownership add <task-id> --own <path> [--own <path>...] --reason <text> --actor <id> [--cwd <target>].',
      );
    }
    return {
      subcommand,
      action: first,
      taskId: second,
      ownedPaths,
      reason,
      cwd,
      actor,
      compact,
      full,
      collection,
      cursor,
      limit,
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
      full,
      collection,
      cursor,
      limit,
      json,
    };
  }
  if (!first) {
    throw new Error(`Usage: skopos task ${subcommand} <task-id>.`);
  }
  if (second) {
    cwd = resolve(second);
  }
  if ((collection || full || cursor || limit) && subcommand !== 'show') {
    throw new Error('Task detail collection flags are supported only by task show.');
  }
  return {
    subcommand,
    taskId: first,
    cwd,
    actor,
    compact,
    full,
    collection,
    cursor,
    limit,
    json,
  };
};

export const buildCompactTaskOutput = (
  task: Awaited<ReturnType<typeof showSkoposTaskRuntime>>,
  workflow?: SkoposTaskWorkflowAssessment,
) => {
  const nextStep = task.steps.find(
    (step) => step.status !== 'complete' && step.status !== 'skipped',
  );
  const ownedPaths = task.changeScope.declaredOwnedPaths.slice(0, 12);
  const childTasks = task.childTasks ?? [];
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
    admission: task.admission,
    workflow,
    proofSubject: task.proofSubject,
    scopeId: task.scope.scope.id,
    parentTaskId: task.parentTaskId,
    children: {
      total: childTasks.length,
      complete: childTasks.filter((child) => child.state === 'complete').length,
      blocking: childTasks.filter((child) => child.state !== 'complete').length,
    },
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
    ownershipExpansionCount: task.ownershipExpansions?.length ?? 0,
    selectedActionIds: task.selectedActions.slice(0, 12).map((action) => action.id),
    additionalSelectedActionCount: Math.max(0, task.selectedActions.length - 12),
    selectedGuardIds: task.selectedGuardIds.slice(0, 12),
    additionalSelectedGuardCount: Math.max(0, task.selectedGuardIds.length - 12),
    openQuestionCount: task.questions.filter((question) => question.status === 'open').length,
    openRecommendationCount: task.recommendations.filter(
      (recommendation) => recommendation.status === 'open',
    ).length,
    openRecommendations: task.recommendations
      .filter((recommendation) => recommendation.status === 'open')
      .slice(0, 6)
      .map((recommendation) => ({
        id: recommendation.id,
        title: recommendation.title,
        actionKind: recommendation.actionKind,
        command: recommendation.command,
        reason: recommendation.reason ?? recommendation.summary,
      })),
    additionalOpenRecommendationCount: Math.max(
      0,
      task.recommendations.filter((recommendation) => recommendation.status === 'open').length - 6,
    ),
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
      additionalOpenObligationCount: Math.max(
        0,
        task.memoryObligations.filter((obligation) => obligation.status === 'open').length - 6,
      ),
    },
  };
};

export const buildPagedTaskDetailOutput = (
  task: Awaited<ReturnType<typeof showSkoposTaskRuntime>>,
  collection: TaskDetailCollection,
  cursor?: string,
  limit?: number,
) => {
  const source: unknown[] = taskDetailSource(task, collection);
  const page = paginateCollection(source, {
    collection: `task.${collection}`,
    cursor,
    limit,
  });
  return {
    schemaVersion: 1,
    type: 'task-detail-page',
    workspaceRoot: task.workspaceRoot,
    taskId: task.id,
    state: task.state,
    collection,
    items: page.items,
    page: page.page,
  };
};

export const buildTaskDetailIndex = (
  task: Awaited<ReturnType<typeof showSkoposTaskRuntime>>,
  workflow?: SkoposTaskWorkflowAssessment,
) => ({
  ...buildCompactTaskOutput(task, workflow),
  type: 'task-detail-index',
  detailCollections: taskDetailCollections.map((collection) => ({
    collection,
    total: taskDetailSource(task, collection).length,
    command: `skopos task show ${task.id} . --collection ${collection} --json`,
  })),
});

const taskDetailCollections: TaskDetailCollection[] = [
  'owned-paths',
  'steps',
  'actions',
  'guards',
  'evidence-requirements',
  'questions',
  'recommendations',
  'memory-obligations',
  'children',
  'dependencies',
  'plans',
];

const taskDetailSource = (
  task: Awaited<ReturnType<typeof showSkoposTaskRuntime>>,
  collection: TaskDetailCollection,
): unknown[] => {
  if (collection === 'owned-paths') return task.changeScope.declaredOwnedPaths;
  if (collection === 'steps') return task.steps;
  if (collection === 'actions') return task.selectedActions;
  if (collection === 'guards') return task.selectedGuardIds;
  if (collection === 'evidence-requirements') return task.evidenceRequirements;
  if (collection === 'questions') return task.questions;
  if (collection === 'recommendations') return task.recommendations;
  if (collection === 'memory-obligations') return task.memoryObligations;
  if (collection === 'children') return task.childTasks;
  if (collection === 'dependencies') return task.dependencyTaskIds;
  return task.planIds;
};

const parseTaskDetailCollection = (value: string): TaskDetailCollection => {
  if (taskDetailCollections.includes(value as TaskDetailCollection)) {
    return value as TaskDetailCollection;
  }
  throw new Error(`Unknown Task detail collection: ${value}.`);
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

const parseQuestionDisposition = (
  value: string,
): ParsedTaskArgs['questionDisposition'] => {
  if (value === 'dismissed' || value === 'promoted') {
    return value;
  }
  throw new Error('Question disposition must be dismissed or promoted.');
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
