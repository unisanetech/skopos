import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

import {
  buildSkoposDecideRuntime,
  enqueueSkoposEvalBackgroundJobRuntime,
  buildSkoposEvalRuntime,
  buildSkoposNextRuntime,
  buildSkoposPlanRuntime,
  buildSkoposStartRuntime,
} from '@skopos/runtime';

import {
  buildCompactBackgroundEvalLines,
  buildCompactBackgroundEvalOutput,
  buildCompactEvalLines,
  buildCompactEvalOutput,
} from '../shared/compact-output.js';
import {
  buildSummaryLines,
  parseFieldList,
  projectJsonOutput,
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

interface ParsedDecideArgs {
  cwd: string;
  questionId: string;
  optionId: string;
  actor?: string;
  dryRun: boolean;
  json: boolean;
}

interface ParsedNextArgs {
  cwd: string;
  mission?: string;
  actor?: string;
  dryRun: boolean;
  json: boolean;
}

interface ParsedEvalArgs {
  cwd: string;
  mission?: string;
  actor?: string;
  dryRun: boolean;
  background: boolean;
  compact: boolean;
  summary: boolean;
  fields: string[];
  json: boolean;
}

export const runStartCommand = async (args: string[]): Promise<void> => {
  const parsed = parsePlanArgs(args);
  const result = await buildSkoposStartRuntime({
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
    'Skopos start',
    `- goal: ${result.goal}`,
    `- scope: ${result.scope.scope.id}`,
    `- actor: ${result.actorId ?? '(none)'}`,
    `- summary: ${result.summary}`,
    `- code allowed: ${result.codeAllowed ? 'yes' : 'no'}`,
    `- execution surface: ${result.executionSurface.kind}`,
    `  reason: ${result.executionSurface.reason}`,
    `- plan: ${result.planPath}`,
    `- mission: ${result.missionPath} [${result.missionState}]`,
    `- questions: ${result.questionsPath} (${result.questionsWrite})`,
    `- recommendations: ${result.recommendationsPath} (${result.recommendationsWrite})`,
  ];

  if (result.recommendedAction) {
    lines.push(`- next: ${result.recommendedAction.title}`);
    lines.push(`  summary: ${result.recommendedAction.summary}`);
    if (result.recommendedAction.command) {
      lines.push(`  command: ${result.recommendedAction.command}`);
    }
  }

  if (result.blockingQuestions.length > 0) {
    lines.push('- blocking questions:');
    for (const question of result.blockingQuestions) {
      const recommendedOption = question.options.find(
        (option) => option.id === question.recommendedOptionId,
      );
      lines.push(`  - ${question.question}`);
      lines.push(`    recommended: ${recommendedOption?.label ?? question.recommendedOptionId}`);
    }
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

  const lines = [
    'Skopos decide',
    `- question: ${result.questionId}`,
    `- selected option: ${result.selectedOptionId}`,
    `- actor: ${result.actorId ?? '(none)'}`,
    `- summary: ${result.summary}`,
    `- code allowed: ${result.codeAllowed ? 'yes' : 'no'}`,
    `- execution surface: ${result.executionSurface.kind}`,
    `  reason: ${result.executionSurface.reason}`,
    `- questions: ${result.questionsPath} (${result.questionsWrite})`,
    `- recommendations: ${result.recommendationsPath} (${result.recommendationsWrite})`,
  ];

  if (result.missionPath && result.missionWrite) {
    lines.push(`- mission: ${result.missionPath} (${result.missionWrite})`);
  }

  if (result.recommendedAction) {
    lines.push(`- next: ${result.recommendedAction.title}`);
    lines.push(`  summary: ${result.recommendedAction.summary}`);
    if (result.recommendedAction.command) {
      lines.push(`  command: ${result.recommendedAction.command}`);
    }
  }

  writeLines(lines);
};

export const runNextCommand = async (args: string[]): Promise<void> => {
  const parsed = parseNextArgs(args);
  const result = await buildSkoposNextRuntime({
    cwd: parsed.cwd,
    mission: parsed.mission,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  const lines = [
    'Skopos next',
    `- mission: ${result.missionId}`,
    `- actor: ${result.actorId ?? '(none)'}`,
    `- summary: ${result.summary}`,
    `- code allowed: ${result.codeAllowed ? 'yes' : 'no'}`,
    `- execution surface: ${result.executionSurface.kind}`,
    `  reason: ${result.executionSurface.reason}`,
    `- mission path: ${result.missionPath}`,
    `- recommendations: ${result.recommendationsPath} (${result.recommendationsWrite})`,
    `- trust: ${result.trust.trustLevel} / ${result.trust.readiness}`,
  ];

  if (result.nextItem) {
    lines.push(`- next item: ${result.nextItem.title}`);
    lines.push(`  detail: ${result.nextItem.detail}`);
  }

  if (result.recommendedAction) {
    lines.push(`- recommended action: ${result.recommendedAction.title}`);
    lines.push(`  summary: ${result.recommendedAction.summary}`);
    if (result.recommendedAction.command) {
      lines.push(`  command: ${result.recommendedAction.command}`);
    }
  }

  if (result.blockingQuestions.length > 0) {
    lines.push('- blocking questions:');
    for (const question of result.blockingQuestions) {
      lines.push(`  - ${question.question}`);
    }
  }

  writeLines(lines);
};

export const runEvalCommand = async (args: string[]): Promise<void> => {
  const parsed = parseEvalArgs(args);
  if (parsed.background) {
    const result = await enqueueSkoposEvalBackgroundJobRuntime({
      cwd: parsed.cwd,
      mission: parsed.mission,
      actor: parsed.actor,
      dryRun: parsed.dryRun,
    });
    const output = parsed.compact ? buildCompactBackgroundEvalOutput(result) : result;

    if (!parsed.dryRun) {
      spawnBackgroundEvalJob(result.jobId, parsed.cwd);
    }

    if (parsed.json) {
      writeJsonOutput(
        projectJsonOutput(output, {
          summary: parsed.summary,
          fields: parsed.fields,
        }),
      );
      return;
    }

    if (parsed.summary) {
      writeLines(buildSummaryLines(output));
      return;
    }

    if (parsed.compact) {
      writeLines(buildCompactBackgroundEvalLines(result));
      return;
    }

    const lines = [
      'Skopos eval',
      '- mode: background',
      `- mission: ${result.missionId}`,
      `- actor: ${result.actorId ?? '(none)'}`,
      `- summary: ${result.summary}`,
      `- job: ${result.jobId} (${result.jobState})`,
      `- job path: ${result.jobPath}`,
      `- next: ${result.nextCommand}`,
    ];

    writeLines(lines);
    return;
  }

  const result = await buildSkoposEvalRuntime({
    cwd: parsed.cwd,
    mission: parsed.mission,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });
  const output = parsed.compact ? buildCompactEvalOutput(result) : result;

  if (parsed.json) {
    writeJsonOutput(
      projectJsonOutput(output, {
        summary: parsed.summary,
        fields: parsed.fields,
      }),
    );
    return;
  }

  if (parsed.summary) {
    writeLines(buildSummaryLines(output));
    return;
  }

  if (parsed.compact) {
    writeLines(buildCompactEvalLines(result));
    return;
  }

  const lines = [
    'Skopos eval',
    `- mission: ${result.missionId}`,
    `- actor: ${result.actorId ?? '(none)'}`,
    `- summary: ${result.summary}`,
    `- execution surface: ${result.executionSurface.kind}`,
    `  reason: ${result.executionSurface.reason}`,
    `- mission path: ${result.missionPath} (${result.missionWrite})`,
    `- eval: ${result.evalPath} (${result.evalWrite})`,
    `- recommendations: ${result.recommendationsPath} (${result.recommendationsWrite})`,
    `- status: ${result.eval.evaluationStatus}`,
    `- trust: ${result.eval.trust.trustLevel} / ${result.eval.trust.readiness}`,
  ];

  if (result.blockingQuestions.length > 0) {
    lines.push('- blocking questions:');
    for (const question of result.blockingQuestions) {
      lines.push(`  - ${question.question}`);
    }
  }

  if (result.eval.checkRuns.length > 0) {
    lines.push('- check runs:');
    for (const check of result.eval.checkRuns) {
      lines.push(`  - [${check.status}] ${check.command}`);
    }
  }

  if (result.recommendedAction) {
    lines.push(`- next: ${result.recommendedAction.title}`);
    lines.push(`  summary: ${result.recommendedAction.summary}`);
    if (result.recommendedAction.command) {
      lines.push(`  command: ${result.recommendedAction.command}`);
    }
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
    `- goal: ${result.goal}`,
    `- scope: ${result.scope.scope.id}`,
    `- confidence: ${result.confidence}`,
    `- actor: ${result.actorId ?? result.mission.coordination.lastUpdatedBy ?? '(none)'}`,
    `- summary: ${result.summary}`,
    `- plan: ${result.planPath} (${result.planWrite})`,
    `- mission: ${result.missionPath} (${result.missionWrite})`,
    `- graph: ${result.graphPath} (${result.graphWrite})`,
    '- implementation steps:',
    ...result.implementationSteps.map((step) => `  - ${step.title}: ${step.detail}`),
  ];

  if (result.recommendedChecks.length > 0) {
    lines.push('- recommended checks:');
    for (const check of result.recommendedChecks) {
      lines.push(`  - ${check}`);
    }
  }

  if (result.recommendedWorkflows.length > 0) {
    lines.push('- recommended workflows:');
    for (const workflow of result.recommendedWorkflows) {
      lines.push(`  - ${workflow.id}: ${workflow.reason}`);
    }
  }

  if (result.decisionQuestions.length > 0) {
    lines.push('- decision questions:');
    for (const question of result.decisionQuestions) {
      const recommendedOption = question.options.find(
        (option) => option.id === question.recommendedOptionId,
      );
      lines.push(`  - ${question.question}`);
      lines.push(`    recommended: ${recommendedOption?.label ?? question.recommendedOptionId}`);
    }
  }

  writeLines(lines);
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
    throw new Error('Missing workflow question id.');
  }

  if (!optionId || optionId.trim().length === 0) {
    throw new Error('Missing workflow option id.');
  }

  return { cwd, questionId, optionId, actor, dryRun, json };
};

const parseNextArgs = (args: string[]): ParsedNextArgs => {
  let cwd = process.cwd();
  let mission: string | undefined;
  let actor: string | undefined;
  let dryRun = false;
  let compact = false;
  let summary = false;
  let fields: string[] = [];
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

    if (argument === '--compact') {
      compact = true;
      continue;
    }

    if (argument === '--summary') {
      summary = true;
      continue;
    }

    if (argument === '--fields') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --fields.');
      }
      fields = parseFieldList(nextValue);
      index += 1;
      continue;
    }

    if (argument.startsWith('--fields=')) {
      fields = parseFieldList(argument.slice('--fields='.length));
      continue;
    }

    if (argument === '--mission') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --mission.');
      }
      mission = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--mission=')) {
      mission = argument.slice('--mission='.length);
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
      throw new Error(`Unknown Skopos next flag: ${argument}`);
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra next target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  return { cwd, mission, actor, dryRun, json };
};

const parseEvalArgs = (args: string[]): ParsedEvalArgs => {
  let cwd = process.cwd();
  let mission: string | undefined;
  let actor: string | undefined;
  let dryRun = false;
  let background = false;
  let compact = false;
  let summary = false;
  let fields: string[] = [];
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

    if (argument === '--background') {
      background = true;
      continue;
    }

    if (argument === '--compact') {
      compact = true;
      continue;
    }

    if (argument === '--summary') {
      summary = true;
      continue;
    }

    if (argument === '--fields') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --fields.');
      }
      fields = parseFieldList(nextValue);
      index += 1;
      continue;
    }

    if (argument.startsWith('--fields=')) {
      fields = parseFieldList(argument.slice('--fields='.length));
      continue;
    }

    if (argument === '--mission') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --mission.');
      }
      mission = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--mission=')) {
      mission = argument.slice('--mission='.length);
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
      throw new Error(`Unknown Skopos eval flag: ${argument}`);
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra eval target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  if (summary && fields.length > 0) {
    throw new Error('Use either --summary or --fields, not both.');
  }

  if (fields.length > 0 && !json) {
    throw new Error('Field selection requires --json.');
  }

  return { cwd, mission, actor, dryRun, background, compact, summary, fields, json };
};

const spawnBackgroundEvalJob = (jobId: string, cwd: string): void => {
  const cliEntrypoint = process.argv[1];
  if (!cliEntrypoint) {
    throw new Error('Unable to resolve the current Skopos CLI entrypoint for background execution.');
  }

  const child = spawn(
    process.execPath,
    [...process.execArgv, cliEntrypoint, 'jobs', 'run-eval', jobId, cwd],
    {
      cwd: process.cwd(),
      detached: true,
      stdio: 'ignore',
      env: process.env,
    },
  );

  child.unref();
};
