import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { buildSkoposStartRuntime } from '../../../runtime/src/application/start/start.service.js';
import {
  showSkoposTaskRuntime,
} from '../../../runtime/src/application/task/task.service.js';

const temporaryRoots: string[] = [];

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
  return workspaceRoot;
};
