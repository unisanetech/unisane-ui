'use client';

import Link from 'next/link';
import { Typography } from '@unisane/ui';
import {
  BLOCK_CATEGORY_META,
  BLOCK_SEGMENT_CATEGORY_ORDER,
  BLOCK_SEGMENT_META,
  getBlockSegmentCategoryHref,
} from '@/lib/docs/blocks/block-taxonomy';
import type { DocsBlockCategory, DocsBlockSegment } from '@/lib/docs/blocks/types';
import { BlocksSegmentCatalog, BlocksSegmentCategoryCatalog } from './blocks-catalog';

export function BlocksSegmentPage({ segment }: { segment: DocsBlockSegment }) {
  const segmentMeta = BLOCK_SEGMENT_META[segment];
  const categories = BLOCK_SEGMENT_CATEGORY_ORDER[segment];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <Typography variant="headlineMedium" component="h1">
          {segmentMeta.label} Blocks
        </Typography>
        <Typography variant="bodyLarge" className="text-on-surface-variant max-w-3xl leading-relaxed">
          {segmentMeta.description}
        </Typography>
      </div>

      <nav aria-label={`${segmentMeta.label} block categories`} className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Link
            key={`${segment}-${category}`}
            href={getBlockSegmentCategoryHref(segment, category)}
            className="text-label-large bg-surface-container-low text-on-surface hover:bg-surface-container inline-flex items-center rounded-full px-4 py-2 transition-colors"
          >
            {BLOCK_CATEGORY_META[category].label}
          </Link>
        ))}
      </nav>

      <BlocksSegmentCatalog segment={segment} />
    </div>
  );
}

export function BlocksSegmentCategoryPage({
  segment,
  category,
}: {
  segment: DocsBlockSegment;
  category: DocsBlockCategory;
}) {
  const segmentMeta = BLOCK_SEGMENT_META[segment];
  const categoryMeta = BLOCK_CATEGORY_META[category];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <Typography variant="headlineMedium" component="h1">
          {categoryMeta.label}
        </Typography>
        <Typography variant="bodyLarge" className="text-on-surface-variant max-w-3xl leading-relaxed">
          {categoryMeta.description}
        </Typography>
        <Typography variant="bodyMedium" className="text-on-surface-variant">
          {segmentMeta.label}
        </Typography>
      </div>

      <BlocksSegmentCategoryCatalog segment={segment} category={category} />
    </div>
  );
}
