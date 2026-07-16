import { generateCoreTokensSection } from "./sections/core-tokens.mjs";
import { generateThemeColorsSection } from "./sections/semantic-colors.mjs";
import { generateRuntimeAxesSection } from "./sections/runtime-axes.mjs";
import { generateScrollbarSection } from "./sections/scrollbar.mjs";
import { generateTailwindTheme as generateTailwindThemeSection } from "./sections/tailwind-theme.mjs";
import { generateSharedRuntimeUtilities as generateRuntimeUtilitiesSection } from "./sections/runtime-utilities.mjs";

export function generateUniTokens(config) {
  return [
    generateThemeColorsSection(config),
    generateCoreTokensSection(config),
    generateRuntimeAxesSection(),
    generateScrollbarSection(),
  ].join("");
}

export { generateThemeColorsSection, generateThemePreviewSection } from "./sections/semantic-colors.mjs";

export function generateTailwindTheme() {
  return generateTailwindThemeSection();
}

export function generateSharedRuntimeUtilities() {
  return generateRuntimeUtilitiesSection();
}

export function generateMergedTokenCss(config) {
  return [
    generateUniTokens(config),
    generateTailwindTheme(),
    generateSharedRuntimeUtilities(),
  ].join("");
}
