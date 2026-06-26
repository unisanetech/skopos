import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type { SkoposUiConsoleMissionView } from '../../contracts/skopos-ui-console-state.js';
import {
  Card,
  getSkoposListRowClass,
  skoposListSurfaceClass,
} from '../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  KeyValueList,
  SidebarCard,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import { countPendingMissionItems } from '../../support/execution/mission-metrics.js';
import { formatDateTime } from '../../support/formatting/console-formatting.js';
import { cn } from '../../support/ui/classnames.js';
import { toneForMissionState } from '../../support/ui/tone-helpers.js';

export function MissionQueueCard({
  title,
  description,
  missions,
  emptyTitle,
  emptyDescription,
  compact = false,
}: {
  title: string;
  description: string;
  missions: SkoposUiConsoleMissionView[];
  emptyTitle: string;
  emptyDescription: string;
  compact?: boolean;
}): React.JSX.Element {
  return (
    <Card title={title} description={description}>
      {missions.length > 0 ? (
        <div className={skoposListSurfaceClass}>
          {missions.map((missionView, index) => (
            <MissionQueueRow
              key={missionView.mission.id}
              missionView={missionView}
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

export function MissionListGuidanceCard({
  openCount,
  blockedCount,
  claimedCount,
}: {
  openCount: number;
  blockedCount: number;
  claimedCount: number;
}): React.JSX.Element {
  const hasBlockedWork = blockedCount > 0;
  const hasClaimedWork = claimedCount > 0;

  return (
    <Card
      title="How to use this page"
      description="Missions are tracked work sessions. Use them when work needs progress, decisions, checks, and closure evidence to stay connected."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <GuidancePoint
          label="Start here"
          text={
            hasBlockedWork
              ? 'Open the blocked queue first and resolve the question or issue stopping progress.'
              : hasClaimedWork
                ? 'Continue the claimed mission before starting another work session.'
                : openCount > 0
                  ? 'Open the active mission that matches the work you are doing now.'
                  : 'No active mission is waiting. Start one when work should be tracked.'
          }
        />
        <GuidancePoint
          label="Use when"
          text="A task spans files, decisions, checks, handoffs, or anything that should not be lost in chat."
        />
        <GuidancePoint
          label="Next step"
          text={
            openCount > 0
              ? 'Open a mission to see progress, current focus, questions, and proof needed.'
              : 'Start a mission before larger work so Skopos can track progress and closure.'
          }
        />
      </div>
    </Card>
  );
}

export function MissionListInspectorAside({
  openCount,
  blockedCount,
  claimedCount,
  completeCount,
  updatedAt,
}: {
  openCount: number;
  blockedCount: number;
  claimedCount: number;
  completeCount: number;
  updatedAt?: string;
}): React.JSX.Element {
  return (
    <SidebarCard title="At a glance">
      <KeyValueList
        items={[
          { label: 'Open', value: String(openCount) },
          ...(blockedCount > 0 ? [{ label: 'Blocked', value: String(blockedCount) }] : []),
          ...(claimedCount > 0 ? [{ label: 'Claimed', value: String(claimedCount) }] : []),
          { label: 'Complete', value: String(completeCount) },
          { label: 'Updated', value: formatDateTime(updatedAt) },
        ]}
      />
    </SidebarCard>
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

function MissionQueueRow({
  missionView,
  compact,
  bordered,
}: {
  missionView: SkoposUiConsoleMissionView;
  compact: boolean;
  bordered: boolean;
}): React.JSX.Element {
  const pendingCount = countPendingMissionItems(missionView.mission);
  const metadata = [
    `${pendingCount} pending item${pendingCount === 1 ? '' : 's'}`,
    ...(missionView.mission.linkedSlices.length > 0
      ? [
          `${missionView.mission.linkedSlices.length} linked slice${
            missionView.mission.linkedSlices.length === 1 ? '' : 's'
          }`,
        ]
      : []),
    formatDateTime(missionView.mission.updatedAt),
  ];

  return (
    <Link
      to="/missions/$missionId"
      params={{ missionId: missionView.mission.id }}
      className={getSkoposListRowClass({ compact, bordered })}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill
            value={missionView.mission.state}
            tone={toneForMissionState(missionView.mission.state)}
          />
          <StatusPill value={missionView.mission.scope.scope.title} tone="neutral" />
          {missionView.mission.coordination.claimedBy?.actorId ? (
            <StatusPill
              value={missionView.mission.coordination.claimedBy.actorId}
              tone="info"
            />
          ) : null}
        </div>
        <p
          className={cn(
            compact
              ? 'mt-1.5 text-[13px] font-medium tracking-[-0.02em]'
              : 'mt-2 text-[14px] font-semibold tracking-[-0.03em]',
          )}
        >
          {missionView.mission.title}
        </p>
        <p
          className={cn(
            compact
              ? 'mt-1 text-[12px] leading-[1.45rem] text-[var(--muted)]'
              : 'mt-1 line-clamp-2 text-[12.75px] leading-[1.5rem] text-[var(--muted)]',
          )}
        >
          {missionView.mission.summary}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.25px] text-[var(--muted)]">
          {metadata.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
