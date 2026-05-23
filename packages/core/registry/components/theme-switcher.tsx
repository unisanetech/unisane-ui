'use client';

import React from 'react';
import { useColorScheme, type Theme } from '@/layout/theme-provider';
import { cn } from '@/lib/utils';
import { type FieldSize, getFieldSizeStyles } from '@/lib/field-size';
import { Icon, type IconProps } from '@/primitives/icon';

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
    const iconSize: NonNullable<IconProps['size']> = size === 'lg' ? 'md' : 'sm';

    return (
      <div
        ref={ref}
        className={cn(
          'border-outline-variant rounded-button inline-flex items-center overflow-hidden border',
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
              'duration-snappy rounded-button relative flex items-center justify-center transition-colors',
              gapClass,
              paddingClass,
              labelClass,
              theme === t.value
                ? 'bg-state-selected text-on-surface'
                : 'text-on-surface-variant hover:bg-surface-container',
            )}
          >
            {showIcons && <Icon symbol={t.icon} size={iconSize} aria-hidden="true" />}
            {showLabels && <span>{t.label}</span>}
          </button>
        ))}
      </div>
    );
  },
);

ThemeSwitcher.displayName = 'ThemeSwitcher';
