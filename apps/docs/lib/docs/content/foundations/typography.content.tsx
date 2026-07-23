import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import type { FoundationPageDoc } from './types';
import { typographyFoundationMeta as meta } from './foundation-page-meta';

const heroVisual = (
  <Surface tone="surface" rounded="sm" className="h-full p-6">
    <div className="space-y-3">
      <Typography variant="displaySmall">Display</Typography>
      <Typography variant="headlineMedium">Headline</Typography>
      <Typography variant="titleLarge">Title Large</Typography>
      <Typography variant="bodyLarge" className="text-on-surface-variant">
        Body text carries product content and longer explanations.
      </Typography>
      <Typography variant="labelLarge" className="text-on-surface-variant">
        LABEL LARGE
      </Typography>
    </div>
  </Surface>
);

export const typographyFoundationPage: FoundationPageDoc = {
  ...meta,
  heroVisual,
  heroPreview: { tone: 'surfaceContainerLow', minHeight: 'md', padding: 'md' },
  sections: [
    {
      type: 'grid',
      id: 'roles',
      title: 'Type roles',
      columns: 2,
      items: [
        {
          title: 'Display',
          description: 'Hero moments and large promotional headings.',
          icon: 'format_size',
          visual: <Typography variant="displaySmall">Display</Typography>,
        },
        {
          title: 'Headline',
          description: 'Page sections and major structural headings.',
          icon: 'title',
          visual: <Typography variant="headlineSmall">Headline</Typography>,
        },
        {
          title: 'Title',
          description: 'Cards, dialogs, menus, and grouped content headers.',
          icon: 'short_text',
          visual: <Typography variant="titleMedium">Title medium</Typography>,
        },
        {
          title: 'Body',
          description: 'Main product copy, supporting text, and descriptions.',
          icon: 'article',
          visual: <Typography variant="bodyMedium">Body medium text</Typography>,
        },
        {
          title: 'Label',
          description: 'Buttons, chips, tabs, metadata, and small emphasis text.',
          icon: 'label',
          visual: <Typography variant="labelMedium">LABEL</Typography>,
        },
      ],
    },
    {
      type: 'checklist',
      id: 'rules',
      title: 'Typography rules',
      items: [
        'Use semantic variants instead of local font-size utilities for hierarchy.',
        'Let titles carry structure and body carry explanation.',
        'Keep product UI dense by preferring title/body/label over oversized headings.',
        'Use display styles only for landing or large hero moments.',
      ],
    },
  ],
  related: [
    {
      title: 'Typography component',
      href: '/docs/components/typography',
      description: 'See the component API and the full type scale.',
      icon: 'text_fields',
    },
    {
      title: 'Spacing',
      href: '/docs/foundations/spacing',
      description: 'Pair typography rhythm with consistent layout spacing.',
      icon: 'space_bar',
    },
  ],
};
