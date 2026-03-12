import { generateCoreTokensSection } from "./sections/core-tokens.mjs";
import { generateDarkModeSection } from "./sections/dark-mode.mjs";
import { generateColorThemesAndAxesSection } from "./sections/color-themes-and-axes.mjs";
import { generateScrollbarSection } from "./sections/scrollbar.mjs";
import { generateTailwindTheme as generateTailwindThemeSection } from "./sections/tailwind-theme.mjs";
import { generateSharedRuntimeUtilities as generateRuntimeUtilitiesSection } from "./sections/runtime-utilities.mjs";

export function generateUniTokens(config) {
  return [
    generateCoreTokensSection(config),
    generateDarkModeSection(),
    generateColorThemesAndAxesSection(),
    generateScrollbarSection(),
  ].join("");
}

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
