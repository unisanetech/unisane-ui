import { Typography } from '@unisane/ui/typography';
import type { FoundationPageDoc } from './types';
import { spacingFoundationMeta as meta } from './foundation-page-meta';

const heroVisual = (
  <div className="flex h-full flex-col justify-center gap-4">
    {[1, 2, 3, 4].map((step) => (
      <div key={step} className="flex items-center gap-4">
        <Typography variant="labelMedium" className="text-on-surface-variant w-10">
          {step}x
        </Typography>
        <div className="bg-primary h-4 rounded-full" style={{ width: `${step * 56}px` }} />
      </div>
    ))}
  </div>
);

export const spacingFoundationPage: FoundationPageDoc = {
  ...meta,
  heroVisual,
  heroPreview: { tone: 'surfaceContainerLow', minHeight: 'md', padding: 'md' },
  sections: [
    {
      type: 'prose',
      id: 'system',
      title: 'Spacing system',
      body: (
        <div className="space-y-4">
          <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
            Spacing should describe relationships, not arbitrary pixels. Unisane derives spacing
            from a shared unit scale and lets density adjust the result globally.
          </Typography>
          <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
            That means cards, fields, lists, and shell gutters all stay in rhythm when the product
            switches between compact and comfortable modes.
          </Typography>
        </div>
      ),
    },
    {
      type: 'grid',
      id: 'usage',
      title: 'Common spacing uses',
      columns: 2,
      items: [
        {
          title: 'Inline spacing',
          description: 'Gaps between icons, text, chips, and segmented controls.',
          icon: 'horizontal_distribute',
        },
        {
          title: 'Control padding',
          description: 'Internal padding for fields, cards, banners, and menus.',
          icon: 'padding',
        },
        {
          title: 'Section rhythm',
          description: 'Vertical spacing between headings, content blocks, and page sections.',
          icon: 'vertical_distribute',
        },
        {
          title: 'Shell gutters',
          description: 'Page insets and layout margins that define the app frame.',
          icon: 'crop_portrait',
        },
      ],
    },
    {
      type: 'checklist',
      id: 'rules',
      title: 'Spacing rules',
      items: [
        'Use one spacing rhythm per surface instead of mixing many arbitrary values.',
        'Let density change scale the spacing, not the component API.',
        'Use larger jumps between sections than between related controls.',
      ],
    },
  ],
  related: [
    {
      title: 'Design Tokens',
      href: '/docs/foundations/design-tokens',
      description: 'See how spacing connects to density and radius.',
      icon: 'hexagon',
    },
  ],
};
