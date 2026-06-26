import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type {
  SkoposUiConsoleMissionView,
  SkoposUiConsolePlanView,
} from '../../../contracts/skopos-ui-console-state.js';
import {
  Card,
  getSkoposListRowClass,
  skoposListSurfaceClass,
} from '../../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  KeyValueList,
  SidebarCard,
  StatusPill,
} from '../../../patterns/sections/inspector-primitives.js';
import { formatDateTime } from '../../../support/formatting/console-formatting.js';
import { cn } from '../../../support/ui/classnames.js';

export function PlansInspectorAside({
  currentCount,
  linkedCount,
  libraryCount,
  updatedAt,
}: {
  currentCount: number;
  linkedCount: number;
  libraryCount: number;
  updatedAt?: string;
}): React.JSX.Element {
  return (
    <SidebarCard title="At a glance">
      <KeyValueList
        items={[
          { label: 'Current', value: String(currentCount) },
          { label: 'Linked', value: String(linkedCount) },
          { label: 'Library', value: String(libraryCount) },
          { label: 'Updated', value: formatDateTime(updatedAt) },
        ]}
      />
    </SidebarCard>
  );
}

export function PlanListGuidanceCard({
  currentCount,
  libraryCount,
}: {
  currentCount: number;
  libraryCount: number;
}): React.JSX.Element {
  return (
    <Card
      title="How to use this page"
      description="Plans are saved paths for work that is too large, risky, or important to keep only in chat."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <GuidancePoint
          label="Start here"
          text={
            currentCount > 0
              ? 'Open the current plan linked to the work you are doing now.'
              : 'No active plan is driving work right now.'
          }
        />
        <GuidancePoint
          label="Use when"
          text="A change needs phases, tradeoffs, user decisions, validation steps, or future follow-up."
        />
        <GuidancePoint
          label="Next step"
          text={
            currentCount > 0
              ? 'Read the plan brief, then follow the execution steps and decision gates.'
              : libraryCount > 0
                ? 'Use the library when you need past context or a reusable work shape.'
                : 'Create a plan when the next task is bigger than a simple edit.'
          }
        />
      </div>
    </Card>
  );
}

export function PlanListCard({
  title,
  description,
  plans,
  linkedMissionByPlanId,
  compact = false,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  description: string;
  plans: SkoposUiConsolePlanView[];
  linkedMissionByPlanId?: Map<string, SkoposUiConsoleMissionView>;
  compact?: boolean;
  emptyTitle: string;
  emptyDescription: string;
}): React.JSX.Element {
  return (
    <Card title={title} description={description}>
      {plans.length > 0 ? (
        <div className={skoposListSurfaceClass}>
          {plans.map((planView, index) => (
            <PlanListRow
              key={planView.plan.id}
              planView={planView}
              linkedMission={linkedMissionByPlanId?.get(planView.plan.id)}
              compact={compact}
              bordered={index > 0}
            />
          ))}
        </div>
      ) : (
        <EmptyMessage title={emptyTitle} description={emptyDescription} />
      )}
    </Card>
  );
}

function GuidancePoint({
  label,
  text,
}: {
  label: string;
  text: string;
}): React.JSX.Element {
  return (
    <div className="border-t border-[var(--line)] pt-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-[12.5px] leading-[1.45rem] text-[var(--muted-strong)]">
        {text}
      </p>
    </div>
  );
}

function PlanListRow({
  planView,
  linkedMission,
  compact,
  bordered,
}: {
  planView: SkoposUiConsolePlanView;
  linkedMission?: SkoposUiConsoleMissionView;
  compact: boolean;
  bordered: boolean;
}): React.JSX.Element {
  return (
    <Link
      to="/plans/$planId"
      params={{ planId: planView.plan.id }}
      className={getSkoposListRowClass({ compact, bordered })}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill
            value={planView.plan.confidence}
            tone={planView.plan.confidence === 'high' ? 'positive' : 'warning'}
          />
          <StatusPill value={planView.plan.scope.scope.title} tone="neutral" />
          {linkedMission ? <StatusPill value={linkedMission.mission.state} tone="info" /> : null}
        </div>
        <p
          className={cn(
            compact
              ? 'mt-1.5 text-[13px] font-medium tracking-[-0.02em]'
              : 'mt-2 text-[14px] font-semibold tracking-[-0.03em]',
          )}
        >
          {planView.plan.title}
        </p>
        <p
          className={cn(
            compact
              ? 'mt-1 text-[12px] leading-[1.45rem] text-[var(--muted)]'
              : 'mt-1 text-[12.75px] leading-[1.5rem] text-[var(--muted)]',
          )}
        >
          {planView.plan.summary}
        </p>
        {linkedMission ? (
          <p className="mt-2 text-[12.25px] leading-[1.4rem] text-[var(--muted)]">
            Linked mission · {linkedMission.mission.title}
          </p>
        ) : null}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.25px] text-[var(--muted)]">
          <span>
            {planView.plan.implementationSteps.length} implementation step
            {planView.plan.implementationSteps.length === 1 ? '' : 's'}
          </span>
          <span>{formatDateTime(planView.plan.updatedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
