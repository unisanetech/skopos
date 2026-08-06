import type {
  SkoposUiConsoleTaskView,
  SkoposUiConsoleState,
} from '../../contracts/skopos-ui-console-state.js';

export const requiresAdoptionOrientation = (state: SkoposUiConsoleState): boolean =>
  Boolean(state.sessionContext?.adoption && state.sessionContext.adoption.state !== 'agent-ready');

export interface ExecutionOverviewContext {
  activeTasks: SkoposUiConsoleTaskView[];
  focusTasks: SkoposUiConsoleTaskView[];
  warningChecks: SkoposUiConsoleState['readinessReport']['checks'];
}

export interface TaskCollections {
  openTasks: SkoposUiConsoleTaskView[];
  allCompletedTasks: SkoposUiConsoleTaskView[];
  completedTasks: SkoposUiConsoleTaskView[];
  blockedTaskCount: number;
  claimedTaskCount: number;
  latestTask?: SkoposUiConsoleTaskView;
}

export interface TaskListContext extends TaskCollections {
  primaryTasks: SkoposUiConsoleTaskView[];
  primaryTitle: string;
  primaryDescription: string;
}

export interface TaskDetailContext {
  taskView?: SkoposUiConsoleTaskView;
  taskActions: SkoposUiConsoleState['activity']['actionRuns'];
  linkedTaskViews: SkoposUiConsoleTaskView[];
  guidance?: TaskGuidanceContext;
}

const compareOptionalTimestamps = (left?: string, right?: string): number =>
  (left ?? '').localeCompare(right ?? '');

export interface TaskGuidanceContext {
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
  openQuestions: NonNullable<SkoposUiConsoleState['taskQuestions']>['entries'];
}

export const getExecutionOverviewContext = (
  state: SkoposUiConsoleState,
): ExecutionOverviewContext => {
  const activeTasks = state.tasks.filter((task) => isOpenTaskState(task.task.state));
  const selectedTask = state.sessionContext?.currentTaskId
    ? activeTasks.find((task) => task.task.id === state.sessionContext?.currentTaskId)
    : undefined;

  return {
    activeTasks,
    focusTasks: selectedTask ? [selectedTask] : activeTasks.slice(0, 3),
    warningChecks: state.readinessReport.checks.filter((check) => check.status !== 'pass'),
  };
};

export const getTaskCollections = (state: SkoposUiConsoleState): TaskCollections => {
  const openTasks = [...state.tasks.filter((task) => isOpenTaskState(task.task.state))].sort(
    (left, right) => {
      if (left.task.state !== right.task.state) {
        return left.task.state === 'active' ? -1 : 1;
      }

      return compareOptionalTimestamps(right.task.updatedAt, left.task.updatedAt);
    },
  );
  const allCompletedTasks = [...state.tasks.filter((task) => task.task.state === 'complete')].sort(
    (left, right) => compareOptionalTimestamps(right.task.updatedAt, left.task.updatedAt),
  );

  return {
    openTasks,
    allCompletedTasks,
    completedTasks: allCompletedTasks.slice(0, 8),
    blockedTaskCount: openTasks.filter((task) => task.task.state === 'blocked').length,
    claimedTaskCount: openTasks.filter(
      (task) => task.task.coordination.claimedBy?.actorId,
    ).length,
    latestTask: [...state.tasks].sort((left, right) =>
      compareOptionalTimestamps(right.task.updatedAt, left.task.updatedAt),
    )[0],
  };
};

const isOpenTaskState = (state: SkoposUiConsoleTaskView['task']['state']): boolean =>
  !['complete', 'cancelled', 'superseded'].includes(state);

export const getTaskListContext = (
  state: SkoposUiConsoleState,
  view: 'open' | 'blocked' | 'claimed' | 'complete',
): TaskListContext => {
  const collections = getTaskCollections(state);
  const filteredOpenTasks = collections.openTasks.filter((task) => {
    switch (view) {
      case 'blocked':
        return task.task.state === 'blocked';
      case 'claimed':
        return Boolean(task.task.coordination.claimedBy?.actorId);
      default:
        return true;
    }
  });

  return {
    ...collections,
    primaryTasks: view === 'complete' ? collections.completedTasks : filteredOpenTasks,
    primaryTitle:
      view === 'blocked'
        ? 'Blocked task queue'
        : view === 'claimed'
          ? 'Claimed task queue'
          : view === 'complete'
            ? 'Recently closed'
            : 'Open task queue',
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

export const getTaskDetailContext = (
  state: SkoposUiConsoleState,
  taskId: string,
): TaskDetailContext => {
  const taskView = state.tasks.find((task) => task.task.id === taskId);

  if (!taskView) {
    return {
      taskActions: [],
      linkedTaskViews: [],
    };
  }

  const task = taskView.task;

  return {
    taskView,
    taskActions: state.activity.actionRuns.filter((run) =>
      task.selectedActions.some((action) => action.id === run.actionId),
    ),
    linkedTaskViews: task.childTasks
      .map((childTask) =>
        state.tasks.find((candidate) => candidate.task.id === childTask.taskId),
      )
      .filter((childTask): childTask is SkoposUiConsoleTaskView => Boolean(childTask)),
    guidance: buildTaskGuidanceContext(state, taskView),
  };
};

export const buildTaskGuidanceContext = (
  state: SkoposUiConsoleState,
  taskView: SkoposUiConsoleTaskView,
): TaskGuidanceContext => {
  const task = taskView.task;
  const completedItems = task.steps.filter((step) => step.status === 'complete');
  const pendingItems = task.steps.filter((step) => step.status !== 'complete');
  const decisionItems = task.steps.filter((step) => step.kind === 'decision');
  const pendingDecisionItems = decisionItems.filter((item) => item.status !== 'complete');
  const openQuestions =
    state.taskQuestions?.taskId === task.id
      ? state.taskQuestions.entries.filter((question) => question.status === 'open')
      : [];
  const visibleFindings = state.readinessReport.blockers.length;
  const childTaskCount = task.childTasks.length;
  const totalCount = task.steps.length;
  const percentComplete = totalCount === 0 ? 100 : Math.round((completedItems.length / totalCount) * 100);
  const phase = deriveTaskPhase({
    task,
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
        ? 'No decision items are tracked for this task.'
        : pendingDecisionItems.length === 0
          ? `${decisionItems.length} of ${decisionItems.length} decisions complete.`
          : `${pendingDecisionItems.length} of ${decisionItems.length} decision${decisionItems.length === 1 ? '' : 's'} still ${pendingDecisionItems.length === 1 ? 'needs' : 'need'} attention.`,
    findingText:
      visibleFindings === 0 && childTaskCount === 0
        ? 'No active findings or follow-up slices are linked here.'
        : [
            visibleFindings > 0
              ? `${visibleFindings} finding${visibleFindings === 1 ? '' : 's'} visible in readiness.`
              : undefined,
            childTaskCount > 0
              ? `${childTaskCount} linked follow-up slice${childTaskCount === 1 ? '' : 's'}.`
              : undefined,
          ]
            .filter(Boolean)
            .join(' '),
    blockerText:
      openQuestions.length > 0
        ? `${openQuestions.length} open question${openQuestions.length === 1 ? '' : 's'} ${openQuestions.length === 1 ? 'needs' : 'need'} an answer before implementation is fully safe.`
        : task.state === 'blocked'
          ? 'This task is marked blocked. Review its steps and readiness blockers before continuing.'
          : 'No blocking Task questions are open for this task.',
    proofText:
      task.state === 'complete'
        ? 'Task is complete and its Evidence remains attached to the closed work.'
        : task.selectedActions.length > 0
          ? `Run or review ${task.selectedActions.length} selected Action${task.selectedActions.length === 1 ? '' : 's'} before Readiness.`
          : 'Capture focused Evidence for the acceptance criteria before requesting Readiness.',
    openQuestions,
  };
};

const deriveTaskPhase = ({
  task,
  pendingItems,
  pendingDecisionItems,
  openQuestionCount,
}: {
  task: SkoposUiConsoleTaskView['task'];
  pendingItems: SkoposUiConsoleTaskView['task']['steps'];
  pendingDecisionItems: SkoposUiConsoleTaskView['task']['steps'];
  openQuestionCount: number;
}): TaskGuidanceContext['phase'] => {
  if (task.state === 'complete') {
    return 'complete';
  }

  if (task.state === 'blocked' || openQuestionCount > 0) {
    return 'blocked';
  }

  if (pendingDecisionItems.length > 0) {
    return 'planning';
  }

  if (
    pendingItems.some((item) => ['implementation', 'action', 'docs'].includes(item.kind))
  ) {
    return 'implementation';
  }

  if (pendingItems.some((item) => item.kind === 'verification')) {
    return 'verification';
  }

  return 'closure';
};
