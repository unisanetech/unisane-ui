'use client';

import Link from 'next/link';
import { Button, Surface, Typography } from '@unisane/ui';
import { UnisaneLogo } from '@/features/branding';
import { getComponentCount } from '@/lib/docs/registry/selectors';
import { HeroShowcase } from './hero-showcase';
import { HOME_STATS } from '../model/home.constants';

export function HeroSection() {
  const stats = HOME_STATS.map((stat) =>
    stat.label === 'Components' ? { ...stat, value: `${getComponentCount()}+` } : stat,
  );

  return (
    <div className="grid flex-1 grid-cols-1 gap-2 @3xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] @3xl:grid-rows-[1fr_auto]">
      <Surface
        tone="primaryContainer"
        rounded="sm"
        className="h-full px-6 py-8 @sm:px-8 @sm:py-10 @3xl:px-12 @3xl:py-12"
      >
        <div className="flex h-full max-w-[30rem] flex-col gap-8 @3xl:gap-10">
          <div className="space-y-6">
            <div className="text-on-primary-container mb-8 inline-flex items-center gap-2">
              <UnisaneLogo size={22} />
              <Typography variant="labelLarge" component="span">
                unisane/ui
              </Typography>
            </div>

            <h1 className="text-on-primary-container max-w-[9ch] text-[3rem] leading-[0.9] font-semibold tracking-tight @2xl:text-[4.25rem] @4xl:text-[5.35rem]">
              Build product
              <br />
              interfaces.
            </h1>

            <Typography
              variant="titleMedium"
              className="text-on-primary-container @3xl:text-title-large mt-6 max-w-[26ch] leading-relaxed"
            >
              Token-driven React components, themes, and reusable app blocks for app teams building
              forms, navigation, workflows, and data-heavy interfaces.
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

      <Surface
        tone="surfaceContainerLow"
        rounded="sm"
        className="px-6 py-8 @sm:px-8 @sm:py-10 @3xl:col-start-1 @3xl:row-start-2 @3xl:px-12 @3xl:py-12"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 @lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <Typography variant="displaySmall" className="text-on-surface mb-1">
                {stat.value}
              </Typography>
              <Typography variant="bodyMedium" className="text-on-surface-variant">
                {stat.label}
              </Typography>
            </div>
          ))}
        </div>
      </Surface>

      <div className="h-full min-h-[280px] overflow-hidden @2xl:min-h-[330px] @3xl:col-start-2 @3xl:row-span-2 @3xl:row-start-1 @4xl:min-h-[400px]">
        <HeroShowcase />
      </div>
    </div>
  );
}
