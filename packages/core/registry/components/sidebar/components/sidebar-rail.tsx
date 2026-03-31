'use client';

import React, { cloneElement, forwardRef, isValidElement } from 'react';
import { cn, Slot } from '@/lib/utils';
import {
  NavigationRailItemContent,
  getNavigationRailItemClasses,
} from '@/lib/navigation-visuals';
import { useSidebar } from '@/components/ui/sidebar/context/sidebar-provider';
import { findNavigationItemById } from '@/components/ui/sidebar/model/sidebar.state';
import { getSidebarVisualTheme } from '@/components/ui/sidebar/components/sidebar-visuals';
import { Ripple } from '@/components/ui/ripple';
import type { NavigationItem } from '@/types/navigation';
import { collectDescendantIds } from '@/components/ui/sidebar/components/sidebar-navigation-utils';

export interface SidebarRailProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const SidebarRail = forwardRef<HTMLElement, SidebarRailProps>(
  ({ children, className, style, ...props }, ref) => {
    const sidebar = useSidebar();
    const { handleRailLeave, isDrawerVisible, isRailVisible, side, railWidth } = sidebar;
    const visuals = getSidebarVisualTheme(sidebar);

    if (!isRailVisible) {
      return null;
    }

    return (
      <nav
        ref={ref}
        className={cn(
          'relative z-50 flex h-full shrink-0 flex-col items-center gap-1 py-3',
          visuals.railForegroundClass,
          visuals.railBackgroundClass,
          'duration-medium ease-standard transition-all motion-reduce:transition-none',
          isDrawerVisible &&
            (side === 'left'
              ? 'border-r'
              : 'border-l'),
          className,
        )}
        style={{
          width: `var(--sidebar-rail-width, ${railWidth}px)`,
          borderColor: isDrawerVisible ? visuals.borderColor : undefined,
          ...visuals.railStyle,
          ...style,
        }}
        onMouseLeave={handleRailLeave}
        aria-label="Sidebar Navigation"
        {...props}
      >
        {children}
      </nav>
    );
  },
);
SidebarRail.displayName = 'SidebarRail';

export interface SidebarRailItemProps {
  id: string;
  label: string;
  icon: React.ReactNode | string;
  activeIcon?: React.ReactNode | string;
  badge?: string | number;
  tooltip?: string;
  labelVisibility?: 'always' | 'selected' | 'hidden';
  disabled?: boolean;
  href?: string;
  asChild?: boolean;
  children?: React.ReactNode;
  childIds?: string[];
}

function resolveChildIds(items: NavigationItem[], id: string, childIds: string[]): string[] {
  if (childIds.length > 0) {
    return childIds;
  }
  return collectDescendantIds(findNavigationItemById(items, id)?.items);
}

export function SidebarRailItem({
  id,
  label,
  icon,
  activeIcon,
  badge,
  tooltip,
  labelVisibility = 'always',
  disabled,
  href,
  asChild,
  children,
  childIds = [],
}: SidebarRailItemProps) {
  const { activeId, handleClick, handleHover, hasActiveChild, items } = useSidebar();
  const resolvedChildIds = resolveChildIds(items, id, childIds);
  const isDirectlyActive = activeId === id;
  const hasChildActive = resolvedChildIds.length > 0 && hasActiveChild(resolvedChildIds);
  const isActive = isDirectlyActive || hasChildActive;
  const showLabel = labelVisibility === 'always' || (labelVisibility === 'selected' && isActive);
  const tooltipText = tooltip ?? (labelVisibility === 'hidden' ? label : undefined);

  const content = (
    <NavigationRailItemContent
      icon={icon}
      activeIcon={activeIcon}
      badge={badge}
      label={label}
      showLabel={showLabel}
      active={isActive}
      disabled={disabled}
      ripple={<Ripple center disabled={disabled} />}
    />
  );

  const commonClasses = getNavigationRailItemClasses(disabled);

  const commonProps = {
    onClick: (e: React.MouseEvent) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      handleClick(id);
    },
    onMouseEnter: () => !disabled && handleHover(id),
    className: commonClasses,
    'aria-current': isActive ? ('page' as const) : undefined,
    'aria-disabled': disabled || undefined,
    'aria-label': showLabel ? undefined : label,
    title: tooltipText,
  };

  if (asChild && children) {
    return (
      <Slot {...commonProps}>
        {isValidElement(children)
          ? cloneElement(children as React.ReactElement, {}, content)
          : children}
      </Slot>
    );
  }

  if (href) {
    return (
      <a href={disabled ? undefined : href} {...commonProps} tabIndex={disabled ? -1 : undefined}>
        {content}
      </a>
    );
  }

  return (
    <button {...commonProps} disabled={disabled}>
      {content}
    </button>
  );
}
