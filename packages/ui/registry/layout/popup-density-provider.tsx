'use client';

import type { ReactNode } from 'react';
import { PopupDensityContext, type PopupDensity } from '@/lib/popup-row';
export type { PopupDensity } from '@/lib/popup-row';

/** Controls popup rows independently of their field/trigger size. React context
 * follows portals; omitting density restores the component's existing sizing. */
export function PopupDensityProvider({
  density,
  children,
}: {
  density?: PopupDensity;
  children: ReactNode;
}) {
  return <PopupDensityContext.Provider value={density}>{children}</PopupDensityContext.Provider>;
}
