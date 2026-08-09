import fse from 'fs-extra';
const { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } = fse;
import path from 'path';
import { log } from '../cli-support.js';
import { resolveRegistryDir } from './add-helpers.js';
import { readThemeAsset, replaceManagedThemeRegion, THEME_REGION_START } from './theme.js';
import { createDefaultUiConfig, readUiConfig, writeUiConfig } from './ui-config.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasNextDependency(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isRecord(value.dependencies) && typeof value.dependencies.next === 'string';
}

const DEFAULT_UTILS = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

export interface UiInitOptions {
  cwd?: string;
  force?: boolean;
  dryRun?: boolean;
  theme?: string;
}

export async function uiInit(options: UiInitOptions = {}): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  const themeName = options.theme ?? 'blue';
  const packageJsonPath = path.join(cwd, 'package.json');

  log.info('Initializing Unisane UI...');
  if (!existsSync(packageJsonPath)) {
    log.error('package.json not found');
    return 1;
  }

  const pkg: unknown = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  if (!hasNextDependency(pkg)) {
    log.warn('This does not appear to be a Next.js project');
  }

  const srcDir = existsSync(path.join(cwd, 'src')) ? path.join(cwd, 'src') : cwd;
  const appDir = path.join(srcDir, 'app');
  if (!existsSync(appDir)) {
    log.error('Could not find src/app or app');
    return 1;
  }

  const registryDir = resolveRegistryDir();
  if (!registryDir) {
    log.error('CLI-owned UI registry assets not found');
    return 1;
  }

  const baselinePath = path.join(registryDir, 'styles', 'globals.css');
  const themeCss = readThemeAsset(registryDir, themeName);
  const utilsPath = path.join(registryDir, 'lib', 'utils.ts');
  if (!existsSync(baselinePath) || !themeCss) {
    log.error(`UI baseline or theme asset not found for "${themeName}"`);
    return 1;
  }

  const globalsCssPath = path.join(appDir, 'globals.css');
  const libDir = path.join(srcDir, 'lib');
  const componentsUiDir = path.join(srcDir, 'components', 'ui');
  const existingGlobals = existsSync(globalsCssPath) ? readFileSync(globalsCssPath, 'utf8') : '';
  let existingUiConfig;
  try {
    existingUiConfig = readUiConfig(cwd);
  } catch (error) {
    if (!options.force) {
      log.error(error instanceof Error ? error.message : String(error));
      log.dim('Re-run with --force to replace the malformed UI configuration');
      return 1;
    }
  }
  let baseline = readFileSync(baselinePath, 'utf8');
  baseline = replaceManagedThemeRegion(baseline, themeCss);

  if (existingGlobals && !existingGlobals.includes(THEME_REGION_START) && !options.force) {
    log.error('globals.css already exists and is not managed by Unisane UI');
    log.dim('Re-run with --force to back it up and install the complete baseline');
    return 1;
  }

  if (options.dryRun) {
    log.info(`Would initialize one globals.css baseline with the ${themeName} theme`);
    log.dim(`  ${path.relative(cwd, globalsCssPath)}`);
    log.dim(`  ${path.relative(cwd, path.join(libDir, 'utils.ts'))}`);
    return 0;
  }

  mkdirSync(libDir, { recursive: true });
  mkdirSync(componentsUiDir, { recursive: true });

  if (existingGlobals && existingGlobals !== baseline && options.force) {
    writeFileSync(`${globalsCssPath}.backup`, existingGlobals);
  }
  if (!existingGlobals || options.force) {
    writeFileSync(globalsCssPath, baseline);
    log.success(`Installed the complete ${themeName} baseline in globals.css`);
  } else {
    const themedGlobals = replaceManagedThemeRegion(existingGlobals, themeCss);
    if (themedGlobals !== existingGlobals) {
      writeFileSync(`${globalsCssPath}.backup`, existingGlobals);
      writeFileSync(globalsCssPath, themedGlobals);
      log.success(`Updated the managed theme region to ${themeName}`);
    } else {
      log.info('globals.css already contains the requested managed Unisane baseline');
    }
  }

  if (existsSync(utilsPath)) {
    copyFileSync(utilsPath, path.join(libDir, 'utils.ts'));
  } else {
    writeFileSync(path.join(libDir, 'utils.ts'), DEFAULT_UTILS);
  }
  log.success('Created lib/utils.ts');
  writeUiConfig(
    cwd,
    existingUiConfig ? { ...existingUiConfig, theme: themeName } : createDefaultUiConfig(themeName),
    Boolean(existingUiConfig),
  );
  log.success('Created unisane-ui.json');

  log.newline();
  log.success('Unisane UI initialized');
  log.dim('Add components: unisane ui add button');
  log.dim('Change theme later: unisane ui theme green');
  return 0;
}
