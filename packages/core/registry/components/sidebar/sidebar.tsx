'use client';

import React, { forwardRef, cloneElement, isValidElement, useEffect, useRef, useId } from 'react';
import { cn, Slot } from '@/lib/utils';
import { useSidebar } from './sidebar-context';
import { Ripple } from '../ripple';

/**
 * Renders a Material Symbol icon with proper styling.
 * Handles both string icon names and React nodes.
 */
interface MaterialIconProps {
  icon: React.ReactNode | string;
  /** Whether the icon should appear in its active/filled state */
  active?: boolean;
  /** Font size in pixels (default: 20) */
  size?: number;
  className?: string;
}

export function MaterialIcon({ icon, active = false, size = 20, className }: MaterialIconProps) {
  if (typeof icon === 'string') {
    return (
      <span
        className={cn('material-symbols-outlined duration-short transition-all', className)}
        style={{
          fontSize: size,
          fontVariationSettings: active ? "'FILL' 1, 'wght' 500" : "'wght' 400",
        }}
      >
        {icon}
      </span>
    );
  }
  return <>{icon}</>;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** shadcn compatibility: variant style (currently ignored, for API compat) */
  variant?: 'sidebar' | 'floating' | 'inset';
  /** shadcn compatibility: collapsible behavior (currently ignored, for API compat) */
  collapsible?: 'offcanvas' | 'icon' | 'none';
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, className, variant, collapsible, ...props }, ref) => {
    // variant and collapsible props are accepted for shadcn compatibility
    // but the actual behavior is controlled via SidebarProvider context
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

    // Use CSS media queries for responsive visibility to avoid hydration mismatch.
    // Rail is hidden on mobile (<600px) and tablet (600-840px) via CSS, shown on desktop (840px+).
    return (
      <nav
        ref={ref}
        className={cn(
          'relative h-full flex-col items-center',
          'bg-surface-container text-on-surface gap-1 py-3',
          'z-50 shrink-0',
          'duration-medium ease-standard transition-all',
          // CSS-based responsive: hidden below expanded breakpoint (840px)
          'expanded:flex hidden',
          // Only show border when drawer is visible
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
  const { activeId, handleClick, handleHover, hasActiveChild } = useSidebar();
  const isDirectlyActive = activeId === id;
  const hasChildActive = childIds.length > 0 && hasActiveChild(childIds);
  const isActive = isDirectlyActive || hasChildActive;

  const content = (
    <>
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            'flex h-7 w-13 items-center justify-center rounded-xl',
            'duration-medium ease-emphasized relative overflow-hidden transition-all',
            isActive
              ? 'bg-secondary-container text-on-secondary-container'
              : 'text-on-surface-variant hover:bg-on-surface/8 bg-transparent',
          )}
        >
          <Ripple center disabled={disabled} />
          <span className="relative z-10 flex items-center justify-center">
            <MaterialIcon
              icon={isActive && activeIcon ? activeIcon : icon}
              active={isActive}
              size={22}
            />
          </span>
        </div>

        {badge !== undefined && (
          <span
            className={cn(
              'absolute -top-0.5 -right-0.5 h-3 min-w-3 px-0.5',
              'bg-error text-on-error text-[10px] leading-none',
              'flex items-center justify-center rounded-full font-medium',
              'ring-surface pointer-events-none z-20 ring-1',
              typeof badge === 'number' && badge < 10 && 'h-2 min-w-2 p-0.5',
            )}
            role="status"
            aria-label={typeof badge === 'number' ? `${badge} notifications` : String(badge)}
          >
            {badge}
          </span>
        )}
      </div>

      <span
        className={cn(
          'text-label-small duration-short transition-colors',
          'max-w-full px-0.5 text-center',
          isActive
            ? 'text-on-secondary-container font-bold'
            : 'text-on-surface-variant group-hover:text-on-surface font-medium',
        )}
      >
        {label}
      </span>
    </>
  );

  const commonClasses = cn(
    'group flex flex-col items-center gap-0.5 w-full py-1 min-h-12',
    'relative select-none cursor-pointer outline-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    'focus-visible:ring-offset-2 rounded-sm',
    disabled && 'opacity-38 cursor-not-allowed pointer-events-none',
  );

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
          // Use dvh for mobile (accounts for browser chrome), screen for desktop
          usesOverlayDrawer ? 'h-dvh' : 'h-screen',
          'bg-surface-container text-on-surface',
          'duration-emphasized ease-emphasized transition-transform',
          'overflow-hidden', // Let SidebarContent handle scrolling
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

// ─── SHADCN-COMPATIBLE SIDEBAR MENU ITEM (WRAPPER) ─────────────────────────

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

// ─── SHADCN-COMPATIBLE SIDEBAR MENU BUTTON ─────────────────────────────────

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
      'flex w-full items-center gap-2 rounded-md px-2 py-1.5',
      'text-sm transition-colors duration-short cursor-pointer',
      'relative overflow-hidden select-none outline-none',
      'focus-visible:ring-2 focus-visible:ring-primary',
      size === 'sm' && 'py-1 text-xs',
      size === 'lg' && 'py-2.5 text-base',
      isActive
        ? 'bg-secondary-container text-on-secondary-container font-medium'
        : 'text-on-surface-variant hover:bg-on-surface/8 hover:text-on-surface',
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

// ─── PROPS-BASED SIDEBAR NAV ITEM ─────────────────────────────────────────────

export interface SidebarNavItemProps {
  id?: string;
  href?: string;
  icon?: React.ReactNode | string;
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
    <>
      <Ripple disabled={!!disabled} />
      {icon && (
        <span className="shrink-0">
          <MaterialIcon icon={icon} active={isActive} size={20} />
        </span>
      )}
      <span className="flex-1 truncate">{label}</span>
    </>
  );

  const itemClasses = cn(
    'flex items-center gap-3 px-4 py-3 rounded-xl',
    'text-body-medium transition-colors duration-short cursor-pointer',
    'relative overflow-hidden select-none',
    isActive
      ? 'bg-secondary-container text-on-secondary-container font-semibold'
      : 'text-on-surface-variant font-medium hover:bg-on-surface/8 hover:text-on-surface',
    disabled && 'opacity-38 cursor-not-allowed pointer-events-none',
    className,
  );

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
    const { isMobile, toggleMobile, toggleExpanded } = useSidebar();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isMobile) {
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
          'text-on-surface-variant hover:bg-on-surface/8',
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
        'bg-scrim/30 duration-medium ease-standard fixed inset-0 transition-opacity',
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

    // Calculate desktop margin:
    // - When drawer is expanded (pinned), include drawer width
    // - When drawer is collapsed (or hover-only), just rail width
    // Note: We use 'expanded' (pinned state) not 'isDrawerVisible' (which includes hover)
    // because hover is temporary and shouldn't shift content
    const desktopMargin = expanded ? railWidth + drawerWidth : railWidth;

    return (
      <main
        ref={ref}
        className={cn(
          'flex flex-1 flex-col',
          'bg-surface',
          'duration-emphasized ease-emphasized transition-[margin]',
          // Responsive: top margin for mobile/tablet (TopAppBar), none for desktop
          'expanded:mt-0 mt-16',
          // Height and overflow for proper scrolling (enables sticky headers)
          // Mobile: account for TopAppBar (64px = 4rem), Desktop: full screen
          'expanded:h-screen h-[calc(100vh-4rem)] overflow-x-hidden overflow-y-auto',
          className,
        )}
        style={{
          // Apply margin-left only on desktop (when not using overlay drawer)
          // On mobile/tablet, margin is 0 (content uses full width)
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
  const { isGroupExpanded, toggleGroup, setGroupExpanded, activeId } = useSidebar();
  const contentId = useId();
  const defaultAppliedRef = useRef(false);
  const hasActiveChild = childIds.length > 0 && activeId !== null && childIds.includes(activeId);

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

  const isOpen = isGroupExpanded(id, childIds);

  const handleToggle = () => {
    toggleGroup(id);
  };

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <button
        onClick={handleToggle}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl px-4 py-3',
          'text-body-medium duration-short transition-colors',
          'relative cursor-pointer overflow-hidden select-none',
          hasActiveChild
            ? 'bg-secondary-container/50 text-on-secondary-container font-semibold'
            : 'text-on-surface-variant hover:bg-on-surface/8 hover:text-on-surface font-medium',
        )}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <Ripple />
        {icon && (
          <span className="shrink-0">
            <MaterialIcon icon={icon} active={hasActiveChild} size={20} />
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
        <div className="flex flex-col overflow-hidden pl-4">{children}</div>
      </div>
    </div>
  );
}
