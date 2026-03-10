import type React from 'react';
import type { PreviewStageConfig } from '../registry/types';
import type { ExampleDef } from '../registry/types';

export interface StaticDocMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export interface StaticDocLinkItem {
  title: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface StaticDocGridItem {
  title: string;
  description: string;
  icon?: string;
  eyebrow?: string;
  visual?: React.ReactNode;
  href?: string;
}

interface BaseStaticDocSection {
  id: string;
  title: string;
  description?: string;
  tocLabel?: string;
}

export type StaticDocSection =
  | (BaseStaticDocSection & {
      type: 'prose';
      body: React.ReactNode;
    })
  | (BaseStaticDocSection & {
      type: 'blocks';
      previewDefaults?: PreviewStageConfig;
      examples: ExampleDef[];
    })
  | (BaseStaticDocSection & {
      type: 'grid';
      columns?: 1 | 2 | 3;
      items: StaticDocGridItem[];
    })
  | (BaseStaticDocSection & {
      type: 'checklist';
      items: string[];
    })
  | (BaseStaticDocSection & {
      type: 'do-dont';
      dos: string[];
      donts: string[];
    })
  | (BaseStaticDocSection & {
      type: 'showcase';
      content: React.ReactNode;
    })
  | (BaseStaticDocSection & {
      type: 'links';
      items: StaticDocLinkItem[];
    });

export interface StaticDocPage extends StaticDocMeta {
  heroVisual?: React.ReactNode;
  heroPreview?: PreviewStageConfig;
  sections: StaticDocSection[];
  related?: StaticDocLinkItem[];
}
