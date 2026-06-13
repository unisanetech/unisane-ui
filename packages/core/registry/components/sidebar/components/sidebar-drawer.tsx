'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar/context/sidebar-provider';
import { getSidebarVisualTheme } from '@/components/ui/sidebar/components/sidebar-visuals';

function getFocusableElements(root: HTMLElement | null): HTMLElement[] {
  if (!root) {
    return [];
  }

  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden'));
}

export interface SidebarDrawerProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const SidebarDrawer = forwardRef<HTMLElement, SidebarDrawerProps>(
  ({ children, className, style, ...props }, ref) => {
    const sidebar = useSidebar();
    const {
      isDrawerVisible,
      expanded,
      mobileOpen,
      usesOverlayDrawer,
      handleDrawerEnter,
      handleDrawerLeave,
      railWidth,
      drawerWidth,
      mobileDrawerWidth,
      railEnabled,
      drawerEnabled,
      mode,
      side,
      close,
    } = sidebar;
    const visuals = getSidebarVisualTheme(sidebar);

    const drawerRef = useRef<HTMLElement | null>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);

    const isOpen = usesOverlayDrawer ? mobileOpen : isDrawerVisible;
    const isCollapsibleDrawer = mode === 'collapsible-drawer' && !usesOverlayDrawer;
    const isOverlay = usesOverlayDrawer || (!expanded && !isCollapsibleDrawer);
    const baseOffset = railEnabled && !usesOverlayDrawer ? railWidth : 0;
    useEffect(() => {
      if (!drawerEnabled || !isOpen || !usesOverlayDrawer) {
        return;
      }

      const drawerNode = drawerRef.current;
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      const timer = window.setTimeout(() => {
        const focusable = getFocusableElements(drawerNode);
        (focusable[0] ?? drawerNode)?.focus();
      }, 0);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          close();
          return;
        }

        if (event.key !== 'Tab') {
          return;
        }

        const focusableElements = getFocusableElements(drawerNode);
        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement | null;

        if (!first || !last) {
          event.preventDefault();
          return;
        }

        if (event.shiftKey) {
          if (activeElement === first || activeElement === drawerNode) {
            event.preventDefault();
            last.focus();
          }
          return;
        }

        if (activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        window.clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
        previousActiveElementRef.current?.focus();
      };
    }, [close, drawerEnabled, isOpen, usesOverlayDrawer]);

    if (!drawerEnabled) {
      return null;
    }

    return (
      <aside
        ref={(node) => {
          drawerRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          usesOverlayDrawer
            ? 'fixed top-0 bottom-0 flex flex-col'
            : 'absolute top-0 bottom-0 flex flex-col',
          usesOverlayDrawer ? 'h-dvh' : 'h-full',
          'overflow-hidden',
          visuals.drawerForegroundClass,
          visuals.drawerBackgroundClass,
          'duration-emphasized ease-emphasized transition-[transform,width] motion-reduce:transition-none',
          usesOverlayDrawer && 'z-[1610] max-w-[85vw]',
          !usesOverlayDrawer && 'z-30',
          isOverlay && isOpen && visuals.drawerRadiusClass,
          side === 'left'
            ? isOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : isOpen
              ? 'translate-x-0'
              : 'translate-x-full',
          className,
        )}
        style={{
          width: usesOverlayDrawer
            ? `var(--sidebar-mobile-drawer-width, ${mobileDrawerWidth}px)`
            : isCollapsibleDrawer && !expanded
              ? `var(--sidebar-rail-width, ${railWidth}px)`
              : `var(--sidebar-drawer-width, ${drawerWidth}px)`,
          [side]: usesOverlayDrawer ? 0 : baseOffset,
          ...(isOverlay && isOpen
            ? {
                boxShadow: visuals.drawerStyle.boxShadow,
                borderRadius: visuals.drawerStyle.borderRadius,
              }
            : null),
          backgroundColor: visuals.drawerStyle.backgroundColor,
          color: visuals.drawerStyle.color,
          borderColor: visuals.drawerStyle.borderColor,
          ...visuals.motionStyle,
          ...style,
        }}
        onMouseEnter={!usesOverlayDrawer ? handleDrawerEnter : undefined}
        onMouseLeave={!usesOverlayDrawer ? handleDrawerLeave : undefined}
        aria-hidden={!isOpen}
        tabIndex={usesOverlayDrawer && isOpen ? -1 : undefined}
        {...props}
      >
        {children}
      </aside>
    );
  },
);
SidebarDrawer.displayName = 'SidebarDrawer';

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('shrink-0 px-4 pt-4 pb-2', className)} {...props}>
        {children}
      </div>
    );
  },
);
SidebarHeader.displayName = 'SidebarHeader';

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mt-auto shrink-0 px-4 pt-2 pb-4', className)} {...props}>
        {children}
      </div>
    );
  },
);
SidebarFooter.displayName = 'SidebarFooter';

export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex-1 overflow-y-auto px-2 py-2', className)} {...props}>
        {children}
      </div>
    );
  },
);
SidebarContent.displayName = 'SidebarContent';
