'use client';

import Link from 'next/link';
import type { RelatedComponent } from '@/lib/docs/registry/types';
import { getComponentBySlug } from '@/lib/docs/registry/selectors';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';

interface RelatedComponentsProps {
  related: RelatedComponent[];
  className?: string;
}

export function RelatedComponents({ related, className }: RelatedComponentsProps) {
  if (!related.length) return null;

  return (
    <div
      className={cn(
        'grid auto-rows-fr grid-cols-1 gap-4 @lg:grid-cols-2 @2xl:grid-cols-3',
        className,
      )}
    >
      {related.map((item) => {
        const component = getComponentBySlug(item.slug);
        if (!component) return null;

        return (
          <Link
            key={item.slug}
            href={`/docs/components/${item.slug}`}
            className="group block h-full"
          >
            <Surface
              tone="surfaceContainerLow"
              rounded="sm"
              className="hover:bg-surface-container flex h-full flex-col p-5 transition-colors"
            >
              <div className="mb-3 flex items-center gap-3">
                {component.icon && (
                  <Surface
                    tone="primaryContainer"
                    rounded="sm"
                    className="flex h-10 w-10 shrink-0 items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-on-primary-container text-[20px]">
                      {component.icon}
                    </span>
                  </Surface>
                )}
                <Typography
                  variant="titleMedium"
                  component="span"
                  className="text-on-surface group-hover:text-primary transition-colors"
                >
                  {component.name}
                </Typography>
              </div>
              <Typography
                variant="bodyMedium"
                component="p"
                className="text-on-surface-variant mt-auto line-clamp-3"
              >
                {item.reason}
              </Typography>
            </Surface>
          </Link>
        );
      })}
    </div>
  );
}
