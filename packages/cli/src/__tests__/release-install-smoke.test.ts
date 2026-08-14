import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  isHandoffArtifactPath,
  resolvePnpmInvocation,
  runExternalSkillPortability,
} from '../benchmarks/external-skill-portability.js';
import { normalizePortablePath } from '../../scripts/portable-path.mjs';

const workspaceRoot = fileURLToPath(new URL('../../../..', import.meta.url));
const cliPackageRoot = fileURLToPath(new URL('../..', import.meta.url));
const isDeferredDesignContextAsset = (path: string): boolean =>
  normalizePortablePath(path).includes('/design-context/');

describe('packed Skopos CLI', { timeout: 180_000 }, () => {
  it('resolves pnpm through Node or the platform executable shim', () => {
    expect(
      resolvePnpmInvocation({
        platform: 'win32',
        packageManagerEntrypoint: String.raw`C:\pnpm\pnpm.cjs`,
        nodeExecutable: String.raw`C:\node\node.exe`,
      }),
    ).toEqual({
      command: String.raw`C:\node\node.exe`,
      argsPrefix: [String.raw`C:\pnpm\pnpm.cjs`],
    });
    expect(
      resolvePnpmInvocation({
        platform: 'win32',
        packageManagerEntrypoint: null,
        commandInterpreter: String.raw`C:\Windows\System32\cmd.exe`,
      }),
    ).toEqual({
      command: String.raw`C:\Windows\System32\cmd.exe`,
      argsPrefix: ['/d', '/s', '/c', 'pnpm'],
    });
    expect(
      resolvePnpmInvocation({
        platform: 'linux',
        packageManagerEntrypoint: null,
      }),
    ).toEqual({ command: 'pnpm', argsPrefix: [] });
  });

  it('recognizes deferred design-context assets on Windows and POSIX', () => {
    expect(
      isDeferredDesignContextAsset(
        String.raw`ui\product-interface-design\design-context\library.json`,
      ),
    ).toBe(true);
    expect(
      isDeferredDesignContextAsset(
        'ui/product-interface-design/design-context/library.json',
      ),
    ).toBe(true);
  });

  it('recognizes continuation handoff artifacts on Windows and POSIX', () => {
    expect(
      isHandoffArtifactPath(
        String.raw`C:\project\.skopos\handoffs\T-123\handoff.json`,
      ),
    ).toBe(true);
    expect(
      isHandoffArtifactPath('/project/.skopos/handoffs/T-123/handoff.json'),
    ).toBe(true);
    expect(
      isHandoffArtifactPath('/project/.skopos/handoffs/T-123/validation.json'),
    ).toBe(false);
  });

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
      const deferredDesignContextAssets = sourceSkillAssets.filter(
        isDeferredDesignContextAsset,
      );
      expect(deferredDesignContextAssets).toHaveLength(4);
      expect(packedSkillAssets).toEqual(
        sourceSkillAssets.filter((path) => !isDeferredDesignContextAsset(path)),
      );
      expect(packedSkillAssets).toHaveLength(38);
      expect(packedSkillAssets).toContain('ui/product-interface-design/pack.json');
      expect(packedSkillAssets).toContain('ui/product-interface-design/evaluations/core.suite.json');
      for (const internalAsset of deferredDesignContextAssets) {
        expect(packedSkillAssets).not.toContain(internalAsset);
      }

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
      const pnpm = resolvePnpmInvocation();
      runChecked(
        pnpm.command,
        [...pnpm.argsPrefix, 'add', '--prefer-offline', tarballPath],
        projectDirectory,
      );

      const help = run(projectDirectory, ['--help']);
      expect(help).toContain('skopos start <goal>');
      expect(help).toContain('skopos finish <task-id>');
      expect(help).toContain('skopos readiness <task-id>');
      expect(help).toContain('skopos skills context <task-id>');
      expect(help).toContain('skopos discuss handoff create');
      expect(help).toContain('skopos discuss handoff deliver');
      expect(help).toContain('skopos storage status');
      expect(help).toContain('skopos storage prune');
      expect(help).toContain('skopos evidence record-browser');
      expect(help).toContain('skopos setup [target]');
      expect(help).not.toContain('skopos adopt');
      expect(help).not.toContain('skopos mission');
      expect(help).not.toContain('skopos trust');
      expect(help).not.toContain('skopos done');

      expect(run(projectDirectory, ['--version']).trim()).toBe('0.1.0');
      expect(run(projectDirectory, ['-v']).trim()).toBe('0.1.0');

      const setup = runJson<{
        statePath?: string;
        state?: { stage?: string; lanes?: Array<{ id?: string }> };
      }>(
        projectDirectory,
        ['setup', '.', '--actor', 'release-smoke', '--json'],
      );
      expect(normalizePortablePath(setup.statePath ?? '')).toContain(
        '.skopos/setup/state.json',
      );
      expect(setup.state?.stage).toMatch(
        /^(inspection-required|questions-open|plan-ready|verification-blocked|setup-ready(?:-with-deferred-options)?)$/u,
      );
      expect(setup.state?.lanes?.map((lane) => lane.id)).toEqual(
        expect.arrayContaining(['understanding', 'scopes', 'memory', 'host-delivery']),
      );
      const setupReview = runJson<{
        statePath?: string;
        state?: {
          stage?: string;
          recommendations?: Array<{ id?: string; laneId?: string }>;
          nextCommand?: string;
        };
      }>(projectDirectory, [
        'setup',
        'review',
        '.',
        '--actor',
        'release-smoke',
        '--json',
      ]);
      expect(setupReview.statePath).toBe(setup.statePath);
      expect(setupReview.state?.stage).toBe(setup.state?.stage);
      expect(setupReview.state?.recommendations).toEqual(expect.any(Array));
      expect(setupReview.state?.nextCommand).toEqual(expect.any(String));

      const setupResume = runJson<{
        state?: { stage?: string; nextCommand?: string };
      }>(projectDirectory, [
        'setup',
        'resume',
        '.',
        '--actor',
        'release-smoke',
        '--json',
      ]);
      expect(setupResume.state?.stage).toMatch(
        /^(inspection-required|questions-open|plan-ready|verification-blocked|setup-ready(?:-with-deferred-options)?)$/u,
      );
      expect(setupResume.state?.nextCommand).toEqual(expect.any(String));
      expect(runFailure(projectDirectory, ['adopt', 'assess', '.', '--json'])).toContain(
        'Unknown Skopos command: adopt',
      );

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

      await Promise.all([
        mkdir(join(projectDirectory, 'tools', 'skopos'), { recursive: true }),
        mkdir(join(projectDirectory, 'apps', 'storefront', 'src'), { recursive: true }),
        mkdir(join(projectDirectory, 'docs', 'scopes', 'storefront'), { recursive: true }),
        mkdir(join(projectDirectory, 'packages', 'shared', 'src'), { recursive: true }),
        mkdir(join(projectDirectory, 'docs', 'scopes', 'shared'), { recursive: true }),
      ]);
      await Promise.all([
        writeFile(
          join(projectDirectory, 'tools', 'skopos', 'scopes.yaml'),
          packedScopeRegistry,
          'utf8',
        ),
        writeFile(
          join(projectDirectory, 'apps', 'storefront', 'src', 'page.ts'),
          'export {};\n',
          'utf8',
        ),
        writeFile(
          join(projectDirectory, 'docs', 'scopes', 'storefront', '00-start-here.md'),
          packedStorefrontMemory,
          'utf8',
        ),
        writeFile(
          join(projectDirectory, 'packages', 'shared', 'src', 'model.ts'),
          'export {};\n',
          'utf8',
        ),
        writeFile(
          join(projectDirectory, 'docs', 'scopes', 'shared', '00-start-here.md'),
          packedSharedMemory,
          'utf8',
        ),
      ]);
      const scopedStart = runJson<{
        scopeId?: string;
        task?: { id?: string };
      }>(projectDirectory, [
        'start',
        'Change the packed storefront fixture',
        '.',
        '--own',
        'apps/storefront/src/page.ts',
        '--actor',
        'packed-scope-smoke',
        '--json',
      ]);
      expect(scopedStart.scopeId).toBe('storefront');
      const scopedExpanded = runJson<{
        scopeId?: string;
        ownershipExpansionCount?: number;
      }>(projectDirectory, [
        'task',
        'ownership',
        'add',
        scopedStart.task?.id ?? '',
        '--own',
        'packages/shared/src/model.ts',
        '--reason',
        'The packed storefront Task requires its declared shared dependency.',
        '--actor',
        'packed-scope-smoke',
        '--cwd',
        '.',
        '--json',
      ]);
      expect(scopedExpanded).toMatchObject({
        scopeId: 'storefront',
        ownershipExpansionCount: 1,
      });
      expect(
        runFailure(projectDirectory, [
          'start',
          'Mix unrelated packed Scope ownership',
          '.',
          '--own',
          'apps/storefront/src/page.ts',
          '--own',
          'src/index.ts',
          '--actor',
          'packed-scope-smoke',
          '--dry-run',
          '--json',
        ]),
      ).toContain('Owned paths span multiple declared Scopes');

      await mkdir(join(projectDirectory, 'proof'), { recursive: true });
      await writeFile(join(projectDirectory, 'proof', 'packed-browser.png'), 'packed browser capture', 'utf8');
      const packedBrowserTask = runJson<{ task?: { id?: string } }>(projectDirectory, [
        'start',
        'Verify the packed responsive storefront',
        '.',
        '--accept',
        'The storefront renders within the mobile viewport',
        '--own',
        'apps/storefront/src/page.ts',
        '--risk',
        'light',
        '--actor',
        'packed-browser-smoke',
        '--json',
      ]);
      await writeFile(
        join(projectDirectory, 'apps', 'storefront', 'src', 'page.ts'),
        'export const responsive = true;\n',
        'utf8',
      );
      const packedBrowserReceipt = runJson<{
        type?: string;
        url?: string;
        viewport?: { width?: number; height?: number };
        capture?: { kind?: string; path?: string; digest?: string };
        sourceStateDigest?: string;
      }>(projectDirectory, [
        'evidence',
        'record-browser',
        packedBrowserTask.task?.id ?? '',
        '.',
        '--requirement',
        'acceptance-1',
        '--url',
        '/checkout',
        '--viewport',
        '390x844@2',
        '--interaction',
        'Loaded checkout and measured the rendered mobile surface.',
        '--capture',
        'proof/packed-browser.png',
        '--capture-kind',
        'screenshot',
        '--browser',
        'Chromium packed smoke',
        '--actor',
        'packed-browser-smoke',
        '--json',
      ]);
      expect(packedBrowserReceipt).toMatchObject({
        type: 'browser-evidence-summary',
        url: '/checkout',
        viewport: { width: 390, height: 844 },
        capture: { kind: 'screenshot', path: 'proof/packed-browser.png' },
      });
      expect(packedBrowserReceipt.capture?.digest).toMatch(/^[a-f0-9]{64}$/u);
      expect(packedBrowserReceipt.sourceStateDigest).toMatch(/^[a-f0-9]{64}$/u);

      const packedQuestionTask = runJson<{
        taskPath?: string;
        questionsPath?: string;
        task?: {
          id?: string;
          state?: string;
          steps?: Array<{ id: string; kind: string }>;
          questions?: Array<Record<string, unknown>>;
        };
        questions?: { entries?: Array<Record<string, unknown>> };
      }>(projectDirectory, [
        'start',
        'Change the public API endpoint contract',
        '.',
        '--accept',
        'The packed Task preserves terminal question correctness',
        '--own',
        'src/index.ts',
        '--risk',
        'standard',
        '--actor',
        'packed-question-smoke',
        '--full',
        '--json',
      ]);
      expect(packedQuestionTask.task?.state).toBe('blocked');
      const nonBlockingQuestions = (packedQuestionTask.questions?.entries ?? []).map(
        (question) => ({ ...question, blocking: false }),
      );
      await Promise.all([
        writeFile(
          packedQuestionTask.taskPath ?? '',
          `${JSON.stringify({
            ...packedQuestionTask.task,
            state: 'active',
            questions: nonBlockingQuestions,
          }, null, 2)}\n`,
          'utf8',
        ),
        writeFile(
          packedQuestionTask.questionsPath ?? '',
          `${JSON.stringify({
            ...packedQuestionTask.questions,
            entries: nonBlockingQuestions,
          }, null, 2)}\n`,
          'utf8',
        ),
      ]);
      for (const step of packedQuestionTask.task?.steps?.filter(
        (entry) => entry.kind !== 'verification',
      ) ?? []) {
        runJson(projectDirectory, [
          'task',
          'step',
          'complete',
          packedQuestionTask.task?.id ?? '',
          step.id,
          '.',
          '--actor',
          'packed-question-smoke',
          '--json',
        ]);
      }
      runJson(projectDirectory, [
        'evidence',
        'record-observation',
        packedQuestionTask.task?.id ?? '',
        '.',
        '--requirement',
        'acceptance-1',
        '--statement',
        'The packed fixture observes terminal question correctness.',
        '--actor',
        'packed-question-smoke',
        '--json',
      ]);
      const packedQuestionBlocked = runJson<{
        readiness?: string;
        blockers?: string[];
      }>(projectDirectory, [
        'finish',
        packedQuestionTask.task?.id ?? '',
        '.',
        '--actor',
        'packed-question-smoke',
        '--json',
      ]);
      expect(packedQuestionBlocked.readiness).toBe('blocked');
      expect(packedQuestionBlocked.blockers?.join('\n')).toContain(
        'open decision questions: plan.public-api-change',
      );
      runJson(projectDirectory, [
        'task',
        'question',
        'dispose',
        packedQuestionTask.task?.id ?? '',
        'plan.public-api-change',
        '--disposition',
        'dismissed',
        '--reason',
        'The packed fixture explicitly dismisses the no-longer-relevant question.',
        '--cwd',
        '.',
        '--actor',
        'packed-question-smoke',
        '--json',
      ]);
      const packedQuestionFinished = runJson<{
        taskState?: string;
        blockers?: string[];
      }>(projectDirectory, [
        'finish',
        packedQuestionTask.task?.id ?? '',
        '.',
        '--actor',
        'packed-question-smoke',
        '--json',
      ]);
      expect(
        packedQuestionFinished.blockers,
        packedQuestionFinished.blockers?.join('\n'),
      ).toEqual([]);
      expect(packedQuestionFinished.taskState).toBe('complete');

      const installedPackage = JSON.parse(
        await readFile(
          join(projectDirectory, 'node_modules', '@unisane', 'skopos', 'package.json'),
          'utf8',
        ),
      ) as {
        name?: string;
        bin?: Record<string, string>;
        dependencies?: Record<string, string>;
        scripts?: Record<string, string>;
      };
      expect(installedPackage.name).toBe('@unisane/skopos');
      expect(installedPackage.bin).toEqual({ skopos: 'dist/cli.js' });
      expect(installedPackage.scripts).toBeUndefined();
      expect(
        Object.keys(installedPackage.dependencies ?? {}).filter((name) =>
          name.startsWith('@skopos/'),
        ),
      ).toEqual([]);

      const packedActionFixturePath = 'tools/skopos/fixtures/packed-action.cjs';
      await Promise.all([
        mkdir(join(projectDirectory, 'tools', 'skopos', 'actions'), {
          recursive: true,
        }),
        mkdir(join(projectDirectory, 'tools', 'skopos', 'fixtures'), {
          recursive: true,
        }),
      ]);
      await Promise.all([
        writeFile(join(projectDirectory, '.gitignore'), 'node_modules/\n', 'utf8'),
        writeFile(
          join(projectDirectory, packedActionFixturePath),
          PACKED_ACTION_FIXTURE_SOURCE,
          'utf8',
        ),
        writePackedAction(projectDirectory, 'packed-artifact', {
          command: `node ${packedActionFixturePath} artifact`,
          outputs: ['proof.json'],
          artifactEffect: 'isolated',
          safety: 'artifact-producing',
        }),
        writePackedAction(projectDirectory, 'packed-external', {
          command: `node ${packedActionFixturePath} external`,
          services: ['packed-remote'],
          externalEffect: 'declared',
          safety: 'mutating',
          concurrency: 'exclusive',
        }),
        writePackedAction(projectDirectory, 'packed-host-capabilities', {
          command: `node ${packedActionFixturePath} noop`,
          network: 'required',
          browser: 'required',
          secrets: ['PACKED_PROOF_SECRET'],
        }),
        writePackedAction(projectDirectory, 'packed-mutation', {
          command: `node ${packedActionFixturePath} mutation`,
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
      const artifactProof = JSON.parse(
        await readFile(
          join(projectDirectory, artifactRun.outputPaths?.[0] ?? ''),
          'utf8',
        ),
      ) as { root?: string };
      expect(normalizePortablePath(artifactProof.root ?? '')).toContain(
        artifactRun.artifactRoot,
      );

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

  it('proves Product Interface Design behavior from the packed CLI without source resolution', async () => {
    const report = await runExternalSkillPortability();

    expect(report.result, JSON.stringify(report.failure, null, 2)).toBe('pass');
    expect(report.projects).toHaveLength(1);
    expect(report.projects[0]).toMatchObject({
      label: 'minimal',
      fixtureResult: { passed: 8, failed: 0 },
      relevantTask: {
        selectedPackIds: ['ui.product-interface-design'],
        selectedModuleIds: ['interface-design.behavior'],
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
    const missingExternalProject = join(tmpdir(), 'skopos-portability-missing-external-project');
    const report = await runExternalSkillPortability({ canaryRoot: missingExternalProject });

    expect(report).toMatchObject({
      result: 'fail',
      failure: {
        category: 'external-project',
        stage: 'read-live-canary-status-before',
        project: 'external',
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
  if (process.env.SKOPOS_RELEASE_TARBALL) {
    return resolve(process.env.SKOPOS_RELEASE_TARBALL);
  }
  const pnpm = resolvePnpmInvocation();
  const output = execFileSync(
    pnpm.command,
    [...pnpm.argsPrefix, 'pack', '--pack-destination', packDirectory],
    {
      cwd: cliPackageRoot,
      encoding: 'utf8',
    },
  );
  const path = output
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.endsWith('.tgz'));
  if (!path) throw new Error(`Packed CLI tarball was not reported:\n${output}`);
  return isAbsolute(path) ? path : join(workspaceRoot, path);
};

const packedScopeRegistry = [
  'schemaVersion: 1',
  'scopes:',
  '  - id: workspace',
  '    title: Release Smoke Workspace',
  '    kind: workspace',
  '    path: .',
  '    memoryRoot: docs',
  '    codeRoots: [.]',
  '    parent: null',
  '    profile: fixture.workspace',
  '    dependsOn: []',
  '    owners: [fixture]',
  '    aliases: [skopos-release-smoke]',
  '  - id: storefront',
  '    title: Storefront',
  '    kind: application',
  '    path: apps/storefront',
  '    memoryRoot: docs/scopes/storefront',
  '    codeRoots: [apps/storefront]',
  '    parent: workspace',
  '    profile: fixture.application',
  '    dependsOn: [shared]',
  '    owners: [fixture]',
  '    aliases: [storefront-app]',
  '  - id: shared',
  '    title: Shared',
  '    kind: package',
  '    path: packages/shared',
  '    memoryRoot: docs/scopes/shared',
  '    codeRoots: [packages/shared]',
  '    parent: workspace',
  '    profile: fixture.package',
  '    dependsOn: []',
  '    owners: [fixture]',
  '    aliases: [shared-package]',
  '',
].join('\n');

const packedStorefrontMemory = [
  '---',
  'title: Storefront Memory',
  'status: active',
  'owner: fixture',
  'id: STOREFRONT-MEMORY',
  'scope: storefront',
  'role: router',
  'lifecycle: durable',
  'authority: canonical',
  'provenance: declared',
  'view: current',
  'lastUpdated: 2026-08-11',
  '---',
  '',
  '# Storefront Memory',
  '',
  'Packed Scope fixture.',
  '',
].join('\n');

const packedSharedMemory = packedStorefrontMemory
  .replaceAll('Storefront', 'Shared')
  .replaceAll('STOREFRONT', 'SHARED')
  .replace('scope: storefront', 'scope: shared');

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
      files.push(normalizePortablePath(absolutePath.slice(root.length + 1)));
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
): string => {
  const pnpm = resolvePnpmInvocation();
  return execFileSync(
    pnpm.command,
    [...pnpm.argsPrefix, 'exec', 'skopos', ...args],
    {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, ...environment },
    },
  );
};

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

const PACKED_ACTION_FIXTURE_SOURCE = `const { writeFileSync } = require('node:fs');
const { join } = require('node:path');

const mode = process.argv[2];

if (mode === 'artifact') {
  const artifactRoot = process.env.SKOPOS_ARTIFACT_ROOT;
  if (!artifactRoot) throw new Error('SKOPOS_ARTIFACT_ROOT is required.');
  writeFileSync(
    join(artifactRoot, 'proof.json'),
    JSON.stringify({ root: artifactRoot }),
  );
} else if (mode === 'external') {
  const receiptPath = process.env.SKOPOS_EXTERNAL_EFFECT_RECEIPT_PATH;
  if (!receiptPath) {
    throw new Error('SKOPOS_EXTERNAL_EFFECT_RECEIPT_PATH is required.');
  }
  writeFileSync(
    receiptPath,
    JSON.stringify({
      schemaVersion: 1,
      service: 'packed-remote',
      operation: 'packed.create',
      status: 'succeeded',
      providerRequestId: 'packed-request-1',
      occurredAt: new Date().toISOString(),
    }),
  );
} else if (mode === 'noop') {
  process.exitCode = 0;
} else if (mode === 'mutation') {
  writeFileSync('undeclared.txt', 'changed');
} else {
  throw new Error(\`Unknown packed Action fixture mode: \${mode ?? '<missing>'}\`);
}
`;

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
