'use client';

import React from 'react';
import { cn } from '@/lib/classnames';
import { NavigationRail, type NavigationRailProps } from '@/components/ui/navigation-rail';
import { useSidebar } from '@/components/ui/sidebar/context/sidebar-provider';
import { findTopLevelContainerById } from '@/components/ui/sidebar/model/sidebar.state';

export type SidebarRailProps = Omit<
  NavigationRailProps,
  | 'items'
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'onItemSelect'
  | 'renderLink'
  | 'onItemHover'
>;

export function SidebarRail({ className, style, onMouseLeave, ...props }: SidebarRailProps) {
  const sidebar = useSidebar();
  if (!sidebar.isRailVisible) return null;
  const selectedTopLevel = sidebar.value
    ? (findTopLevelContainerById(sidebar.items, sidebar.value)?.id ?? null)
    : null;

  return (
    <NavigationRail
      items={sidebar.items}
      value={selectedTopLevel}
      onItemSelect={(item) => sidebar.selectItem(item, 'rail')}
      renderLink={sidebar.renderLink}
      onItemHover={sidebar.previewItem}
      onMouseLeave={(event) => {
        sidebar.clearPreview();
        onMouseLeave?.(event);
      }}
      className={cn(
        'w-auto border-r-0',
        sidebar.side === 'left' ? 'border-r' : 'border-l',
        className,
      )}
      style={{ width: `var(--sidebar-rail-width, ${sidebar.railWidth}px)`, ...style }}
      {...props}
    />
  );
}
