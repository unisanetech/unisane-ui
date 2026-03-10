'use client';

import Link from 'next/link';
import { Surface, Typography } from '@unisane/ui';
import { BLOCK_REGISTRY } from '@/lib/docs/blocks/block-registry';
import { PreviewStage } from '@/features/docs-page/components/preview-stage';

const CATEGORY_LABELS = {
  layout: 'Layouts',
  auth: 'Auth',
  workflow: 'Workflows',
} as const;

export function BlocksCatalog() {
  const categories = {
    layout: BLOCK_REGISTRY.filter((block) => block.category === 'layout'),
    auth: BLOCK_REGISTRY.filter((block) => block.category === 'auth'),
    workflow: BLOCK_REGISTRY.filter((block) => block.category === 'workflow'),
  };

  return (
    <div className="space-y-12">
      {Object.entries(categories).map(([category, blocks]) => (
        <section key={category} className="space-y-5">
          <div>
            <Typography variant="headlineSmall" component="h2">
              {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
            </Typography>
            <Typography variant="bodyLarge" className="text-on-surface-variant mt-2 max-w-3xl">
              Real app blocks composed with Unisane components.
            </Typography>
          </div>

          <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-2">
            {blocks.map((block) => (
              <Link key={block.slug} href={`/docs/blocks/${block.slug}`} className="group block">
                <Surface
                  tone="surfaceContainerLow"
                  rounded="sm"
                  className="group-hover:bg-surface-container overflow-hidden transition-colors"
                >
                  <PreviewStage
                    config={{
                      tone: 'surfaceContainerLow',
                      minHeight: 'xl',
                      padding: 'md',
                      ...block.previewConfig,
                    }}
                  >
                    {block.preview}
                  </PreviewStage>
                  <div className="border-outline-variant flex items-center justify-between gap-3 border-t p-4">
                    <div className="min-w-0">
                      <Typography variant="titleMedium" component="h3" className="truncate">
                        {block.title}
                      </Typography>
                      <Typography
                        variant="bodySmall"
                        className="text-on-surface-variant mt-1 line-clamp-2"
                      >
                        {block.description}
                      </Typography>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant/60 group-hover:text-primary transition-all group-hover:translate-x-0.5">
                      arrow_forward
                    </span>
                  </div>
                </Surface>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
