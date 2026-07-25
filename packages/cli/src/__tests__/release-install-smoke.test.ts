import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const workspaceRoot = fileURLToPath(new URL('../../../..', import.meta.url));
const cliPackageRoot = fileURLToPath(new URL('../..', import.meta.url));

describe('skopos CLI release install smoke', { timeout: 300000 }, () => {
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
      expect(await readFile(join(projectDirectory, '.gitignore'), 'utf8')).toContain(
        'docs/generated/skopos/',
      );

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

      const gatesOutput = JSON.parse(
        execFileSync('pnpm', ['exec', 'skopos', 'gates', 'resolve', '.', '--json'], {
          cwd: projectDirectory,
          encoding: 'utf8',
        }),
      ) as {
        artifactWrite?: string;
        artifact?: {
          gates?: Array<{ id?: string; packId?: string; status?: string }>;
        };
      };

      expect(gatesOutput.artifactWrite).toBe('written');
      expect(gatesOutput.artifact?.gates?.map((gate) => gate.packId)).toContain(
        'clean-code.maintainability',
      );
      expect(gatesOutput.artifact?.gates?.map((gate) => gate.id)).toContain(
        'clean-code.maintainability.gate.vague-name-scan',
      );

      await writeExternalSkillFixture(projectDirectory);
      const skillsOutput = JSON.parse(
        execFileSync('pnpm', ['exec', 'skopos', 'skills', 'list', '.', '--json'], {
          cwd: projectDirectory,
          encoding: 'utf8',
        }),
      ) as {
        packs?: Array<{ packId?: string }>;
        bindings?: Array<{ bindingId?: string }>;
      };
      expect(skillsOutput.packs?.map((pack) => pack.packId)).toContain(
        'ui.product-craft',
      );
      expect(skillsOutput.bindings?.map((binding) => binding.bindingId)).toContain(
        'external.ui.product-craft',
      );

      const skillRecommendations = JSON.parse(
        execFileSync(
          'pnpm',
          ['exec', 'skopos', 'skills', 'recommend', '.', '--json'],
          {
            cwd: projectDirectory,
            encoding: 'utf8',
          },
        ),
      ) as {
        recommendations?: Array<{
          packId?: string;
          recommendation?: string;
          missingRequiredRoles?: string[];
        }>;
      };
      expect(skillRecommendations.recommendations).toContainEqual(
        expect.objectContaining({
          packId: 'ui.product-craft',
          recommendation: 'adopt',
          missingRequiredRoles: [],
        }),
      );

      const skillApply = JSON.parse(
        execFileSync(
          'pnpm',
          [
            'exec',
            'skopos',
            'skills',
            'apply',
            'ui.product-craft',
            '.',
            '--binding',
            'external.ui.product-craft',
            '--actor',
            'release-smoke',
            '--reason',
            'Portable skill adoption smoke proof.',
            '--json',
          ],
          {
            cwd: projectDirectory,
            encoding: 'utf8',
          },
        ),
      ) as {
        artifact?: { acceptedSkills?: Array<{ packId?: string }> };
        projectionWrites?: Array<{ status?: string }>;
      };
      expect(skillApply.artifact?.acceptedSkills?.map((skill) => skill.packId)).toEqual([
        'ui.product-craft',
      ]);
      expect(skillApply.projectionWrites).toHaveLength(5);
      expect(skillApply.projectionWrites?.every((write) => write.status === 'written')).toBe(
        true,
      );

      const skillTrust = JSON.parse(
        execFileSync('pnpm', ['exec', 'skopos', 'trust', '.', '--json'], {
          cwd: projectDirectory,
          encoding: 'utf8',
        }),
      ) as {
        checks?: Array<{ id?: string; status?: string }>;
      };
      expect(
        skillTrust.checks?.filter((check) =>
          ['accepted-skills', 'skill-bindings', 'skill-projections'].includes(
            check.id ?? '',
          ),
        ),
      ).toEqual([
        expect.objectContaining({ id: 'accepted-skills', status: 'pass' }),
        expect.objectContaining({ id: 'skill-bindings', status: 'pass' }),
        expect.objectContaining({ id: 'skill-projections', status: 'pass' }),
      ]);

      const uiBuildOutput = JSON.parse(
        execFileSync('pnpm', ['exec', 'skopos', 'ui', 'build', '.', '--json'], {
          cwd: projectDirectory,
          encoding: 'utf8',
        }),
      ) as {
        entryHtmlPath?: string;
        writeStatus?: string;
      };
      expect(uiBuildOutput.writeStatus).toBe('written');
      expect(uiBuildOutput.entryHtmlPath).toBeTruthy();
      expect(await readFile(uiBuildOutput.entryHtmlPath ?? '', 'utf8')).not.toContain(
        '__SKOPOS_UI_STATE__',
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
      const installedProductUiSkillPack = JSON.parse(
        await readFile(
          join(
            projectDirectory,
            'node_modules',
            '@skopos',
            'cli',
            'dist',
            'skill-packs',
            'ui',
            'product-craft',
            'pack.json',
          ),
          'utf8',
        ),
      ) as { packId?: string };
      const installedUiApp = await readFile(
        join(projectDirectory, 'node_modules', '@skopos', 'cli', 'dist', 'ui-app', 'index.html'),
        'utf8',
      );

      expect(
        Object.keys(packageJson.dependencies ?? {}).filter((dependencyName) =>
          dependencyName.startsWith('@skopos/'),
        ),
      ).toEqual([]);
      expect(packageJson.license).toBe('Apache-2.0');
      expect(packageJson.files).toEqual(expect.arrayContaining(['dist', 'README.md', 'LICENSE']));
      expect(installedLicense).toContain('Apache License');
      expect(installedCleanCodePack.packId).toBe('clean-code.maintainability');
      expect(installedProductUiSkillPack.packId).toBe('ui.product-craft');
      expect(installedUiApp).toContain('__SKOPOS_UI_STATE__');

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

const writeExternalSkillFixture = async (projectDirectory: string): Promise<void> => {
  await Promise.all([
    mkdir(join(projectDirectory, 'docs'), { recursive: true }),
    mkdir(join(projectDirectory, 'src', 'components'), { recursive: true }),
    mkdir(join(projectDirectory, 'tools', 'skopos', 'skills'), { recursive: true }),
    mkdir(join(projectDirectory, 'tools', 'skopos', 'workflows'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(join(projectDirectory, 'docs', 'brand.md'), '# External brand\n', 'utf8'),
    writeFile(join(projectDirectory, 'src', 'styles.css'), ':root {}\n', 'utf8'),
    writeFile(
      join(projectDirectory, 'tools', 'skopos', 'workflows', 'ui-capture.yaml'),
      [
        'id: ui.capture',
        'title: Capture responsive UI evidence',
        'description: Capture project-owned responsive UI evidence.',
        'category: quality-check',
        'scope:',
        '  - workspace',
        'command: pnpm test',
        'cwd: .',
        'inputs:',
        '  - src',
        'outputs: []',
        'affects: []',
        'safety: read-only',
        'requiresApproval: false',
        'whenToUse: Run for relevant UI changes.',
        'requiredForDone: false',
        'recommendedAfter: []',
        'owner: external-project',
        '',
      ].join('\n'),
      'utf8',
    ),
    writeFile(
      join(
        projectDirectory,
        'tools',
        'skopos',
        'skills',
        'ui.product-craft.json',
      ),
      `${JSON.stringify(
        {
          schemaVersion: 1,
          id: 'project-skill-binding.external.ui.product-craft',
          type: 'project-skill-binding',
          status: 'active',
          authority: 'canonical',
          summary: 'External-project Product UI Craft binding.',
          updatedAt: '2026-07-25',
          bindingId: 'external.ui.product-craft',
          packId: 'ui.product-craft',
          packVersion: '0.1.0',
          lifecycle: 'adapted',
          sourceBindings: {
            'brand-doctrine': ['docs/brand.md'],
            'design-tokens': ['src/styles.css'],
            'component-catalog': ['src/components'],
          },
          actionBindings: {
            'responsive-visual-capture': 'ui.capture',
          },
          guardBindings: {
            'frontend-type-safety':
              'clean-code.maintainability.gate.vague-name-scan',
          },
          adaptationNotes: ['External project sources remain canonical.'],
        },
        null,
        2,
      )}\n`,
      'utf8',
    ),
  ]);
};

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
