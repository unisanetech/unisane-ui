import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { DEFAULT_THEME_CONFIG } from "./constants.mjs";
import { srcDir } from "./paths.mjs";
import { validateThemeConfig, validateThemeOverride } from "./theme-validation.mjs";

function parseJsonFile(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`[tokens:theme-config] Failed to parse JSON at ${filePath}: ${reason}`);
  }
}

export function loadThemeConfig(themeName = "blue") {
  const themePath = join(srcDir, "themes", `${themeName}.json`);
  const configPath = join(srcDir, "theme-config.json");

  const baseConfig = existsSync(configPath)
    ? parseJsonFile(configPath)
    : { ...DEFAULT_THEME_CONFIG };

  if (existsSync(configPath)) {
    validateThemeConfig(baseConfig, configPath);
  }

  if (existsSync(themePath)) {
    const themeOverride = parseJsonFile(themePath);
    validateThemeOverride(themeOverride, themePath);
    baseConfig.primary = { ...baseConfig.primary, ...themeOverride.primary };
    baseConfig.name = themeOverride.name || baseConfig.name;
  }

  validateThemeConfig(baseConfig, `${configPath} (resolved)`);

  return baseConfig;
}
