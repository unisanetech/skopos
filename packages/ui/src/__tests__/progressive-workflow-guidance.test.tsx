import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import { TaskGuidanceCard } from '../features/work/task-detail/content.js';
import type { TaskGuidanceContext } from '../platform/console-state/work-selectors.js';

describe('progressive Task workflow guidance', () => {
  it('shows the exact next command and unowned-path review without adding UI mutation', () => {
    const guidance: TaskGuidanceContext = {
      percentComplete: 50,
      completedCount: 2,
      totalCount: 4,
      phase: 'implementation',
      doneText: 'Reviewed current behavior.',
      doingNowText: 'Review unowned changes before proof.',
      decisionText: 'No decision items are tracked for this task.',
      findingText: 'No active findings are linked.',
      blockerText: 'No blocking Task questions are open for this task.',
      proofText: 'Run one selected Action before Readiness.',
      workflow: 'strict',
      nextCommand: "skopos task ownership add T-1 --own 'docs/extra.md' --reason 'Reviewed.' --actor 'agent-a'",
      nextReason: 'One changed path is outside declared Task ownership.',
      ownershipSuggestion: {
        paths: ['docs/extra.md'],
        reason: 'Changed after Task admission without current Task ownership.',
        command: "skopos task ownership add T-1 --own 'docs/extra.md'",
        confirmationRequired: true,
      },
      openQuestions: [],
    };

    const markup = renderToStaticMarkup(<TaskGuidanceCard guidance={guidance} />);

    expect(markup).toContain('strict');
    expect(markup).toContain('Exact next command');
    expect(markup).toContain('skopos task ownership add T-1');
    expect(markup).toContain('Review unowned changes');
    expect(markup).toContain('confirmation required');
    expect(markup).toContain('docs/extra.md');
    expect(markup).not.toContain('<button');
  });

  it('explains the compact light fast path', () => {
    const guidance: TaskGuidanceContext = {
      percentComplete: 100,
      completedCount: 2,
      totalCount: 2,
      phase: 'closure',
      doneText: 'Focused edit and proof are complete.',
      doingNowText: 'Finish the admitted work.',
      decisionText: 'No decisions are open.',
      findingText: 'No findings are open.',
      blockerText: 'No blockers are open.',
      proofText: 'Focused Evidence is ready.',
      workflow: 'fast-path',
      nextCommand: "skopos finish T-light . --actor 'agent-a' --json",
      nextReason: 'The light fast path can perform closure verification inside finish.',
      openQuestions: [],
    };

    const markup = renderToStaticMarkup(<TaskGuidanceCard guidance={guidance} />);

    expect(markup).toContain('fast path');
    expect(markup).toContain('skopos finish T-light');
    expect(markup).toContain('closure verification inside finish');
  });
});
