import type {
  ActionShape,
  ColorScheme,
  ColorTheme,
  ContrastLevel,
  Density,
  Elevation,
  RadiusTheme,
  Theme,
  ThemeConfig,
} from "@unisane/ui";

export const DOCS_THEME_COOKIE = "unisane-docs-theme";
export const LEGACY_THEME_STORAGE_KEY = "unisane-theme";

export const DOCS_DEFAULT_THEME = {
  density: "standard",
  radius: "standard",
  actionShape: "standard",
  scheme: "tonal",
  contrast: "standard",
  elevation: "subtle",
  colorTheme: "blue",
  theme: "system",
} satisfies Required<ThemeConfig> & { theme: Theme };

export type DocsThemeState = Required<ThemeConfig> & { theme: Theme };

const VALID_DENSITIES: readonly Density[] = ["compact", "standard", "comfortable", "dense"];
const VALID_THEMES: readonly Theme[] = ["light", "dark", "system"];
const VALID_RADII: readonly RadiusTheme[] = ["none", "minimal", "sharp", "standard", "soft"];
const VALID_ACTION_SHAPES: readonly ActionShape[] = ["standard", "full"];
const VALID_SCHEMES: readonly ColorScheme[] = ["tonal", "monochrome", "neutral"];
const VALID_CONTRASTS: readonly ContrastLevel[] = ["standard", "medium", "high"];
const VALID_COLOR_THEMES: readonly ColorTheme[] = [
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "black",
  "neutral",
];
const VALID_ELEVATIONS: readonly Elevation[] = ["flat", "subtle", "standard", "pronounced"];

function isValid<T>(value: unknown, validValues: readonly T[]): value is T {
  return validValues.includes(value as T);
}

function parseThemeCookieValue(raw: string | undefined): Record<string, unknown> {
  if (!raw) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return parsed as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function resolveDocsThemeState(cookieValue?: string): DocsThemeState {
  const parsed = parseThemeCookieValue(cookieValue);

  return {
    density: isValid(parsed.density, VALID_DENSITIES)
      ? parsed.density
      : DOCS_DEFAULT_THEME.density,
    radius: isValid(parsed.radius, VALID_RADII)
      ? parsed.radius
      : DOCS_DEFAULT_THEME.radius,
    actionShape: isValid(parsed.actionShape, VALID_ACTION_SHAPES)
      ? parsed.actionShape
      : DOCS_DEFAULT_THEME.actionShape,
    scheme: isValid(parsed.scheme, VALID_SCHEMES)
      ? parsed.scheme
      : DOCS_DEFAULT_THEME.scheme,
    contrast: isValid(parsed.contrast, VALID_CONTRASTS)
      ? parsed.contrast
      : DOCS_DEFAULT_THEME.contrast,
    elevation: isValid(parsed.elevation, VALID_ELEVATIONS)
      ? parsed.elevation
      : DOCS_DEFAULT_THEME.elevation,
    colorTheme: isValid(parsed.colorTheme, VALID_COLOR_THEMES)
      ? parsed.colorTheme
      : DOCS_DEFAULT_THEME.colorTheme,
    theme: isValid(parsed.theme, VALID_THEMES)
      ? parsed.theme
      : DOCS_DEFAULT_THEME.theme,
  };
}

export function serializeDocsThemeState(themeState: DocsThemeState): string {
  return encodeURIComponent(JSON.stringify(themeState));
}

export function getThemeBootstrapScript() {
  const validValues = {
    density: VALID_DENSITIES,
    theme: VALID_THEMES,
    radius: VALID_RADII,
    actionShape: VALID_ACTION_SHAPES,
    scheme: VALID_SCHEMES,
    contrast: VALID_CONTRASTS,
    colorTheme: VALID_COLOR_THEMES,
    elevation: VALID_ELEVATIONS,
  };

  return `
    (function () {
      var cookieName = ${JSON.stringify(DOCS_THEME_COOKIE)};
      var legacyStorageKey = ${JSON.stringify(LEGACY_THEME_STORAGE_KEY)};
      var root = document.documentElement;
      var valid = ${JSON.stringify(validValues)};
      var keys = Object.keys(valid);

      function readCookie(name) {
        var escapedName = name.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&");
        var match = document.cookie.match(new RegExp("(^|; )" + escapedName + "=([^;]*)"));
        return match ? match[2] : "";
      }

      function applyThemeAttributes(themeState) {
        if (themeState.density) root.setAttribute("data-density", themeState.density);
        if (themeState.radius) root.setAttribute("data-radius", themeState.radius);
        if (themeState.actionShape) root.setAttribute("data-action-shape", themeState.actionShape);
        if (themeState.scheme) root.setAttribute("data-scheme", themeState.scheme);
        if (themeState.contrast) root.setAttribute("data-contrast", themeState.contrast);
        if (themeState.colorTheme) root.setAttribute("data-color-theme", themeState.colorTheme);
        if (themeState.theme) root.setAttribute("data-theme-mode", themeState.theme);
        if (themeState.elevation) root.setAttribute("data-elevation", themeState.elevation);
      }

      if (!readCookie(cookieName)) {
        try {
          var raw = localStorage.getItem(legacyStorageKey);
          if (raw) {
            var parsed = JSON.parse(raw);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
              var nextTheme = {};
              for (var i = 0; i < keys.length; i += 1) {
                var key = keys[i];
                var value = parsed[key];
                if (typeof value === "string" && valid[key].indexOf(value) !== -1) {
                  nextTheme[key] = value;
                }
              }
              applyThemeAttributes(nextTheme);
              document.cookie = cookieName + "=" + encodeURIComponent(JSON.stringify(nextTheme)) + "; path=/; max-age=31536000; samesite=lax";
            }
          }
        } catch {}
      }

      var themeMode = root.getAttribute("data-theme-mode") || "system";
      var resolved = themeMode === "dark"
        ? "dark"
        : themeMode === "light"
          ? "light"
          : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      root.classList.toggle("dark", resolved === "dark");
      root.style.colorScheme = resolved;
    })();
  `;
}
