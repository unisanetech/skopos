import { describe, expect, it } from 'vitest';

import type { SkoposUiConsoleDocumentView } from '../contracts/skopos-ui-console-state.js';
import {
  documentLifecycleForDisplayPath,
  knowledgeCategoryForDisplayPath,
  resolveKnowledgeDocumentHref,
} from '../support/knowledge/document-routing.js';

const documentFixture = (overrides: Partial<SkoposUiConsoleDocumentView>): SkoposUiConsoleDocumentView => ({
  id: 'doc',
  title: 'Doc',
  kind: 'doc',
  format: 'markdown',
  href: '../../../../docs/doc.md',
  displayPath: '/repo/docs/doc.md',
  exists: true,
  summary: 'Summary',
  excerpt: 'Excerpt',
  headings: [],
  sections: [],
  updatedAt: '2026-04-11T00:00:00.000Z',
  ...overrides,
});

describe('document routing helpers', () => {
  it('classifies decisions and findings by display path', () => {
    expect(knowledgeCategoryForDisplayPath('/repo/docs/decisions/015-test.md')).toBe('decisions');
    expect(knowledgeCategoryForDisplayPath('/repo/docs/findings/F-001.md')).toBe('findings');
    expect(knowledgeCategoryForDisplayPath('/repo/docs/findings/archive/F-001.md')).toBe('docs');
  });

  it('classifies document lifecycle with nested archive awareness', () => {
    expect(documentLifecycleForDisplayPath('/repo/docs/00-start-here.md')).toBe('active');
    expect(documentLifecycleForDisplayPath('/repo/docs/project/execution/P1-W2.md')).toBe('active');
    expect(documentLifecycleForDisplayPath('/repo/docs/decisions/024-token-control.md')).toBe('durable');
    expect(documentLifecycleForDisplayPath('/repo/docs/decisions/archive/001-legacy.md')).toBe(
      'historical',
    );
    expect(documentLifecycleForDisplayPath('/repo/docs/project/execution/archive/P1-old.md')).toBe(
      'historical',
    );
  });

  it('resolves relative markdown links to routed knowledge hrefs', () => {
    const documents = [
      documentFixture({
        id: 'guide',
        displayPath: '/repo/docs/guides/guide.md',
      }),
      documentFixture({
        id: 'decision-015',
        displayPath: '/repo/docs/decisions/015-reader.md',
      }),
    ];

    expect(
      resolveKnowledgeDocumentHref({
        documents,
        currentDisplayPath: '/repo/docs/guides/guide.md',
        href: '../decisions/015-reader.md',
      }),
    ).toBe('#/decisions/decision-015');
  });

  it('leaves unknown or external links alone', () => {
    const documents = [documentFixture({ id: 'guide', displayPath: '/repo/docs/guides/guide.md' })];

    expect(
      resolveKnowledgeDocumentHref({
        documents,
        currentDisplayPath: '/repo/docs/guides/guide.md',
        href: 'https://example.com',
      }),
    ).toBe('https://example.com');

    expect(
      resolveKnowledgeDocumentHref({
        documents,
        currentDisplayPath: '/repo/docs/guides/guide.md',
        href: './missing.md',
      }),
    ).toBe('./missing.md');
  });
});
