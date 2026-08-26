import fse from 'fs-extra';
import path from 'path';

const { existsSync, readFileSync, writeFileSync } = fse;

export const UI_CONFIG_FILENAME = 'components.json';
export const UI_CONFIG_SCHEMA = 'https://ui.unisane.com/schema/components.json';

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
  $schema: string;
  style: 'unisane';
  rsc: boolean;
  tsx: true;
  tailwind: {
    css: string;
    cssVariables: true;
  };
  aliases: {
    components: string;
    ui: string;
    lib: string;
    hooks: string;
    types: string;
  };
  registries: {
    '@unisane': string;
  };
  unisane: {
    theme: string;
    appearance: {
      enabledAxes: UiAppearanceAxis[];
      persistence: UiAppearancePersistence;
    };
  };
}

export interface DefaultUiConfigOptions {
  cssPath?: string;
  rsc?: boolean;
  hasSrc?: boolean;
}

export function createDefaultUiConfig(
  theme = 'blue',
  options: DefaultUiConfigOptions = {},
): UiProjectConfig {
  const prefix = options.hasSrc === false ? '' : 'src/';
  return {
    $schema: UI_CONFIG_SCHEMA,
    style: 'unisane',
    rsc: options.rsc ?? false,
    tsx: true,
    tailwind: {
      css: options.cssPath ?? `${prefix}index.css`,
      cssVariables: true,
    },
    aliases: {
      components: '@/components',
      ui: '@/components/ui',
      lib: '@/lib',
      hooks: '@/hooks',
      types: '@/types',
    },
    registries: {
      '@unisane': 'https://ui.unisane.com/r/{name}.json',
    },
    unisane: {
      theme,
      appearance: {
        enabledAxes: [],
        persistence: 'none',
      },
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

function requireString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${UI_CONFIG_FILENAME} is missing ${key}`);
  }
  return value;
}

export function parseUiConfig(value: unknown): UiProjectConfig {
  if (!isRecord(value) || value.$schema !== UI_CONFIG_SCHEMA || value.style !== 'unisane') {
    throw new Error(`${UI_CONFIG_FILENAME} has an unsupported or malformed root`);
  }
  if (value.tsx !== true || typeof value.rsc !== 'boolean') {
    throw new Error(`${UI_CONFIG_FILENAME} must declare tsx and rsc`);
  }
  if (!isRecord(value.tailwind) || value.tailwind.cssVariables !== true) {
    throw new Error(`${UI_CONFIG_FILENAME} is missing its Tailwind routing`);
  }
  if (!isRecord(value.aliases)) {
    throw new Error(`${UI_CONFIG_FILENAME} is missing aliases`);
  }
  if (!isRecord(value.registries) || typeof value.registries['@unisane'] !== 'string') {
    throw new Error(`${UI_CONFIG_FILENAME} is missing the @unisane registry`);
  }
  if (!isRecord(value.unisane) || typeof value.unisane.theme !== 'string') {
    throw new Error(`${UI_CONFIG_FILENAME} is missing Unisane settings`);
  }
  if (!isRecord(value.unisane.appearance)) {
    throw new Error(`${UI_CONFIG_FILENAME} is missing appearance configuration`);
  }
  const enabledAxes = value.unisane.appearance.enabledAxes;
  if (!Array.isArray(enabledAxes) || !enabledAxes.every(isAppearanceAxis)) {
    throw new Error(`${UI_CONFIG_FILENAME} contains an invalid appearance axis`);
  }
  if (!isPersistence(value.unisane.appearance.persistence)) {
    throw new Error(`${UI_CONFIG_FILENAME} contains an invalid appearance persistence policy`);
  }

  return {
    $schema: UI_CONFIG_SCHEMA,
    style: 'unisane',
    rsc: value.rsc,
    tsx: true,
    tailwind: {
      css: requireString(value.tailwind, 'css'),
      cssVariables: true,
    },
    aliases: {
      components: requireString(value.aliases, 'components'),
      ui: requireString(value.aliases, 'ui'),
      lib: requireString(value.aliases, 'lib'),
      hooks: requireString(value.aliases, 'hooks'),
      types: requireString(value.aliases, 'types'),
    },
    registries: {
      '@unisane': value.registries['@unisane'],
    },
    unisane: {
      theme: value.unisane.theme,
      appearance: {
        enabledAxes: Array.from(new Set(enabledAxes)),
        persistence: value.unisane.appearance.persistence,
      },
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

export function writeUiConfig(cwd: string, config: UiProjectConfig): void {
  writeFileSync(path.join(cwd, UI_CONFIG_FILENAME), `${JSON.stringify(config, null, 2)}\n`);
}
