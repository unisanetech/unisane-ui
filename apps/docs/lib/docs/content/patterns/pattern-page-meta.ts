import type { PatternPageMeta } from './types';

export const layoutsPatternMeta: PatternPageMeta = {
  slug: 'layouts',
  title: 'App Layouts',
  description:
    'Use canonical layout patterns to structure dense product screens without inventing shell rules per page.',
  icon: 'view_sidebar',
};

export const formsPatternMeta: PatternPageMeta = {
  slug: 'forms',
  title: 'Forms',
  description:
    'Forms should feel deliberate, compact, and trustworthy, with clear hierarchy and predictable field behavior.',
  icon: 'edit_note',
};

export const navigationPatternMeta: PatternPageMeta = {
  slug: 'navigation',
  title: 'Navigation',
  description:
    'Navigation patterns should make hierarchy obvious across desktop, tablet, and mobile without creating parallel systems.',
  icon: 'menu',
};

export const dataPatternMeta: PatternPageMeta = {
  slug: 'data',
  title: 'Data Display',
  description:
    'Data-heavy screens should balance hierarchy, scan speed, and action density without turning into raw tables everywhere.',
  icon: 'table_chart',
};

export const PATTERN_PAGE_META: PatternPageMeta[] = [
  layoutsPatternMeta,
  formsPatternMeta,
  navigationPatternMeta,
  dataPatternMeta,
];
