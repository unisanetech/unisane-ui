"use client";

import React from "react";
import { Typography, Surface } from "@unisane/ui";
import type { PreviewStageConfig } from "@/lib/docs/registry/types";
import { TableOfContents } from "@/features/shell";

export interface TocItem {
  id: string;
  label: string;
}

interface DocLayoutProps {
  title: string;
  description: string;
  heroContent?: React.ReactNode;
  heroPreview?: PreviewStageConfig;
  heroEyebrow?: React.ReactNode;
  heroMeta?: React.ReactNode;
  toc?: TocItem[];
  children: React.ReactNode;
}

export function DocLayout({
  title,
  description,
  heroContent,
  heroPreview,
  heroEyebrow,
  heroMeta,
  toc,
  children,
}: DocLayoutProps) {
  const heroMinHeightClass =
    heroPreview?.minHeight === "sm"
      ? "min-h-[240px] @2xl:min-h-[280px] @3xl:min-h-[300px]"
      : heroPreview?.minHeight === "md"
        ? "min-h-[280px] @2xl:min-h-[320px] @3xl:min-h-[360px]"
        : heroPreview?.minHeight === "xl"
          ? "min-h-[320px] @2xl:min-h-[380px] @3xl:min-h-[440px] @5xl:min-h-[500px]"
          : "min-h-[280px] @2xl:min-h-[340px] @3xl:min-h-[380px] @5xl:min-h-[420px]";
  const heroOverflowClass =
    heroPreview?.overflow === "visible" ? "overflow-visible" : "overflow-hidden";

  return (
    <div className="animate-slide-up w-full pb-14 @3xl:pb-24 overflow-x-clip">
      <header
        className={
          heroContent
            ? "mb-10 @3xl:mb-16 grid grid-cols-1 @3xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-6 @2xl:gap-8 @3xl:gap-12 items-center"
            : "mb-10 @3xl:mb-16"
        }
      >
        <div
          className={
            heroContent
              ? "order-2 @3xl:order-1 flex flex-col gap-5 @3xl:gap-6 justify-center py-1 @3xl:py-3"
              : "flex flex-col gap-5 @3xl:gap-6"
          }
        >
          {heroEyebrow ? (
            <div className="flex flex-wrap items-center gap-2">
              {heroEyebrow}
            </div>
          ) : null}
          <h1 className="max-w-[9ch] text-[2.5rem] @2xl:text-[3.25rem] @4xl:text-[4.25rem] leading-[0.92] font-semibold tracking-tight wrap-break-word text-on-surface">
            {title}
          </h1>
          <Typography
            variant="bodyLarge"
            className="text-on-surface-variant leading-relaxed @2xl:text-title-medium max-w-[34ch]"
          >
            {description}
          </Typography>
          {heroMeta ? heroMeta : null}
        </div>

        {heroContent && (
          <Surface
            tone="surfaceContainerLow"
            rounded="sm"
            className={`order-1 @3xl:order-2 flex items-stretch ${heroMinHeightClass} ${heroOverflowClass} min-w-0`}
          >
            <div className="flex w-full flex-1 items-stretch">{heroContent}</div>
          </Surface>
        )}
      </header>

      <div className="flex flex-col @5xl:flex-row gap-10 @3xl:gap-14 w-full max-w-6xl mx-auto">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-14 @3xl:gap-20">{children}</div>
        </div>

        {toc && toc.length > 0 && <TableOfContents title={title} items={toc} />}
      </div>
    </div>
  );
}

interface DocSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DocSection({
  id,
  title,
  description,
  children,
}: DocSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-6 @3xl:mb-7 space-y-3">
        <Typography variant="headlineMedium" component="h2">
          {title}
        </Typography>
        {description && (
          <Typography
            variant="bodyLarge"
            component="p"
            className="text-on-surface-variant max-w-4xl leading-relaxed"
          >
            {description}
          </Typography>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}
