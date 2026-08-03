import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  captureSkoposTaskChangeScope,
  captureSkoposTaskPathStates,
  resolveSkoposTaskChangedPaths,
} from '../../../verification/src/application/task-change-scope/task-change-scope.service.js';
import { describe, expect, it } from 'vitest';

describe('task-owned change scope', () => {
  it('excludes unchanged pre-existing dirty paths while retaining task changes', async () => {
    const workspaceRoot = await createGitWorkspace();
    await writeFile(join(workspaceRoot, 'unrelated.txt'), 'unrelated dirty state\n', 'utf8');

    const changeScope = await captureSkoposTaskChangeScope({
      workspaceRoot,
      declaredOwnedPaths: ['task.txt'],
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
      excludedOtherTaskPaths: [],
      externalUnattributedPaths: [],
      pathAttributions: [
        {
          path: 'task.txt',
          kind: 'task-owned',
          reason: 'declared-task-ownership',
        },
        {
          path: 'unrelated.txt',
          kind: 'pre-existing',
          reason: 'unchanged-admission-baseline',
        },
      ],
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
      excludedOtherTaskPaths: [],
      externalUnattributedPaths: [],
      pathAttributions: [
        {
          path: 'unrelated.txt',
          kind: 'task-owned',
          reason: 'declared-task-ownership',
        },
      ],
    });
  });

  it('retains task changes after they are committed during the Task', async () => {
    const workspaceRoot = await createGitWorkspace();
    const changeScope = await captureSkoposTaskChangeScope({
      workspaceRoot,
      declaredOwnedPaths: ['task.txt'],
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
      excludedOtherTaskPaths: [],
      externalUnattributedPaths: [],
      pathAttributions: [
        {
          path: 'task.txt',
          kind: 'task-owned',
          reason: 'declared-task-ownership',
        },
      ],
    });
  });

  it('excludes a digest-matched mutation attributed to another Task', async () => {
    const workspaceRoot = await createGitWorkspace();
    const changeScope = await captureSkoposTaskChangeScope({ workspaceRoot });
    await writeFile(join(workspaceRoot, 'unrelated.txt'), 'other Task change\n', 'utf8');
    const [state] = await captureSkoposTaskPathStates({
      workspaceRoot,
      paths: ['unrelated.txt'],
    });

    await expect(
      resolveSkoposTaskChangedPaths({
        workspaceRoot,
        changeScope,
        currentTaskId: 'T-current',
        mutationAttributions: [{
          path: 'unrelated.txt',
          taskId: 'T-other',
          digest: state!.digest,
          attributedAt: new Date(Date.parse(changeScope.capturedAt) + 1).toISOString(),
        }],
      }),
    ).resolves.toEqual({
      changedPaths: [],
      ignoredPreExistingPaths: [],
      excludedOtherTaskPaths: ['unrelated.txt'],
      externalUnattributedPaths: [],
      pathAttributions: [{
        path: 'unrelated.txt',
        kind: 'other-task',
        reason: 'other-task-mutation',
        attributedTaskId: 'T-other',
      }],
    });
  });

  it('reports an unowned post-admission edit without expanding Task proof', async () => {
    const workspaceRoot = await createGitWorkspace();
    const changeScope = await captureSkoposTaskChangeScope({ workspaceRoot });
    await writeFile(join(workspaceRoot, 'unrelated.txt'), 'external change\n', 'utf8');

    await expect(
      resolveSkoposTaskChangedPaths({ workspaceRoot, changeScope }),
    ).resolves.toEqual({
      changedPaths: [],
      ignoredPreExistingPaths: [],
      excludedOtherTaskPaths: [],
      externalUnattributedPaths: ['unrelated.txt'],
      pathAttributions: [{
        path: 'unrelated.txt',
        kind: 'external-unattributed',
        reason: 'unattributed-post-admission-change',
      }],
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
