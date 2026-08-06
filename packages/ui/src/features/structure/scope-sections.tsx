import * as React from 'react';
import { Link } from '@tanstack/react-router';

import { Button } from '../../components/ui/button.js';
import type {
  SkoposUiConsoleDocumentView,
  SkoposUiConsolePlanView,
  SkoposUiConsoleScopeView,
  SkoposUiConsoleTaskView,
} from '../../contracts/skopos-ui-console-state.js';
import {
  ContentSection,
  getSkoposListRowClass,
  skoposListSurfaceClass,
} from '../../patterns/sections/content-primitives.js';
import {
  KeyValueList,
  SidebarCard,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import { toneForTaskState } from '../../support/ui/tone-helpers.js';

export function ScopesInspectorAside({
  scopeCount,
  projectScopeCount,
  workspaceCount,
  activeWorkCount,
}: {
  scopeCount: number;
  projectScopeCount: number;
  workspaceCount: number;
  activeWorkCount: number;
}): React.JSX.Element {
  return (
    <SidebarCard title="At a glance">
      <KeyValueList
        items={[
          { label: 'Declared areas', value: String(scopeCount) },
          ...(projectScopeCount > 0
            ? [{ label: 'Inside the project', value: String(projectScopeCount) }]
            : []),
          { label: 'Workspace roots', value: String(workspaceCount) },
          { label: 'Areas with active work', value: String(activeWorkCount) },
        ]}
      />
    </SidebarCard>
  );
}

export function ScopeListCard({
  scopes,
}: {
  scopes: SkoposUiConsoleScopeView[];
}): React.JSX.Element {
  const scopeById = new Map(scopes.map((scopeView) => [scopeView.scope.id, scopeView]));

  return (
    <ContentSection
      title="Project areas"
      description="Each area has a clear purpose, ownership boundary, and place in the project."
    >
      <div className={skoposListSurfaceClass}>
        {scopes.map((scopeView, index) => {
          const parent = scopeView.scope.parent
            ? scopeById.get(scopeView.scope.parent)?.scope
            : undefined;
          const activeWorkCount = scopeView.relatedTaskCount + scopeView.relatedPlanCount;

          return (
            <Link
              key={scopeView.scope.id}
              to="/scopes/$scopeId"
              params={{ scopeId: encodeURIComponent(scopeView.scope.id) }}
              className={getSkoposListRowClass({ bordered: index > 0 })}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill value={scopeView.scope.kind} tone="neutral" />
                    {activeWorkCount > 0 ? (
                      <StatusPill
                        value={`${activeWorkCount} active`}
                        tone="info"
                      />
                    ) : null}
                  </div>
                  <h2 className="mt-2 text-title-small">
                    {scopeView.scope.title}
                  </h2>
                  <p className="mt-1 max-w-3xl text-body-small text-on-surface-variant">
                    {scopeView.purpose}
                  </p>
                  <p className="mt-2.5 text-label-small text-on-surface-variant">
                    {parent ? `Part of ${parent.title}` : 'Project workspace'}
                    {scopeView.scope.dependsOn?.length
                      ? ` · ${scopeView.scope.dependsOn.length} dependenc${
                          scopeView.scope.dependsOn.length === 1 ? 'y' : 'ies'
                        }`
                      : ''}
                    {scopeView.dependentScopeIds.length
                      ? ` · Used by ${scopeView.dependentScopeIds.length} area${
                          scopeView.dependentScopeIds.length === 1 ? '' : 's'
                        }`
                      : ''}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </ContentSection>
  );
}

export function ScopeDetailInspectorAside({
  scopeView,
  parentScope,
  relatedDocuments,
}: {
  scopeView: SkoposUiConsoleScopeView;
  parentScope?: SkoposUiConsoleScopeView;
  relatedDocuments: SkoposUiConsoleDocumentView[];
}): React.JSX.Element {
  const currentWorkCount = scopeView.relatedTaskCount + scopeView.relatedPlanCount;
  const overviewDocument = relatedDocuments.find(
    (document) => document.id === scopeView.overviewDocumentId,
  );

  return (
    <>
      <SidebarCard title="At a glance">
        <KeyValueList
          layout="stacked"
          items={[
            {
              label: 'Owned by',
              value: scopeView.scope.owners?.join(', ') || 'No owner declared',
            },
            { label: 'Lives in', value: scopeView.scope.path, monospace: true },
            ...(parentScope
              ? [{ label: 'Part of', value: parentScope.scope.title }]
              : []),
            ...(scopeView.scope.aliases?.length
              ? [{ label: 'Public name', value: scopeView.scope.aliases.join(', '), monospace: true }]
              : []),
            {
              label: 'Current work',
              value:
                currentWorkCount > 0
                  ? `${currentWorkCount} active ${currentWorkCount === 1 ? 'item' : 'items'}`
                  : 'No active work',
            },
          ]}
        />
      </SidebarCard>

      {overviewDocument ? (
        <SidebarCard title="Start here">
          <p className="text-body-small text-on-surface-variant">
            Read the canonical Scope guide for the complete boundary and working rules.
          </p>
          <Button asChild variant="tonal" size="sm" className="mt-3 w-full">
            <Link to="/docs/$docId" params={{ docId: overviewDocument.id }}>
              Open Scope guide
            </Link>
          </Button>
        </SidebarCard>
      ) : null}

      {relatedDocuments.length > 1 ? (
        <SidebarCard title="Related knowledge" badge={String(relatedDocuments.length - 1)}>
          <ul className="grid gap-3">
            {relatedDocuments
              .filter((document) => document.id !== scopeView.overviewDocumentId)
              .slice(0, 5)
              .map((document) => (
                <li key={document.id}>
                  <Link
                    to="/docs/$docId"
                    params={{ docId: document.id }}
                    className="block rounded-sm transition-colors hover:text-primary focus-visible:outline-focus-ring focus-visible:outline-2"
                  >
                    <p className="text-body-small font-medium text-on-surface">
                      {document.title}
                    </p>
                    <p className="mt-0.5 text-label-small text-on-surface-variant">
                      {document.role ?? 'document'}
                    </p>
                  </Link>
                </li>
              ))}
          </ul>
        </SidebarCard>
      ) : null}
    </>
  );
}

export function ScopeOrientationCard({
  scopeView,
}: {
  scopeView: SkoposUiConsoleScopeView;
}): React.JSX.Element {
  const codeRoots = scopeView.scope.codeRoots ?? [scopeView.scope.path];

  return (
    <ContentSection
      title="How this area works"
      description="The responsibilities and working rules recorded in this area's canonical Scope guide."
    >
      {scopeView.orientationSections.length > 0 ? (
        <div className="grid gap-6">
          {scopeView.orientationSections.map((section) => (
            <section key={section.title}>
              <h3 className="text-title-medium text-on-surface">
                {section.title}
              </h3>
              <ul className="mt-2.5 grid list-disc gap-2 pl-5 text-body-small text-on-surface">
                {section.items.map((item) => (
                  <li key={item} className="pl-1 leading-6">
                    <ScopeItemContent item={item} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-body-small leading-6 text-on-surface">
          This {scopeView.scope.kind} owns work under {codeRoots.join(', ')}. Its declared
          Scope boundary is available even though a detailed overview has not been written yet.
        </p>
      )}
    </ContentSection>
  );
}

function ScopeItemContent({ item }: { item: string }): React.JSX.Element {
  const inlineCode = /^`([^`]+)`$/.exec(item);

  return inlineCode ? (
    <code className="skopos-markdown-inline-code">{inlineCode[1]}</code>
  ) : (
    <>{item}</>
  );
}

export function ScopeConnectionsCard({
  scopeView,
  dependencies,
  dependents,
}: {
  scopeView: SkoposUiConsoleScopeView;
  dependencies: SkoposUiConsoleScopeView[];
  dependents: SkoposUiConsoleScopeView[];
}): React.JSX.Element {
  return (
    <ContentSection
      title="How it connects"
      description="Declared dependencies show what this area uses and which other areas rely on it."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <ScopeConnectionList
          title="Uses"
          scopes={dependencies}
          emptyText={`${scopeView.scope.title} has no declared dependencies.`}
        />
        <ScopeConnectionList
          title="Used by"
          scopes={dependents}
          emptyText={`No other declared area currently depends on ${scopeView.scope.title}.`}
        />
      </div>
    </ContentSection>
  );
}

function ScopeConnectionList({
  title,
  scopes,
  emptyText,
}: {
  title: string;
  scopes: SkoposUiConsoleScopeView[];
  emptyText: string;
}): React.JSX.Element {
  return (
    <section>
      <h3 className="text-title-medium text-on-surface">{title}</h3>
      {scopes.length > 0 ? (
        <ul className="mt-2.5 grid gap-2">
          {scopes.map((scopeView) => (
            <li key={scopeView.scope.id}>
              <Link
                to="/scopes/$scopeId"
                params={{ scopeId: encodeURIComponent(scopeView.scope.id) }}
                className="block rounded-sm bg-surface-container-low px-3.5 py-3 transition-colors hover:bg-state-hover focus-visible:outline-focus-ring focus-visible:outline-2"
              >
                <p className="text-body-small font-medium text-on-surface">
                  {scopeView.scope.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-label-small text-on-surface-variant">
                  {scopeView.purpose}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2.5 text-body-small leading-6 text-on-surface-variant">
          {emptyText}
        </p>
      )}
    </section>
  );
}

export function ScopeCurrentWorkCard({
  plans,
  tasks,
}: {
  plans: SkoposUiConsolePlanView[];
  tasks: SkoposUiConsoleTaskView[];
}): React.JSX.Element {
  return (
    <ContentSection
      title="Current work"
      description="Plans and tasks currently tied to this project area."
    >
      {plans.length > 0 || tasks.length > 0 ? (
        <div className={skoposListSurfaceClass}>
          {plans.map((planView, index) => (
            <Link
              key={planView.plan.id}
              to="/plans/$planId"
              params={{ planId: planView.plan.id }}
              className={getSkoposListRowClass({ bordered: index > 0 })}
            >
              <StatusPill value="plan" tone="neutral" />
              <p className="mt-2 text-body-medium font-medium">{planView.plan.title}</p>
              <p className="mt-1 text-body-small text-on-surface-variant">
                {planView.plan.summary}
              </p>
            </Link>
          ))}
          {tasks.map((taskView, index) => (
            <Link
              key={taskView.task.id}
              to="/tasks/$taskId"
              params={{ taskId: taskView.task.id }}
              className={getSkoposListRowClass({ bordered: plans.length > 0 || index > 0 })}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusPill value="task" tone="neutral" />
                <StatusPill
                  value={taskView.task.state}
                  tone={toneForTaskState(taskView.task.state)}
                />
              </div>
              <p className="mt-2 text-body-medium font-medium">{taskView.task.title}</p>
              <p className="mt-1 text-body-small text-on-surface-variant">
                {taskView.task.summary}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-body-small leading-6 text-on-surface-variant">
          No active work is currently tied to this area.
        </p>
      )}
    </ContentSection>
  );
}
