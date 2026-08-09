#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uiRoot = path.join(__dirname, '..');

const sourceRoots = [
  path.join(uiRoot, 'packages/ui/src'),
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

const controlBoundaryFiles = new Set([
  'packages/ui/src/components/checkbox.tsx',
  'packages/ui/src/components/radio.tsx',
  'packages/ui/src/components/search-bar.tsx',
  'packages/ui/src/components/segmented-button.tsx',
  'packages/ui/src/components/switch.tsx',
  'packages/ui/src/components/time-picker.tsx',
  'packages/ui/src/lib/field-shell.ts',
  'packages/ui/src/primitives/input.tsx',
  'packages/ui/src/primitives/textarea.tsx',
  'packages/data-table/src/components/toolbar/buttons.tsx',
  'packages/data-table/src/components/toolbar/search-input.tsx',
]);

const violations = [];

const connectedControlSeparatorFiles = new Set([
  'packages/ui/src/components/segmented-button.tsx',
  'packages/ui/src/components/time-picker.tsx',
  'packages/data-table/src/components/toolbar/buttons.tsx',
]);

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
  const primitiveBackgroundPattern = /(^|[\s"'`])((?:[a-z0-9-]+:)*bg-outline(?:-variant)?)(?!-)/g;
  const defaultStrongPattern = /(^|[\s"'`])(border-outline-strong)(?!-)/g;
  const directFocusPrimaryPattern = /\bfocus-visible:(?:ring|outline)-primary\b/g;
  const disabledOpacityPattern =
    /\b(?:disabled|peer-disabled|data-\[disabled=true\]):opacity-50\b/g;
  const rawMicroTextPattern = /\btext-\[10px\]\b/g;
  const recreatedButtonPattern = /<(?:div|span)[^>]*\brole=["']button["']/gs;

  for (const match of content.matchAll(primitiveBorderPattern)) {
    addViolation(
      filePath,
      content,
      match,
      `Palette primitive '${match[2]}' cannot style a component border directly. Use control-outline or an outline role according to visual purpose.`,
    );
  }

  for (const match of content.matchAll(primitiveBackgroundPattern)) {
    addViolation(
      filePath,
      content,
      match,
      `Palette primitive '${match[2]}' cannot style a component affordance directly. Use a purpose-based outline role.`,
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

  for (const match of content.matchAll(directFocusPrimaryPattern)) {
    addViolation(
      filePath,
      content,
      match,
      "Keyboard focus indicators must use the canonical 'focus-ring' role, not the primary content color.",
    );
  }

  for (const match of content.matchAll(disabledOpacityPattern)) {
    addViolation(
      filePath,
      content,
      match,
      'Disabled controls must use the canonical 38% interaction opacity.',
    );
  }

  for (const match of content.matchAll(rawMicroTextPattern)) {
    addViolation(
      filePath,
      content,
      match,
      "Micro labels and counters must use the readable 'text-label-small' role.",
    );
  }

  for (const match of content.matchAll(recreatedButtonPattern)) {
    addViolation(
      filePath,
      content,
      match,
      'Use a native button for button interaction instead of recreating it on a generic element.',
    );
  }

  if (relativePath.startsWith('packages/data-table/src/')) {
    const dangerVariantPattern =
      /\bvariant(?:\?)?\s*:\s*[^;\n]*\bdanger\b|\.variant\s*===\s*['"]danger['"]/g;
    for (const match of content.matchAll(dangerVariantPattern)) {
      addViolation(
        filePath,
        content,
        match,
        "DataTable action danger is a semantic 'tone'; 'variant' is reserved for visual presentation.",
      );
    }
  }

  if (connectedControlSeparatorFiles.has(relativePath)) {
    const wrongSeparatorPattern =
      /border-outline-(?:weak|soft|muted|subtle|medium|strong)[^\n'"`]*\bborder-[lrtb]\b/g;
    for (const match of content.matchAll(wrongSeparatorPattern)) {
      addViolation(
        filePath,
        content,
        match,
        "Connected control separators must use 'border-control-outline', matching the outer boundary.",
      );
    }
  }

  if (
    relativePath === 'packages/ui/src/components/mode-switcher.tsx' &&
    !content.includes('<SegmentedButton')
  ) {
    violations.push({
      filePath,
      line: 1,
      message:
        'ModeSwitcher must compose SegmentedButton instead of forking grouped-selector behavior.',
    });
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

  if (controlBoundaryFiles.has(relativePath) && !content.includes('border-control-outline')) {
    violations.push({
      filePath,
      line: 1,
      message: "Required and grouped control boundaries must use 'border-control-outline'.",
    });
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
