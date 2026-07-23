'use client';

import type { PlacementSectionDef } from '@/lib/docs/registry/types';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';
import { PreviewStage, mergePreviewStageConfig } from './preview-stage';

interface PlacementExamplesProps {
  placement: PlacementSectionDef;
  className?: string;
}

export function PlacementExamples({ placement, className }: PlacementExamplesProps) {
  return (
    <div className={cn('grid auto-rows-fr grid-cols-1 gap-6 @xl:grid-cols-2', className)}>
      {placement.examples.map((example, index) => (
        <Surface
          key={index}
          tone="surfaceContainerLow"
          rounded="sm"
          className="flex h-full flex-col overflow-visible p-5"
        >
          <Typography variant="titleMedium" component="h3">
            {example.title}
          </Typography>

          <div className="mt-5 flex-1">
            <PreviewStage
              config={mergePreviewStageConfig(placement.previewDefaults, example.preview)}
              className="h-full"
            >
              {example.visual}
            </PreviewStage>
          </div>

          {example.caption && (
            <Typography
              variant="bodySmall"
              component="p"
              className="text-on-surface-variant mt-5 text-center"
            >
              {example.caption}
            </Typography>
          )}
        </Surface>
      ))}
    </div>
  );
}
