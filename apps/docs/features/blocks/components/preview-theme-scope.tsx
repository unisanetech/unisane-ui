'use client';

import type { PropsWithChildren } from 'react';
import { cn } from '@unisane/ui/utils';

interface PreviewThemeScopeProps extends PropsWithChildren {
  theme: 'light' | 'dark';
  className?: string;
}

export function PreviewThemeScope({ theme, className, children }: PreviewThemeScopeProps) {
  return (
    <div
      data-theme-scope={theme}
      data-theme-mode={theme}
      style={{ colorScheme: theme }}
      className={cn(theme === 'dark' && 'dark', className)}
    >
      {children}
    </div>
  );
}
