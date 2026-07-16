import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { srcDir, distDir } from './paths.mjs';
import { loadThemeConfig } from './theme-config.mjs';
import { generatePalettes } from './palette.mjs';
import { generateMergedTokenCss } from './css-generators.mjs';
import { generateThemeColorsSection, generateThemePreviewSection } from './css-generators.mjs';

function getThemeName(argv) {
  return argv.find((arg) => arg.startsWith('--theme='))?.split('=')[1] || 'blue';
}

function isWatchMode(argv) {
  return argv.includes('--watch');
}

export function buildTokens(themeName = 'blue') {
  const artifacts = generateBuildArtifacts(themeName);
  const { config, palettes } = artifacts;

  console.log(`Building Unisane tokens for "${config.name}" theme...`);
  console.log(`  Primary: hue=${config.primary.hue}°, chroma=${config.primary.chroma}`);

  writeBuildArtifacts(artifacts);
  writeThemeArtifacts();

  console.log('✓ Generated unisane.css and replace-in-place semantic theme assets');
  console.log('\nDone! The UI package and registry generator consume these authoring artifacts.');

  return { config, palettes };
}

export function generateBuildArtifacts(themeName = 'blue') {
  const config = loadThemeConfig(themeName);
  const palettes = generatePalettes(config);
  const mergedCss = generateMergedTokenCss(config);
  const themeCss = generateThemeColorsSection(config);

  return { config, palettes, mergedCss, themeCss };
}

export function writeBuildArtifacts(
  { palettes, mergedCss },
  { cssPath = join(distDir, 'unisane.css'), refPath = join(srcDir, 'ref.json') } = {},
) {
  mkdirSync(dirname(cssPath), { recursive: true });
  mkdirSync(dirname(refPath), { recursive: true });
  writeFileSync(cssPath, mergedCss);
  writeFileSync(refPath, `${JSON.stringify(palettes, null, 2)}\n`);
}

export function getAvailableThemeNames() {
  return readdirSync(join(srcDir, 'themes'))
    .filter((file) => file.endsWith('.json') && !file.endsWith('.schema.json'))
    .map((file) => file.slice(0, -'.json'.length))
    .sort();
}

export function writeThemeArtifacts({ themesDir = join(distDir, 'themes') } = {}) {
  mkdirSync(themesDir, { recursive: true });
  let previewCss = `/* Generated runtime theme matrix for the Unisane documentation workbench only. */\n`;
  for (const themeName of getAvailableThemeNames()) {
    const { config, themeCss } = generateBuildArtifacts(themeName);
    writeFileSync(join(themesDir, `${themeName}.css`), themeCss);
    previewCss += generateThemePreviewSection(config, themeName);
  }
  writeFileSync(join(dirname(themesDir), 'preview-themes.css'), previewCss);
}

export async function runBuildFromArgv(argv = process.argv.slice(2)) {
  const themeName = getThemeName(argv);
  buildTokens(themeName);

  if (!isWatchMode(argv)) {
    return;
  }

  console.log('Watching for changes...');
  const chokidar = await import('chokidar');
  const watcher = chokidar.watch([join(srcDir, '**/*.json')]);

  watcher.on('change', (filePath) => {
    console.log(`File changed: ${filePath}`);
    buildTokens(themeName);
  });
}
