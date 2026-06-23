import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type { SkoposUiConsoleMissionView } from '../../../contracts/skopos-ui-console-state.js';
import {
  KeyValueList,
  SidebarCard,
  SidebarList,
  StatusPill,
} from '../../../patterns/sections/inspector-primitives.js';
import { formatDateTime } from '../../../support/formatting/console-formatting.js';

export function MissionDetailInspectorAside({
  missionView,
  missionWorkflows,
  programItemDisposition,
  openProgramObligationCount,
  queuedNextTitle,
}: {
  missionView: SkoposUiConsoleMissionView;
  missionWorkflows: Array<{
    id: string;
    workflowTitle: string;
    runStatus: string;
    runByActorId?: string;
    finishedAt?: string;
  }>;
  programItemDisposition?: string;
  openProgramObligationCount: number;
  queuedNextTitle?: string;
}): React.JSX.Element {
  const mission = missionView.mission;
  const pendingItems = mission.items.filter((item) => item.status !== 'complete');
  const completeItems = mission.items.filter((item) => item.status === 'complete');

  return (
    <>
      <SidebarCard title="At a glance">
        <KeyValueList
          items={[
            {
              label: 'Progress',
              value: `${completeItems.length} of ${mission.items.length} complete`,
            },
            { label: 'Open items', value: String(pendingItems.length) },
            { label: 'Linked slices', value: String(mission.linkedSlices.length) },
            { label: 'Program obligations', value: String(openProgramObligationCount) },
            {
              label: 'Claimed by',
              value: mission.coordination.claimedBy?.actorId ?? '(unclaimed)',
            },
            { label: 'Updated', value: formatDateTime(mission.updatedAt) },
          ]}
        />
      </SidebarCard>
      <SidebarCard title="Closure pressure">
        <KeyValueList
          items={[
            {
              label: 'Decision gates',
              value: mission.decisionQuestionIds.length
                ? `${mission.decisionQuestionIds.length} required`
                : 'none',
            },
            {
              label: 'Workflow pressure',
              value: mission.recommendedWorkflowIds.length
                ? `${mission.recommendedWorkflowIds.length} required`
                : 'none',
            },
            {
              label: 'Program role',
              value: programItemDisposition ?? 'not in program queue',
            },
            {
              label: 'Queued next',
              value: queuedNextTitle ?? 'none',
            },
            {
              label: 'Last mutation',
              value: `${mission.coordination.lastUpdatedBy ?? 'unknown'} · ${formatDateTime(mission.coordination.lastUpdatedAt)}`,
            },
          ]}
        />
      </SidebarCard>
      <SidebarCard
        title="Validation commands"
        badge={String(mission.recommendedChecks.length)}
        collapsible
        defaultOpen={false}
      >
        <SidebarList
          items={mission.recommendedChecks}
          getKey={(check) => check}
          renderItem={(check) => (
            <p className="font-mono text-[11.25px] leading-[1.25rem] text-[var(--muted-strong)]">
              {check}
            </p>
          )}
          emptyTitle="No validation commands"
          emptyDescription="This mission does not currently list validation commands."
        />
      </SidebarCard>
      <SidebarCard
        title="Required workflows"
        badge={String(mission.recommendedWorkflowIds.length)}
        collapsible
        defaultOpen={mission.recommendedWorkflowIds.length <= 3}
      >
        <SidebarList
          items={mission.recommendedWorkflowIds}
          getKey={(workflowId) => workflowId}
          renderItem={(workflowId) => (
            <p className="font-mono text-[11.25px] leading-[1.25rem] text-[var(--muted-strong)]">
              {workflowId}
            </p>
          )}
          emptyTitle="No required workflows"
          emptyDescription="This mission does not currently carry workflow requirements."
        />
      </SidebarCard>
      <SidebarCard
        title="Recent evidence"
        badge={String(missionWorkflows.length)}
        collapsible
        defaultOpen={false}
      >
        <SidebarList
          items={missionWorkflows.slice(0, 3)}
          totalCount={missionWorkflows.length}
          previewNoun="workflow runs"
          getKey={(run) => run.id}
          renderItem={(run) => (
            <>
              <div className="flex items-center justify-between gap-2.5">
                <p className="text-[12.25px] font-medium tracking-[-0.01em]">
                  {run.workflowTitle}
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
              <p className="mt-1 text-[11.25px] leading-5 text-[var(--muted)]">
                {run.runByActorId ?? 'no actor'} · {formatDateTime(run.finishedAt)}
              </p>
            </>
          )}
          emptyTitle="No workflow evidence"
          emptyDescription="No recent workflow run currently maps back to this mission."
        />
      </SidebarCard>
      {missionView.plan ? (
        <SidebarCard title="Related plan" badge="1" collapsible defaultOpen={false}>
          <SidebarList
            items={[missionView.plan]}
            getKey={(planView) => planView.plan.id}
            renderItem={(planView) => (
              <Link
                to="/plans/$planId"
                params={{ planId: planView.plan.id }}
                className="block transition-colors hover:bg-[color:rgba(255,252,246,0.5)]"
              >
                <p className="text-[12.25px] font-medium tracking-[-0.01em]">
                  {planView.plan.title}
                </p>
                <p className="mt-1 text-[11.5px] leading-5 text-[var(--muted)]">
                  {planView.plan.summary}
                </p>
              </Link>
            )}
            emptyTitle="No related plan"
            emptyDescription="This mission is not currently linked to a plan."
          />
        </SidebarCard>
      ) : null}
    </>
  );
}
