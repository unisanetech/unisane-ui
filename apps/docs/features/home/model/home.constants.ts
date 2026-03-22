import type { HomeFeature, HomeStat } from './home.types';

export const HOME_STATS: HomeStat[] = [
  { value: '50+', label: 'Components' },
  { value: '200+', label: 'Variants' },
  { value: '100%', label: 'Accessible' },
  { value: '<5kb', label: 'Avg. size' },
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
    title: 'Accessible',
    description:
      'WAI-ARIA compliant with keyboard navigation and screen reader support out of the box.',
  },
  {
    icon: 'code',
    title: 'TypeScript',
    description:
      'Full type safety with IntelliSense for every prop and callback. Catch errors before they happen.',
  },
  {
    icon: 'bolt',
    title: 'Performant',
    description: 'Tree-shakeable with optimized bundle sizes. Ship only what you use.',
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
    description: 'Low-level primitives for building custom components.',
  },
];
