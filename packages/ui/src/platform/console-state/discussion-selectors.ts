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
  const currentTaskId = state.sessionContext?.currentTaskId;
  const latestDiscussionHandoff =
    currentTaskId && state.latestDiscussionHandoff?.handoff.activeTaskId === currentTaskId
      ? state.latestDiscussionHandoff
      : undefined;
  const activeTaskView = currentTaskId
    ? state.tasks.find(
        (taskView) => taskView.task.id === currentTaskId,
      )
    : undefined;
  const recentDiscussionCheckpoints = currentTaskId
    ? state.discussionCheckpoints
        .filter((checkpointView) => checkpointView.checkpoint.activeTaskId === currentTaskId)
        .slice(0, 1)
    : [];

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
