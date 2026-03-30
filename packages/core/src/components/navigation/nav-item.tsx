'use client';

import React, { forwardRef, isValidElement, cloneElement } from 'react';
import { cn, Slot } from '@ui/lib/utils';
import { Ripple } from '../ripple';
import type { NavigationVariant } from '../../types/navigation';

export interface NavItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: NavigationVariant;
  compact?: boolean;
  className?: string;
  as?: 'button' | 'a' | 'div';
  external?: boolean;
  asChild?: boolean;
  linkElement?: React.ReactNode;
}

export const NavItem = forwardRef<HTMLElement, NavItemProps>(
  (
    {
      children,
      icon,
      badge,
      active = false,
      disabled = false,
      href,
      onClick,
      variant = 'default',
      compact = false,
      className,
      as,
      external = false,
      asChild = false,
      linkElement,
      ...props
    },
    ref,
  ) => {
    const Component = as || (href ? 'a' : 'button');

    const baseClasses = cn(
      'group relative flex items-center gap-3',
      'w-full text-left',
      'rounded-button',
      'transition-all duration-short ease-standard',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      'overflow-hidden select-none',
      variant === 'compact' && 'px-3 py-2 min-h-10',
      variant === 'default' && 'px-4 py-2.5 min-h-12',
      variant === 'comfortable' && 'px-5 py-3 min-h-14',
      active && ['bg-state-selected text-on-surface', 'font-semibold'],
      !active && [
        'text-on-surface-variant',
        !disabled && 'hover:bg-surface-variant hover:text-on-surface',
      ],
      disabled && 'opacity-38 cursor-not-allowed pointer-events-none',

      className,
    );

    const badgeElement = badge !== undefined && (
      <span
        className={cn(
          'absolute top-1 right-1',
          'h-4 min-w-4 px-1',
          'flex items-center justify-center',
          'bg-error text-on-error',
          'text-label-small leading-none font-medium',
          'rounded-full',
          'pointer-events-none z-20',
          'ring-surface ring-1',
          typeof badge === 'number' && badge < 10 && 'h-3 min-w-3 p-1',
        )}
      >
        {badge}
      </span>
    );

    const content = (
      <>
        <span
          className={cn(
            'duration-short pointer-events-none absolute inset-0 bg-current opacity-0 transition-opacity',
            'group-hover:opacity-hover',
            'group-focus-visible:opacity-focus',
            'group-active:opacity-pressed',
          )}
        />

        {!disabled && <Ripple disabled={disabled} />}

        {icon && (
          <span
            className={cn(
              'relative z-10 flex shrink-0 items-center justify-center',
              'h-6 w-6',
              'duration-short transition-transform',
              active && 'scale-110',
            )}
          >
            {icon}
          </span>
        )}

        {!compact && (
          <span
            className={cn(
              'relative z-10 min-w-0 flex-1',
              'text-label-large leading-tight',
              'truncate',
            )}
          >
            {children}
          </span>
        )}

        {badgeElement}
      </>
    );

    const componentProps = {
      ref: ref as React.Ref<HTMLButtonElement & HTMLAnchorElement & HTMLDivElement>,
      className: baseClasses,
      onClick: disabled ? undefined : onClick,
      disabled: Component === 'button' ? disabled : undefined,
      href: Component === 'a' && !disabled ? href : undefined,
      target: Component === 'a' && external ? '_blank' : undefined,
      rel: Component === 'a' && external ? 'noopener noreferrer' : undefined,
      'aria-current': active ? ('page' as const) : undefined,
      'aria-disabled': disabled || undefined,
      tabIndex: disabled ? -1 : undefined,
      ...props,
    };

    if (asChild && linkElement && isValidElement(linkElement)) {
      return (
        <Slot
          className={baseClasses}
          onClick={disabled ? undefined : onClick}
          aria-current={active ? 'page' : undefined}
          aria-disabled={disabled || undefined}
        >
          {cloneElement(linkElement as React.ReactElement, {}, content)}
        </Slot>
      );
    }

    return <Component {...componentProps}>{content}</Component>;
  },
);

NavItem.displayName = 'NavItem';
