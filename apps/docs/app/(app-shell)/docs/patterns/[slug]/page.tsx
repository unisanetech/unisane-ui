import { notFound } from 'next/navigation';
import { StaticDocPageLayout } from '@/features/docs-page';
import { PATTERN_PAGE_META } from '@/lib/docs/content/patterns/pattern-page-meta';
import { getPatternPageBySlug } from '@/lib/docs/content/patterns/pattern-pages';

export function generateStaticParams() {
  return PATTERN_PAGE_META.map((page) => ({ slug: page.slug }));
}

export default async function PatternDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPatternPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <StaticDocPageLayout doc={page} />;
}
