import { notFound } from 'next/navigation';
import { StaticDocPageLayout } from '@/features/docs-page';
import { FOUNDATION_PAGE_META } from '@/lib/docs/content/foundations/foundation-page-meta';
import { getFoundationPageBySlug } from '@/lib/docs/content/foundations/foundation-pages';

export function generateStaticParams() {
  return FOUNDATION_PAGE_META.map((page) => ({ slug: page.slug }));
}

export default async function FoundationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getFoundationPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <StaticDocPageLayout doc={page} />;
}
