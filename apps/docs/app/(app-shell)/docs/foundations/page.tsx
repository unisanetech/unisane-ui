import { DocLayout, StaticDocCardGrid } from '@/features/docs-page';
import { getAllFoundationPages } from '@/lib/docs/content/foundations/selectors';

export default function FoundationsPage() {
  return (
    <DocLayout
      title="Foundations"
      description="Understand the core design principles and token system that power Unisane UI."
    >
      <StaticDocCardGrid pages={getAllFoundationPages()} hrefPrefix="/docs/foundations" />
    </DocLayout>
  );
}
