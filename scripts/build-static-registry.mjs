import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const canonicalRegistryDirectory = path.join(repositoryRoot, 'packages/ui/registry');
const canonicalCatalogPath = path.join(canonicalRegistryDirectory, 'registry.json');
const componentsSchemaPath = path.join(repositoryRoot, 'packages/ui-cli/components.schema.json');
const registrySchemaPath = path.join(canonicalRegistryDirectory, 'registry-schema.json');

export const DEFAULT_REGISTRY_BASE_URL = 'https://ui.unisane.com';
export const REGISTRY_ITEM_SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isSafeRegistryPath(value) {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    !value.includes('\\') &&
    !path.posix.isAbsolute(value) &&
    path.posix.normalize(value) === value &&
    value !== '..' &&
    !value.startsWith('../')
  );
}

export function toHostedTarget(target) {
  if (!isSafeRegistryPath(target)) {
    throw new Error(`Unsafe registry target: ${target}`);
  }
  const mappings = [
    ['components/ui/', '@ui/'],
    ['lib/', '@lib/'],
    ['hooks/', '@hooks/'],
    ['types/', '@lib/types/'],
  ];
  const mapping = mappings.find(([prefix]) => target.startsWith(prefix));
  if (!mapping) {
    throw new Error(`Unsupported registry target: ${target}`);
  }
  return `${mapping[1]}${target.slice(mapping[0].length)}`;
}

export function toHostedContent(content) {
  return content
    .replaceAll('@/components/ui/', '@ui/')
    .replaceAll('@/lib/', '@lib/')
    .replaceAll('@/hooks/', '@hooks/')
    .replaceAll('@/types/', '@lib/types/');
}

function assertBaseUrl(value) {
  const url = new URL(value);
  const loopbackHttp =
    url.protocol === 'http:' && (url.hostname === '127.0.0.1' || url.hostname === 'localhost');
  if (
    (url.protocol !== 'https:' && !loopbackHttp) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(`Registry base URL must be an HTTPS origin: ${value}`);
  }
  return url.origin;
}

function assertCatalog(catalog) {
  if (!isRecord(catalog) || !Array.isArray(catalog.items) || catalog.items.length === 0) {
    throw new Error('Canonical registry catalog is missing items');
  }
  const names = new Set();
  for (const item of catalog.items) {
    if (
      !isRecord(item) ||
      typeof item.name !== 'string' ||
      !/^[a-z0-9][a-z0-9-]*$/u.test(item.name)
    ) {
      throw new Error('Canonical registry contains an invalid item name');
    }
    if (names.has(item.name)) throw new Error(`Duplicate registry item: ${item.name}`);
    names.add(item.name);
    if (!Array.isArray(item.files) || item.files.length === 0) {
      throw new Error(`Registry item has no files: ${item.name}`);
    }
    for (const file of item.files) {
      if (!isRecord(file) || !isSafeRegistryPath(file.path) || !isSafeRegistryPath(file.target)) {
        throw new Error(`Registry item has an unsafe file path: ${item.name}`);
      }
      toHostedTarget(file.target);
    }
  }
  for (const item of catalog.items) {
    for (const dependency of item.registryDependencies ?? []) {
      if (!names.has(dependency)) {
        throw new Error(`Registry item ${item.name} has an unknown dependency: ${dependency}`);
      }
    }
  }
}

function hostedRegistryDependencies(item, baseUrl) {
  return (item.registryDependencies ?? []).map(
    (dependency) => `${baseUrl}/r/${encodeURIComponent(dependency)}.json`,
  );
}

async function hostedFiles(item, registryDirectory) {
  return Promise.all(
    item.files.map(async (file) => {
      const sourcePath = path.join(registryDirectory, file.path);
      const relative = path.relative(registryDirectory, sourcePath);
      if (!isSafeRegistryPath(relative.split(path.sep).join('/'))) {
        throw new Error(`Registry source escapes its owner: ${item.name} -> ${file.path}`);
      }
      const content = toHostedContent(await fs.readFile(sourcePath, 'utf8'));
      return {
        path: file.path,
        type: file.type,
        target: toHostedTarget(file.target),
        content,
      };
    }),
  );
}

function outputPathIsSafe(outputDirectory) {
  const resolved = path.resolve(outputDirectory);
  return resolved !== path.parse(resolved).root && resolved !== repositoryRoot;
}

export async function buildStaticRegistry({
  outputDirectory,
  baseUrl = DEFAULT_REGISTRY_BASE_URL,
  catalogPath = canonicalCatalogPath,
  registryDirectory = canonicalRegistryDirectory,
} = {}) {
  if (!outputDirectory || !outputPathIsSafe(outputDirectory)) {
    throw new Error('Static registry output must be one explicit non-root directory');
  }
  const canonicalBaseUrl = assertBaseUrl(baseUrl);
  const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'));
  assertCatalog(catalog);

  const outputRoot = path.resolve(outputDirectory);
  const registryOutput = path.join(outputRoot, 'r');
  const schemaOutput = path.join(outputRoot, 'schema');
  await fs.rm(outputRoot, { recursive: true, force: true });
  await fs.mkdir(registryOutput, { recursive: true });
  await fs.mkdir(schemaOutput, { recursive: true });

  const hostedItems = [];
  const itemHashes = {};
  for (const item of catalog.items) {
    const hostedItem = {
      $schema: REGISTRY_ITEM_SCHEMA,
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies ?? [],
      registryDependencies: hostedRegistryDependencies(item, canonicalBaseUrl),
      ...(item.devDependencies ? { devDependencies: item.devDependencies } : {}),
      files: await hostedFiles(item, registryDirectory),
    };
    const itemSource = json(hostedItem);
    await fs.writeFile(path.join(registryOutput, `${item.name}.json`), itemSource);
    itemHashes[item.name] = sha256(itemSource);
    hostedItems.push({
      ...hostedItem,
      files: hostedItem.files.map(({ content: _content, ...file }) => file),
    });
  }

  const hostedCatalog = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: catalog.name,
    homepage: canonicalBaseUrl,
    items: hostedItems,
  };
  const catalogSource = json(hostedCatalog);
  const componentsSchemaSource = await fs.readFile(componentsSchemaPath, 'utf8');
  const registrySchemaSource = await fs.readFile(registrySchemaPath, 'utf8');
  await Promise.all([
    fs.writeFile(path.join(registryOutput, 'registry.json'), catalogSource),
    fs.writeFile(path.join(schemaOutput, 'components.json'), componentsSchemaSource),
    fs.writeFile(path.join(schemaOutput, 'registry.json'), registrySchemaSource),
    fs.writeFile(path.join(outputRoot, '.nojekyll'), ''),
    fs.writeFile(
      path.join(outputRoot, 'index.html'),
      '<!doctype html><meta charset="utf-8"><title>Unisane UI Registry</title><main><h1>Unisane UI Registry</h1><p><a href="r/registry.json">Registry catalog</a></p><p><a href="schema/components.json">components.json schema</a></p></main>\n',
    ),
  ]);

  const manifest = {
    schemaVersion: 1,
    baseUrl: canonicalBaseUrl,
    itemCount: hostedItems.length,
    catalogSha256: sha256(catalogSource),
    componentsSchemaSha256: sha256(componentsSchemaSource),
    items: Object.fromEntries(
      Object.entries(itemHashes).sort(([left], [right]) => left.localeCompare(right)),
    ),
  };
  await fs.writeFile(path.join(registryOutput, 'manifest.json'), json(manifest));
  return { outputDirectory: outputRoot, manifest };
}

export async function verifyStaticRegistry(
  outputDirectory,
  expectedBaseUrl = DEFAULT_REGISTRY_BASE_URL,
) {
  const outputRoot = path.resolve(outputDirectory);
  const registryOutput = path.join(outputRoot, 'r');
  const manifest = JSON.parse(
    await fs.readFile(path.join(registryOutput, 'manifest.json'), 'utf8'),
  );
  const catalogSource = await fs.readFile(path.join(registryOutput, 'registry.json'), 'utf8');
  const catalog = JSON.parse(catalogSource);
  const schemaSource = await fs.readFile(path.join(outputRoot, 'schema/components.json'), 'utf8');
  JSON.parse(schemaSource);

  if (manifest.baseUrl !== assertBaseUrl(expectedBaseUrl))
    throw new Error('Static registry base URL drifted');
  if (manifest.itemCount !== catalog.items.length || catalog.items.length !== 94) {
    throw new Error(`Static registry must contain exactly 94 items; found ${catalog.items.length}`);
  }
  if (manifest.catalogSha256 !== sha256(catalogSource))
    throw new Error('Static catalog digest is stale');
  if (manifest.componentsSchemaSha256 !== sha256(schemaSource))
    throw new Error('Components schema digest is stale');

  const names = new Set(catalog.items.map((item) => item.name));
  for (const item of catalog.items) {
    const itemSource = await fs.readFile(path.join(registryOutput, `${item.name}.json`), 'utf8');
    const hostedItem = JSON.parse(itemSource);
    if (manifest.items[item.name] !== sha256(itemSource))
      throw new Error(`Static item digest is stale: ${item.name}`);
    if (
      hostedItem.$schema !== REGISTRY_ITEM_SCHEMA ||
      hostedItem.files.some((file) => typeof file.content !== 'string')
    ) {
      throw new Error(`Static item is not content-bearing: ${item.name}`);
    }
    for (const dependencyUrl of hostedItem.registryDependencies) {
      const dependencyName = new URL(dependencyUrl).pathname
        .split('/')
        .at(-1)
        ?.replace(/\.json$/u, '');
      if (!dependencyName || !names.has(dependencyName))
        throw new Error(`Static dependency is unresolved: ${dependencyUrl}`);
    }
    for (const file of hostedItem.files) {
      if (!/^@(ui|lib|hooks)\//u.test(file.target))
        throw new Error(`Static target is not alias-owned: ${file.target}`);
      if (file.content.includes('@unisane/'))
        throw new Error(`Static item has a Unisane runtime fallback: ${item.name}`);
    }
  }
  return manifest;
}

function parseArguments(argv) {
  const outputIndex = argv.indexOf('--output');
  const baseUrlIndex = argv.indexOf('--base-url');
  if (outputIndex === -1 || !argv[outputIndex + 1]) {
    throw new Error(
      'Usage: node scripts/build-static-registry.mjs --output <directory> [--base-url <https-origin>]',
    );
  }
  return {
    outputDirectory: path.resolve(repositoryRoot, argv[outputIndex + 1]),
    baseUrl: baseUrlIndex === -1 ? DEFAULT_REGISTRY_BASE_URL : argv[baseUrlIndex + 1],
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await buildStaticRegistry(parseArguments(process.argv.slice(2)));
  await verifyStaticRegistry(result.outputDirectory, result.manifest.baseUrl);
  console.log(
    `Static registry built: ${result.manifest.itemCount} items at ${result.outputDirectory}`,
  );
}
