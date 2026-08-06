'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/classnames';
import { useSidebar } from '@/components/ui/sidebar/context/sidebar-provider';

export interface SidebarInsetProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const SidebarInset = forwardRef<HTMLElement, SidebarInsetProps>(
  ({ children, className, style, ...props }, ref) => {
    const sidebar = useSidebar();
    const topOffset =
      sidebar.containerMode === 'contained' ? 0 : sidebar.isOverlay ? sidebar.mobileInsetOffset : 0;
    const insetStyle: React.CSSProperties & { '--sidebar-margin': string } = {
      marginTop: topOffset,
      height:
        sidebar.containerMode === 'contained'
          ? '100%'
          : topOffset > 0
            ? `calc(100vh - ${topOffset}px)`
            : '100vh',
      marginLeft: sidebar.side === 'left' ? sidebar.contentMargin : 0,
      marginRight: sidebar.side === 'right' ? sidebar.contentMargin : 0,
      '--sidebar-margin': `${sidebar.contentMargin}px`,
      ...style,
    };

    return (
      <main
        ref={ref}
        className={cn(
          'bg-surface duration-emphasized ease-emphasized flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto transition-[margin,height,margin-top] motion-reduce:transition-none',
          className,
        )}
        style={insetStyle}
        aria-hidden={sidebar.isOverlay && sidebar.mobileOpen ? true : undefined}
        {...props}
      >
        {children}
      </main>
    );
  },
);
SidebarInset.displayName = 'SidebarInset';
