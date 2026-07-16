#!/usr/bin/env node

/**
 * Unisane UI Registry Builder
 *
 * This script builds the component registry for the CLI tool.
 * It copies components from packages/core/src to registry/ and:
 * - Rewrites internal source imports to @/* registry imports
 * - Generates registry.json with component metadata
 * - Detects inter-component dependencies automatically
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateRegistryStyleArtifacts } from './registry-styles.mjs';
import { resolveInternalSourcePath, rewriteSourceImportsToRegistry } from './registry-imports.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const registryDir = path.join(rootDir, 'registry');
const packageJsonPath = path.join(rootDir, 'package.json');

const PEER_PACKAGES = new Set(['react', 'react-dom']);
const MODULE_SPECIFIER_REGEX = /(?:\bfrom\s+|\bimport\s+)(["'])([^"']+)\1/g;

// Component type detection based on folder
function getComponentType(folder) {
  const types = {
    components: 'components:ui',
    primitives: 'primitives:ui',
    layout: 'layout:ui',
    hooks: 'hooks:ui',
    lib: 'lib:util',
    types: 'types:ui',
  };
  return types[folder] || 'components:ui';
}

// Convert filename to component key (kebab-case)
function fileToKey(filename) {
  return filename
    .replace(/\.tsx?$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

// Convert filename to display name (PascalCase)
function fileToName(filename) {
  return filename
    .replace(/\.tsx?$/, '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function getModuleSpecifiers(content) {
  return Array.from(content.matchAll(MODULE_SPECIFIER_REGEX), (match) => match[2]);
}

function getPackageName(specifier) {
  if (specifier.startsWith('.') || specifier.startsWith('@ui/') || specifier.startsWith('@/')) {
    return null;
  }

  if (specifier.startsWith('@')) {
    const [scope, name] = specifier.split('/');
    return scope && name ? `${scope}/${name}` : null;
  }

  return specifier.split('/')[0] || null;
}

function resolveOwnedSourcePath(sourcePath, sourceFileOwners) {
  const candidates = [
    sourcePath,
    `${sourcePath}.ts`,
    `${sourcePath}.tsx`,
    `${sourcePath}/index.ts`,
    `${sourcePath}/index.tsx`,
  ];

  return candidates.find((candidate) => sourceFileOwners.has(candidate)) ?? null;
}

function mergeComponentGroups(groups) {
  const candidatesByKey = new Map();

  for (const group of groups) {
    for (const [key, item] of Object.entries(group)) {
      const candidates = candidatesByKey.get(key) ?? [];
      candidates.push(item);
      candidatesByKey.set(key, candidates);
    }
  }

  const componentMetadata = {};
  const sourceFileOwners = new Map();

  for (const [key, candidates] of candidatesByKey) {
    for (const candidate of candidates) {
      for (const file of candidate.files) {
        sourceFileOwners.set(file, key);
      }
    }

    if (candidates.length === 1) {
      componentMetadata[key] = candidates[0];
      continue;
    }

    const sources = candidates.flatMap((candidate) => candidate.files).join(', ');
    throw new Error(`Duplicate registry key "${key}" has multiple source owners: ${sources}`);
  }

  return { componentMetadata, sourceFileOwners };
}

async function addDependencyMetadata(componentMetadata, sourceFileOwners) {
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  const packageDependencies = packageJson.dependencies ?? {};

  for (const [key, item] of Object.entries(componentMetadata)) {
    const registryDependencies = new Set();
    const dependencies = new Set();

    for (const relativeFilePath of item.files) {
      const filePath = path.join(srcDir, relativeFilePath);
      const content = await fs.readFile(filePath, 'utf8');

      for (const specifier of getModuleSpecifiers(content)) {
        const internalSourcePath = resolveInternalSourcePath(specifier, relativeFilePath);

        if (internalSourcePath) {
          const ownedSourcePath = resolveOwnedSourcePath(internalSourcePath, sourceFileOwners);
          if (!ownedSourcePath) {
            throw new Error(
              `Registry import has no source owner: ${relativeFilePath} -> ${specifier}`,
            );
          }

          const dependencyOwner = sourceFileOwners.get(ownedSourcePath);
          if (dependencyOwner && dependencyOwner !== key) {
            registryDependencies.add(dependencyOwner);
          }
          continue;
        }

        const packageName = getPackageName(specifier);
        if (!packageName || PEER_PACKAGES.has(packageName)) {
          continue;
        }

        const version = packageDependencies[packageName];
        if (!version) {
          throw new Error(
            `External import is not declared by @unisane/ui: ${relativeFilePath} -> ${specifier}`,
          );
        }

        dependencies.add(`${packageName}@${version}`);
      }
    }

    item.registryDependencies = Array.from(registryDependencies).sort();
    item.dependencies = Array.from(dependencies).sort();
  }
}

// Scan a directory for components (including subdirectories)
async function scanDirectory(dir, folder) {
  const components = {};

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively scan subdirectories (e.g., components/navigation/, components/sidebar/)
        const subComponents = await scanSubdirectory(entryPath, folder, entry.name);
        Object.assign(components, subComponents);
        continue;
      }

      if (!entry.name.endsWith('.tsx') && !entry.name.endsWith('.ts')) continue;
      if (entry.name === 'index.ts' || entry.name === 'index.tsx') continue;

      const key = fileToKey(entry.name);
      const name = fileToName(entry.name);
      const relativeFilePath = `${folder}/${entry.name}`;
      components[key] = {
        name,
        type: getComponentType(folder),
        description: `${name} component`,
        files: [relativeFilePath],
        dependencies: [],
        registryDependencies: [],
      };
    }
  } catch (error) {
    console.warn(`⚠️  Could not scan ${dir}: ${error.message}`);
  }

  return components;
}

// Scan a subdirectory and collect all files under a single component key
async function scanSubdirectory(dir, parentFolder, subfolderName) {
  const components = {};

  try {
    const componentFiles = [];
    const collectFiles = async (currentDir, relativePath = '') => {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const nextRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
        const entryPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          await collectFiles(entryPath, nextRelativePath);
          continue;
        }

        if (!entry.name.endsWith('.tsx') && !entry.name.endsWith('.ts')) {
          continue;
        }
        if (
          entry.name.endsWith('.test.ts') ||
          entry.name.endsWith('.test.tsx') ||
          entry.name.endsWith('.spec.ts') ||
          entry.name.endsWith('.spec.tsx')
        ) {
          continue;
        }

        const sourceRelativePath = `${parentFolder}/${subfolderName}/${nextRelativePath}`;
        componentFiles.push(sourceRelativePath);
      }
    };

    await collectFiles(dir);

    if (componentFiles.length > 0) {
      const key = fileToKey(subfolderName);
      const name = fileToName(subfolderName);

      components[key] = {
        name,
        type: getComponentType(parentFolder),
        description: `${name} component`,
        files: componentFiles,
        dependencies: [],
        registryDependencies: [],
      };
    }
  } catch (error) {
    console.warn(`⚠️  Could not scan subdirectory ${dir}: ${error.message}`);
  }

  return components;
}

// Scan lib directory for utilities
async function scanLibDirectory(dir) {
  const utils = {};

  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
      if (file === 'index.ts') continue;

      const key = fileToKey(file);
      const name = fileToName(file);

      utils[key] = {
        name,
        type: 'lib:util',
        description: `${name} utility`,
        files: [`lib/${file}`],
        dependencies: [],
        registryDependencies: [],
      };
    }
  } catch (error) {
    console.warn(`⚠️  Could not scan lib: ${error.message}`);
  }

  return utils;
}

// Scan hooks directory
async function scanHooksDirectory(dir) {
  const hooks = {};

  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
      if (file === 'index.ts') continue;

      const key = fileToKey(file);
      const name = fileToName(file);

      hooks[key] = {
        name,
        type: 'hooks:ui',
        description: `${name} hook`,
        files: [`hooks/${file}`],
        dependencies: [],
        registryDependencies: [],
      };
    }
  } catch (error) {
    console.warn(`⚠️  Could not scan hooks: ${error.message}`);
  }

  return hooks;
}

async function scanTypesDirectory(dir) {
  const types = {};

  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
      if (file === 'index.ts' || file === 'index.tsx') continue;

      const baseKey = fileToKey(file);
      const key = `${baseKey}-types`;
      const name = `${fileToName(file)}Types`;

      types[key] = {
        name,
        type: 'types:ui',
        description: `${name} definitions`,
        files: [`types/${file}`],
        dependencies: [],
        registryDependencies: [],
      };
    }
  } catch (error) {
    console.warn(`⚠️  Could not scan types: ${error.message}`);
  }

  return types;
}

async function copySupportDirectory(folder) {
  const sourceFolderPath = path.join(srcDir, folder);
  const targetFolderPath = path.join(registryDir, folder);
  let rewriteCount = 0;

  const copyRecursive = async (currentSourceDir, currentTargetDir, relativePath = '') => {
    const entries = await fs.readdir(currentSourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const nextRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      const sourcePath = path.join(currentSourceDir, entry.name);
      const targetPath = path.join(currentTargetDir, entry.name);

      if (entry.isDirectory()) {
        await fs.mkdir(targetPath, { recursive: true });
        await copyRecursive(sourcePath, targetPath, nextRelativePath);
        continue;
      }

      if (!entry.name.endsWith('.ts') && !entry.name.endsWith('.tsx')) {
        continue;
      }

      const sourceRelativePath = `${folder}/${nextRelativePath}`;
      const originalContent = await fs.readFile(sourcePath, 'utf-8');
      const content = rewriteSourceImportsToRegistry(originalContent, sourceRelativePath);

      if (content !== originalContent) {
        rewriteCount++;
      }

      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.writeFile(targetPath, content);
      console.log(
        `✅ Copied ${sourceRelativePath}${content !== originalContent ? ' (imports rewritten)' : ''}`,
      );
    }
  };

  try {
    await fs.access(sourceFolderPath);
  } catch {
    return rewriteCount;
  }

  await fs.mkdir(targetFolderPath, { recursive: true });
  await copyRecursive(sourceFolderPath, targetFolderPath);

  return rewriteCount;
}

// Copy files to registry with import path rewriting
async function copyToRegistry() {
  console.log('📦 Building registry...\n');

  const generatedSourceFolders = ['components', 'primitives', 'layout', 'lib', 'hooks', 'types'];
  for (const folder of generatedSourceFolders) {
    const target = path.join(registryDir, folder);
    await fs.rm(target, { recursive: true, force: true });
    await fs.mkdir(target, { recursive: true });
  }

  let rewriteCount = 0;

  rewriteCount += await copySupportDirectory('components');
  rewriteCount += await copySupportDirectory('primitives');
  rewriteCount += await copySupportDirectory('layout');
  rewriteCount += await copySupportDirectory('lib');
  rewriteCount += await copySupportDirectory('hooks');
  rewriteCount += await copySupportDirectory('types');

  console.log(`\n📝 Rewrote imports in ${rewriteCount} files\n`);
}

// Generate registry.json
async function generateRegistry(componentMetadata) {
  const registry = {
    $schema: './registry-schema.json',
    version: '0.4.0',
    components: componentMetadata,
  };

  const registryPath = path.join(registryDir, 'registry.json');
  await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));
  console.log('✅ Generated registry.json\n');
}

// Generate schema for IDE autocomplete
async function generateSchema() {
  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      $schema: { type: 'string' },
      version: { type: 'string' },
      components: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: {
              type: 'string',
              enum: [
                'components:ui',
                'primitives:ui',
                'layout:ui',
                'hooks:ui',
                'lib:util',
                'types:ui',
              ],
            },
            description: { type: 'string' },
            files: { type: 'array', items: { type: 'string' } },
            dependencies: { type: 'array', items: { type: 'string' } },
            registryDependencies: { type: 'array', items: { type: 'string' } },
            variants: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            accessibility: {
              type: 'object',
              properties: {
                keyboard: { type: 'boolean' },
                screenReader: { type: 'boolean' },
                contrast: { type: 'string', enum: ['AA', 'AAA'] },
              },
            },
          },
          required: ['name', 'type', 'description', 'files'],
        },
      },
    },
    required: ['components'],
  };

  const schemaPath = path.join(registryDir, 'registry-schema.json');
  await fs.writeFile(schemaPath, JSON.stringify(schema, null, 2));
  console.log('✅ Generated registry-schema.json\n');
}

// Copy styles to registry
async function copyStyles() {
  const stylesDir = path.join(registryDir, 'styles');
  await fs.rm(stylesDir, { recursive: true, force: true });
  await fs.mkdir(stylesDir, { recursive: true });

  try {
    const { globalsCss, themes } = await generateRegistryStyleArtifacts(
      path.join(srcDir, 'styles.css'),
    );
    await fs.writeFile(path.join(stylesDir, 'globals.css'), globalsCss);
    await fs.mkdir(path.join(stylesDir, 'themes'), { recursive: true });
    for (const [themeName, themeCss] of themes) {
      await fs.writeFile(path.join(stylesDir, 'themes', `${themeName}.css`), themeCss);
    }
    console.log(`✅ Generated styles/globals.css and ${themes.size} replace-in-place themes`);
  } catch (error) {
    console.warn(`⚠️  Could not generate styles: ${error.message}`);
  }
}

// Main
async function main() {
  try {
    console.log('🔍 Scanning source directories...\n');

    // Auto-detect all components
    const components = await scanDirectory(path.join(srcDir, 'components'), 'components');
    const primitives = await scanDirectory(path.join(srcDir, 'primitives'), 'primitives');
    const layout = await scanDirectory(path.join(srcDir, 'layout'), 'layout');
    const lib = await scanLibDirectory(path.join(srcDir, 'lib'));
    const hooks = await scanHooksDirectory(path.join(srcDir, 'hooks'));
    const types = await scanTypesDirectory(path.join(srcDir, 'types'));

    const { componentMetadata, sourceFileOwners } = mergeComponentGroups([
      lib,
      hooks,
      types,
      primitives,
      layout,
      components,
    ]);
    await addDependencyMetadata(componentMetadata, sourceFileOwners);

    console.log(`📊 Found ${Object.keys(componentMetadata).length} items:`);
    console.log(`   - Components: ${Object.keys(components).length}`);
    console.log(`   - Primitives: ${Object.keys(primitives).length}`);
    console.log(`   - Layout: ${Object.keys(layout).length}`);
    console.log(`   - Lib: ${Object.keys(lib).length}`);
    console.log(`   - Hooks: ${Object.keys(hooks).length}\n`);
    console.log(`   - Types: ${Object.keys(types).length}\n`);

    await copyToRegistry();
    await copyStyles();
    await generateRegistry(componentMetadata);
    await generateSchema();

    console.log('🎉 Registry built successfully!');
    console.log(`📁 Location: ${registryDir}`);
    console.log(`📊 Total items: ${Object.keys(componentMetadata).length}`);
    console.log('\n💡 All internal source imports have been rewritten to registry-safe @/* paths.');
  } catch (error) {
    console.error('❌ Failed to build registry:', error);
    process.exit(1);
  }
}

main();
