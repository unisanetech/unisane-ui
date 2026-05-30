export type EmailTheme = {
  primary: string;
  primaryText: string;
  text: string;
  muted: string;
  subtle: string;
  background: string;
  surface: string;
  border: string;
  softSurface: string;
  successSurface: string;
};

export const DEFAULT_EMAIL_THEME = {
  primary: '#0f5132',
  primaryText: '#ffffff',
  text: '#111827',
  muted: '#4b5563',
  subtle: '#6b7280',
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#e5e7eb',
  softSurface: '#f3f4f6',
  successSurface: '#e8f5ee',
} as const satisfies EmailTheme;
