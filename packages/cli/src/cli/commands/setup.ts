import { resolve } from 'node:path';

import {
  buildSkoposSetupAnswerRuntime,
  buildSkoposSetupReviewRuntime,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedSetupReviewArgs {
  cwd: string;
  actor?: string;
  dryRun: boolean;
  json: boolean;
}

interface ParsedSetupAnswerArgs extends ParsedSetupReviewArgs {
  questionId: string;
  optionId: string;
}

export const runSetupCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (subcommand === 'review') {
    await runSetupReviewCommand(rest);
    return;
  }

  if (subcommand === 'answer') {
    await runSetupAnswerCommand(rest);
    return;
  }

  throw new Error('Unknown setup subcommand. Use `setup review` or `setup answer`.');
};

const runSetupReviewCommand = async (args: string[]): Promise<void> => {
  const parsed = parseSetupReviewArgs(args);
  const result = await buildSkoposSetupReviewRuntime({
    cwd: parsed.cwd,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  const openQuestions = result.setupReview.openConfirmationQuestions;
  const answeredQuestions = result.setupReview.answeredQuestions;

  writeLines([
    'Skopos setup review',
    `Status: ${result.setupReview.readiness === 'ready' ? 'Ready' : 'Needs confirmation'}`,
    `Summary: ${result.setupReview.summary}`,
    `Lifecycle: ${result.setupReview.lifecycle}`,
    `Project mode: ${result.setupReview.projectMode ?? 'not confirmed'}`,
    `Facts: ${result.setupReview.facts.length}`,
    `Inferences: ${result.setupReview.inferences.length}`,
    `Assumptions: ${result.setupReview.assumptions.length}`,
    `Open questions: ${openQuestions.length}`,
    `Answered questions: ${answeredQuestions.length}`,
    ...(openQuestions.length > 0
      ? [
          'Questions to answer:',
          ...openQuestions.flatMap((question) => {
            const recommended = question.options.find(
              (option) => option.id === question.recommendedOptionId,
            );
            return [
              `- ${question.id}: ${question.question}`,
              `  recommended: ${recommended?.label ?? question.recommendedOptionId}`,
              `  why: ${question.whyItMatters}`,
              ...question.options.map((option) =>
                `  option ${option.id}${option.id === question.recommendedOptionId ? ' (recommended)' : ''}: ${option.rationale}`,
              ),
              `  answer: skopos setup answer ${question.id} ${question.recommendedOptionId} ${result.workspaceRoot}`,
            ];
          }),
        ]
      : ['No open setup questions.']),
    ...(answeredQuestions.length > 0
      ? [
          'Answered:',
          ...answeredQuestions.map(
            (answer) => `- ${answer.questionId}: ${answer.optionLabel} (${answer.optionId})`,
          ),
        ]
      : []),
    'Artifacts:',
    `- setup review: ${result.setupReviewPath}`,
    `- setup answers: ${result.setupAnswersPath}`,
  ]);
};

const runSetupAnswerCommand = async (args: string[]): Promise<void> => {
  const parsed = parseSetupAnswerArgs(args);
  const result = await buildSkoposSetupAnswerRuntime({
    cwd: parsed.cwd,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
    questionId: parsed.questionId,
    optionId: parsed.optionId,
  });

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  writeLines([
    'Skopos setup answer',
    `Status: ${result.setupReview.readiness === 'ready' ? 'Setup ready' : 'Answer recorded'}`,
    `Question: ${result.answer.question}`,
    `Selected: ${result.answer.optionLabel}`,
    `Open questions remaining: ${result.setupReview.openConfirmationQuestions.length}`,
    `Answered questions: ${result.setupReview.answeredQuestions.length}`,
    `Config: ${result.configWrite ?? 'unchanged'}`,
    ...(result.answer.appliedEffects.length > 0
      ? [
          'Effects:',
          ...result.answer.appliedEffects.map((effect) =>
            `- ${effect.summary}${effect.path ? ` (${effect.path})` : ''}`,
          ),
        ]
      : []),
    'Next step:',
    result.setupReview.nextCommand,
    'Artifacts:',
    `- setup review: ${result.setupReviewPath} (${result.setupReviewWrite})`,
    `- setup answers: ${result.setupAnswersPath} (${result.setupAnswersWrite})`,
  ]);
};

const parseSetupReviewArgs = (args: string[]): ParsedSetupReviewArgs => {
  let cwd = process.cwd();
  let actor: string | undefined;
  let dryRun = false;
  let json = false;

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
      actor = args[index + 1];
      index += 1;
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos flag: ${argument}`);
    }

    cwd = resolve(argument);
  }

  return { cwd, actor, dryRun, json };
};

const parseSetupAnswerArgs = (args: string[]): ParsedSetupAnswerArgs => {
  const [questionId, optionId, ...rest] = args;

  if (!questionId || !optionId) {
    throw new Error('Usage: skopos setup answer <question-id> <option-id> [repo-root]');
  }

  return {
    ...parseSetupReviewArgs(rest),
    questionId,
    optionId,
  };
};
