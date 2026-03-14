#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

const colorPatterns = [
  {
    regex: /#[0-9A-Fa-f]{3,8}\b/g,
    message: 'Raw hex color detected. Use semantic tokens instead of hard-coded colors.',
  },
  {
    regex: /\brgba?\(/g,
    message: 'Raw rgb/rgba color detected. Use semantic tokens instead of hard-coded colors.',
  },
  {
    regex: /\bhsla?\(/g,
    message: 'Raw hsl/hsla color detected. Use semantic tokens instead of hard-coded colors.',
  },
  {
    regex: /\boklch\(/g,
    message: 'Raw oklch color detected. Keep color generation in @unisane/tokens, not package runtime source.',
  },
];

const violations = [];

async function getSourceFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await getSourceFiles(fullPath)));
      continue;
    }

    if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.css')) {
      files.push(fullPath);
    }
  }

  return files;
}

function lineNumberForIndex(content, index) {
  return content.slice(0, index).split('\n').length;
}

function addViolation(filePath, line, message) {
  violations.push({ filePath, line, message });
}

function checkFile(filePath, content) {
  for (const { regex, message } of colorPatterns) {
    for (const match of content.matchAll(regex)) {
      addViolation(filePath, lineNumberForIndex(content, match.index ?? 0), message);
    }
  }
}

async function main() {
  const files = await getSourceFiles(srcDir);

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf8');
    checkFile(filePath, content);
  }

  if (violations.length === 0) {
    console.log('Raw color check passed.');
    return;
  }

  console.error('Raw color drift detected:\n');
  for (const violation of violations) {
    console.error(`- ${path.relative(rootDir, violation.filePath)}:${violation.line} ${violation.message}`);
  }
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
