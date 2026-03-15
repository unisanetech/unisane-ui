import { DocLayout } from '@/features/docs-page';
import { BlocksSegmentPage } from '@/features/blocks/components/blocks-segment-page';

export default function BlocksCommercePage() {
  return (
    <DocLayout
      title="Commerce Blocks"
      description="Product, catalog, cart, checkout, account, and merchandising blocks for commerce flows."
    >
      <BlocksSegmentPage segment="commerce" />
    </DocLayout>
  );
}
