import { resolve } from 'node:path';

import { initSkoposProject } from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedInitArgs {
  cwd: string;
  mode: 'existing' | 'greenfield';
  subtreeTarget?: string;
  actor?: string;
  dryRun: boolean;
  force: boolean;
  scaffoldInstructions: boolean;
  forceInstructions: boolean;
  json: boolean;
}

export const runInitCommand = async (args: string[]): Promise<void> => {
  const parsed = parseInitArgs(args);
  const result = await initSkoposProject(parsed);

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  writeLines(renderInitSummary(result));
};

const parseInitArgs = (args: string[]): ParsedInitArgs => {
  let cwd = process.cwd();
  let mode: ParsedInitArgs['mode'] = 'existing';
  let subtreeTarget: string | undefined;
  let actor: string | undefined;
  let dryRun = false;
  let force = false;
  let scaffoldInstructions = true;
  let forceInstructions = false;
  let json = false;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (argument === '--force') {
      force = true;
      continue;
    }

    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--scaffold-instructions') {
      scaffoldInstructions = true;
      continue;
    }

    if (argument === '--no-scaffold-instructions') {
      scaffoldInstructions = false;
      continue;
    }

    if (argument === '--force-instructions') {
      forceInstructions = true;
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

    if (argument === '--mode' || argument === '-m') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --mode.');
      }
      mode = parseMode(nextValue);
      index += 1;
      continue;
    }

    if (argument.startsWith('--mode=')) {
      mode = parseMode(argument.slice('--mode='.length));
      continue;
    }

    if (argument === '--subtree') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --subtree.');
      }
      subtreeTarget = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--subtree=')) {
      subtreeTarget = argument.slice('--subtree='.length);
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos init flag: ${argument}`);
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra init target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  return {
    cwd,
    mode,
    subtreeTarget,
    actor,
    dryRun,
    force,
    scaffoldInstructions,
    forceInstructions,
    json,
  };
};

const parseMode = (value: string): ParsedInitArgs['mode'] => {
  if (value === 'existing' || value === 'greenfield') {
    return value;
  }

  throw new Error(`Unsupported init mode: ${value}`);
};

const renderInitSummary = (result: Awaited<ReturnType<typeof initSkoposProject>>): string[] => {
  const lines = [
    'Skopos init summary',
    `- workspace: ${result.bootstrap.workspaceRoot}`,
    `- mode: ${result.bootstrap.mode}`,
    `- actor: ${result.actorId ?? '(none)'}`,
    `- repo mode: ${result.bootstrap.detected.repoMode}`,
    `- archetype: ${result.bootstrap.detected.archetypeSuggestion}`,
    `- packages detected: ${result.bootstrap.detected.packageCount}`,
    `- workspace packages: ${result.bootstrap.detected.workspacePackageCount}`,
    `- docs roots: ${result.bootstrap.detected.docsRoots.join(', ') || '(none)'}`,
    `- instruction files: ${result.bootstrap.detected.instructionFiles.join(', ') || '(none)'}`,
    `- config: ${result.configPath} (${result.configWrite})`,
    result.instructionScaffold
      ? `- instructions: ${result.instructionScaffold.path} (${result.instructionScaffold.status})`
      : '- instructions: (not scaffolded)',
    `- bootstrap: ${result.bootstrapPath} (${result.bootstrapWrite})`,
    `- scopes-lite: ${result.scopesLitePath} (${result.scopesLiteWrite})`,
    `- diagnosis: ${result.diagnosisPath} (${result.diagnosisWrite})`,
    `- architecture: ${result.architecturePath} (${result.architectureWrite})`,
    `- enforcement: ${result.enforcementPath} (${result.enforcementWrite})`,
    `- index: ${result.indexPath} (${result.indexWrite})`,
    `- log: ${result.logPath} (${result.logWrite})`,
    `- workspace graph: ${result.workspaceGraphPath} (${result.workspaceGraphWrite})`,
    `- health: ${result.diagnosis.health}`,
    `- architecture alignment: ${result.architecture.alignmentStatus}`,
  ];

  if (result.bootstrap.focusSubtree) {
    lines.splice(4, 0, `- focus subtree: ${result.bootstrap.focusSubtree}`);
  }

  if (result.graphArtifacts.length > 1) {
    lines.push('- graph artifacts:');
    for (const graphArtifact of result.graphArtifacts) {
      if (graphArtifact.path === result.workspaceGraphPath) {
        continue;
      }
      lines.push(`  - ${graphArtifact.kind}: ${graphArtifact.path} (${graphArtifact.write})`);
    }
  }

  if (result.toolAdapterArtifacts.length > 0) {
    lines.push('- tool adapters:');
    for (const toolAdapter of result.toolAdapterArtifacts) {
      lines.push(`  - ${toolAdapter.toolId}: ${toolAdapter.path}`);
    }
  }

  if (result.bootstrap.detected.findings.length > 0) {
    lines.push('- findings:');
    for (const finding of result.bootstrap.detected.findings) {
      lines.push(`  - ${finding}`);
    }
  }

  if (result.bootstrap.recommendedNextSteps.length > 0) {
    lines.push('- next steps:');
    for (const step of result.bootstrap.recommendedNextSteps) {
      lines.push(`  - ${step}`);
    }
  }

  if (result.bootstrap.recommendedQuestions.length > 0) {
    lines.push('- questions:');
    for (const question of result.bootstrap.recommendedQuestions) {
      const recommendedOption = question.options.find(
        (option) => option.id === question.recommendedOptionId,
      );
      lines.push(`  - ${question.question}`);
      lines.push(`    recommended: ${recommendedOption?.label ?? question.recommendedOptionId}`);
    }
  }

  return lines;
};
