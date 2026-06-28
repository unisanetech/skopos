import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { skoposUiDevStateUpdatedEvent } from '../contracts/skopos-ui-dev-channel.js';
import { devSkoposUiConsoleApp } from '../application/dev-console-app/dev-console-app.service.js';

const tempDirs: string[] = [];

describe('devSkoposUiConsoleApp', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    await Promise.all(
      tempDirs.splice(0).map((directory) =>
        rm(directory, {
          recursive: true,
          force: true,
        }),
      ),
    );
  });

  it('serves fetched console state and refreshes it when docs change', async () => {
    const workspaceRoot = await createConsoleWorkspace();
    const middlewares = new Map<string, Function>();
    const watchHandlers = new Map<string, (filePath: string) => void>();
    const addedPaths: string[] = [];
    let ignoredPaths: string[] = [];
    const wsMessages: Array<{ type: string; event?: string; data?: Record<string, string> }> = [];

    const fakeServer = {
      middlewares: {
        use(pathOrHandler: string | Function, handler?: Function) {
          if (typeof pathOrHandler === 'string' && handler) {
            middlewares.set(pathOrHandler, handler);
          }
        },
      },
      watcher: {
        add(paths: string | string[]) {
          const values = Array.isArray(paths) ? paths : [paths];
          addedPaths.push(...values);
        },
        on(eventName: string, handler: (filePath: string) => void) {
          watchHandlers.set(eventName, handler);
          return this;
        },
      },
      ws: {
        send(payload: { type: string; event?: string; data?: Record<string, string> }) {
          wsMessages.push(payload);
        },
      },
      config: {
        logger: {
          error: vi.fn(),
        },
      },
      resolvedUrls: {
        local: ['http://127.0.0.1:4173/'],
      },
      async listen() {
        return this;
      },
      async close() {
        return undefined;
      },
    };

    const result = await devSkoposUiConsoleApp({
      cwd: workspaceRoot,
      createViteDevServer: async (config) => {
        ignoredPaths = Array.isArray(config.server?.watch?.ignored)
          ? (config.server?.watch?.ignored as string[])
          : [];

        for (const plugin of config.plugins ?? []) {
          if (
            plugin &&
            typeof plugin === 'object' &&
            'configureServer' in plugin &&
            typeof plugin.configureServer === 'function'
          ) {
            plugin.configureServer(fakeServer as never);
          }
        }

        return fakeServer as never;
      },
    });

    try {
      expect(result.url).toBe('http://127.0.0.1:4173/');
      expect(result.stateEndpointPath).toBe('/__skopos/ui-state');
      expect(result.fileEndpointPath).toBe('/__skopos/file');
      expect(addedPaths).toEqual(
        expect.arrayContaining([
          join(workspaceRoot, 'docs', '**', '*.md'),
          join(workspaceRoot, '.skopos', 'plans', '*.json'),
          join(workspaceRoot, '.skopos', 'log.jsonl'),
        ]),
      );
      expect(addedPaths).not.toContain(join(workspaceRoot, 'docs'));
      expect(ignoredPaths).toEqual(
        expect.arrayContaining([
          join(workspaceRoot, 'docs', 'generated', 'skopos', 'app', '**'),
          join(workspaceRoot, '.skopos', 'tooling', '**'),
        ]),
      );

      const initialState = await requestJson(
        middlewares.get('/__skopos/ui-state')!,
        '/__skopos/ui-state',
      );
      expect(initialState.workspaceLabel).toContain('skopos-ui-dev-');
      expect(initialState.uiMode).toBe('live');
      expect(initialState.documents.some((document: { id: string }) => document.id === 'docs-start')).toBe(true);

      await writeFile(
        join(workspaceRoot, 'docs', '00-start-here.md'),
        '# Updated start\n\nThis route should refresh.\n',
        'utf8',
      );
      watchHandlers.get('change')?.(join(workspaceRoot, 'docs', '00-start-here.md'));

      const refreshedState = await waitForRefreshedState(
        middlewares.get('/__skopos/ui-state')!,
        (state) =>
          state.documents.some(
            (document: { id: string; excerpt: string }) =>
              document.id === 'docs-start' && document.excerpt.includes('Updated start'),
          ),
      );
      const updatedDocument = refreshedState.documents.find(
        (document: { id: string }) => document.id === 'docs-start',
      );
      expect(updatedDocument.excerpt).toContain('Updated start');
      expect(wsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'custom',
            event: skoposUiDevStateUpdatedEvent,
          }),
        ]),
      );

      const fileResponse = await requestText(
        middlewares.get('/__skopos/file')!,
        `/__skopos/file?path=${encodeURIComponent(join(workspaceRoot, 'docs', '00-start-here.md'))}`,
      );
      expect(fileResponse).toContain('Updated start');

      await mkdir(join(workspaceRoot, 'docs', 'generated', 'skopos', 'app'), { recursive: true });
      await writeFile(
        join(workspaceRoot, 'docs', 'generated', 'skopos', 'app', 'index.html'),
        '<!doctype html><title>generated</title>',
        'utf8',
      );
      const eventCountBeforeIgnoredChange = wsMessages.length;
      watchHandlers.get('change')?.(join(workspaceRoot, 'docs', 'generated', 'skopos', 'app', 'index.html'));
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(wsMessages.length).toBe(eventCountBeforeIgnoredChange);

      await mkdir(join(workspaceRoot, '.skopos', 'tooling', 'codex'), { recursive: true });
      await writeFile(
        join(workspaceRoot, '.skopos', 'tooling', 'codex', 'adapter-manifest.json'),
        '{"toolId":"codex"}',
        'utf8',
      );
      const eventCountBeforeToolingChange = wsMessages.length;
      watchHandlers.get('change')?.(
        join(workspaceRoot, '.skopos', 'tooling', 'codex', 'adapter-manifest.json'),
      );
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(wsMessages.length).toBe(eventCountBeforeToolingChange);
    } finally {
      await result.server.close();
    }
  }, 20_000);

  it('stays quiet during repeated generated-output and tooling churn', async () => {
    const workspaceRoot = await createConsoleWorkspace();
    const middlewares = new Map<string, Function>();
    const watchHandlers = new Map<string, (filePath: string) => void>();
    const wsMessages: Array<{ type: string; event?: string; data?: Record<string, string> }> = [];

    const fakeServer = {
      middlewares: {
        use(pathOrHandler: string | Function, handler?: Function) {
          if (typeof pathOrHandler === 'string' && handler) {
            middlewares.set(pathOrHandler, handler);
          }
        },
      },
      watcher: {
        add() {
          return undefined;
        },
        on(eventName: string, handler: (filePath: string) => void) {
          watchHandlers.set(eventName, handler);
          return this;
        },
      },
      ws: {
        send(payload: { type: string; event?: string; data?: Record<string, string> }) {
          wsMessages.push(payload);
        },
      },
      config: {
        logger: {
          error: vi.fn(),
        },
      },
      resolvedUrls: {
        local: ['http://127.0.0.1:4173/'],
      },
      async listen() {
        return this;
      },
      async close() {
        return undefined;
      },
    };

    const result = await devSkoposUiConsoleApp({
      cwd: workspaceRoot,
      createViteDevServer: async (config) => {
        expect(config.server?.watch?.ignored).toEqual(
          expect.arrayContaining([
            join(workspaceRoot, 'docs', 'generated', 'skopos', 'app', '**'),
            join(workspaceRoot, '.skopos', 'tooling', '**'),
          ]),
        );

        for (const plugin of config.plugins ?? []) {
          if (
            plugin &&
            typeof plugin === 'object' &&
            'configureServer' in plugin &&
            typeof plugin.configureServer === 'function'
          ) {
            plugin.configureServer(fakeServer as never);
          }
        }

        return fakeServer as never;
      },
    });

    try {
      await requestJson(middlewares.get('/__skopos/ui-state')!, '/__skopos/ui-state');

      await mkdir(join(workspaceRoot, 'docs', 'generated', 'skopos', 'app'), { recursive: true });
      await mkdir(join(workspaceRoot, '.skopos', 'tooling', 'codex'), { recursive: true });

      for (let index = 0; index < 25; index += 1) {
        const generatedPath = join(workspaceRoot, 'docs', 'generated', 'skopos', 'app', `chunk-${index}.json`);
        const toolingPath = join(workspaceRoot, '.skopos', 'tooling', 'codex', `adapter-${index}.json`);
        await writeFile(generatedPath, `{"index":${index}}`, 'utf8');
        await writeFile(toolingPath, `{"index":${index}}`, 'utf8');
        watchHandlers.get('change')?.(generatedPath);
        watchHandlers.get('add')?.(toolingPath);
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(wsMessages).toHaveLength(0);

      await writeFile(
        join(workspaceRoot, 'docs', '00-start-here.md'),
        '# Updated after churn\n\nA real docs change should still refresh.\n',
        'utf8',
      );
      watchHandlers.get('change')?.(join(workspaceRoot, 'docs', '00-start-here.md'));

      const refreshedState = await waitForRefreshedState(
        middlewares.get('/__skopos/ui-state')!,
        (state) =>
          state.documents.some(
            (document: { id: string; excerpt: string }) =>
              document.id === 'docs-start' && document.excerpt.includes('Updated after churn'),
          ),
      );

      expect(refreshedState.documents.some((document: { id: string }) => document.id === 'docs-start')).toBe(true);
      expect(wsMessages).toEqual([
        expect.objectContaining({
          type: 'custom',
          event: skoposUiDevStateUpdatedEvent,
        }),
      ]);

      for (let index = 25; index < 40; index += 1) {
        watchHandlers.get('change')?.(
          join(workspaceRoot, 'docs', 'generated', 'skopos', 'app', `chunk-${index}.json`),
        );
        watchHandlers.get('change')?.(
          join(workspaceRoot, '.skopos', 'tooling', 'codex', `adapter-${index}.json`),
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(wsMessages).toHaveLength(1);
    } finally {
      await result.server.close();
    }
  }, 20_000);
});

const requestJson = async (handler: Function, url: string): Promise<any> => {
  const response = await requestThroughMiddleware(handler, url);
  return JSON.parse(response.body);
};

const requestText = async (handler: Function, url: string): Promise<string> => {
  const response = await requestThroughMiddleware(handler, url);
  return response.body;
};

const waitForRefreshedState = async (
  handler: Function,
  predicate: (state: any) => boolean,
): Promise<any> => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 1500) {
    const state = await requestJson(handler, '/__skopos/ui-state');
    if (predicate(state)) {
      return state;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  throw new Error('Timed out waiting for refreshed Skopos UI state.');
};

const requestThroughMiddleware = async (
  handler: Function,
  url: string,
): Promise<{ statusCode: number; headers: Record<string, string>; body: string }> => {
  let body = '';
  const headers: Record<string, string> = {};

  const response = {
    statusCode: 200,
    setHeader(name: string, value: string) {
      headers[name] = value;
    },
    end(chunk: string | Buffer = '') {
      body += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : chunk;
    },
  };

  await handler({ url }, response);

  return {
    statusCode: response.statusCode,
    headers,
    body,
  };
};

const createConsoleWorkspace = async (): Promise<string> => {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-ui-dev-'));
  tempDirs.push(workspaceRoot);

  await mkdir(join(workspaceRoot, '.skopos', 'graph'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'plans'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'missions'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'runs'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'proof'), { recursive: true });
  await mkdir(join(workspaceRoot, 'docs'), { recursive: true });
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
commands: {}
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
    workspaceRoot,
    generatedAt: '2026-04-10T00:00:00.000Z',
    detected: {
      repoMode: 'monorepo',
      archetypeSuggestion: 'monorepo-platform',
      packageCount: 1,
      workspacePackageCount: 1,
      docsRoots: ['docs'],
      instructionFiles: ['AGENTS.md'],
      findings: [],
    },
  });
  await writeJson(workspaceRoot, '.skopos/diagnosis.json', {
    health: 'healthy',
    findings: [],
  });
  await writeJson(workspaceRoot, '.skopos/architecture.json', {
    id: 'architecture',
    updatedAt: '2026-04-10T00:00:00.000Z',
    alignmentStatus: 'aligned',
    current: { topology: 'platform-monorepo' },
    recommended: { topology: 'platform-monorepo' },
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
      scopeCount: 1,
      graphCount: 0,
      planCount: 1,
      missionCount: 1,
      workflowRunCount: 0,
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
    entries: [],
  });
  await writeJson(join(workspaceRoot, '.skopos', 'proof'), 'latest-report.json', {
    schemaVersion: 1,
    id: 'proof-latest-report',
    type: 'proof-report',
    status: 'generated',
    authority: 'generated',
    updatedAt: '2026-04-10T00:00:00.000Z',
    generatedAt: '2026-04-10T00:00:00.000Z',
    workspaceRoot,
    scorecard: {
      definitionSetId: 'proof-phase',
      status: 'pass',
      benchmarkCount: 1,
      passedBenchmarks: 1,
      failedBenchmarks: 0,
      mustWinBenchmarks: 1,
      passedMustWinBenchmarks: 1,
      failedMustWinBenchmarks: 0,
      score: 10,
      maxScore: 10,
      weightedPassRate: 1,
      scoringPolicy: {
        minimumWeightedPassRate: 1,
        failOnAnyBenchmarkFailure: true,
        failOnAnyMustWinBenchmarkFailure: true,
      },
      categorySummaries: [],
      results: [],
    },
    baselineComparison: {
      status: 'pass',
      weightedPassRateDelta: 0,
      scoreDelta: 0,
      maxScoreDelta: 0,
      benchmarkCountDelta: 0,
      categoryChanges: [],
    },
  });
  await writeJson(join(workspaceRoot, '.skopos', 'plans'), 'plan-1.json', {
    id: 'plan-1',
    goal: 'Test plan',
    updatedAt: '2026-04-10T00:00:00.000Z',
    scope: { scope: { id: 'workspace' } },
    validation: { commands: [] },
  });
  await writeJson(join(workspaceRoot, '.skopos', 'missions'), 'mission-1.json', {
    id: 'mission-1',
    title: 'Test mission',
    updatedAt: '2026-04-10T00:00:00.000Z',
    state: 'active',
    planId: 'plan-1',
    scope: { scope: { id: 'workspace' } },
    items: [],
    requiredWorkflows: [],
  });

  return workspaceRoot;
};

const writeJson = async (root: string, relativePath: string, value: unknown): Promise<void> => {
  await writeFile(join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};
