import { notFound } from 'next/navigation';
import { BlocksSegmentCategoryPage } from '@/features/blocks/components/blocks-segment-page';
import { BLOCK_SEGMENT_CATEGORY_ORDER } from '@/lib/docs/blocks/block-taxonomy';
import type { DocsBlockCategory } from '@/lib/docs/blocks/types';

export function generateStaticParams() {
  return BLOCK_SEGMENT_CATEGORY_ORDER.marketing.map((category) => ({ category }));
}

export default async function BlocksMarketingCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!BLOCK_SEGMENT_CATEGORY_ORDER.marketing.includes(category as DocsBlockCategory)) {
    notFound();
  }

  const categoryKey = category as DocsBlockCategory;

  return <BlocksSegmentCategoryPage segment="marketing" category={categoryKey} />;
}
