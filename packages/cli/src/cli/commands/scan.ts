import { resolve } from 'node:path';

import { buildSkoposScanRuntime } from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedScanArgs {
  cwd: string;
  subtreeTarget?: string;
  actor?: string;
  json: boolean;
}

export const runScanCommand = async (args: string[]): Promise<void> => {
  const parsed = parseScanArgs(args);
  const result = await buildSkoposScanRuntime({
    cwd: parsed.cwd,
    subtreeTarget: parsed.subtreeTarget,
    actor: parsed.actor,
  });

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  const lines = [
    'Skopos scan',
    `- workspace: ${result.workspaceRoot}`,
    `- actor: ${result.actorId ?? '(none)'}`,
    `- diagnosis: ${result.diagnosisPath} (${result.diagnosisWrite})`,
    `- health: ${result.health}`,
    `- confidence: ${result.confidence}`,
    `- packages detected: ${result.packageCount}/${result.workspacePackageCount}`,
    `- summary: ${result.summary}`,
    '- findings:',
    ...result.findings.map(
      (finding) => `  - [${finding.classification}/${finding.severity}] ${finding.summary}`,
    ),
  ];

  if (result.focusSubtree) {
    lines.splice(2, 0, `- focus subtree: ${result.focusSubtree}`);
  }

  if (result.remediationMissions.length > 0) {
    lines.push('- remediation:');
    for (const mission of result.remediationMissions) {
      lines.push(`  - [${mission.priority}] ${mission.title}: ${mission.detail}`);
    }
  }

  writeLines(lines);
};

const parseScanArgs = (args: string[]): ParsedScanArgs => {
  let cwd = process.cwd();
  let json = false;
  let actor: string | undefined;
  let subtreeTarget: string | undefined;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--json') {
      json = true;
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
      throw new Error(`Unknown Skopos scan flag: ${argument}`);
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra scan target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  return { cwd, json, subtreeTarget, actor };
};
