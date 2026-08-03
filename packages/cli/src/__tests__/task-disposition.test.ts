import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { buildSkoposStartRuntime } from '../../../runtime/src/application/start/start.service.js';
import {
  applySkoposTaskDispositionRuntime,
  claimSkoposTaskRuntime,
  completeSkoposTaskStepRuntime,
  moveSkoposTaskToVerificationRuntime,
  releaseSkoposTaskRuntime,
} from '../../../runtime/src/application/task/task.service.js';
import { buildSkoposWorkQueueRuntime } from '../../../runtime/src/application/work-queue/work-queue.service.js';

const temporaryRoots: string[] = [];
const originalCodexHome = process.env.CODEX_HOME;

afterEach(async () => {
  if (originalCodexHome === undefined) delete process.env.CODEX_HOME;
  else process.env.CODEX_HOME = originalCodexHome;
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('Task work disposition state machine', () => {
  it('separates ownership release from ready, defer, and resume dispositions', async () => {
    const root = await createWorkspace();
    const started = await startTask(root, 'task-session', 'agent-a', 'src/a.ts');

    const released = await releaseSkoposTaskRuntime({
      cwd: root,
      taskId: started.task.id,
      actor: 'agent-a',
    });
    expect(released.state).toBe('active');
    expect(released.coordination.claimedBy).toBeUndefined();

    const ready = await applySkoposTaskDispositionRuntime({
      cwd: root,
      taskId: started.task.id,
      disposition: 'ready',
      reason: 'Return unfinished work to the ready queue.',
      actor: 'maintainer',
    });
    expect(ready).toMatchObject({
      state: 'ready',
      disposition: {
        kind: 'ready',
        priorState: 'active',
        nextState: 'ready',
        actorId: 'maintainer',
      },
    });

    const resumed = await applySkoposTaskDispositionRuntime({
      cwd: root,
      taskId: started.task.id,
      disposition: 'resume',
      reason: 'Resume the ready work.',
      actor: 'agent-b',
    });
    expect(resumed).toMatchObject({
      state: 'active',
      coordination: { claimedBy: { actorId: 'agent-b' } },
    });

    const deferred = await applySkoposTaskDispositionRuntime({
      cwd: root,
      taskId: started.task.id,
      disposition: 'defer',
      reason: 'Wait for an external dependency.',
      actor: 'agent-b',
    });
    expect(deferred).toMatchObject({
      state: 'deferred',
      disposition: { kind: 'defer', reason: 'Wait for an external dependency.' },
    });
    expect(deferred.coordination.claimedBy).toBeUndefined();
    await expect(
      claimSkoposTaskRuntime({ cwd: root, taskId: started.task.id, actor: 'agent-c' }),
    ).rejects.toThrow('resume its disposition');

    const queue = await buildSkoposWorkQueueRuntime({ cwd: root });
    expect(queue.workQueue.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: started.task.id,
          disposition: 'deferred',
          reason: 'Task is deferred: Wait for an external dependency.',
        }),
      ]),
    );
  }, 20_000);

  it('returns verification to active work and rejects invalid transitions', async () => {
    const root = await createWorkspace();
    const started = await startTask(root, 'verify-session', 'agent-a', 'src/verify.ts');
    let task = started.task;
    for (const step of task.steps) {
      task = await completeSkoposTaskStepRuntime({
        cwd: root,
        taskId: task.id,
        stepId: step.id,
        actor: 'agent-a',
      });
    }
    const verifying = await moveSkoposTaskToVerificationRuntime({
      cwd: root,
      taskId: task.id,
      actor: 'agent-a',
    });
    expect(verifying.state).toBe('verifying');

    const returned = await applySkoposTaskDispositionRuntime({
      cwd: root,
      taskId: task.id,
      disposition: 'return-from-verification',
      reason: 'Verification exposed implementation work.',
      actor: 'agent-b',
    });
    expect(returned).toMatchObject({
      state: 'active',
      disposition: {
        kind: 'return-from-verification',
        priorState: 'verifying',
        nextState: 'active',
      },
      coordination: { claimedBy: { actorId: 'agent-b' } },
    });
    await expect(
      applySkoposTaskDispositionRuntime({
        cwd: root,
        taskId: task.id,
        disposition: 'resume',
        reason: 'Invalid active resume.',
        actor: 'agent-c',
      }),
    ).rejects.toThrow('from state active');
  }, 20_000);

  it('records terminal cancel and explicit successor supersession', async () => {
    const root = await createWorkspace();
    const source = await startTask(root, 'source-session', 'agent-source', 'src/source.ts');
    const successor = await startTask(
      root,
      'successor-session',
      'agent-successor',
      'src/successor.ts',
    );

    const superseded = await applySkoposTaskDispositionRuntime({
      cwd: root,
      taskId: source.task.id,
      disposition: 'supersede',
      successorTaskId: successor.task.id,
      reason: 'The narrower successor owns the remaining work.',
      actor: 'maintainer',
    });
    expect(superseded).toMatchObject({
      state: 'superseded',
      supersededByTaskId: successor.task.id,
      disposition: {
        kind: 'supersede',
        successorTaskId: successor.task.id,
      },
    });

    const cancelled = await applySkoposTaskDispositionRuntime({
      cwd: root,
      taskId: successor.task.id,
      disposition: 'cancel',
      reason: 'The requested work is no longer needed.',
      actor: 'maintainer',
    });
    expect(cancelled).toMatchObject({
      state: 'cancelled',
      disposition: { kind: 'cancel', priorState: 'active', nextState: 'cancelled' },
    });

    const queue = await buildSkoposWorkQueueRuntime({ cwd: root });
    expect(queue.workQueue.entries.some((entry) => entry.id === source.task.id)).toBe(false);
    expect(queue.workQueue.entries.some((entry) => entry.id === successor.task.id)).toBe(false);
  }, 20_000);
});

const startTask = (
  root: string,
  sessionId: string,
  actor: string,
  ownedPath: string,
) =>
  buildSkoposStartRuntime({
    cwd: root,
    goal: `Maintain ${ownedPath}`,
    actor,
    sessionId,
    host: 'vitest',
    acceptanceCriteria: [`${ownedPath} remains maintainable.`],
    ownedPaths: [ownedPath],
  });

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-task-disposition-'));
  temporaryRoots.push(root);
  process.env.CODEX_HOME = join(root, '.codex-home');
  await Promise.all([
    mkdir(join(root, 'src'), { recursive: true }),
    mkdir(join(root, '.codex-home/sessions'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(root, 'package.json'),
      JSON.stringify({ name: 'task-disposition-fixture', private: true }),
      'utf8',
    ),
    writeFile(join(root, 'README.md'), '# Task disposition fixture\n', 'utf8'),
    writeFile(join(root, 'AGENTS.md'), '# Agent rules\n', 'utf8'),
  ]);
  await initSkoposProject({
    cwd: root,
    mode: 'existing',
    actor: 'fixture-init',
    scaffoldInstructions: false,
  });
  return root;
};
