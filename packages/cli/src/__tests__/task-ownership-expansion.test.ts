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
        classification: 'within-scope',
        priorScopeId: 'workspace',
        nextScopeId: 'workspace',
        affectedScopeIds: ['workspace'],
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

  it('keeps dependency expansion narrow, rebinds siblings, and rejects unrelated Scopes', async () => {
    const root = await createScopedWorkspace();

    const dependencyTask = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Change the storefront with its declared shared dependency',
      actor: 'agent-dependency',
      risk: 'standard',
      ownedPaths: ['apps/storefront/src/page.ts'],
    });
    expect(dependencyTask.task.scope.scope.id).toBe('storefront');
    const dependencyExpanded = await expandSkoposTaskOwnershipRuntime({
      cwd: root,
      taskId: dependencyTask.task.id,
      ownedPaths: ['packages/shared/src/model.ts'],
      reason: 'The storefront change requires its declared shared dependency.',
      actor: 'agent-dependency',
    });
    expect(dependencyExpanded.scope.scope.id).toBe('storefront');
    expect(dependencyExpanded.ownershipExpansions?.at(-1)).toMatchObject({
      classification: 'declared-dependency',
      priorScopeId: 'storefront',
      nextScopeId: 'storefront',
      affectedScopeIds: ['shared', 'storefront'],
    });

    const siblingTask = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Coordinate two commerce runtime siblings',
      actor: 'agent-siblings',
      risk: 'standard',
      ownedPaths: ['apps/storefront/src/page.ts'],
    });
    const priorBaseline = siblingTask.task.proofSubject.baselineId;
    const siblingExpanded = await expandSkoposTaskOwnershipRuntime({
      cwd: root,
      taskId: siblingTask.task.id,
      ownedPaths: ['services/orders/src/handler.ts'],
      reason: 'The accepted behavior crosses two children of the commerce product.',
      actor: 'agent-siblings',
    });
    expect(siblingExpanded.scope).toMatchObject({
      matchedBy: 'topology',
      scope: { id: 'commerce' },
    });
    expect(siblingExpanded.proofSubject.baselineId).not.toBe(priorBaseline);
    expect(siblingExpanded.ownershipExpansions?.at(-1)).toMatchObject({
      classification: 'common-ancestor',
      priorScopeId: 'storefront',
      nextScopeId: 'commerce',
      affectedScopeIds: ['orders', 'storefront'],
    });
    await rm(
      join(
        root,
        '.skopos',
        'tasks',
        siblingExpanded.taskIdentity.worktreeId,
        siblingExpanded.id,
      ),
      { recursive: true, force: true },
    );
    await expect(
      showSkoposTaskRuntime({ cwd: root, taskId: siblingExpanded.id }),
    ).resolves.toMatchObject({
      scope: { matchedBy: 'topology', scope: { id: 'commerce' } },
      proofSubject: { baselineId: siblingExpanded.proofSubject.baselineId },
    });

    const unrelatedTask = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Keep unrelated operations work outside storefront implementation',
      actor: 'agent-unrelated',
      risk: 'standard',
      ownedPaths: ['apps/storefront/src/page.ts'],
    });
    await expect(
      expandSkoposTaskOwnershipRuntime({
        cwd: root,
        taskId: unrelatedTask.task.id,
        ownedPaths: ['ops/deploy/src/main.ts'],
        reason: 'An unrelated edit was discovered.',
        actor: 'agent-unrelated',
      }),
    ).rejects.toThrow(/spans unrelated declared Scopes.*Start independent child Tasks/u);

    const explicitWorkspaceTask = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Coordinate an explicitly workspace-owned integration',
      scope: 'workspace',
      actor: 'agent-workspace',
      risk: 'standard',
      ownedPaths: ['apps/storefront/src/page.ts'],
    });
    const explicitExpanded = await expandSkoposTaskOwnershipRuntime({
      cwd: root,
      taskId: explicitWorkspaceTask.task.id,
      ownedPaths: ['ops/deploy/src/main.ts'],
      reason: 'The Task was explicitly admitted as workspace coordination.',
      actor: 'agent-workspace',
    });
    expect(explicitExpanded.scope.scope.id).toBe('workspace');
    expect(explicitExpanded.ownershipExpansions?.at(-1)).toMatchObject({
      classification: 'explicit-multi-scope',
      nextScopeId: 'workspace',
    });
  }, 20_000);

  it('recommends bounded follow-up work after repeated expansion without flagging one coherent addition', async () => {
    const root = await createWorkspace();
    await Promise.all([
      writeFile(join(root, 'src/three.ts'), 'export const three = 3;\n', 'utf8'),
      writeFile(join(root, 'src/four.ts'), 'export const four = 4;\n', 'utf8'),
    ]);
    const started = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Keep one coherent fixture behavior working',
      actor: 'agent-drift',
      risk: 'standard',
      ownedPaths: ['src/one.ts'],
    });

    const first = await expandSkoposTaskOwnershipRuntime({
      cwd: root,
      taskId: started.task.id,
      ownedPaths: ['src/two.ts'],
      reason: 'The paired fixture source is part of the same behavior.',
      actor: 'agent-drift',
    });
    expect(first.recommendations).not.toContainEqual(
      expect.objectContaining({ actionKind: 'start-child-task' }),
    );

    await expandSkoposTaskOwnershipRuntime({
      cwd: root,
      taskId: started.task.id,
      ownedPaths: ['src/three.ts'],
      reason: 'A third fixture source was discovered.',
      actor: 'agent-drift',
    });
    const third = await expandSkoposTaskOwnershipRuntime({
      cwd: root,
      taskId: started.task.id,
      ownedPaths: ['src/four.ts'],
      reason: 'The work expanded again and should be reconsidered.',
      actor: 'agent-drift',
    });
    const recommendation = third.recommendations.find(
      (entry) => entry.actionKind === 'start-child-task',
    );
    expect(recommendation).toMatchObject({
      id: 'start-bounded-child-task',
      blocking: false,
      status: 'open',
      scopeId: 'workspace',
      ownedPaths: ['src/four.ts', 'src/three.ts', 'src/two.ts'],
    });
    expect(recommendation?.command).toContain(`skopos task child start '${started.task.id}' 'Continue Keep one coherent fixture behavior working as bounded follow-up work'`);
    expect(recommendation?.command).toContain("--own 'src/four.ts'");
    expect(third.recommendations.filter((entry) => entry.id === 'start-bounded-child-task')).toHaveLength(1);
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
      join(root, 'tools/skopos/scopes.yaml'),
      `schemaVersion: 1
scopes:
  - id: workspace
    title: Workspace
    kind: workspace
    path: .
    memoryRoot: docs
    codeRoots: [.]
    parent: null
    profile: fixture.workspace
    dependsOn: []
    owners: [fixture]
    aliases: [fixture]
`,
      'utf8',
    ),
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

const createScopedWorkspace = async (): Promise<string> => {
  const root = await createWorkspace();
  await Promise.all([
    mkdir(join(root, 'apps/storefront/src'), { recursive: true }),
    mkdir(join(root, 'services/orders/src'), { recursive: true }),
    mkdir(join(root, 'packages/shared/src'), { recursive: true }),
    mkdir(join(root, 'ops/deploy/src'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(join(root, 'apps/storefront/src/page.ts'), 'export const page = 1;\n'),
    writeFile(join(root, 'services/orders/src/handler.ts'), 'export const handler = 1;\n'),
    writeFile(join(root, 'packages/shared/src/model.ts'), 'export const model = 1;\n'),
    writeFile(join(root, 'ops/deploy/src/main.ts'), 'export const deploy = 1;\n'),
    writeFile(
      join(root, 'tools/skopos/scopes.yaml'),
      `schemaVersion: 1
scopes:
  - id: workspace
    title: Workspace
    kind: workspace
    path: .
    memoryRoot: docs
    codeRoots: [.]
    parent: null
    profile: fixture.workspace
    dependsOn: []
    owners: [fixture]
    aliases: [fixture]
  - id: commerce
    title: Commerce
    kind: product
    path: products/commerce
    memoryRoot: docs/scopes/commerce
    codeRoots: [products/commerce]
    parent: workspace
    profile: fixture.product
    dependsOn: []
    owners: [fixture]
    aliases: [commerce]
  - id: storefront
    title: Storefront
    kind: application
    path: apps/storefront
    memoryRoot: docs/scopes/storefront
    codeRoots: [apps/storefront]
    parent: commerce
    profile: fixture.application
    dependsOn: [shared]
    owners: [fixture]
    aliases: [storefront]
  - id: orders
    title: Orders
    kind: service
    path: services/orders
    memoryRoot: docs/scopes/orders
    codeRoots: [services/orders]
    parent: commerce
    profile: fixture.service
    dependsOn: [shared]
    owners: [fixture]
    aliases: [orders]
  - id: shared
    title: Shared
    kind: package
    path: packages/shared
    memoryRoot: docs/scopes/shared
    codeRoots: [packages/shared]
    parent: commerce
    profile: fixture.package
    dependsOn: []
    owners: [fixture]
    aliases: [shared]
  - id: deploy
    title: Deploy
    kind: infrastructure
    path: ops/deploy
    memoryRoot: docs/scopes/deploy
    codeRoots: [ops/deploy]
    parent: workspace
    profile: fixture.infrastructure
    dependsOn: []
    owners: [fixture]
    aliases: [deploy]
`,
      'utf8',
    ),
  ]);
  return root;
};
