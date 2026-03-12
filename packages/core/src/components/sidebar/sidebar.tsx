'use client';

import React, { forwardRef, cloneElement, isValidElement, useEffect, useRef, useId } from 'react';
import { cn, Slot } from '@ui/lib/utils';
import {
  NavigationDrawerItemContent,
  NavigationIcon,
  NavigationRailItemContent,
  getNavigationDrawerItemClasses,
  getNavigationRailItemClasses,
} from '@ui/lib/navigation-visuals';
import { useSidebar } from './sidebar-context';
import { Ripple } from '../ripple';
import type { NavigationItem } from '../../types/navigation';

function collectDescendantIds(items?: NavigationItem[]): string[] {
  if (!items || items.length === 0) return [];
  return items.flatMap((item) => {
    if (!item.items || item.items.length === 0) return [item.id];
    return collectDescendantIds(item.items);
  });
}

function findNavigationItemById(items: NavigationItem[], id: string): NavigationItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.items && item.items.length > 0) {
      const found = findNavigationItemById(item.items, id);
      if (found) return found;
    }
  }
  return null;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex h-full', className)} {...props}>
        {children}
      </div>
    );
  },
);
Sidebar.displayName = 'Sidebar';

export interface SidebarRailProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const SidebarRail = forwardRef<HTMLElement, SidebarRailProps>(
  ({ children, className, ...props }, ref) => {
    const { handleRailLeave, railWidth, isDrawerVisible } = useSidebar();
    return (
      <nav
        ref={ref}
        className={cn(
          'relative h-full flex-col items-center',
          'bg-surface-container text-on-surface gap-1 py-3',
          'z-50 shrink-0',
          'duration-medium ease-standard transition-all',
          'expanded:flex hidden',
          isDrawerVisible && 'border-outline-variant border-r',
          className,
        )}
        style={{ width: railWidth }}
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
  disabled?: boolean;
  href?: string;
  asChild?: boolean;
  children?: React.ReactNode;
  childIds?: string[];
}

export function SidebarRailItem({
  id,
  label,
  icon,
  activeIcon,
  badge,
  disabled,
  href,
  asChild,
  children,
  childIds = [],
}: SidebarRailItemProps) {
  const { activeId, handleClick, handleHover, hasActiveChild, items } = useSidebar();
  const resolvedChildIds =
    childIds.length > 0 ? childIds : collectDescendantIds(findNavigationItemById(items, id)?.items);
  const isDirectlyActive = activeId === id;
  const hasChildActive = resolvedChildIds.length > 0 && hasActiveChild(resolvedChildIds);
  const isActive = isDirectlyActive || hasChildActive;
  const content = (
    <NavigationRailItemContent
      icon={icon}
      activeIcon={activeIcon}
      badge={badge}
      label={label}
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

export interface SidebarDrawerProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const SidebarDrawer = forwardRef<HTMLElement, SidebarDrawerProps>(
  ({ children, className, ...props }, ref) => {
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
    } = useSidebar();

    const isOpen = usesOverlayDrawer ? mobileOpen : isDrawerVisible;
    const isOverlay = usesOverlayDrawer || !expanded;
    const effectiveWidth = usesOverlayDrawer ? mobileDrawerWidth : drawerWidth;

    return (
      <aside
        ref={ref}
        className={cn(
          'fixed top-0 flex flex-col',
          usesOverlayDrawer ? 'h-dvh' : 'h-screen',
          'bg-surface-container text-on-surface',
          'duration-emphasized ease-emphasized transition-transform',
          'overflow-hidden',
          usesOverlayDrawer && 'left-0 z-60 max-w-[85vw]',
          !usesOverlayDrawer && 'z-30',
          isOverlay && isOpen && 'shadow-3',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className,
        )}
        style={{
          width: effectiveWidth,
          left: usesOverlayDrawer ? 0 : railWidth,
        }}
        onMouseEnter={!usesOverlayDrawer ? handleDrawerEnter : undefined}
        onMouseLeave={!usesOverlayDrawer ? handleDrawerLeave : undefined}
        aria-hidden={!isOpen}
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
          'text-label-small text-on-surface-variant px-4 py-2 font-semibold',
          'tracking-wider uppercase',
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
      if (sidebar.isMobile) {
        sidebar.setMobileOpen(false);
      }
    };

    const buttonClasses = cn(
      'relative flex w-full min-h-10 items-center justify-start gap-3 overflow-hidden rounded-sm px-4 py-2',
      'text-body-medium text-left transition-colors duration-short cursor-pointer',
      'relative overflow-hidden select-none outline-none',
      'focus-visible:ring-2 focus-visible:ring-primary',
      size === 'sm' && 'min-h-8 gap-2 py-1.5 text-label-medium',
      size === 'lg' && 'min-h-12 py-3 text-body-large',
      isActive
        ? 'bg-secondary-container text-on-secondary-container font-medium'
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
    if (sidebar.isMobile) {
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

export interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ children, className, onClick, ...props }, ref) => {
    const { usesOverlayDrawer, toggleMobile, toggleExpanded } = useSidebar();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (usesOverlayDrawer) {
        toggleMobile();
      } else {
        toggleExpanded();
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          'inline-flex items-center justify-center',
          'h-10 w-10 rounded-full',
          'text-on-surface-variant hover:bg-state-hover',
          'duration-short transition-colors',
          'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none',
          className,
        )}
        aria-label="Toggle sidebar"
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
  const { isDrawerVisible, expanded, mobileOpen, usesOverlayDrawer, setMobileOpen } = useSidebar();

  const isVisible = mobileOpen || (isDrawerVisible && !expanded);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'bg-scrim-soft duration-medium ease-standard fixed inset-0 transition-opacity',
        usesOverlayDrawer ? 'z-55' : 'z-20',
        'opacity-100',
        className,
      )}
      onClick={() => {
        if (mobileOpen) {
          setMobileOpen(false);
        }
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

export interface SidebarInsetProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const SidebarInset = forwardRef<HTMLElement, SidebarInsetProps>(
  ({ children, className, style, ...props }, ref) => {
    const { railWidth, drawerWidth, expanded, usesOverlayDrawer } = useSidebar();
    const desktopMargin = expanded ? drawerWidth : 0;

    return (
      <main
        ref={ref}
        className={cn(
          'flex flex-1 flex-col',
          'bg-surface',
          'duration-emphasized ease-emphasized transition-[margin]',
          'expanded:mt-0 mt-16',
          'expanded:h-screen h-[calc(100vh-4rem)] overflow-x-hidden overflow-y-auto',
          className,
        )}
        style={{
          marginLeft: usesOverlayDrawer ? 0 : desktopMargin,
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

export interface SidebarCollapsibleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  label: string;
  icon?: React.ReactNode | string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  childIds?: string[];
}

export function SidebarCollapsibleGroup({
  id,
  label,
  icon,
  defaultOpen = false,
  children,
  className,
  childIds = [],
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

  const handleToggle = () => {
    toggleGroup(id);
  };

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <button
        onClick={handleToggle}
        className={cn(
          'relative flex min-h-10 w-full items-center justify-start gap-3 overflow-hidden rounded-sm px-4 py-2',
          'text-body-medium duration-short cursor-pointer text-left transition-colors outline-none select-none',
          'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-inset',
          isSelfActive
            ? 'bg-secondary-container text-on-secondary-container font-medium'
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
            <NavigationIcon icon={icon} active={isSelfActive || hasActiveChild} size={20} />
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
          'duration-medium ease-emphasized grid transition-all',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
        aria-hidden={!isOpen}
      >
        <div className="mt-1 flex flex-col gap-0.5 overflow-hidden pl-4">{children}</div>
      </div>
    </div>
  );
}
