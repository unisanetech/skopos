import { execFile } from 'node:child_process';
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

import { afterEach, describe, expect, it } from 'vitest';

import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { buildSkoposStartRuntime } from '../../../runtime/src/application/start/start.service.js';
import {
  archiveTrackedTaskDocumentPath,
  completeSkoposTaskStepRuntime,
  resolveSkoposTrackedTaskProjectionPaths,
  resolveSkoposTaskMemoryObligationRuntime,
  showSkoposTaskRuntime,
} from '../../../runtime/src/application/task/task.service.js';
import {
  assessSkoposTaskReadinessRuntime,
  finishSkoposTaskRuntime,
  recordSkoposObservationEvidenceRuntime,
  verifySkoposTaskRuntime,
} from '../../../runtime/src/application/verification/verification.service.js';
import {
  captureSkoposTaskPathStates,
  digestSkoposTaskPathStates,
} from '../../../verification/src/application/task-change-scope/task-change-scope.service.js';

const temporaryRoots: string[] = [];
const execFileAsync = promisify(execFile);
const workspaceSourceRoot = join(import.meta.dirname, '../../../..');
const taskServiceUrl = pathToFileURL(
  join(
    workspaceSourceRoot,
    'packages/runtime/src/application/task/task.service.ts',
  ),
).href;

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('tracked Task portability', () => {
  it('normalizes tracked Task projection paths from Windows separators', () => {
    const activePath = 'docs\\work\\tasks\\T-portable.md';
    const archivedPath = 'docs/work/archive/tasks/T-portable.md';

    expect(archiveTrackedTaskDocumentPath(activePath)).toBe(archivedPath);
    expect(resolveSkoposTrackedTaskProjectionPaths(archivedPath)).toEqual([
      'docs/work/tasks/T-portable.md',
      archivedPath,
    ]);
  });

  it('names a stable task-closure proof subject by default', async () => {
    const workspaceRoot = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Prove one narrow Task subject',
      actor: 'agent-a',
      ownedPaths: ['src/index.ts'],
    });

    expect(started.task.proofSubject).toEqual({
      kind: 'task-closure',
      baselineId: expect.stringMatching(/^baseline-[a-f0-9]{16}$/u),
    });
  });

  it('makes project-integration proof explicit, owned, detailed, and high-impact', async () => {
    const workspaceRoot = await createWorkspace();
    await expect(
      buildSkoposStartRuntime({
        cwd: workspaceRoot,
        goal: 'Prove the integration candidate',
        actor: 'agent-a',
        proofSubjectKind: 'project-integration',
      }),
    ).rejects.toThrow('requires at least one explicitly owned path');

    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Prove the integration candidate',
      actor: 'agent-a',
      proofSubjectKind: 'project-integration',
      ownedPaths: ['.'],
    });

    expect(started.task).toMatchObject({
      risk: 'high-impact',
      detail: 'detailed',
      proofSubject: {
        kind: 'project-integration',
        baselineId: expect.stringMatching(/^baseline-[a-f0-9]{16}$/u),
      },
    });
  });

  it('reconstructs disposable Task projections from tracked portable state', async () => {
    const workspaceRoot = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Change the portable Task fixture across Sessions',
      actor: 'agent-a',
      acceptanceCriteria: ['The tracked Task reconstructs after local state deletion.'],
      constraints: ['Do not store machine-local claims in tracked state.'],
      ownedPaths: ['src'],
    });

    expect(started.task.trackedDocumentPath).toBeTruthy();
    expect(started.task.trackedDocumentPath).toMatch(/^docs\/work\/tasks\//u);
    const trackedPath = join(workspaceRoot, started.task.trackedDocumentPath!);
    const trackedSource = await readFile(trackedPath, 'utf8');
    expect(trackedSource).toContain('<!-- skopos:task-state:start -->');
    expect(trackedSource).not.toContain(started.task.workspaceRoot);
    expect(trackedSource).not.toContain('"baselineDirtyPaths"');
    expect(trackedSource).toContain('"declaredOwnedPaths"');

    await rm(join(workspaceRoot, '.skopos', 'tasks'), {
      recursive: true,
      force: true,
    });

    const reconstructed = await showSkoposTaskRuntime({
      cwd: workspaceRoot,
      taskId: started.task.id,
    });
    expect(reconstructed).toMatchObject({
      id: started.task.id,
      goal: started.task.goal,
      contract: started.task.contract,
      questions: started.task.questions,
      recommendations: started.task.recommendations,
      coordination: {},
    });
    expect(reconstructed.changeScope.declaredOwnedPaths).toEqual(['src']);
    await expect(
      readFile(
        join(
          workspaceRoot,
          '.skopos',
          'tasks',
          reconstructed.taskIdentity.worktreeId,
          reconstructed.id,
          'questions.json',
        ),
        'utf8',
      ),
    ).resolves.toContain(`"${reconstructed.id}"`);
  });

  it('projects and reconstructs a Task from its registered Scope Memory root', async () => {
    const workspaceRoot = await createWorkspace();
    await declareNestedScope(workspaceRoot);
    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      scope: 'catalog',
      goal: 'Change the catalog package through its own Project Memory',
      actor: 'agent-a',
      risk: 'standard',
      acceptanceCriteria: ['The scoped Task remains portable across Sessions.'],
      ownedPaths: ['packages/catalog'],
    });

    expect(started.task.scope.scope.id).toBe('catalog');
    expect(started.task.trackedDocumentPath).toMatch(
      /^product-memory\/catalog\/work\/tasks\//u,
    );
    await expect(
      readFile(join(workspaceRoot, started.task.trackedDocumentPath!), 'utf8'),
    ).resolves.toContain('scope: "catalog"');

    await rm(join(workspaceRoot, '.skopos', 'tasks'), {
      recursive: true,
      force: true,
    });

    const reconstructed = await showSkoposTaskRuntime({
      cwd: workspaceRoot,
      taskId: started.task.id,
    });
    expect(reconstructed).toMatchObject({
      id: started.task.id,
      trackedDocumentPath: started.task.trackedDocumentPath,
      scope: { scope: { id: 'catalog', memoryRoot: 'product-memory/catalog' } },
    });
  });

  it('restores a drifted Task projection to the declared Scope Memory root on mutation', async () => {
    const workspaceRoot = await createWorkspace();
    await declareNestedScope(workspaceRoot);
    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      scope: 'catalog',
      goal: 'Keep scoped Task persistence canonical',
      actor: 'agent-a',
      risk: 'standard',
      acceptanceCriteria: ['Task mutations preserve the declared Scope authority.'],
      ownedPaths: ['packages/catalog'],
    });
    const canonicalPath = started.task.trackedDocumentPath!;
    const driftedPath = join('docs', 'work', 'tasks', basename(canonicalPath));
    await mkdir(join(workspaceRoot, 'docs', 'work', 'tasks'), { recursive: true });
    await rename(join(workspaceRoot, canonicalPath), join(workspaceRoot, driftedPath));
    await writeFile(
      started.taskPath,
      `${JSON.stringify({ ...started.task, trackedDocumentPath: driftedPath }, null, 2)}\n`,
      'utf8',
    );

    const updated = await completeSkoposTaskStepRuntime({
      cwd: workspaceRoot,
      taskId: started.task.id,
      stepId: started.task.steps[0]!.id,
      actor: 'agent-a',
    });

    expect(updated.trackedDocumentPath).toBe(canonicalPath);
    await expect(readFile(join(workspaceRoot, canonicalPath), 'utf8')).resolves.toContain(
      started.task.id,
    );
    await expect(readFile(join(workspaceRoot, driftedPath), 'utf8')).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });

  it('fails closed when a declared Scope has no Memory root', async () => {
    const workspaceRoot = await createWorkspace();
    await writeFile(
      join(workspaceRoot, 'tools', 'skopos', 'scopes.yaml'),
      buildScopeRegistry().replace('    memoryRoot: docs\n', ''),
      'utf8',
    );

    await expect(
      buildSkoposStartRuntime({
        cwd: workspaceRoot,
        goal: 'Reject an incomplete Scope authority declaration',
        actor: 'agent-a',
        risk: 'standard',
        acceptanceCriteria: ['Missing Memory authority cannot create a tracked Task.'],
        ownedPaths: ['src'],
      }),
    ).rejects.toThrow(/memoryRoot|Memory root/iu);
  });

  it('finishes an active Task through one verified closure transaction', async () => {
    const workspaceRoot = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Prove the canonical Task closure transition',
      actor: 'agent-a',
      acceptanceCriteria: ['The Task closes from verifying with valid Evidence.'],
      ownedPaths: ['src'],
    });

    let task = started.task;
    for (const step of task.steps.filter((entry) => entry.kind !== 'verification')) {
      task = await completeSkoposTaskStepRuntime({
        cwd: workspaceRoot,
        taskId: task.id,
        stepId: step.id,
        actor: 'agent-a',
      });
    }
    for (const requirement of task.evidenceRequirements) {
      await recordSkoposObservationEvidenceRuntime({
        cwd: workspaceRoot,
        taskId: task.id,
        requirementId: requirement.id,
        statement: 'The focused fixture proves the acceptance criterion.',
        actor: 'agent-a',
      });
    }

    const readiness = await finishSkoposTaskRuntime({
      cwd: workspaceRoot,
      taskId: task.id,
      actor: 'agent-a',
    });
    expect(readiness.blockers, readiness.blockers.join('\n')).toEqual([]);
    expect(readiness).toMatchObject({
      readiness: 'ready',
      taskState: 'complete',
    });
    const completed = await showSkoposTaskRuntime({
      cwd: workspaceRoot,
      taskId: task.id,
    });
    expect(completed.state).toBe('complete');
    expect(completed.steps.every((step) => step.status === 'complete')).toBe(true);
  }, 15_000);

  it('keeps observation Evidence valid when selected Actions own generated outputs', async () => {
    const workspaceRoot = await createWorkspace();
    await Promise.all([
      mkdir(join(workspaceRoot, 'tools', 'skopos', 'actions'), { recursive: true }),
      mkdir(join(workspaceRoot, 'tools', 'skopos', 'guards'), { recursive: true }),
    ]);
    await Promise.all([
      writeFile(
        join(workspaceRoot, 'tools', 'skopos', 'actions', 'fixture-generate.yaml'),
        [
          'id: fixture.generate',
          'title: Generate fixture output',
          'description: Generate a derived fixture file.',
          'category: maintenance',
          'scope: [workspace]',
          'command: node -e "process.exit(0)"',
          'cwd: .',
          'inputs: [src/index.ts]',
          'outputs: [generated.txt]',
          'affects: [generated.txt]',
          'capabilities:',
          '  process: required',
          '  network: none',
          '  browser: none',
          '  tools: [node]',
          '  secrets: []',
          '  services: []',
          'effects:',
          '  workspace: declared',
          '  artifacts: none',
          '  external: none',
          'concurrency: exclusive',
          'workspaceMode: overlay-safe',
          'safety: mutating',
          'requiresApproval: false',
          'whenToUse: Run after changing the fixture source.',
          'phases: [closure]',
          'risks: [standard]',
          'owner: fixture',
          '',
        ].join('\n'),
        'utf8',
      ),
      writeFile(
        join(workspaceRoot, 'tools', 'skopos', 'guards', 'fixture-generate.yaml'),
        [
          'id: fixture.generate-required',
          'title: Fixture source changes require generated output',
          'description: Keep the derived fixture output current.',
          'owner: fixture',
          'scope: [workspace]',
          'strength: required',
          'appliesTo:',
          '  paths: [src/index.ts]',
          '  phases: [closure]',
          '  risks: [standard]',
          'requires:',
          '  actionIds: [fixture.generate]',
          '  evidence: source-bound-action',
          '',
        ].join('\n'),
        'utf8',
      ),
    ]);
    await execFileAsync('git', ['add', '.'], { cwd: workspaceRoot });
    await execFileAsync('git', ['commit', '-m', 'register generated output fixture'], {
      cwd: workspaceRoot,
    });

    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Keep observation proof aligned with generated outputs',
      actor: 'agent-a',
      risk: 'standard',
      acceptanceCriteria: ['The observation covers the complete Task change set.'],
      ownedPaths: ['src/index.ts'],
    });
    expect(started.task.selectedActions).toEqual([
      expect.objectContaining({
        id: 'fixture.generate',
        outputPaths: ['generated.txt'],
      }),
    ]);
    await Promise.all([
      writeFile(join(workspaceRoot, 'src/index.ts'), 'export const value = 2;\n', 'utf8'),
      writeFile(join(workspaceRoot, 'generated.txt'), 'generated\n', 'utf8'),
    ]);
    await recordSkoposObservationEvidenceRuntime({
      cwd: workspaceRoot,
      taskId: started.task.id,
      requirementId: 'acceptance-1',
      statement: 'The source and its generated output were reviewed together.',
      actor: 'agent-a',
    });

    const verification = await verifySkoposTaskRuntime({
      cwd: workspaceRoot,
      taskId: started.task.id,
    });
    expect(
      verification.acceptanceCoverage.find(
        (entry) => entry.requirementId === 'acceptance-1',
      ),
    ).toMatchObject({ status: 'covered' });
  });

  it('does not advance an active Task while implementation steps remain unfinished', async () => {
    const workspaceRoot = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Keep incomplete Tasks active',
      actor: 'agent-a',
      acceptanceCriteria: ['Incomplete work cannot close.'],
      ownedPaths: ['src'],
    });

    const readiness = await finishSkoposTaskRuntime({
      cwd: workspaceRoot,
      taskId: started.task.id,
      actor: 'agent-a',
    });

    expect(readiness.readiness).toBe('blocked');
    expect(readiness.blockers.join('\n')).toContain('unfinished pre-verification steps');
    await expect(
      showSkoposTaskRuntime({
        cwd: workspaceRoot,
        taskId: started.task.id,
      }),
    ).resolves.toMatchObject({ state: 'active' });
  });

  it('serializes concurrent cross-process Task mutations without losing step updates', async () => {
    const workspaceRoot = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Serialize concurrent portable Task updates',
      actor: 'agent-a',
      acceptanceCriteria: ['Every concurrent step update remains durable.'],
      ownedPaths: ['src'],
    });
    const stepIds = started.task.steps.slice(0, 3).map((step) => step.id);

    await Promise.all(
      stepIds.map((stepId) =>
        runStepMutationInChildProcess({
          workspaceRoot,
          taskId: started.task.id,
          stepId,
        }),
      ),
    );

    const task = await showSkoposTaskRuntime({
      cwd: workspaceRoot,
      taskId: started.task.id,
    });
    expect(
      task.steps.filter((step) => stepIds.includes(step.id)).map((step) => step.status),
    ).toEqual(['complete', 'complete', 'complete']);
    const trackedPath = join(workspaceRoot, task.trackedDocumentPath!);
    const trackedSource = await readFile(trackedPath, 'utf8');
    expect(trackedSource).toContain('<!-- skopos:task-state:start -->');
    expect(JSON.parse(extractPortableTaskJson(trackedSource))).toMatchObject({
      id: task.id,
    });
    expect(
      (await readdir(join(workspaceRoot, 'docs', 'work', 'tasks'))).filter((name) =>
        name.endsWith('.tmp'),
      ),
    ).toEqual([]);
  }, 30_000);

  it('keeps concurrent observation Evidence writes distinct', async () => {
    const workspaceRoot = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Record concurrent observation Evidence safely',
      actor: 'agent-a',
      acceptanceCriteria: ['Concurrent Evidence records remain distinct.'],
      ownedPaths: ['src'],
    });
    const requirementId = started.task.evidenceRequirements[0]!.id;

    const evidence = await Promise.all(
      Array.from({ length: 12 }, (_, index) =>
        recordSkoposObservationEvidenceRuntime({
          cwd: workspaceRoot,
          taskId: started.task.id,
          requirementId,
          statement: `Concurrent observation ${index + 1}.`,
          actor: 'agent-a',
        }),
      ),
    );

    expect(new Set(evidence.map((entry) => entry.id)).size).toBe(12);
    const evidenceDirectory = join(
      workspaceRoot,
      '.skopos',
      'tasks',
      started.task.taskIdentity.worktreeId,
      started.task.id,
      'evidence',
    );
    expect(
      (await readdir(evidenceDirectory)).filter((name) => name.endsWith('.json')),
    ).toHaveLength(12);
  }, 15_000);

  it('infers only applicable durable Memory obligations and blocks closure until resolution', async () => {
    const workspaceRoot = await createWorkspace();
    const ordinary = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Make a narrow source-only maintenance change',
      actor: 'agent-b',
      acceptanceCriteria: ['The narrow source behavior remains correct.'],
      ownedPaths: ['src'],
    });
    expect(ordinary.task.memoryObligations).toEqual([]);

    const highImpact = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Perform a material source change with explicit review',
      actor: 'agent-c',
      risk: 'high-impact',
      acceptanceCriteria: ['Material work reviews durable project Memory.'],
      ownedPaths: ['src'],
    });
    expect(highImpact.task.memoryObligations).toEqual([
      expect.objectContaining({
        role: 'architecture',
        status: 'open',
        targetPath: 'docs/architecture/system.md',
      }),
    ]);

    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Synchronize an adopted durable project document',
      actor: 'agent-a',
      risk: 'standard',
      acceptanceCriteria: ['Architecture Memory remains synchronized.'],
      ownedPaths: ['docs/architecture/system.md'],
    });
    expect(started.task.memoryObligations).toEqual([
      expect.objectContaining({
        role: 'architecture',
        status: 'open',
        targetPath: 'docs/architecture/system.md',
      }),
    ]);

    let task = started.task;
    for (const step of task.steps.filter((entry) => entry.kind !== 'verification')) {
      task = await completeSkoposTaskStepRuntime({
        cwd: workspaceRoot,
        taskId: task.id,
        stepId: step.id,
        actor: 'agent-a',
      });
    }
    for (const requirement of task.evidenceRequirements) {
      await recordSkoposObservationEvidenceRuntime({
        cwd: workspaceRoot,
        taskId: task.id,
        requirementId: requirement.id,
        statement: 'Focused behavior was reviewed.',
        actor: 'agent-a',
      });
    }

    const blocked = await finishSkoposTaskRuntime({
      cwd: workspaceRoot,
      taskId: task.id,
      actor: 'agent-a',
    });
    expect(blocked.readiness).toBe('blocked');
    expect(blocked.blockers.join('\n')).toContain('Memory obligation');

    const obligation = task.memoryObligations[0]!;
    await resolveSkoposTaskMemoryObligationRuntime({
      cwd: workspaceRoot,
      taskId: task.id,
      obligationId: obligation.id,
      resolution: 'reviewed-no-change',
      reason: 'The existing architecture already states the unchanged contract.',
      actor: 'agent-a',
    });
    const readiness = await finishSkoposTaskRuntime({
      cwd: workspaceRoot,
      taskId: task.id,
      actor: 'agent-a',
    });
    expect(readiness.blockers, readiness.blockers.join('\n')).toEqual([]);
  }, 15_000);

  it('keeps high-impact snapshot proof mandatory in the one-command finish path', async () => {
    const workspaceRoot = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Protect a high-impact closure',
      actor: 'agent-a',
      risk: 'high-impact',
      detail: 'detailed',
      acceptanceCriteria: ['High-impact closure requires an immutable snapshot.'],
      ownedPaths: ['src'],
    });
    let task = started.task;
    for (const step of task.steps.filter((entry) => entry.kind !== 'verification')) {
      task = await completeSkoposTaskStepRuntime({
        cwd: workspaceRoot,
        taskId: task.id,
        stepId: step.id,
        actor: 'agent-a',
      });
    }
    for (const requirement of task.evidenceRequirements) {
      await recordSkoposObservationEvidenceRuntime({
        cwd: workspaceRoot,
        taskId: task.id,
        requirementId: requirement.id,
        statement: 'The behavior is observed; snapshot proof is intentionally absent.',
        actor: 'agent-a',
      });
    }

    const readiness = await finishSkoposTaskRuntime({
      cwd: workspaceRoot,
      taskId: task.id,
      actor: 'agent-a',
    });

    expect(readiness.readiness).toBe('blocked');
    expect(readiness.blockers.join('\n')).toContain('immutable Task snapshot');

    const snapshotsDirectory = join(workspaceRoot, 'docs/work/tasks/snapshots');
    await mkdir(snapshotsDirectory, { recursive: true });
    await writeFile(
      join(snapshotsDirectory, `${task.id}-S-empty.json`),
      JSON.stringify({
        createdAt: '2026-02-01T00:00:00.000Z',
        digest: digestSkoposTaskPathStates([]),
        paths: [],
      }),
      'utf8',
    );
    const emptySnapshotReadiness = await finishSkoposTaskRuntime({
      cwd: workspaceRoot,
      taskId: task.id,
      actor: 'agent-a',
    });
    expect(emptySnapshotReadiness.readiness).toBe('blocked');
    expect(emptySnapshotReadiness.blockers.join('\n')).toContain(
      'does not cover any Task-owned paths',
    );
    await expect(
      showSkoposTaskRuntime({
        cwd: workspaceRoot,
        taskId: task.id,
      }),
    ).resolves.toMatchObject({ state: 'active' });
  }, 15_000);

  it('rejects a high-impact snapshot missing one declared owned path', async () => {
    const workspaceRoot = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Reject incomplete high-impact snapshot coverage',
      actor: 'agent-a',
      risk: 'high-impact',
      detail: 'detailed',
      ownedPaths: ['src/index.ts', 'README.md'],
    });
    const [sourceState] = await captureSkoposTaskPathStates({
      workspaceRoot,
      paths: ['src/index.ts'],
    });
    const snapshotsDirectory = join(workspaceRoot, 'docs/work/tasks/snapshots');
    await mkdir(snapshotsDirectory, { recursive: true });
    await writeFile(
      join(snapshotsDirectory, `${started.task.id}-S-partial.json`),
      JSON.stringify({
        createdAt: '2026-02-01T00:00:00.000Z',
        digest: digestSkoposTaskPathStates([sourceState!]),
        paths: [sourceState],
      }),
      'utf8',
    );

    const readiness = await assessSkoposTaskReadinessRuntime({
      cwd: workspaceRoot,
      taskId: started.task.id,
      target: 'close',
    });
    expect(readiness.blockers.join('\n')).toContain(
      'does not cover Task-owned paths: README.md',
    );
  });

  it('selects the newest immutable snapshot by creation time instead of digest filename', async () => {
    const workspaceRoot = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Prove newest high-impact snapshot selection',
      actor: 'agent-a',
      risk: 'high-impact',
      ownedPaths: ['src/index.ts'],
    });
    const states = await captureSkoposTaskPathStates({
      workspaceRoot,
      paths: ['src/index.ts'],
    });
    const snapshotsDirectory = join(workspaceRoot, 'docs/work/tasks/snapshots');
    await mkdir(snapshotsDirectory, { recursive: true });
    await Promise.all([
      writeFile(
        join(snapshotsDirectory, `${started.task.id}-S-ffffffffffff.json`),
        JSON.stringify({
          createdAt: '2026-01-01T00:00:00.000Z',
          digest: 'stale-digest',
          paths: states,
        }),
        'utf8',
      ),
      writeFile(
        join(snapshotsDirectory, `${started.task.id}-S-000000000000.json`),
        JSON.stringify({
          createdAt: '2026-02-01T00:00:00.000Z',
          digest: digestSkoposTaskPathStates(states),
          paths: states,
        }),
        'utf8',
      ),
    ]);

    const readiness = await assessSkoposTaskReadinessRuntime({
      cwd: workspaceRoot,
      taskId: started.task.id,
      target: 'close',
    });
    expect(readiness.blockers.join('\n')).not.toContain('snapshot');
  });
});

const createWorkspace = async (): Promise<string> => {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-task-portability-'));
  temporaryRoots.push(workspaceRoot);
  await mkdir(join(workspaceRoot, 'src'), { recursive: true });
  await mkdir(join(workspaceRoot, 'docs', 'architecture'), { recursive: true });
  await Promise.all([
    writeFile(
      join(workspaceRoot, 'package.json'),
      JSON.stringify({
        name: 'task-portability-fixture',
        private: true,
        scripts: { test: 'vitest run' },
      }),
      'utf8',
    ),
    writeFile(join(workspaceRoot, 'README.md'), '# Portable Task fixture\n', 'utf8'),
    writeFile(join(workspaceRoot, 'AGENTS.md'), '# Agent rules\n', 'utf8'),
    writeFile(join(workspaceRoot, 'src/index.ts'), 'export const value = 1;\n', 'utf8'),
    writeFile(
      join(workspaceRoot, 'docs', 'architecture', 'system.md'),
      [
        '---',
        'title: Fixture Architecture',
        'status: active',
        'owner: fixture',
        'id: FIXTURE-ARCHITECTURE',
        'scope: task-portability-fixture',
        'role: architecture',
        'lifecycle: durable',
        'authority: canonical',
        'provenance: declared',
        'view: current',
        'lastUpdated: 2026-07-31',
        '---',
        '',
        '# Fixture Architecture',
        '',
        'The fixture has one canonical architecture document.',
        '',
      ].join('\n'),
      'utf8',
    ),
  ]);
  await initSkoposProject({
    cwd: workspaceRoot,
    mode: 'existing',
    actor: 'fixture-init',
    scaffoldInstructions: false,
  });
  await mkdir(join(workspaceRoot, 'tools', 'skopos'), { recursive: true });
  await writeFile(
    join(workspaceRoot, 'tools', 'skopos', 'scopes.yaml'),
    buildScopeRegistry(),
    'utf8',
  );
  await execFileAsync('git', ['init'], { cwd: workspaceRoot });
  await execFileAsync('git', ['config', 'user.email', 'fixture@example.test'], {
    cwd: workspaceRoot,
  });
  await execFileAsync('git', ['config', 'user.name', 'Skopos Fixture'], {
    cwd: workspaceRoot,
  });
  await execFileAsync('git', ['add', '.'], { cwd: workspaceRoot });
  await execFileAsync('git', ['commit', '-m', 'fixture baseline'], { cwd: workspaceRoot });
  return workspaceRoot;
};

const declareNestedScope = async (workspaceRoot: string): Promise<void> => {
  await Promise.all([
    mkdir(join(workspaceRoot, 'packages', 'catalog'), { recursive: true }),
    mkdir(join(workspaceRoot, 'product-memory', 'catalog'), { recursive: true }),
    mkdir(join(workspaceRoot, 'tools', 'skopos'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(workspaceRoot, 'tools', 'skopos', 'scopes.yaml'),
      buildScopeRegistry(true),
      'utf8',
    ),
    writeFile(
      join(workspaceRoot, 'product-memory', 'catalog', '00-start-here.md'),
      buildMemoryDocument({
        title: 'Catalog Memory Router',
        id: 'CATALOG-ROUTER',
        scope: 'catalog',
        role: 'router',
      }),
      'utf8',
    ),
    writeFile(
      join(workspaceRoot, 'product-memory', 'catalog', 'overview.md'),
      buildMemoryDocument({
        title: 'Catalog Overview',
        id: 'CATALOG-OVERVIEW',
        scope: 'catalog',
        role: 'overview',
      }),
      'utf8',
    ),
  ]);
};

const buildScopeRegistry = (includeCatalog = false): string =>
  [
    'schemaVersion: 1',
    'scopes:',
    '  - id: task-portability-fixture',
    '    title: Task Portability Fixture',
    '    kind: workspace',
    '    path: .',
    '    memoryRoot: docs',
    '    codeRoots: [.]',
    '    parent: null',
    '    profile: fixture.workspace',
    '    dependsOn: []',
    '    owners: [fixture]',
    '    aliases: [fixture]',
    ...(includeCatalog
      ? [
          '  - id: catalog',
          '    title: Catalog Package',
          '    kind: package',
          '    path: packages/catalog',
          '    memoryRoot: product-memory/catalog',
          '    codeRoots: [packages/catalog]',
          '    parent: task-portability-fixture',
          '    profile: fixture.package',
          '    dependsOn: []',
          '    owners: [fixture]',
          '    aliases: [catalog-package]',
        ]
      : []),
    '',
  ].join('\n');

const buildMemoryDocument = ({
  title,
  id,
  scope,
  role,
}: {
  title: string;
  id: string;
  scope: string;
  role: string;
}): string =>
  [
    '---',
    `title: ${title}`,
    'status: active',
    'owner: fixture',
    `id: ${id}`,
    `scope: ${scope}`,
    `role: ${role}`,
    'lifecycle: durable',
    'authority: canonical',
    'provenance: declared',
    'view: current',
    'lastUpdated: 2026-08-02',
    '---',
    '',
    `# ${title}`,
    '',
    'Fixture Memory.',
    '',
  ].join('\n');

const runStepMutationInChildProcess = async ({
  workspaceRoot,
  taskId,
  stepId,
}: {
  workspaceRoot: string;
  taskId: string;
  stepId: string;
}): Promise<void> => {
  const script = [
    `import { completeSkoposTaskStepRuntime } from ${JSON.stringify(taskServiceUrl)};`,
    'await completeSkoposTaskStepRuntime({',
    '  cwd: process.argv[1],',
    '  taskId: process.argv[2],',
    '  stepId: process.argv[3],',
    "  actor: 'agent-a',",
    '});',
  ].join('\n');
  await execFileAsync(
    process.execPath,
    ['--import', 'tsx', '--input-type=module', '-e', script, workspaceRoot, taskId, stepId],
    { cwd: workspaceSourceRoot },
  );
};

const extractPortableTaskJson = (source: string): string => {
  const match = source.match(
    /<!-- skopos:task-state:start -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- skopos:task-state:end -->/,
  );
  if (!match?.[1]) throw new Error('Tracked Task is missing portable state.');
  return match[1];
};
