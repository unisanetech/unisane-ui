import type { AppearanceAxis, AppearancePreferences } from '@unisane/ui/appearance-provider';

export const DOCS_APPEARANCE_COOKIE = 'unisane-docs-appearance';

export const DOCS_APPEARANCE_AXES = [
  'mode',
  'density',
  'contrast',
  'radius',
  'actionShape',
  'elevation',
] as const satisfies readonly AppearanceAxis[];

export const DOCS_DEFAULT_APPEARANCE = {
  mode: 'system',
  density: 'standard',
  contrast: 'standard',
  radius: 'standard',
  actionShape: 'standard',
  elevation: 'subtle',
} satisfies AppearancePreferences;
