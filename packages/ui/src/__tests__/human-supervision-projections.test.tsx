import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';
import type { SkoposScopesLiteArtifact } from '@skopos/model';

import { buildScopeViews } from '../application/build-console-state/build-console-state.service.js';
import type {
  SkoposUiConsoleDocumentView,
  SkoposUiConsolePlanView,
  SkoposUiConsoleState,
  SkoposUiConsoleTaskView,
} from '../contracts/skopos-ui-console-state.js';
import { KnowledgeDecisionSummaryCard } from '../features/knowledge/documents/reader.js';
import { PlanDetailGuidanceCard } from '../features/knowledge/plans/detail.js';
import { ActivityTimelineCard } from '../features/validation/activity-sections.js';
import { getOverviewDiscussionContext } from '../platform/console-state/discussion-selectors.js';

describe('human supervision projections', () => {
  it('turns a plan into direction, progress, and a next milestone', () => {
    const planView = {
      plan: {
        goal: 'Make project supervision understandable at first reading.',
        summary: 'Replace record-shaped pages with human project briefings.',
        implementationSteps: [{ id: 'shape', title: 'Reshape the weak pages', detail: 'Lead with meaning.' }],
        nextSteps: [],
        decisionQuestions: [],
        risks: [],
      },
    } as SkoposUiConsolePlanView;
    const relatedTask = {
      task: {
        steps: [
          { id: 'audit', title: 'Audit the pages', detail: '', kind: 'implementation', status: 'complete' },
          { id: 'reshape', title: 'Reshape the weak pages', detail: '', kind: 'implementation', status: 'in-progress' },
        ],
      },
    } as SkoposUiConsoleTaskView;

    const markup = renderToStaticMarkup(
      <PlanDetailGuidanceCard planView={planView} relatedTask={relatedTask} />,
    );

    expect(markup).toContain('Current direction');
    expect(markup).toContain('1 of 2 linked Task steps are complete.');
    expect(markup).toContain('Next milestone');
    expect(markup).toContain('Reshape the weak pages');
    expect(markup).not.toContain('How to read this plan');
  });

  it('summarizes an accepted decision before exposing the full source', () => {
    const document = {
      id: 'D-1',
      displayPath: 'docs/decisions/D-1.md',
      sections: [
        { id: 'context', title: 'Context', body: 'The old view exposed storage shape.', level: 2, kind: 'narrative' },
        { id: 'direction', title: 'Lead with human intent', body: 'Show meaning before metadata.', level: 3, kind: 'narrative' },
        { id: 'consequences', title: 'Consequences', body: 'Raw details become supporting evidence.', level: 2, kind: 'narrative' },
      ],
    } as SkoposUiConsoleDocumentView;

    const markup = renderToStaticMarkup(
      <KnowledgeDecisionSummaryCard document={document} documents={[document]} />,
    );

    expect(markup).toContain('Decision at a glance');
    expect(markup).toContain('Accepted direction');
    expect(markup).toContain('Lead with human intent');
    expect(markup).toContain('Why this was needed');
    expect(markup).toContain('What this changes');
  });

  it('keeps low-level system events behind supporting disclosure', () => {
    const markup = renderToStaticMarkup(
      <ActivityTimelineCard
        feedGroups={[
          {
            id: 'today',
            label: 'Today',
            entries: [
              {
                id: 'task',
                feedKind: 'task',
                kindLabel: 'Task',
                headline: 'Improve the supervision pages',
                summary: '2 pending items',
                timestamp: '2026-08-04T08:00:00.000Z',
              },
              {
                id: 'event',
                feedKind: 'event',
                kindLabel: 'Task started',
                headline: 'Task lifecycle event recorded',
                actorId: 'agent-internal-id',
                timestamp: '2026-08-04T07:59:00.000Z',
              },
            ],
          },
        ]}
      />,
    );

    expect(markup).toContain('Project story');
    expect(markup).toContain('1 supporting system event');
    expect(markup).toContain('Technical details');
    expect(markup).not.toContain('Grouped events from work sessions');
  });

  it('builds Scope orientation from canonical Scope and Memory data', () => {
    const scopesArtifact = {
      scopes: [
        {
          id: 'workspace',
          title: 'Workspace',
          kind: 'workspace',
          path: '.',
          aliases: ['@example/workspace'],
          summary: 'Generated workspace summary.',
          confidence: 'high',
          codeRoots: ['.'],
          dependsOn: [],
          owners: ['maintainers'],
        },
        {
          id: 'delivery-tool',
          title: 'Delivery tool',
          kind: 'tool',
          path: 'tools/delivery',
          aliases: ['@example/delivery'],
          summary: 'Generated tool summary.',
          confidence: 'high',
          parent: 'workspace',
          codeRoots: ['tools/delivery'],
          dependsOn: ['workspace'],
          owners: ['delivery-team'],
        },
      ],
    } as SkoposScopesLiteArtifact;
    const documents = [
      {
        id: 'DELIVERY-OVERVIEW',
        title: 'Delivery tool',
        kind: 'doc',
        format: 'markdown',
        lifecycle: 'durable',
        role: 'overview',
        authority: 'canonical',
        scope: 'delivery-tool',
        href: '/docs/delivery',
        displayPath: 'docs/scopes/delivery-tool/overview.md',
        exists: true,
        summary: 'The delivery tool turns approved releases into provider operations.',
        excerpt: 'The delivery tool turns approved releases into provider operations.',
        headings: ['Scope: Delivery tool', 'Primary commands', 'Rules', 'Changelog'],
        sections: [
          {
            id: 'scope',
            title: 'Scope: Delivery tool',
            body: 'The delivery tool turns approved releases into provider operations.',
            level: 1,
            kind: 'narrative',
          },
          {
            id: 'commands',
            title: 'Primary commands',
            body: '1. `delivery plan`\n2. `delivery apply`',
            level: 2,
            kind: 'narrative',
          },
          {
            id: 'rules',
            title: 'Rules',
            body: '1. require approval before provider writes\n2. retain provider receipts',
            level: 2,
            kind: 'narrative',
          },
          {
            id: 'changelog',
            title: 'Changelog',
            body: 'Historical note.',
            level: 2,
            kind: 'changelog',
          },
        ],
      },
      {
        id: 'DELIVERY-ARCHITECTURE',
        title: 'Delivery architecture',
        kind: 'doc',
        format: 'markdown',
        lifecycle: 'durable',
        role: 'architecture',
        authority: 'canonical',
        scope: 'delivery-tool',
        href: '/docs/delivery-architecture',
        displayPath: 'docs/scopes/delivery-tool/architecture/00-architecture.md',
        exists: true,
        summary: 'Delivery architecture.',
        excerpt: 'Delivery architecture.',
        headings: [],
        sections: [],
      },
    ] satisfies SkoposUiConsoleDocumentView[];

    const views = buildScopeViews(scopesArtifact, [], [], documents);
    const workspace = views.find((view) => view.scope.id === 'workspace');
    const delivery = views.find((view) => view.scope.id === 'delivery-tool');

    expect(delivery?.purpose).toBe(
      'The delivery tool turns approved releases into provider operations.',
    );
    expect(delivery?.orientationSections).toEqual([
      {
        title: 'Primary commands',
        items: ['`delivery plan`', '`delivery apply`'],
      },
      {
        title: 'Rules',
        items: [
          'require approval before provider writes',
          'retain provider receipts',
        ],
      },
    ]);
    expect(delivery?.relatedDocumentIds).toEqual([
      'DELIVERY-OVERVIEW',
      'DELIVERY-ARCHITECTURE',
    ]);
    expect(workspace?.dependentScopeIds).toEqual(['delivery-tool']);
  });

  it('keeps unrelated discussion history off the Now page', () => {
    const state = {
      sessionContext: { currentTaskId: 'T-current' },
      tasks: [
        { task: { id: 'T-current' } },
        { task: { id: 'T-old' } },
      ],
      latestDiscussionHandoff: {
        handoff: { activeTaskId: 'T-old' },
      },
      discussionCheckpoints: [
        { checkpoint: { id: 'old', activeTaskId: 'T-old' } },
        { checkpoint: { id: 'current', activeTaskId: 'T-current' } },
        { checkpoint: { id: 'unbound' } },
      ],
    } as SkoposUiConsoleState;

    const context = getOverviewDiscussionContext(state);

    expect(context.latestDiscussionHandoff).toBeUndefined();
    expect(context.activeTaskView?.task.id).toBe('T-current');
    expect(context.recentDiscussionCheckpoints.map((item) => item.checkpoint.id)).toEqual([
      'current',
    ]);
  });
});
