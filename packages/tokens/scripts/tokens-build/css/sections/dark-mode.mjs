export function generateDarkModeSection() {
  return `
/* ============================================================
   DARK MODE - CSS-only, no JS required!
   Works with: .dark class OR prefers-color-scheme
   Updates the tone mapping layer for dark mode.
   ============================================================ */

/* System preference dark mode */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    /* Update tone mapping for dark mode */
    --tone-primary: var(--ref-primary-80);
    --tone-on-primary: var(--ref-primary-20);
    --tone-primary-container: var(--ref-primary-30);
    --tone-on-primary-container: var(--ref-primary-90);

    --tone-secondary: var(--ref-secondary-80);
    --tone-on-secondary: var(--ref-secondary-20);
    --tone-secondary-container: var(--ref-secondary-30);
    --tone-on-secondary-container: var(--ref-secondary-90);

    --tone-tertiary: var(--ref-tertiary-80);
    --tone-on-tertiary: var(--ref-tertiary-20);
    --tone-tertiary-container: var(--ref-tertiary-30);
    --tone-on-tertiary-container: var(--ref-tertiary-90);

    --tone-surface: var(--ref-neutral-6);
    --tone-on-surface: var(--ref-neutral-90);
    --tone-surface-container-lowest: var(--ref-neutral-4);
    --tone-surface-container-low: var(--ref-neutral-10);
    --tone-surface-container: var(--ref-neutral-12);
    --tone-surface-container-high: var(--ref-neutral-17);
    --tone-surface-container-highest: var(--ref-neutral-22);
    --tone-surface-variant: var(--ref-neutral-variant-30);
    --tone-on-surface-variant: var(--ref-neutral-variant-80);

    --tone-background: var(--ref-neutral-6);
    --tone-on-background: var(--ref-neutral-90);
    --tone-outline: var(--ref-neutral-variant-60);
    --tone-outline-variant: var(--ref-neutral-variant-24);

    --tone-error: var(--ref-error-80);
    --tone-on-error: var(--ref-error-20);
    --tone-error-container: var(--ref-error-30);
    --tone-on-error-container: var(--ref-error-90);

    --tone-inverse-surface: var(--ref-neutral-90);
    --tone-inverse-on-surface: var(--ref-neutral-20);
    --tone-inverse-primary: var(--ref-primary-40);

    --color-success: oklch(0.8 0.18 145);
    --color-on-success: oklch(0.2 0.1 145);
    --color-success-container: oklch(0.3 0.1 145);
    --color-on-success-container: oklch(0.9 0.1 145);

    --color-warning: oklch(0.85 0.15 85);
    --color-on-warning: oklch(0.2 0.1 85);
    --color-warning-container: oklch(0.3 0.1 85);
    --color-on-warning-container: oklch(0.9 0.1 85);

    --color-info: oklch(0.8 0.18 245);
    --color-on-info: oklch(0.2 0.1 245);
    --color-info-container: oklch(0.3 0.1 245);
    --color-on-info-container: oklch(0.9 0.1 245);
  }
}

/* Manual .dark class override */
.dark {
  /* Update tone mapping for dark mode */
  --tone-primary: var(--ref-primary-80);
  --tone-on-primary: var(--ref-primary-20);
  --tone-primary-container: var(--ref-primary-30);
  --tone-on-primary-container: var(--ref-primary-90);

  --tone-secondary: var(--ref-secondary-80);
  --tone-on-secondary: var(--ref-secondary-20);
  --tone-secondary-container: var(--ref-secondary-30);
  --tone-on-secondary-container: var(--ref-secondary-90);

  --tone-tertiary: var(--ref-tertiary-80);
  --tone-on-tertiary: var(--ref-tertiary-20);
  --tone-tertiary-container: var(--ref-tertiary-30);
  --tone-on-tertiary-container: var(--ref-tertiary-90);

  --tone-surface: var(--ref-neutral-6);
  --tone-on-surface: var(--ref-neutral-90);
  --tone-surface-container-lowest: var(--ref-neutral-4);
  --tone-surface-container-low: var(--ref-neutral-10);
  --tone-surface-container: var(--ref-neutral-12);
  --tone-surface-container-high: var(--ref-neutral-17);
  --tone-surface-container-highest: var(--ref-neutral-22);
  --tone-surface-variant: var(--ref-neutral-variant-30);
  --tone-on-surface-variant: var(--ref-neutral-variant-80);

  --tone-background: var(--ref-neutral-6);
  --tone-on-background: var(--ref-neutral-90);
  --tone-outline: var(--ref-neutral-variant-60);
  --tone-outline-variant: var(--ref-neutral-variant-24);

  --tone-error: var(--ref-error-80);
  --tone-on-error: var(--ref-error-20);
  --tone-error-container: var(--ref-error-30);
  --tone-on-error-container: var(--ref-error-90);

  --tone-inverse-surface: var(--ref-neutral-90);
  --tone-inverse-on-surface: var(--ref-neutral-20);
  --tone-inverse-primary: var(--ref-primary-40);

  --color-success: oklch(0.8 0.18 145);
  --color-on-success: oklch(0.2 0.1 145);
  --color-success-container: oklch(0.3 0.1 145);
  --color-on-success-container: oklch(0.9 0.1 145);

  --color-warning: oklch(0.85 0.15 85);
  --color-on-warning: oklch(0.2 0.1 85);
  --color-warning-container: oklch(0.3 0.1 85);
  --color-on-warning-container: oklch(0.9 0.1 85);

  --color-info: oklch(0.8 0.18 245);
  --color-on-info: oklch(0.2 0.1 245);
  --color-info-container: oklch(0.3 0.1 245);
  --color-on-info-container: oklch(0.9 0.1 245);
}
`;
}
