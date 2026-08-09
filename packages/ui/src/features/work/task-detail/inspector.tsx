import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type { SkoposUiConsoleTaskView } from '../../../contracts/skopos-ui-console-state.js';
import {
  KeyValueList,
  SidebarCard,
  SidebarList,
  StatusPill,
} from '../../../patterns/sections/inspector-primitives.js';
import { formatDateTime } from '../../../support/formatting/console-formatting.js';

export function TaskDetailInspectorAside({
  taskView,
  taskActions,
  workflow,
}: {
  taskView: SkoposUiConsoleTaskView;
  taskActions: Array<{
    id: string;
    actionTitle: string;
    runStatus: string;
    runByActorId?: string;
    finishedAt?: string;
  }>;
  workflow?: {
    workflow: string;
    readiness: string;
    ownershipSuggestion?: { paths: string[] };
  };
}): React.JSX.Element {
  const task = taskView.task;
  const pendingSteps = task.steps.filter((item) => item.status !== 'complete');
  const completeSteps = task.steps.filter((item) => item.status === 'complete');

  return (
    <>
      <SidebarCard title="At a glance">
        <KeyValueList
          items={[
            {
              label: 'Progress',
              value: `${completeSteps.length} of ${task.steps.length} complete`,
            },
            { label: 'Open steps', value: String(pendingSteps.length) },
            { label: 'Workflow', value: workflow?.workflow ?? task.admission?.workflow ?? task.risk },
            { label: 'Workflow readiness', value: workflow?.readiness ?? task.state },
            { label: 'Unowned changes', value: String(workflow?.ownershipSuggestion?.paths.length ?? 0) },
            { label: 'Child Tasks', value: String(task.childTasks.length) },
            {
              label: 'Claimed by',
              value: task.coordination.claimedBy?.actorId ?? '(unclaimed)',
            },
            { label: 'Updated', value: formatDateTime(task.updatedAt) },
          ]}
        />
      </SidebarCard>
      <SidebarCard title="Readiness requirements">
        <KeyValueList
          items={[
            {
              label: 'Decision questions',
              value: task.questions.length
                ? `${task.questions.length} required`
                : 'none',
            },
            {
              label: 'Selected Actions',
              value: task.selectedActions.length
                ? `${task.selectedActions.length} required`
                : 'none',
            },
            {
              label: 'Evidence requirements',
              value: String(task.evidenceRequirements.length),
            },
            {
              label: 'Last mutation',
              value: `${task.coordination.lastUpdatedBy ?? 'unknown'} · ${formatDateTime(task.coordination.lastUpdatedAt)}`,
            },
          ]}
        />
      </SidebarCard>
      <SidebarCard
        title="Selected Actions"
        badge={String(task.selectedActions.length)}
        collapsible
        defaultOpen={false}
      >
        <SidebarList
          items={task.selectedActions}
          getKey={(action) => action.id}
          renderItem={(action) => (
            <p className="font-mono text-label-small text-on-surface">
              {action.id}
            </p>
          )}
          emptyTitle="No selected Actions"
          emptyDescription="This Task does not currently require a registered Action."
        />
      </SidebarCard>
      <SidebarCard
        title="Recent evidence"
        badge={String(taskActions.length)}
        collapsible
        defaultOpen={false}
      >
        <SidebarList
          items={taskActions.slice(0, 3)}
          totalCount={taskActions.length}
          previewNoun="Action runs"
          getKey={(run) => run.id}
          renderItem={(run) => (
            <>
              <div className="flex items-center justify-between gap-2.5">
                <p className="text-body-small font-medium">
                  {run.actionTitle}
                </p>
                <StatusPill
                  value={run.runStatus}
                  tone={
                    run.runStatus === 'succeeded'
                      ? 'positive'
                      : run.runStatus === 'failed'
                        ? 'danger'
                        : 'warning'
                  }
                />
              </div>
              <p className="mt-1 text-label-small leading-5 text-on-surface-variant">
                {run.runByActorId ?? 'no actor'} · {formatDateTime(run.finishedAt)}
              </p>
            </>
          )}
          emptyTitle="No Action Evidence"
          emptyDescription="No recent Action run currently maps back to this Task."
        />
      </SidebarCard>
      {taskView.plan ? (
        <SidebarCard title="Related plan" badge="1" collapsible defaultOpen={false}>
          <SidebarList
            items={[taskView.plan]}
            getKey={(planView) => planView.plan.id}
            renderItem={(planView) => (
              <Link
                to="/plans/$planId"
                params={{ planId: planView.plan.id }}
                className="block transition-colors hover:bg-state-hover"
              >
                <p className="text-body-small font-medium">
                  {planView.plan.title}
                </p>
                <p className="mt-1 text-label-small leading-5 text-on-surface-variant">
                  {planView.plan.summary}
                </p>
              </Link>
            )}
            emptyTitle="No related plan"
            emptyDescription="This task is not currently linked to a plan."
          />
        </SidebarCard>
      ) : null}
    </>
  );
}
