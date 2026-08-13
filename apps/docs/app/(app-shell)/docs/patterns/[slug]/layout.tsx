import { PATTERN_PAGE_META } from '@/lib/docs/content/patterns/pattern-page-meta';

export const dynamicParams = false;

export function generateStaticParams() {
  return PATTERN_PAGE_META.map(({ slug }) => ({ slug }));
}

export default function PatternDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
