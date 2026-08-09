import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { runExternalSkillPortability } from '../benchmarks/external-skill-portability.js';

const workspaceRoot = fileURLToPath(new URL('../../../..', import.meta.url));
const cliPackageRoot = fileURLToPath(new URL('../..', import.meta.url));

describe('packed Skopos CLI', { timeout: 180_000 }, () => {
  it('ships the reviewed Skill runtime assets without private data or internal brands', async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), 'skopos-release-content-'));
    const packDirectory = join(tempRoot, 'pack');
    const extractDirectory = join(tempRoot, 'extract');

    try {
      await Promise.all([
        mkdir(packDirectory, { recursive: true }),
        mkdir(extractDirectory, { recursive: true }),
      ]);
      const tarballPath = packCli(packDirectory);
      execFileSync('tar', ['-xzf', tarballPath, '-C', extractDirectory], {
        stdio: 'pipe',
      });

      const packedPackageRoot = join(extractDirectory, 'package');
      const packedPackage = JSON.parse(
        await readFile(join(packedPackageRoot, 'package.json'), 'utf8'),
      ) as { scripts?: Record<string, string> };
      expect(packedPackage.scripts).toBeUndefined();

      const sourceSkillAssets = await listRelativeFiles(join(workspaceRoot, 'skill-packs'));
      const packedSkillAssets = await listRelativeFiles(
        join(packedPackageRoot, 'dist', 'skill-packs'),
      );
      expect(packedSkillAssets).toEqual(sourceSkillAssets);
      expect(packedSkillAssets).toHaveLength(42);
      expect(packedSkillAssets).toContain('ui/product-craft/pack.json');
      expect(packedSkillAssets).toContain('ui/product-craft/evaluations/core.suite.json');

      const packedText = await readTextSurface(packedPackageRoot);
      for (const prohibited of [
        /Bhaskar Barma/iu,
        /bhaskar@/iu,
        /\/Users\/[^\s"'`]+/u,
        /\/home\/[^\s"'`]+/u,
        /[A-Za-z]:\\Users\\[^\s"'`]+/u,
        /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u,
        /\bAKIA[0-9A-Z]{16}\b/u,
        /\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b/u,
      ]) {
        expect(packedText, `packed tarball matched ${String(prohibited)}`).not.toMatch(
          prohibited,
        );
      }

      const packedRuntimeText = await readTextSurface(join(packedPackageRoot, 'dist'));
      for (const prohibited of [/\bUnisane\b/iu, /@unisane\//iu, /\bBillquest\b/iu]) {
        expect(
          packedRuntimeText,
          `packed runtime matched internal source marker ${String(prohibited)}`,
        ).not.toMatch(prohibited);
      }

      const publicSourceText = await readSelectedSourceText([
        'packages/ui/src',
        'skill-packs',
        'policy-packs',
      ]);
      for (const prohibited of [
        /Bhaskar Barma/iu,
        /bhaskar@/iu,
        /\bUnisane\b/iu,
        /@unisane\//iu,
        /\bBillquest\b/iu,
      ]) {
        expect(publicSourceText, `public source matched ${String(prohibited)}`).not.toMatch(
          prohibited,
        );
      }
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });

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
      runChecked('pnpm', ['add', '--prefer-offline', tarballPath], projectDirectory);

      const help = run(projectDirectory, ['--help']);
      expect(help).toContain('skopos start <goal>');
      expect(help).toContain('skopos finish <task-id>');
      expect(help).toContain('skopos readiness <task-id>');
      expect(help).toContain('skopos skills context <task-id>');
      expect(help).toContain('skopos discuss handoff create');
      expect(help).toContain('skopos discuss handoff deliver');
      expect(help).toContain('skopos storage status');
      expect(help).toContain('skopos storage prune');
      expect(help).not.toContain('skopos mission');
      expect(help).not.toContain('skopos trust');
      expect(help).not.toContain('skopos done');

      expect(run(projectDirectory, ['--version']).trim()).toBe('0.1.0');
      expect(run(projectDirectory, ['-v']).trim()).toBe('0.1.0');

      const initialized = runJson<{ bootstrapWrite?: string; indexWrite?: string }>(
        projectDirectory,
        ['init', '.', '--mode', 'greenfield', '--actor', 'release-smoke', '--json'],
      );
      expect(initialized.bootstrapWrite).toBe('written');
      expect(initialized.indexWrite).toBe('written');

      const storageStatus = runJson<{
        privacyWarning?: string;
        classSummaries?: Array<{ storageClass?: string }>;
      }>(projectDirectory, ['storage', 'status', '.', '--json']);
      expect(storageStatus.privacyWarning).toContain('Do not upload or share it wholesale');
      expect(storageStatus.classSummaries?.map((summary) => summary.storageClass)).toContain(
        'release-evidence',
      );

      const storagePreview = runJson<{ mode?: string; deletedUnitCount?: number }>(
        projectDirectory,
        ['storage', 'prune', '.', '--dry-run', '--json'],
      );
      expect(storagePreview).toMatchObject({ mode: 'dry-run', deletedUnitCount: 0 });

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
      ) as {
        dependencies?: Record<string, string>;
        scripts?: Record<string, string>;
      };
      expect(installedPackage.scripts).toBeUndefined();
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
          command: `node -e "require('node:fs').writeFileSync(process.env.SKOPOS_EXTERNAL_EFFECT_RECEIPT_PATH,JSON.stringify({schemaVersion:1,service:'packed-remote',operation:'packed.create',status:'succeeded',providerRequestId:'packed-request-1',occurredAt:new Date().toISOString()}))"`,
          services: ['packed-remote'],
          externalEffect: 'declared',
          safety: 'mutating',
          concurrency: 'exclusive',
        }),
        writePackedAction(projectDirectory, 'packed-host-capabilities', {
          command: `node -e "process.exit(0)"`,
          network: 'required',
          browser: 'required',
          secrets: ['PACKED_PROOF_SECRET'],
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

      const externalReceiptRun = runJson<{
        status?: string;
        externalEffectReceipt?: {
          service?: string;
          operation?: string;
          status?: string;
          receiptPath?: string;
        };
      }>(projectDirectory, [
        'actions',
        'run',
        'packed.external',
        '.',
        '--actor',
        'release-smoke',
        '--json',
      ], {
        SKOPOS_SERVICE_PACKED_REMOTE_AVAILABLE: '1',
      });
      expect(externalReceiptRun).toMatchObject({
        status: 'succeeded',
        externalEffectReceipt: {
          service: 'packed-remote',
          operation: 'packed.create',
          status: 'succeeded',
          receiptPath: expect.stringMatching(/external-effect-receipt\.json$/),
        },
      });

      const unavailableHost = runJson<{
        status?: string;
        capabilityIssues?: string[];
      }>(projectDirectory, [
        'actions',
        'run',
        'packed.host.capabilities',
        '.',
        '--json',
      ]);
      expect(unavailableHost).toMatchObject({
        status: 'unavailable',
        capabilityIssues: [
          'Required secret PACKED_PROOF_SECRET is unavailable.',
          'Required network capability is unavailable.',
          'Required browser capability is unavailable.',
        ],
      });
      const availableHost = runJson<{ status?: string; detailPath?: string }>(
        projectDirectory,
        ['actions', 'run', 'packed.host.capabilities', '.', '--json'],
        {
          SKOPOS_NETWORK_AVAILABLE: '1',
          SKOPOS_BROWSER_AVAILABLE: '1',
          PACKED_PROOF_SECRET: '<SECRET>',
        },
      );
      expect(availableHost.status).toBe('succeeded');
      await expect(
        readFile(join(projectDirectory, availableHost.detailPath ?? ''), 'utf8'),
      ).resolves.not.toContain('<SECRET>');

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

  it('proves Product UI Craft behavior from the packed CLI without source resolution', async () => {
    const report = await runExternalSkillPortability();

    expect(report.result).toBe('pass');
    expect(report.projects).toHaveLength(1);
    expect(report.projects[0]).toMatchObject({
      label: 'minimal',
      fixtureResult: { passed: 8, failed: 0 },
      relevantTask: {
        selectedPackIds: ['ui.product-craft'],
        selectedModuleIds: ['ui-craft.react-boundaries'],
        skillContextEntryCount: 2,
      },
      irrelevantTask: {
        selectedPackIds: [],
        skillContextEntryCount: 0,
      },
      cache: {
        exactReuse: true,
        invalidatedAfterCapabilityChange: true,
      },
      containment: {
        claim: 'observed-generated-artifacts-contained',
        outsideProjectPaths: [],
        forbiddenSymlinkTargets: [],
        installedSourceCheckoutReferences: [],
        nodePathAbsent: true,
        workspaceProtocolAbsent: true,
      },
      executedCapabilityActions: [],
      adaptationGaps: [],
    });
    expect(report.cleanup).toMatchObject({
      attempted: true,
      succeeded: true,
      harnessRootExistsAfterCleanup: false,
    });
  });

  it('emits a classified machine-readable failure report with partial proof and cleanup', async () => {
    const missingBillquest = join(tmpdir(), 'skopos-portability-missing-billquest');
    const report = await runExternalSkillPortability({ canaryRoot: missingBillquest });

    expect(report).toMatchObject({
      result: 'fail',
      failure: {
        category: 'external-project',
        stage: 'read-live-canary-status-before',
        project: 'billquest',
        command: 'git status --short',
      },
      cleanup: {
        attempted: true,
        succeeded: true,
        harnessRootExistsAfterCleanup: false,
      },
    });
    expect(report.projects).toHaveLength(1);
    expect(report.projects[0]).toMatchObject({
      label: 'minimal',
      fixtureResult: { passed: 8, failed: 0 },
    });
    expect(report.classification.externalProjectFailures).toHaveLength(1);
    expect(report.classification.skoposPortabilityFailures).toEqual([]);
    expect(report.classification.projectAdaptationFailures).toEqual([]);
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

const runChecked = (command: string, args: string[], cwd: string): string => {
  try {
    return execFileSync(command, args, {
      cwd,
      encoding: 'utf8',
      stdio: 'pipe',
    });
  } catch (error) {
    const result = error as {
      message?: string;
      stdout?: string | Buffer;
      stderr?: string | Buffer;
    };
    const stdout = result.stdout?.toString().trim();
    const stderr = result.stderr?.toString().trim();
    throw new Error(
      [
        result.message ?? `${command} failed`,
        stdout ? `stdout:\n${stdout}` : undefined,
        stderr ? `stderr:\n${stderr}` : undefined,
      ].filter(Boolean).join('\n'),
    );
  }
};

const textFileExtensions = new Set([
  '',
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.txt',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
]);

const listRelativeFiles = async (
  root: string,
  current: string = root,
): Promise<string[]> => {
  const entries = await readdir(current, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const absolutePath = join(current, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listRelativeFiles(root, absolutePath));
    } else if (entry.isFile()) {
      files.push(absolutePath.slice(root.length + 1));
    }
  }
  return files.sort();
};

const readTextSurface = async (root: string): Promise<string> => {
  const paths = await listRelativeFiles(root);
  const contents: string[] = [];
  for (const path of paths) {
    const basename = path.split('/').at(-1) ?? '';
    const extension = basename.includes('.') ? `.${basename.split('.').at(-1)}` : '';
    if (!textFileExtensions.has(extension)) continue;
    contents.push(`\n--- ${path} ---\n`, await readFile(join(root, path), 'utf8'));
  }
  return contents.join('');
};

const readSelectedSourceText = async (relativeRoots: string[]): Promise<string> => {
  const contents: string[] = [];
  for (const relativeRoot of relativeRoots) {
    const absoluteRoot = join(workspaceRoot, relativeRoot);
    contents.push(`\n=== ${relativeRoot} ===\n`, await readTextSurface(absoluteRoot));
  }
  return contents.join('');
};

const run = (
  cwd: string,
  args: string[],
  environment: NodeJS.ProcessEnv = {},
): string =>
  execFileSync('pnpm', ['exec', 'skopos', ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, ...environment },
  });

const runJson = <T>(
  cwd: string,
  args: string[],
  environment: NodeJS.ProcessEnv = {},
): T => JSON.parse(run(cwd, args, environment)) as T;
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
  network?: 'none' | 'required';
  browser?: 'none' | 'required';
  secrets?: string[];
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
    `  network: ${overrides.network ?? 'none'}`,
    `  browser: ${overrides.browser ?? 'none'}`,
    '  tools: [node]',
    `  secrets: ${JSON.stringify(overrides.secrets ?? [])}`,
    `  services: ${JSON.stringify(overrides.services ?? [])}`,
    'effects:',
    '  workspace: none',
    `  artifacts: ${overrides.artifactEffect ?? 'none'}`,
    `  external: ${overrides.externalEffect ?? 'none'}`,
    `concurrency: ${overrides.concurrency ?? 'shared'}`,
    'workspaceMode: overlay-safe',
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
