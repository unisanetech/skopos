import { describe, expect, it } from 'vitest';

import type { SkoposUiConsoleState } from '../contracts/skopos-ui-console-state.js';
import {
  getMissionDiscussionContext,
  getOverviewDiscussionContext,
} from '../platform/console-state/discussion-selectors.js';

const createState = (): SkoposUiConsoleState =>
  ({
    workspaceRoot: '/workspace',
    workspaceLabel: 'skopos',
    outputDirectory: '/workspace/docs/generated/skopos/app',
    generatedAt: '2026-04-12T01:00:00.000Z',
    trustReport: {
      trustLevel: 'high',
      readiness: 'agent-ready',
      summary: 'Trust high.',
      checks: [],
      unresolvedAssumptions: [],
      findings: [],
      detected: {} as never,
      actorId: 'agent-core',
    },
    activity: {
      workspaceRoot: '/workspace',
      plans: [],
      missions: [],
      workflowRuns: [],
      operationalEvents: [],
    },
    graphs: {
      workspaceRoot: '/workspace',
      graphPaths: [],
      graphs: [],
    },
    plans: [],
    missions: [
      {
        artifactPath: '/workspace/.skopos/missions/mission-current.json',
        mission: {
          id: 'mission-current',
          planId: 'plan-current',
          state: 'active',
          title: 'Mission: Current UI slice',
          summary: 'Show discussion context in the routed console.',
          objective: 'show discussion context in the routed console',
          updatedAt: '2026-04-12T01:00:00.000Z',
          scope: {
            query: '@skopos/ui',
            scope: {
              id: '@skopos/ui',
              kind: 'package',
              title: '@skopos/ui',
              path: 'packages/ui',
              aliases: ['ui'],
              summary: 'UI package',
              confidence: 'high',
            },
          },
          items: [],
          recommendedChecks: [],
          recommendedWorkflowIds: [],
          decisionQuestionIds: [],
          linkedSlices: [],
          coordination: {
            claimedBy: {
              actorId: 'agent-core',
              claimedAt: '2026-04-12T01:00:00.000Z',
            },
            lastUpdatedBy: 'agent-core',
            lastUpdatedAt: '2026-04-12T01:00:00.000Z',
          },
        },
      },
    ],
    scopes: [],
    latestDiscussionHandoff: {
      artifactPath: '/workspace/.skopos/discussions/handoffs/latest-workflow.json',
      handoff: {
        schemaVersion: 1,
        id: 'discussion-handoff-latest-workflow',
        type: 'discussion-handoff',
        status: 'generated',
        authority: 'generated',
        summary: 'Latest workflow handoff.',
        updatedAt: '2026-04-12T01:00:00.000Z',
        generatedAt: '2026-04-12T01:00:00.000Z',
        workspaceRoot: '/workspace',
        handoffKind: 'workflow-resume',
        activeMissionId: 'mission-current',
        currentDirection: 'Keep the current mission tied to the latest accepted direction.',
        acceptedDecisions: [],
        openQuestions: [],
        linkedCheckpointIds: ['discussion-checkpoint-1'],
        linkedArtifactPaths: [],
        resumeSummary: 'Resume from the current mission with the latest accepted direction.',
        estimatedTokens: 120,
        budgetTokens: 1200,
        overBudget: false,
      },
    },
    discussionCheckpoints: [
      {
        artifactPath: '/workspace/.skopos/discussions/checkpoints/discussion-checkpoint-1.json',
        checkpoint: {
          schemaVersion: 1,
          id: 'discussion-checkpoint-1',
          type: 'discussion-checkpoint',
          status: 'generated',
          authority: 'generated',
          summary: 'Current discussion checkpoint.',
          updatedAt: '2026-04-12T01:00:00.000Z',
          generatedAt: '2026-04-12T01:00:00.000Z',
          workspaceRoot: '/workspace',
          threadId: 'mission:mission-current',
          checkpointKind: 'workflow-state',
          activeMissionId: 'mission-current',
          linkedPlanId: 'plan-current',
          currentDirection: 'Keep the current mission tied to the latest accepted direction.',
          acceptedDecisions: [],
          openQuestions: [],
          linkedArtifactPaths: [],
          resumeSummary: 'Resume from the current mission with the latest accepted direction.',
          estimatedTokens: 120,
          budgetTokens: 900,
          overBudget: false,
        },
      },
    ],
    docsLinks: [],
    documents: [],
    artifactCounts: {} as never,
  }) as SkoposUiConsoleState;

describe('discussion selectors', () => {
  it('exposes the latest handoff and linked mission for overview', () => {
    const context = getOverviewDiscussionContext(createState());

    expect(context.latestDiscussionHandoff?.handoff.id).toBe('discussion-handoff-latest-workflow');
    expect(context.activeMissionView?.mission.id).toBe('mission-current');
    expect(context.recentDiscussionCheckpoints[0]?.checkpoint.id).toBe('discussion-checkpoint-1');
  });

  it('only exposes mission discussion context when the handoff matches the mission', () => {
    const state = createState();

    expect(getMissionDiscussionContext(state, 'mission-current').latestDiscussionHandoff).toBeDefined();
    expect(getMissionDiscussionContext(state, 'mission-current').missionCheckpoints).toHaveLength(1);
    expect(getMissionDiscussionContext(state, 'mission-other').latestDiscussionHandoff).toBeUndefined();
    expect(getMissionDiscussionContext(state, 'mission-other').missionCheckpoints).toHaveLength(0);
  });
});
