import { readFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

import { buildSkoposTrustReport } from '@skopos/trust';
import type {
  SkoposEvalArtifact,
  SkoposMissionArtifact,
  SkoposProgramAttention,
  SkoposProgramInterruptRecommendation,
  SkoposProgramItem,
  SkoposProgramObligation,
  SkoposProgramRecommendedAction,
  SkoposProgramRoutingDecision,
  SkoposProgramScopeRef,
  SkoposProgramStateArtifact,
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowQuestionEntry,
  SkoposWorkflowRecommendationArtifact,
  SkoposWorkflowRecommendationEntry,
} from '@skopos/model';

import { resolveMissionPath } from '../mission/mission.service.js';
import { resolveCurrentMissionRuntime } from '../shared/current-mission.js';
import {
  getBlockingWorkflowQuestions,
} from '../workflow-router/workflow-router-state.service.js';
import {
  loadWorkflowQuestionsForMission,
  loadWorkflowRecommendationsForMission,
  resolveMissionTaskIdentity,
} from '../workflow-router/workflow-router-task-state.service.js';

export const PROGRAM_STATE_ARTIFACT_PATH = '.skopos/program/state.json';

interface ProgramFindingSource {
  id: string;
  title: string;
  summary: string;
  severity: string;
  status: string;
  targetPack: string;
  detailPath: string;
}

interface BuildSkoposProgramStateOptions {
  workspaceRoot: string;
  actorId?: string;
}

interface BuildSkoposProgramStateResult {
  artifact: SkoposProgramStateArtifact;
  currentMission?: SkoposMissionArtifact;
  doNowItem?: SkoposProgramItem;
  doNextItem?: SkoposProgramItem;
  recommendedAction?: SkoposProgramRecommendedAction;
}

const FINDINGS_REGISTRY_PATH = join('docs', 'findings', 'registry.md');

export const buildSkoposProgramState = async ({
  workspaceRoot,
  actorId,
}: BuildSkoposProgramStateOptions): Promise<BuildSkoposProgramStateResult> => {
  const resolvedWorkspaceRoot = resolve(workspaceRoot);
  const trust = await buildSkoposTrustReport({
    cwd: resolvedWorkspaceRoot,
  });
  const [resolvedCurrentMission, activeFindings] = await Promise.all([
    resolveOptionalCurrentMissionRuntime(resolvedWorkspaceRoot, actorId),
    loadActiveProgramFindingSources(resolvedWorkspaceRoot),
  ]);
  const currentMission = resolvedCurrentMission
    ? {
        ...resolvedCurrentMission,
        taskIdentity: await resolveMissionTaskIdentity({
          workspaceRoot: resolvedWorkspaceRoot,
          mission: resolvedCurrentMission,
          actorId,
        }),
      }
    : undefined;
  const [questions, recommendations] = currentMission
    ? await Promise.all([
        loadWorkflowQuestionsForMission({
          workspaceRoot: resolvedWorkspaceRoot,
          mission: currentMission,
          actorId,
        }),
        loadWorkflowRecommendationsForMission({
          workspaceRoot: resolvedWorkspaceRoot,
          mission: currentMission,
          actorId,
        }),
      ])
    : [undefined, undefined];
  const currentMissionEval = currentMission
    ? await loadOptionalEvalArtifact({
        workspaceRoot: resolvedWorkspaceRoot,
        missionId: currentMission.id,
      })
    : undefined;

  const currentMissionItem = currentMission
    ? buildMissionProgramItem({
        workspaceRoot: resolvedWorkspaceRoot,
        mission: currentMission,
      })
    : undefined;

  const findingItems = activeFindings.map((finding) =>
    buildFindingProgramItem({
      workspaceRoot: resolvedWorkspaceRoot,
      finding,
      currentMission,
    }),
  );
  const workflowRecommendationItems = buildWorkflowRecommendationProgramItems({
    workspaceRoot: resolvedWorkspaceRoot,
    recommendations,
    questions,
    currentMission,
  });
  const trustBlockerItems = buildTrustBlockerProgramItems({
    workspaceRoot: resolvedWorkspaceRoot,
    checks: trust.checks,
    currentMission,
  });

  const obligations = currentMissionItem && currentMission
    ? buildMissionProgramObligations({
        mission: currentMission,
        linkedItemId: currentMissionItem.id,
      })
    : [];

  const items = [currentMissionItem, ...workflowRecommendationItems, ...trustBlockerItems, ...findingItems]
    .filter((entry): entry is SkoposProgramItem => Boolean(entry))
    .map((item) =>
      item.id === currentMissionItem?.id
        ? {
            ...item,
            obligationIds: obligations
              .filter((obligation) => obligation.linkedItemId === item.id)
              .map((obligation) => obligation.id),
          }
        : item,
    )
    .sort(sortProgramItems);

  const sequence = buildProgramSequence({
    currentMissionItem,
    queuedItems: [...workflowRecommendationItems, ...trustBlockerItems, ...findingItems],
    openProgramQuestions: questions ? getBlockingWorkflowQuestions(questions).map((entry) => entry.id) : [],
  });
  const doNowItem = items.find((item) => item.id === sequence.doNow);
  const doNextItem = items.find((item) => item.id === sequence.doNext);
  const recommendedAction = buildProgramRecommendedAction({
    workspaceRoot: resolvedWorkspaceRoot,
    actorId,
    currentMission,
    currentMissionEval,
    currentMissionItem,
    doNowItem,
    sequenceDecision: sequence.interruptRecommendation.decision,
  });
  const attention = buildProgramAttention({
    items,
    obligations,
    interruptRecommendation: sequence.interruptRecommendation,
  });
  const questionCount = questions ? getBlockingWorkflowQuestions(questions).length : 0;
  const recommendationCount = recommendations?.entries.filter((entry) => entry.status === 'open')
    .length ?? 0;
  const summary = buildProgramStateSummary({
    currentMission,
    doNowItem,
    doNextItem,
    recommendedAction,
    interruptRecommendation: sequence.interruptRecommendation,
  });
  const timestamp = new Date().toISOString();
  const artifact: SkoposProgramStateArtifact = {
    schemaVersion: 1,
    id: 'program-state',
    type: 'program-state',
    status: 'generated',
    authority: 'generated',
    summary,
    updatedAt: timestamp,
    generatedAt: timestamp,
    workspaceRoot: resolvedWorkspaceRoot,
    taskIdentity: currentMission?.taskIdentity,
    items,
    sequence,
    obligations,
    attention,
    recommendedAction,
    sourcesDigest: {
      activeFindingCount: activeFindings.length,
      activeMissionCount: currentMission ? 1 : 0,
      promotedCheckpointCount: 0,
      workflowQuestionCount: questionCount,
      workflowRecommendationCount: recommendationCount,
      trustLevel: trust.trustLevel,
      readiness: trust.readiness,
    },
  };

  return {
    artifact,
    currentMission,
    doNowItem,
    doNextItem,
    recommendedAction,
  };
};

export const buildProgramSyncSummary = ({
  currentMission,
  doNowItem,
  doNextItem,
  recommendedAction,
  currentDisposition,
}: {
  currentMission?: SkoposMissionArtifact;
  doNowItem?: SkoposProgramItem;
  doNextItem?: SkoposProgramItem;
  recommendedAction?: SkoposProgramRecommendedAction;
  currentDisposition: SkoposProgramRoutingDecision;
}): string => {
  if (recommendedAction) {
    return `${recommendedAction.title}: ${recommendedAction.summary}`;
  }

  if (currentDisposition === 'interrupt-current' && currentMission && doNowItem) {
    return `Program state refreshed; interrupt ${currentMission.id} for ${doNowItem.title}.`;
  }

  if (currentMission && doNextItem) {
    return `Program state refreshed; continue ${currentMission.id} now and queue ${doNextItem.title} next.`;
  }

  if (currentMission) {
    return `Program state refreshed; continue ${currentMission.id} as the current do-now item.`;
  }

  if (doNowItem) {
    return `Program state refreshed; ${doNowItem.title} is the highest-priority queued item.`;
  }

  return 'Program state refreshed; no active or ready program items were detected.';
};

export const buildProgramNextSummary = ({
  recommendedAction,
  currentDisposition,
}: {
  recommendedAction?: SkoposProgramRecommendedAction;
  currentDisposition: SkoposProgramRoutingDecision;
}): string => {
  if (recommendedAction) {
    return `${recommendedAction.title}: ${recommendedAction.summary}`;
  }

  if (currentDisposition === 'idle') {
    return 'No current mission or queued program item requires action.';
  }

  return 'Program routing was refreshed, but no explicit next action could be derived.';
};

const buildMissionProgramItem = ({
  workspaceRoot,
  mission,
}: {
  workspaceRoot: string;
  mission: SkoposMissionArtifact;
}): SkoposProgramItem => ({
  id: `program-item.mission.${mission.id}`,
  title: mission.title,
  summary: mission.summary,
  sourceKind: 'mission',
  sourceRef: relative(workspaceRoot, resolveMissionPath(workspaceRoot, mission.id)),
  scope: toProgramScopeRef(mission.scope.scope),
  status: mission.state === 'complete' ? 'done' : mission.state === 'blocked' ? 'blocked' : 'active',
  priority: mission.scope.scope.kind === 'workspace' ? 'high' : 'medium',
  whyNow: 'This is the current claimed Skopos mission and remains the default do-now item until a stronger blocker interrupts it.',
  dependencies: [],
  interruptsCurrentMission: false,
  recommendedDisposition: 'do-now',
  linkedPlanId: mission.planId,
  linkedMissionId: mission.id,
  obligationIds: [],
});

const buildFindingProgramItem = ({
  workspaceRoot,
  finding,
  currentMission,
}: {
  workspaceRoot: string;
  finding: ProgramFindingSource;
  currentMission?: SkoposMissionArtifact;
}): SkoposProgramItem => {
  const linkedToCurrentMission = currentMission
    ? isFindingLikelyCoveredByMission({
        finding,
        mission: currentMission,
      })
    : false;
  const recommendedDisposition = linkedToCurrentMission
    ? 'defer'
    : finding.severity === 'MUST'
      ? 'interrupt-current'
      : 'do-next';

  return {
    id: `program-item.finding.${finding.id}`,
    title: finding.title,
    summary: finding.summary,
    sourceKind: 'finding',
    sourceRef: relative(workspaceRoot, join(workspaceRoot, finding.detailPath)),
    scope: {
      id: 'workspace',
      kind: 'workspace',
      title: 'skopos',
      path: '.',
    },
    status: linkedToCurrentMission ? 'deferred' : 'ready',
    priority: finding.severity === 'MUST' ? 'critical' : 'high',
    whyNow: `Active finding ${finding.id} is still in progress and should remain visible in the program queue.`,
    dependencies: [],
    interruptsCurrentMission: recommendedDisposition === 'interrupt-current',
    recommendedDisposition,
    linkedMissionId: linkedToCurrentMission ? currentMission?.id : undefined,
    obligationIds: [],
  };
};

const buildWorkflowRecommendationProgramItems = ({
  workspaceRoot,
  recommendations,
  questions,
  currentMission,
}: {
  workspaceRoot: string;
  recommendations?: SkoposWorkflowRecommendationArtifact;
  questions?: SkoposWorkflowQuestionArtifact;
  currentMission?: SkoposMissionArtifact;
}): SkoposProgramItem[] => {
  if (!recommendations) {
    return [];
  }

  return recommendations.entries
    .filter((entry) => entry.status === 'open' && entry.blocking)
    .map((entry) =>
      buildWorkflowRecommendationProgramItem({
        workspaceRoot,
        recommendation: entry,
        linkedQuestion: questions?.entries.find((question) => question.id === entry.linkedQuestionId),
        currentMission,
      }),
    );
};

const buildWorkflowRecommendationProgramItem = ({
  workspaceRoot,
  recommendation,
  linkedQuestion,
  currentMission,
}: {
  workspaceRoot: string;
  recommendation: SkoposWorkflowRecommendationEntry;
  linkedQuestion?: SkoposWorkflowQuestionEntry;
  currentMission?: SkoposMissionArtifact;
}): SkoposProgramItem => {
  const linkedToCurrentMission =
    Boolean(currentMission) && recommendation.linkedMissionId === currentMission?.id;
  const scope = linkedToCurrentMission && currentMission
    ? toProgramScopeRef(currentMission.scope.scope)
    : {
        id: 'workspace',
        kind: 'workspace',
        title: 'skopos',
        path: '.',
      };

  return {
    id: `program-item.workflow-recommendation.${recommendation.id}`,
    title: recommendation.title,
    summary: recommendation.summary,
    sourceKind: 'workflow-recommendation',
    sourceRef: relative(workspaceRoot, join(workspaceRoot, '.skopos', 'recommendations.json')),
    scope,
    status: 'ready',
    priority: toProgramPriority(recommendation.priority),
    whyNow: linkedQuestion
      ? `${linkedQuestion.whyItMatters} ${linkedQuestion.whatHappensAfterAnswer}`
      : recommendation.reason,
    dependencies: recommendation.linkedQuestionId ? [recommendation.linkedQuestionId] : [],
    interruptsCurrentMission: linkedToCurrentMission,
    recommendedDisposition: linkedToCurrentMission ? 'interrupt-current' : 'do-next',
    linkedPlanId: recommendation.linkedPlanId,
    linkedMissionId: recommendation.linkedMissionId,
    recommendedCommand: recommendation.command,
    obligationIds: [],
  };
};

const buildTrustBlockerProgramItems = ({
  workspaceRoot,
  checks,
  currentMission,
}: {
  workspaceRoot: string;
  checks: Array<{ id: string; status: string; summary: string }>;
  currentMission?: SkoposMissionArtifact;
}): SkoposProgramItem[] =>
  checks
    .filter((check) => check.status === 'fail' || check.status === 'warn')
    .map((check) => {
      const priority = check.status === 'fail' ? 'critical' : 'high';
      return {
        id: `program-item.trust-blocker.${check.id}`,
        title: buildTrustBlockerTitle(check.id),
        summary: check.summary,
        sourceKind: 'trust-blocker',
        sourceRef: '.skopos/trust.json',
        scope: {
          id: 'workspace',
          kind: 'workspace',
          title: 'workspace',
          path: '.',
        },
        status: 'ready',
        priority,
        whyNow:
          'Trust reported this as needing attention, so program next should show the repair instead of saying nothing is active.',
        dependencies: [],
        interruptsCurrentMission: check.status === 'fail',
        recommendedDisposition: currentMission
          ? check.status === 'fail'
            ? 'interrupt-current'
            : 'do-next'
          : 'do-now',
        recommendedCommand: buildTrustBlockerCommand({
          workspaceRoot,
          checkId: check.id,
        }),
        obligationIds: [],
      } satisfies SkoposProgramItem;
    });

const buildTrustBlockerTitle = (checkId: string): string => {
  switch (checkId) {
    case 'docs-router':
      return 'Repair the docs start-here router';
    case 'instruction-mirrors':
      return 'Sync agent instruction mirrors';
    case 'accepted-policy':
      return 'Choose the project policy packs';
    case 'policy-brief':
      return 'Refresh the agent policy brief';
    case 'scan-findings':
      return 'Review Skopos scan findings';
    default:
      return `Review trust check ${checkId}`;
  }
};

const buildTrustBlockerCommand = ({
  workspaceRoot,
  checkId,
}: {
  workspaceRoot: string;
  checkId: string;
}): string => {
  switch (checkId) {
    case 'docs-router':
      return `skopos init ${workspaceRoot} && skopos trust ${workspaceRoot}`;
    case 'instruction-mirrors':
      return `skopos instructions sync ${workspaceRoot} && skopos trust ${workspaceRoot}`;
    case 'accepted-policy':
      return `skopos policies recommend ${workspaceRoot} && skopos trust ${workspaceRoot}`;
    case 'policy-brief':
      return `skopos policies apply <pack-id> ${workspaceRoot} && skopos trust ${workspaceRoot}`;
    case 'scan-findings':
      return `skopos scan ${workspaceRoot} --json`;
    default:
      return `skopos trust ${workspaceRoot}`;
  }
};

const buildMissionProgramObligations = ({
  mission,
  linkedItemId,
}: {
  mission: SkoposMissionArtifact;
  linkedItemId: string;
}): SkoposProgramObligation[] => {
  const obligations: SkoposProgramObligation[] = mission.items
    .filter((item) => item.kind !== 'decision')
    .map((item) => ({
      id: `program-obligation.${mission.id}.${item.id}`,
      kind: toProgramObligationKind(item.kind),
      title: item.title,
      reason: item.detail,
      targetRef: `mission:${mission.id}#${item.id}`,
      linkedItemId,
      status: item.status === 'complete' ? 'complete' : 'open',
    }));

  if (!requiresWorkflowUiObligations(mission)) {
    return obligations;
  }

  return [
    ...obligations,
    {
      id: `program-obligation.${mission.id}.ui.overview`,
      kind: 'ui',
      title: 'Reflect program attention in overview',
      reason:
        'Program-level sequencing should surface the current do-now item and interrupt guidance in the overview route.',
      targetRef: 'route:overview',
      linkedItemId,
      status: 'open' as const,
    },
    {
      id: `program-obligation.${mission.id}.ui.mission-detail`,
      kind: 'ui',
      title: 'Reflect upstream program context in mission detail',
      reason:
        'Mission detail should explain why the mission is current and which obligations still remain visible around it.',
      targetRef: 'route:mission-detail',
      linkedItemId,
      status: 'open' as const,
    },
    {
      id: `program-obligation.${mission.id}.ui.trust`,
      kind: 'ui',
      title: 'Reflect program blockers in trust',
      reason:
        'Trust should explain when program-level pressure or obligations make a current mission misleadingly incomplete.',
      targetRef: 'route:trust',
      linkedItemId,
      status: 'open' as const,
    },
    {
      id: `program-obligation.${mission.id}.ui.search-dock`,
      kind: 'ui',
      title: 'Expose program items in the search dock',
      reason:
        'Search should jump directly to do-now, do-next, and program-level obligations without forcing users to reconstruct queue order manually.',
      targetRef: 'surface:search-dock',
      linkedItemId,
      status: 'open' as const,
    },
  ];
};

const buildProgramSequence = ({
  currentMissionItem,
  queuedItems,
  openProgramQuestions,
}: {
  currentMissionItem?: SkoposProgramItem;
  queuedItems: SkoposProgramItem[];
  openProgramQuestions: string[];
}): SkoposProgramStateArtifact['sequence'] => {
  const sortedQueuedItems = [...queuedItems].sort(sortProgramItems);
  const interruptCandidate = sortedQueuedItems.find(
    (item) => item.recommendedDisposition === 'interrupt-current' && item.status === 'ready',
  );
  const nextQueuedItem = sortedQueuedItems.find(
    (item) => item.recommendedDisposition === 'do-next' && item.status === 'ready',
  );
  const readyItems = sortedQueuedItems.filter((item) => item.status === 'ready');
  const deferred = sortedQueuedItems
    .filter((item) => item.recommendedDisposition === 'defer' || item.status === 'deferred')
    .map((item) => item.id);
  const interruptRecommendation = buildInterruptRecommendation({
    currentMissionItem,
    interruptCandidate,
    nextQueuedItem,
    firstReadyItem: readyItems[0],
  });

  if (currentMissionItem && interruptCandidate) {
    return {
      currentActiveItemId: currentMissionItem.id,
      doNow: interruptCandidate.id,
      doNext: currentMissionItem.id,
      deferred,
      interruptRecommendation,
      openProgramQuestions,
    };
  }

  if (currentMissionItem) {
    return {
      currentActiveItemId: currentMissionItem.id,
      doNow: currentMissionItem.id,
      doNext: nextQueuedItem?.id,
      deferred,
      interruptRecommendation,
      openProgramQuestions,
    };
  }

  const [firstFinding, secondFinding] = readyItems;
  return {
    currentActiveItemId: undefined,
    doNow: firstFinding?.id,
    doNext: secondFinding?.id,
    deferred,
    interruptRecommendation,
    openProgramQuestions,
  };
};

const buildInterruptRecommendation = ({
  currentMissionItem,
  interruptCandidate,
  nextQueuedItem,
  firstReadyItem,
}: {
  currentMissionItem?: SkoposProgramItem;
  interruptCandidate?: SkoposProgramItem;
  nextQueuedItem?: SkoposProgramItem;
  firstReadyItem?: SkoposProgramItem;
}): SkoposProgramInterruptRecommendation => {
  if (currentMissionItem && interruptCandidate) {
    return {
      decision: 'interrupt-current',
      summary: `Interrupt the current mission for ${interruptCandidate.title}.`,
      reason:
        'A higher-severity ready program item now outranks the current mission and should become the immediate do-now item.',
      itemId: interruptCandidate.id,
    };
  }

  if (currentMissionItem) {
    return {
      decision: 'continue-current',
      summary: `Continue ${currentMissionItem.title}.`,
      reason:
        'No queued program item materially outranks the current active mission, so the current mission should stay active.',
      itemId: currentMissionItem.id,
    };
  }

  if (firstReadyItem) {
    return {
      decision: 'start-do-now',
      summary: `Start ${firstReadyItem.title}.`,
      reason:
        'No active mission is currently claimed, so the highest-priority ready program item should become the next mission.',
      itemId: firstReadyItem.id,
    };
  }

  return {
    decision: 'idle',
    summary: 'No program item currently requires action.',
    reason: 'No active mission or ready queued item was found in the first program-router slice.',
  };
};

const buildProgramRecommendedAction = ({
  workspaceRoot,
  actorId,
  currentMission,
  currentMissionEval,
  currentMissionItem,
  doNowItem,
  sequenceDecision,
}: {
  workspaceRoot: string;
  actorId?: string;
  currentMission?: SkoposMissionArtifact;
  currentMissionEval?: SkoposEvalArtifact | null;
  currentMissionItem?: SkoposProgramItem;
  doNowItem?: SkoposProgramItem;
  sequenceDecision: SkoposProgramRoutingDecision;
}): SkoposProgramRecommendedAction | undefined => {
  if (sequenceDecision === 'continue-current' && currentMission && currentMissionItem) {
    if (isMissionReadyForCompletion({ mission: currentMission, evalArtifact: currentMissionEval })) {
      return {
        kind: 'complete-current-mission',
        title: 'Complete the current mission',
        summary: `${currentMissionItem.title} is ready for explicit mission completion.`,
        command: buildCompleteMissionCommand({
          workspaceRoot,
          actorId,
          missionId: currentMission.id,
        }),
        linkedItemId: currentMissionItem.id,
      };
    }

    return {
      kind: 'continue-current-mission',
      title: 'Continue the current mission',
      summary: `${currentMissionItem.title} remains the current do-now item.`,
      command: buildNextMissionCommand({
        workspaceRoot,
        actorId,
        missionId: currentMission.id,
      }),
      linkedItemId: currentMissionItem.id,
    };
  }

  if (doNowItem?.sourceKind === 'finding') {
    return {
      kind: 'start-mission',
      title: 'Start the next queued program item',
      summary: `${doNowItem.title} is the highest-priority ready queued item.`,
      command: buildStartMissionCommand({
        workspaceRoot,
        actorId,
        goal: doNowItem.title,
      }),
      linkedItemId: doNowItem.id,
    };
  }

  if (doNowItem?.sourceKind === 'workflow-recommendation') {
    return {
      kind: 'run-workflow-recommendation',
      title: doNowItem.title,
      summary: doNowItem.summary,
      command: doNowItem.recommendedCommand,
      linkedItemId: doNowItem.id,
    };
  }

  if (doNowItem?.sourceKind === 'trust-blocker') {
    return {
      kind: 'review-program-state',
      title: doNowItem.title,
      summary: doNowItem.summary,
      command: doNowItem.recommendedCommand,
      linkedItemId: doNowItem.id,
    };
  }

  if (doNowItem?.sourceKind === 'mission' && doNowItem.linkedMissionId) {
    return {
      kind: 'continue-current-mission',
      title: 'Continue the current mission',
      summary: `${doNowItem.title} is still the current do-now item.`,
      command: buildNextMissionCommand({
        workspaceRoot,
        actorId,
        missionId: doNowItem.linkedMissionId,
      }),
      linkedItemId: doNowItem.id,
    };
  }

  if (sequenceDecision === 'idle') {
    return {
      kind: 'review-program-state',
      title: 'Review program state',
      summary: 'No active mission or queued program item currently requires action.',
      linkedItemId: undefined,
    };
  }

  return undefined;
};

const isMissionReadyForCompletion = ({
  mission,
  evalArtifact,
}: {
  mission: SkoposMissionArtifact;
  evalArtifact?: SkoposEvalArtifact | null;
}): boolean => {
  if (mission.state === 'complete' || !evalArtifact) {
    return false;
  }

  return (
    evalArtifact.evaluationStatus === 'complete' &&
    evalArtifact.pendingItemIds.length === 0 &&
    evalArtifact.blockingQuestionIds.length === 0
  );
};

const buildProgramAttention = ({
  items,
  obligations,
  interruptRecommendation,
}: {
  items: SkoposProgramItem[];
  obligations: SkoposProgramObligation[];
  interruptRecommendation: SkoposProgramInterruptRecommendation;
}): SkoposProgramAttention => ({
  title: interruptRecommendation.summary,
  summary: interruptRecommendation.reason,
  openItemCount: items.filter((item) => item.status !== 'done').length,
  openObligationCount: obligations.filter((obligation) => obligation.status === 'open').length,
  interruptingItemCount: items.filter((item) => item.recommendedDisposition === 'interrupt-current')
    .length,
});

const buildProgramStateSummary = ({
  currentMission,
  doNowItem,
  doNextItem,
  recommendedAction,
  interruptRecommendation,
}: {
  currentMission?: SkoposMissionArtifact;
  doNowItem?: SkoposProgramItem;
  doNextItem?: SkoposProgramItem;
  recommendedAction?: SkoposProgramRecommendedAction;
  interruptRecommendation: SkoposProgramInterruptRecommendation;
}): string => {
  if (recommendedAction) {
    return `${recommendedAction.title}: ${recommendedAction.summary}`;
  }

  if (interruptRecommendation.decision === 'interrupt-current' && doNowItem && currentMission) {
    return `${doNowItem.title} now interrupts ${currentMission.id}; ${currentMission.id} becomes do-next after the higher-priority item is handled.`;
  }

  if (currentMission && doNextItem) {
    return `${currentMission.id} remains do-now. ${doNextItem.title} is queued next.`;
  }

  if (currentMission) {
    return `${currentMission.id} remains the current do-now mission.`;
  }

  if (doNowItem) {
    return `${doNowItem.title} is the highest-priority ready program item.`;
  }

  return 'No active mission or queued program item currently requires action.';
};

const loadOptionalEvalArtifact = async ({
  workspaceRoot,
  missionId,
}: {
  workspaceRoot: string;
  missionId: string;
}): Promise<SkoposEvalArtifact | null> => {
  try {
    const contents = await readFile(
      join(workspaceRoot, '.skopos', 'evals', `${missionId}.json`),
      'utf8',
    );
    return JSON.parse(contents) as SkoposEvalArtifact;
  } catch {
    return null;
  }
};

const resolveOptionalCurrentMissionRuntime = async (
  workspaceRoot: string,
  actorId?: string,
): Promise<SkoposMissionArtifact | undefined> => {
  try {
    return await resolveCurrentMissionRuntime({
      workspaceRoot,
      actorId,
    });
  } catch {
    return undefined;
  }
};

const loadActiveProgramFindingSources = async (
  workspaceRoot: string,
): Promise<ProgramFindingSource[]> => {
  const registryPath = join(workspaceRoot, FINDINGS_REGISTRY_PATH);

  let registryContents: string;
  try {
    registryContents = await readFile(registryPath, 'utf8');
  } catch {
    return [];
  }

  const activeSection = registryContents.split('## Active Findings')[1];
  if (!activeSection) {
    return [];
  }

  const sectionBody = activeSection.split('\n## ')[0] ?? activeSection;
  const matches = [...sectionBody.matchAll(
    /^\d+\.\s+`([^`]+)`\n\s+-\s+Severity:\s+`([^`]+)`\n\s+-\s+Status:\s+`([^`]+)`\n\s+-\s+Owner:\s+`([^`]+)`\n\s+-\s+Target Pack:\s+`([^`]+)`\n\s+-\s+Detail:\s+`([^`]+)`/gm,
  )];

  return Promise.all(
    matches.map(async (match) => {
      const [, id, severity, status, _owner, targetPack, detail] = match;
      const detailPath = join('docs', 'findings', detail);
      const detailContents = await readOptionalFile(join(workspaceRoot, detailPath));
      const titleMatch = detailContents.match(/^#\s+[^:]+:\s+(.+)$/m);
      const currentStateMatch = detailContents.match(/^\-\s+Current State:\s+(.+)$/m);

      return {
        id,
        title: titleMatch?.[1]?.trim() ?? id,
        summary:
          currentStateMatch?.[1]?.trim() ??
          `Active finding ${id} remains in progress under target pack ${targetPack}.`,
        severity,
        status,
        targetPack,
        detailPath,
      };
    }),
  );
};

const readOptionalFile = async (path: string): Promise<string> => {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return '';
  }
};

const buildCompleteMissionCommand = ({
  workspaceRoot,
  actorId,
  missionId,
}: {
  workspaceRoot: string;
  actorId?: string;
  missionId: string;
}): string => {
  const actorFlag = actorId ? ` --actor ${actorId}` : '';
  return `skopos mission complete ${missionId} ${workspaceRoot}${actorFlag}`;
};

const isFindingLikelyCoveredByMission = ({
  finding,
  mission,
}: {
  finding: ProgramFindingSource;
  mission: SkoposMissionArtifact;
}): boolean => {
  const findingTokens = tokenize(`${finding.title} ${finding.targetPack}`);
  const missionTokens = tokenize(`${mission.title} ${mission.summary} ${mission.objective}`);
  const overlapCount = findingTokens.filter((token) => missionTokens.includes(token)).length;
  return overlapCount >= 2;
};

const tokenize = (value: string): string[] =>
  Array.from(
    new Set(
      value
        .toLowerCase()
        .split(/[^a-z0-9]+/g)
        .filter((token) => token.length >= 4),
    ),
  );

const toProgramScopeRef = (scope: {
  id: string;
  kind: string;
  title: string;
  path: string;
}): SkoposProgramScopeRef => ({
  id: scope.id,
  kind: scope.kind,
  title: scope.title,
  path: scope.path,
});

const toProgramObligationKind = (
  kind: SkoposMissionArtifact['items'][number]['kind'],
): SkoposProgramObligation['kind'] => {
  if (kind === 'docs') {
    return 'docs';
  }

  if (kind === 'validation') {
    return 'validation';
  }

  if (kind === 'workflow') {
    return 'workflows';
  }

  return 'runtime';
};

const toProgramPriority = (
  priority: SkoposWorkflowRecommendationEntry['priority'],
): SkoposProgramItem['priority'] => {
  switch (priority) {
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    default:
      return 'low';
  }
};

const requiresWorkflowUiObligations = (mission: SkoposMissionArtifact): boolean =>
  /\b(program|workflow|router|discussion)\b/i.test(
    `${mission.title} ${mission.summary} ${mission.objective}`,
  );

const sortProgramItems = (left: SkoposProgramItem, right: SkoposProgramItem): number => {
  const statusWeight: Record<SkoposProgramItem['status'], number> = {
    active: 0,
    ready: 1,
    blocked: 2,
    deferred: 3,
    candidate: 4,
    done: 5,
  };
  const priorityWeight: Record<SkoposProgramItem['priority'], number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  const statusDelta = statusWeight[left.status] - statusWeight[right.status];
  if (statusDelta !== 0) {
    return statusDelta;
  }

  const priorityDelta = priorityWeight[left.priority] - priorityWeight[right.priority];
  if (priorityDelta !== 0) {
    return priorityDelta;
  }

  return left.title.localeCompare(right.title);
};

const buildNextMissionCommand = ({
  workspaceRoot,
  actorId,
  missionId,
}: {
  workspaceRoot: string;
  actorId?: string;
  missionId: string;
}): string => {
  const command = ['skopos', 'next', workspaceRoot, '--mission', missionId];
  if (actorId) {
    command.push('--actor', actorId);
  }

  return command.join(' ');
};

const buildStartMissionCommand = ({
  workspaceRoot,
  actorId,
  goal,
}: {
  workspaceRoot: string;
  actorId?: string;
  goal: string;
}): string => {
  const command = ['skopos', 'start', quoteShellArgument(goal), workspaceRoot];
  if (actorId) {
    command.push('--actor', actorId);
  }

  return command.join(' ');
};

const quoteShellArgument = (value: string): string => JSON.stringify(value);
