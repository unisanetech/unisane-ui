"use client";

import type { HierarchySectionDef } from "@/lib/docs/registry/types";
import { Surface, Typography } from "@unisane/ui";
import { cn } from "@unisane/ui/lib/utils";

interface HierarchyGridProps {
  hierarchy: HierarchySectionDef;
  className?: string;
}

export function HierarchyGrid({ hierarchy, className }: HierarchyGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 gap-6 auto-rows-fr",
        className
      )}
    >
      {hierarchy.items.map((item, index) => (
        <Surface
          key={index}
          tone="surfaceContainerLow"
          rounded="sm"
          className="h-full p-5 flex flex-col"
        >
          <div className="flex flex-1 items-center justify-center min-h-60">
            {item.component}
          </div>

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
