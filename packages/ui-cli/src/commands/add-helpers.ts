import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ComponentMeta, Registry, UnisaneConfig } from './add-types.js';

const { existsSync, readFileSync } = fse;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isComponentMeta(value: unknown): value is ComponentMeta {
  if (!isRecord(value)) return false;
  return (
    typeof value.name === 'string' &&
    typeof value.type === 'string' &&
    typeof value.description === 'string' &&
    Array.isArray(value.files) &&
    Array.isArray(value.dependencies) &&
    Array.isArray(value.registryDependencies)
  );
}

function isRegistry(value: unknown): value is Registry {
  if (!isRecord(value) || typeof value.version !== 'string' || !isRecord(value.components)) {
    return false;
  }
  return Object.values(value.components).every((meta) => isComponentMeta(meta));
}

function toUnisaneConfig(value: unknown): UnisaneConfig | null {
  if (!isRecord(value)) return null;
  const aliases = isRecord(value.aliases)
    ? {
        components:
          typeof value.aliases.components === 'string' ? value.aliases.components : undefined,
        lib: typeof value.aliases.lib === 'string' ? value.aliases.lib : undefined,
        hooks: typeof value.aliases.hooks === 'string' ? value.aliases.hooks : undefined,
        types: typeof value.aliases.types === 'string' ? value.aliases.types : undefined,
      }
    : undefined;
  const srcDir = typeof value.srcDir === 'string' ? value.srcDir : undefined;
  return { aliases, srcDir };
}

export function resolveRegistryDir(): string | null {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    process.env.UNISANE_UI_REGISTRY_DIR,
    path.resolve(moduleDir, '..', 'ui-registry'),
  ].filter((candidate): candidate is string => Boolean(candidate));

  return candidates.find((candidate) => existsSync(path.join(candidate, 'registry.json'))) ?? null;
}

export function loadRegistry(registryDir: string): Registry | null {
  const registryPath = path.join(registryDir, 'registry.json');

  if (!existsSync(registryPath)) {
    return null;
  }

  const parsed: unknown = JSON.parse(readFileSync(registryPath, 'utf8'));
  if (!isRegistry(parsed)) {
    return null;
  }
  return parsed;
}

export function loadConfig(cwd: string): UnisaneConfig {
  const configPath = path.join(cwd, 'unisane.json');
  const packageJsonPath = path.join(cwd, 'package.json');

  if (existsSync(configPath)) {
    try {
      const parsed: unknown = JSON.parse(readFileSync(configPath, 'utf8'));
      const config = toUnisaneConfig(parsed);
      if (config) return config;
    } catch {
      // Fall through
    }
  }

  if (existsSync(packageJsonPath)) {
    try {
      const pkg: unknown = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      if (isRecord(pkg)) {
        const config = toUnisaneConfig(pkg.unisane);
        if (config) return config;
      }
    } catch {
      // Fall through
    }
  }

  return {
    aliases: {
      components: '@/components/ui',
      lib: '@/lib',
      hooks: '@/hooks',
      types: '@/types',
    },
    srcDir: existsSync(path.join(cwd, 'src')) ? 'src' : '',
  };
}

export function getAllDependencies(
  components: string[],
  registry: Registry,
  visited = new Set<string>(),
): Set<string> {
  for (const comp of components) {
    if (visited.has(comp)) continue;

    const meta = registry.components[comp];
    if (!meta) continue;

    visited.add(comp);

    for (const dep of meta.registryDependencies || []) {
      if (!visited.has(dep)) {
        getAllDependencies([dep], registry, visited);
      }
    }
  }

  return visited;
}

export function getTargetDir(type: string, config: UnisaneConfig, cwd: string): string {
  const srcDir = config.srcDir || '';
  const basePath = srcDir ? path.join(cwd, srcDir) : cwd;

  if (type === 'lib:util') return path.join(basePath, 'lib');
  if (type === 'hooks:ui') return path.join(basePath, 'hooks');
  if (type === 'types:ui') return path.join(basePath, 'types');

  return path.join(basePath, 'components', 'ui');
}

export function getTargetFilePath(
  file: string,
  type: string,
  config: UnisaneConfig,
  cwd: string,
): string {
  const [, ...relativeSegments] = file.split('/');
  if (relativeSegments.length === 0) {
    throw new Error(`Registry file must include a source root: ${file}`);
  }

  return path.join(getTargetDir(type, config, cwd), ...relativeSegments);
}

export function transformImports(content: string, config: UnisaneConfig): string {
  const componentsAlias = config.aliases?.components || '@/components/ui';
  const libAlias = config.aliases?.lib || '@/lib';
  const hooksAlias = config.aliases?.hooks || '@/hooks';
  const typesAlias = config.aliases?.types || '@/types';

  let result = content;

  result = result
    .replace(
      /from\s+['"]@ui\/(primitives|layout|components)\/([^'"]+)['"]/g,
      `from '${componentsAlias}/$2'`,
    )
    .replace(/from\s+['"]@ui\/lib\/([^'"]+)['"]/g, `from '${libAlias}/$1'`)
    .replace(/from\s+['"]@ui\/hooks\/([^'"]+)['"]/g, `from '${hooksAlias}/$1'`)
    .replace(/from\s+['"]@ui\/types\/([^'"]+)['"]/g, `from '${typesAlias}/$1'`);

  result = result.replace(
    /from\s+['"]@\/(components\/ui|primitives|layout)\/([^'"]+)['"]/g,
    `from '${componentsAlias}/$2'`,
  );
  result = result.replace(/from\s+['"]@\/lib\/([^'"]+)['"]/g, `from '${libAlias}/$1'`);
  result = result.replace(/from\s+['"]@\/hooks\/([^'"]+)['"]/g, `from '${hooksAlias}/$1'`);
  result = result.replace(/from\s+['"]@\/types\/([^'"]+)['"]/g, `from '${typesAlias}/$1'`);

  return result;
}
