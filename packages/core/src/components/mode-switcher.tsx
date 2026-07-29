'use client';

import React from 'react';
import { useMode, type AppearanceMode } from '../layout/appearance-provider';
import { cn } from '../lib/utils';
import { type FieldSize, getFieldSizeStyles } from '../lib/field-size';
import { Icon, type IconProps } from './icon';

export interface ModeSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: FieldSize;
  showLabels?: boolean;
  showIcons?: boolean;
}

const modes: { value: AppearanceMode; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
  { value: 'system', label: 'System', icon: 'contrast' },
];

export const ModeSwitcher = React.forwardRef<HTMLDivElement, ModeSwitcherProps>(
  ({ className, size = 'md', showLabels = true, showIcons = true, ...props }, ref) => {
    const { mode, setMode } = useMode();
    const fieldSize = getFieldSizeStyles(size);
    const gapClass = size === 'sm' ? 'gap-1.5' : size === 'lg' ? 'gap-3' : 'gap-2';
    const paddingClass = size === 'sm' ? 'px-3' : size === 'lg' ? 'px-5' : 'px-4';
    const labelClass = size === 'lg' ? 'text-label-large' : 'text-label-medium';
    const iconSize: NonNullable<IconProps['size']> = size === 'lg' ? 'md' : 'sm';

    return (
      <div
        ref={ref}
        className={cn(
          'border-outline-subtle rounded-button inline-flex items-center overflow-hidden border',
          fieldSize.containerHeight,
          className,
        )}
        role="radiogroup"
        aria-label="Appearance mode"
        {...props}
      >
        {modes.map((item) => (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={mode === item.value}
            onClick={() => setMode(item.value)}
            className={cn(
              'duration-snappy rounded-button relative flex items-center justify-center transition-colors',
              gapClass,
              paddingClass,
              labelClass,
              mode === item.value
                ? 'bg-state-selected text-on-surface'
                : 'text-on-surface-variant hover:bg-surface-container',
            )}
          >
            {showIcons && <Icon symbol={item.icon} size={iconSize} aria-hidden="true" />}
            {showLabels && <span>{item.label}</span>}
          </button>
        ))}
      </div>
    );
  },
);

ModeSwitcher.displayName = 'ModeSwitcher';
