import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateBuildArtifacts, writeBuildArtifacts } from '../build-pipeline.mjs';
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

function assertBlockHasVar(css, selector, variableName, expectedValue) {
  const block = getCssBlock(css, selector);
  const pattern = new RegExp(`${escapeRegExp(variableName)}:\\s*${escapeRegExp(expectedValue)};`);
  assert.match(block, pattern, `Expected ${selector} to include ${variableName}: ${expectedValue}`);
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

  const expected = readFileSync(blueSnapshotPath, 'utf-8');
  assert.equal(mergedCss, expected);
});

test('artifact calculation writes only through the explicit build owner', () => {
  const outputRoot = mkdtempSync(join(tmpdir(), 'unisane-tokens-'));
  try {
    const artifacts = generateBuildArtifacts('blue');
    const cssPath = join(outputRoot, 'dist', 'unisane.css');
    const refPath = join(outputRoot, 'src', 'ref.json');

    writeBuildArtifacts(artifacts, { cssPath, refPath });

    assert.equal(readFileSync(cssPath, 'utf8'), artifacts.mergedCss);
    assert.deepEqual(JSON.parse(readFileSync(refPath, 'utf8')), artifacts.palettes);
  } finally {
    rmSync(outputRoot, { recursive: true, force: true });
  }
});

test('cyan theme build output differs from blue and uses hue 195', () => {
  const { mergedCss: blueCss } = generateBuildArtifacts('blue');
  const { mergedCss: cyanCss } = generateBuildArtifacts('cyan');

  assert.notEqual(cyanCss, blueCss);
  assertBlockHasVar(
    cyanCss,
    ':root[data-color-theme="cyan"],\n[data-theme-scope][data-color-theme="cyan"]',
    '--hue',
    '195',
  );
});

test('merged CSS includes all required sections', () => {
  const { mergedCss } = generateBuildArtifacts('blue');

  assert.match(mergedCss, /@layer unisane-defaults/);
  assert.match(mergedCss, /@theme(?:\s+inline)?\s*\{/);
  assert.match(mergedCss, /SHARED RUNTIME UTILITIES/);
  assert.match(mergedCss, /\.duration-short\s*\{/);
});

test('color theme presets expose the expected hue and chroma overrides', () => {
  const { mergedCss } = generateBuildArtifacts('blue');

  assertBlockHasVar(
    mergedCss,
    ':root[data-color-theme="blue"],\n[data-theme-scope][data-color-theme="blue"]',
    '--hue',
    '230',
  );
  assertBlockHasVar(
    mergedCss,
    ':root[data-color-theme="blue"],\n[data-theme-scope][data-color-theme="blue"]',
    '--chroma',
    '0.15',
  );
  assertBlockHasVar(
    mergedCss,
    ':root[data-color-theme="green"],\n[data-theme-scope][data-color-theme="green"]',
    '--hue',
    '145',
  );
  assertBlockHasVar(
    mergedCss,
    ':root[data-color-theme="green"],\n[data-theme-scope][data-color-theme="green"]',
    '--chroma',
    '0.14',
  );
  assertBlockHasVar(
    mergedCss,
    ':root[data-color-theme="red"],\n[data-theme-scope][data-color-theme="red"]',
    '--hue',
    '15',
  );
  assertBlockHasVar(
    mergedCss,
    ':root[data-color-theme="orange"],\n[data-theme-scope][data-color-theme="orange"]',
    '--hue',
    '45',
  );
  assertBlockHasVar(
    mergedCss,
    ':root[data-color-theme="neutral"],\n[data-theme-scope][data-color-theme="neutral"]',
    '--chroma',
    '0.06',
  );
  assertBlockHasVar(
    mergedCss,
    ':root[data-color-theme="neutral"],\n[data-theme-scope][data-color-theme="neutral"]',
    '--chroma-neutral',
    '0.008',
  );
  assertBlockHasVar(
    mergedCss,
    ':root[data-color-theme="neutral"],\n[data-theme-scope][data-color-theme="neutral"]',
    '--chroma-status-scale',
    '0.75',
  );
  assertBlockHasVar(
    mergedCss,
    ':root[data-color-theme="black"],\n[data-theme-scope][data-color-theme="black"]',
    '--chroma',
    '0',
  );
  assertBlockHasVar(
    mergedCss,
    ':root[data-color-theme="black"],\n[data-theme-scope][data-color-theme="black"]',
    '--chroma-neutral',
    '0',
  );
  assertBlockHasVar(
    mergedCss,
    ':root[data-color-theme="black"],\n[data-theme-scope][data-color-theme="black"]',
    '--chroma-status-scale',
    '0',
  );
});

test('scheme modifiers adjust chroma independently from tone mappings', () => {
  const { mergedCss } = generateBuildArtifacts('blue');

  assertBlockHasVar(mergedCss, '[data-scheme="neutral"]', '--chroma', '0.03');
  assertBlockHasVar(mergedCss, '[data-scheme="neutral"]', '--chroma-neutral', '0.008');
  assertBlockHasVar(mergedCss, '[data-scheme="neutral"]', '--chroma-status-scale', '0.7');
  assertBlockHasVar(mergedCss, '[data-scheme="monochrome"]', '--chroma', '0');
  assertBlockHasVar(mergedCss, '[data-scheme="monochrome"]', '--chroma-neutral', '0');
  assertBlockHasVar(mergedCss, '[data-scheme="monochrome"]', '--chroma-status-scale', '0');
});

test('contrast modifiers remap semantic tones for light and dark contexts', () => {
  const { mergedCss } = generateBuildArtifacts('blue');

  assertBlockHasVar(
    mergedCss,
    '[data-contrast="medium"]',
    '--tone-primary',
    'var(--ref-primary-30)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="medium"]',
    '--tone-secondary-container',
    'var(--ref-secondary-95)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="medium"]',
    '--tone-tertiary',
    'var(--ref-tertiary-30)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="medium"]',
    '--tone-tertiary-container',
    'var(--ref-tertiary-95)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="medium"]',
    '--tone-success',
    'var(--ref-success-30)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="medium"]',
    '--tone-warning',
    'var(--ref-warning-30)',
  );
  assertBlockHasVar(mergedCss, '[data-contrast="medium"]', '--tone-info', 'var(--ref-info-30)');
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="medium"]',
    '--tone-on-surface-variant',
    'var(--ref-neutral-variant-24)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="medium"]',
    '--tone-surface-variant',
    'var(--ref-neutral-variant-92)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="medium"]',
    '--tone-outline',
    'var(--ref-neutral-variant-30)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="medium"]',
    '--tone-outline-variant',
    'var(--ref-neutral-variant-40)',
  );
  assertBlockHasVar(mergedCss, '[data-contrast="high"]', '--tone-primary', 'var(--ref-primary-20)');
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="high"]',
    '--tone-tertiary-container',
    'var(--ref-tertiary-95)',
  );
  assertBlockHasVar(mergedCss, '[data-contrast="high"]', '--tone-success', 'var(--ref-success-20)');
  assertBlockHasVar(mergedCss, '[data-contrast="high"]', '--tone-warning', 'var(--ref-warning-20)');
  assertBlockHasVar(mergedCss, '[data-contrast="high"]', '--tone-info', 'var(--ref-info-20)');
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="high"]',
    '--tone-on-surface',
    'var(--ref-neutral-0)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="high"]',
    '--tone-on-surface-variant',
    'var(--ref-neutral-variant-20)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="high"]',
    '--tone-surface-variant',
    'var(--ref-neutral-variant-95)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-contrast="high"]',
    '--tone-outline-variant',
    'var(--ref-neutral-variant-40)',
  );
  assertBlockHasVar(
    mergedCss,
    '.dark[data-contrast="high"],\n[data-contrast="high"].dark,\n[data-theme-scope="dark"][data-contrast="high"]',
    '--tone-primary',
    'var(--ref-primary-95)',
  );
  assertBlockHasVar(
    mergedCss,
    '.dark[data-contrast="medium"],\n[data-contrast="medium"].dark,\n[data-theme-scope="dark"][data-contrast="medium"]',
    '--tone-secondary-container',
    'var(--ref-secondary-30)',
  );
  assertBlockHasVar(
    mergedCss,
    '.dark[data-contrast="medium"],\n[data-contrast="medium"].dark,\n[data-theme-scope="dark"][data-contrast="medium"]',
    '--tone-tertiary',
    'var(--ref-tertiary-80)',
  );
  assertBlockHasVar(
    mergedCss,
    '.dark[data-contrast="medium"],\n[data-contrast="medium"].dark,\n[data-theme-scope="dark"][data-contrast="medium"]',
    '--tone-tertiary-container',
    'var(--ref-tertiary-30)',
  );
  assertBlockHasVar(
    mergedCss,
    '.dark[data-contrast="medium"],\n[data-contrast="medium"].dark,\n[data-theme-scope="dark"][data-contrast="medium"]',
    '--tone-outline-variant',
    'var(--ref-neutral-variant-50)',
  );
  assertBlockHasVar(
    mergedCss,
    '.dark[data-contrast="high"],\n[data-contrast="high"].dark,\n[data-theme-scope="dark"][data-contrast="high"]',
    '--tone-success',
    'var(--ref-success-95)',
  );
  assertBlockHasVar(
    mergedCss,
    '.dark[data-contrast="high"],\n[data-contrast="high"].dark,\n[data-theme-scope="dark"][data-contrast="high"]',
    '--tone-warning',
    'var(--ref-warning-95)',
  );
  assertBlockHasVar(
    mergedCss,
    '.dark[data-contrast="high"],\n[data-contrast="high"].dark,\n[data-theme-scope="dark"][data-contrast="high"]',
    '--tone-info',
    'var(--ref-info-95)',
  );
  assertBlockHasVar(
    mergedCss,
    '.dark[data-contrast="high"],\n[data-contrast="high"].dark,\n[data-theme-scope="dark"][data-contrast="high"]',
    '--tone-tertiary-container',
    'var(--ref-tertiary-10)',
  );
  assertBlockHasVar(
    mergedCss,
    '.dark[data-contrast="high"],\n[data-contrast="high"].dark,\n[data-theme-scope="dark"][data-contrast="high"]',
    '--tone-surface',
    'var(--ref-neutral-8)',
  );
  assertBlockHasVar(
    mergedCss,
    '.dark[data-contrast="high"],\n[data-contrast="high"].dark,\n[data-theme-scope="dark"][data-contrast="high"]',
    '--tone-on-surface',
    'var(--ref-neutral-100)',
  );
});

test('density, radius, and elevation axes expose the expected scaling variables', () => {
  const { mergedCss } = generateBuildArtifacts('blue');

  assertBlockHasVar(mergedCss, '[data-density="compact"]', '--scale-space-density', '0.875');
  assertBlockHasVar(mergedCss, '[data-density="dense"]', '--scale-type-density', '0.85');
  assertBlockHasVar(mergedCss, '[data-density="comfortable"]', '--scale-space-density', '1.1');

  assertBlockHasVar(mergedCss, '[data-radius="none"]', '--scale-radius-theme', '0');
  assertBlockHasVar(mergedCss, '[data-radius="soft"]', '--scale-radius-theme', '1.25');

  assertBlockHasVar(mergedCss, '[data-elevation="flat"]', '--shadow-opacity', '0');
  assertBlockHasVar(mergedCss, '[data-elevation="subtle"]', '--shadow-opacity', '0.25');
  assertBlockHasVar(mergedCss, '[data-elevation="standard"]', '--shadow-opacity', '0.5');
  assertBlockHasVar(mergedCss, '[data-elevation="pronounced"]', '--shadow-opacity', '1');
  assert.match(mergedCss, /--icon-md:\s*24px;/);
  assert.match(mergedCss, /--size-action-md:\s*calc\(40px \* var\(--scale-space\)\);/);
  assert.match(mergedCss, /--size-fab-md:\s*calc\(56px \* var\(--scale-space\)\);/);
  assert.match(mergedCss, /--size-avatar-md:\s*calc\(40px \* var\(--scale-space\)\);/);
  assert.match(mergedCss, /--size-pagination-button:\s*calc\(48px \* var\(--scale-space\)\);/);
});

test('responsive role tokens compose with theme scaling and Tailwind utilities', () => {
  const { mergedCss } = generateBuildArtifacts('blue');

  assertBlockHasVar(
    mergedCss,
    ':root,\n[data-theme-scope]',
    '--scale-space',
    'calc(var(--scale-space-density) * var(--scale-space-viewport))',
  );
  assertBlockHasVar(
    mergedCss,
    ':root,\n[data-theme-scope]',
    '--scale-type',
    'calc(var(--scale-type-density) * var(--scale-type-user) * var(--scale-type-viewport))',
  );
  assert.match(
    mergedCss,
    /--type-role-hero-title-size:\s*clamp\(calc\(36px \* var\(--scale-type\)\), 8vw, calc\(57px \* var\(--scale-type\)\)\);/,
  );
  assert.match(mergedCss, /--type-role-section-title-tracking:\s*0;/);
  assert.match(
    mergedCss,
    /--layout-page-x:\s*clamp\(calc\(var\(--unit\) \* 4\), 4vw, calc\(var\(--unit\) \* 10\)\);/,
  );
  assert.match(mergedCss, /--spacing-layout-page-x:\s*var\(--layout-page-x\);/);
  assert.match(mergedCss, /--spacing-layout-grid-gap:\s*var\(--layout-grid-gap\);/);
  assert.match(mergedCss, /--text-role-hero-title:\s*var\(--type-role-hero-title-size\);/);
  assert.match(
    mergedCss,
    /--text-role-card-title--font-weight:\s*var\(--type-role-card-title-weight\);/,
  );
});

test('dark mode remaps tone layers for both media-query and class-driven activation', () => {
  const { mergedCss } = generateBuildArtifacts('blue');

  assertBlockHasVar(
    mergedCss,
    '[data-theme-scope="light"]',
    '--tone-surface',
    'var(--ref-neutral-100)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-theme-scope="light"]',
    '--tone-on-surface',
    'var(--ref-neutral-10)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-theme-scope="dark"]',
    '--tone-surface',
    'var(--ref-neutral-8)',
  );
  assertBlockHasVar(
    mergedCss,
    '[data-theme-scope="dark"]',
    '--tone-on-surface',
    'var(--ref-neutral-90)',
  );
  assert.match(
    mergedCss,
    /@media \(prefers-color-scheme: dark\)\s*\{[\s\S]*?:root:not\(\.light\)\s*\{[\s\S]*?--tone-primary:\s*var\(--ref-primary-80\);/,
  );
  assertBlockHasVar(mergedCss, '.dark', '--tone-surface', 'var(--ref-neutral-8)');
  assertBlockHasVar(mergedCss, '.dark', '--tone-surface-container-lowest', 'var(--ref-neutral-8)');
  assertBlockHasVar(mergedCss, '.dark', '--tone-surface-container-low', 'var(--ref-neutral-10)');
  assertBlockHasVar(mergedCss, '.dark', '--tone-surface-container', 'var(--ref-neutral-17)');
  assertBlockHasVar(mergedCss, '.dark', '--tone-surface-container-high', 'var(--ref-neutral-22)');
  assertBlockHasVar(
    mergedCss,
    '.dark',
    '--tone-surface-container-highest',
    'var(--ref-neutral-24)',
  );
  assertBlockHasVar(mergedCss, '.dark', '--tone-on-surface', 'var(--ref-neutral-90)');
  assertBlockHasVar(mergedCss, '.dark', '--tone-secondary-container', 'var(--ref-secondary-30)');
  assertBlockHasVar(mergedCss, '.dark', '--tone-outline-variant', 'var(--ref-neutral-variant-40)');
  assertBlockHasVar(mergedCss, '.dark', '--tone-success', 'var(--ref-success-80)');
  assertBlockHasVar(mergedCss, '.dark', '--tone-warning', 'var(--ref-warning-80)');
  assertBlockHasVar(mergedCss, '.dark', '--tone-info', 'var(--ref-info-80)');
});

test('status semantic colors are generated through reference palettes and tone mappings', () => {
  const { mergedCss } = generateBuildArtifacts('blue');

  assert.match(mergedCss, /--ref-success-40:\s*oklch\(/);
  assert.match(mergedCss, /--ref-warning-40:\s*oklch\(/);
  assert.match(mergedCss, /--ref-info-40:\s*oklch\(/);
  assert.match(mergedCss, /--chroma-status-scale:\s*1;/);
  assert.match(mergedCss, /--color-success:\s*var\(--tone-success\);/);
  assert.match(mergedCss, /--color-warning:\s*var\(--tone-warning\);/);
  assert.match(mergedCss, /--color-info:\s*var\(--tone-info\);/);
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
