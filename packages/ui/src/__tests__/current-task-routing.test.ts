import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { buildSkoposStartRuntime } from '../../../runtime/src/application/start/start.service.js';
import {
  resolveSkoposUiCurrentTaskRouting,
} from '../application/build-console-state/build-console-state.service.js';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('Skopos UI current Task routing', () => {
  it('routes one current Task by its claim owner and fails closed when ambiguous', async () => {
    const workspaceRoot = await createWorkspace();
    const first = await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'First UI Task',
      actor: 'agent-a',
      ownedPaths: ['src/a.ts'],
    });

    await expect(resolveSkoposUiCurrentTaskRouting(workspaceRoot)).resolves.toEqual({
      taskId: first.task.id,
      actorId: 'agent-a',
    });
    await buildSkoposStartRuntime({
      cwd: workspaceRoot,
      goal: 'Second UI Task',
      actor: 'agent-b',
      ownedPaths: ['src/b.ts'],
    });

    await expect(resolveSkoposUiCurrentTaskRouting(workspaceRoot)).resolves.toEqual({
      taskId: undefined,
      actorId: undefined,
    });
  });
});

const createWorkspace = async (): Promise<string> => {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-ui-task-routing-'));
  temporaryRoots.push(workspaceRoot);
  await Promise.all([
    writeFile(
      join(workspaceRoot, 'package.json'),
      JSON.stringify({ name: 'ui-task-routing', private: true }),
      'utf8',
    ),
    writeFile(join(workspaceRoot, 'README.md'), '# UI Task routing\n', 'utf8'),
    writeFile(join(workspaceRoot, 'AGENTS.md'), '# Agent rules\n', 'utf8'),
  ]);
  await initSkoposProject({
    cwd: workspaceRoot,
    mode: 'existing',
    actor: 'fixture-init',
    scaffoldInstructions: false,
  });
  return workspaceRoot;
};
