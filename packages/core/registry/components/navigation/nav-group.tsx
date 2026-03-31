'use client';

import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { NavigationVariant } from '@/types/navigation';

export interface NavGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  showDivider?: boolean;
  variant?: NavigationVariant;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export const NavGroup = forwardRef<HTMLDivElement, NavGroupProps>(
  (
    {
      label,
      children,
      collapsible = false,
      defaultOpen = true,
      showDivider = false,
      variant = 'default',
      className,
      onOpenChange,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleToggle = () => {
      const newState = !isOpen;
      setIsOpen(newState);
      onOpenChange?.(newState);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col',
          showDivider && 'border-outline-subtle mb-3 border-b pb-3',
          className,
        )}
        {...props}
      >
        {label && (
          <div
            className={cn(
              'flex items-center justify-between',
              'text-label-small font-semibold tracking-wide uppercase',
              'text-on-surface-variant',
              variant === 'compact' && 'px-3 py-2',
              variant === 'default' && 'px-4 py-2.5',
              variant === 'comfortable' && 'px-5 py-3',

              collapsible &&
                'hover:text-on-surface-variant cursor-pointer transition-colors select-none',
            )}
            onClick={collapsible ? handleToggle : undefined}
            role={collapsible ? 'button' : undefined}
            aria-expanded={collapsible ? isOpen : undefined}
            tabIndex={collapsible ? 0 : undefined}
            onKeyDown={
              collapsible
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggle();
                    }
                  }
                : undefined
            }
          >
            <span>{label}</span>

            {collapsible && (
              <svg
                className={cn(
                  'size-icon-xs duration-short transition-transform',
                  isOpen && 'rotate-180',
                )}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            )}
          </div>
        )}

        <div
          className={cn(
            collapsible
              ? [
                  'duration-medium ease-emphasized grid transition-[grid-template-rows,opacity]',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                ]
              : 'flex flex-col',
          )}
        >
          <div
            className={cn(
              'flex flex-col',
              variant === 'compact' && 'gap-0.5',
              variant === 'default' && 'gap-1',
              variant === 'comfortable' && 'gap-1.5',
              collapsible && 'min-h-0 overflow-hidden',
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

NavGroup.displayName = 'NavGroup';
