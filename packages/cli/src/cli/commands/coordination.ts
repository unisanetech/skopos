import { resolve } from 'node:path';

import type {
  SkoposCoordinationResourceKind,
  SkoposCoordinationSessionMode,
  SkoposMutationOperation,
} from '@skopos/model';
import {
  auditSkoposCoordinationTask,
  beginSkoposCoordinationMutation,
  claimSkoposCoordinationResource,
  closeSkoposCoordinationSession,
  completeSkoposCoordinationMutation,
  getSkoposCoordinationStatus,
  heartbeatSkoposCoordinationSession,
  openSkoposCoordinationSession,
  recoverSkoposCoordinationTask,
  releaseSkoposCoordinationTask,
  reserveSkoposCoordinationTask,
  snapshotSkoposCoordinationTask,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

export const runCoordinationCommand = async (args: string[]): Promise<void> => {
  const [family, operation, ...rest] = args;

  if (family === 'status') {
    const parsed = parseCommonArgs(args.slice(1));
    const result = await getSkoposCoordinationStatus({ cwd: parsed.cwd });
    if (parsed.json) return writeJsonOutput(result);
    writeLines([
      'Skopos coordination status',
      `Enforcement: ${result.enforcementLevel} (preventive safety: no)`,
      `Sessions: ${result.sessions.length}`,
      `Task reservations: ${result.reservations.length}`,
      `Resource claims: ${result.claims.length}`,
      `Mutations: ${result.mutations.length}`,
      `Open contamination: ${result.contamination.filter((entry) => entry.state === 'open').length}`,
      `Database: ${result.databasePath}`,
      ...result.sessions.map(
        (session) =>
          `- Session ${session.sessionId}: ${session.state}, ${session.mode}, actor ${session.actorId}, lease ${session.leaseExpiresAt}`,
      ),
      ...result.reservations.map(
        (reservation) =>
          `- Task ${reservation.taskId}: Session ${reservation.sessionId} (${reservation.actorId})`,
      ),
      ...result.claims.map(
        (claim) =>
          `- Claim ${claim.resourceKind}:${claim.resourceKey}: Task ${claim.taskId}, Session ${claim.sessionId}`,
      ),
    ]);
    return;
  }

  if (family === 'session' && operation === 'open') {
    const parsed = parseSessionOpenArgs(rest);
    const result = await openSkoposCoordinationSession(parsed);
    if (parsed.json) return writeJsonOutput(result);
    writeLines([
      'Skopos coordination session open',
      `Session: ${result.session.sessionId}`,
      `Actor: ${result.session.actorId}`,
      `Mode: ${result.session.mode}`,
      `Lease expires: ${result.session.leaseExpiresAt}`,
      `Enforcement: ${result.enforcementLevel}; agents must call claim commands cooperatively`,
    ]);
    return;
  }

  if (family === 'session' && operation === 'heartbeat') {
    const parsed = parseSessionIdentityArgs(rest, true);
    const result = await heartbeatSkoposCoordinationSession({
      cwd: parsed.cwd,
      sessionId: parsed.sessionId,
      leaseSeconds: parsed.leaseSeconds,
    });
    if (parsed.json) return writeJsonOutput(result);
    writeLines([
      'Skopos coordination session heartbeat',
      `Session: ${result.session.sessionId}`,
      `State: ${result.session.state}`,
      `Lease expires: ${result.session.leaseExpiresAt}`,
    ]);
    return;
  }

  if (family === 'session' && operation === 'close') {
    const parsed = parseSessionIdentityArgs(rest, false);
    const result = await closeSkoposCoordinationSession({
      cwd: parsed.cwd,
      sessionId: parsed.sessionId,
    });
    if (parsed.json) return writeJsonOutput(result);
    writeLines([
      'Skopos coordination session close',
      `Session: ${result.session.sessionId}`,
      `State: ${result.session.state}`,
    ]);
    return;
  }

  if (family === 'task' && operation === 'reserve') {
    const [taskId, ...remaining] = rest;
    if (!taskId) throw new Error('Missing Task id for coordination reservation.');
    const parsed = parseTaskArgs(remaining, false);
    const result = await reserveSkoposCoordinationTask({
      cwd: parsed.cwd,
      sessionId: parsed.sessionId,
      taskId,
    });
    if (parsed.json) return writeJsonOutput(result);
    writeLines([
      'Skopos coordination task reserve',
      `Task: ${result.reservation.taskId}`,
      `Session: ${result.reservation.sessionId}`,
      `Actor: ${result.reservation.actorId}`,
    ]);
    return;
  }

  if (family === 'task' && operation === 'release') {
    const [taskId, ...remaining] = rest;
    if (!taskId) throw new Error('Missing Task id for coordination release.');
    const parsed = parseTaskArgs(remaining, true);
    const result = await releaseSkoposCoordinationTask({
      cwd: parsed.cwd,
      sessionId: parsed.sessionId,
      taskId,
      reason: parsed.reason!,
    });
    if (parsed.json) return writeJsonOutput(result);
    writeLines([
      'Skopos coordination task release',
      `Task: ${result.releasedTaskId}`,
      `Claims released: ${result.releasedClaimCount}`,
      `Reason: ${result.reason}`,
    ]);
    return;
  }

  if (family === 'task' && operation === 'audit') {
    const [taskId, ...remaining] = rest;
    if (!taskId) throw new Error('Missing Task id for coordination audit.');
    const parsed = parseCommonArgs(remaining);
    const result = await auditSkoposCoordinationTask({ cwd: parsed.cwd, taskId });
    if (parsed.json) return writeJsonOutput(result);
    writeLines([
      'Skopos coordination task audit',
      `Task: ${result.taskId}`,
      `Clean: ${result.clean ? 'yes' : 'no'}`,
      `Contamination: ${result.contamination.length}`,
      ...result.contamination.map((entry) => `- ${entry.path}: ${entry.reason}`),
    ]);
    return;
  }

  if (family === 'task' && operation === 'recover') {
    const [taskId, ...remaining] = rest;
    if (!taskId) throw new Error('Missing Task id for coordination recovery.');
    const parsed = parseFlags(remaining, ['session', 'operation', 'reason']);
    const recoveryOperation = requireFlag(parsed.flags, 'operation');
    if (recoveryOperation !== 'resume' && recoveryOperation !== 'release') {
      throw new Error(`Unknown Task recovery operation: ${recoveryOperation}.`);
    }
    const result = await recoverSkoposCoordinationTask({
      cwd: parsed.cwd,
      taskId,
      sessionId: requireFlag(parsed.flags, 'session'),
      operation: recoveryOperation,
      reason: requireFlag(parsed.flags, 'reason'),
    });
    if (parsed.json) return writeJsonOutput(result);
    writeLines([
      'Skopos coordination task recovery',
      `Task: ${result.taskId}`,
      `Prior Session: ${result.priorSessionId}`,
      `Session: ${result.sessionId}`,
      `Actor: ${result.actorId}`,
      `Generation: ${result.generation}`,
      `Outcome: ${result.outcome}`,
      `Ledger: ${result.ledgerState.recorded} recorded, ${result.ledgerState.open} open, ${result.ledgerState.contaminated} contaminated`,
      `Reason: ${result.reason}`,
    ]);
    return;
  }

  if (family === 'task' && operation === 'snapshot') {
    const [taskId, ...remaining] = rest;
    if (!taskId) throw new Error('Missing Task id for coordination snapshot.');
    const parsed = parseTaskArgs(remaining, false);
    const result = await snapshotSkoposCoordinationTask({
      cwd: parsed.cwd,
      taskId,
      sessionId: parsed.sessionId,
    });
    if (parsed.json) return writeJsonOutput(result);
    writeLines([
      'Skopos coordination task snapshot',
      `Task: ${result.snapshot.taskId}`,
      `Snapshot: ${result.snapshot.snapshotId}`,
      `Digest: ${result.snapshot.digest}`,
      `Artifact: ${result.snapshot.artifactPath}`,
    ]);
    return;
  }

  if (family === 'mutation' && operation === 'begin') {
    const [mutationOperation, path, ...remaining] = rest;
    if (!mutationOperation || !path) {
      throw new Error(
        'Usage: skopos coordination mutation begin <create|edit|delete|rename> <path> [target] --task <id> --session <id>.',
      );
    }
    const parsed = parseClaimArgs(remaining);
    const result = await beginSkoposCoordinationMutation({
      cwd: parsed.cwd,
      taskId: parsed.taskId,
      sessionId: parsed.sessionId,
      path,
      operation: mutationOperation as SkoposMutationOperation,
    });
    if (parsed.json) return writeJsonOutput(result);
    writeLines([
      'Skopos coordination mutation begin',
      `Mutation: ${result.mutation.mutationId}`,
      `Path: ${result.mutation.path}`,
      `Before: ${result.mutation.beforeDigest}`,
    ]);
    return;
  }

  if (family === 'mutation' && operation === 'complete') {
    const [mutationId, ...remaining] = rest;
    if (!mutationId) throw new Error('Missing coordination mutation id.');
    const parsed = parseSessionIdentityArgs(remaining, false);
    const result = await completeSkoposCoordinationMutation({
      cwd: parsed.cwd,
      sessionId: parsed.sessionId,
      mutationId,
    });
    if (parsed.json) return writeJsonOutput(result);
    writeLines([
      'Skopos coordination mutation complete',
      `Mutation: ${result.mutation.mutationId}`,
      `Path: ${result.mutation.path}`,
      `After: ${result.mutation.afterDigest ?? '(missing)'}`,
    ]);
    return;
  }

  if (family === 'claim' && operation === 'add') {
    const [resourceKind, resourceKey, ...remaining] = rest;
    if (!resourceKind || !resourceKey) {
      throw new Error(
        'Usage: skopos coordination claim add <kind> <resource> [target] --task <id> --session <id>.',
      );
    }
    const parsed = parseClaimArgs(remaining);
    const result = await claimSkoposCoordinationResource({
      cwd: parsed.cwd,
      sessionId: parsed.sessionId,
      taskId: parsed.taskId,
      resourceKind: resourceKind as SkoposCoordinationResourceKind,
      resourceKey,
    });
    if (parsed.json) return writeJsonOutput(result);
    writeLines([
      'Skopos coordination claim add',
      `Claim: ${result.claim.resourceKind}:${result.claim.resourceKey}`,
      `Task: ${result.claim.taskId}`,
      `Session: ${result.claim.sessionId}`,
      `Reused: ${result.reused ? 'yes' : 'no'}`,
    ]);
    return;
  }

  throw new Error(
    'Usage: skopos coordination status [target] [--json]\n' +
      '       skopos coordination session open [target] --actor <id> --host <name> [--session <id>] [--mode <writer|read-only|reviewer>] [--lease-seconds <n>] [--json]\n' +
      '       skopos coordination session heartbeat [target] --session <id> [--lease-seconds <n>] [--json]\n' +
      '       skopos coordination session close [target] --session <id> [--json]\n' +
      '       skopos coordination task reserve <task-id> [target] --session <id> [--json]\n' +
      '       skopos coordination task release <task-id> [target] --session <id> --reason <text> [--json]\n' +
      '       skopos coordination task audit <task-id> [target] [--json]\n' +
      '       skopos coordination task recover <task-id> [target] --session <id> --operation <resume|release> --reason <text> [--json]\n' +
      '       skopos coordination task snapshot <task-id> [target] --session <id> [--json]\n' +
      '       skopos coordination claim add <kind> <resource> [target] --task <id> --session <id> [--json]\n' +
      '       skopos coordination mutation begin <operation> <path> [target] --task <id> --session <id> [--json]\n' +
      '       skopos coordination mutation complete <mutation-id> [target] --session <id> [--json]',
  );
};

const parseSessionOpenArgs = (
  args: string[],
): {
  cwd: string;
  actorId: string;
  host: string;
  sessionId?: string;
  mode: SkoposCoordinationSessionMode;
  leaseSeconds?: number;
  json: boolean;
} => {
  const parsed = parseFlags(args, [
    'actor',
    'host',
    'session',
    'mode',
    'lease-seconds',
  ]);
  const actorId = requireFlag(parsed.flags, 'actor');
  const host = requireFlag(parsed.flags, 'host');
  return {
    cwd: parsed.cwd,
    actorId,
    host,
    sessionId: parsed.flags.get('session'),
    mode: (parsed.flags.get('mode') ?? 'writer') as SkoposCoordinationSessionMode,
    leaseSeconds: parseOptionalInteger(parsed.flags.get('lease-seconds'), '--lease-seconds'),
    json: parsed.json,
  };
};

const parseSessionIdentityArgs = (
  args: string[],
  allowLease: boolean,
): {
  cwd: string;
  sessionId: string;
  leaseSeconds?: number;
  json: boolean;
} => {
  const parsed = parseFlags(args, allowLease ? ['session', 'lease-seconds'] : ['session']);
  return {
    cwd: parsed.cwd,
    sessionId: requireFlag(parsed.flags, 'session'),
    leaseSeconds: parseOptionalInteger(parsed.flags.get('lease-seconds'), '--lease-seconds'),
    json: parsed.json,
  };
};

const parseTaskArgs = (
  args: string[],
  requireReason: boolean,
): {
  cwd: string;
  sessionId: string;
  reason?: string;
  json: boolean;
} => {
  const parsed = parseFlags(args, requireReason ? ['session', 'reason'] : ['session']);
  return {
    cwd: parsed.cwd,
    sessionId: requireFlag(parsed.flags, 'session'),
    reason: requireReason ? requireFlag(parsed.flags, 'reason') : undefined,
    json: parsed.json,
  };
};

const parseClaimArgs = (
  args: string[],
): {
  cwd: string;
  sessionId: string;
  taskId: string;
  json: boolean;
} => {
  const parsed = parseFlags(args, ['session', 'task']);
  return {
    cwd: parsed.cwd,
    sessionId: requireFlag(parsed.flags, 'session'),
    taskId: requireFlag(parsed.flags, 'task'),
    json: parsed.json,
  };
};

const parseCommonArgs = (args: string[]): { cwd: string; json: boolean } => {
  const parsed = parseFlags(args, []);
  return { cwd: parsed.cwd, json: parsed.json };
};

const parseFlags = (
  args: string[],
  valueFlags: string[],
  booleanFlags: string[] = [],
): { cwd: string; flags: Map<string, string>; booleans: Set<string>; json: boolean } => {
  let cwd = process.cwd();
  let targetProvided = false;
  let json = false;
  const flags = new Map<string, string>();
  const allowed = new Set(valueFlags);
  const booleans = new Set<string>();
  const allowedBooleans = new Set(booleanFlags);

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') {
      json = true;
      continue;
    }
    if (argument.startsWith('--')) {
      const [rawName, inlineValue] = argument.slice(2).split('=', 2);
      if (allowedBooleans.has(rawName)) {
        if (inlineValue !== undefined) {
          throw new Error(`Boolean coordination flag --${rawName} does not take a value.`);
        }
        booleans.add(rawName);
        continue;
      }
      if (!allowed.has(rawName)) {
        throw new Error(`Unknown coordination flag: --${rawName}.`);
      }
      const value = inlineValue ?? args[index + 1];
      if (!value || (!inlineValue && value.startsWith('--'))) {
        throw new Error(`Missing value for --${rawName}.`);
      }
      flags.set(rawName, value);
      if (inlineValue === undefined) index += 1;
      continue;
    }
    if (targetProvided) {
      throw new Error(`Unexpected extra coordination target: ${argument}.`);
    }
    cwd = resolve(argument);
    targetProvided = true;
  }

  return { cwd, flags, booleans, json };
};

const requireFlag = (flags: Map<string, string>, name: string): string => {
  const value = flags.get(name);
  if (!value?.trim()) throw new Error(`Missing --${name} for coordination command.`);
  return value;
};

const parseOptionalInteger = (
  value: string | undefined,
  flag: string,
): number | undefined => {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) throw new Error(`${flag} requires an integer.`);
  return parsed;
};
