import { describe, expect, it } from 'vitest';

import {
  assertExternalWorkspacePilot,
  type ExternalWorkspacePilotReport,
  renderExternalWorkspacePilotReport,
} from '../benchmarks/external-workspace-pilot.js';

describe('external workspace pilot report', () => {
  it('accepts bounded non-overlapping transport with no false questions', () => {
    expect(() => assertExternalWorkspacePilot(fixture())).not.toThrow();
  });

  it('rejects budget, cursor, and classification regressions', () => {
    expect(() =>
      assertExternalWorkspacePilot({
        ...fixture(),
        surfaces: [{ name: 'session', bytes: 40_000, durationMs: 1 }],
      }),
    ).toThrow('Compact budget exceeded');
    expect(() =>
      assertExternalWorkspacePilot({
        ...fixture(),
        queue: { ...fixture().queue, overlapCount: 1 },
      }),
    ).toThrow('duplicate collection entries');
    expect(() =>
      assertExternalWorkspacePilot({
        ...fixture(),
        questionIds: ['plan.security-privacy-change'],
      }),
    ).toThrow('unrelated questions');
  });

  it('renders scope limits and a reproducible command', () => {
    const markdown = renderExternalWorkspacePilotReport(fixture());
    expect(markdown).toContain('Actions executed by pilot: 0');
    expect(markdown).toContain('does not certify the external project implementation');
    expect(markdown).toContain('pnpm benchmark:external-workspace');
  });
});

const fixture = (): ExternalWorkspacePilotReport => ({
  schemaVersion: 1,
  workspace: 'external-project',
  dirtyStatusEntryCount: 1_858,
  surfaces: [{ name: 'session', bytes: 2_000, durationMs: 5 }],
  queue: {
    total: 69,
    firstReturned: 25,
    secondReturned: 25,
    cursorPresent: true,
    overlapCount: 0,
    counts: { ready: 48 },
  },
  actions: {
    total: 25,
    firstReturned: 10,
    secondReturned: 10,
    cursorPresent: true,
    overlapCount: 0,
  },
  selectedTask: { id: 'T-example', state: 'active', scopeId: 'workspace' },
  questionIds: [],
  prohibitedQuestionIds: [
    'plan.vendor-choice',
    'plan.destructive-migration',
    'plan.security-privacy-change',
  ],
  toolCallCount: 7,
  actionsExecuted: 0,
  tasksCreated: 0,
  compactBudgetBytes: 32_768,
  limitations: [
    'The pilot does not certify the external project implementation or production deployment.',
  ],
});
