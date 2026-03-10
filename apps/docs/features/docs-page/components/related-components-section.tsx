"use client";

import Link from "next/link";
import type { RelatedComponent } from "@/lib/docs/registry/types";
import { getComponentBySlug } from "@/lib/docs/registry/selectors";
import { Surface, Typography } from "@unisane/ui";
import { cn } from "@unisane/ui/lib/utils";

interface RelatedComponentsProps {
  related: RelatedComponent[];
  className?: string;
}

export function RelatedComponents({
  related,
  className,
}: RelatedComponentsProps) {
  if (!related.length) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3 gap-4 auto-rows-fr",
        className
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
              className="h-full p-5 hover:bg-surface-container transition-colors flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                {component.icon && (
                  <Surface
                    tone="primaryContainer"
                    rounded="sm"
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                  >
                    <span className="material-symbols-outlined text-[20px] text-on-primary-container">
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
