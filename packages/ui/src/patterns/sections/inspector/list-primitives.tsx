import * as React from 'react';

import type {
  SkoposUiConsoleLink,
  SkoposUiConsolePlanView,
} from '../../../contracts/skopos-ui-console-state.js';
import { cn } from '../../../support/ui/classnames.js';
import { EmptyMessage } from './empty-message.js';
import { StatusPill } from './status-pill.js';

export function SidebarList<T>({
  items,
  getKey,
  renderItem,
  emptyTitle,
  emptyDescription,
  totalCount,
  previewNoun = 'items',
}: {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  totalCount?: number;
  previewNoun?: string;
}): React.JSX.Element {
  return items.length > 0 ? (
    <div>
      <ul className="overflow-hidden border-y border-[var(--line)]">
        {items.map((item, index) => (
          <li
            key={getKey(item)}
            className={cn(
              'px-3 py-3',
              index > 0 ? 'border-t border-[var(--line)]' : undefined,
            )}
          >
            {renderItem(item)}
          </li>
        ))}
      </ul>
      <InspectorPreviewNote
        visibleCount={items.length}
        totalCount={totalCount}
        noun={previewNoun}
      />
    </div>
  ) : (
    <EmptyMessage title={emptyTitle} description={emptyDescription} />
  );
}

export function ExternalLinkList({
  links,
  showPaths = true,
  totalCount,
}: {
  links: SkoposUiConsoleLink[];
  showPaths?: boolean;
  totalCount?: number;
}): React.JSX.Element {
  return links.length > 0 ? (
    <div>
      <ul className="border-y border-[var(--line)]">
        {links.map((link) => (
          <li key={link.id} className="border-t border-[var(--line)] first:border-t-0">
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="block py-3.5 transition-colors hover:bg-[color:rgba(255,252,246,0.5)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="skopos-caption font-medium tracking-[-0.01em]">{link.title}</p>
                <StatusPill value={link.kind} tone="neutral" />
              </div>
              {showPaths ? (
                <p className="skopos-mono-caption mt-1.5 break-all">{link.displayPath}</p>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
      <InspectorPreviewNote visibleCount={links.length} totalCount={totalCount} noun="links" />
    </div>
  ) : (
    <EmptyMessage
      title="No links available"
      description="This surface does not currently expose external links."
    />
  );
}

export function SimplePlanList({
  plans,
  totalCount,
}: {
  plans: SkoposUiConsolePlanView[];
  totalCount?: number;
}): React.JSX.Element {
  return plans.length > 0 ? (
    <div>
      <ul className="border-y border-[var(--line)]">
        {plans.map((planView, index) => (
          <li
            key={planView.plan.id}
            className={cn(
              'py-3.5',
              index > 0 ? 'border-t border-[var(--line)]' : undefined,
            )}
          >
            <p className="skopos-caption font-medium tracking-[-0.01em]">{planView.plan.title}</p>
            <p className="skopos-helper-copy mt-1">{planView.plan.summary}</p>
          </li>
        ))}
      </ul>
      <InspectorPreviewNote visibleCount={plans.length} totalCount={totalCount} noun="plans" />
    </div>
  ) : (
    <EmptyMessage
      title="No plans available"
      description="The current snapshot does not include plan artifacts."
    />
  );
}

function InspectorPreviewNote({
  visibleCount,
  totalCount,
  noun,
}: {
  visibleCount: number;
  totalCount?: number;
  noun: string;
}): React.JSX.Element | null {
  if (!totalCount || totalCount <= visibleCount) {
    return null;
  }

  return (
    <p className="skopos-caption mt-2 px-0.5 text-[var(--muted)]">
      Showing {visibleCount} of {totalCount} {noun}.
    </p>
  );
}
