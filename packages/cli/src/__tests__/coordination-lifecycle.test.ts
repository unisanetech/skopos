import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { getSkoposCoordinationStatus } from '../../../runtime/src/application/coordination/coordination.service.js';
import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { buildSkoposSessionContextRuntime } from '../../../runtime/src/application/session/session-context.service.js';
import { buildSkoposStartRuntime } from '../../../runtime/src/application/start/start.service.js';

const temporaryRoots: string[] = [];
const originalCodexHome = process.env.CODEX_HOME;

afterEach(async () => {
  if (originalCodexHome === undefined) {
    delete process.env.CODEX_HOME;
  } else {
    process.env.CODEX_HOME = originalCodexHome;
  }
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('coordination-aware agent lifecycle', () => {
  it('opens one host Session, reserves the started Task, and claims owned paths', async () => {
    const root = await createWorkspace();

    const started = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Change the coordination fixture',
      actor: 'agent-a',
      sessionId: 'host-session-a',
      host: 'codex',
      acceptanceCriteria: ['The fixture remains coordinated.'],
      ownedPaths: ['src/existing.ts', 'src/generated.ts', 'src/domain'],
    });

    expect(started.coordination).toMatchObject({
      enforcementLevel: 'cooperative',
      preventiveSafety: false,
      session: { sessionId: 'host-session-a', state: 'live' },
      reservation: {
        taskId: started.task.id,
        sessionId: 'host-session-a',
      },
    });
    expect(started.coordination?.claims).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          resourceKind: 'exact-path',
          resourceKey: 'src/existing.ts',
        }),
        expect.objectContaining({
          resourceKind: 'exact-path',
          resourceKey: 'src/generated.ts',
        }),
        expect.objectContaining({
          resourceKind: 'path-pattern',
          resourceKey: 'src/domain/**',
        }),
      ]),
    );

    const resumedContext = await buildSkoposSessionContextRuntime({
      cwd: root,
      actor: 'agent-a',
      sessionId: 'host-session-a',
      host: 'codex',
    });
    expect(resumedContext.coordination).toMatchObject({
      enforcementLevel: 'cooperative',
      preventiveSafety: false,
      session: {
        sessionId: 'host-session-a',
        actorId: 'agent-a',
        host: 'codex',
        state: 'live',
      },
      reservation: { taskId: started.task.id },
    });
    expect(resumedContext.currentTask).toMatchObject({
      id: started.task.id,
      goal: 'Change the coordination fixture',
      state: 'active',
    });
    expect(resumedContext.currentTask?.ownedPaths).toEqual([
      'src/domain',
      'src/existing.ts',
      'src/generated.ts',
    ]);
    expect(resumedContext.currentTask?.totalStepCount).toBeGreaterThan(0);
    expect(resumedContext.nextCommand).toContain(
      `skopos task show ${started.task.id} . --json`,
    );
    expect(resumedContext.nextCommand).not.toContain('adoption/analysis-brief.json');
    expect(resumedContext.additionalContext).toContain(
      `Reserved Task: ${started.task.id}; resource claims: 3.`,
    );

    const status = await getSkoposCoordinationStatus({ cwd: root });
    expect(status.sessions).toHaveLength(1);
    expect(status.reservations).toHaveLength(1);
    expect(status.claims).toHaveLength(3);
  }, 15_000);

  it('fails a second Task start for the same writing Session', async () => {
    const root = await createWorkspace();
    await buildSkoposStartRuntime({
      cwd: root,
      goal: 'First coordinated Task',
      actor: 'agent-a',
      sessionId: 'host-session-a',
      host: 'claude-code',
      ownedPaths: ['src/existing.ts'],
    });

    await expect(
      buildSkoposStartRuntime({
        cwd: root,
        goal: 'Second coordinated Task',
        actor: 'agent-a',
        sessionId: 'host-session-a',
        host: 'claude-code',
        ownedPaths: ['src/other.ts'],
      }),
    ).rejects.toThrow('already reserves writing Task');

    const status = await getSkoposCoordinationStatus({ cwd: root });
    expect(status.sessions).toHaveLength(1);
    expect(status.reservations).toHaveLength(1);
    expect(status.claims).toHaveLength(1);
  });
});

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-coordination-lifecycle-'));
  temporaryRoots.push(root);
  process.env.CODEX_HOME = join(root, '.codex-home');
  await Promise.all([
    mkdir(join(root, 'src/domain'), { recursive: true }),
    mkdir(join(root, '.codex-home/sessions'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(root, 'package.json'),
      JSON.stringify({
        name: 'coordination-lifecycle-fixture',
        private: true,
        scripts: { test: 'vitest run' },
      }),
      'utf8',
    ),
    writeFile(join(root, 'README.md'), '# Coordination fixture\n', 'utf8'),
    writeFile(join(root, 'AGENTS.md'), '# Agent rules\n', 'utf8'),
    writeFile(join(root, 'src/existing.ts'), 'export const existing = true;\n', 'utf8'),
  ]);
  await initSkoposProject({
    cwd: root,
    mode: 'existing',
    actor: 'fixture-init',
    scaffoldInstructions: false,
  });
  return root;
};
