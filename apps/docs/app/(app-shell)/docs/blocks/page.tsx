import { DocLayout } from '@/features/docs-page';
import { BlocksCatalog } from '@/features/blocks';

export default function BlocksPage() {
  return (
    <DocLayout
      title="Blocks"
      description="Real app scaffolds built with Unisane UI components, with live preview and copyable code."
    >
      <BlocksCatalog />
    </DocLayout>
  );
}
