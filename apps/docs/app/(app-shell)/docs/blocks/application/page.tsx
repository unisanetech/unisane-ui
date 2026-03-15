import { DocLayout } from '@/features/docs-page';
import { BlocksSegmentPage } from '@/features/blocks/components/blocks-segment-page';

export default function BlocksApplicationPage() {
  return (
    <DocLayout
      title="Application Blocks"
      description="Auth, onboarding, settings, billing, dashboard, workflow, layout, and navigation blocks for product surfaces."
    >
      <BlocksSegmentPage segment="application" />
    </DocLayout>
  );
}
