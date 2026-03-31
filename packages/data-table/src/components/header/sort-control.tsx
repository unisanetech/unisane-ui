'use client';

import React from 'react';
import { cn, Icon, IconButton } from '@unisane/ui';
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
    <IconButton
      variant="standard"
      size="sm"
      onClick={onClick}
      aria-label={ariaLabel ?? 'Sort'}
      className={cn(
        isSorted
          ? 'text-primary hover:bg-state-hover hover:text-primary'
          : 'text-on-surface-variant hover:bg-state-hover hover:text-on-surface',
      )}
    >
      <Icon symbol={iconSymbol} className="text-[18px]" />
      {hasPriority && (
        <span className="bg-primary text-on-primary absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] leading-none font-semibold">
          {sortPriority}
        </span>
      )}
    </IconButton>
  );
}
