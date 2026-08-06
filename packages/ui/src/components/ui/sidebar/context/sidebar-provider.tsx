'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useControllableState } from '@/lib/use-controllable-state';
import type { NavigationItem } from '@/types/navigation';
import type {
  SidebarBreakpoints,
  SidebarContextValue,
  SidebarProviderProps,
  SidebarViewport,
} from '@/components/ui/sidebar/model/sidebar.types';
import {
  DEFAULT_SIDEBAR_BREAKPOINTS,
  computeViewportFlags,
  containsNavigationId,
  deriveSidebarState,
  findNavigationItemById,
  findTopLevelContainerById,
  flagsToViewport,
  parseStoredBoolean,
  parseStoredString,
  parseStoredStringArray,
  resolveSidebarBehavior,
} from '@/components/ui/sidebar/model/sidebar.state';

const SidebarContext = createContext<SidebarContextValue | null>(null);

function viewportFlagsForValue(viewport: SidebarViewport, breakpoints: SidebarBreakpoints) {
  if (viewport === 'mobile') return computeViewportFlags(breakpoints.mobile - 1, breakpoints);
  if (viewport === 'tablet') return computeViewportFlags(breakpoints.mobile, breakpoints);
  return computeViewportFlags(breakpoints.desktop, breakpoints);
}

function initialViewportFlags(
  forceViewport: SidebarProviderProps['forceViewport'],
  initialViewport: SidebarProviderProps['initialViewport'],
  breakpoints: SidebarBreakpoints,
) {
  if (forceViewport) return viewportFlagsForValue(forceViewport, breakpoints);
  if (initialViewport) return viewportFlagsForValue(initialViewport, breakpoints);
  if (typeof window !== 'undefined') return computeViewportFlags(window.innerWidth, breakpoints);
  return viewportFlagsForValue('desktop', breakpoints);
}

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within a SidebarProvider');
  return context;
}

export function SidebarProvider({
  children,
  items,
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  onItemSelect,
  renderLink,
  expanded: controlledExpanded,
  defaultExpanded = false,
  mobileOpen: controlledMobileOpen,
  defaultMobileOpen = false,
  persist = false,
  storageKey = 'sidebar',
  hoverDelay = 150,
  exitDelay = 300,
  railWidth = 96,
  drawerWidth = 220,
  mobileDrawerWidth = 280,
  side = 'left',
  mode = 'rail-drawer',
  behavior,
  containerMode = 'viewport',
  breakpoints,
  mobileInsetOffset = 64,
  openOnChildSelection = true,
  initialViewport,
  forceViewport,
  onExpandedChange,
  onMobileOpenChange,
}: SidebarProviderProps) {
  const resolvedBreakpoints = useMemo<SidebarBreakpoints>(
    () => ({
      mobile: breakpoints?.mobile ?? DEFAULT_SIDEBAR_BREAKPOINTS.mobile,
      desktop: breakpoints?.desktop ?? DEFAULT_SIDEBAR_BREAKPOINTS.desktop,
    }),
    [breakpoints?.desktop, breakpoints?.mobile],
  );
  const activeTopLevel = defaultValue ? findTopLevelContainerById(items, defaultValue) : null;
  const defaultOpensChild =
    openOnChildSelection &&
    Boolean(activeTopLevel?.items?.length) &&
    activeTopLevel?.id !== defaultValue;
  const [value = null, setValueState] = useControllableState<string | null>({
    value: controlledValue,
    defaultValue,
    onChange: onValueChange,
  });
  const [expanded = false, setExpandedState] = useControllableState<boolean>({
    value: controlledExpanded,
    defaultValue: defaultExpanded || defaultOpensChild,
    onChange: onExpandedChange,
  });
  const [mobileOpen = false, setMobileOpenState] = useControllableState<boolean>({
    value: controlledMobileOpen,
    defaultValue: defaultMobileOpen,
    onChange: onMobileOpenChange,
  });
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [lastContextId, setLastContextId] = useState<string | null>(activeTopLevel?.id ?? null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [containerNode, setContainerNode] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [viewportFlags, setViewportFlags] = useState(() =>
    initialViewportFlags(forceViewport, initialViewport, resolvedBreakpoints),
  );
  const entryTimer = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  const viewport = flagsToViewport(viewportFlags);
  const resolvedBehavior = resolveSidebarBehavior(behavior, viewport);
  const previewItem = previewId ? findTopLevelContainerById(items, previewId) : null;
  const previewHasChildren = Boolean(previewItem?.items?.length);
  const derived = deriveSidebarState({
    mode,
    behavior: resolvedBehavior,
    expanded,
    mobileOpen,
    previewHasChildren,
    drawerWidth,
    railWidth,
  });

  const registerContainer = useCallback((node: HTMLElement | null) => {
    rootRef.current = node;
    setContainerNode(node);
    setContainerWidth(node?.clientWidth ?? null);
  }, []);

  useEffect(() => {
    if (containerMode !== 'contained' || !containerNode || typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerNode);
    return () => observer.disconnect();
  }, [containerMode, containerNode]);

  useEffect(() => {
    if (forceViewport) {
      setViewportFlags(viewportFlagsForValue(forceViewport, resolvedBreakpoints));
      return;
    }
    const update = () => {
      const width =
        containerMode === 'contained' && containerWidth !== null
          ? containerWidth
          : window.innerWidth;
      setViewportFlags(computeViewportFlags(width, resolvedBreakpoints));
    };
    update();
    if (containerMode === 'contained' && containerWidth !== null) return;
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [containerMode, containerWidth, forceViewport, resolvedBreakpoints]);

  useEffect(() => {
    if (!persist) return;
    try {
      const storedValue = parseStoredString(localStorage.getItem(`${storageKey}-value`));
      const storedExpanded = parseStoredBoolean(localStorage.getItem(`${storageKey}-expanded`));
      const storedGroups = parseStoredStringArray(localStorage.getItem(`${storageKey}-groups`));
      if (controlledValue === undefined && storedValue !== null) setValueState(storedValue);
      if (controlledExpanded === undefined && storedExpanded !== null) {
        setExpandedState(storedExpanded);
      }
      if (storedGroups) setExpandedGroups(new Set(storedGroups));
    } catch {
      return;
    }
  }, [controlledExpanded, controlledValue, persist, setExpandedState, setValueState, storageKey]);

  useEffect(() => {
    if (!persist || typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${storageKey}-value`, JSON.stringify(value));
      localStorage.setItem(`${storageKey}-expanded`, JSON.stringify(expanded));
      localStorage.setItem(`${storageKey}-groups`, JSON.stringify([...expandedGroups]));
    } catch {
      return;
    }
  }, [expanded, expandedGroups, persist, storageKey, value]);

  const setValue = useCallback((next: string | null) => setValueState(next), [setValueState]);
  const setExpanded = useCallback((next: boolean) => setExpandedState(next), [setExpandedState]);
  const setMobileOpen = useCallback(
    (next: boolean) => setMobileOpenState(next),
    [setMobileOpenState],
  );
  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded, setExpanded]);
  const toggleMobile = useCallback(() => setMobileOpen(!mobileOpen), [mobileOpen, setMobileOpen]);
  const close = useCallback(() => {
    if (derived.isOverlay) setMobileOpen(false);
    else setExpanded(false);
    setPreviewId(null);
  }, [derived.isOverlay, setExpanded, setMobileOpen]);
  const toggle = useCallback(() => {
    if (!derived.drawerEnabled) return;
    if (derived.isOverlay) toggleMobile();
    else toggleExpanded();
  }, [derived.drawerEnabled, derived.isOverlay, toggleExpanded, toggleMobile]);

  const selectItem = useCallback(
    (item: NavigationItem, source: 'rail' | 'drawer' = 'drawer') => {
      if (item.disabled) return;
      setValue(item.id);
      onItemSelect?.(item);
      const hasChildren = Boolean(item.items?.length);
      if (source === 'rail') {
        setPreviewId(null);
        if (hasChildren && derived.drawerEnabled) {
          setLastContextId(item.id);
          if (derived.isOverlay) setMobileOpen(true);
          else setExpanded(true);
        } else if (!hasChildren && !derived.isOverlay) {
          setExpanded(false);
        }
        return;
      }
      if (hasChildren) return;
      if (derived.isOverlay) setMobileOpen(false);
    },
    [derived.drawerEnabled, derived.isOverlay, onItemSelect, setExpanded, setMobileOpen, setValue],
  );

  useEffect(() => {
    const next = value ? findTopLevelContainerById(items, value) : null;
    if (next?.items?.length) setLastContextId(next.id);
    if (openOnChildSelection && next?.items?.length && next.id !== value && !derived.isOverlay) {
      setExpanded(true);
    }
  }, [derived.isOverlay, items, openOnChildSelection, setExpanded, value]);

  const canPreview = derived.drawerEnabled && !derived.isOverlay;
  const previewNavigationItem = useCallback(
    (id: string) => {
      if (!canPreview) return;
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
      if (entryTimer.current) window.clearTimeout(entryTimer.current);
      entryTimer.current = window.setTimeout(() => setPreviewId(id), hoverDelay);
    },
    [canPreview, hoverDelay],
  );
  const clearPreview = useCallback(() => {
    if (!canPreview) return;
    if (entryTimer.current) window.clearTimeout(entryTimer.current);
    exitTimer.current = window.setTimeout(() => setPreviewId(null), exitDelay);
  }, [canPreview, exitDelay]);
  const retainPreview = useCallback(() => {
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
    if (entryTimer.current) window.clearTimeout(entryTimer.current);
  }, []);
  const releasePreview = useCallback(() => {
    if (!canPreview) return;
    exitTimer.current = window.setTimeout(() => setPreviewId(null), exitDelay);
  }, [canPreview, exitDelay]);

  useEffect(
    () => () => {
      if (entryTimer.current) window.clearTimeout(entryTimer.current);
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
    },
    [],
  );

  const isGroupExpanded = useCallback(
    (item: NavigationItem) => {
      if (collapsedGroups.has(item.id)) return false;
      return expandedGroups.has(item.id) || containsNavigationId(item, value);
    },
    [collapsedGroups, expandedGroups, value],
  );
  const toggleGroup = useCallback(
    (item: NavigationItem) => {
      const currentlyOpen =
        !collapsedGroups.has(item.id) &&
        (expandedGroups.has(item.id) || containsNavigationId(item, value));
      setExpandedGroups((current) => {
        const next = new Set(current);
        if (currentlyOpen) next.delete(item.id);
        else next.add(item.id);
        return next;
      });
      setCollapsedGroups((current) => {
        const next = new Set(current);
        if (currentlyOpen) next.add(item.id);
        else next.delete(item.id);
        return next;
      });
    },
    [collapsedGroups, expandedGroups, value],
  );

  const contextItem = previewHasChildren
    ? previewItem
    : value
      ? findTopLevelContainerById(items, value)
      : null;
  useEffect(() => {
    if (contextItem?.items?.length) setLastContextId(contextItem.id);
  }, [contextItem]);
  const effectiveItem = lastContextId ? findNavigationItemById(items, lastContextId) : null;

  const contextValue = useMemo<SidebarContextValue>(
    () => ({
      value,
      setValue,
      selectItem,
      expanded,
      setExpanded,
      toggleExpanded,
      mobileOpen,
      setMobileOpen,
      toggleMobile,
      toggle,
      close,
      effectiveItem,
      viewport,
      isOverlay: derived.isOverlay,
      isDrawerVisible: derived.isDrawerVisible,
      isRailVisible: derived.isRailVisible,
      railEnabled: derived.railEnabled,
      drawerEnabled: derived.drawerEnabled,
      side,
      mode,
      behavior: resolvedBehavior,
      containerMode,
      items,
      renderLink,
      railWidth,
      drawerWidth,
      mobileDrawerWidth,
      mobileInsetOffset,
      contentMargin: derived.contentMargin,
      previewItem: previewNavigationItem,
      clearPreview,
      retainPreview,
      releasePreview,
      isGroupExpanded,
      toggleGroup,
      rootRef,
      registerContainer,
    }),
    [
      clearPreview,
      close,
      containerMode,
      derived,
      drawerWidth,
      effectiveItem,
      expanded,
      isGroupExpanded,
      items,
      mobileDrawerWidth,
      mobileInsetOffset,
      mobileOpen,
      previewNavigationItem,
      railWidth,
      registerContainer,
      releasePreview,
      renderLink,
      resolvedBehavior,
      retainPreview,
      selectItem,
      setExpanded,
      setMobileOpen,
      setValue,
      side,
      mode,
      toggle,
      toggleExpanded,
      toggleGroup,
      toggleMobile,
      value,
      viewport,
    ],
  );

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>;
}
