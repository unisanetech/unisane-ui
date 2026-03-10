import { PATTERN_PAGE_META } from './pattern-page-meta';

export { PATTERN_PAGE_META } from './pattern-page-meta';
export type { PatternPageDoc, PatternPageMeta } from './types';

export function getAllPatternPages() {
  return PATTERN_PAGE_META;
}

export function getPatternPageMetaBySlug(slug: string) {
  return PATTERN_PAGE_META.find((page) => page.slug === slug);
}
