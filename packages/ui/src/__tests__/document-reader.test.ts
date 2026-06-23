import { describe, expect, it } from 'vitest';

import type { SkoposUiConsoleDocumentView } from '../contracts/skopos-ui-console-state.js';
import {
  buildDocumentReaderEntries,
  pickActiveDocumentReaderEntry,
} from '../support/knowledge/document-reader.js';

const documentFixture = (overrides: Partial<SkoposUiConsoleDocumentView>): SkoposUiConsoleDocumentView => ({
  id: 'doc-1',
  title: 'Reader title',
  kind: 'doc',
  format: 'markdown',
  href: '../../../../docs/doc.md',
  displayPath: '/repo/docs/doc.md',
  exists: true,
  summary: 'Summary line',
  excerpt: 'Summary line',
  headings: ['Reader title', 'Rules', 'Examples'],
  sections: [],
  updatedAt: '2026-04-11T00:00:00.000Z',
  ...overrides,
});

describe('buildDocumentReaderEntries', () => {
  it('suppresses the duplicate first heading and builds stable section ids', () => {
    const document = documentFixture({
      sections: [
        {
          id: 'overview',
          title: 'Reader title',
          body: 'Summary line',
          level: 1,
          kind: 'narrative',
        },
        {
          id: 'rules',
          title: 'Rules',
          body: 'First rule',
          level: 2,
          kind: 'narrative',
        },
      ],
    });

    const entries = buildDocumentReaderEntries({ document });

    expect(entries).toHaveLength(2);
    expect(entries[0]?.hideHeading).toBe(true);
    expect(entries[1]?.hideHeading).toBe(false);
    expect(entries[1]?.domId).toBe('skopos-doc-doc-1-rules');
  });
});

describe('pickActiveDocumentReaderEntry', () => {
  it('selects the deepest visible section within the reader threshold', () => {
    const active = pickActiveDocumentReaderEntry({
      scrollTop: 410,
      offset: 96,
      sectionOffsets: [
        { domId: 'intro', top: 0 },
        { domId: 'rules', top: 240 },
        { domId: 'examples', top: 620 },
      ],
    });

    expect(active).toBe('rules');
  });
});
