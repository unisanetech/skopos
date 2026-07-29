import { describe, expect, it } from 'vitest';

import type { SkoposUiConsoleDocumentView } from '../contracts/skopos-ui-console-state.js';
import { filterProjectDocuments } from '../platform/console-state/knowledge-selectors.js';

const documentFixture = (
  id: string,
  role: SkoposUiConsoleDocumentView['role'],
): SkoposUiConsoleDocumentView => ({
  id,
  title: id,
  kind: 'doc',
  format: 'markdown',
  lifecycle: 'durable',
  role,
  href: `../../docs/${id}.md`,
  displayPath: `/repo/docs/${id}.md`,
  exists: true,
  summary: 'Summary',
  excerpt: 'Excerpt',
  headings: [],
  sections: [],
});

describe('project document views', () => {
  const documents = [
    documentFixture('architecture', 'architecture'),
    documentFixture('guide', 'guide'),
    documentFixture('plan', 'plan'),
    documentFixture('task', 'task'),
    documentFixture('pattern', 'pattern'),
    documentFixture('note', 'document'),
  ];

  it('keeps the default view focused on project essentials', () => {
    expect(filterProjectDocuments(documents, 'essentials').map(({ id }) => id)).toEqual([
      'architecture',
      'guide',
    ]);
  });

  it('keeps authored work and other docs available without mixing every role by default', () => {
    expect(filterProjectDocuments(documents, 'work').map(({ id }) => id)).toEqual([
      'plan',
      'task',
    ]);
    expect(filterProjectDocuments(documents, 'other').map(({ id }) => id)).toEqual([
      'pattern',
      'note',
    ]);
    expect(filterProjectDocuments(documents, 'all')).toEqual(documents);
  });
});
