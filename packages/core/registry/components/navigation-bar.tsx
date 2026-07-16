'use client';

import React from 'react';
import { cn, focusRing } from '@/lib/utils';
import {
  getVisibleNavigationItems,
  NavigationAction,
  useNavigationSelection,
} from '@/lib/navigation-action';
import { NavigationIcon } from '@/lib/navigation-visuals';
import type { NavigationPresentationProps } from '@/types/navigation';
import { Ripple } from '@/components/ui/ripple';

export interface NavigationBarProps
  extends
    NavigationPresentationProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'defaultValue' | 'onSelect'> {
  'aria-label': string;
  itemClassName?: string;
}

export function NavigationBar({
  items,
  value,
  defaultValue,
  onValueChange,
  onItemSelect,
  renderLink,
  className,
  'aria-label': ariaLabel,
  itemClassName,
  ...props
}: NavigationBarProps) {
  const { currentValue, selectItem } = useNavigationSelection({
    value,
    defaultValue,
    onValueChange,
    onItemSelect,
  });

  return (
    <nav
      className={cn(
        'border-outline-soft bg-surface-container-low absolute right-0 bottom-0 left-0 z-30 flex h-20 items-center justify-around border-t px-4 pb-4',
        className,
      )}
      aria-label={ariaLabel}
      {...props}
    >
      {getVisibleNavigationItems(items).map((item) => {
        const active = currentValue === item.id;
        return (
          <NavigationAction
            key={item.id}
            item={item}
            active={active}
            onActivate={selectItem}
            renderLink={renderLink}
            className={cn(
              'group relative flex h-full min-w-16 flex-col items-center justify-center gap-1 px-2 select-none focus-visible:outline-none',
              focusRing,
              itemClassName,
            )}
          >
            <span className="relative mb-1 h-8 w-16">
              <span
                className={cn(
                  'rounded-button duration-medium ease-standard absolute inset-0 overflow-hidden transition-all',
                  active
                    ? 'bg-secondary-container scale-x-100 opacity-100'
                    : 'group-hover:bg-state-hover scale-x-50 bg-transparent opacity-0',
                )}
              >
                <Ripple center disabled={item.disabled} />
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'relative z-10 flex h-full w-full items-center justify-center transition-colors',
                  active
                    ? 'text-on-secondary-container'
                    : 'text-on-surface-variant group-hover:text-on-surface',
                )}
              >
                {item.icon ? (
                  <NavigationIcon
                    icon={active && item.activeIcon ? item.activeIcon : item.icon}
                    active={active}
                    size="md"
                  />
                ) : null}
              </span>
              {item.badge !== undefined ? (
                <span className="bg-error text-on-error absolute -top-1 right-0 z-20 flex min-h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none">
                  {item.badge}
                </span>
              ) : null}
            </span>
            <span
              className={cn(
                'text-label-medium w-full truncate text-center font-medium transition-colors',
                active ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface',
              )}
            >
              {item.label}
            </span>
          </NavigationAction>
        );
      })}
    </nav>
  );
}
