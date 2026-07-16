'use client';

export { SidebarProvider, useSidebar } from './context/sidebar-provider';
export { Sidebar, SidebarTrigger } from './components/sidebar-shell';
export { SidebarRail } from './components/sidebar-rail';
export { SidebarDrawer } from './components/sidebar-drawer';
export { SidebarInset } from './components/sidebar-inset';

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
} from './model/sidebar.types';
export type { SidebarProps, SidebarTriggerProps } from './components/sidebar-shell';
export type { SidebarRailProps } from './components/sidebar-rail';
export type { SidebarDrawerProps } from './components/sidebar-drawer';
export type { SidebarInsetProps } from './components/sidebar-inset';
