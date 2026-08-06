'use client';

export { SidebarProvider, useSidebar } from '@/components/ui/sidebar/context/sidebar-provider';
export { Sidebar, SidebarTrigger } from '@/components/ui/sidebar/components/sidebar-shell';
export { SidebarRail } from '@/components/ui/sidebar/components/sidebar-rail';
export { SidebarDrawer } from '@/components/ui/sidebar/components/sidebar-drawer';
export { SidebarInset } from '@/components/ui/sidebar/components/sidebar-inset';

export type {
  SidebarProviderProps,
  SidebarContextValue,
  SidebarSide,
  SidebarMode,
  SidebarBehavior,
  SidebarBehaviorConfig,
  SidebarResponsiveBehavior,
  SidebarContainerMode,
  SidebarTriggerVisibility,
  SidebarViewport,
  SidebarBreakpoints,
} from '@/components/ui/sidebar/model/sidebar.types';
export type { SidebarProps, SidebarTriggerProps } from '@/components/ui/sidebar/components/sidebar-shell';
export type { SidebarRailProps } from '@/components/ui/sidebar/components/sidebar-rail';
export type { SidebarDrawerProps } from '@/components/ui/sidebar/components/sidebar-drawer';
export type { SidebarInsetProps } from '@/components/ui/sidebar/components/sidebar-inset';
