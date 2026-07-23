'use client';

import Link from 'next/link';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';

interface PageLink {
  slug: string;
  name: string;
}

interface PageNavigationProps {
  previous?: PageLink;
  next?: PageLink;
  className?: string;
}

/**
 * Previous/Next navigation for component docs
 * - Stacks vertically on mobile
 * - Side-by-side on larger screens (@md+)
 * - Responsive text sizes and padding
 */
export function PageNavigation({ previous, next, className }: PageNavigationProps) {
  if (!previous && !next) return null;

  return (
    <div className={cn('grid auto-rows-fr grid-cols-1 gap-3 @md:grid-cols-2 @md:gap-4', className)}>
      {/* Previous */}
      {previous ? (
        <Link href={`/docs/components/${previous.slug}`} className="group block h-full">
          <Surface
            tone="surfaceContainerLow"
            rounded="sm"
            className="hover:bg-surface-container flex h-full items-center gap-4 p-5 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary shrink-0 text-[20px] transition-colors">
              arrow_back
            </span>
            <div className="flex min-w-0 flex-col">
              <Typography variant="labelSmall" component="span" className="text-on-surface-variant">
                Previous
              </Typography>
              <Typography
                variant="titleSmall"
                component="span"
                className="text-on-surface group-hover:text-primary truncate transition-colors"
              >
                {previous.name}
              </Typography>
            </div>
          </Surface>
        </Link>
      ) : (
        <div className="hidden @md:block" />
      )}

      {/* Next */}
      {next ? (
        <Link href={`/docs/components/${next.slug}`} className="group block h-full">
          <Surface
            tone="surfaceContainerLow"
            rounded="sm"
            className="hover:bg-surface-container flex h-full items-center justify-end gap-4 p-5 transition-colors"
          >
            <div className="flex min-w-0 flex-col items-end">
              <Typography variant="labelSmall" component="span" className="text-on-surface-variant">
                Up next
              </Typography>
              <Typography
                variant="titleSmall"
                component="span"
                className="text-on-surface group-hover:text-primary truncate transition-colors"
              >
                {next.name}
              </Typography>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary shrink-0 text-[20px] transition-colors">
              arrow_forward
            </span>
          </Surface>
        </Link>
      ) : (
        <div className="hidden @md:block" />
      )}
    </div>
  );
}
