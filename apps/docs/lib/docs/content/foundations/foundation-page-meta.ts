import type { FoundationPageMeta } from './types';

export const designTokensFoundationMeta: FoundationPageMeta = {
  slug: 'design-tokens',
  title: 'Design Tokens',
  description:
    'Design tokens are the shared contract between brand decisions, theming, and component implementation.',
  icon: 'hexagon',
};

export const typographyFoundationMeta: FoundationPageMeta = {
  slug: 'typography',
  title: 'Typography',
  description:
    'Typography uses semantic roles so content hierarchy stays consistent across product surfaces.',
  icon: 'text_fields',
};

export const colorsFoundationMeta: FoundationPageMeta = {
  slug: 'colors',
  title: 'Colors',
  description:
    'Colors in Unisane UI are semantic roles that adapt across light, dark, and themed contexts.',
  icon: 'palette',
};

export const spacingFoundationMeta: FoundationPageMeta = {
  slug: 'spacing',
  title: 'Spacing',
  description:
    'Spacing is built from a shared unit scale so density changes stay consistent across components and layouts.',
  icon: 'space_bar',
};

export const elevationFoundationMeta: FoundationPageMeta = {
  slug: 'elevation',
  title: 'Elevation',
  description:
    'Elevation separates surfaces and clarifies interaction layers without relying on random shadow styles.',
  icon: 'layers',
};

export const motionFoundationMeta: FoundationPageMeta = {
  slug: 'motion',
  title: 'Motion',
  description:
    'Motion gives state changes meaning through shared durations and easing curves instead of local animation guesses.',
  icon: 'animation',
};

export const FOUNDATION_PAGE_META: FoundationPageMeta[] = [
  designTokensFoundationMeta,
  typographyFoundationMeta,
  colorsFoundationMeta,
  spacingFoundationMeta,
  elevationFoundationMeta,
  motionFoundationMeta,
];
