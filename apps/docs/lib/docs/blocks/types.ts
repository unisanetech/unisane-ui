import type React from 'react';
import type { PreviewStageConfig, ExampleDef } from '../registry/types';

export type DocsBlockSegment = 'marketing' | 'commerce' | 'application';
export type DocsBlockCategory =
  | 'layout'
  | 'navigation'
  | 'dashboard'
  | 'workflow'
  | 'forms'
  | 'auth'
  | 'onboarding'
  | 'settings'
  | 'billing'
  | 'hero'
  | 'header'
  | 'footer'
  | 'grids'
  | 'pricing'
  | 'cta'
  | 'social-proof'
  | 'product'
  | 'catalog'
  | 'cart'
  | 'checkout'
  | 'account';
export type DocsBlockViewport = 'desktop' | 'tablet' | 'mobile';
export type DocsBlockCanvasHeight = 'md' | 'lg' | 'xl' | 'screen' | 'screen-tall' | 'screen-max';

export interface DocsBlockPreviewShellConfig {
  canvasHeight?: DocsBlockCanvasHeight;
  canvasInset?: 'none' | 'sm' | 'md' | 'lg';
  defaultViewport?: DocsBlockViewport;
  viewportOptions?: DocsBlockViewport[];
  showViewportControls?: boolean;
  resizable?: boolean;
  viewportWidths?: Partial<Record<DocsBlockViewport, number>>;
}

export interface DocsBlockMeta {
  slug: string;
  title: string;
  description: string;
  primarySegment: DocsBlockSegment;
  primaryCategory: DocsBlockCategory;
  categories: DocsBlockCategory[];
  segments: DocsBlockSegment[];
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
  primarySegment: DocsBlockSegment;
  primaryCategory: DocsBlockCategory;
  categories: DocsBlockCategory[];
  segments: DocsBlockSegment[];
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
