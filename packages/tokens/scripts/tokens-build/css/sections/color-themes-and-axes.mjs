export function generateColorThemesAndAxesSection() {
  return `
/* ============================================================
   COLOR THEMES - Hue presets
   Usage: <html data-color-theme="purple">

   Color themes set the primary hue and chroma.
   Can be combined with any scheme.

   Available themes:
   - blue (default)  - Hue 230, professional blue
   - purple          - Hue 285, creative purple
   - pink            - Hue 340, playful pink
   - red             - Hue 25, bold red/coral
   - orange          - Hue 55, warm orange
   - yellow          - Hue 85, bright yellow
   - green           - Hue 145, natural green
   - cyan            - Hue 195, cool cyan
   - neutral         - Soft accent, product-focused neutral
   - black           - Zero saturation, monochrome
   ============================================================ */

:root[data-color-theme="blue"] {
  --hue: 230;
  --chroma: 0.15;
}

:root[data-color-theme="purple"] {
  --hue: 285;
  --chroma: 0.14;
}

:root[data-color-theme="pink"] {
  --hue: 340;
  --chroma: 0.15;
}

:root[data-color-theme="red"] {
  --hue: 25;
  --chroma: 0.16;
}

:root[data-color-theme="orange"] {
  --hue: 55;
  --chroma: 0.16;
}

:root[data-color-theme="yellow"] {
  --hue: 85;
  --chroma: 0.14;
}

:root[data-color-theme="green"] {
  --hue: 145;
  --chroma: 0.14;
}

:root[data-color-theme="cyan"] {
  --hue: 195;
  --chroma: 0.12;
}

/* Neutral theme - soft accent for product UIs */
:root[data-color-theme="neutral"] {
  --hue: 230;
  --chroma: 0.06;
  --chroma-neutral: 0.008;
}

/* Black theme - zero saturation (same as monochrome but as a color theme)
   Only sets chroma to 0, tone mapping controlled by contrast level */
:root[data-color-theme="black"] {
  --chroma: 0;
  --chroma-neutral: 0;
}

/* ============================================================
   COLOR SCHEMES - Saturation control
   Usage: <html data-scheme="monochrome">

   Schemes control SATURATION (chroma) only.
   Tone darkness is controlled separately by data-contrast.

   Available schemes:
   - tonal (default) - Full M3 tonal palette with vibrant colors
   - neutral         - Low chroma, subtle color hints (professional)
   - monochrome      - Zero saturation, pure grayscale
   ============================================================ */

/* Neutral scheme - low saturation, subtle color hints */
[data-scheme="neutral"] {
  --chroma: 0.03;
  --chroma-neutral: 0.008;
}

/* Monochrome scheme - pure grayscale
   Only sets chroma to 0, tone mapping unchanged (controlled by contrast) */
[data-scheme="monochrome"] {
  --chroma: 0;
  --chroma-neutral: 0;
}

/* ============================================================
   CONTRAST LEVELS - Accessibility modifier
   Usage: <html data-contrast="high">

   Contrast controls TONE EXTREMITY for accessibility.
   Can be combined with any scheme.

   Available levels:
   - standard (default) - M3 baseline contrast
   - medium             - Slightly boosted for better readability
   - high               - Maximum contrast for accessibility (WCAG AAA)
   ============================================================ */

/* Medium contrast - boosted readability (darker primary: tone 30) */
[data-contrast="medium"] {
  --tone-primary: var(--ref-primary-30);
  --tone-on-primary: var(--ref-primary-100);
  --tone-primary-container: var(--ref-primary-95);
  --tone-on-primary-container: var(--ref-primary-10);

  --tone-secondary: var(--ref-secondary-30);
  --tone-on-secondary: var(--ref-secondary-100);

  --tone-on-surface: var(--ref-neutral-10);
  --tone-outline: var(--ref-neutral-variant-50);
  --tone-outline-variant: var(--ref-neutral-variant-80);
}

.dark[data-contrast="medium"],
[data-contrast="medium"].dark {
  --tone-primary: var(--ref-primary-80);
  --tone-on-primary: var(--ref-primary-10);
  --tone-primary-container: var(--ref-primary-30);
  --tone-on-primary-container: var(--ref-primary-95);

  --tone-secondary: var(--ref-secondary-80);
  --tone-on-secondary: var(--ref-secondary-10);

  --tone-on-surface: var(--ref-neutral-95);
  --tone-outline: var(--ref-neutral-variant-70);
  --tone-outline-variant: var(--ref-neutral-variant-30);
}

/* High contrast - boosted accessibility, WCAG AAA (darker primary: tone 20) */
[data-contrast="high"] {
  --tone-primary: var(--ref-primary-20);
  --tone-on-primary: var(--ref-primary-100);
  --tone-primary-container: var(--ref-primary-95);
  --tone-on-primary-container: var(--ref-primary-0);

  --tone-secondary: var(--ref-secondary-20);
  --tone-on-secondary: var(--ref-secondary-100);
  --tone-secondary-container: var(--ref-secondary-95);
  --tone-on-secondary-container: var(--ref-secondary-0);

  --tone-tertiary: var(--ref-tertiary-20);
  --tone-on-tertiary: var(--ref-tertiary-100);

  --tone-surface: var(--ref-neutral-100);
  --tone-on-surface: var(--ref-neutral-0);
  --tone-background: var(--ref-neutral-100);
  --tone-on-background: var(--ref-neutral-0);
  --tone-outline: var(--ref-neutral-variant-20);
  --tone-outline-variant: var(--ref-neutral-variant-70);

  --tone-error: var(--ref-error-20);
  --tone-on-error: var(--ref-error-100);
}

.dark[data-contrast="high"],
[data-contrast="high"].dark {
  --tone-primary: var(--ref-primary-95);
  --tone-on-primary: var(--ref-primary-0);
  --tone-primary-container: var(--ref-primary-10);
  --tone-on-primary-container: var(--ref-primary-100);

  --tone-secondary: var(--ref-secondary-95);
  --tone-on-secondary: var(--ref-secondary-0);
  --tone-secondary-container: var(--ref-secondary-10);
  --tone-on-secondary-container: var(--ref-secondary-100);

  --tone-tertiary: var(--ref-tertiary-95);
  --tone-on-tertiary: var(--ref-tertiary-0);

  --tone-surface: var(--ref-neutral-0);
  --tone-on-surface: var(--ref-neutral-100);
  --tone-background: var(--ref-neutral-0);
  --tone-on-background: var(--ref-neutral-100);
  --tone-outline: var(--ref-neutral-variant-80);
  --tone-outline-variant: var(--ref-neutral-variant-60);

  --tone-error: var(--ref-error-95);
  --tone-on-error: var(--ref-error-0);
}

/* ============================================================
   DENSITY - CSS-only via data attribute
   Usage: <html data-density="compact">
   ============================================================ */

[data-density="compact"] {
  --scale-space: 0.875;
  --scale-type: 0.9;
  --scale-radius-density: 0.9;
}

[data-density="dense"] {
  --scale-space: 0.75;
  --scale-type: 0.85;
  --scale-radius-density: 0.85;
}

[data-density="comfortable"] {
  --scale-space: 1.1;
  --scale-type: 1.0;
  --scale-radius-density: 1.0;
}

/* ============================================================
   RADIUS THEME - CSS-only via data attribute
   Usage: <html data-radius="soft">
   Values must match ThemeProvider RADIUS_PRESETS
   ============================================================ */

[data-radius="none"] {
  --scale-radius-theme: 0;
}

[data-radius="minimal"] {
  --scale-radius-theme: 0.25;
}

[data-radius="sharp"] {
  --scale-radius-theme: 0.5;
}

[data-radius="standard"] {
  --scale-radius-theme: 1.0;
}

[data-radius="soft"] {
  --scale-radius-theme: 1.25;
}

/* ============================================================
   ACTION SHAPE MODE - Optional global override
   Usage: <html data-action-shape="full">
   Applies to button-family controls (Button + IconButton), not FAB.
   ============================================================ */

[data-action-shape="standard"] {
  --radius-button-family: var(--radius-button-default);
}

[data-action-shape="full"] {
  --radius-button-family: var(--radius-button-full);
}

/* ============================================================
   ELEVATION - Control shadow intensity
   Usage: <html data-elevation="subtle">

   Elevation controls SHADOW OPACITY for visual depth.
   Can be combined with any scheme or contrast level.

   Available levels:
   - flat        - No shadows (--shadow-opacity: 0)
   - subtle      - Reduced shadows for minimal UI (--shadow-opacity: 0.5)
   - standard    - Default M3 shadows (--shadow-opacity: 1)
   - pronounced  - Stronger shadows for depth (--shadow-opacity: 1.5)
   ============================================================ */

[data-elevation="flat"] {
  --shadow-opacity: 0;
}

[data-elevation="subtle"] {
  --shadow-opacity: 0.5;
}

[data-elevation="standard"] {
  --shadow-opacity: 1;
}

[data-elevation="pronounced"] {
  --shadow-opacity: 1.5;
}
`;
}
