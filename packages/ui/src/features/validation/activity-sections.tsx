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

export function ActivityTimelineCard({
  feedGroups,
}: {
  feedGroups: ActivityFeedGroup[];
}): React.JSX.Element {
  return (
    <Card
      title="Recent activity"
      description="A mixed feed of operational events, mission movement, plan updates, and workflow evidence."
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
          title="No operational events"
          description="No lifecycle events are available right now."
        />
      )}
    </Card>
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
