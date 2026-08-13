import fse from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Registry, RegistryFile, RegistryItem, RegistryItemType } from './add-types.js';
import { readUiConfig, type UiProjectConfig } from './ui-config.js';

const { existsSync, readFileSync } = fse;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function isRegistryItemType(value: unknown): value is RegistryItemType {
  return (
    value === 'registry:ui' ||
    value === 'registry:lib' ||
    value === 'registry:hook' ||
    value === 'registry:file'
  );
}

function isSafeRelativePath(value: string): boolean {
  return (
    value.length > 0 &&
    !value.includes('\\') &&
    !path.posix.isAbsolute(value) &&
    path.posix.normalize(value) === value &&
    value !== '..' &&
    !value.startsWith('../')
  );
}

function isRegistryFile(value: unknown): value is RegistryFile {
  return (
    isRecord(value) &&
    typeof value.path === 'string' &&
    isSafeRelativePath(value.path) &&
    isRegistryItemType(value.type) &&
    typeof value.target === 'string' &&
    isSafeRelativePath(value.target) &&
    /^(?:components\/ui|lib|hooks|types)\//u.test(value.target)
  );
}

function isRegistryItem(value: unknown): value is RegistryItem {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    /^[a-z0-9][a-z0-9-]*$/u.test(value.name) &&
    isRegistryItemType(value.type) &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    Array.isArray(value.files) &&
    value.files.every(isRegistryFile) &&
    isStringArray(value.dependencies) &&
    isStringArray(value.registryDependencies) &&
    (value.devDependencies === undefined || isStringArray(value.devDependencies))
  );
}

function isRegistry(value: unknown): value is Registry {
  return (
    isRecord(value) &&
    typeof value.$schema === 'string' &&
    typeof value.name === 'string' &&
    typeof value.homepage === 'string' &&
    Array.isArray(value.items) &&
    value.items.every(isRegistryItem) &&
    new Set(value.items.map((item) => item.name)).size === value.items.length
  );
}

export function resolveRegistryDir(): string | null {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(moduleDir, '..', 'ui-registry'),
    process.env.NODE_ENV === 'test' ? process.env.UNISANE_UI_REGISTRY_DIR : undefined,
  ].filter((candidate): candidate is string => Boolean(candidate));

  return candidates.find((candidate) => existsSync(path.join(candidate, 'registry.json'))) ?? null;
}

export function loadRegistry(registryDir: string): Registry | null {
  const registryPath = path.join(registryDir, 'registry.json');
  if (!existsSync(registryPath)) return null;

  try {
    const parsed: unknown = JSON.parse(readFileSync(registryPath, 'utf8'));
    return isRegistry(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function registryItemsByName(registry: Registry): Map<string, RegistryItem> {
  return new Map(registry.items.map((item) => [item.name, item]));
}

export function loadConfig(cwd: string): UiProjectConfig | null {
  return readUiConfig(cwd);
}

export function getAllDependencies(
  itemNames: string[],
  registry: Registry,
  visited = new Set<string>(),
): Set<string> {
  const items = registryItemsByName(registry);
  for (const name of itemNames) {
    if (visited.has(name)) continue;
    const item = items.get(name);
    if (!item) continue;

    visited.add(name);
    for (const dependency of item.registryDependencies) {
      getAllDependencies([dependency], registry, visited);
    }
  }
  return visited;
}

function aliasDirectory(alias: string, config: UiProjectConfig, cwd: string): string {
  const hasSrc =
    existsSync(path.join(cwd, 'src')) ||
    config.tailwind.css.replaceAll('\\', '/').startsWith('src/');
  const base = hasSrc ? path.join(cwd, 'src') : cwd;

  if (alias.startsWith('@/') || alias.startsWith('~/')) {
    return path.join(base, alias.slice(2));
  }
  if (alias.startsWith('./') || alias.startsWith('../')) {
    return path.resolve(cwd, alias);
  }
  if (alias.startsWith('@')) {
    const segments = alias.split('/').slice(2);
    if (segments.length > 0) return path.join(base, ...segments);
  }
  throw new Error(`components.json alias must resolve to a project-owned path: ${alias}`);
}

function targetOwner(target: string): 'ui' | 'lib' | 'hooks' | 'types' {
  if (target.startsWith('components/ui/')) return 'ui';
  if (target.startsWith('lib/')) return 'lib';
  if (target.startsWith('hooks/')) return 'hooks';
  if (target.startsWith('types/')) return 'types';
  throw new Error(`Registry file has an unsupported target: ${target}`);
}

export function getTargetFilePath(
  file: RegistryFile,
  config: UiProjectConfig,
  cwd: string,
): string {
  const owner = targetOwner(file.target);
  const prefix = owner === 'ui' ? 'components/ui/' : `${owner}/`;
  const relative = file.target.slice(prefix.length);
  if (!relative || relative.startsWith('../') || path.isAbsolute(relative)) {
    throw new Error(`Registry file has an unsafe target: ${file.target}`);
  }
  return path.join(aliasDirectory(config.aliases[owner], config, cwd), relative);
}

export function transformImports(content: string, config: UiProjectConfig): string {
  const componentsAlias = config.aliases.ui;
  const libAlias = config.aliases.lib;
  const hooksAlias = config.aliases.hooks;
  const typesAlias = config.aliases.types;

  return content
    .replace(
      /from\s+['"]@ui\/(primitives|layout|components)\/([^'"]+)['"]/g,
      `from '${componentsAlias}/$2'`,
    )
    .replace(/from\s+['"]@ui\/lib\/([^'"]+)['"]/g, `from '${libAlias}/$1'`)
    .replace(/from\s+['"]@ui\/hooks\/([^'"]+)['"]/g, `from '${hooksAlias}/$1'`)
    .replace(/from\s+['"]@ui\/types\/([^'"]+)['"]/g, `from '${typesAlias}/$1'`)
    .replace(
      /from\s+['"]@\/(components\/ui|primitives|layout)\/([^'"]+)['"]/g,
      `from '${componentsAlias}/$2'`,
    )
    .replace(/from\s+['"]@\/lib\/([^'"]+)['"]/g, `from '${libAlias}/$1'`)
    .replace(/from\s+['"]@\/hooks\/([^'"]+)['"]/g, `from '${hooksAlias}/$1'`)
    .replace(/from\s+['"]@\/types\/([^'"]+)['"]/g, `from '${typesAlias}/$1'`);
}
