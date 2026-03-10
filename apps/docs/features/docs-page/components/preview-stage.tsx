"use client";

import { Surface } from "@unisane/ui";
import { cn } from "@unisane/ui/lib/utils";
import type { PreviewStageConfig } from "@/lib/docs/registry/types";

interface PreviewStageProps {
  children: React.ReactNode;
  config?: PreviewStageConfig;
  className?: string;
}

const alignClasses = {
  center: "items-center",
  start: "items-start",
  end: "items-end",
};

const justifyClasses = {
  center: "justify-center",
  start: "justify-start",
  end: "justify-end",
};

const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

const minHeightClasses = {
  sm: "min-h-[160px]",
  md: "min-h-[220px]",
  lg: "min-h-[280px]",
  xl: "min-h-[340px]",
  "2xl": "min-h-[420px]",
};

const overflowClasses = {
  hidden: "overflow-hidden",
  visible: "overflow-visible",
};

export function mergePreviewStageConfig(
  defaults?: PreviewStageConfig,
  override?: PreviewStageConfig
): PreviewStageConfig {
  return { ...defaults, ...override };
}

export function PreviewStage({
  children,
  config,
  className,
}: PreviewStageProps) {
  const tone = config?.tone ?? "surface";
  const overflow = config?.overflow ?? "hidden";
  const minHeight = config?.minHeight ?? "md";
  const align = config?.align ?? "center";
  const justify = config?.justify ?? "center";
  const padding = config?.padding ?? "md";

  return (
    <Surface
      tone={tone}
      rounded="sm"
      className={cn(
        "relative flex w-full",
        overflowClasses[overflow],
        minHeightClasses[minHeight],
        alignClasses[align],
        justifyClasses[justify],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </Surface>
  );
}
