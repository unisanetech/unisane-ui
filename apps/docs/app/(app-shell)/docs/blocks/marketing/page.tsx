import { DocLayout } from '@/features/docs-page';
import { BlocksSegmentPage } from '@/features/blocks/components/blocks-segment-page';

export default function BlocksMarketingPage() {
  return (
    <DocLayout
      title="Marketing Blocks"
      description="Hero, header, footer, pricing, CTA, grid, and social-proof blocks for marketing surfaces."
    >
      <BlocksSegmentPage segment="marketing" />
    </DocLayout>
  );
}
