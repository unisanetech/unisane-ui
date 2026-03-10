"use client";

import React from "react";
import { cn } from "@unisane/ui";

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
    <div
      className={cn(
        "mb-10 flex min-h-[calc(100svh-var(--unit)*2)] flex-col @3xl:mb-14 expanded:min-h-[calc(100svh-var(--unit)*4)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function HomeHeroSection({ children, className }: HomeSectionProps) {
  return (
    <section
      className={cn(
        "flex min-h-0 flex-1 flex-col px-1 py-1 medium:px-1.5 medium:py-1.5 expanded:px-2 expanded:py-2",
        className
      )}
    >
      {children}
    </section>
  );
}

export function HomeContentSection({
  children,
  className,
  innerClassName,
}: HomeSectionProps) {
  return (
    <section className={cn("px-4 py-16 medium:px-6 @3xl:py-24 expanded:px-8", className)}>
      <div className={cn("mx-auto w-full max-w-6xl", innerClassName)}>{children}</div>
    </section>
  );
}
