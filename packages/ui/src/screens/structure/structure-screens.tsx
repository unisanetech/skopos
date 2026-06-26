import * as React from 'react';

import {
  ScopeDetailInspectorAside,
  ScopeCurrentWorkCard,
  ScopeFrameCard,
  ScopeListCard,
  ScopesInspectorAside,
} from '../../features/structure/scope-sections.js';
import { DetailPage } from '../../patterns/pages/detail-page.js';
import { ListPage } from '../../patterns/pages/list-page.js';
import { PageSectionStack } from '../../patterns/pages/shared.js';
import { EmptyMessage, StatusPill } from '../../patterns/sections/inspector-primitives.js';
import { requireConsoleState } from '../../platform/console-state/access.js';

export function ScopesView(): React.JSX.Element {
  const state = requireConsoleState();
  const packageScopes = state.scopes.filter((scope) => scope.scope.kind === 'package');
  const docsScopes = state.scopes.filter((scope) => scope.scope.kind === 'docs-root');

  return (
    <ListPage
      kicker="Project map"
      title="Project areas"
      description="Packages, docs roots, and instruction files Skopos understands."
      aside={
        <ScopesInspectorAside
          scopeCount={state.scopes.length}
          packageCount={packageScopes.length}
          docsRootCount={docsScopes.length}
          activeWorkCount={state.scopes.filter((scope) => scope.relatedMissionCount > 0).length}
        />
      }
    >
      <ScopeListCard scopes={state.scopes} />
    </ListPage>
  );
}

export function ScopeDetailView({
  scopeId,
}: {
  scopeId: string;
}): React.JSX.Element {
  const state = requireConsoleState();
  const decodedScopeId = decodeURIComponent(scopeId);
  const scopeView = state.scopes.find((scope) => scope.scope.id === decodedScopeId);

  if (!scopeView) {
    return (
      <DetailPage
        kicker="Project map"
        title="Project area not found"
        description="The requested project area is not present in this snapshot."
      >
        <EmptyMessage
          title="Unknown project area"
          description="Refresh the app after rebuilding Skopos state if the project map changed."
        />
      </DetailPage>
    );
  }

  const relatedPlans = state.plans.filter((plan) => scopeView.relatedPlanIds.includes(plan.plan.id));
  const relatedMissions = state.missions.filter((mission) =>
    scopeView.relatedMissionIds.includes(mission.mission.id),
  );
  const relatedGraphs = state.graphs.graphs.filter(
    (graph) =>
      graph.focusId === scopeView.scope.id ||
      graph.nodes.some(
        (node) =>
          node.id === scopeView.scope.id ||
          node.path === scopeView.scope.path ||
          node.label === scopeView.scope.title,
      ),
  );

  return (
    <DetailPage
      kicker="Project area"
      title={scopeView.scope.title}
      description={scopeView.scope.summary}
      badges={[
        <StatusPill key="kind" value={scopeView.scope.kind} tone="neutral" />,
        <StatusPill
          key="confidence"
          value={scopeView.scope.confidence}
          tone={scopeView.scope.confidence === 'high' ? 'positive' : 'warning'}
        />,
      ]}
      aside={
        <ScopeDetailInspectorAside
          scopeView={scopeView}
          relatedMissions={relatedMissions}
          relatedPlans={relatedPlans}
          relatedGraphs={relatedGraphs}
        />
      }
    >
      <PageSectionStack>
        <ScopeFrameCard
          scopeView={scopeView}
          relatedMissionCount={relatedMissions.length}
          relatedPlanCount={relatedPlans.length}
        />
        <ScopeCurrentWorkCard plans={relatedPlans} missions={relatedMissions} />
      </PageSectionStack>
    </DetailPage>
  );
}
