import React from 'react';
import { cn } from '@/lib/utils';

export interface PreviewFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: 'auto' | 'video' | 'document' | 'square';
  tone?: 'plain' | 'surface' | 'muted';
  overflow?: 'hidden' | 'visible';
}

const aspectRatioClasses = {
  auto: '',
  video: 'aspect-video',
  document: 'aspect-[3/4]',
  square: 'aspect-square',
} as const;

const toneClasses = {
  plain: '',
  surface: 'bg-surface',
  muted: 'bg-surface-container-low',
} as const;

const overflowClasses = {
  hidden: 'overflow-hidden',
  visible: 'overflow-visible',
} as const;

export const PreviewFrame = React.forwardRef<HTMLDivElement, PreviewFrameProps>(
  (
    { aspectRatio = 'auto', tone = 'muted', overflow = 'hidden', className, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'border-outline-subtle relative min-w-0 rounded-sm border',
          aspectRatioClasses[aspectRatio],
          toneClasses[tone],
          overflowClasses[overflow],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
PreviewFrame.displayName = 'PreviewFrame';
