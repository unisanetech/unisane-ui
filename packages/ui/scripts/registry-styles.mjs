import { readFile } from 'node:fs/promises';
import { getAvailableThemeNames } from '../../tokens/scripts/tokens-build/build-pipeline.mjs';
import { loadThemeConfig } from '../../tokens/scripts/tokens-build/theme-config.mjs';
import {
  generateMergedTokenCss,
  generateThemeColorsSection,
} from '../../tokens/scripts/tokens-build/css-generators.mjs';

function stripPackageStylePreamble(sourceCss) {
  return sourceCss
    .replace(/^\/\* UI Package Styles[^\n]*\*\/\s*/u, '')
    .replace(/^@import\s+['"]tailwindcss['"];\s*/mu, '')
    .replace(/^@import\s+['"]@unisane\/tokens\/unisane\.css['"];\s*/mu, '')
    .replace(/^\/\* Scan component files[^\n]*\*\/\s*@source\s+[^;]+;\s*/mu, '')
    .trim();
}

export async function generateRegistryStyleArtifacts(sourceStylePath) {
  const sourceCss = await readFile(sourceStylePath, 'utf8');
  const runtimeCss = stripPackageStylePreamble(sourceCss);
  const defaultCss = generateMergedTokenCss(loadThemeConfig('blue'));
  const globalsCss = `/* Unisane UI local runtime baseline. App overrides belong below this block. */
@import "tailwindcss";
@source "../**/*.{ts,tsx,mdx}";

${defaultCss.trim()}

${runtimeCss}
`;
  const themes = new Map(
    getAvailableThemeNames().map((themeName) => [
      themeName,
      generateThemeColorsSection(loadThemeConfig(themeName)),
    ]),
  );

  return { globalsCss, themes };
}
