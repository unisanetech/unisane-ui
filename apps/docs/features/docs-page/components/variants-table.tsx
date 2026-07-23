'use client';

import type { VariantDef } from '@/lib/docs/registry/types';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';

interface VariantsTableProps {
  variants: VariantDef[];
  className?: string;
}

export function VariantsTable({ variants, className }: VariantsTableProps) {
  if (!variants.length) return null;

  return (
    <div className={cn('space-y-8', className)}>
      {variants.map((variant) => (
        <div key={variant.name} className="space-y-4">
          <div className="flex items-center gap-3">
            <code className="text-primary text-title-small font-mono font-semibold">
              {variant.name}
            </code>
            <code className="text-on-surface-variant text-body-small bg-surface-variant rounded-xs px-2 py-0.5 font-mono">
              {variant.type}
            </code>
            <span className="text-body-small text-on-surface-variant">
              Default: <code className="font-mono">{variant.default}</code>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @2xl:grid-cols-3">
            {variant.options.map((option) => (
              <Surface key={option.value} tone="surfaceContainerLow" rounded="sm" className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <code className="text-primary text-label-large font-mono font-medium">
                    {option.value}
                  </code>
                  <Typography variant="labelMedium" component="span" className="text-on-surface">
                    {option.label}
                  </Typography>
                </div>
                {option.description && (
                  <Typography variant="bodySmall" component="p" className="text-on-surface-variant">
                    {option.description}
                  </Typography>
                )}
              </Surface>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
