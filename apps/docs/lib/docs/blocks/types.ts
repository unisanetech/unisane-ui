import type React from 'react';
import type { PreviewStageConfig, ExampleDef } from '../registry/types';

export type DocsBlockCategory = 'layout' | 'auth' | 'workflow';
export type DocsBlockViewport = 'desktop' | 'tablet' | 'mobile';
export type DocsBlockCanvasHeight = 'md' | 'lg' | 'xl' | 'screen' | 'screen-tall' | 'screen-max';

export interface DocsBlockPreviewShellConfig {
  canvasHeight?: DocsBlockCanvasHeight;
  canvasInset?: 'none' | 'sm' | 'md' | 'lg';
  defaultViewport?: DocsBlockViewport;
  viewportOptions?: DocsBlockViewport[];
  showViewportControls?: boolean;
}

export interface DocsBlockMeta {
  slug: string;
  title: string;
  description: string;
  category: DocsBlockCategory;
  icon: string;
}

export interface DocsBlock extends DocsBlockMeta {
  preview: React.ReactNode;
  previewConfig?: PreviewStageConfig;
  previewShell?: DocsBlockPreviewShellConfig;
  code: string;
  usedComponents: Array<{
    title: string;
    href: string;
  }>;
}

export interface DocsBlockListItem {
  slug: string;
  title: string;
  description: string;
  category: DocsBlockCategory;
  icon: string;
  preview: React.ReactNode;
  previewConfig?: PreviewStageConfig;
  previewShell?: DocsBlockPreviewShellConfig;
}

export function toBlockExample(block: DocsBlock): ExampleDef {
  return {
    id: block.slug,
    title: block.title,
    description: block.description,
    component: block.preview,
    code: block.code,
    preview: block.previewConfig,
  };
}
