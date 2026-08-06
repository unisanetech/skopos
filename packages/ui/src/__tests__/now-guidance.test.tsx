import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import type { SkoposUiConsoleState } from '../contracts/skopos-ui-console-state.js';
import { NowGuidanceCard } from '../features/work/overview-sections.js';

describe('Now guidance', () => {
  it('prioritizes the canonical pending decision and recommendation', () => {
    const state = {
      sessionContext: {
        schemaVersion: 1,
        workspaceRoot: '/workspace',
        summary: 'A blocking user decision is pending.',
        responseMode: 'decision',
        communicationContract: { marker: 'test', tokenBudget: 1, coreRules: [] },
        currentTaskId: 'T-1',
        currentTask: {
          id: 'T-1',
          title: 'Improve the UI',
          goal: 'Make supervision clear',
          state: 'blocked',
          risk: 'high-impact',
          scopeId: 'skopos-ui',
          ownedPaths: ['packages/ui'],
          additionalOwnedPathCount: 0,
          completedStepCount: 1,
          totalStepCount: 4,
          selectedActionIds: ['quality.typecheck'],
        },
        pendingDecision: {
          id: 'architecture-shift',
          question: 'Should package boundaries change?',
          escalation: 'must-ask',
          blocking: true,
          whyItMatters: 'The answer controls the implementation boundary.',
          recommendedOptionId: 'preserve',
          recommendedOption: {
            id: 'preserve',
            label: 'Preserve current boundaries',
            rationale: 'The UI can improve without a runtime redesign.',
          },
          alternatives: [],
          defaultBehavior: 'wait-for-answer',
          whatHappensAfterAnswer: 'Implementation may continue.',
        },
        additionalPendingDecisionCount: 0,
        warnings: [],
        additionalContext: '',
      },
    } as SkoposUiConsoleState;

    const markup = renderToStaticMarkup(<NowGuidanceCard state={state} />);

    expect(markup).toContain('Your decision is needed');
    expect(markup).toContain('Should package boundaries change?');
    expect(markup).toContain('Preserve current boundaries');
    expect(markup).toContain('Why this matters');
    expect(markup).toContain('What happens next');
    expect(markup).toContain('Implementation may continue.');
    expect(markup).toContain('Continue from the terminal');
    expect(markup).toContain('Copy command');
    expect(markup).toContain(
      'skopos decide architecture-shift preserve . --actor &lt;your-agent-id&gt;',
    );
  });

  it('does not present a non-blocking recommendation as a required decision', () => {
    const state = {
      sessionContext: {
        schemaVersion: 1,
        workspaceRoot: '/workspace',
        summary: 'A user decision is pending.',
        responseMode: 'decision',
        communicationContract: { marker: 'test', tokenBudget: 1, coreRules: [] },
        currentTaskId: 'T-1',
        currentTask: {
          id: 'T-1',
          title: 'Improve the UI',
          goal: 'Make supervision clear',
          state: 'active',
          risk: 'standard',
          scopeId: 'skopos-ui',
          ownedPaths: ['packages/ui'],
          additionalOwnedPathCount: 0,
          completedStepCount: 1,
          totalStepCount: 4,
          selectedActionIds: [],
        },
        pendingDecision: {
          id: 'scope-choice',
          question: 'Should this work use one declared Scope?',
          escalation: 'recommend-and-ask',
          blocking: false,
          whyItMatters: 'A narrow Scope keeps proof focused.',
          recommendedOptionId: 'narrow',
          recommendedOption: {
            id: 'narrow',
            label: 'Use one Scope',
            rationale: 'This is the smallest reliable boundary.',
          },
          alternatives: [],
          defaultBehavior: 'proceed-with-recommended-if-no-preference',
          whatHappensAfterAnswer: 'Skopos recomputes the Work Queue.',
        },
        additionalPendingDecisionCount: 0,
        warnings: [],
        additionalContext: '',
      },
    } as SkoposUiConsoleState;

    const markup = renderToStaticMarkup(<NowGuidanceCard state={state} />);

    expect(markup).toContain('A decision is recommended');
    expect(markup).toContain('recommendation');
    expect(markup).toContain(
      'If you have no preference, Skopos can continue with the recommended choice.',
    );
    expect(markup).not.toContain('Your decision is needed');
    expect(markup).not.toContain('recomputes the Work Queue');
  });
});
