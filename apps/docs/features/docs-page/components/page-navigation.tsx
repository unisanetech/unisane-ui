"use client";

import Link from "next/link";
import { Surface, Typography } from "@unisane/ui";
import { cn } from "@unisane/ui/lib/utils";

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
    <div
      className={cn(
        "grid grid-cols-1 @md:grid-cols-2 gap-3 @md:gap-4 auto-rows-fr",
        className
      )}
    >
      {/* Previous */}
      {previous ? (
        <Link
          href={`/docs/components/${previous.slug}`}
          className="group block h-full"
        >
          <Surface
            tone="surfaceContainerLow"
            rounded="sm"
            className="h-full p-5 hover:bg-surface-container transition-colors flex items-center gap-4"
          >
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors shrink-0">
              arrow_back
            </span>
            <div className="flex flex-col min-w-0">
              <Typography
                variant="labelSmall"
                component="span"
                className="text-on-surface-variant"
              >
                Previous
              </Typography>
              <Typography
                variant="titleSmall"
                component="span"
                className="text-on-surface group-hover:text-primary transition-colors truncate"
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
        <Link
          href={`/docs/components/${next.slug}`}
          className="group block h-full"
        >
          <Surface
            tone="surfaceContainerLow"
            rounded="sm"
            className="h-full p-5 hover:bg-surface-container transition-colors flex items-center justify-end gap-4"
          >
            <div className="flex flex-col items-end min-w-0">
              <Typography
                variant="labelSmall"
                component="span"
                className="text-on-surface-variant"
              >
                Up next
              </Typography>
              <Typography
                variant="titleSmall"
                component="span"
                className="text-on-surface group-hover:text-primary transition-colors truncate"
              >
                {next.name}
              </Typography>
            </div>
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors shrink-0">
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
