export interface RouteMeta {
  title: string;
  description: string;
}

export type MissionListView = 'open' | 'blocked' | 'claimed' | 'complete';
export type PlanListView = 'current' | 'library' | 'all';
export type KnowledgeListView = 'entries' | 'reference' | 'all';

const appRouteMeta = {
  overview: {
    title: 'Overview',
    description: 'Workspace health, execution focus, and the current Skopos posture.',
  },
  missions: {
    title: 'Missions',
    description: 'Active and historical execution slices, ownership, and linked work.',
  },
  plans: {
    title: 'Plans',
    description: 'Scoped plan intent, validation lanes, and linked mission context.',
  },
  discussion: {
    title: 'Discussion',
    description: 'Latest workflow handoff, checkpoint history, and accepted direction across threads.',
  },
  trust: {
    title: 'Trust',
    description: 'Readiness, checks, blockers, assumptions, and closure confidence.',
  },
  proof: {
    title: 'Proof',
    description: 'Benchmark posture, scorecard categories, and before-versus-after deltas.',
  },
  scopes: {
    title: 'Scopes',
    description: 'Workspace packages, docs roots, and instruction surfaces Skopos understands.',
  },
  docs: {
    title: 'Docs',
    description: 'Canonical entrypoints, artifacts, and routes back to authoritative files.',
  },
  decisions: {
    title: 'Decisions',
    description: 'Accepted product and architecture decisions that guide the system.',
  },
  findings: {
    title: 'Findings',
    description: 'Active findings, registry context, and durable product friction notes.',
  },
  activity: {
    title: 'Activity',
    description:
      'Recent operational history across plans, missions, workflows, and lifecycle events.',
  },
} satisfies Record<string, RouteMeta>;

export const navSections = [
  {
    label: 'Overview',
    items: [{ to: '/overview', label: 'Overview' }],
  },
  {
    label: 'Work',
    items: [
      { to: '/missions', label: 'Missions' },
      { to: '/plans', label: 'Plans' },
      { to: '/discussion', label: 'Discussion' },
      { to: '/activity', label: 'Activity' },
    ],
  },
  {
    label: 'Validation',
    items: [
      { to: '/trust', label: 'Trust' },
      { to: '/proof', label: 'Proof' },
    ],
  },
  {
    label: 'Knowledge',
    items: [
      { to: '/docs', label: 'Docs' },
      { to: '/decisions', label: 'Decisions' },
      { to: '/findings', label: 'Findings' },
    ],
  },
  {
    label: 'Structure',
    items: [{ to: '/scopes', label: 'Scopes' }],
  },
] as const;

export const resolveRouteMeta = (pathname: string): RouteMeta => {
  if (pathname.startsWith('/missions')) {
    return appRouteMeta.missions;
  }
  if (pathname.startsWith('/plans')) {
    return appRouteMeta.plans;
  }
  if (pathname.startsWith('/discussion')) {
    return appRouteMeta.discussion;
  }
  if (pathname.startsWith('/trust')) {
    return appRouteMeta.trust;
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

export const normalizeMissionListView = (value: unknown): MissionListView => {
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
