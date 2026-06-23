import type { SkoposUiConsoleState } from '../../contracts/skopos-ui-console-state.js';
import { humanize } from '../../support/formatting/console-formatting.js';
import { toneForReadiness } from '../../support/ui/tone-helpers.js';

interface InspectorItem {
  label: string;
  value: string;
}

type ActivityTone = 'neutral' | 'positive' | 'warning' | 'danger';

export interface TrustViewContext {
  passChecks: SkoposUiConsoleState['trustReport']['checks'];
  warningChecks: SkoposUiConsoleState['trustReport']['checks'];
  failureChecks: SkoposUiConsoleState['trustReport']['checks'];
  allChecks: SkoposUiConsoleState['trustReport']['checks'];
  sourceLinks: SkoposUiConsoleState['docsLinks'];
  workspaceSignalItems: InspectorItem[];
  docsPostureItems: InspectorItem[];
}

export interface ProofViewContext {
  proofReport: SkoposUiConsoleState['proofReport'];
  mustWinBenchmarks: NonNullable<SkoposUiConsoleState['proofReport']>['scorecard']['benchmarks'];
  regressedBenchmarks: NonNullable<SkoposUiConsoleState['proofReport']>['scorecard']['benchmarks'];
  regressedCategorySet: Set<string>;
  improvedCategoryCount: number;
  improvedCategorySet: Set<string>;
  visibleCategoryWatch: NonNullable<SkoposUiConsoleState['proofReport']>['comparison']['categoryComparisons'];
  sourceLinks: SkoposUiConsoleState['docsLinks'];
}

export interface ActivityViewContext {
  latestEntry?: ActivityFeedEntry;
  postureItems: InspectorItem[];
  feedGroups: ActivityFeedGroup[];
}

interface ActivityTimelineEntry {
  id: string;
  eventKind: SkoposUiConsoleState['activity']['operationalEvents'][number]['eventKind'];
  kindLabel: string;
  outcomeLabel: string;
  outcomeTone: ActivityTone;
  summary: string;
  actorId?: string;
  latestTimestamp: string;
  earliestTimestamp: string;
  count: number;
  signature: string;
}

export interface ActivityFeedEntry {
  id: string;
  feedKind: 'event' | 'mission' | 'plan' | 'workflow';
  kindLabel: string;
  statusLabel?: string;
  statusTone?: ActivityTone;
  countLabel?: string;
  headline: string;
  summary?: string;
  actorId?: string;
  timestamp: string;
  rangeStart?: string;
  missionId?: string;
  planId?: string;
}

export interface ActivityFeedGroup {
  id: string;
  label: string;
  entries: ActivityFeedEntry[];
}

export const getTrustViewContext = (state: SkoposUiConsoleState): TrustViewContext => {
  const passChecks = state.trustReport.checks.filter((check) => check.status === 'pass');
  const warningChecks = state.trustReport.checks.filter((check) => check.status === 'warn');
  const failureChecks = state.trustReport.checks.filter((check) => check.status === 'fail');

  return {
    passChecks,
    warningChecks,
    failureChecks,
    allChecks: state.trustReport.checks,
    sourceLinks: state.docsLinks.filter((link) => ['doc', 'artifact', 'report'].includes(link.kind)),
    workspaceSignalItems: [
      {
        label: 'Packages',
        value:
          state.trustReport.detected.packageCount === state.trustReport.detected.workspacePackageCount
            ? `${state.trustReport.detected.workspacePackageCount} workspace packages`
            : `${state.trustReport.detected.workspacePackageCount}/${state.trustReport.detected.packageCount} workspace packages`,
      },
      { label: 'Repo mode', value: humanize(state.trustReport.detected.repoMode) },
      { label: 'Archetype', value: humanize(state.trustReport.detected.archetypeSuggestion) },
      ...(state.trustReport.detected.frameworks.length > 0
        ? [{ label: 'Frameworks', value: state.trustReport.detected.frameworks.join(' · ') }]
        : []),
      ...(state.trustReport.detected.languages.length > 0
        ? [{ label: 'Languages', value: state.trustReport.detected.languages.join(' · ') }]
        : []),
      ...(state.trustReport.detected.instructionFiles.length > 0
        ? [{ label: 'Instruction files', value: String(state.trustReport.detected.instructionFiles.length) }]
        : []),
      ...(state.trustReport.detected.appliedOverrides.length > 0
        ? [{ label: 'Overrides', value: String(state.trustReport.detected.appliedOverrides.length) }]
        : []),
    ],
    docsPostureItems: [
      {
        label: 'Docs root',
        value: state.trustReport.detected.docsHealth.root ?? 'No canonical docs root detected',
      },
      {
        label: 'Docs start',
        value: state.trustReport.detected.docsHealth.hasStartHere
          ? 'Canonical start present'
          : 'Canonical docs start missing',
      },
      {
        label: 'Tracked docs',
        value: `${state.trustReport.detected.docsHealth.markdownFileCount} markdown docs`,
      },
      ...(state.trustReport.detected.docsHealth.freshnessTrackedCount > 0
        ? [{
            label: 'Freshness tracked',
            value: `${state.trustReport.detected.docsHealth.freshnessTrackedCount} docs`,
          }]
        : []),
      ...(state.trustReport.detected.docsHealth.staleDocPaths.length > 0
        ? [{
            label: 'Stale docs',
            value: `${state.trustReport.detected.docsHealth.staleDocPaths.length} flagged`,
          }]
        : []),
      ...(state.trustReport.detected.ignoredPaths.length > 0
        ? [{ label: 'Ignored roots', value: state.trustReport.detected.ignoredPaths.join(' · ') }]
        : []),
    ],
  };
};

export const getProofViewContext = (state: SkoposUiConsoleState): ProofViewContext => {
  const proofReport = state.proofReport;
  const comparisonCategories = proofReport?.comparison.categoryComparisons ?? [];
  const improvedCategories =
    comparisonCategories.filter((comparison) => comparison.status === 'improved') ?? [];
  const categoryWatch = comparisonCategories.filter(
    (comparison) => comparison.status !== 'matched',
  );

  return {
    proofReport,
    mustWinBenchmarks:
      proofReport?.scorecard.benchmarks.filter((benchmark) => benchmark.priority === 'must-win') ?? [],
    regressedBenchmarks:
      proofReport?.scorecard.benchmarks.filter((benchmark) =>
        proofReport.comparison.regressedBenchmarks.includes(benchmark.id),
      ) ?? [],
    regressedCategorySet: new Set(proofReport?.comparison.regressedCategories ?? []),
    improvedCategoryCount: improvedCategories.length,
    improvedCategorySet: new Set(improvedCategories.map((comparison) => comparison.category)),
    visibleCategoryWatch: categoryWatch,
    sourceLinks: state.docsLinks.filter((link) => ['report', 'portal'].includes(link.kind)),
  };
};

export const getActivityViewContext = (state: SkoposUiConsoleState): ActivityViewContext => {
  const actorCount = new Set(
    [
      ...state.activity.operationalEvents.map((event) => event.actorId),
      ...state.activity.plans.map((plan) => plan.createdByActorId),
      ...state.activity.missions.map((mission) => mission.lastUpdatedByActorId ?? mission.claimedByActorId),
      ...state.activity.workflowRuns.map((run) => run.runByActorId),
    ].filter(Boolean),
  ).size;
  const operationalEntries = buildActivityTimelineEntries(state.activity.operationalEvents);
  const feedEntries = buildActivityFeedEntries({
    operationalEntries,
    plans: state.activity.plans,
    missions: state.activity.missions,
    workflowRuns: state.activity.workflowRuns,
  });

  return {
    latestEntry: feedEntries[0],
    postureItems: [
      ...(feedEntries.length > 0
        ? [{ label: 'Recent changes', value: String(feedEntries.length) }]
        : []),
      ...(operationalEntries.length > 0
        ? [{ label: 'Operational groups', value: String(operationalEntries.length) }]
        : []),
      ...(state.activity.plans.length > 0
        ? [{ label: 'Plans', value: String(state.activity.plans.length) }]
        : []),
      ...(state.activity.missions.length > 0
        ? [{ label: 'Missions', value: String(state.activity.missions.length) }]
        : []),
      ...(state.activity.workflowRuns.length > 0
        ? [{ label: 'Workflow runs', value: String(state.activity.workflowRuns.length) }]
        : []),
      ...(actorCount > 0 ? [{ label: 'Actors', value: String(actorCount) }] : []),
    ],
    feedGroups: groupActivityFeedEntriesByDay(feedEntries),
  };
};

const buildActivityFeedEntries = ({
  operationalEntries,
  plans,
  missions,
  workflowRuns,
}: {
  operationalEntries: ActivityTimelineEntry[];
  plans: SkoposUiConsoleState['activity']['plans'];
  missions: SkoposUiConsoleState['activity']['missions'];
  workflowRuns: SkoposUiConsoleState['activity']['workflowRuns'];
}): ActivityFeedEntry[] =>
  [
    ...operationalEntries.map((entry) => buildOperationalFeedEntry(entry)),
    ...plans.map((plan) => buildPlanFeedEntry(plan)),
    ...missions.map((mission) => buildMissionFeedEntry(mission)),
    ...workflowRuns.map((run) => buildWorkflowFeedEntry(run)),
  ]
    .sort((left, right) => sortActivityFeedEntries(left.timestamp, right.timestamp))
    .slice(0, 16);

const buildOperationalFeedEntry = (entry: ActivityTimelineEntry): ActivityFeedEntry => ({
  id: entry.id,
  feedKind: 'event',
  kindLabel: entry.kindLabel,
  statusLabel: entry.outcomeLabel,
  statusTone: entry.outcomeTone,
  countLabel: entry.count > 1 ? `${entry.count} runs` : undefined,
  headline: entry.summary,
  actorId: entry.actorId,
  timestamp: entry.latestTimestamp,
  rangeStart: entry.count > 1 ? entry.earliestTimestamp : undefined,
});

const buildPlanFeedEntry = (
  plan: SkoposUiConsoleState['activity']['plans'][number],
): ActivityFeedEntry => ({
  id: `plan-${plan.id}`,
  feedKind: 'plan',
  kindLabel: 'Plan',
  headline: plan.title,
  summary: plan.summary,
  actorId: plan.createdByActorId,
  timestamp: plan.updatedAt ?? '',
  planId: plan.id,
});

const buildMissionFeedEntry = (
  mission: SkoposUiConsoleState['activity']['missions'][number],
): ActivityFeedEntry => ({
  id: `mission-${mission.id}`,
  feedKind: 'mission',
  kindLabel: 'Mission',
  statusLabel: humanize(mission.state),
  statusTone: toneForActivityMissionState(mission.state),
  headline: mission.title,
  summary: `${mission.pendingItemCount} pending items · ${mission.linkedSliceCount} linked slices`,
  actorId: mission.lastUpdatedByActorId ?? mission.claimedByActorId,
  timestamp: mission.updatedAt ?? '',
  missionId: mission.id,
});

const buildWorkflowFeedEntry = (
  run: SkoposUiConsoleState['activity']['workflowRuns'][number],
): ActivityFeedEntry => ({
  id: `workflow-${run.id}`,
  feedKind: 'workflow',
  kindLabel: 'Workflow',
  statusLabel: humanize(run.runStatus),
  statusTone:
    run.runStatus === 'succeeded'
      ? 'positive'
      : run.runStatus === 'failed'
        ? 'danger'
        : 'warning',
  headline: run.workflowTitle,
  summary:
    run.outputPaths.length > 0
      ? `${run.outputPaths.length} output path${run.outputPaths.length === 1 ? '' : 's'} recorded`
      : 'No output artifacts recorded.',
  actorId: run.runByActorId,
  timestamp: run.finishedAt ?? '',
});

const buildActivityTimelineEntries = (
  events: SkoposUiConsoleState['activity']['operationalEvents'],
): ActivityTimelineEntry[] => {
  const groupedEntries: ActivityTimelineEntry[] = [];

  for (const event of events) {
    const previousEntry = groupedEntries.at(-1);

    if (previousEntry && shouldCollapseActivityEvents(previousEntry, event)) {
      previousEntry.count += 1;
      previousEntry.earliestTimestamp = event.timestamp;
      previousEntry.summary = buildActivitySummary(previousEntry.eventKind, previousEntry.outcomeLabel, previousEntry.count, event.summary);
      continue;
    }

    const readiness = parseTrustReadiness(event.summary);

    groupedEntries.push({
      id: event.id,
      eventKind: event.eventKind,
      kindLabel: humanize(event.eventKind),
      outcomeLabel: readiness ?? normalizeActivityStatusLabel(event.status),
      outcomeTone: readiness
        ? toneForActivityReadiness(readiness)
        : toneForOperationalStatus(event.status),
      summary: buildActivitySummary(event.eventKind, readiness ?? normalizeActivityStatusLabel(event.status), 1, event.summary),
      actorId: event.actorId,
      latestTimestamp: event.timestamp,
      earliestTimestamp: event.timestamp,
      count: 1,
      signature: buildActivitySignature(event, readiness ?? normalizeActivityStatusLabel(event.status)),
    });
  }

  return groupedEntries;
};

const shouldCollapseActivityEvents = (
  entry: ActivityTimelineEntry,
  event: SkoposUiConsoleState['activity']['operationalEvents'][number],
): boolean => {
  const readiness = parseTrustReadiness(event.summary);

  return (
    entry.signature === buildActivitySignature(event, readiness ?? normalizeActivityStatusLabel(event.status))
  );
};

const buildActivitySignature = (
  event: SkoposUiConsoleState['activity']['operationalEvents'][number],
  outcomeLabel: string,
): string =>
  [
    event.eventKind,
    outcomeLabel,
    event.actorId ?? '',
    normalizeSummary(event.summary),
  ].join('::');

const buildActivitySummary = (
  eventKind: SkoposUiConsoleState['activity']['operationalEvents'][number]['eventKind'],
  outcomeLabel: string,
  count: number,
  rawSummary: string,
): string => {
  if (count <= 1) {
    return rawSummary;
  }

  if (eventKind === 'trust') {
    return `${count} trust checks completed with the same ${outcomeLabel} readiness result.`;
  }

  return `${count} ${humanize(eventKind).toLowerCase()} events recorded with the same ${outcomeLabel} outcome.`;
};

const normalizeActivityStatusLabel = (
  status: SkoposUiConsoleState['activity']['operationalEvents'][number]['status'],
): string => {
  switch (status) {
    case 'succeeded':
      return 'run complete';
    case 'failed':
      return 'failed';
    default:
      return 'dry run';
  }
};

const toneForOperationalStatus = (
  status: SkoposUiConsoleState['activity']['operationalEvents'][number]['status'],
): ActivityTone => {
  switch (status) {
    case 'succeeded':
      return 'positive';
    case 'failed':
      return 'danger';
    default:
      return 'warning';
  }
};

const toneForActivityMissionState = (
  state: SkoposUiConsoleState['activity']['missions'][number]['state'],
): ActivityTone => {
  switch (state) {
    case 'complete':
      return 'positive';
    case 'active':
      return 'warning';
    case 'blocked':
      return 'danger';
    default:
      return 'neutral';
  }
};

const parseTrustReadiness = (summary: string): 'agent-ready' | 'needs-review' | 'needs-stabilization' | undefined => {
  const match = /with\s+([a-z-]+)\s+readiness/i.exec(summary);
  const readiness = match?.[1];

  if (
    readiness === 'agent-ready' ||
    readiness === 'needs-review' ||
    readiness === 'needs-stabilization'
  ) {
    return readiness;
  }

  return undefined;
};

const toneForActivityReadiness = (
  readiness: 'agent-ready' | 'needs-review' | 'needs-stabilization',
): ActivityTone => {
  if (readiness === 'needs-stabilization') {
    return 'danger';
  }

  return toneForReadiness(readiness);
};

const groupActivityFeedEntriesByDay = (
  entries: ActivityFeedEntry[],
): ActivityFeedGroup[] => {
  const groups = new Map<string, ActivityFeedGroup>();

  for (const entry of entries) {
    const dayKey = buildActivityDayKey(entry.timestamp);
    const existingGroup = groups.get(dayKey);

    if (existingGroup) {
      existingGroup.entries.push(entry);
      continue;
    }

    groups.set(dayKey, {
      id: dayKey,
      label: buildActivityDayLabel(entry.timestamp),
      entries: [entry],
    });
  }

  return [...groups.values()];
};

const buildActivityDayKey = (value: string): string => {
  const parsed = Date.parse(value);

  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(parsed);
};

const buildActivityDayLabel = (value: string): string => {
  const parsed = Date.parse(value);

  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
  }).format(parsed);
};

const sortActivityFeedEntries = (left?: string, right?: string): number =>
  (Date.parse(right ?? '') || 0) - (Date.parse(left ?? '') || 0);

const normalizeSummary = (value: string): string =>
  value.replace(/\s+/g, ' ').trim().toLowerCase();
