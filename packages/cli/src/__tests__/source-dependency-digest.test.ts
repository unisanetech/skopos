import { mkdir, mkdtemp, rm, stat, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { buildSkoposBootstrapArtifacts } from '../../../indexer/src/index.js';
import type { SkoposSourceDependency } from '../../../model/src/index.js';
import { afterEach, describe, expect, it } from 'vitest';

import {
  buildSkoposSourceDependencyDigest,
  hasStaleSourceDependency,
  loadSkoposQueryState,
} from '../../../query/src/application/shared/load-query-state.js';

const workspaces: string[] = [];

afterEach(async () => {
  await Promise.all(
    workspaces.splice(0).map((workspaceRoot) =>
      rm(workspaceRoot, { recursive: true, force: true }),
    ),
  );
});

describe('source dependency digest invalidation', () => {
  it('invalidates incomplete compiled state without source dependencies', async () => {
    const workspaceRoot = await createWorkspace();

    expect(await hasStaleSourceDependency(workspaceRoot, [])).toBe(true);
  });

  it('uses the tracked root config as direct bootstrap authority', async () => {
    const workspaceRoot = await createWorkspace();
    await Promise.all([
      mkdir(join(workspaceRoot, 'docs')),
      mkdir(join(workspaceRoot, 'knowledge')),
    ]);
    await Promise.all([
      writeFile(
        join(workspaceRoot, 'package.json'),
        '{"name":"configured-project","dependencies":{"next":"latest"}}\n',
        'utf8',
      ),
      writeFile(join(workspaceRoot, 'AGENTS.md'), '# Project instructions\n', 'utf8'),
      writeFile(join(workspaceRoot, 'docs', 'README.md'), '# Non-canonical docs\n', 'utf8'),
      writeFile(
        join(workspaceRoot, 'knowledge', '00-start-here.md'),
        '# Canonical knowledge\n',
        'utf8',
      ),
      writeFile(
        join(workspaceRoot, 'skopos.config.yaml'),
        `schemaVersion: 1
project:
  name: configured-project
  archetype: api
  repoMode: single
  scopeStrategy: domain
  mode: clean-refactor
commands: {}
validation:
  mode: commands
workspace:
  ignore: []
docs:
  root: knowledge
  startHerePath: knowledge/00-start-here.md
  usePerDomainArchive: false
  strictMetadata: false
  strictLinking: false
agents:
  canonicalInstructions: AGENTS.md
  syncMirrors: []
  mcp: false
verification:
  mode: balanced
  requireDocsSync: true
  requireEvidenceForReadiness: true
decisions:
  mode: balanced
  askFor: []
security:
  privacyMode: local-only
  redactSecrets: true
`,
        'utf8',
      ),
    ]);

    const artifacts = await buildSkoposBootstrapArtifacts({
      cwd: workspaceRoot,
      mode: 'existing',
    });

    expect(artifacts.bootstrap.recommendedConfig.project.archetype).toBe('api');
    expect(artifacts.bootstrap.recommendedConfig.docs.root).toBe('knowledge');
    expect(artifacts.bootstrap.detected.archetypeSuggestion).toBe('api');
    expect(artifacts.bootstrap.detected.docsHealth).toEqual(
      expect.objectContaining({
        root: 'knowledge',
        hasStartHere: true,
      }),
    );
    expect(artifacts.bootstrap.sourceDependencies).toContainEqual(
      expect.objectContaining({
        path: 'skopos.config.yaml',
        kind: 'root-config',
        existsAtBuild: true,
        digest: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
      }),
    );
  });

  it('detects file content changes even when the mtime is restored', async () => {
    const workspaceRoot = await createWorkspace();
    const sourcePath = 'package.json';
    const absolutePath = join(workspaceRoot, sourcePath);
    await writeFile(absolutePath, '{"name":"before"}\n', 'utf8');
    const originalStat = await stat(absolutePath);
    const dependency = await captureDependency(workspaceRoot, sourcePath, 'root-package', true);

    expect(await hasStaleSourceDependency(workspaceRoot, [dependency])).toBe(false);

    await writeFile(absolutePath, '{"name":"after"}\n', 'utf8');
    await utimes(absolutePath, originalStat.atime, originalStat.mtime);

    expect(await hasStaleSourceDependency(workspaceRoot, [dependency])).toBe(true);
  });

  it('detects creation of a source that was missing at build time', async () => {
    const workspaceRoot = await createWorkspace();
    const sourcePath = 'skopos.config.yaml';
    const dependency = await captureDependency(workspaceRoot, sourcePath, 'root-config', false);

    expect(await hasStaleSourceDependency(workspaceRoot, [dependency])).toBe(false);

    await writeFile(join(workspaceRoot, sourcePath), 'schemaVersion: 1\n', 'utf8');

    expect(await hasStaleSourceDependency(workspaceRoot, [dependency])).toBe(true);
  });

  it('detects deterministic directory membership changes', async () => {
    const workspaceRoot = await createWorkspace();
    const sourcePath = 'packages';
    await mkdir(join(workspaceRoot, sourcePath));
    const dependency = await captureDependency(
      workspaceRoot,
      sourcePath,
      'package-directory',
      true,
    );

    expect(await hasStaleSourceDependency(workspaceRoot, [dependency])).toBe(false);

    await mkdir(join(workspaceRoot, sourcePath, 'new-package'));

    expect(await hasStaleSourceDependency(workspaceRoot, [dependency])).toBe(true);
  });

  it('rebuilds Project Memory documents instead of returning a stale knowledge index', async () => {
    const workspaceRoot = await createWorkspace();
    const docsRoot = join(workspaceRoot, 'docs');
    const indexRoot = join(workspaceRoot, '.skopos', 'index');
    await Promise.all([
      mkdir(docsRoot, { recursive: true }),
      mkdir(indexRoot, { recursive: true }),
    ]);
    await Promise.all([
      writeFile(
        join(workspaceRoot, 'package.json'),
        '{"name":"query-memory-fixture","scripts":{"typecheck":"tsc --noEmit"}}\n',
        'utf8',
      ),
      writeFile(
        join(workspaceRoot, 'skopos.config.yaml'),
        `schemaVersion: 1
project:
  name: query-memory-fixture
  archetype: library
  repoMode: single
  scopeStrategy: package
  mode: clean-refactor
commands: {}
validation:
  mode: commands
workspace:
  ignore: []
docs:
  root: docs
  startHerePath: docs/00-start-here.md
  usePerDomainArchive: false
  strictMetadata: false
  strictLinking: false
agents:
  canonicalInstructions: AGENTS.md
  syncMirrors: []
  mcp: false
verification:
  mode: balanced
  requireDocsSync: true
  requireEvidenceForReadiness: true
decisions:
  mode: balanced
  askFor: []
security:
  privacyMode: local-only
  redactSecrets: true
`,
        'utf8',
      ),
      writeFile(
        join(docsRoot, '00-start-here.md'),
        `---
id: FIXTURE-ROUTER
owner: fixture
scope: query-memory-fixture
role: router
lifecycle: active
authority: canonical
provenance: declared
view: current
---

# Start Here
`,
        'utf8',
      ),
      writeFile(
        join(docsRoot, 'architecture.md'),
        `---
id: FIXTURE-ARCHITECTURE
owner: fixture
scope: query-memory-fixture
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
---

# Initial Architecture
`,
        'utf8',
      ),
    ]);

    const generated = await buildSkoposBootstrapArtifacts({
      cwd: workspaceRoot,
      mode: 'existing',
    });
    await Promise.all([
      writeFile(
        join(indexRoot, 'bootstrap.json'),
        `${JSON.stringify(generated.bootstrap, null, 2)}\n`,
        'utf8',
      ),
      writeFile(
        join(indexRoot, 'scopes.json'),
        `${JSON.stringify(generated.scopesLite, null, 2)}\n`,
        'utf8',
      ),
      writeFile(
        join(indexRoot, 'memory.json'),
        `${JSON.stringify(
          {
            documents: [
              {
                id: 'FIXTURE-ARCHITECTURE',
                title: 'Stale Architecture',
                path: 'docs/architecture.md',
                sourceId: 'docs',
                role: 'architecture',
                lifecycle: 'durable',
                authority: 'canonical',
                defaultVisible: true,
              },
            ],
          },
          null,
          2,
        )}\n`,
        'utf8',
      ),
    ]);

    await writeFile(
      join(docsRoot, 'architecture.md'),
      `---
id: FIXTURE-ARCHITECTURE
owner: fixture
scope: query-memory-fixture
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
---

# Current Architecture
`,
      'utf8',
    );

    const state = await loadSkoposQueryState({ cwd: workspaceRoot });

    expect(state.knowledgeIndex).toBeNull();
    expect(state.documents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'FIXTURE-ARCHITECTURE',
          title: 'Current Architecture',
        }),
      ]),
    );
    expect(state.documents).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Stale Architecture',
        }),
      ]),
    );
  });

  it('invalidates query state when a declared colocated Scope Memory document changes', async () => {
    const workspaceRoot = await createWorkspace();
    const docsRoot = join(workspaceRoot, 'docs');
    const scopeMemoryRoot = join(workspaceRoot, 'packages/api/docs');
    const architecturePath = join(scopeMemoryRoot, 'architecture/system.md');
    const indexRoot = join(workspaceRoot, '.skopos/index');
    await Promise.all([
      mkdir(docsRoot, { recursive: true }),
      mkdir(join(scopeMemoryRoot, 'architecture'), { recursive: true }),
      mkdir(join(workspaceRoot, 'tools/skopos'), { recursive: true }),
      mkdir(indexRoot, { recursive: true }),
    ]);
    await Promise.all([
      writeFile(
        join(workspaceRoot, 'package.json'),
        '{"name":"colocated-memory-fixture","private":true}\n',
        'utf8',
      ),
      writeFile(
        join(workspaceRoot, 'packages/api/package.json'),
        '{"name":"@fixture/api"}\n',
        'utf8',
      ),
      writeFile(join(workspaceRoot, 'AGENTS.md'), '# Project instructions\n', 'utf8'),
      writeFile(
        join(workspaceRoot, 'skopos.config.yaml'),
        `schemaVersion: 1
project:
  name: colocated-memory-fixture
  archetype: library
  repoMode: monorepo
  scopeStrategy: package
  mode: clean-refactor
commands: {}
validation:
  mode: commands
workspace:
  ignore: []
docs:
  root: docs
  startHerePath: docs/00-start-here.md
  usePerDomainArchive: false
  strictMetadata: true
  strictLinking: true
agents:
  canonicalInstructions: AGENTS.md
  syncMirrors: []
  mcp: false
verification:
  mode: balanced
  requireDocsSync: true
  requireEvidenceForReadiness: true
decisions:
  mode: balanced
  askFor: []
security:
  privacyMode: local-only
  redactSecrets: true
`,
        'utf8',
      ),
      writeFile(
        join(workspaceRoot, 'tools/skopos/scopes.yaml'),
        `schemaVersion: 1
scopes:
  - id: workspace
    title: Colocated Memory Workspace
    kind: workspace
    path: .
    memoryRoot: docs
    codeRoots:
      - .
    parent: null
    profile: core.workspace
    dependsOn: []
    owners:
      - fixture
    aliases: []
  - id: api
    title: API
    kind: service
    path: packages/api
    memoryRoot: packages/api/docs
    codeRoots:
      - packages/api
    parent: workspace
    profile: core.service
    dependsOn: []
    owners:
      - fixture
    aliases: []
  - id: api-worker
    title: API Worker
    kind: service
    path: packages/api/worker
    memoryRoot: packages/api/docs/scopes/worker
    codeRoots:
      - packages/api/worker
    parent: api
    profile: core.service
    dependsOn: []
    owners:
      - fixture
    aliases: []
`,
        'utf8',
      ),
      writeFile(
        join(docsRoot, '00-start-here.md'),
        `---
id: DOC-router
owner: fixture
scope: workspace
role: router
lifecycle: active
authority: canonical
provenance: declared
view: current
---

# Start Here
`,
        'utf8',
      ),
      writeFile(
        architecturePath,
        `---
id: DOC-api-architecture
owner: fixture
scope: api
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
---

# Initial API Architecture
`,
        'utf8',
      ),
    ]);

    const generated = await buildSkoposBootstrapArtifacts({
      cwd: workspaceRoot,
      mode: 'existing',
    });
    expect(
      generated.bootstrap.sourceDependencies
        .filter((dependency) => dependency.kind === 'memory-root')
        .map((dependency) => dependency.path),
    ).toEqual([
      'docs',
      'packages/api/docs',
    ]);
    expect(generated.bootstrap.sourceDependencies).toContainEqual(
      expect.objectContaining({
        path: 'packages/api/docs',
        kind: 'memory-root',
        existsAtBuild: true,
      }),
    );
    await Promise.all([
      writeFile(
        join(indexRoot, 'bootstrap.json'),
        `${JSON.stringify(generated.bootstrap, null, 2)}\n`,
        'utf8',
      ),
      writeFile(
        join(indexRoot, 'scopes.json'),
        `${JSON.stringify(generated.scopesLite, null, 2)}\n`,
        'utf8',
      ),
      writeFile(
        join(indexRoot, 'memory.json'),
        `${JSON.stringify(
          {
            documents: [
              {
                id: 'DOC-api-architecture',
                title: 'Stale API Architecture',
                path: 'packages/api/docs/architecture/system.md',
                sourceId: 'docs',
                adoption: 'adopted',
                role: 'architecture',
                lifecycle: 'durable',
                authority: 'canonical',
                defaultVisible: true,
              },
            ],
          },
          null,
          2,
        )}\n`,
        'utf8',
      ),
    ]);

    const stableState = await loadSkoposQueryState({ cwd: workspaceRoot });
    expect(stableState.knowledgeIndex).not.toBeNull();
    expect(stableState.documents).toContainEqual(
      expect.objectContaining({ title: 'Stale API Architecture' }),
    );

    await writeFile(
      architecturePath,
      `---
id: DOC-api-architecture
owner: fixture
scope: api
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
---

# Current API Architecture
`,
      'utf8',
    );

    const state = await loadSkoposQueryState({ cwd: workspaceRoot });

    expect(state.knowledgeIndex).toBeNull();
    expect(state.documents).toContainEqual(
      expect.objectContaining({
        id: 'DOC-api-architecture',
        title: 'Current API Architecture',
        path: 'packages/api/docs/architecture/system.md',
        adoption: 'adopted',
      }),
    );
  });
});

const createWorkspace = async (): Promise<string> => {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-source-digest-'));
  workspaces.push(workspaceRoot);
  return workspaceRoot;
};

const captureDependency = async (
  cwd: string,
  path: string,
  kind: SkoposSourceDependency['kind'],
  existsAtBuild: boolean,
): Promise<SkoposSourceDependency> => ({
  path,
  kind,
  existsAtBuild,
  digest: await buildSkoposSourceDependencyDigest(cwd, path, kind),
});
