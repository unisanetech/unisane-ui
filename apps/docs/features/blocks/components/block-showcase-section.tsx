'use client';

import Link from 'next/link';
import { Button } from '@unisane/ui/button';
import { Typography } from '@unisane/ui/typography';
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
  const headingClassName =
    headingAs === 'h1'
      ? 'max-w-[10ch] text-[2.8rem] leading-[0.92] font-semibold tracking-tight @2xl:text-[4rem] @4xl:text-[4.6rem]'
      : 'max-w-[14ch] text-[2rem] leading-[0.95] font-semibold tracking-tight @2xl:text-[2.6rem]';

  return (
    <div className="w-full pb-12 @3xl:pb-20">
      <div className="mb-6 space-y-4 @2xl:mb-8 @2xl:space-y-5">
        {backLinkHref && backLinkLabel ? (
          <div className="flex items-center">
            <Button asChild variant="tonal" size="sm">
              <Link href={backLinkHref}>{backLinkLabel}</Link>
            </Button>
          </div>
        ) : null}

        <div className="space-y-3 @2xl:space-y-4">
          <Typography component={headingAs} className={headingClassName}>
            {block.title}
          </Typography>
          <Typography
            variant="bodyLarge"
            className="text-on-surface-variant max-w-[44rem] leading-relaxed @2xl:text-[1.125rem]"
          >
            {block.description}
          </Typography>
        </div>
      </div>

      <section className="mb-10 space-y-3 @2xl:mb-14">
        <BlockPreviewShell block={block} />
      </section>
    </div>
  );
}
