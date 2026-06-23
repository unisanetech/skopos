import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type {
  SkoposUiConsoleMissionView,
  SkoposUiConsolePlanView,
  SkoposUiConsoleScopeView,
} from '../../contracts/skopos-ui-console-state.js';
import {
  Card,
  getSkoposListRowClass,
  skoposListSurfaceClass,
} from '../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  KeyValueList,
  SidebarCard,
  SidebarList,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import { cn } from '../../support/ui/classnames.js';
import { toneForMissionState } from '../../support/ui/tone-helpers.js';

export function ScopesInspectorAside({
  scopeCount,
  packageCount,
  docsRootCount,
  activeWorkCount,
}: {
  scopeCount: number;
  packageCount: number;
  docsRootCount: number;
  activeWorkCount: number;
}): React.JSX.Element {
  return (
    <SidebarCard title="At a glance">
      <KeyValueList
        items={[
          { label: 'Workspace scopes', value: String(scopeCount) },
          ...(packageCount > 0 ? [{ label: 'Package scopes', value: String(packageCount) }] : []),
          { label: 'Docs roots', value: String(docsRootCount) },
          { label: 'Active work', value: String(activeWorkCount) },
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
  return (
    <Card
      title="Scope list"
      description="Workspace scopes and the current work attached to them."
    >
      <div className={skoposListSurfaceClass}>
        {scopes.map((scopeView, index) => (
          <Link
            key={scopeView.scope.id}
            to="/scopes/$scopeId"
            params={{ scopeId: encodeURIComponent(scopeView.scope.id) }}
            className={getSkoposListRowClass({ bordered: index > 0 })}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill value={scopeView.scope.kind} tone="neutral" />
                <StatusPill
                  value={scopeView.scope.confidence}
                  tone={scopeView.scope.confidence === 'high' ? 'positive' : 'warning'}
                />
              </div>
              <h2 className="mt-2 text-[14px] font-semibold tracking-[-0.03em]">
                {scopeView.scope.title}
              </h2>
              <p className="mt-1 text-[12.75px] leading-[1.5rem] text-[var(--muted)]">
                {scopeView.scope.summary}
              </p>
              <p className="mt-2.5 text-[12.25px] leading-[1.45rem] text-[var(--muted)]">
                {scopeView.relatedMissionCount > 0 || scopeView.relatedPlanCount > 0
                  ? [
                      scopeView.relatedMissionCount > 0
                        ? `${scopeView.relatedMissionCount} mission${
                            scopeView.relatedMissionCount === 1 ? '' : 's'
                          }`
                        : null,
                      scopeView.relatedPlanCount > 0
                        ? `${scopeView.relatedPlanCount} plan${
                            scopeView.relatedPlanCount === 1 ? '' : 's'
                          }`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')
                  : 'No current work'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export function ScopeDetailInspectorAside({
  scopeView,
  relatedMissions,
  relatedPlans,
  relatedGraphs,
}: {
  scopeView: SkoposUiConsoleScopeView;
  relatedMissions: SkoposUiConsoleMissionView[];
  relatedPlans: SkoposUiConsolePlanView[];
  relatedGraphs: Array<{ id: string; title: string }>;
}): React.JSX.Element {
  return (
    <>
      <SidebarCard title="At a glance">
        <KeyValueList
          items={[
            { label: 'Kind', value: scopeView.scope.kind },
            { label: 'Confidence', value: scopeView.scope.confidence },
            {
              label: 'Current work',
              value:
                relatedMissions.length > 0 || relatedPlans.length > 0
                  ? [
                      relatedMissions.length > 0
                        ? `${relatedMissions.length} mission${relatedMissions.length === 1 ? '' : 's'}`
                        : null,
                      relatedPlans.length > 0
                        ? `${relatedPlans.length} plan${relatedPlans.length === 1 ? '' : 's'}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')
                  : 'No active plans or missions',
            },
          ]}
        />
      </SidebarCard>
      {relatedGraphs.length > 0 ? (
        <SidebarCard
          title="Related graphs"
          badge={String(relatedGraphs.length)}
          collapsible
          defaultOpen={false}
        >
          <SidebarList
            items={relatedGraphs.slice(0, 4)}
            totalCount={relatedGraphs.length}
            previewNoun="graphs"
            getKey={(graph) => graph.id}
            renderItem={(graph) => (
              <p className="text-[13px] leading-6 text-[var(--muted-strong)]">{graph.title}</p>
            )}
            emptyTitle="No related graphs"
            emptyDescription="This scope does not currently map to graph views."
          />
        </SidebarCard>
      ) : null}
    </>
  );
}

export function ScopeFrameCard({
  scopeView,
  relatedMissionCount,
  relatedPlanCount,
}: {
  scopeView: SkoposUiConsoleScopeView;
  relatedMissionCount: number;
  relatedPlanCount: number;
}): React.JSX.Element {
  return (
    <Card
      title="Responsibility"
      description="Explain what this scope owns before the route dives into linked work."
    >
      <div className="border-y border-[var(--line)]">
        <section className="py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Summary
          </p>
          <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted-strong)]">
            {scopeView.scope.summary}
          </p>
        </section>
        <section className="border-t border-[var(--line)] py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Active work
          </p>
          <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted-strong)]">
            {relatedMissionCount > 0 || relatedPlanCount > 0
              ? [
                  relatedMissionCount > 0
                    ? `${relatedMissionCount} mission${relatedMissionCount === 1 ? '' : 's'} currently map back to this scope`
                    : null,
                  relatedPlanCount > 0
                    ? `${relatedPlanCount} plan${relatedPlanCount === 1 ? '' : 's'} stay tied to this scope`
                    : null,
                ]
                  .filter(Boolean)
                  .join(', ') + '.'
              : 'No active mission or plan is currently scoped to this surface.'}
          </p>
        </section>
      </div>
    </Card>
  );
}

export function ScopeCurrentWorkCard({
  plans,
  missions,
}: {
  plans: SkoposUiConsolePlanView[];
  missions: SkoposUiConsoleMissionView[];
}): React.JSX.Element {
  return (
    <Card
      title="Current work"
      description="Plans and missions currently tied to this scope."
    >
      {plans.length > 0 || missions.length > 0 ? (
        <div className="border-y border-[var(--line)]">
          <section className="py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Plans
            </p>
            {plans.length > 0 ? (
              <div className="mt-2.5 grid gap-0">
                {plans.map((planView, index) => (
                  <Link
                    key={planView.plan.id}
                    to="/plans/$planId"
                    params={{ planId: planView.plan.id }}
                    className={cn(
                      'block py-3 transition-colors hover:bg-[color:rgba(255,252,246,0.4)]',
                      index > 0 ? 'border-t border-[var(--line)]' : undefined,
                    )}
                  >
                    <p className="text-[13px] font-medium tracking-[-0.01em]">
                      {planView.plan.title}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
                      {planView.plan.summary}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-2.5 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
                No plans are currently scoped to this surface.
              </p>
            )}
          </section>
          <section className="border-t border-[var(--line)] py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Missions
            </p>
            {missions.length > 0 ? (
              <div className="mt-2.5 grid gap-0">
                {missions.map((missionView, index) => (
                  <Link
                    key={missionView.mission.id}
                    to="/missions/$missionId"
                    params={{ missionId: missionView.mission.id }}
                    className={cn(
                      'block py-3 transition-colors hover:bg-[color:rgba(255,252,246,0.4)]',
                      index > 0 ? 'border-t border-[var(--line)]' : undefined,
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[13px] font-medium tracking-[-0.01em]">
                        {missionView.mission.title}
                      </p>
                      <StatusPill
                        value={missionView.mission.state}
                        tone={toneForMissionState(missionView.mission.state)}
                      />
                    </div>
                    <p className="mt-1 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
                      {missionView.mission.summary}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-2.5 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
                No missions are currently scoped to this surface.
              </p>
            )}
          </section>
        </div>
      ) : (
        <EmptyMessage
          title="No related work"
          description="No plans or missions are currently scoped to this surface."
        />
      )}
    </Card>
  );
}
