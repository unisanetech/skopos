'use client';

import React, { forwardRef, useRef } from 'react';
import { cn } from '@/lib/classnames';
import { useOverlayBehavior } from '@/lib/use-overlay-behavior';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { useSidebar } from '@/components/ui/sidebar/context/sidebar-provider';
import { CollapsedSidebarNavigation, SidebarNavigation } from '@/components/ui/sidebar/components/sidebar-navigation';

export interface SidebarDrawerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  'aria-label': string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  collapsedHeader?: React.ReactNode;
  collapsedFooter?: React.ReactNode;
  headline?: React.ReactNode;
  overlayHeadline?: React.ReactNode;
  emptyContent?: React.ReactNode;
  showCloseButton?: boolean;
}

export const SidebarDrawer = forwardRef<HTMLElement, SidebarDrawerProps>(
  (
    {
      header,
      footer,
      collapsedHeader,
      collapsedFooter,
      headline,
      overlayHeadline,
      emptyContent,
      showCloseButton = true,
      className,
      style,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const sidebar = useSidebar();
    const panelRef = useRef<HTMLElement | null>(null);
    const overlayRootRef = useRef<HTMLDivElement | null>(null);
    const isOpen = sidebar.isOverlay ? sidebar.mobileOpen : sidebar.isDrawerVisible;
    const isCollapsed =
      sidebar.mode === 'collapsible-drawer' && !sidebar.isOverlay && !sidebar.expanded;
    const showsContextualNavigation =
      !sidebar.isOverlay &&
      sidebar.mode === 'rail-drawer' &&
      Boolean(sidebar.effectiveItem?.items?.length);
    const navigationItems = showsContextualNavigation
      ? (sidebar.effectiveItem?.items ?? sidebar.items)
      : sidebar.items;
    const resolvedHeadline = sidebar.isOverlay
      ? overlayHeadline
      : headline === undefined && showsContextualNavigation
        ? sidebar.effectiveItem?.label
        : headline;

    useScrollLock(sidebar.isOverlay && isOpen);
    useOverlayBehavior({
      open: sidebar.isOverlay && isOpen,
      contentRef: panelRef,
      rootRef: overlayRootRef,
      modalBoundaryRef: sidebar.rootRef,
      onDismiss: sidebar.close,
      modal: true,
      dismissOnInteractOutside: true,
    });

    if (!sidebar.drawerEnabled || (sidebar.isOverlay && !isOpen)) return null;

    const setPanelRef = (node: HTMLElement | null) => {
      panelRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };
    const drawerWidth = sidebar.isOverlay
      ? sidebar.mobileDrawerWidth
      : isCollapsed
        ? sidebar.railWidth
        : sidebar.drawerWidth;
    const drawer = (
      <aside
        ref={setPanelRef}
        className={cn(
          'bg-surface-container-low text-on-surface duration-emphasized ease-emphasized flex h-full flex-col overflow-hidden transition-[transform,width] motion-reduce:transition-none',
          sidebar.isOverlay
            ? 'shadow-3 relative z-10 max-w-[85vw]'
            : 'absolute top-0 bottom-0 z-30',
          sidebar.isOverlay && sidebar.side === 'left' && 'rounded-e-[2rem]',
          sidebar.isOverlay && sidebar.side === 'right' && 'rounded-s-[2rem]',
          !sidebar.isOverlay && !isOpen && sidebar.side === 'left' && '-translate-x-full',
          !sidebar.isOverlay && !isOpen && sidebar.side === 'right' && 'translate-x-full',
          className,
        )}
        style={{
          width: `var(--sidebar-${sidebar.isOverlay ? 'mobile-drawer' : isCollapsed ? 'rail' : 'drawer'}-width, ${drawerWidth}px)`,
          [sidebar.side]: sidebar.isOverlay ? 0 : sidebar.railEnabled ? sidebar.railWidth : 0,
          ...style,
        }}
        onMouseEnter={!sidebar.isOverlay ? sidebar.retainPreview : undefined}
        onMouseLeave={!sidebar.isOverlay ? sidebar.releasePreview : undefined}
        aria-hidden={!isOpen}
        inert={!isOpen ? true : undefined}
        tabIndex={sidebar.isOverlay ? -1 : undefined}
        {...props}
      >
        <nav aria-label={ariaLabel} className="flex min-h-0 flex-1 flex-col">
          {isCollapsed ? (
            <>
              {collapsedHeader ? (
                <div className="flex shrink-0 justify-center pt-6 pb-4">{collapsedHeader}</div>
              ) : null}
              <div className="flex-1 overflow-y-auto px-1 py-2">
                <CollapsedSidebarNavigation items={sidebar.items} />
              </div>
              {collapsedFooter ? (
                <div className="mt-auto shrink-0 px-2 pb-3">{collapsedFooter}</div>
              ) : null}
            </>
          ) : (
            <>
              {header || (sidebar.isOverlay && showCloseButton) ? (
                <div className="flex shrink-0 items-start gap-3 px-4 pt-6 pb-4">
                  <div className="min-w-0 flex-1">{header}</div>
                  {sidebar.isOverlay && showCloseButton ? (
                    <button
                      type="button"
                      className="rounded-icon-button hover:bg-state-hover focus-visible:ring-focus-ring grid size-10 shrink-0 place-items-center focus-visible:ring-2 focus-visible:outline-none"
                      aria-label={`Close ${ariaLabel}`}
                      onClick={sidebar.close}
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">
                        close
                      </span>
                    </button>
                  ) : null}
                </div>
              ) : null}
              {resolvedHeadline ? (
                <div className="text-label-small text-on-surface-variant px-5 pt-2 pb-2 font-semibold tracking-wider uppercase">
                  {resolvedHeadline}
                </div>
              ) : null}
              <div className="flex-1 overflow-y-auto px-2 py-2">
                {navigationItems.length ? (
                  <SidebarNavigation
                    items={navigationItems}
                    showRootIcons={!showsContextualNavigation}
                  />
                ) : (
                  emptyContent
                )}
              </div>
              {footer ? <div className="mt-auto shrink-0 px-4 py-4">{footer}</div> : null}
            </>
          )}
        </nav>
      </aside>
    );

    if (!sidebar.isOverlay) return drawer;

    return (
      <div
        ref={overlayRootRef}
        className={cn(
          sidebar.containerMode === 'viewport' ? 'fixed' : 'absolute',
          'inset-0 z-[var(--z-drawer,1500)] flex',
          sidebar.side === 'right' && 'justify-end',
        )}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <div className="bg-scrim absolute inset-0" aria-hidden="true" />
        {drawer}
      </div>
    );
  },
);
SidebarDrawer.displayName = 'SidebarDrawer';
