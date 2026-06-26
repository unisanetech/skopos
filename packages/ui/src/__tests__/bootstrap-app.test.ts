import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import { buildSkoposUiConsoleApp } from '../application/build-console-app/build-console-app.service.js';

const tempDirs: string[] = [];

describe('bootstrapSkoposUiApp', () => {
  afterEach(async () => {
    vi.resetModules();
    await Promise.all(
      tempDirs.splice(0).map((directory) =>
        rm(directory, {
          recursive: true,
          force: true,
        }),
      ),
    );
  }, 30_000);

  it('renders the routed overview after router startup instead of leaving the root blank', async () => {
    const workspaceRoot = await createConsoleWorkspace();
    const buildResult = await buildSkoposUiConsoleApp({
      cwd: workspaceRoot,
    });

    const dom = new JSDOM(
      '<!doctype html><html><body><div id="root"></div><script id="skopos-ui-state" type="application/json"></script></body></html>',
      {
        url: 'http://127.0.0.1:4173/',
      },
    );

    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;
    const previousHistory = globalThis.history;
    const previousLocation = globalThis.location;
    const previousSelf = globalThis.self;
    const previousNavigator = globalThis.navigator;

    globalThis.window = dom.window as typeof globalThis.window;
    globalThis.document = dom.window.document as typeof globalThis.document;
    globalThis.history = dom.window.history as typeof globalThis.history;
    globalThis.location = dom.window.location as typeof globalThis.location;
    globalThis.self = dom.window as typeof globalThis.self;
    Object.defineProperty(globalThis, 'navigator', {
      value: dom.window.navigator,
      configurable: true,
    });

    try {
      dom.window.scrollTo = () => undefined;
      document.getElementById('skopos-ui-state')!.textContent = await readFile(
        buildResult.statePath,
        'utf8',
      );

      const { bootstrapSkoposUiApp } = await import('../app/bootstrap.tsx');
      const root = await bootstrapSkoposUiApp(document.getElementById('root')!);
      await vi.waitFor(() => {
        expect(document.getElementById('root')!.innerHTML).toContain('Current Work');
      }, { timeout: 10_000 });

      expect(document.getElementById('root')!.innerHTML).toContain('Current Work');
      expect(document.getElementById('root')!.innerHTML).toContain('Current focus');
      expect(document.getElementById('root')!.innerHTML).toContain(
        'Search docs, scopes, missions, plans...',
      );
      expect(window.location.hash).toBe('#/overview');

      root.unmount();
      await settleBrowserWork(dom);
    } finally {
      dom.window.close();
      globalThis.window = previousWindow;
      globalThis.document = previousDocument;
      globalThis.history = previousHistory;
      globalThis.location = previousLocation;
      globalThis.self = previousSelf;
      Object.defineProperty(globalThis, 'navigator', {
        value: previousNavigator,
        configurable: true,
      });
    }
  }, 120_000);

  it('loads console state from the dev endpoint when inline state is not injected', async () => {
    const workspaceRoot = await createConsoleWorkspace();
    const buildResult = await buildSkoposUiConsoleApp({
      cwd: workspaceRoot,
    });

    const dom = new JSDOM(
      '<!doctype html><html><body><div id="root"></div><script id="skopos-ui-state" type="application/json">__SKOPOS_UI_STATE__</script></body></html>',
      {
        url: 'http://127.0.0.1:4173/',
      },
    );

    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;
    const previousHistory = globalThis.history;
    const previousLocation = globalThis.location;
    const previousSelf = globalThis.self;
    const previousNavigator = globalThis.navigator;
    const previousFetch = globalThis.fetch;

    globalThis.window = dom.window as typeof globalThis.window;
    globalThis.document = dom.window.document as typeof globalThis.document;
    globalThis.history = dom.window.history as typeof globalThis.history;
    globalThis.location = dom.window.location as typeof globalThis.location;
    globalThis.self = dom.window as typeof globalThis.self;
    Object.defineProperty(globalThis, 'navigator', {
      value: dom.window.navigator,
      configurable: true,
    });

    try {
      dom.window.scrollTo = () => undefined;
      globalThis.fetch = vi.fn(async (input: string | URL | Request) => {
        expect(String(input)).toContain('/__skopos/ui-state');
        return new Response(await readFile(buildResult.statePath, 'utf8'), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        });
      }) as typeof fetch;

      const { bootstrapSkoposUiApp } = await import('../app/bootstrap.tsx');
      const root = await bootstrapSkoposUiApp(document.getElementById('root')!);
      await vi.waitFor(() => {
        expect(document.getElementById('root')!.innerHTML).toContain('Current Work');
      }, { timeout: 10_000 });

      expect(document.getElementById('root')!.innerHTML).toContain('Current Work');
      expect(document.getElementById('root')!.innerHTML).toContain(
        'Search docs, scopes, missions, plans...',
      );
      expect(window.location.hash).toBe('#/overview');

      root.unmount();
      await settleBrowserWork(dom);
    } finally {
      dom.window.close();
      globalThis.window = previousWindow;
      globalThis.document = previousDocument;
      globalThis.history = previousHistory;
      globalThis.location = previousLocation;
      globalThis.self = previousSelf;
      globalThis.fetch = previousFetch;
      Object.defineProperty(globalThis, 'navigator', {
        value: previousNavigator,
        configurable: true,
      });
    }
  }, 120_000);

  it('renders the routed discussion page when the hash already targets /discussion', async () => {
    const workspaceRoot = await createConsoleWorkspace();
    const buildResult = await buildSkoposUiConsoleApp({
      cwd: workspaceRoot,
    });

    const dom = new JSDOM(
      '<!doctype html><html><body><div id="root"></div><script id="skopos-ui-state" type="application/json"></script></body></html>',
      {
        url: 'http://127.0.0.1:4173/#/discussion',
      },
    );

    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;
    const previousHistory = globalThis.history;
    const previousLocation = globalThis.location;
    const previousSelf = globalThis.self;
    const previousNavigator = globalThis.navigator;

    globalThis.window = dom.window as typeof globalThis.window;
    globalThis.document = dom.window.document as typeof globalThis.document;
    globalThis.history = dom.window.history as typeof globalThis.history;
    globalThis.location = dom.window.location as typeof globalThis.location;
    globalThis.self = dom.window as typeof globalThis.self;
    Object.defineProperty(globalThis, 'navigator', {
      value: dom.window.navigator,
      configurable: true,
    });

    try {
      dom.window.scrollTo = () => undefined;
      document.getElementById('skopos-ui-state')!.textContent = await readFile(
        buildResult.statePath,
        'utf8',
      );

      const { bootstrapSkoposUiApp } = await import('../app/bootstrap.tsx');
      const root = await bootstrapSkoposUiApp(document.getElementById('root')!);
      await vi.waitFor(() => {
        expect(document.getElementById('root')!.innerHTML).toContain('What did we agree in chat?');
      }, { timeout: 10_000 });

      expect(document.getElementById('root')!.innerHTML).toContain('Saved discussion context');
      expect(window.location.hash).toBe('#/discussion');

      root.unmount();
      await settleBrowserWork(dom);
    } finally {
      dom.window.close();
      globalThis.window = previousWindow;
      globalThis.document = previousDocument;
      globalThis.history = previousHistory;
      globalThis.location = previousLocation;
      globalThis.self = previousSelf;
      Object.defineProperty(globalThis, 'navigator', {
        value: previousNavigator,
        configurable: true,
      });
    }
  }, 120_000);

  it('renders the routed rules page when the hash already targets /rules', async () => {
    const workspaceRoot = await createConsoleWorkspace();
    const buildResult = await buildSkoposUiConsoleApp({
      cwd: workspaceRoot,
    });

    const dom = new JSDOM(
      '<!doctype html><html><body><div id="root"></div><script id="skopos-ui-state" type="application/json"></script></body></html>',
      {
        url: 'http://127.0.0.1:4173/#/rules',
      },
    );

    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;
    const previousHistory = globalThis.history;
    const previousLocation = globalThis.location;
    const previousSelf = globalThis.self;
    const previousNavigator = globalThis.navigator;

    globalThis.window = dom.window as typeof globalThis.window;
    globalThis.document = dom.window.document as typeof globalThis.document;
    globalThis.history = dom.window.history as typeof globalThis.history;
    globalThis.location = dom.window.location as typeof globalThis.location;
    globalThis.self = dom.window as typeof globalThis.self;
    Object.defineProperty(globalThis, 'navigator', {
      value: dom.window.navigator,
      configurable: true,
    });

    try {
      dom.window.scrollTo = () => undefined;
      document.getElementById('skopos-ui-state')!.textContent = await readFile(
        buildResult.statePath,
        'utf8',
      );

      const { bootstrapSkoposUiApp } = await import('../app/bootstrap.tsx');
      const root = await bootstrapSkoposUiApp(document.getElementById('root')!);
      await vi.waitFor(() => {
        expect(document.getElementById('root')!.innerHTML).toContain('Which project rules are active?');
      }, { timeout: 10_000 });

      expect(document.getElementById('root')!.innerHTML).toContain('Accepted rule packs');
      expect(document.getElementById('root')!.innerHTML).toContain('Mid-App Architecture');
      expect(document.getElementById('root')!.innerHTML).toContain('Open details');
      expect(window.location.hash).toBe('#/rules');

      root.unmount();
      await settleBrowserWork(dom);
    } finally {
      dom.window.close();
      globalThis.window = previousWindow;
      globalThis.document = previousDocument;
      globalThis.history = previousHistory;
      globalThis.location = previousLocation;
      globalThis.self = previousSelf;
      Object.defineProperty(globalThis, 'navigator', {
        value: previousNavigator,
        configurable: true,
      });
    }
  }, 120_000);

  it('renders an individual policy pack detail page with structure guidance', async () => {
    const workspaceRoot = await createConsoleWorkspace();
    const buildResult = await buildSkoposUiConsoleApp({
      cwd: workspaceRoot,
    });

    const dom = new JSDOM(
      '<!doctype html><html><body><div id="root"></div><script id="skopos-ui-state" type="application/json"></script></body></html>',
      {
        url: 'http://127.0.0.1:4173/#/rules/packs/architecture.mid-app',
      },
    );

    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;
    const previousHistory = globalThis.history;
    const previousLocation = globalThis.location;
    const previousSelf = globalThis.self;
    const previousNavigator = globalThis.navigator;

    globalThis.window = dom.window as typeof globalThis.window;
    globalThis.document = dom.window.document as typeof globalThis.document;
    globalThis.history = dom.window.history as typeof globalThis.history;
    globalThis.location = dom.window.location as typeof globalThis.location;
    globalThis.self = dom.window as typeof globalThis.self;
    Object.defineProperty(globalThis, 'navigator', {
      value: dom.window.navigator,
      configurable: true,
    });

    try {
      dom.window.scrollTo = () => undefined;
      document.getElementById('skopos-ui-state')!.textContent = await readFile(
        buildResult.statePath,
        'utf8',
      );

      const { bootstrapSkoposUiApp } = await import('../app/bootstrap.tsx');
      const root = await bootstrapSkoposUiApp(document.getElementById('root')!);
      await vi.waitFor(() => {
        expect(document.getElementById('root')!.innerHTML).toContain('Mid-App Architecture');
      }, { timeout: 10_000 });

      expect(document.getElementById('root')!.innerHTML).toContain('Structure tree and role mapping');
      expect(document.getElementById('root')!.innerHTML).toContain('Saved local mapping');
      expect(document.getElementById('root')!.innerHTML).toContain('.skopos/policies/role-mapping.json');
      expect(document.getElementById('root')!.innerHTML).toContain('Saved local role mapping');
      expect(document.getElementById('root')!.innerHTML).toContain('Role mapping decisions');
      expect(document.getElementById('root')!.innerHTML).toContain('Confirmed and ignored rows are saved project decisions');
      expect(document.getElementById('root')!.innerHTML).toContain('Decision state');
      expect(document.getElementById('root')!.innerHTML).toContain('Matched local paths');
      expect(document.getElementById('root')!.innerHTML).toContain('Mapped roles');
      expect(document.getElementById('root')!.innerHTML).toContain('Make this explicit');
      expect(document.getElementById('root')!.innerHTML).toContain('Copy');
      expect(document.getElementById('root')!.innerHTML).toContain('skopos policies mappings confirm');
      expect(document.getElementById('root')!.innerHTML).toContain('skopos policies mappings ignore');
      expect(document.getElementById('root')!.innerHTML).toContain('Architecture contract');
      expect(document.getElementById('root')!.innerHTML).toContain('features / modules / domains');
      expect(document.getElementById('root')!.innerHTML).toContain('src/use-cases');
      expect(document.getElementById('root')!.innerHTML).toContain('src/gateways');
      expect(document.getElementById('root')!.innerHTML).toContain('Found in this project');
      expect(document.getElementById('root')!.innerHTML).toContain('Matched aliases');
      expect(document.getElementById('root')!.innerHTML).toContain('Dependency direction');
      expect(document.getElementById('root')!.innerHTML).toContain('Before editing');
      expect(window.location.hash).toBe('#/rules/packs/architecture.mid-app');

      root.unmount();
      await settleBrowserWork(dom);
    } finally {
      dom.window.close();
      globalThis.window = previousWindow;
      globalThis.document = previousDocument;
      globalThis.history = previousHistory;
      globalThis.location = previousLocation;
      globalThis.self = previousSelf;
      Object.defineProperty(globalThis, 'navigator', {
        value: previousNavigator,
        configurable: true,
      });
    }
  }, 120_000);

  it('binds custom dev-state events to the refresh callback', async () => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
      url: 'http://127.0.0.1:4173/',
    });
    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;
    const previousHistory = globalThis.history;
    const previousLocation = globalThis.location;
    const previousSelf = globalThis.self;
    const previousNavigator = globalThis.navigator;

    globalThis.window = dom.window as typeof globalThis.window;
    globalThis.document = dom.window.document as typeof globalThis.document;
    globalThis.history = dom.window.history as typeof globalThis.history;
    globalThis.location = dom.window.location as typeof globalThis.location;
    globalThis.self = dom.window as typeof globalThis.self;
    Object.defineProperty(globalThis, 'navigator', {
      value: dom.window.navigator,
      configurable: true,
    });

    try {
      const { bindSkoposUiDevStateUpdates } = await import('../app/bootstrap.tsx');
      const handlers = new Map<string, () => void>();
      const onRefresh = vi.fn().mockResolvedValue(undefined);
      const hot = {
        on: vi.fn((event: string, handler: () => void) => {
          handlers.set(event, handler);
        }),
        off: vi.fn((event: string) => {
          handlers.delete(event);
        }),
      };

      const dispose = bindSkoposUiDevStateUpdates(hot, onRefresh);
      const handler = handlers.get('skopos:state-updated');
      expect(handler).toBeTypeOf('function');

      handler?.();
      await vi.waitFor(() => {
        expect(onRefresh).toHaveBeenCalledTimes(1);
      });

      dispose?.();
      expect(hot.off).toHaveBeenCalledWith('skopos:state-updated', expect.any(Function));
    } finally {
      dom.window.close();
      globalThis.window = previousWindow;
      globalThis.document = previousDocument;
      globalThis.history = previousHistory;
      globalThis.location = previousLocation;
      globalThis.self = previousSelf;
      Object.defineProperty(globalThis, 'navigator', {
        value: previousNavigator,
        configurable: true,
      });
    }
  });
});

const settleBrowserWork = async (dom: JSDOM): Promise<void> => {
  await new Promise<void>((resolve) => {
    dom.window.setTimeout(() => resolve(), 20);
  });
};

const createConsoleWorkspace = async (): Promise<string> => {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-ui-bootstrap-'));
  tempDirs.push(workspaceRoot);

  await mkdir(join(workspaceRoot, '.skopos', 'graph'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'plans'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'missions'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'runs'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'proof'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'policies'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'drift'), { recursive: true });
  await mkdir(join(workspaceRoot, 'policy-packs', 'architecture', 'mid-app'), { recursive: true });
  await mkdir(join(workspaceRoot, 'src', 'routes'), { recursive: true });
  await mkdir(join(workspaceRoot, 'src', 'use-cases'), { recursive: true });
  await mkdir(join(workspaceRoot, 'src', 'gateways'), { recursive: true });
  await mkdir(join(workspaceRoot, 'src', 'presenters'), { recursive: true });
  await mkdir(join(workspaceRoot, 'docs', 'generated', 'skopos'), { recursive: true });
  await mkdir(join(workspaceRoot, '.cursor', 'rules'), { recursive: true });
  await mkdir(join(workspaceRoot, '.github'), { recursive: true });

  await writeFile(join(workspaceRoot, 'docs', '00-start-here.md'), '# Start here\n', 'utf8');
  await writeFile(join(workspaceRoot, 'docs', 'test-doc.md'), '# Test doc\n', 'utf8');
  await writeFile(join(workspaceRoot, 'AGENTS.md'), '# Agent rules\n', 'utf8');
  await writeFile(join(workspaceRoot, 'CLAUDE.md'), '# Agent rules\n', 'utf8');
  await writeFile(join(workspaceRoot, '.cursor', 'rules', 'project.mdc'), '# Agent rules\n', 'utf8');
  await writeFile(join(workspaceRoot, '.github', 'copilot-instructions.md'), '# Agent rules\n', 'utf8');
  await writeFile(
    join(workspaceRoot, 'skopos.config.yaml'),
    `schemaVersion: 1
project:
  name: skopos-ui-fixture
  archetype: monorepo-platform
  repoMode: monorepo
  scopeStrategy: hybrid
commands:
  dev: pnpm dev
  build: pnpm build
  test: pnpm test
workspace:
  ignore: []
docs:
  root: docs
  usePerDomainArchive: true
  strictMetadata: true
  strictLinking: true
agents:
  canonicalInstructions: AGENTS.md
  syncMirrors:
    - CLAUDE.md
    - .cursor/rules/project.mdc
    - .github/copilot-instructions.md
  mcp: true
trust:
  mode: balanced
  requireDocsSync: true
  requireProofForDone: true
decisions:
  mode: balanced
  askFor:
    - public-api-change
security:
  privacyMode: local-only
  redactSecrets: true
`,
    'utf8',
  );

  await writeJson(workspaceRoot, '.skopos/bootstrap.json', {
    schemaVersion: 1,
    id: 'bootstrap',
    type: 'bootstrap',
    status: 'generated',
    authority: 'generated',
    summary: 'Bootstrap scan and recommended starter config for the current workspace.',
    updatedAt: '2026-04-10T00:00:00.000Z',
    generatedAt: '2026-04-10T00:00:00.000Z',
    workspaceRoot,
    mode: 'existing',
    detected: {
      hasRootPackageJson: true,
      hasPnpmWorkspace: false,
      ignoredPaths: [],
      docsRoots: ['docs'],
      docsHealth: {
        root: 'docs',
        hasStartHere: true,
        markdownFileCount: 2,
        freshnessTrackedCount: 0,
        staleDocPaths: [],
      },
      appliedOverrides: [],
      sourceDependencies: [],
      instructionFiles: ['AGENTS.md'],
      packageCount: 1,
      workspacePackageCount: 1,
      languages: ['typescript'],
      frameworks: ['react'],
      commands: {
        dev: 'pnpm dev',
        build: 'pnpm build',
        test: 'pnpm test',
      },
      findings: [],
      confidence: 'high',
      repoMode: 'monorepo',
      archetypeSuggestion: 'monorepo-platform',
    },
    recommendedNextSteps: [],
    recommendedQuestions: [],
  });
  await writeJson(workspaceRoot, '.skopos/diagnosis.json', {
    schemaVersion: 1,
    id: 'diagnosis',
    type: 'diagnosis',
    status: 'generated',
    authority: 'generated',
    summary: 'Detected repo patterns are stable enough for normal agent use.',
    updatedAt: '2026-04-10T00:00:00.000Z',
    generatedAt: '2026-04-10T00:00:00.000Z',
    workspaceRoot,
    repoMode: 'monorepo',
    archetypeSuggestion: 'monorepo-platform',
    confidence: 'high',
    packageCount: 1,
    workspacePackageCount: 1,
    health: 'healthy',
    findings: [],
  });
  await writeJson(workspaceRoot, '.skopos/architecture.json', {
    schemaVersion: 1,
    id: 'architecture',
    type: 'architecture',
    status: 'generated',
    authority: 'generated',
    summary: 'Current architecture aligns with the recommended monorepo shape.',
    updatedAt: '2026-04-10T00:00:00.000Z',
    generatedAt: '2026-04-10T00:00:00.000Z',
    workspaceRoot,
    repoMode: 'monorepo',
    archetypeSuggestion: 'monorepo-platform',
    alignmentStatus: 'aligned',
    current: {
      topology: 'web-monorepo',
      boundaryQuality: 'clear',
      summary: 'The repo reads as a web-monorepo.',
      units: [],
    },
    recommended: {
      topology: 'web-monorepo',
      summary: 'Stay on the current monorepo shape.',
      reasons: [],
      unresolvedDecisions: [],
    },
  });
  await writeJson(workspaceRoot, '.skopos/scopes-lite.json', {
    schemaVersion: 1,
    id: 'scopes-lite',
    type: 'scopes-lite',
    status: 'generated',
    authority: 'generated',
    updatedAt: '2026-04-10T00:00:00.000Z',
    generatedAt: '2026-04-10T00:00:00.000Z',
    workspaceRoot,
    scopes: [
      {
        id: '@skopos/ui',
        kind: 'package',
        title: '@skopos/ui',
        path: 'packages/ui',
        aliases: ['ui'],
        summary: 'UI package',
        confidence: 'high',
      },
      {
        id: 'workspace',
        kind: 'workspace',
        title: 'skopos-ui-fixture',
        path: '.',
        aliases: ['root'],
        summary: 'Workspace root',
        confidence: 'high',
      },
    ],
  });
  await writeJson(workspaceRoot, '.skopos/index.json', {
    schemaVersion: 1,
    id: 'index',
    type: 'index',
    status: 'generated',
    authority: 'generated',
    updatedAt: '2026-04-10T00:00:00.000Z',
    generatedAt: '2026-04-10T00:00:00.000Z',
    workspaceRoot,
    docsRoot: 'docs',
    readiness: 'agent-ready',
    trustLevel: 'high',
    counts: {
      packageCount: 1,
      workspacePackageCount: 1,
      scopeCount: 2,
      graphCount: 0,
      planCount: 1,
      missionCount: 1,
      workflowRunCount: 1,
      workflowManifestCount: 0,
      overrideEntryCount: 0,
    },
    quickLinks: {
      configPath: 'skopos.config.yaml',
      bootstrapPath: '.skopos/bootstrap.json',
      docsStartHerePath: 'docs/00-start-here.md',
      logPath: '.skopos/log.jsonl',
    },
    latestEvent: {
      id: 'trust-1',
      eventKind: 'trust',
      status: 'succeeded',
      timestamp: '2026-04-10T00:00:00.000Z',
      summary: 'Trust refreshed.',
    },
    entries: [
      {
        id: 'docs-start',
        kind: 'doc-router',
        title: 'Docs start',
        summary: 'Docs entrypoint',
        path: 'docs/00-start-here.md',
        updatedAt: '2026-04-10T00:00:00.000Z',
      },
    ],
  });
  await writeJson(workspaceRoot, '.skopos/proof/latest-report.json', {
    schemaVersion: 1,
    id: 'proof-latest-report',
    type: 'proof-report',
    status: 'generated',
    authority: 'generated',
    updatedAt: '2026-04-10T00:00:00.000Z',
    generatedAt: '2026-04-10T00:00:00.000Z',
    workspaceRoot,
    scorecard: {
      status: 'pass',
      benchmarkCount: 1,
      passedBenchmarks: 1,
      failedBenchmarks: 0,
      weightedPassRate: 1,
      categorySummaries: [],
    },
    comparison: {
      status: 'pass',
      summary: 'Stable.',
    },
  });
  await writeJson(workspaceRoot, '.skopos/policies/resolved.json', {
    schemaVersion: 1,
    id: 'resolved-policy',
    type: 'resolved-policy',
    status: 'generated',
    authority: 'generated',
    summary: 'Accepted policy resolves 1 pack with 1 active rule.',
    updatedAt: '2026-04-10T00:00:00.000Z',
    generatedAt: '2026-04-10T00:00:00.000Z',
    workspaceRoot,
    projectLifecycle: 'established-brownfield',
    defaultExecutionLane: 'normal',
    recommendedExecutionLanes: [
      {
        lane: 'normal',
        summary: 'Use for ordinary feature and maintenance work.',
        triggers: ['bounded feature work'],
        defaultGates: ['typecheck'],
      },
    ],
    acceptedPacks: [
      {
        packId: 'architecture.mid-app',
        version: '0.1.0',
        acceptedAt: '2026-04-10T00:00:00.000Z',
        acceptedBy: 'agent-ui',
        reason: 'Use readable architecture rules for the UI fixture.',
        source: 'manual',
      },
    ],
    overrides: [],
    activeRules: [
      {
        id: 'architecture.mid-app.feature-owns-product-behavior',
        title: 'Feature owns product behavior',
        severity: 'must',
        summary: 'A feature should own its user workflow and local UI.',
        appliesTo: ['features', 'screens'],
      },
    ],
    sourcePaths: ['policy-packs/architecture/mid-app/pack.json'],
    generatedDocPaths: [],
  });
  await writeJson(workspaceRoot, '.skopos/policies/recommendations.json', {
    schemaVersion: 1,
    id: 'policy-recommendations',
    type: 'policy-recommendations',
    status: 'generated',
    authority: 'generated',
    summary: '1 policy recommendation is available.',
    updatedAt: '2026-04-10T00:00:00.000Z',
    generatedAt: '2026-04-10T00:00:00.000Z',
    workspaceRoot,
    projectLifecycle: 'established-brownfield',
    defaultExecutionLane: 'normal',
    recommendedExecutionLanes: [],
    recommendations: [
      {
        packId: 'architecture.mid-app',
        version: '0.1.0',
        family: 'architecture',
        variant: 'mid-app',
        displayName: 'Mid-App Architecture',
        confidence: 'high',
        recommendation: 'apply',
        reason: 'The fixture behaves like a mid-sized app.',
        plainLanguageSummary: 'Keep app wiring, feature code, and shared utilities easy to understand.',
        accepted: true,
        signals: [],
        antiSignals: [],
        sourcePath: 'policy-packs/architecture/mid-app/pack.json',
      },
    ],
  });
  await writeJson(workspaceRoot, '.skopos/policies/role-mapping.json', {
    schemaVersion: 1,
    id: 'policy-role-mapping',
    type: 'policy-role-mapping',
    status: 'generated',
    authority: 'generated',
    summary: 'Mapped accepted policy roles to local project paths.',
    updatedAt: '2026-04-10T00:00:00.000Z',
    generatedAt: '2026-04-10T00:00:00.000Z',
    workspaceRoot,
    resolvedPolicyPath: '.skopos/policies/resolved.json',
    mappings: [
      {
        packId: 'architecture.mid-app',
        sourcePath: 'policy-packs/architecture/mid-app/pack.json',
        role: 'features / modules / domains',
        label: 'Product features',
        required: true,
        status: 'inferred',
        confidence: 'high',
        checkedAliases: ['src/features', 'src/use-cases'],
        matchedAliases: ['src/use-cases'],
        matchedPaths: ['src/use-cases'],
        reason: 'Matched Product features through 1 local alias.',
      },
    ],
  });
  await writeJson(workspaceRoot, 'policy-packs/architecture/mid-app/pack.json', {
    schemaVersion: 1,
    id: 'policy-pack.architecture.mid-app',
    type: 'policy-pack',
    status: 'active',
    authority: 'canonical',
    summary: 'Architecture policy for mid-sized product apps.',
    updatedAt: '2026-04-10T00:00:00.000Z',
    packId: 'architecture.mid-app',
    family: 'architecture',
    variant: 'mid-app',
    version: '0.1.0',
    displayName: 'Mid-App Architecture',
    description: 'Architecture guidance for projects with several features and shared runtime boundaries.',
    plainLanguageSummary: 'Keep app wiring, feature code, and shared utilities easy to understand.',
    bestFor: ['Several feature areas', 'Shared API or runtime code'],
    notFor: ['One-off scripts'],
    userQuestions: ['Where does each feature own behavior, UI, and tests?'],
    qualityBar: ['Agents can explain what to do differently before editing code.'],
    agentUse: ['Check the folder tree before moving feature code.'],
    structureTree: {
      title: 'Mid-app structure tree',
      summary: 'A clear app shape for runtime wiring, product behavior, infrastructure, and UI roles. These are roles, not required folder names.',
      rootLabel: 'source root',
      nodes: [
        {
          path: 'app / composition root',
          label: 'App shell and composition root',
          responsibility: 'Owns route setup and dependency assembly.',
          required: true,
          matchPaths: ['src/app', 'src/routes'],
        },
        {
          path: 'features / modules / domains',
          label: 'Product features',
          responsibility: 'Owns user workflows and local UI.',
          required: true,
          matchPaths: ['src/features', 'src/use-cases'],
        },
        {
          path: 'infrastructure / adapters',
          label: 'Infrastructure and adapters',
          responsibility: 'Owns external service and vendor boundaries.',
          required: true,
          matchPaths: ['src/infrastructure', 'src/gateways'],
        },
        {
          path: 'ui / components / design system',
          label: 'Reusable UI primitives',
          responsibility: 'Owns reusable UI and presentation primitives.',
          required: false,
          matchPaths: ['src/ui', 'src/presenters'],
        },
      ],
    },
    recommendedLayers: ['composition-root', 'features', 'application', 'domain', 'infrastructure', 'shared'],
    dependencyDirection: {
      'composition-root': { mayImport: ['features', 'infrastructure', 'shared'] },
      features: { mayImport: ['application', 'domain', 'infrastructure', 'shared'] },
      infrastructure: { mayImport: ['application', 'domain', 'shared'] },
      shared: { mayImport: [] },
    },
    forbiddenImports: [
      {
        from: 'domain',
        to: ['composition-root', 'infrastructure', 'ui'],
      },
    ],
    gates: {
      required: ['pnpm typecheck'],
      recommended: ['pnpm test', 'pnpm build'],
    },
    agentPrompts: {
      beforeEditing: ['Identify the current architecture layers before adding files.'],
      beforeDone: ['Confirm no second pattern was introduced.'],
    },
    projectLifecycles: ['established-brownfield'],
    appliesWhen: [
      {
        id: 'signal.multiple-product-features',
        summary: 'The project has several feature areas.',
        confidence: 'high',
        evidence: ['Multiple feature, route, or domain directories'],
      },
    ],
    avoidWhen: [],
    rules: [
      {
        id: 'architecture.mid-app.feature-owns-product-behavior',
        title: 'Feature owns product behavior',
        severity: 'must',
        summary: 'A feature should own its user workflow and local UI.',
        appliesTo: ['features', 'screens'],
      },
    ],
    requiredDocs: [],
    generatedArtifacts: ['.skopos/policies/resolved.json'],
    driftCheckIds: ['architecture.mid-app.business-logic-in-shared-helper'],
    proofFixtureIds: ['architecture.mid-app.good-feature-boundary'],
  });
  await writeJson(workspaceRoot, '.skopos/drift/report.json', {
    schemaVersion: 1,
    id: 'drift-report',
    type: 'drift-report',
    status: 'generated',
    authority: 'generated',
    summary: 'No open accepted-policy drift was detected.',
    updatedAt: '2026-04-10T00:00:00.000Z',
    generatedAt: '2026-04-10T00:00:00.000Z',
    workspaceRoot,
    resolvedPolicyPath: '.skopos/policies/resolved.json',
    counts: {
      openMustCount: 0,
      openShouldCount: 0,
      advisoryCount: 0,
      suppressedCount: 0,
      resolvedCount: 0,
    },
    findings: [],
  });
  await writeJson(workspaceRoot, '.skopos/plans/plan-ui.json', {
    schemaVersion: 1,
    id: 'plan-ui',
    type: 'plan',
    status: 'generated',
    authority: 'generated',
    updatedAt: '2026-04-10T00:10:00.000Z',
    generatedAt: '2026-04-10T00:10:00.000Z',
    workspaceRoot,
    goal: 'Build the routed console',
    title: 'Build the routed console',
    summary: 'Plan summary',
    scope: {
      query: '@skopos/ui',
      matchedBy: 'id',
      scope: {
        id: '@skopos/ui',
        kind: 'package',
        title: '@skopos/ui',
        path: 'packages/ui',
        aliases: ['ui'],
        summary: 'UI package',
        confidence: 'high',
      },
    },
    confidence: 'high',
    references: [],
    implementationSteps: [],
    recommendedChecks: ['pnpm typecheck'],
    recommendedWorkflows: [],
    decisionQuestions: [],
    risks: [],
    nextSteps: [],
    missionId: 'mission-ui',
  });
  await writeJson(workspaceRoot, '.skopos/missions/mission-ui.json', {
    schemaVersion: 1,
    id: 'mission-ui',
    type: 'mission',
    status: 'generated',
    authority: 'generated',
    updatedAt: '2026-04-10T00:10:00.000Z',
    generatedAt: '2026-04-10T00:10:00.000Z',
    workspaceRoot,
    planId: 'plan-ui',
    summary: 'Mission summary',
    title: 'Mission: Build the routed console',
    objective: 'Build the routed console',
    state: 'active',
    scope: {
      query: '@skopos/ui',
      matchedBy: 'id',
      scope: {
        id: '@skopos/ui',
        kind: 'package',
        title: '@skopos/ui',
        path: 'packages/ui',
        aliases: ['ui'],
        summary: 'UI package',
        confidence: 'high',
      },
    },
    items: [
      {
        id: 'step-1',
        kind: 'implementation',
        title: 'Build routed shell',
        detail: 'Implement the routed shell.',
        status: 'pending',
      },
    ],
    recommendedChecks: ['pnpm typecheck'],
    recommendedWorkflowIds: ['graph.render-local-portal'],
    decisionQuestionIds: [],
    linkedSlices: [],
    coordination: {
      claimedBy: {
        actorId: 'agent-ui',
        claimedAt: '2026-04-10T00:10:00.000Z',
      },
      lastUpdatedBy: 'agent-ui',
      lastUpdatedAt: '2026-04-10T00:10:00.000Z',
    },
  });
  await writeJson(workspaceRoot, '.skopos/runs/run-ui.json', {
    schemaVersion: 1,
    id: 'run-ui',
    type: 'workflow-run',
    status: 'generated',
    authority: 'generated',
    updatedAt: '2026-04-10T00:12:00.000Z',
    generatedAt: '2026-04-10T00:12:00.000Z',
    workspaceRoot,
    workflowId: 'graph.render-local-portal',
    workflowTitle: 'Render local portal',
    runStatus: 'succeeded',
    outputPaths: ['docs/generated/skopos/index.html'],
    runByActorId: 'agent-ui',
    finishedAt: '2026-04-10T00:12:00.000Z',
  });

  return workspaceRoot;
};

const writeJson = async (
  workspaceRoot: string,
  relativePath: string,
  value: unknown,
): Promise<void> => {
  await writeFile(join(workspaceRoot, relativePath), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};
