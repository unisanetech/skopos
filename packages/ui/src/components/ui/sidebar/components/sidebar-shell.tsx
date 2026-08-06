'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/classnames';
import { Icon } from '@/components/ui/icon';
import { useSidebar } from '@/components/ui/sidebar/context/sidebar-provider';
import type { SidebarTriggerVisibility } from '@/components/ui/sidebar/model/sidebar.types';
import { shouldRenderSidebarTrigger } from '@/components/ui/sidebar/model/sidebar.state';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, className, style, ...props }, ref) => {
    const sidebar = useSidebar();
    const registerContainer = sidebar.registerContainer;
    const setRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
        registerContainer(node);
      },
      [ref, registerContainer],
    );
    const sidebarStyle: React.CSSProperties & {
      '--sidebar-rail-width': string;
      '--sidebar-drawer-width': string;
      '--sidebar-mobile-drawer-width': string;
    } = {
      '--sidebar-rail-width': `${sidebar.railWidth}px`,
      '--sidebar-drawer-width': `${sidebar.drawerWidth}px`,
      '--sidebar-mobile-drawer-width': `${sidebar.mobileDrawerWidth}px`,
      ...style,
    };

    return (
      <div
        ref={setRootRef}
        className={cn(
          'relative isolate flex h-full',
          sidebar.isOverlay && sidebar.mobileOpen && 'z-[var(--z-drawer,1500)]',
          sidebar.side === 'right' && 'flex-row-reverse',
          className,
        )}
        data-slot="sidebar"
        data-side={sidebar.side}
        data-mode={sidebar.mode}
        data-behavior={sidebar.behavior}
        data-state={sidebar.isDrawerVisible ? 'open' : 'closed'}
        style={sidebarStyle}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Sidebar.displayName = 'Sidebar';

export interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  children?: React.ReactNode;
  visibility?: SidebarTriggerVisibility;
}

export const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ children, className, onClick, visibility = 'auto', ...props }, ref) => {
    const sidebar = useSidebar();
    if (
      !shouldRenderSidebarTrigger({
        visibility,
        drawerEnabled: sidebar.drawerEnabled,
        viewport: sidebar.viewport,
      })
    ) {
      return null;
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={(event) => {
          sidebar.toggle();
          onClick?.(event);
        }}
        className={cn(
          'rounded-icon-button text-on-surface-variant hover:bg-state-hover focus-visible:ring-focus-ring inline-flex size-10 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none',
          className,
        )}
        aria-expanded={sidebar.isOverlay ? sidebar.mobileOpen : sidebar.expanded}
        {...props}
      >
        {children ?? <Icon symbol="menu" />}
      </button>
    );
  },
);
SidebarTrigger.displayName = 'SidebarTrigger';
