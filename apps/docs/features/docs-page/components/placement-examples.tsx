"use client";

import type { PlacementSectionDef } from "@/lib/docs/registry/types";
import { Surface, Typography } from "@unisane/ui";
import { cn } from "@unisane/ui/lib/utils";
import { PreviewStage, mergePreviewStageConfig } from "./preview-stage";

interface PlacementExamplesProps {
  placement: PlacementSectionDef;
  className?: string;
}

export function PlacementExamples({ placement, className }: PlacementExamplesProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 @xl:grid-cols-2 gap-6 auto-rows-fr",
        className
      )}
    >
      {placement.examples.map((example, index) => (
        <Surface
          key={index}
          tone="surfaceContainerLow"
          rounded="sm"
          className="h-full overflow-visible flex flex-col p-5"
        >
          <Typography variant="titleMedium" component="h3">
            {example.title}
          </Typography>

          <div className="mt-5 flex-1">
            <PreviewStage
              config={mergePreviewStageConfig(
                placement.previewDefaults,
                example.preview
              )}
              className="h-full"
            >
              {example.visual}
            </PreviewStage>
          </div>

          {example.caption && (
            <Typography
              variant="bodySmall"
              component="p"
              className="mt-5 text-center text-on-surface-variant"
            >
              {example.caption}
            </Typography>
          )}
        </Surface>
      ))}
    </div>
  );
}
