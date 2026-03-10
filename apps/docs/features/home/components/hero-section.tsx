"use client";

import Link from "next/link";
import { Button, Surface, Typography } from "@unisane/ui";
import { UnisaneLogo } from "@/features/branding";
import { HeroShowcase } from "./hero-showcase";

export function HeroSection() {
  return (
    <div className="grid flex-1 grid-cols-1 gap-2 @3xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <Surface
        tone="secondaryContainer"
        rounded="sm"
        className="h-full px-6 py-8 @sm:px-8 @sm:py-10 @3xl:px-12 @3xl:py-12"
      >
        <div className="flex h-full max-w-[30rem] flex-col gap-8 @3xl:gap-10">
          <div className="space-y-6">
            <div className="mb-8 inline-flex items-center gap-2 text-on-secondary-container/72">
              <UnisaneLogo size={22} />
              <Typography variant="labelLarge" component="span">
                unisane/ui
              </Typography>
            </div>

            <h1 className="max-w-[9ch] text-[3rem] leading-[0.9] font-semibold tracking-tight text-on-secondary-container @2xl:text-[4.25rem] @4xl:text-[5.35rem]">
              Build product
              <br />
              interfaces.
            </h1>

            <Typography
              variant="titleMedium"
              className="mt-6 max-w-[26ch] leading-relaxed text-on-secondary-container/80 @3xl:text-title-large"
            >
              Token-driven React components, themes, and layout patterns for app
              teams building forms, navigation, workflows, and data-heavy interfaces.
            </Typography>
          </div>

          <div className="flex flex-col items-start gap-3">
            <Button asChild variant="filled" size="lg">
              <Link href="/docs/getting-started">Get started</Link>
            </Button>
            <Button asChild variant="text" size="lg">
              <Link href="/docs/components">Browse all components</Link>
            </Button>
          </div>
        </div>
      </Surface>

      <div className="h-full min-h-[280px] overflow-hidden @2xl:min-h-[330px] @4xl:min-h-[400px]">
        <HeroShowcase />
      </div>
    </div>
  );
}
