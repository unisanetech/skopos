import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

import { afterEach, describe, expect, it } from 'vitest';

import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { buildSkoposStartRuntime } from '../../../runtime/src/application/start/start.service.js';
import {
  completeSkoposTaskStepRuntime,
  showSkoposTaskRuntime,
} from '../../../runtime/src/application/task/task.service.js';
import {
  finishSkoposTaskRuntime,
  recordSkoposObservationEvidenceRuntime,
} from '../../../runtime/src/application/verification/verification.service.js';

const temporaryRoots: string[] = [];
const execFileAsync = promisify(execFile);

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('tracked Task portability', () => {
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
    await expect(
      showSkoposTaskRuntime({
        cwd: workspaceRoot,
        taskId: task.id,
      }),
    ).resolves.toMatchObject({ state: 'active' });
  });
});

const createWorkspace = async (): Promise<string> => {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-task-portability-'));
  temporaryRoots.push(workspaceRoot);
  await mkdir(join(workspaceRoot, 'src'), { recursive: true });
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
  ]);
  await initSkoposProject({
    cwd: workspaceRoot,
    mode: 'existing',
    actor: 'fixture-init',
    scaffoldInstructions: false,
  });
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
