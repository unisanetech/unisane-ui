import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  generateBuildArtifacts,
  getAvailableThemeNames,
  writeBuildArtifacts,
  writeThemeArtifacts,
} from '../build-pipeline.mjs';
import { validateThemeConfig, validateThemeOverride } from '../theme-validation.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const snapshotsDir = join(__dirname, '..', '__snapshots__');
const blueSnapshotPath = join(snapshotsDir, 'blue.unisane.css');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getCssBlock(css, selector) {
  const pattern = new RegExp(`${escapeRegExp(selector)}\\s*\\{([\\s\\S]*?)\\}`, 'm');
  const match = css.match(pattern);
  assert.ok(match, `Expected CSS block for selector: ${selector}`);
  return match[1];
}

function assertBlockHasVar(css, selector, variableName) {
  assert.match(getCssBlock(css, selector), new RegExp(`${escapeRegExp(variableName)}:\\s*[^;]+;`));
}

function syncSnapshot(filePath, content) {
  if (process.env.UPDATE_SNAPSHOTS === '1') {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content);
  }
}

test('blue theme CSS matches snapshot', () => {
  const { mergedCss } = generateBuildArtifacts('blue');
  syncSnapshot(blueSnapshotPath, mergedCss);
  assert.equal(mergedCss, readFileSync(blueSnapshotPath, 'utf-8'));
});

test('consumer CSS exposes semantic roles without palette, tone, or runtime theme internals', () => {
  const { mergedCss } = generateBuildArtifacts('blue');

  assert.match(mergedCss, /\/\* unisane:theme:start \*\//);
  assert.match(mergedCss, /\/\* unisane:theme:end \*\//);
  assert.match(mergedCss, /--color-primary:\s*#[0-9a-f]{6};/i);
  assert.match(mergedCss, /--color-surface:\s*#[0-9a-f]{6};/i);
  assert.doesNotMatch(mergedCss, /--(?:ref|tone)-/);
  assert.doesNotMatch(mergedCss, /--(?:hue|chroma)(?:-|:)/);
  assert.doesNotMatch(mergedCss, /data-(?:color-theme|scheme)|data-theme-scope/);
});

test('theme presets replace semantic values instead of adding selectors', () => {
  const blue = generateBuildArtifacts('blue');
  const cyan = generateBuildArtifacts('cyan');

  assert.notEqual(cyan.themeCss, blue.themeCss);
  assertBlockHasVar(blue.themeCss, ':root', '--color-primary');
  assertBlockHasVar(cyan.themeCss, ':root', '--color-primary');
  assert.doesNotMatch(cyan.themeCss, /data-color-theme/);
  assert.deepEqual(getAvailableThemeNames(), [
    'black',
    'blue',
    'cyan',
    'green',
    'neutral',
    'orange',
    'pink',
    'purple',
    'red',
    'yellow',
  ]);
});

test('artifact calculation writes through explicit CSS, palette, and theme owners', () => {
  const outputRoot = mkdtempSync(join(tmpdir(), 'unisane-tokens-'));
  try {
    const artifacts = generateBuildArtifacts('blue');
    const cssPath = join(outputRoot, 'dist', 'unisane.css');
    const refPath = join(outputRoot, 'src', 'ref.json');
    const themesDir = join(outputRoot, 'dist', 'themes');

    writeBuildArtifacts(artifacts, { cssPath, refPath });
    writeThemeArtifacts({ themesDir });

    assert.equal(readFileSync(cssPath, 'utf8'), artifacts.mergedCss);
    assert.deepEqual(JSON.parse(readFileSync(refPath, 'utf8')), artifacts.palettes);
    for (const themeName of getAvailableThemeNames()) {
      assert.match(readFileSync(join(themesDir, `${themeName}.css`), 'utf8'), /--color-primary:/);
    }
  } finally {
    rmSync(outputRoot, { recursive: true, force: true });
  }
});

test('runtime preference axes remain available without runtime color presets', () => {
  const { mergedCss } = generateBuildArtifacts('blue');

  assert.match(mergedCss, /\[data-density="compact"\]/);
  assert.match(mergedCss, /\[data-radius="soft"\]/);
  assert.match(mergedCss, /\[data-elevation="flat"\]/);
  assert.match(mergedCss, /\[data-contrast="high"\]/);
  assert.match(mergedCss, /--scale-space-density:\s*0\.875;/);
});

test('dark and contrast modes directly replace semantic roles', () => {
  const { mergedCss } = generateBuildArtifacts('blue');

  assertBlockHasVar(mergedCss, '.dark', '--color-surface');
  assertBlockHasVar(mergedCss, '[data-contrast="medium"]', '--color-primary');
  assertBlockHasVar(mergedCss, '[data-contrast="high"]', '--color-on-surface');
  assert.match(
    mergedCss,
    /@media \(prefers-color-scheme: dark\)[\s\S]*?:root:not\(\.light\)[\s\S]*?--color-primary:/,
  );
});

test('foundation, Tailwind, status, and runtime utility contracts remain present', () => {
  const { mergedCss } = generateBuildArtifacts('blue');

  assert.match(mergedCss, /--color-success:\s*#[0-9a-f]{6};/i);
  assert.match(mergedCss, /--color-warning:\s*#[0-9a-f]{6};/i);
  assert.match(mergedCss, /--color-info:\s*#[0-9a-f]{6};/i);
  assert.match(mergedCss, /--type-role-hero-title-size:/);
  assert.match(mergedCss, /--layout-page-x:/);
  assert.match(mergedCss, /@theme(?:\s+inline)?\s*\{/);
  assert.match(mergedCss, /\.duration-short\s*\{/);
});

test('theme config validation rejects unknown keys', () => {
  assert.throws(
    () =>
      validateThemeConfig(
        {
          name: 'Invalid',
          primary: { hue: 230, chroma: 0.15 },
          secondary: { strategy: 'analogous', hueShift: 12, chromaScale: 0.45 },
          tertiary: { strategy: 'complementary', hueShift: 60, chromaScale: 0.7 },
          neutral: { tintFromPrimary: 0.012 },
          error: { hue: 25, chroma: 0.18 },
          success: { hue: 145, chroma: 0.18 },
          warning: { hue: 85, chroma: 0.16 },
          info: { hue: 245, chroma: 0.16 },
          unknown: true,
        },
        'inline-config.json',
      ),
    /\$\.unknown is not allowed/,
  );
});

test('theme override validation enforces schema reference when provided', () => {
  assert.throws(
    () =>
      validateThemeOverride(
        {
          $schema: './wrong.schema.json',
          name: 'Bad Override',
          primary: { hue: 195 },
        },
        'inline-override.json',
      ),
    /\$schema must equal "\.\/theme-override\.schema\.json"/,
  );
});
