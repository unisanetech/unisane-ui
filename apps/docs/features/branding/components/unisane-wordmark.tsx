'use client';

import React from 'react';
import { cn } from '@unisane/ui/utils';

interface UnisaneWordmarkProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function UnisaneWordmark({ size = 'md', className }: UnisaneWordmarkProps) {
  const isSmall = size === 'sm';

  return (
    <span className={cn('inline-flex items-baseline gap-0.5 leading-none', className)}>
      <span
        className={cn('text-on-surface font-medium', isSmall ? 'text-[1rem]' : 'text-[1.35rem]')}
      >
        unisane
      </span>
      <span className={cn('text-on-surface-variant', isSmall ? 'text-[1rem]' : 'text-[1.35rem]')}>
        /ui
      </span>
    </span>
  );
}
