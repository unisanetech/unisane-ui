'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '../context/sidebar-provider';
import type { SidebarTriggerVisibility } from '../model/sidebar.types';
import { shouldRenderSidebarTrigger } from '../model/sidebar.state';

function buildSidebarCssVars(sidebar: ReturnType<typeof useSidebar>) {
  const vars: Record<string, string> = {
    '--sidebar-rail-width': `${sidebar.railWidth}px`,
    '--sidebar-drawer-width': `${sidebar.drawerWidth}px`,
    '--sidebar-mobile-drawer-width': `${sidebar.mobileDrawerWidth}px`,
  };

  if (sidebar.tokens?.railBackground) vars['--sidebar-rail-bg'] = sidebar.tokens.railBackground;
  if (sidebar.tokens?.railForeground) vars['--sidebar-rail-fg'] = sidebar.tokens.railForeground;
  if (sidebar.tokens?.drawerBackground) vars['--sidebar-drawer-bg'] = sidebar.tokens.drawerBackground;
  if (sidebar.tokens?.drawerForeground) vars['--sidebar-drawer-fg'] = sidebar.tokens.drawerForeground;
  if (sidebar.tokens?.insetBackground) vars['--sidebar-inset-bg'] = sidebar.tokens.insetBackground;
  if (sidebar.tokens?.borderColor) vars['--sidebar-border-color'] = sidebar.tokens.borderColor;
  if (sidebar.tokens?.drawerRadius) vars['--sidebar-drawer-radius'] = sidebar.tokens.drawerRadius;
  if (sidebar.tokens?.drawerShadow) vars['--sidebar-drawer-shadow'] = sidebar.tokens.drawerShadow;
  if (sidebar.tokens?.motionDuration) vars['--sidebar-motion-duration'] = sidebar.tokens.motionDuration;
  if (sidebar.tokens?.motionEasing) vars['--sidebar-motion-easing'] = sidebar.tokens.motionEasing;

  return vars;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, className, style, ...props }, ref) => {
    const sidebar = useSidebar();

    return (
      <div
        ref={(node) => {
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          sidebar.registerContainer(sidebar.containerMode === 'contained' ? node : null);
        }}
        className={cn(
          'unisane-sidebar relative isolate flex h-full',
          sidebar.side === 'right' && 'flex-row-reverse',
          className,
        )}
        data-sidebar-side={sidebar.side}
        data-sidebar-mode={sidebar.mode}
        data-sidebar-behavior={sidebar.behavior}
        data-sidebar-preset={sidebar.visualPreset}
        style={{
          ...buildSidebarCssVars(sidebar),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Sidebar.displayName = 'Sidebar';

export interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  visibility?: SidebarTriggerVisibility;
}

export const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ children, className, onClick, visibility, ...props }, ref) => {
    const {
      triggerVisibility,
      isDesktop,
      isMobile,
      isTablet,
      usesOverlayDrawer,
      expanded,
      mobileOpen,
      drawerEnabled,
      toggle,
    } = useSidebar();

    const resolvedVisibility = visibility ?? triggerVisibility;

    const shouldRender = shouldRenderSidebarTrigger({
      visibility: resolvedVisibility,
      drawerEnabled,
      viewport: { isDesktop, isMobile, isTablet },
    });

    if (!shouldRender) {
      return null;
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      toggle();
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-full',
          'text-on-surface-variant hover:bg-state-hover',
          'duration-short transition-colors',
          'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none',
          usesOverlayDrawer && 'bg-surface-container-low',
          className,
        )}
        aria-label="Toggle sidebar"
        aria-expanded={usesOverlayDrawer ? mobileOpen : expanded}
        {...props}
      >
        {children || <span className="material-symbols-outlined">menu</span>}
      </button>
    );
  },
);
SidebarTrigger.displayName = 'SidebarTrigger';

export type SidebarBackdropProps = React.HTMLAttributes<HTMLDivElement>;

export function SidebarBackdrop({ className, ...props }: SidebarBackdropProps) {
  const {
    isDrawerVisible,
    expanded,
    mobileOpen,
    usesOverlayDrawer,
    containerMode,
    close,
    drawerEnabled,
  } = useSidebar();

  if (!drawerEnabled) {
    return null;
  }

  const isVisible = usesOverlayDrawer ? mobileOpen : isDrawerVisible && !expanded;

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'bg-scrim-soft duration-medium ease-standard opacity-100 transition-opacity motion-reduce:transition-none',
        containerMode === 'contained' ? 'absolute inset-0' : 'fixed inset-0',
        usesOverlayDrawer ? 'z-55' : 'z-20',
        className,
      )}
      onClick={close}
      aria-hidden="true"
      {...props}
    />
  );
}
