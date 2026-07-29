import type { SkoposResolvedGuard } from '@skopos/model';

import type { SkoposUiConsoleState } from '../../contracts/skopos-ui-console-state.js';
import { humanize } from '../../support/formatting/console-formatting.js';
import { toneForReadiness } from '../../support/ui/tone-helpers.js';

interface InspectorItem {
  label: string;
  value: string;
}

type ActivityTone = 'neutral' | 'positive' | 'warning' | 'danger';

export interface ReadinessViewContext {
  passChecks: SkoposUiConsoleState['readinessReport']['checks'];
  warningChecks: SkoposUiConsoleState['readinessReport']['checks'];
  failureChecks: SkoposUiConsoleState['readinessReport']['checks'];
  allChecks: SkoposUiConsoleState['readinessReport']['checks'];
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

export interface PolicyPackSummary {
  packId: string;
  displayName: string;
  summary: string;
  reason: string;
  source: string;
  acceptedBy?: string;
  acceptedAt: string;
  family?: string;
  variant?: string;
}

export interface PolicyPackDetail extends PolicyPackSummary {
  description: string;
  bestFor: string[];
  notFor: string[];
  userQuestions: string[];
  qualityBar: string[];
  agentUse: string[];
  projectLifecycles: string[];
  appliesWhen: Array<{
    id: string;
    summary: string;
    confidence: string;
    evidence: string[];
  }>;
  avoidWhen: Array<{
    id: string;
    summary: string;
    confidence: string;
    evidence: string[];
  }>;
  structureMatch?: NonNullable<
    NonNullable<SkoposUiConsoleState['policyReview']>['packManifests'][number]['structureMatch']
  >;
  roleMappingArtifactPath?: string;
  roleMappings: NonNullable<
    NonNullable<SkoposUiConsoleState['policyReview']>['roleMapping']
  >['mapping']['mappings'];
  recommendedLayers: string[];
  dependencyDirection: Array<{
    layer: string;
    mayImport: string[];
  }>;
  forbiddenImports: Array<{
    from: string;
    to: string[];
  }>;
  guards?: {
    required: string[];
    recommended: string[];
  };
  resolvedGuards: SkoposResolvedGuard[];
  guardCounts: {
    available: number;
    manual: number;
    missing: number;
    missingRequired: number;
  };
  agentPrompts?: {
    beforeEditing: string[];
    beforeReadiness: string[];
  };
  rules: NonNullable<
    NonNullable<SkoposUiConsoleState['policyReview']>['resolvedPolicy']
  >['policy']['activeRules'];
  ruleCounts: {
    must: number;
    should: number;
    advisory: number;
  };
  generatedArtifacts: string[];
  driftCheckIds: string[];
  proofFixtureIds: string[];
  sourcePath?: string;
  manifestPath?: string;
}

export interface PolicyViewContext {
  resolvedPolicy: SkoposUiConsoleState['policyReview'] extends infer T
    ? T extends { resolvedPolicy?: infer U }
      ? U extends { policy: infer P }
        ? P
        : undefined
      : undefined
    : undefined;
  driftReport: SkoposUiConsoleState['policyReview'] extends infer T
    ? T extends { driftReport?: infer U }
      ? U extends { report: infer P }
        ? P
        : undefined
      : undefined
    : undefined;
  acceptedPacks: PolicyPackSummary[];
  packDetails: PolicyPackDetail[];
  localOverrides: NonNullable<
    NonNullable<SkoposUiConsoleState['policyReview']>['resolvedPolicy']
  >['policy']['overrides'];
  mustRules: NonNullable<
    NonNullable<SkoposUiConsoleState['policyReview']>['resolvedPolicy']
  >['policy']['activeRules'];
  shouldRules: NonNullable<
    NonNullable<SkoposUiConsoleState['policyReview']>['resolvedPolicy']
  >['policy']['activeRules'];
  advisoryRules: NonNullable<
    NonNullable<SkoposUiConsoleState['policyReview']>['resolvedPolicy']
  >['policy']['activeRules'];
  openDriftFindings: NonNullable<
    NonNullable<SkoposUiConsoleState['policyReview']>['driftReport']
  >['report']['findings'];
  suppressedDriftFindings: NonNullable<
    NonNullable<SkoposUiConsoleState['policyReview']>['driftReport']
  >['report']['findings'];
  taskRisks: NonNullable<
    NonNullable<SkoposUiConsoleState['policyReview']>['resolvedPolicy']
  >['policy']['recommendedTaskRisks'];
  resolvedGuards?: NonNullable<NonNullable<SkoposUiConsoleState['policyReview']>['guards']>['resolved'];
  sourceItems: InspectorItem[];
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
  feedKind: 'event' | 'task' | 'plan' | 'action';
  kindLabel: string;
  statusLabel?: string;
  statusTone?: ActivityTone;
  countLabel?: string;
  headline: string;
  summary?: string;
  actorId?: string;
  timestamp: string;
  rangeStart?: string;
  taskId?: string;
  planId?: string;
}

export interface ActivityFeedGroup {
  id: string;
  label: string;
  entries: ActivityFeedEntry[];
}

export const getReadinessViewContext = (state: SkoposUiConsoleState): ReadinessViewContext => {
  const passChecks = state.readinessReport.checks.filter((check) => check.status === 'pass');
  const warningChecks = state.readinessReport.checks.filter((check) => check.status === 'warn');
  const failureChecks = state.readinessReport.checks.filter((check) => check.status === 'fail');

  return {
    passChecks,
    warningChecks,
    failureChecks,
    allChecks: state.readinessReport.checks,
    sourceLinks: state.docsLinks.filter((link) => ['doc', 'artifact', 'report'].includes(link.kind)),
    workspaceSignalItems: [
      {
        label: 'Packages',
        value:
          state.readinessReport.detected.packageCount === state.readinessReport.detected.workspacePackageCount
            ? `${state.readinessReport.detected.workspacePackageCount} workspace packages`
            : `${state.readinessReport.detected.workspacePackageCount}/${state.readinessReport.detected.packageCount} workspace packages`,
      },
      { label: 'Repo mode', value: humanize(state.readinessReport.detected.repoMode) },
      { label: 'Archetype', value: humanize(state.readinessReport.detected.archetypeSuggestion) },
      ...(state.readinessReport.detected.frameworks.length > 0
        ? [{ label: 'Frameworks', value: state.readinessReport.detected.frameworks.join(' · ') }]
        : []),
      ...(state.readinessReport.detected.languages.length > 0
        ? [{ label: 'Languages', value: state.readinessReport.detected.languages.join(' · ') }]
        : []),
      ...(state.readinessReport.detected.instructionFiles.length > 0
        ? [{ label: 'Instruction files', value: String(state.readinessReport.detected.instructionFiles.length) }]
        : []),
    ],
    docsPostureItems: [
      {
        label: 'Docs root',
        value: state.readinessReport.detected.docsHealth.root ?? 'No canonical docs root detected',
      },
      {
        label: 'Docs start',
        value: state.readinessReport.detected.docsHealth.hasStartHere
          ? 'Canonical start present'
          : 'Canonical docs start missing',
      },
      {
        label: 'Tracked docs',
        value: `${state.readinessReport.detected.docsHealth.markdownFileCount} markdown docs`,
      },
      ...(state.readinessReport.detected.docsHealth.freshnessTrackedCount > 0
        ? [{
            label: 'Freshness tracked',
            value: `${state.readinessReport.detected.docsHealth.freshnessTrackedCount} docs`,
          }]
        : []),
      ...(state.readinessReport.detected.docsHealth.staleDocPaths.length > 0
        ? [{
            label: 'Stale docs',
            value: `${state.readinessReport.detected.docsHealth.staleDocPaths.length} flagged`,
          }]
        : []),
      ...(state.readinessReport.detected.ignoredPaths.length > 0
        ? [{ label: 'Ignored roots', value: state.readinessReport.detected.ignoredPaths.join(' · ') }]
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

export const getPolicyViewContext = (state: SkoposUiConsoleState): PolicyViewContext => {
  const resolvedPolicy = state.policyReview?.resolvedPolicy?.policy;
  const driftReport = state.policyReview?.driftReport?.report;
  const resolvedGuards = state.policyReview?.guards?.resolved;
  const recommendationByPackId = new Map(
    (state.policyReview?.recommendations?.recommendations.recommendations ?? []).map(
      (recommendation) => [recommendation.packId, recommendation],
    ),
  );
  const manifestByPackId = new Map(
    (state.policyReview?.packManifests ?? []).map((view) => [view.manifest.packId, view]),
  );
  const acceptedPackById = new Map(
    (resolvedPolicy?.acceptedPacks ?? []).map((pack) => [pack.packId, pack]),
  );
  const localOverrides =
    state.policyReview?.overrides?.overrides.overrides ?? resolvedPolicy?.overrides ?? [];
  const activeRules = resolvedPolicy?.activeRules ?? [];
  const findings = driftReport?.findings ?? [];
  const acceptedPacks =
    resolvedPolicy?.acceptedPacks.map((pack) => {
      const recommendation = recommendationByPackId.get(pack.packId);
      const manifestView = manifestByPackId.get(pack.packId);
      const manifest = manifestView?.manifest;

      return {
        packId: pack.packId,
        displayName: manifest?.displayName ?? recommendation?.displayName ?? humanize(pack.packId),
        summary:
          manifest?.plainLanguageSummary ??
          recommendation?.plainLanguageSummary ??
          recommendation?.reason ??
          manifest?.summary ??
          'Accepted project rule pack.',
        reason: pack.reason,
        source: humanize(pack.source),
        acceptedBy: pack.acceptedBy,
        acceptedAt: pack.acceptedAt,
        family: humanize(manifest?.family ?? recommendation?.family ?? ''),
        variant: humanize(manifest?.variant ?? recommendation?.variant ?? ''),
      };
    }) ?? [];

  return {
    resolvedPolicy,
    driftReport,
    acceptedPacks,
    packDetails: Array.from(
      new Set([...manifestByPackId.keys(), ...acceptedPacks.map((pack) => pack.packId)]),
    )
      .sort((left, right) => left.localeCompare(right))
      .map((packId) => {
      const acceptedPack = acceptedPackById.get(packId);
      const acceptedSummary = acceptedPacks.find((pack) => pack.packId === packId);
      const recommendation = recommendationByPackId.get(packId);
      const manifestView = manifestByPackId.get(packId);
      const manifest = manifestView?.manifest;
      const rules = acceptedPack
        ? activeRules.filter((rule) => rule.id.startsWith(`${packId}.`))
        : manifest?.rules ?? [];
      const packGuards =
        resolvedGuards?.guards.filter((guard) => guard.packId === packId) ?? [];
      const roleMappings =
        state.policyReview?.roleMapping?.mapping.mappings.filter((mapping) => mapping.packId === packId) ?? [];

      return {
        packId,
        displayName:
          manifest?.displayName ??
          acceptedSummary?.displayName ??
          recommendation?.displayName ??
          humanize(packId),
        summary:
          manifest?.plainLanguageSummary ??
          acceptedSummary?.summary ??
          recommendation?.plainLanguageSummary ??
          recommendation?.reason ??
          manifest?.summary ??
          'Available project rule pack.',
        reason: acceptedPack?.reason ?? recommendation?.reason ?? 'Available to review before applying.',
        source: acceptedPack ? humanize(acceptedPack.source) : 'Available',
        acceptedBy: acceptedPack?.acceptedBy,
        acceptedAt: acceptedPack?.acceptedAt ?? '',
        family: humanize(manifest?.family ?? recommendation?.family ?? ''),
        variant: humanize(manifest?.variant ?? recommendation?.variant ?? ''),
        description:
          manifest?.description ??
          recommendation?.reason ??
          'This pack contributes project guidance for agents and developers.',
        bestFor: manifest?.bestFor ?? [],
        notFor: manifest?.notFor ?? [],
        userQuestions: manifest?.userQuestions ?? [],
        qualityBar: recommendation?.qualityBar ?? manifest?.qualityBar ?? [],
        agentUse: manifest?.agentUse ?? [],
        projectLifecycles: (manifest?.projectLifecycles ?? []).map(humanize),
        appliesWhen: (manifest?.appliesWhen ?? recommendation?.signals ?? []).map((signal) => ({
          id: signal.id,
          summary: signal.summary,
          confidence: humanize(signal.confidence),
          evidence: signal.evidence,
        })),
        avoidWhen: (manifest?.avoidWhen ?? recommendation?.antiSignals ?? []).map((signal) => ({
          id: signal.id,
          summary: signal.summary,
          confidence: humanize(signal.confidence),
          evidence: signal.evidence,
        })),
        structureMatch: manifestView?.structureMatch,
        roleMappingArtifactPath: state.policyReview?.roleMapping?.artifactPath,
        roleMappings,
        recommendedLayers: manifest?.recommendedLayers ?? [],
        dependencyDirection: Object.entries(manifest?.dependencyDirection ?? {}).map(
          ([layer, direction]) => ({
            layer,
            mayImport: direction.mayImport,
          }),
        ),
        forbiddenImports: manifest?.forbiddenImports ?? [],
        guards: manifest?.guards,
        resolvedGuards: packGuards,
        guardCounts: {
          available: packGuards.filter((guard) => guard.status === 'available').length,
          manual: packGuards.filter((guard) => guard.status === 'manual').length,
          missing: packGuards.filter((guard) => guard.status === 'missing').length,
          missingRequired: packGuards.filter(
            (guard) => guard.status === 'missing' && guard.strength === 'required',
          ).length,
        },
        agentPrompts: manifest?.agentPrompts,
        rules,
        ruleCounts: {
          must: rules.filter((rule) => rule.severity === 'must').length,
          should: rules.filter((rule) => rule.severity === 'should').length,
          advisory: rules.filter((rule) => rule.severity === 'advisory').length,
        },
        generatedArtifacts: manifest?.generatedArtifacts ?? [],
        driftCheckIds: manifest?.driftCheckIds ?? [],
        proofFixtureIds: manifest?.proofFixtureIds ?? [],
        sourcePath: recommendation?.sourcePath ?? manifestView?.artifactPath,
        manifestPath: manifestView?.artifactPath,
      };
    }),
    localOverrides,
    mustRules: activeRules.filter((rule) => rule.severity === 'must'),
    shouldRules: activeRules.filter((rule) => rule.severity === 'should'),
    advisoryRules: activeRules.filter((rule) => rule.severity === 'advisory'),
    openDriftFindings: findings.filter((finding) => finding.status === 'open'),
    suppressedDriftFindings: findings.filter((finding) => finding.status === 'suppressed'),
    taskRisks: resolvedPolicy?.recommendedTaskRisks ?? [],
    resolvedGuards,
    sourceItems: [
      ...(state.policyReview?.resolvedPolicy
        ? [{ label: 'Accepted rules', value: state.policyReview.resolvedPolicy.artifactPath }]
        : []),
      ...(state.policyReview?.recommendations
        ? [{ label: 'Suggestions', value: state.policyReview.recommendations.artifactPath }]
        : []),
      ...(state.policyReview?.driftReport
        ? [{ label: 'Rule drift', value: state.policyReview.driftReport.artifactPath }]
        : []),
      ...(state.policyReview?.roleMapping
        ? [{ label: 'Role mapping', value: state.policyReview.roleMapping.artifactPath }]
        : []),
      ...(state.policyReview?.guards
        ? [{ label: 'Guard resolution', value: state.policyReview.guards.artifactPath }]
        : []),
      ...(state.policyReview?.overrides
        ? [{ label: 'Local exceptions', value: state.policyReview.overrides.artifactPath }]
        : []),
    ],
  };
};

export const getActivityViewContext = (state: SkoposUiConsoleState): ActivityViewContext => {
  const actorCount = new Set(
    [
      ...state.activity.operationalEvents.map((event) => event.actorId),
      ...state.activity.plans.map((plan) => plan.createdByActorId),
      ...state.activity.tasks.map((task) => task.lastUpdatedByActorId ?? task.claimedByActorId),
      ...state.activity.actionRuns.map((run) => run.runByActorId),
    ].filter(Boolean),
  ).size;
  const operationalEntries = buildActivityTimelineEntries(state.activity.operationalEvents);
  const feedEntries = buildActivityFeedEntries({
    operationalEntries,
    plans: state.activity.plans,
    tasks: state.activity.tasks,
    actionRuns: state.activity.actionRuns,
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
      ...(state.activity.tasks.length > 0
        ? [{ label: 'Tasks', value: String(state.activity.tasks.length) }]
        : []),
      ...(state.activity.actionRuns.length > 0
        ? [{ label: 'Action runs', value: String(state.activity.actionRuns.length) }]
        : []),
      ...(actorCount > 0 ? [{ label: 'Actors', value: String(actorCount) }] : []),
    ],
    feedGroups: groupActivityFeedEntriesByDay(feedEntries),
  };
};

const buildActivityFeedEntries = ({
  operationalEntries,
  plans,
  tasks,
  actionRuns,
}: {
  operationalEntries: ActivityTimelineEntry[];
  plans: SkoposUiConsoleState['activity']['plans'];
  tasks: SkoposUiConsoleState['activity']['tasks'];
  actionRuns: SkoposUiConsoleState['activity']['actionRuns'];
}): ActivityFeedEntry[] =>
  [
    ...operationalEntries.map((entry) => buildOperationalFeedEntry(entry)),
    ...plans.map((plan) => buildPlanFeedEntry(plan)),
    ...tasks.map((task) => buildTaskFeedEntry(task)),
    ...actionRuns.map((run) => buildActionFeedEntry(run)),
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

const buildTaskFeedEntry = (
  task: SkoposUiConsoleState['activity']['tasks'][number],
): ActivityFeedEntry => ({
  id: `task-${task.id}`,
  feedKind: 'task',
  kindLabel: 'Task',
  statusLabel: humanize(task.state),
  statusTone: toneForActivityTaskState(task.state),
  headline: task.title,
  summary: `${task.pendingStepCount} pending items · ${task.childTaskCount} linked slices`,
  actorId: task.lastUpdatedByActorId ?? task.claimedByActorId,
  timestamp: task.updatedAt ?? '',
  taskId: task.id,
});

const buildActionFeedEntry = (
  run: SkoposUiConsoleState['activity']['actionRuns'][number],
): ActivityFeedEntry => ({
  id: `action-${run.id}`,
  feedKind: 'action',
  kindLabel: 'Action',
  statusLabel: humanize(run.runStatus),
  statusTone:
    run.runStatus === 'succeeded'
      ? 'positive'
      : run.runStatus === 'failed'
        ? 'danger'
        : 'warning',
  headline: run.actionTitle,
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

    const readiness = parseReadinessReadiness(event.summary);

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
  const readiness = parseReadinessReadiness(event.summary);

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

  if (eventKind === 'readiness') {
    return `${count} Readiness checks completed with the same ${outcomeLabel} result.`;
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

const toneForActivityTaskState = (
  state: SkoposUiConsoleState['activity']['tasks'][number]['state'],
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

const parseReadinessReadiness = (summary: string): 'agent-ready' | 'needs-review' | 'needs-stabilization' | undefined => {
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

  return readiness === 'agent-ready' ? 'positive' : 'warning';
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
