import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  buildSkoposBootstrapArtifacts,
  buildSkoposCommandsGraph,
  buildSkoposDocsGraph,
  buildSkoposScopeRelationsGraph,
  buildSkoposScopesLite,
  loadSkoposScopeRegistry,
  scanRepo,
} from '../../../indexer/src/index.js';
import {
  SKOPOS_SCOPE_KINDS,
  type SkoposDocumentRole,
  type SkoposActionManifest,
} from '../../../model/src/index.js';
import { selectSkoposContextDocuments } from '../../../query/src/application/build-context/build-context.service.js';
import {
  resolveSkoposScopeExpansionFromState,
  resolveSkoposScopeForPathFromState,
} from '../../../query/src/application/resolve-scope/resolve-scope.service.js';
import { loadSkoposQueryState } from '../../../query/src/application/shared/load-query-state.js';
import { buildSkoposImpactReport } from '../../../verification/src/index.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('declared Scope registry', () => {
  it('uses stable declared ids, memory roots, profiles, and dependencies', async () => {
    const root = await createWorkspace();
    const scanSummary = await scanRepo({ cwd: root });
    const scopesLite = await buildSkoposScopesLite({ cwd: root, scanSummary });
    const graph = await buildSkoposScopeRelationsGraph({
      workspaceRoot: root,
      scopesLite,
    });

    expect(scopesLite.scopes.find((scope) => scope.kind === 'workspace')).toMatchObject({
      id: 'example',
      profile: 'core.workspace',
      memoryRoot: 'docs',
      codeRoots: ['.'],
    });
    expect(scopesLite.scopes.find((scope) => scope.id === 'example-api')).toMatchObject({
      path: 'packages/api',
      aliases: ['@example/api'],
      parent: 'example',
      profile: 'core.service',
      memoryRoot: 'docs/scopes/example-api',
      codeRoots: ['packages/api'],
      dependsOn: ['example-model'],
      owners: ['platform'],
    });
    expect(scopesLite.scopes.some((scope) => scope.id === '@example/api')).toBe(false);
    expect(scopesLite.scopes).toHaveLength(3);
    expect(graph.edges).toContainEqual(
      expect.objectContaining({
        kind: 'depends-on',
        from: 'scope:example-api',
        to: 'scope:example-model',
      }),
    );
    expect(scanSummary.sourceDependencies).toContainEqual(
      expect.objectContaining({
        path: 'tools/skopos/scopes.yaml',
        kind: 'scope-registry',
        existsAtBuild: true,
      }),
    );
  });

  it('projects every declared Scope kind through architecture, graphs, ownership, and manifest-backed validation', async () => {
    const root = await createWorkspace();
    await Promise.all([
      mkdir(join(root, 'products/example'), { recursive: true }),
      mkdir(join(root, 'docs/scopes/example-product'), { recursive: true }),
      writeFile(
        join(root, 'package.json'),
        JSON.stringify(
          {
            name: '@example/workspace',
            private: true,
            scripts: {
              typecheck: 'tsc --noEmit',
              test: 'vitest run',
              build: 'tsup',
              lint: 'eslint .',
            },
          },
          null,
          2,
        ),
        'utf8',
      ),
      writeFile(
        join(root, 'pnpm-workspace.yaml'),
        'packages:\n  - "packages/*"\n  - "products/*"\n',
        'utf8',
      ),
      writeFile(
        join(root, 'packages/api/package.json'),
        JSON.stringify(
          {
            name: '@example/api',
            scripts: {
              typecheck: 'tsc --noEmit',
              test: 'vitest run',
              build: 'tsup',
              lint: 'eslint .',
            },
            dependencies: { '@example/model': 'workspace:*' },
          },
          null,
          2,
        ),
        'utf8',
      ),
      writeFile(
        join(root, 'tools/skopos/scopes.yaml'),
        genericScopeRegistryYaml,
        'utf8',
      ),
    ]);

    const { bootstrap, scopesLite, architecture } = await buildSkoposBootstrapArtifacts({
      cwd: root,
    });
    const action: SkoposActionManifest = {
      id: 'quality.project-scopes',
      title: 'Validate project Scopes',
      description: 'Validate every declared project Scope.',
      category: 'quality-check',
      scope: ['example-product', 'example-api', 'example-model'],
      command: 'pnpm typecheck',
      cwd: '.',
      inputs: ['products/example', 'packages/api', 'packages/model'],
      outputs: [],
      affects: ['products/example', 'packages/api', 'packages/model'],
      safety: 'read-only',
      requiresApproval: false,
      recommendedAfter: [],
      owner: 'platform',
      sourcePath: 'tools/skopos/actions/quality.project-scopes.yaml',
    };
    const scopeRelations = await buildSkoposScopeRelationsGraph({
      workspaceRoot: root,
      scopesLite,
    });
    const commands = buildSkoposCommandsGraph({
      workspaceRoot: root,
      bootstrap,
      scopesLite,
      actions: [action],
    });
    const docs = buildSkoposDocsGraph({
      workspaceRoot: root,
      scopesLite,
      actions: [action],
      docsRoots: ['docs', 'docs'],
      instructionFiles: [],
    });
    const impact = await buildSkoposImpactReport({
      cwd: root,
      changedPaths: ['packages/api/src/index.ts'],
    });

    expect(architecture.current.units).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ scopeId: 'example-product', role: 'product' }),
        expect.objectContaining({ scopeId: 'example-api', role: 'service' }),
        expect.objectContaining({ scopeId: 'example-model', role: 'domain' }),
      ]),
    );
    expect(scopeRelations.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'contains',
          from: 'scope:example-product',
          to: 'scope:example-api',
        }),
        expect.objectContaining({
          kind: 'depends-on',
          from: 'scope:example-product',
          to: 'scope:example-model',
        }),
        expect.objectContaining({
          kind: 'depends-on',
          from: 'scope:example-api',
          to: 'scope:example-model',
        }),
      ]),
    );
    expect(commands.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'scope:example-product' }),
        expect.objectContaining({ id: 'scope:example-api' }),
        expect.objectContaining({ id: 'scope:example-model' }),
      ]),
    );
    expect(commands.edges).toContainEqual(
      expect.objectContaining({
        kind: 'targets',
        from: 'action:quality.project-scopes',
        to: 'scope:example-product',
      }),
    );
    expect(
      docs.nodes
        .filter((node) => node.kind === 'docs-root')
        .map((node) => node.path),
    ).toEqual([
      'docs',
      'docs/scopes/example-product',
      'docs/scopes/example-api',
      'docs/scopes/example-model',
    ]);
    expect(impact.changed).toContainEqual(
      expect.objectContaining({
        path: 'packages/api/src/index.ts',
        category: 'scope-source',
        affectedScopeIds: expect.arrayContaining(['example-api']),
      }),
    );
    expect(impact.requiredActions).toEqual([]);
  });

  it('fails closed when declared aliases or relationships are ambiguous', async () => {
    const root = await createWorkspace();
    await writeFile(
      join(root, 'tools/skopos/scopes.yaml'),
      scopeRegistryYaml.replace(
        'aliases:\n      - "@example/model"',
        'aliases:\n      - "@example/api"',
      ),
      'utf8',
    );

    await expect(loadSkoposScopeRegistry({ cwd: root })).rejects.toThrow(
      'is ambiguous',
    );
  });

  it('fails closed when two Scopes declare the same normalized Memory root', async () => {
    const root = await createWorkspace();
    await writeFile(
      join(root, 'tools/skopos/scopes.yaml'),
      scopeRegistryYaml.replace(
        '    memoryRoot: docs/scopes/example-model',
        '    memoryRoot: ./docs/scopes/example-api',
      ),
      'utf8',
    );

    await expect(loadSkoposScopeRegistry({ cwd: root })).rejects.toThrow(
      'declare the same memoryRoot "docs/scopes/example-api"',
    );
  });

  it.each(['../outside', 'C:outside'])(
    'fails closed when a declared Scope path escapes the workspace through %s',
    async (escapedPath) => {
      const root = await createWorkspace();
      await writeFile(
        join(root, 'tools/skopos/scopes.yaml'),
        scopeRegistryYaml.replace(
          '    memoryRoot: docs/scopes/example-api',
          `    memoryRoot: "${escapedPath}"`,
        ),
        'utf8',
      );

      await expect(loadSkoposScopeRegistry({ cwd: root })).rejects.toThrow(
        'Scope paths must be normalized paths inside the workspace.',
      );
    },
  );

  it('accepts only the exact project-generic Scope kind set', async () => {
    const root = await createWorkspace();
    expect(SKOPOS_SCOPE_KINDS).toEqual([
      'workspace',
      'product',
      'application',
      'service',
      'package',
      'domain',
      'infrastructure',
      'tool',
    ]);

    for (const kind of SKOPOS_SCOPE_KINDS.filter((entry) => entry !== 'workspace')) {
      await writeFile(
        join(root, 'tools/skopos/scopes.yaml'),
        scopeRegistryYaml.replace('    kind: package', `    kind: ${kind}`),
        'utf8',
      );
      await expect(loadSkoposScopeRegistry({ cwd: root })).resolves.toEqual(
        expect.objectContaining({
          scopes: expect.arrayContaining([
            expect.objectContaining({ id: 'example-api', kind }),
          ]),
        }),
      );
      const state = await loadSkoposQueryState({ cwd: root });
      expect(
        resolveSkoposScopeForPathFromState(state, 'packages/api/src/router.ts').scope,
      ).toMatchObject({ id: 'example-api', kind });
    }

    await writeFile(
      join(root, 'tools/skopos/scopes.yaml'),
      scopeRegistryYaml.replace('    kind: package', '    kind: library'),
      'utf8',
    );
    await expect(loadSkoposScopeRegistry({ cwd: root })).rejects.toThrow();
  });

  it('classifies dependency, common-ancestor, explicit workspace, and unrelated expansion', async () => {
    const root = await createWorkspace();
    let state = await loadSkoposQueryState({ cwd: root });
    const apiScope = resolveSkoposScopeForPathFromState(
      state,
      'packages/api/src/router.ts',
    );
    const modelScope = resolveSkoposScopeForPathFromState(
      state,
      'packages/model/src/model.ts',
    );

    expect(
      resolveSkoposScopeExpansionFromState(state, apiScope, [
        'packages/api/src/router.ts',
        'packages/model/src/model.ts',
      ]),
    ).toMatchObject({
      kind: 'declared-dependency',
      affectedScopeIds: ['example-api', 'example-model'],
      authority: { scope: { id: 'example-api' } },
    });
    expect(
      resolveSkoposScopeExpansionFromState(state, modelScope, [
        'packages/model/src/model.ts',
        'packages/api/src/router.ts',
      ]),
    ).toMatchObject({
      kind: 'unrelated',
      affectedScopeIds: ['example-api', 'example-model'],
    });

    await writeFile(
      join(root, 'tools/skopos/scopes.yaml'),
      genericScopeRegistryYaml.replace(
        '    parent: example\n    profile: core.domain',
        '    parent: example-product\n    profile: core.domain',
      ),
      'utf8',
    );
    state = await loadSkoposQueryState({ cwd: root });
    const nestedApiScope = resolveSkoposScopeForPathFromState(
      state,
      'packages/api/src/router.ts',
    );
    expect(
      resolveSkoposScopeExpansionFromState(state, nestedApiScope, [
        'packages/api/src/router.ts',
        'packages/model/src/model.ts',
      ]),
    ).toMatchObject({
      kind: 'common-ancestor',
      authority: {
        matchedBy: 'topology',
        scope: { id: 'example-product' },
      },
    });

    const workspaceScope = {
      query: 'example',
      matchedBy: 'id' as const,
      scope: state.scopesLite.scopes.find((scope) => scope.id === 'example')!,
    };
    expect(
      resolveSkoposScopeExpansionFromState(state, workspaceScope, [
        'packages/api/src/router.ts',
        'packages/model/src/model.ts',
      ]),
    ).toMatchObject({
      kind: 'explicit-multi-scope',
      authority: { scope: { id: 'example' } },
    });
  });

  it('selects role-diverse accepted workspace context instead of filename-first decisions', () => {
    const selected = selectSkoposContextDocuments({
      documents: [
        document('old-decision', 'docs/decisions/003-old.md', 'decision', 'current'),
        document('target-decision', 'docs/decisions/D-target.md', 'decision', 'target'),
        document('overview', 'docs/overview.md', 'overview', 'target'),
        document('plan', 'docs/work/plans/P-active.md', 'plan', 'target', 'active'),
        document('architecture', 'docs/architecture/00-architecture.md', 'architecture', 'current'),
        document('target-architecture', 'docs/architecture/target.md', 'architecture', 'target'),
        {
          ...document('historical', 'docs/archive/old.md', 'plan', 'transition'),
          lifecycle: 'historical',
          defaultVisible: false,
        },
      ],
      resolvedScope: {
        id: 'example',
        kind: 'workspace',
        title: 'Example',
        path: '.',
        aliases: [],
        summary: 'Example workspace.',
        confidence: 'high',
        memoryRoot: 'docs',
      },
      docsStartHerePath: 'docs/00-start-here.md',
    });

    expect(selected.map((entry) => entry.id)).toEqual([
      'overview',
      'target-decision',
      'plan',
      'architecture',
    ]);
  });

  it('selects every eligible role through Scope ancestry while isolating siblings, children, and unrelated Patterns', () => {
    const selected = selectSkoposContextDocuments({
      documents: [
        document(
          'workspace-architecture',
          'docs/architecture/00-architecture.md',
          'architecture',
          'current',
          'durable',
          'example',
        ),
        document(
          'product-standard',
          'docs/scopes/example-product/standards/platform.md',
          'standard',
          'current',
          'durable',
          'example-product',
        ),
        document(
          'api-guide',
          'docs/scopes/example-api/guides/change-api.md',
          'guide',
          'current',
          'active',
          'example-api',
        ),
        document(
          'api-reference',
          'docs/scopes/example-api/reference/protocol.md',
          'reference',
          'current',
          'durable',
          'example-api',
        ),
        document(
          'api-pattern',
          'docs/scopes/example-api/patterns/PAT-api0001.md',
          'pattern',
          'current',
          'durable',
          'example-api',
          ['api'],
        ),
        document(
          'unrelated-pattern',
          'docs/scopes/example-api/patterns/PAT-billing1.md',
          'pattern',
          'current',
          'durable',
          'example-api',
          ['billing'],
        ),
        document(
          'sibling-domain',
          'docs/scopes/example-web/domains/checkout.md',
          'domain',
          'current',
          'durable',
          'example-web',
        ),
        document(
          'child-finding',
          'docs/scopes/example-api-worker/findings/F-worker.md',
          'finding',
          'current',
          'active',
          'example-api-worker',
        ),
      ],
      resolvedScope: {
        id: 'example-api',
        kind: 'service',
        title: 'Example API',
        path: 'services/api',
        aliases: ['api'],
        summary: 'Example API service.',
        confidence: 'high',
        parent: 'example-product',
        ancestorIds: ['example-product', 'example'],
        profile: 'core.service',
        codeRoots: ['services/api'],
      },
      docsStartHerePath: 'docs/00-start-here.md',
    });

    expect(selected.map((entry) => entry.id)).toEqual([
      'workspace-architecture',
      'product-standard',
      'api-guide',
      'api-reference',
      'api-pattern',
    ]);
    expect(selected.map((entry) => entry.id)).not.toEqual(
      expect.arrayContaining([
        'unrelated-pattern',
        'sibling-domain',
        'child-finding',
      ]),
    );
  });
});

const document = (
  id: string,
  path: string,
  role: Exclude<SkoposDocumentRole, 'document'>,
  view: 'current' | 'target' | 'transition',
  lifecycle: 'active' | 'durable' = 'durable',
  scope = 'example',
  appliesTo: string[] = [],
) => ({
  id,
  title: id,
  path,
  sourceId: 'docs',
  adoption: 'adopted' as const,
  role,
  lifecycle,
  authority: 'canonical' as const,
  defaultVisible: true,
  metadata: {
    id,
    status: 'active',
    owner: 'project-maintainers',
    scope,
    role,
    lifecycle,
    authority: 'canonical' as const,
    provenance: 'accepted' as const,
    view,
    ...(role === 'pattern'
      ? {
          patternKind: 'preferred-pattern' as const,
          appliesTo,
        }
      : {}),
  },
});

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-scope-registry-'));
  temporaryRoots.push(root);
  await Promise.all([
    mkdir(join(root, 'docs/scopes/example-api'), { recursive: true }),
    mkdir(join(root, 'docs/scopes/example-model'), { recursive: true }),
    mkdir(join(root, 'packages/api'), { recursive: true }),
    mkdir(join(root, 'packages/model'), { recursive: true }),
    mkdir(join(root, 'tools/skopos'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(root, 'package.json'),
      JSON.stringify({ name: '@example/workspace', private: true }, null, 2),
      'utf8',
    ),
    writeFile(
      join(root, 'packages/api/package.json'),
      JSON.stringify(
        {
          name: '@example/api',
          dependencies: { '@example/model': 'workspace:*' },
        },
        null,
        2,
      ),
      'utf8',
    ),
    writeFile(
      join(root, 'packages/model/package.json'),
      JSON.stringify({ name: '@example/model' }, null, 2),
      'utf8',
    ),
    writeFile(join(root, 'docs/00-start-here.md'), '# Start here\n', 'utf8'),
    writeFile(join(root, 'tools/skopos/scopes.yaml'), scopeRegistryYaml, 'utf8'),
  ]);
  return root;
};

const scopeRegistryYaml = [
  'schemaVersion: 1',
  'scopes:',
  '  - id: example',
  '    title: Example Workspace',
  '    kind: workspace',
  '    path: .',
  '    memoryRoot: docs',
  '    codeRoots:',
  '      - .',
  '    parent: null',
  '    profile: core.workspace',
  '    dependsOn: []',
  '    owners:',
  '      - platform',
  '    aliases:',
  '      - "@example/workspace"',
  '  - id: example-api',
  '    title: Example API',
  '    kind: package',
  '    path: packages/api',
  '    memoryRoot: docs/scopes/example-api',
  '    codeRoots:',
  '      - packages/api',
  '    parent: example',
  '    profile: core.service',
  '    dependsOn:',
  '      - example-model',
  '    owners:',
  '      - platform',
  '    aliases:',
  '      - "@example/api"',
  '  - id: example-model',
  '    title: Example Model',
  '    kind: package',
  '    path: packages/model',
  '    memoryRoot: docs/scopes/example-model',
  '    codeRoots:',
  '      - packages/model',
  '    parent: example',
  '    profile: core.public-library',
  '    dependsOn: []',
  '    owners:',
  '      - platform',
  '    aliases:',
  '      - "@example/model"',
  '',
].join('\n');

const genericScopeRegistryYaml = [
  'schemaVersion: 1',
  'scopes:',
  '  - id: example',
  '    title: Example Workspace',
  '    kind: workspace',
  '    path: .',
  '    memoryRoot: docs',
  '    codeRoots:',
  '      - .',
  '    parent: null',
  '    profile: core.workspace',
  '    dependsOn: []',
  '    owners:',
  '      - platform',
  '    aliases:',
  '      - "@example/workspace"',
  '  - id: example-product',
  '    title: Example Product',
  '    kind: product',
  '    path: products/example',
  '    memoryRoot: docs/scopes/example-product',
  '    codeRoots:',
  '      - products/example',
  '    parent: example',
  '    profile: core.product',
  '    dependsOn:',
  '      - example-model',
  '    owners:',
  '      - product',
  '    aliases:',
  '      - example-product',
  '  - id: example-api',
  '    title: Example API',
  '    kind: service',
  '    path: packages/api',
  '    memoryRoot: docs/scopes/example-api',
  '    codeRoots:',
  '      - packages/api',
  '    parent: example-product',
  '    profile: core.service',
  '    dependsOn: []',
  '    owners:',
  '      - platform',
  '    aliases:',
  '      - "@example/api"',
  '  - id: example-model',
  '    title: Example Model',
  '    kind: domain',
  '    path: packages/model',
  '    memoryRoot: docs/scopes/example-model',
  '    codeRoots:',
  '      - packages/model',
  '    parent: example',
  '    profile: core.domain',
  '    dependsOn: []',
  '    owners:',
  '      - platform',
  '    aliases:',
  '      - "@example/model"',
  '',
].join('\n');
