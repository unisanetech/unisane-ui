import fse from 'fs-extra';
const { existsSync, readFileSync, writeFileSync } = fse;
import path from 'path';

export const UI_CONFIG_FILENAME = 'unisane-ui.json';

export const APPEARANCE_AXES = [
  'mode',
  'density',
  'contrast',
  'radius',
  'actionShape',
  'elevation',
] as const;

export const APPEARANCE_PERSISTENCE = ['none', 'localStorage', 'cookie'] as const;

export type UiAppearanceAxis = (typeof APPEARANCE_AXES)[number];
export type UiAppearancePersistence = (typeof APPEARANCE_PERSISTENCE)[number];

export interface UiProjectConfig {
  schemaVersion: 1;
  theme: string;
  appearance: {
    enabledAxes: UiAppearanceAxis[];
    persistence: UiAppearancePersistence;
  };
}

export function createDefaultUiConfig(theme = 'blue'): UiProjectConfig {
  return {
    schemaVersion: 1,
    theme,
    appearance: {
      enabledAxes: [],
      persistence: 'none',
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAppearanceAxis(value: unknown): value is UiAppearanceAxis {
  return typeof value === 'string' && APPEARANCE_AXES.includes(value as UiAppearanceAxis);
}

function isPersistence(value: unknown): value is UiAppearancePersistence {
  return (
    typeof value === 'string' && APPEARANCE_PERSISTENCE.includes(value as UiAppearancePersistence)
  );
}

export function parseUiConfig(value: unknown): UiProjectConfig {
  if (!isRecord(value) || value.schemaVersion !== 1 || typeof value.theme !== 'string') {
    throw new Error(`${UI_CONFIG_FILENAME} has an unsupported or malformed root`);
  }
  if (!isRecord(value.appearance)) {
    throw new Error(`${UI_CONFIG_FILENAME} is missing appearance configuration`);
  }
  const enabledAxes = value.appearance.enabledAxes;
  if (!Array.isArray(enabledAxes) || !enabledAxes.every(isAppearanceAxis)) {
    throw new Error(`${UI_CONFIG_FILENAME} contains an invalid appearance axis`);
  }
  if (!isPersistence(value.appearance.persistence)) {
    throw new Error(`${UI_CONFIG_FILENAME} contains an invalid appearance persistence policy`);
  }
  return {
    schemaVersion: 1,
    theme: value.theme,
    appearance: {
      enabledAxes: Array.from(new Set(enabledAxes)),
      persistence: value.appearance.persistence,
    },
  };
}

export function readUiConfig(cwd: string): UiProjectConfig | null {
  const configPath = path.join(cwd, UI_CONFIG_FILENAME);
  if (!existsSync(configPath)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(configPath, 'utf8'));
  } catch {
    throw new Error(`${UI_CONFIG_FILENAME} is not valid JSON`);
  }
  return parseUiConfig(parsed);
}

export function writeUiConfig(cwd: string, config: UiProjectConfig, backup = true) {
  const configPath = path.join(cwd, UI_CONFIG_FILENAME);
  if (backup && existsSync(configPath)) {
    writeFileSync(`${configPath}.backup`, readFileSync(configPath, 'utf8'));
  }
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
}
