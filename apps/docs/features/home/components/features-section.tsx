'use client';

import Link from 'next/link';
import { Icon } from '@unisane/ui/icon';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';

const PRODUCT_PILLARS = [
  {
    icon: 'code_blocks',
    label: 'Source ownership',
    title: 'Own the source.',
    description:
      'Install components into your application, review them like normal product code, and adapt them without waiting on a black-box runtime.',
    href: '/docs/getting-started/',
    linkLabel: 'See how installation works',
  },
  {
    icon: 'tune',
    label: 'Semantic consistency',
    title: 'Keep the system.',
    description:
      'Color, density, radius, contrast, and elevation share one semantic contract, so local changes do not turn into visual drift.',
    href: '/docs/foundations/',
    linkLabel: 'Explore the foundations',
  },
  {
    icon: 'account_tree',
    label: 'Product patterns',
    title: 'Build real workflows.',
    description:
      'Compose navigation, forms, feedback, overlays, and data-heavy surfaces from components designed to work together.',
    href: '/docs/components/',
    linkLabel: 'Browse the component system',
  },
] as const;

const QUALITY_SIGNALS = [
  ['data_object', 'Type-safe APIs'],
  ['keyboard', 'Keyboard and focus patterns'],
  ['fact_check', 'Generated registry validation'],
  ['responsive_layout', 'Responsive product examples'],
] as const;

export function FeaturesSection() {
  return (
    <>
      <div className="max-w-[760px]">
        <Typography variant="labelLarge" className="text-primary mb-5 tracking-[0.12em] uppercase">
          Why Unisane
        </Typography>
        <Typography
          variant="headlineMedium"
          component="h2"
          className="text-on-surface @3xl:text-headline-large"
        >
          Own the source. Keep the system.
        </Typography>
        <Typography
          variant="titleMedium"
          className="text-on-surface-variant mt-4 max-w-[62ch] leading-relaxed"
        >
          Unisane combines the freedom of open code with the shared rules a product interface needs
          to remain coherent as it grows.
        </Typography>
      </div>

      <div className="border-outline-weak mt-14 grid border-y @4xl:grid-cols-3">
        {PRODUCT_PILLARS.map((pillar, index) => (
          <article
            key={pillar.label}
            className={cn(
              'border-outline-weak py-8 @4xl:px-8 @4xl:py-10',
              index > 0 && 'border-t @4xl:border-t-0 @4xl:border-l',
              index === 0 && '@4xl:pr-8',
              index === PRODUCT_PILLARS.length - 1 && '@4xl:pl-8',
            )}
          >
            <div className="text-primary mb-8 flex items-center gap-3">
              <Icon symbol={pillar.icon} />
              <Typography variant="labelLarge" className="tracking-[0.08em] uppercase">
                {pillar.label}
              </Typography>
            </div>
            <Typography variant="headlineSmall" component="h3" className="text-on-surface">
              {pillar.title}
            </Typography>
            <Typography
              variant="bodyLarge"
              className="text-on-surface-variant mt-3 leading-relaxed"
            >
              {pillar.description}
            </Typography>
            <Link
              href={pillar.href}
              className="text-primary focus-visible:ring-focus-ring mt-6 inline-flex items-center gap-2 rounded-xs text-label-large outline-none focus-visible:ring-2"
            >
              {pillar.linkLabel}
              <Icon symbol="arrow_forward" />
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-6 @3xl:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] @3xl:items-start">
        <div>
          <Typography variant="labelLarge" className="text-on-surface block">
            Evidence built into the workflow
          </Typography>
          <Typography variant="bodyMedium" className="text-on-surface-variant mt-2 max-w-[38ch]">
            The public catalogue, generated source, and focused checks share the same component
            authority.
          </Typography>
        </div>
        <div className="grid gap-x-8 gap-y-4 @lg:grid-cols-2">
          {QUALITY_SIGNALS.map(([icon, label]) => (
            <div key={label} className="text-on-surface-variant flex items-center gap-3">
              <Icon symbol={icon} className="text-primary" />
              <Typography variant="bodyMedium">{label}</Typography>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
