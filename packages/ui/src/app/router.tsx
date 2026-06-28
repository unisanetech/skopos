import * as React from 'react';
import {
  Link,
  Outlet,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useRouterState,
} from '@tanstack/react-router';

import {
  EmptyMessage,
  StatusPill,
} from '../patterns/sections/inspector-primitives.js';
import { SkoposConsoleChromeProvider } from '../patterns/shells/console-chrome.js';
import {
  SearchDock,
  getSkoposSearchShortcutLabel,
} from '../patterns/shells/search-dock.js';
import { toneForReadiness, toneForTrust } from '../support/ui/tone-helpers.js';
import { SKOPOS_APP_SHELL_GRID_CLASS } from './layout-tokens.js';
import {
  navSections,
  normalizeKnowledgeListView,
  normalizeMissionListView,
  normalizePlanListView,
  resolveRouteMeta,
  type KnowledgeListView,
  type MissionListView,
  type PlanListView,
  type RouteMeta,
} from './routing/route-config.js';
import {
  ExecutionDiscussionView,
  ExecutionMissionDetailView,
  ExecutionMissionsView,
  ExecutionOverviewView,
} from '../screens/work/execution-screens.js';
import {
  DecisionDetailView,
  DecisionsView,
  DocsDetailView,
  DocsView,
  FindingDetailView,
  FindingsView,
  MemoryView,
  PlanDetailView,
  PlansView,
} from '../screens/knowledge/knowledge-screens.js';
import { ActivityView, PackDetailView, ProofView, RulesView, TrustView } from '../screens/validation/review-screens.js';
import { ScopeDetailView, ScopesView } from '../screens/structure/structure-screens.js';
import { getSkoposUiConsoleState } from './state.js';

const rootRoute = createRootRoute({
  component: RootShell,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/overview' });
  },
});

const overviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/overview',
  component: OverviewView,
});

const missionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/missions',
  validateSearch: (search: Record<string, unknown>) => ({
    view: normalizeMissionListView(search.view),
  }),
  component: MissionsView,
});

const missionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/missions/$missionId',
  component: MissionDetailRouteView,
});

const plansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plans',
  validateSearch: (search: Record<string, unknown>) => ({
    view: normalizePlanListView(search.view),
  }),
  component: PlansRouteView,
});

const discussionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/discussion',
  component: DiscussionRouteView,
});

const planDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plans/$planId',
  component: PlanDetailRouteView,
});

const trustRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trust',
  component: TrustView,
});

const rulesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rules',
  component: RulesView,
});

const rulePackDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rules/packs/$packId',
  component: RulePackDetailRouteView,
});

const proofRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/proof',
  component: ProofView,
});

const scopesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scopes',
  component: ScopesRouteView,
});

const scopeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scopes/$scopeId',
  component: ScopeDetailRouteView,
});

const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/docs',
  component: DocsView,
});

const memoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/memory',
  component: MemoryView,
});

const docsDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/docs/$docId',
  component: DocsDetailRouteView,
});

const decisionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/decisions',
  validateSearch: (search: Record<string, unknown>) => ({
    view: normalizeKnowledgeListView(search.view),
  }),
  component: DecisionsRouteView,
});

const decisionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/decisions/$decisionId',
  component: DecisionDetailRouteView,
});

const findingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/findings',
  validateSearch: (search: Record<string, unknown>) => ({
    view: normalizeKnowledgeListView(search.view),
  }),
  component: FindingsRouteView,
});

const findingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/findings/$findingId',
  component: FindingDetailRouteView,
});

const activityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/activity',
  component: ActivityView,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  overviewRoute,
  missionsRoute,
  missionDetailRoute,
  plansRoute,
  planDetailRoute,
  discussionRoute,
  trustRoute,
  rulesRoute,
  rulePackDetailRoute,
  proofRoute,
  scopesRoute,
  scopeDetailRoute,
  memoryRoute,
  docsRoute,
  docsDetailRoute,
  decisionsRoute,
  decisionDetailRoute,
  findingsRoute,
  findingDetailRoute,
  activityRoute,
]);

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function RootShell(): React.JSX.Element {
  const state = getSkoposUiConsoleState();
  const locationPath = useRouterState({
    select: (routerState) => routerState.location.pathname,
  });
  const routeMeta = resolveRouteMeta(locationPath);
  const activeMissionCount = state?.missions.filter(
    (mission) => mission.mission.state !== 'complete',
  ).length;
  const [searchOpenSignal, setSearchOpenSignal] = React.useState(0);
  const searchShortcutLabel = React.useMemo(() => getSkoposSearchShortcutLabel(), []);

  return (
    <div className="skopos-console min-h-screen bg-[var(--bg)] text-[var(--ink)] xl:h-screen xl:overflow-hidden">
      <div className={['grid min-h-screen grid-cols-1 xl:h-screen', SKOPOS_APP_SHELL_GRID_CLASS].join(' ')}>
        <aside className="skopos-scroll overflow-x-hidden border-b border-[var(--line)] bg-[var(--sidebar)] xl:h-screen xl:overflow-y-auto xl:overflow-x-hidden xl:border-b-0 xl:border-r">
          <div className="skopos-sidebar-shell flex min-h-full flex-col">
            <div className="skopos-sidebar-brand">
              <div className="skopos-sidebar-brand-mark">
                S
              </div>
              <div className="min-w-0 flex-1">
                <p className="skopos-sidebar-brand-title">
                  {state?.workspaceLabel ?? 'Skopos'}
                </p>
                <p className="skopos-sidebar-brand-subtitle">project guide</p>
                <p className="skopos-sidebar-workspace-note">
                  {state?.uiMode === 'live' ? 'live workspace' : 'snapshot workspace'}
                </p>
              </div>
            </div>
            <div className="skopos-sidebar-search-slot">
              <button
                type="button"
                className="skopos-sidebar-search-trigger"
                onClick={() => setSearchOpenSignal((currentValue) => currentValue + 1)}
              >
                <span className="skopos-sidebar-search-trigger-copy">
                  <span className="skopos-sidebar-search-trigger-label">Search or jump</span>
                  <span className="skopos-sidebar-search-trigger-note">
                    Exact-first workspace resolver
                  </span>
                </span>
                <span className="skopos-sidebar-search-trigger-shortcut">{searchShortcutLabel}</span>
              </button>
            </div>
            <div className="skopos-sidebar-groups">
              {navSections.map((section) => (
                <section key={section.label} className="skopos-sidebar-group">
                  <p className="skopos-sidebar-group-label">{section.label}</p>
                  <div className="skopos-sidebar-nav">
                    {section.items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        activeProps={{
                          className: 'skopos-sidebar-link-active',
                        }}
                        className="skopos-sidebar-link"
                      >
                        <p className="skopos-sidebar-link-label">{item.label}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            <div className="skopos-sidebar-status-dock">
              <div className="skopos-sidebar-status-panel">
                <div className="skopos-sidebar-status-list">
                  <div className="skopos-sidebar-status-row">
                    <span className="skopos-sidebar-status-label">Readiness</span>
                    <StatusPill
                      value={state?.trustReport.readiness ?? 'build-needed'}
                      tone={toneForReadiness(state?.trustReport.readiness)}
                      className="skopos-sidebar-status-pill"
                    />
                  </div>
                  <div className="skopos-sidebar-status-row">
                    <span className="skopos-sidebar-status-label">Confidence</span>
                    <StatusPill
                      value={state?.trustReport.trustLevel ?? 'unknown'}
                      tone={toneForTrust(state?.trustReport.trustLevel)}
                      className="skopos-sidebar-status-pill"
                    />
                  </div>
                  <div className="skopos-sidebar-status-row">
                    <span className="skopos-sidebar-status-label">Missions</span>
                    <span className="skopos-sidebar-status-value">
                      {activeMissionCount ?? 0} active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <div className="min-w-0 bg-[var(--canvas)] xl:flex xl:h-screen xl:min-h-0 xl:flex-col xl:overflow-hidden">
          <main className="skopos-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden xl:overflow-hidden">
            <div className="h-full min-h-full w-full pb-4 xl:pb-0">
              {state ? (
                <SkoposConsoleChromeProvider
                  value={{
                    workspaceLabel: state.workspaceLabel,
                    routeTitle: routeMeta.title,
                  }}
                >
                  <Outlet />
                </SkoposConsoleChromeProvider>
              ) : (
                <NoStateView />
              )}
            </div>
          </main>
        </div>
      </div>
      {state ? (
        <SearchDock
          state={state}
          currentPath={locationPath}
          openSignal={searchOpenSignal}
        />
      ) : null}
    </div>
  );
}

function OverviewView(): React.JSX.Element {
  return <ExecutionOverviewView />;
}

function MissionsView(): React.JSX.Element {
  const search = missionsRoute.useSearch();
  return <ExecutionMissionsView search={search} />;
}

function MissionDetailRouteView(): React.JSX.Element {
  const { missionId } = missionDetailRoute.useParams();
  return <ExecutionMissionDetailView missionId={missionId} />;
}

function PlansRouteView(): React.JSX.Element {
  const search = plansRoute.useSearch();
  return <PlansView search={search} />;
}

function DiscussionRouteView(): React.JSX.Element {
  return <ExecutionDiscussionView />;
}

function RulePackDetailRouteView(): React.JSX.Element {
  const { packId } = rulePackDetailRoute.useParams();

  return <PackDetailView packId={packId} />;
}

function PlanDetailRouteView(): React.JSX.Element {
  const { planId } = planDetailRoute.useParams();
  return <PlanDetailView planId={planId} />;
}

function ScopesRouteView(): React.JSX.Element {
  return <ScopesView />;
}

function ScopeDetailRouteView(): React.JSX.Element {
  const { scopeId } = scopeDetailRoute.useParams();
  return <ScopeDetailView scopeId={scopeId} />;
}

function DocsDetailRouteView(): React.JSX.Element {
  const { docId } = docsDetailRoute.useParams();
  return <DocsDetailView docId={docId} />;
}

function DecisionsRouteView(): React.JSX.Element {
  const search = decisionsRoute.useSearch();
  return <DecisionsView search={search} />;
}

function DecisionDetailRouteView(): React.JSX.Element {
  const { decisionId } = decisionDetailRoute.useParams();
  return <DecisionDetailView decisionId={decisionId} />;
}

function FindingsRouteView(): React.JSX.Element {
  const search = findingsRoute.useSearch();
  return <FindingsView search={search} />;
}

function FindingDetailRouteView(): React.JSX.Element {
  const { findingId } = findingDetailRoute.useParams();
  return <FindingDetailView findingId={findingId} />;
}

function NoStateView(): React.JSX.Element {
  return (
    <div className="px-2 py-2">
      <p className="skopos-eyebrow">Routed app foundation</p>
      <h2 className="skopos-page-title mt-3 max-w-[42rem]">No compiled console state injected</h2>
      <p className="skopos-helper-copy mt-2 max-w-[42rem]">
        This routed app is ready for local development, but it needs compiled Skopos UI state to
        render a real workspace. Run <code>skopos ui build</code> against a workspace to inject the
        app-ready state payload and emit a pilot-ready console snapshot.
      </p>
    </div>
  );
}
