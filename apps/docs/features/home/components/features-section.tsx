'use client';

import { Card } from '@unisane/ui/card';
import { Icon } from '@unisane/ui/icon';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';
import { HOME_FEATURES } from '../model/home.constants';

type FeatureTitle = (typeof HOME_FEATURES)[number]['title'];

function requireFeature(title: FeatureTitle) {
  const feature = HOME_FEATURES.find((item) => item.title === title);
  if (!feature) {
    throw new Error(`Missing home feature copy for "${title}"`);
  }
  return feature;
}

const COLOR_SWATCHES = ['bg-secondary', 'bg-tertiary', 'bg-success'] as const;

const ACCESSIBILITY_SIGNALS = ['ARIA-LABEL', 'ROLES', 'TAB-INDEX'] as const;

const CODE_SAMPLE = `import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export function ProductPanel() {
  return (
    <Card variant="outlined" className="p-6">
      <Typography variant="headlineSmall">Ship fast</Typography>
      <Button variant="filled">Deploy</Button>
    </Card>
  );
}`;

function GlowCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Card
      variant="low"
      className={cn(
        'border-outline-weak relative overflow-hidden rounded-lg border p-6 @lg:p-8',
        className,
      )}
    >
      {children}
    </Card>
  );
}

function FeatureBadge({ label }: { label: string }) {
  return (
    <Surface
      tone="surfaceContainerHighest"
      rounded="xs"
      className="border-outline-variant border px-2.5 py-1"
    >
      <Typography variant="labelSmall" className="text-on-surface-variant tracking-wide">
        {label}
      </Typography>
    </Surface>
  );
}

function ThemeSwatch({ toneClassName }: { toneClassName: string }) {
  return (
    <Surface
      tone="surfaceContainerHighest"
      rounded="xs"
      className="border-outline-variant flex h-11 w-11 items-center justify-center border"
    >
      <span className={cn('h-5 w-5 rounded-full', toneClassName)} />
    </Surface>
  );
}

export function FeaturesSection() {
  const dynamicTheming = requireFeature('Dynamic Theming');
  const accessible = requireFeature('Accessible');
  const typescript = requireFeature('TypeScript');
  const performant = requireFeature('Performant');
  const tailwindCss = requireFeature('Tailwind CSS');
  const composable = requireFeature('Composable');

  return (
    <>
      <Typography
        variant="headlineMedium"
        className="text-on-surface @3xl:text-headline-large mb-4"
      >
        Built for developers
      </Typography>
      <Typography variant="titleMedium" className="text-on-surface-variant mb-12 max-w-2xl">
        Modern tools and practices for exceptional developer experience. Precision engineered for
        high-performance interfaces.
      </Typography>

      <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @3xl:grid-cols-12">
        <GlowCard className="@lg:col-span-2 @3xl:col-span-8 @3xl:min-h-[420px]">
          <div
            className="from-surface-container-low via-surface-container-low to-primary/18 pointer-events-none absolute inset-0 bg-gradient-to-br"
            aria-hidden
          />
          <div
            className="bg-secondary/25 pointer-events-none absolute -top-16 -right-20 h-64 w-64 rounded-full blur-3xl"
            aria-hidden
          />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex-1" />
            <Icon symbol={dynamicTheming.icon} size={52} filled className="text-primary" />
            <div className="mt-5 max-w-[34ch] space-y-3">
              <Typography variant="headlineSmall" className="text-on-surface">
                {dynamicTheming.title}
              </Typography>
              <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
                {dynamicTheming.description}
              </Typography>
            </div>
            <div className="mt-8 flex justify-end gap-2">
              {COLOR_SWATCHES.map((swatch) => (
                <ThemeSwatch key={swatch} toneClassName={swatch} />
              ))}
            </div>
          </div>
        </GlowCard>

        <GlowCard className="@3xl:col-span-4 @3xl:min-h-[420px]">
          <div className="relative z-10 flex h-full flex-col">
            <Icon symbol={accessible.icon} size={52} filled className="text-tertiary" />
            <div className="mt-auto space-y-3">
              <Typography variant="headlineSmall" className="text-on-surface">
                {accessible.title}
              </Typography>
              <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
                {accessible.description}
              </Typography>
            </div>
            <div className="bg-outline-weak my-6 h-px w-full" />
            <div className="mt-auto flex flex-wrap gap-2">
              {ACCESSIBILITY_SIGNALS.map((signal) => (
                <FeatureBadge key={signal} label={signal} />
              ))}
            </div>
          </div>
        </GlowCard>

        <GlowCard className="@3xl:col-span-4 @3xl:min-h-[210px]">
          <div className="relative z-10 flex h-full flex-col gap-4">
            <div className="flex items-center gap-3">
              <Icon symbol={typescript.icon} size={40} filled className="text-info" />
              <Typography variant="titleLarge" className="text-on-surface">
                {typescript.title}
              </Typography>
            </div>
            <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
              {typescript.description}
            </Typography>
          </div>
        </GlowCard>

        <GlowCard className="@3xl:col-span-4 @3xl:min-h-[210px]">
          <div className="relative z-10 flex h-full flex-col gap-4">
            <div className="flex items-center gap-3">
              <Icon symbol={performant.icon} size={40} filled className="text-success" />
              <Typography variant="titleLarge" className="text-on-surface">
                {performant.title}
              </Typography>
            </div>
            <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
              {performant.description}
            </Typography>
          </div>
        </GlowCard>

        <GlowCard className="@lg:col-span-2 @3xl:col-span-4 @3xl:row-span-2 @3xl:min-h-[440px]">
          <div
            className="from-surface-container-low via-surface-container to-surface-container-high pointer-events-none absolute inset-0 bg-gradient-to-r"
            aria-hidden
          />
          <div
            className="from-surface-container-low pointer-events-none absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r to-transparent"
            aria-hidden
          />
          <pre className="text-on-surface-variant/70 pointer-events-none absolute top-1/2 right-[-40%] w-[170%] -translate-y-1/2 [transform:perspective(900px)_rotateY(-34deg)] text-[10px] leading-[1.35] font-medium whitespace-pre-wrap opacity-80 blur-[0.75px]">
            {CODE_SAMPLE}
          </pre>
        </GlowCard>

        <GlowCard className="@3xl:col-span-5 @3xl:min-h-[210px]">
          <div className="relative z-10 flex h-full items-center gap-4">
            <Icon symbol={tailwindCss.icon} size={52} filled className="text-warning" />
            <div className="space-y-2">
              <Typography variant="titleLarge" className="text-on-surface">
                {tailwindCss.title}
              </Typography>
              <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
                {tailwindCss.description}
              </Typography>
            </div>
          </div>
        </GlowCard>

        <GlowCard className="@3xl:col-span-3 @3xl:min-h-[210px]">
          <div className="relative z-10 flex h-full flex-col justify-center">
            <Typography
              variant="labelLarge"
              className="text-secondary mb-2 tracking-[0.2em] uppercase"
            >
              Primitives
            </Typography>
            <Typography variant="titleLarge" className="text-on-surface mb-2">
              {composable.title}
            </Typography>
            <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
              {composable.description}
            </Typography>
          </div>
        </GlowCard>
      </div>
    </>
  );
}
