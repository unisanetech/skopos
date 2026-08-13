import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
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
  transitionSkoposCoordinationSession,
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

  it('audits and resumes clean stale ownership from a live replacement Session', async () => {
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
    const mutation = await beginSkoposCoordinationMutation({
      cwd: root,
      sessionId: 'session-stale',
      taskId: 'task-stale',
      path: 'src/owned.ts',
      operation: 'edit',
    });
    await writeFile(join(root, 'src/owned.ts'), 'recorded owned work\n', 'utf8');
    await completeSkoposCoordinationMutation({
      cwd: root,
      sessionId: 'session-stale',
      mutationId: mutation.mutation.mutationId,
    });
    expireSessionLease(opened.databasePath, 'session-stale');
    await openSession(root, 'session-next', 'agent-next');

    const recovered = await recoverSkoposCoordinationTask({
      cwd: root,
      taskId: 'task-stale',
      sessionId: 'session-next',
      operation: 'resume',
      reason: 'The prior writer crashed after recording its owned change.',
    });

    expect(recovered).toMatchObject({
      priorSessionId: 'session-stale',
      sessionId: 'session-next',
      actorId: 'agent-next',
      generation: 1,
      outcome: 'resumed',
      releasedClaimCount: 0,
      ledgerState: { open: 0, recorded: 1, contaminated: 0 },
    });
    const status = await getSkoposCoordinationStatus({ cwd: root });
    expect(status.reservations).toEqual([
      expect.objectContaining({ taskId: 'task-stale', sessionId: 'session-next' }),
    ]);
    expect(status.claims).toEqual([
      expect.objectContaining({ taskId: 'task-stale', sessionId: 'session-next' }),
    ]);
    expect(status.mutations[0]).toMatchObject({
      taskId: 'task-stale',
      sessionId: 'session-stale',
      status: 'recorded',
    });
  });

  it('releases stale ownership without requiring the stale Session to act', async () => {
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
    await openSession(root, 'session-maintainer', 'maintainer');

    const recovered = await recoverSkoposCoordinationTask({
      cwd: root,
      taskId: 'task-stale',
      sessionId: 'session-maintainer',
      operation: 'release',
      reason: 'The abandoned Task is being dispositioned separately.',
    });

    expect(recovered).toMatchObject({
      outcome: 'released',
      releasedClaimCount: 1,
      priorSessionId: 'session-stale',
      sessionId: 'session-maintainer',
    });
    await expect(
      closeSkoposCoordinationSession({ cwd: root, sessionId: 'session-stale' }),
    ).resolves.toMatchObject({ session: { state: 'closed' } });
  });

  it('releases the SQLite file before stale recovery returns', async () => {
    const root = await createWorkspace();
    const opened = await openSession(root, 'session-stale', 'agent-stale');
    await reserveSkoposCoordinationTask({
      cwd: root,
      sessionId: 'session-stale',
      taskId: 'task-stale',
    });
    expireSessionLease(opened.databasePath, 'session-stale');
    await openSession(root, 'session-maintainer', 'maintainer');

    await recoverSkoposCoordinationTask({
      cwd: root,
      taskId: 'task-stale',
      sessionId: 'session-maintainer',
      operation: 'release',
      reason: 'Verify that recovery closes its coordination database before returning.',
    });

    await expect(rm(root, { recursive: true, force: true })).resolves.toBeUndefined();
    const rootIndex = temporaryRoots.indexOf(root);
    if (rootIndex >= 0) temporaryRoots.splice(rootIndex, 1);
  });

  it('blocks stale Task recovery until a running Action is reconciled', async () => {
    const root = await createWorkspace();
    const opened = await openSession(root, 'session-stale', 'agent-stale');
    await reserveSkoposCoordinationTask({
      cwd: root,
      sessionId: 'session-stale',
      taskId: 'task-stale',
    });
    expireSessionLease(opened.databasePath, 'session-stale');
    await openSession(root, 'session-next', 'agent-next');
    await mkdir(join(root, '.skopos/runs'), { recursive: true });
    await writeFile(
      join(root, '.skopos/runs/run-fixture-active.json'),
      JSON.stringify({
        schemaVersion: 1,
        id: 'run-fixture-active',
        type: 'action-run',
        status: 'generated',
        taskId: 'task-stale',
        runStatus: 'running',
      }),
      'utf8',
    );

    await expect(
      recoverSkoposCoordinationTask({
        cwd: root,
        taskId: 'task-stale',
        sessionId: 'session-next',
        operation: 'resume',
        reason: 'Attempt recovery before Action reconciliation.',
      }),
    ).rejects.toThrow('unreconciled running Action');
  });

  it('fails closed when stale work has an open mutation or contamination', async () => {
    const openRoot = await createWorkspace();
    initializeGitBaseline(openRoot);
    const openSessionResult = await openSession(openRoot, 'session-open', 'agent-open');
    await reserveSkoposCoordinationTask({
      cwd: openRoot,
      sessionId: 'session-open',
      taskId: 'task-open',
    });
    await claimSkoposCoordinationResource({
      cwd: openRoot,
      sessionId: 'session-open',
      taskId: 'task-open',
      resourceKind: 'exact-path',
      resourceKey: 'src/open.ts',
    });
    await beginSkoposCoordinationMutation({
      cwd: openRoot,
      sessionId: 'session-open',
      taskId: 'task-open',
      path: 'src/open.ts',
      operation: 'edit',
    });
    await writeFile(join(openRoot, 'src/open.ts'), 'in-progress Git mutation\n', 'utf8');
    expireSessionLease(openSessionResult.databasePath, 'session-open');
    await openSession(openRoot, 'session-next', 'agent-next');
    await expect(
      recoverSkoposCoordinationTask({
        cwd: openRoot,
        taskId: 'task-open',
        sessionId: 'session-next',
        operation: 'resume',
        reason: 'Attempt recovery with an open mutation.',
      }),
    ).rejects.toThrow('open mutation');

    const contaminatedRoot = await createWorkspace();
    const contaminatedSession = await openSession(
      contaminatedRoot,
      'session-contaminated',
      'agent-contaminated',
    );
    await reserveSkoposCoordinationTask({
      cwd: contaminatedRoot,
      sessionId: 'session-contaminated',
      taskId: 'task-contaminated',
    });
    await claimSkoposCoordinationResource({
      cwd: contaminatedRoot,
      sessionId: 'session-contaminated',
      taskId: 'task-contaminated',
      resourceKind: 'exact-path',
      resourceKey: 'src/contaminated.ts',
    });
    const mutation = await beginSkoposCoordinationMutation({
      cwd: contaminatedRoot,
      sessionId: 'session-contaminated',
      taskId: 'task-contaminated',
      path: 'src/contaminated.ts',
      operation: 'edit',
    });
    await writeFile(join(contaminatedRoot, 'src/contaminated.ts'), 'recorded\n', 'utf8');
    await completeSkoposCoordinationMutation({
      cwd: contaminatedRoot,
      sessionId: 'session-contaminated',
      mutationId: mutation.mutation.mutationId,
    });
    await writeFile(join(contaminatedRoot, 'src/contaminated.ts'), 'external edit\n', 'utf8');
    expireSessionLease(contaminatedSession.databasePath, 'session-contaminated');
    await openSession(contaminatedRoot, 'session-next', 'agent-next');
    await expect(
      recoverSkoposCoordinationTask({
        cwd: contaminatedRoot,
        taskId: 'task-contaminated',
        sessionId: 'session-next',
        operation: 'resume',
        reason: 'Attempt recovery with contamination.',
      }),
    ).rejects.toThrow('contamination issue');
  }, 15_000);

  it('allows only one winner across concurrent stale recovery attempts', async () => {
    const root = await createWorkspace();
    const opened = await openSession(root, 'session-stale', 'agent-stale');
    await reserveSkoposCoordinationTask({
      cwd: root,
      sessionId: 'session-stale',
      taskId: 'task-stale',
    });
    expireSessionLease(opened.databasePath, 'session-stale');
    await Promise.all([
      openSession(root, 'session-next-a', 'agent-next-a'),
      openSession(root, 'session-next-b', 'agent-next-b'),
    ]);

    const attempts = await Promise.allSettled([
      recoverSkoposCoordinationTask({
        cwd: root,
        taskId: 'task-stale',
        sessionId: 'session-next-a',
        operation: 'resume',
        reason: 'Concurrent recovery attempt A.',
      }),
      recoverSkoposCoordinationTask({
        cwd: root,
        taskId: 'task-stale',
        sessionId: 'session-next-b',
        operation: 'resume',
        reason: 'Concurrent recovery attempt B.',
      }),
    ]);

    expect(attempts.filter((attempt) => attempt.status === 'fulfilled')).toHaveLength(1);
    expect(attempts.filter((attempt) => attempt.status === 'rejected')).toHaveLength(1);
    const status = await getSkoposCoordinationStatus({ cwd: root });
    expect(status.reservations).toHaveLength(1);
    expect(['session-next-a', 'session-next-b']).toContain(
      status.reservations[0]!.sessionId,
    );
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

  it('audits safe writer and reviewer transitions after writing authority is released', async () => {
    const root = await createWorkspace();
    const opened = await openSession(root, 'session-origin', 'agent-origin');
    await reserveSkoposCoordinationTask({
      cwd: root,
      sessionId: 'session-origin',
      taskId: 'task-origin',
    });
    await claimSkoposCoordinationResource({
      cwd: root,
      sessionId: 'session-origin',
      taskId: 'task-origin',
      resourceKind: 'exact-path',
      resourceKey: 'src/a.ts',
    });
    const mutation = await beginSkoposCoordinationMutation({
      cwd: root,
      sessionId: 'session-origin',
      taskId: 'task-origin',
      path: 'src/a.ts',
      operation: 'edit',
    });

    await expect(
      transitionSkoposCoordinationSession({
        cwd: root,
        sessionId: 'session-origin',
        actorId: 'agent-origin',
        mode: 'reviewer',
        reason: 'Return the originating Session to review.',
      }),
    ).rejects.toThrow('still reserves Task task-origin');

    await releaseSkoposCoordinationTask({
      cwd: root,
      sessionId: 'session-origin',
      taskId: 'task-origin',
      reason: 'Writing authority is no longer needed.',
    });
    await expect(
      transitionSkoposCoordinationSession({
        cwd: root,
        sessionId: 'session-origin',
        actorId: 'agent-origin',
        mode: 'reviewer',
        reason: 'Return the originating Session to review.',
      }),
    ).rejects.toThrow('has 1 unresolved mutation');

    await completeSkoposCoordinationMutation({
      cwd: root,
      sessionId: 'session-origin',
      mutationId: mutation.mutation.mutationId,
    });
    const reviewer = await transitionSkoposCoordinationSession({
      cwd: root,
      sessionId: 'session-origin',
      actorId: 'agent-origin',
      mode: 'reviewer',
      reason: 'Writing authority is released and mutation accounting is complete.',
    });
    expect(reviewer).toMatchObject({
      priorMode: 'writer',
      session: { mode: 'reviewer', state: 'live' },
    });
    await expect(
      reserveSkoposCoordinationTask({
        cwd: root,
        sessionId: 'session-origin',
        taskId: 'task-reviewer-cannot-write',
      }),
    ).rejects.toThrow('only writer Sessions may reserve or claim');
    await expect(
      transitionSkoposCoordinationSession({
        cwd: root,
        sessionId: 'session-origin',
        actorId: 'another-agent',
        mode: 'writer',
        reason: 'Attempt an actor-changing transition.',
      }),
    ).rejects.toThrow('belongs to actor agent-origin');

    const writer = await transitionSkoposCoordinationSession({
      cwd: root,
      sessionId: 'session-origin',
      actorId: 'agent-origin',
      mode: 'writer',
      reason: 'Resume implementation after review found a required change.',
    });
    expect(writer).toMatchObject({
      priorMode: 'reviewer',
      session: { mode: 'writer', state: 'live' },
    });
    await reserveSkoposCoordinationTask({
      cwd: root,
      sessionId: 'session-origin',
      taskId: 'task-writer-resumed',
    });

    expect(readSessionTransitionEvents(opened.databasePath, 'session-origin')).toEqual([
      {
        priorMode: 'writer',
        mode: 'reviewer',
        reason: 'Writing authority is released and mutation accounting is complete.',
      },
      {
        priorMode: 'reviewer',
        mode: 'writer',
        reason: 'Resume implementation after review found a required change.',
      },
    ]);
  });
});

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-coordination-'));
  temporaryRoots.push(root);
  await mkdir(join(root, 'src'), { recursive: true });
  await writeFile(join(root, '.keep'), '', 'utf8');
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

const readSessionTransitionEvents = (
  databasePath: string,
  sessionId: string,
): Array<{ priorMode: string; mode: string; reason: string }> => {
  const script = `
    import { DatabaseSync } from 'node:sqlite';
    const db = new DatabaseSync(process.argv[1]);
    const rows = db.prepare(
      "SELECT details_json FROM coordination_events WHERE event_kind = 'session-mode-transitioned' AND session_id = ? ORDER BY recorded_at_ms, event_id"
    ).all(process.argv[2]);
    process.stdout.write(JSON.stringify(rows.map((row) => JSON.parse(row.details_json))));
    db.close();
  `;
  const result = spawnSync(
    process.execPath,
    ['--input-type=module', '-e', script, databasePath, sessionId],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || 'Failed to read Session transition events.');
  }
  return JSON.parse(result.stdout) as Array<{
    priorMode: string;
    mode: string;
    reason: string;
  }>;
};

const initializeGitBaseline = (root: string): void => {
  for (const args of [
    ['init', '--initial-branch=main'],
    ['config', 'user.email', 'skopos@example.com'],
    ['config', 'user.name', 'Skopos Fixture'],
    ['add', '.'],
    ['commit', '-m', 'baseline'],
  ]) {
    const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stderr || `git ${args.join(' ')} failed`);
  }
};
