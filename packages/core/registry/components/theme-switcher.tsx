'use client';

import React from 'react';
import { useColorScheme, type Theme } from '../layout/theme-provider';
import { cn } from '@/lib/utils';
import { type FieldSize, getFieldSizeStyles } from '@/lib/field-size';

export interface ThemeSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: FieldSize;
  showLabels?: boolean;
  showIcons?: boolean;
}

const themes: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
  { value: 'system', label: 'System', icon: 'contrast' },
];

export const ThemeSwitcher = React.forwardRef<HTMLDivElement, ThemeSwitcherProps>(
  ({ className, size = 'md', showLabels = true, showIcons = true, ...props }, ref) => {
    const { theme, setTheme } = useColorScheme();
    const fieldSize = getFieldSizeStyles(size);
    const gapClass = size === 'sm' ? 'gap-1.5' : size === 'lg' ? 'gap-3' : 'gap-2';
    const paddingClass = size === 'sm' ? 'px-3' : size === 'lg' ? 'px-5' : 'px-4';
    const labelClass = size === 'lg' ? 'text-label-large' : 'text-label-medium';
    const iconClass = size === 'lg' ? 'text-icon-md' : 'text-icon-sm';

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center overflow-hidden rounded-sm border border-outline-variant',
          fieldSize.containerHeight,
          className,
        )}
        role="radiogroup"
        aria-label="Theme selection"
        {...props}
      >
        {themes.map((t) => (
          <button
            key={t.value}
            type="button"
            role="radio"
            aria-checked={theme === t.value}
            onClick={() => setTheme(t.value)}
            className={cn(
              'relative flex items-center justify-center transition-colors duration-snappy',
              gapClass,
              paddingClass,
              labelClass,
              theme === t.value
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-container',
            )}
          >
            {showIcons && (
              <span className={cn('material-symbols-outlined', iconClass)} aria-hidden="true">
                {t.icon}
              </span>
            )}
            {showLabels && <span>{t.label}</span>}
          </button>
        ))}
      </div>
    );
  },
);

ThemeSwitcher.displayName = 'ThemeSwitcher';
