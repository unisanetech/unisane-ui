import type { FoundationPageDoc } from './types';
import { colorsFoundationPage } from './colors.content';
import { designTokensFoundationPage } from './design-tokens.content';
import { elevationFoundationPage } from './elevation.content';
import { motionFoundationPage } from './motion.content';
import { spacingFoundationPage } from './spacing.content';
import { typographyFoundationPage } from './typography.content';

export const FOUNDATION_PAGES: FoundationPageDoc[] = [
  designTokensFoundationPage,
  typographyFoundationPage,
  colorsFoundationPage,
  spacingFoundationPage,
  elevationFoundationPage,
  motionFoundationPage,
];

export function getFoundationPageBySlug(slug: string): FoundationPageDoc | undefined {
  return FOUNDATION_PAGES.find((page) => page.slug === slug);
}
