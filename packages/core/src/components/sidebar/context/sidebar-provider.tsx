'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type {
  SidebarBreakpoints,
  SidebarProviderProps,
  SidebarState,
} from '../model/sidebar.types';
import {
  DEFAULT_SIDEBAR_BREAKPOINTS,
  computeViewportFlags,
  deriveSidebarState,
  findTopLevelContainerById,
  parseStoredBoolean,
  parseStoredString,
  parseStoredStringArray,
  resolveSidebarBehavior,
  toggleGroupSet,
} from '../model/sidebar.state';

const SidebarContext = createContext<SidebarState | null>(null);

export function useSidebar(): SidebarState {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({
  children,
  items = [],
  activeId: controlledActiveId,
  defaultActiveId = null,
  expanded: controlledExpanded,
  defaultExpanded = false,
  mobileOpen: controlledMobileOpen,
  defaultMobileOpen = false,
  persist = false,
  storageKey = 'unisane-sidebar',
  hoverDelay = 150,
  exitDelay = 300,
  railWidth = 96,
  drawerWidth = 220,
  mobileDrawerWidth = 280,
  side = 'left',
  mode = 'rail-drawer',
  behavior = 'adaptive',
  containerMode = 'viewport',
  breakpoints,
  mobileInsetOffset = 64,
  triggerVisibility = 'auto',
  visualPreset = 'default',
  tokens,
  forceViewport,
  onActiveIdChange,
  onActiveChange,
  onExpandedChange,
  onMobileOpenChange,
}: SidebarProviderProps) {
  const [activeIdState, setActiveIdState] = useState<string | null>(defaultActiveId);
  const [expandedState, setExpandedState] = useState<boolean>(defaultExpanded);
  const [mobileOpenState, setMobileOpenState] = useState(defaultMobileOpen);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lastContentId, setLastContentId] = useState<string | null>(defaultActiveId);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [containerNode, setContainerNode] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const resolvedBreakpoints: SidebarBreakpoints = {
    mobile: breakpoints?.mobile ?? DEFAULT_SIDEBAR_BREAKPOINTS.mobile,
    desktop: breakpoints?.desktop ?? DEFAULT_SIDEBAR_BREAKPOINTS.desktop,
  };

  const isActiveControlled = controlledActiveId !== undefined;
  const isExpandedControlled = controlledExpanded !== undefined;
  const isMobileOpenControlled = controlledMobileOpen !== undefined;

  const activeId = isActiveControlled ? controlledActiveId ?? null : activeIdState;
  const expanded = isExpandedControlled ? !!controlledExpanded : expandedState;
  const mobileOpen = isMobileOpenControlled ? !!controlledMobileOpen : mobileOpenState;

  const [isMobile, setIsMobile] = useState(forceViewport === 'mobile' || !forceViewport);
  const [isTablet, setIsTablet] = useState(forceViewport === 'tablet');
  const [isDesktop, setIsDesktop] = useState(forceViewport === 'desktop');

  const entryTimeoutRef = useRef<number | null>(null);
  const exitTimeoutRef = useRef<number | null>(null);

  const registerContainer = useCallback((node: HTMLElement | null) => {
    setContainerNode(node);
    if (!node) {
      setContainerWidth(null);
      return;
    }
    setContainerWidth(node.clientWidth);
  }, []);

  useEffect(() => {
    if (containerMode !== 'contained' || !containerNode || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(containerNode);
    return () => observer.disconnect();
  }, [containerMode, containerNode]);

  useEffect(() => {
    if (forceViewport) {
      setIsMobile(forceViewport === 'mobile');
      setIsTablet(forceViewport === 'tablet');
      setIsDesktop(forceViewport === 'desktop');
      return;
    }

    const updateFlags = () => {
      const sourceWidth =
        containerMode === 'contained' && containerWidth !== null ? containerWidth : window.innerWidth;
      const next = computeViewportFlags(sourceWidth, resolvedBreakpoints);
      setIsMobile(next.isMobile);
      setIsTablet(next.isTablet);
      setIsDesktop(next.isDesktop);
    };

    updateFlags();

    if (containerMode === 'contained') {
      return;
    }

    window.addEventListener('resize', updateFlags);
    return () => window.removeEventListener('resize', updateFlags);
  }, [
    containerMode,
    containerWidth,
    forceViewport,
    resolvedBreakpoints.desktop,
    resolvedBreakpoints.mobile,
  ]);

  useEffect(() => {
    if (!persist) return;

    try {
      const storedActive = parseStoredString(localStorage.getItem(`${storageKey}-active`));
      const storedExpanded = parseStoredBoolean(localStorage.getItem(`${storageKey}-expanded`));
      const storedGroups = parseStoredStringArray(localStorage.getItem(`${storageKey}-groups`));

      if (!isActiveControlled && storedActive !== null) {
        setActiveIdState(storedActive);
        setLastContentId(storedActive);
      }
      if (!isExpandedControlled && storedExpanded !== null) {
        setExpandedState(storedExpanded);
      }
      if (storedGroups) {
        setExpandedGroups(new Set(storedGroups));
      }
    } catch {
      return;
    }
  }, [isActiveControlled, isExpandedControlled, persist, storageKey]);

  const prevDefaultActiveIdRef = useRef(defaultActiveId);
  useEffect(() => {
    if (isActiveControlled) return;

    if (defaultActiveId !== prevDefaultActiveIdRef.current) {
      prevDefaultActiveIdRef.current = defaultActiveId;
      if (defaultActiveId) {
        setActiveIdState(defaultActiveId);
        setLastContentId(defaultActiveId);
        const item = findTopLevelContainerById(items, defaultActiveId);
        if (item?.items && item.items.length > 0 && !isExpandedControlled) {
          setExpandedState(true);
        }
      }
    }
  }, [defaultActiveId, isActiveControlled, isExpandedControlled, items]);

  useEffect(() => {
    if (!isMobileOpenControlled) {
      setMobileOpenState(defaultMobileOpen);
    }
  }, [defaultMobileOpen, isMobileOpenControlled, forceViewport]);

  useEffect(() => {
    if (!persist || typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${storageKey}-active`, JSON.stringify(activeId));
    } catch {
      return;
    }
  }, [activeId, persist, storageKey]);

  useEffect(() => {
    if (!persist || typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${storageKey}-expanded`, JSON.stringify(expanded));
    } catch {
      return;
    }
  }, [expanded, persist, storageKey]);

  useEffect(() => {
    if (!persist || typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${storageKey}-groups`, JSON.stringify(Array.from(expandedGroups)));
    } catch {
      return;
    }
  }, [expandedGroups, persist, storageKey]);

  useEffect(() => {
    return () => {
      if (entryTimeoutRef.current) clearTimeout(entryTimeoutRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, []);

  const resolvedBehavior = resolveSidebarBehavior(behavior, { isMobile, isTablet });
  const hoveredItem = hoveredId ? findTopLevelContainerById(items, hoveredId) : null;
  const hoverHasChildren = !!(hoveredItem?.items && hoveredItem.items.length > 0);

  const derived = deriveSidebarState({
    mode,
    behavior: resolvedBehavior,
    expanded,
    mobileOpen,
    hoveredHasChildren: !!hoveredId && hoverHasChildren,
    drawerWidth,
  });

  const setActiveId = useCallback(
    (id: string | null) => {
      if (!isActiveControlled) {
        setActiveIdState(id);
      }
      onActiveIdChange?.(id);
      onActiveChange?.(id);
    },
    [isActiveControlled, onActiveIdChange, onActiveChange],
  );

  const setExpanded = useCallback(
    (value: boolean) => {
      if (!isExpandedControlled) {
        setExpandedState(value);
      }
      onExpandedChange?.(value);
    },
    [isExpandedControlled, onExpandedChange],
  );

  const setMobileOpen = useCallback(
    (next: boolean) => {
      if (!isMobileOpenControlled) {
        setMobileOpenState(next);
      }
      onMobileOpenChange?.(next);
    },
    [isMobileOpenControlled, onMobileOpenChange],
  );

  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded, setExpanded]);

  const toggleMobile = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen, setMobileOpen]);

  const close = useCallback(() => {
    if (derived.usesOverlayDrawer) {
      setMobileOpen(false);
      return;
    }
    setExpanded(false);
    setHoveredId(null);
  }, [derived.usesOverlayDrawer, setExpanded, setMobileOpen]);

  const toggle = useCallback(() => {
    if (!derived.drawerEnabled) return;
    if (derived.usesOverlayDrawer) {
      toggleMobile();
    } else {
      toggleExpanded();
    }
  }, [derived.drawerEnabled, derived.usesOverlayDrawer, toggleExpanded, toggleMobile]);

  const handleClick = useCallback(
    (id: string) => {
      if (entryTimeoutRef.current) {
        clearTimeout(entryTimeoutRef.current);
        entryTimeoutRef.current = null;
      }
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }

      const item = findTopLevelContainerById(items, id);
      const hasChildren = !!(item?.items && item.items.length > 0);
      const wasDrawerVisible = expanded || !!hoveredId;

      setHoveredId(null);

      if (activeId === id) {
        if (!derived.drawerEnabled) return;

        if (hasChildren) {
          setExpanded(!expanded);
        } else {
          setExpanded(false);
        }
        return;
      }

      setActiveId(id);

      if (!derived.drawerEnabled) {
        return;
      }

      if (hasChildren) {
        setLastContentId(id);

        if (wasDrawerVisible) {
          if (!expanded) {
            setExpanded(true);
          }
        } else {
          setExpanded(true);
        }
      } else {
        setExpanded(false);
      }
    },
    [activeId, derived.drawerEnabled, expanded, hoveredId, items, setActiveId, setExpanded],
  );

  const canHoverDrawer = derived.drawerEnabled && !derived.usesOverlayDrawer;

  const handleHover = useCallback(
    (id: string) => {
      if (!canHoverDrawer) return;

      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }

      if (entryTimeoutRef.current) {
        clearTimeout(entryTimeoutRef.current);
        entryTimeoutRef.current = null;
      }

      entryTimeoutRef.current = window.setTimeout(() => {
        setHoveredId(id);
      }, hoverDelay);
    },
    [canHoverDrawer, hoverDelay],
  );

  const handleRailLeave = useCallback(() => {
    if (!canHoverDrawer) return;

    if (entryTimeoutRef.current) {
      clearTimeout(entryTimeoutRef.current);
      entryTimeoutRef.current = null;
    }

    exitTimeoutRef.current = window.setTimeout(() => {
      setHoveredId(null);
    }, exitDelay);
  }, [canHoverDrawer, exitDelay]);

  const handleDrawerEnter = useCallback(() => {
    if (!canHoverDrawer) return;

    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }

    if (entryTimeoutRef.current) {
      clearTimeout(entryTimeoutRef.current);
      entryTimeoutRef.current = null;
    }
  }, [canHoverDrawer]);

  const handleDrawerLeave = useCallback(() => {
    if (!canHoverDrawer) return;

    exitTimeoutRef.current = window.setTimeout(() => {
      setHoveredId(null);
    }, exitDelay);
  }, [canHoverDrawer, exitDelay]);

  const hasActiveChild = useCallback(
    (childIds: string[]): boolean => {
      if (!activeId) return false;
      return childIds.includes(activeId);
    },
    [activeId],
  );

  const setGroupExpanded = useCallback((groupId: string, isExpanded: boolean) => {
    if (isExpanded) {
      setExpandedGroups((prev) => new Set(prev).add(groupId));
      setCollapsedGroups((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
    } else {
      setExpandedGroups((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
      setCollapsedGroups((prev) => new Set(prev).add(groupId));
    }
  }, []);

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => toggleGroupSet(prev, groupId));
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }, []);

  const isGroupExpanded = useCallback(
    (groupId: string, childIds?: string[]): boolean => {
      if (collapsedGroups.has(groupId)) return false;
      if (expandedGroups.has(groupId)) return true;
      if (childIds && activeId && childIds.includes(activeId)) return true;
      return false;
    },
    [expandedGroups, collapsedGroups, activeId],
  );

  const activeTopLevelItem = activeId ? findTopLevelContainerById(items, activeId) : null;
  const targetItem = hoveredItem && hoverHasChildren ? hoveredItem : activeTopLevelItem;

  useEffect(() => {
    if (!derived.drawerEnabled) return;
    if (targetItem?.items && targetItem.items.length > 0) {
      setLastContentId(targetItem.id);
    }
  }, [derived.drawerEnabled, targetItem]);

  const effectiveItem =
    derived.drawerEnabled && lastContentId
      ? findTopLevelContainerById(items, lastContentId)
      : null;

  const value: SidebarState = {
    activeId,
    setActiveId,
    expanded,
    setExpanded,
    toggleExpanded,
    mobileOpen,
    setMobileOpen,
    toggleMobile,
    toggle,
    close,
    hoveredId,
    isDrawerVisible: derived.isDrawerVisible,
    isRailVisible: derived.isRailVisible,
    effectiveItem,
    handleHover,
    handleClick,
    handleRailLeave,
    handleDrawerEnter,
    handleDrawerLeave,
    items,
    isMobile,
    isTablet,
    isDesktop,
    usesOverlayDrawer: derived.usesOverlayDrawer,
    railEnabled: derived.railEnabled,
    drawerEnabled: derived.drawerEnabled,
    side,
    mode,
    behavior: resolvedBehavior,
    containerMode,
    triggerVisibility,
    visualPreset,
    tokens,
    railWidth,
    drawerWidth,
    mobileDrawerWidth,
    mobileInsetOffset,
    contentMargin: derived.contentMargin,
    hasActiveChild,
    expandedGroups,
    setGroupExpanded,
    toggleGroup,
    isGroupExpanded,
    registerContainer,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
