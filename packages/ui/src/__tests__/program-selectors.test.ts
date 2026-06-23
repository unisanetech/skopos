import { describe, expect, it } from 'vitest';

import type { SkoposUiConsoleState } from '../contracts/skopos-ui-console-state.js';
import {
  getMissionProgramContext,
  getProgramOverviewContext,
  getTrustProgramContext,
} from '../platform/console-state/program-selectors.js';

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
    programState: {
      schemaVersion: 1,
      id: 'program-state',
      type: 'program-state',
      status: 'generated',
      authority: 'generated',
      summary: 'Mission remains do-now.',
      updatedAt: '2026-04-12T01:00:00.000Z',
      generatedAt: '2026-04-12T01:00:00.000Z',
      workspaceRoot: '/workspace',
      items: [
        {
          id: 'program-item.mission.current',
          title: 'Mission: Current UI adoption slice',
          summary: 'Reflect program state in overview and trust.',
          sourceKind: 'mission',
          sourceRef: '.skopos/missions/mission-current.json',
          scope: { id: '@skopos/ui', kind: 'package', title: '@skopos/ui', path: 'packages/ui' },
          status: 'active',
          priority: 'high',
          whyNow: 'Current claimed mission remains the do-now item.',
          dependencies: [],
          interruptsCurrentMission: false,
          recommendedDisposition: 'do-now',
          linkedMissionId: 'mission-current',
          linkedPlanId: 'plan-current',
          obligationIds: ['obligation-trust'],
        },
        {
          id: 'program-item.finding.next',
          title: 'Finding: Done closure noise',
          summary: 'Queued next after the UI slice closes.',
          sourceKind: 'finding',
          sourceRef: 'docs/findings/F-20260411-done-generated-output-closure-noise.md',
          scope: { id: 'workspace', kind: 'workspace', title: 'skopos', path: '.' },
          status: 'ready',
          priority: 'high',
          whyNow: 'Still open and queued next.',
          dependencies: [],
          interruptsCurrentMission: false,
          recommendedDisposition: 'do-next',
          obligationIds: [],
        },
      ],
      sequence: {
        currentActiveItemId: 'program-item.mission.current',
        doNow: 'program-item.mission.current',
        doNext: 'program-item.finding.next',
        deferred: [],
        interruptRecommendation: {
          decision: 'continue-current',
          summary: 'No stronger item interrupts the current mission.',
          reason: 'Keep the current mission active.',
        },
        openProgramQuestions: ['question-1'],
      },
      obligations: [
        {
          id: 'obligation-trust',
          kind: 'validation',
          title: 'Reflect program blockers in trust',
          reason: 'Trust should show program pressure.',
          targetRef: 'route:trust',
          linkedItemId: 'program-item.mission.current',
          status: 'open',
        },
      ],
      attention: {
        title: 'Current mission stays active',
        summary: 'No stronger blocker interrupts it.',
        openItemCount: 2,
        openObligationCount: 1,
        interruptingItemCount: 0,
      },
      recommendedAction: {
        kind: 'complete-current-mission',
        title: 'Complete the current mission',
        summary: 'Mission: Current UI adoption slice is ready for explicit mission completion.',
        command: 'skopos mission complete mission-current /workspace --actor agent-core',
        linkedItemId: 'program-item.mission.current',
      },
      sourcesDigest: {
        activeFindingCount: 1,
        activeMissionCount: 1,
        promotedCheckpointCount: 0,
        workflowQuestionCount: 1,
        workflowRecommendationCount: 1,
        trustLevel: 'high',
        readiness: 'agent-ready',
      },
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
    missions: [],
    scopes: [],
    docsLinks: [],
    documents: [],
    artifactCounts: {} as never,
  }) as SkoposUiConsoleState;

describe('program selectors', () => {
  it('derives overview context from program state', () => {
    const context = getProgramOverviewContext(createState());

    expect(context.doNowItem?.id).toBe('program-item.mission.current');
    expect(context.doNextItem?.id).toBe('program-item.finding.next');
    expect(context.currentItemObligations).toHaveLength(1);
    expect(context.openProgramQuestionCount).toBe(1);
    expect(context.recommendedAction?.kind).toBe('complete-current-mission');
  });

  it('maps mission detail context back to the linked program item', () => {
    const context = getMissionProgramContext(createState(), 'mission-current');

    expect(context.missionItem?.id).toBe('program-item.mission.current');
    expect(context.openObligations).toHaveLength(1);
    expect(context.doNextItem?.id).toBe('program-item.finding.next');
    expect(context.recommendedAction?.kind).toBe('complete-current-mission');
  });

  it('filters trust pressure to closure-relevant obligations', () => {
    const context = getTrustProgramContext(createState());

    expect(context.closureObligations).toHaveLength(1);
    expect(context.doNowItem?.id).toBe('program-item.mission.current');
    expect(context.doNextItem?.id).toBe('program-item.finding.next');
    expect(context.recommendedAction?.kind).toBe('complete-current-mission');
  });
});
