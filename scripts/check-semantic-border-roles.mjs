#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uiRoot = path.join(__dirname, '..');

const sourceRoots = [
  path.join(uiRoot, 'packages/core/src'),
  path.join(uiRoot, 'packages/data-table/src'),
];

const quietDataTableFiles = new Set([
  'packages/data-table/src/components/group-row.tsx',
  'packages/data-table/src/components/header/group-header-row.tsx',
  'packages/data-table/src/components/header/header-cell.tsx',
  'packages/data-table/src/components/header/index.tsx',
  'packages/data-table/src/components/row.tsx',
  'packages/data-table/src/components/skeleton-loading-state.tsx',
  'packages/data-table/src/components/summary-row.tsx',
  'packages/data-table/src/components/table.tsx',
  'packages/data-table/src/components/toolbar/index.tsx',
  'packages/data-table/src/components/toolbar/sections.tsx',
]);

const violations = [];

async function getSourceFiles(directory) {
  const files = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await getSourceFiles(fullPath)));
      continue;
    }

    if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function lineNumberForIndex(content, index) {
  return content.slice(0, index).split('\n').length;
}

function addViolation(filePath, content, match, message) {
  violations.push({
    filePath,
    line: lineNumberForIndex(content, match.index ?? 0),
    message,
  });
}

function checkFile(filePath, content) {
  const relativePath = path.relative(uiRoot, filePath);
  const primitiveBorderPattern = /(^|[\s"'`])((?:[a-z0-9-]+:)*border-outline(?:-variant)?)(?!-)/g;
  const defaultStrongPattern = /(^|[\s"'`])(border-outline-strong)(?!-)/g;

  for (const match of content.matchAll(primitiveBorderPattern)) {
    addViolation(
      filePath,
      content,
      match,
      `Palette primitive '${match[2]}' cannot style a component border directly. Use outline-weak, outline-soft, outline-subtle, outline-medium, or outline-strong according to visual purpose.`,
    );
  }

  for (const match of content.matchAll(defaultStrongPattern)) {
    addViolation(
      filePath,
      content,
      match,
      "Default component borders cannot use 'border-outline-strong'. Reserve it for an explicit interaction or emphasis state.",
    );
  }

  if (quietDataTableFiles.has(relativePath)) {
    const repeatingDividerPattern = /\bborder-outline-subtle\b/g;

    for (const match of content.matchAll(repeatingDividerPattern)) {
      addViolation(
        filePath,
        content,
        match,
        "Repeated DataTable grid and section dividers must use 'border-outline-weak'.",
      );
    }
  }
}

async function main() {
  const files = (await Promise.all(sourceRoots.map(getSourceFiles))).flat();

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf8');
    checkFile(filePath, content);
  }

  if (violations.length === 0) {
    console.log('Semantic border role check passed.');
    return;
  }

  console.error('Semantic border role drift detected:\n');
  for (const violation of violations) {
    console.error(
      `- ${path.relative(uiRoot, violation.filePath)}:${violation.line} ${violation.message}`,
    );
  }
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
