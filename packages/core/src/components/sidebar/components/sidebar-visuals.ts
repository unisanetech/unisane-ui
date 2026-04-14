import type { SidebarState, SidebarVisualPreset } from '../model/sidebar.types';

type SidebarVisualTheme = {
  railBackgroundClass: string;
  railForegroundClass: string;
  drawerBackgroundClass: string;
  drawerForegroundClass: string;
  insetBackgroundClass: string;
  borderColor: string;
  drawerRadiusClass: string;
  drawerShadow: string;
};

const PRESET_THEME: Record<SidebarVisualPreset, SidebarVisualTheme> = {
  default: {
    railBackgroundClass: 'bg-surface-container-low',
    railForegroundClass: 'text-on-surface',
    drawerBackgroundClass: 'bg-surface-container-low',
    drawerForegroundClass: 'text-on-surface',
    insetBackgroundClass: 'bg-surface',
    borderColor: 'var(--color-outline-soft)',
    drawerRadiusClass: 'rounded-none',
    drawerShadow: 'var(--shadow-3)',
  },
  compact: {
    railBackgroundClass: 'bg-surface-container-low',
    railForegroundClass: 'text-on-surface',
    drawerBackgroundClass: 'bg-surface-container-low',
    drawerForegroundClass: 'text-on-surface',
    insetBackgroundClass: 'bg-surface',
    borderColor: 'var(--color-outline-soft)',
    drawerRadiusClass: 'rounded-sm',
    drawerShadow: 'var(--shadow-3)',
  },
  elevated: {
    railBackgroundClass: 'bg-surface-container',
    railForegroundClass: 'text-on-surface',
    drawerBackgroundClass: 'bg-surface-container',
    drawerForegroundClass: 'text-on-surface',
    insetBackgroundClass: 'bg-surface',
    borderColor: 'var(--color-outline-soft)',
    drawerRadiusClass: 'rounded-md',
    drawerShadow: 'var(--shadow-4)',
  },
  minimal: {
    railBackgroundClass: 'bg-surface',
    railForegroundClass: 'text-on-surface',
    drawerBackgroundClass: 'bg-surface',
    drawerForegroundClass: 'text-on-surface',
    insetBackgroundClass: 'bg-surface',
    borderColor: 'var(--color-outline-soft)',
    drawerRadiusClass: 'rounded-none',
    drawerShadow: 'var(--shadow-0)',
  },
};

export function getSidebarVisualTheme(sidebar: Pick<SidebarState, 'tokens' | 'visualPreset'>) {
  const theme = PRESET_THEME[sidebar.visualPreset];

  return {
    railBackgroundClass: theme.railBackgroundClass,
    railForegroundClass: theme.railForegroundClass,
    railStyle: {
      backgroundColor: sidebar.tokens?.railBackground,
      color: sidebar.tokens?.railForeground,
    },
    drawerBackgroundClass: theme.drawerBackgroundClass,
    drawerForegroundClass: theme.drawerForegroundClass,
    drawerRadiusClass: theme.drawerRadiusClass,
    drawerStyle: {
      backgroundColor: sidebar.tokens?.drawerBackground,
      color: sidebar.tokens?.drawerForeground,
      borderColor: sidebar.tokens?.borderColor ?? theme.borderColor,
      boxShadow: sidebar.tokens?.drawerShadow ?? theme.drawerShadow,
      borderRadius: sidebar.tokens?.drawerRadius,
    },
    insetBackgroundClass: theme.insetBackgroundClass,
    insetStyle: {
      backgroundColor: sidebar.tokens?.insetBackground,
    },
    borderColor: sidebar.tokens?.borderColor ?? theme.borderColor,
    motionStyle: {
      transitionDuration: sidebar.tokens?.motionDuration ?? 'var(--duration-emphasized)',
      transitionTimingFunction: sidebar.tokens?.motionEasing ?? 'var(--ease-emphasized)',
    },
  };
}
