'use client';

import React from 'react';
import { cn, Icon } from '@unisane/ui';
import type { SortDirection } from '../../types';

type SortControlVariant = 'indicator' | 'action';

export interface SortControlProps {
  isSorted: boolean;
  sortDirection: SortDirection;
  sortPriority?: number | null;
  variant: SortControlVariant;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
}

function getSortSymbol(isSorted: boolean, direction: SortDirection): string {
  if (!isSorted) return 'unfold_more';
  return direction === 'desc' ? 'arrow_downward' : 'arrow_upward';
}

export function SortControl({
  isSorted,
  sortDirection,
  sortPriority,
  variant,
  onClick,
  ariaLabel,
}: SortControlProps) {
  const iconSymbol = getSortSymbol(isSorted, sortDirection);
  const hasPriority = isSorted && sortPriority != null && sortPriority > 0;

  if (variant === 'indicator') {
    return (
      <span className="text-primary inline-flex items-center">
        <Icon symbol={iconSymbol} className="text-[16px]" />
        {hasPriority && (
          <span className="min-w-[10px] text-[10px] leading-none font-semibold">
            {sortPriority}
          </span>
        )}
      </span>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative inline-flex h-7 w-7 items-center justify-center rounded transition-colors',
        isSorted
          ? 'text-primary hover:bg-primary-container/80 hover:text-on-primary-container'
          : 'text-on-surface-variant hover:bg-on-surface/8 hover:text-on-surface',
        'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none',
      )}
      aria-label={ariaLabel}
    >
      <Icon symbol={iconSymbol} className="text-[18px]" />
      {hasPriority && (
        <span className="bg-primary text-on-primary absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] leading-none font-semibold">
          {sortPriority}
        </span>
      )}
    </button>
  );
}
