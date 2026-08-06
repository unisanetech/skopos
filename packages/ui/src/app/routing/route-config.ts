export interface RouteMeta {
  title: string;
  description: string;
}

export interface RouteBreadcrumbItem {
  label: string;
  href?: string;
}

export type TaskListView = 'open' | 'blocked' | 'claimed' | 'complete';
export type PlanListView = 'current' | 'library' | 'all';
export type KnowledgeListView = 'entries' | 'reference' | 'all';

const appRouteMeta = {
  overview: {
    title: 'Now',
    description: 'What is happening now, what needs attention, and the next useful action.',
  },
  tasks: {
    title: 'Tasks',
    description: 'Active and historical execution slices, ownership, and linked work.',
  },
  plans: {
    title: 'Plans',
    description: 'Scoped plan intent, validation lanes, and linked task context.',
  },
  discussion: {
    title: 'Discussion',
    description: 'Latest action handoff, checkpoint history, and accepted direction across threads.',
  },
  readiness: {
    title: 'Readiness',
    description: 'Checks, warnings, blockers, assumptions, and whether the project is ready to continue.',
  },
  rules: {
    title: 'Rules',
    description: 'Accepted project rules, policy drift, local exceptions, and the right validation lane.',
  },
  proof: {
    title: 'Evidence',
    description: 'Tests, benchmarks, checks, and other evidence that prove work is safe to close.',
  },
  scopes: {
    title: 'Project Map',
    description: 'Declared project Scope boundaries Skopos understands.',
  },
  docs: {
    title: 'Docs',
    description: 'Canonical entrypoints, artifacts, and routes back to authoritative files.',
  },
  memory: {
    title: 'Project Knowledge',
    description: 'What Skopos knows about the project and which sources it uses before agent work starts.',
  },
  decisions: {
    title: 'Decisions',
    description: 'Accepted product and architecture decisions that guide the system.',
  },
  findings: {
    title: 'Issues',
    description: 'Active product and engineering issues Skopos is tracking over time.',
  },
  activity: {
    title: 'Activity',
    description:
      'Recent operational history across plans, tasks, actions, and lifecycle events.',
  },
} satisfies Record<string, RouteMeta>;

export const navSections = [
  {
    label: 'Now',
    items: [{ to: '/overview', label: 'Now' }],
  },
  {
    label: 'Work',
    items: [
      { to: '/tasks', label: 'Tasks' },
      { to: '/plans', label: 'Plans' },
      { to: '/discussion', label: 'Discussion' },
    ],
  },
  {
    label: 'Knowledge',
    items: [
      { to: '/memory', label: 'Project Knowledge' },
      { to: '/scopes', label: 'Project Map' },
      { to: '/docs', label: 'Docs' },
      { to: '/decisions', label: 'Decisions' },
      { to: '/findings', label: 'Issues' },
      { to: '/rules', label: 'Rules' },
    ],
  },
  {
    label: 'Readiness',
    items: [
      { to: '/readiness', label: 'Readiness' },
      { to: '/proof', label: 'Evidence' },
    ],
  },
  {
    label: 'Activity',
    items: [{ to: '/activity', label: 'Activity' }],
  },
] as const;

export const resolveRouteMeta = (pathname: string): RouteMeta => {
  if (pathname.startsWith('/tasks')) {
    return appRouteMeta.tasks;
  }
  if (pathname.startsWith('/plans')) {
    return appRouteMeta.plans;
  }
  if (pathname.startsWith('/discussion')) {
    return appRouteMeta.discussion;
  }
  if (pathname.startsWith('/readiness')) {
    return appRouteMeta.readiness;
  }
  if (pathname.startsWith('/rules')) {
    return appRouteMeta.rules;
  }
  if (pathname.startsWith('/proof')) {
    return appRouteMeta.proof;
  }
  if (pathname.startsWith('/scopes')) {
    return appRouteMeta.scopes;
  }
  if (pathname.startsWith('/docs')) {
    return appRouteMeta.docs;
  }
  if (pathname.startsWith('/memory')) {
    return appRouteMeta.memory;
  }
  if (pathname.startsWith('/decisions')) {
    return appRouteMeta.decisions;
  }
  if (pathname.startsWith('/findings')) {
    return appRouteMeta.findings;
  }
  if (pathname.startsWith('/activity')) {
    return appRouteMeta.activity;
  }
  return appRouteMeta.overview;
};

export const resolveRouteBreadcrumbs = (
  pathname: string,
  detailTitle?: string,
): RouteBreadcrumbItem[] => {
  const routeMeta = resolveRouteMeta(pathname);
  const family = resolveRouteFamily(pathname);
  const items: RouteBreadcrumbItem[] = [];

  if (family && family.label !== routeMeta.title) {
    items.push(family);
  }

  items.push({
    label: routeMeta.title,
    href: detailTitle ? routeFamilyHref(pathname) : undefined,
  });

  if (detailTitle && detailTitle !== routeMeta.title) {
    items.push({ label: detailTitle });
  }

  return items;
};

const resolveRouteFamily = (pathname: string): RouteBreadcrumbItem | undefined => {
  if (
    pathname.startsWith('/tasks') ||
    pathname.startsWith('/plans') ||
    pathname.startsWith('/discussion')
  ) {
    return { label: 'Work', href: '/tasks' };
  }

  if (
    pathname.startsWith('/memory') ||
    pathname.startsWith('/scopes') ||
    pathname.startsWith('/docs') ||
    pathname.startsWith('/decisions') ||
    pathname.startsWith('/findings') ||
    pathname.startsWith('/rules')
  ) {
    return { label: 'Project knowledge', href: '/memory' };
  }

  if (pathname.startsWith('/readiness') || pathname.startsWith('/proof')) {
    return { label: 'Confidence', href: '/readiness' };
  }

  return undefined;
};

const routeFamilyHref = (pathname: string): string => {
  const [family] = pathname.split('/').filter(Boolean);
  return family ? `/${family}` : '/overview';
};

export const normalizeTaskListView = (value: unknown): TaskListView => {
  switch (value) {
    case 'blocked':
    case 'claimed':
    case 'complete':
      return value;
    default:
      return 'open';
  }
};

export const normalizePlanListView = (value: unknown): PlanListView => {
  switch (value) {
    case 'library':
    case 'all':
      return value;
    default:
      return 'current';
  }
};

export const normalizeKnowledgeListView = (value: unknown): KnowledgeListView => {
  switch (value) {
    case 'reference':
    case 'all':
      return value;
    default:
      return 'entries';
  }
};
