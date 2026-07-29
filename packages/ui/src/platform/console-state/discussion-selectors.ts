import type {
  SkoposUiConsoleDiscussionCheckpointView,
  SkoposUiConsoleDiscussionHandoffView,
  SkoposUiConsoleTaskView,
  SkoposUiConsoleState,
} from '../../contracts/skopos-ui-console-state.js';

export interface OverviewDiscussionContext {
  latestDiscussionHandoff?: SkoposUiConsoleDiscussionHandoffView;
  recentDiscussionCheckpoints: SkoposUiConsoleDiscussionCheckpointView[];
  activeTaskView?: SkoposUiConsoleTaskView;
}

export interface TaskDiscussionContext {
  latestDiscussionHandoff?: SkoposUiConsoleDiscussionHandoffView;
  taskCheckpoints: SkoposUiConsoleDiscussionCheckpointView[];
  activeTaskView?: SkoposUiConsoleTaskView;
}

export const getOverviewDiscussionContext = (
  state: SkoposUiConsoleState,
): OverviewDiscussionContext => {
  const latestDiscussionHandoff = state.latestDiscussionHandoff;
  const activeTaskView = latestDiscussionHandoff?.handoff.activeTaskId
    ? state.tasks.find(
        (taskView) => taskView.task.id === latestDiscussionHandoff.handoff.activeTaskId,
      )
    : undefined;
  const recentDiscussionCheckpoints = state.discussionCheckpoints.slice(0, 4);

  return {
    latestDiscussionHandoff,
    recentDiscussionCheckpoints,
    activeTaskView,
  };
};

export const getTaskDiscussionContext = (
  state: SkoposUiConsoleState,
  taskId: string,
): TaskDiscussionContext => {
  const latestDiscussionHandoff = state.latestDiscussionHandoff;
  const taskCheckpoints = state.discussionCheckpoints.filter(
    (checkpointView) => checkpointView.checkpoint.activeTaskId === taskId,
  );

  if (!latestDiscussionHandoff || latestDiscussionHandoff.handoff.activeTaskId !== taskId) {
    return {
      taskCheckpoints,
    };
  }

  const activeTaskView = state.tasks.find((taskView) => taskView.task.id === taskId);

  return {
    latestDiscussionHandoff,
    taskCheckpoints,
    activeTaskView,
  };
};
