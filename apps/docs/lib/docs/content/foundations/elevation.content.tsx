import { Surface, Typography } from '@unisane/ui';
import type { FoundationPageDoc } from './types';
import { elevationFoundationMeta as meta } from './foundation-page-meta';

const heroVisual = (
  <div className="relative h-full">
    <Surface
      tone="surfaceContainerLow"
      rounded="sm"
      className="absolute top-8 left-0 w-56 p-4"
      elevation={1}
    >
      <Typography variant="titleMedium">Base panel</Typography>
    </Surface>
    <Surface tone="surface" rounded="sm" className="absolute top-20 left-14 w-56 p-4" elevation={3}>
      <Typography variant="titleMedium">Raised surface</Typography>
    </Surface>
  </div>
);

export const elevationFoundationPage: FoundationPageDoc = {
  ...meta,
  heroVisual,
  heroPreview: { tone: 'surfaceContainerLow', minHeight: 'md', padding: 'md' },
  sections: [
    {
      type: 'grid',
      id: 'levels',
      title: 'How to use elevation',
      columns: 2,
      items: [
        {
          title: 'Page canvas',
          description: 'Keep the default shell quiet and let nested surfaces create depth.',
          icon: 'crop_square',
        },
        {
          title: 'Cards and grouped panels',
          description: 'Use low or moderate elevation for content separation.',
          icon: 'dashboard',
        },
        {
          title: 'Menus, popovers, dialogs',
          description: 'Interactive overlays should sit above the page clearly.',
          icon: 'layers_clear',
        },
        {
          title: 'Do not stack too many levels',
          description: 'Depth should guide attention, not turn into decoration.',
          icon: 'filter_none',
        },
      ],
    },
    {
      type: 'checklist',
      id: 'rules',
      title: 'Elevation rules',
      items: [
        'Use elevation to explain hierarchy, not to decorate every card.',
        'Prefer surface-container roles before increasing depth.',
        'Reserve stronger elevation for overlays and focused interactive layers.',
      ],
    },
  ],
  related: [
    {
      title: 'Colors',
      href: '/docs/foundations/colors',
      description: 'Surface hierarchy and elevation work together.',
      icon: 'palette',
    },
  ],
};
