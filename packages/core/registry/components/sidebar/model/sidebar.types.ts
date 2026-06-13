import type React from 'react';
import type { NavigationItem } from '@/types/navigation';

export type SidebarSide = 'left' | 'right';
export type SidebarMode = 'rail-drawer' | 'drawer-only' | 'rail-only' | 'collapsible-drawer';
export type SidebarBehavior = 'overlay' | 'inset';
export type SidebarLegacyBehavior = 'adaptive';
export type SidebarBehaviorInput = SidebarBehavior | SidebarLegacyBehavior;
export type SidebarContainerMode = 'viewport' | 'contained';
export type SidebarTriggerVisibility = 'auto' | 'always' | 'desktop' | 'mobile' | 'hidden';
export type SidebarVisualPreset = 'default' | 'compact' | 'elevated' | 'minimal';
export type SidebarActiveDescendantDrawerBehavior = 'open' | 'closed';
export type SidebarViewport = 'mobile' | 'tablet' | 'desktop';

export interface SidebarBreakpoints {
  mobile: number;
  desktop: number;
}

export interface SidebarVisualTokens {
  railBackground: string;
  railForeground: string;
  drawerBackground: string;
  drawerForeground: string;
  insetBackground: string;
  borderColor: string;
  drawerRadius: string;
  drawerShadow: string;
  motionDuration: string;
  motionEasing: string;
}

export interface SidebarState {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  toggleExpanded: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  toggle: () => void;
  close: () => void;
  hoveredId: string | null;
  isDrawerVisible: boolean;
  isRailVisible: boolean;
  effectiveItem: NavigationItem | null;
  handleHover: (id: string) => void;
  handleClick: (id: string) => void;
  handleRailLeave: () => void;
  handleDrawerEnter: () => void;
  handleDrawerLeave: () => void;
  items: NavigationItem[];
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  usesOverlayDrawer: boolean;
  railEnabled: boolean;
  drawerEnabled: boolean;
  side: SidebarSide;
  mode: SidebarMode;
  behavior: SidebarBehavior;
  containerMode: SidebarContainerMode;
  triggerVisibility: SidebarTriggerVisibility;
  visualPreset: SidebarVisualPreset;
  tokens?: Partial<SidebarVisualTokens>;
  railWidth: number;
  drawerWidth: number;
  mobileDrawerWidth: number;
  mobileInsetOffset: number;
  contentMargin: number;
  hasActiveChild: (childIds: string[]) => boolean;
  expandedGroups: Set<string>;
  setGroupExpanded: (groupId: string, expanded: boolean) => void;
  toggleGroup: (groupId: string) => void;
  isGroupExpanded: (groupId: string, childIds?: string[]) => boolean;
  registerContainer: (node: HTMLElement | null) => void;
}

export interface SidebarProviderProps {
  children: React.ReactNode;
  items?: NavigationItem[];
  activeId?: string | null;
  defaultActiveId?: string | null;
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
  behavior?: SidebarBehaviorInput;
  containerMode?: SidebarContainerMode;
  breakpoints?: Partial<SidebarBreakpoints>;
  mobileInsetOffset?: number;
  triggerVisibility?: SidebarTriggerVisibility;
  activeDescendantDrawerBehavior?: SidebarActiveDescendantDrawerBehavior;
  visualPreset?: SidebarVisualPreset;
  tokens?: Partial<SidebarVisualTokens>;
  initialViewport?: SidebarViewport;
  forceViewport?: SidebarViewport;
  onActiveIdChange?: (id: string | null) => void;
  onActiveChange?: (id: string | null) => void;
  onExpandedChange?: (expanded: boolean) => void;
  onMobileOpenChange?: (open: boolean) => void;
}
