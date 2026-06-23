import { describe, expect, it } from 'vitest';

import type { SkoposUiConsoleState } from '../contracts/skopos-ui-console-state.js';
import { getSkoposConsoleSearchContext } from '../platform/console-state/search-selectors.js';
import { buildSkoposConsoleSearchIndex } from '../support/search/console-search-index.js';

describe('getSkoposConsoleSearchContext', () => {
  it('ranks exact route matches ahead of supporting results', () => {
    const context = getSkoposConsoleSearchContext({
      state: createSearchState(),
      rawQuery: 'proof',
      currentPath: '/overview',
    });

    expect(context.flatResults[0]?.title).toBe('Proof');
    expect(context.flatResults[0]?.group).toBe('jump');
    expect(context.flatResults[0]?.kind).toBe('route');
  });

  it('supports structured decision filters on docs entries', () => {
    const context = getSkoposConsoleSearchContext({
      state: createSearchState(),
      rawQuery: 'kind:decision search dock',
      currentPath: '/overview',
    });

    expect(context.total).toBeGreaterThan(0);
    expect(context.flatResults[0]?.kind).toBe('decision');
    expect(context.flatResults[0]?.title).toContain('Search And Command Dock');
    expect(context.groups.every((group) => group.id === 'docs')).toBe(true);
  });

  it('keeps empty-query suggestions grouped and active-first', () => {
    const context = getSkoposConsoleSearchContext({
      state: createSearchState(),
      rawQuery: '',
      currentPath: '/overview',
    });

    expect(context.groups[0]?.id).toBe('jump');
    expect(context.groups[1]?.id).toBe('docs');
    expect(context.groups.some((group) => group.id === 'work')).toBe(true);
    expect(context.groups.find((group) => group.id === 'work')?.results[0]?.kind).toBe('program');
  });

  it('excludes historical docs from default search results', () => {
    const context = getSkoposConsoleSearchContext({
      state: createSearchState(),
      rawQuery: 'search dock',
      currentPath: '/overview',
    });

    expect(
      context.flatResults.some(
        (entry) => entry.id === 'doc-archive-old-search-dock-plan',
      ),
    ).toBe(false);
  });

  it('surfaces historical docs only when the query explicitly asks for archive history', () => {
    const context = getSkoposConsoleSearchContext({
      state: createSearchState(),
      rawQuery: 'archive search dock',
      currentPath: '/overview',
    });

    expect(
      context.flatResults.some(
        (entry) => entry.id === 'doc-archive-old-search-dock-plan',
      ),
    ).toBe(true);
  });

  it('surfaces program do-now entries and obligations in search results', () => {
    const context = getSkoposConsoleSearchContext({
      state: createSearchState(),
      rawQuery: 'kind:program do now',
      currentPath: '/overview',
    });

    expect(context.total).toBeGreaterThan(0);
    expect(context.flatResults[0]?.kind).toBe('program');
    expect(context.flatResults[0]?.title).toContain('Do Now');

    const obligationContext = getSkoposConsoleSearchContext({
      state: createSearchState(),
      rawQuery: 'kind:obligation trust',
      currentPath: '/overview',
    });

    expect(obligationContext.total).toBeGreaterThan(0);
    expect(obligationContext.flatResults[0]?.kind).toBe('obligation');
  });

  it('surfaces the latest discussion handoff in search results', () => {
    const context = getSkoposConsoleSearchContext({
      state: createSearchState(),
      rawQuery: 'kind:discussion handoff',
      currentPath: '/overview',
    });

    expect(context.total).toBeGreaterThan(0);
    expect(context.flatResults[0]?.kind).toBe('discussion');
    expect(context.flatResults[0]?.title).toContain('Discussion');
    expect(context.flatResults[0]?.href).toBe('#/discussion');
  });

  it('surfaces checkpoint history in discussion search results', () => {
    const context = getSkoposConsoleSearchContext({
      state: createSearchState(),
      rawQuery: 'kind:discussion checkpoint',
      currentPath: '/overview',
    });

    expect(context.total).toBeGreaterThan(0);
    expect(context.flatResults.some((entry) => entry.id === 'discussion-checkpoint-search-dock')).toBe(
      true,
    );
    expect(
      context.flatResults.some(
        (entry) => entry.id === 'discussion-checkpoint-search-dock' && entry.href === '#/discussion',
      ),
    ).toBe(true);
  });

  it('surfaces the discussion route for plain discussion queries', () => {
    const context = getSkoposConsoleSearchContext({
      state: createSearchState(),
      rawQuery: 'discussion',
      currentPath: '/overview',
    });

    expect(context.flatResults.some((entry) => entry.id === 'route--discussion')).toBe(true);
  });
});

const createSearchState = (): SkoposUiConsoleState => {
  const state = ({
    workspaceRoot: '/workspace',
    workspaceLabel: 'skopos',
    outputDirectory: '/workspace/docs/generated/skopos/app',
    generatedAt: '2026-04-11T10:00:00.000Z',
    trustReport: {
      trustLevel: 'high',
      readiness: 'agent-ready',
      summary: 'Trust high (agent-ready) with passing checks.',
      checks: [
        {
          id: 'instruction-mirrors',
          status: 'pass',
          summary: 'Instruction mirrors are in sync.',
        },
      ],
      unresolvedAssumptions: [],
      findings: [],
    },
    programState: {
      schemaVersion: 1,
      id: 'program-state',
      type: 'program-state',
      status: 'generated',
      authority: 'generated',
      summary: 'mission-search-dock remains do-now.',
      updatedAt: '2026-04-11T09:57:00.000Z',
      generatedAt: '2026-04-11T09:57:00.000Z',
      workspaceRoot: '/workspace',
      items: [
        {
          id: 'program-item.mission.mission-search-dock',
          title: 'Mission: Implement the routed search dock shell and compiled-state result surface',
          summary: 'Current do-now execution item.',
          sourceKind: 'mission',
          sourceRef: '.skopos/missions/mission-search-dock.json',
          scope: {
            id: '@skopos/ui',
            kind: 'package',
            title: '@skopos/ui',
            path: 'packages/ui',
          },
          status: 'active',
          priority: 'high',
          whyNow: 'Current claimed mission stays do-now.',
          dependencies: [],
          interruptsCurrentMission: false,
          recommendedDisposition: 'do-now',
          linkedPlanId: 'plan-search-dock',
          linkedMissionId: 'mission-search-dock',
          obligationIds: ['program-obligation.ui-trust'],
        },
      ],
      sequence: {
        currentActiveItemId: 'program-item.mission.mission-search-dock',
        doNow: 'program-item.mission.mission-search-dock',
        deferred: [],
        interruptRecommendation: {
          decision: 'continue-current',
          summary: 'Keep the active mission in focus.',
          reason: 'Nothing stronger interrupts it.',
        },
        openProgramQuestions: [],
      },
      obligations: [
        {
          id: 'program-obligation.ui-trust',
          kind: 'ui',
          title: 'Reflect program blockers in trust',
          reason: 'Trust should show program pressure and closure blockers.',
          targetRef: 'route:trust',
          linkedItemId: 'program-item.mission.mission-search-dock',
          status: 'open',
        },
      ],
      attention: {
        title: 'Continue current mission',
        summary: 'Keep the search dock mission active.',
        openItemCount: 1,
        openObligationCount: 1,
        interruptingItemCount: 0,
      },
      sourcesDigest: {
        activeFindingCount: 0,
        activeMissionCount: 1,
        promotedCheckpointCount: 0,
        workflowQuestionCount: 0,
        workflowRecommendationCount: 1,
        trustLevel: 'high',
        readiness: 'agent-ready',
      },
    },
    activity: {
      workspaceRoot: '/workspace',
      plans: [],
      missions: [],
      workflowRuns: [
        {
          id: 'run-build-ui',
          workflowId: 'ui.build-console-app',
          workflowTitle: 'Build routed Skopos console app',
          runStatus: 'succeeded',
          outputPaths: ['docs/generated/skopos/app'],
          runByActorId: 'agent-ui',
          finishedAt: '2026-04-11T09:59:00.000Z',
          artifactPath: '/workspace/.skopos/runs/run-build-ui.json',
        },
      ],
      operationalEvents: [
        {
          id: 'event-trust',
          eventKind: 'trust',
          status: 'succeeded',
          summary: 'Trust check completed with agent-ready readiness.',
          actorId: 'agent-ui',
          timestamp: '2026-04-11T09:58:00.000Z',
        },
      ],
    },
    graphs: {
      workspaceRoot: '/workspace',
      graphPaths: ['/workspace/.skopos/graph/workspace.json'],
      graphs: [
        {
          id: 'graph-workspace',
          kind: 'workspace',
          title: 'Workspace Graph',
          summary: 'Curated relationship view for the workspace.',
          focusId: 'workspace',
          focusLabel: 'skopos',
          artifactPath: '/workspace/.skopos/graph/workspace.json',
          nodeCount: 16,
          edgeCount: 22,
          highlights: [
            {
              id: 'scopes',
              title: 'Scopes',
              items: ['@skopos/ui', '@skopos/cli'],
            },
          ],
          nodes: [],
          edges: [],
        },
      ],
    },
    plans: [
      {
        artifactPath: '/workspace/.skopos/plans/plan-search-dock.json',
        plan: {
          id: 'plan-search-dock',
          title: 'Implement the routed search dock shell and compiled-state result surface',
          goal: 'implement the routed search dock shell and compiled-state result surface',
          summary: 'Plan for the bottom-center exact-first search dock.',
          updatedAt: '2026-04-11T09:55:00.000Z',
          scope: {
            query: '@skopos/ui',
            scope: {
              id: '@skopos/ui',
              kind: 'package',
              title: '@skopos/ui',
              path: 'packages/ui',
              aliases: ['ui', 'packages/ui'],
              summary: 'Local docs and trust UI for the Skopos SDK',
              confidence: 'high',
            },
          },
        },
      },
    ],
    missions: [
      {
        artifactPath: '/workspace/.skopos/missions/mission-search-dock.json',
        mission: {
          id: 'mission-search-dock',
          planId: 'plan-search-dock',
          state: 'active',
          title: 'Mission: Implement the routed search dock shell and compiled-state result surface',
          summary: 'Execution checklist for the search dock work.',
          objective: 'implement the routed search dock shell and compiled-state result surface',
          updatedAt: '2026-04-11T09:56:00.000Z',
          scope: {
            query: '@skopos/ui',
            scope: {
              id: '@skopos/ui',
              kind: 'package',
              title: '@skopos/ui',
              path: 'packages/ui',
              aliases: ['ui', 'packages/ui'],
              summary: 'Local docs and trust UI for the Skopos SDK',
              confidence: 'high',
            },
          },
          coordination: {
            claimedBy: {
              actorId: 'agent-ui',
              claimedAt: '2026-04-11T09:56:00.000Z',
            },
          },
        },
      },
    ],
    latestDiscussionHandoff: {
      artifactPath: '/workspace/.skopos/discussions/handoffs/latest-workflow.json',
      handoff: {
        schemaVersion: 1,
        id: 'discussion-handoff-latest-workflow',
        type: 'discussion-handoff',
        status: 'generated',
        authority: 'generated',
        summary: 'Latest workflow handoff.',
        updatedAt: '2026-04-11T09:58:30.000Z',
        generatedAt: '2026-04-11T09:58:30.000Z',
        workspaceRoot: '/workspace',
        handoffKind: 'workflow-resume',
        activeMissionId: 'mission-search-dock',
        currentDirection: 'Keep the current search-dock mission aligned with the latest accepted direction.',
        acceptedDecisions: [
          {
            id: 'plan.scope-confirmation',
            title: 'Scope Confirmation',
            resolvedOptionId: 'narrow-scope-first',
            resolvedOptionLabel: 'Narrow scope first',
          },
        ],
        openQuestions: [
          {
            id: 'question-ship-order',
            title: 'Should the search dock ship before the detail polish pass?',
            blocking: false,
            recommendedOptionId: 'yes',
          },
        ],
        recommendedNextCommand: 'skopos next /workspace --mission mission-search-dock',
        linkedCheckpointIds: ['discussion-checkpoint-search-dock'],
        linkedArtifactPaths: ['.skopos/questions.json'],
        resumeSummary: 'Resume the search-dock mission with the latest accepted direction and one open question.',
        estimatedTokens: 118,
        budgetTokens: 1200,
        overBudget: false,
      },
    },
    discussionCheckpoints: [
      {
        artifactPath:
          '/workspace/.skopos/discussions/checkpoints/discussion-checkpoint-search-dock.json',
        checkpoint: {
          schemaVersion: 1,
          id: 'discussion-checkpoint-search-dock',
          type: 'discussion-checkpoint',
          status: 'generated',
          authority: 'generated',
          summary: 'Search-dock checkpoint.',
          updatedAt: '2026-04-11T09:58:00.000Z',
          generatedAt: '2026-04-11T09:58:00.000Z',
          workspaceRoot: '/workspace',
          threadId: 'mission:mission-search-dock',
          checkpointKind: 'workflow-state',
          activeMissionId: 'mission-search-dock',
          linkedPlanId: 'plan-search-dock',
          currentDirection:
            'Keep the current search-dock mission aligned with the latest accepted direction.',
          acceptedDecisions: [
            {
              id: 'plan.scope-confirmation',
              title: 'Scope Confirmation',
              resolvedOptionId: 'narrow-scope-first',
              resolvedOptionLabel: 'Narrow scope first',
            },
          ],
          openQuestions: [
            {
              id: 'question-ship-order',
              title: 'Should the search dock ship before the detail polish pass?',
              blocking: false,
              recommendedOptionId: 'yes',
            },
          ],
          recommendedNextCommand: 'skopos next /workspace --mission mission-search-dock',
          linkedArtifactPaths: ['.skopos/questions.json'],
          resumeSummary:
            'Resume the search-dock mission with the latest accepted direction and one open question.',
          estimatedTokens: 118,
          budgetTokens: 900,
          overBudget: false,
        },
      },
    ],
    scopes: [
      {
        scope: {
          id: 'workspace',
          kind: 'workspace',
          title: 'Workspace',
          path: '.',
          aliases: ['root'],
          summary: 'Whole Skopos workspace.',
          confidence: 'high',
        },
        relatedPlanIds: ['plan-search-dock'],
        relatedMissionIds: ['mission-search-dock'],
        relatedPlanCount: 1,
        relatedMissionCount: 1,
      },
      {
        scope: {
          id: '@skopos/ui',
          kind: 'package',
          title: '@skopos/ui',
          path: 'packages/ui',
          aliases: ['ui', 'packages/ui'],
          summary: 'Local docs and trust UI for the Skopos SDK',
          confidence: 'high',
        },
        relatedPlanIds: ['plan-search-dock'],
        relatedMissionIds: ['mission-search-dock'],
        relatedPlanCount: 1,
        relatedMissionCount: 1,
      },
    ],
    docsLinks: [
      {
        id: 'graph-portal',
        title: 'Graph portal',
        href: '../graph-portal.html',
        displayPath: '/workspace/docs/generated/skopos/graph-portal.html',
        exists: true,
        kind: 'portal',
      },
    ],
    documents: [
      {
        id: 'docs-start',
        title: 'Skopos Start Here',
        kind: 'doc',
        format: 'markdown',
        href: '../../../00-start-here.md',
        displayPath: '/workspace/docs/00-start-here.md',
        exists: true,
        summary: 'Deterministic docs entrypoint.',
        excerpt: 'Read this first.',
        headings: ['Skopos Start Here'],
        sections: [],
        updatedAt: '2026-04-11T09:52:00.000Z',
      },
      {
        id: 'doc-project-system-ui-plan',
        title: 'System Ui Plan',
        kind: 'doc',
        format: 'markdown',
        href: '../../../project/system-ui-plan.md',
        displayPath: '/workspace/docs/project/system-ui-plan.md',
        exists: true,
        summary: 'Current UI architecture and search dock plan.',
        excerpt: 'Search dock rollout for the routed console.',
        headings: ['System UI Plan', 'Search surface'],
        sections: [],
        updatedAt: '2026-04-11T09:54:00.000Z',
      },
      {
        id: 'doc-decisions-017-system-ui-search-and-command-dock',
        title: '017 System Ui Search And Command Dock',
        kind: 'doc',
        format: 'markdown',
        href: '../../../decisions/017-system-ui-search-and-command-dock.md',
        displayPath: '/workspace/docs/decisions/017-system-ui-search-and-command-dock.md',
        exists: true,
        summary: 'Accepted search dock doctrine.',
        excerpt: 'Bottom-center fixed dock with exact-first retrieval.',
        headings: ['System UI Search And Command Dock'],
        sections: [],
        updatedAt: '2026-04-11T09:53:00.000Z',
      },
      {
        id: 'doc-archive-old-search-dock-plan',
        title: 'Archived Search Dock Plan',
        kind: 'doc',
        format: 'markdown',
        lifecycle: 'historical',
        href: '../../../archive/old-search-dock-plan.md',
        displayPath: '/workspace/docs/archive/old-search-dock-plan.md',
        exists: true,
        summary: 'Superseded search dock rollout notes.',
        excerpt: 'Historical search dock plan.',
        headings: ['Archived Search Dock Plan'],
        sections: [],
        updatedAt: '2026-04-10T09:53:00.000Z',
      },
    ],
    artifactCounts: {} as never,
  }) as SkoposUiConsoleState;

  state.searchIndex = buildSkoposConsoleSearchIndex(state);
  return state;
};
