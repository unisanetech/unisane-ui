import { CHROMA_SCALE, TONAL_LIGHTNESS } from "../../constants.mjs";

export function generateCoreTokensSection(config) {
  const primaryHue = config.primary.hue;
  const primaryChroma = config.primary.chroma;
  const secondaryChromaScale = config.secondary?.chromaScale ?? 0.7;
  const tertiaryHueShift = config.tertiary?.hueShift ?? 60;
  const tertiaryChromaScale = config.tertiary?.chromaScale ?? 0.7;
  const neutralTint = config.neutral?.tintFromPrimary ?? 0.012;
  const errorHue = config.error?.hue ?? 25;
  const errorChroma = config.error?.chroma ?? 0.18;

  let css = `/* ============================================================
   Unisane UI Design Tokens
   Generated from "${config.name}" theme using OKLCH color science
   ============================================================ */

/* ============================================================
   THEMING SYSTEM - Multiple ways to customize!
   ============================================================

   1. HUE - Change the primary color:
      :root { --hue: 145; }     // Green
      :root { --hue: 285; }     // Purple
      :root { --hue: 55; }      // Orange

      Available hues:
      Blue: 230 (default)  Green: 145   Cyan: 195
      Purple: 285          Orange: 55   Red: 25

   2. CHROMA - Adjust color intensity:
      :root { --chroma: 0.08; }  // Muted
      :root { --chroma: 0.18; }  // Vibrant

   3. SCHEME - Color strategy (via data attribute):
      <html data-scheme="tonal">       // Default - full color
      <html data-scheme="monochrome">  // Pure grayscale
      <html data-scheme="neutral">     // Low saturation, professional

   4. CONTRAST - Accessibility level (via data attribute):
      <html data-contrast="standard">  // Default
      <html data-contrast="medium">    // Boosted readability
      <html data-contrast="high">      // WCAG AAA compliant

   5. DARK MODE:
      <html class="dark">              // Manual dark mode
      // Or automatic via prefers-color-scheme

   6. DENSITY:
      <html data-density="compact">    // Tighter spacing
      <html data-density="comfortable">// More breathing room

   7. RADIUS:
      <html data-radius="sharp">       // Sharper corners
      <html data-radius="soft">        // Rounder corners

   COMBINING: All options can be combined!
      <html class="dark" data-scheme="neutral" data-contrast="high">
   ============================================================ */

/* Theme defaults layer - can be overridden by unlayered app CSS */
@layer unisane-defaults {
  :root {
    --hue: ${primaryHue};
    --chroma: ${primaryChroma};
  }
}

:root {

  /* Derived hues (auto-calculated) */
  --hue-secondary: var(--hue);
  --hue-tertiary: calc(var(--hue) + ${tertiaryHueShift});
  --hue-neutral: var(--hue);
  --hue-error: ${errorHue};

  /* Derived chromas */
  --chroma-secondary: calc(var(--chroma) * ${secondaryChromaScale});
  --chroma-tertiary: calc(var(--chroma) * ${tertiaryChromaScale});
  --chroma-neutral: ${neutralTint};
  --chroma-error: ${errorChroma};
`;

  // Generate OKLCH-based reference tokens
  // Use CSS calc() for runtime theming support
  const paletteConfigs = [
    { name: 'primary', hueVar: '--hue', chromaVar: '--chroma' },
    { name: 'secondary', hueVar: '--hue-secondary', chromaVar: '--chroma-secondary' },
    { name: 'tertiary', hueVar: '--hue-tertiary', chromaVar: '--chroma-tertiary' },
    { name: 'neutral', hueVar: '--hue-neutral', chromaVar: '--chroma-neutral' },
    { name: 'neutral-variant', hueVar: '--hue-neutral', chromaVar: '--chroma-neutral-variant' },
    { name: 'error', hueVar: '--hue-error', chromaVar: '--chroma-error' },
  ];

  css += `
  /* Neutral variant chroma (1.5x neutral) */
  --chroma-neutral-variant: calc(var(--chroma-neutral) * 1.5);
`;

  css += `\n  /* === REFERENCE PALETTES (auto-derived from --hue and --chroma) === */\n`;

  for (const { name, hueVar, chromaVar } of paletteConfigs) {
    css += `\n  /* ${name} */\n`;

    for (const [tone, lightness] of Object.entries(TONAL_LIGHTNESS)) {
      const chromaMultiplier = CHROMA_SCALE[tone];

      // Pure black and white for extremes
      if (tone === '0') {
        css += `  --ref-${name}-0: #000000;\n`;
      } else if (tone === '100') {
        css += `  --ref-${name}-100: #FFFFFF;\n`;
      } else {
        // Use calc() with CSS variable for runtime theming
        css += `  --ref-${name}-${tone}: oklch(${lightness} calc(var(${chromaVar}) * ${chromaMultiplier}) var(${hueVar}));\n`;
      }
    }
  }

  css += `

  /* === SCALING KNOBS === */
  --scale-space: 1;
  --scale-type: 1;
  /* Radius uses combined multiplier: density-radius × theme-radius */
  --scale-radius-density: 1;   /* Modified by data-density */
  --scale-radius-theme: 1;     /* Modified by data-radius */
  --scale-radius: calc(var(--scale-radius-density) * var(--scale-radius-theme));
  --unit: calc(4px * var(--scale-space));

  /* Pane Widths */
  --width-pane-list: 360px;
  --width-pane-fixed: 412px;
  --width-pane-supporting: 400px;
  --width-rail-collapsed: 80px;
  --width-drawer-compact: 360px;
  --width-navigation-drawer: 300px;

  /* === TONE MAPPING LAYER (Light Mode) ===
     Override these to remap which palette tones map to semantic colors.
     This enables special schemes (monochrome, high-contrast) without
     regenerating the entire palette. Just change the tone mappings! */

  /* Primary tone mapping (M3 standard: tone 40) */
  --tone-primary: var(--ref-primary-40);
  --tone-on-primary: var(--ref-primary-100);
  --tone-primary-container: var(--ref-primary-90);
  --tone-on-primary-container: var(--ref-primary-10);

  /* Secondary tone mapping */
  --tone-secondary: var(--ref-secondary-40);
  --tone-on-secondary: var(--ref-secondary-100);
  --tone-secondary-container: var(--ref-secondary-90);
  --tone-on-secondary-container: var(--ref-secondary-10);

  /* Tertiary tone mapping */
  --tone-tertiary: var(--ref-tertiary-40);
  --tone-on-tertiary: var(--ref-tertiary-100);
  --tone-tertiary-container: var(--ref-tertiary-90);
  --tone-on-tertiary-container: var(--ref-tertiary-10);

  /* Surface tone mapping
     Unisane uses surface as the canonical app/page canvas in light mode. */
  --tone-surface: var(--ref-neutral-100);
  --tone-on-surface: var(--ref-neutral-10);
  --tone-surface-container-lowest: var(--ref-neutral-100);
  --tone-surface-container-low: var(--ref-neutral-96);
  --tone-surface-container: var(--ref-neutral-94);
  --tone-surface-container-high: var(--ref-neutral-92);
  --tone-surface-container-highest: var(--ref-neutral-90);
  --tone-surface-variant: var(--ref-neutral-variant-90);
  --tone-on-surface-variant: var(--ref-neutral-variant-30);

  /* Background/outline tone mapping */
  --tone-background: var(--ref-neutral-100);
  --tone-on-background: var(--ref-neutral-10);
  --tone-outline: var(--ref-neutral-variant-60);
  --tone-outline-variant: var(--ref-neutral-variant-90);

  /* Error tone mapping */
  --tone-error: var(--ref-error-40);
  --tone-on-error: var(--ref-error-100);
  --tone-error-container: var(--ref-error-90);
  --tone-on-error-container: var(--ref-error-10);

  /* Inverse tone mapping */
  --tone-inverse-surface: var(--ref-neutral-20);
  --tone-inverse-on-surface: var(--ref-neutral-95);
  --tone-inverse-primary: var(--ref-primary-80);

  /* === SEMANTIC COLORS (reference tone mapping layer) === */
  --color-primary: var(--tone-primary);
  --color-on-primary: var(--tone-on-primary);
  --color-primary-container: var(--tone-primary-container);
  --color-on-primary-container: var(--tone-on-primary-container);

  --color-secondary: var(--tone-secondary);
  --color-on-secondary: var(--tone-on-secondary);
  --color-secondary-container: var(--tone-secondary-container);
  --color-on-secondary-container: var(--tone-on-secondary-container);

  --color-tertiary: var(--tone-tertiary);
  --color-on-tertiary: var(--tone-on-tertiary);
  --color-tertiary-container: var(--tone-tertiary-container);
  --color-on-tertiary-container: var(--tone-on-tertiary-container);

  --color-surface: var(--tone-surface);
  --color-on-surface: var(--tone-on-surface);
  --color-surface-container-lowest: var(--tone-surface-container-lowest);
  --color-surface-container-low: var(--tone-surface-container-low);
  --color-surface-container: var(--tone-surface-container);
  --color-surface-container-high: var(--tone-surface-container-high);
  --color-surface-container-highest: var(--tone-surface-container-highest);

  --color-surface-variant: var(--tone-surface-variant);
  --color-on-surface-variant: var(--tone-on-surface-variant);
  --color-background: var(--tone-background);
  --color-on-background: var(--tone-on-background);
  --color-outline: var(--tone-outline);
  --color-outline-variant: var(--tone-outline-variant);

  --color-error: var(--tone-error);
  --color-on-error: var(--tone-on-error);
  --color-error-container: var(--tone-error-container);
  --color-on-error-container: var(--tone-on-error-container);

  --color-success: oklch(0.55 0.18 145);
  --color-on-success: oklch(0.98 0 0);
  --color-success-container: oklch(0.92 0.08 145);
  --color-on-success-container: oklch(0.25 0.1 145);

  --color-warning: oklch(0.62 0.16 85);
  --color-on-warning: oklch(0.98 0 0);
  --color-warning-container: oklch(0.92 0.08 85);
  --color-on-warning-container: oklch(0.25 0.1 85);

  --color-info: oklch(0.58 0.16 245);
  --color-on-info: oklch(0.98 0 0);
  --color-info-container: oklch(0.92 0.08 245);
  --color-on-info-container: oklch(0.25 0.08 245);

  --color-inverse-surface: var(--tone-inverse-surface);
  --color-inverse-on-surface: var(--tone-inverse-on-surface);
  --color-inverse-primary: var(--tone-inverse-primary);
  --color-scrim: rgba(0, 0, 0, 0.32);
  --color-scrim-soft: color-mix(in oklab, var(--color-scrim) 30%, transparent);

  /* Outline role aliases (replaces ad-hoc /nn opacity usage) */
  --color-outline-weak: color-mix(in oklab, var(--color-outline-variant) 10%, var(--color-surface) 90%);
  --color-outline-soft: color-mix(in oklab, var(--color-outline-variant) 15%, var(--color-surface) 85%);
  --color-outline-muted: color-mix(in oklab, var(--color-outline-variant) 20%, var(--color-surface) 80%);
  --color-outline-subtle: color-mix(in oklab, var(--color-outline-variant) 30%, var(--color-surface) 70%);
  --color-outline-medium: color-mix(in oklab, var(--color-outline-variant) 40%, var(--color-surface) 60%);
  --color-outline-strong: color-mix(in oklab, var(--color-outline-variant) 60%, var(--color-surface) 40%);

  /* Surface interaction state aliases */
  --color-state-hover: color-mix(in oklab, var(--color-on-surface) 8%, transparent);
  --color-state-focus: color-mix(in oklab, var(--color-on-surface) 10%, transparent);
  --color-state-pressed: color-mix(in oklab, var(--color-on-surface) 12%, transparent);
  --color-state-selected: color-mix(in oklab, var(--color-primary) 10%, transparent);
  --color-state-error: color-mix(in oklab, var(--color-error) 8%, transparent);
  --color-focus-ring: color-mix(in oklab, var(--color-primary) 20%, transparent);
  --color-focus-ring-error: color-mix(in oklab, var(--color-error) 20%, transparent);

  /* Typography */
  --font-sans: var(--font-inter, system-ui), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

  // M3 Type Scale
  const typeScale = {
    "display-large": { size: 57, line: 64, weight: 400, tracking: "-0.25px" },
    "display-medium": { size: 45, line: 52, weight: 400, tracking: "0" },
    "display-small": { size: 36, line: 44, weight: 400, tracking: "0" },
    "headline-large": { size: 32, line: 40, weight: 400, tracking: "0" },
    "headline-medium": { size: 28, line: 36, weight: 400, tracking: "0" },
    "headline-small": { size: 24, line: 32, weight: 400, tracking: "0" },
    "title-large": { size: 22, line: 28, weight: 400, tracking: "0" },
    "title-medium": { size: 16, line: 24, weight: 500, tracking: "0.15px" },
    "title-small": { size: 14, line: 20, weight: 500, tracking: "0.1px" },
    "body-large": { size: 16, line: 24, weight: 400, tracking: "0.5px" },
    "body-medium": { size: 14, line: 20, weight: 400, tracking: "0.25px" },
    "body-small": { size: 12, line: 16, weight: 400, tracking: "0.4px" },
    "label-large": { size: 14, line: 20, weight: 500, tracking: "0.1px" },
    "label-medium": { size: 12, line: 16, weight: 500, tracking: "0.5px" },
    "label-small": { size: 11, line: 16, weight: 500, tracking: "0.5px" },
  };

  css += `\n  /* === TYPOGRAPHY === */\n`;
  for (const [name, props] of Object.entries(typeScale)) {
    css += `  --type-${name}-font: var(--font-sans);
  --type-${name}-weight: ${props.weight};
  --type-${name}-size: calc(${props.size}px * var(--scale-type));
  --type-${name}-line: calc(${props.line}px * var(--scale-type));
  --type-${name}-tracking: ${props.tracking};
`;
  }

  css += `
  /* === SHAPE (Radius) === */
  --radius-none: 0px;
  --radius-xs: calc(4px * var(--scale-radius));
  --radius-sm: calc(8px * var(--scale-radius));
  --radius-md: calc(12px * var(--scale-radius));
  --radius-lg: calc(20px * var(--scale-radius));
  --radius-xl: calc(32px * var(--scale-radius));
  --radius-2xl: calc(48px * var(--scale-radius));
  --radius-full: 9999px;
  --radius-button-default: var(--radius-sm);
  --radius-button-full: var(--radius-full);
  --radius-button-family: var(--radius-button-default);
  --radius-button: var(--radius-button-family);
  --radius-icon-button: var(--radius-button-family);
  --radius-fab: calc(16px * var(--scale-radius));

  /* === ELEVATION === */
  /* Shadow opacity scale (controlled by data-elevation attribute) */
  --shadow-opacity: 1;
  --shadow-0: none;
  --shadow-1: 0px 1px 3px 1px rgba(0, 0, 0, calc(0.15 * var(--shadow-opacity))), 0px 1px 2px 0px rgba(0, 0, 0, calc(0.30 * var(--shadow-opacity)));
  --shadow-2: 0px 2px 6px 2px rgba(0, 0, 0, calc(0.15 * var(--shadow-opacity))), 0px 1px 2px 0px rgba(0, 0, 0, calc(0.30 * var(--shadow-opacity)));
  --shadow-3: 0px 4px 8px 3px rgba(0, 0, 0, calc(0.15 * var(--shadow-opacity))), 0px 1px 3px 0px rgba(0, 0, 0, calc(0.30 * var(--shadow-opacity)));
  --shadow-4: 0px 6px 10px 4px rgba(0, 0, 0, calc(0.15 * var(--shadow-opacity))), 0px 2px 3px 0px rgba(0, 0, 0, calc(0.30 * var(--shadow-opacity)));
  --shadow-5: 0px 8px 12px 6px rgba(0, 0, 0, calc(0.15 * var(--shadow-opacity))), 0px 4px 4px 0px rgba(0, 0, 0, calc(0.30 * var(--shadow-opacity)));

  /* === MOTION === */
  --duration-short: 100ms;
  --duration-snappy: 150ms;
  --duration-medium: 250ms;
  --duration-emphasized: 300ms;
  --duration-long: 500ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-accelerate: cubic-bezier(0.3, 0, 1, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0, 1);
  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);

  /* === OPACITY === */
  --opacity-hover: 0.08;
  --opacity-focus: 0.10;
  --opacity-pressed: 0.10;
  --opacity-dragged: 0.16;
  --opacity-disabled: 0.38;
  --opacity-muted: 0.60;

  /* === ICON SIZES === */
  --icon-xs: calc(16px * var(--scale-space));
  --icon-sm: calc(20px * var(--scale-space));
  --icon-md: calc(24px * var(--scale-space));
  --icon-lg: calc(32px * var(--scale-space));
  --icon-xl: calc(48px * var(--scale-space));

  /* === LAYOUT === */
  --layout-margin: calc(16px * var(--scale-space));
  --layout-gutter: calc(16px * var(--scale-space));
  --layout-pane-gap: calc(20px * var(--scale-space));
  --layout-pane-list: calc(360px * var(--scale-space));
  --layout-pane-fixed: calc(412px * var(--scale-space));
  --layout-pane-supporting: calc(400px * var(--scale-space));
  --layout-rail: calc(72px * var(--scale-space));
  --layout-drawer: calc(360px * var(--scale-space));
  --layout-navigation-drawer: calc(300px * var(--scale-space));
  --layout-command-list-max-height: calc(300px * var(--scale-space));

  /* === Z-INDEX === */
  --z-fab: 500;
  --z-header: 1000;
  --z-drawer: 1500;
  --z-popover: 2000;
  --z-modal: 3000;
}
`;

  return css;
}
