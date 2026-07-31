import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { syncSkoposInstructions } from '../../../runtime/src/application/instructions-sync/instructions-sync.service.js';

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

describe('instruction synchronization contract', () => {
  it('refreshes the managed source contract before mirroring it', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-instructions-sync-'));
    temporaryRoots.push(workspaceRoot);
    process.env.CODEX_HOME = join(workspaceRoot, '.codex-home');
    await Promise.all([
      mkdir(join(workspaceRoot, 'src'), { recursive: true }),
      mkdir(process.env.CODEX_HOME, { recursive: true }),
      writeFile(
        join(workspaceRoot, 'package.json'),
        JSON.stringify({ name: 'instruction-sync-fixture', private: true }),
        'utf8',
      ),
      writeFile(join(workspaceRoot, 'README.md'), '# Fixture\n', 'utf8'),
      writeFile(join(workspaceRoot, 'AGENTS.md'), '# Project rules\n', 'utf8'),
      writeFile(join(workspaceRoot, 'src/index.ts'), 'export const value = 1;\n', 'utf8'),
    ]);
    await initSkoposProject({
      cwd: workspaceRoot,
      mode: 'existing',
      actor: 'fixture-init',
    });
    const instructionPath = join(workspaceRoot, 'AGENTS.md');
    const current = await readFile(instructionPath, 'utf8');
    await writeFile(
      instructionPath,
      current.replace(
        'skopos task show <task-id> . --json',
        'skopos task current . --actor <id> --json',
      ),
      'utf8',
    );

    await syncSkoposInstructions({
      cwd: workspaceRoot,
      actor: 'fixture-sync',
    });

    const refreshed = await readFile(instructionPath, 'utf8');
    expect(refreshed).toContain('skopos task show <task-id> . --json');
    expect(refreshed).toContain('skopos finish <task-id> . --actor <id>');
    expect(refreshed).not.toContain('skopos task current');
  });
});
