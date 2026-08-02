import { generatePalettes } from '../../palette.mjs';

export const THEME_REGION_START = '/* unisane:theme:start */';
export const THEME_REGION_END = '/* unisane:theme:end */';

const ROLE_TONES = {
  light: {
    primary: ['primary', 40],
    'on-primary': ['primary', 100],
    'primary-container': ['primary', 90],
    'on-primary-container': ['primary', 10],
    secondary: ['secondary', 40],
    'on-secondary': ['secondary', 100],
    'secondary-container': ['secondary', 90],
    'on-secondary-container': ['secondary', 10],
    tertiary: ['tertiary', 40],
    'on-tertiary': ['tertiary', 100],
    'tertiary-container': ['tertiary', 90],
    'on-tertiary-container': ['tertiary', 10],
    surface: ['neutral', 100],
    'on-surface': ['neutral', 10],
    'surface-container-lowest': ['neutral', 100],
    'surface-container-low': ['neutral', 96],
    'surface-container': ['neutral', 94],
    'surface-container-high': ['neutral', 92],
    'surface-container-highest': ['neutral', 90],
    'surface-variant': ['neutral-variant', 90],
    'on-surface-variant': ['neutral-variant', 30],
    background: ['neutral', 100],
    'on-background': ['neutral', 10],
    outline: ['neutral-variant', 60],
    'outline-variant': ['neutral-variant', 70],
    'control-outline': ['neutral-variant', 50],
    error: ['error', 40],
    'on-error': ['error', 100],
    'error-container': ['error', 90],
    'on-error-container': ['error', 10],
    success: ['success', 40],
    'on-success': ['success', 100],
    'success-container': ['success', 90],
    'on-success-container': ['success', 10],
    warning: ['warning', 40],
    'on-warning': ['warning', 100],
    'warning-container': ['warning', 90],
    'on-warning-container': ['warning', 10],
    info: ['info', 40],
    'on-info': ['info', 100],
    'info-container': ['info', 90],
    'on-info-container': ['info', 10],
    'inverse-surface': ['neutral', 20],
    'inverse-on-surface': ['neutral', 95],
    'inverse-primary': ['primary', 80],
  },
  dark: {
    primary: ['primary', 80],
    'on-primary': ['primary', 20],
    'primary-container': ['primary', 30],
    'on-primary-container': ['primary', 90],
    secondary: ['secondary', 80],
    'on-secondary': ['secondary', 20],
    'secondary-container': ['secondary', 30],
    'on-secondary-container': ['secondary', 90],
    tertiary: ['tertiary', 80],
    'on-tertiary': ['tertiary', 20],
    'tertiary-container': ['tertiary', 30],
    'on-tertiary-container': ['tertiary', 90],
    surface: ['neutral', 8],
    'on-surface': ['neutral', 90],
    'surface-container-lowest': ['neutral', 8],
    'surface-container-low': ['neutral', 10],
    'surface-container': ['neutral', 17],
    'surface-container-high': ['neutral', 22],
    'surface-container-highest': ['neutral', 24],
    'surface-variant': ['neutral-variant', 30],
    'on-surface-variant': ['neutral-variant', 80],
    background: ['neutral', 8],
    'on-background': ['neutral', 90],
    outline: ['neutral-variant', 50],
    'outline-variant': ['neutral-variant', 40],
    'control-outline': ['neutral-variant', 40],
    error: ['error', 80],
    'on-error': ['error', 20],
    'error-container': ['error', 30],
    'on-error-container': ['error', 90],
    success: ['success', 80],
    'on-success': ['success', 20],
    'success-container': ['success', 30],
    'on-success-container': ['success', 90],
    warning: ['warning', 80],
    'on-warning': ['warning', 20],
    'warning-container': ['warning', 30],
    'on-warning-container': ['warning', 90],
    info: ['info', 80],
    'on-info': ['info', 20],
    'info-container': ['info', 30],
    'on-info-container': ['info', 90],
    'inverse-surface': ['neutral', 90],
    'inverse-on-surface': ['neutral', 20],
    'inverse-primary': ['primary', 40],
  },
};

function withOverrides(baseName, overrides) {
  return { ...ROLE_TONES[baseName], ...overrides };
}

ROLE_TONES.medium = withOverrides('light', {
  primary: ['primary', 30],
  'primary-container': ['primary', 95],
  secondary: ['secondary', 30],
  'secondary-container': ['secondary', 95],
  tertiary: ['tertiary', 30],
  'tertiary-container': ['tertiary', 95],
  success: ['success', 30],
  'success-container': ['success', 95],
  warning: ['warning', 30],
  'warning-container': ['warning', 95],
  info: ['info', 30],
  'info-container': ['info', 95],
  'on-surface-variant': ['neutral-variant', 24],
  'surface-variant': ['neutral-variant', 92],
  outline: ['neutral-variant', 30],
  'outline-variant': ['neutral-variant', 40],
  'control-outline': ['neutral-variant', 50],
});

ROLE_TONES.high = withOverrides('light', {
  primary: ['primary', 20],
  'primary-container': ['primary', 95],
  'on-primary-container': ['primary', 0],
  secondary: ['secondary', 20],
  'secondary-container': ['secondary', 95],
  'on-secondary-container': ['secondary', 0],
  tertiary: ['tertiary', 20],
  'tertiary-container': ['tertiary', 95],
  'on-tertiary-container': ['tertiary', 0],
  'on-surface': ['neutral', 0],
  'on-background': ['neutral', 0],
  'surface-variant': ['neutral-variant', 95],
  'on-surface-variant': ['neutral-variant', 20],
  outline: ['neutral-variant', 20],
  'outline-variant': ['neutral-variant', 40],
  'control-outline': ['neutral-variant', 40],
  error: ['error', 20],
  success: ['success', 20],
  'success-container': ['success', 95],
  'on-success-container': ['success', 0],
  warning: ['warning', 20],
  'warning-container': ['warning', 95],
  'on-warning-container': ['warning', 0],
  info: ['info', 20],
  'info-container': ['info', 95],
  'on-info-container': ['info', 0],
});

ROLE_TONES['dark-medium'] = withOverrides('dark', {
  'primary-container': ['primary', 30],
  'on-primary-container': ['primary', 95],
  'secondary-container': ['secondary', 30],
  'on-secondary-container': ['secondary', 95],
  'tertiary-container': ['tertiary', 30],
  'on-tertiary-container': ['tertiary', 95],
  'on-surface': ['neutral', 95],
  'on-surface-variant': ['neutral-variant', 90],
  'surface-variant': ['neutral-variant', 24],
  outline: ['neutral-variant', 60],
  'outline-variant': ['neutral-variant', 50],
  'control-outline': ['neutral-variant', 50],
});

ROLE_TONES['dark-high'] = withOverrides('dark', {
  primary: ['primary', 95],
  'on-primary': ['primary', 0],
  'primary-container': ['primary', 10],
  'on-primary-container': ['primary', 100],
  secondary: ['secondary', 95],
  'on-secondary': ['secondary', 0],
  'secondary-container': ['secondary', 10],
  'on-secondary-container': ['secondary', 100],
  tertiary: ['tertiary', 95],
  'on-tertiary': ['tertiary', 0],
  'tertiary-container': ['tertiary', 10],
  'on-tertiary-container': ['tertiary', 100],
  'on-surface': ['neutral', 100],
  'on-background': ['neutral', 100],
  'surface-variant': ['neutral-variant', 20],
  'on-surface-variant': ['neutral-variant', 95],
  outline: ['neutral-variant', 80],
  'outline-variant': ['neutral-variant', 60],
  'control-outline': ['neutral-variant', 60],
  error: ['error', 95],
  'on-error': ['error', 0],
  success: ['success', 95],
  'on-success': ['success', 0],
  'success-container': ['success', 10],
  'on-success-container': ['success', 100],
  warning: ['warning', 95],
  'on-warning': ['warning', 0],
  'warning-container': ['warning', 10],
  'on-warning-container': ['warning', 100],
  info: ['info', 95],
  'on-info': ['info', 0],
  'info-container': ['info', 10],
  'on-info-container': ['info', 100],
});

export function generateSemanticColorDeclarations(palettes, mode, indent = '  ') {
  return Object.entries(ROLE_TONES[mode])
    .map(([role, [palette, tone]]) => `${indent}--color-${role}: ${palettes[palette][tone]};`)
    .join('\n');
}

export function generateThemeColorsSection(config) {
  const palettes = generatePalettes(config);
  const declarations = (mode, indent = '  ') =>
    generateSemanticColorDeclarations(palettes, mode, indent);

  return `${THEME_REGION_START}
/* Generated theme: ${config.name}. Replace this managed region with the CLI. */
:root {
${declarations('light')}
}

@media (prefers-color-scheme: dark) {
  :root:not(.light) {
${declarations('dark', '    ')}
  }
}

.dark {
${declarations('dark')}
}

[data-contrast="medium"] {
${declarations('medium')}
}

.dark[data-contrast="medium"],
[data-contrast="medium"].dark {
${declarations('dark-medium')}
}

[data-contrast="high"] {
${declarations('high')}
}

.dark[data-contrast="high"],
[data-contrast="high"].dark {
${declarations('dark-high')}
}
${THEME_REGION_END}
`;
}

function withScheme(config, scheme) {
  const next = globalThis.structuredClone(config);
  if (scheme === 'neutral') {
    next.primary.chroma = 0.03;
    next.neutral.tintFromPrimary = 0.008;
    for (const section of ['error', 'success', 'warning', 'info']) {
      next[section].chroma *= 0.7;
    }
  } else if (scheme === 'monochrome') {
    next.primary.chroma = 0;
    next.neutral.tintFromPrimary = 0;
    for (const section of ['error', 'success', 'warning', 'info']) {
      next[section].chroma = 0;
    }
  }
  return next;
}

export function generateThemePreviewSection(config, themeName) {
  const schemes = ['tonal', 'neutral', 'monochrome'];
  const contrasts = ['standard', 'medium', 'high'];
  let css = `\n/* Preview combinations for ${themeName}; docs workbench only. */\n`;

  for (const scheme of schemes) {
    const palettes = generatePalettes(withScheme(config, scheme));
    for (const contrast of contrasts) {
      const lightMode = contrast === 'standard' ? 'light' : contrast;
      const darkMode = contrast === 'standard' ? 'dark' : `dark-${contrast}`;
      const attributes = `[data-color-theme="${themeName}"][data-scheme="${scheme}"][data-contrast="${contrast}"]`;
      css += `${attributes} {\n${generateSemanticColorDeclarations(palettes, lightMode)}\n}\n`;
      css += `.dark${attributes}, ${attributes}.dark {\n${generateSemanticColorDeclarations(palettes, darkMode)}\n}\n`;
    }
  }

  return css;
}
