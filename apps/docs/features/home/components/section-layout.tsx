'use client';

import React from 'react';
import { cn } from '@unisane/ui/utils';

interface HomeViewportProps {
  children: React.ReactNode;
  className?: string;
}

interface HomeSectionProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export function HomeViewport({ children, className }: HomeViewportProps) {
  return (
    <div className={cn('flex min-h-[100dvh] min-h-[100vh] flex-col', className)}>{children}</div>
  );
}

export function HomeHeroSection({ children, className }: HomeSectionProps) {
  return (
    <section
      className={cn(
        'medium:px-1.5 medium:py-1.5 expanded:px-2 expanded:py-2 flex min-h-0 flex-1 flex-col px-1 py-1',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function HomeContentSection({ children, className, innerClassName }: HomeSectionProps) {
  return (
    <section className={cn('medium:px-6 expanded:px-8 px-4 py-16 @3xl:py-24', className)}>
      <div className={cn('mx-auto w-full max-w-6xl', innerClassName)}>{children}</div>
    </section>
  );
}
