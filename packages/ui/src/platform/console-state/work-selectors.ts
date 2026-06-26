import type {
  SkoposUiConsoleMissionView,
  SkoposUiConsoleState,
} from '../../contracts/skopos-ui-console-state.js';

export interface ExecutionOverviewContext {
  activeMissions: SkoposUiConsoleMissionView[];
  warningChecks: SkoposUiConsoleState['trustReport']['checks'];
  proofSummary: SkoposUiConsoleState['proofReport'];
  recentPlans: SkoposUiConsoleState['plans'];
}

export interface MissionCollections {
  openMissions: SkoposUiConsoleMissionView[];
  allCompletedMissions: SkoposUiConsoleMissionView[];
  completedMissions: SkoposUiConsoleMissionView[];
  blockedMissionCount: number;
  claimedMissionCount: number;
  latestMission?: SkoposUiConsoleMissionView;
}

export interface MissionListContext extends MissionCollections {
  primaryMissions: SkoposUiConsoleMissionView[];
  primaryTitle: string;
  primaryDescription: string;
}

export interface MissionDetailContext {
  missionView?: SkoposUiConsoleMissionView;
  missionWorkflows: SkoposUiConsoleState['activity']['workflowRuns'];
  linkedMissionViews: SkoposUiConsoleMissionView[];
  guidance?: MissionGuidanceContext;
}

const compareOptionalTimestamps = (left?: string, right?: string): number =>
  (left ?? '').localeCompare(right ?? '');

export interface MissionGuidanceContext {
  percentComplete: number;
  completedCount: number;
  totalCount: number;
  phase: 'planning' | 'implementation' | 'verification' | 'closure' | 'blocked' | 'complete';
  doneText: string;
  doingNowText: string;
  decisionText: string;
  findingText: string;
  blockerText: string;
  proofText: string;
  openQuestions: NonNullable<SkoposUiConsoleState['workflowQuestions']>['entries'];
}

export const getExecutionOverviewContext = (
  state: SkoposUiConsoleState,
): ExecutionOverviewContext => ({
  activeMissions: state.missions.filter((mission) => mission.mission.state !== 'complete'),
  warningChecks: state.trustReport.checks.filter((check) => check.status !== 'pass'),
  proofSummary: state.proofReport,
  recentPlans: state.plans.slice(0, 4),
});

export const getMissionCollections = (state: SkoposUiConsoleState): MissionCollections => {
  const openMissions = [...state.missions.filter((mission) => mission.mission.state !== 'complete')].sort(
    (left, right) => {
      if (left.mission.state !== right.mission.state) {
        return left.mission.state === 'active' ? -1 : 1;
      }

      return compareOptionalTimestamps(right.mission.updatedAt, left.mission.updatedAt);
    },
  );
  const allCompletedMissions = [...state.missions.filter((mission) => mission.mission.state === 'complete')].sort(
    (left, right) => compareOptionalTimestamps(right.mission.updatedAt, left.mission.updatedAt),
  );

  return {
    openMissions,
    allCompletedMissions,
    completedMissions: allCompletedMissions.slice(0, 8),
    blockedMissionCount: openMissions.filter((mission) => mission.mission.state === 'blocked').length,
    claimedMissionCount: openMissions.filter(
      (mission) => mission.mission.coordination.claimedBy?.actorId,
    ).length,
    latestMission: [...state.missions].sort((left, right) =>
      compareOptionalTimestamps(right.mission.updatedAt, left.mission.updatedAt),
    )[0],
  };
};

export const getMissionListContext = (
  state: SkoposUiConsoleState,
  view: 'open' | 'blocked' | 'claimed' | 'complete',
): MissionListContext => {
  const collections = getMissionCollections(state);
  const filteredOpenMissions = collections.openMissions.filter((mission) => {
    switch (view) {
      case 'blocked':
        return mission.mission.state === 'blocked';
      case 'claimed':
        return Boolean(mission.mission.coordination.claimedBy?.actorId);
      default:
        return true;
    }
  });

  return {
    ...collections,
    primaryMissions: view === 'complete' ? collections.completedMissions : filteredOpenMissions,
    primaryTitle:
      view === 'blocked'
        ? 'Blocked mission queue'
        : view === 'claimed'
          ? 'Claimed mission queue'
          : view === 'complete'
            ? 'Recently closed'
            : 'Open mission queue',
    primaryDescription:
      view === 'blocked'
        ? 'Blocked execution is isolated so intervention pressure is obvious.'
        : view === 'claimed'
          ? 'Owned execution stays visible as a focused working set.'
          : view === 'complete'
            ? 'Completed slices stay available without competing with live work.'
            : 'Primary execution stays in one readable queue instead of competing summary cards.',
  };
};

export const getMissionDetailContext = (
  state: SkoposUiConsoleState,
  missionId: string,
): MissionDetailContext => {
  const missionView = state.missions.find((mission) => mission.mission.id === missionId);

  if (!missionView) {
    return {
      missionWorkflows: [],
      linkedMissionViews: [],
    };
  }

  const mission = missionView.mission;

  return {
    missionView,
    missionWorkflows: state.activity.workflowRuns.filter((run) =>
      mission.recommendedWorkflowIds.includes(run.workflowId),
    ),
    linkedMissionViews: mission.linkedSlices
      .map((linkedSlice) =>
        state.missions.find((candidate) => candidate.mission.id === linkedSlice.missionId),
      )
      .filter((linkedSlice): linkedSlice is SkoposUiConsoleMissionView => Boolean(linkedSlice)),
    guidance: buildMissionGuidanceContext(state, missionView),
  };
};

export const buildMissionGuidanceContext = (
  state: SkoposUiConsoleState,
  missionView: SkoposUiConsoleMissionView,
): MissionGuidanceContext => {
  const mission = missionView.mission;
  const completedItems = mission.items.filter((item) => item.status === 'complete');
  const pendingItems = mission.items.filter((item) => item.status !== 'complete');
  const decisionItems = mission.items.filter((item) => item.kind === 'decision');
  const pendingDecisionItems = decisionItems.filter((item) => item.status !== 'complete');
  const openQuestions = (state.workflowQuestions?.entries ?? []).filter(
    (question) => question.status === 'open' && question.linkedMissionId === mission.id,
  );
  const visibleFindings = state.trustReport.findings.length;
  const linkedSliceCount = mission.linkedSlices.length;
  const totalCount = mission.items.length;
  const percentComplete = totalCount === 0 ? 100 : Math.round((completedItems.length / totalCount) * 100);
  const phase = deriveMissionPhase({
    mission,
    pendingItems,
    pendingDecisionItems,
    openQuestionCount: openQuestions.length,
  });

  return {
    percentComplete,
    completedCount: completedItems.length,
    totalCount,
    phase,
    doneText:
      completedItems.length === 0
        ? 'No checklist items are complete yet.'
        : completedItems.slice(0, 3).map((item) => item.title).join('; '),
    doingNowText: openQuestions[0]?.question ?? pendingItems[0]?.title ?? 'Nothing is active right now.',
    decisionText:
      decisionItems.length === 0
        ? 'No decision items are tracked for this mission.'
        : pendingDecisionItems.length === 0
          ? `${decisionItems.length} of ${decisionItems.length} decisions complete.`
          : `${pendingDecisionItems.length} of ${decisionItems.length} decision${decisionItems.length === 1 ? '' : 's'} still ${pendingDecisionItems.length === 1 ? 'needs' : 'need'} attention.`,
    findingText:
      visibleFindings === 0 && linkedSliceCount === 0
        ? 'No active findings or follow-up slices are linked here.'
        : [
            visibleFindings > 0
              ? `${visibleFindings} finding${visibleFindings === 1 ? '' : 's'} visible in trust.`
              : undefined,
            linkedSliceCount > 0
              ? `${linkedSliceCount} linked follow-up slice${linkedSliceCount === 1 ? '' : 's'}.`
              : undefined,
          ]
            .filter(Boolean)
            .join(' '),
    blockerText:
      openQuestions.length > 0
        ? `${openQuestions.length} open question${openQuestions.length === 1 ? '' : 's'} ${openQuestions.length === 1 ? 'needs' : 'need'} an answer before implementation is fully safe.`
        : mission.state === 'blocked'
          ? 'This mission is marked blocked. Review the checklist and trust route before continuing.'
          : 'No blocking workflow questions are open for this mission.',
    proofText:
      mission.state === 'complete'
        ? 'Mission is complete. Keep eval and done evidence with the closed work.'
        : mission.recommendedWorkflowIds.length > 0
          ? `Run or review ${mission.recommendedWorkflowIds.length} required workflow${mission.recommendedWorkflowIds.length === 1 ? '' : 's'} before closure.`
          : mission.recommendedChecks.length > 0
            ? `Run ${mission.recommendedChecks.length} recommended check${mission.recommendedChecks.length === 1 ? '' : 's'} before closure.`
            : 'Run focused checks, then use eval and done before closing.',
    openQuestions,
  };
};

const deriveMissionPhase = ({
  mission,
  pendingItems,
  pendingDecisionItems,
  openQuestionCount,
}: {
  mission: SkoposUiConsoleMissionView['mission'];
  pendingItems: SkoposUiConsoleMissionView['mission']['items'];
  pendingDecisionItems: SkoposUiConsoleMissionView['mission']['items'];
  openQuestionCount: number;
}): MissionGuidanceContext['phase'] => {
  if (mission.state === 'complete') {
    return 'complete';
  }

  if (mission.state === 'blocked' || openQuestionCount > 0) {
    return 'blocked';
  }

  if (pendingDecisionItems.length > 0) {
    return 'planning';
  }

  if (
    pendingItems.some((item) => ['implementation', 'workflow', 'docs'].includes(item.kind))
  ) {
    return 'implementation';
  }

  if (pendingItems.some((item) => item.kind === 'validation')) {
    return 'verification';
  }

  return 'closure';
};
