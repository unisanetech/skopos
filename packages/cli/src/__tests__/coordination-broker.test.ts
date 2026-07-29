import { spawnSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  claimSkoposCoordinationResource,
  closeSkoposCoordinationSession,
  getSkoposCoordinationStatus,
  heartbeatSkoposCoordinationSession,
  openSkoposCoordinationSession,
  releaseSkoposCoordinationTask,
  reserveSkoposCoordinationTask,
} from '../../../runtime/src/application/coordination/coordination.service.js';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('same-directory coordination broker', () => {
  it('atomically enforces one writing Task per Session and one Session per Task', async () => {
    const root = await createWorkspace();
    await Promise.all([
      openSession(root, 'session-a', 'agent-a'),
      openSession(root, 'session-b', 'agent-b'),
    ]);

    await reserveSkoposCoordinationTask({
      cwd: root,
      sessionId: 'session-a',
      taskId: 'task-a',
    });

    await expect(
      reserveSkoposCoordinationTask({
        cwd: root,
        sessionId: 'session-b',
        taskId: 'task-a',
      }),
    ).rejects.toThrow('reserved by Session session-a');
    await expect(
      reserveSkoposCoordinationTask({
        cwd: root,
        sessionId: 'session-a',
        taskId: 'task-b',
      }),
    ).rejects.toThrow('already reserves writing Task task-a');
  });

  it('rejects overlapping path, semantic, and Git claims across Tasks', async () => {
    const root = await createWorkspace();
    await Promise.all([
      openSession(root, 'session-a', 'agent-a'),
      openSession(root, 'session-b', 'agent-b'),
    ]);
    await Promise.all([
      reserveSkoposCoordinationTask({
        cwd: root,
        sessionId: 'session-a',
        taskId: 'task-a',
      }),
      reserveSkoposCoordinationTask({
        cwd: root,
        sessionId: 'session-b',
        taskId: 'task-b',
      }),
    ]);

    await claimSkoposCoordinationResource({
      cwd: root,
      sessionId: 'session-a',
      taskId: 'task-a',
      resourceKind: 'path-pattern',
      resourceKey: 'packages/runtime/src/**',
    });
    await expect(
      claimSkoposCoordinationResource({
        cwd: root,
        sessionId: 'session-b',
        taskId: 'task-b',
        resourceKind: 'exact-path',
        resourceKey: 'packages/runtime/src/index.ts',
      }),
    ).rejects.toThrow('conflicts with path-pattern');

    await claimSkoposCoordinationResource({
      cwd: root,
      sessionId: 'session-a',
      taskId: 'task-a',
      resourceKind: 'semantic-resource',
      resourceKey: 'public-api:coordination',
    });
    await expect(
      claimSkoposCoordinationResource({
        cwd: root,
        sessionId: 'session-b',
        taskId: 'task-b',
        resourceKind: 'semantic-resource',
        resourceKey: 'public-api:coordination',
      }),
    ).rejects.toThrow('owned by Task task-a');

    await claimSkoposCoordinationResource({
      cwd: root,
      sessionId: 'session-a',
      taskId: 'task-a',
      resourceKind: 'git-mutation',
      resourceKey: 'commit',
    });
    await expect(
      claimSkoposCoordinationResource({
        cwd: root,
        sessionId: 'session-b',
        taskId: 'task-b',
        resourceKind: 'git-mutation',
        resourceKey: 'stage',
      }),
    ).rejects.toThrow('git-mutation:repository');
  });

  it('retains reservations and claims when a Session lease expires', async () => {
    const root = await createWorkspace();
    const opened = await openSession(root, 'session-stale', 'agent-stale');
    await reserveSkoposCoordinationTask({
      cwd: root,
      sessionId: 'session-stale',
      taskId: 'task-stale',
    });
    await claimSkoposCoordinationResource({
      cwd: root,
      sessionId: 'session-stale',
      taskId: 'task-stale',
      resourceKind: 'exact-path',
      resourceKey: 'src/owned.ts',
    });
    expireSessionLease(opened.databasePath, 'session-stale');

    const status = await getSkoposCoordinationStatus({ cwd: root });

    expect(status).toMatchObject({
      enforcementLevel: 'cooperative',
      preventiveSafety: false,
      sessions: [
        expect.objectContaining({
          sessionId: 'session-stale',
          state: 'stale',
        }),
      ],
      reservations: [
        expect.objectContaining({
          taskId: 'task-stale',
          sessionId: 'session-stale',
        }),
      ],
      claims: [
        expect.objectContaining({
          taskId: 'task-stale',
          resourceKey: 'src/owned.ts',
        }),
      ],
    });
    await expect(
      heartbeatSkoposCoordinationSession({
        cwd: root,
        sessionId: 'session-stale',
      }),
    ).rejects.toThrow('cannot renew silently');
    await expect(
      releaseSkoposCoordinationTask({
        cwd: root,
        sessionId: 'session-stale',
        taskId: 'task-stale',
        reason: 'Stale process attempted release.',
      }),
    ).rejects.toThrow('is stale');
  });

  it('releases claims only through explicit Task release before Session close', async () => {
    const root = await createWorkspace();
    await openSession(root, 'session-a', 'agent-a');
    await reserveSkoposCoordinationTask({
      cwd: root,
      sessionId: 'session-a',
      taskId: 'task-a',
    });
    await claimSkoposCoordinationResource({
      cwd: root,
      sessionId: 'session-a',
      taskId: 'task-a',
      resourceKind: 'exact-path',
      resourceKey: 'src/a.ts',
    });

    await expect(
      closeSkoposCoordinationSession({
        cwd: root,
        sessionId: 'session-a',
      }),
    ).rejects.toThrow('release the Task explicitly');

    const released = await releaseSkoposCoordinationTask({
      cwd: root,
      sessionId: 'session-a',
      taskId: 'task-a',
      reason: 'Task completed and working tree ownership reconciled.',
    });
    expect(released.releasedClaimCount).toBe(1);
    const closed = await closeSkoposCoordinationSession({
      cwd: root,
      sessionId: 'session-a',
    });
    expect(closed.session.state).toBe('closed');
  });

  it('keeps observer Sessions outside writing reservations', async () => {
    const root = await createWorkspace();
    await openSkoposCoordinationSession({
      cwd: root,
      actorId: 'reviewer',
      host: 'test',
      sessionId: 'review-session',
      mode: 'reviewer',
    });

    await expect(
      reserveSkoposCoordinationTask({
        cwd: root,
        sessionId: 'review-session',
        taskId: 'task-review',
      }),
    ).rejects.toThrow('only writer Sessions may reserve or claim');
  });
});

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-coordination-'));
  temporaryRoots.push(root);
  return root;
};

const openSession = (
  root: string,
  sessionId: string,
  actorId: string,
) =>
  openSkoposCoordinationSession({
    cwd: root,
    actorId,
    host: 'vitest',
    sessionId,
    leaseSeconds: 30,
  });

const expireSessionLease = (databasePath: string, sessionId: string): void => {
  const script = `
    import { DatabaseSync } from 'node:sqlite';
    const db = new DatabaseSync(process.argv[1]);
    db.prepare('UPDATE sessions SET lease_expires_at_ms = 0 WHERE session_id = ?').run(process.argv[2]);
    db.close();
  `;
  const result = spawnSync(
    process.execPath,
    ['--input-type=module', '-e', script, databasePath, sessionId],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || 'Failed to expire coordination Session lease.');
  }
};
