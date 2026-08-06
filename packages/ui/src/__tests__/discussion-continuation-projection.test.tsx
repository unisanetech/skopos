import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { SkoposDiscussionHandoffArtifact } from '@skopos/model';
import { TaskDiscussionContextCard } from '../features/work/discussion-sections.js';

describe('read-only fresh continuation projection', () => {
  it('shows semantic context, freshness, budget, and delivery without exposing the raw prompt', () => {
    const handoff = fixtureHandoff();
    const markup = renderToStaticMarkup(
      <TaskDiscussionContextCard
        latestDiscussionHandoff={{ artifactPath: '/project/.skopos/handoff.json', handoff }}
        taskCheckpoints={[]}
      />,
    );
    expect(markup).toContain('current');
    expect(markup).toContain('accepted');
    expect(markup).toContain('stopping point');
    expect(markup).toContain('Focused tests pass.');
    expect(markup).toContain('recommended first action');
    expect(markup).not.toContain('[SKOPOS_FRESH_CONTINUATION_V1]');
    expect(markup).not.toContain('button');
  });
});

const fixtureHandoff = (): SkoposDiscussionHandoffArtifact => ({
  schemaVersion: 1,
  id: 'discussion-handoff-fixture',
  type: 'discussion-handoff',
  status: 'generated',
  authority: 'generated',
  workspaceRoot: '/project',
  handoffKind: 'fresh-session-continuation',
  activeTaskId: 'T-fixture',
  conversationCapsule: {
    authoredBy: 'origin-agent', authoredAt: '2026-08-05T00:00:00.000Z',
    origin: { host: 'codex', sessionId: 'origin-session' },
    statements: [
      { id: 'stop', section: 'stopping-point', classification: 'verified-fact', text: 'Focused tests pass.', sourceRefs: [] },
      { id: 'next', section: 'recommended-first-action', classification: 'agent-recommendation', text: 'Verify before editing.', sourceRefs: [] },
    ],
  },
  compiledState: {
    workspaceIdentity: { repositoryId: 'repo', worktreeId: 'worktree', workspaceRootDigest: 'root' },
    taskIdentity: { taskId: 'T-fixture', revisionDigest: 'task', state: 'active' },
    sourceIdentity: { ownedPathDigest: 'source' },
    coordinationIdentity: { digest: 'coordination', claimCount: 0, openMutationCount: 0, contaminationCount: 0, runningActionIds: [] },
    policyIdentity: 'policy', evidenceIdentities: [], compiledAt: '2026-08-05T00:00:00.000Z',
  },
  validation: { freshness: 'current', valid: true, safeToTransfer: true, sensitive: false, overBudget: false, reasons: [], checkedAt: '2026-08-05T00:00:00.000Z' },
  delivery: { state: 'accepted', destinationHost: 'codex' },
  currentDirection: 'Continue the Task', acceptedDecisions: [], openQuestions: [], linkedCheckpointIds: [], linkedArtifactPaths: [],
  resumeSummary: '[SKOPOS_FRESH_CONTINUATION_V1] hidden prompt', estimatedTokens: 900, budgetTokens: 4000, overBudget: false,
});
