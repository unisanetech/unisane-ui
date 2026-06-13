'use client';

import React from 'react';
import { cn, Icon, IconButton } from '@unisane/ui';
import type { SortDirection } from '../../types';
import { DENSITY_ICON_TEXT_STYLES, type Density } from '../../constants';

type SortControlVariant = 'indicator' | 'action';

export interface SortControlProps {
  isSorted: boolean;
  sortDirection: SortDirection;
  sortPriority?: number | null;
  variant: SortControlVariant;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
  density?: Density;
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
  density = 'standard',
}: SortControlProps) {
  const iconSymbol = getSortSymbol(isSorted, sortDirection);
  const hasPriority = isSorted && sortPriority != null && sortPriority > 0;
  const iconTextClass = DENSITY_ICON_TEXT_STYLES[density];

  if (variant === 'indicator') {
    return (
      <span className="text-primary inline-flex items-center">
        <Icon symbol={iconSymbol} className={iconTextClass} />
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
      selected={isSorted}
    >
      <Icon symbol={iconSymbol} className={iconTextClass} />
      {hasPriority && (
        <span className="bg-primary text-on-primary absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] leading-none font-semibold">
          {sortPriority}
        </span>
      )}
    </IconButton>
  );
}
