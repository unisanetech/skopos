import * as React from 'react';

import {
  ScopeDetailInspectorAside,
  ScopeConnectionsCard,
  ScopeCurrentWorkCard,
  ScopeOrientationCard,
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
  const projectScopes = state.scopes.filter((scope) => scope.scope.kind !== 'workspace');
  const workspaceScopes = state.scopes.filter((scope) => scope.scope.kind === 'workspace');

  return (
    <ListPage
      title="How the project fits together"
      description="Explore each area's purpose, ownership, dependencies, knowledge, and current work."
      aside={
        <ScopesInspectorAside
          scopeCount={state.scopes.length}
          projectScopeCount={projectScopes.length}
          workspaceCount={workspaceScopes.length}
          activeWorkCount={state.scopes.filter((scope) => scope.relatedTaskCount > 0).length}
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
  const relatedTasks = state.tasks.filter((task) =>
    scopeView.relatedTaskIds.includes(task.task.id),
  );
  const parentScope = scopeView.scope.parent
    ? state.scopes.find((scope) => scope.scope.id === scopeView.scope.parent)
    : undefined;
  const dependencies = state.scopes.filter((scope) =>
    scopeView.scope.dependsOn?.includes(scope.scope.id),
  );
  const dependents = state.scopes.filter((scope) =>
    scopeView.dependentScopeIds.includes(scope.scope.id),
  );
  const relatedDocuments = state.documents.filter((document) =>
    scopeView.relatedDocumentIds.includes(document.id),
  );

  return (
    <DetailPage
      title={scopeView.scope.title}
      description={scopeView.purpose}
      badges={[
        <StatusPill key="kind" value={scopeView.scope.kind} tone="neutral" />,
      ]}
      aside={
        <ScopeDetailInspectorAside
          scopeView={scopeView}
          parentScope={parentScope}
          relatedDocuments={relatedDocuments}
        />
      }
    >
      <PageSectionStack>
        <ScopeOrientationCard scopeView={scopeView} />
        <ScopeConnectionsCard
          scopeView={scopeView}
          dependencies={dependencies}
          dependents={dependents}
        />
        <ScopeCurrentWorkCard plans={relatedPlans} tasks={relatedTasks} />
      </PageSectionStack>
    </DetailPage>
  );
}
