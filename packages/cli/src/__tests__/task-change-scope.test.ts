import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  captureSkoposTaskChangeScope,
  resolveSkoposTaskChangedPaths,
} from '../../../verification/src/application/task-change-scope/task-change-scope.service.js';
import { describe, expect, it } from 'vitest';

describe('task-owned change scope', () => {
  it('excludes unchanged pre-existing dirty paths while retaining task changes', async () => {
    const workspaceRoot = await createGitWorkspace();
    await writeFile(join(workspaceRoot, 'unrelated.txt'), 'unrelated dirty state\n', 'utf8');

    const changeScope = await captureSkoposTaskChangeScope({
      workspaceRoot,
    });
    await writeFile(join(workspaceRoot, 'task.txt'), 'task-owned change\n', 'utf8');

    await expect(
      resolveSkoposTaskChangedPaths({
        workspaceRoot,
        changeScope,
      }),
    ).resolves.toEqual({
      changedPaths: ['task.txt'],
      ignoredPreExistingPaths: ['unrelated.txt'],
    });
  });

  it('includes explicitly adopted paths that were already dirty at Task start', async () => {
    const workspaceRoot = await createGitWorkspace();
    await writeFile(join(workspaceRoot, 'unrelated.txt'), 'adopted dirty state\n', 'utf8');

    const changeScope = await captureSkoposTaskChangeScope({
      workspaceRoot,
      declaredOwnedPaths: ['unrelated.txt'],
    });

    await expect(
      resolveSkoposTaskChangedPaths({
        workspaceRoot,
        changeScope,
      }),
    ).resolves.toEqual({
      changedPaths: ['unrelated.txt'],
      ignoredPreExistingPaths: [],
    });
  });

  it('retains task changes after they are committed during the Task', async () => {
    const workspaceRoot = await createGitWorkspace();
    const changeScope = await captureSkoposTaskChangeScope({
      workspaceRoot,
    });

    await writeFile(join(workspaceRoot, 'task.txt'), 'committed task change\n', 'utf8');
    execFileSync('git', ['add', 'task.txt'], { cwd: workspaceRoot });
    execFileSync('git', ['commit', '-m', 'task change'], { cwd: workspaceRoot });

    await expect(
      resolveSkoposTaskChangedPaths({
        workspaceRoot,
        changeScope,
      }),
    ).resolves.toEqual({
      changedPaths: ['task.txt'],
      ignoredPreExistingPaths: [],
    });
  });

  it('rejects declared ownership outside the project workspace', async () => {
    const workspaceRoot = await createGitWorkspace();

    await expect(
      captureSkoposTaskChangeScope({
        workspaceRoot,
        declaredOwnedPaths: ['../outside.txt'],
      }),
    ).rejects.toThrow('must stay inside the workspace');
  });
});

const createGitWorkspace = async (): Promise<string> => {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-task-scope-'));
  await writeFile(join(workspaceRoot, 'task.txt'), 'task baseline\n', 'utf8');
  await writeFile(join(workspaceRoot, 'unrelated.txt'), 'unrelated baseline\n', 'utf8');
  execFileSync('git', ['init'], { cwd: workspaceRoot });
  execFileSync('git', ['config', 'user.email', 'skopos@example.com'], { cwd: workspaceRoot });
  execFileSync('git', ['config', 'user.name', 'Skopos Test'], { cwd: workspaceRoot });
  execFileSync('git', ['add', '.'], { cwd: workspaceRoot });
  execFileSync('git', ['commit', '-m', 'baseline'], { cwd: workspaceRoot });
  return workspaceRoot;
};
