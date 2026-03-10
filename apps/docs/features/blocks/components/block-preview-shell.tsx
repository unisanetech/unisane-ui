'use client';

import { useState } from 'react';
import type { DocsBlock, DocsBlockCanvasHeight, DocsBlockViewport } from '@/lib/docs/blocks/types';
import { cn } from '@unisane/ui/lib/utils';
import { IconButton, SegmentedButton, Typography } from '@unisane/ui';
import { CodeBlock } from '@/features/docs-page/components/code-block';
import {
  PreviewStage,
  mergePreviewStageConfig,
} from '@/features/docs-page/components/preview-stage';

interface BlockPreviewShellProps {
  block: DocsBlock;
  className?: string;
}

export function BlockPreviewShell({ block, className }: BlockPreviewShellProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const previewShell = block.previewShell;
  const canvasHeight = previewShell?.canvasHeight ?? 'screen';
  const [viewport, setViewport] = useState<DocsBlockViewport>(
    previewShell?.defaultViewport ?? 'desktop',
  );
  const previewConfig = mergePreviewStageConfig(
    {
      tone: 'surfaceContainerLowest',
      minHeight:
        canvasHeight === 'md'
          ? 'md'
          : canvasHeight === 'lg'
            ? 'lg'
            : canvasHeight === 'xl'
              ? 'xl'
              : 'screen',
      padding: 'none',
      align: 'start',
      justify: 'start',
      overflow: 'hidden',
    },
    block.previewConfig,
  );
  const viewportOptions = previewShell?.viewportOptions ?? ['desktop', 'tablet', 'mobile'];
  const showViewportControls = previewShell?.showViewportControls ?? true;
  const viewportWidthClass = {
    desktop: 'w-full',
    tablet: 'w-full max-w-[900px]',
    mobile: 'w-full max-w-[420px]',
  } as const;
  const canvasInset = previewShell?.canvasInset ?? 'sm';
  const canvasInsetClass = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  } as const;
  const canvasHeightClass: Record<DocsBlockCanvasHeight, string> = {
    md: 'h-[32rem]',
    lg: 'h-[40rem]',
    xl: 'h-[48rem]',
    screen: 'h-[calc(100svh-10rem)]',
    'screen-tall': 'h-[calc(100svh-7rem)]',
    'screen-max': 'h-[calc(100svh-5.5rem)]',
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="border-outline-variant/10 flex flex-col gap-3 border-b pb-4 @3xl:flex-row @3xl:items-center @3xl:justify-between">
        <div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-center">
          <SegmentedButton
            options={[
              { value: 'preview', label: 'Preview' },
              { value: 'code', label: 'Code' },
            ]}
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'preview' | 'code')}
            size="sm"
          />
          <Typography variant="bodyMedium" className="text-on-surface-variant">
            {block.description}
          </Typography>
        </div>

        {activeTab === 'preview' && showViewportControls && (
          <div className="flex items-center gap-2">
            <SegmentedButton
              options={viewportOptions.map((value) => ({
                value,
                label: value === 'desktop' ? 'Desktop' : value === 'tablet' ? 'Tablet' : 'Mobile',
                icon: (
                  <span className="material-symbols-outlined text-[16px]">
                    {value === 'desktop'
                      ? 'desktop_windows'
                      : value === 'tablet'
                        ? 'tablet_mac'
                        : 'smartphone'}
                  </span>
                ),
              }))}
              value={viewport}
              onValueChange={(value) => setViewport(value as DocsBlockViewport)}
              size="sm"
            />
            <IconButton
              variant="outlined"
              size="sm"
              aria-label="Reset viewport"
              className="pointer-events-none"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
            </IconButton>
          </div>
        )}
      </div>

      {activeTab === 'preview' ? (
        <div className="border-outline-variant/10 bg-surface overflow-hidden rounded-sm border">
          <div
            className={cn(
              'bg-surface-container-lowest overflow-auto',
              canvasHeightClass[canvasHeight],
            )}
          >
            <div className={cn('box-border h-full', canvasInsetClass[canvasInset])}>
              <PreviewStage
                config={previewConfig}
                className="bg-surface-container-lowest h-full min-h-0 border-0"
              >
                <div
                  className={cn(
                    'duration-medium ease-emphasized mx-auto h-full transition-[max-width]',
                    viewportWidthClass[viewport],
                  )}
                >
                  {block.preview}
                </div>
              </PreviewStage>
            </div>
          </div>
        </div>
      ) : (
        <CodeBlock code={block.code} language="tsx" />
      )}
    </div>
  );
}
