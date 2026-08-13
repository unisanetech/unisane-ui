import fse from 'fs-extra';
import path from 'node:path';
import { log, prompt } from '../cli-support.js';
import {
  getAllDependencies,
  getTargetFilePath,
  loadConfig,
  loadRegistry,
  registryItemsByName,
  resolveRegistryDir,
  transformImports,
} from './add-helpers.js';
import type { UiAddOptions } from './add-types.js';
import { FileTransaction } from './file-transaction.js';
import {
  buildInstallCommands,
  detectPackageManager,
  formatInstallCommand,
  INSTALL_MUTATION_FILES,
  runInstallCommands,
} from './package-manager.js';

const { existsSync, readFileSync, writeFileSync, mkdirSync } = fse;

export type { UiAddOptions } from './add-types.js';

interface PlannedFile {
  destination: string;
  displayPath: string;
  content: string;
}

function packageNameAndVersion(dependency: string): [string, string] {
  const separator = dependency.startsWith('@')
    ? dependency.indexOf('@', dependency.indexOf('/') + 1)
    : dependency.indexOf('@');
  if (separator <= 0) return [dependency, ''];
  return [dependency.slice(0, separator), dependency.slice(separator + 1)];
}

function missingPackages(cwd: string, requested: string[]): string[] {
  const packageJsonPath = path.join(cwd, 'package.json');
  const parsed = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as Record<string, unknown>;
  const declared = new Map<string, string>();
  for (const group of ['dependencies', 'devDependencies', 'peerDependencies']) {
    const entries = parsed[group];
    if (typeof entries !== 'object' || entries === null || Array.isArray(entries)) continue;
    for (const [name, version] of Object.entries(entries)) {
      if (typeof version === 'string') declared.set(name, version);
    }
  }
  return requested.filter((dependency) => {
    const [name, version] = packageNameAndVersion(dependency);
    return declared.get(name) !== version;
  });
}

function printInstallCommands(commands: ReturnType<typeof buildInstallCommands>): void {
  for (const command of commands) log.dim(`  ${formatInstallCommand(command)}`);
}

export async function uiAdd(options: UiAddOptions = {}): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  if (!existsSync(path.join(cwd, 'package.json'))) {
    log.error('package.json not found');
    return 1;
  }

  const registryDir = resolveRegistryDir();
  const registry = registryDir ? loadRegistry(registryDir) : null;
  if (!registry || !registryDir) {
    log.error('Registry not found');
    log.dim('Reinstall or rebuild @unisane/ui-cli so its generated registry is present.');
    return 1;
  }

  let config;
  try {
    config = loadConfig(cwd);
  } catch (error) {
    log.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
  if (!config) {
    log.error('components.json not found');
    log.dim('Run: unisane-ui init');
    return 1;
  }

  const items = registryItemsByName(registry);
  const availableComponents = registry.items
    .filter((item) => item.type === 'registry:ui')
    .map((item) => item.name)
    .sort();

  let selectedComponents: string[];
  if (options.all) {
    selectedComponents = availableComponents;
    log.info(`Adding all ${selectedComponents.length} components...`);
  } else if (options.components?.length) {
    const invalid = options.components.filter((name) => !items.has(name));
    if (invalid.length > 0) {
      log.error(`Unknown registry items: ${invalid.join(', ')}`);
      log.dim('Run: unisane-ui list');
      return 1;
    }
    selectedComponents = Array.from(new Set(options.components));
  } else {
    const selected = await prompt.multiselect<string>({
      message: 'Which components would you like to add?',
      choices: availableComponents.map((name) => {
        const item = items.get(name);
        return { title: item?.title ?? name, value: name, description: item?.description ?? '' };
      }),
    });
    if (!selected?.length) {
      log.warn('No components selected');
      return 0;
    }
    selectedComponents = selected;
  }

  const closure = getAllDependencies(selectedComponents, registry);
  closure.add('utils');
  const orderedItems = Array.from(closure).sort();

  if (!options.dryRun && !options.yes && !options.all) {
    log.newline();
    log.info('Registry items to add:');
    for (const name of orderedItems) {
      const suffix = selectedComponents.includes(name) ? '' : ' (dependency)';
      log.dim(`  ${items.get(name)?.title ?? name}${suffix}`);
    }
    if (!(await prompt.confirm({ message: 'Proceed?', initial: true }))) {
      log.warn('Cancelled');
      return 0;
    }
  }

  const planned: PlannedFile[] = [];
  const skipped: string[] = [];
  const targets = new Set<string>();
  try {
    for (const name of orderedItems) {
      const item = items.get(name);
      if (!item) throw new Error(`Registry dependency is missing: ${name}`);
      for (const file of item.files) {
        const destination = getTargetFilePath(file, config, cwd);
        const displayPath = path.relative(cwd, destination);
        if (targets.has(destination)) {
          throw new Error(`Registry items collide at ${displayPath}`);
        }
        targets.add(destination);
        if (existsSync(destination) && !options.overwrite) {
          skipped.push(displayPath);
          continue;
        }
        const content = transformImports(
          readFileSync(path.join(registryDir, file.path), 'utf8'),
          config,
        );
        planned.push({ destination, displayPath, content });
      }
    }
  } catch (error) {
    log.error(error instanceof Error ? error.message : String(error));
    return 1;
  }

  const dependencies = new Set<string>();
  const devDependencies = new Set<string>();
  for (const name of orderedItems) {
    const item = items.get(name);
    for (const dependency of item?.dependencies ?? []) dependencies.add(dependency);
    for (const dependency of item?.devDependencies ?? []) devDependencies.add(dependency);
  }
  const requestedDependencies = missingPackages(cwd, Array.from(dependencies).sort());
  const requestedDevDependencies = missingPackages(cwd, Array.from(devDependencies).sort());
  const packageManager = options.packageManager ?? detectPackageManager(cwd);
  const installCommands = buildInstallCommands(
    packageManager,
    requestedDependencies,
    requestedDevDependencies,
  );

  if (options.dryRun) {
    log.success('Dry run complete');
    for (const file of planned) log.dim(`  ${file.displayPath}`);
    printInstallCommands(installCommands);
    return 0;
  }

  const transaction = new FileTransaction([
    ...planned.map((file) => file.destination),
    ...INSTALL_MUTATION_FILES.map((file) => path.join(cwd, file)),
  ]);
  try {
    for (const file of planned) {
      mkdirSync(path.dirname(file.destination), { recursive: true });
      writeFileSync(file.destination, file.content);
    }

    if (installCommands.length > 0 && options.install !== false) {
      log.info(`Installing dependencies with ${packageManager}...`);
      const installed = await runInstallCommands(installCommands, cwd, options.installRunner);
      if (!installed) throw new Error('Package installation failed');
    } else if (installCommands.length > 0) {
      log.info('Install the required packages:');
      printInstallCommands(installCommands);
    }
  } catch (error) {
    transaction.rollback();
    log.error(error instanceof Error ? error.message : String(error));
    log.dim('Restored source, configuration, manifest, and lock files.');
    return 1;
  }

  log.success('Components installed');
  for (const file of planned) log.dim(`  ${file.displayPath}`);
  if (skipped.length > 0) {
    log.warn('Skipped existing files:');
    for (const file of skipped) log.dim(`  ${file}`);
    log.dim('Use --overwrite to replace them.');
  }
  return 0;
}
