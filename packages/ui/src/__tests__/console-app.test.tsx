import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { SkoposUiConsoleTaskView } from '../contracts/skopos-ui-console-state.js';
import { TaskFrameCard } from '../features/work/task-detail/content.js';

describe('TaskFrameCard disposition parity', () => {
  it('reports the canonical disposition record without creating a UI mutation path', () => {
    const markup = renderToStaticMarkup(
      <TaskFrameCard
        taskView={
          {
            task: {
              summary: 'A deferred fixture Task.',
              goal: 'Prove read-only disposition reporting.',
              steps: [],
              disposition: {
                kind: 'supersede',
                reason: 'A narrower successor owns the remaining implementation.',
                actorId: 'maintainer',
                recordedAt: '2026-08-03T00:00:00.000Z',
                priorState: 'active',
                nextState: 'superseded',
                successorTaskId: 'T-successor',
              },
            },
          } as unknown as SkoposUiConsoleTaskView
        }
      />,
    );

    expect(markup).toContain('Latest disposition');
    expect(markup).toContain('supersede: active');
    expect(markup).toContain('superseded');
    expect(markup).toContain('A narrower successor owns the remaining implementation.');
    expect(markup).toContain('maintainer');
    expect(markup).toContain('successor T-successor');
    expect(markup).not.toContain('<button');
  });
});
