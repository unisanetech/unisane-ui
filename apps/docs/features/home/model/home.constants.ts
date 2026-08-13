import type { HomeFeature, HomeStat } from './home.types';

export const HOME_STATS: HomeStat[] = [
  { value: '50+', label: 'Components' },
  { value: '10', label: 'Themes' },
  { value: 'Open', label: 'Code ownership' },
  { value: 'React 19', label: 'Runtime target' },
];

export const HOME_FEATURES: HomeFeature[] = [
  {
    icon: 'palette',
    title: 'Dynamic Theming',
    description:
      '10 themes, dark mode, and runtime switching with CSS variables. Absolute control over your visual identity.',
  },
  {
    icon: 'accessibility_new',
    title: 'Accessibility-minded',
    description:
      'Built with semantic controls, keyboard interaction, focus handling, and ARIA patterns where applicable.',
  },
  {
    icon: 'code',
    title: 'TypeScript',
    description:
      'Full type safety with IntelliSense for every prop and callback. Catch errors before they happen.',
  },
  {
    icon: 'bolt',
    title: 'Incremental',
    description: 'Install only the components and dependency closure your application needs.',
  },
  {
    icon: 'auto_awesome',
    title: 'Tailwind CSS',
    description:
      'Design tokens and utility classes. Extend any component easily without leaving your HTML.',
  },
  {
    icon: 'layers',
    title: 'Composable',
    description:
      'Predictable parts for adapting components and building product-specific patterns.',
  },
];
