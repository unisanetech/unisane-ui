import { notFound } from 'next/navigation';
import { DocLayout } from '@/features/docs-page';
import { BlocksSegmentCategoryPage } from '@/features/blocks/components/blocks-segment-page';
import {
  BLOCK_CATEGORY_META,
  BLOCK_SEGMENT_CATEGORY_ORDER,
} from '@/lib/docs/blocks/block-taxonomy';
import type { DocsBlockCategory } from '@/lib/docs/blocks/types';

export function generateStaticParams() {
  return BLOCK_SEGMENT_CATEGORY_ORDER.commerce.map((category) => ({ category }));
}

export default async function BlocksCommerceCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!BLOCK_SEGMENT_CATEGORY_ORDER.commerce.includes(category as DocsBlockCategory)) {
    notFound();
  }

  const categoryKey = category as DocsBlockCategory;

  return (
    <DocLayout
      title={`${BLOCK_CATEGORY_META[categoryKey].label} Commerce Blocks`}
      description={BLOCK_CATEGORY_META[categoryKey].description}
    >
      <BlocksSegmentCategoryPage segment="commerce" category={categoryKey} />
    </DocLayout>
  );
}
