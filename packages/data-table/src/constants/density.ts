// ─── DENSITY CONSTANTS ───────────────────────────────────────────────────────
// Configuration for different density levels including styles and dimensions.

import { DensityLevel, type DensityLevelValue } from './enums';

/**
 * Padding classes for different density levels.
 * Uses standard Tailwind spacing which scales automatically with global theme density
 * via CSS custom properties (--scale-space).
 *
 * When data-density="compact" is set on <html>, spacing tokens scale to 87.5%
 * When data-density="comfortable" is set on <html>, spacing tokens scale to 110%
 *
 * The component-level density prop provides additional fine-tuning on top of global density.
 */
export const DENSITY_STYLES: Record<DensityLevelValue, string> = {
  [DensityLevel.DENSE]: 'py-1 px-2',
  [DensityLevel.COMPACT]: 'py-1.5 px-3',
  [DensityLevel.STANDARD]: 'py-2 px-4',
  [DensityLevel.COMFORTABLE]: 'py-3 px-4',
};

export const DENSITY_CELL_TEXT_STYLES: Record<DensityLevelValue, string> = {
  [DensityLevel.DENSE]: 'text-body-small',
  [DensityLevel.COMPACT]: 'text-body-small',
  [DensityLevel.STANDARD]: 'text-body-medium',
  [DensityLevel.COMFORTABLE]: 'text-body-medium',
};

export const DENSITY_HEADER_TEXT_STYLES: Record<DensityLevelValue, string> = {
  [DensityLevel.DENSE]: 'text-label-medium',
  [DensityLevel.COMPACT]: 'text-label-medium',
  [DensityLevel.STANDARD]: 'text-label-large',
  [DensityLevel.COMFORTABLE]: 'text-label-large',
};

export const DENSITY_ICON_TEXT_STYLES: Record<DensityLevelValue, string> = {
  [DensityLevel.DENSE]: 'text-[16px]',
  [DensityLevel.COMPACT]: 'text-[18px]',
  [DensityLevel.STANDARD]: 'text-[18px]',
  [DensityLevel.COMFORTABLE]: 'text-[20px]',
};

export const DENSITY_UTILITY_COLUMN_WIDTHS: Record<
  DensityLevelValue,
  { checkbox: number; dragHandle: number; expander: number }
> = {
  [DensityLevel.DENSE]: { checkbox: 36, dragHandle: 32, expander: 32 },
  [DensityLevel.COMPACT]: { checkbox: 44, dragHandle: 40, expander: 40 },
  [DensityLevel.STANDARD]: { checkbox: 48, dragHandle: 44, expander: 44 },
  [DensityLevel.COMFORTABLE]: { checkbox: 52, dragHandle: 48, expander: 48 },
};

/**
 * Configuration for each density level including base row heights.
 * These values represent the base height at standard density (--scale-space: 1).
 *
 * In components, these should be multiplied by the density scale factor
 * or used as CSS calc() with var(--scale-space) for dynamic scaling.
 */
export const DENSITY_CONFIG: Record<DensityLevelValue, { rowHeight: number; label: string }> = {
  [DensityLevel.DENSE]: { rowHeight: 32, label: 'Dense' },
  [DensityLevel.COMPACT]: { rowHeight: 40, label: 'Compact' },
  [DensityLevel.STANDARD]: { rowHeight: 48, label: 'Standard' },
  [DensityLevel.COMFORTABLE]: { rowHeight: 56, label: 'Comfortable' },
};

/**
 * CSS variable-based row height for use in inline styles.
 * This allows row heights to scale with global theme density.
 *
 * Usage: style={{ height: `calc(${ROW_HEIGHT_BASE[density]} * var(--scale-space, 1))` }}
 */
export const ROW_HEIGHT_BASE: Record<DensityLevelValue, string> = {
  [DensityLevel.DENSE]: '32px',
  [DensityLevel.COMPACT]: '40px',
  [DensityLevel.STANDARD]: '48px',
  [DensityLevel.COMFORTABLE]: '56px',
};

/**
 * Default density level
 */
export const DEFAULT_DENSITY = DensityLevel.STANDARD;
