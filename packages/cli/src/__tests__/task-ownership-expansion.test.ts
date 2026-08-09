import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { buildSkoposStartRuntime } from '../../../runtime/src/application/start/start.service.js';
import {
  expandSkoposTaskOwnershipRuntime,
  showSkoposTaskRuntime,
} from '../../../runtime/src/application/task/task.service.js';
import { runSkoposCli } from '../cli/index.js';

const temporaryRoots: string[] = [];
const originalCodexHome = process.env.CODEX_HOME;

afterEach(async () => {
  vi.restoreAllMocks();
  if (originalCodexHome === undefined) {
    delete process.env.CODEX_HOME;
  } else {
    process.env.CODEX_HOME = originalCodexHome;
  }
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('Task ownership expansion', () => {
  it('records adopted paths and refreshes the Task proof contract', async () => {
    const root = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Expand one bounded implementation Task',
      actor: 'agent-a',
      risk: 'standard',
      ownedPaths: ['src/one.ts'],
    });
    const priorBaselineId = started.task.proofSubject.baselineId;
    expect(started.task.selectedActions.map((action) => action.id)).not.toContain(
      'fixture.new-path-check',
    );

    const expanded = await expandSkoposTaskOwnershipRuntime({
      cwd: root,
      taskId: started.task.id,
      ownedPaths: ['src/two.ts'],
      reason: 'Review found a second file required by the same accepted behavior.',
      actor: 'agent-a',
    });

    expect(expanded.changeScope.declaredOwnedPaths).toEqual(['src/one.ts', 'src/two.ts']);
    expect(expanded.proofSubject.baselineId).not.toBe(priorBaselineId);
    expect(expanded.ownershipExpansions).toEqual([
      expect.objectContaining({
        paths: ['src/two.ts'],
        actorId: 'agent-a',
        reason: 'Review found a second file required by the same accepted behavior.',
        baselinePaths: [expect.objectContaining({ path: 'src/two.ts' })],
      }),
    ]);
    expect(expanded.selectedActions.map((action) => action.id)).toContain(
      'fixture.new-path-check',
    );
    expect(expanded.selectedGuardIds).toContain('fixture.new-path-check');
    expect(expanded.steps).toContainEqual(
      expect.objectContaining({
        id: 'action-fixture.new-path-check',
        status: 'pending',
      }),
    );
    expect(expanded.evidenceRequirements).toContainEqual(
      expect.objectContaining({
        id: 'guard-fixture.new-path-check',
        actionIds: ['fixture.new-path-check'],
      }),
    );

    await expect(
      showSkoposTaskRuntime({ cwd: root, taskId: started.task.id }),
    ).resolves.toMatchObject({
      proofSubject: { baselineId: expanded.proofSubject.baselineId },
      changeScope: { declaredOwnedPaths: ['src/one.ts', 'src/two.ts'] },
    });
    const trackedTask = await readFile(
      join(root, expanded.trackedDocumentPath!),
      'utf8',
    );
    expect(trackedTask).toContain('## Ownership Expansions');
    expect(trackedTask).toContain('Review found a second file required');
  });

  it('requires the current Task owner, a reason, and genuinely new ownership', async () => {
    const root = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Keep ownership expansion explicit',
      actor: 'agent-a',
      risk: 'standard',
      ownedPaths: ['src/one.ts'],
    });

    await expect(
      expandSkoposTaskOwnershipRuntime({
        cwd: root,
        taskId: started.task.id,
        ownedPaths: ['src/two.ts'],
        reason: 'Same Task intent.',
        actor: 'agent-b',
      }),
    ).rejects.toThrow('claimed by agent-a');
    await expect(
      expandSkoposTaskOwnershipRuntime({
        cwd: root,
        taskId: started.task.id,
        ownedPaths: ['src/two.ts'],
        reason: '   ',
        actor: 'agent-a',
      }),
    ).rejects.toThrow('non-empty reason');
    await expect(
      expandSkoposTaskOwnershipRuntime({
        cwd: root,
        taskId: started.task.id,
        ownedPaths: ['src/one.ts'],
        reason: 'Already admitted.',
        actor: 'agent-a',
      }),
    ).rejects.toThrow('already owns every requested path');
  });

  it('exposes ownership expansion through the public Task command', async () => {
    const root = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Expand ownership through the CLI',
      actor: 'agent-a',
      risk: 'standard',
      ownedPaths: ['src/one.ts'],
    });

    const output = await captureStdout(() =>
      runSkoposCli([
        'task',
        'ownership',
        'add',
        started.task.id,
        '--own',
        'src/two.ts',
        '--reason',
        'The same accepted change requires its paired source file.',
        '--actor',
        'agent-a',
        '--cwd',
        root,
        '--json',
      ]),
    );
    const result = JSON.parse(output) as {
      ownedPaths: string[];
      ownershipExpansionCount: number;
    };

    expect(result.ownedPaths).toEqual(['src/one.ts', 'src/two.ts']);
    expect(result.ownershipExpansionCount).toBe(1);
  });
});

const captureStdout = async (run: () => Promise<void>): Promise<string> => {
  const writes: string[] = [];
  vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
    writes.push(String(chunk));
    return true;
  });
  await run();
  return writes.join('');
};

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-task-ownership-'));
  temporaryRoots.push(root);
  process.env.CODEX_HOME = join(root, '.codex-home');
  await Promise.all([
    mkdir(join(root, 'src'), { recursive: true }),
    mkdir(join(root, '.codex-home/sessions'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(root, 'package.json'),
      JSON.stringify({
        name: 'task-ownership-fixture',
        private: true,
        scripts: { check: 'node --version' },
      }),
      'utf8',
    ),
    writeFile(join(root, 'README.md'), '# Task ownership fixture\n', 'utf8'),
    writeFile(join(root, 'AGENTS.md'), '# Agent rules\n', 'utf8'),
    writeFile(join(root, 'src/one.ts'), 'export const one = 1;\n', 'utf8'),
    writeFile(join(root, 'src/two.ts'), 'export const two = 2;\n', 'utf8'),
  ]);
  await initSkoposProject({
    cwd: root,
    mode: 'existing',
    actor: 'fixture-init',
    scaffoldInstructions: false,
  });
  await Promise.all([
    mkdir(join(root, 'tools/skopos/actions'), { recursive: true }),
    mkdir(join(root, 'tools/skopos/guards'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(root, 'tools/skopos/actions/fixture-new-path-check.yaml'),
      `id: fixture.new-path-check
title: Check newly adopted path
description: Prove ownership expansion refreshes selected Actions.
category: quality-check
scope: [workspace]
command: node --version
cwd: .
inputs: [src/two.ts]
outputs: []
affects: []
capabilities:
  process: required
  network: none
  browser: none
  tools: [node]
  secrets: []
  services: []
effects:
  workspace: none
  artifacts: none
  external: none
concurrency: shared
workspaceMode: overlay-safe
safety: read-only
requiresApproval: false
whenToUse: Run when src/two.ts enters a Task proof boundary.
phases: [closure]
risks: [standard, high-impact]
owner: fixture
`,
      'utf8',
    ),
    writeFile(
      join(root, 'tools/skopos/guards/fixture-new-path-check.yaml'),
      `id: fixture.new-path-check
title: Newly adopted paths require focused proof
description: Select the fixture Action only for src/two.ts.
owner: fixture
scope: [workspace]
strength: required
appliesTo:
  paths: [src/two.ts]
  phases: [closure]
  risks: [standard, high-impact]
requires:
  actionIds: [fixture.new-path-check]
  evidence: source-bound-action
`,
      'utf8',
    ),
  ]);
  return root;
};
