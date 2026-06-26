import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const workspaceRoot = fileURLToPath(new URL('../../../..', import.meta.url));
const cliPackageRoot = fileURLToPath(new URL('../..', import.meta.url));

describe('skopos CLI release install smoke', { timeout: 180000 }, () => {
  it('installs the packed CLI into a fresh project and runs the installed binary', async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), 'skopos-release-smoke-'));
    const packDirectory = join(tempRoot, 'pack');
    const projectDirectory = join(tempRoot, 'fresh-project');

    try {
      await mkdir(packDirectory, { recursive: true });
      await mkdir(projectDirectory, { recursive: true });

      const tarballPath = packCli(packDirectory);

      execFileSync('npm', ['init', '-y'], {
        cwd: projectDirectory,
        stdio: 'ignore',
      });
      execFileSync('pnpm', ['add', tarballPath], {
        cwd: projectDirectory,
        stdio: 'pipe',
      });

      const helpOutput = execFileSync('pnpm', ['exec', 'skopos', '--help'], {
        cwd: projectDirectory,
        encoding: 'utf8',
      });
      expect(helpOutput).toContain('Skopos CLI');
      expect(helpOutput).toContain('skopos init [target]');

      const initOutput = JSON.parse(
        execFileSync('pnpm', ['exec', 'skopos', 'init', '.', '--actor', 'release-smoke', '--json'], {
          cwd: projectDirectory,
          encoding: 'utf8',
        }),
      ) as {
        actorId?: string;
        bootstrapWrite?: string;
        indexWrite?: string;
      };

      expect(initOutput.actorId).toBe('release-smoke');
      expect(initOutput.bootstrapWrite).toBe('written');
      expect(initOutput.indexWrite).toBe('written');

      const trustOutput = JSON.parse(
        execFileSync('pnpm', ['exec', 'skopos', 'trust', '.', '--compact', '--json'], {
          cwd: projectDirectory,
          encoding: 'utf8',
        }),
      ) as {
        trustLevel?: string;
        readiness?: string;
      };

      expect(trustOutput.trustLevel).toBeTruthy();
      expect(trustOutput.readiness).toBeTruthy();

      const policiesOutput = JSON.parse(
        execFileSync('pnpm', ['exec', 'skopos', 'policies', 'list', '.', '--json'], {
          cwd: projectDirectory,
          encoding: 'utf8',
        }),
      ) as Array<{ packId?: string }>;

      expect(policiesOutput.map((pack) => pack.packId)).toEqual(
        expect.arrayContaining([
          'architecture.mid-app',
          'clean-code.maintainability',
          'gates.progressive-validation',
          'stack.async-work',
        ]),
      );

      const packageJson = JSON.parse(
        await readFile(join(projectDirectory, 'node_modules', '@skopos', 'cli', 'package.json'), 'utf8'),
      ) as {
        dependencies?: Record<string, string>;
        files?: string[];
        license?: string;
      };
      const installedLicense = await readFile(
        join(projectDirectory, 'node_modules', '@skopos', 'cli', 'LICENSE'),
        'utf8',
      );
      const installedCleanCodePack = JSON.parse(
        await readFile(
          join(
            projectDirectory,
            'node_modules',
            '@skopos',
            'cli',
            'dist',
            'policy-packs',
            'clean-code',
            'maintainability',
            'pack.json',
          ),
          'utf8',
        ),
      ) as { packId?: string };

      expect(
        Object.keys(packageJson.dependencies ?? {}).filter((dependencyName) =>
          dependencyName.startsWith('@skopos/'),
        ),
      ).toEqual([]);
      expect(packageJson.license).toBe('Apache-2.0');
      expect(packageJson.files).toEqual(expect.arrayContaining(['dist', 'README.md', 'LICENSE']));
      expect(installedLicense).toContain('Apache License');
      expect(installedCleanCodePack.packId).toBe('clean-code.maintainability');

      const npmExecProjectDirectory = join(tempRoot, 'npm-exec-project');
      await mkdir(npmExecProjectDirectory, { recursive: true });
      const npmExecOutput = execFileSync(
        'npm',
        [
          'exec',
          '--yes',
          '--package',
          tarballPath,
          '--',
          'skopos',
          'init',
          npmExecProjectDirectory,
          '--actor',
          'npm-exec-smoke',
          '--json',
        ],
        {
          cwd: tempRoot,
          encoding: 'utf8',
        },
      );
      expect(npmExecOutput).toContain('"actorId": "npm-exec-smoke"');

      const pnpmDlxProjectDirectory = join(tempRoot, 'pnpm-dlx-project');
      await mkdir(pnpmDlxProjectDirectory, { recursive: true });
      const pnpmDlxOutput = execFileSync(
        'pnpm',
        [
          'dlx',
          tarballPath,
          'init',
          pnpmDlxProjectDirectory,
          '--actor',
          'pnpm-dlx-smoke',
          '--json',
        ],
        {
          cwd: tempRoot,
          encoding: 'utf8',
        },
      );
      expect(pnpmDlxOutput).toContain('"actorId": "pnpm-dlx-smoke"');
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
  const tarballPath = output
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.endsWith('.tgz'));

  if (!tarballPath) {
    throw new Error(`Could not find packed CLI tarball in output:\n${output}`);
  }

  return tarballPath.startsWith('/') ? tarballPath : join(workspaceRoot, tarballPath);
};
