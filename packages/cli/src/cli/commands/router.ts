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
}

interface ParsedDecideArgs {
  cwd: string;
  questionId: string;
  optionId: string;
  actor?: string;
  dryRun: boolean;
  json: boolean;
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
  });

  if (parsed.json) {
    writeJsonOutput(result);
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
    `Contract: ${result.task.contract.acceptanceCriteria.length} acceptance criteria, ${result.blockingQuestions.length} blocking decisions, ${result.task.evidenceRequirements.length} Evidence requirements`,
    `Selected capabilities: ${result.task.selectedActions.length} Actions, ${result.task.selectedGuardIds.length} Guards`,
    'Next step:',
    result.recommendedAction?.title ?? 'Inspect the Task steps and begin the admitted work.',
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
    writeJsonOutput(result);
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
    writeJsonOutput(result);
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

  if (result.recommendedChecks.length > 0) {
    lines.push('- recommended checks:');
    for (const check of result.recommendedChecks) {
      lines.push(`  - ${check}`);
    }
  }

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
      argument === '--priority'
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
  };
};

const parsePlanArgs = (args: string[]): ParsedPlanArgs => {
  let cwd = process.cwd();
  let goal: string | undefined;
  let scope: string | undefined;
  let actor: string | undefined;
  let dryRun = false;
  let json = false;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--json') {
      json = true;
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

  return { cwd, goal, scope, actor, dryRun, json };
};

const parseDecideArgs = (args: string[]): ParsedDecideArgs => {
  let cwd = process.cwd();
  let questionId: string | undefined;
  let optionId: string | undefined;
  let actor: string | undefined;
  let dryRun = false;
  let json = false;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--json') {
      json = true;
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

  return { cwd, questionId, optionId, actor, dryRun, json };
};
