#!/usr/bin/env node

/**
 * Unisane UI Registry Validator
 *
 * This script validates the registry to detect:
 * 1. Component drift (src/ and registry/ out of sync)
 * 2. Unrewritten internal imports in registry files
 * 3. Missing components in registry
 * 4. Orphaned files in registry not in src
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { generateRegistryStyleArtifacts } from './registry-styles.mjs';
import { rewriteSourceImportsToRegistry } from './registry-imports.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const registryDir = path.join(rootDir, 'registry');
const packageJsonPath = path.join(rootDir, 'package.json');
const MODULE_SPECIFIER_REGEX = /(?:\bfrom\s+|\bimport\s+)(["'])([^"']+)\1/g;
const PEER_PACKAGES = new Set(['react', 'react-dom']);

// Track validation results
const results = {
  errors: [],
  warnings: [],
  info: [],
};

function error(msg) {
  results.errors.push(msg);
}

function warn(msg) {
  results.warnings.push(msg);
}

function info(msg) {
  results.info.push(msg);
}

/**
 * Normalize content for comparison by stripping:
 * - Whitespace differences
 * - Import path differences between source and registry layout
 */
function normalizeForComparison(content, relativeFilePath, isRegistry = false) {
  if (isRegistry) {
    return content.trim();
  }

  return rewriteSourceImportsToRegistry(content, relativeFilePath).trim();
}

function stripComments(content) {
  return content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

/**
 * Get hash of normalized content for quick comparison
 */
function getContentHash(content) {
  return createHash('md5').update(content).digest('hex');
}

function normalizeTextContent(content) {
  return content.replace(/\r\n/g, '\n').trim();
}

/**
 * Recursively get all files in a directory
 */
async function getAllFiles(dir, basePath = '') {
  const files = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const relativePath = path.join(basePath, entry.name);
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const subFiles = await getAllFiles(fullPath, relativePath);
        files.push(...subFiles);
      } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
        // Skip index files for comparison purposes
        if (entry.name !== 'index.ts' && entry.name !== 'index.tsx') {
          files.push(relativePath);
        } else {
          // Still track index files but separately
          files.push(relativePath);
        }
      }
    }
  } catch {
    // Directory doesn't exist
  }

  return files;
}

/**
 * Check for unrewritten internal imports in registry files
 */
async function checkUnrewrittenImports() {
  console.log('\n🔍 Checking for unrewritten internal imports...\n');

  const folders = ['components', 'primitives', 'layout', 'lib', 'hooks', 'types'];
  let unrewrittenCount = 0;

  for (const folder of folders) {
    const folderPath = path.join(registryDir, folder);
    const files = await getAllFiles(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);

      try {
        const content = await fs.readFile(filePath, 'utf-8');

        const uiAliasMatches = content.match(/(?:from\s+|import\s+)(["'])@ui\/[^"']+\1/g);
        const relativeMatches = content.match(/(?:from\s+|import\s+)(["'])(\.\.?\/[^"']+)\1/g);
        const matches = [...(uiAliasMatches ?? []), ...(relativeMatches ?? [])];

        if (matches.length > 0) {
          unrewrittenCount++;
          error(`Unrewritten imports in registry/${folder}/${file}: ${matches.join(', ')}`);
        }
      } catch {
        // File doesn't exist or can't be read
      }
    }
  }

  if (unrewrittenCount === 0) {
    info('✅ All imports correctly rewritten in registry files');
  }

  return unrewrittenCount;
}

/**
 * Compare src and registry files to detect drift
 */
async function checkComponentDrift() {
  console.log('🔍 Checking for component drift (src/ vs registry/)...\n');

  const folders = ['components', 'primitives', 'layout', 'lib', 'hooks', 'types'];
  let driftCount = 0;
  let missingCount = 0;
  let orphanedCount = 0;

  for (const folder of folders) {
    const srcFolderPath = path.join(srcDir, folder);
    const regFolderPath = path.join(registryDir, folder);

    const srcFiles = await getAllFiles(srcFolderPath);
    const regFiles = await getAllFiles(regFolderPath);

    // Check for files in src but not in registry (missing)
    for (const file of srcFiles) {
      if (!regFiles.includes(file)) {
        missingCount++;
        warn(`Missing in registry: ${folder}/${file}`);
      }
    }

    // Check for files in registry but not in src (orphaned)
    for (const file of regFiles) {
      if (folder === 'components' && file.startsWith(`data-table${path.sep}`)) continue;
      if (!srcFiles.includes(file)) {
        orphanedCount++;
        warn(`Orphaned in registry (not in src): ${folder}/${file}`);
      }
    }

    // Check for content drift in matching files
    for (const file of srcFiles) {
      if (!regFiles.includes(file)) continue;

      const srcPath = path.join(srcFolderPath, file);
      const regPath = path.join(regFolderPath, file);

      try {
        const srcContent = await fs.readFile(srcPath, 'utf-8');
        const regContent = await fs.readFile(regPath, 'utf-8');

        const sourceRelativePath = `${folder}/${file}`;
        const srcNormalized = normalizeForComparison(srcContent, sourceRelativePath, false);
        const regNormalized = normalizeForComparison(regContent, sourceRelativePath, true);

        const srcHash = getContentHash(srcNormalized);
        const regHash = getContentHash(regNormalized);

        if (srcHash !== regHash) {
          driftCount++;
          error(`Content drift detected: ${folder}/${file}`);
        }
      } catch (err) {
        warn(`Could not compare ${folder}/${file}: ${err.message}`);
      }
    }
  }

  if (driftCount === 0 && missingCount === 0 && orphanedCount === 0) {
    info('✅ No component drift detected - src/ and registry/ are in sync');
  }

  return { driftCount, missingCount, orphanedCount };
}

/**
 * Validate registry.json has all components
 */
async function validateRegistryJson() {
  console.log('🔍 Validating registry.json...\n');

  const registryJsonPath = path.join(registryDir, 'registry.json');

  try {
    const content = await fs.readFile(registryJsonPath, 'utf-8');
    const registry = JSON.parse(content);

    if (!registry.components) {
      error("registry.json missing 'components' field");
      return;
    }

    // Check that all files referenced in registry.json exist
    let missingFiles = 0;
    for (const [key, component] of Object.entries(registry.components)) {
      for (const file of component.files || []) {
        const filePath = path.join(registryDir, file);
        try {
          await fs.access(filePath);
        } catch {
          missingFiles++;
          error(`registry.json references missing file: ${file} (component: ${key})`);
        }
      }
    }

    if (missingFiles === 0) {
      info(`✅ registry.json valid with ${Object.keys(registry.components).length} components`);
    }
  } catch (err) {
    error(`Could not read registry.json: ${err.message}`);
  }
}

function toInstalledRelativePath(registryFile) {
  const [root, ...rest] = registryFile.split('/');
  if (['components', 'primitives', 'layout'].includes(root)) {
    return path.posix.join('components/ui', ...rest);
  }
  return path.posix.join(root, ...rest);
}

function resolveInstalledPath(specifier, installedOwners) {
  let relativePath = null;

  if (specifier.startsWith('@/components/ui/')) {
    relativePath = specifier.slice('@/'.length);
  } else if (specifier.startsWith('@/primitives/')) {
    relativePath = `components/ui/${specifier.slice('@/primitives/'.length)}`;
  } else if (specifier.startsWith('@/layout/')) {
    relativePath = `components/ui/${specifier.slice('@/layout/'.length)}`;
  } else if (specifier.startsWith('@/')) {
    relativePath = specifier.slice('@/'.length);
  }

  if (!relativePath) return null;

  const candidates = [
    relativePath,
    `${relativePath}.ts`,
    `${relativePath}.tsx`,
    `${relativePath}/index.ts`,
    `${relativePath}/index.tsx`,
  ];
  return candidates.find((candidate) => installedOwners.has(candidate)) ?? null;
}

function getPackageName(specifier) {
  if (specifier.startsWith('@')) {
    const [scope, name] = specifier.split('/');
    return scope && name ? `${scope}/${name}` : null;
  }
  return specifier.split('/')[0] || null;
}

function getDependencyPackageName(dependency) {
  if (dependency.startsWith('@')) {
    const versionSeparator = dependency.indexOf('@', 1);
    return versionSeparator === -1 ? dependency : dependency.slice(0, versionSeparator);
  }
  return dependency.split('@')[0];
}

async function validateRegistryDependencyClosure() {
  console.log('🔍 Validating registry dependency closure...\n');

  try {
    const registry = JSON.parse(await fs.readFile(path.join(registryDir, 'registry.json'), 'utf8'));
    const installedOwners = new Map();

    for (const [key, component] of Object.entries(registry.components)) {
      for (const file of component.files ?? []) {
        const installedPath = toInstalledRelativePath(file);
        const existingOwner = installedOwners.get(installedPath);
        if (existingOwner && existingOwner !== key) {
          error(
            `Registry items ${existingOwner} and ${key} collide at installed path ${installedPath}`,
          );
        } else {
          installedOwners.set(installedPath, key);
        }
      }
    }

    for (const [key, component] of Object.entries(registry.components)) {
      const registryDependencies = new Set(component.registryDependencies ?? []);
      const dependencyPackages = new Set(
        (component.dependencies ?? []).map(getDependencyPackageName),
      );

      for (const dependency of registryDependencies) {
        if (!registry.components[dependency]) {
          error(`Registry item ${key} references unknown dependency ${dependency}`);
        }
      }

      for (const file of component.files ?? []) {
        const content = await fs.readFile(path.join(registryDir, file), 'utf8');
        const specifiers = Array.from(
          content.matchAll(MODULE_SPECIFIER_REGEX),
          (match) => match[2],
        );

        for (const specifier of specifiers) {
          if (specifier.startsWith('@unisane/')) {
            error(
              `Registry source must not import Unisane runtime packages: ${file} -> ${specifier}`,
            );
            continue;
          }

          const installedPath = resolveInstalledPath(specifier, installedOwners);
          if (specifier.startsWith('@/')) {
            if (!installedPath) {
              error(`Registry import does not resolve after installation: ${file} -> ${specifier}`);
              continue;
            }

            const dependencyOwner = installedOwners.get(installedPath);
            if (dependencyOwner !== key && !registryDependencies.has(dependencyOwner)) {
              error(
                `Registry item ${key} omits local dependency ${dependencyOwner} required by ${file}`,
              );
            }
            continue;
          }

          if (specifier.startsWith('.')) continue;
          const packageName = getPackageName(specifier);
          if (!packageName || PEER_PACKAGES.has(packageName)) continue;
          if (!dependencyPackages.has(packageName)) {
            error(`Registry item ${key} omits npm dependency ${packageName} required by ${file}`);
          }
        }
      }
    }

    if (results.errors.length === 0) {
      info('✅ Registry local and npm dependency closure is complete');
    }
  } catch (err) {
    error(`Could not validate registry dependency closure: ${err.message}`);
  }
}

/**
 * Validate copied registry styles against the canonical token generator.
 */
async function validateRegistryStyles() {
  console.log('🔍 Validating registry styles...\n');

  const registryStylePath = path.join(registryDir, 'styles', 'globals.css');

  try {
    const registryCss = await fs.readFile(registryStylePath, 'utf-8');
    const { globalsCss: expectedCss, themes } = await generateRegistryStyleArtifacts(
      path.join(srcDir, 'styles.css'),
    );

    if (
      getContentHash(normalizeTextContent(registryCss)) !==
      getContentHash(normalizeTextContent(expectedCss))
    ) {
      error('Content drift detected: styles/globals.css');
      return;
    }

    for (const [themeName, expectedThemeCss] of themes) {
      const themePath = path.join(registryDir, 'styles', 'themes', `${themeName}.css`);
      const actualThemeCss = await fs.readFile(themePath, 'utf8');
      if (
        getContentHash(normalizeTextContent(actualThemeCss)) !==
        getContentHash(normalizeTextContent(expectedThemeCss))
      ) {
        error(`Content drift detected: styles/themes/${themeName}.css`);
      }
    }

    const retiredPattern =
      /--(?:ref|tone)-|--(?:hue|chroma)(?:-|:)|data-(?:color-theme|scheme)|data-theme-scope/u;
    if (retiredPattern.test(registryCss)) {
      error(
        'Consumer globals.css contains retired palette, tone, preset, scheme, or preview-scope output',
      );
      return;
    }

    info('✅ registry globals and replace-in-place themes are in sync');
  } catch (err) {
    error(`Could not validate registry styles: ${err.message}`);
  }
}

async function validatePackageFiles() {
  console.log('🔍 Validating published registry ownership...\n');

  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    if (!Array.isArray(packageJson.files) || !packageJson.files.includes('registry')) {
      error('package.json files must include the generated registry directory');
      return;
    }

    info('✅ package file ownership includes registry/**');
  } catch (err) {
    error(`Could not validate package file ownership: ${err.message}`);
  }
}

/**
 * Check for common issues in component files
 */
async function checkCommonIssues() {
  console.log('🔍 Checking for common issues...\n');

  const folders = ['components', 'primitives', 'layout'];
  let issueCount = 0;

  for (const folder of folders) {
    const folderPath = path.join(srcDir, folder);
    const files = await getAllFiles(folderPath);

    for (const file of files) {
      if (!file.endsWith('.tsx')) continue;

      const filePath = path.join(folderPath, file);

      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const codeOnlyContent = stripComments(content);

        // Check for missing displayName
        if (content.includes('forwardRef') && !content.includes('.displayName')) {
          issueCount++;
          warn(`Missing displayName in forwardRef component: ${folder}/${file}`);
        }

        // Check for hardcoded pixel values (potential design token issues)
        const hardcodedPx = codeOnlyContent.match(/(^|[^-\w])\d+px\b/g);
        if (hardcodedPx && hardcodedPx.length > 3) {
          warn(`Multiple hardcoded px values in ${folder}/${file}: consider using design tokens`);
        }

        // Check for deprecated Tailwind v3 patterns
        if (content.includes('flex-shrink-0')) {
          issueCount++;
          error(
            `Deprecated Tailwind v3 pattern "flex-shrink-0" in ${folder}/${file} - use "shrink-0"`,
          );
        }

        // Check for deprecated Tailwind v3 important syntax (!class instead of class!)
        // Only check inside template strings and className props, not JS code
        const classNameRegex = /className\s*=\s*{?[`"'][^`"']*![a-z][a-z0-9-]*[^`"']*[`"']}?/g;
        const classMatches = content.match(classNameRegex);
        if (classMatches) {
          for (const classMatch of classMatches) {
            // Look for !class pattern (but not class!)
            const importantPattern =
              /\s!(border|bg|text|ring|outline|shadow|p|m|w|h|flex|grid|block|inline|hidden|visible|opacity|z|inset|top|bottom|left|right|rounded|font|gap|space|scale|rotate|translate|skew|transform|transition|duration|ease|delay|animate)-?[a-z0-9-]*/gi;
            const badImportants = classMatch.match(importantPattern);
            if (badImportants) {
              issueCount++;
              error(
                `Deprecated Tailwind v3 important syntax in ${folder}/${file}: ${badImportants.join(', ')} - use "class!" format instead`,
              );
            }
          }
        }
      } catch {
        // File doesn't exist or can't be read
      }
    }
  }

  if (issueCount === 0) {
    info('✅ No common issues detected');
  }

  return issueCount;
}

/**
 * Print summary
 */
function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(60) + '\n');

  if (results.info.length > 0) {
    for (const msg of results.info) {
      console.log(msg);
    }
    console.log('');
  }

  if (results.warnings.length > 0) {
    console.log(`⚠️  ${results.warnings.length} warnings:\n`);
    for (const msg of results.warnings) {
      console.log(`   • ${msg}`);
    }
    console.log('');
  }

  if (results.errors.length > 0) {
    console.log(`❌ ${results.errors.length} errors:\n`);
    for (const msg of results.errors) {
      console.log(`   • ${msg}`);
    }
    console.log('');
  }

  console.log('='.repeat(60));

  if (results.errors.length > 0) {
    console.log("\n❌ Validation FAILED - run 'pnpm build:registry' to fix drift\n");
    return false;
  } else if (results.warnings.length > 0) {
    console.log('\n⚠️  Validation passed with warnings\n');
    return true;
  } else {
    console.log('\n✅ Validation PASSED\n');
    return true;
  }
}

// Main
async function main() {
  console.log('🔍 Unisane UI Registry Validator\n');
  console.log('='.repeat(60) + '\n');

  // Check if registry exists
  try {
    await fs.access(registryDir);
  } catch {
    error("Registry directory does not exist. Run 'pnpm build:registry' first.");
    printSummary();
    process.exit(1);
  }

  await checkComponentDrift();
  await checkUnrewrittenImports();
  await validateRegistryJson();
  await validateRegistryDependencyClosure();
  await validateRegistryStyles();
  await validatePackageFiles();
  await checkCommonIssues();

  const passed = printSummary();
  process.exit(passed ? 0 : 1);
}

main().catch((err) => {
  console.error('❌ Validation failed with error:', err);
  process.exit(1);
});
