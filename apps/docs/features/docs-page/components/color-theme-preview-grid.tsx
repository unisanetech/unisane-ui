'use client';

import { useState } from 'react';
import { COLOR_THEME_OPTIONS, getColorThemeSwatch } from '@/lib/theme/color-theme-options';
import { Typography } from '@unisane/ui/typography';

export function ColorThemePreviewGrid() {
  const [selectedTheme, setSelectedTheme] = useState(COLOR_THEME_OPTIONS[0]?.value ?? 'blue');

  return (
    <div className="grid grid-cols-2 gap-3 @sm:grid-cols-5">
      {COLOR_THEME_OPTIONS.map((theme) => (
        <button
          key={theme.value}
          onClick={() => setSelectedTheme(theme.value)}
          className={`relative rounded-lg border-2 p-4 transition-all ${
            selectedTheme === theme.value
              ? 'border-primary bg-primary-container'
              : 'border-outline-variant hover:border-outline'
          }`}
        >
          <div
            className="mx-auto mb-2 h-8 w-8 rounded-full"
            style={{ backgroundColor: getColorThemeSwatch(theme) }}
          />
          <Typography variant="labelMedium" className="text-center">
            {theme.label}
          </Typography>
          {selectedTheme === theme.value && (
            <span className="material-symbols-outlined text-primary absolute top-2 right-2 text-[16px]">
              check_circle
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
