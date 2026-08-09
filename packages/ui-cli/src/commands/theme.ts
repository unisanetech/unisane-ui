import fse from 'fs-extra';
const { existsSync, readFileSync, writeFileSync } = fse;
import path from 'path';
import { log } from '../cli-support.js';
import { resolveRegistryDir } from './add-helpers.js';
import { createDefaultUiConfig, readUiConfig, writeUiConfig } from './ui-config.js';

export const THEME_REGION_START = '/* unisane:theme:start */';
export const THEME_REGION_END = '/* unisane:theme:end */';

export function listThemeAssets(registryDir: string): string[] {
  const themesDir = path.join(registryDir, 'styles', 'themes');
  if (!existsSync(themesDir)) return [];
  return fse
    .readdirSync(themesDir)
    .filter((file) => file.endsWith('.css'))
    .map((file) => file.slice(0, -'.css'.length))
    .sort();
}

export function readThemeAsset(registryDir: string, themeName: string): string | null {
  const themePath = path.join(registryDir, 'styles', 'themes', `${themeName}.css`);
  return existsSync(themePath) ? readFileSync(themePath, 'utf8') : null;
}

export function replaceManagedThemeRegion(source: string, replacement: string): string {
  const start = source.indexOf(THEME_REGION_START);
  const end = source.indexOf(THEME_REGION_END);
  const hasDuplicateStart = source.indexOf(THEME_REGION_START, start + 1) >= 0;
  const hasDuplicateEnd = source.indexOf(THEME_REGION_END, end + 1) >= 0;

  if (start < 0 || end < start || hasDuplicateStart || hasDuplicateEnd) {
    throw new Error('globals.css does not contain one valid Unisane managed theme region');
  }
  if (!replacement.includes(THEME_REGION_START) || !replacement.includes(THEME_REGION_END)) {
    throw new Error('Theme asset is missing managed region markers');
  }

  return `${source.slice(0, start)}${replacement.trim()}${source.slice(end + THEME_REGION_END.length)}`;
}

export interface UiThemeOptions {
  cwd?: string;
  theme: string;
  dryRun?: boolean;
}

export async function uiTheme(options: UiThemeOptions): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  const registryDir = resolveRegistryDir();
  if (!registryDir) {
    log.error('CLI-owned UI registry assets not found');
    return 1;
  }

  const availableThemes = listThemeAssets(registryDir);
  const themeCss = readThemeAsset(registryDir, options.theme);
  if (!themeCss) {
    log.error(`Unknown UI theme: ${options.theme}`);
    log.dim(`Available themes: ${availableThemes.join(', ')}`);
    return 1;
  }

  let uiConfig;
  try {
    uiConfig = readUiConfig(cwd) ?? createDefaultUiConfig();
  } catch (error) {
    log.error(error instanceof Error ? error.message : String(error));
    return 1;
  }

  const srcDir = existsSync(path.join(cwd, 'src')) ? path.join(cwd, 'src') : cwd;
  const globalsCssPath = path.join(srcDir, 'app', 'globals.css');
  if (!existsSync(globalsCssPath)) {
    log.error('globals.css not found; run "unisane ui init" first');
    return 1;
  }

  const current = readFileSync(globalsCssPath, 'utf8');
  let next: string;
  try {
    next = replaceManagedThemeRegion(current, themeCss);
  } catch (error) {
    log.error(error instanceof Error ? error.message : String(error));
    log.dim('Run "unisane ui init --force" to restore the managed baseline');
    return 1;
  }

  if (next === current) {
    if (!options.dryRun && uiConfig.theme !== options.theme) {
      writeUiConfig(cwd, { ...uiConfig, theme: options.theme });
    }
    log.info(`Theme is already ${options.theme}`);
    return 0;
  }
  if (options.dryRun) {
    log.info(`Would replace the managed theme region with ${options.theme}`);
    return 0;
  }

  writeFileSync(`${globalsCssPath}.backup`, current);
  writeFileSync(globalsCssPath, next);
  writeUiConfig(cwd, { ...uiConfig, theme: options.theme });
  log.success(`Theme changed to ${options.theme}`);
  log.dim(`Backup: ${path.relative(cwd, `${globalsCssPath}.backup`)}`);
  return 0;
}
