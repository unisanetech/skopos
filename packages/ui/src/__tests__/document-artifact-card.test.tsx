import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { KnowledgeDocumentArtifactCard } from '../features/knowledge/documents/artifact.js';
import type { SkoposUiConsoleDocumentView } from '../contracts/skopos-ui-console-state.js';

describe('KnowledgeDocumentArtifactCard', () => {
  it('renders structured artifact sections instead of the markdown reader fallback', () => {
    const markup = renderToStaticMarkup(
      <KnowledgeDocumentArtifactCard
        document={
          {
            id: 'architecture',
            title: 'Architecture artifact',
            kind: 'artifact',
            format: 'json',
            href: '/docs/architecture',
            displayPath: '/repo/.skopos/index/architecture.json',
            exists: true,
            summary: 'Compiled architecture state.',
            excerpt: 'Compiled architecture state.',
            headings: ['Current architecture'],
            sections: [],
            updatedAt: '2026-04-11T00:00:00.000Z',
            artifactView: {
              kind: 'architecture',
              summary: 'Compiled architecture state.',
              metrics: [
                {
                  label: 'Alignment',
                  value: 'aligned',
                  tone: 'positive',
                },
              ],
              sections: [
                {
                  id: 'current',
                  title: 'Current architecture',
                  description: 'Current workspace posture.',
                  layout: 'key-value',
                  items: [
                    {
                      label: 'Topology',
                      value: 'web-monorepo',
                    },
                  ],
                },
                {
                  id: 'evidence',
                  title: 'Evidence',
                  description: 'Signals used to produce the artifact.',
                  layout: 'entries',
                  entries: [
                    {
                      title: 'repo mode',
                      summary: 'monorepo',
                      meta: 'high confidence',
                    },
                  ],
                },
              ],
            },
          } satisfies SkoposUiConsoleDocumentView
        }
      />,
    );

    expect(markup).toContain('Current architecture');
    expect(markup).toContain('Topology');
    expect(markup).toContain('repo mode');
    expect(markup).not.toContain('No reader sections');
  });
});
