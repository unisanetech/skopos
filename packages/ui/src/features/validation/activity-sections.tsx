import * as React from 'react';
import { Link } from '@tanstack/react-router';

import { ContentSection } from '../../patterns/sections/content-primitives.js';
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
      <SidebarCard title="Latest change">
        {latestEntry ? (
          <>
            <p className="text-body-medium leading-6 text-on-surface">
              {latestEntry.headline}
            </p>
            {latestEntry.summary ? (
              <p className="mt-2 text-body-medium leading-6 text-on-surface-variant">
                {latestEntry.summary}
              </p>
            ) : null}
            <div className="mt-3">
              <KeyValueList
                items={[
                  ...(latestEntry.statusLabel
                    ? [{ label: 'Status', value: latestEntry.statusLabel }]
                    : []),
                  { label: 'When', value: formatDateTime(latestEntry.timestamp) },
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
      {postureItems.length > 0 ? (
        <SidebarCard title="Supporting totals" collapsible defaultOpen={false}>
          <KeyValueList items={postureItems} />
        </SidebarCard>
      ) : null}
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
    <ContentSection
      title={latestEntry ? 'The latest project change' : 'No project changes yet'}
      description={
        latestEntry?.summary ??
        'Skopos has not recorded enough activity to explain a recent change.'
      }
    >
      <div className="grid gap-3 md:grid-cols-3">
        <GuidancePoint
          label="What changed"
          text={latestEntry?.headline ?? 'No recent activity has been recorded yet.'}
        />
        <GuidancePoint
          label="Why it matters"
          text={
            latestEntry?.statusLabel
              ? `This work is now ${latestEntry.statusLabel.toLowerCase()}.`
              : 'This is the newest recorded change to the project story.'
          }
        />
        <GuidancePoint
          label="Next step"
          text={
            eventGroupCount > 0
              ? 'Open the linked Task or Plan when you need the full intent and current next step.'
              : 'Start or refresh Skopos action state to populate activity.'
          }
        />
      </div>
    </ContentSection>
  );
}

export function ActivityTimelineCard({
  feedGroups,
}: {
  feedGroups: ActivityFeedGroup[];
}): React.JSX.Element {
  return (
    <ContentSection
      title="Project story"
      description="Meaningful work changes first, with system events available only when you need to investigate."
    >
      {feedGroups.length > 0 ? (
        <div className="space-y-6">
          {feedGroups.map((group) => {
            const storyEntries = group.entries.filter((entry) => entry.feedKind !== 'event');
            const systemEntries = group.entries.filter((entry) => entry.feedKind === 'event');

            return <section key={group.id}>
              <p className="text-role-eyebrow text-on-surface-variant mb-2.5">{group.label}</p>
              {storyEntries.length > 0 ? <ol className="border-y border-outline-weak">
                {storyEntries.map((entry, index) => (
                  <li
                    key={entry.id}
                    className={[
                      'px-0 py-4',
                      index > 0 ? 'border-t border-outline-weak' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <ActivityFeedEntryBody entry={entry} />
                      <p className="text-body-small text-on-surface-variant shrink-0 text-right">
                        {formatDateTime(entry.timestamp)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol> : null}
              {systemEntries.length > 0 ? (
                <details className={storyEntries.length > 0 ? 'mt-3' : undefined}>
                  <summary className="cursor-pointer text-body-small font-medium text-on-surface-variant">
                    {systemEntries.length} supporting system event
                    {systemEntries.length === 1 ? '' : 's'}
                  </summary>
                  <ol className="mt-2 border-y border-outline-weak">
                    {systemEntries.map((entry, index) => (
                      <li
                        key={entry.id}
                        className={index > 0 ? 'border-t border-outline-weak py-3' : 'py-3'}
                      >
                        <ActivityFeedEntryBody entry={entry} compact />
                      </li>
                    ))}
                  </ol>
                </details>
              ) : null}
            </section>;
          })}
        </div>
      ) : (
        <EmptyMessage
          title="No recent changes"
          description="No Skopos activity has been recorded yet. Start or claim a task to connect work with history."
        />
      )}
    </ContentSection>
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
    <div className="border-t border-outline-weak pt-3">
      <p className="text-label-small uppercase text-on-surface-variant">
        {label}
      </p>
      <p className="mt-1 text-body-small text-on-surface">
        {text}
      </p>
    </div>
  );
}

function ActivityFeedEntryBody({
  entry,
  compact = false,
}: {
  entry: ActivityFeedEntry;
  compact?: boolean;
}): React.JSX.Element {
  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {entry.statusLabel ? (
          <StatusPill value={entry.statusLabel} tone={entry.statusTone ?? 'neutral'} />
        ) : null}
        {entry.countLabel ? (
          <StatusPill value={entry.countLabel} tone="neutral" />
        ) : null}
      </div>
      <p className={`${compact ? 'mt-1 text-body-medium' : 'mt-2 text-title-small leading-7'} font-medium text-on-surface`}>
        {entry.headline}
      </p>
      {entry.summary ? (
        <p className="mt-1.5 text-body-medium leading-6 text-on-surface-variant">{entry.summary}</p>
      ) : null}
      {entry.actorId || entry.rangeStart || entry.feedKind === 'event' ? (
        <details className="mt-2 text-body-small text-on-surface-variant">
          <summary className="cursor-pointer">Technical details</summary>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
            <span>{entry.kindLabel}</span>
            {entry.actorId ? <span>{entry.actorId}</span> : null}
            {entry.rangeStart ? <span>{formatTimeRange(entry.rangeStart, entry.timestamp)}</span> : null}
          </div>
        </details>
      ) : null}
    </>
  );

  if (entry.taskId) {
    return (
      <Link
        to="/tasks/$taskId"
        params={{ taskId: entry.taskId }}
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
