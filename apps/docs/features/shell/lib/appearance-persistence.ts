import type {
  ActionShape,
  AppearanceAxis,
  AppearanceMode,
  AppearancePreferences,
  ContrastLevel,
  Density,
  Elevation,
  RadiusTheme,
} from '@unisane/ui';

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

const VALID_DENSITIES: readonly Density[] = ['compact', 'standard', 'comfortable', 'dense'];
const VALID_MODES: readonly AppearanceMode[] = ['light', 'dark', 'system'];
const VALID_RADII: readonly RadiusTheme[] = ['none', 'minimal', 'sharp', 'standard', 'soft'];
const VALID_ACTION_SHAPES: readonly ActionShape[] = ['standard', 'full'];
const VALID_CONTRASTS: readonly ContrastLevel[] = ['standard', 'medium', 'high'];
const VALID_ELEVATIONS: readonly Elevation[] = ['flat', 'subtle', 'standard', 'pronounced'];

function isValid<T>(value: unknown, validValues: readonly T[]): value is T {
  return validValues.includes(value as T);
}

function parseAppearanceCookieValue(raw: string | undefined): Record<string, unknown> {
  if (!raw) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return parsed as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function resolveDocsAppearance(cookieValue?: string): AppearancePreferences {
  const parsed = parseAppearanceCookieValue(cookieValue);

  return {
    mode: isValid(parsed.mode, VALID_MODES) ? parsed.mode : DOCS_DEFAULT_APPEARANCE.mode,
    density: isValid(parsed.density, VALID_DENSITIES)
      ? parsed.density
      : DOCS_DEFAULT_APPEARANCE.density,
    radius: isValid(parsed.radius, VALID_RADII) ? parsed.radius : DOCS_DEFAULT_APPEARANCE.radius,
    actionShape: isValid(parsed.actionShape, VALID_ACTION_SHAPES)
      ? parsed.actionShape
      : DOCS_DEFAULT_APPEARANCE.actionShape,
    contrast: isValid(parsed.contrast, VALID_CONTRASTS)
      ? parsed.contrast
      : DOCS_DEFAULT_APPEARANCE.contrast,
    elevation: isValid(parsed.elevation, VALID_ELEVATIONS)
      ? parsed.elevation
      : DOCS_DEFAULT_APPEARANCE.elevation,
  };
}
