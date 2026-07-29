import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  assertSkoposDocumentCatalogConforms,
  buildSkoposReferenceArtifacts,
  buildSkoposDocumentCatalog,
} from '../../../indexer/src/index.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];
const scopeRegistryYaml = [
  'schemaVersion: 1',
  'scopes:',
  '  - id: workspace',
  '    title: Catalog Proof Workspace',
  '    kind: workspace',
  '    path: .',
  '    memoryRoot: docs',
  '    codeRoots:',
  '      - .',
  '    parent: null',
  '    profile: core.workspace',
  '    dependsOn: []',
  '    owners:',
  '      - project-maintainers',
  '    aliases:',
  '      - root',
  '  - id: payments',
  '    title: Payments',
  '    kind: package',
  '    path: packages/payments',
  '    memoryRoot: docs/scopes/payments',
  '    codeRoots:',
  '      - packages/payments',
  '    parent: workspace',
  '    profile: core.service',
  '    dependsOn: []',
  '    owners:',
  '      - payments',
  '    aliases:',
  '      - payments-service',
  '',
].join('\n');

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('canonical document catalog', () => {
  it('indexes canonical, nested-scope, generated-reference, and archived docs deterministically', async () => {
    const root = await createWorkspace();
    const first = await buildSkoposDocumentCatalog({ cwd: root });
    const second = await buildSkoposDocumentCatalog({ cwd: root });

    expect(second).toEqual(first);
    expect(first.issues).toEqual([]);
    expect(first.documents.map((document) => document.path)).toEqual([
      'docs/00-start-here.md',
      'docs/archive/old-plan.md',
      'docs/patterns/PAT-a1b2c3d4-repeat-unowned-docs-layout.md',
      'docs/reference/generated/api.md',
      'docs/scopes/payments/architecture/overview.md',
    ]);
    expect(first.documents.find((document) => document.path === 'docs/00-start-here.md')).toMatchObject({
      adoption: 'adopted',
      role: 'router',
      authority: 'canonical',
      lifecycle: 'active',
      defaultVisible: true,
    });
    expect(
      first.documents.find(
        (document) => document.path === 'docs/scopes/payments/architecture/overview.md',
      ),
    ).toMatchObject({
      role: 'architecture',
      authority: 'canonical',
      lifecycle: 'active',
      defaultVisible: true,
      metadata: { scope: 'payments' },
    });
    expect(
      first.documents.find(
        (document) =>
          document.path ===
          'docs/patterns/PAT-a1b2c3d4-repeat-unowned-docs-layout.md',
      ),
    ).toMatchObject({
      id: 'PAT-a1b2c3d4',
      role: 'pattern',
      authority: 'canonical',
      lifecycle: 'durable',
      defaultVisible: true,
      metadata: {
        patternKind: 'failure-pattern',
        provenance: 'accepted',
        appliesTo: ['docs/**', 'adoption'],
      },
    });
    expect(
      first.documents.find(
        (document) => document.path === 'docs/reference/generated/api.md',
      ),
    ).toMatchObject({
      role: 'reference',
      authority: 'generated',
      lifecycle: 'durable',
      defaultVisible: false,
    });
    expect(first.documents.find((document) => document.path === 'docs/archive/old-plan.md')).toMatchObject({
      lifecycle: 'historical',
      authority: 'supporting',
      defaultVisible: false,
    });
  });

  it('infers a nested domain overview as domain Memory during adoption discovery', async () => {
    const root = await createWorkspace();
    await mkdir(join(root, 'docs/domains/orders'), { recursive: true });
    await writeFile(
      join(root, 'docs/domains/orders/overview.md'),
      '# Orders\n\nOrder domain truth.\n',
      'utf8',
    );

    const catalog = await buildSkoposDocumentCatalog({
      cwd: root,
      config: null,
    });

    expect(
      catalog.documents.find(
        (document) => document.path === 'docs/domains/orders/overview.md',
      ),
    ).toMatchObject({
      role: 'domain',
      authority: 'canonical',
    });
  });

  it('restricts generated authority and directories to workspace reference/generated memory', async () => {
    const root = await createWorkspace();
    await mkdir(join(root, 'docs/guides/generated'), { recursive: true });
    await Promise.all([
      writeFile(
        join(root, 'docs/guides/generated/misplaced.md'),
        [
          '---',
          'id: DOC-misplaced-generated-directory',
          'owner: project-maintainers',
          'scope: workspace',
          'role: guide',
          'lifecycle: durable',
          'authority: canonical',
          'provenance: declared',
          'view: current',
          '---',
          '',
          '# Misplaced generated directory',
          '',
        ].join('\n'),
        'utf8',
      ),
      writeFile(
        join(root, 'docs/reference/generated-authority.md'),
        [
          '---',
          'id: DOC-generated-authority-outside-generated-reference',
          'owner: api-generator',
          'scope: workspace',
          'role: reference',
          'lifecycle: durable',
          'authority: generated',
          'provenance: declared',
          'view: current',
          '---',
          '',
          '# Misplaced generated authority',
          '',
        ].join('\n'),
        'utf8',
      ),
      writeFile(
        join(root, 'docs/reference/generated/api.md'),
        [
          '---',
          'id: DOC-generated-api',
          'owner: api-generator',
          'scope: workspace',
          'role: reference',
          'lifecycle: durable',
          'authority: canonical',
          'provenance: declared',
          'view: current',
          '---',
          '',
          '# API reference',
          '',
        ].join('\n'),
        'utf8',
      ),
    ]);

    const catalog = await buildSkoposDocumentCatalog({ cwd: root });

    expect(catalog.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'generated-path-mismatch',
          path: 'docs/guides/generated/misplaced.md',
        }),
        expect.objectContaining({
          code: 'generated-authority-path-mismatch',
          path: 'docs/reference/generated-authority.md',
        }),
        expect.objectContaining({
          code: 'generated-authority-mismatch',
          path: 'docs/reference/generated/api.md',
        }),
      ]),
    );
    expect(
      catalog.documents.some((document) =>
        [
          'DOC-misplaced-generated-directory',
          'DOC-generated-authority-outside-generated-reference',
          'DOC-generated-api',
        ].includes(document.id),
      ),
    ).toBe(false);
  });

  it('keeps non-strict foreign metadata and generated layouts as discovery evidence', async () => {
    const root = await createWorkspace();
    const configPath = join(root, 'skopos.config.yaml');
    const config = await readFile(configPath, 'utf8');
    await writeFile(
      configPath,
      config.replace('strictMetadata: true', 'strictMetadata: false'),
      'utf8',
    );
    await Promise.all([
      mkdir(join(root, 'docs/generated'), { recursive: true }),
      mkdir(join(root, 'docs/guides'), { recursive: true }),
      mkdir(join(root, 'docs/how-to'), { recursive: true }),
      mkdir(join(root, 'docs/ssot'), { recursive: true }),
      mkdir(join(root, 'docs/program/failure-patterns'), { recursive: true }),
      mkdir(join(root, 'docs/program/execution'), { recursive: true }),
    ]);
    await Promise.all([
      writeFile(
        join(root, 'docs/generated/foreign-api.md'),
        '# Foreign generated API\n',
        'utf8',
      ),
      writeFile(
        join(root, 'docs/guides/foreign.md'),
        [
          '# Foreign guide',
          '',
          '## Metadata',
          '',
          '- Doc ID: `DOC-foreign`',
          '- Owner: `foreign-maintainers`',
          '- Scope: `workspace`',
          '- Role: `guide`',
          '- Lifecycle: `durable`',
          '- Authority: `canonical`',
          '- Provenance: `accepted`',
          '- View: `current`',
          '',
        ].join('\n'),
        'utf8',
      ),
      writeFile(join(root, 'docs/how-to/add-module.md'), '# Add module\n', 'utf8'),
      writeFile(join(root, 'docs/ssot/runtime.md'), '# Runtime standard\n', 'utf8'),
      writeFile(
        join(root, 'docs/program/failure-patterns/duplicate-authority.md'),
        '# Duplicate authority\n',
        'utf8',
      ),
      writeFile(
        join(root, 'docs/program/execution/P1-W1.md'),
        '# Active execution\n',
        'utf8',
      ),
    ]);

    const catalog = await buildSkoposDocumentCatalog({ cwd: root });

    expect(catalog.issues).toEqual([]);
    expect(catalog.documents).toContainEqual(
      expect.objectContaining({
        path: 'docs/generated/foreign-api.md',
        adoption: 'discovery',
        role: 'reference',
        authority: 'generated',
        defaultVisible: false,
      }),
    );
    expect(catalog.documents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'docs/how-to/add-module.md',
          role: 'guide',
        }),
        expect.objectContaining({
          path: 'docs/ssot/runtime.md',
          role: 'standard',
        }),
        expect.objectContaining({
          path: 'docs/program/failure-patterns/duplicate-authority.md',
          role: 'pattern',
        }),
        expect.objectContaining({
          path: 'docs/program/execution/P1-W1.md',
          role: 'task',
        }),
      ]),
    );
    expect(catalog.documents).toContainEqual(
      expect.objectContaining({
        id: 'DOC-foreign',
        path: 'docs/guides/foreign.md',
        adoption: 'discovery',
        role: 'guide',
        metadata: expect.objectContaining({ provenance: 'accepted' }),
      }),
    );
  });

  it('does not support a permanent path-projection manifest outside the configured docs root', async () => {
    const root = await createWorkspace();
    await mkdir(join(root, 'legacy-docs'), { recursive: true });
    await writeFile(join(root, 'legacy-docs/architecture.md'), '# Legacy architecture\n', 'utf8');

    const catalog = await buildSkoposDocumentCatalog({ cwd: root });

    expect(catalog.documents.some((document) => document.path.startsWith('legacy-docs/'))).toBe(
      false,
    );
  });

  it('reports strict metadata and local-link violations without guessing adopted truth', async () => {
    const root = await createWorkspace();
    await writeFile(
      join(root, 'docs/archive/old-plan.md'),
      '# Old plan\n\n[Missing target](../missing.md)\n',
      'utf8',
    );

    const catalog = await buildSkoposDocumentCatalog({ cwd: root });

    expect(catalog.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'metadata',
          code: 'noncanonical-metadata-format',
          path: 'docs/archive/old-plan.md',
        }),
        expect.objectContaining({
          kind: 'metadata',
          code: 'missing-id',
          path: 'docs/archive/old-plan.md',
        }),
        expect.objectContaining({
          kind: 'link',
          code: 'missing-target',
          path: 'docs/archive/old-plan.md',
          reference: '../missing.md',
        }),
      ]),
    );
    expect(() => assertSkoposDocumentCatalogConforms(catalog)).toThrow(
      'Project Memory validation failed',
    );
    expect(
      catalog.documents.some((document) => document.path === 'docs/archive/old-plan.md'),
    ).toBe(false);
  });

  it('requires declared severity before an active Finding enters adopted memory', async () => {
    const root = await createWorkspace();
    const findingsDir = join(root, 'docs/findings');
    const findingPath = join(findingsDir, 'F-a1b2c3d4-missing-severity.md');
    await mkdir(findingsDir, { recursive: true });
    const finding = [
      '---',
      'id: F-a1b2c3d4',
      'status: active',
      'owner: project-maintainers',
      'scope: workspace',
      'role: finding',
      'lifecycle: active',
      'authority: supporting',
      'provenance: observed',
      'view: current',
      '---',
      '',
      '# Missing Finding severity',
      '',
      'This active structural gap needs a declared queue priority.',
      '',
    ].join('\n');
    await writeFile(findingPath, finding, 'utf8');

    const invalidCatalog = await buildSkoposDocumentCatalog({ cwd: root });

    expect(invalidCatalog.issues).toContainEqual(
      expect.objectContaining({
        code: 'missing-finding-severity',
        path: 'docs/findings/F-a1b2c3d4-missing-severity.md',
      }),
    );
    expect(
      invalidCatalog.documents.some((document) => document.id === 'F-a1b2c3d4'),
    ).toBe(false);

    await writeFile(
      findingPath,
      finding.replace('status: active', 'status: active\nseverity: MUST'),
      'utf8',
    );
    const validCatalog = await buildSkoposDocumentCatalog({ cwd: root });

    expect(validCatalog.issues).toEqual([]);
    expect(validCatalog.documents).toContainEqual(
      expect.objectContaining({
        id: 'F-a1b2c3d4',
        role: 'finding',
        metadata: expect.objectContaining({ severity: 'MUST' }),
      }),
    );
  });

  it('rejects malformed, legacy, and structurally misplaced adopted metadata', async () => {
    const root = await createWorkspace();
    await mkdir(join(root, 'docs/guides'), { recursive: true });
    await Promise.all([
      writeFile(
        join(root, 'docs/guides/malformed.md'),
        '---\nid: [\n---\n\n# Malformed\n',
        'utf8',
      ),
      writeFile(
        join(root, 'docs/guides/legacy-alias.md'),
        [
          '---',
          'id: DOC-legacy-alias',
          'docId: DOC-old-alias',
          'owner: project-maintainers',
          'scope: workspace',
          'role: guide',
          'lifecycle: durable',
          'authority: canonical',
          'provenance: declared',
          'view: current',
          '---',
          '',
          '# Legacy alias',
          '',
        ].join('\n'),
        'utf8',
      ),
      writeFile(
        join(root, 'docs/guides/misplaced-decision.md'),
        [
          '---',
          'id: D-misplaced',
          'owner: project-maintainers',
          'scope: workspace',
          'role: decision',
          'lifecycle: durable',
          'authority: canonical',
          'provenance: accepted',
          'view: current',
          '---',
          '',
          '# Misplaced decision',
          '',
        ].join('\n'),
        'utf8',
      ),
      writeFile(
        join(root, 'docs/guides/markdown-metadata.md'),
        [
          '# Markdown metadata',
          '',
          '## Metadata',
          '',
          '- Doc ID: `DOC-markdown-metadata`',
          '- Owner: `project-maintainers`',
          '- Scope: `workspace`',
          '- Role: `guide`',
          '- Lifecycle: `durable`',
          '- Authority: `canonical`',
          '- Provenance: `declared`',
          '- View: `current`',
          '',
        ].join('\n'),
        'utf8',
      ),
    ]);

    const catalog = await buildSkoposDocumentCatalog({ cwd: root });

    expect(catalog.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'invalid-frontmatter',
          path: 'docs/guides/malformed.md',
        }),
        expect.objectContaining({
          code: 'noncanonical-metadata-field',
          path: 'docs/guides/legacy-alias.md',
        }),
        expect.objectContaining({
          code: 'role-path-mismatch',
          path: 'docs/guides/misplaced-decision.md',
        }),
        expect.objectContaining({
          code: 'noncanonical-metadata-format',
          path: 'docs/guides/markdown-metadata.md',
        }),
        expect.objectContaining({
          code: 'legacy-metadata-section',
          path: 'docs/guides/markdown-metadata.md',
        }),
      ]),
    );
    expect(
      catalog.documents.some((document) =>
        [
          'docs/guides/malformed.md',
          'docs/guides/legacy-alias.md',
          'docs/guides/misplaced-decision.md',
          'docs/guides/markdown-metadata.md',
        ].includes(document.path),
      ),
    ).toBe(false);
  });

  it('indexes colocated Scope Memory and quarantines a Scope/path ownership mismatch', async () => {
    const root = await createWorkspace();
    await Promise.all([
      mkdir(join(root, 'packages/ledger/docs/patterns'), { recursive: true }),
      mkdir(join(root, 'packages/ledger/docs/reference/generated'), { recursive: true }),
    ]);
    await writeFile(
      join(root, 'tools/skopos/scopes.yaml'),
      [
        scopeRegistryYaml.trimEnd(),
        '  - id: ledger',
        '    title: Ledger',
        '    kind: package',
        '    path: packages/ledger',
        '    memoryRoot: packages/ledger/docs',
        '    codeRoots:',
        '      - packages/ledger',
        '    parent: workspace',
        '    profile: core.service',
        '    dependsOn: []',
        '    owners:',
        '      - ledger',
        '    aliases: []',
        '',
      ].join('\n'),
      'utf8',
    );
    const patternPath = join(root, 'packages/ledger/docs/patterns/PAT-ledger01.md');
    const validPattern = [
      '---',
      'id: PAT-ledger01',
      'owner: ledger',
      'scope: ledger',
      'role: pattern',
      'kind: failure-pattern',
      'lifecycle: durable',
      'authority: canonical',
      'provenance: accepted',
      'view: current',
      'appliesTo:',
      '  - ledger',
      '---',
      '',
      '# Ledger failure pattern',
      '',
      'Avoid ledger drift.',
      '',
    ].join('\n');
    await Promise.all([
      writeFile(patternPath, validPattern, 'utf8'),
      writeFile(
        join(root, 'packages/ledger/docs/reference/generated/schema.md'),
        [
          '---',
          'id: DOC-ledger-generated-schema',
          'owner: ledger-generator',
          'scope: ledger',
          'role: reference',
          'lifecycle: durable',
          'authority: generated',
          'provenance: declared',
          'view: current',
          '---',
          '',
          '# Ledger generated schema',
          '',
        ].join('\n'),
        'utf8',
      ),
    ]);

    const validCatalog = await buildSkoposDocumentCatalog({ cwd: root });
    expect(validCatalog.issues).toEqual([]);
    expect(validCatalog.documents).toContainEqual(
      expect.objectContaining({
        id: 'PAT-ledger01',
        path: 'packages/ledger/docs/patterns/PAT-ledger01.md',
        metadata: expect.objectContaining({ scope: 'ledger' }),
      }),
    );
    expect(validCatalog.documents).toContainEqual(
      expect.objectContaining({
        id: 'DOC-ledger-generated-schema',
        path: 'packages/ledger/docs/reference/generated/schema.md',
        authority: 'generated',
        defaultVisible: false,
      }),
    );

    await writeFile(patternPath, validPattern.replace('scope: ledger', 'scope: payments'), 'utf8');
    const invalidCatalog = await buildSkoposDocumentCatalog({ cwd: root });
    expect(invalidCatalog.issues).toContainEqual(
      expect.objectContaining({
        code: 'scope-memory-root-mismatch',
        path: 'packages/ledger/docs/patterns/PAT-ledger01.md',
      }),
    );
    expect(invalidCatalog.documents.some((document) => document.id === 'PAT-ledger01')).toBe(
      false,
    );
  });

  it('requires a declared Scope registry before strict documents become agent memory', async () => {
    const root = await createWorkspace();
    await rm(join(root, 'tools/skopos/scopes.yaml'));

    const catalog = await buildSkoposDocumentCatalog({ cwd: root });

    expect(catalog.issues).toContainEqual(
      expect.objectContaining({
        code: 'missing-scope-registry',
        path: 'tools/skopos/scopes.yaml',
      }),
    );
    expect(catalog.documents).toEqual([]);
  });

  it('reports and quarantines every document that shares a canonical id', async () => {
    const root = await createWorkspace();
    await mkdir(join(root, 'docs/guides'), { recursive: true });
    await writeFile(
      join(root, 'docs/guides/duplicate-start-id.md'),
      [
        '---',
        'id: DOC-start',
        'owner: project-maintainers',
        'scope: workspace',
        'role: guide',
        'lifecycle: durable',
        'authority: canonical',
        'provenance: declared',
        'view: current',
        '---',
        '',
        '# Duplicate start id',
        '',
      ].join('\n'),
      'utf8',
    );

    const catalog = await buildSkoposDocumentCatalog({ cwd: root });

    expect(
      catalog.issues.filter((issue) => issue.code === 'duplicate-id'),
    ).toEqual([
      expect.objectContaining({
        path: 'docs/00-start-here.md',
        reference: 'DOC-start',
      }),
      expect.objectContaining({
        path: 'docs/guides/duplicate-start-id.md',
        reference: 'DOC-start',
      }),
    ]);
    expect(catalog.documents.some((document) => document.id === 'DOC-start')).toBe(false);

    const discoveryCatalog = await buildSkoposDocumentCatalog({
      cwd: root,
      config: null,
    });
    expect(
      discoveryCatalog.documents.filter((document) => document.id === 'DOC-start'),
    ).toHaveLength(2);
  });

  it('finds canonical YAML ids duplicated across centralized and colocated Scope Memory', async () => {
    const root = await createWorkspace();
    await mkdir(join(root, 'packages/ledger/docs/guides'), { recursive: true });
    await mkdir(join(root, 'docs/guides'), { recursive: true });
    await writeFile(
      join(root, 'tools/skopos/scopes.yaml'),
      [
        scopeRegistryYaml.trimEnd(),
        '  - id: ledger',
        '    title: Ledger',
        '    kind: package',
        '    path: packages/ledger',
        '    memoryRoot: packages/ledger/docs',
        '    codeRoots:',
        '      - packages/ledger',
        '    parent: workspace',
        '    profile: core.service',
        '    dependsOn: []',
        '    owners:',
        '      - ledger',
        '    aliases: []',
        '',
      ].join('\n'),
      'utf8',
    );
    const duplicateDocument = (scope: string): string =>
      [
        '---',
        'id: DOC-shared-id',
        `owner: ${scope}`,
        `scope: ${scope}`,
        'role: guide',
        'lifecycle: durable',
        'authority: canonical',
        'provenance: declared',
        'view: current',
        '---',
        '',
        '# Shared id',
        '',
      ].join('\n');
    await Promise.all([
      writeFile(
        join(root, 'docs/guides/shared-id.md'),
        duplicateDocument('workspace'),
        'utf8',
      ),
      writeFile(
        join(root, 'packages/ledger/docs/guides/shared-id.md'),
        duplicateDocument('ledger'),
        'utf8',
      ),
    ]);

    const references = await buildSkoposReferenceArtifacts({ cwd: root });

    expect(references.duplicates.entries).toContainEqual(
      expect.objectContaining({
        id: 'doc-id:DOC-shared-id',
        kind: 'doc-id',
        key: 'DOC-shared-id',
        owners: expect.arrayContaining([
          expect.objectContaining({ path: 'docs/guides/shared-id.md' }),
          expect.objectContaining({ path: 'packages/ledger/docs/guides/shared-id.md' }),
        ]),
      }),
    );
  });
});

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-document-catalog-'));
  temporaryRoots.push(root);
  await Promise.all([
    mkdir(join(root, 'docs/archive'), { recursive: true }),
    mkdir(join(root, 'docs/patterns'), { recursive: true }),
    mkdir(join(root, 'docs/reference/generated'), { recursive: true }),
    mkdir(join(root, 'docs/scopes/payments/architecture'), { recursive: true }),
    mkdir(join(root, 'packages/payments'), { recursive: true }),
    mkdir(join(root, 'tools/skopos'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(root, 'skopos.config.yaml'),
      [
        'schemaVersion: 1',
        'project:',
        '  name: catalog-proof',
        '  archetype: library',
        '  repoMode: single',
        '  scopeStrategy: package',
        '  mode: new-project',
        'commands: {}',
        'workspace:',
        '  ignore: []',
        'docs:',
        '  root: docs',
        '  startHerePath: docs/00-start-here.md',
        '  usePerDomainArchive: true',
        '  strictMetadata: true',
        '  strictLinking: true',
        'agents:',
        '  canonicalInstructions: AGENTS.md',
        '  syncMirrors: []',
        '  mcp: false',
        'verification:',
        '  mode: balanced',
        '  requireDocsSync: true',
        '  requireEvidenceForReadiness: true',
        'decisions:',
        '  mode: balanced',
        '  askFor: []',
        'security:',
        '  privacyMode: local-only',
        '  redactSecrets: true',
        '',
      ].join('\n'),
      'utf8',
    ),
    writeFile(join(root, 'AGENTS.md'), '# Instructions\n', 'utf8'),
    writeFile(
      join(root, 'tools/skopos/scopes.yaml'),
      scopeRegistryYaml,
      'utf8',
    ),
    writeFile(
      join(root, 'docs/00-start-here.md'),
      '---\nid: DOC-start\nowner: project-maintainers\nscope: workspace\nrole: router\nlifecycle: active\nauthority: canonical\nprovenance: declared\nview: current\n---\n\n# Start here\n',
      'utf8',
    ),
    writeFile(
      join(root, 'docs/archive/old-plan.md'),
      '---\nid: P-old-plan\nowner: project-maintainers\nscope: workspace\nrole: plan\nlifecycle: historical\nauthority: supporting\nprovenance: accepted\nview: transition\n---\n\n# Old plan\n',
      'utf8',
    ),
    writeFile(
      join(root, 'docs/patterns/PAT-a1b2c3d4-repeat-unowned-docs-layout.md'),
      [
        '---',
        'id: PAT-a1b2c3d4',
        'owner: project-maintainers',
        'scope: workspace',
        'role: pattern',
        'kind: failure-pattern',
        'lifecycle: durable',
        'authority: canonical',
        'provenance: accepted',
        'view: current',
        'appliesTo:',
        '  - docs/**',
        '  - adoption',
        '---',
        '',
        '# Repeat unowned docs layout',
        '',
        'Avoid repeating a legacy documentation layout after adoption.',
        '',
      ].join('\n'),
      'utf8',
    ),
    writeFile(
      join(root, 'docs/reference/generated/api.md'),
      '---\nid: DOC-generated-api\nowner: api-generator\nscope: workspace\nrole: reference\nlifecycle: durable\nauthority: generated\nprovenance: declared\nview: current\n---\n\n# API reference\n',
      'utf8',
    ),
    writeFile(
      join(root, 'docs/scopes/payments/architecture/overview.md'),
      [
        '---',
        'id: DOC-payments-architecture',
        'owner: payments',
        'scope: payments',
        'role: architecture',
        'lifecycle: active',
        'authority: canonical',
        'provenance: declared',
        'view: current',
        '---',
        '',
        '# Payments architecture',
        '',
        'Payments owns money movement.',
        '',
      ].join('\n'),
      'utf8',
    ),
  ]);
  return root;
};
