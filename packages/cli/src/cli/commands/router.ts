import { resolve } from 'node:path';

import {
  buildSkoposDecideRuntime,
  buildSkoposPlanRuntime,
  buildSkoposStartRuntime,
} from '@skopos/runtime';

import {
  buildGuidedDecisionQuestionLines,
  buildProjectKnowledgeGuidanceLines,
} from '../shared/compact-output.js';
import { buildCompactTaskOutput } from './task.js';
import {
  writeJsonOutput,
  writeLines,
} from '../shared/output.js';

interface ParsedPlanArgs {
  cwd: string;
  goal: string;
  scope?: string;
  actor?: string;
  dryRun: boolean;
  json: boolean;
  full: boolean;
}

interface ParsedStartArgs extends ParsedPlanArgs {
  acceptanceCriteria: string[];
  nonGoals: string[];
  constraints: string[];
  ownedPaths: string[];
  priority?: number;
  dependencyTaskIds: string[];
  sessionId?: string;
  host?: string;
  leaseSeconds?: number;
  risk?: 'light' | 'standard' | 'high-impact';
  proofSubjectKind?: 'task-closure' | 'project-integration';
}

interface ParsedDecideArgs {
  cwd: string;
  questionId: string;
  optionId: string;
  actor?: string;
  dryRun: boolean;
  json: boolean;
  full: boolean;
}

export const runStartCommand = async (args: string[]): Promise<void> => {
  const parsed = parseStartArgs(args);
  const result = await buildSkoposStartRuntime({
    cwd: parsed.cwd,
    goal: parsed.goal,
    scope: parsed.scope,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
    acceptanceCriteria: parsed.acceptanceCriteria,
    nonGoals: parsed.nonGoals,
    constraints: parsed.constraints,
    ownedPaths: parsed.ownedPaths,
    priority: parsed.priority,
    dependencyTaskIds: parsed.dependencyTaskIds,
    sessionId: parsed.sessionId,
    host: parsed.host,
    leaseSeconds: parsed.leaseSeconds,
    risk: parsed.risk,
    proofSubjectKind: parsed.proofSubjectKind,
  });

  if (parsed.json) {
    writeJsonOutput(parsed.full ? result : buildCompactStartOutput(result));
    return;
  }

  const lines = [
    'Skopos start',
    `Status: ${result.codeAllowed ? 'Ready to implement' : 'Decision needed'}`,
    `Summary: ${result.summary}`,
    `Goal: ${result.goal}`,
    `Scope: ${result.scope.scope.id}`,
    `Task: ${result.task.id} [${result.task.state}]`,
    `Risk/detail: ${result.task.risk} / ${result.task.detail}`,
    `Workflow: ${result.task.admission?.workflow ?? 'legacy'}`,
    `Risk recommendation: ${result.task.admission?.recommendedRisk ?? result.task.risk} / ${result.task.admission?.recommendedDetail ?? result.task.detail} (${result.task.admission?.selectionSource ?? 'legacy'})`,
    `Contract: ${result.task.contract.acceptanceCriteria.length} acceptance criteria, ${result.blockingQuestions.length} blocking decisions, ${result.task.evidenceRequirements.length} Evidence requirements, ${result.task.memoryObligations.length} Memory obligations`,
    `Selected capabilities: ${result.task.selectedActions.length} Actions, ${result.task.selectedGuardIds.length} Guards`,
    'Next step:',
    result.nextCommand,
    `Why: ${result.nextReason}`,
    '',
    ...buildProjectKnowledgeGuidanceLines(result.projectKnowledge),
  ];

  if (result.blockingQuestions.length > 0) {
    lines.push('', 'Decisions needed:');
    for (const question of result.blockingQuestions) {
      lines.push(`- ${question.question}`);
      lines.push(`  Why: ${question.whyItMatters}`);
      lines.push(
        `  Recommended: ${question.options.find((option) => option.id === question.recommendedOptionId)?.label ?? question.recommendedOptionId}`,
      );
    }
  }

  lines.push(
    '',
    'Details:',
    `- actor: ${result.actorId ?? '(none)'}`,
    `- coordination Session: ${result.coordination?.session.sessionId ?? '(none)'}`,
    `- Task reservation: ${result.coordination?.reservation?.taskId ?? '(none)'}`,
    `- resource claims: ${result.coordination?.claims.length ?? 0}`,
    `- code allowed: ${result.codeAllowed ? 'yes' : 'no'}`,
    `- task: ${result.taskPath} [${result.task.state}]`,
    `- questions: ${result.questionsPath} (${result.questionsWrite})`,
    `- recommendations: ${result.recommendationsPath} (${result.recommendationsWrite})`,
  );

  if (result.recommendedAction) {
    lines.push(`- next: ${result.recommendedAction.title}`);
    lines.push(`  summary: ${result.recommendedAction.summary}`);
  }

  writeLines(lines);
};

export const runDecideCommand = async (args: string[]): Promise<void> => {
  const parsed = parseDecideArgs(args);
  const result = await buildSkoposDecideRuntime({
    cwd: parsed.cwd,
    questionId: parsed.questionId,
    optionId: parsed.optionId,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });

  if (parsed.json) {
    writeJsonOutput(parsed.full ? result : buildCompactDecideOutput(result));
    return;
  }

  const selectedOption = result.resolvedQuestion.options.find(
    (option) => option.id === result.selectedOptionId,
  );
  const openQuestions = result.questions.entries.filter((question) => question.status === 'open');
  const lines = [
    'Skopos decide',
    `Status: ${result.codeAllowed ? 'Decision recorded' : 'More decisions needed'}`,
    `Summary: ${result.summary}`,
    `Answered: ${result.resolvedQuestion.question}`,
    `Selected: ${selectedOption?.label ?? result.selectedOptionId}`,
    'Next step:',
    result.recommendedAction?.title ?? 'Run `skopos work next` to continue.',
  ];

  if (openQuestions.length > 0) {
    lines.push('', 'Open decisions:');
    for (const question of openQuestions) {
      lines.push(`- ${question.question}`);
      lines.push(`  Why: ${question.whyItMatters}`);
    }
  }

  lines.push(
    '',
    'Details:',
    `- question: ${result.questionId}`,
    `- selected option: ${result.selectedOptionId}`,
    `- actor: ${result.actorId ?? '(none)'}`,
    `- code allowed: ${result.codeAllowed ? 'yes' : 'no'}`,
    `- task: ${result.taskPath} (${result.taskWrite})`,
    `- questions: ${result.questionsPath} (${result.questionsWrite})`,
    `- recommendations: ${result.recommendationsPath} (${result.recommendationsWrite})`,
  );

  if (result.recommendedAction) {
    lines.push(`- next: ${result.recommendedAction.title}`);
    lines.push(`  summary: ${result.recommendedAction.summary}`);
  }

  writeLines(lines);
};

export const runPlanCommand = async (args: string[]): Promise<void> => {
  const parsed = parsePlanArgs(args);
  const result = await buildSkoposPlanRuntime({
    cwd: parsed.cwd,
    goal: parsed.goal,
    scope: parsed.scope,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });

  if (parsed.json) {
    writeJsonOutput(parsed.full ? result : buildCompactPlanOutput(result));
    return;
  }

  const lines = [
    'Skopos plan',
    `Status: ${result.decisionQuestions.length > 0 ? 'Decision needed' : 'Plan ready'}`,
    `Summary: ${result.summary}`,
    `Goal: ${result.goal}`,
    `Scope: ${result.scope.scope.id}`,
    `Confidence: ${result.confidence}`,
    'Next step:',
    result.nextSteps[0] ?? `Run \`skopos start "${result.goal}"\` when you are ready to begin.`,
  ];

  if (result.decisionQuestions.length > 0) {
    lines.push(...buildGuidedDecisionQuestionLines(result.decisionQuestions));
  }

  lines.push(
    '',
    'Details:',
    `- actor: ${result.actorId ?? '(none)'}`,
    `- plan: ${result.planPath} (${result.planWrite})`,
    '- implementation steps:',
    ...result.implementationSteps.map((step) => `  - ${step.title}: ${step.detail}`),
  );

  if (result.recommendedActions.length > 0) {
    lines.push('- recommended Actions:');
    for (const action of result.recommendedActions) {
      lines.push(`  - ${action.id}: ${action.reason}`);
    }
  }

  writeLines(lines);
};

const parseStartArgs = (args: string[]): ParsedStartArgs => {
  const remainingArgs: string[] = [];
  const acceptanceCriteria: string[] = [];
  const nonGoals: string[] = [];
  const constraints: string[] = [];
  const ownedPaths: string[] = [];
  const dependencyTaskIds: string[] = [];
  let sessionId: string | undefined;
  let host: string | undefined;
  let leaseSeconds: number | undefined;
  let priority: number | undefined;
  let risk: ParsedStartArgs['risk'];
  let proofSubjectKind: ParsedStartArgs['proofSubjectKind'];
  const valueFlags = new Map([
    ['--accept', acceptanceCriteria],
    ['--non-goal', nonGoals],
    ['--constraint', constraints],
    ['--own', ownedPaths],
    ['--depends-on', dependencyTaskIds],
  ]);

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    const target = valueFlags.get(argument);
    if (target) {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error(`Missing value for ${argument}.`);
      }
      target.push(nextValue);
      index += 1;
      continue;
    }

    if (
      argument === '--session-id' ||
      argument === '--host' ||
      argument === '--lease-seconds' ||
      argument === '--priority' ||
      argument === '--risk' ||
      argument === '--proof-subject'
    ) {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error(`Missing value for ${argument}.`);
      }
      if (argument === '--session-id') sessionId = nextValue;
      if (argument === '--host') host = nextValue;
      if (argument === '--lease-seconds') {
        leaseSeconds = Number(nextValue);
        if (!Number.isInteger(leaseSeconds)) {
          throw new Error('--lease-seconds requires an integer.');
        }
      }
      if (argument === '--priority') {
        priority = Number(nextValue);
        if (!Number.isInteger(priority) || priority < 0 || priority > 100) {
          throw new Error('--priority requires an integer from 0 to 100.');
        }
      }
      if (argument === '--risk') {
        risk = parseTaskRisk(nextValue);
      }
      if (argument === '--proof-subject') {
        proofSubjectKind = parseProofSubjectKind(nextValue);
      }
      index += 1;
      continue;
    }

    const inlineFlag = [...valueFlags.keys()].find((flag) =>
      argument.startsWith(`${flag}=`),
    );
    if (inlineFlag) {
      const value = argument.slice(inlineFlag.length + 1).trim();
      if (!value) {
        throw new Error(`Missing value for ${inlineFlag}.`);
      }
      valueFlags.get(inlineFlag)!.push(value);
      continue;
    }
    if (argument.startsWith('--proof-subject=')) {
      proofSubjectKind = parseProofSubjectKind(
        argument.slice('--proof-subject='.length),
      );
      continue;
    }
    if (argument.startsWith('--risk=')) {
      risk = parseTaskRisk(argument.slice('--risk='.length));
      continue;
    }

    remainingArgs.push(argument);
  }

  return {
    ...parsePlanArgs(remainingArgs),
    acceptanceCriteria,
    nonGoals,
    constraints,
    ownedPaths,
    priority,
    dependencyTaskIds,
    sessionId,
    host,
    leaseSeconds,
    risk,
    proofSubjectKind,
  };
};

const parseTaskRisk = (value: string): NonNullable<ParsedStartArgs['risk']> => {
  if (value === 'light' || value === 'standard' || value === 'high-impact') return value;
  throw new Error('--risk requires light, standard, or high-impact.');
};

const parseProofSubjectKind = (
  value: string,
): NonNullable<ParsedStartArgs['proofSubjectKind']> => {
  if (value === 'task-closure' || value === 'project-integration') return value;
  throw new Error(`Unknown proof subject: ${value}.`);
};

const parsePlanArgs = (args: string[]): ParsedPlanArgs => {
  let cwd = process.cwd();
  let goal: string | undefined;
  let scope: string | undefined;
  let actor: string | undefined;
  let dryRun = false;
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

    if (argument === '--scope') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --scope.');
      }
      scope = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--scope=')) {
      scope = argument.slice('--scope='.length);
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
      throw new Error(`Unknown Skopos plan flag: ${argument}`);
    }

    if (!goal) {
      goal = argument;
      continue;
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra plan target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  if (!goal || goal.trim().length === 0) {
    throw new Error('Missing plan goal.');
  }

  return { cwd, goal, scope, actor, dryRun, json, full };
};

const parseDecideArgs = (args: string[]): ParsedDecideArgs => {
  let cwd = process.cwd();
  let questionId: string | undefined;
  let optionId: string | undefined;
  let actor: string | undefined;
  let dryRun = false;
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
      throw new Error(`Unknown Skopos decide flag: ${argument}`);
    }

    if (!questionId) {
      questionId = argument;
      continue;
    }

    if (!optionId) {
      optionId = argument;
      continue;
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra decide target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  if (!questionId || questionId.trim().length === 0) {
    throw new Error('Missing Task question id.');
  }

  if (!optionId || optionId.trim().length === 0) {
    throw new Error('Missing Task decision option id.');
  }

  return { cwd, questionId, optionId, actor, dryRun, json, full };
};

export const buildCompactStartOutput = (
  result: Awaited<ReturnType<typeof buildSkoposStartRuntime>>,
) => ({
  schemaVersion: 1,
  workspaceRoot: result.task.workspaceRoot,
  summary: result.summary,
  goal: result.goal,
  actorId: result.actorId,
  scopeId: result.scope.scope.id,
  codeAllowed: result.codeAllowed,
  nextCommand: result.nextCommand,
  nextReason: result.nextReason,
  task: buildCompactTaskOutput(result.task),
  blockingQuestionCount: result.blockingQuestions.length,
  recommendedAction: result.recommendedAction,
  projectKnowledge: result.projectKnowledge
    ? {
        summary: result.projectKnowledge.summary,
        freshness: result.projectKnowledge.freshness,
        attentionAreaCount: result.projectKnowledge.attentionAreaCount,
      }
    : undefined,
});

export const buildCompactDecideOutput = (
  result: Awaited<ReturnType<typeof buildSkoposDecideRuntime>>,
) => ({
  schemaVersion: 1,
  workspaceRoot: result.task.workspaceRoot,
  summary: result.summary,
  actorId: result.actorId,
  taskId: result.taskId,
  questionId: result.questionId,
  selectedOptionId: result.selectedOptionId,
  codeAllowed: result.codeAllowed,
  openQuestionCount: result.questions.entries.filter(
    (question) => question.status === 'open',
  ).length,
  recommendedAction: result.recommendedAction,
});

export const buildCompactPlanOutput = (
  result: Awaited<ReturnType<typeof buildSkoposPlanRuntime>>,
) => ({
  schemaVersion: 1,
  workspaceRoot: result.workspaceRoot,
  summary: result.summary,
  goal: result.goal,
  actorId: result.actorId,
  scopeId: result.scope.scope.id,
  confidence: result.confidence,
  decisionQuestionCount: result.decisionQuestions.length,
  recommendedActionIds: result.recommendedActions.map((action) => action.id),
  nextStep: result.nextSteps[0],
});
