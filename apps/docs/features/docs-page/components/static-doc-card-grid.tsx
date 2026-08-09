import Link from 'next/link';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';

export type StaticDocCard = {
  slug: string;
  icon: string;
  title: string;
  description: string;
};

export function StaticDocCardGrid({
  pages,
  hrefPrefix,
}: {
  pages: StaticDocCard[];
  hrefPrefix: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {pages.map((page) => (
        <Link key={page.slug} href={`${hrefPrefix}/${page.slug}`} className="group block h-full">
          <Surface
            tone="surfaceContainerLow"
            rounded="sm"
            className="group-hover:bg-surface-container h-full p-6 transition-colors"
          >
            <div className="bg-secondary-container mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <span className="material-symbols-outlined text-on-secondary-container text-[24px]">
                {page.icon}
              </span>
            </div>
            <Typography
              variant="titleLarge"
              component="h3"
              className="group-hover:text-primary mb-2 transition-colors"
            >
              {page.title}
            </Typography>
            <Typography variant="bodyMedium" className="text-on-surface-variant leading-relaxed">
              {page.description}
            </Typography>
          </Surface>
        </Link>
      ))}
    </div>
  );
}
