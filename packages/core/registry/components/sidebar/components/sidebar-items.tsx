'use client';

import React, { cloneElement, forwardRef, isValidElement, useEffect, useId, useRef } from 'react';
import { cn, Slot } from '@/lib/utils';
import {
  NavigationDrawerItemContent,
  NavigationIcon,
  getNavigationDrawerItemClasses,
} from '@/lib/navigation-visuals';
import { useSidebar } from '@/components/ui/sidebar/context/sidebar-provider';
import { findNavigationItemById } from '@/components/ui/sidebar/model/sidebar.state';
import { Ripple } from '@/components/ui/ripple';
import { collectDescendantIds } from '@/components/ui/sidebar/components/sidebar-navigation-utils';

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props}>
        {children}
      </div>
    );
  },
);
SidebarGroup.displayName = 'SidebarGroup';

export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarGroupLabel = forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'text-label-small text-on-surface-variant px-4 py-2 font-semibold tracking-wider uppercase',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

export interface SidebarMenuProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const SidebarMenu = forwardRef<HTMLElement, SidebarMenuProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <nav ref={ref} className={cn('flex flex-col gap-0.5', className)} {...props}>
        {children}
      </nav>
    );
  },
);
SidebarMenu.displayName = 'SidebarMenu';

export interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

export const SidebarMenuItem = forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <li ref={ref} className={cn('list-none', className)} {...props}>
        {children}
      </li>
    );
  },
);
SidebarMenuItem.displayName = 'SidebarMenuItem';

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline';
}

export const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  (
    {
      children,
      className,
      asChild,
      isActive,
      tooltip,
      size = 'default',
      variant = 'default',
      ...props
    },
    ref,
  ) => {
    const sidebar = useSidebar();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(e);
      if (sidebar.usesOverlayDrawer) {
        sidebar.setMobileOpen(false);
      }
    };

    const buttonClasses = cn(
      'relative flex w-full min-h-10 items-center justify-start gap-3 overflow-hidden rounded-button px-4 py-2',
      'text-body-medium cursor-pointer text-left transition-colors duration-short',
      'select-none outline-none focus-visible:ring-2 focus-visible:ring-primary',
      size === 'sm' && 'min-h-8 gap-2 py-1.5 text-label-medium',
      size === 'lg' && 'min-h-12 py-3 text-body-large',
      isActive
        ? 'bg-state-selected text-on-surface font-medium'
        : 'text-on-surface-variant hover:bg-state-hover hover:text-on-surface',
      variant === 'outline' && 'border border-outline-variant',
      props.disabled && 'opacity-38 cursor-not-allowed pointer-events-none',
      className,
    );

    if (asChild && isValidElement(children)) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          className={buttonClasses}
          data-active={isActive || undefined}
          title={tooltip}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        data-active={isActive || undefined}
        title={tooltip}
        onClick={handleClick}
        {...props}
      >
        <Ripple disabled={!!props.disabled} />
        {children}
      </button>
    );
  },
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

export interface SidebarNavItemProps {
  id?: string;
  href?: string;
  icon?: React.ReactNode | string;
  activeIcon?: React.ReactNode | string;
  badge?: React.ReactNode | string | number;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export function SidebarNavItem({
  id,
  href,
  icon,
  activeIcon,
  badge,
  label,
  active,
  disabled,
  onClick,
  children,
  className,
  asChild,
}: SidebarNavItemProps) {
  const sidebar = useSidebar();
  const isControlled = active !== undefined;
  const isActive = isControlled ? active : id ? sidebar.activeId === id : false;

  const handleItemClick = () => {
    if (disabled) return;
    if (id) {
      sidebar.setActiveId(id);
    }
    onClick?.();
    if (sidebar.usesOverlayDrawer) {
      sidebar.setMobileOpen(false);
    }
  };

  const innerContent = (
    <NavigationDrawerItemContent
      icon={icon}
      activeIcon={activeIcon}
      badge={badge}
      active={isActive}
      disabled={disabled}
      ripple={<Ripple disabled={!!disabled} />}
    >
      {label}
    </NavigationDrawerItemContent>
  );

  const itemClasses = getNavigationDrawerItemClasses({
    active: isActive,
    disabled,
    className,
  });

  const commonProps = {
    onClick: handleItemClick,
    className: itemClasses,
    'aria-current': isActive ? ('page' as const) : undefined,
  };

  if (asChild && children) {
    return (
      <Slot {...commonProps}>
        {isValidElement(children)
          ? cloneElement(children as React.ReactElement, {}, innerContent)
          : children}
      </Slot>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} {...commonProps}>
        {innerContent}
      </a>
    );
  }

  return (
    <button {...commonProps} disabled={disabled}>
      {innerContent}
    </button>
  );
}

export interface SidebarCollapsibleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  label: string;
  icon?: React.ReactNode | string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  childIds?: string[];
  onTriggerClick?: () => void;
}

export function SidebarCollapsibleGroup({
  id,
  label,
  icon,
  defaultOpen = false,
  children,
  className,
  childIds = [],
  onTriggerClick,
  ...props
}: SidebarCollapsibleGroupProps) {
  const { isGroupExpanded, toggleGroup, setGroupExpanded, activeId, items } = useSidebar();
  const contentId = useId();
  const defaultAppliedRef = useRef(false);
  const resolvedChildIds =
    childIds.length > 0 ? childIds : collectDescendantIds(findNavigationItemById(items, id)?.items);
  const isSelfActive = activeId === id;
  const hasActiveChild =
    resolvedChildIds.length > 0 && activeId !== null && resolvedChildIds.includes(activeId);

  useEffect(() => {
    if (!defaultAppliedRef.current && defaultOpen) {
      setGroupExpanded(id, true);
      defaultAppliedRef.current = true;
    }
  }, [defaultOpen, id, setGroupExpanded]);

  useEffect(() => {
    if (hasActiveChild) {
      setGroupExpanded(id, true);
    }
  }, [hasActiveChild, id, setGroupExpanded]);

  const isOpen = isGroupExpanded(id, resolvedChildIds);

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <button
        onClick={() => {
          toggleGroup(id);
          onTriggerClick?.();
        }}
        className={cn(
          'relative flex min-h-10 w-full items-center justify-start gap-3 overflow-hidden rounded-button px-4 py-2',
          'text-body-medium duration-short cursor-pointer text-left transition-colors outline-none select-none',
          'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-inset',
          isSelfActive
            ? 'bg-state-selected text-on-surface font-medium'
            : hasActiveChild
              ? 'text-primary hover:bg-state-hover font-semibold'
              : 'text-on-surface-variant hover:bg-state-hover hover:text-on-surface font-medium',
        )}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <Ripple />
        {icon && (
          <span className="shrink-0">
            <NavigationIcon icon={icon} active={isSelfActive || hasActiveChild} size="sm" />
          </span>
        )}
        <span className="flex-1 truncate text-left">{label}</span>
        <svg
          className={cn(
            'size-icon-sm duration-medium ease-emphasized shrink-0 transition-transform',
            isOpen && 'rotate-180',
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        id={contentId}
        role="region"
        className={cn(
          'duration-medium ease-emphasized grid transition-all motion-reduce:transition-none',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
        aria-hidden={!isOpen}
      >
        <div className="mt-1 flex flex-col gap-0.5 overflow-hidden pl-4">{children}</div>
      </div>
    </div>
  );
}
