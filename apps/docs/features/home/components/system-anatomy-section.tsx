'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import {
  COLOR_THEME_OPTIONS,
  getColorThemeSwatch,
  type ColorThemeOption,
} from '@/lib/theme/color-theme-options';
import {
  type AppearancePreferences,
  useAppearance,
} from '@unisane/ui/appearance-provider';
import { Button } from '@unisane/ui/button';
import { Fab } from '@unisane/ui/fab';
import { Icon } from '@unisane/ui/icon';
import { IconButton } from '@unisane/ui/icon-button';
import { Popover } from '@unisane/ui/popover';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';

type ColorTheme = ColorThemeOption['value'];

const MODE_OPTIONS: readonly {
  value: AppearancePreferences['mode'];
  label: string;
  icon: string;
}[] = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'system', label: 'System', icon: 'contrast' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
];

export function ThemeControlFab() {
  const { preferences, resetPreferences, setPreference } = useAppearance();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>('blue');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-color-theme', colorTheme);
    document.documentElement.setAttribute('data-scheme', 'tonal');
  }, [colorTheme]);

  const resetTheme = () => {
    setColorTheme('blue');
    resetPreferences();
  };

  const content = (
    <div className="w-[21rem] max-w-[calc(100vw-2rem)]">
      <div className="border-outline-weak flex items-start justify-between gap-4 border-b p-4">
        <div>
          <Typography variant="titleMedium" className="block">
            Appearance
          </Typography>
          <Typography variant="bodySmall" className="text-on-surface-variant mt-1 block">
            Preview the system live.
          </Typography>
        </div>
        <IconButton
          variant="standard"
          aria-label="Reset appearance"
          onClick={resetTheme}
          icon={<Icon symbol="restart_alt" />}
        />
      </div>

      <div className="p-4">
        <Typography variant="labelMedium" className="text-on-surface-variant block uppercase">
          Color theme
        </Typography>
        <div className="mt-3 grid grid-cols-5 gap-2" role="radiogroup" aria-label="Color theme">
          {COLOR_THEME_OPTIONS.map((option) => {
            const selected = colorTheme === option.value;
            return (
              <div key={option.value} className="flex min-w-0 flex-col items-center">
                <IconButton
                  variant={selected ? 'outlined' : 'standard'}
                  selected={selected}
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${option.label} color theme`}
                  onClick={() => setColorTheme(option.value)}
                  icon={
                    <span
                      className="border-outline-soft h-5 w-5 rounded-full border"
                      style={{ backgroundColor: getColorThemeSwatch(option) }}
                    />
                  }
                />
                <Typography
                  variant="labelSmall"
                  className={cn(
                    'mt-1 max-w-full truncate',
                    selected ? 'text-primary' : 'text-on-surface-variant',
                  )}
                >
                  {option.label}
                </Typography>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-outline-weak border-t p-4">
        <Typography variant="labelMedium" className="text-on-surface-variant block uppercase">
          Mode
        </Typography>
        <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Color mode">
          {MODE_OPTIONS.map((option) => {
            const selected = preferences.mode === option.value;
            return (
              <Button
                key={option.value}
                variant={selected ? 'filled' : 'outlined'}
                role="radio"
                aria-checked={selected}
                leadingIcon={<Icon symbol={option.icon} />}
                onClick={() => setPreference('mode', option.value)}
                className="min-w-0"
              >
                <span className="truncate">{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(
    <div className="fixed right-4 bottom-4 z-[var(--z-popover,2000)]">
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Fab
            icon={<Icon symbol={open ? 'close' : 'palette'} />}
            aria-label={open ? 'Close appearance controls' : 'Open appearance controls'}
          />
        }
        content={content}
        side="top"
        align="end"
        sideOffset={12}
        collisionPadding={16}
        className="!min-w-0 !p-0"
      />
    </div>,
    document.body,
  );
}

export function SystemAnatomySection() {
  return <ThemeControlFab />;
}
