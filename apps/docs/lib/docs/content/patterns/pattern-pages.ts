import type { PatternPageDoc } from './types';
import { dataPatternPage } from './data.content';
import { formsPatternPage } from './forms.content';
import { layoutsPatternPage } from './layouts.content';
import { navigationPatternPage } from './navigation.content';

export const PATTERN_PAGES: PatternPageDoc[] = [
  layoutsPatternPage,
  formsPatternPage,
  navigationPatternPage,
  dataPatternPage,
];

export function getPatternPageBySlug(slug: string): PatternPageDoc | undefined {
  return PATTERN_PAGES.find((page) => page.slug === slug);
}
