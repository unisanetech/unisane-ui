'use client';

import { createContext, useContext } from 'react';

export type PopupDensity = 'compact' | 'comfortable';
export const PopupDensityContext = createContext<PopupDensity | undefined>(undefined);

const rows = {
  compact: {
    className:
      'text-body-medium min-h-[var(--size-action-sm)] py-1 [@media(pointer:coarse)]:min-h-[max(44px,var(--size-action-sm))]',
    minHeightPx: 32,
  },
  comfortable: {
    className:
      'text-body-medium min-h-[var(--size-action-md)] py-2 [@media(pointer:coarse)]:min-h-[max(44px,var(--size-action-md))]',
    minHeightPx: 40,
  },
} as const;

/** Preserve legacy size recipes outside an explicitly configured provider. */
export function usePopupRowStyles(fallback: { className: string; minHeightPx: number }) {
  const density = useContext(PopupDensityContext);
  const row = density ? rows[density] : fallback;
  return { ...row, density };
}
