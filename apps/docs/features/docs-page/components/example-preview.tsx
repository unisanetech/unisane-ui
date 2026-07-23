'use client';

import { useState } from 'react';
import type { ExampleDef, PreviewStageConfig } from '@/lib/docs/registry/types';
import { cn } from '@unisane/ui/utils';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import { SegmentedButton } from '@unisane/ui/segmented-button';
import { PreviewStage, mergePreviewStageConfig } from './preview-stage';
import { CodeBlock } from './code-block';

interface ExamplePreviewProps {
  example: ExampleDef;
  previewDefaults?: PreviewStageConfig;
  className?: string;
}

export function ExamplePreview({ example, previewDefaults, className }: ExamplePreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const previewConfig = mergePreviewStageConfig(previewDefaults, example.preview);

  return (
    <Surface
      tone="surfaceContainerLow"
      rounded="sm"
      className={cn('overflow-visible p-5', className)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Typography variant="titleMedium" component="h4">
            {example.title}
          </Typography>
          {example.description && (
            <Typography variant="bodySmall" component="p" className="text-on-surface-variant mt-1">
              {example.description}
            </Typography>
          )}
        </div>

        {/* Tab Buttons */}
        {example.code && (
          <SegmentedButton
            aria-label="Example view"
            options={[
              { value: 'preview', label: 'Preview' },
              { value: 'code', label: 'Code' },
            ]}
            value={activeTab}
            onValueChange={setActiveTab}
            size="sm"
          />
        )}
      </div>

      {/* Content */}
      <div className="mt-5">
        {activeTab === 'preview' ? (
          <PreviewStage config={previewConfig}>{example.component}</PreviewStage>
        ) : (
          <CodeBlock code={example.code ?? ''} language="tsx" />
        )}
      </div>
    </Surface>
  );
}

interface ExampleGridProps {
  examples: ExampleDef[];
  previewDefaults?: PreviewStageConfig;
  className?: string;
}

export function ExampleGrid({ examples, previewDefaults, className }: ExampleGridProps) {
  if (!examples.length) return null;

  return (
    <div className={cn('space-y-8', className)}>
      {examples.map((example) => (
        <ExamplePreview key={example.id} example={example} previewDefaults={previewDefaults} />
      ))}
    </div>
  );
}
