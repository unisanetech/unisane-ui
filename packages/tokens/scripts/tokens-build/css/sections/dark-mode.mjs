function getLightToneMapping() {
  return `
  --tone-primary: var(--ref-primary-40);
  --tone-on-primary: var(--ref-primary-100);
  --tone-primary-container: var(--ref-primary-90);
  --tone-on-primary-container: var(--ref-primary-10);

  --tone-secondary: var(--ref-secondary-40);
  --tone-on-secondary: var(--ref-secondary-100);
  --tone-secondary-container: var(--ref-secondary-90);
  --tone-on-secondary-container: var(--ref-secondary-10);

  --tone-tertiary: var(--ref-tertiary-40);
  --tone-on-tertiary: var(--ref-tertiary-100);
  --tone-tertiary-container: var(--ref-tertiary-90);
  --tone-on-tertiary-container: var(--ref-tertiary-10);

  --tone-surface: var(--ref-neutral-100);
  --tone-on-surface: var(--ref-neutral-10);
  --tone-surface-container-lowest: var(--ref-neutral-100);
  --tone-surface-container-low: var(--ref-neutral-96);
  --tone-surface-container: var(--ref-neutral-94);
  --tone-surface-container-high: var(--ref-neutral-92);
  --tone-surface-container-highest: var(--ref-neutral-90);
  --tone-surface-variant: var(--ref-neutral-variant-90);
  --tone-on-surface-variant: var(--ref-neutral-variant-30);

  --tone-background: var(--ref-neutral-100);
  --tone-on-background: var(--ref-neutral-10);
  --tone-outline: var(--ref-neutral-variant-60);
  --tone-outline-variant: var(--ref-neutral-variant-90);

  --tone-error: var(--ref-error-40);
  --tone-on-error: var(--ref-error-100);
  --tone-error-container: var(--ref-error-90);
  --tone-on-error-container: var(--ref-error-10);

  --tone-success: var(--ref-success-40);
  --tone-on-success: var(--ref-success-100);
  --tone-success-container: var(--ref-success-90);
  --tone-on-success-container: var(--ref-success-10);

  --tone-warning: var(--ref-warning-40);
  --tone-on-warning: var(--ref-warning-100);
  --tone-warning-container: var(--ref-warning-90);
  --tone-on-warning-container: var(--ref-warning-10);

  --tone-info: var(--ref-info-40);
  --tone-on-info: var(--ref-info-100);
  --tone-info-container: var(--ref-info-90);
  --tone-on-info-container: var(--ref-info-10);

  --tone-inverse-surface: var(--ref-neutral-20);
  --tone-inverse-on-surface: var(--ref-neutral-95);
  --tone-inverse-primary: var(--ref-primary-80);`;
}

function getDarkToneMapping() {
  return `
  --tone-primary: var(--ref-primary-80);
  --tone-on-primary: var(--ref-primary-20);
  --tone-primary-container: var(--ref-primary-30);
  --tone-on-primary-container: var(--ref-primary-90);

  --tone-secondary: var(--ref-secondary-80);
  --tone-on-secondary: var(--ref-secondary-20);
  --tone-secondary-container: var(--ref-secondary-24);
  --tone-on-secondary-container: var(--ref-secondary-90);

  --tone-tertiary: var(--ref-tertiary-80);
  --tone-on-tertiary: var(--ref-tertiary-20);
  --tone-tertiary-container: var(--ref-tertiary-30);
  --tone-on-tertiary-container: var(--ref-tertiary-90);

  --tone-surface: var(--ref-neutral-8);
  --tone-on-surface: var(--ref-neutral-90);
  --tone-surface-container-lowest: var(--ref-neutral-8);
  --tone-surface-container-low: var(--ref-neutral-10);
  --tone-surface-container: var(--ref-neutral-17);
  --tone-surface-container-high: var(--ref-neutral-22);
  --tone-surface-container-highest: var(--ref-neutral-24);
  --tone-surface-variant: var(--ref-neutral-variant-30);
  --tone-on-surface-variant: var(--ref-neutral-variant-80);

  --tone-background: var(--ref-neutral-8);
  --tone-on-background: var(--ref-neutral-90);
  --tone-outline: var(--ref-neutral-variant-60);
  --tone-outline-variant: var(--ref-neutral-variant-24);

  --tone-error: var(--ref-error-80);
  --tone-on-error: var(--ref-error-20);
  --tone-error-container: var(--ref-error-30);
  --tone-on-error-container: var(--ref-error-90);

  --tone-success: var(--ref-success-80);
  --tone-on-success: var(--ref-success-20);
  --tone-success-container: var(--ref-success-30);
  --tone-on-success-container: var(--ref-success-90);

  --tone-warning: var(--ref-warning-80);
  --tone-on-warning: var(--ref-warning-20);
  --tone-warning-container: var(--ref-warning-30);
  --tone-on-warning-container: var(--ref-warning-90);

  --tone-info: var(--ref-info-80);
  --tone-on-info: var(--ref-info-20);
  --tone-info-container: var(--ref-info-30);
  --tone-on-info-container: var(--ref-info-90);

  --tone-inverse-surface: var(--ref-neutral-90);
  --tone-inverse-on-surface: var(--ref-neutral-20);
  --tone-inverse-primary: var(--ref-primary-40);`;
}

export function generateDarkModeSection() {
  const lightToneMapping = getLightToneMapping();
  const darkToneMapping = getDarkToneMapping();

  return `
/* ============================================================
   DARK MODE - CSS-only, no JS required!
   Works with: .dark class OR prefers-color-scheme
   Updates the tone mapping layer for dark mode.
   ============================================================ */

/* Local theme scope for isolated previews */
[data-theme-scope="light"] {
  color-scheme: light;
${lightToneMapping}
}

[data-theme-scope="dark"] {
  color-scheme: dark;
${darkToneMapping}
}

/* System preference dark mode */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
${darkToneMapping}
  }
}

/* Manual .dark class override */
.dark {
${darkToneMapping}
}
`;
}
