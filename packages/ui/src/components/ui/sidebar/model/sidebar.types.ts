import type React from 'react';
import type {
  NavigationItem,
  NavigationLinkRenderer,
  NavigationPresentationProps,
} from '@/types/navigation';

export type SidebarSide = 'left' | 'right';
export type SidebarMode = 'rail-drawer' | 'drawer-only' | 'rail-only' | 'collapsible-drawer';
export type SidebarBehavior = 'overlay' | 'inset';
export type SidebarContainerMode = 'viewport' | 'contained';
export type SidebarTriggerVisibility = 'auto' | 'always' | 'desktop' | 'mobile' | 'hidden';
export type SidebarViewport = 'mobile' | 'tablet' | 'desktop';

export interface SidebarBreakpoints {
  mobile: number;
  desktop: number;
}

export type SidebarResponsiveBehavior = Partial<Record<SidebarViewport, SidebarBehavior>>;
export type SidebarBehaviorConfig = SidebarBehavior | SidebarResponsiveBehavior;

export interface SidebarContextValue {
  value: string | null;
  setValue: (value: string | null) => void;
  selectItem: (item: NavigationItem, source?: 'rail' | 'drawer') => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  toggleExpanded: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  toggle: () => void;
  close: () => void;
  effectiveItem: NavigationItem | null;
  viewport: SidebarViewport;
  isOverlay: boolean;
  isDrawerVisible: boolean;
  isRailVisible: boolean;
  railEnabled: boolean;
  drawerEnabled: boolean;
  side: SidebarSide;
  mode: SidebarMode;
  behavior: SidebarBehavior;
  containerMode: SidebarContainerMode;
  items: NavigationItem[];
  renderLink?: NavigationLinkRenderer;
  railWidth: number;
  drawerWidth: number;
  mobileDrawerWidth: number;
  mobileInsetOffset: number;
  contentMargin: number;
  previewItem: (id: string) => void;
  clearPreview: () => void;
  retainPreview: () => void;
  releasePreview: () => void;
  isGroupExpanded: (item: NavigationItem) => boolean;
  toggleGroup: (item: NavigationItem) => void;
  rootRef: React.RefObject<HTMLElement | null>;
  registerContainer: (node: HTMLElement | null) => void;
}

export interface SidebarProviderProps extends NavigationPresentationProps {
  children: React.ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  mobileOpen?: boolean;
  defaultMobileOpen?: boolean;
  persist?: boolean;
  storageKey?: string;
  hoverDelay?: number;
  exitDelay?: number;
  railWidth?: number;
  drawerWidth?: number;
  mobileDrawerWidth?: number;
  side?: SidebarSide;
  mode?: SidebarMode;
  behavior?: SidebarBehaviorConfig;
  containerMode?: SidebarContainerMode;
  breakpoints?: Partial<SidebarBreakpoints>;
  mobileInsetOffset?: number;
  openOnChildSelection?: boolean;
  initialViewport?: SidebarViewport;
  forceViewport?: SidebarViewport;
  onExpandedChange?: (expanded: boolean) => void;
  onMobileOpenChange?: (open: boolean) => void;
}
