import Link from 'next/link';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import { DocLayout } from '@/features/docs-page';
import { getAllFoundationPages } from '@/lib/docs/content/foundations/selectors';

export default function FoundationsPage() {
  return (
    <DocLayout
      title="Foundations"
      description="Understand the core design principles and token system that power Unisane UI."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {getAllFoundationPages().map((page) => (
          <FoundationCard
            key={page.slug}
            icon={page.icon}
            title={page.title}
            description={page.description}
            href={`/docs/foundations/${page.slug}`}
          />
        ))}
      </div>
    </DocLayout>
  );
}

function FoundationCard({
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
        <div className="bg-secondary-container mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <span className="material-symbols-outlined text-on-secondary-container text-[24px]">
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
