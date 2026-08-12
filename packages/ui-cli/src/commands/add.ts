/**
 * @module commands/ui/add
 *
 * Add UI components to project (shadcn-style).
 */

import fse from 'fs-extra';
const { existsSync, readFileSync, writeFileSync, mkdirSync } = fse;
import path from 'path';
import { log, prompt } from '../cli-support.js';
import {
  getAllDependencies,
  getTargetFilePath,
  loadConfig,
  loadRegistry,
  resolveRegistryDir,
  transformImports,
} from './add-helpers.js';
import type { UiAddOptions } from './add-types.js';

export type { UiAddOptions } from './add-types.js';

export async function uiAdd(options: UiAddOptions = {}): Promise<number> {
  const cwd = options.cwd ?? process.cwd();

  const registryDir = resolveRegistryDir();
  const registry = registryDir ? loadRegistry(registryDir) : null;
  if (!registry || !registryDir) {
    log.error('Registry not found');
    log.dim('Reinstall or rebuild the Unisane CLI package so its UI registry assets are present.');
    return 1;
  }

  const config = loadConfig(cwd);

  const availableComponents = Object.entries(registry.components)
    .filter(([, meta]) => meta.type !== 'lib:util')
    .map(([key]) => key)
    .sort();

  let selectedComponents: string[] = [];

  if (options.all) {
    selectedComponents = availableComponents;
    log.info(`Adding all ${selectedComponents.length} components...`);
  } else if (options.components && options.components.length > 0) {
    const invalid = options.components.filter((name) => !registry.components[name]);
    if (invalid.length > 0) {
      log.error(`Unknown components: ${invalid.join(', ')}`);
      log.dim('Run: unisane ui add (to see available components)');
      return 1;
    }
    selectedComponents = options.components;
  } else {
    const choices = availableComponents.map((key) => {
      const comp = registry.components[key];
      return {
        title: comp?.name || key,
        value: key,
        description: comp?.description || '',
      };
    });

    const selected = await prompt.multiselect<string>({
      message: 'Which components would you like to add?',
      choices,
    });

    if (!selected || selected.length === 0) {
      log.warn('No components selected');
      return 0;
    }

    selectedComponents = selected;
  }

  const allComponents = getAllDependencies(selectedComponents, registry);
  allComponents.add('utils');

  const depsCount = allComponents.size - selectedComponents.length;
  if (depsCount > 0) {
    log.dim(`Resolving ${depsCount} dependencies...`);
  }

  if (!options.dryRun && !options.yes && !options.all) {
    const componentList = Array.from(allComponents).sort();
    log.newline();
    log.info('Components to add:');

    for (const comp of componentList) {
      const meta = registry.components[comp];
      const isSelected = selectedComponents.includes(comp);
      const prefix = isSelected ? '◉' : '○';
      const suffix = isSelected ? '' : ' (dependency)';
      log.dim(`  ${prefix} ${meta?.name || comp}${suffix}`);
    }

    const confirm = await prompt.confirm({ message: 'Proceed?', initial: true });
    if (!confirm) {
      log.warn('Cancelled');
      return 0;
    }
  }

  log.info(options.dryRun ? 'Previewing component install...' : 'Installing components...');

  const copied: string[] = [];
  const skipped: string[] = [];

  for (const comp of allComponents) {
    const meta = registry.components[comp];
    if (!meta) continue;

    for (const file of meta.files) {
      const srcFile = path.join(registryDir, file);
      const destFile = getTargetFilePath(file, meta.type, config, cwd);
      const displayPath = path.relative(cwd, destFile);

      if (!options.dryRun) {
        mkdirSync(path.dirname(destFile), { recursive: true });
      }

      if (existsSync(destFile) && !options.overwrite) {
        skipped.push(displayPath);
        continue;
      }

      try {
        let content = readFileSync(srcFile, 'utf-8');
        content = transformImports(content, config);
        if (!options.dryRun) {
          writeFileSync(destFile, content);
        }
        copied.push(displayPath);
      } catch {
        log.warn(`Could not copy ${file}`);
      }
    }
  }

  if (options.dryRun) {
    log.success('Dry run complete');
  } else {
    log.success('Components installed!');
  }

  if (copied.length > 0) {
    log.newline();
    log.info(options.dryRun ? 'Files that would be created:' : 'Created files:');
    for (const file of copied) {
      log.dim(`  ${file}`);
    }
  }

  if (skipped.length > 0) {
    log.newline();
    log.warn('Skipped existing files:');
    for (const file of skipped) {
      log.dim(`  ${file}`);
    }
    log.dim('Use --overwrite to replace existing files');
  }

  const npmDeps = new Set<string>();
  const npmDevDeps = new Set<string>();

  for (const comp of allComponents) {
    const meta = registry.components[comp];
    if (!meta) continue;
    for (const dep of meta.dependencies || []) npmDeps.add(dep);
    for (const dep of meta.devDependencies || []) npmDevDeps.add(dep);
  }

  if (npmDeps.size > 0 || npmDevDeps.size > 0) {
    log.newline();
    log.info('Required npm packages:');
    if (npmDeps.size > 0) {
      log.dim(`  pnpm add ${Array.from(npmDeps).join(' ')}`);
    }
    if (npmDevDeps.size > 0) {
      log.dim(`  pnpm add -D ${Array.from(npmDevDeps).join(' ')}`);
    }
  }

  return 0;
}
