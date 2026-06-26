import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const cliEntrypoint = fileURLToPath(new URL('../cli.ts', import.meta.url));
const cliPackageRoot = fileURLToPath(new URL('../..', import.meta.url));
const fixtureRepoRoot = fileURLToPath(
  new URL('../../../../fixtures/repos/basic-monorepo', import.meta.url),
);
const messyFixtureRepoRoot = fileURLToPath(
  new URL('../../../../fixtures/repos/messy-monorepo', import.meta.url),
);
const largeFixtureRepoRoot = fileURLToPath(
  new URL('../../../../fixtures/repos/large-monorepo', import.meta.url),
);
const approvalFixtureRepoRoot = fileURLToPath(
  new URL('../../../../fixtures/repos/approval-workflow-repo', import.meta.url),
);
const staleDocsFixtureRepoRoot = fileURLToPath(
  new URL('../../../../fixtures/repos/stale-docs-repo', import.meta.url),
);
const canonicalOverrideFixtureRepoRoot = fileURLToPath(
  new URL('../../../../fixtures/repos/canonical-override-repo', import.meta.url),
);
const boundaryAwareFixtureRepoRoot = fileURLToPath(
  new URL('../../../../fixtures/repos/boundary-aware-workspace', import.meta.url),
);
const selfHostedFixtureRepoRoot = fileURLToPath(
  new URL('../../../../fixtures/repos/self-hosted-tooling-workspace', import.meta.url),
);
const require = createRequire(import.meta.url);
const tsxLoaderPath = join(dirname(require.resolve('tsx/package.json')), 'dist', 'loader.mjs');

const tempDirs: string[] = [];

describe('skopos cli e2e', { timeout: 90000 }, () => {
  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map((directory) =>
        rm(directory, {
          recursive: true,
          force: true,
        }),
      ),
    );
  });

  it('initializes a workspace and writes generated bootstrap artifacts', async () => {
    const workspaceDir = await createTempWorkspace();
    const result = runCliJson<{
      actorId?: string;
      configWrite: string;
      bootstrapWrite: string;
      scopesLiteWrite: string;
      diagnosisWrite: string;
      architectureWrite: string;
      enforcementWrite: string;
      indexWrite: string;
      logWrite: string;
      architecturePath: string;
      enforcementPath: string;
      indexPath: string;
      logPath: string;
      workspaceGraphPath: string;
      workspaceGraphWrite: string;
      graphArtifacts: Array<{ id: string; kind: string; path: string; write: string }>;
      referenceArtifacts: Array<{ id: string; path: string; write: string }>;
      toolAdapterArtifacts: Array<{ toolId: string; path: string }>;
      instructionScaffold?: { status: string; path: string; relativePath: string };
      bootstrap: {
        detected: {
          repoMode: string;
          packageCount: number;
          docsRoots: string[];
          instructionFiles: string[];
        };
        recommendedQuestions: Array<{ id: string }>;
      };
    }>(['init', workspaceDir, '--actor', 'agent-bootstrap', '--json']);

    expect(result.configWrite).toBe('written');
    expect(result.bootstrapWrite).toBe('written');
    expect(result.scopesLiteWrite).toBe('written');
    expect(result.diagnosisWrite).toBe('written');
    expect(result.architectureWrite).toBe('written');
    expect(result.enforcementWrite).toBe('written');
    expect(result.indexWrite).toBe('written');
    expect(result.logWrite).toBe('written');
    expect(result.workspaceGraphWrite).toBe('written');
    expect(result.actorId).toBe('agent-bootstrap');
    expect(result.instructionScaffold).toEqual(
      expect.objectContaining({
        status: 'skipped-existing',
        relativePath: 'AGENTS.md',
      }),
    );
    expect(result.graphArtifacts.map((artifact) => artifact.kind)).toEqual([
      'workspace',
      'docs',
      'commands',
      'scope-relations',
    ]);
    expect(result.referenceArtifacts.map((artifact) => artifact.id)).toEqual([
      'symbols',
      'duplicates',
      'contradictions',
    ]);
    expect(result.bootstrap.detected.repoMode).toBe('monorepo');
    expect(result.bootstrap.detected.packageCount).toBe(3);
    expect(result.bootstrap.detected.docsRoots).toContain('docs');
    expect(result.bootstrap.detected.instructionFiles).toContain('AGENTS.md');
    expect(result.bootstrap.recommendedQuestions.map((question) => question.id)).toEqual([
      'bootstrap.project-archetype',
      'bootstrap.docs-root',
    ]);

    const configContents = await readFile(join(workspaceDir, 'skopos.config.yaml'), 'utf8');
    expect(configContents).toContain('repoMode: monorepo');
    expect(configContents).toContain('canonicalInstructions: AGENTS.md');

    const bootstrap = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'bootstrap.json'), 'utf8'),
    ) as {
      detected: { repoMode: string };
    };
    const diagnosis = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'diagnosis.json'), 'utf8'),
    ) as {
      health: string;
      findings: Array<{ id: string }>;
    };
    const architecture = JSON.parse(await readFile(result.architecturePath, 'utf8')) as {
      alignmentStatus: string;
      current: { topology: string };
      recommended: { topology: string };
    };
    const enforcement = JSON.parse(await readFile(result.enforcementPath, 'utf8')) as {
      primarySurface: string;
      toolAdapters: Array<{
        toolId: string;
        path: string;
        workflowRouterCoverage?: { sessionStart: boolean; stopBoundary: boolean };
      }>;
    };
    const docsGraph = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'graph', 'docs.json'), 'utf8'),
    ) as {
      graphKind: string;
      nodes: Array<{ id: string; kind: string }>;
    };
    const commandsGraph = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'graph', 'commands.json'), 'utf8'),
    ) as {
      graphKind: string;
      nodes: Array<{ id: string; kind: string }>;
      edges: Array<{ from: string; to: string; kind: string }>;
    };
    const scopeRelationsGraph = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'graph', 'scope-relations.json'), 'utf8'),
    ) as {
      graphKind: string;
      edges: Array<{ from: string; to: string; kind: string }>;
    };
    const workspaceGraph = JSON.parse(await readFile(result.workspaceGraphPath, 'utf8')) as {
      graphKind: string;
      nodes: Array<{ id: string; kind: string }>;
      edges: Array<{ from: string; to: string; kind: string }>;
    };
    const index = JSON.parse(await readFile(result.indexPath, 'utf8')) as {
      counts: { graphCount: number; workflowManifestCount: number; referenceArtifactCount: number };
      latestEvent?: { eventKind: string; status: string };
      quickLinks: { logPath: string };
      entries: Array<{ kind: string; path: string }>;
    };
    const symbols = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'references', 'symbols.json'), 'utf8'),
    ) as {
      packages: Array<{ packageId: string; symbolCount: number }>;
      entries: Array<{ packageId: string; sourcePath: string; name: string }>;
    };
    const duplicates = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'references', 'duplicates.json'), 'utf8'),
    ) as {
      entries: Array<{ kind: string; key: string }>;
    };
    const contradictions = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'references', 'contradictions.json'), 'utf8'),
    ) as {
      entries: Array<{ id: string }>;
    };
    const logLines = (await readFile(result.logPath, 'utf8'))
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(
        (line) =>
          JSON.parse(line) as {
            eventKind: string;
            status: string;
            metadata?: { actorId?: string | null };
          },
      );
    const scopesLite = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'scopes-lite.json'), 'utf8'),
    ) as {
      scopes: Array<{ id: string }>;
    };

    expect(bootstrap.detected.repoMode).toBe('monorepo');
    expect(diagnosis.health).toBe('healthy');
    expect(diagnosis.findings.map((finding) => finding.id)).toEqual([
      'workspace-structure',
      'docs-root',
      'docs-freshness',
      'instruction-surface',
      'command-surface',
    ]);
    expect(architecture.alignmentStatus).toBe('aligned');
    expect(architecture.current.topology).toBe('platform-monorepo');
    expect(architecture.recommended.topology).toBe('platform-monorepo');
    expect(enforcement.primarySurface).toBe('cli-and-mcp');
    expect(enforcement.toolAdapters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          toolId: 'claude-code',
          path: '.skopos/tooling/claude-code/settings.json',
          workflowRouterCoverage: {
            sessionStart: true,
            stopBoundary: true,
          },
        }),
        expect.objectContaining({
          toolId: 'codex',
          path: '.skopos/tooling/codex/adapter-manifest.json',
          workflowRouterCoverage: {
            sessionStart: true,
            stopBoundary: true,
          },
        }),
      ]),
    );
    expect(result.toolAdapterArtifacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          toolId: 'claude-code',
          path: '.skopos/tooling/claude-code/settings.json',
        }),
        expect.objectContaining({
          toolId: 'codex',
          path: '.skopos/tooling/codex/adapter-manifest.json',
        }),
      ]),
    );
    expect(docsGraph.graphKind).toBe('docs');
    expect(docsGraph.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'docs-root',
        }),
      ]),
    );
    expect(commandsGraph.graphKind).toBe('commands');
    expect(commandsGraph.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'command:typecheck',
          kind: 'command',
        }),
      ]),
    );
    expect(commandsGraph.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: 'workspace',
          to: 'command:typecheck',
          kind: 'recommends',
        }),
      ]),
    );
    expect(scopeRelationsGraph.graphKind).toBe('scope-relations');
    expect(scopeRelationsGraph.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: 'scope:@fixture/api',
          to: 'scope:@fixture/shared',
          kind: 'depends-on',
        }),
      ]),
    );
    expect(workspaceGraph.graphKind).toBe('workspace');
    expect(workspaceGraph.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'command:typecheck',
          kind: 'command',
        }),
        expect.objectContaining({
          id: 'workflow:reference.refresh-api-note',
          kind: 'workflow',
        }),
      ]),
    );
    expect(workspaceGraph.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: 'workspace',
          to: 'workflow:reference.refresh-api-note',
          kind: 'contains',
        }),
      ]),
    );
    expect(scopesLite.scopes.some((scope) => scope.id === '@fixture/api')).toBe(true);
    expect(index.counts.graphCount).toBe(4);
    expect(index.counts.workflowManifestCount).toBe(2);
    expect(index.latestEvent).toEqual(
      expect.objectContaining({
        eventKind: 'init',
        status: 'succeeded',
      }),
    );
    expect(index.quickLinks.logPath).toBe('.skopos/log.jsonl');
    expect(index.counts.referenceArtifactCount).toBe(3);
    expect(index.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'core-artifact',
          path: '.skopos/bootstrap.json',
        }),
        expect.objectContaining({
          kind: 'reference-artifact',
          path: '.skopos/references/symbols.json',
        }),
      ]),
    );
    expect(symbols.packages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          packageId: '@fixture/api',
        }),
      ]),
    );
    expect(symbols.entries.length).toBeGreaterThan(0);
    expect(
      symbols.entries.some(
        (entry) => entry.packageId === '@fixture/api' && entry.sourcePath.startsWith('packages/api/'),
      ),
    ).toBe(true);
    expect(Array.isArray(duplicates.entries)).toBe(true);
    expect(Array.isArray(contradictions.entries)).toBe(true);
    expect(logLines).toHaveLength(1);
    expect(logLines[0]).toEqual(
      expect.objectContaining({
        eventKind: 'init',
        status: 'succeeded',
        metadata: expect.objectContaining({
          actorId: 'agent-bootstrap',
        }),
      }),
    );
  });

  it('generates compact repo understanding artifacts after bootstrap', async () => {
    const workspaceDir = await createTempWorkspace(messyFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--actor', 'agent-bootstrap', '--json']);

    const result = runCliJson<{
      summaryWrite: string;
      featureInventoryWrite: string;
      hotspotsWrite: string;
      indexWrite: string;
      summaryPath: string;
      featureInventoryPath: string;
      hotspotsPath: string;
      summary: {
        purpose: string;
        mainAreas: Array<{ title: string; path: string; confidence: string }>;
      };
      featureInventory: {
        features: Array<{ title: string; ownerPath: string; confidence: string }>;
      };
      hotspots: {
        hotspots: Array<{ title: string; path: string; reason: string }>;
      };
    }>(['understand', workspaceDir, '--actor', 'agent-understanding', '--json']);

    expect(result.summaryWrite).toBe('written');
    expect(result.featureInventoryWrite).toBe('written');
    expect(result.hotspotsWrite).toBe('written');
    expect(result.indexWrite).toBe('written');
    expect(result.summary.purpose).toContain('workspace');
    expect(result.summary.mainAreas.length).toBeGreaterThan(0);
    expect(result.featureInventory.features.length).toBeGreaterThan(0);
    expect(result.hotspots.hotspots.length).toBeGreaterThan(0);

    const summary = JSON.parse(await readFile(result.summaryPath, 'utf8')) as {
      type: string;
      authority: string;
      purpose: string;
    };
    expect(summary.type).toBe('repo-understanding-summary');
    expect(summary.authority).toBe('inferred');
    expect(summary.purpose).toBe(result.summary.purpose);

    const featureInventory = JSON.parse(await readFile(result.featureInventoryPath, 'utf8')) as {
      type: string;
      features: unknown[];
    };
    expect(featureInventory.type).toBe('feature-inventory');
    expect(featureInventory.features.length).toBeGreaterThan(0);

    const hotspots = JSON.parse(await readFile(result.hotspotsPath, 'utf8')) as {
      type: string;
      hotspots: unknown[];
    };
    expect(hotspots.type).toBe('implementation-hotspots');
    expect(hotspots.hotspots.length).toBeGreaterThan(0);

    const index = JSON.parse(await readFile(join(workspaceDir, '.skopos', 'index.json'), 'utf8')) as {
      entries: Array<{ id: string; kind: string; path: string }>;
    };
    expect(index.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'understanding-repo-summary',
          kind: 'understanding-artifact',
          path: '.skopos/understanding/repo-summary.json',
        }),
      ]),
    );
  });

  it('scaffolds project instructions during init when the canonical source is missing', async () => {
    const workspaceDir = await createTempWorkspace();
    await rm(join(workspaceDir, 'AGENTS.md'), { force: true });

    const result = runCliJson<{
      instructionScaffold?: { status: string; path: string; relativePath: string; sections: string[] };
      bootstrap: { detected: { instructionFiles: string[] } };
      diagnosis: { health: string };
    }>(['init', workspaceDir, '--mode', 'greenfield', '--actor', 'agent-bootstrap', '--json']);

    expect(result.instructionScaffold).toEqual(
      expect.objectContaining({
        status: 'written',
        relativePath: 'AGENTS.md',
      }),
    );
    expect(result.instructionScaffold?.sections).toEqual(
      expect.arrayContaining(['operating-policy', 'command-surface', 'security-privacy']),
    );
    expect(result.bootstrap.detected.instructionFiles).toContain('AGENTS.md');
    expect(result.diagnosis.health).toBe('healthy');

    const contents = await readFile(join(workspaceDir, 'AGENTS.md'), 'utf8');
    expect(contents).toContain('## Project Snapshot');
    expect(contents).toContain('### Greenfield Policy');
    expect(contents).toContain('## Agent Workflow');
    expect(contents).toContain('## Security And Privacy');
    expect(contents).toContain('skopos start "<goal>"');
  });

  it('scaffolds instructions explicitly and skips existing sources unless forced', async () => {
    const workspaceDir = await createTempWorkspace();

    const skipped = runCliJson<{ status: string; relativePath: string }>([
      'instructions',
      'scaffold',
      workspaceDir,
      '--json',
    ]);
    expect(skipped).toEqual(
      expect.objectContaining({
        status: 'skipped-existing',
        relativePath: 'AGENTS.md',
      }),
    );

    const forced = runCliJson<{ status: string; mode: string; actorId?: string }>([
      'instructions',
      'scaffold',
      workspaceDir,
      '--mode',
      'greenfield',
      '--force',
      '--actor',
      'agent-scaffold',
      '--json',
    ]);
    expect(forced).toEqual(
      expect.objectContaining({
        status: 'overwritten',
        mode: 'greenfield',
        actorId: 'agent-scaffold',
      }),
    );

    const contents = await readFile(join(workspaceDir, 'AGENTS.md'), 'utf8');
    expect(contents).toContain('### Greenfield Policy');
    expect(contents).toContain('## Skopos Workflow');
    expect(contents).not.toContain('# Fixture agent rules');
  });

  it('supports subtree-targeted init slices for large workspaces', async () => {
    const workspaceDir = await createTempWorkspace(largeFixtureRepoRoot);
    const result = runCliJson<{
      bootstrap: {
        focusSubtree?: string;
        detected: {
          focusSubtree?: string;
          packageCount: number;
          workspacePackageCount: number;
        };
      };
      scopesLite: {
        focusSubtree?: string;
        scopes: Array<{ id: string; kind: string; path: string }>;
      };
      architecture: {
        focusSubtree?: string;
        alignmentStatus: string;
        current: {
          topology: string;
          units: Array<{ path: string }>;
        };
      };
    }>(['init', workspaceDir, '--subtree', 'domains/billing', '--json']);

    const scopeRelationsGraph = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'graph', 'scope-relations.json'), 'utf8'),
    ) as {
      nodes: Array<{ path?: string }>;
    };

    expect(result.bootstrap.focusSubtree).toBe('domains/billing');
    expect(result.bootstrap.detected.focusSubtree).toBe('domains/billing');
    expect(result.bootstrap.detected.packageCount).toBe(2);
    expect(result.bootstrap.detected.workspacePackageCount).toBe(6);
    expect(result.scopesLite.focusSubtree).toBe('domains/billing');
    expect(
      result.scopesLite.scopes
        .filter((scope) => scope.kind === 'package')
        .map((scope) => scope.path),
    ).toEqual(['domains/billing/api', 'domains/billing/web']);
    expect(result.architecture.focusSubtree).toBe('domains/billing');
    expect(result.architecture.alignmentStatus).toBe('aligned');
    expect(result.architecture.current.topology).toBe('platform-monorepo');
    expect(result.architecture.current.units.map((unit) => unit.path)).toEqual([
      '.',
      'domains/billing/api',
      'domains/billing/web',
    ]);
    expect(scopeRelationsGraph.nodes.map((node) => node.path).filter(Boolean)).toEqual([
      '.',
      'domains/billing/api',
      'domains/billing/web',
    ]);
  });

  it('inherits parent workspace docs and instruction surfaces for nested package pilots', async () => {
    const workspaceDir = await createTempWorkspace();
    const targetDir = join(workspaceDir, 'packages/api');

    const init = runCliJson<{
      bootstrap: {
        detected: {
          repoMode: string;
          packageCount: number;
          workspacePackageCount: number;
          docsRoots: string[];
          instructionFiles: string[];
        };
        recommendedConfig: {
          docs: { root: string };
          agents: { canonicalInstructions: string };
        };
      };
    }>(['init', targetDir, '--json']);

    expect(init.bootstrap.detected.repoMode).toBe('monorepo');
    expect(init.bootstrap.detected.packageCount).toBe(1);
    expect(init.bootstrap.detected.workspacePackageCount).toBe(3);
    expect(init.bootstrap.detected.docsRoots).toContain('../../docs');
    expect(init.bootstrap.detected.instructionFiles).toContain('../../AGENTS.md');
    expect(init.bootstrap.recommendedConfig.docs.root).toBe('../../docs');
    expect(init.bootstrap.recommendedConfig.agents.canonicalInstructions).toBe('../../AGENTS.md');

    const configContents = await readFile(join(targetDir, 'skopos.config.yaml'), 'utf8');
    expect(configContents).toContain('repoMode: monorepo');
    expect(configContents).toContain('root: ../../docs');
    expect(configContents).toContain('canonicalInstructions: ../../AGENTS.md');

    const trust = runCliJson<{
      trustLevel: string;
      readiness: string;
      checks: Array<{ id: string; status: string }>;
    }>(['trust', targetDir, '--json']);

    expect(trust.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'docs-root',
          status: 'pass',
        }),
        expect.objectContaining({
          id: 'instruction-source',
          status: 'pass',
        }),
      ]),
    );
    expect(trust.readiness).not.toBe('bootstrap-needed');
  });

  it('refreshes stale bootstrap-managed config when rerunning a nested package pilot', async () => {
    const workspaceDir = await createTempWorkspace();
    const targetDir = join(workspaceDir, 'packages/api');

    await writeFile(
      join(targetDir, 'package.json'),
      JSON.stringify(
        {
          name: '@fixture/api',
          version: '0.0.0',
          private: true,
          scripts: {
            build: 'tsup',
            test: 'vitest run',
            'check-types': 'tsc --noEmit',
            lint: 'eslint src --max-warnings 0',
          },
        },
        null,
        2,
      ),
      'utf8',
    );

    await writeFile(
      join(targetDir, 'skopos.config.yaml'),
      [
        'schemaVersion: 1',
        'project:',
        '  name: api',
        '  archetype: library',
        '  repoMode: single',
        '  scopeStrategy: domain',
        'commands:',
        '  build: tsup',
        '  test: vitest run',
        '  typecheck: tsc --noEmit',
        '  lint: eslint src --max-warnings 0',
        'workspace:',
        '  ignore: []',
        'docs:',
        '  root: docs',
        '  usePerDomainArchive: true',
        '  strictMetadata: true',
        '  strictLinking: true',
        'agents:',
        '  canonicalInstructions: AGENTS.md',
        '  syncMirrors:',
        '    - CLAUDE.md',
        '    - .cursor/rules/project.mdc',
        '    - .github/copilot-instructions.md',
        '  mcp: true',
        'trust:',
        '  mode: stabilize',
        '  requireDocsSync: true',
        '  requireProofForDone: true',
        'decisions:',
        '  mode: balanced',
        '  askFor:',
        '    - architecture-shift',
        'security:',
        '  privacyMode: local-only',
        '  redactSecrets: true',
        '',
      ].join('\n'),
      'utf8',
    );

    const init = runCliJson<{
      configWrite: string;
      bootstrap: {
        recommendedConfig: {
          project: { repoMode: string; scopeStrategy: string };
          commands: {
            build?: string;
            test?: string;
            typecheck?: string;
            lint?: string;
          };
          docs: { root: string };
          agents: { canonicalInstructions: string };
          trust: { mode: string };
        };
      };
    }>(['init', targetDir, '--json']);

    expect(init.configWrite).toBe('refreshed-stale');
    expect(init.bootstrap.recommendedConfig.project.repoMode).toBe('monorepo');
    expect(init.bootstrap.recommendedConfig.project.scopeStrategy).toBe('hybrid');
    expect(init.bootstrap.recommendedConfig.commands.build).toBe('pnpm build');
    expect(init.bootstrap.recommendedConfig.commands.test).toBe('pnpm test');
    expect(init.bootstrap.recommendedConfig.commands.typecheck).toBe('pnpm check-types');
    expect(init.bootstrap.recommendedConfig.commands.lint).toBe('pnpm lint');
    expect(init.bootstrap.recommendedConfig.docs.root).toBe('../../docs');
    expect(init.bootstrap.recommendedConfig.agents.canonicalInstructions).toBe('../../AGENTS.md');
    expect(init.bootstrap.recommendedConfig.trust.mode).toBe('balanced');

    const configContents = await readFile(join(targetDir, 'skopos.config.yaml'), 'utf8');
    expect(configContents).toContain('repoMode: monorepo');
    expect(configContents).toContain('scopeStrategy: hybrid');
    expect(configContents).toContain('build: pnpm build');
    expect(configContents).toContain('test: pnpm test');
    expect(configContents).toContain('typecheck: pnpm check-types');
    expect(configContents).toContain('lint: pnpm lint');
    expect(configContents).toContain('root: ../../docs');
    expect(configContents).toContain('canonicalInstructions: ../../AGENTS.md');
    expect(configContents).toContain('mode: balanced');
  });

  it('detects a custom inherited docs router for nested package pilots', async () => {
    const workspaceDir = await createTempWorkspace();
    const targetDir = join(workspaceDir, 'packages/api');

    await rm(join(workspaceDir, 'docs', '00-start-here.md'), { force: true });
    await mkdir(join(workspaceDir, 'docs', 'core', 'ssot'), { recursive: true });
    await writeFile(
      join(workspaceDir, 'docs', 'core', 'ssot', '00-start-here.md'),
      '# Core Docs Start Here\n',
      'utf8',
    );

    const init = runCliJson<{
      bootstrap: {
        detected: {
          docsHealth: {
            root?: string;
            hasStartHere: boolean;
            startHerePath?: string;
          };
        };
        recommendedConfig: {
          docs: {
            root: string;
            startHerePath?: string;
          };
        };
      };
    }>(['init', targetDir, '--json']);

    expect(init.bootstrap.detected.docsHealth.root).toBe('../../docs');
    expect(init.bootstrap.detected.docsHealth.hasStartHere).toBe(true);
    expect(init.bootstrap.detected.docsHealth.startHerePath).toBe(
      '../../docs/core/ssot/00-start-here.md',
    );
    expect(init.bootstrap.recommendedConfig.docs.startHerePath).toBe(
      '../../docs/core/ssot/00-start-here.md',
    );

    const trust = runCliJson<{
      checks: Array<{ id: string; status: string; summary: string }>;
    }>(['trust', targetDir, '--json']);

    expect(trust.checks).toContainEqual(
      expect.objectContaining({
        id: 'docs-router',
        status: 'pass',
        summary: expect.stringContaining('../../docs/core/ssot/00-start-here.md'),
      }),
    );
  });

  it('keeps the configured inherited docs root when a local docs folder appears before trust refresh', async () => {
    const workspaceDir = await createTempWorkspace();
    const targetDir = join(workspaceDir, 'packages/api');

    runCliJson(['init', targetDir, '--json']);

    await mkdir(join(targetDir, 'docs', 'generated', 'skopos', 'app'), { recursive: true });
    await writeFile(join(targetDir, 'docs', 'generated', 'skopos', 'app', 'index.html'), '', 'utf8');

    const existingConfig = await readFile(join(targetDir, 'skopos.config.yaml'), 'utf8');
    await writeFile(join(targetDir, 'skopos.config.yaml'), existingConfig, 'utf8');

    const trust = runCliJson<{
      checks: Array<{ id: string; status: string; summary: string }>;
    }>(['trust', targetDir, '--json']);

    expect(trust.checks).toContainEqual(
      expect.objectContaining({
        id: 'docs-root',
        status: 'pass',
        summary: expect.stringContaining('../../docs'),
      }),
    );
    expect(trust.checks).toContainEqual(
      expect.objectContaining({
        id: 'docs-router',
        status: 'pass',
        summary: expect.stringContaining('../../docs/00-start-here.md'),
      }),
    );
  });

  it('treats an inherited parent AGENTS.md as canonical during nested package bootstrap and trust', async () => {
    const workspaceDir = await createTempWorkspace();
    const targetDir = join(workspaceDir, 'packages/api');

    const init = runCliJson<{
      bootstrap: {
        recommendedQuestions: Array<{ id: string }>;
      };
      diagnosis: {
        findings: Array<{ id: string; status?: string; summary: string }>;
      };
    }>(['init', targetDir, '--json']);

    expect(init.bootstrap.recommendedQuestions.map((question) => question.id)).not.toContain(
      'bootstrap.instructions-source',
    );
    expect(init.diagnosis.findings).toContainEqual(
      expect.objectContaining({
        id: 'instruction-surface',
        summary: expect.stringContaining('../../AGENTS.md'),
      }),
    );

    runCliJson(['instructions', 'sync', targetDir, '--actor', 'agent-pilot', '--json']);
    runCliJson([
      'start',
      'validate nested package pilot readiness',
      targetDir,
      '--actor',
      'agent-pilot',
      '--json',
    ]);

    const trust = runCliJson<{
      trustLevel: string;
      readiness: string;
      unresolvedAssumptions: string[];
      checks: Array<{ id: string; status: string; summary: string }>;
    }>(['trust', targetDir, '--actor', 'agent-pilot', '--json']);

    expect(trust.unresolvedAssumptions).not.toContain(
      'What should be the canonical instruction source for coding agents?',
    );
    expect(trust.checks).toContainEqual(
      expect.objectContaining({
        id: 'instruction-source',
        status: 'pass',
        summary: expect.stringContaining('../../AGENTS.md'),
      }),
    );
  });

  it('keeps ignored internal roots out of the active workspace model', async () => {
    const workspaceDir = await createTempWorkspace(boundaryAwareFixtureRepoRoot);
    const result = runCliJson<{
      configWrite: string;
      bootstrap: {
        detected: {
          ignoredPaths: string[];
          packageCount: number;
          workspacePackageCount: number;
        };
      };
      scopesLite: {
        scopes: Array<{ id: string; kind: string; path: string }>;
      };
      architecture: {
        current: {
          units: Array<{ path: string }>;
        };
      };
    }>(['init', workspaceDir, '--json']);

    const workspaceGraph = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'graph', 'workspace.json'), 'utf8'),
    ) as {
      nodes: Array<{ id: string }>;
    };
    const scopeRelationsGraph = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'graph', 'scope-relations.json'), 'utf8'),
    ) as {
      nodes: Array<{ path?: string }>;
    };

    expect(result.configWrite).toBe('skipped-existing');
    expect(result.bootstrap.detected.ignoredPaths).toEqual([
      'docs/generated',
      'fixtures',
      'internal',
      'tests',
    ]);
    expect(result.bootstrap.detected.packageCount).toBe(2);
    expect(result.bootstrap.detected.workspacePackageCount).toBe(2);
    expect(
      result.scopesLite.scopes
        .filter((scope) => scope.kind === 'package')
        .map((scope) => scope.path)
        .sort(),
    ).toEqual(['packages/sdk-cli', 'packages/sdk-core']);
    expect(result.architecture.current.units.map((unit) => unit.path)).toEqual([
      '.',
      'packages/sdk-cli',
      'packages/sdk-core',
    ]);
    expect(workspaceGraph.nodes.map((node) => node.id)).not.toEqual(
      expect.arrayContaining([
        'scope:@boundary/example-fixture',
        'scope:@boundary/internal-prototype',
        'scope:@boundary/test-harness',
      ]),
    );
    expect(scopeRelationsGraph.nodes.map((node) => node.path).filter(Boolean).sort()).toEqual([
      '.',
      'packages/sdk-cli',
      'packages/sdk-core',
    ]);
  });

  it('supports a self-hosted tooling repo shape with workflow discovery, trust, and portal rendering', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    const init = runCliJson<{
      bootstrap: {
        detected: {
          ignoredPaths: string[];
          packageCount: number;
          workspacePackageCount: number;
        };
      };
      scopesLite: {
        scopes: Array<{ kind: string; path: string }>;
      };
    }>(['init', workspaceDir, '--json']);

    expect(init.bootstrap.detected.ignoredPaths).toEqual([
      'docs/generated',
      'fixtures',
      'internal',
      'tests',
    ]);
    expect(init.bootstrap.detected.packageCount).toBe(3);
    expect(init.bootstrap.detected.workspacePackageCount).toBe(3);
    expect(
      init.scopesLite.scopes
        .filter((scope) => scope.kind === 'package')
        .map((scope) => scope.path)
        .sort(),
    ).toEqual(['packages/cli', 'packages/core', 'packages/ui']);

    const workflows = runCliJson<Array<{ id: string; sourcePath: string }>>([
      'workflows',
      'list',
      workspaceDir,
      '--json',
    ]);
    expect(workflows.map((workflow) => workflow.id).sort()).toEqual([
      'graph.render-local-portal',
      'instructions.sync-mirrors',
      'maintenance.refresh-knowledge',
      'quality.run-proof-phase',
    ]);

    const plan = runCliJson<{
      scope: { scope: { id: string } };
      recommendedWorkflows: Array<{ id: string }>;
    }>([
      'plan',
      'refresh self-hosted proof portal and knowledge coverage',
      workspaceDir,
      '--scope',
      '@selfhost/cli',
      '--json',
    ]);
    expect(plan.scope.scope.id).toBe('@selfhost/cli');
    expect(plan.recommendedWorkflows.map((workflow) => workflow.id).sort()).toEqual([
      'graph.render-local-portal',
      'instructions.sync-mirrors',
      'maintenance.refresh-knowledge',
      'quality.run-proof-phase',
    ]);

    runCliJson(['instructions', 'sync', workspaceDir, '--actor', 'agent-selfhost', '--json']);

    const trust = runCliJson<{
      trustLevel: string;
      readiness: string;
      findings: Array<{ id: string }>;
    }>(['trust', workspaceDir, '--actor', 'agent-selfhost', '--json']);
    expect(trust.trustLevel).toBe('high');
    expect(trust.readiness).toBe('agent-ready');
    expect(trust.findings).toEqual([]);

    const portal = runCliJson<{
      writeStatus: string;
      outputPath: string;
      html: string;
    }>(['ui', 'render', workspaceDir, '--json']);
    expect(portal.writeStatus).toBe('written');
    expect(portal.html).toContain('Skopos Console');
    expect(await readFile(portal.outputPath, 'utf8')).toContain('Skopos Console');
  });

  it('warns when self-hosted source work is not covered by an active claimed mission', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    initializeGitWorkspace(workspaceDir);
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    commitWorkspace(workspaceDir, 'baseline');

    await writeFile(
      join(workspaceDir, 'packages/ui/package.json'),
      JSON.stringify(
        {
          name: '@selfhost/ui',
          private: true,
          description: 'UI package for the self-hosted tooling fixture with search dock work.',
          dependencies: {
            '@selfhost/core': 'workspace:*',
          },
        },
        null,
        2,
      ),
      'utf8',
    );

    const trustBeforePlan = runCliJson<{
      trustLevel: string;
      readiness: string;
      checks: Array<{ id: string; status: string; summary: string }>;
    }>(['trust', workspaceDir, '--actor', 'agent-selfhost', '--json']);

    expect(trustBeforePlan.trustLevel).toBe('medium');
    expect(trustBeforePlan.readiness).toBe('needs-review');
    expect(trustBeforePlan.checks).toContainEqual({
      id: 'active-mission',
      status: 'warn',
      summary: expect.stringContaining('no active claimed mission was found'),
    });

    const planned = runCliJson<{
      missionId: string;
      mission: {
        state: string;
        coordination: {
          claimedBy?: {
            actorId: string;
          };
        };
      };
    }>([
      'plan',
      'add the routed search dock shell and compiled-state result surface',
      workspaceDir,
      '--scope',
      '@selfhost/ui',
      '--actor',
      'agent-selfhost',
      '--json',
    ]);

    expect(planned.mission.state).toBe('planned');
    expect(planned.mission.coordination.claimedBy).toBeUndefined();

    const trustWithPlannedMission = runCliJson<{
      trustLevel: string;
      readiness: string;
      checks: Array<{ id: string; status: string; summary: string }>;
    }>(['trust', workspaceDir, '--actor', 'agent-selfhost', '--json']);

    expect(trustWithPlannedMission.trustLevel).toBe('medium');
    expect(trustWithPlannedMission.readiness).toBe('needs-review');
    expect(trustWithPlannedMission.checks).toContainEqual({
      id: 'active-mission',
      status: 'warn',
      summary: expect.stringContaining('no active claimed mission was found'),
    });

    const claimedMission = runCliJson<{
      id: string;
      state: string;
      coordination: {
        claimedBy?: {
          actorId: string;
        };
      };
    }>([
      'mission',
      'claim',
      planned.missionId,
      workspaceDir,
      '--actor',
      'agent-selfhost',
      '--json',
    ]);

    expect(claimedMission.state).toBe('active');
    expect(claimedMission.coordination.claimedBy?.actorId).toBe('agent-selfhost');

    const trustAfterClaim = runCliJson<{
      trustLevel: string;
      readiness: string;
      checks: Array<{ id: string; status: string; summary: string }>;
    }>(['trust', workspaceDir, '--actor', 'agent-selfhost', '--json']);

    expect(trustAfterClaim.trustLevel).toBe('high');
    expect(trustAfterClaim.readiness).toBe('agent-ready');
    expect(trustAfterClaim.checks).toContainEqual({
      id: 'active-mission',
      status: 'pass',
      summary: expect.stringContaining(claimedMission.id),
    });
  });

  it('treats tracked work as covered after a claimed mission completes with complete eval and no newer edits', async () => {
    const workspaceDir = await createTempWorkspace();
    initializeGitWorkspace(workspaceDir);
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    commitWorkspace(workspaceDir, 'baseline');

    await writeFile(
      join(workspaceDir, 'AGENTS.md'),
      `${await readFile(join(workspaceDir, 'AGENTS.md'), 'utf8')}\n- Pilot closure coverage update.\n`,
      'utf8',
    );

    const started = runCliJson<{
      missionId: string;
      questions: {
        entries: Array<{ id: string; recommendedOptionId: string; status: string }>;
      };
    }>([
      'start',
      'validate package pilot closure coverage',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);

    for (const question of started.questions.entries.filter((entry) => entry.status === 'open')) {
      runCliJson([
        'decide',
        question.id,
        question.recommendedOptionId,
        workspaceDir,
        '--actor',
        'agent-router',
        '--json',
      ]);
    }

    runCliJson(['instructions', 'sync', workspaceDir, '--actor', 'agent-router', '--json']);
    runCliJson([
      'eval',
      workspaceDir,
      '--mission',
      started.missionId,
      '--actor',
      'agent-router',
      '--json',
    ]);
    runCliJson([
      'mission',
      'complete',
      started.missionId,
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);

    const trustAfterCompletion = runCliJson<{
      trustLevel: string;
      readiness: string;
      checks: Array<{ id: string; status: string; summary: string }>;
    }>(['trust', workspaceDir, '--actor', 'agent-router', '--json']);

    expect(trustAfterCompletion.trustLevel).toBe('high');
    expect(trustAfterCompletion.readiness).toBe('agent-ready');
    expect(trustAfterCompletion.checks).toContainEqual({
      id: 'active-mission',
      status: 'pass',
      summary: expect.stringContaining(started.missionId),
    });

    const doneAfterCompletion = runCliJson<{
      checks: Array<{ id: string; status: string; summary: string }>;
    }>([
      'done',
      '--mission',
      started.missionId,
      '--actor',
      'agent-router',
      '--cwd',
      workspaceDir,
      '--json',
    ]);

    expect(doneAfterCompletion.checks).toContainEqual({
      id: 'workspace-trust',
      status: 'pass',
      summary: expect.stringContaining('Trust high'),
    });
  });

  it('builds compact program state from the current mission and active findings', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);
    await writeActiveFindingFixture(workspaceDir);

    const started = runCliJson<{
      missionId: string;
      questions: {
        entries: Array<{ id: string; recommendedOptionId: string; status: string }>;
      };
    }>([
      'start',
      'implement the first low-noise program router slice',
      workspaceDir,
      '--actor',
      'agent-program',
      '--json',
    ]);

    for (const question of started.questions.entries.filter((entry) => entry.status === 'open')) {
      runCliJson([
        'decide',
        question.id,
        question.recommendedOptionId,
        workspaceDir,
        '--actor',
        'agent-program',
        '--json',
      ]);
    }

    const synced = runCliJson<{
      currentMissionId?: string;
      doNowItem?: { id: string; title: string };
      doNextItem?: { id: string; title: string };
      state: {
        items: Array<{
          id: string;
          sourceKind: string;
          recommendedDisposition: string;
          linkedMissionId?: string;
        }>;
        sequence: {
          currentActiveItemId?: string;
          doNow?: string;
          doNext?: string;
          interruptRecommendation: { decision: string };
        };
        obligations: Array<{ kind: string; targetRef: string; status: string }>;
      };
    }>(['program', 'sync', workspaceDir, '--actor', 'agent-program', '--json']);

    expect(synced.currentMissionId).toBe(started.missionId);
    expect(synced.state.sequence.currentActiveItemId).toBe(
      `program-item.mission.${started.missionId}`,
    );
    expect(synced.state.sequence.doNow).toBe(`program-item.mission.${started.missionId}`);
    expect(synced.state.sequence.doNext).toBe(
      'program-item.finding.F-20260412-discussion-memory-compaction-gap',
    );
    expect(synced.state.sequence.interruptRecommendation.decision).toBe('continue-current');
    expect(synced.state.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: `program-item.mission.${started.missionId}`,
          sourceKind: 'mission',
          recommendedDisposition: 'do-now',
        }),
        expect.objectContaining({
          id: 'program-item.finding.F-20260412-program-router-and-obligation-gap',
          sourceKind: 'finding',
          recommendedDisposition: 'defer',
          linkedMissionId: started.missionId,
        }),
        expect.objectContaining({
          id: 'program-item.finding.F-20260412-discussion-memory-compaction-gap',
          sourceKind: 'finding',
          recommendedDisposition: 'do-next',
        }),
      ]),
    );
    expect(synced.state.obligations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'ui',
          targetRef: 'route:overview',
          status: 'open',
        }),
        expect.objectContaining({
          kind: 'ui',
          targetRef: 'surface:search-dock',
          status: 'open',
        }),
      ]),
    );

    const persistedState = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'program', 'state.json'), 'utf8'),
    ) as {
      sequence: { doNow?: string; doNext?: string };
    };
    const index = JSON.parse(await readFile(join(workspaceDir, '.skopos', 'index.json'), 'utf8')) as {
      entries: Array<{ path: string }>;
      latestEvent?: { eventKind: string };
    };

    expect(persistedState.sequence.doNow).toBe(`program-item.mission.${started.missionId}`);
    expect(persistedState.sequence.doNext).toBe(
      'program-item.finding.F-20260412-discussion-memory-compaction-gap',
    );
    expect(index.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: '.skopos/program/state.json',
        }),
      ]),
    );
    expect(index.latestEvent).toEqual(
      expect.objectContaining({
        eventKind: 'program-sync',
      }),
    );
  });

  it('recommends continuing the current mission through program next when no stronger item interrupts it', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);
    await writeActiveFindingFixture(workspaceDir);

    const started = runCliJson<{
      missionId: string;
      questions: {
        entries: Array<{ id: string; recommendedOptionId: string; status: string }>;
      };
    }>([
      'start',
      'implement the first low-noise program router slice',
      workspaceDir,
      '--actor',
      'agent-program',
      '--json',
    ]);

    for (const question of started.questions.entries.filter((entry) => entry.status === 'open')) {
      runCliJson([
        'decide',
        question.id,
        question.recommendedOptionId,
        workspaceDir,
        '--actor',
        'agent-program',
        '--json',
      ]);
    }

    const next = runCliJson<{
      currentDisposition: string;
      currentMissionId?: string;
      recommendedItem?: { id: string };
      recommendedAction?: { kind: string; command?: string; summary: string };
      obligations: Array<{ kind: string }>;
      state: {
        sequence: {
          interruptRecommendation: { decision: string };
        };
      };
    }>(['program', 'next', workspaceDir, '--actor', 'agent-program', '--json']);

    expect(next.currentDisposition).toBe('continue-current');
    expect(next.currentMissionId).toBe(started.missionId);
    expect(next.recommendedItem?.id).toBe(`program-item.mission.${started.missionId}`);
    expect(next.recommendedAction).toEqual(
      expect.objectContaining({
        kind: 'continue-current-mission',
        command: expect.stringContaining(`--mission ${started.missionId}`),
      }),
    );
    expect(next.recommendedAction?.summary).toContain('current do-now item');
    expect(next.obligations.some((entry) => entry.kind === 'ui')).toBe(true);
    expect(next.state.sequence.interruptRecommendation.decision).toBe('continue-current');

    const nextText = runCliText(['program', 'next', workspaceDir, '--actor', 'agent-program']);
    expect(nextText).toContain('Skopos program next');
    expect(nextText).toContain('Status: Ready for next action');
    expect(nextText).toContain('Next step:');
    expect(nextText).toContain(`--mission ${started.missionId}`);
  });

  it('promotes blocking workflow recommendations into program do-now guidance', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);

    const started = runCliJson<{
      missionId: string;
      questions: {
        entries: Array<{ id: string; recommendedOptionId: string; status: string; blocking: boolean }>;
      };
    }>([
      'start',
      'change a public API and update the UI workflow',
      workspaceDir,
      '--actor',
      'agent-program',
      '--json',
    ]);
    const blockingQuestion = started.questions.entries.find(
      (entry) => entry.status === 'open' && entry.blocking,
    );

    expect(blockingQuestion).toBeDefined();

    const synced = runCliJson<{
      recommendedAction?: { kind: string; command?: string; linkedItemId?: string };
      state: {
        items: Array<{
          id: string;
          sourceKind: string;
          recommendedDisposition: string;
          recommendedCommand?: string;
          linkedMissionId?: string;
        }>;
        sequence: {
          currentActiveItemId?: string;
          doNow?: string;
          doNext?: string;
          openProgramQuestions: string[];
          interruptRecommendation: { decision: string };
        };
      };
    }>(['program', 'sync', workspaceDir, '--actor', 'agent-program', '--json']);
    const promotedItem = synced.state.items.find(
      (item) => item.sourceKind === 'workflow-recommendation',
    );

    expect(promotedItem).toEqual(
      expect.objectContaining({
        recommendedDisposition: 'interrupt-current',
        linkedMissionId: started.missionId,
        recommendedCommand: expect.stringContaining(`decide ${blockingQuestion?.id}`),
      }),
    );
    expect(synced.state.sequence.currentActiveItemId).toBe(
      `program-item.mission.${started.missionId}`,
    );
    expect(synced.state.sequence.doNow).toBe(promotedItem?.id);
    expect(synced.state.sequence.doNext).toBe(`program-item.mission.${started.missionId}`);
    expect(synced.state.sequence.openProgramQuestions).toContain(blockingQuestion?.id);
    expect(synced.state.sequence.interruptRecommendation.decision).toBe('interrupt-current');
    expect(synced.recommendedAction).toEqual(
      expect.objectContaining({
        kind: 'run-workflow-recommendation',
        command: expect.stringContaining(`decide ${blockingQuestion?.id}`),
        linkedItemId: promotedItem?.id,
      }),
    );
  });

  it('orders queued program findings by severity instead of registry position', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);
    await writePriorityFindingFixture(workspaceDir);

    const synced = runCliJson<{
      doNowItem?: { id: string; priority: string };
      doNextItem?: { id: string; priority: string };
      state: {
        sequence: {
          doNow?: string;
          doNext?: string;
          interruptRecommendation: { decision: string };
        };
      };
    }>(['program', 'sync', workspaceDir, '--actor', 'agent-program', '--json']);

    expect(synced.state.sequence.interruptRecommendation.decision).toBe('start-do-now');
    expect(synced.state.sequence.doNow).toBe('program-item.finding.F-critical-token-transport');
    expect(synced.state.sequence.doNext).toBe('program-item.finding.F-high-stale-advisory');
    expect(synced.doNowItem).toEqual(
      expect.objectContaining({
        id: 'program-item.finding.F-critical-token-transport',
        priority: 'critical',
      }),
    );
    expect(synced.doNextItem).toEqual(
      expect.objectContaining({
        id: 'program-item.finding.F-high-stale-advisory',
        priority: 'high',
      }),
    );
  });

  it('ignores active missions superseded by a later complete duplicate during program sync', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);

    await mkdir(join(workspaceDir, '.skopos', 'missions'), { recursive: true });
    await writeFile(
      join(
        workspaceDir,
        '.skopos',
        'missions',
        'mission-older-current.json',
      ),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'mission-older-current',
          type: 'mission',
          status: 'generated',
          authority: 'generated',
          updatedAt: '2026-04-12T17:00:00.000Z',
          generatedAt: '2026-04-12T17:00:00.000Z',
          workspaceRoot: workspaceDir,
          planId: 'plan-current',
          state: 'active',
          title: 'Mission: Refresh the routed console trust state',
          summary: 'Execution checklist for refreshing routed trust state.',
          objective: 'refresh the routed console trust state',
          scope: {
            query: 'workspace',
            matchedBy: 'id',
            scope: {
              id: 'workspace',
              kind: 'workspace',
              title: 'workspace',
              path: '.',
              aliases: ['root'],
              summary: 'Workspace root',
              confidence: 'high',
            },
          },
          items: [],
          recommendedChecks: [],
          recommendedWorkflowIds: [],
          decisionQuestionIds: [],
          linkedSlices: [],
          coordination: {
            claimedBy: {
              actorId: 'agent-program',
              claimedAt: '2026-04-12T17:00:00.000Z',
            },
            lastUpdatedBy: 'agent-program',
            lastUpdatedAt: '2026-04-12T17:00:00.000Z',
          },
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(
        workspaceDir,
        '.skopos',
        'missions',
        'mission-stale-active-duplicate.json',
      ),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'mission-stale-active-duplicate',
          type: 'mission',
          status: 'generated',
          authority: 'generated',
          updatedAt: '2026-04-12T18:06:25.295Z',
          generatedAt: '2026-04-12T18:06:24.734Z',
          workspaceRoot: workspaceDir,
          planId: 'plan-token-telemetry',
          state: 'active',
          title: 'Mission: Add prompt layering and token telemetry for agent context budgeting',
          summary: 'Execution checklist for Add prompt layering and token telemetry for agent context budgeting.',
          objective: 'add prompt layering and token telemetry for agent context budgeting',
          scope: {
            query: 'workspace',
            matchedBy: 'id',
            scope: {
              id: 'workspace',
              kind: 'workspace',
              title: 'workspace',
              path: '.',
              aliases: ['root'],
              summary: 'Workspace root',
              confidence: 'high',
            },
          },
          items: [],
          recommendedChecks: [],
          recommendedWorkflowIds: [],
          decisionQuestionIds: [],
          linkedSlices: [],
          coordination: {
            claimedBy: {
              actorId: 'agent-program',
              claimedAt: '2026-04-12T18:06:25.295Z',
            },
            lastUpdatedBy: 'agent-program',
            lastUpdatedAt: '2026-04-12T18:06:25.295Z',
          },
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(
        workspaceDir,
        '.skopos',
        'missions',
        'mission-stale-complete-duplicate.json',
      ),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'mission-stale-complete-duplicate',
          type: 'mission',
          status: 'generated',
          authority: 'generated',
          updatedAt: '2026-04-12T18:26:22.745Z',
          generatedAt: '2026-04-12T18:07:12.443Z',
          workspaceRoot: workspaceDir,
          planId: 'plan-token-telemetry',
          state: 'complete',
          title: 'Mission: Add prompt layering and token telemetry for agent context budgeting',
          summary: 'Execution checklist for Add prompt layering and token telemetry for agent context budgeting.',
          objective: 'add prompt layering and token telemetry for agent context budgeting',
          scope: {
            query: 'workspace',
            matchedBy: 'id',
            scope: {
              id: 'workspace',
              kind: 'workspace',
              title: 'workspace',
              path: '.',
              aliases: ['root'],
              summary: 'Workspace root',
              confidence: 'high',
            },
          },
          items: [],
          recommendedChecks: [],
          recommendedWorkflowIds: [],
          decisionQuestionIds: [],
          linkedSlices: [],
          coordination: {
            claimedBy: {
              actorId: 'agent-program',
              claimedAt: '2026-04-12T18:06:25.295Z',
            },
            lastUpdatedBy: 'agent-program',
            lastUpdatedAt: '2026-04-12T18:26:22.745Z',
          },
        },
        null,
        2,
      ),
      'utf8',
    );

    const synced = runCliJson<{
      currentMissionId?: string;
      state: {
        sequence: {
          currentActiveItemId?: string;
          doNow?: string;
        };
      };
    }>(['program', 'sync', workspaceDir, '--actor', 'agent-program', '--json']);

    expect(synced.currentMissionId).toBe('mission-older-current');
    expect(synced.state.sequence.currentActiveItemId).toBe(
      'program-item.mission.mission-older-current',
    );
    expect(synced.state.sequence.doNow).toBe('program-item.mission.mission-older-current');
  });

  it('writes compact agent brief artifacts, handoff state, and token telemetry', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);

    const started = runCliJson<{
      missionId: string;
      questions: {
        entries: Array<{ id: string; recommendedOptionId: string; status: string }>;
      };
    }>([
      'start',
      'generate the first agent brief artifact family',
      workspaceDir,
      '--actor',
      'agent-briefs',
      '--json',
    ]);

    for (const question of started.questions.entries.filter((entry) => entry.status === 'open')) {
      runCliJson([
        'decide',
        question.id,
        question.recommendedOptionId,
        workspaceDir,
        '--actor',
        'agent-briefs',
        '--json',
      ]);
    }

    runCliJson(['program', 'sync', workspaceDir, '--actor', 'agent-briefs', '--json']);
    runCliJson(['trust', workspaceDir, '--actor', 'agent-briefs', '--json']);
    runCliJson([
      'eval',
      workspaceDir,
      '--mission',
      started.missionId,
      '--actor',
      'agent-briefs',
      '--json',
    ]);
    runCliJson([
      'done',
      'skopos.config.yaml',
      '--cwd',
      workspaceDir,
      '--mission',
      started.missionId,
      '--actor',
      'agent-briefs',
      '--json',
    ]);

    const trustBrief = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'agent', 'trust-brief.json'), 'utf8'),
    ) as {
      briefKind: string;
      trustLevel: string;
      readiness: string;
      checkCounts: { pass: number; warn: number; fail: number };
    };
    const doneBrief = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'agent', 'done-brief.json'), 'utf8'),
    ) as {
      briefKind: string;
      closureStatus: string;
      changedPathCount: number;
      missionId?: string;
    };
    const programBrief = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'agent', 'program-brief.json'), 'utf8'),
    ) as {
      briefKind: string;
      currentDisposition: string;
      currentMissionId?: string;
      doNowItemId?: string;
    };
    const evalBrief = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'agent', 'evals', `${started.missionId}.json`), 'utf8'),
    ) as {
      briefKind: string;
      missionId: string;
      evaluationStatus: string;
      proofStatus: string;
    };
    const missionBrief = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'agent', 'missions', `${started.missionId}.json`), 'utf8'),
    ) as {
      briefKind: string;
      missionId: string;
      missionState: string;
      pendingItemIds: string[];
      totalItemCount: number;
    };
    const promptBrief = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'agent', 'prompt-brief.json'), 'utf8'),
    ) as {
      briefKind: string;
      activeMissionId?: string;
      recommendedLoadSequence: string[];
      layers: Array<{ id: string; estimatedTokens: number }>;
      measurements: Array<{ id: string; status: string; budgetTokens: number }>;
      defaultResumeEstimatedTokens: number;
      defaultResumeBudgetTokens: number;
    };
    const handoff = JSON.parse(
      await readFile(
        join(workspaceDir, '.skopos', 'discussions', 'handoffs', 'latest-workflow.json'),
        'utf8',
      ),
    ) as {
      type: string;
      handoffKind: string;
      activeMissionId?: string;
      acceptedDecisions: Array<{ id: string; resolvedOptionId: string }>;
      linkedCheckpointIds: string[];
      linkedArtifactPaths: string[];
      recommendedNextCommand?: string;
    };
    const discussionIndex = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'discussions', 'index.json'), 'utf8'),
    ) as {
      type: string;
      latestCheckpointId?: string;
      checkpointCount: number;
      entries: Array<{ id: string; artifactPath: string; activeMissionId?: string }>;
    };
    const tokenTelemetry = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'agent', 'token-telemetry.json'), 'utf8'),
    ) as {
      type: string;
      activeMissionId?: string;
      overBudgetCount: number;
      measurementCount: number;
      measurements: Array<{ id: string; surfaceKind: string; budgetTokens: number }>;
    };
    const index = JSON.parse(await readFile(join(workspaceDir, '.skopos', 'index.json'), 'utf8')) as {
      counts: { agentBriefCount: number };
      entries: Array<{ kind: string; path: string }>;
    };

    expect(trustBrief).toEqual(
      expect.objectContaining({
        briefKind: 'trust',
        trustLevel: expect.any(String),
        readiness: expect.any(String),
      }),
    );
    expect(trustBrief.checkCounts.pass + trustBrief.checkCounts.warn + trustBrief.checkCounts.fail).toBeGreaterThan(0);
    expect(doneBrief).toEqual(
      expect.objectContaining({
        briefKind: 'done',
        changedPathCount: 1,
        missionId: started.missionId,
      }),
    );
    expect(programBrief).toEqual(
      expect.objectContaining({
        briefKind: 'program',
        currentMissionId: started.missionId,
        doNowItemId: `program-item.mission.${started.missionId}`,
      }),
    );
    expect(evalBrief).toEqual(
      expect.objectContaining({
        briefKind: 'eval',
        missionId: started.missionId,
        evaluationStatus: expect.any(String),
        proofStatus: expect.any(String),
      }),
    );
    expect(missionBrief).toEqual(
      expect.objectContaining({
        briefKind: 'mission',
        missionId: started.missionId,
        missionState: expect.any(String),
        totalItemCount: expect.any(Number),
      }),
    );
    expect(missionBrief.pendingItemIds.length).toBeGreaterThanOrEqual(0);
    expect(promptBrief).toEqual(
      expect.objectContaining({
        briefKind: 'prompt',
        activeMissionId: started.missionId,
        defaultResumeBudgetTokens: 1500,
      }),
    );
    expect(promptBrief.recommendedLoadSequence).toEqual([
      'stable-system-tool-prefix',
      'stable-workspace-doctrine-prefix',
      'dynamic-execution-tail',
    ]);
    expect(promptBrief.layers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'stable-workspace-doctrine-prefix',
        }),
        expect.objectContaining({
          id: 'dynamic-execution-tail',
        }),
      ]),
    );
    expect(promptBrief.measurements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'program-brief',
          budgetTokens: 400,
        }),
        expect.objectContaining({
          id: 'mission-brief',
          budgetTokens: 500,
        }),
        expect.objectContaining({
          id: 'resume-context',
          budgetTokens: 1500,
        }),
      ]),
    );
    expect(promptBrief.defaultResumeEstimatedTokens).toBeGreaterThan(0);
    expect(handoff).toEqual(
      expect.objectContaining({
        type: 'discussion-handoff',
        handoffKind: 'workflow-resume',
        activeMissionId: started.missionId,
      }),
    );
    expect(handoff.acceptedDecisions.length).toBeGreaterThan(0);
    expect(handoff.linkedCheckpointIds.length).toBeGreaterThan(0);
    expect(handoff.linkedArtifactPaths).toEqual(
      expect.arrayContaining(['.skopos/agent/program-brief.json', '.skopos/questions.json']),
    );
    expect(discussionIndex).toEqual(
      expect.objectContaining({
        type: 'discussion-index',
        latestCheckpointId: expect.any(String),
      }),
    );
    expect(discussionIndex.checkpointCount).toBeGreaterThan(0);
    expect(discussionIndex.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: handoff.linkedCheckpointIds[0],
          activeMissionId: started.missionId,
        }),
      ]),
    );
    expect(tokenTelemetry).toEqual(
      expect.objectContaining({
        type: 'token-telemetry',
        activeMissionId: started.missionId,
      }),
    );
    expect(tokenTelemetry.measurementCount).toBeGreaterThanOrEqual(6);
    expect(tokenTelemetry.measurements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'latest-handoff',
          surfaceKind: 'discussion-handoff',
          budgetTokens: 1200,
        }),
        expect.objectContaining({
          id: 'resume-context',
          surfaceKind: 'resume-context',
          budgetTokens: 1500,
        }),
      ]),
    );
    expect(index.counts.agentBriefCount).toBe(6);
    expect(index.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'agent-brief-artifact',
          path: '.skopos/agent/trust-brief.json',
        }),
        expect.objectContaining({
          kind: 'agent-brief-artifact',
          path: '.skopos/agent/done-brief.json',
        }),
        expect.objectContaining({
          kind: 'agent-brief-artifact',
          path: '.skopos/agent/program-brief.json',
        }),
        expect.objectContaining({
          kind: 'agent-brief-artifact',
          path: '.skopos/agent/prompt-brief.json',
        }),
        expect.objectContaining({
          kind: 'telemetry-artifact',
          path: '.skopos/agent/token-telemetry.json',
        }),
        expect.objectContaining({
          kind: 'discussion-artifact',
          path: '.skopos/discussions/handoffs/latest-workflow.json',
        }),
        expect.objectContaining({
          kind: 'discussion-artifact',
          path: '.skopos/discussions/index.json',
        }),
        expect.objectContaining({
          kind: 'agent-brief-artifact',
          path: `.skopos/agent/missions/${started.missionId}.json`,
        }),
        expect.objectContaining({
          kind: 'agent-brief-artifact',
          path: `.skopos/agent/evals/${started.missionId}.json`,
        }),
      ]),
    );
  });

  it('stores compact shell output excerpts in workflow and eval artifacts', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);

    const workflowRun = runCliJson<{
      id: string;
    }>([
      'workflows',
      'run',
      'graph.render-local-portal',
      workspaceDir,
      '--actor',
      'agent-excerpts',
      '--json',
    ]);

    const workflowArtifact = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'runs', `${workflowRun.id}.json`), 'utf8'),
    ) as {
      stdoutExcerpt?: string;
      stderrExcerpt?: string;
    };

    expect(workflowArtifact.stdoutExcerpt?.length ?? 0).toBeLessThanOrEqual(1200);
    expect(workflowArtifact.stdoutExcerpt).toBeDefined();
    expect(workflowArtifact.stderrExcerpt).toBeUndefined();

    const started = runCliJson<{
      missionId: string;
      questions: {
        entries: Array<{ id: string; recommendedOptionId: string; status: string }>;
      };
    }>([
      'start',
      'verify shell output excerpt budgeting',
      workspaceDir,
      '--actor',
      'agent-excerpts',
      '--json',
    ]);

    for (const question of started.questions.entries.filter((entry) => entry.status === 'open')) {
      runCliJson([
        'decide',
        question.id,
        question.recommendedOptionId,
        workspaceDir,
        '--actor',
        'agent-excerpts',
        '--json',
      ]);
    }

    runCliJson([
      'eval',
      workspaceDir,
      '--mission',
      started.missionId,
      '--actor',
      'agent-excerpts',
      '--json',
    ]);

    const evalArtifact = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'evals', `${started.missionId}.json`), 'utf8'),
    ) as {
      checkRuns: Array<{ stdoutExcerpt?: string; stderrExcerpt?: string }>;
    };

    const stdoutExcerpts = evalArtifact.checkRuns
      .map((entry) => entry.stdoutExcerpt)
      .filter((value): value is string => typeof value === 'string');

    expect(stdoutExcerpts.length).toBeGreaterThan(0);
    expect(stdoutExcerpts.every((value) => value.length <= 1200)).toBe(true);
  });

  it('appends raw discussion journals and exposes recent resume context through discuss commands', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);

    const started = runCliJson<{
      missionId: string;
      questions: {
        entries: Array<{ id: string; recommendedOptionId: string; status: string }>;
      };
    }>([
      'start',
      'capture raw discussion turns and lifecycle context',
      workspaceDir,
      '--actor',
      'discussion-lane',
      '--json',
    ]);
    const startDiscussionIndex = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'discussions', 'index.json'), 'utf8'),
    ) as {
      latestCheckpointPath: string;
    };
    const startCheckpoint = JSON.parse(
      await readFile(join(workspaceDir, startDiscussionIndex.latestCheckpointPath), 'utf8'),
    ) as {
      promotionTrigger?: string;
      promotionKinds?: string[];
    };

    for (const question of started.questions.entries.filter((entry) => entry.status === 'open')) {
      runCliJson([
        'decide',
        question.id,
        question.recommendedOptionId,
        workspaceDir,
        '--actor',
        'discussion-lane',
        '--json',
      ]);
    }
    const decidedDiscussionIndex = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'discussions', 'index.json'), 'utf8'),
    ) as {
      latestCheckpointPath: string;
    };
    const decidedCheckpoint = JSON.parse(
      await readFile(join(workspaceDir, decidedDiscussionIndex.latestCheckpointPath), 'utf8'),
    ) as {
      promotionTrigger?: string;
      promotionKinds?: string[];
    };

    const appended = runCliJson<{
      journalWrite: string;
      threadId: string;
      journalPath: string;
      record?: { role: string; sourceEvent: string };
    }>([
      'discuss',
      'append-turn',
      workspaceDir,
      '--session-id',
      'session-123',
      '--role',
      'user',
      '--source-event',
      'user-prompt-submit',
      '--message',
      'Please keep the latest workflow state compact.',
      '--json',
    ]);
    const checkpoint = runCliJson<{
      checkpointWrite: string;
      checkpointPath: string;
      indexWrite: string;
    }>(['discuss', 'checkpoint', workspaceDir, '--json']);
    const initialDiscussionIndex = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'discussions', 'index.json'), 'utf8'),
    ) as {
      latestCheckpointId: string;
      checkpointCount: number;
    };

    runCliJson(['next', workspaceDir, '--actor', 'discussion-lane', '--json']);
    runCliJson(['program', 'sync', workspaceDir, '--actor', 'discussion-lane', '--json']);

    const handoff = runCliJson<{
      handoffWrite: string;
      handoffPath: string;
      handoff: { linkedCheckpointIds: string[] };
    }>(['discuss', 'handoff', workspaceDir, '--json']);
    const finalDiscussionIndex = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'discussions', 'index.json'), 'utf8'),
    ) as {
      latestCheckpointId: string;
      checkpointCount: number;
    };
    const recent = runCliJson<{
      latestHandoffPath?: string;
      latestJournalPath?: string;
      latestJournalTurnCount: number;
      additionalContext?: string;
      recentCheckpoints: Array<{ id: string }>;
    }>(['discuss', 'recent', workspaceDir, '--json']);

    const journalContents = await readFile(
      join(workspaceDir, '.skopos', 'discussions', 'raw', 'session-session-123.jsonl'),
      'utf8',
    );
    const journalEntries = journalContents
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as { role: string; sourceEvent: string; message: string });

    expect(appended.journalWrite).toBe('written');
    expect(appended.threadId).toBe('session:session-123');
    expect(appended.record).toEqual(
      expect.objectContaining({
        role: 'user',
        sourceEvent: 'user-prompt-submit',
      }),
    );
    expect(startCheckpoint.promotionTrigger).toBe('workflow-start');
    expect(startCheckpoint.promotionKinds).toContain('initial-state');
    expect(decidedCheckpoint.promotionTrigger).toBe('workflow-decision');
    expect(
      decidedCheckpoint.promotionKinds?.some((kind) =>
        ['accepted-decisions-changed', 'open-questions-changed'].includes(kind),
      ),
    ).toBe(true);
    expect(checkpoint.checkpointWrite).toMatch(/written|unchanged/);
    expect(checkpoint.indexWrite).toMatch(/written|unchanged/);
    expect(finalDiscussionIndex.latestCheckpointId).toBe(initialDiscussionIndex.latestCheckpointId);
    expect(finalDiscussionIndex.checkpointCount).toBe(initialDiscussionIndex.checkpointCount);
    expect(handoff.handoffWrite).toBe('written');
    expect(handoff.handoff.linkedCheckpointIds.length).toBeGreaterThan(0);
    expect(handoff.handoff.linkedCheckpointIds[0]).toBe(initialDiscussionIndex.latestCheckpointId);
    expect(recent.latestHandoffPath).toContain('latest-workflow.json');
    expect(recent.latestJournalPath).toContain('session-session-123.jsonl');
    expect(recent.latestJournalTurnCount).toBeGreaterThan(0);
    expect(recent.additionalContext).toContain('Skopos resume context:');
    expect(recent.recentCheckpoints.length).toBeGreaterThan(0);
    expect(journalEntries).toEqual([
      expect.objectContaining({
        role: 'user',
        sourceEvent: 'user-prompt-submit',
        message: 'Please keep the latest workflow state compact.',
      }),
    ]);
  });

  it('does not promote a new discussion checkpoint for actor-only command changes', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);

    runCliJson([
      'start',
      'keep discussion checkpoint history semantic',
      workspaceDir,
      '--actor',
      'agent-one',
      '--json',
    ]);
    const initialDiscussionIndex = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'discussions', 'index.json'), 'utf8'),
    ) as {
      latestCheckpointId: string;
      checkpointCount: number;
    };

    runCliJson(['next', workspaceDir, '--actor', 'agent-two', '--json']);
    const checkpoint = runCliJson<{
      checkpointWrite: string;
      indexWrite: string;
    }>(['discuss', 'checkpoint', workspaceDir, '--json']);
    const finalDiscussionIndex = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'discussions', 'index.json'), 'utf8'),
    ) as {
      latestCheckpointId: string;
      checkpointCount: number;
    };

    expect(checkpoint.checkpointWrite).toBe('unchanged');
    expect(finalDiscussionIndex.latestCheckpointId).toBe(initialDiscussionIndex.latestCheckpointId);
    expect(finalDiscussionIndex.checkpointCount).toBe(initialDiscussionIndex.checkpointCount);
  });

  it('imports raw discussion turns from the latest matching local Codex session log', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    const codexHome = await mkdtemp(join(tmpdir(), 'skopos-codex-home-'));
    tempDirs.push(codexHome);
    runCliJson(['init', workspaceDir, '--json']);

    const sessionId = '019d83c6-05cf-7333-ad78-c0b0ad5488da';
    const olderSessionId = '019d6cd4-3347-7dd0-b2cc-51bffab97bdc';
    const sessionDir = join(codexHome, 'sessions', '2026', '04', '13');
    const sessionPath = join(sessionDir, `rollout-${sessionId}.jsonl`);
    const olderSessionDir = join(codexHome, 'sessions', '2026', '04', '08');
    const olderSessionPath = join(olderSessionDir, `rollout-${olderSessionId}.jsonl`);
    await mkdir(sessionDir, { recursive: true });
    await mkdir(olderSessionDir, { recursive: true });
    await writeFile(
      olderSessionPath,
      [
        JSON.stringify({
          timestamp: '2026-04-08T16:52:19.607Z',
          type: 'session_meta',
          payload: {
            id: olderSessionId,
            cwd: dirname(workspaceDir),
          },
        }),
        JSON.stringify({
          timestamp: '2026-04-08T16:52:20.000Z',
          type: 'response_item',
          payload: {
            type: 'message',
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: 'This older session should not win.',
              },
            ],
          },
        }),
      ].join('\n').concat('\n'),
      'utf8',
    );
    await writeFile(
      sessionPath,
      [
        JSON.stringify({
          timestamp: '2026-04-12T22:18:47.607Z',
          type: 'session_meta',
          payload: {
            id: sessionId,
            cwd: workspaceDir,
          },
        }),
        JSON.stringify({
          timestamp: '2026-04-12T22:18:47.611Z',
          type: 'response_item',
          payload: {
            type: 'message',
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: '# AGENTS.md instructions for /tmp/workspace',
              },
            ],
          },
        }),
        JSON.stringify({
          timestamp: '2026-04-12T22:18:47.612Z',
          type: 'response_item',
          payload: {
            type: 'message',
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: 'Show the latest discussion context in Skopos.',
              },
            ],
          },
        }),
        JSON.stringify({
          timestamp: '2026-04-12T22:18:57.465Z',
          type: 'response_item',
          payload: {
            type: 'message',
            role: 'assistant',
            content: [
              {
                type: 'output_text',
                text: 'I will import the current Codex session into the raw discussion journal.',
              },
            ],
          },
        }),
      ].join('\n').concat('\n'),
      'utf8',
    );

    const firstSyncOutput = execFileSync('node', ['--import', 'tsx', cliEntrypoint, 'discuss', 'sync-codex', workspaceDir, '--json'], {
      cwd: cliPackageRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        CODEX_HOME: codexHome,
      },
    });
    const firstSync = JSON.parse(firstSyncOutput) as {
      sourceSessionId?: string;
      journalPath?: string;
      importedTurnCount: number;
      totalJournalTurnCount: number;
      journalWrite: string;
    };

    const journalPath = join(
      workspaceDir,
      '.skopos',
      'discussions',
      'raw',
      'session-019d83c6-05cf-7333-ad78-c0b0ad5488da.jsonl',
    );
    const journalContents = await readFile(journalPath, 'utf8');
    const journalEntries = journalContents
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as { role: string; sourceEvent: string; message: string });

    expect(firstSync.sourceSessionId).toBe(sessionId);
    expect(firstSync.journalPath).toBe(journalPath);
    expect(firstSync.importedTurnCount).toBe(2);
    expect(firstSync.totalJournalTurnCount).toBe(2);
    expect(firstSync.journalWrite).toBe('written');
    expect(journalEntries).toEqual([
      expect.objectContaining({
        role: 'user',
        sourceEvent: 'user-prompt-submit',
        message: 'Show the latest discussion context in Skopos.',
      }),
      expect.objectContaining({
        role: 'assistant',
        sourceEvent: 'assistant-turn',
        message: 'I will import the current Codex session into the raw discussion journal.',
      }),
    ]);

    const secondSyncOutput = execFileSync('node', ['--import', 'tsx', cliEntrypoint, 'discuss', 'sync-codex', workspaceDir, '--json'], {
      cwd: cliPackageRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        CODEX_HOME: codexHome,
      },
    });
    const secondSync = JSON.parse(secondSyncOutput) as {
      importedTurnCount: number;
      totalJournalTurnCount: number;
      journalWrite: string;
    };

    expect(secondSync.importedTurnCount).toBe(0);
    expect(secondSync.totalJournalTurnCount).toBe(2);
    expect(secondSync.journalWrite).toBe('unchanged');
  });

  it('segments parent Codex sessions to import only workspace-relevant discussion turns', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    const codexHome = await mkdtemp(join(tmpdir(), 'skopos-codex-home-parent-'));
    tempDirs.push(codexHome);
    runCliJson(['init', workspaceDir, '--json']);

    const sessionId = '019d9999-parent-session';
    const sessionDir = join(codexHome, 'sessions', '2026', '04', '13');
    const sessionPath = join(sessionDir, `rollout-${sessionId}.jsonl`);
    await mkdir(sessionDir, { recursive: true });
    await writeFile(
      sessionPath,
      [
        JSON.stringify({
          timestamp: '2026-04-13T00:00:00.000Z',
          type: 'session_meta',
          payload: {
            id: sessionId,
            cwd: dirname(workspaceDir),
          },
        }),
        JSON.stringify({
          timestamp: '2026-04-13T00:00:01.000Z',
          type: 'response_item',
          payload: {
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: 'Do unrelated repo-root cleanup first.' }],
          },
        }),
        JSON.stringify({
          timestamp: '2026-04-13T00:00:02.000Z',
          type: 'response_item',
          payload: {
            type: 'message',
            role: 'assistant',
            content: [{ type: 'output_text', text: 'I will handle the unrelated root cleanup.' }],
          },
        }),
        JSON.stringify({
          timestamp: '2026-04-13T00:00:02.500Z',
          type: 'response_item',
          payload: {
            type: 'function_call_output',
            call_id: 'call-root-noise',
            output: `Read /tmp/noise plus ${join(workspaceDir, 'packages/ui/src/features/work/discussion-sections.tsx')} from a pasted artifact blob.`,
          },
        }),
        JSON.stringify({
          timestamp: '2026-04-13T00:01:00.000Z',
          type: 'response_item',
          payload: {
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: 'Fix the Skopos discussion route and raw journal behavior.' }],
          },
        }),
        JSON.stringify({
          timestamp: '2026-04-13T00:01:01.000Z',
          type: 'event_msg',
          payload: {
            type: 'exec_command_end',
            turn_id: 'turn-skopos',
            cwd: dirname(workspaceDir),
            parsed_cmd: [
              {
                path: join(workspaceDir, 'packages/ui/src/features/work/discussion-sections.tsx'),
              },
            ],
            aggregated_output: `M ${join(workspaceDir, 'packages/ui/src/features/work/discussion-sections.tsx')}`,
          },
        }),
        JSON.stringify({
          timestamp: '2026-04-13T00:01:02.000Z',
          type: 'response_item',
          payload: {
            type: 'message',
            role: 'assistant',
            content: [{ type: 'output_text', text: 'I am updating the Skopos discussion surfaces now.' }],
          },
        }),
      ].join('\n').concat('\n'),
      'utf8',
    );

    const syncOutput = execFileSync(
      'node',
      ['--import', 'tsx', cliEntrypoint, 'discuss', 'sync-codex', workspaceDir, '--json'],
      {
        cwd: cliPackageRoot,
        encoding: 'utf8',
        env: {
          ...process.env,
          CODEX_HOME: codexHome,
        },
      },
    );
    const syncResult = JSON.parse(syncOutput) as {
      matchMode?: string;
      sourceSessionId?: string;
      importedTurnCount: number;
      journalWrite: string;
    };

    const journalPath = join(
      workspaceDir,
      '.skopos',
      'discussions',
      'raw',
      'session-019d9999-parent-session.jsonl',
    );
    const journalEntries = (await readFile(journalPath, 'utf8'))
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as { role: string; message: string });

    expect(syncResult.matchMode).toBe('segmented-parent-session');
    expect(syncResult.sourceSessionId).toBe(sessionId);
    expect(syncResult.importedTurnCount).toBe(2);
    expect(syncResult.journalWrite).toBe('written');
    expect(journalEntries).toEqual([
      expect.objectContaining({
        role: 'user',
        message: 'Fix the Skopos discussion route and raw journal behavior.',
      }),
      expect.objectContaining({
        role: 'assistant',
        message: 'I am updating the Skopos discussion surfaces now.',
      }),
    ]);
  });

  it('generates a Claude Code hook adapter that syncs discussion continuity, instructions, and closure enforcement', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const settingsPath = join(workspaceDir, '.skopos', 'tooling', 'claude-code', 'settings.json');
    const sessionStartHookPath = join(
      workspaceDir,
      '.skopos',
      'tooling',
      'claude-code',
      'hooks',
      'session-start-hook.mjs',
    );
    const userPromptSubmitHookPath = join(
      workspaceDir,
      '.skopos',
      'tooling',
      'claude-code',
      'hooks',
      'user-prompt-submit-hook.mjs',
    );
    const postEditHookPath = join(
      workspaceDir,
      '.skopos',
      'tooling',
      'claude-code',
      'hooks',
      'post-edit-hook.mjs',
    );
    const preCompactHookPath = join(
      workspaceDir,
      '.skopos',
      'tooling',
      'claude-code',
      'hooks',
      'pre-compact-hook.mjs',
    );
    const stopHookPath = join(
      workspaceDir,
      '.skopos',
      'tooling',
      'claude-code',
      'hooks',
      'stop-hook.mjs',
    );
    const settings = JSON.parse(await readFile(settingsPath, 'utf8')) as {
      hooks: {
        SessionStart: Array<{ hooks: Array<{ type: string; command: string }> }>;
        UserPromptSubmit: Array<{ hooks: Array<{ type: string; command: string }> }>;
        PostToolUse: Array<{ matcher: string; hooks: Array<{ type: string; command: string }> }>;
        PreCompact: Array<{ matcher: string; hooks: Array<{ type: string; command: string }> }>;
        Stop: Array<{ hooks: Array<{ type: string; command: string }> }>;
      };
    };

    expect(settings.hooks.SessionStart[0]?.hooks[0]?.type).toBe('command');
    expect(settings.hooks.UserPromptSubmit[0]?.hooks[0]?.type).toBe('command');
    expect(settings.hooks.PostToolUse[0]?.matcher).toBe('Edit|Write|MultiEdit');
    expect(settings.hooks.PreCompact[0]?.matcher).toBe('*');
    expect(settings.hooks.Stop[0]?.hooks[0]?.type).toBe('command');

    const started = runCliJson<{
      missionId: string;
      questions: {
        entries: Array<{ id: string; recommendedOptionId: string; status: string }>;
      };
    }>([
      'start',
      'exercise the Claude hook adapter discussion continuity lane',
      workspaceDir,
      '--actor',
      'hook-test',
      '--json',
    ]);

    for (const question of started.questions.entries.filter((entry) => entry.status === 'open')) {
      runCliJson([
        'decide',
        question.id,
        question.recommendedOptionId,
        workspaceDir,
        '--actor',
        'hook-test',
        '--json',
      ]);
    }

    const sessionStartOutput = execFileSync('node', [sessionStartHookPath], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        CLAUDE_PROJECT_DIR: workspaceDir,
        SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
        SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
        SKOPOS_CLI_CWD: cliPackageRoot,
      },
      input: JSON.stringify({
        cwd: workspaceDir,
        session_id: 'session-hook',
        hook_event_name: 'SessionStart',
      }),
    });
    const sessionStartDecision = JSON.parse(sessionStartOutput) as {
      hookSpecificOutput: { hookEventName: string; additionalContext: string };
    };

    expect(sessionStartDecision.hookSpecificOutput.hookEventName).toBe('SessionStart');
    expect(sessionStartDecision.hookSpecificOutput.additionalContext).toContain(
      'Skopos resume context:',
    );
    expect(sessionStartDecision.hookSpecificOutput.additionalContext).toContain(
      'Skopos workflow router:',
    );

    execFileSync('node', [userPromptSubmitHookPath], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        CLAUDE_PROJECT_DIR: workspaceDir,
        SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
        SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
        SKOPOS_CLI_CWD: cliPackageRoot,
      },
      input: JSON.stringify({
        cwd: workspaceDir,
        session_id: 'session-hook',
        transcript_path: '/tmp/transcript.jsonl',
        hook_event_name: 'UserPromptSubmit',
        prompt: 'Track this discussion turn in the raw journal.',
      }),
    });
    expect(
      await readFile(join(workspaceDir, '.skopos', 'discussions', 'raw', 'session-session-hook.jsonl'), 'utf8'),
    ).toContain('Track this discussion turn in the raw journal.');

    execFileSync('node', [preCompactHookPath], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        CLAUDE_PROJECT_DIR: workspaceDir,
        SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
        SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
        SKOPOS_CLI_CWD: cliPackageRoot,
      },
      input: JSON.stringify({
        cwd: workspaceDir,
        session_id: 'session-hook',
        transcript_path: '/tmp/transcript.jsonl',
        hook_event_name: 'PreCompact',
        trigger: 'auto',
        custom_instructions: '',
      }),
    });
    const handoff = JSON.parse(
      await readFile(
        join(workspaceDir, '.skopos', 'discussions', 'handoffs', 'latest-workflow.json'),
        'utf8',
      ),
    ) as {
      linkedCheckpointIds: string[];
    };

    expect(handoff.linkedCheckpointIds.length).toBeGreaterThan(0);

    await writeFile(
      join(workspaceDir, 'AGENTS.md'),
      `${await readFile(join(workspaceDir, 'AGENTS.md'), 'utf8')}\nEnforcement sync marker\n`,
      'utf8',
    );
    execFileSync('node', [postEditHookPath], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        CLAUDE_PROJECT_DIR: workspaceDir,
        SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
        SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
        SKOPOS_CLI_CWD: cliPackageRoot,
      },
      input: JSON.stringify({
        cwd: workspaceDir,
        tool_input: {
          file_path: join(workspaceDir, 'AGENTS.md'),
        },
      }),
    });

    const claudeMirror = await readFile(join(workspaceDir, 'CLAUDE.md'), 'utf8');
    expect(claudeMirror).toContain('Enforcement sync marker');

    initializeGitWorkspace(workspaceDir);
    commitWorkspace(workspaceDir, 'baseline');

    await writeFile(
      join(workspaceDir, 'packages/api/package.json'),
      `${await readFile(join(workspaceDir, 'packages/api/package.json'), 'utf8')}\n`,
      'utf8',
    );

    const stopOutput = execFileSync('node', [stopHookPath], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        CLAUDE_PROJECT_DIR: workspaceDir,
        SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
        SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
        SKOPOS_CLI_CWD: cliPackageRoot,
      },
      input: JSON.stringify({
        cwd: workspaceDir,
        hook_event_name: 'Stop',
        session_id: 'session-hook',
        transcript_path: '/tmp/transcript.jsonl',
        last_assistant_message: 'This is the latest assistant response.',
      }),
    });
    const stopDecision = JSON.parse(stopOutput) as { decision: string; reason: string };

    expect(stopDecision.decision).toBe('block');
    expect(stopDecision.reason).toContain('skopos next');
    expect(
      await readFile(join(workspaceDir, '.skopos', 'discussions', 'raw', 'session-session-hook.jsonl'), 'utf8'),
    ).toContain('This is the latest assistant response.');
  });

  it('generates a Codex wrapper adapter that loads compact resume context from discuss recent', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const adapterManifestPath = join(
      workspaceDir,
      '.skopos',
      'tooling',
      'codex',
      'adapter-manifest.json',
    );
    const adapterEntrypointPath = join(
      workspaceDir,
      '.skopos',
      'tooling',
      'codex',
      'codex-discussion-adapter.mjs',
    );

    const started = runCliJson<{
      missionId: string;
      questions: {
        entries: Array<{ id: string; recommendedOptionId: string; status: string }>;
      };
    }>([
      'start',
      'exercise the Codex wrapper adapter discussion continuity lane',
      workspaceDir,
      '--actor',
      'codex-test',
      '--json',
    ]);

    for (const question of started.questions.entries.filter((entry) => entry.status === 'open')) {
      runCliJson([
        'decide',
        question.id,
        question.recommendedOptionId,
        workspaceDir,
        '--actor',
        'codex-test',
        '--json',
      ]);
    }

    const manifest = JSON.parse(await readFile(adapterManifestPath, 'utf8')) as {
      toolId: string;
      supportTier: string;
      events: {
        sessionStart: { command: string };
        userTurn: { command: string };
        assistantTurn: { command: string };
        majorStateChange: { command: string };
        preCompact: { command: string };
        stop: { command: string };
      };
    };

    expect(manifest.toolId).toBe('codex');
    expect(manifest.supportTier).toBe('wrapper-mediated');
    expect(manifest.events.sessionStart.command).toContain('session-start');
    expect(manifest.events.preCompact.command).toContain('pre-compact');
    expect(manifest.events.stop.command).toContain('stop');

    const sessionStartOutput = execFileSync('node', [adapterEntrypointPath, 'session-start'], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        CODEX_PROJECT_DIR: workspaceDir,
        SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
        SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
        SKOPOS_CLI_CWD: cliPackageRoot,
      },
      input: JSON.stringify({
        cwd: workspaceDir,
        sessionId: 'codex-session',
      }),
    });
    const sessionStartReport = JSON.parse(sessionStartOutput) as {
      additionalContext?: string;
    };

    expect(sessionStartReport.additionalContext).toContain('Skopos resume context:');
    expect(sessionStartReport.additionalContext).toContain('Skopos workflow router:');

    execFileSync('node', [adapterEntrypointPath, 'user-turn'], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        CODEX_PROJECT_DIR: workspaceDir,
        SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
        SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
        SKOPOS_CLI_CWD: cliPackageRoot,
      },
      input: JSON.stringify({
        cwd: workspaceDir,
        sessionId: 'codex-session',
        threadId: 'codex-thread',
        message: 'Keep resume context compact for Codex.',
      }),
    });

    execFileSync('node', [adapterEntrypointPath, 'assistant-turn'], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        CODEX_PROJECT_DIR: workspaceDir,
        SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
        SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
        SKOPOS_CLI_CWD: cliPackageRoot,
      },
      input: JSON.stringify({
        cwd: workspaceDir,
        sessionId: 'codex-session',
        threadId: 'codex-thread',
        message: 'Acknowledged. I will use the compact handoff only.',
      }),
    });

    const rawJournal = await readFile(
      join(workspaceDir, '.skopos', 'discussions', 'raw', 'codex-thread.jsonl'),
      'utf8',
    );
    expect(rawJournal).toContain('Keep resume context compact for Codex.');
    expect(rawJournal).toContain('Acknowledged. I will use the compact handoff only.');

    execFileSync('node', [adapterEntrypointPath, 'major-state-change'], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        CODEX_PROJECT_DIR: workspaceDir,
        SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
        SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
        SKOPOS_CLI_CWD: cliPackageRoot,
      },
      input: JSON.stringify({
        cwd: workspaceDir,
      }),
    });

    const preCompactOutput = execFileSync('node', [adapterEntrypointPath, 'pre-compact'], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        CODEX_PROJECT_DIR: workspaceDir,
        SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
        SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
        SKOPOS_CLI_CWD: cliPackageRoot,
      },
      input: JSON.stringify({
        cwd: workspaceDir,
      }),
    });
    const preCompactReport = JSON.parse(preCompactOutput) as { handoff?: { resumeSummary: string } };

    expect(preCompactReport.handoff?.resumeSummary).toContain('Resume mission');

    const stopOutput = execFileSync('node', [adapterEntrypointPath, 'stop'], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        CODEX_PROJECT_DIR: workspaceDir,
        SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
        SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
        SKOPOS_CLI_CWD: cliPackageRoot,
      },
      input: JSON.stringify({
        cwd: workspaceDir,
        sessionId: 'codex-session',
        threadId: 'codex-thread',
        message: 'Stop only after the routed Skopos next step.',
      }),
    });
    const stopDecision = JSON.parse(stopOutput) as { decision: string; reason: string };

    expect(stopDecision.decision).toBe('block');
    expect(stopDecision.reason).toContain('skopos next');
  });

  it('generates a manual host adapter guide for unsupported coding agents', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const guidePath = join(workspaceDir, '.skopos', 'tooling', 'manual-hosts', 'README.md');
    const enforcementPath = join(workspaceDir, '.skopos', 'enforcement.json');
    const guide = await readFile(guidePath, 'utf8');
    const enforcement = JSON.parse(await readFile(enforcementPath, 'utf8')) as {
      toolAdapters: Array<{
        toolId: string;
        supportTier: string;
        supportStatus: string;
        path: string;
        workflowRouterCoverage: {
          sessionStart: boolean;
          stopBoundary: boolean;
        };
      }>;
    };
    const adapter = enforcement.toolAdapters.find((entry) => entry.toolId === 'manual-hosts');

    expect(guide).toContain('Manual Host Adapter');
    expect(guide).toContain('skopos program next <project-root> --compact --json');
    expect(guide).toContain('skopos done --cwd <project-root> --json');
    expect(adapter).toEqual(
      expect.objectContaining({
        supportTier: 'manual-fallback',
        supportStatus: 'manual-only',
        path: '.skopos/tooling/manual-hosts/README.md',
        workflowRouterCoverage: {
          sessionStart: true,
          stopBoundary: true,
        },
      }),
    );
  });

  it('blocks Claude stop with the workflow-router command when the next Skopos step is explicit', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);

    const settingsPath = join(
      workspaceDir,
      '.skopos',
      'tooling',
      'claude-code',
      'settings.json',
    );
    const settings = JSON.parse(await readFile(settingsPath, 'utf8')) as {
      hooks: {
        Stop: Array<{ hooks: Array<{ command: string }> }>;
      };
    };
    const stopHookPath = join(
      workspaceDir,
      '.skopos',
      'tooling',
      'claude-code',
      'hooks',
      'stop-hook.mjs',
    );

    runCliJson([
      'start',
      'add public api endpoint for billing summaries',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'hook-router',
      '--json',
    ]);

    const stopOutput = execFileSync('node', [stopHookPath], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        CLAUDE_PROJECT_DIR: workspaceDir,
        SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
        SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
        SKOPOS_CLI_CWD: cliPackageRoot,
      },
      input: JSON.stringify({
        cwd: workspaceDir,
        hook_event_name: 'Stop',
        session_id: 'session-hook-router',
        last_assistant_message: 'Need the next routed Skopos step.',
      }),
    });
    const stopDecision = JSON.parse(stopOutput) as { decision: string; reason: string };

    expect(stopDecision.decision).toBe('block');
    expect(stopDecision.reason).toContain('skopos decide plan.public-api-change');
    expect(stopDecision.reason).toContain('before stopping');
  });

  it('diagnoses a messy repo and suggests remediation missions', async () => {
    const workspaceDir = await createTempWorkspace(messyFixtureRepoRoot);

    const diagnosis = runCliJson<{
      actorId?: string;
      diagnosisPath: string;
      diagnosisWrite: string;
      symbolsPath: string;
      symbolsWrite: string;
      duplicatesPath: string;
      duplicatesWrite: string;
      contradictionsPath: string;
      contradictionsWrite: string;
      indexPath: string;
      indexWrite: string;
      logPath: string;
      logWrite: string;
      health: string;
      findings: Array<{ id: string; classification: string; severity: string }>;
      remediationMissions: Array<{ id: string; title: string; priority: string }>;
    }>(['scan', workspaceDir, '--actor', 'agent-diagnosis', '--json']);

    expect(diagnosis.health).toBe('at-risk');
    expect(diagnosis.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'docs-root',
          classification: 'poor',
          severity: 'high',
        }),
        expect.objectContaining({
          id: 'instruction-surface',
          classification: 'conflicting',
          severity: 'high',
        }),
        expect.objectContaining({
          id: 'command-surface',
          classification: 'conflicting',
          severity: 'high',
        }),
      ]),
    );
    expect(diagnosis.remediationMissions.map((mission) => mission.id)).toEqual(
      expect.arrayContaining([
        'remediate.docs-root',
        'remediate.instruction-surface',
        'remediate.command-surface',
        'remediate.workspace-structure',
      ]),
    );
    expect(diagnosis.actorId).toBe('agent-diagnosis');
    expect(diagnosis.diagnosisWrite).toBe('written');
    expect(diagnosis.symbolsWrite).toBe('written');
    expect(diagnosis.duplicatesWrite).toBe('written');
    expect(diagnosis.contradictionsWrite).toBe('written');
    expect(diagnosis.indexWrite).toBe('written');
    expect(diagnosis.logWrite).toBe('written');

    const persistedDiagnosis = JSON.parse(await readFile(diagnosis.diagnosisPath, 'utf8')) as {
      health: string;
      findings: Array<{ id: string }>;
    };
    const contradictions = JSON.parse(await readFile(diagnosis.contradictionsPath, 'utf8')) as {
      entries: Array<{ source: string; relatedIds: string[] }>;
    };
    const duplicates = JSON.parse(await readFile(diagnosis.duplicatesPath, 'utf8')) as {
      entries: Array<{ kind: string; key: string }>;
    };
    expect(persistedDiagnosis.health).toBe('at-risk');
    expect(persistedDiagnosis.findings.map((finding) => finding.id)).toEqual(
      expect.arrayContaining(['docs-root', 'instruction-surface', 'command-surface']),
    );
    expect(
      contradictions.entries.some(
        (entry) =>
          entry.source === 'diagnosis' &&
          entry.relatedIds.includes('instruction-surface') &&
          entry.relatedIds.includes('command-surface'),
      ),
    ).toBe(false);
    expect(
      contradictions.entries.some(
        (entry) =>
          entry.source === 'diagnosis' &&
          entry.relatedIds.includes('instruction-surface'),
      ),
    ).toBe(true);
    expect(
      duplicates.entries.some(
        (entry) => entry.kind === 'package-command' && entry.key === 'build',
      ),
    ).toBe(true);

    const index = JSON.parse(await readFile(diagnosis.indexPath, 'utf8')) as {
      latestEvent?: { eventKind: string; status: string };
    };
    const logEntries = (await readFile(diagnosis.logPath, 'utf8'))
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(
        (line) =>
          JSON.parse(line) as {
            eventKind: string;
            status: string;
            metadata?: { actorId?: string | null };
          },
      );

    expect(index.latestEvent).toEqual(
      expect.objectContaining({
        eventKind: 'scan',
        status: 'succeeded',
      }),
    );
    expect(logEntries.at(-1)).toEqual(
      expect.objectContaining({
        eventKind: 'scan',
        status: 'succeeded',
        metadata: expect.objectContaining({
          actorId: 'agent-diagnosis',
        }),
      }),
    );
  });

  it('warns when docs are stale or missing a canonical start-here router', async () => {
    const workspaceDir = await createTempWorkspace(staleDocsFixtureRepoRoot);

    const init = runCliJson<{
      bootstrap: {
        detected: {
          docsHealth: {
            hasStartHere: boolean;
            freshnessTrackedCount: number;
            staleDocPaths: string[];
          };
        };
      };
    }>(['init', workspaceDir, '--json']);
    const diagnosis = runCliJson<{
      health: string;
      findings: Array<{ id: string; classification: string; severity: string }>;
      remediationMissions: Array<{ id: string }>;
    }>(['scan', workspaceDir, '--json']);
    const trust = runCliJson<{
      readiness: string;
      checks: Array<{ id: string; status: string }>;
    }>(['trust', workspaceDir, '--json']);

    expect(init.bootstrap.detected.docsHealth).toEqual(
      expect.objectContaining({
        hasStartHere: false,
        freshnessTrackedCount: 2,
        staleDocPaths: ['docs/architecture.md', 'docs/overview.md'],
      }),
    );
    expect(diagnosis.health).toBe('needs-stabilization');
    expect(diagnosis.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'docs-root',
          classification: 'recommended',
          severity: 'medium',
        }),
        expect.objectContaining({
          id: 'docs-freshness',
          classification: 'recommended',
          severity: 'medium',
        }),
      ]),
    );
    expect(diagnosis.remediationMissions.map((mission) => mission.id)).toEqual(
      expect.arrayContaining(['remediate.docs-root', 'remediate.docs-freshness']),
    );
    expect(trust.readiness).toBe('needs-review');
    expect(trust.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'docs-router',
          status: 'warn',
        }),
        expect.objectContaining({
          id: 'docs-freshness',
          status: 'warn',
        }),
      ]),
    );
  });

  it('writes canonical overrides and applies them during bootstrap and context assembly', async () => {
    const workspaceDir = await createTempWorkspace(canonicalOverrideFixtureRepoRoot);
    initializeGitWorkspace(workspaceDir);
    commitWorkspace(workspaceDir, 'baseline');

    const before = runCliJson<{
      bootstrap: {
        detected: {
          archetypeSuggestion: string;
          docsHealth: {
            root?: string;
            hasStartHere: boolean;
          };
        };
        recommendedConfig: {
          docs: {
            root: string;
          };
        };
      };
    }>(['init', workspaceDir, '--dry-run', '--json']);
    const docsOverride = runCliJson<{
      overridePath: string;
      updatedEntry: { key: string; value: string; updatedBy?: string };
    }>([
      'overrides',
      'set',
      'docs.root',
      'knowledge',
      workspaceDir,
      '--reason',
      'knowledge is canonical',
      '--actor',
      'agent-alpha',
      '--json',
    ]);
    const archetypeOverride = runCliJson<{
      updatedEntry: { key: string; value: string; updatedBy?: string };
    }>([
      'overrides',
      'set',
      'project.archetype',
      'api',
      workspaceDir,
      '--reason',
      'service is api-shaped',
      '--actor',
      'agent-alpha',
      '--json',
    ]);
    const overrides = runCliJson<{
      entries: Array<{ key: string; value: string; updatedBy?: string }>;
    }>(['overrides', 'show', workspaceDir, '--json']);
    const after = runCliJson<{
      bootstrap: {
        detected: {
          archetypeSuggestion: string;
          docsHealth: {
            root?: string;
            hasStartHere: boolean;
          };
          appliedOverrides: Array<{ key: string; value: string }>;
        };
        recommendedConfig: {
          docs: {
            root: string;
          };
        };
      };
    }>(['init', workspaceDir, '--dry-run', '--json']);
    const context = runCliJson<{
      references: Array<{ kind: string; path: string }>;
    }>(['context', 'workspace', workspaceDir, '--json']);
    const impact = runCliJson<{
      changed: Array<{ path: string; category: string }>;
      requiredActions: string[];
    }>(['impact', '--cwd', workspaceDir, '--json']);

    expect(before.bootstrap.detected.archetypeSuggestion).toBe('saas');
    expect(before.bootstrap.recommendedConfig.docs.root).toBe('docs');
    expect(before.bootstrap.detected.docsHealth).toEqual(
      expect.objectContaining({
        root: 'docs',
        hasStartHere: false,
      }),
    );
    expect(docsOverride.overridePath).toContain('.skopos/overrides.json');
    expect(docsOverride.updatedEntry).toEqual(
      expect.objectContaining({
        key: 'docs.root',
        value: 'knowledge',
        updatedBy: 'agent-alpha',
      }),
    );
    expect(archetypeOverride.updatedEntry).toEqual(
      expect.objectContaining({
        key: 'project.archetype',
        value: 'api',
        updatedBy: 'agent-alpha',
      }),
    );
    expect(overrides.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'docs.root', value: 'knowledge', updatedBy: 'agent-alpha' }),
        expect.objectContaining({ key: 'project.archetype', value: 'api', updatedBy: 'agent-alpha' }),
      ]),
    );
    expect(after.bootstrap.detected.appliedOverrides).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'docs.root', value: 'knowledge' }),
        expect.objectContaining({ key: 'project.archetype', value: 'api' }),
      ]),
    );
    expect(after.bootstrap.detected.archetypeSuggestion).toBe('api');
    expect(after.bootstrap.recommendedConfig.docs.root).toBe('knowledge');
    expect(after.bootstrap.detected.docsHealth).toEqual(
      expect.objectContaining({
        root: 'knowledge',
        hasStartHere: true,
      }),
    );
    expect(
      context.references.some(
        (reference) =>
          reference.kind === 'docs-start-here' &&
          reference.path.endsWith('/knowledge/00-start-here.md'),
      ),
    ).toBe(true);
    expect(impact.changed).toContainEqual(
      expect.objectContaining({
        path: '.skopos/overrides.json',
        category: 'override-artifact',
      }),
    );
    expect(impact.requiredActions).toContain(
      'Run `skopos init` to refresh generated bootstrap artifacts after override changes.',
    );
  });

  it('uses a docs-only impact lane for explicit docs path changes', async () => {
    const workspaceDir = await createTempWorkspace(staleDocsFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);

    const impact = runCliJson<{
      changed: Array<{ path: string; category: string }>;
      recommendedChecks: string[];
    }>(['impact', 'docs/00-start-here.md', '--cwd', workspaceDir, '--json']);

    expect(impact.changed).toContainEqual(
      expect.objectContaining({
        path: 'docs/00-start-here.md',
        category: 'docs',
        affectedScopeIds: expect.arrayContaining(['workspace']),
      }),
    );
    expect(impact.recommendedChecks).toEqual([]);
  });

  it('uses a package-scoped impact lane when changed paths stay inside one package', async () => {
    const workspaceDir = await createTempWorkspace(largeFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);

    const impact = runCliJson<{
      changed: Array<{ path: string; category: string; affectedScopeIds: string[] }>;
      recommendedChecks: string[];
    }>(['impact', 'packages/shared-ui/package.json', '--cwd', workspaceDir, '--json']);

    expect(impact.changed).toContainEqual(
      expect.objectContaining({
        path: 'packages/shared-ui/package.json',
        category: 'package-manifest',
        affectedScopeIds: expect.arrayContaining(['@large/shared-ui']),
      }),
    );
    expect(impact.recommendedChecks).toEqual([
      'pnpm --filter @large/shared-ui typecheck',
      'pnpm --filter @large/shared-ui test',
      'pnpm --filter @large/shared-ui build',
      'pnpm --filter @large/shared-ui lint',
    ]);
  });

  it('blocks override takeover without explicit force and records override actor attribution', async () => {
    const workspaceDir = await createTempWorkspace(canonicalOverrideFixtureRepoRoot);

    const firstWrite = runCliJson<{
      updatedEntry: { key: string; value: string; updatedBy?: string };
    }>([
      'overrides',
      'set',
      'docs.root',
      'knowledge',
      workspaceDir,
      '--reason',
      'knowledge is canonical',
      '--actor',
      'agent-alpha',
      '--json',
    ]);

    expect(firstWrite.updatedEntry.updatedBy).toBe('agent-alpha');

    const blocked = runCliFailure([
      'overrides',
      'set',
      'docs.root',
      'knowledge',
      workspaceDir,
      '--reason',
      'same override from another actor',
      '--actor',
      'agent-beta',
      '--json',
    ]);

    expect(blocked.message).toContain('last updated by agent-alpha');

    const forced = runCliJson<{
      updatedEntry: { key: string; value: string; updatedBy?: string };
      overrides: {
        entries: Array<{ key: string; value: string; updatedBy?: string }>;
      };
    }>([
      'overrides',
      'set',
      'docs.root',
      'knowledge',
      workspaceDir,
      '--reason',
      'take over canonical override ownership',
      '--actor',
      'agent-beta',
      '--force',
      '--json',
    ]);

    expect(forced.updatedEntry.updatedBy).toBe('agent-beta');
    expect(forced.overrides.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'docs.root',
          value: 'knowledge',
          updatedBy: 'agent-beta',
        }),
      ]),
    );
  });

  it('resolves an exact package scope and assembles compact context', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const resolved = runCliJson<{
      matchedBy: string;
      scope: { id: string; kind: string; path: string };
    }>(['resolve', '@fixture/api', workspaceDir, '--json']);
    const context = runCliJson<{
      scope: { scope: { id: string } };
      references: Array<{ kind: string; path: string }>;
    }>(['context', '@fixture/api', workspaceDir, '--json']);

    expect(resolved.matchedBy).toBe('id');
    expect(resolved.scope).toMatchObject({
      id: '@fixture/api',
      kind: 'package',
      path: 'packages/api',
    });
    expect(context.scope.scope.id).toBe('@fixture/api');
    expect(context.references.some((reference) => reference.kind === 'bootstrap')).toBe(true);
    expect(context.references.some((reference) => reference.kind === 'config')).toBe(true);
    expect(context.references.some((reference) => reference.kind === 'docs-start-here')).toBe(true);
    expect(context.references.some((reference) => reference.kind === 'symbols')).toBe(true);
    expect(context.references.some((reference) => reference.kind === 'duplicates')).toBe(true);
    expect(context.references.some((reference) => reference.kind === 'contradictions')).toBe(
      true,
    );
    expect(
      context.references.some(
        (reference) =>
          reference.kind === 'package-manifest' &&
          reference.path.endsWith('/packages/api/package.json'),
      ),
    ).toBe(true);
  });

  it('reuses compiled bootstrap state on hot-path resolve, context, trust, impact, and plan commands', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    initializeGitWorkspace(workspaceDir);
    commitWorkspace(workspaceDir, 'baseline');

    await writeFile(
      join(workspaceDir, 'packages/api/package.json'),
      `${await readFile(join(workspaceDir, 'packages/api/package.json'), 'utf8')}\n`,
      'utf8',
    );

    const bootstrapPath = join(workspaceDir, '.skopos', 'bootstrap.json');
    const scopesLitePath = join(workspaceDir, '.skopos', 'scopes-lite.json');
    const bootstrapBefore = await stat(bootstrapPath);
    const scopesBefore = await stat(scopesLitePath);

    runCliJson(['resolve', '@fixture/api', workspaceDir, '--json']);
    runCliJson(['context', '@fixture/api', workspaceDir, '--json']);
    runCliJson([
      'plan',
      'refresh api billing guidance',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--json',
    ]);
    runCliJson(['trust', workspaceDir, '--json']);
    runCliJson(['impact', '--cwd', workspaceDir, '--json']);

    const bootstrapAfter = await stat(bootstrapPath);
    const scopesAfter = await stat(scopesLitePath);

    expect(bootstrapAfter.mtimeMs).toBe(bootstrapBefore.mtimeMs);
    expect(scopesAfter.mtimeMs).toBe(scopesBefore.mtimeMs);
  });

  it('refreshes compiled trust state when docs routing and freshness sources change', async () => {
    const workspaceDir = await createTempWorkspace(staleDocsFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);

    const trustBefore = runCliJson<{
      trustLevel: string;
      readiness: string;
      checks: Array<{ id: string; status: string }>;
      findings: string[];
    }>(['trust', workspaceDir, '--json']);

    expect(trustBefore.trustLevel).toBe('medium');
    expect(trustBefore.readiness).toBe('needs-review');
    expect(trustBefore.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'docs-router',
          status: 'warn',
        }),
        expect.objectContaining({
          id: 'docs-freshness',
          status: 'warn',
        }),
        expect.objectContaining({
          id: 'scan-findings',
          status: 'warn',
        }),
      ]),
    );

    await writeFile(
      join(workspaceDir, 'docs/00-start-here.md'),
      [
        '---',
        'title: Start Here',
        'reviewedAt: 2026-04-09',
        'reviewCycleDays: 3650',
        '---',
        '',
        '# Start Here',
        '',
        'Fresh canonical entrypoint for the docs root.',
        '',
      ].join('\n'),
      'utf8',
    );
    await writeFile(
      join(workspaceDir, 'docs/overview.md'),
      [
        '---',
        'title: Service Overview',
        'reviewedAt: 2026-04-09',
        'reviewCycleDays: 3650',
        '---',
        '',
        '# Service Overview',
        '',
        'This overview was refreshed to keep docs trust current.',
        '',
      ].join('\n'),
      'utf8',
    );
    await writeFile(
      join(workspaceDir, 'docs/architecture.md'),
      [
        '---',
        'title: Architecture Notes',
        'reviewedAt: 2026-04-09',
        'reviewCycleDays: 3650',
        '---',
        '',
        '# Architecture Notes',
        '',
        'This architecture note is now fresh and routed from the canonical start-here doc.',
        '',
      ].join('\n'),
      'utf8',
    );

    const trustAfter = runCliJson<{
      trustLevel: string;
      readiness: string;
      checks: Array<{ id: string; status: string }>;
      findings: string[];
    }>(['trust', workspaceDir, '--json']);

    expect(trustAfter.trustLevel).toBe('high');
    expect(trustAfter.readiness).toBe('agent-ready');
    expect(trustAfter.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'docs-router',
          status: 'pass',
        }),
        expect.objectContaining({
          id: 'docs-freshness',
          status: 'pass',
        }),
        expect.objectContaining({
          id: 'scan-findings',
          status: 'pass',
        }),
      ]),
    );
    expect(trustAfter.findings).toHaveLength(0);
  });

  it('builds a scoped plan with decision ask-back and canonical checks', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const plan = runCliJson<{
      planWrite: string;
      missionWrite: string;
      planPath: string;
      missionPath: string;
      graphPath: string;
      graphWrite: string;
      actorId?: string;
      scope: { scope: { id: string } };
      confidence: string;
      decisionQuestions: Array<{ id: string; escalation: string }>;
      recommendedChecks: string[];
      recommendedWorkflows: Array<{ id: string; requiredForDone: boolean }>;
      implementationSteps: Array<{ id: string }>;
      references: Array<{ kind: string }>;
      mission: {
        planId: string;
        coordination: {
          lastUpdatedBy?: string;
        };
        items: Array<{ kind: string; id: string }>;
      };
    }>([
      'plan',
      'add public api endpoint for billing summaries',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-plan',
      '--json',
    ]);

    expect(plan.planWrite).toBe('written');
    expect(plan.missionWrite).toBe('written');
    expect(plan.graphWrite).toBe('written');
    expect(plan.scope.scope.id).toBe('@fixture/api');
    expect(plan.confidence).toBe('high');
    expect(plan.actorId).toBe('agent-plan');
    expect(plan.mission.coordination.lastUpdatedBy).toBe('agent-plan');
    expect(plan.references.some((reference) => reference.kind === 'package-manifest')).toBe(true);
    expect(plan.implementationSteps.some((step) => step.id === 'resolve-decisions')).toBe(true);
    expect(plan.implementationSteps.some((step) => step.id === 'record-workflow-lane')).toBe(
      true,
    );
    expect(plan.decisionQuestions.map((question) => question.id)).toEqual(
      expect.arrayContaining(['plan.public-api-change', 'plan.vendor-choice']),
    );
    expect(plan.decisionQuestions.every((question) => question.escalation === 'must-ask')).toBe(
      true,
    );
    expect(plan.recommendedChecks).toEqual([
      'pnpm --recursive --filter @fixture/* typecheck',
      'pnpm --recursive --filter @fixture/* test',
      'pnpm --recursive --filter @fixture/* build',
      'pnpm --recursive --filter @fixture/* lint',
    ]);
    expect(plan.recommendedWorkflows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'reference.refresh-api-note',
          requiredForDone: true,
        }),
      ]),
    );
    expect(plan.mission.items.some((item) => item.kind === 'decision')).toBe(true);
    expect(plan.mission.items.some((item) => item.kind === 'validation')).toBe(true);
    expect(plan.mission.items.some((item) => item.kind === 'workflow')).toBe(true);
    expect(plan.mission.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'step-record-workflow-lane',
          kind: 'workflow',
        }),
      ]),
    );

    const planText = runCliText([
      'plan',
      'add public api endpoint for billing summaries',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-plan',
      '--dry-run',
    ]);
    expect(planText).toContain('Skopos plan');
    expect(planText).toContain('Status: Decision needed');
    expect(planText).toContain('Questions:');
    expect(planText).toContain('Recommended:');
    expect(planText).toContain('Why this matters:');
    expect(planText).toContain('Options:');
    expect(planText).toContain('Details:');

    const persistedPlan = JSON.parse(await readFile(plan.planPath, 'utf8')) as {
      id: string;
      missionId: string;
      createdByActorId?: string;
      scope: { scope: { id: string } };
    };
    const persistedMission = JSON.parse(await readFile(plan.missionPath, 'utf8')) as {
      id: string;
      planId: string;
      state: string;
      coordination: {
        lastUpdatedBy?: string;
      };
    };
    const missionGraph = JSON.parse(await readFile(plan.graphPath, 'utf8')) as {
      graphKind: string;
      nodes: Array<{ id: string; kind: string }>;
      edges: Array<{ from: string; to: string; kind: string }>;
    };

    expect(persistedPlan.scope.scope.id).toBe('@fixture/api');
    expect(persistedPlan.missionId).toBe(persistedMission.id);
    expect(persistedPlan.createdByActorId).toBe('agent-plan');
    expect(persistedMission.planId).toBe(persistedPlan.id);
    expect(persistedMission.state).toBe('planned');
    expect(persistedMission.coordination.lastUpdatedBy).toBe('agent-plan');
    expect(missionGraph.graphKind).toBe('mission');
    expect(missionGraph.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'workflow:reference.refresh-api-note',
          kind: 'workflow',
        }),
      ]),
    );
    expect(missionGraph.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: `plan:${persistedPlan.id}`,
          to: 'workflow:reference.refresh-api-note',
          kind: 'recommends',
        }),
      ]),
    );
  });

  it('narrows package-scoped validation checks when the package exposes local scripts', async () => {
    const workspaceDir = await createTempWorkspace(largeFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);

    const plan = runCliJson<{
      scope: { scope: { id: string } };
      recommendedChecks: string[];
    }>([
      'plan',
      'refine the shared ui package validation flow',
      workspaceDir,
      '--scope',
      '@large/shared-ui',
      '--actor',
      'agent-plan',
      '--json',
    ]);

    expect(plan.scope.scope.id).toBe('@large/shared-ui');
    expect(plan.recommendedChecks).toEqual([
      'pnpm --filter @large/shared-ui typecheck',
      'pnpm --filter @large/shared-ui test',
      'pnpm --filter @large/shared-ui build',
      'pnpm --filter @large/shared-ui lint',
    ]);
  });

  it('narrows workspace-scoped validation checks when the goal matches one package unambiguously', async () => {
    const workspaceDir = await createTempWorkspace(largeFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);

    const plan = runCliJson<{
      scope: { scope: { id: string } };
      recommendedChecks: string[];
    }>([
      'plan',
      'tighten the shared ui package validation lane',
      workspaceDir,
      '--scope',
      'workspace',
      '--actor',
      'agent-plan',
      '--json',
    ]);

    expect(plan.scope.scope.id).toBe('workspace');
    expect(plan.recommendedChecks).toEqual([
      'pnpm --filter @large/shared-ui typecheck',
      'pnpm --filter @large/shared-ui test',
      'pnpm --filter @large/shared-ui build',
      'pnpm --filter @large/shared-ui lint',
    ]);
  });

  it('uses a docs-only validation lane for explicit documentation goals', async () => {
    const workspaceDir = await createTempWorkspace(staleDocsFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);

    const plan = runCliJson<{
      recommendedChecks: string[];
      implementationSteps: Array<{ id: string }>;
    }>([
      'plan',
      'refresh documentation metadata and changelog wording',
      workspaceDir,
      '--scope',
      'workspace',
      '--actor',
      'agent-docs',
      '--json',
    ]);

    expect(plan.recommendedChecks).toEqual([]);
    expect(plan.implementationSteps.some((step) => step.id === 'run-checks')).toBe(false);
  });

  it('starts work by creating workflow question and recommendation artifacts', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const startText = runCliText([
      'start',
      'add public api endpoint for billing summaries',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-router',
      '--dry-run',
    ]);
    expect(startText).toContain('Skopos start');
    expect(startText).toContain('Status: Decision needed');
    expect(startText).toContain('Next step:');
    expect(startText).toContain('Questions:');
    expect(startText).toContain('Recommended:');
    expect(startText).toContain('Why this matters:');
    expect(startText).toContain('After you answer:');
    expect(startText).toContain('Details:');

    const start = runCliJson<{
      actorId?: string;
      codeAllowed: boolean;
      planId: string;
      missionId: string;
      missionState: string;
      missionClaimedByActorId?: string;
      questionsPath: string;
      questionsWrite: string;
      recommendationsPath: string;
      recommendationsWrite: string;
      blockingQuestions: Array<{
        id: string;
        blocking: boolean;
        linkedPlanId?: string;
        linkedMissionId?: string;
        status: string;
      }>;
      recommendedAction?: {
        id: string;
        actionKind: string;
        linkedQuestionId?: string;
        blocking: boolean;
        command?: string;
      };
      plan: {
        mission: {
          state: string;
          coordination: {
            claimedBy?: {
              actorId: string;
            };
          };
        };
      };
    }>([
      'start',
      'add public api endpoint for billing summaries',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-router',
      '--json',
    ]);

    expect(start.actorId).toBe('agent-router');
    expect(start.codeAllowed).toBe(false);
    expect(start.missionState).toBe('active');
    expect(start.missionClaimedByActorId).toBe('agent-router');
    expect(start.questionsWrite).toBe('written');
    expect(start.recommendationsWrite).toBe('written');
    expect(start.blockingQuestions.map((question) => question.id)).toEqual(
      expect.arrayContaining(['plan.public-api-change', 'plan.vendor-choice']),
    );
    expect(start.blockingQuestions.every((question) => question.blocking)).toBe(true);
    expect(start.blockingQuestions.every((question) => question.linkedPlanId === start.planId)).toBe(
      true,
    );
    expect(
      start.blockingQuestions.every((question) => question.linkedMissionId === start.missionId),
    ).toBe(true);
    expect(start.recommendedAction).toEqual(
      expect.objectContaining({
        actionKind: 'resolve-question',
        blocking: true,
        command: expect.stringContaining(
          'skopos decide plan.public-api-change confirm-contract-first',
        ),
      }),
    );
    expect(start.plan.mission.state).toBe('active');
    expect(start.plan.mission.coordination.claimedBy?.actorId).toBe('agent-router');

    const questionsArtifact = JSON.parse(await readFile(start.questionsPath, 'utf8')) as {
      generatedForPlanId?: string;
      generatedForMissionId?: string;
      entries: Array<{
        id: string;
        status: string;
        blocking: boolean;
      }>;
    };
    const recommendationsArtifact = JSON.parse(
      await readFile(start.recommendationsPath, 'utf8'),
    ) as {
      generatedForPlanId?: string;
      generatedForMissionId?: string;
      entries: Array<{
        actionKind: string;
        blocking: boolean;
      }>;
    };
    const persistedMission = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'missions', `${start.missionId}.json`), 'utf8'),
    ) as {
      state: string;
      coordination: {
        claimedBy?: {
          actorId: string;
        };
      };
    };
    const logLines = (await readFile(join(workspaceDir, '.skopos', 'log.jsonl'), 'utf8'))
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as { eventKind: string });

    expect(questionsArtifact.generatedForPlanId).toBe(start.planId);
    expect(questionsArtifact.generatedForMissionId).toBe(start.missionId);
    expect(questionsArtifact.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'plan.public-api-change',
          status: 'open',
          blocking: true,
        }),
      ]),
    );
    expect(recommendationsArtifact.generatedForPlanId).toBe(start.planId);
    expect(recommendationsArtifact.generatedForMissionId).toBe(start.missionId);
    expect(recommendationsArtifact.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionKind: 'resolve-question',
          blocking: true,
        }),
      ]),
    );
    expect(persistedMission.state).toBe('active');
    expect(persistedMission.coordination.claimedBy?.actorId).toBe('agent-router');
    expect(logLines.some((entry) => entry.eventKind === 'start')).toBe(true);
  });

  it('records workflow decisions durably and unlocks implementation after blocking questions are resolved', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const start = runCliJson<{
      planId: string;
      missionId: string;
      questionsPath: string;
      recommendationsPath: string;
      codeAllowed: boolean;
    }>([
      'start',
      'add public api endpoint for billing summaries',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-router',
      '--json',
    ]);

    expect(start.codeAllowed).toBe(false);

    const initialQuestions = JSON.parse(await readFile(start.questionsPath, 'utf8')) as {
      entries: Array<{ id: string; recommendedOptionId: string; status: string }>;
    };
    const publicApiQuestion = initialQuestions.entries.find(
      (entry) => entry.id === 'plan.public-api-change',
    );
    const vendorQuestion = initialQuestions.entries.find((entry) => entry.id === 'plan.vendor-choice');

    expect(publicApiQuestion?.recommendedOptionId).toBeDefined();
    expect(vendorQuestion?.recommendedOptionId).toBeDefined();

    const decideText = runCliText([
      'decide',
      'plan.public-api-change',
      publicApiQuestion?.recommendedOptionId ?? 'confirm-contract-first',
      workspaceDir,
      '--actor',
      'agent-router',
      '--dry-run',
    ]);
    expect(decideText).toContain('Skopos decide');
    expect(decideText).toContain('Status: More decisions needed');
    expect(decideText).toContain('Answered:');
    expect(decideText).toContain('Selected:');
    expect(decideText).toContain('Next step:');
    expect(decideText).toContain('Questions:');
    expect(decideText).toContain('Recommended:');
    expect(decideText).toContain('Details:');

    const firstDecision = runCliJson<{
      actorId?: string;
      questionId: string;
      selectedOptionId: string;
      codeAllowed: boolean;
      resolvedQuestion: {
        id: string;
        status: string;
        resolvedOptionId?: string;
        resolvedByActorId?: string;
      };
      recommendedAction?: {
        actionKind: string;
        blocking: boolean;
      };
    }>([
      'decide',
      'plan.public-api-change',
      publicApiQuestion?.recommendedOptionId ?? 'confirm-contract-first',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);

    expect(firstDecision.actorId).toBe('agent-router');
    expect(firstDecision.questionId).toBe('plan.public-api-change');
    expect(firstDecision.codeAllowed).toBe(false);
    expect(firstDecision.resolvedQuestion).toEqual(
      expect.objectContaining({
        id: 'plan.public-api-change',
        status: 'resolved',
        resolvedOptionId: publicApiQuestion?.recommendedOptionId,
        resolvedByActorId: 'agent-router',
      }),
    );
    expect(firstDecision.recommendedAction).toEqual(
      expect.objectContaining({
        actionKind: 'resolve-question',
        blocking: true,
      }),
    );

    const finalDecision = runCliJson<{
      actorId?: string;
      questionId: string;
      selectedOptionId: string;
      codeAllowed: boolean;
      mission?: {
        id: string;
        items: Array<{ id: string; status: string }>;
        coordination: {
          lastUpdatedBy?: string;
        };
      };
      questions: {
        entries: Array<{
          id: string;
          status: string;
          resolvedOptionId?: string;
          resolvedByActorId?: string;
        }>;
      };
      recommendations: {
        entries: Array<{ actionKind: string; blocking: boolean }>;
      };
      recommendedAction?: {
        actionKind: string;
        blocking: boolean;
      };
    }>([
      'decide',
      'plan.vendor-choice',
      vendorQuestion?.recommendedOptionId ?? 'use-existing-platform-default',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);

    expect(finalDecision.actorId).toBe('agent-router');
    expect(finalDecision.questionId).toBe('plan.vendor-choice');
    expect(finalDecision.codeAllowed).toBe(true);
    expect(finalDecision.questions.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'plan.public-api-change',
          status: 'resolved',
          resolvedByActorId: 'agent-router',
        }),
        expect.objectContaining({
          id: 'plan.vendor-choice',
          status: 'resolved',
          resolvedByActorId: 'agent-router',
        }),
      ]),
    );
    expect(finalDecision.recommendations.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionKind: 'implement',
          blocking: false,
        }),
      ]),
    );
    expect(finalDecision.recommendedAction).toEqual(
      expect.objectContaining({
        actionKind: 'implement',
        blocking: false,
      }),
    );
    expect(finalDecision.mission?.coordination.lastUpdatedBy).toBe('agent-router');
    expect(finalDecision.mission?.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'decision-plan.public-api-change',
          status: 'complete',
        }),
        expect.objectContaining({
          id: 'decision-plan.vendor-choice',
          status: 'complete',
        }),
        expect.objectContaining({
          id: 'step-resolve-decisions',
          status: 'complete',
        }),
      ]),
    );

    const persistedQuestions = JSON.parse(await readFile(start.questionsPath, 'utf8')) as {
      entries: Array<{ id: string; status: string; resolvedByActorId?: string }>;
    };
    const persistedRecommendations = JSON.parse(
      await readFile(start.recommendationsPath, 'utf8'),
    ) as {
      entries: Array<{ actionKind: string; blocking: boolean }>;
    };
    const persistedMission = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'missions', `${start.missionId}.json`), 'utf8'),
    ) as {
      items: Array<{ id: string; status: string }>;
    };
    const logLines = (await readFile(join(workspaceDir, '.skopos', 'log.jsonl'), 'utf8'))
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as { eventKind: string; metadata?: { questionId?: string } });

    expect(
      persistedQuestions.entries.filter((entry) => entry.status === 'resolved').map((entry) => entry.id),
    ).toEqual(expect.arrayContaining(['plan.public-api-change', 'plan.vendor-choice']));
    expect(persistedRecommendations.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionKind: 'implement',
          blocking: false,
        }),
      ]),
    );
    expect(persistedMission.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'step-resolve-decisions',
          status: 'complete',
        }),
      ]),
    );
    expect(
      logLines.filter((entry) => entry.eventKind === 'decision').map((entry) => entry.metadata?.questionId),
    ).toEqual(expect.arrayContaining(['plan.public-api-change', 'plan.vendor-choice']));
  });

  it('returns the blocking workflow question as the next action when ongoing work is still gated', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const start = runCliJson<{
      missionId: string;
    }>([
      'start',
      'add public api endpoint for billing summaries',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-router',
      '--json',
    ]);

    const next = runCliJson<{
      actorId?: string;
      missionId: string;
      codeAllowed: boolean;
      blockingQuestions: Array<{ id: string; status: string }>;
      recommendedAction?: {
        actionKind: string;
        blocking: boolean;
        linkedQuestionId?: string;
        command?: string;
      };
      nextItem?: {
        id: string;
      };
      trust: {
        trustLevel: string;
        readiness: string;
      };
    }>(['next', workspaceDir, '--actor', 'agent-router', '--json']);

    expect(next.actorId).toBe('agent-router');
    expect(next.missionId).toBe(start.missionId);
    expect(next.codeAllowed).toBe(false);
    expect(next.blockingQuestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'plan.public-api-change',
          status: 'open',
        }),
      ]),
    );
    expect(next.recommendedAction).toEqual(
      expect.objectContaining({
        actionKind: 'resolve-question',
        blocking: true,
        linkedQuestionId: 'plan.public-api-change',
        command: expect.stringContaining(
          'skopos decide plan.public-api-change confirm-contract-first',
        ),
      }),
    );
    expect(next.nextItem).toBeUndefined();
    expect(next.trust.trustLevel).toBe('medium');
    expect(next.trust.readiness).toBe('needs-review');

    const nextText = runCliText(['next', workspaceDir, '--actor', 'agent-router']);
    expect(nextText).toContain('Skopos next');
    expect(nextText).toContain('Status: Blocked');
    expect(nextText).toContain('Progress:');
    expect(nextText).toContain('Current phase:');
    expect(nextText).toContain('Questions:');
    expect(nextText).toContain('Next step:');
    expect(nextText).toContain('skopos decide plan.public-api-change confirm-contract-first');
  });

  it('returns the first pending mission item as the next bounded action after blockers are cleared', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const start = runCliJson<{
      missionId: string;
      questionsPath: string;
    }>([
      'start',
      'add public api endpoint for billing summaries',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-router',
      '--json',
    ]);
    const questionsArtifact = JSON.parse(await readFile(start.questionsPath, 'utf8')) as {
      entries: Array<{ id: string; recommendedOptionId: string }>;
    };
    const publicApiQuestion = questionsArtifact.entries.find(
      (entry) => entry.id === 'plan.public-api-change',
    );
    const vendorQuestion = questionsArtifact.entries.find((entry) => entry.id === 'plan.vendor-choice');

    runCliJson([
      'decide',
      'plan.public-api-change',
      publicApiQuestion?.recommendedOptionId ?? 'confirm-contract-first',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);
    runCliJson([
      'decide',
      'plan.vendor-choice',
      vendorQuestion?.recommendedOptionId ?? 'use-existing-platform-default',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);

    const next = runCliJson<{
      actorId?: string;
      missionId: string;
      codeAllowed: boolean;
      blockingQuestions: Array<{ id: string }>;
      nextItem?: {
        id: string;
        title: string;
        status: string;
      };
      pendingItems: Array<{ id: string; status: string }>;
      recommendedAction?: {
        actionKind: string;
        blocking: boolean;
        title: string;
        summary: string;
      };
      recommendations: {
        entries: Array<{ actionKind: string; title: string; blocking: boolean }>;
      };
    }>(['next', workspaceDir, '--actor', 'agent-router', '--json']);

    expect(next.actorId).toBe('agent-router');
    expect(next.missionId).toBe(start.missionId);
    expect(next.codeAllowed).toBe(true);
    expect(next.blockingQuestions).toHaveLength(0);
    expect(next.nextItem).toEqual(
      expect.objectContaining({
        id: 'step-review-current-pattern',
        title: 'Review the current pattern in @fixture/api',
        status: 'pending',
      }),
    );
    expect(next.pendingItems[0]?.id).toBe('step-review-current-pattern');
    expect(next.recommendedAction).toEqual(
      expect.objectContaining({
        actionKind: 'implement',
        blocking: false,
        title: 'Review the current pattern in @fixture/api',
      }),
    );
    expect(next.recommendations.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionKind: 'implement',
          title: 'Review the current pattern in @fixture/api',
          blocking: false,
        }),
      ]),
    );
  });

  it('allows implementation from start when no blocking workflow questions remain', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const start = runCliJson<{
      codeAllowed: boolean;
      missionState: string;
      missionClaimedByActorId?: string;
      executionSurface: {
        kind: string;
        signals: string[];
      };
      blockingQuestions: Array<{ id: string }>;
      recommendedAction?: {
        actionKind: string;
        blocking: boolean;
      };
      questions: {
        entries: Array<{ id: string }>;
      };
    }>([
      'start',
      'fix internal lint issue',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-router',
      '--json',
    ]);

    expect(start.codeAllowed).toBe(true);
    expect(start.missionState).toBe('active');
    expect(start.missionClaimedByActorId).toBe('agent-router');
    expect(start.executionSurface.kind).toBe('artifact-only');
    expect(start.executionSurface.signals).toEqual([]);
    expect(start.blockingQuestions).toHaveLength(0);
    expect(start.questions.entries).toHaveLength(0);
    expect(start.recommendedAction).toEqual(
      expect.objectContaining({
        actionKind: 'implement',
        blocking: false,
      }),
    );
  });

  it('recommends a temporary workpack doc only for broader coordinated batches', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const start = runCliJson<{
      executionSurface: {
        kind: string;
        signals: string[];
      };
      recommendations: {
        executionSurface: {
          kind: string;
          signals: string[];
        };
      };
    }>([
      'start',
      'add public api security token changes across the workspace',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);

    expect(start.executionSurface.kind).toBe('artifact-plus-workpack-doc');
    expect(start.executionSurface.signals).toEqual(
      expect.arrayContaining([
        'workspace scope',
        '3 decision gates',
      ]),
    );
    expect(start.recommendations.executionSurface.kind).toBe('artifact-plus-workpack-doc');
  });

  it('reports open workflow questions through trust for the current started work', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);

    const start = runCliJson<{
      missionId: string;
      blockingQuestions: Array<{ id: string }>;
    }>([
      'start',
      'add public api endpoint for billing summaries',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-router',
      '--json',
    ]);

    expect(start.blockingQuestions.map((question) => question.id)).toEqual(
      expect.arrayContaining(['plan.public-api-change']),
    );

    const trust = runCliJson<{
      trustLevel: string;
      readiness: string;
      checks: Array<{ id: string; status: string; summary: string }>;
    }>(['trust', workspaceDir, '--json']);

    expect(trust.trustLevel).toBe('medium');
    expect(trust.readiness).toBe('needs-review');
    expect(trust.checks).toContainEqual({
      id: 'workflow-questions',
      status: 'warn',
      summary: expect.stringContaining('plan.public-api-change'),
    });
  });

  it('blocks closure when blocking workflow questions are still unresolved', async () => {
    const workspaceDir = await createTempWorkspace();
    initializeGitWorkspace(workspaceDir);
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    commitWorkspace(workspaceDir, 'baseline');

    const start = runCliJson<{
      missionId: string;
    }>([
      'start',
      'add public api endpoint for billing summaries',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-router',
      '--json',
    ]);

    const done = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string; summary: string }>;
      requiredActions: string[];
      workflowQuestions?: {
        blockingQuestionIds: string[];
      };
    }>([
      'done',
      '--mission',
      start.missionId,
      '--cwd',
      workspaceDir,
      '--json',
    ]);

    expect(done.closureStatus).toBe('blocked');
    expect(done.checks).toContainEqual({
      id: 'workflow-questions',
      status: 'fail',
      summary: expect.stringContaining('plan.public-api-change'),
    });
    expect(done.workflowQuestions?.blockingQuestionIds).toContain('plan.public-api-change');
    expect(
      done.requiredActions.some((action) =>
        action.includes('skopos decide plan.public-api-change confirm-contract-first'),
      ),
    ).toBe(true);
  });

  it('routes validation steps through skopos eval when validation becomes the next pending item', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const start = runCliJson<{
      missionId: string;
      questionsPath: string;
    }>([
      'start',
      'add public api endpoint for billing summaries',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-router',
      '--json',
    ]);
    const questionsArtifact = JSON.parse(await readFile(start.questionsPath, 'utf8')) as {
      entries: Array<{ id: string; recommendedOptionId: string }>;
    };

    for (const question of questionsArtifact.entries) {
      runCliJson([
        'decide',
        question.id,
        question.recommendedOptionId,
        workspaceDir,
        '--actor',
        'agent-router',
        '--json',
      ]);
    }

    const missionPath = join(workspaceDir, '.skopos', 'missions', `${start.missionId}.json`);
    const mission = JSON.parse(await readFile(missionPath, 'utf8')) as {
      items: Array<{ id: string; status: string }>;
    };
    const completedItemIds = new Set([
      'step-review-current-pattern',
      'step-implement-scoped-change',
      'step-sync-knowledge',
      'step-run-workflows',
      ...mission.items
        .filter((item) => item.id.startsWith('workflow-'))
        .map((item) => item.id),
    ]);

    await writeFile(
      missionPath,
      `${JSON.stringify(
        {
          ...mission,
          items: mission.items.map((item) =>
            completedItemIds.has(item.id)
              ? {
                  ...item,
                  status: 'complete',
                }
              : item,
          ),
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    const next = runCliJson<{
      nextItem?: { id: string };
      recommendedAction?: { actionKind: string; command?: string };
    }>(['next', workspaceDir, '--actor', 'agent-router', '--json']);

    expect(next.nextItem?.id).toBe('step-run-checks');
    expect(next.recommendedAction).toEqual(
      expect.objectContaining({
        actionKind: 'run-eval',
        command: `skopos eval ${workspaceDir} --mission ${start.missionId} --actor agent-router`,
      }),
    );
  });

  it('writes a mission eval artifact and completes validation checklist state when checks pass', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const start = runCliJson<{
      missionId: string;
    }>([
      'start',
      'fix internal lint issue',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-router',
      '--json',
    ]);

    const result = runCliJson<{
      missionPath: string;
      evalPath: string;
      eval: {
        evaluationStatus: string;
        checkRuns: Array<{ status: string; command: string }>;
        workflowEvidence: Array<{ id: string; status: string }>;
        proof: { status: string };
      };
      blockingQuestions: Array<{ id: string }>;
    }>([
      'eval',
      workspaceDir,
      '--mission',
      start.missionId,
      '--actor',
      'agent-router',
      '--json',
    ]);

    expect(result.blockingQuestions).toHaveLength(0);
    expect(result.eval.evaluationStatus).toBe('needs-review');
    expect(result.eval.checkRuns.length).toBeGreaterThan(0);
    expect(result.eval.checkRuns.every((entry) => entry.status === 'pass')).toBe(true);
    expect(result.eval.workflowEvidence.some((entry) => entry.status === 'fail')).toBe(true);
    expect(result.eval.proof.status).toBe('missing');

    const persistedMission = JSON.parse(await readFile(result.missionPath, 'utf8')) as {
      items: Array<{ id: string; status: string }>;
    };
    expect(
      persistedMission.items.find((item) => item.id === 'step-run-checks')?.status,
    ).toBe('complete');

    const persistedEval = JSON.parse(await readFile(result.evalPath, 'utf8')) as {
      type: string;
      missionId: string;
      evaluationStatus: string;
      checkRuns: Array<{ command: string; status: string }>;
    };
    expect(persistedEval.type).toBe('eval');
    expect(persistedEval.missionId).toBe(start.missionId);
    expect(persistedEval.evaluationStatus).toBe('needs-review');
    expect(persistedEval.checkRuns.every((entry) => entry.status === 'pass')).toBe(true);
  });

  it('reconciles mission checklist drift after a complete eval and recommends mission completion', async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    runCliJson(['init', workspaceDir, '--json']);

    const start = runCliJson<{
      missionId: string;
    }>([
      'start',
      'stabilize the self-hosted workflow router closure path',
      workspaceDir,
      '--scope',
      '@selfhost/cli',
      '--actor',
      'agent-router',
      '--json',
    ]);

    runCliJson([
      'decide',
      'plan.public-api-change',
      'confirm-contract-first',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);

    runCliJson([
      'workflows',
      'run',
      'instructions.sync-mirrors',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);
    runCliJson([
      'instructions',
      'sync',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);
    runCliJson([
      'workflows',
      'run',
      'maintenance.refresh-knowledge',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);
    runCliJson([
      'workflows',
      'run',
      'graph.render-local-portal',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);
    runCliJson([
      'workflows',
      'run',
      'quality.run-proof-phase',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);
    await writePassingProofReport(workspaceDir);

    const evalResult = runCliJson<{
      missionPath: string;
      eval: {
        evaluationStatus: string;
        pendingItemIds: string[];
      };
      recommendedAction?: {
        actionKind: string;
        command?: string;
      };
    }>([
      'eval',
      workspaceDir,
      '--mission',
      start.missionId,
      '--actor',
      'agent-router',
      '--json',
    ]);

    expect(evalResult.eval.evaluationStatus).toBe('complete');
    expect(evalResult.eval.pendingItemIds).toHaveLength(0);
    expect(evalResult.recommendedAction).toEqual(
      expect.objectContaining({
        actionKind: 'complete-mission',
        command: `skopos mission complete ${start.missionId} ${workspaceDir} --actor agent-router`,
      }),
    );

    const persistedMission = JSON.parse(await readFile(evalResult.missionPath, 'utf8')) as {
      state: string;
      items: Array<{ id: string; status: string }>;
    };
    expect(persistedMission.state).toBe('active');
    expect(persistedMission.items.every((item) => item.status === 'complete')).toBe(true);

    const next = runCliJson<{
      nextItem?: { id: string };
      pendingItems: Array<{ id: string }>;
      recommendedAction?: {
        actionKind: string;
        command?: string;
      };
    }>([
      'next',
      workspaceDir,
      '--mission',
      start.missionId,
      '--actor',
      'agent-router',
      '--json',
    ]);

    expect(next.nextItem).toBeUndefined();
    expect(next.pendingItems).toHaveLength(0);
    expect(next.recommendedAction).toEqual(
      expect.objectContaining({
        actionKind: 'complete-mission',
        command: `skopos mission complete ${start.missionId} ${workspaceDir} --actor agent-router`,
      }),
    );
  });

  it('recommends explicit mission completion from program next after complete eval evidence exists', async () => {
    const workspaceDir = await createTempWorkspace();
    initializeGitWorkspace(workspaceDir);
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    commitWorkspace(workspaceDir, 'baseline');

    const start = runCliJson<{
      missionId: string;
      questions: {
        entries: Array<{ id: string; recommendedOptionId: string; status: string }>;
      };
    }>([
      'start',
      'refresh the routed console trust state',
      workspaceDir,
      '--actor',
      'agent-program',
      '--json',
    ]);

    for (const question of start.questions.entries.filter((entry) => entry.status === 'open')) {
      runCliJson([
        'decide',
        question.id,
        question.recommendedOptionId,
        workspaceDir,
        '--actor',
        'agent-program',
        '--json',
      ]);
    }

    const evalResult = runCliJson<{
      eval: {
        evaluationStatus: string;
        pendingItemIds: string[];
      };
    }>([
      'eval',
      workspaceDir,
      '--mission',
      start.missionId,
      '--actor',
      'agent-program',
      '--json',
    ]);

    expect(evalResult.eval.evaluationStatus).toBe('complete');
    expect(evalResult.eval.pendingItemIds).toHaveLength(0);

    const next = runCliJson<{
      currentDisposition: string;
      currentMissionId?: string;
      recommendedAction?: { kind: string; command?: string; summary: string };
      summary: string;
    }>(['program', 'next', workspaceDir, '--actor', 'agent-program', '--json']);

    expect(next.currentDisposition).toBe('continue-current');
    expect(next.currentMissionId).toBe(start.missionId);
    expect(next.recommendedAction).toEqual(
      expect.objectContaining({
        kind: 'complete-current-mission',
        command: `skopos mission complete ${start.missionId} ${workspaceDir} --actor agent-program`,
      }),
    );
    expect(next.recommendedAction?.summary).toContain('ready for explicit mission completion');
    expect(next.summary).toContain('Complete the current mission');
  });

  it('generates instruction mirrors from the canonical AGENTS source', async () => {
    const workspaceDir = await createTempWorkspace();

    const result = runCliJson<{
      sourcePath: string;
      actorId?: string;
      writes: Array<{ path: string; status: string }>;
    }>(['instructions', 'sync', workspaceDir, '--actor', 'agent-docs', '--json']);

    expect(result.sourcePath).toBe(join(workspaceDir, 'AGENTS.md'));
    expect(result.actorId).toBe('agent-docs');
    expect(result.writes.length).toBeGreaterThanOrEqual(7);
    expect(result.writes.every((write) => write.status === 'written')).toBe(true);
    expect(result.writes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: join(workspaceDir, 'CLAUDE.md'),
        }),
        expect.objectContaining({
          path: join(workspaceDir, '.skopos', 'tooling', 'claude-code', 'settings.json'),
        }),
        expect.objectContaining({
          path: join(workspaceDir, '.skopos', 'tooling', 'codex', 'adapter-manifest.json'),
        }),
        expect.objectContaining({
          path: join(workspaceDir, '.skopos', 'enforcement.json'),
        }),
      ]),
    );

    const claudeContents = await readFile(join(workspaceDir, 'CLAUDE.md'), 'utf8');
    const cursorContents = await readFile(
      join(workspaceDir, '.cursor', 'rules', 'project.mdc'),
      'utf8',
    );
    const copilotContents = await readFile(
      join(workspaceDir, '.github', 'copilot-instructions.md'),
      'utf8',
    );

    expect(claudeContents).toContain('Generated from AGENTS.md for CLAUDE.md');
    expect(cursorContents).toContain('Generated from AGENTS.md for .cursor/rules/project.mdc');
    expect(copilotContents).toContain(
      'Generated from AGENTS.md for .github/copilot-instructions.md',
    );
    expect(claudeContents).toContain('# Fixture agent rules');
    expect(cursorContents).toContain('# Fixture agent rules');
    expect(copilotContents).toContain('# Fixture agent rules');
    expect(
      await readFile(join(workspaceDir, '.skopos', 'tooling', 'codex', 'adapter-manifest.json'), 'utf8'),
    ).toContain('"toolId": "codex"');
  });

  it('discovers and shows registered policy packs', async () => {
    const workspaceDir = await createTempWorkspace();
    const packDir = join(workspaceDir, 'policy-packs', 'architecture', 'mid-app');
    await mkdir(packDir, { recursive: true });
    await writeFile(
      join(packDir, 'pack.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'policy-pack.architecture.mid-app',
          type: 'policy-pack',
          status: 'active',
          authority: 'canonical',
          summary: 'Mid-app architecture fixture policy pack.',
          updatedAt: '2026-06-24',
          packId: 'architecture.mid-app',
          family: 'architecture',
          variant: 'mid-app',
          version: '0.1.0',
          displayName: 'Mid-App Architecture',
          description: 'Fixture policy pack for a multi-feature product application.',
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
          projectLifecycles: ['greenfield', 'early-product', 'established-brownfield'],
          appliesWhen: [
            {
              id: 'signal.multiple-features',
              summary: 'Multiple product features exist.',
              confidence: 'high',
              evidence: ['features/orders', 'features/billing'],
            },
          ],
          avoidWhen: [
            {
              id: 'anti.single-script',
              summary: 'Single scripts should avoid mid-app structure.',
              confidence: 'high',
              evidence: ['one executable file'],
            },
          ],
          rules: [
            {
              id: 'architecture.mid-app.feature-owns-product-behavior',
              title: 'Feature owns product behavior',
              severity: 'must',
              summary: 'Product behavior stays inside the owning feature.',
              rationale: 'Agents need local ownership for coherent edits.',
              appliesTo: ['features'],
              examples: ['src/features/orders/service.ts'],
              antiPatterns: ['src/shared/helpers.ts owns order decisions'],
              checkIds: ['architecture.mid-app.business-logic-in-shared-helper'],
            },
            {
              id: 'architecture.mid-app.shared-is-earned',
              title: 'Shared code is earned',
              severity: 'must',
              summary: 'Shared modules must represent stable cross-feature primitives.',
              rationale: 'Generic helper buckets make ownership unclear.',
              appliesTo: ['shared modules', 'support folders'],
              examples: ['src/support/formatting/money.ts'],
              antiPatterns: ['src/shared/helpers.ts'],
              checkIds: ['architecture.mid-app.generic-helper-bucket'],
            },
            {
              id: 'architecture.mid-app.import-direction-is-one-way',
              title: 'Import direction is one-way',
              severity: 'must',
              summary: 'Features must not import private internals from sibling features.',
              rationale: 'One-way imports keep ownership clear.',
              appliesTo: ['imports', 'feature internals'],
              examples: ['features/orders imports platform/api/client'],
              antiPatterns: ['features/billing imports features/orders/components/internal-row'],
              checkIds: ['architecture.mid-app.cross-feature-private-import'],
            },
          ],
          requiredDocs: ['policies/overview.md'],
          generatedArtifacts: ['.skopos/policies/resolved.json'],
          driftCheckIds: ['architecture.mid-app.business-logic-in-shared-helper'],
          proofFixtureIds: ['architecture.mid-app.good-product-app'],
        },
        null,
        2,
      ),
      'utf8',
    );
    const gatePackDir = join(workspaceDir, 'policy-packs', 'gates', 'progressive-validation');
    await mkdir(gatePackDir, { recursive: true });
    await writeFile(
      join(gatePackDir, 'pack.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'policy-pack.gates.progressive-validation',
          type: 'policy-pack',
          status: 'active',
          authority: 'canonical',
          summary: 'Fixture gate policy pack.',
          updatedAt: '2026-06-24',
          packId: 'gates.progressive-validation',
          family: 'gates',
          variant: 'progressive-validation',
          version: '0.1.0',
          displayName: 'Progressive Validation Gates',
          description: 'Fixture gate pack for proportional validation.',
          plainLanguageSummary: 'Use this to keep small tasks light and risky tasks well proven.',
          bestFor: ['Projects with multiple validation commands'],
          notFor: ['Throwaway spikes'],
          userQuestions: ['Is this light, normal, or workpack risk?'],
          qualityBar: ['Small work stays light.', 'Risky work records proof.'],
          agentUse: ['Choose proportional gates before closure.'],
          projectLifecycles: ['greenfield', 'early-product', 'established-brownfield'],
          appliesWhen: [
            {
              id: 'signal.validation-lanes',
              summary: 'The project has more than one validation command.',
              confidence: 'high',
              evidence: ['typecheck', 'test', 'build'],
            },
          ],
          avoidWhen: [
            {
              id: 'anti.no-durable-project',
              summary: 'No durable project exists.',
              confidence: 'high',
              evidence: ['no package.json'],
            },
          ],
          rules: [
            {
              id: 'gates.progressive-validation.closure-records-proof',
              title: 'Closure records proof',
              severity: 'must',
              summary: 'Closure should record commands and outcomes.',
              rationale: 'Future agents need proof history.',
              appliesTo: ['mission closure'],
              examples: ['Done report lists typecheck and tests'],
              antiPatterns: ['Done message omits validation'],
              checkIds: ['gates.progressive-validation.closure-proof-missing'],
            },
          ],
          requiredDocs: ['policies/overview.md'],
          generatedArtifacts: ['.skopos/policies/resolved.json'],
          driftCheckIds: ['gates.progressive-validation.closure-proof-missing'],
          proofFixtureIds: ['gates.progressive-validation.good-proportional-proof'],
        },
        null,
        2,
      ),
      'utf8',
    );
    await mkdir(join(workspaceDir, 'src', 'features'), { recursive: true });
    await mkdir(join(workspaceDir, 'src', 'gateways'), { recursive: true });

    const listed = runCliJson<
      Array<{
        packId: string;
        family: string;
        variant: string;
        plainLanguageSummary?: string;
        rules: Array<{ id: string }>;
        sourcePath: string;
      }>
    >(['policies', 'list', workspaceDir, '--json']);

    expect(listed).toHaveLength(2);
    expect(listed[0]).toEqual(
      expect.objectContaining({
        packId: 'architecture.mid-app',
        family: 'architecture',
        variant: 'mid-app',
        sourcePath: 'policy-packs/architecture/mid-app/pack.json',
      }),
    );
    expect(listed[1]).toEqual(
      expect.objectContaining({
        packId: 'gates.progressive-validation',
        family: 'gates',
        variant: 'progressive-validation',
        plainLanguageSummary: 'Use this to keep small tasks light and risky tasks well proven.',
        sourcePath: 'policy-packs/gates/progressive-validation/pack.json',
      }),
    );
    expect(listed[0]?.rules.map((rule) => rule.id)).toEqual([
      'architecture.mid-app.feature-owns-product-behavior',
      'architecture.mid-app.shared-is-earned',
      'architecture.mid-app.import-direction-is-one-way',
    ]);

    const shown = runCliJson<{
      packId: string;
      sourcePath: string;
      driftCheckIds: string[];
      proofFixtureIds: string[];
    }>(['policies', 'show', 'architecture.mid-app', workspaceDir, '--json']);

    expect(shown.packId).toBe('architecture.mid-app');
    expect(shown.sourcePath).toBe('policy-packs/architecture/mid-app/pack.json');
    expect(shown.driftCheckIds).toEqual([
      'architecture.mid-app.business-logic-in-shared-helper',
    ]);
    expect(shown.proofFixtureIds).toEqual(['architecture.mid-app.good-product-app']);

    runCliJson(['init', workspaceDir, '--json']);

    const recommendations = runCliJson<{
      projectLifecycle: string;
      defaultExecutionLane: string;
      recommendations: Array<{
        packId: string;
        family: string;
        displayName: string;
        accepted: boolean;
        recommendation: string;
        confidence: string;
        reason: string;
      }>;
    }>(['policies', 'recommend', workspaceDir, '--json']);

    expect(recommendations.projectLifecycle).toBe('established-brownfield');
    expect(recommendations.defaultExecutionLane).toBe('normal');
    expect(recommendations.recommendations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        packId: 'architecture.mid-app',
        family: 'architecture',
        displayName: 'Mid-App Architecture',
        accepted: false,
        recommendation: 'apply',
        confidence: 'high',
      }),
      expect.objectContaining({
        packId: 'gates.progressive-validation',
        family: 'gates',
        displayName: 'Progressive Validation Gates',
        accepted: false,
        recommendation: 'apply',
        confidence: 'high',
      }),
    ]));

    const recommendationText = runCliText(['policies', 'recommend', workspaceDir]);
    expect(recommendationText).toContain('Status: Recommendation ready');
    expect(recommendationText).toContain('Next step:');
    expect(recommendationText).toContain('skopos policies apply architecture.mid-app .');

    const applied = runCliJson<{
      policyWrite: string;
      roleMappingWrite: string;
      policyBriefWrite: string;
      agentsWrite: string;
      actorId?: string;
      roleMapping: {
        type: string;
        mappings: Array<{
          packId: string;
          role: string;
          status: string;
          matchedPaths: string[];
        }>;
      };
      policy: {
        defaultExecutionLane: string;
        acceptedPacks: Array<{ packId: string; acceptedBy?: string; reason: string }>;
        recommendedExecutionLanes: Array<{ lane: string; triggers: string[] }>;
      };
    }>([
      'policies',
      'apply',
      'architecture.mid-app',
      workspaceDir,
      '--actor',
      'agent-policy',
      '--reason',
      'Fixture acceptance for policy loop coverage.',
      '--json',
    ]);

    expect(applied.policyWrite).toBe('written');
    expect(applied.roleMappingWrite).toBe('written');
    expect(applied.policyBriefWrite).toBe('written');
    expect(applied.agentsWrite).toBe('written');
    expect(applied.actorId).toBe('agent-policy');
    expect(applied.roleMapping).toEqual(
      expect.objectContaining({
        type: 'policy-role-mapping',
        mappings: expect.arrayContaining([
          expect.objectContaining({
            packId: 'architecture.mid-app',
            role: 'features / modules / domains',
            status: 'inferred',
          }),
        ]),
      }),
    );
    expect(applied.policy.defaultExecutionLane).toBe('normal');
    expect(applied.policy.acceptedPacks).toEqual([
      expect.objectContaining({
        packId: 'architecture.mid-app',
        acceptedBy: 'agent-policy',
        reason: 'Fixture acceptance for policy loop coverage.',
      }),
    ]);
    expect(applied.policy.recommendedExecutionLanes.map((entry) => entry.lane)).toEqual([
      'light',
      'normal',
      'workpack',
    ]);
    const appliedGate = runCliJson<{
      policy: {
        acceptedPacks: Array<{ packId: string }>;
        activeRules: Array<{ id: string }>;
      };
    }>([
      'policies',
      'apply',
      'gates.progressive-validation',
      workspaceDir,
      '--actor',
      'agent-policy',
      '--reason',
      'Fixture acceptance for gate composition coverage.',
      '--json',
    ]);
    expect(appliedGate.policy.acceptedPacks.map((entry) => entry.packId)).toEqual([
      'architecture.mid-app',
      'gates.progressive-validation',
    ]);
    expect(appliedGate.policy.activeRules.map((entry) => entry.id)).toEqual(
      expect.arrayContaining([
        'architecture.mid-app.feature-owns-product-behavior',
        'gates.progressive-validation.closure-records-proof',
      ]),
    );

    const appliedText = runCliText([
      'policies',
      'apply',
      'architecture.mid-app',
      workspaceDir,
      '--actor',
      'agent-policy',
      '--reason',
      'Fixture acceptance for policy text coverage.',
      '--dry-run',
    ]);
    expect(appliedText).toContain('Status: Preview only');
    expect(appliedText).toContain('Next step:');
    expect(appliedText).toContain('without `--dry-run`');

    const policyBrief = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'agent', 'policy-brief.json'), 'utf8'),
    ) as {
      briefKind: string;
      acceptedPackIds: string[];
      defaultExecutionLane: string;
      workpackTriggers: string[];
      roleMappingPath?: string;
      mappedRoleCount?: number;
      missingRequiredRoleCount?: number;
    };
    expect(policyBrief).toEqual(
      expect.objectContaining({
        briefKind: 'policy',
        acceptedPackIds: ['architecture.mid-app', 'gates.progressive-validation'],
        defaultExecutionLane: 'normal',
      }),
    );
    expect(policyBrief.workpackTriggers).toContain('public API or package boundary change');
    expect(policyBrief.roleMappingPath).toBe('.skopos/policies/role-mapping.json');
    expect(policyBrief.mappedRoleCount).toBeGreaterThanOrEqual(1);
    expect(policyBrief.missingRequiredRoleCount).toBeGreaterThanOrEqual(0);

    const roleMapping = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'policies', 'role-mapping.json'), 'utf8'),
    ) as {
      type: string;
      mappings: Array<{ packId: string; role: string; matchedPaths: string[] }>;
    };
    expect(roleMapping).toEqual(
      expect.objectContaining({
        type: 'policy-role-mapping',
        mappings: expect.arrayContaining([
          expect.objectContaining({
            packId: 'architecture.mid-app',
            role: 'features / modules / domains',
            matchedPaths: expect.arrayContaining(['src/features']),
          }),
        ]),
      }),
    );

    const emptyMappingDecisions = runCliJson<{
      decisions: Array<{ id: string }>;
    }>(['policies', 'mappings', 'list', workspaceDir, '--json']);
    expect(emptyMappingDecisions.decisions).toEqual([]);

    const confirmedMapping = runCliJson<{
      artifactWrite: string;
      roleMappingWrite: string;
      artifact: {
        decisions: Array<{ id: string; packId: string; role: string; status: string; matchedPaths?: string[] }>;
      };
      roleMapping: {
        mappings: Array<{ role: string; status: string; matchedPaths: string[]; reason: string }>;
      };
    }>([
      'policies',
      'mappings',
      'confirm',
      '--cwd',
      workspaceDir,
      '--pack',
      'architecture.mid-app',
      '--role',
      'features / modules / domains',
      '--path',
      'src/features',
      '--reason',
      'Fixture confirms features are the local product-role folder.',
      '--owner',
      'agent-policy',
      '--actor',
      'agent-policy',
      '--json',
    ]);
    expect(confirmedMapping.artifactWrite).toBe('written');
    expect(confirmedMapping.roleMappingWrite).toBe('written');
    expect(confirmedMapping.artifact.decisions).toContainEqual(
      expect.objectContaining({
        id: 'role-map-architecture.mid-app-features-modules-domains',
        packId: 'architecture.mid-app',
        role: 'features / modules / domains',
        status: 'confirmed',
        matchedPaths: ['src/features'],
      }),
    );
    expect(confirmedMapping.roleMapping.mappings).toContainEqual(
      expect.objectContaining({
        role: 'features / modules / domains',
        status: 'confirmed',
        matchedPaths: ['src/features'],
        reason: 'Fixture confirms features are the local product-role folder.',
      }),
    );

    const ignoredMapping = runCliJson<{
      artifact: { decisions: Array<{ id: string; status: string; role: string }> };
      roleMapping: { mappings: Array<{ role: string; status: string; reason: string }> };
    }>([
      'policies',
      'mappings',
      'ignore',
      '--cwd',
      workspaceDir,
      '--pack',
      'architecture.mid-app',
      '--role',
      'ui / components / design system',
      '--reason',
      'Fixture does not have a separate reusable UI role yet.',
      '--actor',
      'agent-policy',
      '--json',
    ]);
    expect(ignoredMapping.artifact.decisions).toContainEqual(
      expect.objectContaining({
        id: 'role-map-architecture.mid-app-ui-components-design-system',
        role: 'ui / components / design system',
        status: 'ignored',
      }),
    );
    expect(ignoredMapping.roleMapping.mappings).toContainEqual(
      expect.objectContaining({
        role: 'ui / components / design system',
        status: 'ignored',
        reason: 'Fixture does not have a separate reusable UI role yet.',
      }),
    );

    const mappingText = runCliText(['policies', 'mappings', 'list', workspaceDir]);
    expect(mappingText).toContain('Status: Decisions active');
    expect(mappingText).toContain('Fixture confirms features are the local product-role folder.');

    const removedMappingDecision = runCliJson<{
      artifact: { decisions: Array<{ id: string }> };
      roleMapping: { mappings: Array<{ role: string; status: string }> };
    }>([
      'policies',
      'mappings',
      'remove',
      'role-map-architecture.mid-app-features-modules-domains',
      '--cwd',
      workspaceDir,
      '--actor',
      'agent-policy',
      '--json',
    ]);
    expect(removedMappingDecision.artifact.decisions).not.toContainEqual(
      expect.objectContaining({ id: 'role-map-architecture.mid-app-features-modules-domains' }),
    );
    expect(removedMappingDecision.roleMapping.mappings).toContainEqual(
      expect.objectContaining({
        role: 'features / modules / domains',
        status: 'inferred',
      }),
    );

    const promptBrief = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'agent', 'prompt-brief.json'), 'utf8'),
    ) as {
      recommendedLoadSequence: string[];
      measurements: Array<{ id: string; status: string }>;
    };
    expect(promptBrief.recommendedLoadSequence).toContain('stable-project-policy-prefix');
    expect(promptBrief.measurements).toContainEqual(
      expect.objectContaining({
        id: 'policy-brief',
        status: 'within-budget',
      }),
    );
    expect(JSON.stringify(promptBrief)).toContain('policy-role-mapping');

    const agents = await readFile(join(workspaceDir, 'AGENTS.md'), 'utf8');
    expect(agents).toContain('## Skopos Accepted Policy');
    expect(agents).toContain('.skopos/policies/resolved.json');
    expect(agents).toContain('workpack for public API, architecture, stack, security, migration, multi-package, or long-running changes');

    const trust = runCliJson<{
      checks: Array<{ id: string; status: string; summary: string }>;
    }>(['trust', workspaceDir, '--json']);
    expect(trust.checks).toContainEqual(
      expect.objectContaining({
        id: 'accepted-policy',
        status: 'pass',
      }),
    );
    expect(trust.checks).toContainEqual(
      expect.objectContaining({
        id: 'policy-brief',
        status: 'pass',
      }),
    );
    expect(trust.checks).toContainEqual(
      expect.objectContaining({
        id: 'policy-source-freshness',
        status: 'pass',
      }),
    );

    const cleanDrift = runCliJson<{
      reportWrite: string;
      report: {
        counts: { openMustCount: number; openShouldCount: number };
        findings: Array<{ ruleId?: string; sourcePath?: string }>;
      };
    }>(['policies', 'drift', workspaceDir, '--actor', 'agent-policy', '--json']);
    expect(cleanDrift.reportWrite).toBe('written');
    expect(cleanDrift.report.counts.openMustCount).toBe(0);
    expect(cleanDrift.report.counts.openShouldCount).toBe(0);
    expect(cleanDrift.report.findings).toEqual([]);

    const cleanDriftText = runCliText([
      'policies',
      'drift',
      workspaceDir,
      '--actor',
      'agent-policy',
      '--dry-run',
    ]);
    expect(cleanDriftText).toContain('Status: Looks good');
    expect(cleanDriftText).toContain('Next step:');
    expect(cleanDriftText).toContain('No policy drift needs action right now.');

    const cleanTrust = runCliJson<{
      checks: Array<{ id: string; status: string; summary: string }>;
    }>(['trust', workspaceDir, '--json']);
    expect(cleanTrust.checks).toContainEqual(
      expect.objectContaining({
        id: 'policy-drift',
        status: 'pass',
      }),
    );

    await mkdir(join(workspaceDir, 'src', 'shared'), { recursive: true });
    await mkdir(join(workspaceDir, 'src', 'features', 'billing'), { recursive: true });
    await writeFile(
      join(workspaceDir, 'src', 'shared', 'helpers.ts'),
      [
        'export function orderTotalLabel(totalCents: number): string {',
        "  return `Order total: $${(totalCents / 100).toFixed(2)}`;",
        '}',
        '',
        'export function randomId(): string {',
        '  return Math.random().toString(36).slice(2);',
        '}',
      ].join('\n'),
      'utf8',
    );
    await writeFile(
      join(workspaceDir, 'src', 'features', 'billing', 'service.ts'),
      [
        "import { OrderList } from '../orders/components/order-list.js';",
        '',
        'export async function renderBillingPreview() {',
        '  return OrderList();',
        '}',
      ].join('\n'),
      'utf8',
    );

    const drift = runCliJson<{
      report: {
        counts: { openMustCount: number };
        findings: Array<{ ruleId?: string; sourcePath?: string; severity: string }>;
      };
    }>(['policies', 'drift', workspaceDir, '--actor', 'agent-policy', '--json']);
    expect(drift.report.counts.openMustCount).toBeGreaterThanOrEqual(3);
    expect(drift.report.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: 'architecture.mid-app.shared-is-earned',
          sourcePath: 'src/shared/helpers.ts',
          severity: 'must',
        }),
        expect.objectContaining({
          ruleId: 'architecture.mid-app.feature-owns-product-behavior',
          sourcePath: 'src/shared/helpers.ts',
          severity: 'must',
        }),
        expect.objectContaining({
          ruleId: 'architecture.mid-app.import-direction-is-one-way',
          sourcePath: 'src/features/billing/service.ts',
          severity: 'must',
        }),
      ]),
    );

    const driftText = runCliText([
      'policies',
      'drift',
      workspaceDir,
      '--actor',
      'agent-policy',
      '--dry-run',
    ]);
    expect(driftText).toContain('Status: Fix before closing');
    expect(driftText).toContain('Attention:');
    expect(driftText).toContain('Next step:');
    expect(driftText).toContain('Then run `skopos policies drift .` again.');

    const driftTrust = runCliJson<{
      checks: Array<{ id: string; status: string; summary: string }>;
    }>(['trust', workspaceDir, '--json']);
    expect(driftTrust.checks).toContainEqual(
      expect.objectContaining({
        id: 'policy-drift',
        status: 'fail',
      }),
    );

    const driftTrustText = runCliText(['trust', workspaceDir]);
    expect(driftTrustText).toContain('Status: Fix before closing');
    expect(driftTrustText).toContain('Attention:');
    expect(driftTrustText).toContain('Next step:');
    expect(driftTrustText).toContain('Fix `policy-drift`, then run `skopos trust` again.');

    const blockedDone = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string; summary: string }>;
      requiredActions: string[];
    }>([
      'done',
      'src/shared/helpers.ts',
      '--cwd',
      workspaceDir,
      '--actor',
      'agent-policy',
      '--json',
    ]);
    expect(blockedDone.closureStatus).toBe('blocked');
    expect(blockedDone.checks).toContainEqual(
      expect.objectContaining({
        id: 'accepted-must-policy-drift',
        status: 'fail',
      }),
    );
    expect(blockedDone.requiredActions).toContain(
      'Fix open accepted `must` policy drift or add a clear local policy override, then run `skopos policies drift .` before closure.',
    );

    const emptyOverrides = runCliJson<{
      overrides: Array<{ id: string }>;
    }>(['policies', 'overrides', 'list', workspaceDir, '--json']);
    expect(emptyOverrides.overrides).toEqual([]);

    const overrideResult = runCliJson<{
      artifactWrite: string;
      resolvedPolicyWrite: string;
      artifact: {
        overrides: Array<{
          id: string;
          ruleId?: string;
          sourcePath?: string;
          reason: string;
          owner?: string;
        }>;
      };
    }>([
      'policies',
      'overrides',
      'add',
      '--cwd',
      workspaceDir,
      '--rule',
      'architecture.mid-app.shared-is-earned',
      '--source-path',
      'src/shared/helpers.ts',
      '--reason',
      'Fixture intentionally keeps this shared helper while migration is pending.',
      '--owner',
      'agent-policy',
      '--actor',
      'agent-policy',
      '--json',
    ]);
    expect(overrideResult.artifactWrite).toBe('written');
    expect(overrideResult.resolvedPolicyWrite).toBe('written');
    expect(overrideResult.artifact.overrides).toEqual([
      expect.objectContaining({
        id: 'override-architecture.mid-app.shared-is-earned-src-shared-helpers.ts',
        ruleId: 'architecture.mid-app.shared-is-earned',
        sourcePath: 'src/shared/helpers.ts',
        reason: 'Fixture intentionally keeps this shared helper while migration is pending.',
        owner: 'agent-policy',
      }),
    ]);

    const overrideText = runCliText(['policies', 'overrides', 'list', workspaceDir]);
    expect(overrideText).toContain('Status: Overrides active');
    expect(overrideText).toContain('Fixture intentionally keeps this shared helper while migration is pending.');
    expect(overrideText).toContain('Run `skopos policies drift .`');

    const suppressedDrift = runCliJson<{
      report: {
        counts: { openMustCount: number; suppressedCount: number };
        findings: Array<{ ruleId?: string; status: string; overrideId?: string; sourcePath?: string }>;
      };
    }>(['policies', 'drift', workspaceDir, '--actor', 'agent-policy', '--json']);
    expect(suppressedDrift.report.counts.openMustCount).toBe(drift.report.counts.openMustCount - 1);
    expect(suppressedDrift.report.counts.suppressedCount).toBe(1);
    expect(suppressedDrift.report.findings).toContainEqual(
      expect.objectContaining({
        ruleId: 'architecture.mid-app.shared-is-earned',
        sourcePath: 'src/shared/helpers.ts',
        status: 'suppressed',
        overrideId: 'override-architecture.mid-app.shared-is-earned-src-shared-helpers.ts',
      }),
    );

    const removedOverride = runCliJson<{
      resolvedPolicyWrite: string;
      artifact: { overrides: Array<{ id: string }> };
    }>([
      'policies',
      'overrides',
      'remove',
      'override-architecture.mid-app.shared-is-earned-src-shared-helpers.ts',
      '--cwd',
      workspaceDir,
      '--actor',
      'agent-policy',
      '--json',
    ]);
    expect(removedOverride.resolvedPolicyWrite).toBe('written');
    expect(removedOverride.artifact.overrides).toEqual([]);
  });

  it('discovers and runs registered project workflows with run evidence', async () => {
    const workspaceDir = await createTempWorkspace();

    const listed = runCliJson<
      Array<{
        id: string;
        category: string;
        safety: string;
        sourcePath: string;
      }>
    >(['workflows', 'list', workspaceDir, '--json']);
    expect(listed).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'docs.generate-note',
          category: 'docs-generator',
          safety: 'mutating',
          sourcePath: 'tools/skopos/workflows/docs-generate-note.yaml',
        }),
        expect.objectContaining({
          id: 'reference.refresh-api-note',
          category: 'reference-generator',
          safety: 'mutating',
          sourcePath: 'tools/skopos/workflows/reference-refresh-api-note.yaml',
        }),
      ]),
    );

    const shown = runCliJson<{
      id: string;
      command: string;
      outputs: string[];
      whenToUse?: string;
    }>(['workflows', 'show', 'docs.generate-note', workspaceDir, '--json']);
    expect(shown.id).toBe('docs.generate-note');
    expect(shown.command).toBe('node tools/skopos/scripts/generate-doc-note.mjs');
    expect(shown.outputs).toEqual(['docs/generated/skopos/workflow-note.md']);
    expect(shown.whenToUse).toContain('changing core instructions or docs bootstrap');

    const run = runCliJson<{
      workflowId: string;
      workflowCategory: string;
      workflowSafety: string;
      runStatus: string;
      outputPaths: string[];
      sourcePath: string;
      runByActorId?: string;
    }>([
      'workflows',
      'run',
      'docs.generate-note',
      workspaceDir,
      '--actor',
      'agent-docs',
      '--json',
    ]);
    expect(run.workflowId).toBe('docs.generate-note');
    expect(run.workflowCategory).toBe('docs-generator');
    expect(run.workflowSafety).toBe('mutating');
    expect(run.runStatus).toBe('succeeded');
    expect(run.runByActorId).toBe('agent-docs');
    expect(run.sourcePath).toBe('tools/skopos/workflows/docs-generate-note.yaml');
    expect(run.outputPaths).toEqual(['docs/generated/skopos/workflow-note.md']);

    const generatedDoc = await readFile(
      join(workspaceDir, 'docs/generated/skopos/workflow-note.md'),
      'utf8',
    );
    expect(generatedDoc).toContain('Generated by the fixture Skopos workflow.');

    const runArtifacts = await readdir(join(workspaceDir, '.skopos', 'runs'));
    expect(runArtifacts.some((entry) => entry.includes('docs-generate-note'))).toBe(true);
  });

  it('maintains a compact knowledge index and append-only operational log across the runtime lifecycle', async () => {
    const workspaceDir = await createTempWorkspace();

    runCliJson(['init', workspaceDir, '--actor', 'agent-bootstrap', '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--actor', 'agent-proof', '--json']);
    runCliJson([
      'plan',
      'refresh api billing guidance',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-plan',
      '--json',
    ]);
    runCliJson([
      'workflows',
      'run',
      'reference.refresh-api-note',
      workspaceDir,
      '--actor',
      'agent-api',
      '--json',
    ]);
    runCliJson(['scan', workspaceDir, '--actor', 'agent-diagnosis', '--json']);
    runCliJson(['trust', workspaceDir, '--actor', 'agent-review', '--json']);
    runCliJson([
      'impact',
      'packages/api/package.json',
      '--cwd',
      workspaceDir,
      '--actor',
      'agent-impact',
      '--json',
    ]);
    runCliJson(['done', 'packages/api/package.json', '--cwd', workspaceDir, '--json']);

    const index = JSON.parse(
      await readFile(join(workspaceDir, '.skopos', 'index.json'), 'utf8'),
    ) as {
      trustLevel: string;
      readiness: string;
      counts: {
        planCount: number;
        missionCount: number;
        workflowRunCount: number;
        graphCount: number;
      };
      latestEvent?: { eventKind: string; status: string };
      entries: Array<{ kind: string; path: string }>;
    };
    const logEntries = (await readFile(join(workspaceDir, '.skopos', 'log.jsonl'), 'utf8'))
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(
        (line) =>
          JSON.parse(line) as {
            eventKind: string;
            status: string;
            metadata?: { actorId?: string | null };
          },
      );
    const eventKinds = logEntries.map((entry) => entry.eventKind);

    expect(index.trustLevel).toBe('high');
    expect(index.readiness).toBe('agent-ready');
    expect(index.counts.planCount).toBe(1);
    expect(index.counts.missionCount).toBe(1);
    expect(index.counts.workflowRunCount).toBe(1);
    expect(index.counts.graphCount).toBeGreaterThanOrEqual(5);
    expect(index.latestEvent).toEqual(
      expect.objectContaining({
        eventKind: 'done',
        status: 'succeeded',
      }),
    );
    expect(index.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'plan-artifact',
          path: expect.stringMatching(/^\.skopos\/plans\/.*\.json$/),
        }),
        expect.objectContaining({
          kind: 'mission-artifact',
          path: expect.stringMatching(/^\.skopos\/missions\/.*\.json$/),
        }),
        expect.objectContaining({
          kind: 'workflow-run-artifact',
          path: expect.stringMatching(/^\.skopos\/runs\/.*\.json$/),
        }),
      ]),
    );
    expect(eventKinds).toEqual(
      expect.arrayContaining([
        'init',
        'instructions-sync',
        'plan',
        'workflow-run',
        'scan',
        'trust',
        'impact',
        'done',
      ]),
    );
    expect(logEntries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventKind: 'init',
          metadata: expect.objectContaining({
            actorId: 'agent-bootstrap',
          }),
        }),
        expect.objectContaining({
          eventKind: 'scan',
          metadata: expect.objectContaining({
            actorId: 'agent-diagnosis',
          }),
        }),
        expect.objectContaining({
          eventKind: 'trust',
          metadata: expect.objectContaining({
            actorId: 'agent-review',
          }),
        }),
        expect.objectContaining({
          eventKind: 'impact',
          metadata: expect.objectContaining({
            actorId: 'agent-impact',
          }),
        }),
      ]),
    );
    expect(logEntries.at(-1)).toEqual(
      expect.objectContaining({
        eventKind: 'done',
        status: 'succeeded',
      }),
    );
  });

  it('blocks approval-sensitive workflows without --approve and runs them when approved', async () => {
    const workspaceDir = await createTempWorkspace(approvalFixtureRepoRoot);

    const shown = runCliJson<{
      id: string;
      safety: string;
      requiresApproval: boolean;
    }>(['workflows', 'show', 'maintenance.destructive-cleanup', workspaceDir, '--json']);
    expect(shown.id).toBe('maintenance.destructive-cleanup');
    expect(shown.safety).toBe('destructive');
    expect(shown.requiresApproval).toBe(true);

    const failure = runCliFailure([
      'workflows',
      'run',
      'maintenance.destructive-cleanup',
      workspaceDir,
      '--json',
    ]);
    expect(failure.message).toContain('requires explicit approval');

    const approvedWithoutActor = runCliFailure([
      'workflows',
      'run',
      'maintenance.destructive-cleanup',
      workspaceDir,
      '--approve',
      '--json',
    ]);
    expect(approvedWithoutActor.message).toContain('mutates workspace state');

    const approvedRun = runCliJson<{
      workflowId: string;
      workflowSafety: string;
      runStatus: string;
      outputPaths: string[];
      runByActorId?: string;
    }>([
      'workflows',
      'run',
      'maintenance.destructive-cleanup',
      workspaceDir,
      '--approve',
      '--actor',
      'agent-ops',
      '--json',
    ]);
    expect(approvedRun.workflowId).toBe('maintenance.destructive-cleanup');
    expect(approvedRun.workflowSafety).toBe('destructive');
    expect(approvedRun.runStatus).toBe('succeeded');
    expect(approvedRun.runByActorId).toBe('agent-ops');
    expect(approvedRun.outputPaths).toEqual(['.tmp/skopos/destructive-cleanup.log']);

    const outputLog = await readFile(
      join(workspaceDir, '.tmp/skopos/destructive-cleanup.log'),
      'utf8',
    );
    expect(outputLog).toContain('destructive cleanup approved');
  });

  it('renders a local graph portal from generated graph artifacts', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson([
      'plan',
      'add public api endpoint for billing summaries',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--json',
    ]);
    runCliJson([
      'workflows',
      'run',
      'reference.refresh-api-note',
      workspaceDir,
      '--actor',
      'agent-ui',
      '--json',
    ]);
    runCliJson(['impact', 'packages/api/package.json', '--cwd', workspaceDir, '--json']);

    const portal = runCliJson<{
      outputPath: string;
      graphPortalPath: string;
      writeStatus: string;
      graphPortalWriteStatus: string;
      graphCount: number;
      trustLevel: string;
      readiness: string;
      html: string;
      graphHtml: string;
    }>(['ui', 'render', workspaceDir, '--json']);

    expect(portal.writeStatus).toBe('written');
    expect(portal.graphPortalWriteStatus).toBe('written');
    expect(portal.graphCount).toBeGreaterThanOrEqual(3);
    expect(portal.trustLevel).toBe('medium');
    expect(portal.readiness).toBe('needs-review');
    expect(portal.outputPath).toBe(join(workspaceDir, 'docs/generated/skopos/index.html'));
    expect(portal.graphPortalPath).toBe(
      join(workspaceDir, 'docs/generated/skopos/graph-portal.html'),
    );
    expect(portal.html).toContain('Skopos Console');
    expect(portal.html).toContain('Project intelligence console');
    expect(portal.html).toContain('Operational surfaces');
    expect(portal.html).toContain('Docs Surface');
    expect(portal.html).toContain('Command Surface');
    expect(portal.html).toContain('Scope Relations');
    expect(portal.html).toContain('Proof snapshot');
    expect(portal.html).toContain('Recent plans');
    expect(portal.html).toContain('Refresh API reference note');
    expect(portal.graphCount).toBeGreaterThanOrEqual(6);
    expect(portal.graphHtml).toContain('Workspace Graph');
    expect(portal.graphHtml).toContain('Docs Graph');
    expect(portal.graphHtml).toContain('Commands Graph');
    expect(portal.graphHtml).toContain('Scope Relations Graph');
    expect(portal.graphHtml).toContain('Mission Graph');
    expect(portal.graphHtml).toContain('Impact Graph');

    const renderedPortal = await readFile(portal.outputPath, 'utf8');
    expect(renderedPortal).toContain('Skopos Console');
    expect(renderedPortal).toContain('Trust surface');
    expect(renderedPortal).toContain('Operational surfaces');
    expect(renderedPortal).toContain('Recent plans');
    expect(renderedPortal).toContain('Docs Surface');
    expect(renderedPortal).toContain('Command Surface');

    const renderedGraphPortal = await readFile(portal.graphPortalPath, 'utf8');
    expect(renderedGraphPortal).toContain('Graph Portal');
    expect(renderedGraphPortal).toContain('Workspace Graph');
    expect(renderedGraphPortal).toContain('Docs Graph');
    expect(renderedGraphPortal).toContain('Impact Graph');
  });

  it('builds a routed console app from compiled ui state', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    runCliJson([
      'plan',
      'build the routed console for skopos',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-ui',
      '--json',
    ]);
    runCliJson([
      'workflows',
      'run',
      'reference.refresh-api-note',
      workspaceDir,
      '--actor',
      'agent-ui',
      '--json',
    ]);

    const app = runCliJson<{
      outputDirectory: string;
      entryHtmlPath: string;
      statePath: string;
      assetPaths: string[];
      writeStatus: string;
      trustLevel: string;
      readiness: string;
      state: {
        workspaceLabel: string;
        docsLinks: Array<{ id: string }>;
        missions: Array<{ mission: { id: string } }>;
      };
    }>(['ui', 'build', workspaceDir, '--json']);

    expect(app.writeStatus).toBe('written');
    expect(app.trustLevel).toBe('high');
    expect(app.readiness).toBe('agent-ready');
    expect(app.outputDirectory).toBe(join(workspaceDir, 'docs/generated/skopos/app'));
    expect(app.entryHtmlPath).toBe(join(workspaceDir, 'docs/generated/skopos/app/index.html'));
    expect(app.statePath).toBe(join(workspaceDir, 'docs/generated/skopos/app/ui-state.json'));
    expect(app.assetPaths).toEqual(expect.arrayContaining([app.entryHtmlPath, app.statePath]));
    expect(app.assetPaths.some((assetPath) => assetPath.endsWith('.js'))).toBe(true);
    expect(app.state.workspaceLabel).toBe('workspace');
    expect(app.state.docsLinks.some((link) => link.id === 'docs-start')).toBe(true);
    expect(app.state.missions.length).toBeGreaterThanOrEqual(1);

    const renderedApp = await readFile(app.entryHtmlPath, 'utf8');
    const renderedState = await readFile(app.statePath, 'utf8');

    expect(renderedApp).toContain('Skopos Console');
    expect(renderedApp).not.toContain('__SKOPOS_UI_STATE__');
    expect(renderedApp).toContain('"workspaceRoot"');
    expect(renderedState).toContain('"missions"');
    expect(renderedState).toContain('"docsLinks"');
  });

  it('requires fresh workflow evidence for API-scope changes before closure', async () => {
    const workspaceDir = await createTempWorkspace();
    initializeGitWorkspace(workspaceDir);
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    commitWorkspace(workspaceDir, 'baseline');

    await writeFile(
      join(workspaceDir, 'packages/api/package.json'),
      `${await readFile(join(workspaceDir, 'packages/api/package.json'), 'utf8')}\n`,
      'utf8',
    );

    const planned = runCliJson<{
      missionId: string;
    }>([
      'plan',
      'refresh the generated API reference note after package changes',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-api',
      '--json',
    ]);
    runCliJson([
      'mission',
      'claim',
      planned.missionId,
      workspaceDir,
      '--actor',
      'agent-api',
      '--json',
    ]);

    const impact = runCliJson<{
      changedPathSource: string;
      requiredWorkflows: Array<{ id: string; matchedPaths: string[]; reason: string }>;
      requiredActions: string[];
      graphPath: string;
      graphWrite: string;
    }>(['impact', '--cwd', workspaceDir, '--json']);

    expect(impact.changedPathSource).toBe('git-status');
    expect(impact.graphWrite).toBe('written');
    expect(impact.requiredWorkflows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'reference.refresh-api-note',
        }),
      ]),
    );
    expect(impact.requiredWorkflows[0]?.matchedPaths).toContain('packages/api/package.json');
    expect(
      impact.requiredActions.some((action) =>
        action.includes('skopos workflows run reference.refresh-api-note'),
      ),
    ).toBe(true);
    const impactGraph = JSON.parse(await readFile(impact.graphPath, 'utf8')) as {
      graphKind: string;
      nodes: Array<{ id: string; kind: string }>;
      edges: Array<{ from: string; to: string; kind: string }>;
    };
    expect(impactGraph.graphKind).toBe('impact');
    expect(impactGraph.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'changed:packages/api/package.json',
          kind: 'changed-path',
        }),
        expect.objectContaining({
          id: 'workflow:reference.refresh-api-note',
          kind: 'workflow',
        }),
      ]),
    );
    expect(impactGraph.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: 'changed:packages/api/package.json',
          to: 'workflow:reference.refresh-api-note',
          kind: 'requires',
        }),
      ]),
    );

    const doneBefore = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string }>;
      workflowEvidence: Array<{ id: string; status: string }>;
    }>(['done', '--cwd', workspaceDir, '--json']);
    expect(doneBefore.closureStatus).toBe('blocked');
    expect(doneBefore.checks).toContainEqual({
      id: 'required-workflows',
      status: 'fail',
      summary: expect.any(String),
    });
    expect(doneBefore.workflowEvidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'reference.refresh-api-note',
          status: 'fail',
        }),
      ]),
    );

    const workflowRun = runCliJson<{
      workflowId: string;
      runStatus: string;
      outputPaths: string[];
      runByActorId?: string;
    }>([
      'workflows',
      'run',
      'reference.refresh-api-note',
      workspaceDir,
      '--actor',
      'agent-api',
      '--json',
    ]);
    expect(workflowRun.workflowId).toBe('reference.refresh-api-note');
    expect(workflowRun.runStatus).toBe('succeeded');
    expect(workflowRun.runByActorId).toBe('agent-api');
    expect(workflowRun.outputPaths).toEqual(['docs/generated/skopos/api-reference-note.md']);

    const doneAfter = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string }>;
      workflowEvidence: Array<{ id: string; status: string; latestSuccessfulRunByActorId?: string }>;
    }>(['done', '--cwd', workspaceDir, '--json']);
    expect(doneAfter.closureStatus).toBe('needs-review');
    expect(doneAfter.checks).toContainEqual({
      id: 'required-workflows',
      status: 'pass',
      summary: expect.any(String),
    });
    expect(doneAfter.checks).toContainEqual({
      id: 'docs-sync-review',
      status: 'warn',
      summary: expect.any(String),
    });
    expect(doneAfter.workflowEvidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'reference.refresh-api-note',
          status: 'pass',
          latestSuccessfulRunByActorId: 'agent-api',
        }),
      ]),
    );
  });

  it('reports medium trust before mirror sync and high trust after mirror sync', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const trustBefore = runCliJson<{
      trustLevel: string;
      readiness: string;
      checks: Array<{ id: string; status: string }>;
    }>(['trust', workspaceDir, '--json']);
    expect(trustBefore.trustLevel).toBe('medium');
    expect(trustBefore.readiness).toBe('needs-review');
    expect(trustBefore.checks).toContainEqual({
      id: 'instruction-mirrors',
      status: 'warn',
      summary: expect.any(String),
    });
    expect(trustBefore.checks).toContainEqual({
      id: 'workflow-router-adapters',
      status: 'pass',
      summary: expect.stringContaining('Other hosts still require manual router use'),
    });

    runCliJson(['instructions', 'sync', workspaceDir, '--json']);

    const trustAfter = runCliJson<{
      trustLevel: string;
      readiness: string;
      checks: Array<{ id: string; status: string }>;
      unresolvedAssumptions: string[];
    }>(['trust', workspaceDir, '--json']);
    expect(trustAfter.trustLevel).toBe('high');
    expect(trustAfter.readiness).toBe('agent-ready');
    expect(trustAfter.unresolvedAssumptions).toHaveLength(0);
    expect(trustAfter.checks).toContainEqual({
      id: 'workflow-router-adapters',
      status: 'pass',
      summary: expect.stringContaining('Other hosts still require manual router use'),
    });
    expect(trustAfter.checks.every((check) => check.status === 'pass')).toBe(true);
  });

  it('reports impact and blocks closure when AGENTS changes without mirror resync', async () => {
    const workspaceDir = await createTempWorkspace();
    initializeGitWorkspace(workspaceDir);
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    commitWorkspace(workspaceDir, 'baseline');

    await writeFile(
      join(workspaceDir, 'AGENTS.md'),
      `${await readFile(join(workspaceDir, 'AGENTS.md'), 'utf8')}\n- Added a new instruction.\n`,
      'utf8',
    );

    const impact = runCliJson<{
      changedPathSource: string;
      changed: Array<{ path: string; category: string; affectedScopeIds: string[] }>;
      requiredActions: string[];
      instructionMirrorIssues: string[];
    }>(['impact', '--cwd', workspaceDir, '--json']);

    expect(impact.changedPathSource).toBe('git-status');
    expect(impact.changed).toContainEqual({
      path: 'AGENTS.md',
      category: 'instruction-source',
      affectedScopeIds: ['workspace', 'instructions:agents'],
    });
    expect(impact.requiredActions).toContain(
      'Run `skopos instructions sync` to refresh tool instruction mirrors.',
    );
    expect(impact.instructionMirrorIssues).toHaveLength(3);

    const planned = runCliJson<{
      missionId: string;
    }>([
      'plan',
      'refresh the instruction source and sync the generated mirrors',
      workspaceDir,
      '--scope',
      'workspace',
      '--actor',
      'agent-docs',
      '--json',
    ]);
    runCliJson([
      'mission',
      'claim',
      planned.missionId,
      workspaceDir,
      '--actor',
      'agent-docs',
      '--json',
    ]);

    const doneBefore = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string }>;
    }>(['done', '--cwd', workspaceDir, '--json']);
    expect(doneBefore.closureStatus).toBe('blocked');
    expect(doneBefore.checks).toContainEqual({
      id: 'instruction-mirror-parity',
      status: 'fail',
      summary: expect.any(String),
    });

    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    runCliJson(['init', workspaceDir, '--json']);

    const doneAfter = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string }>;
    }>(['done', '--cwd', workspaceDir, '--json']);
    expect(doneAfter.closureStatus).toBe('complete');
    expect(doneAfter.checks.every((check) => check.status === 'pass')).toBe(true);
  });

  it(
    'ignores generated workflow outputs when inferring self-hosted closure from git status',
    async () => {
    const workspaceDir = await createTempWorkspace(selfHostedFixtureRepoRoot);
    initializeGitWorkspace(workspaceDir);
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    commitWorkspace(workspaceDir, 'baseline');

    const proofPlanPath = join(workspaceDir, 'docs/project/proof-phase-plan.md');
    await writeFile(proofPlanPath, `${await readFile(proofPlanPath, 'utf8')}\n`, 'utf8');

    runCliJson([
      'workflows',
      'run',
      'maintenance.refresh-knowledge',
      workspaceDir,
      '--actor',
      'agent-docs',
      '--json',
    ]);
    runCliJson([
      'workflows',
      'run',
      'graph.render-local-portal',
      workspaceDir,
      '--actor',
      'agent-docs',
      '--json',
    ]);
    runCliJson(['ui', 'build', workspaceDir, '--json']);

    const done = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string }>;
      workflowEvidence: Array<{ id: string; status: string }>;
    }>(['done', '--cwd', workspaceDir, '--json']);

    expect(done.closureStatus).toBe('complete');
    expect(done.checks).toContainEqual({
      id: 'required-workflows',
      status: 'pass',
      summary: expect.any(String),
    });
    expect(done.checks).toContainEqual({
      id: 'generated-artifact-edits',
      status: 'pass',
      summary: expect.any(String),
    });
    expect(
      done.workflowEvidence.some((workflow) => workflow.id === 'instructions.sync-mirrors'),
    ).toBe(false);
    },
    60000,
  );

  it('requires mission eval in addition to mission completion when mission evidence is requested', async () => {
    const workspaceDir = await createTempWorkspace();
    initializeGitWorkspace(workspaceDir);
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    commitWorkspace(workspaceDir, 'baseline');

    const start = runCliJson<{
      missionId: string;
    }>([
      'start',
      'fix internal lint issue',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-router',
      '--json',
    ]);

    const doneBefore = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string }>;
      missionEvidence?: {
        mission: { id: string; state: string };
        pendingItemIds: string[];
        claimedByActorId?: string;
        requestedActorId?: string;
      };
      missionEval?: {
        missionId: string;
        evaluationStatus?: string;
      };
      requiredActions: string[];
    }>([
      'done',
      '--mission',
      start.missionId,
      '--actor',
      'agent-router',
      '--cwd',
      workspaceDir,
      '--json',
    ]);

    expect(doneBefore.closureStatus).toBe('blocked');
    expect(doneBefore.checks).toContainEqual({
      id: 'mission-evidence',
      status: 'fail',
      summary: expect.any(String),
    });
    expect(doneBefore.checks).toContainEqual({
      id: 'mission-eval',
      status: 'fail',
      summary: expect.any(String),
    });
    expect(doneBefore.missionEvidence?.mission.id).toBe(start.missionId);
    expect(doneBefore.missionEvidence?.mission.state).toBe('active');
    expect(doneBefore.missionEvidence?.claimedByActorId).toBe('agent-router');
    expect(doneBefore.requiredActions).toContain(
      `Complete mission ${start.missionId} before claiming closure evidence.`,
    );
    expect(doneBefore.requiredActions).toContain(
      `Run \`skopos eval ${workspaceDir} --mission ${start.missionId} --actor agent-router\` before closure.`,
    );
    expect(doneBefore.missionEval?.missionId).toBe(start.missionId);
    expect(doneBefore.missionEval?.evaluationStatus).toBeUndefined();

    const doneBeforeText = runCliText([
      'done',
      '--mission',
      start.missionId,
      '--actor',
      'agent-router',
      '--cwd',
      workspaceDir,
    ]);
    expect(doneBeforeText).toContain('Skopos done');
    expect(doneBeforeText).toContain('Status: Blocked');
    expect(doneBeforeText).toContain('Progress:');
    expect(doneBeforeText).toContain('Next step:');
    expect(doneBeforeText).toContain(`Complete mission ${start.missionId}`);

    const completedMission = runCliJson<{
      id: string;
      state: string;
      items: Array<{ status: string }>;
    }>(['mission', 'complete', start.missionId, workspaceDir, '--actor', 'agent-router', '--json']);

    expect(completedMission.id).toBe(start.missionId);
    expect(completedMission.state).toBe('complete');
    expect(completedMission.items.every((item) => item.status === 'complete')).toBe(true);

    const trustBeforeEval = runCliJson<{
      trustLevel: string;
      readiness: string;
      checks: Array<{ id: string; status: string }>;
    }>(['trust', workspaceDir, '--json']);

    expect(trustBeforeEval.trustLevel).toBe('medium');
    expect(trustBeforeEval.readiness).toBe('needs-review');
    expect(trustBeforeEval.checks).toContainEqual({
      id: 'mission-evals',
      status: 'warn',
      summary: expect.any(String),
    });

    const doneAfterMissionOnly = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string }>;
      missionEval?: {
        missionId: string;
        evaluationStatus?: string;
      };
      requiredActions: string[];
    }>([
      'done',
      '--mission',
      start.missionId,
      '--actor',
      'agent-router',
      '--cwd',
      workspaceDir,
      '--json',
    ]);

    expect(doneAfterMissionOnly.closureStatus).toBe('blocked');
    expect(doneAfterMissionOnly.checks).toContainEqual({
      id: 'mission-eval',
      status: 'fail',
      summary: expect.any(String),
    });
    expect(doneAfterMissionOnly.missionEval?.missionId).toBe(start.missionId);
    expect(doneAfterMissionOnly.requiredActions).toContain(
      `Run \`skopos eval ${workspaceDir} --mission ${start.missionId} --actor agent-router\` before closure.`,
    );

    await writePassingProofReport(workspaceDir);
    runCliJson([
      'workflows',
      'run',
      'reference.refresh-api-note',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);
    runCliJson([
      'eval',
      workspaceDir,
      '--mission',
      start.missionId,
      '--actor',
      'agent-router',
      '--json',
    ]);

    const evalText = runCliText([
      'eval',
      workspaceDir,
      '--mission',
      start.missionId,
      '--actor',
      'agent-router',
    ]);
    expect(evalText).toContain('Skopos eval');
    expect(evalText).toContain('Status: Looks good');
    expect(evalText).toContain('Progress:');
    expect(evalText).toContain('Current phase:');
    expect(evalText).toContain('Next step:');
    expect(evalText).toContain('skopos done');

    const doneAfterEval = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string }>;
      missionEvidence?: {
        mission: { id: string; state: string };
        pendingItemIds: string[];
        claimedByActorId?: string;
        requestedActorId?: string;
      };
      missionEval?: {
        missionId: string;
        evaluationStatus?: string;
      };
    }>([
      'done',
      '--mission',
      start.missionId,
      '--actor',
      'agent-router',
      '--cwd',
      workspaceDir,
      '--json',
    ]);

    expect(doneAfterEval.closureStatus).toBe('complete');
    expect(doneAfterEval.checks).toContainEqual({
      id: 'mission-evidence',
      status: 'pass',
      summary: expect.any(String),
    });
    expect(doneAfterEval.checks).toContainEqual({
      id: 'mission-eval',
      status: 'pass',
      summary: expect.any(String),
    });
    expect(doneAfterEval.checks).toContainEqual({
      id: 'mission-ownership',
      status: 'pass',
      summary: expect.any(String),
    });
    expect(doneAfterEval.missionEvidence?.mission.state).toBe('complete');
    expect(doneAfterEval.missionEvidence?.pendingItemIds).toHaveLength(0);
    expect(doneAfterEval.missionEval?.missionId).toBe(start.missionId);
    expect(doneAfterEval.missionEval?.evaluationStatus).toBe('complete');
  });

  it('allows workspaces without a registered proof lane to complete eval and closure without proof', async () => {
    const workspaceDir = await createTempWorkspace();
    initializeGitWorkspace(workspaceDir);
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    commitWorkspace(workspaceDir, 'baseline');

    const start = runCliJson<{
      missionId: string;
    }>([
      'start',
      'fix internal lint issue',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-router',
      '--json',
    ]);

    runCliJson([
      'workflows',
      'run',
      'reference.refresh-api-note',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);

    const evalResult = runCliJson<{
      eval: {
        evaluationStatus: string;
        proof: { status: string };
        workflowEvidence: Array<{ id: string; status: string }>;
      };
    }>([
      'eval',
      workspaceDir,
      '--mission',
      start.missionId,
      '--actor',
      'agent-router',
      '--json',
    ]);

    expect(evalResult.eval.evaluationStatus).toBe('complete');
    expect(evalResult.eval.proof.status).toBe('missing');
    expect(evalResult.eval.workflowEvidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'reference.refresh-api-note',
          status: 'pass',
        }),
      ]),
    );

    runCliJson([
      'mission',
      'complete',
      start.missionId,
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);

    const done = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string }>;
      missionEval?: {
        missionId: string;
        evaluationStatus?: string;
      };
    }>([
      'done',
      '--mission',
      start.missionId,
      '--actor',
      'agent-router',
      '--cwd',
      workspaceDir,
      '--json',
    ]);

    expect(done.closureStatus).toBe('complete');
    expect(done.checks).toContainEqual({
      id: 'mission-eval',
      status: 'pass',
      summary: expect.any(String),
    });
    expect(done.missionEval?.missionId).toBe(start.missionId);
    expect(done.missionEval?.evaluationStatus).toBe('complete');
  });

  it('reconciles stale advisory decision items during eval so done can close an older mission cleanly', async () => {
    const workspaceDir = await createTempWorkspace();
    initializeGitWorkspace(workspaceDir);
    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    commitWorkspace(workspaceDir, 'baseline');

    const start = runCliJson<{
      missionId: string;
      missionPath: string;
    }>([
      'start',
      'fix internal lint issue',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-router',
      '--json',
    ]);

    const missionArtifact = JSON.parse(
      await readFile(start.missionPath, 'utf8'),
    ) as {
      decisionQuestionIds: string[];
      items: Array<{ id: string; kind: string; title: string; detail: string; status: string }>;
    };
    missionArtifact.decisionQuestionIds = ['plan.scope-confirmation'];
    missionArtifact.items = [
      {
        id: 'decision-plan.scope-confirmation',
        kind: 'decision',
        title: 'Should this change stay at workspace scope, or should it be narrowed to one package or domain?',
        detail: 'Wide-scope plans in monorepos drift faster and make trust reports less precise.',
        status: 'pending',
      },
      ...missionArtifact.items,
    ];
    await writeFile(start.missionPath, JSON.stringify(missionArtifact, null, 2), 'utf8');

    await writePassingProofReport(workspaceDir);
    runCliJson([
      'workflows',
      'run',
      'reference.refresh-api-note',
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);

    const evalResult = runCliJson<{
      eval: {
        evaluationStatus: string;
        pendingItemIds: string[];
      };
    }>([
      'eval',
      workspaceDir,
      '--mission',
      start.missionId,
      '--actor',
      'agent-router',
      '--json',
    ]);

    expect(evalResult.eval.evaluationStatus).toBe('complete');
    expect(evalResult.eval.pendingItemIds).toHaveLength(0);

    runCliJson([
      'mission',
      'complete',
      start.missionId,
      workspaceDir,
      '--actor',
      'agent-router',
      '--json',
    ]);

    const done = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string }>;
      missionEval?: {
        missionId: string;
        evaluationStatus?: string;
        pendingItemIds: string[];
      };
    }>([
      'done',
      '--mission',
      start.missionId,
      '--actor',
      'agent-router',
      '--cwd',
      workspaceDir,
      '--json',
    ]);

    expect(done.closureStatus).toBe('complete');
    expect(done.checks).toContainEqual({
      id: 'mission-eval',
      status: 'pass',
      summary: expect.any(String),
    });
    expect(done.missionEval?.missionId).toBe(start.missionId);
    expect(done.missionEval?.pendingItemIds).toHaveLength(0);
  });

  it('runs eval in the background and polls compact job state', async () => {
    const workspaceDir = await createTempWorkspace();
    runCliJson(['init', workspaceDir, '--json']);

    const start = runCliJson<{
      missionId: string;
      questionsPath: string;
    }>([
      'start',
      'add public api endpoint for billing summaries',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-background',
      '--json',
    ]);

    const questions = JSON.parse(await readFile(start.questionsPath, 'utf8')) as {
      entries: Array<{ id: string; recommendedOptionId: string }>;
    };
    for (const question of questions.entries) {
      runCliJson([
        'decide',
        question.id,
        question.recommendedOptionId,
        workspaceDir,
        '--actor',
        'agent-background',
        '--json',
      ]);
    }

    await writePassingProofReport(workspaceDir);

    const queued = runCliJson<{
      summary: string;
      missionId: string;
      jobId: string;
      jobState: string;
      nextCommand: string;
    }>([
      'eval',
      workspaceDir,
      '--mission',
      start.missionId,
      '--actor',
      'agent-background',
      '--background',
      '--compact',
      '--json',
    ]);

    expect(queued.missionId).toBe(start.missionId);
    expect(queued.jobState).toBe('queued');
    expect(queued.nextCommand).toContain(`skopos jobs show ${queued.jobId}`);

    const completedJob = await waitForBackgroundJob(workspaceDir, queued.jobId);
    expect(completedJob.jobState).toBe('succeeded');
    expect(completedJob.missionId).toBe(start.missionId);
    expect(completedJob.resultPath).toContain(`.skopos/evals/${start.missionId}.json`);
    expect(completedJob.errorMessage).toBeUndefined();
  });

  it('coordinates mission ownership across multiple actors before completion', async () => {
    const workspaceDir = await createTempWorkspace();

    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    const plan = runCliJson<{
      missionId: string;
      mission: {
        state: string;
        coordination: {
          claimedBy?: {
            actorId: string;
          };
        };
      };
    }>([
      'plan',
      'stabilize shared reporting helper',
      workspaceDir,
      '--scope',
      '@fixture/shared',
      '--json',
    ]);

    expect(plan.mission.state).toBe('planned');
    expect(plan.mission.coordination.claimedBy).toBeUndefined();

    const claimed = runCliJson<{
      id: string;
      state: string;
      coordination: {
        claimedBy?: {
          actorId: string;
        };
        lastUpdatedBy?: string;
      };
    }>([
      'mission',
      'claim',
      plan.missionId,
      workspaceDir,
      '--actor',
      'agent-alpha',
      '--json',
    ]);

    expect(claimed.id).toBe(plan.missionId);
    expect(claimed.state).toBe('active');
    expect(claimed.coordination.claimedBy?.actorId).toBe('agent-alpha');
    expect(claimed.coordination.lastUpdatedBy).toBe('agent-alpha');

    const blockedComplete = runCliFailure([
      'mission',
      'complete',
      plan.missionId,
      workspaceDir,
      '--actor',
      'agent-beta',
      '--json',
    ]);

    expect(blockedComplete.message).toContain('currently claimed by agent-alpha');

    const blockedRelease = runCliFailure([
      'mission',
      'release',
      plan.missionId,
      workspaceDir,
      '--actor',
      'agent-beta',
      '--json',
    ]);

    expect(blockedRelease.message).toContain('currently claimed by agent-alpha');

    const transferred = runCliJson<{
      coordination: {
        claimedBy?: {
          actorId: string;
        };
      };
    }>([
      'mission',
      'claim',
      plan.missionId,
      workspaceDir,
      '--actor',
      'agent-beta',
      '--force',
      '--json',
    ]);

    expect(transferred.coordination.claimedBy?.actorId).toBe('agent-beta');

    const completed = runCliJson<{
      state: string;
      items: Array<{ status: string }>;
      coordination: {
        claimedBy?: {
          actorId: string;
        };
        lastUpdatedBy?: string;
      };
    }>([
      'mission',
      'complete',
      plan.missionId,
      workspaceDir,
      '--actor',
      'agent-beta',
      '--json',
    ]);

    expect(completed.state).toBe('complete');
    expect(completed.items.every((item) => item.status === 'complete')).toBe(true);
    expect(completed.coordination.claimedBy?.actorId).toBe('agent-beta');
    expect(completed.coordination.lastUpdatedBy).toBe('agent-beta');

    const doneBlocked = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string }>;
      missionEvidence?: {
        claimedByActorId?: string;
        requestedActorId?: string;
      };
      requiredActions: string[];
    }>([
      'done',
      'packages/shared/package.json',
      '--mission',
      plan.missionId,
      '--actor',
      'agent-alpha',
      '--cwd',
      workspaceDir,
      '--json',
    ]);

    expect(doneBlocked.closureStatus).toBe('blocked');
    expect(doneBlocked.checks).toContainEqual({
      id: 'mission-ownership',
      status: 'fail',
      summary: expect.any(String),
    });
    expect(doneBlocked.missionEvidence?.claimedByActorId).toBe('agent-beta');
    expect(doneBlocked.missionEvidence?.requestedActorId).toBe('agent-alpha');
    expect(doneBlocked.requiredActions.some((action) => action.includes('claimed by agent-beta'))).toBe(true);

    const doneOwned = runCliJson<{
      closureStatus: string;
      checks: Array<{ id: string; status: string }>;
      missionEvidence?: {
        claimedByActorId?: string;
        requestedActorId?: string;
      };
    }>([
      'done',
      'packages/shared/package.json',
      '--mission',
      plan.missionId,
      '--actor',
      'agent-beta',
      '--cwd',
      workspaceDir,
      '--json',
    ]);

    expect(doneOwned.checks).toContainEqual({
      id: 'mission-ownership',
      status: 'pass',
      summary: expect.any(String),
    });
    expect(doneOwned.missionEvidence?.claimedByActorId).toBe('agent-beta');
    expect(doneOwned.missionEvidence?.requestedActorId).toBe('agent-beta');
  });

  it('creates linked slice missions from a wider batch mission', async () => {
    const workspaceDir = await createTempWorkspace();

    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    const parentPlan = runCliJson<{
      planId: string;
      missionId: string;
      mission: {
        id: string;
        scope: { scope: { id: string } };
        items: Array<{ id: string; status: string }>;
        linkedSlices: Array<unknown>;
      };
    }>([
      'plan',
      'execute proof batch across the workspace',
      workspaceDir,
      '--scope',
      'workspace',
      '--actor',
      'agent-batch',
      '--json',
    ]);

    const blockedSlice = runCliFailure([
      'mission',
      'slice',
      parentPlan.missionId,
      'stabilize api workflow proof lane',
      workspaceDir,
      '--actor',
      'agent-batch',
      '--json',
    ]);

    expect(blockedSlice.message).toContain('Pass --scope <scope-id>');

    const sliced = runCliJson<{
      actorId: string;
      parentMission: {
        id: string;
        state: string;
        items: Array<{ id: string; status: string }>;
        linkedSlices: Array<{
          missionId: string;
          planId: string;
          scopeId: string;
          claimedByActorId?: string;
        }>;
        coordination: {
          claimedBy?: { actorId: string };
          lastUpdatedBy?: string;
        };
      };
      slicePlan: {
        planId: string;
        parentPlanId?: string;
        parentMissionId?: string;
      };
      sliceMission: {
        id: string;
        parentMissionId?: string;
        state: string;
        scope: { scope: { id: string } };
        linkedSlices: Array<unknown>;
        coordination: {
          claimedBy?: { actorId: string };
          lastUpdatedBy?: string;
        };
      };
    }>([
      'mission',
      'slice',
      parentPlan.missionId,
      'stabilize api workflow proof lane',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-batch',
      '--claim',
      '--json',
    ]);

    expect(sliced.actorId).toBe('agent-batch');
    expect(sliced.slicePlan.parentPlanId).toBe(parentPlan.planId);
    expect(sliced.slicePlan.parentMissionId).toBe(parentPlan.missionId);
    expect(sliced.sliceMission.parentMissionId).toBe(parentPlan.missionId);
    expect(sliced.sliceMission.scope.scope.id).toBe('@fixture/api');
    expect(sliced.sliceMission.state).toBe('active');
    expect(sliced.sliceMission.coordination.claimedBy?.actorId).toBe('agent-batch');
    expect(sliced.sliceMission.linkedSlices).toEqual([]);
    expect(sliced.parentMission.state).toBe('active');
    expect(
      sliced.parentMission.items.find((item) => item.id === 'decision-plan.scope-confirmation'),
    ).toMatchObject({
      id: 'decision-plan.scope-confirmation',
      status: 'complete',
    });
    expect(
      sliced.parentMission.items.find((item) => item.id === 'step-resolve-decisions'),
    ).toMatchObject({
      id: 'step-resolve-decisions',
      status: 'complete',
    });
    expect(sliced.parentMission.linkedSlices).toHaveLength(1);
    expect(sliced.parentMission.linkedSlices[0]).toMatchObject({
      missionId: sliced.sliceMission.id,
      planId: sliced.slicePlan.planId,
      scopeId: '@fixture/api',
      claimedByActorId: 'agent-batch',
    });

    const completedSlice = runCliJson<{
      id: string;
      state: string;
      coordination: {
        claimedBy?: { actorId: string };
      };
    }>([
      'mission',
      'complete',
      sliced.sliceMission.id,
      workspaceDir,
      '--actor',
      'agent-batch',
      '--json',
    ]);
    expect(completedSlice.state).toBe('complete');
    expect(completedSlice.coordination.claimedBy?.actorId).toBe('agent-batch');

    const persistedParent = JSON.parse(
      await readFile(
        join(
          workspaceDir,
          '.skopos',
          'missions',
          `${parentPlan.missionId}.json`,
        ),
        'utf8',
      ),
    ) as {
      linkedSlices: Array<{ missionId: string; state: string; claimedByActorId?: string }>;
    };
    expect(persistedParent.linkedSlices).toHaveLength(1);
    expect(persistedParent.linkedSlices[0]).toMatchObject({
      missionId: sliced.sliceMission.id,
      state: 'complete',
      claimedByActorId: 'agent-batch',
    });
  });

  it('blocks cross-actor linked slicing on a claimed parent mission unless the transfer is forced', async () => {
    const workspaceDir = await createTempWorkspace();

    runCliJson(['init', workspaceDir, '--json']);
    runCliJson(['instructions', 'sync', workspaceDir, '--json']);
    const parentPlan = runCliJson<{
      planId: string;
      missionId: string;
    }>([
      'plan',
      'execute proof batch across the workspace',
      workspaceDir,
      '--scope',
      'workspace',
      '--actor',
      'agent-alpha',
      '--json',
    ]);

    const claimedParent = runCliJson<{
      state: string;
      coordination: {
        claimedBy?: { actorId: string };
      };
    }>([
      'mission',
      'claim',
      parentPlan.missionId,
      workspaceDir,
      '--actor',
      'agent-alpha',
      '--json',
    ]);

    expect(claimedParent.state).toBe('active');
    expect(claimedParent.coordination.claimedBy?.actorId).toBe('agent-alpha');

    const blockedSlice = runCliFailure([
      'mission',
      'slice',
      parentPlan.missionId,
      'stabilize api workflow proof lane',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-beta',
      '--json',
    ]);

    expect(blockedSlice.message).toContain('currently claimed by agent-alpha');

    const forcedSlice = runCliJson<{
      actorId: string;
      parentMission: {
        coordination: {
          claimedBy?: { actorId: string };
        };
        linkedSlices: Array<{ missionId: string; claimedByActorId?: string }>;
      };
      sliceMission: {
        id: string;
        coordination: {
          claimedBy?: { actorId: string };
        };
      };
    }>([
      'mission',
      'slice',
      parentPlan.missionId,
      'stabilize api workflow proof lane',
      workspaceDir,
      '--scope',
      '@fixture/api',
      '--actor',
      'agent-beta',
      '--claim',
      '--force',
      '--json',
    ]);

    expect(forcedSlice.actorId).toBe('agent-beta');
    expect(forcedSlice.parentMission.coordination.claimedBy?.actorId).toBe('agent-beta');
    expect(forcedSlice.sliceMission.coordination.claimedBy?.actorId).toBe('agent-beta');
    expect(forcedSlice.parentMission.linkedSlices).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          missionId: forcedSlice.sliceMission.id,
          claimedByActorId: 'agent-beta',
        }),
      ]),
    );
  });
});

const createTempWorkspace = async (sourceRoot: string = fixtureRepoRoot): Promise<string> => {
  const tempDir = await mkdtemp(join(tmpdir(), 'skopos-cli-e2e-'));
  const workspaceDir = join(tempDir, 'workspace');
  tempDirs.push(tempDir);
  await cp(sourceRoot, workspaceDir, { recursive: true });
  return workspaceDir;
};

const initializeGitWorkspace = (workspaceDir: string): void => {
  runGit(workspaceDir, ['init']);
  runGit(workspaceDir, ['config', 'user.email', 'skopos-fixture@example.com']);
  runGit(workspaceDir, ['config', 'user.name', 'Skopos Fixture']);
};

const commitWorkspace = (workspaceDir: string, message: string): void => {
  runGit(workspaceDir, ['add', '.']);
  runGit(workspaceDir, ['commit', '-m', message]);
};

const runCliJson = <T>(args: string[]): T => {
  const output = execFileSync('node', ['--import', 'tsx', cliEntrypoint, ...args], {
    cwd: cliPackageRoot,
    encoding: 'utf8',
    env: process.env,
  });

  return JSON.parse(output) as T;
};

const runCliText = (args: string[]): string =>
  execFileSync('node', ['--import', 'tsx', cliEntrypoint, ...args], {
    cwd: cliPackageRoot,
    encoding: 'utf8',
    env: process.env,
  });

const runCliFailure = (args: string[]): { message: string; stdout?: string; stderr?: string } => {
  try {
    execFileSync('node', ['--import', 'tsx', cliEntrypoint, ...args], {
      cwd: cliPackageRoot,
      encoding: 'utf8',
      env: process.env,
      stdio: 'pipe',
    });
  } catch (error) {
    const failure = error as Error & { stdout?: string; stderr?: string };
    return {
      message: failure.message,
      stdout: failure.stdout,
      stderr: failure.stderr,
    };
  }

  throw new Error('Expected CLI command to fail, but it succeeded.');
};

const waitForBackgroundJob = async (
  workspaceDir: string,
  jobId: string,
  timeoutMs: number = 30000,
): Promise<{
  summary: string;
  jobId: string;
  jobState: string;
  missionId?: string;
  resultPath?: string;
  errorMessage?: string;
}> => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const result = runCliJson<{
      summary: string;
      jobId: string;
      jobState: string;
      missionId?: string;
      resultPath?: string;
      errorMessage?: string;
    }>(['jobs', 'show', jobId, workspaceDir, '--compact', '--json']);

    if (result.jobState === 'succeeded' || result.jobState === 'failed') {
      return result;
    }

    await sleep(250);
  }

  throw new Error(`Timed out waiting for background job ${jobId}.`);
};

const sleep = async (ms: number): Promise<void> =>
  new Promise((resolveSleep) => {
    setTimeout(resolveSleep, ms);
  });

const runGit = (cwd: string, args: string[]): string =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: process.env,
  });

const writeActiveFindingFixture = async (workspaceDir: string): Promise<void> => {
  const findingsDir = join(workspaceDir, 'docs', 'findings');
  await mkdir(findingsDir, { recursive: true });
  await writeFile(
    join(findingsDir, 'registry.md'),
    `# Skopos Findings Registry

## Active Findings

1. \`F-20260412-program-router-and-obligation-gap\`
   - Severity: \`SHOULD\`
   - Status: \`in-progress\`
   - Owner: \`skopos-core\`
   - Target Pack: \`program router lane\`
   - Detail: \`F-20260412-program-router-and-obligation-gap.md\`
2. \`F-20260412-discussion-memory-compaction-gap\`
   - Severity: \`SHOULD\`
   - Status: \`in-progress\`
   - Owner: \`skopos-core\`
   - Target Pack: \`discussion memory lane\`
   - Detail: \`F-20260412-discussion-memory-compaction-gap.md\`
`,
    'utf8',
  );
  await writeFile(
    join(findingsDir, 'F-20260412-program-router-and-obligation-gap.md'),
    `# F-20260412-program-router-and-obligation-gap: Program-Level Sequencing Still Depends Too Much On User Memory

## Summary

- Severity: \`SHOULD\`
- Status: \`in-progress\`
- Owner: \`skopos-core\`
- Target Pack: \`program router lane\`
- Current State: open. The first low-noise program-router slice still needs a compiled control-plane artifact and routed follow-through.
`,
    'utf8',
  );
  await writeFile(
    join(findingsDir, 'F-20260412-discussion-memory-compaction-gap.md'),
    `# F-20260412-discussion-memory-compaction-gap: Discussion Continuity Still Depends Too Much On Live Chat Context

## Summary

- Severity: \`SHOULD\`
- Status: \`in-progress\`
- Owner: \`skopos-core\`
- Target Pack: \`discussion memory lane\`
- Current State: open. Accepted direction still needs compact checkpoints and handoff memory instead of relying on raw live chat recall.
`,
    'utf8',
  );
};

const writePriorityFindingFixture = async (workspaceDir: string): Promise<void> => {
  const findingsDir = join(workspaceDir, 'docs', 'findings');
  await mkdir(findingsDir, { recursive: true });
  await writeFile(
    join(findingsDir, 'registry.md'),
    `# Skopos Findings Registry

## Active Findings

1. \`F-high-stale-advisory\`
   - Severity: \`SHOULD\`
   - Status: \`in-progress\`
   - Owner: \`skopos-core\`
   - Target Pack: \`eval reconciliation\`
   - Detail: \`F-high-stale-advisory.md\`
2. \`F-critical-token-transport\`
   - Severity: \`MUST\`
   - Status: \`in-progress\`
   - Owner: \`skopos-core\`
   - Target Pack: \`token transport\`
   - Detail: \`F-critical-token-transport.md\`
`,
    'utf8',
  );
  await writeFile(
    join(findingsDir, 'F-high-stale-advisory.md'),
    `# F-high-stale-advisory: Stale Advisory Follow-Up

## Summary

- Severity: \`SHOULD\`
- Status: \`in-progress\`
- Owner: \`skopos-core\`
- Target Pack: \`eval reconciliation\`
- Current State: open. Advisory cleanup remains useful but is not critical.
`,
    'utf8',
  );
  await writeFile(
    join(findingsDir, 'F-critical-token-transport.md'),
    `# F-critical-token-transport: Token Transport Is Critical

## Summary

- Severity: \`MUST\`
- Status: \`in-progress\`
- Owner: \`skopos-core\`
- Target Pack: \`token transport\`
- Current State: open. Agent transport must be reduced before broader workflow expansion.
`,
    'utf8',
  );
};

const writePassingProofReport = async (workspaceDir: string): Promise<void> => {
  const proofDir = join(workspaceDir, '.skopos', 'proof');
  await mkdir(proofDir, { recursive: true });
  await writeFile(
    join(proofDir, 'latest-report.json'),
    JSON.stringify(
      {
        schemaVersion: 1,
        id: 'proof-latest-report',
        type: 'proof-report',
        status: 'generated',
        authority: 'generated',
        summary: 'Fixture proof report for eval completion coverage.',
        updatedAt: '2026-04-12T00:00:00.000Z',
        generatedAt: '2026-04-12T00:00:00.000Z',
        workspaceRoot: workspaceDir,
        definitionSetPath: 'internal/evals/proof-phase-benchmarks.json',
        baselinePath: 'internal/evals/proof-phase-baseline.json',
        scorecard: {
          definitionSetId: 'proof-phase-benchmarks',
          status: 'pass',
          benchmarkCount: 1,
          passedBenchmarks: 1,
          failedBenchmarks: 0,
          mustWinBenchmarks: 1,
          passedMustWinBenchmarks: 1,
          failedMustWinBenchmarks: 0,
          score: 2,
          maxScore: 2,
          weightedPassRate: 1,
          scoringPolicy: {
            minimumWeightedPassRate: 1,
            failOnAnyBenchmarkFailure: true,
            failOnAnyMustWinBenchmarkFailure: true,
          },
          categorySummaries: [
            {
              category: 'self-hosting-dogfood',
              benchmarkCount: 1,
              passedBenchmarks: 1,
              failedBenchmarks: 0,
              score: 2,
              maxScore: 2,
              weightedPassRate: 1,
            },
          ],
          benchmarks: [
            {
              id: 'fixture-proof',
              fixture: 'self-hosted-tooling-workspace',
              category: 'self-hosting-dogfood',
              priority: 'must-win',
              status: 'pass',
              passedChecks: 1,
              failedChecks: 0,
              totalChecks: 1,
              score: 2,
              maxScore: 2,
              weightedPassRate: 1,
              failedMetricIds: [],
              metrics: [
                {
                  id: 'fixture-proof-pass',
                  pass: true,
                  note: 'Fixture proof artifact passes.',
                  severity: 'must',
                },
              ],
            },
          ],
        },
        comparison: {
          baselineId: 'proof-phase-baseline-v1',
          definitionSetId: 'proof-phase-benchmarks',
          status: 'pass',
          benchmarkCountMatches: true,
          weightedPassRateDelta: 0,
          regressedBenchmarks: [],
          regressedCategories: [],
          benchmarkComparisons: [],
          categoryComparisons: [],
        },
      },
      null,
      2,
    ),
    'utf8',
  );
};
