'use client';

import { Surface } from '@unisane/ui/surface';
import { cn } from '@unisane/ui/utils';
import type { PreviewStageConfig } from '@/lib/docs/registry/types';

interface PreviewStageProps {
  children: React.ReactNode;
  config?: PreviewStageConfig;
  className?: string;
}

const alignClasses = {
  center: 'items-center',
  start: 'items-start',
  end: 'items-end',
};

const justifyClasses = {
  center: 'justify-center',
  start: 'justify-start',
  end: 'justify-end',
};

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

const minHeightClasses = {
  sm: 'min-h-[140px] @sm:min-h-[160px]',
  md: 'min-h-[180px] @sm:min-h-[220px]',
  lg: 'min-h-[220px] @sm:min-h-[260px] @xl:min-h-[280px]',
  xl: 'min-h-[260px] @sm:min-h-[300px] @xl:min-h-[340px]',
  '2xl': 'min-h-[280px] @sm:min-h-[340px] @xl:min-h-[420px]',
  screen: 'min-h-[calc(100svh-10rem)]',
};

const overflowClasses = {
  hidden: 'overflow-hidden',
  visible: 'overflow-visible',
};

export function mergePreviewStageConfig(
  defaults?: PreviewStageConfig,
  override?: PreviewStageConfig,
): PreviewStageConfig {
  return { ...defaults, ...override };
}

export function PreviewStage({ children, config, className }: PreviewStageProps) {
  const tone = config?.tone ?? 'surface';
  const overflow = config?.overflow ?? 'hidden';
  const minHeight = config?.minHeight ?? 'md';
  const align = config?.align ?? 'center';
  const justify = config?.justify ?? 'center';
  const padding = config?.padding ?? 'md';

  return (
    <Surface
      tone={tone}
      rounded="sm"
      className={cn(
        'relative flex w-full min-w-0',
        overflowClasses[overflow],
        minHeightClasses[minHeight],
        alignClasses[align],
        justifyClasses[justify],
        paddingClasses[padding],
        className,
      )}
    >
      <div className="relative h-full min-h-0 w-full max-w-full min-w-0">{children}</div>
    </Surface>
  );
}
