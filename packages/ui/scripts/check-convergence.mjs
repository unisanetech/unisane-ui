#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(
  await fs.readFile(path.join(packageDir, 'public-surface.json'), 'utf8'),
);
const packageJson = JSON.parse(await fs.readFile(path.join(packageDir, 'package.json'), 'utf8'));
const registry = JSON.parse(
  await fs.readFile(path.join(packageDir, 'registry/registry.json'), 'utf8'),
);
const sharedTest = await fs.readFile(path.join(packageDir, manifest.sharedTestOwner), 'utf8');
const violations = [];

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
      continue;
    }

    if (kind === 'components' && entry.isDirectory()) {
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
    if (!packageJson.exports[`./${owner}`]) {
      violations.push(`missing flat runtime export ./${owner}`);
    }
    if (!registry.components[owner] && !(kind === 'types' && owner === 'navigation')) {
      violations.push(`missing local registry owner ${owner}`);
    }
  }

  for (const owner of manifest[kind].private) {
    if (packageJson.exports[`./${owner}`]) {
      violations.push(`private support is runtime-exported: ${owner}`);
    }
  }
}

for (const owner of manifest.components.public) {
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
if (exportKeys.some((key) => key.includes('*'))) {
  violations.push('wildcard runtime export remains public');
}
if (exportKeys.some((key) => /^\.\/(components|primitives|layout|hooks|lib)\//.test(key))) {
  violations.push('category-deep runtime export remains public');
}

if (violations.length) {
  console.error(`UI convergence failed with ${violations.length} violation(s):`);
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(
  `UI convergence passed: ${manifest.components.public.length} public components and ${exportKeys.length - 2} explicit runtime modules.`,
);
