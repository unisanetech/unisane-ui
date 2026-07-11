import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { srcDir, distDir } from './paths.mjs';
import { loadThemeConfig } from './theme-config.mjs';
import { generatePalettes } from './palette.mjs';
import { generateMergedTokenCss } from './css-generators.mjs';

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

  console.log('✓ Generated unisane.css (tokens + @theme mapping + shared runtime utilities)');
  console.log('\nDone! Import in your app:');
  console.log('  @import "@unisane/tokens/unisane.css";');
  console.log(
    '\nNote: Base styles (animations, focus rings, utilities) are in @unisane/ui core/src/styles.css',
  );

  return { config, palettes };
}

export function generateBuildArtifacts(themeName = 'blue') {
  const config = loadThemeConfig(themeName);
  const palettes = generatePalettes(config);
  const mergedCss = generateMergedTokenCss(config);

  return { config, palettes, mergedCss };
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
