'use client';

import React, { cloneElement, isValidElement } from 'react';
import { cn, Slot } from '@/lib/utils';
import { useControllableState } from '@/lib/use-controllable-state';
import {
  NavigationRailItemContent,
  getNavigationRailItemClasses,
} from '@/lib/navigation-visuals';
import { Ripple } from './ripple';

export interface RailItem {
  value: string;
  label: string;
  icon: React.ReactNode | string;
  activeIcon?: React.ReactNode | string;
  badge?: string | number;
  tooltip?: string;
  disabled?: boolean;
  href?: string;
  asChild?: boolean;
  linkElement?: React.ReactNode;
}

export type NavigationRailLabelVisibility = 'always' | 'selected' | 'hidden';

export interface NavigationRailProps {
  items: RailItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onItemHover?: (value: string) => void;
  onMouseLeave?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  alignment?: 'start' | 'center' | 'end';
  labelVisibility?: NavigationRailLabelVisibility;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  items,
  value,
  defaultValue,
  onValueChange,
  onItemHover,
  onMouseLeave,
  header,
  footer,
  className,
  alignment = 'start',
  labelVisibility = 'always',
}) => {
  const [currentValue, setCurrentValue] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <nav
      className={cn(
        'border-outline-variant bg-surface-container text-on-surface duration-medium ease-standard z-50 flex h-full w-24 shrink-0 flex-col items-center gap-1 border-r py-3 transition-all',
        className,
      )}
      aria-label="Sidebar Navigation"
      onMouseLeave={onMouseLeave}
    >
      {header && <div className="flex w-full flex-col items-center gap-4 pb-2">{header}</div>}

      <div
        className={cn(
          'flex w-full flex-1 flex-col items-center gap-3',
          alignment === 'center' && 'justify-center',
          alignment === 'end' && 'justify-end pb-4',
        )}
      >
        {items.map((item) => {
          const isActive = currentValue === item.value;
          const showLabel = labelVisibility === 'always' || (labelVisibility === 'selected' && isActive);
          const tooltipText = item.tooltip ?? (labelVisibility === 'hidden' ? item.label : undefined);
          const content = (
            <NavigationRailItemContent
              icon={item.icon}
              activeIcon={item.activeIcon}
              badge={item.badge}
              label={item.label}
              showLabel={showLabel}
              active={isActive}
              disabled={item.disabled}
              ripple={<Ripple center disabled={item.disabled} />}
            />
          );
          const commonClasses = getNavigationRailItemClasses(item.disabled);

          const handleActivate = (event?: React.MouseEvent) => {
            if (item.disabled) {
              event?.preventDefault();
              return;
            }
            setCurrentValue(item.value);
          };

          const commonProps = {
            onClick: handleActivate,
            onMouseEnter: () => !item.disabled && onItemHover?.(item.value),
            className: commonClasses,
            'aria-current': isActive ? ('page' as const) : undefined,
            'aria-disabled': item.disabled || undefined,
            'aria-label': showLabel ? undefined : item.label,
            title: tooltipText,
          };

          if (item.asChild && item.linkElement) {
            return (
              <Slot key={item.value} {...commonProps}>
                {isValidElement(item.linkElement)
                  ? cloneElement(item.linkElement as React.ReactElement, {}, content)
                  : item.linkElement}
              </Slot>
            );
          }

          if (item.href) {
            return (
              <a
                key={item.value}
                href={item.disabled ? undefined : item.href}
                {...commonProps}
                tabIndex={item.disabled ? -1 : undefined}
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => handleActivate()}
              onMouseEnter={() => !item.disabled && onItemHover?.(item.value)}
              disabled={item.disabled}
              className={commonClasses}
              aria-current={isActive ? 'page' : undefined}
              aria-label={showLabel ? undefined : item.label}
              title={tooltipText}
            >
              {content}
            </button>
          );
        })}
      </div>

      {footer && (
        <div className="mt-auto mb-4 flex w-full flex-col items-center gap-4 pt-2">{footer}</div>
      )}
    </nav>
  );
};
