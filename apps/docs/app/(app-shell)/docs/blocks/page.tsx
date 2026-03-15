import { DocLayout } from '@/features/docs-page';
import { BlocksCatalog } from '@/features/blocks';

export default function BlocksPage() {
  return (
    <DocLayout
      title="Blocks"
      description="Production-ready blocks for marketing, commerce, and application surfaces."
    >
      <BlocksCatalog />
    </DocLayout>
  );
}
