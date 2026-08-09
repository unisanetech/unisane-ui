#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

const allowedDurationUtilities = new Set([
  'duration-short',
  'duration-snappy',
  'duration-medium',
  'duration-emphasized',
  'duration-long',
]);

const allowedEaseUtilities = new Set([
  'ease-standard',
  'ease-emphasized',
  'ease-decelerate',
  'ease-accelerate',
  'ease-in',
  'ease-out',
  'ease-linear',
]);

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

    if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function lineNumberForIndex(content, index) {
  return content.slice(0, index).split('\n').length;
}

function addViolation(filePath, line, message) {
  violations.push({
    filePath,
    line,
    message,
  });
}

function checkBannedPropPatterns(filePath, content) {
  const relativePath = path.relative(rootDir, filePath);
  const isAppearanceOwner = relativePath === 'src/layout/appearance-provider.tsx';

  const patterns = [
    {
      regex: /\bslots\??\s*:/g,
      message: "Use props-first or compound-component APIs instead of a 'slots' prop.",
    },
    {
      regex: /\bslotProps\??\s*:/g,
      message: "Use props-first or compound-component APIs instead of a 'slotProps' prop.",
    },
    {
      regex: /\bshowSupportingMobile\b/g,
      message:
        "Legacy supporting-pane prop 'showSupportingMobile' is no longer part of the contract.",
    },
    {
      regex: /\bonToggleSupporting\b/g,
      message:
        "Legacy supporting-pane prop 'onToggleSupporting' is no longer part of the contract.",
    },
  ];

  if (!isAppearanceOwner) {
    patterns.push({
      regex: /\bdensity\??\s*:/g,
      message:
        "Component-local 'density' props are not allowed. Use global theme density and component 'size' instead.",
    });
  }

  for (const { regex, message } of patterns) {
    for (const match of content.matchAll(regex)) {
      addViolation(filePath, lineNumberForIndex(content, match.index ?? 0), message);
    }
  }
}

function checkMotionUtilities(filePath, content) {
  const durationPattern = /(^|[\s"'`])((?:[A-Za-z0-9_-]+:)*duration-[a-z0-9-]+)/gm;
  const easePattern = /(^|[\s"'`])((?:[A-Za-z0-9_-]+:)*ease-[a-z0-9-]+)/gm;

  for (const match of content.matchAll(durationPattern)) {
    const token = match[2];
    const baseToken = token.split(':').pop();

    if (baseToken && !allowedDurationUtilities.has(baseToken)) {
      addViolation(
        filePath,
        lineNumberForIndex(content, match.index ?? 0),
        `Undocumented motion utility '${baseToken}'. Use the published Unisane duration utilities only.`,
      );
    }
  }

  for (const match of content.matchAll(easePattern)) {
    const token = match[2];
    const baseToken = token.split(':').pop();

    if (baseToken && !allowedEaseUtilities.has(baseToken)) {
      addViolation(
        filePath,
        lineNumberForIndex(content, match.index ?? 0),
        `Undocumented motion utility '${baseToken}'. Use the published Unisane easing utilities only.`,
      );
    }
  }
}

async function main() {
  const files = await getSourceFiles(srcDir);

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf8');
    checkBannedPropPatterns(filePath, content);
    checkMotionUtilities(filePath, content);
  }

  if (violations.length === 0) {
    console.log('Component contract check passed.');
    return;
  }

  console.error('Component contract drift detected:\n');
  for (const violation of violations) {
    console.error(
      `- ${path.relative(rootDir, violation.filePath)}:${violation.line} ${violation.message}`,
    );
  }
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
