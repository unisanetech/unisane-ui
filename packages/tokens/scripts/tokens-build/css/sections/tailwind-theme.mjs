export function generateTailwindTheme() {
  let css = `
/* ============================================================
   TAILWIND v4 THEME MAPPING
   Maps CSS variables to Tailwind utilities
   ============================================================ */

@theme inline {
  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
  --breakpoint-compact: 0px;
  --breakpoint-medium: 600px;
  --breakpoint-expanded: 840px;

  /* Colors - Direct reference to CSS vars */
  --color-primary: var(--color-primary);
  --color-on-primary: var(--color-on-primary);
  --color-primary-container: var(--color-primary-container);
  --color-on-primary-container: var(--color-on-primary-container);
  --color-secondary: var(--color-secondary);
  --color-on-secondary: var(--color-on-secondary);
  --color-secondary-container: var(--color-secondary-container);
  --color-on-secondary-container: var(--color-on-secondary-container);
  --color-tertiary: var(--color-tertiary);
  --color-on-tertiary: var(--color-on-tertiary);
  --color-tertiary-container: var(--color-tertiary-container);
  --color-on-tertiary-container: var(--color-on-tertiary-container);
  --color-surface: var(--color-surface);
  --color-on-surface: var(--color-on-surface);
  --color-surface-container-lowest: var(--color-surface-container-lowest);
  --color-surface-container-low: var(--color-surface-container-low);
  --color-surface-container: var(--color-surface-container);
  --color-surface-container-high: var(--color-surface-container-high);
  --color-surface-container-highest: var(--color-surface-container-highest);
  --color-surface-variant: var(--color-surface-variant);
  --color-on-surface-variant: var(--color-on-surface-variant);
  --color-background: var(--color-background);
  --color-on-background: var(--color-on-background);
  --color-outline: var(--color-outline);
  --color-outline-variant: var(--color-outline-variant);
  --color-error: var(--color-error);
  --color-on-error: var(--color-on-error);
  --color-error-container: var(--color-error-container);
  --color-on-error-container: var(--color-on-error-container);
  --color-success: var(--color-success);
  --color-on-success: var(--color-on-success);
  --color-success-container: var(--color-success-container);
  --color-on-success-container: var(--color-on-success-container);
  --color-warning: var(--color-warning);
  --color-on-warning: var(--color-on-warning);
  --color-warning-container: var(--color-warning-container);
  --color-on-warning-container: var(--color-on-warning-container);
  --color-info: var(--color-info);
  --color-on-info: var(--color-on-info);
  --color-info-container: var(--color-info-container);
  --color-on-info-container: var(--color-on-info-container);
  --color-inverse-surface: var(--color-inverse-surface);
  --color-inverse-on-surface: var(--color-inverse-on-surface);
  --color-inverse-primary: var(--color-inverse-primary);
  --color-scrim: var(--color-scrim);
  --color-scrim-soft: var(--color-scrim-soft);
  --color-outline-weak: var(--color-outline-weak);
  --color-outline-soft: var(--color-outline-soft);
  --color-outline-muted: var(--color-outline-muted);
  --color-outline-subtle: var(--color-outline-subtle);
  --color-outline-medium: var(--color-outline-medium);
  --color-outline-strong: var(--color-outline-strong);
  --color-state-hover: var(--color-state-hover);
  --color-state-focus: var(--color-state-focus);
  --color-state-pressed: var(--color-state-pressed);
  --color-state-selected: var(--color-state-selected);
  --color-state-error: var(--color-state-error);
  --color-focus-ring: var(--color-focus-ring);
  --color-focus-ring-error: var(--color-focus-ring-error);

  /* Radius */
  --radius-none: var(--radius-none);
  --radius-xs: var(--radius-xs);
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);
  --radius-2xl: var(--radius-2xl);
  --radius-full: var(--radius-full);
  --radius-button-default: var(--radius-button-default);
  --radius-button-full: var(--radius-button-full);
  --radius-button-family: var(--radius-button-family);
  --radius-button: var(--radius-button);
  --radius-icon-button: var(--radius-icon-button);
  --radius-fab: var(--radius-fab);

  /* Shadows */
  --shadow-0: var(--shadow-0);
  --shadow-1: var(--shadow-1);
  --shadow-2: var(--shadow-2);
  --shadow-3: var(--shadow-3);
  --shadow-4: var(--shadow-4);
  --shadow-5: var(--shadow-5);

  /* Motion */
  --duration-short: var(--duration-short);
  --duration-snappy: var(--duration-snappy);
  --duration-medium: var(--duration-medium);
  --duration-emphasized: var(--duration-emphasized);
  --duration-long: var(--duration-long);
  --ease-standard: var(--ease-standard);
  --ease-emphasized: var(--ease-emphasized);
  --ease-decelerate: var(--ease-decelerate);
  --ease-accelerate: var(--ease-accelerate);

  /* Typography - using --text-* for Tailwind v4 text-* utilities */
  --font-sans: var(--font-sans);
`;

  // Typography scale - Tailwind v4 uses --text-* to generate text-* utilities
  // The --text-*--line-height, --text-*--letter-spacing, --text-*--font-weight suffixes
  // are automatically applied when using the text-* utility
  const typeNames = [
    'display-large',
    'display-medium',
    'display-small',
    'headline-large',
    'headline-medium',
    'headline-small',
    'title-large',
    'title-medium',
    'title-small',
    'body-large',
    'body-medium',
    'body-small',
    'label-large',
    'label-medium',
    'label-small',
  ];
  const typeRoleNames = [
    'hero-title',
    'page-title',
    'section-title',
    'section-lead',
    'panel-title',
    'card-title',
    'eyebrow',
  ];

  for (const name of typeNames) {
    css += `  --text-${name}: var(--type-${name}-size);
  --text-${name}--line-height: var(--type-${name}-line);
  --text-${name}--letter-spacing: var(--type-${name}-tracking);
  --text-${name}--font-weight: var(--type-${name}-weight);
`;
  }
  for (const name of typeRoleNames) {
    css += `  --text-role-${name}: var(--type-role-${name}-size);
  --text-role-${name}--line-height: var(--type-role-${name}-line);
  --text-role-${name}--letter-spacing: var(--type-role-${name}-tracking);
  --text-role-${name}--font-weight: var(--type-role-${name}-weight);
`;
  }

  css += `
  /* Spacing - Standard Tailwind keys mapped to density-scaled values */
  /* These override Tailwind defaults so p-4, gap-2, etc. scale with density */
`;

  // Standard Tailwind spacing scale mapped to our unit system
  // Tailwind: 0.5 = 2px, 1 = 4px, 2 = 8px, etc. (0.25rem base)
  // Our system: 1u = 4px * scale, so p-4 = 4u = 16px * scale
  const tailwindSpacing = [
    [0, 0], // 0 = 0px
    [0.5, 0.5], // 0.5 = 2px = 0.5u
    [1, 1], // 1 = 4px = 1u
    [1.5, 1.5], // 1.5 = 6px = 1.5u
    [2, 2], // 2 = 8px = 2u
    [2.5, 2.5], // 2.5 = 10px = 2.5u
    [3, 3], // 3 = 12px = 3u
    [3.5, 3.5], // 3.5 = 14px = 3.5u
    [4, 4], // 4 = 16px = 4u
    [5, 5], // 5 = 20px = 5u
    [6, 6], // 6 = 24px = 6u
    [7, 7], // 7 = 28px = 7u
    [8, 8], // 8 = 32px = 8u
    [9, 9], // 9 = 36px = 9u
    [10, 10], // 10 = 40px = 10u
    [11, 11], // 11 = 44px = 11u
    [12, 12], // 12 = 48px = 12u
    [14, 14], // 14 = 56px = 14u
    [16, 16], // 16 = 64px = 16u
    [20, 20], // 20 = 80px = 20u
    [24, 24], // 24 = 96px = 24u
    [25, 25], // 25 = 100px (time-picker hand)
    [28, 28], // 28 = 112px = 28u
    [30, 30], // 30 = 120px (stepper, text-field)
    [32, 32], // 32 = 128px - not in our scale, use calc
    [36, 36], // 36 = 144px
    [38, 38], // 38 = 152px = 38u (our custom)
    [40, 40], // 40 = 160px
    [44, 44], // 44 = 176px
    [48, 48], // 48 = 192px
    [50, 50], // 50 = 200px (tooltip, menu)
    [52, 52], // 52 = 208px
    [56, 56], // 56 = 224px
    [60, 60], // 60 = 240px
    [64, 64], // 64 = 256px
    [70, 70], // 70 = 280px (dialog)
    [72, 72], // 72 = 288px = 72u (our custom)
    [78, 78], // 78 = 312px (dialog max)
    [80, 80], // 80 = 320px
    [86, 86], // 86 = 344px (snackbar)
    [90, 90], // 90 = 360px (pane list)
    [96, 96], // 96 = 384px
    [100, 100], // 100 = 400px = 100u (our custom)
    [120, 120], // 120 = 480px
    [150, 150], // 150 = 600px (sheet md)
    [170, 170], // 170 = 680px (dialog expanded)
    [210, 210], // 210 = 840px (sheet lg)
    [250, 250], // 250 = 1000px (accordion expanded)
    [280, 280], // 280 = 1120px (sheet xl)
  ];

  for (const [twKey, unitMultiplier] of tailwindSpacing) {
    if (twKey === 0) {
      css += `  --spacing-0: 0px;\n`;
    } else {
      // Use calc for dynamic scaling with --unit
      css += `  --spacing-${twKey.toString().replace('.', '_')}: calc(var(--unit) * ${unitMultiplier});\n`;
    }
  }

  css += `
  /* Layout */
  --spacing-layout-margin: var(--layout-margin);
  --spacing-layout-gutter: var(--layout-gutter);
  --spacing-layout-page-x: var(--layout-page-x);
  --spacing-layout-section-y: var(--layout-section-y);
  --spacing-layout-section-y-compact: var(--layout-section-y-compact);
  --spacing-layout-hero-y: var(--layout-hero-y);
  --spacing-layout-content-gap: var(--layout-content-gap);
  --spacing-layout-panel-padding: var(--layout-panel-padding);
  --spacing-layout-card-padding: var(--layout-card-padding);
  --spacing-layout-cluster-gap: var(--layout-cluster-gap);
  --spacing-layout-grid-gap: var(--layout-grid-gap);
  --width-pane-list: var(--layout-pane-list);
  --width-pane-fixed: var(--layout-pane-fixed);
  --width-pane-supporting: var(--layout-pane-supporting);
  --width-rail: var(--layout-rail);
  --width-drawer: var(--layout-drawer);
  --width-navigation-drawer: var(--layout-navigation-drawer);

  /* Z-Index */
  --z-fab: var(--z-fab);
  --z-header: var(--z-header);
  --z-drawer: var(--z-drawer);
  --z-popover: var(--z-popover);
  --z-modal: var(--z-modal);

  /* Icons - use with w-icon-sm, h-icon-sm */
  --spacing-icon-xs: var(--icon-xs);
  --spacing-icon-sm: var(--icon-sm);
  --spacing-icon-md: var(--icon-md);
  --spacing-icon-lg: var(--icon-lg);
  --spacing-icon-xl: var(--icon-xl);

  /* Size utilities for icons - use with size-icon-sm */
  --size-icon-xs: var(--icon-xs);
  --size-icon-sm: var(--icon-sm);
  --size-icon-md: var(--icon-md);
  --size-icon-lg: var(--icon-lg);
  --size-icon-xl: var(--icon-xl);

  /* Opacity */
  --opacity-hover: var(--opacity-hover);
  --opacity-focus: var(--opacity-focus);
  --opacity-pressed: var(--opacity-pressed);
  --opacity-dragged: var(--opacity-dragged);
  --opacity-disabled: var(--opacity-disabled);
  --opacity-muted: var(--opacity-muted);
}
`;

  return css;
}
