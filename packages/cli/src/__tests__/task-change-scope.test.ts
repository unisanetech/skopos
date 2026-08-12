import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
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

  it('attributes a changed generated output to the Task that selected its generator', async () => {
    const workspaceRoot = await createGitWorkspace();
    const changeScope = await captureSkoposTaskChangeScope({
      workspaceRoot,
      declaredOwnedPaths: ['task.txt'],
    });
    await writeFile(join(workspaceRoot, 'generated.txt'), 'compiled output\n', 'utf8');

    await expect(
      resolveSkoposTaskChangedPaths({
        workspaceRoot,
        changeScope,
        currentTaskId: 'T-current',
        generatedOutputPaths: ['generated.txt'],
      }),
    ).resolves.toEqual({
      changedPaths: ['generated.txt'],
      ignoredPreExistingPaths: [],
      excludedOtherTaskPaths: [],
      externalUnattributedPaths: [],
      pathAttributions: [{
        path: 'generated.txt',
        kind: 'task-attributed',
        reason: 'generated-output',
        attributedTaskId: 'T-current',
      }],
    });
  });

  it('attributes linked child projections to the parent without absorbing unrelated Task artifacts', async () => {
    const workspaceRoot = await createGitWorkspace();
    const changeScope = await captureSkoposTaskChangeScope({ workspaceRoot });
    await Promise.all([
      mkdir(join(workspaceRoot, 'docs/work/archive/tasks'), { recursive: true }),
      mkdir(join(workspaceRoot, 'docs/work/tasks/snapshots'), { recursive: true }),
    ]);
    await Promise.all([
      writeFile(
        join(workspaceRoot, 'docs/work/archive/tasks/T-child-finished.md'),
        'linked child result\n',
        'utf8',
      ),
      writeFile(
        join(workspaceRoot, 'docs/work/tasks/snapshots/T-child-S-proof.json'),
        '{"state":"complete"}\n',
        'utf8',
      ),
      writeFile(
        join(workspaceRoot, 'docs/work/archive/tasks/T-unrelated-finished.md'),
        'unrelated Task result\n',
        'utf8',
      ),
    ]);

    await expect(
      resolveSkoposTaskChangedPaths({
        workspaceRoot,
        changeScope,
        currentTaskId: 'T-parent',
        linkedChildTaskIds: ['T-child'],
      }),
    ).resolves.toEqual({
      changedPaths: [
        'docs/work/archive/tasks/T-child-finished.md',
        'docs/work/tasks/snapshots/T-child-S-proof.json',
      ],
      ignoredPreExistingPaths: [],
      excludedOtherTaskPaths: [],
      externalUnattributedPaths: [
        'docs/work/archive/tasks/T-unrelated-finished.md',
      ],
      pathAttributions: [
        {
          path: 'docs/work/archive/tasks/T-child-finished.md',
          kind: 'task-attributed',
          reason: 'linked-child-projection',
          attributedTaskId: 'T-parent',
        },
        {
          path: 'docs/work/archive/tasks/T-unrelated-finished.md',
          kind: 'external-unattributed',
          reason: 'unattributed-post-admission-change',
        },
        {
          path: 'docs/work/tasks/snapshots/T-child-S-proof.json',
          kind: 'task-attributed',
          reason: 'linked-child-projection',
          attributedTaskId: 'T-parent',
        },
      ],
    });
  });

  it('retains deletion of an owned path in the Task proof subject', async () => {
    const workspaceRoot = await createGitWorkspace();
    const changeScope = await captureSkoposTaskChangeScope({
      workspaceRoot,
      declaredOwnedPaths: ['task.txt'],
    });
    execFileSync('git', ['rm', 'task.txt'], { cwd: workspaceRoot });

    const result = await resolveSkoposTaskChangedPaths({
      workspaceRoot,
      changeScope,
      currentTaskId: 'T-current',
    });

    expect(result.changedPaths).toEqual(['task.txt']);
    expect(result.pathAttributions).toEqual([{
      path: 'task.txt',
      kind: 'task-owned',
      reason: 'declared-task-ownership',
      attributedTaskId: 'T-current',
    }]);
  });

  it('keeps directory snapshots stable across the same Task generated projections', async () => {
    const workspaceRoot = await createGitWorkspace();
    await mkdir(join(workspaceRoot, 'docs/work/archive/tasks'), { recursive: true });
    await mkdir(join(workspaceRoot, 'docs/work/tasks/snapshots'), { recursive: true });
    await writeFile(
      join(workspaceRoot, 'docs/work/archive/tasks/T-current-generated.md'),
      'generated state one\n',
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, 'docs/work/tasks/snapshots/T-current-S-old.json'),
      '{"state":1}\n',
      'utf8',
    );
    const [before] = await captureSkoposTaskPathStates({
      workspaceRoot,
      paths: ['.'],
      ignoredTaskId: 'T-current',
    });

    await writeFile(
      join(workspaceRoot, 'docs/work/archive/tasks/T-current-generated.md'),
      'generated state two\n',
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, 'docs/work/tasks/snapshots/T-current-S-new.json'),
      '{"state":2}\n',
      'utf8',
    );
    const [after] = await captureSkoposTaskPathStates({
      workspaceRoot,
      paths: ['.'],
      ignoredTaskId: 'T-current',
    });

    expect(after?.digest).toBe(before?.digest);
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
