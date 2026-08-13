'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';
import { StaticDocPageLayout } from '@/features/docs-page';
import { getPatternPageBySlug } from '@/lib/docs/content/patterns/pattern-pages';

export default function PatternDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const page = getPatternPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <StaticDocPageLayout doc={page} />;
}
