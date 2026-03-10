import { FOUNDATION_PAGE_META } from './foundation-page-meta';

export { FOUNDATION_PAGE_META } from './foundation-page-meta';
export type { FoundationPageDoc, FoundationPageMeta } from './types';

export function getAllFoundationPages() {
  return FOUNDATION_PAGE_META;
}

export function getFoundationPageMetaBySlug(slug: string) {
  return FOUNDATION_PAGE_META.find((page) => page.slug === slug);
}
