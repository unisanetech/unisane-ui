'use client';

import { getRegisteredBlockBySlug } from '@/lib/docs/blocks/block-registry';
import { BLOCK_CATEGORY_META, getBlockSegmentCategoryHref } from '@/lib/docs/blocks/block-taxonomy';
import { BlockShowcaseSection } from './block-showcase-section';

export function BlockDetailPage({ slug }: { slug: string }) {
  const block = getRegisteredBlockBySlug(slug);

  if (!block) {
    return null;
  }

  const categoryMeta = BLOCK_CATEGORY_META[block.primaryCategory];

  return (
    <BlockShowcaseSection
      block={block}
      headingAs="h1"
      backLinkHref={getBlockSegmentCategoryHref(block.primarySegment, block.primaryCategory)}
      backLinkLabel={`Back to ${categoryMeta.label}`}
    />
  );
}
