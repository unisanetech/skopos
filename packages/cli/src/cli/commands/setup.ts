import { resolve } from 'node:path';

import type {
  SkoposSetupDispositionKind,
  SkoposSetupRuntimeResult,
} from '@skopos/model';
import {
  answerSkoposSetupQuestionRuntime,
  buildSkoposSetupRuntime,
  confirmSkoposSetupHostDelivery,
  recordSkoposSetupDispositionRuntime,
  resumeSkoposSetupRuntime,
  submitSkoposSetupAnalysisRuntime,
  submitSkoposSetupCompletionRuntime,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedSetupArgs {
  cwd: string;
  actor?: string;
  dryRun: boolean;
  json: boolean;
  host?: string;
  sessionId?: string;
  note?: string;
  contextMarker?: string;
  contextDigest?: string;
}

const SETUP_SUBCOMMANDS = new Set([
  'status',
  'resume',
  'review',
  'answer',
  'decide',
  'submit',
  'submit-completion',
  'confirm-host-delivery',
]);

export const runSetupCommand = async (args: string[]): Promise<void> => {
  const requested = args[0];
  const subcommand = requested && SETUP_SUBCOMMANDS.has(requested)
    ? requested
    : undefined;
  const rest = subcommand ? args.slice(1) : args;

  if (subcommand === 'answer') {
    await runSetupAnswerCommand(rest);
    return;
  }
  if (subcommand === 'decide') {
    await runSetupDecisionCommand(rest);
    return;
  }
  if (subcommand === 'submit') {
    await runSetupSubmitCommand(rest);
    return;
  }
  if (subcommand === 'submit-completion') {
    await runSetupCompletionCommand(rest);
    return;
  }
  if (subcommand === 'confirm-host-delivery') {
    await runSetupHostConfirmationCommand(rest);
    return;
  }

  const parsed = parseSetupArgs(rest);
  const result = subcommand === 'resume'
    ? await resumeSkoposSetupRuntime(parsed)
    : await buildSkoposSetupRuntime({
        ...parsed,
        initialize: subcommand === undefined,
      });

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }
  renderSetup(result, subcommand === 'review' ? 'review' : 'status');
};

const runSetupCompletionCommand = async (args: string[]): Promise<void> => {
  const [inputPath, ...rest] = args;
  if (!inputPath) {
    throw new Error('Usage: skopos setup submit-completion <receipt.json> [target] --actor <id>');
  }
  const parsed = parseSetupArgs(rest);
  const result = await submitSkoposSetupCompletionRuntime({
    cwd: parsed.cwd,
    inputPath: resolve(inputPath),
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });
  if (parsed.json) return writeJsonOutput(result);
  writeLines(['Setup completion Evidence verified.', '']);
  renderSetup(result, 'status');
};

const runSetupHostConfirmationCommand = async (args: string[]): Promise<void> => {
  const parsed = parseSetupArgs(args);
  if (!parsed.actor || !parsed.host || !parsed.sessionId || !parsed.contextMarker || !parsed.contextDigest) {
    throw new Error('Usage: skopos setup confirm-host-delivery [target] --actor <id> --host <host> --session-id <id> --context-marker <marker> --context-digest <sha256>');
  }
  const result = await confirmSkoposSetupHostDelivery({
    cwd: parsed.cwd,
    actor: parsed.actor,
    host: parsed.host,
    sessionId: parsed.sessionId,
    communicationContractMarker: parsed.contextMarker,
    communicationContractDigest: parsed.contextDigest,
    dryRun: parsed.dryRun,
  });
  if (parsed.json) return writeJsonOutput(result);
  writeLines(['Host delivery confirmed for this exact coding-agent Session.', '']);
  renderSetup(result, 'status');
};

const runSetupSubmitCommand = async (args: string[]): Promise<void> => {
  const [inputPath, ...rest] = args;
  if (!inputPath) {
    throw new Error('Usage: skopos setup submit <analysis.json> [target] --actor <id>');
  }
  const parsed = parseSetupArgs(rest);
  const result = await submitSkoposSetupAnalysisRuntime({
    cwd: parsed.cwd,
    inputPath: resolve(inputPath),
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });
  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }
  writeLines(['Project analysis added to the setup review.', '']);
  renderSetup(result, 'review');
};

const runSetupAnswerCommand = async (args: string[]): Promise<void> => {
  const [questionId, optionId, ...rest] = args;
  if (!questionId || !optionId) {
    throw new Error('Usage: skopos setup answer <question-id> <option-id> [target]');
  }
  const parsed = parseSetupArgs(rest);
  const answered = await answerSkoposSetupQuestionRuntime({
    cwd: parsed.cwd,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
    questionId,
    optionId,
  });
  const result = await buildSkoposSetupRuntime({ ...parsed, initialize: false });
  if (parsed.json) {
    writeJsonOutput({ ...result, answer: answered.answer });
    return;
  }
  writeLines([
    'Setup decision recorded',
    `You chose: ${answered.answer.optionLabel}`,
    `Questions remaining: ${answered.setupReview.openConfirmationQuestions.length}`,
    '',
  ]);
  renderSetup(result, 'status');
};

const runSetupDecisionCommand = async (args: string[]): Promise<void> => {
  const [recommendationId, dispositionValue, ...rest] = args;
  if (!recommendationId || !isDisposition(dispositionValue)) {
    throw new Error(
      'Usage: skopos setup decide <recommendation-id> <accept|edit|defer|reject> [target] [--note <text>]',
    );
  }
  const parsed = parseSetupArgs(rest);
  const result = await recordSkoposSetupDispositionRuntime({
    ...parsed,
    recommendationId,
    disposition: dispositionValue,
    note: parsed.note,
  });
  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }
  writeLines([
    'Setup recommendation updated',
    `Decision: ${dispositionValue}`,
    `Recommendation: ${recommendationId}`,
    '',
  ]);
  renderSetup(result, 'status');
};

const renderSetup = (
  result: SkoposSetupRuntimeResult,
  mode: 'status' | 'review',
): void => {
  const { state } = result;
  const readyLanes = state.lanes.filter((lane) => lane.status === 'ready').length;
  const openRecommendations = state.recommendations.filter(
    (recommendation) =>
      !state.dispositions.some(
        (decision) => decision.recommendationId === recommendation.id,
      ),
  );
  const lines = [
    'Skopos project setup',
    `Status: ${humanStage(state.stage)}`,
    `Progress: ${readyLanes} of ${state.lanes.length} setup areas ready`,
    `Current focus: ${humanStep(state.currentStep)}`,
  ];

  if (state.openQuestionCount > 0) {
    const question = state.materialQuestions[0];
    lines.push(
      '',
      'I need a project decision before continuing.',
      ...(question
        ? [
            `Question: ${question.question}`,
            `Why it matters: ${question.whyItMatters}`,
            `Recommended: ${question.options.find((option) => option.id === question.recommendedOptionId)?.label ?? question.recommendedOptionId}`,
            `Next: ${question.answerCommand}`,
          ]
        : ['Run `skopos setup review .` to see the recommendation and alternatives.']),
    );
  }

  if (mode === 'review') {
    lines.push('', 'Setup areas:');
    for (const lane of state.lanes) {
      lines.push(`- ${lane.title}: ${humanLaneStatus(lane.status)}`);
      if (lane.blocker) lines.push(`  ${lane.blocker}`);
    }
    if (openRecommendations.length > 0) {
      lines.push('', 'Recommendations:');
      for (const recommendation of openRecommendations) {
        lines.push(
          `- ${recommendation.id}: ${recommendation.title}`,
          `  Why: ${recommendation.reason}`,
          `  Recommended: ${recommendation.defaultDisposition}`,
          `  Choose: skopos setup decide ${recommendation.id} ${recommendation.defaultDisposition} . --actor <id>`,
        );
      }
    }
    const deferred = state.dispositions.filter(
      (decision) => decision.disposition === 'defer',
    );
    if (deferred.length > 0) {
      lines.push(
        '',
        'Deferred for later:',
        ...deferred.map((entry) => `- ${entry.recommendationId}`),
      );
    }
  }

  if (state.invalidatedDispositionIds.length > 0) {
    lines.push(
      '',
      'Some earlier choices need review because their project evidence changed:',
      ...state.invalidatedDispositionIds.map((id) => `- ${id}`),
    );
  }

  lines.push('', 'Next:', state.nextCommand);
  if (state.stage === 'inspection-required') {
    lines.push(
      'Your coding agent should follow the generated setup brief, explain what it found in plain language, and ask only for decisions that change project truth.',
    );
  }
  writeLines(lines);
};

const parseSetupArgs = (args: string[]): ParsedSetupArgs => {
  let cwd = process.cwd();
  let actor: string | undefined;
  let host: string | undefined;
  let sessionId: string | undefined;
  let note: string | undefined;
  let contextMarker: string | undefined;
  let contextDigest: string | undefined;
  let dryRun = false;
  let json = false;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') {
      json = true;
      continue;
    }
    if (argument === '--dry-run') {
      dryRun = true;
      continue;
    }
    if (['--actor', '--host', '--session-id', '--note', '--context-marker', '--context-digest'].includes(argument)) {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error(`Missing value for ${argument}.`);
      }
      if (argument === '--actor') actor = value;
      if (argument === '--host') host = value;
      if (argument === '--session-id') sessionId = value;
      if (argument === '--note') note = value;
      if (argument === '--context-marker') contextMarker = value;
      if (argument === '--context-digest') contextDigest = value;
      index += 1;
      continue;
    }
    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos setup flag: ${argument}`);
    }
    if (targetProvided) throw new Error(`Unexpected extra setup target: ${argument}`);
    cwd = resolve(argument);
    targetProvided = true;
  }
  return { cwd, actor, host, sessionId, note, contextMarker, contextDigest, dryRun, json };
};

const isDisposition = (
  value: string | undefined,
): value is SkoposSetupDispositionKind =>
  value === 'accept' || value === 'edit' || value === 'defer' || value === 'reject';

const humanStage = (stage: SkoposSetupRuntimeResult['state']['stage']): string =>
  ({
    'inspection-required': 'Your coding agent needs to understand the project',
    'questions-open': 'Waiting for a project decision',
    'plan-ready': 'Setup plan ready for review',
    applying: 'Applying the approved setup',
    'verification-blocked': 'Setup needs attention before it is ready',
    'setup-ready': 'Ready for ongoing coding-agent work',
    'setup-ready-with-deferred-options': 'Ready, with optional improvements deferred',
  })[stage];

const humanStep = (step: string): string =>
  ({
    understand: 'Understand the project',
    clarify: 'Clarify important unknowns',
    review: 'Review the recommended setup',
    apply: 'Apply accepted improvements',
    verify: 'Verify the setup',
    complete: 'Continue normal project work',
  })[step] ?? step;

const humanLaneStatus = (status: string): string =>
  ({
    ready: 'ready',
    'needs-review': 'needs review',
    blocked: 'blocked',
    deferred: 'ready with an optional improvement deferred',
  })[status] ?? status;
