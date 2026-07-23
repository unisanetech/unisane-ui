'use client';

import type { HierarchySectionDef } from '@/lib/docs/registry/types';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';

interface HierarchyGridProps {
  hierarchy: HierarchySectionDef;
  className?: string;
}

export function HierarchyGrid({ hierarchy, className }: HierarchyGridProps) {
  return (
    <div
      className={cn(
        'grid auto-rows-fr grid-cols-1 gap-6 @md:grid-cols-2 @xl:grid-cols-3',
        className,
      )}
    >
      {hierarchy.items.map((item, index) => (
        <Surface
          key={index}
          tone="surfaceContainerLow"
          rounded="sm"
          className="flex h-full flex-col p-5"
        >
          <div className="flex min-h-60 flex-1 items-center justify-center">{item.component}</div>

          <div className="mt-4">
            <Typography variant="titleMedium" component="h4">
              {item.title}
            </Typography>
            {item.subtitle && (
              <Typography
                variant="bodySmall"
                component="p"
                className="text-on-surface-variant mt-1"
              >
                {item.subtitle}
              </Typography>
            )}
          </div>
        </Surface>
      ))}
    </div>
  );
}
