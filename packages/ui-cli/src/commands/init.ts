import fse from 'fs-extra';
import path from 'node:path';
import { log } from '../cli-support.js';
import {
  getAllDependencies,
  getTargetFilePath,
  loadRegistry,
  registryItemsByName,
  resolveRegistryDir,
} from './add-helpers.js';
import type { PackageInstallRunner, PackageManager } from './add-types.js';
import { uiAdd } from './add.js';
import { FileTransaction } from './file-transaction.js';
import {
  buildInstallCommands,
  detectPackageManager,
  formatInstallCommand,
  INSTALL_MUTATION_FILES,
  runInstallCommands,
} from './package-manager.js';
import { readThemeAsset, replaceManagedThemeRegion, THEME_REGION_START } from './theme.js';
import {
  createDefaultUiConfig,
  readUiConfig,
  UI_CONFIG_FILENAME,
  writeUiConfig,
} from './ui-config.js';

const { existsSync, readFileSync, writeFileSync, mkdirSync } = fse;
const TAILWIND_VERSION = '4.1.18';
const POSTCSS_ADAPTER = '@tailwindcss/postcss';
const POSTCSS_CONFIG_FILENAMES = [
  'postcss.config.mjs',
  'postcss.config.js',
  'postcss.config.cjs',
] as const;
const POSTCSS_CONFIG = `export default {
  plugins: {
    '${POSTCSS_ADAPTER}': {},
  },
};
`;

interface PackageJsonLike {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface UiInitOptions {
  cwd?: string;
  force?: boolean;
  dryRun?: boolean;
  theme?: string;
  install?: boolean;
  packageManager?: PackageManager;
  installRunner?: PackageInstallRunner;
}

function detectProject(cwd: string, pkg: PackageJsonLike) {
  const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
  const hasSrc = existsSync(path.join(cwd, 'src'));
  const prefix = hasSrc ? 'src/' : '';
  if (dependencies.next) {
    return { name: 'Next.js', rsc: true, hasSrc, cssPath: `${prefix}app/globals.css` };
  }
  if (dependencies.vite) {
    return { name: 'Vite', rsc: false, hasSrc, cssPath: `${prefix}index.css` };
  }
  return { name: 'React', rsc: false, hasSrc, cssPath: `${prefix}index.css` };
}

function mergeBaseline(existing: string, baseline: string, force: boolean): string {
  if (!existing) return `${baseline.trim()}\n`;
  if (existing.includes(THEME_REGION_START)) return replaceManagedThemeRegion(existing, baseline);
  if (force) return `${baseline.trim()}\n`;
  return `${baseline.trim()}\n\n${existing.trim()}\n`;
}

function resolvePostcssConfig(cwd: string): { path: string; create: boolean } {
  const existing = POSTCSS_CONFIG_FILENAMES.find((filename) =>
    existsSync(path.join(cwd, filename)),
  );
  if (!existing) return { path: path.join(cwd, POSTCSS_CONFIG_FILENAMES[0]), create: true };
  const existingPath = path.join(cwd, existing);
  if (!readFileSync(existingPath, 'utf8').includes(POSTCSS_ADAPTER)) {
    throw new Error(`${existing} must configure ${POSTCSS_ADAPTER} before Unisane UI init`);
  }
  return { path: existingPath, create: false };
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

  let pkg: PackageJsonLike;
  try {
    pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as PackageJsonLike;
  } catch {
    log.error('package.json is not valid JSON');
    return 1;
  }
  const project = detectProject(cwd, pkg);
  let postcssConfig;
  try {
    postcssConfig = resolvePostcssConfig(cwd);
  } catch (error) {
    log.error(error instanceof Error ? error.message : String(error));
    return 1;
  }

  const registryDir = resolveRegistryDir();
  const registry = registryDir ? loadRegistry(registryDir) : null;
  if (!registryDir || !registry) {
    log.error('CLI-owned generated registry assets not found');
    return 1;
  }

  const baselinePath = path.join(registryDir, 'styles', 'globals.css');
  const themeCss = readThemeAsset(registryDir, themeName);
  if (!existsSync(baselinePath) || !themeCss) {
    log.error(`UI baseline or theme asset not found for "${themeName}"`);
    return 1;
  }

  let existingConfig;
  try {
    existingConfig = readUiConfig(cwd);
  } catch (error) {
    if (!options.force) {
      log.error(error instanceof Error ? error.message : String(error));
      log.dim('Re-run with --force to replace the malformed components.json');
      return 1;
    }
  }

  const defaultConfig = createDefaultUiConfig(themeName, {
    cssPath: project.cssPath,
    rsc: project.rsc,
    hasSrc: project.hasSrc,
  });
  const config = existingConfig
    ? {
        ...existingConfig,
        unisane: { ...existingConfig.unisane, theme: themeName },
      }
    : defaultConfig;
  const cssPath = path.resolve(cwd, config.tailwind.css);
  const existingCss = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : '';
  const themedBaseline = replaceManagedThemeRegion(readFileSync(baselinePath, 'utf8'), themeCss);
  const nextCss = mergeBaseline(existingCss, themedBaseline, Boolean(options.force));

  const items = registryItemsByName(registry);
  const utilityClosure = getAllDependencies(['utils'], registry);
  const utilityTargets: string[] = [];
  for (const name of utilityClosure) {
    const item = items.get(name);
    if (!item) {
      log.error(`Registry dependency is missing: ${name}`);
      return 1;
    }
    for (const file of item.files) utilityTargets.push(getTargetFilePath(file, config, cwd));
  }

  const manager = options.packageManager ?? detectPackageManager(cwd);
  const declaredTailwind = pkg.dependencies?.tailwindcss ?? pkg.devDependencies?.tailwindcss;
  const declaredPostcssAdapter =
    pkg.dependencies?.[POSTCSS_ADAPTER] ?? pkg.devDependencies?.[POSTCSS_ADAPTER];
  const requiredDevelopmentDependencies = [
    ...(declaredTailwind === TAILWIND_VERSION ? [] : [`tailwindcss@${TAILWIND_VERSION}`]),
    ...(declaredPostcssAdapter === TAILWIND_VERSION
      ? []
      : [`${POSTCSS_ADAPTER}@${TAILWIND_VERSION}`]),
  ];
  const tailwindCommands = buildInstallCommands(manager, [], requiredDevelopmentDependencies);
  if (options.dryRun) {
    log.info(`Detected ${project.name} with ${manager}`);
    log.dim(`  ${path.relative(cwd, cssPath)}`);
    log.dim(`  ${UI_CONFIG_FILENAME}`);
    if (postcssConfig.create) log.dim(`  ${path.relative(cwd, postcssConfig.path)}`);
    for (const target of utilityTargets) log.dim(`  ${path.relative(cwd, target)}`);
    if (options.install !== false) {
      for (const command of tailwindCommands) {
        log.dim(`  ${formatInstallCommand(command)}`);
      }
    }
    return 0;
  }

  const transaction = new FileTransaction([
    path.join(cwd, UI_CONFIG_FILENAME),
    cssPath,
    ...(postcssConfig.create ? [postcssConfig.path] : []),
    ...utilityTargets,
    ...INSTALL_MUTATION_FILES.map((file) => path.join(cwd, file)),
  ]);

  try {
    mkdirSync(path.dirname(cssPath), { recursive: true });
    writeFileSync(cssPath, nextCss);
    if (postcssConfig.create) writeFileSync(postcssConfig.path, POSTCSS_CONFIG);
    writeUiConfig(cwd, config);

    const utilityCode = await uiAdd({
      cwd,
      components: ['utils'],
      overwrite: options.force,
      yes: true,
      install: options.install,
      packageManager: manager,
      installRunner: options.installRunner,
    });
    if (utilityCode !== 0) throw new Error('Could not install the registry utility closure');

    if (options.install !== false) {
      if (!(await runInstallCommands(tailwindCommands, cwd, options.installRunner))) {
        throw new Error('Tailwind CSS installation failed');
      }
    } else {
      log.info('Install the remaining development dependency:');
      for (const command of tailwindCommands) log.dim(`  ${formatInstallCommand(command)}`);
    }
  } catch (error) {
    transaction.rollback();
    log.error(error instanceof Error ? error.message : String(error));
    log.dim('Restored source, configuration, manifest, and lock files.');
    return 1;
  }

  log.success(`Initialized ${project.name} with ${UI_CONFIG_FILENAME}`);
  log.dim('Add components: unisane-ui add button');
  log.dim('Browse the registry: unisane-ui list');
  return 0;
}
