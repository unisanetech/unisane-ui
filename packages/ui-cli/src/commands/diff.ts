/**
 * @module commands/ui/diff
 *
 * Check for component updates.
 */

import fse from 'fs-extra';
const { existsSync, readFileSync } = fse;
import path from 'path';
import { log } from '../cli-support.js';
import {
  getTargetFilePath,
  loadConfig,
  loadRegistry,
  resolveRegistryDir,
  transformImports,
} from './add-helpers.js';

// ════════════════════════════════════════════════════════════════════════════
// Main
// ════════════════════════════════════════════════════════════════════════════

export interface UiDiffOptions {
  cwd?: string;
  component?: string;
}

export async function uiDiff(options: UiDiffOptions = {}): Promise<number> {
  const cwd = options.cwd ?? process.cwd();

  const registryDir = resolveRegistryDir();
  const registry = registryDir ? loadRegistry(registryDir) : null;
  if (!registry || !registryDir) {
    log.error('Registry not found');
    log.dim('Reinstall or rebuild the Unisane CLI package so its UI registry assets are present.');
    return 1;
  }
  const config = loadConfig(cwd);

  const componentsToCheck: string[] = [];

  if (options.component) {
    if (!registry.components[options.component]) {
      log.error(`Unknown component: ${options.component}`);
      return 1;
    }
    componentsToCheck.push(options.component);
  } else {
    // Find all installed components
    for (const [key, meta] of Object.entries(registry.components)) {
      const firstFile = meta.files[0];
      if (!firstFile) continue;
      const localPath = getTargetFilePath(firstFile, meta.type, config, cwd);

      if (existsSync(localPath)) {
        componentsToCheck.push(key);
      }
    }
  }

  if (componentsToCheck.length === 0) {
    log.warn('No components found to check');
    log.dim('Run: unisane ui add <component>');
    return 0;
  }

  log.info(`Checking ${componentsToCheck.length} component(s) for updates...`);
  log.newline();

  let hasChanges = false;
  let upToDate = 0;

  for (const comp of componentsToCheck) {
    const meta = registry.components[comp];
    if (!meta) continue;

    for (const file of meta.files) {
      const localPath = getTargetFilePath(file, meta.type, config, cwd);
      const registryFilePath = path.join(registryDir, file);

      if (!existsSync(localPath)) continue;

      try {
        const localContent = readFileSync(localPath, 'utf-8');
        const registryContent = readFileSync(registryFilePath, 'utf-8');
        const normalizedRegistry = transformImports(registryContent, config);

        if (localContent !== normalizedRegistry) {
          hasChanges = true;

          // Simple diff counting
          const localLines = localContent.split('\n').length;
          const registryLines = normalizedRegistry.split('\n').length;
          const diff = Math.abs(localLines - registryLines);

          log.warn(`${meta.name}`);
          log.dim(`  ${path.relative(cwd, localPath)}`);
          log.dim(`  ~${diff} line(s) different`);
        } else {
          upToDate++;
        }
      } catch {
        // Skip files that can't be read
      }
    }
  }

  log.newline();

  if (!hasChanges) {
    log.success(`All ${upToDate} component(s) are up to date!`);
  } else {
    log.info('To update components:');
    log.dim('  unisane ui add <component> --overwrite');
    log.dim('  unisane ui add --all --overwrite');
  }

  return 0;
}
