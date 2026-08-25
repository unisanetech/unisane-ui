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
        'medium:px-3 medium:py-3 expanded:px-4 expanded:py-4 flex min-h-0 flex-1 flex-col px-2 py-2',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function HomeContentSection({ children, className, innerClassName }: HomeSectionProps) {
  return (
    <section className={cn('medium:px-8 expanded:px-12 px-5 py-18 @3xl:py-28', className)}>
      <div className={cn('mx-auto w-full max-w-7xl', innerClassName)}>{children}</div>
    </section>
  );
}
