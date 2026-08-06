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
      <ul className="overflow-hidden border-y border-outline-weak">
        {items.map((item, index) => (
          <li
            key={getKey(item)}
            className={cn(
              'px-3 py-3',
              index > 0 ? 'border-t border-outline-weak' : undefined,
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
      <ul className="border-y border-outline-weak">
        {links.map((link) => (
          <li key={link.id} className="border-t border-outline-weak first:border-t-0">
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="block py-3.5 transition-colors hover:bg-state-hover"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-body-small text-on-surface font-medium">{link.title}</p>
                <StatusPill value={link.kind} tone="neutral" />
              </div>
              {showPaths ? (
                <p className="font-mono text-body-small text-on-surface-variant mt-1.5 break-all">{link.displayPath}</p>
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
      description="No related links are available here right now."
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
      <ul className="border-y border-outline-weak">
        {plans.map((planView, index) => (
          <li
            key={planView.plan.id}
            className={cn(
              'py-3.5',
              index > 0 ? 'border-t border-outline-weak' : undefined,
            )}
          >
            <p className="text-body-small text-on-surface font-medium">{planView.plan.title}</p>
            <p className="text-body-medium text-on-surface-variant mt-1">{planView.plan.summary}</p>
          </li>
        ))}
      </ul>
      <InspectorPreviewNote visibleCount={plans.length} totalCount={totalCount} noun="plans" />
    </div>
  ) : (
    <EmptyMessage
      title="No plans available"
      description="No plans are available here right now."
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
    <p className="text-body-small text-on-surface mt-2 px-0.5 text-on-surface-variant">
      Showing {visibleCount} of {totalCount} {noun}.
    </p>
  );
}
