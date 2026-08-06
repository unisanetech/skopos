import type { NavigationItem } from '@/types/navigation';
import type {
  SidebarBehavior,
  SidebarBehaviorConfig,
  SidebarBreakpoints,
  SidebarMode,
  SidebarTriggerVisibility,
  SidebarViewport,
} from '@/components/ui/sidebar/model/sidebar.types';

export const DEFAULT_SIDEBAR_BREAKPOINTS: SidebarBreakpoints = {
  mobile: 600,
  desktop: 840,
};

export const DEFAULT_SIDEBAR_BEHAVIOR: Record<SidebarViewport, SidebarBehavior> = {
  mobile: 'overlay',
  tablet: 'overlay',
  desktop: 'inset',
};

export interface SidebarViewportFlags {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface SidebarDerivedState {
  railEnabled: boolean;
  drawerEnabled: boolean;
  isOverlay: boolean;
  isRailVisible: boolean;
  isDrawerVisible: boolean;
  contentMargin: number;
}

export interface SidebarDerivedStateInput {
  mode: SidebarMode;
  behavior: SidebarBehavior;
  expanded: boolean;
  mobileOpen: boolean;
  previewHasChildren: boolean;
  railWidth: number;
  drawerWidth: number;
}

export interface SidebarTriggerVisibilityInput {
  visibility: SidebarTriggerVisibility;
  drawerEnabled: boolean;
  viewport: SidebarViewport;
}

export function parseStoredString(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export function parseStoredBoolean(raw: string | null): boolean | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === 'boolean' ? parsed : null;
  } catch {
    return null;
  }
}

export function parseStoredStringArray(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.every((value): value is string => typeof value === 'string') ? parsed : null;
  } catch {
    return null;
  }
}

export function computeViewportFlags(
  width: number,
  breakpoints: SidebarBreakpoints,
): SidebarViewportFlags {
  const isMobile = width < breakpoints.mobile;
  const isDesktop = width >= breakpoints.desktop;
  return { isMobile, isTablet: !isMobile && !isDesktop, isDesktop };
}

export function flagsToViewport(flags: SidebarViewportFlags): SidebarViewport {
  if (flags.isMobile) return 'mobile';
  if (flags.isTablet) return 'tablet';
  return 'desktop';
}

export function resolveSidebarBehavior(
  behavior: SidebarBehaviorConfig | undefined,
  viewport: SidebarViewport,
): SidebarBehavior {
  if (behavior === 'overlay' || behavior === 'inset') return behavior;
  const responsive = behavior;
  return responsive?.[viewport] ?? DEFAULT_SIDEBAR_BEHAVIOR[viewport];
}

export function deriveSidebarState(input: SidebarDerivedStateInput): SidebarDerivedState {
  if (input.mode === 'collapsible-drawer') {
    const isOverlay = input.behavior === 'overlay';
    return {
      railEnabled: false,
      drawerEnabled: true,
      isOverlay,
      isRailVisible: false,
      isDrawerVisible: isOverlay ? input.mobileOpen : true,
      contentMargin: isOverlay ? 0 : input.expanded ? input.drawerWidth : input.railWidth,
    };
  }

  const railEnabled = input.mode !== 'drawer-only';
  const drawerEnabled = input.mode !== 'rail-only';
  const isOverlay = drawerEnabled && input.behavior === 'overlay';
  const isDrawerVisible =
    drawerEnabled && (isOverlay ? input.mobileOpen : input.expanded || input.previewHasChildren);

  return {
    railEnabled,
    drawerEnabled,
    isOverlay,
    isRailVisible: railEnabled && !isOverlay,
    isDrawerVisible,
    contentMargin: !drawerEnabled || isOverlay || !input.expanded ? 0 : input.drawerWidth,
  };
}

export function shouldRenderSidebarTrigger(input: SidebarTriggerVisibilityInput): boolean {
  if (!input.drawerEnabled || input.visibility === 'hidden') return false;
  if (input.visibility === 'always' || input.visibility === 'auto') return true;
  if (input.visibility === 'desktop') return input.viewport === 'desktop';
  return input.viewport !== 'desktop';
}

export function findNavigationItemById(items: NavigationItem[], id: string): NavigationItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    const found = item.items ? findNavigationItemById(item.items, id) : null;
    if (found) return found;
  }
  return null;
}

export function findTopLevelContainerById(
  items: NavigationItem[],
  id: string,
): NavigationItem | null {
  for (const item of items) {
    if (item.id === id || (item.items && findNavigationItemById(item.items, id))) return item;
  }
  return null;
}

export function collectLeafItems(items: NavigationItem[]): NavigationItem[] {
  return items.flatMap((item) =>
    item.items?.length ? collectLeafItems(item.items) : item.hidden ? [] : [item],
  );
}

export function containsNavigationId(item: NavigationItem, id: string | null): boolean {
  if (!id) return false;
  return item.id === id || Boolean(item.items && findNavigationItemById(item.items, id));
}
