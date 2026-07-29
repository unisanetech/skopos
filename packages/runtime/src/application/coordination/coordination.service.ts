import { createHash, randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, isAbsolute, join, normalize, resolve } from 'node:path';
import { promisify } from 'node:util';

import {
  SKOPOS_COORDINATION_RESOURCE_KINDS,
  SKOPOS_COORDINATION_SESSION_MODES,
  type SkoposClaimResourceResult,
  type SkoposCoordinationAuditResult,
  type SkoposCoordinationContamination,
  type SkoposCoordinationResourceKind,
  type SkoposCoordinationSession,
  type SkoposCoordinationSessionMode,
  type SkoposCoordinationStatus,
  type SkoposEnsureCoordinationSessionResult,
  type SkoposHeartbeatCoordinationSessionResult,
  type SkoposMutationLedgerEntry,
  type SkoposMutationOperation,
  type SkoposMutationResult,
  type SkoposOpenCoordinationSessionResult,
  type SkoposReleaseTaskResult,
  type SkoposReserveTaskResult,
  type SkoposResourceClaim,
  type SkoposTaskReservation,
  type SkoposTaskSnapshotResult,
  type SkoposTakeoverTaskResult,
} from '@skopos/model';
import { captureSkoposTaskPathStates } from '@skopos/verification';

const execFileAsync = promisify(execFile);
const nodeRequire = createRequire(import.meta.url);
let databaseSyncConstructor:
  | (new (path: string) => SqliteDatabase)
  | undefined;
const DEFAULT_LEASE_SECONDS = 30;
const MIN_LEASE_SECONDS = 5;
const MAX_LEASE_SECONDS = 3600;
const COORDINATION_DATABASE_PATH = '.skopos/coordination.sqlite';

export interface OpenSkoposCoordinationSessionOptions {
  cwd: string;
  actorId: string;
  host: string;
  sessionId?: string;
  processId?: number;
  mode?: SkoposCoordinationSessionMode;
  leaseSeconds?: number;
}

export interface HeartbeatSkoposCoordinationSessionOptions {
  cwd: string;
  sessionId: string;
  leaseSeconds?: number;
}

export interface EnsureSkoposCoordinationSessionOptions
  extends OpenSkoposCoordinationSessionOptions {}

export interface CloseSkoposCoordinationSessionOptions {
  cwd: string;
  sessionId: string;
}

export interface ReserveSkoposCoordinationTaskOptions {
  cwd: string;
  sessionId: string;
  taskId: string;
}

export interface ReleaseSkoposCoordinationTaskOptions {
  cwd: string;
  sessionId: string;
  taskId: string;
  reason: string;
}

export interface ClaimSkoposCoordinationResourceOptions {
  cwd: string;
  sessionId: string;
  taskId: string;
  resourceKind: SkoposCoordinationResourceKind;
  resourceKey: string;
}

export interface BeginSkoposCoordinationMutationOptions {
  cwd: string;
  sessionId: string;
  taskId: string;
  path: string;
  operation: SkoposMutationOperation;
}

export interface CompleteSkoposCoordinationMutationOptions {
  cwd: string;
  sessionId: string;
  mutationId: string;
}

export interface AuditSkoposCoordinationTaskOptions {
  cwd: string;
  taskId: string;
}

export interface TakeoverSkoposCoordinationTaskOptions {
  cwd: string;
  taskId: string;
  sessionId: string;
  reason: string;
  force?: boolean;
}

export interface SnapshotSkoposCoordinationTaskOptions {
  cwd: string;
  taskId: string;
  sessionId: string;
}

export const openSkoposCoordinationSession = async ({
  cwd,
  actorId,
  host,
  sessionId = randomUUID(),
  processId = process.pid,
  mode = 'writer',
  leaseSeconds = DEFAULT_LEASE_SECONDS,
}: OpenSkoposCoordinationSessionOptions): Promise<SkoposOpenCoordinationSessionResult> => {
  const workspaceRoot = resolve(cwd);
  assertNonEmpty(actorId, 'Coordination Session requires --actor <id>.');
  assertNonEmpty(host, 'Coordination Session requires --host <name>.');
  assertNonEmpty(sessionId, 'Coordination Session id cannot be empty.');
  if (!SKOPOS_COORDINATION_SESSION_MODES.includes(mode)) {
    throw new Error(`Unknown coordination Session mode: ${mode}.`);
  }
  const leaseMs = validateLeaseSeconds(leaseSeconds) * 1000;
  const databasePath = await ensureCoordinationDatabase(workspaceRoot);
  const git = await readGitIdentity(workspaceRoot);
  const now = Date.now();
  const db = openDatabase(databasePath);
  try {
    const session = transaction(db, () => {
      markExpiredSessionsStale(db, now);
      const existing = db
        .prepare('SELECT session_id FROM sessions WHERE session_id = ?')
        .get(sessionId);
      if (existing) {
        throw new Error(`Coordination Session ${sessionId} already exists.`);
      }
      db.prepare(
        `INSERT INTO sessions (
          session_id, actor_id, host, process_id, checkout_path, branch,
          base_revision, mode, state, opened_at_ms, heartbeat_at_ms,
          lease_expires_at_ms, closed_at_ms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'live', ?, ?, ?, NULL)`,
      ).run(
        sessionId,
        actorId.trim(),
        host.trim(),
        processId,
        workspaceRoot,
        git.branch,
        git.baseRevision,
        mode,
        now,
        now,
        now + leaseMs,
      );
      recordEvent(db, {
        kind: 'session-opened',
        sessionId,
        actorId: actorId.trim(),
        details: { host: host.trim(), mode },
        now,
      });
      return readSession(db, sessionId);
    });
    return {
      workspaceRoot,
      databasePath,
      enforcementLevel: 'cooperative',
      session,
    };
  } finally {
    db.close();
  }
};

export const heartbeatSkoposCoordinationSession = async ({
  cwd,
  sessionId,
  leaseSeconds = DEFAULT_LEASE_SECONDS,
}: HeartbeatSkoposCoordinationSessionOptions): Promise<SkoposHeartbeatCoordinationSessionResult> => {
  const workspaceRoot = resolve(cwd);
  const leaseMs = validateLeaseSeconds(leaseSeconds) * 1000;
  const databasePath = await ensureCoordinationDatabase(workspaceRoot);
  const now = Date.now();
  const db = openDatabase(databasePath);
  try {
    const session = transaction(db, () => {
      markExpiredSessionsStale(db, now);
      const current = readSession(db, sessionId);
      if (current.state !== 'live') {
        throw new Error(
          `Coordination Session ${sessionId} is ${current.state}; stale or closed Sessions cannot renew silently.`,
        );
      }
      db.prepare(
        `UPDATE sessions
         SET heartbeat_at_ms = ?, lease_expires_at_ms = ?
         WHERE session_id = ?`,
      ).run(now, now + leaseMs, sessionId);
      recordEvent(db, {
        kind: 'session-heartbeat',
        sessionId,
        actorId: current.actorId,
        details: { leaseSeconds },
        now,
      });
      return readSession(db, sessionId);
    });
    return { workspaceRoot, databasePath, session };
  } finally {
    db.close();
  }
};

export const ensureSkoposCoordinationSession = async ({
  cwd,
  actorId,
  host,
  sessionId = randomUUID(),
  processId = process.pid,
  mode = 'writer',
  leaseSeconds = DEFAULT_LEASE_SECONDS,
}: EnsureSkoposCoordinationSessionOptions): Promise<SkoposEnsureCoordinationSessionResult> => {
  const workspaceRoot = resolve(cwd);
  assertNonEmpty(actorId, 'Coordination Session requires --actor <id>.');
  assertNonEmpty(host, 'Coordination Session requires --host <name>.');
  assertNonEmpty(sessionId, 'Coordination Session id cannot be empty.');
  if (!SKOPOS_COORDINATION_SESSION_MODES.includes(mode)) {
    throw new Error(`Unknown coordination Session mode: ${mode}.`);
  }
  const leaseMs = validateLeaseSeconds(leaseSeconds) * 1000;
  const databasePath = await ensureCoordinationDatabase(workspaceRoot);
  const git = await readGitIdentity(workspaceRoot);
  const now = Date.now();
  const db = openDatabase(databasePath);
  try {
    const result = transaction(db, () => {
      markExpiredSessionsStale(db, now);
      const existing = db
        .prepare('SELECT * FROM sessions WHERE session_id = ?')
        .get(sessionId) as SessionRow | undefined;
      if (existing) {
        const session = mapSession(existing);
        if (session.state !== 'live') {
          throw new Error(
            `Coordination Session ${sessionId} is ${session.state}; lifecycle integration cannot reopen it silently.`,
          );
        }
        if (session.actorId !== actorId.trim()) {
          throw new Error(
            `Coordination Session ${sessionId} belongs to actor ${session.actorId}, not ${actorId.trim()}.`,
          );
        }
        if (session.host !== host.trim() || session.mode !== mode) {
          throw new Error(
            `Coordination Session ${sessionId} identity mismatch: expected host ${session.host} and mode ${session.mode}.`,
          );
        }
        db.prepare(
          `UPDATE sessions
           SET process_id = ?, heartbeat_at_ms = ?, lease_expires_at_ms = ?
           WHERE session_id = ?`,
        ).run(processId, now, now + leaseMs, sessionId);
        recordEvent(db, {
          kind: 'session-heartbeat',
          sessionId,
          actorId: session.actorId,
          details: { leaseSeconds, source: 'lifecycle-ensure' },
          now,
        });
        return { created: false, session: readSession(db, sessionId) };
      }

      db.prepare(
        `INSERT INTO sessions (
          session_id, actor_id, host, process_id, checkout_path, branch,
          base_revision, mode, state, opened_at_ms, heartbeat_at_ms,
          lease_expires_at_ms, closed_at_ms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'live', ?, ?, ?, NULL)`,
      ).run(
        sessionId,
        actorId.trim(),
        host.trim(),
        processId,
        workspaceRoot,
        git.branch,
        git.baseRevision,
        mode,
        now,
        now,
        now + leaseMs,
      );
      recordEvent(db, {
        kind: 'session-opened',
        sessionId,
        actorId: actorId.trim(),
        details: { host: host.trim(), mode, source: 'lifecycle-ensure' },
        now,
      });
      return { created: true, session: readSession(db, sessionId) };
    });
    return {
      workspaceRoot,
      databasePath,
      enforcementLevel: 'cooperative',
      preventiveSafety: false,
      ...result,
    };
  } finally {
    db.close();
  }
};

export const closeSkoposCoordinationSession = async ({
  cwd,
  sessionId,
}: CloseSkoposCoordinationSessionOptions): Promise<SkoposHeartbeatCoordinationSessionResult> => {
  const workspaceRoot = resolve(cwd);
  const databasePath = await ensureCoordinationDatabase(workspaceRoot);
  const now = Date.now();
  const db = openDatabase(databasePath);
  try {
    const session = transaction(db, () => {
      markExpiredSessionsStale(db, now);
      const current = readSession(db, sessionId);
      const reservation = db
        .prepare('SELECT task_id FROM task_reservations WHERE session_id = ?')
        .get(sessionId) as { task_id?: string } | undefined;
      if (reservation?.task_id) {
        throw new Error(
          `Session ${sessionId} still reserves Task ${reservation.task_id}; release the Task explicitly before closing.`,
        );
      }
      if (current.state === 'closed') return current;
      db.prepare(
        `UPDATE sessions
         SET state = 'closed', closed_at_ms = ?
         WHERE session_id = ?`,
      ).run(now, sessionId);
      recordEvent(db, {
        kind: 'session-closed',
        sessionId,
        actorId: current.actorId,
        details: {},
        now,
      });
      return readSession(db, sessionId);
    });
    return { workspaceRoot, databasePath, session };
  } finally {
    db.close();
  }
};

export const reserveSkoposCoordinationTask = async ({
  cwd,
  sessionId,
  taskId,
}: ReserveSkoposCoordinationTaskOptions): Promise<SkoposReserveTaskResult> => {
  const workspaceRoot = resolve(cwd);
  assertNonEmpty(taskId, 'Task id cannot be empty.');
  const databasePath = await ensureCoordinationDatabase(workspaceRoot);
  const now = Date.now();
  const db = openDatabase(databasePath);
  try {
    const reservation = transaction(db, () => {
      markExpiredSessionsStale(db, now);
      const session = requireLiveWriterSession(db, sessionId);
      const currentForTask = db
        .prepare('SELECT * FROM task_reservations WHERE task_id = ?')
        .get(taskId) as ReservationRow | undefined;
      if (currentForTask) {
        if (currentForTask.session_id === sessionId) {
          return mapReservation(currentForTask);
        }
        throw new Error(
          `Task ${taskId} is reserved by Session ${currentForTask.session_id} (${currentForTask.actor_id}).`,
        );
      }
      const currentForSession = db
        .prepare('SELECT * FROM task_reservations WHERE session_id = ?')
        .get(sessionId) as ReservationRow | undefined;
      if (currentForSession) {
        throw new Error(
          `Session ${sessionId} already reserves writing Task ${currentForSession.task_id}.`,
        );
      }
      db.prepare(
        `INSERT INTO task_reservations (task_id, session_id, actor_id, reserved_at_ms)
         VALUES (?, ?, ?, ?)`,
      ).run(taskId, sessionId, session.actorId, now);
      recordEvent(db, {
        kind: 'task-reserved',
        sessionId,
        taskId,
        actorId: session.actorId,
        details: {},
        now,
      });
      return readReservation(db, taskId);
    });
    return { workspaceRoot, databasePath, reservation };
  } finally {
    db.close();
  }
};

export const releaseSkoposCoordinationTask = async ({
  cwd,
  sessionId,
  taskId,
  reason,
}: ReleaseSkoposCoordinationTaskOptions): Promise<SkoposReleaseTaskResult> => {
  const workspaceRoot = resolve(cwd);
  assertNonEmpty(reason, 'Task release requires an explicit reason.');
  const databasePath = await ensureCoordinationDatabase(workspaceRoot);
  const now = Date.now();
  const db = openDatabase(databasePath);
  try {
    const releasedClaimCount = transaction(db, () => {
      markExpiredSessionsStale(db, now);
      requireLiveWriterSession(db, sessionId);
      const reservation = readReservation(db, taskId);
      if (reservation.sessionId !== sessionId) {
        throw new Error(
          `Task ${taskId} is reserved by Session ${reservation.sessionId}, not ${sessionId}.`,
        );
      }
      const claimCount = (
        db.prepare('SELECT COUNT(*) AS count FROM resource_claims WHERE task_id = ?')
          .get(taskId) as { count: number }
      ).count;
      db.prepare('DELETE FROM resource_claims WHERE task_id = ?').run(taskId);
      db.prepare('DELETE FROM task_reservations WHERE task_id = ?').run(taskId);
      recordEvent(db, {
        kind: 'task-released',
        sessionId,
        taskId,
        actorId: reservation.actorId,
        details: { reason: reason.trim(), releasedClaimCount: claimCount },
        now,
      });
      return claimCount;
    });
    return {
      workspaceRoot,
      databasePath,
      releasedTaskId: taskId,
      releasedClaimCount,
      reason: reason.trim(),
    };
  } finally {
    db.close();
  }
};

export const claimSkoposCoordinationResource = async ({
  cwd,
  sessionId,
  taskId,
  resourceKind,
  resourceKey,
}: ClaimSkoposCoordinationResourceOptions): Promise<SkoposClaimResourceResult> => {
  const workspaceRoot = resolve(cwd);
  if (!SKOPOS_COORDINATION_RESOURCE_KINDS.includes(resourceKind)) {
    throw new Error(`Unknown coordination resource kind: ${resourceKind}.`);
  }
  const normalizedKey = normalizeResourceKey(resourceKind, resourceKey);
  const databasePath = await ensureCoordinationDatabase(workspaceRoot);
  const now = Date.now();
  const db = openDatabase(databasePath);
  try {
    return transaction(db, () => {
      markExpiredSessionsStale(db, now);
      const session = requireLiveWriterSession(db, sessionId);
      const reservation = readReservation(db, taskId);
      if (reservation.sessionId !== sessionId) {
        throw new Error(
          `Session ${sessionId} does not own Task reservation ${taskId}.`,
        );
      }
      const claims = readClaims(db);
      const same = claims.find(
        (claim) =>
          claim.taskId === taskId &&
          claim.resourceKind === resourceKind &&
          claim.resourceKey === normalizedKey,
      );
      if (same) {
        return {
          workspaceRoot,
          databasePath,
          reused: true,
          claim: same,
        };
      }
      const conflict = claims.find(
        (claim) =>
          claim.taskId !== taskId &&
          resourcesConflict(
            resourceKind,
            normalizedKey,
            claim.resourceKind,
            claim.resourceKey,
          ),
      );
      if (conflict) {
        throw new Error(
          `Resource ${resourceKind}:${normalizedKey} conflicts with ${conflict.resourceKind}:${conflict.resourceKey} owned by Task ${conflict.taskId}, Session ${conflict.sessionId} (${conflict.actorId}).`,
        );
      }
      const claimId = randomUUID();
      db.prepare(
        `INSERT INTO resource_claims (
          claim_id, task_id, session_id, actor_id, resource_kind,
          resource_key, claimed_at_ms
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        claimId,
        taskId,
        sessionId,
        session.actorId,
        resourceKind,
        normalizedKey,
        now,
      );
      recordEvent(db, {
        kind: 'resource-claimed',
        sessionId,
        taskId,
        actorId: session.actorId,
        details: { claimId, resourceKind, resourceKey: normalizedKey },
        now,
      });
      return {
        workspaceRoot,
        databasePath,
        reused: false,
        claim: readClaim(db, claimId),
      };
    });
  } finally {
    db.close();
  }
};

export const beginSkoposCoordinationMutation = async ({
  cwd,
  sessionId,
  taskId,
  path,
  operation,
}: BeginSkoposCoordinationMutationOptions): Promise<SkoposMutationResult> => {
  const workspaceRoot = resolve(cwd);
  const normalizedPath = normalizeResourceKey('exact-path', path);
  const [pathState] = await captureSkoposTaskPathStates({
    workspaceRoot,
    paths: [normalizedPath],
  });
  const beforeDigest = pathState?.digest ?? 'missing';
  const databasePath = await ensureCoordinationDatabase(workspaceRoot);
  const now = Date.now();
  const db = openDatabase(databasePath);
  try {
    const mutation = transaction(db, () => {
      markExpiredSessionsStale(db, now);
      const session = requireLiveWriterSession(db, sessionId);
      const reservation = readReservation(db, taskId);
      if (reservation.sessionId !== sessionId) {
        throw new Error(`Session ${sessionId} does not own Task ${taskId}.`);
      }
      const claims = readClaims(db).filter((claim) => claim.taskId === taskId);
      if (
        !claims.some((claim) =>
          resourcesConflict('exact-path', normalizedPath, claim.resourceKind, claim.resourceKey),
        )
      ) {
        throw new Error(
          `Task ${taskId} must claim ${normalizedPath} before beginning a mutation.`,
        );
      }
      const openMutation = db
        .prepare(
          `SELECT mutation_id FROM mutation_ledger
           WHERE task_id = ? AND path = ? AND status = 'open'`,
        )
        .get(taskId, normalizedPath) as { mutation_id?: string } | undefined;
      if (openMutation?.mutation_id) {
        throw new Error(
          `Path ${normalizedPath} already has open mutation ${openMutation.mutation_id}.`,
        );
      }
      const latest = readLatestRecordedMutation(db, taskId, normalizedPath);
      const contaminated = latest?.afterDigest !== null &&
        latest?.afterDigest !== undefined &&
        latest.afterDigest !== beforeDigest;
      if (contaminated) {
        recordContamination(db, {
          taskId,
          sessionId,
          path: normalizedPath,
          expectedDigest: latest.afterDigest,
          observedDigest: beforeDigest,
          reason: 'Path changed outside its recorded mutation boundary.',
          now,
        });
        throw new Error(
          `Path ${normalizedPath} is contaminated: expected ${latest.afterDigest}, observed ${beforeDigest}.`,
        );
      }
      const mutationId = randomUUID();
      db.prepare(
        `INSERT INTO mutation_ledger (
          mutation_id, task_id, session_id, actor_id, path, operation,
          before_digest, after_digest, status, reason, started_at_ms, completed_at_ms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 'open', NULL, ?, NULL)`,
      ).run(
        mutationId,
        taskId,
        sessionId,
        session.actorId,
        normalizedPath,
        operation,
        beforeDigest,
        now,
      );
      recordEvent(db, {
        kind: 'mutation-begun',
        sessionId,
        taskId,
        actorId: session.actorId,
        details: { mutationId, path: normalizedPath, operation, beforeDigest },
        now,
      });
      return readMutation(db, mutationId);
    });
    return { workspaceRoot, databasePath, mutation };
  } finally {
    db.close();
  }
};

export const completeSkoposCoordinationMutation = async ({
  cwd,
  sessionId,
  mutationId,
}: CompleteSkoposCoordinationMutationOptions): Promise<SkoposMutationResult> => {
  const workspaceRoot = resolve(cwd);
  const databasePath = await ensureCoordinationDatabase(workspaceRoot);
  const db = openDatabase(databasePath);
  try {
    const openMutation = readMutation(db, mutationId);
    if (openMutation.sessionId !== sessionId) {
      throw new Error(
        `Mutation ${mutationId} belongs to Session ${openMutation.sessionId}, not ${sessionId}.`,
      );
    }
    const [pathState] = await captureSkoposTaskPathStates({
      workspaceRoot,
      paths: [openMutation.path],
    });
    const afterDigest = pathState?.digest ?? 'missing';
    const now = Date.now();
    const mutation = transaction(db, () => {
      markExpiredSessionsStale(db, now);
      requireLiveWriterSession(db, sessionId);
      const current = readMutation(db, mutationId);
      if (current.status !== 'open') {
        throw new Error(`Mutation ${mutationId} is already ${current.status}.`);
      }
      db.prepare(
        `UPDATE mutation_ledger
         SET after_digest = ?, status = 'recorded', completed_at_ms = ?
         WHERE mutation_id = ?`,
      ).run(afterDigest, now, mutationId);
      recordEvent(db, {
        kind: 'mutation-recorded',
        sessionId,
        taskId: current.taskId,
        actorId: current.actorId,
        details: { mutationId, path: current.path, afterDigest },
        now,
      });
      return readMutation(db, mutationId);
    });
    return { workspaceRoot, databasePath, mutation };
  } finally {
    db.close();
  }
};

export const auditSkoposCoordinationTask = async ({
  cwd,
  taskId,
}: AuditSkoposCoordinationTaskOptions): Promise<SkoposCoordinationAuditResult> => {
  const workspaceRoot = resolve(cwd);
  const databasePath = await ensureCoordinationDatabase(workspaceRoot);
  const db = openDatabase(databasePath);
  try {
    const claims = readClaims(db).filter((claim) => claim.taskId === taskId);
    const exactPaths = claims
      .filter((claim) => claim.resourceKind === 'exact-path')
      .map((claim) => claim.resourceKey);
    const states = await captureSkoposTaskPathStates({
      workspaceRoot,
      paths: exactPaths,
    });
    const now = Date.now();
    transaction(db, () => {
      markExpiredSessionsStale(db, now);
      for (const state of states) {
        const latest = readLatestRecordedMutation(db, taskId, state.path);
        if (latest?.afterDigest && latest.afterDigest !== state.digest) {
          recordContamination(db, {
            taskId,
            sessionId: latest.sessionId,
            path: state.path,
            expectedDigest: latest.afterDigest,
            observedDigest: state.digest,
            reason: 'Current path digest differs from the mutation ledger.',
            now,
          });
        }
      }
    });
    const contamination = readContamination(db).filter(
      (entry) => entry.taskId === taskId && entry.state === 'open',
    );
    return {
      workspaceRoot,
      databasePath,
      taskId,
      clean: contamination.length === 0,
      contamination,
    };
  } finally {
    db.close();
  }
};

export const takeoverSkoposCoordinationTask = async ({
  cwd,
  taskId,
  sessionId,
  reason,
  force = false,
}: TakeoverSkoposCoordinationTaskOptions): Promise<SkoposTakeoverTaskResult> => {
  assertNonEmpty(reason, 'Task takeover requires an explicit reason.');
  const workspaceRoot = resolve(cwd);
  const audit = await auditSkoposCoordinationTask({ cwd: workspaceRoot, taskId });
  if (!audit.clean && !force) {
    throw new Error(
      `Task ${taskId} has ${audit.contamination.length} contamination issue(s); reconcile them or use an explicit forced takeover.`,
    );
  }
  const databasePath = await ensureCoordinationDatabase(workspaceRoot);
  const now = Date.now();
  const db = openDatabase(databasePath);
  try {
    const priorSessionId = transaction(db, () => {
      markExpiredSessionsStale(db, now);
      const next = requireLiveWriterSession(db, sessionId);
      const reservation = readReservation(db, taskId);
      const prior = readSession(db, reservation.sessionId);
      if (prior.state !== 'stale') {
        throw new Error(
          `Task ${taskId} is held by ${prior.state} Session ${prior.sessionId}; only stale ownership may be taken over.`,
        );
      }
      const existingForNext = db
        .prepare('SELECT task_id FROM task_reservations WHERE session_id = ?')
        .get(sessionId) as { task_id?: string } | undefined;
      if (existingForNext?.task_id) {
        throw new Error(`Session ${sessionId} already reserves Task ${existingForNext.task_id}.`);
      }
      db.prepare(
        `UPDATE task_reservations
         SET session_id = ?, actor_id = ?, reserved_at_ms = ?
         WHERE task_id = ?`,
      ).run(sessionId, next.actorId, now, taskId);
      db.prepare(
        `UPDATE resource_claims
         SET session_id = ?, actor_id = ?
         WHERE task_id = ?`,
      ).run(sessionId, next.actorId, taskId);
      recordEvent(db, {
        kind: 'task-taken-over',
        sessionId,
        taskId,
        actorId: next.actorId,
        details: {
          priorSessionId: prior.sessionId,
          reason: reason.trim(),
          forced: force,
          contaminationCount: audit.contamination.length,
        },
        now,
      });
      return prior.sessionId;
    });
    return {
      workspaceRoot,
      databasePath,
      taskId,
      priorSessionId,
      sessionId,
      forced: force,
      reason: reason.trim(),
    };
  } finally {
    db.close();
  }
};

export const snapshotSkoposCoordinationTask = async ({
  cwd,
  taskId,
  sessionId,
}: SnapshotSkoposCoordinationTaskOptions): Promise<SkoposTaskSnapshotResult> => {
  const workspaceRoot = resolve(cwd);
  const audit = await auditSkoposCoordinationTask({ cwd: workspaceRoot, taskId });
  if (!audit.clean) {
    throw new Error(
      `Task ${taskId} cannot be snapshotted with ${audit.contamination.length} contamination issue(s).`,
    );
  }
  const databasePath = await ensureCoordinationDatabase(workspaceRoot);
  const db = openDatabase(databasePath);
  try {
    const session = requireLiveWriterSession(db, sessionId);
    const reservation = readReservation(db, taskId);
    if (reservation.sessionId !== sessionId) {
      throw new Error(`Session ${sessionId} does not own Task ${taskId}.`);
    }
    const paths = readClaims(db)
      .filter((claim) => claim.taskId === taskId && claim.resourceKind === 'exact-path')
      .map((claim) => claim.resourceKey);
    const states = await captureSkoposTaskPathStates({ workspaceRoot, paths });
    const digest = createHash('sha256')
      .update(states.map((state) => `${state.path}\0${state.digest}`).join('\n'))
      .digest('hex');
    const snapshotId = `S-${digest.slice(0, 12)}`;
    const relativeArtifactPath = join(
      'docs',
      'work',
      'tasks',
      'snapshots',
      `${taskId}-${snapshotId}.json`,
    );
    const artifactPath = join(workspaceRoot, relativeArtifactPath);
    const snapshot = {
      snapshotId,
      taskId,
      sessionId,
      actorId: session.actorId,
      baseRevision: session.baseRevision,
      paths: states,
      digest,
      createdAt: new Date().toISOString(),
      artifactPath: relativeArtifactPath,
    };
    await mkdir(dirname(artifactPath), { recursive: true });
    const temporaryPath = `${artifactPath}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
    await rename(temporaryPath, artifactPath);
    const now = Date.now();
    transaction(db, () => {
      db.prepare(
        `INSERT OR REPLACE INTO task_snapshots (
          snapshot_id, task_id, session_id, actor_id, base_revision,
          digest, artifact_path, created_at_ms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        snapshotId,
        taskId,
        sessionId,
        session.actorId,
        session.baseRevision,
        digest,
        relativeArtifactPath,
        now,
      );
      recordEvent(db, {
        kind: 'task-snapshotted',
        sessionId,
        taskId,
        actorId: session.actorId,
        details: { snapshotId, digest, artifactPath: relativeArtifactPath },
        now,
      });
    });
    return { workspaceRoot, databasePath, snapshot };
  } finally {
    db.close();
  }
};

export const getSkoposCoordinationStatus = async ({
  cwd,
}: {
  cwd: string;
}): Promise<SkoposCoordinationStatus> => {
  const workspaceRoot = resolve(cwd);
  const databasePath = await ensureCoordinationDatabase(workspaceRoot);
  const db = openDatabase(databasePath);
  try {
    transaction(db, () => markExpiredSessionsStale(db, Date.now()));
    return {
      workspaceRoot,
      databasePath,
      enforcementLevel: 'cooperative',
      preventiveSafety: false,
      sessions: (
        db.prepare('SELECT * FROM sessions ORDER BY opened_at_ms, session_id').all() as SessionRow[]
      ).map(mapSession),
      reservations: (
        db.prepare('SELECT * FROM task_reservations ORDER BY reserved_at_ms, task_id').all() as ReservationRow[]
      ).map(mapReservation),
      claims: readClaims(db),
      mutations: readMutations(db),
      contamination: readContamination(db),
    };
  } finally {
    db.close();
  }
};

const ensureCoordinationDatabase = async (
  workspaceRoot: string,
): Promise<string> => {
  const databasePath = join(workspaceRoot, COORDINATION_DATABASE_PATH);
  await mkdir(dirname(databasePath), { recursive: true });
  const db = openDatabase(databasePath);
  try {
    initializeSchema(db);
  } finally {
    db.close();
  }
  return databasePath;
};

const openDatabase = (databasePath: string): SqliteDatabase => {
  const DatabaseSync = loadDatabaseSync();
  const db = new DatabaseSync(databasePath);
  db.exec('PRAGMA foreign_keys = ON');
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA busy_timeout = 5000');
  return db;
};

const loadDatabaseSync = (): (new (path: string) => SqliteDatabase) => {
  if (databaseSyncConstructor) return databaseSyncConstructor;
  const sqlite = nodeRequire('node:sqlite') as {
    DatabaseSync: new (path: string) => SqliteDatabase;
  };
  databaseSyncConstructor = sqlite.DatabaseSync;
  return databaseSyncConstructor;
};

const initializeSchema = (db: SqliteDatabase): void => {
  const version = (
    db.prepare('PRAGMA user_version').get() as { user_version: number }
  ).user_version;
  if (version !== 0 && version !== 2) {
    throw new Error(
      `Unsupported coordination database schema ${version}; delete generated .skopos/coordination.sqlite and rebuild it.`,
    );
  }
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id TEXT PRIMARY KEY,
      actor_id TEXT NOT NULL,
      host TEXT NOT NULL,
      process_id INTEGER NOT NULL,
      checkout_path TEXT NOT NULL,
      branch TEXT,
      base_revision TEXT,
      mode TEXT NOT NULL CHECK (mode IN ('writer', 'read-only', 'reviewer')),
      state TEXT NOT NULL CHECK (state IN ('live', 'stale', 'closed')),
      opened_at_ms INTEGER NOT NULL,
      heartbeat_at_ms INTEGER NOT NULL,
      lease_expires_at_ms INTEGER NOT NULL,
      closed_at_ms INTEGER
    );
    CREATE TABLE IF NOT EXISTS task_reservations (
      task_id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL UNIQUE,
      actor_id TEXT NOT NULL,
      reserved_at_ms INTEGER NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(session_id)
    );
    CREATE TABLE IF NOT EXISTS resource_claims (
      claim_id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      resource_kind TEXT NOT NULL,
      resource_key TEXT NOT NULL,
      claimed_at_ms INTEGER NOT NULL,
      UNIQUE (task_id, resource_kind, resource_key),
      FOREIGN KEY (task_id) REFERENCES task_reservations(task_id),
      FOREIGN KEY (session_id) REFERENCES sessions(session_id)
    );
    CREATE TABLE IF NOT EXISTS coordination_events (
      event_id TEXT PRIMARY KEY,
      event_kind TEXT NOT NULL,
      session_id TEXT,
      task_id TEXT,
      actor_id TEXT,
      details_json TEXT NOT NULL,
      recorded_at_ms INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS mutation_ledger (
      mutation_id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      path TEXT NOT NULL,
      operation TEXT NOT NULL CHECK (operation IN ('create', 'edit', 'delete', 'rename')),
      before_digest TEXT NOT NULL,
      after_digest TEXT,
      status TEXT NOT NULL CHECK (status IN ('open', 'recorded', 'contaminated')),
      reason TEXT,
      started_at_ms INTEGER NOT NULL,
      completed_at_ms INTEGER
    );
    CREATE TABLE IF NOT EXISTS contamination (
      contamination_id TEXT PRIMARY KEY,
      task_id TEXT,
      session_id TEXT,
      path TEXT NOT NULL,
      expected_digest TEXT,
      observed_digest TEXT NOT NULL,
      reason TEXT NOT NULL,
      state TEXT NOT NULL CHECK (state IN ('open', 'reconciled')),
      detected_at_ms INTEGER NOT NULL,
      reconciled_at_ms INTEGER,
      reconciled_by_actor_id TEXT
    );
    CREATE TABLE IF NOT EXISTS task_snapshots (
      snapshot_id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      base_revision TEXT,
      digest TEXT NOT NULL,
      artifact_path TEXT NOT NULL,
      created_at_ms INTEGER NOT NULL
    );
    PRAGMA user_version = 2;
  `);
};

const transaction = <T>(db: SqliteDatabase, operation: () => T): T => {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = operation();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
};

const markExpiredSessionsStale = (db: SqliteDatabase, now: number): void => {
  const expired = db
    .prepare(
      `SELECT session_id, actor_id
       FROM sessions
       WHERE state = 'live' AND lease_expires_at_ms <= ?`,
    )
    .all(now) as Array<{ session_id: string; actor_id: string }>;
  if (expired.length === 0) return;
  db.prepare(
    `UPDATE sessions
     SET state = 'stale'
     WHERE state = 'live' AND lease_expires_at_ms <= ?`,
  ).run(now);
  for (const session of expired) {
    recordEvent(db, {
      kind: 'session-stale',
      sessionId: session.session_id,
      actorId: session.actor_id,
      details: { reservationRetained: true, claimsRetained: true },
      now,
    });
  }
};

const requireLiveWriterSession = (
  db: SqliteDatabase,
  sessionId: string,
): SkoposCoordinationSession => {
  const session = readSession(db, sessionId);
  if (session.state !== 'live') {
    throw new Error(`Coordination Session ${sessionId} is ${session.state}.`);
  }
  if (session.mode !== 'writer') {
    throw new Error(
      `Coordination Session ${sessionId} is ${session.mode}; only writer Sessions may reserve or claim.`,
    );
  }
  return session;
};

const readSession = (
  db: SqliteDatabase,
  sessionId: string,
): SkoposCoordinationSession => {
  const row = db
    .prepare('SELECT * FROM sessions WHERE session_id = ?')
    .get(sessionId) as SessionRow | undefined;
  if (!row) throw new Error(`Unknown coordination Session ${sessionId}.`);
  return mapSession(row);
};

const readReservation = (
  db: SqliteDatabase,
  taskId: string,
): SkoposTaskReservation => {
  const row = db
    .prepare('SELECT * FROM task_reservations WHERE task_id = ?')
    .get(taskId) as ReservationRow | undefined;
  if (!row) throw new Error(`Task ${taskId} has no coordination reservation.`);
  return mapReservation(row);
};

const readClaim = (db: SqliteDatabase, claimId: string): SkoposResourceClaim => {
  const row = db
    .prepare('SELECT * FROM resource_claims WHERE claim_id = ?')
    .get(claimId) as ClaimRow | undefined;
  if (!row) throw new Error(`Unknown resource claim ${claimId}.`);
  return mapClaim(row);
};

const readClaims = (db: SqliteDatabase): SkoposResourceClaim[] =>
  (
    db.prepare(
      'SELECT * FROM resource_claims ORDER BY claimed_at_ms, claim_id',
    ).all() as ClaimRow[]
  ).map(mapClaim);

const readMutation = (
  db: SqliteDatabase,
  mutationId: string,
): SkoposMutationLedgerEntry => {
  const row = db
    .prepare('SELECT * FROM mutation_ledger WHERE mutation_id = ?')
    .get(mutationId) as MutationRow | undefined;
  if (!row) throw new Error(`Unknown coordination mutation ${mutationId}.`);
  return mapMutation(row);
};

const readMutations = (db: SqliteDatabase): SkoposMutationLedgerEntry[] =>
  (
    db.prepare(
      'SELECT * FROM mutation_ledger ORDER BY started_at_ms, mutation_id',
    ).all() as MutationRow[]
  ).map(mapMutation);

const readLatestRecordedMutation = (
  db: SqliteDatabase,
  taskId: string,
  path: string,
): SkoposMutationLedgerEntry | undefined => {
  const row = db
    .prepare(
      `SELECT * FROM mutation_ledger
       WHERE task_id = ? AND path = ? AND status = 'recorded'
       ORDER BY completed_at_ms DESC, mutation_id DESC
       LIMIT 1`,
    )
    .get(taskId, path) as MutationRow | undefined;
  return row ? mapMutation(row) : undefined;
};

const readContamination = (
  db: SqliteDatabase,
): SkoposCoordinationContamination[] =>
  (
    db.prepare(
      'SELECT * FROM contamination ORDER BY detected_at_ms, contamination_id',
    ).all() as ContaminationRow[]
  ).map(mapContamination);

const recordContamination = (
  db: SqliteDatabase,
  {
    taskId,
    sessionId,
    path,
    expectedDigest,
    observedDigest,
    reason,
    now,
  }: {
    taskId?: string;
    sessionId?: string;
    path: string;
    expectedDigest?: string | null;
    observedDigest: string;
    reason: string;
    now: number;
  },
): void => {
  const existing = db
    .prepare(
      `SELECT contamination_id FROM contamination
       WHERE state = 'open' AND path = ? AND task_id IS ? AND reason = ?`,
    )
    .get(path, taskId ?? null, reason) as { contamination_id?: string } | undefined;
  if (existing?.contamination_id) return;
  db.prepare(
    `INSERT INTO contamination (
      contamination_id, task_id, session_id, path, expected_digest,
      observed_digest, reason, state, detected_at_ms,
      reconciled_at_ms, reconciled_by_actor_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, NULL, NULL)`,
  ).run(
    randomUUID(),
    taskId ?? null,
    sessionId ?? null,
    path,
    expectedDigest ?? null,
    observedDigest,
    reason,
    now,
  );
};

const mapSession = (row: SessionRow): SkoposCoordinationSession => ({
  sessionId: row.session_id,
  actorId: row.actor_id,
  host: row.host,
  processId: row.process_id,
  checkoutPath: row.checkout_path,
  branch: row.branch,
  baseRevision: row.base_revision,
  mode: row.mode,
  state: row.state,
  openedAt: toIso(row.opened_at_ms),
  heartbeatAt: toIso(row.heartbeat_at_ms),
  leaseExpiresAt: toIso(row.lease_expires_at_ms),
  closedAt: row.closed_at_ms === null ? null : toIso(row.closed_at_ms),
});

const mapReservation = (row: ReservationRow): SkoposTaskReservation => ({
  taskId: row.task_id,
  sessionId: row.session_id,
  actorId: row.actor_id,
  reservedAt: toIso(row.reserved_at_ms),
});

const mapClaim = (row: ClaimRow): SkoposResourceClaim => ({
  claimId: row.claim_id,
  taskId: row.task_id,
  sessionId: row.session_id,
  actorId: row.actor_id,
  resourceKind: row.resource_kind,
  resourceKey: row.resource_key,
  claimedAt: toIso(row.claimed_at_ms),
});

const mapMutation = (row: MutationRow): SkoposMutationLedgerEntry => ({
  mutationId: row.mutation_id,
  taskId: row.task_id,
  sessionId: row.session_id,
  actorId: row.actor_id,
  path: row.path,
  operation: row.operation,
  beforeDigest: row.before_digest,
  afterDigest: row.after_digest,
  status: row.status,
  reason: row.reason,
  startedAt: toIso(row.started_at_ms),
  completedAt: row.completed_at_ms === null ? null : toIso(row.completed_at_ms),
});

const mapContamination = (
  row: ContaminationRow,
): SkoposCoordinationContamination => ({
  contaminationId: row.contamination_id,
  taskId: row.task_id,
  sessionId: row.session_id,
  path: row.path,
  expectedDigest: row.expected_digest,
  observedDigest: row.observed_digest,
  reason: row.reason,
  state: row.state,
  detectedAt: toIso(row.detected_at_ms),
  reconciledAt:
    row.reconciled_at_ms === null ? null : toIso(row.reconciled_at_ms),
  reconciledByActorId: row.reconciled_by_actor_id,
});

const normalizeResourceKey = (
  kind: SkoposCoordinationResourceKind,
  value: string,
): string => {
  assertNonEmpty(value, 'Coordination resource key cannot be empty.');
  if (kind === 'git-mutation') return 'repository';
  if (kind === 'semantic-resource') return value.trim();
  const candidate = value.trim().replaceAll('\\', '/');
  if (isAbsolute(candidate)) {
    throw new Error('Coordination path resources must be workspace-relative.');
  }
  const normalized = normalize(candidate).replaceAll('\\', '/').replace(/^\.\//, '');
  if (
    normalized === '..' ||
    normalized.startsWith('../') ||
    normalized === '.'
  ) {
    throw new Error('Coordination path resources must identify a path inside the workspace.');
  }
  return normalized;
};

const resourcesConflict = (
  leftKind: SkoposCoordinationResourceKind,
  leftKey: string,
  rightKind: SkoposCoordinationResourceKind,
  rightKey: string,
): boolean => {
  if (leftKind === 'git-mutation' || rightKind === 'git-mutation') {
    return leftKind === 'git-mutation' && rightKind === 'git-mutation';
  }
  if (
    leftKind === 'semantic-resource' ||
    rightKind === 'semantic-resource'
  ) {
    return leftKind === rightKind && leftKey === rightKey;
  }
  if (leftKind === 'path-pattern' && rightKind === 'path-pattern') {
    return patternsMayOverlap(leftKey, rightKey);
  }
  if (leftKind === 'path-pattern') return globMatches(leftKey, rightKey);
  if (rightKind === 'path-pattern') return globMatches(rightKey, leftKey);
  return leftKey === rightKey;
};

const globMatches = (pattern: string, path: string): boolean => {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  const expression = escaped
    .replaceAll('**', '\u0000')
    .replaceAll('*', '[^/]*')
    .replaceAll('?', '[^/]')
    .replaceAll('\u0000', '.*');
  return new RegExp(`^${expression}$`).test(path);
};

const patternsMayOverlap = (left: string, right: string): boolean => {
  if (left === right) return true;
  const leftPrefix = staticPatternPrefix(left);
  const rightPrefix = staticPatternPrefix(right);
  return (
    leftPrefix.startsWith(rightPrefix) ||
    rightPrefix.startsWith(leftPrefix)
  );
};

const staticPatternPrefix = (pattern: string): string => {
  const wildcardIndex = pattern.search(/[*?]/);
  return wildcardIndex === -1 ? pattern : pattern.slice(0, wildcardIndex);
};

const validateLeaseSeconds = (value: number): number => {
  if (
    !Number.isInteger(value) ||
    value < MIN_LEASE_SECONDS ||
    value > MAX_LEASE_SECONDS
  ) {
    throw new Error(
      `Session lease must be an integer from ${MIN_LEASE_SECONDS} to ${MAX_LEASE_SECONDS} seconds.`,
    );
  }
  return value;
};

const recordEvent = (
  db: SqliteDatabase,
  {
    kind,
    sessionId,
    taskId,
    actorId,
    details,
    now,
  }: {
    kind: string;
    sessionId?: string;
    taskId?: string;
    actorId?: string;
    details: Record<string, unknown>;
    now: number;
  },
): void => {
  db.prepare(
    `INSERT INTO coordination_events (
      event_id, event_kind, session_id, task_id, actor_id,
      details_json, recorded_at_ms
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    randomUUID(),
    kind,
    sessionId ?? null,
    taskId ?? null,
    actorId ?? null,
    JSON.stringify(details),
    now,
  );
};

const readGitIdentity = async (
  workspaceRoot: string,
): Promise<{ branch: string | null; baseRevision: string | null }> => {
  try {
    const [{ stdout: branch }, { stdout: revision }] = await Promise.all([
      execFileAsync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
        cwd: workspaceRoot,
      }),
      execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: workspaceRoot }),
    ]);
    return {
      branch: branch.trim() || null,
      baseRevision: revision.trim() || null,
    };
  } catch {
    return { branch: null, baseRevision: null };
  }
};

const assertNonEmpty = (value: string, message: string): void => {
  if (!value.trim()) throw new Error(message);
};

const toIso = (milliseconds: number): string =>
  new Date(milliseconds).toISOString();

interface SessionRow {
  session_id: string;
  actor_id: string;
  host: string;
  process_id: number;
  checkout_path: string;
  branch: string | null;
  base_revision: string | null;
  mode: SkoposCoordinationSessionMode;
  state: SkoposCoordinationSession['state'];
  opened_at_ms: number;
  heartbeat_at_ms: number;
  lease_expires_at_ms: number;
  closed_at_ms: number | null;
}

interface ReservationRow {
  task_id: string;
  session_id: string;
  actor_id: string;
  reserved_at_ms: number;
}

interface ClaimRow {
  claim_id: string;
  task_id: string;
  session_id: string;
  actor_id: string;
  resource_kind: SkoposCoordinationResourceKind;
  resource_key: string;
  claimed_at_ms: number;
}

interface MutationRow {
  mutation_id: string;
  task_id: string;
  session_id: string;
  actor_id: string;
  path: string;
  operation: SkoposMutationOperation;
  before_digest: string;
  after_digest: string | null;
  status: SkoposMutationLedgerEntry['status'];
  reason: string | null;
  started_at_ms: number;
  completed_at_ms: number | null;
}

interface ContaminationRow {
  contamination_id: string;
  task_id: string | null;
  session_id: string | null;
  path: string;
  expected_digest: string | null;
  observed_digest: string;
  reason: string;
  state: SkoposCoordinationContamination['state'];
  detected_at_ms: number;
  reconciled_at_ms: number | null;
  reconciled_by_actor_id: string | null;
}

interface SqliteStatement {
  get(...parameters: unknown[]): unknown;
  all(...parameters: unknown[]): unknown[];
  run(...parameters: unknown[]): {
    changes: number;
    lastInsertRowid: number | bigint;
  };
}

interface SqliteDatabase {
  exec(sql: string): void;
  prepare(sql: string): SqliteStatement;
  close(): void;
}
