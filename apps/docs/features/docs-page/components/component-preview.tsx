'use client';

import React from 'react';
import { cn } from '@unisane/ui/utils';
import { Typography } from '@unisane/ui/typography';
import { Surface } from '@unisane/ui/surface';

interface ComponentPreviewProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function ComponentPreview({ children, className, title }: ComponentPreviewProps) {
  return (
    <div className={cn('my-6', className)}>
      {title && (
        <Typography variant="labelMedium" className="text-on-surface-variant mb-2">
          {title}
        </Typography>
      )}
      <Surface
        elevation={0}
        className="bg-surface-container flex min-h-[120px] items-center justify-center rounded-sm p-5"
      >
        {children}
      </Surface>
    </div>
  );
}
