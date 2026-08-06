import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import type { SkoposUiConsoleState } from '../contracts/skopos-ui-console-state.js';
import { ProjectSearchDialog } from '../patterns/shells/search-dock.js';

describe('ProjectSearchDialog accessibility', () => {
  it('does not mount the closed command dialog or its results in the accessibility tree', () => {
    const state = {
      searchIndex: {
        generatedAt: '2026-08-04T00:00:00.000Z',
        entries: [
          {
            id: 'task-current',
            group: 'work',
            kind: 'task',
            title: 'Current Task',
            summary: 'A result that must stay unavailable until search opens.',
            href: '/tasks/current',
            aliases: [],
            keywords: [],
            canonical: true,
            active: true,
            historical: false,
            stale: false,
            defaultRank: 1,
          },
        ],
      },
    } as SkoposUiConsoleState;

    const markup = renderToStaticMarkup(
      <ProjectSearchDialog state={state} currentPath="/overview" />,
    );

    expect(markup).toBe('');
  });
});
