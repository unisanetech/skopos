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
      <dl className="grid min-w-0 max-w-full gap-0">
        {items.map((item) => {
          const displayValue = item.monospace ? compactInspectorPath(item.value) : item.value;

          return (
            <div
              key={item.label}
              className="grid grid-cols-1 items-start gap-y-1 border-t border-outline-weak py-2 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-x-3 sm:gap-y-0"
            >
              <dt className="text-label-small text-on-surface-variant pt-0.5">{item.label}</dt>
              <dd
                className={cn(
                  'min-w-0 max-w-full break-words text-left [overflow-wrap:anywhere] sm:text-right',
                  item.monospace
                    ? 'font-mono text-body-small text-on-surface-variant'
                    : 'text-body-small text-on-surface',
                )}
                title={displayValue === item.value ? undefined : item.value}
              >
                {displayValue}
              </dd>
            </div>
          );
        })}
      </dl>
    );
  }

  return (
    <dl className="grid min-w-0 max-w-full gap-0">
      {items.map((item) => {
        const displayValue = item.monospace ? compactInspectorPath(item.value) : item.value;

        return (
          <div
            key={item.label}
            className="border-t border-outline-weak py-2.5 first:border-t-0 first:pt-0 last:pb-0"
          >
            <dt className="text-label-small text-on-surface-variant">{item.label}</dt>
            <dd
              className={cn(
                'min-w-0 max-w-full break-words pt-1 [overflow-wrap:anywhere]',
                item.monospace
                  ? 'font-mono text-body-small text-on-surface-variant'
                  : 'text-body-small text-on-surface',
              )}
              title={displayValue === item.value ? undefined : item.value}
            >
              {displayValue}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function compactInspectorPath(value: string): string {
  if (!value.startsWith('/') && !/^[A-Za-z]:[\\/]/.test(value)) {
    return value;
  }

  const normalized = value.replaceAll('\\', '/');
  const projectMarkers = ['/.skopos/', '/docs/', '/packages/', '/internal/', '/tools/'];
  const marker = projectMarkers
    .map((candidate) => ({ candidate, index: normalized.lastIndexOf(candidate) }))
    .filter(({ index }) => index >= 0)
    .sort((left, right) => right.index - left.index)[0];

  return marker ? normalized.slice(marker.index + 1) : value;
}

export function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <div className="border-t border-outline-weak py-3 first:border-t-0 first:pt-0 last:pb-0">
      <p className="text-label-small text-on-surface-variant">{label}</p>
      <p className="text-body-small text-on-surface mt-1">{value}</p>
    </div>
  );
}
