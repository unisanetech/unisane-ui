import fse from 'fs-extra';
import path from 'node:path';
import { log } from '../cli-support.js';
import { getTargetFilePath, resolveRegistryDir } from './add-helpers.js';
import { THEME_REGION_END, THEME_REGION_START, listThemeAssets } from './theme.js';
import { readUiConfig, UI_CONFIG_FILENAME } from './ui-config.js';

const { existsSync, readFileSync } = fse;

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  fix?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toStringMap(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  );
}

export interface UiDoctorOptions {
  cwd?: string;
}

export async function uiDoctor(options: UiDoctorOptions = {}): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  const packageJsonPath = path.join(cwd, 'package.json');
  if (!existsSync(packageJsonPath)) {
    log.error('package.json not found');
    return 1;
  }

  let parsedPackage: unknown;
  try {
    parsedPackage = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  } catch {
    log.error('package.json is not valid JSON');
    return 1;
  }
  const packageRecord = isRecord(parsedPackage) ? parsedPackage : {};
  const dependencies = {
    ...toStringMap(packageRecord.dependencies),
    ...toStringMap(packageRecord.devDependencies),
  };
  const results: CheckResult[] = [];

  if (dependencies.next) {
    results.push({ name: 'Framework', status: 'pass', message: `Next.js ${dependencies.next}` });
  } else if (dependencies.vite) {
    results.push({ name: 'Framework', status: 'pass', message: `Vite ${dependencies.vite}` });
  } else if (dependencies.react) {
    results.push({ name: 'Framework', status: 'warn', message: 'Generic React project' });
  } else {
    results.push({ name: 'Framework', status: 'fail', message: 'React was not found' });
  }

  const tailwind = dependencies.tailwindcss;
  results.push(
    tailwind
      ? { name: 'Tailwind CSS', status: 'pass', message: tailwind }
      : {
          name: 'Tailwind CSS',
          status: 'fail',
          message: 'Not installed',
          fix: 'Run unisane-ui init',
        },
  );

  const registryDir = resolveRegistryDir();
  results.push(
    registryDir && listThemeAssets(registryDir).length > 0
      ? { name: 'Registry', status: 'pass', message: 'Generated catalog and themes found' }
      : {
          name: 'Registry',
          status: 'fail',
          message: 'Generated catalog assets are missing',
          fix: 'Reinstall @unisane/ui-cli',
        },
  );

  let config;
  try {
    config = readUiConfig(cwd);
    results.push(
      config
        ? { name: 'Configuration', status: 'pass', message: UI_CONFIG_FILENAME }
        : {
            name: 'Configuration',
            status: 'fail',
            message: `${UI_CONFIG_FILENAME} not found`,
            fix: 'Run unisane-ui init',
          },
    );
  } catch (error) {
    results.push({
      name: 'Configuration',
      status: 'fail',
      message: error instanceof Error ? error.message : String(error),
      fix: 'Repair components.json or run unisane-ui init --force',
    });
  }

  if (config) {
    const cssPath = path.resolve(cwd, config.tailwind.css);
    const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : '';
    results.push(
      css.includes(THEME_REGION_START) && css.includes(THEME_REGION_END)
        ? { name: 'CSS baseline', status: 'pass', message: path.relative(cwd, cssPath) }
        : {
            name: 'CSS baseline',
            status: 'fail',
            message: 'Managed theme region is missing',
            fix: 'Run unisane-ui init',
          },
    );

    const utilsPath = getTargetFilePath(
      { path: 'lib/utils.ts', type: 'registry:lib', target: 'lib/utils.ts' },
      config,
      cwd,
    );
    results.push(
      existsSync(utilsPath)
        ? { name: 'Utilities', status: 'pass', message: path.relative(cwd, utilsPath) }
        : {
            name: 'Utilities',
            status: 'fail',
            message: 'Registry utilities are missing',
            fix: 'Run unisane-ui init',
          },
    );

    const missing = ['clsx', 'tailwind-merge'].filter((name) => !dependencies[name]);
    results.push(
      missing.length === 0
        ? { name: 'Dependencies', status: 'pass', message: 'Registry baseline is installed' }
        : {
            name: 'Dependencies',
            status: 'fail',
            message: `Missing ${missing.join(', ')}`,
            fix: 'Run unisane-ui init',
          },
    );

    if (config.unisane.appearance.enabledAxes.length > 0) {
      const providerPath = getTargetFilePath(
        {
          path: 'layout/appearance-provider.tsx',
          type: 'registry:ui',
          target: 'components/ui/appearance-provider.tsx',
        },
        config,
        cwd,
      );
      results.push({
        name: 'Appearance',
        status: existsSync(providerPath) ? 'pass' : 'fail',
        message: config.unisane.appearance.enabledAxes.join(', '),
        fix: existsSync(providerPath)
          ? undefined
          : `unisane-ui appearance enable --axes ${config.unisane.appearance.enabledAxes.join(',')}`,
      });
    }
  }

  log.banner('UI Doctor');
  for (const result of results) {
    if (result.status === 'pass') log.success(`${result.name}: ${result.message}`);
    if (result.status === 'warn') log.warn(`${result.name}: ${result.message}`);
    if (result.status === 'fail') log.error(`${result.name}: ${result.message}`);
    if (result.fix) log.dim(`  Fix: ${result.fix}`);
  }

  const failures = results.filter((result) => result.status === 'fail').length;
  const warnings = results.filter((result) => result.status === 'warn').length;
  log.info(
    `${results.length - failures - warnings} passed, ${failures} failed, ${warnings} warnings`,
  );
  return failures === 0 ? 0 : 1;
}
