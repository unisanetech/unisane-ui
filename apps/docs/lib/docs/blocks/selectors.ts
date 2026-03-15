import { BLOCK_META } from './block-meta';
import { BLOCK_CATEGORY_ORDER, BLOCK_SEGMENT_CATEGORY_ORDER, BLOCK_SEGMENT_ORDER } from './block-taxonomy';
import type { DocsBlockCategory, DocsBlockMeta, DocsBlockSegment } from './types';

export { BLOCK_META } from './block-meta';
export type {
  DocsBlock,
  DocsBlockCategory,
  DocsBlockListItem,
  DocsBlockMeta,
  DocsBlockSegment,
} from './types';

export function getAllBlocks(): DocsBlockMeta[] {
  return BLOCK_META;
}

export function getBlockMetaBySlug(slug: string): DocsBlockMeta | undefined {
  return BLOCK_META.find((block) => block.slug === slug);
}

export function getPrimaryCategoryBySlug(slug: string): DocsBlockCategory | undefined {
  return getBlockMetaBySlug(slug)?.primaryCategory;
}

export function getPrimarySegmentBySlug(slug: string): DocsBlockSegment | undefined {
  return getBlockMetaBySlug(slug)?.primarySegment;
}

export function getBlocksByCategory(category: DocsBlockCategory): DocsBlockMeta[] {
  return getAllBlocks().filter((block) => block.categories.includes(category));
}

export function getPrimaryBlocksByCategory(): Record<DocsBlockCategory, DocsBlockMeta[]> {
  return Object.fromEntries(
    BLOCK_CATEGORY_ORDER.map((category) => [
      category,
      getAllBlocks().filter((block) => block.primaryCategory === category),
    ]),
  ) as Record<DocsBlockCategory, DocsBlockMeta[]>;
}

export function getBlocksBySegment(segment: DocsBlockSegment): DocsBlockMeta[] {
  return getAllBlocks().filter((block) => block.segments.includes(segment));
}

export function getBlocksBySegmentAndCategory(
  segment: DocsBlockSegment,
  category: DocsBlockCategory,
): DocsBlockMeta[] {
  return getAllBlocks().filter(
    (block) => block.segments.includes(segment) && block.categories.includes(category),
  );
}

export function getBlockMetaByCategory(): Record<DocsBlockCategory, DocsBlockMeta[]> {
  return Object.fromEntries(
    BLOCK_CATEGORY_ORDER.map((category) => [
      category,
      getBlocksByCategory(category),
    ]),
  ) as Record<DocsBlockCategory, DocsBlockMeta[]>;
}

export function getAllBlockSegments(): DocsBlockSegment[] {
  return BLOCK_SEGMENT_ORDER;
}

export function getCategoriesForSegment(segment: DocsBlockSegment): DocsBlockCategory[] {
  return BLOCK_SEGMENT_CATEGORY_ORDER[segment];
}
