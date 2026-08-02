'use client';

import React from 'react';
import { Icon } from '@unisane/ui/icon';
import { IconButton } from '@unisane/ui/icon-button';
import type { SortDirection } from '../../types';
import {
  DENSITY_HEADER_ACTION_FRAME_STYLES,
  DENSITY_ICON_TEXT_STYLES,
  type Density,
} from '../../constants';

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
          <span className="text-label-small min-w-[10px] leading-none font-semibold">
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
      className={DENSITY_HEADER_ACTION_FRAME_STYLES[density]}
      onClick={onClick}
      aria-label={ariaLabel ?? 'Sort'}
      selected={isSorted}
      icon={
        <>
          <Icon symbol={iconSymbol} className={iconTextClass} />
          {hasPriority && (
            <span className="bg-primary text-on-primary text-label-small absolute -top-0.5 -right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full leading-none font-semibold">
              {sortPriority}
            </span>
          )}
        </>
      }
    />
  );
}
