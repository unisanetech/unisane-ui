#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.join(__dirname, '..');

const packageStylesPath = path.join(workspaceDir, 'packages/ui/src/styles.css');
const docsGlobalsPath = path.join(workspaceDir, 'apps/docs/app/globals.css');
const ignoredClassNames = new Set(['dark', 'expanded', 'medium']);

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function extractUtilityClasses(css) {
  const classNames = new Set();
  const normalized = stripComments(css);
  const blockPattern = /(^|}|;)\s*([^@][^{]+)\{/gm;
  const classPattern = /\.([A-Za-z_][A-Za-z0-9_-]*)(?=[:\s,[.{#>+~])/g;

  for (const blockMatch of normalized.matchAll(blockPattern)) {
    const selector = blockMatch[2];
    for (const classMatch of selector.matchAll(classPattern)) {
      if (!ignoredClassNames.has(classMatch[1])) {
        classNames.add(classMatch[1]);
      }
    }
  }

  return classNames;
}

async function main() {
  const [packageCss, docsCss] = await Promise.all([
    fs.readFile(packageStylesPath, 'utf8'),
    fs.readFile(docsGlobalsPath, 'utf8'),
  ]);

  const packageUtilities = extractUtilityClasses(packageCss);
  const docsUtilities = extractUtilityClasses(docsCss);

  const duplicates = [...docsUtilities]
    .filter((className) => packageUtilities.has(className))
    .sort();

  if (duplicates.length === 0) {
    console.log('Public utility ownership check passed.');
    return;
  }

  console.error('Docs app is redefining package-public utility classes:\n');
  for (const className of duplicates) {
    console.error(`- .${className}`);
  }
  console.error(
    '\nMove shared utility ownership into @unisane/ui/styles.css or rename the app-local class.',
  );
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
