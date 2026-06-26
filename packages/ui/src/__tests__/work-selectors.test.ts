import { describe, expect, it } from 'vitest';

import type { SkoposUiConsoleState } from '../contracts/skopos-ui-console-state.js';
import { buildMissionGuidanceContext } from '../platform/console-state/work-selectors.js';

describe('work selectors', () => {
  it('derives human mission guidance from mission and workflow question state', () => {
    const missionView = {
      artifactPath: '/workspace/.skopos/missions/mission-ui.json',
      mission: {
        id: 'mission-ui',
        planId: 'plan-ui',
        workspaceRoot: '/workspace',
        type: 'mission',
        schemaVersion: 1,
        generatedAt: '2026-06-24T00:00:00.000Z',
        updatedAt: '2026-06-24T00:00:00.000Z',
        state: 'active',
        title: 'Improve mission UI guidance',
        summary: 'Make mission state easier to understand.',
        objective: 'Add a clear current guidance card.',
        scope: {
          scope: {
            id: '@skopos/ui',
            title: '@skopos/ui',
            kind: 'package',
            path: 'packages/ui',
          },
          confidence: 'high',
          reason: 'UI package owns routed mission detail.',
          references: [],
        },
        items: [
          {
            id: 'decision-ui-copy',
            kind: 'decision',
            title: 'Confirm UI copy',
            detail: 'Choose the readable wording before changing route chrome.',
            status: 'pending',
          },
          {
            id: 'implementation-card',
            kind: 'implementation',
            title: 'Add guidance card',
            detail: 'Show progress and next action.',
            status: 'complete',
          },
          {
            id: 'validation-ui',
            kind: 'validation',
            title: 'Run UI checks',
            detail: 'Verify typecheck and selector output.',
            status: 'pending',
          },
        ],
        recommendedChecks: ['pnpm --filter @skopos/ui check-types'],
        recommendedWorkflowIds: ['ui.verify-guidance'],
        decisionQuestionIds: ['plan.ui-copy'],
        linkedSlices: [{ missionId: 'mission-child' }],
        coordination: {
          lastUpdatedAt: '2026-06-24T00:00:00.000Z',
          lastUpdatedBy: 'agent-ui',
        },
      },
    } as SkoposUiConsoleState['missions'][number];

    const state = {
      trustReport: {
        findings: ['F-ui-guidance'],
      },
      workflowQuestions: {
        kind: 'questions',
        schemaVersion: 1,
        generatedAt: '2026-06-24T00:00:00.000Z',
        workspaceRoot: '/workspace',
        generatedForMissionId: 'mission-ui',
        entries: [
          {
            id: 'plan.ui-copy',
            title: 'Confirm UI copy',
            question: 'Should mission detail show a guidance card first?',
            category: 'ui',
            escalation: 'recommend-and-ask',
            blocking: true,
            recommendedOptionId: 'show-guidance',
            resolvedOptionId: undefined,
            options: [
              {
                id: 'show-guidance',
                label: 'Show guidance first',
                rationale: 'This makes the route easier to understand before raw details.',
              },
            ],
            whyItMatters: 'Mission detail is the main execution surface for users.',
            whatHappensAfterAnswer: 'The agent can continue with the selected UI direction.',
            linkedPlanId: 'plan-ui',
            linkedMissionId: 'mission-ui',
            evidenceRefs: [],
            status: 'open',
          },
        ],
      },
    } as SkoposUiConsoleState;

    expect(buildMissionGuidanceContext(state, missionView)).toMatchObject({
      completedCount: 1,
      totalCount: 3,
      percentComplete: 33,
      phase: 'blocked',
      doingNowText: 'Should mission detail show a guidance card first?',
      decisionText: '1 of 1 decision still needs attention.',
      findingText: '1 finding visible in trust. 1 linked follow-up slice.',
      blockerText: '1 open question needs an answer before implementation is fully safe.',
      proofText: 'Run or review 1 required workflow before closure.',
      openQuestions: [
        expect.objectContaining({
          id: 'plan.ui-copy',
          recommendedOptionId: 'show-guidance',
        }),
      ],
    });
  });
});
