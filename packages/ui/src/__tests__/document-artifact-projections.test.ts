import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';
import type { SkoposContentIndexArtifact } from '@skopos/model';

import { buildDocsLinks, buildDocuments } from '../application/build-console-state/document-projections.js';
import type { SkoposUiConsoleLink } from '../contracts/skopos-ui-console-state.js';

const tempDirs: string[] = [];

describe('document artifact projections', () => {
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

  it('builds a structured artifact view for canonical architecture json', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-doc-artifact-'));
    tempDirs.push(workspaceRoot);

    const artifactPath = join(workspaceRoot, 'architecture.json');
    await writeFile(
      artifactPath,
      JSON.stringify(
        {
          id: 'architecture',
          type: 'architecture',
          summary: 'Current architecture already aligns with the recommended workspace shape.',
          alignmentStatus: 'aligned',
          repoMode: 'monorepo',
          archetypeSuggestion: 'monorepo-platform',
          current: {
            topology: 'web-monorepo',
            boundaryQuality: 'clear',
            summary: 'Current workspace boundaries are explicit enough.',
            units: [
              {
                scopeId: 'workspace',
                title: 'Workspace',
                role: 'workspace-root',
                confidence: 'high',
                path: '.',
                summary: 'Workspace composition root.',
              },
            ],
            evidence: ['repo mode: monorepo'],
          },
          recommended: {
            topology: 'web-monorepo',
            boundaryQuality: 'clear',
            summary: 'Recommended workspace shape matches the current topology.',
            units: [
              {
                scopeId: 'workspace',
                title: 'Workspace',
                role: 'workspace-root',
                confidence: 'high',
                path: '.',
                summary: 'Workspace composition root.',
              },
            ],
            evidence: ['recommended topology: web-monorepo'],
          },
        },
        null,
        2,
      ),
      'utf8',
    );

    const [document] = await buildDocuments([
      {
        id: 'architecture',
        title: 'Architecture artifact',
        href: '/docs/architecture',
        displayPath: artifactPath,
        exists: true,
        kind: 'artifact',
      } satisfies SkoposUiConsoleLink,
    ]);

    expect(document?.summary).toContain('aligns with the recommended');
    expect(document?.artifactView?.kind).toBe('architecture');
    expect(document?.artifactView?.metrics[0]?.label).toBe('Alignment');
    expect(document?.artifactView?.sections.map((section) => section.title)).toContain(
      'Current architecture',
    );
    expect(document?.artifactView?.sections.map((section) => section.title)).toContain(
      'Current units',
    );
  });

  it('builds a generic structured artifact view for unknown json payloads', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-doc-artifact-generic-'));
    tempDirs.push(workspaceRoot);

    const artifactPath = join(workspaceRoot, 'custom.json');
    await writeFile(
      artifactPath,
      JSON.stringify(
        {
          type: 'custom',
          status: 'generated',
          authority: 'generated',
          summary: 'Custom structured payload.',
          foo: 'bar',
          nested: {
            alpha: 1,
            beta: 'two',
          },
          items: [{ id: 'x-1', summary: 'Item one' }, { id: 'x-2', summary: 'Item two' }],
        },
        null,
        2,
      ),
      'utf8',
    );

    const [document] = await buildDocuments([
      {
        id: 'custom',
        title: 'Custom artifact',
        href: '/docs/custom',
        displayPath: artifactPath,
        exists: true,
        kind: 'artifact',
      } satisfies SkoposUiConsoleLink,
    ]);

    expect(document?.artifactView?.kind).toBe('generic');
    expect(document?.artifactView?.sections.map((section) => section.title)).toContain(
      'Top-level fields',
    );
    expect(document?.artifactView?.sections.map((section) => section.title)).toContain(
      'Structured objects',
    );
    expect(document?.artifactView?.sections.map((section) => section.title)).toContain(
      'Collections',
    );
  });

  it('keeps nested archive docs out of the default discovered docs links', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-doc-links-'));
    tempDirs.push(workspaceRoot);

    await mkdir(join(workspaceRoot, 'docs', 'project', 'execution', 'archive'), {
      recursive: true,
    });
    await mkdir(join(workspaceRoot, 'docs', 'decisions', 'archive'), {
      recursive: true,
    });

    await writeFile(join(workspaceRoot, 'docs', '00-start-here.md'), '# Start here\n', 'utf8');
    await writeFile(
      join(workspaceRoot, 'docs', 'project', 'execution', 'current.md'),
      '# Current work\n',
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, 'docs', 'project', 'execution', 'archive', 'old.md'),
      '# Archived work\n',
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, 'docs', 'decisions', 'archive', '001-old.md'),
      '# Old decision\n',
      'utf8',
    );

    const links = await buildDocsLinks({
      workspaceRoot,
      outputDirectory: join(workspaceRoot, '.skopos', 'ui', 'app'),
    });

    const displayPaths = links.map((link) => link.displayPath);
    expect(displayPaths).toContain(join(workspaceRoot, 'docs', 'project', 'execution', 'current.md'));
    expect(displayPaths).not.toContain(
      join(workspaceRoot, 'docs', 'project', 'execution', 'archive', 'old.md'),
    );
    expect(displayPaths).not.toContain(
      join(workspaceRoot, 'docs', 'decisions', 'archive', '001-old.md'),
    );
  });

  it('keeps YAML frontmatter out of human document summaries and sections', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-doc-frontmatter-'));
    tempDirs.push(workspaceRoot);

    const documentPath = join(workspaceRoot, 'guide.md');
    await writeFile(
      documentPath,
      '---\ntitle: Internal metadata\nstatus: active\n---\n\n# Working guide\n\nStart with the current task.\n',
      'utf8',
    );

    const [document] = await buildDocuments([
      {
        id: 'guide',
        title: 'Working guide',
        href: '/docs/guide',
        displayPath: documentPath,
        exists: true,
        kind: 'doc',
      } satisfies SkoposUiConsoleLink,
    ]);

    expect(document?.title).toBe('Working guide');
    expect(document?.summary).toBe('Start with the current task.');
    expect(document?.excerpt).not.toContain('status: active');
    expect(document?.sections.some((section) => section.body.includes('title: Internal metadata'))).toBe(false);
  });

  it('retains human-relevant decision sections beyond the generic document preview', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-doc-decision-'));
    tempDirs.push(workspaceRoot);

    const documentPath = join(workspaceRoot, 'decision.md');
    await writeFile(
      documentPath,
      [
        '# Human supervision',
        '',
        '## Context',
        '',
        'The project needs a calmer supervision surface.',
        '',
        '## Decision',
        '',
        ...Array.from({ length: 8 }, (_, index) =>
          `### Commitment ${index + 1}\n\nKeep commitment ${index + 1}.\n`,
        ),
        '## Consequences',
        '',
        'Raw metadata becomes supporting detail.',
        '',
        '## Rejected Alternatives',
        '',
        'Do not keep the record-shaped dashboard.',
      ].join('\n'),
      'utf8',
    );

    const [document] = await buildDocuments([
      {
        id: 'human-supervision',
        title: 'Human supervision',
        href: '/decisions/human-supervision',
        displayPath: documentPath,
        exists: true,
        kind: 'doc',
        role: 'decision',
        lifecycle: 'durable',
      } satisfies SkoposUiConsoleLink,
    ]);

    expect(document?.summary).toBe('The project needs a calmer supervision surface.');
    expect(document?.sections.map((section) => section.title)).toContain('Consequences');
    expect(document?.sections.map((section) => section.title)).toContain('Rejected Alternatives');
  });

  it('uses compiled document semantics instead of rediscovering project-shaped paths', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-doc-catalog-'));
    tempDirs.push(workspaceRoot);
    await mkdir(join(workspaceRoot, 'handbook', 'governance', 'choices'), {
      recursive: true,
    });
    const documentPath = join(workspaceRoot, 'handbook', 'governance', 'choices', 'C-001.md');
    await writeFile(documentPath, '# Accepted choice\n\nKeep one authority.\n', 'utf8');

    const links = await buildDocsLinks({
      workspaceRoot,
      outputDirectory: join(workspaceRoot, 'output'),
      indexArtifact: {
        docsRoot: 'handbook',
        quickLinks: {},
        documents: [
          {
            id: 'choice-c-001',
            title: 'Accepted choice',
            path: 'handbook/governance/choices/C-001.md',
            sourceId: 'handbook',
            role: 'decision',
            lifecycle: 'active',
            authority: 'canonical',
            defaultVisible: true,
          },
        ],
      } as SkoposContentIndexArtifact,
    });
    const documents = await buildDocuments(links);
    const choice = documents.find((document) => document.id === 'choice-c-001');

    expect(choice).toMatchObject({
      role: 'decision',
      lifecycle: 'active',
      authority: 'canonical',
      sourceId: 'handbook',
    });
  });
});
