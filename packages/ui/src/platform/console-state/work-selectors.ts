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
}

const compareOptionalTimestamps = (left?: string, right?: string): number =>
  (left ?? '').localeCompare(right ?? '');

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
  };
};
