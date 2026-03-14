'use client';

import Link from 'next/link';
import { Button, Surface, Typography } from '@unisane/ui';
import { getRegisteredBlockBySlug } from '@/lib/docs/blocks/block-registry';
import { BlockPreviewShell } from './block-preview-shell';

export function BlockDetailPage({ slug }: { slug: string }) {
  const block = getRegisteredBlockBySlug(slug);

  if (!block) {
    return null;
  }

  return (
    <div className="w-full pb-12 @3xl:pb-20">
      <div className="mb-4 flex flex-col gap-4 @2xl:mb-6 @4xl:flex-row @4xl:items-start @4xl:justify-between">
        <div className="space-y-2">
          <Typography variant="headlineMedium" component="h1">
            {block.title}
          </Typography>
          <Typography
            variant="bodyLarge"
            className="text-on-surface-variant max-w-3xl leading-relaxed"
          >
            {block.description}
          </Typography>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="tonal" size="sm">
            <Link href="/docs/blocks">Back to blocks</Link>
          </Button>
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
          <Typography variant="headlineSmall" component="h2">
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
