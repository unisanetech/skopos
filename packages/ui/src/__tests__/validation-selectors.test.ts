import { describe, expect, it } from 'vitest';

import type { SkoposUiConsoleState } from '../contracts/skopos-ui-console-state.js';
import {
  getActivityViewContext,
  getProofViewContext,
} from '../platform/console-state/validation-selectors.js';

const buildState = (
  activity: Partial<SkoposUiConsoleState['activity']>,
): SkoposUiConsoleState =>
  ({
    activity: {
      workspaceRoot: '/tmp/skopos',
      plans: [],
      missions: [],
      workflowRuns: [],
      operationalEvents: [],
      ...activity,
    },
  }) as SkoposUiConsoleState;

describe('getActivityViewContext', () => {
  it('collapses repeated trust events into one timeline entry and surfaces readiness as the outcome', () => {
    const state = buildState({
      operationalEvents: [
        {
          id: 'trust-3',
          eventKind: 'trust',
          status: 'succeeded',
          summary: 'Trust check completed with needs-review readiness.',
          timestamp: '2026-04-11T03:35:48.108Z',
        },
        {
          id: 'trust-2',
          eventKind: 'trust',
          status: 'succeeded',
          summary: 'Trust check completed with needs-review readiness.',
          timestamp: '2026-04-11T03:32:55.718Z',
        },
        {
          id: 'trust-1',
          eventKind: 'trust',
          status: 'succeeded',
          summary: 'Trust check completed with needs-review readiness.',
          timestamp: '2026-04-11T03:32:54.518Z',
        },
      ],
    });

    const context = getActivityViewContext(state);

    expect(context.feedGroups).toHaveLength(1);
    expect(context.feedGroups[0]?.entries).toHaveLength(1);
    expect(context.latestEntry).toMatchObject({
      feedKind: 'event',
      kindLabel: 'Trust',
      statusLabel: 'needs-review',
      countLabel: '3 runs',
      headline: '3 trust checks completed with the same needs-review readiness result.',
    });
    expect(context.postureItems).toContainEqual({ label: 'Recent changes', value: '1' });
    expect(context.postureItems).toContainEqual({ label: 'Operational groups', value: '1' });
  });

  it('merges operational events with plans and missions into the main feed', () => {
    const state = buildState({
      operationalEvents: [
        {
          id: 'instructions-1',
          eventKind: 'instructions-sync',
          status: 'succeeded',
          summary: 'Synced 3 instruction mirror(s).',
          actorId: 'agent-docs',
          timestamp: '2026-04-11T02:30:00.000Z',
        },
      ],
      plans: [
        {
          id: 'plan-1',
          title: 'Plan the docs cleanup',
          goal: 'goal',
          summary: 'Tighten docs cleanup scope.',
          scopeId: '@skopos/ui',
          confidence: 'high',
          createdByActorId: 'agent-plan',
          updatedAt: '2026-04-11T02:00:00.000Z',
          artifactPath: '/tmp/skopos/.skopos/plans/plan-1.json',
        },
      ],
      missions: [
        {
          id: 'mission-1',
          title: 'Mission: Deepen the activity route',
          summary: 'Execution checklist for activity route cleanup.',
          state: 'active',
          scopeId: '@skopos/ui',
          pendingItemCount: 3,
          linkedSliceCount: 2,
          recommendedWorkflowIds: [],
          claimedByActorId: 'agent-ui',
          lastUpdatedByActorId: 'agent-ui',
          updatedAt: '2026-04-11T03:00:00.000Z',
          artifactPath: '/tmp/skopos/.skopos/missions/mission-1.json',
        },
      ],
    });

    const context = getActivityViewContext(state);

    expect(context.feedGroups).toHaveLength(1);
    expect(context.feedGroups[0]?.entries).toHaveLength(3);
    expect(context.feedGroups[0]?.entries[0]).toMatchObject({
      feedKind: 'mission',
      statusLabel: 'Active',
      missionId: 'mission-1',
      actorId: 'agent-ui',
    });
    expect(context.feedGroups[0]?.entries[1]).toMatchObject({
      feedKind: 'event',
      kindLabel: 'Instructions Sync',
      statusLabel: 'run complete',
      actorId: 'agent-docs',
    });
    expect(context.feedGroups[0]?.entries[2]).toMatchObject({
      feedKind: 'plan',
      planId: 'plan-1',
      actorId: 'agent-plan',
    });
  });
});

describe('getProofViewContext', () => {
  it('keeps unchanged category inventory out of the center watch surface', () => {
    const state = {
      proofReport: {
        updatedAt: '2026-04-11T03:00:00.000Z',
        scorecard: {
          status: 'pass',
          weightedPassRate: 1,
          passedBenchmarks: 2,
          benchmarkCount: 2,
          passedMustWinBenchmarks: 1,
          mustWinBenchmarks: 1,
          benchmarks: [],
          categorySummaries: [
            {
              category: 'stability',
              weightedPassRate: 1,
              passedBenchmarks: 2,
              benchmarkCount: 2,
              failedBenchmarks: 0,
            },
          ],
        },
        comparison: {
          status: 'pass',
          weightedPassRateDelta: 0,
          regressedBenchmarks: [],
          regressedCategories: [],
          benchmarkCountMatches: true,
          categoryComparisons: [
            {
              category: 'stability',
              status: 'matched',
              baselineStatus: 'pass',
              currentStatus: 'pass',
              currentWeightedPassRate: 1,
            },
          ],
        },
      },
      docsLinks: [],
    } as SkoposUiConsoleState;

    const context = getProofViewContext(state);

    expect(context.visibleCategoryWatch).toEqual([]);
  });
});
