import { log } from '../cli-support.js';
import { loadRegistry, resolveRegistryDir } from './add-helpers.js';
import type { Registry, RegistryItem } from './add-types.js';

function loadCatalog(): Registry | null {
  const registryDir = resolveRegistryDir();
  return registryDir ? loadRegistry(registryDir) : null;
}

function printItems(items: RegistryItem[], json: boolean): void {
  if (json) {
    process.stdout.write(`${JSON.stringify(items, null, 2)}\n`);
    return;
  }
  for (const item of items) {
    log.info(item.name);
    log.dim(`  ${item.description} [${item.type}]`);
  }
}

export interface CatalogOptions {
  json?: boolean;
}

export async function uiList(options: CatalogOptions = {}): Promise<number> {
  const registry = loadCatalog();
  if (!registry) {
    log.error('Generated registry catalog not found');
    return 1;
  }
  printItems(registry.items, Boolean(options.json));
  return 0;
}

export async function uiSearch(query: string, options: CatalogOptions = {}): Promise<number> {
  const registry = loadCatalog();
  if (!registry) {
    log.error('Generated registry catalog not found');
    return 1;
  }
  const terms = query
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/u)
    .filter(Boolean);
  const matches = registry.items.filter((item) => {
    const haystack = [item.name, item.title, item.description, item.type]
      .join(' ')
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/gu, ' ');
    return terms.every((term) => haystack.includes(term));
  });
  printItems(matches, Boolean(options.json));
  return matches.length > 0 ? 0 : 1;
}

export async function uiView(name: string, options: CatalogOptions = {}): Promise<number> {
  const registry = loadCatalog();
  if (!registry) {
    log.error('Generated registry catalog not found');
    return 1;
  }
  const item = registry.items.find((candidate) => candidate.name === name);
  if (!item) {
    log.error(`Unknown registry item: ${name}`);
    return 1;
  }
  if (options.json) {
    process.stdout.write(`${JSON.stringify(item, null, 2)}\n`);
    return 0;
  }
  log.info(`${item.title} (${item.name})`);
  log.dim(item.description);
  log.dim(`Type: ${item.type}`);
  log.dim(`Files: ${item.files.map((file) => file.target).join(', ')}`);
  log.dim(`Registry dependencies: ${item.registryDependencies.join(', ') || 'none'}`);
  log.dim(`Packages: ${item.dependencies.join(', ') || 'none'}`);
  return 0;
}
