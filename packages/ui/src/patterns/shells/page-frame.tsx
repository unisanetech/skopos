import * as React from 'react';

import {
  SKOPOS_CONTENT_WIDTH_CLASS,
  SKOPOS_INSPECTOR_INSET_CLASS,
  SKOPOS_PAGE_FRAME_GRID_WITH_ASIDE_CLASS,
  SKOPOS_SHELL_INSET_CLASS,
} from '../../app/layout-tokens.js';
import { cn } from '../../support/ui/classnames.js';
import { useSkoposConsoleChrome } from './console-chrome.js';

export function PageFrame({
  header,
  headerActions,
  aside,
  children,
}: {
  header: React.ReactNode;
  headerActions?: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}): React.JSX.Element {
  const chrome = useSkoposConsoleChrome();

  return (
    <div
      className={cn(
        'grid h-full min-h-full min-w-0 items-stretch gap-0',
        aside ? SKOPOS_PAGE_FRAME_GRID_WITH_ASIDE_CLASS : undefined,
      )}
    >
      <div className="min-w-0 bg-[var(--canvas)] xl:flex xl:h-full xl:min-h-full xl:flex-col">
        {chrome ? (
          <div className="border-b border-[var(--line)] bg-[var(--canvas)]">
            <div
              className={cn(
                'skopos-header-row flex min-w-0 flex-wrap items-start justify-between gap-3 md:flex-nowrap md:items-center md:gap-4',
                SKOPOS_SHELL_INSET_CLASS,
              )}
            >
              <div className="flex min-w-0 flex-1 basis-full items-center gap-2 skopos-eyebrow md:basis-auto">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span>Skopos</span>
                  <span>/</span>
                  <span>{chrome.workspaceLabel}</span>
                  <span>/</span>
                  <span className="text-[var(--muted-strong)]">{chrome.routeTitle}</span>
                </div>
              </div>
              {headerActions ? (
                <div className="ml-auto flex w-full shrink-0 items-center justify-end gap-1.5 md:w-auto md:justify-start">
                  {headerActions}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        <div
          className="skopos-scroll xl:h-full xl:min-h-0 xl:flex-1 xl:overflow-y-auto"
          data-skopos-page-scroll-root="true"
        >
          <div className={SKOPOS_SHELL_INSET_CLASS}>
            <div
              className={cn(
                'skopos-page-body mx-auto min-w-0 pt-4',
                SKOPOS_CONTENT_WIDTH_CLASS,
              )}
            >
              {header}
              <div className="mt-7">{children}</div>
            </div>
          </div>
        </div>
      </div>
      {aside ? (
        <aside className="min-w-0 border-t border-[var(--line)] bg-[var(--inspector)] xl:h-full xl:min-h-full xl:self-stretch xl:border-t-0 xl:border-l">
          <div
            className={cn(
              'skopos-scroll grid content-start gap-0 overflow-x-hidden xl:h-full xl:min-h-full xl:overflow-y-auto',
              SKOPOS_INSPECTOR_INSET_CLASS,
            )}
          >
            {aside}
          </div>
        </aside>
      ) : null}
    </div>
  );
}

export function RouteHero({
  kicker,
  title,
  description,
  badges,
}: {
  kicker: string;
  title: string;
  description: string;
  badges?: Array<React.ReactNode | null>;
}): React.JSX.Element {
  const visibleBadges = badges?.filter(Boolean) ?? [];

  return (
    <section className="px-2 py-1">
      <p className="skopos-eyebrow">{kicker}</p>
      <h2 className="skopos-page-title mt-2.5">{title}</h2>
      <p className="skopos-helper-copy mt-2 max-w-[42rem]">{description}</p>
      {visibleBadges.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">{visibleBadges}</div>
      ) : null}
    </section>
  );
}

export function HeaderIconButton({
  label,
  title,
  disabled = false,
  children,
  href,
}: {
  label: string;
  title?: string;
  disabled?: boolean;
  children: React.ReactNode;
  href?: string;
}): React.JSX.Element {
  const className = cn(
    'skopos-icon-button inline-flex items-center justify-center border border-[var(--line)] text-[13px] text-[var(--muted-strong)] transition-colors',
    disabled
      ? 'cursor-default opacity-35'
      : 'hover:border-[var(--line-strong)] hover:bg-[var(--panel-strong)]',
  );

  if (!href || disabled) {
    return (
      <span aria-label={label} title={title ?? label} className={className}>
        <span aria-hidden="true">{children}</span>
      </span>
    );
  }

  return (
    <a href={href} aria-label={label} title={title ?? label} className={className}>
      <span aria-hidden="true">{children}</span>
    </a>
  );
}
