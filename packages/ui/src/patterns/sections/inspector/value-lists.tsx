import * as React from 'react';

import { cn } from '../../../support/ui/classnames.js';

export function KeyValueList({
  items,
  layout = 'compact',
}: {
  items: Array<{ label: string; value: string; monospace?: boolean }>;
  layout?: 'compact' | 'stacked';
}): React.JSX.Element {
  if (layout === 'compact') {
    return (
      <dl className="grid gap-0">
        {items.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-1 items-start gap-y-1 border-t border-[var(--line)] py-2.5 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-3 sm:gap-y-0"
          >
            <dt className="skopos-inspector-label pt-0.5">{item.label}</dt>
            <dd
              className={cn(
                'min-w-0 max-w-[var(--inspector-value-max)] break-words text-left [overflow-wrap:anywhere] sm:text-right',
                item.monospace ? 'skopos-mono-caption' : 'skopos-inspector-value',
              )}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className="grid gap-0">
      {items.map((item) => (
        <div
          key={item.label}
          className="border-t border-[var(--line)] py-3 first:border-t-0 first:pt-0 last:pb-0"
        >
          <dt className="skopos-inspector-label">{item.label}</dt>
          <dd
            className={cn(
              'min-w-0 break-words pt-1 [overflow-wrap:anywhere]',
              item.monospace ? 'skopos-mono-caption' : 'skopos-inspector-value',
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <div className="border-t border-[var(--line)] py-3 first:border-t-0 first:pt-0 last:pb-0">
      <p className="skopos-inspector-label">{label}</p>
      <p className="skopos-inspector-value mt-1">{value}</p>
    </div>
  );
}
