import type { Server } from 'node:http';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { serveSkoposUiConsoleApp } from '../application/serve-console-app/serve-console-app.service.js';

const tempDirs: string[] = [];

describe('serveSkoposUiConsoleApp', () => {
  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map((directory) =>
        rm(directory, {
          recursive: true,
          force: true,
        }),
      ),
    );
  }, 30_000);

  it('serves the built routed console on a local HTTP URL', async () => {
    const workspaceRoot = await createConsoleWorkspace();
    let listenedHost: string | undefined;
    let listenedPort: number | undefined;
    const fakeServer = createFakeServer((host, port) => {
      listenedHost = host;
      listenedPort = port;
    });
    const result = await serveSkoposUiConsoleApp({
      cwd: workspaceRoot,
      host: '127.0.0.1',
      port: 0,
      createHttpServer: () => fakeServer,
    });

    try {
      const html = await readFile(result.entryHtmlPath, 'utf8');
      expect(html).toContain('<title>Skopos Console</title>');
      expect(html).toContain('id="skopos-ui-state"');

      const state = JSON.parse(await readFile(result.statePath, 'utf8')) as {
        workspaceLabel: string;
      };
      expect(state.workspaceLabel).toContain('skopos-ui-serve-');
      expect(listenedHost).toBe('127.0.0.1');
      expect(listenedPort).toBe(0);
      expect(result.url).toBe('http://127.0.0.1:43123');
    } finally {
      await new Promise<void>((resolveClose, rejectClose) => {
        result.server.close((error) => {
          if (error) {
            rejectClose(error);
            return;
          }
          resolveClose();
        });
      });
    }
  }, 120_000);
});

const createConsoleWorkspace = async (): Promise<string> => {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-ui-serve-'));
  tempDirs.push(workspaceRoot);

  await mkdir(join(workspaceRoot, '.skopos', 'graph'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'plans'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'missions'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'runs'), { recursive: true });
  await mkdir(join(workspaceRoot, '.skopos', 'proof'), { recursive: true });
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

const createFakeServer = (
  onListen: (host: string, port: number) => void,
): Server => {
  const fakeAddress = {
    address: '127.0.0.1',
    family: 'IPv4',
    port: 43123,
  } as const;

  const server = {
    once: () => server,
    listen: (port: number, host: string, callback?: () => void) => {
      onListen(host, port);
      callback?.();
      return server;
    },
    address: () => fakeAddress,
    close: (callback?: (error?: Error) => void) => {
      callback?.();
      return server;
    },
  };

  return server as unknown as Server;
};

const writeJson = async (
  workspaceRoot: string,
  relativePath: string,
  value: unknown,
): Promise<void> => {
  await writeFile(join(workspaceRoot, relativePath), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};
