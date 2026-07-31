import { resolve } from 'node:path';

import { recordSkoposObservationEvidenceRuntime } from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

export const runEvidenceCommand = async (args: string[]): Promise<void> => {
  const parsed = parseEvidenceArgs(args);
  if (parsed.subcommand !== 'record-observation') {
    throw new Error(`Unknown Skopos Evidence subcommand: ${parsed.subcommand ?? '(missing)'}`);
  }
  const artifact = await recordSkoposObservationEvidenceRuntime({
    cwd: parsed.cwd,
    taskId: parsed.taskId,
    requirementId: parsed.requirementId,
    guardIds: parsed.guardIds,
    statement: parsed.statement,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });
  if (parsed.json) {
    writeJsonOutput(
      parsed.compact
        ? {
            schemaVersion: 1,
            id: artifact.id,
            type: 'observation-evidence-summary',
            status: artifact.status,
            workspaceRoot: artifact.workspaceRoot,
            taskId: artifact.taskId,
            requirementId: artifact.requirementId,
            guardIds: artifact.guardIds,
            statement: artifact.statement,
            observedByActorId: artifact.observedByActorId,
            observedAt: artifact.observedAt,
            sourceStateDigest: artifact.sourceStateDigest,
            sourcePathCount: artifact.sourcePathStates.length,
          }
        : artifact,
    );
    return;
  }
  writeLines([
    'Skopos Evidence',
    `Task: ${artifact.taskId}`,
    `Evidence: ${artifact.id}`,
    `Observed by: ${artifact.observedByActorId}`,
    `Acceptance requirement: ${artifact.requirementId ?? '(none)'}`,
    `Guards: ${artifact.guardIds.join(', ') || '(none)'}`,
    `Statement: ${artifact.statement}`,
    `Source digest: ${artifact.sourceStateDigest}`,
  ]);
};

const parseEvidenceArgs = (args: string[]) => {
  const positionals: string[] = [];
  let cwd = process.cwd();
  let requirementId: string | undefined;
  const guardIds: string[] = [];
  let statement = '';
  let actor: string | undefined;
  let dryRun = false;
  let compact = true;
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') json = true;
    else if (argument === '--compact') compact = true;
    else if (argument === '--full') compact = false;
    else if (argument === '--dry-run') dryRun = true;
    else if (argument === '--requirement') requirementId = requireValue(args, ++index, '--requirement');
    else if (argument.startsWith('--requirement=')) requirementId = argument.slice('--requirement='.length);
    else if (argument === '--guard') guardIds.push(requireValue(args, ++index, '--guard'));
    else if (argument.startsWith('--guard=')) guardIds.push(argument.slice('--guard='.length));
    else if (argument === '--statement') statement = requireValue(args, ++index, '--statement');
    else if (argument.startsWith('--statement=')) statement = argument.slice('--statement='.length);
    else if (argument === '--actor') actor = requireValue(args, ++index, '--actor');
    else if (argument.startsWith('--actor=')) actor = argument.slice('--actor='.length);
    else if (argument.startsWith('-')) throw new Error(`Unknown Skopos Evidence flag: ${argument}`);
    else positionals.push(argument);
  }
  const [subcommand, taskId, target] = positionals;
  if (!taskId) throw new Error('Evidence recording requires a Task id.');
  if (target) cwd = resolve(target);
  return {
    subcommand,
    taskId,
    cwd,
    requirementId,
    guardIds,
    statement,
    actor,
    dryRun,
    compact,
    json,
  };
};

const requireValue = (args: string[], index: number, flag: string): string => {
  const value = args[index];
  if (!value || value.startsWith('-')) throw new Error(`Missing value for ${flag}.`);
  return value;
};
