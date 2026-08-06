import * as React from 'react';
import {
  Outlet,
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useRouterState,
} from '@tanstack/react-router';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { PageSection } from '@/components/ui/page-section';
import { SearchBar } from '@/components/ui/search-bar';
import {
  Sidebar,
  SidebarDrawer,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { Typography } from '@/components/ui/typography';
import type { NavigationItem } from '@/types/navigation';

import { ProjectSearchDialog } from '../patterns/shells/search-dock.js';
import {
  normalizeKnowledgeListView,
  normalizeTaskListView,
  normalizePlanListView,
  resolveRouteBreadcrumbs,
  resolveRouteMeta,
  type KnowledgeListView,
  type TaskListView,
  type PlanListView,
  type RouteMeta,
} from './routing/route-config.js';
import type { RouteBreadcrumbItem } from './routing/route-config.js';
import {
  ExecutionDiscussionView,
  ExecutionTaskDetailView,
  ExecutionTasksView,
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
import { ActivityView, PackDetailView, PolicyRuleDetailView, ProofView, RulesView, ReadinessView } from '../screens/validation/review-screens.js';
import { ScopeDetailView, ScopesView } from '../screens/structure/structure-screens.js';
import { getSkoposUiConsoleState } from './state.js';
import { ApplicationLink } from '../support/ui/application-link.js';

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

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks',
  validateSearch: (search: Record<string, unknown>) => ({
    view: normalizeTaskListView(search.view),
  }),
  component: TasksView,
});

const taskDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks/$taskId',
  component: TaskDetailRouteView,
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

const readinessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/readiness',
  component: ReadinessView,
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

const policyRuleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rules/packs/$packId/rules/$ruleId',
  component: PolicyRuleDetailRouteView,
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
  tasksRoute,
  taskDetailRoute,
  plansRoute,
  planDetailRoute,
  discussionRoute,
  readinessRoute,
  rulesRoute,
  rulePackDetailRoute,
  policyRuleDetailRoute,
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
  history: createBrowserHistory(),
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
  const routeBreadcrumbs = resolveRouteBreadcrumbs(
    locationPath,
    resolveRouteDetailTitle(locationPath, state),
  );
  const [searchOpenSignal, setSearchOpenSignal] = React.useState(0);
  const navigationItems = React.useMemo(() => createNavigationItems(state), [state]);
  const activeNavigationId = resolveActiveNavigationId(locationPath, navigationItems);

  return (
    <SidebarProvider
      items={navigationItems}
      value={activeNavigationId}
      mode="collapsible-drawer"
      behavior={{ mobile: 'overlay', tablet: 'inset', desktop: 'inset' }}
      defaultExpanded
      persist
      storageKey="skopos-sidebar"
      drawerWidth={248}
      railWidth={80}
      mobileInsetOffset={0}
      onItemSelect={(item) => {
        if (item.href) void router.navigate({ href: item.href });
      }}
      renderLink={(item, props) => (
        <a
          {...props}
          href={item.href}
          onClick={(event) => {
            props.onClick?.(event);
            if (event.defaultPrevented || item.external) return;
            event.preventDefault();
            if (item.href) void router.navigate({ href: item.href });
          }}
        />
      )}
    >
      <div className="skopos-console h-screen w-screen overflow-hidden bg-surface-container-low text-on-surface">
        <a
          href="#skopos-main-content"
          className="focus:bg-surface focus:text-primary focus:ring-focus-ring sr-only z-[var(--z-modal)] rounded-button px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:ring-2"
        >
          Skip to project content
        </a>
        <Sidebar className="relative h-full overflow-hidden">
          <SidebarDrawer
            aria-label="Project navigation"
            header={<ProjectIdentity state={state} />}
            collapsedHeader={<ProjectMark />}
            overlayHeadline="Explore Skopos"
          />
          <SidebarInset className="bg-surface-container-low p-0 md:pb-3 md:pr-3">
            <div className="hidden h-12 shrink-0 items-center px-3 md:flex">
              <SearchBar
                aria-label="Search project"
                placeholder="Search"
                readOnly
                size="sm"
                className="border-outline-weak w-full max-w-xl bg-surface"
                onClick={() => setSearchOpenSignal((value) => value + 1)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return;
                  event.preventDefault();
                  setSearchOpenSignal((value) => value + 1);
                }}
              />
            </div>
            <section className="flex min-h-0 flex-1 flex-col overflow-hidden border-outline-weak bg-surface md:rounded-md md:border">
              <TopAppBar
                variant="small"
                className="h-14"
                title={<RouteBreadcrumbs items={routeBreadcrumbs} />}
                titleVariant="bodyMedium"
                aria-label={`${routeMeta.title} location`}
                navigationIcon={<SidebarTrigger aria-label="Toggle project navigation" />}
                actions={
                  <>
                    <IconButton
                      aria-label="Search"
                      icon={<Icon symbol="search" />}
                      variant="standard"
                      size="sm"
                      className="md:hidden"
                      onClick={() => setSearchOpenSignal((value) => value + 1)}
                    />
                  </>
                }
              />
              <div
                id="skopos-main-content"
                tabIndex={-1}
                className="skopos-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
              >
                {state ? <Outlet /> : <NoStateView />}
              </div>
            </section>
          </SidebarInset>
        </Sidebar>
        {state ? (
          <ProjectSearchDialog
            state={state}
            currentPath={locationPath}
            openSignal={searchOpenSignal}
          />
        ) : null}
      </div>
    </SidebarProvider>
  );
}

function RouteBreadcrumbs({
  items,
}: {
  items: RouteBreadcrumbItem[];
}): React.JSX.Element {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      {items.map((item, index) => {
        const current = index === items.length - 1;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 ? <Icon symbol="chevron_right" size="xs" /> : null}
            {item.href && !current ? (
              <ApplicationLink
                href={item.href}
                className="shrink-0 text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {item.label}
              </ApplicationLink>
            ) : (
              <span
                aria-current={current ? 'page' : undefined}
                className={current ? 'truncate text-on-surface' : 'shrink-0 text-on-surface-variant'}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </span>
  );
}

const resolveRouteDetailTitle = (
  pathname: string,
  state: ReturnType<typeof getSkoposUiConsoleState>,
): string | undefined => {
  if (!state) return undefined;

  const segments = pathname.split('/').filter(Boolean).map(safeDecodeRouteSegment);
  const [family, id] = segments;
  if (!family || !id) return undefined;

  if (family === 'tasks') {
    return state.tasks.find((candidate) => candidate.task.id === id)?.task.title;
  }
  if (family === 'plans') {
    return state.plans.find((candidate) => candidate.plan.id === id)?.plan.title;
  }
  if (family === 'scopes') {
    return state.scopes.find((candidate) => candidate.scope.id === id)?.scope.title;
  }
  if (family === 'docs' || family === 'decisions' || family === 'findings') {
    return state.documents.find((candidate) => candidate.id === id)?.title;
  }
  if (family === 'rules' && segments[1] === 'packs') {
    const packId = segments[2];
    const ruleId = segments[3] === 'rules' ? segments[4] : undefined;
    const pack = state.policyReview?.packManifests.find(
      (candidate) => candidate.manifest.packId === packId,
    )?.manifest;
    if (ruleId) {
      return pack?.rules.find(
        (candidate) => candidate.id === ruleId || candidate.id === `${packId}.${ruleId}`,
      )?.title;
    }
    return pack?.displayName;
  }

  return undefined;
};

const safeDecodeRouteSegment = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

function ProjectIdentity({
  state,
}: {
  state: ReturnType<typeof getSkoposUiConsoleState>;
}): React.JSX.Element {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <ProjectMark />
      <div className="min-w-0 flex-1">
        <Typography variant="titleSmall" className="truncate">
          {state?.workspaceLabel ?? 'Skopos'}
        </Typography>
        <Typography variant="bodySmall" className="truncate text-on-surface-variant">
          {state?.uiMode === 'live' ? 'Live project guide' : 'Project snapshot'}
        </Typography>
      </div>
    </div>
  );
}

function ProjectMark(): React.JSX.Element {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-primary-container text-on-primary-container">
      <Icon symbol="assistant_navigation" />
    </span>
  );
}

const createNavigationItems = (
  state: ReturnType<typeof getSkoposUiConsoleState>,
): NavigationItem[] => {
  const activeTaskCount =
    state?.tasks.filter(
      (task) => !['complete', 'cancelled', 'superseded'].includes(task.task.state),
    ).length ?? 0;

  return [
    { id: 'overview', label: 'Now', href: '/overview', icon: 'home' },
    {
      id: 'work',
      label: 'Work',
      icon: 'assignment',
      badge: activeTaskCount || undefined,
      items: [
        { id: 'tasks', label: 'Tasks', href: '/tasks' },
        { id: 'plans', label: 'Plans', href: '/plans' },
        { id: 'discussion', label: 'Discussion', href: '/discussion' },
      ],
    },
    {
      id: 'knowledge',
      label: 'Project knowledge',
      icon: 'menu_book',
      items: [
        { id: 'memory', label: 'What Skopos knows', href: '/memory' },
        { id: 'scopes', label: 'Project map', href: '/scopes' },
        { id: 'docs', label: 'Docs', href: '/docs' },
        { id: 'decisions', label: 'Decisions', href: '/decisions' },
        { id: 'findings', label: 'Issues', href: '/findings' },
        { id: 'rules', label: 'Rules', href: '/rules' },
      ],
    },
    {
      id: 'confidence',
      label: 'Confidence',
      icon: 'verified',
      items: [
        { id: 'readiness', label: 'Readiness', href: '/readiness' },
        { id: 'proof', label: 'Evidence', href: '/proof' },
      ],
    },
    { id: 'activity', label: 'Activity', href: '/activity', icon: 'history' },
  ];
};

const resolveActiveNavigationId = (
  pathname: string,
  items: NavigationItem[],
): string | null => {
  const leaves = items.flatMap((item) => item.items ?? [item]);
  const match = leaves
    .filter((item) => item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`)))
    .sort((left, right) => (right.href?.length ?? 0) - (left.href?.length ?? 0))[0];
  return match?.id ?? 'overview';
};

function OverviewView(): React.JSX.Element {
  return <ExecutionOverviewView />;
}

function TasksView(): React.JSX.Element {
  const search = tasksRoute.useSearch();
  return <ExecutionTasksView search={search} />;
}

function TaskDetailRouteView(): React.JSX.Element {
  const { taskId } = taskDetailRoute.useParams();
  return <ExecutionTaskDetailView taskId={taskId} />;
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

function PolicyRuleDetailRouteView(): React.JSX.Element {
  const { packId, ruleId } = policyRuleDetailRoute.useParams();

  return <PolicyRuleDetailView packId={packId} ruleId={ruleId} />;
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
    <PageSection rhythm="hero" width="standard">
      <Card variant="low" padding="lg" className="max-w-2xl">
        <Typography variant="eyebrow" className="text-on-surface-variant">
          Skopos is ready
        </Typography>
        <Typography variant="headlineMedium" className="mt-3">
          Connect this view to a project
        </Typography>
        <Typography variant="bodyLarge" className="mt-3 text-on-surface-variant">
          Run <code className="font-mono">skopos ui build</code> in a workspace to compile the
          project state this console needs.
        </Typography>
      </Card>
    </PageSection>
  );
}
