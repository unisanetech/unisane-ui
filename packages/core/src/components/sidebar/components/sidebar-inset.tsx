'use client';

import React, { forwardRef } from 'react';
import { cn } from '@ui/lib/utils';
import { useSidebar } from '../context/sidebar-provider';
import { getSidebarVisualTheme } from './sidebar-visuals';

export interface SidebarInsetProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const SidebarInset = forwardRef<HTMLElement, SidebarInsetProps>(
  ({ children, className, style, ...props }, ref) => {
    const sidebar = useSidebar();
    const {
      side,
      drawerWidth,
      expanded,
      usesOverlayDrawer,
      drawerEnabled,
      containerMode,
      mobileInsetOffset,
    } = sidebar;
    const visuals = getSidebarVisualTheme(sidebar);

    const desktopMargin = !drawerEnabled || usesOverlayDrawer || !expanded ? 0 : drawerWidth;
    const topOffset = containerMode === 'contained' ? 0 : usesOverlayDrawer ? mobileInsetOffset : 0;

    return (
      <main
        ref={ref}
        className={cn(
          'flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto',
          visuals.insetBackgroundClass,
          'duration-emphasized ease-emphasized transition-[margin,height,margin-top] motion-reduce:transition-none',
          className,
        )}
        style={{
          marginTop: topOffset,
          height: containerMode === 'contained' ? '100%' : topOffset > 0 ? `calc(100vh - ${topOffset}px)` : '100vh',
          marginLeft: side === 'left' ? desktopMargin : 0,
          marginRight: side === 'right' ? desktopMargin : 0,
          ['--sidebar-margin' as string]: `${desktopMargin}px`,
          ...visuals.insetStyle,
          ...visuals.motionStyle,
          ...style,
        }}
        {...props}
      >
        {children}
      </main>
    );
  },
);
SidebarInset.displayName = 'SidebarInset';
