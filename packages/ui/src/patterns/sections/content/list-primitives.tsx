import * as React from 'react';

import type { SkoposUiConsoleState } from '../../../contracts/skopos-ui-console-state.js';
import { cn } from '../../../support/ui/classnames.js';
import { toneForCheck } from '../../../support/ui/tone-helpers.js';
import { StatusPill } from '../inspector/status-pill.js';

export const skoposListSurfaceClass = 'border-y border-[var(--line)]';

export const getSkoposListRowClass = ({
  compact = false,
  bordered = false,
  interactive = true,
}: {
  compact?: boolean;
  bordered?: boolean;
  interactive?: boolean;
} = {}): string =>
  cn(
    'block',
    interactive ? 'transition-colors hover:bg-[color:rgba(255,252,246,0.42)]' : undefined,
    compact ? 'px-2 py-3' : 'px-2 py-3.5',
    bordered ? 'border-t border-[var(--line)]' : undefined,
  );

export function MetricGrid({
  items,
}: {
  items: Array<{ label: string; value: number | string; helper: string }>;
}): React.JSX.Element {
  return (
    <div className="overflow-hidden border-y border-[var(--line)] bg-[var(--panel)]">
      <div className="grid md:grid-cols-2 xl:grid-cols-5">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              'px-4 py-4',
              index > 0 ? 'border-t border-[var(--line)] md:border-t-0 md:border-l' : undefined,
            )}
          >
            <p className="skopos-metric-label">{item.label}</p>
            <p className="skopos-metric-value mt-2">{item.value}</p>
            <p className="skopos-caption-muted mt-1.5">{item.helper}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Card({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <section className={cn('border-t border-[var(--line)] px-2 py-[1.125rem]', className)}>
      <div className="pb-2.5">
        <p className="skopos-section-title">{title}</p>
        <p className="skopos-helper-copy mt-1">{description}</p>
      </div>
      <div className="pt-1.5">{children}</div>
    </section>
  );
}

export function RouteFilterBar({
  label = 'View',
  children,
}: {
  label?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <section className="border-t border-[var(--line)] px-2 py-3.5">
      <div className="skopos-scroll -mx-1 overflow-x-auto">
        <div className="flex min-w-max items-center gap-2 px-1">
          <p className="skopos-eyebrow shrink-0">{label}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

export function TrustCheckGroup({
  title,
  checks,
  tone,
}: {
  title: string;
  checks: SkoposUiConsoleState['trustReport']['checks'];
  tone: 'positive' | 'warning' | 'danger';
}): React.JSX.Element {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="skopos-section-title">{title}</p>
        <StatusPill value={`${checks.length}`} tone={tone} />
      </div>
      <div className="border-y border-[var(--line)]">
        {checks.map((check, index) => (
          <div
            key={check.id}
            className={cn(
              'py-3.5',
              index > 0 ? 'border-t border-[var(--line)]' : undefined,
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="skopos-caption font-medium tracking-[-0.01em]">{check.id}</p>
              <StatusPill value={check.status} tone={toneForCheck(check.status)} />
            </div>
            <p className="skopos-helper-copy mt-1.5">{check.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
