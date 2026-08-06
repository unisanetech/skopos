import * as React from 'react';

import { IconButton } from '@/components/ui/icon-button';
import { Icon } from '@/components/ui/icon';
import { PageSection } from '@/components/ui/page-section';
import { Typography } from '@/components/ui/typography';
import {
  SKOPOS_CONTENT_WIDTH_CLASS,
  SKOPOS_INSPECTOR_INSET_CLASS,
  SKOPOS_PAGE_FRAME_GRID_WITH_ASIDE_CLASS,
  SKOPOS_SHELL_INSET_CLASS,
} from '../../app/layout-tokens.js';
import { cn } from '../../support/ui/classnames.js';
import { ApplicationLink } from '../../support/ui/application-link.js';

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
  const [inspectorExpanded, setInspectorExpanded] = React.useState(readInspectorPreference);
  const hasInspector = Boolean(aside);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('skopos-inspector-expanded', String(inspectorExpanded));
  }, [inspectorExpanded]);

  return (
    <div
      className={cn(
        'grid h-full min-h-full min-w-0 items-stretch gap-0',
        hasInspector && inspectorExpanded ? SKOPOS_PAGE_FRAME_GRID_WITH_ASIDE_CLASS : undefined,
      )}
    >
      <div className="min-w-0 bg-surface xl:flex xl:h-full xl:min-h-full xl:flex-col">
        <div
          className="skopos-scroll skopos-scroll-hidden xl:h-full xl:min-h-0 xl:flex-1 xl:overflow-y-auto"
          data-skopos-page-scroll-root="true"
          role="region"
          aria-label="Page content"
          tabIndex={0}
        >
          <PageSection rhythm="compact" width="none" surface="surface">
            <div className={SKOPOS_SHELL_INSET_CLASS}>
              <div
                className={cn(
                  'skopos-page-body mx-auto min-w-0',
                  SKOPOS_CONTENT_WIDTH_CLASS,
                )}
              >
                <div className="flex min-w-0 flex-wrap items-start justify-between gap-4 md:flex-nowrap">
                  <div className="min-w-0 flex-1">{header}</div>
                  {headerActions || (hasInspector && !inspectorExpanded) ? (
                    <div className="flex shrink-0 items-center gap-1.5">
                      {headerActions}
                      {hasInspector && !inspectorExpanded ? (
                        <IconButton
                          aria-label="Show details panel"
                          title="Show details panel"
                          variant="outlined"
                          size="sm"
                          icon={<Icon symbol="right_panel_open" />}
                          onClick={() => setInspectorExpanded(true)}
                        />
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <div className="mt-8">{children}</div>
              </div>
            </div>
          </PageSection>
        </div>
      </div>
      {hasInspector && inspectorExpanded ? (
        <aside className="min-w-0 bg-surface p-3 pt-2 xl:h-full xl:min-h-full xl:self-stretch xl:pl-0">
          <div className="flex h-10 items-center justify-end">
            <IconButton
              aria-label="Hide details panel"
              title="Hide details panel"
              variant="outlined"
              size="sm"
              icon={<Icon symbol="right_panel_close" />}
              onClick={() => setInspectorExpanded(false)}
            />
          </div>
          <div
            className="skopos-inspector-panel skopos-scroll min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain rounded-md bg-surface"
            data-skopos-inspector-scroll-root="true"
          >
            <div
              className={cn(
                'grid min-h-0 content-start gap-0',
                SKOPOS_INSPECTOR_INSET_CLASS,
              )}
            >
              {aside}
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}

const readInspectorPreference = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem('skopos-inspector-expanded') !== 'false';
};

export function RouteHero({
  title,
  description,
  badges,
  titleScale = 'page',
}: {
  title: string;
  description: string;
  badges?: Array<React.ReactNode | null>;
  titleScale?: 'page' | 'compact';
}): React.JSX.Element {
  const visibleBadges = badges?.filter(Boolean) ?? [];

  return (
    <section>
      <Typography
        variant={titleScale === 'compact' ? 'headlineLarge' : 'pageTitle'}
        component="h1"
        className="wrap-break-word"
      >
        {title}
      </Typography>
      <Typography variant="bodyLarge" className="mt-2 max-w-[44rem] text-on-surface-variant">
        {description}
      </Typography>
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
  if (!href || disabled) {
    return (
      <IconButton
        aria-label={label}
        title={title ?? label}
        variant="outlined"
        size="sm"
        disabled={disabled}
        icon={children}
      />
    );
  }

  return (
    <IconButton asChild aria-label={label} title={title ?? label} variant="outlined" size="sm" icon={children}>
      <ApplicationLink href={href} />
    </IconButton>
  );
}
