'use client';

import React from 'react';
import { useMode, type AppearanceMode } from '@/layout/appearance-provider';
import { type FieldSize } from '@/lib/field-size';
import { Icon } from '@/components/ui/icon';
import { SegmentedButton, type SegmentedButtonOption } from '@/components/ui/segmented-button';

export interface ModeSwitcherProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'defaultValue' | 'onChange' | 'onSelect' | 'role'
> {
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
    const options: SegmentedButtonOption<AppearanceMode>[] = modes.map((item) => ({
      value: item.value,
      label: showLabels ? item.label : <span className="sr-only">{item.label}</span>,
      icon: showIcons ? <Icon symbol={item.icon} /> : undefined,
    }));

    return (
      <SegmentedButton
        {...props}
        ref={ref}
        aria-label="Appearance mode"
        options={options}
        value={mode}
        onValueChange={setMode}
        size={size}
        className={className}
      />
    );
  },
);

ModeSwitcher.displayName = 'ModeSwitcher';
