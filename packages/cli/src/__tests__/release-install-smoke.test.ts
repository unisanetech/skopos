import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const workspaceRoot = fileURLToPath(new URL('../../../..', import.meta.url));
const cliPackageRoot = fileURLToPath(new URL('../..', import.meta.url));

describe('packed Skopos CLI', { timeout: 180_000 }, () => {
  it('installs into a clean project and exposes the canonical Task lifecycle', async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), 'skopos-release-smoke-'));
    const packDirectory = join(tempRoot, 'pack');
    const projectDirectory = join(tempRoot, 'project');

    try {
      await Promise.all([
        mkdir(packDirectory, { recursive: true }),
        mkdir(join(projectDirectory, 'src'), { recursive: true }),
      ]);
      await writeFile(
        join(projectDirectory, 'package.json'),
        JSON.stringify({ name: 'skopos-release-smoke', private: true }),
        'utf8',
      );
      await writeFile(join(projectDirectory, 'src', 'index.ts'), 'export {};\n', 'utf8');

      const tarballPath = packCli(packDirectory);
      execFileSync('pnpm', ['add', '--offline', tarballPath], {
        cwd: projectDirectory,
        stdio: 'pipe',
      });

      const help = run(projectDirectory, ['--help']);
      expect(help).toContain('skopos start <goal>');
      expect(help).toContain('skopos finish <task-id>');
      expect(help).toContain('skopos readiness <task-id>');
      expect(help).not.toContain('skopos mission');
      expect(help).not.toContain('skopos trust');
      expect(help).not.toContain('skopos done');

      const initialized = runJson<{ bootstrapWrite?: string; indexWrite?: string }>(
        projectDirectory,
        ['init', '.', '--mode', 'greenfield', '--actor', 'release-smoke', '--json'],
      );
      expect(initialized.bootstrapWrite).toBe('written');
      expect(initialized.indexWrite).toBe('written');

      const started = runJson<{ task?: { id?: string; state?: string } }>(
        projectDirectory,
        [
          'start',
          'Prove the packed canonical lifecycle',
          '.',
          '--accept',
          'A tracked Task is created',
          '--own',
          'src',
          '--actor',
          'release-smoke',
          '--session-id',
          'release-smoke-session',
          '--host',
          'release-smoke',
          '--json',
        ],
      );
      expect(started.task).toEqual(
        expect.objectContaining({
          id: expect.stringMatching(/^T-/),
          state: 'active',
        }),
      );

      const task = runJson<{ id?: string; trackedDocumentPath?: string }>(
        projectDirectory,
        ['task', 'show', started.task?.id ?? '', '.', '--json'],
      );
      expect(task.id).toBe(started.task?.id);
      expect(task.trackedDocumentPath).toMatch(/^docs\/work\/tasks\//);

      const session = runJson<{ currentTaskId?: string }>(
        projectDirectory,
        [
          'session',
          'context',
          '.',
          '--actor',
          'release-smoke',
          '--session-id',
          'release-smoke-session',
          '--host',
          'release-smoke',
          '--json',
        ],
      );
      expect(session.currentTaskId).toBe(started.task?.id);

      const installedPackage = JSON.parse(
        await readFile(
          join(projectDirectory, 'node_modules', '@skopos', 'cli', 'package.json'),
          'utf8',
        ),
      ) as { dependencies?: Record<string, string> };
      expect(
        Object.keys(installedPackage.dependencies ?? {}).filter((name) =>
          name.startsWith('@skopos/'),
        ),
      ).toEqual([]);
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });
});

const packCli = (packDirectory: string): string => {
  const output = execFileSync('pnpm', ['pack', '--pack-destination', packDirectory], {
    cwd: cliPackageRoot,
    encoding: 'utf8',
  });
  const path = output
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.endsWith('.tgz'));
  if (!path) throw new Error(`Packed CLI tarball was not reported:\n${output}`);
  return isAbsolute(path) ? path : join(workspaceRoot, path);
};

const run = (cwd: string, args: string[]): string =>
  execFileSync('pnpm', ['exec', 'skopos', ...args], {
    cwd,
    encoding: 'utf8',
  });

const runJson = <T>(cwd: string, args: string[]): T =>
  JSON.parse(run(cwd, args)) as T;
