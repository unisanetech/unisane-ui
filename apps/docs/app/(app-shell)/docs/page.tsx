import { DocLayout } from '@/features/docs-page';
import Link from 'next/link';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';

export default function DocsPage() {
  return (
    <DocLayout
      title="Documentation"
      description="Add open-code Unisane UI components to your React application and make them your own."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <QuickLinkCard
          icon="rocket_launch"
          title="Getting Started"
          description="Initialize the registry and add application-owned components."
          href="/docs/getting-started"
        />
        <QuickLinkCard
          icon="palette"
          title="Foundations"
          description="Understand the design tokens, colors, typography, and spacing system."
          href="/docs/foundations"
        />
        <QuickLinkCard
          icon="widgets"
          title="Components"
          description="Explore documented open-code React components and their usage patterns."
          href="/docs/components"
        />
        <QuickLinkCard
          icon="dashboard"
          title="Blocks"
          description="Browse real app scaffolds and reusable interface compositions."
          href="/docs/blocks"
        />
      </div>
    </DocLayout>
  );
}

function QuickLinkCard({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block h-full">
      <Surface
        tone="surfaceContainerLow"
        rounded="sm"
        className="group-hover:bg-surface-container h-full p-6 transition-colors"
      >
        <div className="bg-primary-container mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <span className="material-symbols-outlined text-on-primary-container !text-[24px]">
            {icon}
          </span>
        </div>
        <Typography
          variant="titleLarge"
          component="h3"
          className="group-hover:text-primary mb-2 transition-colors"
        >
          {title}
        </Typography>
        <Typography variant="bodyMedium" className="text-on-surface-variant leading-relaxed">
          {description}
        </Typography>
      </Surface>
    </Link>
  );
}
