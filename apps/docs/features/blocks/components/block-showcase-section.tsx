'use client';

import Link from 'next/link';
import { Button, Surface, Typography } from '@unisane/ui';
import type { DocsBlock } from '@/lib/docs/blocks/types';
import { BlockPreviewShell } from './block-preview-shell';

interface BlockShowcaseSectionProps {
  block: DocsBlock;
  headingAs?: 'h1' | 'h2';
  backLinkHref?: string;
  backLinkLabel?: string;
}

export function BlockShowcaseSection({
  block,
  headingAs = 'h2',
  backLinkHref,
  backLinkLabel,
}: BlockShowcaseSectionProps) {
  return (
    <div className="w-full pb-12 @3xl:pb-20">
      <div className="mb-4 flex flex-col gap-4 @2xl:mb-6 @4xl:flex-row @4xl:items-start @4xl:justify-between">
        <div className="space-y-2">
          <Typography
            variant={headingAs === 'h1' ? 'headlineMedium' : 'headlineSmall'}
            component={headingAs}
          >
            {block.title}
          </Typography>
          <Typography
            variant="bodyLarge"
            className="text-on-surface-variant leading-relaxed"
          >
            {block.description}
          </Typography>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {backLinkHref && backLinkLabel ? (
            <Button asChild variant="tonal" size="sm">
              <Link href={backLinkHref}>{backLinkLabel}</Link>
            </Button>
          ) : null}
          <Button asChild variant="text" size="sm">
            <Link href={block.usedComponents[0]?.href ?? '/docs/components'}>View components</Link>
          </Button>
        </div>
      </div>

      <section className="mb-10 space-y-3 @2xl:mb-14">
        <BlockPreviewShell block={block} />
      </section>

      <section className="mb-12 @2xl:mb-16">
        <div className="mb-5 space-y-2">
          <Typography variant="headlineSmall" component="h3">
            Used components
          </Typography>
          <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
            Core Unisane building blocks used in this scaffold.
          </Typography>
        </div>
        <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-3">
          {block.usedComponents.map((item) => (
            <Link key={item.href} href={item.href} className="group block">
              <Surface
                tone="surfaceContainerLow"
                rounded="sm"
                className="group-hover:bg-surface-container p-4 transition-colors"
              >
                <Typography variant="titleMedium">{item.title}</Typography>
                <Typography variant="bodySmall" className="text-on-surface-variant mt-1">
                  View component docs
                </Typography>
              </Surface>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
