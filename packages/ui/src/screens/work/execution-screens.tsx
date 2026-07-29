import * as React from 'react';
import { Link } from '@tanstack/react-router';

import {
  DiscussionGuidanceCard,
  DiscussionHistoryCard,
  TaskChecklistCard,
  TaskDiscussionContextCard,
  TaskDetailInspectorAside,
  TaskFocusCard,
  TaskFrameCard,
  TaskGuidanceCard,
  TaskLinkedWorkCard,
  TaskActionRecordingCard,
  TaskListGuidanceCard,
  TaskListInspectorAside,
  TaskQueueCard,
  OverviewAdapterSupportCard,
  OverviewInspectorAside,
  OverviewProjectKnowledgeCard,
  OverviewRecentDiscussionCard,
  OverviewRecentPlansCard,
  OverviewUnderstandingCard,
} from '../../features/work/task-sections.js';
import { DetailPage } from '../../patterns/pages/detail-page.js';
import { ListPage } from '../../patterns/pages/list-page.js';
import { PageSectionStack } from '../../patterns/pages/shared.js';
import { ReviewPage } from '../../patterns/pages/review-page.js';
import {
  Card,
  RouteFilterBar,
} from '../../patterns/sections/content-primitives.js';
import {
  getExecutionOverviewContext,
  getTaskDetailContext,
  getTaskListContext,
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
import { filterChipClass } from '../../support/ui/filter-chip.js';

export function ExecutionOverviewView(): React.JSX.Element {
  const state = requireConsoleState();
  const { activeTasks, warningChecks, proofSummary, recentPlans } =
    getExecutionOverviewContext(state);
  const { latestDiscussionHandoff, recentDiscussionCheckpoints, activeTaskView } =
    getOverviewDiscussionContext(state);

  return (
    <ReviewPage
      kicker="Current work"
      title={state.workspaceLabel}
      description={buildReadinessSentence({
        readiness: state.readinessReport.readiness,
        passCount: state.readinessReport.checks.filter((check) => check.status === 'pass').length,
        warningCount: warningChecks.length,
        failureCount: state.readinessReport.checks.filter((check) => check.status === 'fail').length,
      })}
      badges={[
        <StatusPill
          key="readiness"
          value={`confidence ${state.readinessReport.readiness}`}
          tone={toneForReadiness(state.readinessReport.readiness)}
        />,
        <StatusPill
          key="readiness"
          value={state.readinessReport.readiness}
          tone={toneForReadiness(state.readinessReport.readiness)}
        />,
        state.proofReport ? (
          <StatusPill
            key="proof"
            value={`evidence ${state.proofReport.scorecard.status}`}
            tone={state.proofReport.scorecard.status === 'pass' ? 'positive' : 'danger'}
          />
        ) : null,
      ]}
      aside={
        <OverviewInspectorAside
          activeTaskCount={activeTasks.length}
          attentionLabel={warningChecks.length > 0 ? `${warningChecks.length} checks` : 'clear'}
          proofPassRate={
            proofSummary
              ? `${Math.round(proofSummary.scorecard.weightedPassRate * 100)}%`
              : 'not run'
          }
          generatedAt={state.generatedAt}
        />
      }
    >
      <PageSectionStack>
        <OverviewUnderstandingCard understanding={state.understanding} />
        <OverviewProjectKnowledgeCard memoryView={state.memoryView} />
        <TaskFocusCard tasks={activeTasks} />
        <OverviewAdapterSupportCard adapterSupport={state.adapterSupport} />
        <OverviewRecentDiscussionCard
          latestDiscussionHandoff={latestDiscussionHandoff}
          recentDiscussionCheckpoints={recentDiscussionCheckpoints}
          activeTaskView={activeTaskView}
        />
        <Card
          title="Attention"
          description="Checks currently asking for human review."
        >
          {warningChecks.length > 0 ? (
            <div className="border-y border-[var(--line)]">
              {warningChecks.slice(0, 4).map((check, index) => (
                <div
                  key={check.id}
                  className={`py-3.5 ${index > 0 ? 'border-t border-[var(--line)]' : ''}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] font-medium tracking-[-0.01em]">{check.id}</p>
                    <StatusPill value={check.status} tone={toneForCheck(check.status)} />
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                    {check.summary}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyMessage
              title="Nothing urgent"
              description="Readiness checks are currently not surfacing blockers or warning-level attention."
            />
          )}
        </Card>
        <OverviewRecentPlansCard recentPlans={recentPlans} />
      </PageSectionStack>
    </ReviewPage>
  );
}

const buildReadinessSentence = ({
  readiness,
  passCount,
  warningCount,
  failureCount,
}: {
  readiness: string;
  passCount: number;
  warningCount: number;
  failureCount: number;
}): string =>
  `Readiness is ${readiness} with ${passCount} ${passCount === 1 ? 'passing check' : 'passing checks'}, ${warningCount} ${warningCount === 1 ? 'warning' : 'warnings'}, and ${failureCount} ${failureCount === 1 ? 'failure' : 'failures'}.`;

export function ExecutionTasksView({
  search,
}: {
  search: { view: 'open' | 'blocked' | 'claimed' | 'complete' };
}): React.JSX.Element {
  const state = requireConsoleState();
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
      kicker="Tasks"
      title="Tracked work sessions"
      description="A task is the active container Skopos uses to track work, decisions, progress, and closure evidence."
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
          {([
            ['open', 'Open'],
            ['blocked', 'Blocked'],
            ['claimed', 'Claimed'],
            ['complete', 'Closed'],
          ] as const).map(([value, label]) => (
            <Link
              key={value}
              to="/tasks"
              search={{ view: value }}
              className={filterChipClass(search.view === value)}
            >
              {label}
            </Link>
          ))}
        </RouteFilterBar>
      }
    >
      <PageSectionStack className="gap-5">
        <TaskListGuidanceCard
          openCount={openTasks.length}
          blockedCount={blockedTaskCount}
          claimedCount={claimedTaskCount}
        />
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
      kicker="Discussion"
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
        kicker="Task detail"
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
      kicker="Task detail"
      title={task.title}
      description={task.goal}
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
        <TaskActionRecordingCard taskView={taskView} />
        <TaskFrameCard taskView={taskView} />
        <TaskDiscussionContextCard
          latestDiscussionHandoff={latestDiscussionHandoff}
          taskCheckpoints={taskCheckpoints}
        />
        <TaskChecklistCard taskView={taskView} />
        <TaskLinkedWorkCard linkedTaskViews={linkedTaskViews} />
      </PageSectionStack>
    </DetailPage>
  );
}
