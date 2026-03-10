import { notFound } from 'next/navigation';
import { BlockDetailPage as BlockDetailView } from '@/features/blocks';
import { getAllBlocks, getBlockMetaBySlug } from '@/lib/docs/blocks/selectors';

export function generateStaticParams() {
  return getAllBlocks().map((block) => ({ slug: block.slug }));
}

export default async function BlockDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const block = getBlockMetaBySlug(slug);

  if (!block) {
    notFound();
  }

  return <BlockDetailView slug={slug} />;
}
