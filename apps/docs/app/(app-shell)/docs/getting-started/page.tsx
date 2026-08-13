import { DocLayout } from '@/features/docs-page';
import { Typography } from '@unisane/ui/typography';
import { Card } from '@unisane/ui/card';

export default function GettingStartedPage() {
  return (
    <DocLayout
      title="Get Started"
      description="Use the registry to install and own Unisane UI component source in your React project."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <QuickLinkCard
          icon="download"
          title="Installation"
          description="Run the UI registry CLI and initialize your project."
          href="/docs/getting-started/installation"
        />
        <QuickLinkCard
          icon="play_arrow"
          title="Quick Start"
          description="Add and adapt your first application-owned component."
          href="/docs/getting-started/quick-start"
        />
        <QuickLinkCard
          icon="format_paint"
          title="Styling"
          description="Learn how to customize components with Tailwind CSS."
          href="/docs/getting-started/styling"
        />
        <QuickLinkCard
          icon="palette"
          title="Building Themes"
          description="Create custom themes with the design token system."
          href="/docs/getting-started/theming"
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
    <a href={href} className="group block">
      <Card
        variant="outlined"
        className="bg-surface-container-low hover:bg-surface-container hover:shadow-1 rounded-xl p-6 transition-all duration-200"
      >
        <div className="bg-primary-container mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <span className="material-symbols-outlined text-on-primary-container text-[24px]!">
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
        <Typography variant="bodyMedium" className="text-on-surface-variant">
          {description}
        </Typography>
      </Card>
    </a>
  );
}
