import * as React from 'react';
import { Link } from '@tanstack/react-router';

import { Card } from '../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  KeyValueList,
  SidebarCard,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import type {
  ActivityFeedEntry,
  ActivityFeedGroup,
} from '../../platform/console-state/validation-selectors.js';
import {
  formatDateTime,
  formatTimeRange,
} from '../../support/formatting/console-formatting.js';

export function ActivityInspectorAside({
  postureItems,
  latestEntry,
}: {
  postureItems: Array<{ label: string; value: string }>;
  latestEntry?: ActivityFeedEntry;
}): React.JSX.Element {
  return (
    <>
      {postureItems.length > 0 ? (
        <SidebarCard title="At a glance">
          <KeyValueList items={postureItems} />
        </SidebarCard>
      ) : null}
      <SidebarCard title="Latest activity">
        {latestEntry ? (
          <>
            <p className="text-[13.5px] leading-6 text-[var(--muted-strong)]">
              {latestEntry.headline}
            </p>
            {latestEntry.summary ? (
              <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                {latestEntry.summary}
              </p>
            ) : null}
            <div className="mt-3">
              <KeyValueList
                items={[
                  { label: 'Kind', value: latestEntry.kindLabel },
                  ...(latestEntry.statusLabel
                    ? [{ label: 'Status', value: latestEntry.statusLabel }]
                    : []),
                  { label: 'When', value: formatDateTime(latestEntry.timestamp) },
                  ...(latestEntry.countLabel
                    ? [{ label: 'Repeated', value: latestEntry.countLabel }]
                    : []),
                  ...(latestEntry.actorId ? [{ label: 'Actor', value: latestEntry.actorId }] : []),
                ]}
              />
            </div>
          </>
        ) : (
          <EmptyMessage
            title="No events"
            description="The operational log is empty right now."
          />
        )}
      </SidebarCard>
    </>
  );
}

export function ActivityGuidanceCard({
  latestEntry,
  eventGroupCount,
}: {
  latestEntry?: ActivityFeedEntry;
  eventGroupCount: number;
}): React.JSX.Element {
  return (
    <Card
      title="How to use this page"
      description="Activity shows what Skopos recently recorded, so you can understand why the current state changed."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <GuidancePoint
          label="Latest change"
          text={latestEntry?.headline ?? 'No recent activity has been recorded yet.'}
        />
        <GuidancePoint
          label="Use when"
          text="You need to trace when missions, plans, readiness, evidence, or workflow state changed."
        />
        <GuidancePoint
          label="Next step"
          text={
            eventGroupCount > 0
              ? 'Open a linked mission or plan when an event needs more context.'
              : 'Start or refresh Skopos workflow state to populate activity.'
          }
        />
      </div>
    </Card>
  );
}

export function ActivityTimelineCard({
  feedGroups,
}: {
  feedGroups: ActivityFeedGroup[];
}): React.JSX.Element {
  return (
    <Card
      title="Recent changes"
      description="Grouped events from work sessions, plans, readiness checks, and evidence runs."
    >
      {feedGroups.length > 0 ? (
        <div className="space-y-6">
          {feedGroups.map((group) => (
            <section key={group.id}>
              <p className="skopos-eyebrow mb-2.5">{group.label}</p>
              <ol className="border-y border-[var(--line)]">
                {group.entries.map((entry, index) => (
                  <li
                    key={entry.id}
                    className={[
                      'px-0 py-4',
                      index > 0 ? 'border-t border-[var(--line)]' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <ActivityFeedEntryBody entry={entry} />
                      <p className="skopos-mono-caption shrink-0 text-right">
                        {formatDateTime(entry.timestamp)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No recent changes"
          description="No Skopos activity has been recorded yet. Start or claim a mission to connect work with history."
        />
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

function ActivityFeedEntryBody({
  entry,
}: {
  entry: ActivityFeedEntry;
}): React.JSX.Element {
  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill value={entry.kindLabel} tone="neutral" />
        {entry.statusLabel ? (
          <StatusPill value={entry.statusLabel} tone={entry.statusTone ?? 'neutral'} />
        ) : null}
        {entry.countLabel ? (
          <StatusPill value={entry.countLabel} tone="neutral" />
        ) : null}
      </div>
      <p className="mt-2 text-[15px] font-medium leading-7 tracking-[-0.01em] text-[var(--muted-strong)]">
        {entry.headline}
      </p>
      {entry.summary ? (
        <p className="mt-1.5 text-[13.5px] leading-6 text-[var(--muted)]">{entry.summary}</p>
      ) : null}
      {entry.actorId || entry.rangeStart ? (
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          {entry.actorId ? (
            <p className="skopos-mono-caption">{entry.actorId}</p>
          ) : null}
          {entry.rangeStart ? (
            <p className="skopos-mono-caption">
              {formatTimeRange(entry.rangeStart, entry.timestamp)}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );

  if (entry.missionId) {
    return (
      <Link
        to="/missions/$missionId"
        params={{ missionId: entry.missionId }}
        className="min-w-0 flex-1"
      >
        {content}
      </Link>
    );
  }

  if (entry.planId) {
    return (
      <Link
        to="/plans/$planId"
        params={{ planId: entry.planId }}
        className="min-w-0 flex-1"
      >
        {content}
      </Link>
    );
  }

  return <div className="min-w-0 flex-1">{content}</div>;
}
