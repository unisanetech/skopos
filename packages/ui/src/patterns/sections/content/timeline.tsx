import * as React from 'react';

import type { SkoposUiConsoleState } from '../../../contracts/skopos-ui-console-state.js';
import { formatDateTime } from '../../../support/formatting/console-formatting.js';
import { cn } from '../../../support/ui/classnames.js';
import { EmptyMessage } from '../inspector/empty-message.js';
import { StatusPill } from '../inspector/status-pill.js';

export function OperationTimeline({
  state,
  limit,
}: {
  state: SkoposUiConsoleState;
  limit: number;
}): React.JSX.Element {
  return state.activity.operationalEvents.length > 0 ? (
    <ol className="border-y border-[var(--line)]">
      {state.activity.operationalEvents.slice(0, limit).map((event, index) => (
        <li
          key={event.id}
          className={cn(
            'px-0 py-3.5',
            index > 0 ? 'border-t border-[var(--line)]' : undefined,
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill value={event.eventKind} tone="neutral" />
              <StatusPill
                value={event.status}
                tone={
                  event.status === 'succeeded'
                    ? 'positive'
                    : event.status === 'failed'
                      ? 'danger'
                      : 'warning'
                }
              />
            </div>
            <p className="skopos-mono-caption">{formatDateTime(event.timestamp)}</p>
          </div>
          <p className="skopos-caption mt-1.5">{event.summary}</p>
          <p className="skopos-mono-caption mt-1">{event.actorId ?? 'no actor recorded'}</p>
        </li>
      ))}
    </ol>
  ) : (
    <EmptyMessage
      title="No operational events"
      description="No recent events are available here right now."
    />
  );
}
