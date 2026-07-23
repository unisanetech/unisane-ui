#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(packageDir, '../../..');
const manifest = JSON.parse(
  await fs.readFile(path.join(packageDir, 'public-surface.json'), 'utf8'),
);
const packageJson = JSON.parse(await fs.readFile(path.join(packageDir, 'package.json'), 'utf8'));
const registry = JSON.parse(
  await fs.readFile(path.join(packageDir, 'registry/registry.json'), 'utf8'),
);
const docsIndex = await fs.readFile(
  path.join(repoRoot, 'unisane-ui/apps/docs/lib/docs/registry/component-docs.ts'),
  'utf8',
);
const sharedTest = await fs.readFile(path.join(packageDir, manifest.sharedTestOwner), 'utf8');
const violations = [];

async function collectFiles(directory, extensions, ignored = new Set()) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(absolute, extensions, ignored)));
    else if (extensions.some((extension) => entry.name.endsWith(extension))) files.push(absolute);
  }
  return files;
}

function report(file, message) {
  violations.push(`${path.relative(repoRoot, file)}: ${message}`);
}

const sourceKinds = {
  components: { directory: 'components', extension: '.tsx' },
  layouts: { directory: 'layout', extension: '.tsx' },
  primitives: { directory: 'primitives', extension: '.tsx' },
  hooks: { directory: 'hooks', extension: '.ts' },
  lib: { directory: 'lib', extension: null },
  types: { directory: 'types', extension: '.ts' },
};

for (const [kind, config] of Object.entries(sourceKinds)) {
  const sourceFiles = await fs.readdir(path.join(packageDir, 'src', config.directory), {
    withFileTypes: true,
  });
  const actual = [];
  for (const entry of sourceFiles) {
    if (
      entry.isFile() &&
      (config.extension ? entry.name.endsWith(config.extension) : /\.tsx?$/.test(entry.name))
    ) {
      actual.push(entry.name.replace(/\.tsx?$/, ''));
    } else if (kind === 'components' && entry.isDirectory()) {
      const nestedFiles = await fs.readdir(
        path.join(packageDir, 'src', config.directory, entry.name),
      );
      if (nestedFiles.some((file) => /\.tsx?$/.test(file))) actual.push(entry.name);
    }
  }
  actual.sort();
  const classified = [...manifest[kind].public, ...manifest[kind].private].sort();
  if (JSON.stringify(actual) !== JSON.stringify(classified)) {
    violations.push(`${kind} public/private classification does not match source owners`);
  }

  for (const owner of manifest[kind].public) {
    if (!packageJson.exports[`./${owner}`])
      violations.push(`missing flat runtime export ./${owner}`);
    if (!registry.components[owner] && !(kind === 'types' && owner === 'navigation')) {
      violations.push(`missing local registry owner ${owner}`);
    }
  }
  for (const owner of manifest[kind].private) {
    if (packageJson.exports[`./${owner}`])
      violations.push(`private support is runtime-exported: ${owner}`);
  }
}

for (const owner of manifest.components.public) {
  if (!new RegExp(`slug:\\s*['"]${owner}['"]`).test(docsIndex)) {
    violations.push(`public component is missing docs registry entry: ${owner}`);
  }
  const directTestDirectory = path.join(packageDir, 'tests', owner);
  let hasDirectTest = false;
  try {
    hasDirectTest = (await fs.readdir(directTestDirectory)).some((file) =>
      /\.(?:test|spec)\.tsx?$/.test(file),
    );
  } catch {
    hasDirectTest = false;
  }
  if (!hasDirectTest) {
    const symbol = owner
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    if (!sharedTest.includes(symbol) && !sharedTest.includes(`/components/${owner}`)) {
      violations.push(`public component has no direct or fleet test: ${owner}`);
    }
  }
}

const exportKeys = Object.keys(packageJson.exports);
if (packageJson.exports['.']) violations.push('root runtime export remains public');
if (exportKeys.some((key) => key.includes('*')))
  violations.push('wildcard runtime export remains public');
if (exportKeys.some((key) => /^\.\/(components|primitives|layout|hooks|lib)\//.test(key))) {
  violations.push('category-deep runtime export remains public');
}

const consumerRoots = [
  'unisane/starters',
  'unisane-platforms/apps',
  'unisane-tools/packages/create-unisane/templates',
  'unisane-ui/apps/docs',
  'unisane-ui/packages/data-table/src',
];
for (const relativeRoot of consumerRoots) {
  const root = path.join(repoRoot, relativeRoot);
  for (const file of await collectFiles(
    root,
    ['.ts', '.tsx', '.css'],
    new Set(['dist', 'node_modules', '.next']),
  )) {
    const content = await fs.readFile(file, 'utf8');
    if (/from\s+['"]@unisane\/ui['"]/.test(content)) report(file, 'root @unisane/ui import');
    if (/from\s+['"]@unisane\/ui\/(?:components|primitives|layout|hooks|lib)\//.test(content)) {
      report(file, 'category-deep @unisane/ui import');
    }
    if (file.endsWith('.css') && relativeRoot !== 'unisane-ui/apps/docs') {
      if (/@unisane\/tokens/.test(content)) report(file, 'direct token CSS import');
      if (/@source[^\n]*(?:unisane-ui|@unisane\/ui)/.test(content))
        report(file, 'consumer UI source scan');
    }
  }
}

const dataTableTypes = await fs.readFile(
  path.join(repoRoot, 'unisane-ui/packages/data-table/src/types/props.ts'),
  'utf8',
);
if (/export\s+(?:interface|type)\s+DataTableProps/.test(dataTableTypes)) {
  violations.push('competing DataTableProps owner remains in data-table types/props.ts');
}
const dataTableEntry = await fs.readFile(
  path.join(repoRoot, 'unisane-ui/packages/data-table/src/index.ts'),
  'utf8',
);
if (!/components\/data-table/.test(dataTableEntry)) {
  violations.push('DataTable root does not export the rendered grouped contract');
}
if (!registry.components['data-table']?.files?.includes('components/data-table/index.ts')) {
  violations.push('DataTable local registry composite is incomplete');
}

if (violations.length) {
  console.error(`UI convergence failed with ${violations.length} violation(s):`);
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(
  `UI convergence passed: ${manifest.components.public.length} public components, ${exportKeys.length - 2} explicit runtime modules, zero legacy consumer paths.`,
);
