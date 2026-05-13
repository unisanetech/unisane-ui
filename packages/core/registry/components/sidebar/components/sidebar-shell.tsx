'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/primitives/icon';
import { useSidebar } from '@/components/ui/sidebar/context/sidebar-provider';
import type { SidebarTriggerVisibility } from '@/components/ui/sidebar/model/sidebar.types';
import { shouldRenderSidebarTrigger } from '@/components/ui/sidebar/model/sidebar.state';

function buildSidebarCssVars(sidebar: ReturnType<typeof useSidebar>) {
  const vars: Record<string, string> = {
    '--sidebar-rail-width': `${sidebar.railWidth}px`,
    '--sidebar-drawer-width': `${sidebar.drawerWidth}px`,
    '--sidebar-mobile-drawer-width': `${sidebar.mobileDrawerWidth}px`,
  };

  return vars;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, className, style, ...props }, ref) => {
    const sidebar = useSidebar();
    const shouldElevateStackingContext = sidebar.usesOverlayDrawer && sidebar.mobileOpen;

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
          shouldElevateStackingContext && 'z-[var(--z-drawer,1500)]',
          sidebar.side === 'right' && 'flex-row-reverse',
          className,
        )}
        data-sidebar-side={sidebar.side}
        data-sidebar-mode={sidebar.mode}
        data-sidebar-behavior={sidebar.behavior}
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
          'inline-flex h-10 w-10 items-center justify-center rounded-icon-button',
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
        {children || <Icon symbol="menu" />}
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
        usesOverlayDrawer ? 'fixed inset-0' : 'absolute inset-0',
        usesOverlayDrawer ? 'z-[1605]' : 'z-20',
        className,
      )}
      onClick={close}
      aria-hidden="true"
      {...props}
    />
  );
}
