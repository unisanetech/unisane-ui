import { DocLayout, StaticDocCardGrid } from '@/features/docs-page';
import { getAllPatternPages } from '@/lib/docs/content/patterns/selectors';

export default function PatternsPage() {
  return (
    <DocLayout
      title="Patterns"
      description="Apply repeatable composition guidance for layouts, forms, navigation, and data-heavy product surfaces."
    >
      <StaticDocCardGrid pages={getAllPatternPages()} hrefPrefix="/docs/patterns" />
    </DocLayout>
  );
}
