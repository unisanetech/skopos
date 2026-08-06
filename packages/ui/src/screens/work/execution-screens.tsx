import * as React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';

import type { SkoposUiConsoleTaskView } from '../../contracts/skopos-ui-console-state.js';
import { SegmentedButton } from '../../components/ui/segmented-button.js';

import {
  DiscussionGuidanceCard,
  DiscussionHistoryCard,
  TaskChecklistCard,
  TaskDiscussionContextCard,
  TaskDetailInspectorAside,
  TaskFocusCard,
  TaskGuidanceCard,
  TaskLinkedWorkCard,
  TaskActionRecordingCard,
  TaskContractCard,
  TaskListGuidanceCard,
  TaskListInspectorAside,
  TaskQueueCard,
  OverviewInspectorAside,
  OverviewProjectKnowledgeCard,
  OverviewRecentDiscussionCard,
  OverviewUnderstandingCard,
  NowGuidanceCard,
} from '../../features/work/task-sections.js';
import { DetailPage } from '../../patterns/pages/detail-page.js';
import { ListPage } from '../../patterns/pages/list-page.js';
import { PageSectionStack } from '../../patterns/pages/shared.js';
import { ReviewPage } from '../../patterns/pages/review-page.js';
import {
  ContentSection,
  RouteFilterBar,
} from '../../patterns/sections/content-primitives.js';
import {
  getExecutionOverviewContext,
  getTaskDetailContext,
  getTaskListContext,
  requiresAdoptionOrientation,
} from '../../platform/console-state/work-selectors.js';
import {
  getTaskDiscussionContext,
  getOverviewDiscussionContext,
} from '../../platform/console-state/discussion-selectors.js';
import {
  EmptyMessage,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import { requireConsoleState } from '../../platform/console-state/access.js';
import {
  toneForCheck,
  toneForTaskState,
  toneForReadiness,
} from '../../support/ui/tone-helpers.js';

export function ExecutionOverviewView(): React.JSX.Element {
  const state = requireConsoleState();
  const { activeTasks, focusTasks, warningChecks } =
    getExecutionOverviewContext(state);
  const { latestDiscussionHandoff, recentDiscussionCheckpoints, activeTaskView } =
    getOverviewDiscussionContext(state);
  const showProjectOrientation =
    activeTasks.length === 0 ||
    requiresAdoptionOrientation(state);

  return (
    <ReviewPage
      title={state.workspaceLabel}
      description={state.sessionContext?.summary ?? 'Current Project guidance is available.'}
      badges={[
        state.sessionContext?.pendingDecision ? (
          <StatusPill
            key="decision"
            value={state.sessionContext.pendingDecision.blocking ? 'decision required' : 'recommendation'}
            tone="warning"
          />
        ) : null,
        state.sessionContext?.currentTask ? (
          <StatusPill
            key="task"
            value={`Task ${state.sessionContext.currentTask.state}`}
            tone={toneForTaskState(state.sessionContext.currentTask.state)}
          />
        ) : null,
        state.sessionContext?.adoption && state.sessionContext.adoption.state !== 'agent-ready' ? (
          <StatusPill
            key="adoption"
            value={`adoption ${state.readinessReport.readiness}`}
            tone={toneForReadiness(state.readinessReport.readiness)}
          />
        ) : null,
      ]}
      aside={
        <OverviewInspectorAside
          activeTaskCount={activeTasks.length}
          attentionLabel={warningChecks.length > 0 ? `${warningChecks.length} checks` : 'clear'}
          decisionLabel={
            state.sessionContext?.pendingDecision
              ? state.sessionContext.pendingDecision.blocking
                ? 'required'
                : 'recommended'
              : undefined
          }
        />
      }
    >
      <PageSectionStack>
        <NowGuidanceCard state={state} />
        <TaskFocusCard tasks={focusTasks} />
        {showProjectOrientation ? (
          <>
            <OverviewUnderstandingCard understanding={state.understanding} />
            <OverviewProjectKnowledgeCard memoryView={state.memoryView} />
          </>
        ) : null}
        {latestDiscussionHandoff || recentDiscussionCheckpoints.length > 0 ? (
          <OverviewRecentDiscussionCard
            latestDiscussionHandoff={latestDiscussionHandoff}
            recentDiscussionCheckpoints={recentDiscussionCheckpoints}
            activeTaskView={activeTaskView}
          />
        ) : null}
        {warningChecks.length > 0 ? (
          <ContentSection
            title="Attention"
            description="Checks currently asking for human review."
          >
            <div className="border-y border-outline-weak">
              {warningChecks.slice(0, 4).map((check, index) => (
                <div
                  key={check.id}
                  className={`py-3.5 ${index > 0 ? 'border-t border-outline-weak' : ''}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-body-medium font-medium">{check.id}</p>
                    <StatusPill value={check.status} tone={toneForCheck(check.status)} />
                  </div>
                  <p className="mt-1.5 text-body-small text-on-surface-variant">
                    {check.summary}
                  </p>
                </div>
              ))}
            </div>
          </ContentSection>
        ) : null}
      </PageSectionStack>
    </ReviewPage>
  );
}

export function ExecutionTasksView({
  search,
}: {
  search: { view: 'open' | 'blocked' | 'claimed' | 'complete' };
}): React.JSX.Element {
  const state = requireConsoleState();
  const navigate = useNavigate();
  const {
    openTasks,
    allCompletedTasks,
    completedTasks,
    blockedTaskCount,
    claimedTaskCount,
    latestTask,
    primaryTasks,
    primaryTitle,
    primaryDescription,
  } = getTaskListContext(state, search.view);

  return (
    <ListPage
      title="Tracked work sessions"
      description="Choose the work that needs attention now. Closed work stays nearby without competing with the active queue."
      aside={
        <TaskListInspectorAside
          openCount={openTasks.length}
          blockedCount={blockedTaskCount}
          claimedCount={claimedTaskCount}
          completeCount={allCompletedTasks.length}
          updatedAt={latestTask?.task.updatedAt}
        />
      }
      filters={
        <RouteFilterBar label="Queue view">
          <SegmentedButton
            aria-label="Queue view"
            size="sm"
            value={search.view}
            options={[
              { value: 'open', label: 'Open' },
              { value: 'blocked', label: 'Blocked' },
              { value: 'claimed', label: 'Claimed' },
              { value: 'complete', label: 'Closed' },
            ]}
            onValueChange={(view) => void navigate({ to: '/tasks', search: { view } })}
          />
        </RouteFilterBar>
      }
    >
      <PageSectionStack className="gap-5">
        <TaskQueueCard
          title={primaryTitle}
          description={primaryDescription}
          tasks={primaryTasks}
          emptyTitle={`No ${search.view} tasks`}
          emptyDescription="No task matches this view. Start or claim a task when work should be tracked across files, decisions, and checks."
          compact={search.view === 'complete'}
        />
        {search.view !== 'complete' ? (
          <TaskQueueCard
            title="Recently closed"
            description="Completed slices stay visible without competing with the live queue."
            tasks={completedTasks}
            emptyTitle="No completed tasks"
            emptyDescription="Completed tasks will appear here after Skopos records a closed work session."
            compact
          />
        ) : null}
        <TaskListGuidanceCard
          openCount={openTasks.length}
          blockedCount={blockedTaskCount}
          claimedCount={claimedTaskCount}
        />
      </PageSectionStack>
    </ListPage>
  );
}

export function ExecutionDiscussionView(): React.JSX.Element {
  const state = requireConsoleState();
  const taskTitleById = Object.fromEntries(
    state.tasks.map((taskView) => [taskView.task.id, taskView.task.title]),
  );
  const activeTaskCount = state.discussionCheckpoints.filter(
    (checkpointView) => checkpointView.checkpoint.activeTaskId,
  ).length;

  return (
    <ReviewPage
      title="What did we agree in chat?"
      description="Handoffs and checkpoints that preserve accepted direction, open questions, and resume context."
      badges={[
        <StatusPill
          key="handoff"
          value={state.latestDiscussionHandoff ? 'handoff ready' : 'handoff missing'}
          tone={state.latestDiscussionHandoff ? 'positive' : 'warning'}
        />,
        <StatusPill
          key="checkpoints"
          value={`${state.discussionCheckpoints.length} checkpoints`}
          tone={state.discussionCheckpoints.length > 0 ? 'info' : 'neutral'}
        />,
      ]}
      aside={
        <OverviewInspectorAside
          activeTaskCount={activeTaskCount}
          attentionLabel={
            state.latestDiscussionHandoff?.handoff.overBudget ? 'budget warning' : 'compact'
          }
          proofPassRate={
            state.proofReport
              ? `${Math.round(state.proofReport.scorecard.weightedPassRate * 100)}%`
              : 'not run'
          }
          generatedAt={state.generatedAt}
        />
      }
    >
      <PageSectionStack>
        <DiscussionGuidanceCard
          latestDiscussionHandoff={state.latestDiscussionHandoff}
          checkpointCount={state.discussionCheckpoints.length}
          activeTaskCount={activeTaskCount}
        />
        <DiscussionHistoryCard
          latestDiscussionHandoff={state.latestDiscussionHandoff}
          checkpoints={state.discussionCheckpoints}
          taskTitleById={taskTitleById}
        />
      </PageSectionStack>
    </ReviewPage>
  );
}

export function ExecutionTaskDetailView({
  taskId,
}: {
  taskId: string;
}): React.JSX.Element {
  const state = requireConsoleState();
  const { taskView, taskActions, linkedTaskViews, guidance } = getTaskDetailContext(
    state,
    taskId,
  );
  const { latestDiscussionHandoff, taskCheckpoints } = getTaskDiscussionContext(
    state,
    taskId,
  );

  if (!taskView) {
    return (
      <DetailPage
        title="Task not found"
        description="The requested task is not present in this snapshot."
      >
        <EmptyMessage
          title="Unknown task"
          description="Refresh the app after rebuilding Skopos state if the task changed."
        />
      </DetailPage>
    );
  }

  const task = taskView.task;

  return (
    <DetailPage
      title={task.title}
      titleScale="compact"
      description={getTaskHeaderDescription(task)}
      badges={[
        <StatusPill
          key="state"
          value={task.state}
          tone={toneForTaskState(task.state)}
        />,
        <StatusPill key="scope" value={task.scope.scope.title} tone="neutral" />,
        task.coordination.claimedBy?.actorId ? (
          <StatusPill
            key="claim"
            value={`claimed ${task.coordination.claimedBy.actorId}`}
            tone="info"
          />
        ) : null,
      ]}
      aside={
        <TaskDetailInspectorAside
          taskView={taskView}
          taskActions={taskActions}
        />
      }
    >
      <PageSectionStack>
        {guidance ? <TaskGuidanceCard guidance={guidance} /> : null}
        <TaskChecklistCard taskView={taskView} />
        <TaskContractCard state={state} taskView={taskView} />
        <TaskDiscussionContextCard
          latestDiscussionHandoff={latestDiscussionHandoff}
          taskCheckpoints={taskCheckpoints}
        />
        <TaskLinkedWorkCard linkedTaskViews={linkedTaskViews} />
        <TaskActionRecordingCard taskView={taskView} />
      </PageSectionStack>
    </DetailPage>
  );
}

const getTaskHeaderDescription = (
  task: SkoposUiConsoleTaskView['task'],
): string => {
  const title = task.title.trim();
  const goal = task.goal.trim();
  const summary = task.summary?.trim() ?? '';

  if (goal && goal !== title) {
    return goal;
  }
  if (summary && summary !== title) {
    return summary;
  }
  return `Track progress, decisions, and proof for ${task.id}.`;
};
