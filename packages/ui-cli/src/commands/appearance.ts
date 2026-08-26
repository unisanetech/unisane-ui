import { existsSync } from 'node:fs';
import path from 'node:path';
import { log } from '../cli-support.js';
import { uiAdd } from './add.js';
import type { PackageInstallRunner, PackageManager } from './add-types.js';
import {
  APPEARANCE_AXES,
  APPEARANCE_PERSISTENCE,
  readUiConfig,
  UI_CONFIG_FILENAME,
  type UiAppearanceAxis,
  type UiAppearancePersistence,
  writeUiConfig,
} from './ui-config.js';

function isAxis(value: string): value is UiAppearanceAxis {
  return APPEARANCE_AXES.includes(value as UiAppearanceAxis);
}

function isPersistence(value: string): value is UiAppearancePersistence {
  return APPEARANCE_PERSISTENCE.includes(value as UiAppearancePersistence);
}

function loadConfigSafely(cwd: string) {
  try {
    return readUiConfig(cwd);
  } catch (error) {
    log.error(error instanceof Error ? error.message : String(error));
    return null;
  }
}

export interface UiAppearanceEnableOptions {
  cwd?: string;
  axes: string[];
  persistence?: string;
  dryRun?: boolean;
  install?: boolean;
  packageManager?: PackageManager;
  installRunner?: PackageInstallRunner;
}

export async function uiAppearanceEnable(options: UiAppearanceEnableOptions): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  const invalidAxes = options.axes.filter((axis) => !isAxis(axis));
  if (invalidAxes.length > 0) {
    log.error(`Unknown appearance axes: ${invalidAxes.join(', ')}`);
    log.dim(`Available axes: ${APPEARANCE_AXES.join(', ')}`);
    return 1;
  }
  const persistence = options.persistence ?? 'localStorage';
  if (!isPersistence(persistence)) {
    log.error(`Unknown persistence policy: ${persistence}`);
    log.dim(`Available policies: ${APPEARANCE_PERSISTENCE.join(', ')}`);
    return 1;
  }
  const config = loadConfigSafely(cwd);
  if (!config) {
    log.error(`${UI_CONFIG_FILENAME} not found; run "unisane-ui init" first`);
    return 1;
  }

  const enabledAxes = Array.from(
    new Set([...config.unisane.appearance.enabledAxes, ...options.axes]),
  ) as UiAppearanceAxis[];
  const next = {
    ...config,
    unisane: {
      ...config.unisane,
      appearance: { enabledAxes, persistence },
    },
  };

  if (options.dryRun) {
    log.info(`Would enable appearance axes: ${enabledAxes.join(', ') || 'none'}`);
    return 0;
  }

  const installCode = await uiAdd({
    cwd,
    components: ['appearance-provider'],
    yes: true,
    install: options.install,
    packageManager: options.packageManager,
    installRunner: options.installRunner,
  });
  if (installCode !== 0) return installCode;

  writeUiConfig(cwd, next);
  log.success(`Enabled appearance axes: ${enabledAxes.join(', ')}`);
  log.dim(`Configuration: ${UI_CONFIG_FILENAME}`);
  log.dim('Mount AppearanceScript in <head> and AppearanceProvider around your application.');
  return 0;
}

export interface UiAppearanceDisableOptions {
  cwd?: string;
  axis: string;
  dryRun?: boolean;
}

export async function uiAppearanceDisable(options: UiAppearanceDisableOptions): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  if (!isAxis(options.axis)) {
    log.error(`Unknown appearance axis: ${options.axis}`);
    return 1;
  }
  const config = loadConfigSafely(cwd);
  if (!config) {
    log.error(`${UI_CONFIG_FILENAME} not found; run "unisane-ui init" first`);
    return 1;
  }
  const enabledAxes = config.unisane.appearance.enabledAxes.filter((axis) => axis !== options.axis);
  if (options.dryRun) {
    log.info(`Would disable appearance axis: ${options.axis}`);
    return 0;
  }
  writeUiConfig(cwd, {
    ...config,
    unisane: {
      ...config.unisane,
      appearance: { ...config.unisane.appearance, enabledAxes },
    },
  });
  log.success(`Disabled appearance axis: ${options.axis}`);
  return 0;
}

export interface UiAppearanceListOptions {
  cwd?: string;
}

export async function uiAppearanceList(options: UiAppearanceListOptions = {}): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  const config = loadConfigSafely(cwd);
  if (!config) {
    log.error(`${UI_CONFIG_FILENAME} not found; run "unisane-ui init" first`);
    return 1;
  }
  log.info(`Enabled axes: ${config.unisane.appearance.enabledAxes.join(', ') || 'none'}`);
  log.info(`Persistence: ${config.unisane.appearance.persistence}`);
  const providerPath = path.join(
    cwd,
    existsSync(path.join(cwd, 'src')) ? 'src' : '.',
    'components',
    'ui',
    'appearance-provider.tsx',
  );
  log.info(`Local provider: ${existsSync(providerPath) ? 'installed' : 'not installed'}`);
  return 0;
}
