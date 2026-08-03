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

      await mkdir(join(projectDirectory, 'tools', 'skopos', 'actions'), {
        recursive: true,
      });
      await Promise.all([
        writeFile(join(projectDirectory, '.gitignore'), 'node_modules/\n', 'utf8'),
        writePackedAction(projectDirectory, 'packed-artifact', {
          command:
            `node -e "const fs=require('node:fs');const p=require('node:path');fs.writeFileSync(p.join(process.env.SKOPOS_ARTIFACT_ROOT,'proof.json'),JSON.stringify({root:process.env.SKOPOS_ARTIFACT_ROOT}))"`,
          outputs: ['proof.json'],
          artifactEffect: 'isolated',
          safety: 'artifact-producing',
        }),
        writePackedAction(projectDirectory, 'packed-external', {
          command: `node -e "require('node:fs').writeFileSync('external-executed.txt','yes')"`,
          services: ['packed-remote'],
          externalEffect: 'declared',
          safety: 'mutating',
          concurrency: 'exclusive',
        }),
        writePackedAction(projectDirectory, 'packed-mutation', {
          command: `node -e "require('node:fs').writeFileSync('undeclared.txt','changed')"`,
        }),
      ]);
      initializeGitBaseline(projectDirectory);

      const artifactRun = runJson<{
        status?: string;
        artifactRoot?: string;
        outputPaths?: string[];
        additionalOutputPathCount?: number;
      }>(projectDirectory, [
        'actions',
        'run',
        'packed.artifact',
        '.',
        '--actor',
        'release-smoke',
        '--json',
      ]);
      expect(artifactRun).toMatchObject({
        status: 'succeeded',
        artifactRoot: expect.stringMatching(
          /^\.skopos\/runs\/run-.+\/artifacts$/,
        ),
        additionalOutputPathCount: 0,
      });
      expect(artifactRun.outputPaths).toEqual([
        `${artifactRun.artifactRoot}/proof.json`,
      ]);
      await expect(
        readFile(join(projectDirectory, artifactRun.outputPaths?.[0] ?? ''), 'utf8'),
      ).resolves.toContain(artifactRun.artifactRoot);

      const externalRun = runJson<{ status?: string; capabilityIssues?: string[] }>(
        projectDirectory,
        [
          'actions',
          'run',
          'packed.external',
          '.',
          '--actor',
          'release-smoke',
          '--json',
        ],
      );
      expect(externalRun).toMatchObject({
        status: 'unavailable',
        capabilityIssues: ['Required service packed-remote is unavailable.'],
      });
      await expect(
        readFile(join(projectDirectory, 'external-executed.txt'), 'utf8'),
      ).rejects.toThrow();

      expect(
        runFailure(projectDirectory, [
          'actions',
          'run',
          'packed.mutation',
          '.',
          '--actor',
          'release-smoke',
          '--json',
        ]),
      ).toContain('undeclared workspace mutation at undeclared.txt');
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

const runFailure = (cwd: string, args: string[]): string => {
  try {
    run(cwd, args);
  } catch (error) {
    const failure = error as { stdout?: Buffer | string; stderr?: Buffer | string };
    return `${failure.stdout?.toString() ?? ''}\n${failure.stderr?.toString() ?? ''}`;
  }
  throw new Error(`Expected installed skopos ${args.join(' ')} to fail.`);
};

interface PackedActionOverrides {
  command: string;
  outputs?: string[];
  services?: string[];
  artifactEffect?: 'none' | 'isolated';
  externalEffect?: 'none' | 'declared';
  safety?: 'read-only' | 'artifact-producing' | 'mutating';
  concurrency?: 'shared' | 'exclusive';
}

const writePackedAction = async (
  projectDirectory: string,
  name: string,
  overrides: PackedActionOverrides,
): Promise<void> => {
  const source = [
    `id: ${name.replaceAll('-', '.')}`,
    `title: ${name}`,
    'description: Packed release certification fixture.',
    'category: quality-check',
    'scope: [workspace]',
    'command: >-',
    `  ${overrides.command}`,
    'cwd: .',
    'inputs: [package.json]',
    `outputs: ${JSON.stringify(overrides.outputs ?? [])}`,
    'affects: []',
    'capabilities:',
    '  process: required',
    '  network: none',
    '  browser: none',
    '  tools: [node]',
    '  secrets: []',
    `  services: ${JSON.stringify(overrides.services ?? [])}`,
    'effects:',
    '  workspace: none',
    `  artifacts: ${overrides.artifactEffect ?? 'none'}`,
    `  external: ${overrides.externalEffect ?? 'none'}`,
    `concurrency: ${overrides.concurrency ?? 'shared'}`,
    `safety: ${overrides.safety ?? 'read-only'}`,
    'requiresApproval: false',
    'recommendedAfter: []',
    'owner: release-smoke',
    '',
  ].join('\n');
  await writeFile(
    join(projectDirectory, 'tools', 'skopos', 'actions', `${name}.yaml`),
    source,
    'utf8',
  );
};

const initializeGitBaseline = (projectDirectory: string): void => {
  execFileSync('git', ['init', '--initial-branch=main'], { cwd: projectDirectory });
  execFileSync('git', ['config', 'user.email', 'skopos@example.com'], {
    cwd: projectDirectory,
  });
  execFileSync('git', ['config', 'user.name', 'Skopos Release Smoke'], {
    cwd: projectDirectory,
  });
  execFileSync('git', ['add', '.'], { cwd: projectDirectory });
  execFileSync('git', ['commit', '-m', 'packed release baseline'], {
    cwd: projectDirectory,
  });
};
