import { resolve } from 'node:path';

import {
  assessSkoposTaskReadinessRuntime,
  finishSkoposTaskRuntime,
  verifySkoposTaskRuntime,
} from '@skopos/runtime';
import type {
  SkoposReadinessTarget,
  SkoposVerificationPhase,
} from '@skopos/model';

import { writeJsonOutput, writeLines } from '../shared/output.js';

export const runVerifyCommand = async (args: string[]): Promise<void> => {
  const parsed = parseVerificationArgs(args, 'verify');
  const result = await verifySkoposTaskRuntime({
    cwd: parsed.cwd,
    taskId: parsed.taskId,
    phase: parsed.phase,
    dryRun: parsed.dryRun,
  });
  if (parsed.json) {
    writeJsonOutput(parsed.compact ? buildCompactVerificationOutput(result) : result);
    return;
  }
  writeLines([
    'Skopos Verify',
    `Task: ${result.taskId}`,
    `Phase: ${result.phase}`,
    `Status: ${result.verificationStatus}`,
    `Summary: ${result.summary}`,
    `Changed paths: ${result.changedPaths.length}`,
    `Guards: ${result.matchedGuards.length}`,
    `Action Evidence: ${result.actionEvidence.filter((entry) => entry.status === 'pass').length}/${result.actionEvidence.length} valid`,
    `Acceptance: ${result.acceptanceCoverage.filter((entry) => entry.status === 'covered').length}/${result.acceptanceCoverage.length} covered`,
    ...(result.blockers.length > 0
      ? ['Blockers:', ...result.blockers.map((blocker) => `- ${blocker}`)]
      : []),
  ]);
};

export const runReadinessCommand = async (args: string[]): Promise<void> => {
  const parsed = parseVerificationArgs(args, 'readiness');
  const result = await assessSkoposTaskReadinessRuntime({
    cwd: parsed.cwd,
    taskId: parsed.taskId,
    target: parsed.target,
    actor: parsed.actor,
    advance: parsed.advance,
    dryRun: parsed.dryRun,
  });
  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }
  writeLines([
    'Skopos Readiness',
    `Task: ${result.taskId}`,
    `Target: ${result.target}`,
    `Readiness: ${result.readiness}`,
    `Summary: ${result.summary}`,
    `Evidence: ${result.evidenceSummary.valid}/${result.evidenceSummary.required} valid`,
    ...(result.blockers.length > 0
      ? ['Blockers:', ...result.blockers.map((blocker) => `- ${blocker}`)]
      : []),
  ]);
};

export const runFinishCommand = async (args: string[]): Promise<void> => {
  const parsed = parseVerificationArgs(args, 'finish');
  const result = await finishSkoposTaskRuntime({
    cwd: parsed.cwd,
    taskId: parsed.taskId,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });
  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }
  writeLines([
    'Skopos Finish',
    `Task: ${result.taskId}`,
    `Status: ${result.readiness}`,
    `State: ${result.taskState}`,
    `Summary: ${result.summary}`,
    `Evidence: ${result.evidenceSummary.valid}/${result.evidenceSummary.required} valid`,
    ...(result.blockers.length > 0
      ? ['Blockers:', ...result.blockers.map((blocker) => `- ${blocker}`)]
      : []),
  ]);
};

const parseVerificationArgs = (
  args: string[],
  command: 'verify' | 'readiness' | 'finish',
): {
  taskId: string;
  cwd: string;
  phase: SkoposVerificationPhase;
  target: SkoposReadinessTarget;
  actor?: string;
  advance: boolean;
  dryRun: boolean;
  compact: boolean;
  json: boolean;
} => {
  let taskId: string | undefined;
  let cwd = process.cwd();
  let phase: SkoposVerificationPhase = 'closure';
  let target: SkoposReadinessTarget = 'integrate';
  let dryRun = false;
  let actor: string | undefined;
  let advance = false;
  let compact = true;
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') json = true;
    else if (argument === '--compact') compact = true;
    else if (argument === '--full') compact = false;
    else if (argument === '--dry-run') dryRun = true;
    else if (argument === '--advance') advance = true;
    else if (argument === '--actor') actor = requireValue(args, ++index, '--actor');
    else if (argument.startsWith('--actor=')) actor = argument.slice('--actor='.length);
    else if (argument === '--phase') {
      phase = parsePhase(requireValue(args, ++index, '--phase'));
    } else if (argument.startsWith('--phase=')) {
      phase = parsePhase(argument.slice('--phase='.length));
    } else if (argument === '--for') {
      target = parseTarget(requireValue(args, ++index, '--for'));
    } else if (argument.startsWith('--for=')) {
      target = parseTarget(argument.slice('--for='.length));
    } else if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos ${command} flag: ${argument}`);
    } else if (!taskId) taskId = argument;
    else cwd = resolve(argument);
  }
  if (!taskId) throw new Error(`Missing Task id for skopos ${command}.`);
  return { taskId, cwd, phase, target, actor, advance, dryRun, compact, json };
};

export const buildCompactVerificationOutput = (
  result: Awaited<ReturnType<typeof verifySkoposTaskRuntime>>,
) => ({
  schemaVersion: 1,
  id: result.id,
  type: 'verification-summary',
  status: result.status,
  workspaceRoot: result.workspaceRoot,
  taskId: result.taskId,
  phase: result.phase,
  risk: result.risk,
  verificationStatus: result.verificationStatus,
  summary: result.summary,
  changedPathCount: result.changedPaths.length,
  matchedGuardIds: result.matchedGuards.map((guard) => guard.id),
  actionEvidence: {
    valid: result.actionEvidence.filter((entry) => entry.status === 'pass').length,
    required: result.actionEvidence.length,
    missingActionIds: result.actionEvidence
      .filter((entry) => entry.status === 'fail')
      .map((entry) => entry.id),
  },
  acceptance: {
    covered: result.acceptanceCoverage.filter((entry) => entry.status === 'covered').length,
    required: result.acceptanceCoverage.length,
    missingRequirementIds: result.acceptanceCoverage
      .filter((entry) => entry.status === 'missing')
      .map((entry) => entry.requirementId),
  },
  blockers: result.blockers,
});

const parsePhase = (value: string): SkoposVerificationPhase => {
  if (['admission', 'iteration', 'stabilization', 'closure'].includes(value)) {
    return value as SkoposVerificationPhase;
  }
  throw new Error(`Unknown verification phase: ${value}`);
};

const parseTarget = (value: string): SkoposReadinessTarget => {
  if (['continue', 'integrate', 'close'].includes(value)) {
    return value as SkoposReadinessTarget;
  }
  throw new Error(`Unknown Readiness target: ${value}`);
};

const requireValue = (args: string[], index: number, flag: string): string => {
  const value = args[index];
  if (!value || value.startsWith('-')) throw new Error(`Missing value for ${flag}.`);
  return value;
};
