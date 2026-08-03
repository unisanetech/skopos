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
import { paginateCollection, parseCollectionLimit } from '../shared/pagination.js';

type VerificationDetailCollection =
  | 'changed-paths'
  | 'pre-existing-paths'
  | 'other-task-paths'
  | 'external-paths'
  | 'path-attributions'
  | 'matched-guards'
  | 'action-evidence'
  | 'acceptance'
  | 'blockers';

export const runVerifyCommand = async (args: string[]): Promise<void> => {
  const parsed = parseVerificationArgs(args, 'verify');
  const result = await verifySkoposTaskRuntime({
    cwd: parsed.cwd,
    taskId: parsed.taskId,
    phase: parsed.phase,
    dryRun: parsed.dryRun,
  });
  if (parsed.json) {
    writeJsonOutput(
      parsed.collection
        ? buildPagedVerificationDetailOutput(
            result,
            parsed.collection,
            parsed.cursor,
            parsed.limit,
          )
        : parsed.full
          ? buildVerificationDetailIndex(result)
          : buildCompactVerificationOutput(result),
    );
    return;
  }
  writeLines([
    'Skopos Verify',
    `Task: ${result.taskId}`,
    `Phase: ${result.phase}`,
    `Status: ${result.verificationStatus}`,
    `Summary: ${result.summary}`,
    `Changed paths: ${result.changedPaths.length}`,
    `Excluded other-Task paths: ${result.excludedOtherTaskPaths.length}`,
    `External unattributed paths: ${result.externalUnattributedPaths.length}`,
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
  full: boolean;
  collection?: VerificationDetailCollection;
  cursor?: string;
  limit?: number;
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
  let full = false;
  let collection: VerificationDetailCollection | undefined;
  let cursor: string | undefined;
  let limit: number | undefined;
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') json = true;
    else if (argument === '--compact') {
      compact = true;
      full = false;
    }
    else if (argument === '--full') {
      compact = false;
      full = true;
    }
    else if (argument === '--collection') collection = parseVerificationDetailCollection(requireValue(args, ++index, '--collection'));
    else if (argument.startsWith('--collection=')) collection = parseVerificationDetailCollection(argument.slice('--collection='.length));
    else if (argument === '--cursor') cursor = requireValue(args, ++index, '--cursor');
    else if (argument.startsWith('--cursor=')) cursor = argument.slice('--cursor='.length);
    else if (argument === '--limit') limit = parseCollectionLimit(requireValue(args, ++index, '--limit'));
    else if (argument.startsWith('--limit=')) limit = parseCollectionLimit(argument.slice('--limit='.length));
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
  if ((collection || full || cursor || limit) && command !== 'verify') {
    throw new Error('Verification detail collection flags are supported only by verify.');
  }
  return {
    taskId,
    cwd,
    phase,
    target,
    actor,
    advance,
    dryRun,
    compact,
    full,
    collection,
    cursor,
    limit,
    json,
  };
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
  pathAttribution: {
    taskProof: result.changedPaths.length,
    preExisting: result.ignoredPreExistingPaths.length,
    otherTask: result.excludedOtherTaskPaths.length,
    externalUnattributed: result.externalUnattributedPaths.length,
  },
  matchedGuardIds: result.matchedGuards.slice(0, 20).map((guard) => guard.id),
  additionalMatchedGuardCount: Math.max(0, result.matchedGuards.length - 20),
  actionEvidence: {
    valid: result.actionEvidence.filter((entry) => entry.status === 'pass').length,
    required: result.actionEvidence.length,
    missingActionIds: result.actionEvidence
      .filter((entry) => entry.status === 'fail')
      .slice(0, 20)
      .map((entry) => entry.id),
    additionalMissingActionCount: Math.max(
      0,
      result.actionEvidence.filter((entry) => entry.status === 'fail').length - 20,
    ),
  },
  acceptance: {
    covered: result.acceptanceCoverage.filter((entry) => entry.status === 'covered').length,
    required: result.acceptanceCoverage.length,
    missingRequirementIds: result.acceptanceCoverage
      .filter((entry) => entry.status === 'missing')
      .slice(0, 20)
      .map((entry) => entry.requirementId),
    additionalMissingRequirementCount: Math.max(
      0,
      result.acceptanceCoverage.filter((entry) => entry.status === 'missing').length - 20,
    ),
  },
  blockers: result.blockers,
});

export const buildPagedVerificationDetailOutput = (
  result: Awaited<ReturnType<typeof verifySkoposTaskRuntime>>,
  collection: VerificationDetailCollection,
  cursor?: string,
  limit?: number,
) => {
  const source = verificationDetailSource(result, collection);
  const page = paginateCollection(source, {
    collection: `verification.${collection}`,
    cursor,
    limit,
  });
  return {
    schemaVersion: 1,
    type: 'verification-detail-page',
    workspaceRoot: result.workspaceRoot,
    taskId: result.taskId,
    phase: result.phase,
    verificationStatus: result.verificationStatus,
    collection,
    items: page.items,
    page: page.page,
  };
};

export const buildVerificationDetailIndex = (
  result: Awaited<ReturnType<typeof verifySkoposTaskRuntime>>,
) => ({
  ...buildCompactVerificationOutput(result),
  type: 'verification-detail-index',
  detailCollections: verificationDetailCollections.map((collection) => ({
    collection,
    total: verificationDetailSource(result, collection).length,
    command: `skopos verify ${result.taskId} . --phase ${result.phase} --collection ${collection} --json`,
  })),
});

const verificationDetailCollections: VerificationDetailCollection[] = [
  'changed-paths',
  'pre-existing-paths',
  'other-task-paths',
  'external-paths',
  'path-attributions',
  'matched-guards',
  'action-evidence',
  'acceptance',
  'blockers',
];

const verificationDetailSource = (
  result: Awaited<ReturnType<typeof verifySkoposTaskRuntime>>,
  collection: VerificationDetailCollection,
): unknown[] => {
  if (collection === 'changed-paths') return result.changedPaths;
  if (collection === 'pre-existing-paths') return result.ignoredPreExistingPaths;
  if (collection === 'other-task-paths') return result.excludedOtherTaskPaths;
  if (collection === 'external-paths') return result.externalUnattributedPaths;
  if (collection === 'path-attributions') return result.pathAttributions;
  if (collection === 'matched-guards') return result.matchedGuards;
  if (collection === 'action-evidence') return result.actionEvidence;
  if (collection === 'acceptance') return result.acceptanceCoverage;
  return result.blockers;
};

const parseVerificationDetailCollection = (
  value: string,
): VerificationDetailCollection => {
  if (verificationDetailCollections.includes(value as VerificationDetailCollection)) {
    return value as VerificationDetailCollection;
  }
  throw new Error(`Unknown Verification detail collection: ${value}.`);
};

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
