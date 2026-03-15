'use client';

import Link from 'next/link';
import { Surface, Typography } from '@unisane/ui';
import { BLOCK_REGISTRY } from '@/lib/docs/blocks/block-registry';
import {
  BLOCK_CATEGORY_META,
  BLOCK_SEGMENT_CATEGORY_ORDER,
  BLOCK_SEGMENT_META,
  BLOCK_SEGMENT_ORDER,
  getBlockSegmentCategoryHref,
  getBlockSegmentHref,
} from '@/lib/docs/blocks/block-taxonomy';
import type { DocsBlockCategory, DocsBlockSegment } from '@/lib/docs/blocks/types';
import { PreviewStage } from '@/features/docs-page/components/preview-stage';

function getSegmentBlocks(segment: DocsBlockSegment) {
  return BLOCK_REGISTRY.filter((block) => block.primarySegment === segment);
}

function getSegmentCategoryBlocks(segment: DocsBlockSegment, category: DocsBlockCategory) {
  return BLOCK_REGISTRY.filter(
    (block) => block.segments.includes(segment) && block.categories.includes(category),
  );
}

function BlockGrid({ blocks }: { blocks: typeof BLOCK_REGISTRY }) {
  if (!blocks.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-2">
      {blocks.map((block) => (
        <Link key={block.slug} href={`/docs/blocks/${block.slug}`} className="group block">
          <Surface
            tone="surfaceContainerLow"
            rounded="sm"
            className="group-hover:bg-surface-container overflow-hidden transition-colors"
          >
            <PreviewStage
              config={{
                tone: 'surfaceContainerLow',
                minHeight: 'xl',
                padding: 'md',
                ...block.previewConfig,
              }}
            >
              {block.preview}
            </PreviewStage>
            <div className="border-outline-variant flex items-center justify-between gap-3 border-t p-4">
              <div className="min-w-0">
                <Typography variant="titleMedium" component="h3" className="truncate">
                  {block.title}
                </Typography>
                <Typography
                  variant="bodySmall"
                  className="text-on-surface-variant mt-1 line-clamp-2"
                >
                  {block.description}
                </Typography>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-all group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </div>
          </Surface>
        </Link>
      ))}
    </div>
  );
}

function BlocksSegmentSection({
  segment,
  blocks,
}: {
  segment: DocsBlockSegment;
  blocks: typeof BLOCK_REGISTRY;
}) {
  const segmentMeta = BLOCK_SEGMENT_META[segment];
  const segmentCategories = BLOCK_SEGMENT_CATEGORY_ORDER[segment];

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <Typography variant="headlineMedium" component="h2">
            {segmentMeta.label}
          </Typography>
          <Link href={getBlockSegmentHref(segment)} className="text-label-large text-primary hover:underline">
            View all
          </Link>
        </div>
        <Typography variant="bodyLarge" className="text-on-surface-variant max-w-3xl">
          {segmentMeta.description}
        </Typography>
        <div className="flex flex-wrap gap-3">
          {segmentCategories.map((category) => (
            <Link
              key={`${segment}-${category}`}
              href={getBlockSegmentCategoryHref(segment, category)}
              className="text-label-large bg-surface-container-low text-on-surface hover:bg-surface-container inline-flex items-center rounded-full px-4 py-2 transition-colors"
            >
              {BLOCK_CATEGORY_META[category].label}
            </Link>
          ))}
        </div>
      </div>

      {blocks.length > 0 ? (
        <BlockGrid blocks={blocks} />
      ) : (
        <div className="text-on-surface-variant text-body-large rounded-sm border border-dashed border-outline-variant p-6">
          No blocks are published in this segment yet.
        </div>
      )}
    </section>
  );
}

function BlocksCategorySection({
  segment,
  category,
  blocks,
  sectionId,
}: {
  segment: DocsBlockSegment;
  category: DocsBlockCategory;
  blocks: typeof BLOCK_REGISTRY;
  sectionId?: string;
}) {
  const categoryMeta = BLOCK_CATEGORY_META[category];

  return (
    <section id={sectionId} className="scroll-mt-24 space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <Typography variant="headlineSmall" component="h2">
            {categoryMeta.label}
          </Typography>
          <Link
            href={getBlockSegmentCategoryHref(segment, category)}
            className="text-label-large text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <Typography variant="bodyLarge" className="text-on-surface-variant max-w-3xl">
          {categoryMeta.description}
        </Typography>
      </div>
      {blocks.length > 0 ? (
        <BlockGrid blocks={blocks} />
      ) : (
        <div className="text-on-surface-variant text-body-large rounded-sm border border-dashed border-outline-variant p-6">
          No blocks are published in this category yet.
        </div>
      )}
    </section>
  );
}

export function BlocksCatalog() {
  return (
    <div className="space-y-12">
      {BLOCK_SEGMENT_ORDER.map((segment) => (
        <BlocksSegmentSection key={segment} segment={segment} blocks={getSegmentBlocks(segment)} />
      ))}
    </div>
  );
}

export function BlocksSegmentCatalog({ segment }: { segment: DocsBlockSegment }) {
  const categories = BLOCK_SEGMENT_CATEGORY_ORDER[segment];

  return (
    <div className="space-y-12">
      {categories.map((category) => {
        const blocks = getSegmentCategoryBlocks(segment, category);
        if (!blocks.length) return null;

        return (
          <BlocksCategorySection
            key={`${segment}-${category}`}
            segment={segment}
            category={category}
            blocks={blocks}
            sectionId={`${segment}-${category}`}
          />
        );
      })}
    </div>
  );
}

export function BlocksSegmentCategoryCatalog({
  segment,
  category,
}: {
  segment: DocsBlockSegment;
  category: DocsBlockCategory;
}) {
  return (
    <BlocksCategorySection
      segment={segment}
      category={category}
      blocks={getSegmentCategoryBlocks(segment, category)}
      sectionId={`${segment}-${category}`}
    />
  );
}
