import type {
  SkoposUiConsoleDiscussionCheckpointView,
  SkoposUiConsoleDiscussionHandoffView,
  SkoposUiConsoleMissionView,
  SkoposUiConsoleState,
} from '../../contracts/skopos-ui-console-state.js';

export interface OverviewDiscussionContext {
  latestDiscussionHandoff?: SkoposUiConsoleDiscussionHandoffView;
  recentDiscussionCheckpoints: SkoposUiConsoleDiscussionCheckpointView[];
  activeMissionView?: SkoposUiConsoleMissionView;
}

export interface MissionDiscussionContext {
  latestDiscussionHandoff?: SkoposUiConsoleDiscussionHandoffView;
  missionCheckpoints: SkoposUiConsoleDiscussionCheckpointView[];
  activeMissionView?: SkoposUiConsoleMissionView;
}

export const getOverviewDiscussionContext = (
  state: SkoposUiConsoleState,
): OverviewDiscussionContext => {
  const latestDiscussionHandoff = state.latestDiscussionHandoff;
  const activeMissionView = latestDiscussionHandoff?.handoff.activeMissionId
    ? state.missions.find(
        (missionView) => missionView.mission.id === latestDiscussionHandoff.handoff.activeMissionId,
      )
    : undefined;
  const recentDiscussionCheckpoints = state.discussionCheckpoints.slice(0, 4);

  return {
    latestDiscussionHandoff,
    recentDiscussionCheckpoints,
    activeMissionView,
  };
};

export const getMissionDiscussionContext = (
  state: SkoposUiConsoleState,
  missionId: string,
): MissionDiscussionContext => {
  const latestDiscussionHandoff = state.latestDiscussionHandoff;
  const missionCheckpoints = state.discussionCheckpoints.filter(
    (checkpointView) => checkpointView.checkpoint.activeMissionId === missionId,
  );

  if (!latestDiscussionHandoff || latestDiscussionHandoff.handoff.activeMissionId !== missionId) {
    return {
      missionCheckpoints,
    };
  }

  const activeMissionView = state.missions.find((missionView) => missionView.mission.id === missionId);

  return {
    latestDiscussionHandoff,
    missionCheckpoints,
    activeMissionView,
  };
};
