import type { NavigationItem } from '../../../types/navigation';
import type {
  SidebarBehavior,
  SidebarBehaviorInput,
  SidebarBreakpoints,
  SidebarMode,
  SidebarTriggerVisibility,
} from './sidebar.types';

export const DEFAULT_SIDEBAR_BREAKPOINTS: SidebarBreakpoints = {
  mobile: 600,
  desktop: 840,
};

export interface SidebarViewportFlags {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface SidebarDerivedState {
  railEnabled: boolean;
  drawerEnabled: boolean;
  usesOverlayDrawer: boolean;
  isRailVisible: boolean;
  isDrawerVisible: boolean;
  contentMargin: number;
}

export interface SidebarDerivedStateInput {
  mode: SidebarMode;
  behavior: SidebarBehavior;
  expanded: boolean;
  mobileOpen: boolean;
  hoveredHasChildren: boolean;
  railWidth: number;
  drawerWidth: number;
}

export interface SidebarTriggerVisibilityInput {
  visibility: SidebarTriggerVisibility;
  drawerEnabled: boolean;
  viewport: SidebarViewportFlags;
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
    if (!parsed.every((value): value is string => typeof value === 'string')) {
      return null;
    }
    return parsed;
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
  const isTablet = !isMobile && !isDesktop;
  return { isMobile, isTablet, isDesktop };
}

export function resolveSidebarBehavior(
  behavior: SidebarBehaviorInput | undefined,
  viewport: Pick<SidebarViewportFlags, 'isMobile' | 'isTablet'>,
): SidebarBehavior {
  if (behavior === 'overlay' || behavior === 'inset') {
    return behavior;
  }
  return viewport.isMobile || viewport.isTablet ? 'overlay' : 'inset';
}

export function deriveSidebarState(input: SidebarDerivedStateInput): SidebarDerivedState {
  if (input.mode === 'collapsible-drawer') {
    const drawerEnabled = true;
    const usesOverlayDrawer = input.behavior === 'overlay';
    const isDrawerVisible = usesOverlayDrawer ? input.mobileOpen : true;
    const contentMargin = usesOverlayDrawer
      ? 0
      : input.expanded
        ? input.drawerWidth
        : input.railWidth;

    return {
      railEnabled: false,
      drawerEnabled,
      usesOverlayDrawer,
      isRailVisible: false,
      isDrawerVisible,
      contentMargin,
    };
  }

  const railEnabled = input.mode !== 'drawer-only';
  const drawerEnabled = input.mode !== 'rail-only';
  const usesOverlayDrawer = drawerEnabled && input.behavior === 'overlay';
  const isRailVisible = railEnabled && !usesOverlayDrawer;
  const isDrawerVisible =
    drawerEnabled &&
    (usesOverlayDrawer ? input.mobileOpen : input.expanded || input.hoveredHasChildren);

  const contentMargin =
    !drawerEnabled || usesOverlayDrawer || !input.expanded ? 0 : input.drawerWidth;

  return {
    railEnabled,
    drawerEnabled,
    usesOverlayDrawer,
    isRailVisible,
    isDrawerVisible,
    contentMargin,
  };
}

export function shouldRenderSidebarTrigger(input: SidebarTriggerVisibilityInput): boolean {
  if (!input.drawerEnabled || input.visibility === 'hidden') {
    return false;
  }

  if (input.visibility === 'always') {
    return true;
  }

  if (input.visibility === 'desktop') {
    return input.viewport.isDesktop;
  }

  if (input.visibility === 'mobile') {
    return input.viewport.isMobile || input.viewport.isTablet;
  }

  return input.drawerEnabled;
}

export function findNavigationItemById(items: NavigationItem[], id: string): NavigationItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.items && item.items.length > 0) {
      const found = findNavigationItemById(item.items, id);
      if (found) return found;
    }
  }
  return null;
}

export function findTopLevelContainerById(
  items: NavigationItem[],
  id: string,
): NavigationItem | null {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    if (!item.items || item.items.length === 0) {
      continue;
    }
    if (findNavigationItemById(item.items, id)) {
      return item;
    }
  }
  return null;
}

export function toggleGroupSet(current: Set<string>, groupId: string): Set<string> {
  const next = new Set(current);
  if (next.has(groupId)) {
    next.delete(groupId);
  } else {
    next.add(groupId);
  }
  return next;
}
