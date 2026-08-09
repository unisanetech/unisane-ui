/**
 * @module commands/ui/doctor
 *
 * Health check for Unisane UI installation.
 */

import fse from 'fs-extra';
const { existsSync, readFileSync } = fse;
import path from 'path';
import { log } from '../cli-support.js';
import { resolveRegistryDir } from './add-helpers.js';
import { THEME_REGION_END, THEME_REGION_START, listThemeAssets } from './theme.js';
import { readUiConfig, UI_CONFIG_FILENAME } from './ui-config.js';

// ════════════════════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════════════════════

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  fix?: string;
}

interface PackageJsonLike {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toStringMap(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {};
  const result: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === 'string') {
      result[key] = entry;
    }
  }
  return result;
}

function parsePackageJson(raw: string): PackageJsonLike {
  const parsed: unknown = JSON.parse(raw);
  if (!isRecord(parsed)) {
    return { dependencies: {}, devDependencies: {} };
  }
  return {
    dependencies: toStringMap(parsed.dependencies),
    devDependencies: toStringMap(parsed.devDependencies),
  };
}

// ════════════════════════════════════════════════════════════════════════════
// Main
// ════════════════════════════════════════════════════════════════════════════

export interface UiDoctorOptions {
  cwd?: string;
}

export async function uiDoctor(options: UiDoctorOptions = {}): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  const results: CheckResult[] = [];

  log.banner('UI Doctor');
  log.info('Checking Unisane UI installation...');
  log.newline();

  // Check 1: package.json
  const packageJsonPath = path.join(cwd, 'package.json');
  if (!existsSync(packageJsonPath)) {
    log.error('Not in a project directory');
    return 1;
  }

  const pkg = parsePackageJson(readFileSync(packageJsonPath, 'utf8'));

  // Check 2: Next.js
  if (pkg.dependencies?.next) {
    results.push({
      name: 'Next.js',
      status: 'pass',
      message: `Found Next.js ${pkg.dependencies.next}`,
    });
  } else {
    results.push({
      name: 'Next.js',
      status: 'fail',
      message: 'Not a Next.js project',
      fix: 'Unisane UI requires Next.js',
    });
  }

  // Check 3: Tailwind CSS v4
  const tailwindVersion = pkg.dependencies?.tailwindcss || pkg.devDependencies?.tailwindcss;
  if (tailwindVersion) {
    if (tailwindVersion.startsWith('^4') || tailwindVersion.startsWith('4')) {
      results.push({
        name: 'Tailwind CSS',
        status: 'pass',
        message: `Found Tailwind CSS v4 (${tailwindVersion})`,
      });
    } else {
      results.push({
        name: 'Tailwind CSS',
        status: 'warn',
        message: `Found Tailwind CSS ${tailwindVersion} (v4 recommended)`,
        fix: 'pnpm add tailwindcss@^4',
      });
    }
  } else {
    results.push({
      name: 'Tailwind CSS',
      status: 'fail',
      message: 'Tailwind CSS not found',
      fix: 'pnpm add tailwindcss@^4',
    });
  }

  // Check 4: CLI-owned registry assets and replace-in-place themes
  const registryDir = resolveRegistryDir();
  if (registryDir && listThemeAssets(registryDir).length > 0) {
    results.push({
      name: 'UI Registry',
      status: 'pass',
      message: 'Complete baseline and theme assets found',
    });
  } else {
    results.push({
      name: 'UI Registry',
      status: 'fail',
      message: 'CLI-owned registry assets not found',
      fix: 'Reinstall or rebuild the Unisane CLI package',
    });
  }

  // Check 5: one complete globals.css baseline
  const hasSrc = existsSync(path.join(cwd, 'src'));
  const srcDir = hasSrc ? path.join(cwd, 'src') : cwd;
  const globalsCssPath = path.join(srcDir, 'app', 'globals.css');
  if (existsSync(globalsCssPath)) {
    const globalsContent = readFileSync(globalsCssPath, 'utf-8');
    if (
      globalsContent.includes(THEME_REGION_START) &&
      globalsContent.includes(THEME_REGION_END) &&
      globalsContent.includes('@import "tailwindcss"')
    ) {
      results.push({
        name: 'CSS Baseline',
        status: 'pass',
        message: 'One managed globals.css baseline configured',
      });
    } else {
      results.push({
        name: 'CSS Baseline',
        status: 'fail',
        message: 'globals.css is missing the complete managed baseline',
        fix: 'unisane ui init --force',
      });
    }
  } else {
    results.push({
      name: 'CSS Baseline',
      status: 'warn',
      message: 'globals.css not found',
    });
  }

  // Check 7: Required dependencies
  const requiredDeps = ['class-variance-authority', 'clsx', 'tailwind-merge'];
  const missingDeps = requiredDeps.filter(
    (dep) => !pkg.dependencies?.[dep] && !pkg.devDependencies?.[dep],
  );

  if (missingDeps.length === 0) {
    results.push({
      name: 'Dependencies',
      status: 'pass',
      message: 'All required dependencies installed',
    });
  } else {
    results.push({
      name: 'Dependencies',
      status: 'fail',
      message: `Missing: ${missingDeps.join(', ')}`,
      fix: `pnpm add ${missingDeps.join(' ')}`,
    });
  }

  // Check 8: utils.ts
  const utilsPath = path.join(srcDir, 'lib', 'utils.ts');
  if (existsSync(utilsPath)) {
    results.push({
      name: 'Utils',
      status: 'pass',
      message: 'lib/utils.ts found',
    });
  } else {
    results.push({
      name: 'Utils',
      status: 'fail',
      message: 'lib/utils.ts not found',
      fix: 'unisane ui init',
    });
  }

  // Check 9: generated UI project configuration and optional appearance capability
  try {
    const uiConfig = readUiConfig(cwd);
    if (!uiConfig) {
      results.push({
        name: 'UI Configuration',
        status: 'warn',
        message: `${UI_CONFIG_FILENAME} not found`,
        fix: 'unisane ui init',
      });
    } else if (uiConfig.appearance.enabledAxes.length === 0) {
      results.push({
        name: 'UI Configuration',
        status: 'pass',
        message: `Theme ${uiConfig.theme}; runtime appearance disabled`,
      });
    } else {
      const providerPath = path.join(srcDir, 'components', 'ui', 'appearance-provider.tsx');
      results.push({
        name: 'UI Configuration',
        status: existsSync(providerPath) ? 'pass' : 'fail',
        message: `Appearance axes: ${uiConfig.appearance.enabledAxes.join(', ')}`,
        fix: existsSync(providerPath)
          ? undefined
          : `unisane ui appearance enable --axes ${uiConfig.appearance.enabledAxes.join(',')}`,
      });
    }
  } catch (error) {
    results.push({
      name: 'UI Configuration',
      status: 'fail',
      message: error instanceof Error ? error.message : String(error),
      fix: 'Repair or recreate unisane-ui.json',
    });
  }

  // Display results
  for (const result of results) {
    if (result.status === 'pass') {
      log.success(`${result.name}: ${result.message}`);
    } else if (result.status === 'warn') {
      log.warn(`${result.name}: ${result.message}`);
    } else {
      log.error(`${result.name}: ${result.message}`);
    }

    if (result.fix) {
      log.dim(`  Fix: ${result.fix}`);
    }
  }

  // Summary
  const passCount = results.filter((r) => r.status === 'pass').length;
  const failCount = results.filter((r) => r.status === 'fail').length;
  const warnCount = results.filter((r) => r.status === 'warn').length;

  log.newline();
  log.info(`Summary: ${passCount} passed, ${failCount} failed, ${warnCount} warnings`);

  if (failCount > 0) {
    log.newline();
    log.info('Run "unisane ui init" to fix most issues');
    return 1;
  }

  log.newline();
  log.success('Unisane UI installation looks good!');
  return 0;
}
