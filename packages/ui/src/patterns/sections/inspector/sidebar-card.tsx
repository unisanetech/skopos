import * as React from 'react';

import { cn } from '../../../support/ui/classnames.js';

export function SidebarCard({
  title,
  badge,
  collapsible = false,
  defaultOpen = true,
  children,
}: {
  title: string;
  badge?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}): React.JSX.Element {
  const [open, setOpen] = React.useState(defaultOpen);

  const header = (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <p className="skopos-inspector-title truncate">{title}</p>
      {badge ? (
        <span className="skopos-sidebar-badge inline-flex items-center bg-[var(--panel-strong)] text-[var(--muted)]">
          {badge}
        </span>
      ) : null}
    </div>
  );

  return (
    <section className="border-b border-[var(--line)] py-3.5">
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="group flex w-full flex-wrap items-center justify-between gap-3 rounded-[var(--surface-radius-tight)] px-1 py-1.5 text-left transition-colors hover:bg-[color:rgba(255,252,246,0.45)] sm:flex-nowrap"
          aria-expanded={open}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${title}`}
        >
          {header}
          <span
            className={cn(
              'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--panel)] text-[12px] text-[var(--muted)] transition-colors',
              open
                ? 'border-[var(--line-strong)] bg-[var(--panel-strong)] text-[var(--muted-strong)]'
                : 'group-hover:border-[var(--line-strong)] group-hover:text-[var(--muted-strong)]',
            )}
            aria-hidden="true"
          >
            <span
              className={cn('transition-transform duration-150', open ? 'rotate-90' : undefined)}
            >
              ›
            </span>
          </span>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-3 pb-2">{header}</div>
      )}
      {!collapsible || open ? (
        <div className={cn('pt-1', collapsible ? 'pt-2.5' : undefined)}>{children}</div>
      ) : null}
    </section>
  );
}
