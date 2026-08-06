import * as React from 'react';

import { Card as UiCard } from '@/components/ui/card';
import { CardGrid } from '@/components/ui/card-grid';
import { Typography } from '@/components/ui/typography';
import type { SkoposUiConsoleState } from '../../../contracts/skopos-ui-console-state.js';
import { cn } from '../../../support/ui/classnames.js';
import { toneForCheck } from '../../../support/ui/tone-helpers.js';
import { StatusPill } from '../inspector/status-pill.js';

export const skoposListSurfaceClass = 'overflow-hidden rounded-sm border border-outline-weak bg-surface';

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
    interactive ? 'transition-colors hover:bg-state-hover focus-visible:outline-focus-ring focus-visible:outline-2' : undefined,
    compact ? 'px-4 py-3' : 'px-4 py-3.5',
    bordered ? 'border-t border-outline-weak' : undefined,
  );

export function MetricGrid({
  items,
}: {
  items: Array<{ label: string; value: number | string; helper: string }>;
}): React.JSX.Element {
  return (
    <CardGrid minItemWidth="sm">
        {items.map((item) => (
          <UiCard key={item.label} variant="low" padding="sm">
            <Typography variant="labelSmall" className="text-on-surface-variant">
              {item.label}
            </Typography>
            <Typography variant="headlineSmall" className="mt-2 tabular-nums">
              {item.value}
            </Typography>
            <Typography variant="bodySmall" className="mt-1.5 text-on-surface-variant">
              {item.helper}
            </Typography>
          </UiCard>
        ))}
    </CardGrid>
  );
}

export function ContentSection({
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
    <section className={cn('min-w-0', className)}>
      <Typography
        variant="titleLarge"
        component="h2"
      >
        {title}
      </Typography>
      <Typography variant="bodyMedium" className="mt-1 text-on-surface-variant">
        {description}
      </Typography>
      <div className="mt-4">{children}</div>
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
    <section className="min-w-0">
      <div className="skopos-scroll overflow-x-auto">
        <div className="flex min-w-max items-center gap-3">
          <Typography variant="labelSmall" className="shrink-0 text-on-surface-variant">
            {label}
          </Typography>
          {children}
        </div>
      </div>
    </section>
  );
}

export function ReadinessCheckGroup({
  title,
  checks,
  tone,
}: {
  title: string;
  checks: SkoposUiConsoleState['readinessReport']['checks'];
  tone: 'positive' | 'warning' | 'danger';
}): React.JSX.Element {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-title-medium text-on-surface">{title}</h3>
        <StatusPill value={`${checks.length}`} tone={tone} />
      </div>
      <div className="border-y border-outline-weak">
        {checks.map((check, index) => (
          <div
            key={check.id}
            className={cn(
              'py-3.5',
              index > 0 ? 'border-t border-outline-weak' : undefined,
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-body-small text-on-surface font-medium">{check.id}</p>
              <StatusPill value={check.status} tone={toneForCheck(check.status)} />
            </div>
            <p className="text-body-medium text-on-surface-variant mt-1.5">{check.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
