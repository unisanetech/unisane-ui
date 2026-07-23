'use client';

import Link from 'next/link';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import {
  BLOCK_CATEGORY_META,
  BLOCK_SEGMENT_CATEGORY_ORDER,
  BLOCK_SEGMENT_META,
  getBlockSegmentCategoryHref,
} from '@/lib/docs/blocks/block-taxonomy';
import { BLOCK_REGISTRY } from '@/lib/docs/blocks/block-registry';
import type { DocsBlockCategory, DocsBlockSegment } from '@/lib/docs/blocks/types';
import { BlocksSegmentCatalog, BlocksSegmentCategoryCatalog } from './blocks-catalog';
import { BlocksPageLayout } from './blocks-page-layout';
import { BlockShowcaseSection } from './block-showcase-section';

const SEGMENT_HERO_VISUALS: Record<
  DocsBlockSegment,
  {
    tone: 'primaryContainer' | 'secondaryContainer' | 'tertiaryContainer';
    textClassName: string;
    supportingClassName: string;
  }
> = {
  marketing: {
    tone: 'tertiaryContainer',
    textClassName: 'text-on-tertiary-container',
    supportingClassName: 'text-on-tertiary-container/82',
  },
  commerce: {
    tone: 'secondaryContainer',
    textClassName: 'text-on-secondary-container',
    supportingClassName: 'text-on-secondary-container/82',
  },
  application: {
    tone: 'primaryContainer',
    textClassName: 'text-on-primary-container',
    supportingClassName: 'text-on-primary-container/82',
  },
};

export function BlocksSegmentPage({ segment }: { segment: DocsBlockSegment }) {
  const segmentMeta = BLOCK_SEGMENT_META[segment];
  const categories = BLOCK_SEGMENT_CATEGORY_ORDER[segment];
  const heroVisuals = SEGMENT_HERO_VISUALS[segment];

  return (
    <BlocksPageLayout
      hero={
        <Surface
          tone={heroVisuals.tone}
          rounded="md"
          className="expanded:px-14 expanded:py-14 px-7 py-9 @sm:px-9 @sm:py-11"
        >
          <div className="space-y-5">
            <div
              className={`flex flex-wrap items-center gap-3 text-sm font-medium tracking-[0.02em] ${heroVisuals.supportingClassName}`}
            >
              <span>Blocks</span>
              <span aria-hidden="true" className="text-current/40">
                /
              </span>
              <span>{segmentMeta.label}</span>
            </div>

            <div className="space-y-3">
              <Typography
                variant="displaySmall"
                component="h1"
                className={`${heroVisuals.textClassName} max-w-[8ch] text-[3rem] leading-[0.9] font-semibold tracking-tight text-balance @2xl:text-[4.1rem] @4xl:text-[5rem]`}
              >
                {segmentMeta.label}
              </Typography>
              <Typography
                variant="bodyLarge"
                className={`${heroVisuals.supportingClassName} max-w-[42rem] leading-relaxed`}
              >
                {segmentMeta.description}
              </Typography>
            </div>
          </div>
        </Surface>
      }
    >
      <div className="space-y-10">
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
    </BlocksPageLayout>
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
  const blocks = BLOCK_REGISTRY.filter(
    (block) => block.segments.includes(segment) && block.categories.includes(category),
  );
  const heroVisuals = SEGMENT_HERO_VISUALS[segment];

  return (
    <BlocksPageLayout
      hero={
        <Surface
          tone={heroVisuals.tone}
          rounded="md"
          className="expanded:px-14 expanded:py-14 px-7 py-9 @sm:px-9 @sm:py-11"
        >
          <div className="space-y-6">
            <div
              className={`flex flex-wrap items-center gap-3 text-sm font-medium tracking-[0.02em] ${heroVisuals.supportingClassName}`}
            >
              <span>{segmentMeta.label}</span>
              <span aria-hidden="true" className="text-current/40">
                /
              </span>
              <span>
                {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
              </span>
            </div>

            <div className="space-y-3">
              <Typography
                variant="displaySmall"
                component="h1"
                className={`${heroVisuals.textClassName} max-w-[8ch] text-[3rem] leading-[0.9] font-semibold tracking-tight text-balance @2xl:text-[4.1rem] @4xl:text-[5rem]`}
              >
                {categoryMeta.label}
              </Typography>
              <Typography
                variant="bodyLarge"
                className={`${heroVisuals.supportingClassName} max-w-[42rem] leading-relaxed`}
              >
                {categoryMeta.description}
              </Typography>
            </div>
          </div>
        </Surface>
      }
    >
      <div className="space-y-10">
        {blocks.length > 0 ? (
          <div className="space-y-12">
            {blocks.map((block) => (
              <section
                key={`${segment}-${category}-${block.slug}`}
                id={block.slug}
                className="border-outline-weak scroll-mt-24 border-b last:border-b-0"
              >
                <BlockShowcaseSection block={block} />
              </section>
            ))}
          </div>
        ) : (
          <BlocksSegmentCategoryCatalog segment={segment} category={category} />
        )}
      </div>
    </BlocksPageLayout>
  );
}
