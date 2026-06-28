import type { SkoposUiConsoleState } from '../../contracts/skopos-ui-console-state.js';
import type {
  SkoposUiConsoleSearchEntry,
  SkoposUiConsoleSearchIndex,
  SkoposUiConsoleSearchKind,
} from '../../contracts/skopos-ui-search.js';
import { navSections, resolveRouteMeta } from '../../app/routing/route-config.js';
import {
  documentLifecycleForDisplayPath,
  documentHrefForCategory,
  knowledgeCategoryForDocument,
} from '../knowledge/document-routing.js';
import {
  resolveProgramItemHref,
  resolveProgramObligationHref,
} from '../../platform/console-state/program-selectors.js';

export const buildSkoposConsoleSearchIndex = (
  state: SkoposUiConsoleState,
): SkoposUiConsoleSearchIndex => ({
  generatedAt: state.generatedAt,
  entries: buildSkoposConsoleSearchEntries(state),
});

export const buildSkoposConsoleSearchEntries = (
  state: SkoposUiConsoleState,
): SkoposUiConsoleSearchEntry[] => {
  const graphPortalLink = state.docsLinks.find((link) => link.id === 'graph-portal');
  const graphPortalHref = graphPortalLink?.href ?? '../graph-portal.html';

  return [
    ...buildRouteSearchEntries(),
    ...buildMemorySearchEntries(state),
    ...buildDocumentSearchEntries(state),
    ...buildDiscussionSearchEntries(state),
    ...buildPlanSearchEntries(state),
    ...buildMissionSearchEntries(state),
    ...buildProgramSearchEntries(state),
    ...buildValidationSearchEntries(state),
    ...buildScopeSearchEntries(state),
    ...buildActivitySearchEntries(state),
    ...buildGraphSearchEntries(state, graphPortalHref),
  ];
};

const buildDiscussionSearchEntries = (
  state: SkoposUiConsoleState,
): SkoposUiConsoleSearchEntry[] => {
  const latestDiscussionHandoff = state.latestDiscussionHandoff;
  const entries: SkoposUiConsoleSearchEntry[] = [];

  if (latestDiscussionHandoff) {
    const activeMissionId = latestDiscussionHandoff.handoff.activeMissionId;
    const activeMissionView = activeMissionId
      ? state.missions.find((missionView) => missionView.mission.id === activeMissionId)
      : undefined;

    entries.push({
      id: latestDiscussionHandoff.handoff.id,
      group: 'work',
      kind: 'discussion',
      title: activeMissionView
        ? `Discussion: ${activeMissionView.mission.title}`
        : 'Latest discussion handoff',
      summary: latestDiscussionHandoff.handoff.resumeSummary,
      meta: [
        latestDiscussionHandoff.handoff.handoffKind.replaceAll('-', ' '),
        activeMissionView ? 'active mission' : 'workspace',
      ].join(' · '),
      href: '#/discussion',
      aliases: [
        'discussion handoff',
        'recent discussion',
        latestDiscussionHandoff.handoff.currentDirection,
      ].filter((value): value is string => Boolean(value)),
      keywords: [
        latestDiscussionHandoff.handoff.id,
        latestDiscussionHandoff.handoff.currentDirection,
        latestDiscussionHandoff.handoff.resumeSummary,
        latestDiscussionHandoff.handoff.recommendedNextCommand,
        activeMissionView?.mission.title,
        ...latestDiscussionHandoff.handoff.acceptedDecisions.map((decision) => decision.title),
        ...latestDiscussionHandoff.handoff.openQuestions.map((question) => question.title),
      ].filter((value): value is string => Boolean(value)),
      canonical: true,
      active: true,
      historical: false,
      stale: false,
      updatedAt: latestDiscussionHandoff.handoff.updatedAt,
      scope: activeMissionView?.mission.scope.scope.id,
      defaultRank: 189,
    });
  }

  entries.push(
    ...state.discussionCheckpoints.map((checkpointView, index) => {
      const missionView = checkpointView.checkpoint.activeMissionId
        ? state.missions.find(
            (entry) => entry.mission.id === checkpointView.checkpoint.activeMissionId,
          )
        : undefined;

      return {
        id: checkpointView.checkpoint.id,
        group: 'work',
        kind: 'discussion',
        title: missionView
          ? `Checkpoint: ${missionView.mission.title}`
          : 'Discussion checkpoint',
        summary: checkpointView.checkpoint.resumeSummary,
        meta: [
          'checkpoint',
          missionView ? 'mission' : 'workspace',
          checkpointView.checkpoint.checkpointKind.replaceAll('-', ' '),
        ].join(' · '),
        href: '#/discussion',
        aliases: ['discussion checkpoint', checkpointView.checkpoint.currentDirection],
        keywords: [
          checkpointView.checkpoint.id,
          checkpointView.checkpoint.currentDirection,
          checkpointView.checkpoint.resumeSummary,
          checkpointView.checkpoint.recommendedNextCommand,
          missionView?.mission.title,
          ...checkpointView.checkpoint.acceptedDecisions.map((decision) => decision.title),
          ...checkpointView.checkpoint.openQuestions.map((question) => question.title),
        ].filter((value): value is string => Boolean(value)),
        canonical: true,
        active: index === 0,
        historical: false,
        stale: false,
        updatedAt: checkpointView.checkpoint.updatedAt,
        scope: missionView?.mission.scope.scope.id,
        defaultRank: index === 0 ? 187 : 168 - Math.min(index, 6),
      } satisfies SkoposUiConsoleSearchEntry;
    }),
  );

  return entries;
};

const buildRouteSearchEntries = (): SkoposUiConsoleSearchEntry[] => {
  const aliasesByPath: Record<string, string[]> = {
    '/overview': ['home', 'current work', 'workspace status'],
    '/missions': ['execution', 'work queue', 'open missions'],
    '/plans': ['plan library', 'current plans', 'work plans'],
    '/discussion': ['discussion history', 'workflow handoff', 'checkpoint history'],
    '/activity': ['timeline', 'provenance', 'history'],
    '/trust': ['readiness', 'quality', 'closure checks'],
    '/rules': ['policy', 'packs', 'accepted rules', 'drift', 'local exceptions'],
    '/proof': ['evidence', 'scorecard', 'benchmarks', 'validation proof'],
    '/memory': [
      'project knowledge',
      'what skopos knows',
      'project truth',
      'agent guidance',
      'AGENTS',
    ],
    '/docs': ['knowledge docs', 'documentation'],
    '/decisions': ['decision log', 'architecture decisions'],
    '/findings': ['issues', 'issue registry', 'active issues'],
    '/scopes': ['project map', 'packages', 'structure', 'workspace areas'],
  };
  const defaultRanksByPath: Record<string, number> = {
    '/overview': 200,
    '/missions': 194,
    '/plans': 192,
    '/discussion': 191,
    '/memory': 190,
    '/docs': 190,
    '/trust': 188,
    '/rules': 187,
    '/proof': 186,
    '/activity': 184,
    '/decisions': 182,
    '/findings': 180,
    '/scopes': 178,
  };

  const visibleRouteEntries = navSections.flatMap((section) =>
    section.items.map((item) => {
      const meta = resolveRouteMeta(item.to);
      return {
        id: `route-${item.to.replaceAll('/', '-') || 'overview'}`,
        group: 'jump',
        kind: 'route',
        title: meta.title,
        summary: meta.description,
        meta: section.label,
        href: `#${item.to}`,
        aliases: [item.label, ...(aliasesByPath[item.to] ?? [])],
        keywords: [section.label, meta.title, meta.description],
        canonical: true,
        active: true,
        historical: false,
        stale: false,
        routeId: item.to.slice(1),
        defaultRank: defaultRanksByPath[item.to] ?? 160,
      } satisfies SkoposUiConsoleSearchEntry;
    }),
  );

  return visibleRouteEntries;
};

const buildMemorySearchEntries = (
  state: SkoposUiConsoleState,
): SkoposUiConsoleSearchEntry[] => {
  const memoryView = state.memoryView;

  if (!memoryView) {
    return [];
  }

  return [
    {
      id: 'memory-map',
      group: 'docs',
      kind: 'artifact',
      title: 'What Skopos knows',
      summary: memoryView.memory.summary,
      meta: `project knowledge · ${memoryView.memory.freshness}`,
      href: '#/memory',
      aliases: ['project knowledge', 'what skopos knows', 'project truth', 'agent memory'],
      keywords: [
        memoryView.memory.summary,
        memoryView.memory.freshness,
        memoryView.memoryPath,
        memoryView.communicationBriefPath,
      ].filter((value): value is string => Boolean(value)),
      canonical: true,
      active: true,
      historical: false,
      stale: memoryView.memory.freshness === 'stale',
      updatedAt: memoryView.memory.updatedAt,
      defaultRank: 193,
    },
    ...memoryView.memory.roles.map((role, index) => ({
      id: `memory-role-${role.role}`,
      group: 'docs',
      kind: 'artifact',
      title: role.title,
      summary: role.summary,
      meta: `knowledge area · ${role.status}`,
      href: '#/memory',
      aliases: [role.role, role.title],
      keywords: [
        role.role,
        role.title,
        role.status,
        role.authority,
        role.summary,
        ...role.sources.map((source) => source.path),
        ...role.sources.map((source) => source.summary),
      ],
      canonical: true,
      active: role.status !== 'missing',
      historical: false,
      stale: role.status === 'stale',
      updatedAt: memoryView.memory.updatedAt,
      defaultRank: 176 - Math.min(index, 12),
    } satisfies SkoposUiConsoleSearchEntry)),
  ];
};

const buildDocumentSearchEntries = (
  state: SkoposUiConsoleState,
): SkoposUiConsoleSearchEntry[] =>
  state.documents.map((document) => {
    const category = knowledgeCategoryForDocument(document);
    const lifecycle = document.lifecycle ?? documentLifecycleForDisplayPath(document.displayPath);
    const kind = resolveDocumentSearchKind(document, category);
    const summary = document.summary || document.excerpt || document.displayPath;
    const metaParts = [searchLabelForDocumentCategory(category)];
    if (document.format !== 'unknown') {
      metaParts.push(document.format);
    }

    return {
      id: document.id,
      group: 'docs',
      kind,
      title: document.title,
      summary,
      meta: metaParts.join(' · '),
      href: documentHrefForCategory(category, document.id),
      aliases: document.headings.slice(0, 6),
      keywords: [
        document.displayPath,
        document.format,
        document.kind,
        ...document.headings,
        document.summary,
        document.excerpt,
      ].filter((value): value is string => Boolean(value)),
      headings: document.headings,
      excerpt: document.excerpt,
      canonical: category !== 'docs' || document.kind === 'doc' || Boolean(document.artifactView),
      active: lifecycle === 'active',
      historical: lifecycle === 'historical',
      stale: !document.exists,
      updatedAt: document.updatedAt,
      defaultRank:
        lifecycle === 'historical'
          ? 132
          : document.id === 'docs-start'
          ? 196
          : document.id === 'doc-project-overview'
            ? 184
            : document.id === 'doc-project-system-ui-plan'
              ? 182
              : document.id.startsWith('doc-decisions-')
                ? 174
                : document.id.startsWith('doc-findings-')
                  ? 170
                  : document.artifactView
                    ? 166
                    : lifecycle === 'active'
                      ? 172
                      : 160,
    } satisfies SkoposUiConsoleSearchEntry;
  });

const buildPlanSearchEntries = (state: SkoposUiConsoleState): SkoposUiConsoleSearchEntry[] =>
  state.plans.map((planView) => {
    const relatedMission = state.missions.find(
      (missionView) => missionView.mission.planId === planView.plan.id,
    );
    const scopeId = planView.plan.scope?.scope.id ?? planView.plan.scope?.query;
    const isActive = Boolean(relatedMission && relatedMission.mission.state !== 'complete');

    return {
      id: planView.plan.id,
      group: 'work',
      kind: 'plan',
      title: planView.plan.title,
      summary: planView.plan.summary || planView.plan.goal || planView.artifactPath,
      meta: [scopeId, isActive ? 'current' : 'library'].filter(Boolean).join(' · '),
      href: `#/plans/${encodeURIComponent(planView.plan.id)}`,
      aliases: [planView.plan.goal].filter((value): value is string => Boolean(value)),
      keywords: [
        planView.plan.id,
        planView.plan.goal,
        planView.plan.summary,
        planView.plan.scope?.query,
        scopeId,
        relatedMission?.mission.title,
      ].filter((value): value is string => Boolean(value)),
      canonical: true,
      active: isActive,
      historical: false,
      stale: false,
      updatedAt: planView.plan.updatedAt,
      scope: scopeId,
      defaultRank: isActive ? 188 : 162,
    } satisfies SkoposUiConsoleSearchEntry;
  });

const buildMissionSearchEntries = (state: SkoposUiConsoleState): SkoposUiConsoleSearchEntry[] =>
  state.missions.map((missionView) => {
    const scopeId = missionView.mission.scope?.scope.id ?? missionView.mission.scope?.query;
    const stateLabel = missionView.mission.state;

    return {
      id: missionView.mission.id,
      group: 'work',
      kind: 'mission',
      title: missionView.mission.title,
      summary: missionView.mission.summary || missionView.mission.objective || missionView.artifactPath,
      meta: [scopeId, stateLabel].filter(Boolean).join(' · '),
      href: `#/missions/${encodeURIComponent(missionView.mission.id)}`,
      aliases: [
        missionView.mission.objective,
        missionView.mission.planId,
        missionView.mission.coordination?.claimedBy?.actorId,
      ].filter((value): value is string => Boolean(value)),
      keywords: [
        missionView.mission.id,
        missionView.mission.objective,
        missionView.mission.summary,
        missionView.mission.planId,
        missionView.mission.scope?.query,
        scopeId,
        missionView.mission.coordination?.claimedBy?.actorId,
      ].filter((value): value is string => Boolean(value)),
      canonical: true,
      active: missionView.mission.state !== 'complete',
      historical: false,
      stale: false,
      updatedAt: missionView.mission.updatedAt,
      scope: scopeId,
      defaultRank: missionView.mission.state === 'active' ? 194 : 168,
    } satisfies SkoposUiConsoleSearchEntry;
  });

const buildProgramSearchEntries = (
  state: SkoposUiConsoleState,
): SkoposUiConsoleSearchEntry[] => {
  const programState = state.programState;

  if (!programState) {
    return [];
  }

  const sequenceItemIds = [
    programState.sequence.doNow,
    programState.sequence.doNext,
    programState.sequence.interruptRecommendation.itemId,
  ].filter((value, index, values): value is string => Boolean(value) && values.indexOf(value) === index);

  const itemEntries = sequenceItemIds
    .map((itemId) => programState.items.find((item) => item.id === itemId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => {
      const sequenceLabel =
        item.id === programState.sequence.doNow
          ? 'do now'
          : item.id === programState.sequence.doNext
            ? 'do next'
            : 'interrupt';

      return {
        id: `program-${item.id}`,
        group: 'work',
        kind: 'program',
        title: `${titleCase(sequenceLabel)}: ${item.title}`,
        summary: item.summary,
        meta: [item.priority, item.recommendedDisposition.replaceAll('-', ' ')].join(' · '),
        href: resolveProgramItemHref(state, item) ?? '#/overview',
        aliases: [sequenceLabel, item.sourceKind, item.scope.title, item.scope.id],
        keywords: [
          item.id,
          item.title,
          item.summary,
          item.sourceKind,
          item.priority,
          item.recommendedDisposition,
          item.whyNow,
          item.scope.id,
          item.scope.title,
        ].filter((value): value is string => Boolean(value)),
        canonical: true,
        active: item.status !== 'done',
        historical: false,
        stale: false,
        updatedAt: programState.updatedAt,
        scope: item.scope.id,
        defaultRank: sequenceLabel === 'do now' ? 198 : sequenceLabel === 'do next' ? 189 : 186,
      } satisfies SkoposUiConsoleSearchEntry;
    });

  const obligationEntries = programState.obligations
    .filter((obligation) => obligation.status === 'open')
    .map((obligation) => {
      const linkedItem = programState.items.find((item) => item.id === obligation.linkedItemId);
      const group =
        obligation.kind === 'validation' || obligation.kind === 'workflows'
          ? 'validation'
          : 'work';
      const isCurrentItem = linkedItem?.id === programState.sequence.doNow;

      return {
        id: `obligation-${obligation.id}`,
        group,
        kind: 'obligation',
        title: obligation.title,
        summary: obligation.reason,
        meta: [obligation.kind, linkedItem?.title].filter(Boolean).join(' · '),
        href: resolveProgramObligationHref(state, obligation) ?? '#/overview',
        aliases: [
          'program obligation',
          obligation.kind,
          obligation.targetRef,
          linkedItem?.title,
          linkedItem?.sourceKind,
        ].filter((value): value is string => Boolean(value)),
        keywords: [
          obligation.id,
          obligation.title,
          obligation.reason,
          obligation.kind,
          obligation.targetRef,
          linkedItem?.id,
          linkedItem?.title,
          linkedItem?.summary,
        ].filter((value): value is string => Boolean(value)),
        canonical: true,
        active: true,
        historical: false,
        stale: false,
        updatedAt: programState.updatedAt,
        scope: linkedItem?.scope.id,
        defaultRank: isCurrentItem ? 193 : 176,
      } satisfies SkoposUiConsoleSearchEntry;
    });

  return [...itemEntries, ...obligationEntries];
};

const buildValidationSearchEntries = (
  state: SkoposUiConsoleState,
): SkoposUiConsoleSearchEntry[] => {
  const entries: SkoposUiConsoleSearchEntry[] = [
    {
      id: 'validation-trust',
      group: 'validation',
      kind: 'report',
      title: 'Readiness',
      summary: state.trustReport.summary,
      meta: `${state.trustReport.trustLevel} · ${state.trustReport.readiness}`,
      href: '#/trust',
      aliases: ['trust', 'readiness', 'quality', 'closure'],
      keywords: [
        state.trustReport.trustLevel,
        state.trustReport.readiness,
        ...state.trustReport.checks.flatMap((check) => [check.id, check.summary]),
        ...state.trustReport.findings,
        ...state.trustReport.unresolvedAssumptions,
      ],
      canonical: true,
      active: true,
      historical: false,
      stale: false,
      updatedAt: state.generatedAt,
      defaultRank: 190,
    },
  ];

  if (state.proofReport) {
    const scorecard = state.proofReport.scorecard;
    entries.push({
      id: 'validation-proof',
      group: 'validation',
      kind: 'report',
      title: 'Evidence scorecard',
      summary: `Benchmark posture with ${scorecard.passedBenchmarks}/${scorecard.benchmarkCount} passing benchmarks and ${scorecard.failedBenchmarks} failures.`,
      meta: `${scorecard.status} · ${scorecard.weightedPassRate}% pass`,
      href: '#/proof',
      aliases: ['proof', 'evidence', 'scorecard', 'benchmark report'],
      keywords: [
        scorecard.status,
        ...scorecard.categorySummaries.map((category) => category.category),
      ],
      canonical: true,
      active: true,
      historical: false,
      stale: false,
      updatedAt: state.proofReport.updatedAt,
      defaultRank: 184,
    });
  }

  for (const packView of state.policyReview?.packManifests ?? []) {
    const manifest = packView.manifest;
    entries.push({
      id: `policy-pack-${manifest.packId}`,
      group: 'validation',
      kind: 'report',
      title: manifest.displayName,
      summary: manifest.plainLanguageSummary ?? manifest.description,
      meta: [manifest.family, manifest.variant].join(' · '),
      href: `#/rules/packs/${encodeURIComponent(manifest.packId)}`,
      aliases: [
        'policy pack',
        'rule pack',
        'pack details',
        'structure tree',
        manifest.packId,
        manifest.displayName,
      ],
      keywords: [
        manifest.packId,
        manifest.summary,
        manifest.description,
        manifest.plainLanguageSummary,
        ...(manifest.bestFor ?? []),
        ...(manifest.notFor ?? []),
        ...(manifest.userQuestions ?? []),
        ...(manifest.recommendedLayers ?? []),
        ...(manifest.structureTree?.nodes.flatMap((node) => [
          node.path,
          node.label,
          node.responsibility,
          ...(node.matchPaths ?? []),
        ]) ?? []),
        ...manifest.rules.flatMap((rule) => [
          rule.id,
          rule.title,
          rule.summary,
          ...(rule.examples ?? []),
          ...(rule.antiPatterns ?? []),
        ]),
      ].filter((value): value is string => Boolean(value)),
      canonical: true,
      active: state.policyReview?.resolvedPolicy?.policy.acceptedPacks.some(
        (pack) => pack.packId === manifest.packId,
      ) ?? false,
      historical: false,
      stale: false,
      updatedAt: manifest.updatedAt ?? state.generatedAt,
      defaultRank: 183,
    });
  }

  return entries;
};

const buildScopeSearchEntries = (state: SkoposUiConsoleState): SkoposUiConsoleSearchEntry[] =>
  state.scopes.map((scopeView) => ({
    id: scopeView.scope.id,
    group: 'structure',
    kind: 'scope',
    title: scopeView.scope.title || scopeView.scope.id,
    summary:
      scopeView.scope.summary ||
      'Workspace package, docs root, or instruction surface tracked by Skopos.',
    meta: [
      scopeView.scope.kind,
      scopeView.scope.path,
      scopeView.relatedMissionCount > 0 ? `${scopeView.relatedMissionCount} mission` : undefined,
    ]
      .filter((value): value is string => Boolean(value))
      .join(' · '),
    href: `#/scopes/${encodeURIComponent(scopeView.scope.id)}`,
    aliases: scopeView.scope.aliases ?? [],
    keywords: [
      scopeView.scope.id,
      scopeView.scope.title,
      scopeView.scope.path,
      scopeView.scope.summary,
      ...(scopeView.scope.aliases ?? []),
    ].filter((value): value is string => Boolean(value)),
    canonical: true,
    active: scopeView.relatedMissionCount > 0 || scopeView.relatedPlanCount > 0,
    historical: false,
    stale: false,
    updatedAt: state.generatedAt,
    scope: scopeView.scope.id,
    defaultRank: scopeView.scope.id === 'workspace' ? 186 : 160,
  }));

const buildActivitySearchEntries = (state: SkoposUiConsoleState): SkoposUiConsoleSearchEntry[] => [
  ...state.activity.workflowRuns.map((workflowRun, index) => ({
    id: workflowRun.id,
    group: 'activity' as const,
    kind: 'workflow' as const,
    title: workflowRun.workflowTitle,
    summary: `Workflow run ${workflowRun.runStatus}.`,
    meta: [workflowRun.runStatus, workflowRun.runByActorId].filter(Boolean).join(' · '),
    href: '#/activity',
    aliases: [workflowRun.workflowId],
    keywords: [
      workflowRun.id,
      workflowRun.workflowId,
      workflowRun.workflowTitle,
      workflowRun.runStatus,
      workflowRun.runByActorId,
      ...workflowRun.outputPaths,
    ].filter((value): value is string => Boolean(value)),
    canonical: true,
    active: index < 3,
    historical: false,
    stale: false,
    updatedAt: workflowRun.finishedAt,
    defaultRank: index === 0 ? 172 : 154 - index,
  })),
  ...state.activity.operationalEvents.map((event, index) => ({
    id: event.id,
    group: 'activity' as const,
    kind: 'event' as const,
    title: titleCase(event.eventKind.replaceAll('-', ' ')),
    summary: event.summary,
    meta: [event.status, event.actorId].filter(Boolean).join(' · '),
    href: '#/activity',
    aliases: [],
    keywords: [event.id, event.eventKind, event.status, event.actorId, event.summary].filter(
      (value): value is string => Boolean(value),
    ),
    canonical: true,
    active: index < 4,
    historical: false,
    stale: false,
    updatedAt: event.timestamp,
    defaultRank: index === 0 ? 170 : 150 - index,
  })),
];

const buildGraphSearchEntries = (
  state: SkoposUiConsoleState,
  graphPortalHref: string,
): SkoposUiConsoleSearchEntry[] => [
  {
    id: 'graph-portal',
    group: 'graphs',
    kind: 'portal',
    title: 'Graph portal',
    summary: 'Curated relationship views for docs, commands, scopes, missions, and impact.',
    meta: `${state.graphs.graphs.length} graph views`,
    href: graphPortalHref,
    external: true,
    aliases: ['graph', 'graph explorer', 'relationship map'],
    keywords: ['portal', 'graphs', ...state.graphs.graphPaths],
    canonical: true,
    active: true,
    historical: false,
    stale: false,
    updatedAt: state.generatedAt,
    defaultRank: 180,
  },
  ...state.graphs.graphs.map((graph, index) => ({
    id: graph.id,
    group: 'graphs' as const,
    kind: 'graph' as const,
    title: graph.title,
    summary: graph.summary,
    meta: `${graph.focusLabel} · ${graph.nodeCount} nodes · ${graph.edgeCount} edges`,
    href: graphPortalHref,
    external: true,
    aliases: [graph.focusLabel],
    keywords: [
      graph.id,
      graph.kind,
      graph.focusLabel,
      ...graph.highlights.flatMap((group) => [group.title, ...group.items]),
    ],
    canonical: true,
    active: index < 3,
    historical: false,
    stale: false,
    updatedAt: state.generatedAt,
    defaultRank: index === 0 ? 176 : 152 - index,
  })),
];

const resolveDocumentSearchKind = (
  document: SkoposUiConsoleState['documents'][number],
  category: ReturnType<typeof knowledgeCategoryForDocument>,
): SkoposUiConsoleSearchKind => {
  if (category === 'decisions') {
    return 'decision';
  }

  if (category === 'findings') {
    return 'finding';
  }

  if (document.kind === 'portal') {
    return 'portal';
  }

  if (document.kind === 'report') {
    return 'report';
  }

  if (document.artifactView || document.kind === 'artifact' || document.kind === 'config') {
    return 'artifact';
  }

  return 'doc';
};

const searchLabelForDocumentCategory = (
  category: ReturnType<typeof knowledgeCategoryForDocument>,
): string => {
  switch (category) {
    case 'decisions':
      return 'Decision';
    case 'findings':
      return 'Finding';
    default:
      return 'Doc';
  }
};

const titleCase = (value: string): string =>
  value.replace(/\b\w/g, (segment) => segment.toUpperCase());
