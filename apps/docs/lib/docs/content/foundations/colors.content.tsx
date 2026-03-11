import { Surface, Typography } from '@unisane/ui';
import type { FoundationPageDoc } from './types';
import { colorsFoundationMeta as meta } from './foundation-page-meta';

const heroVisual = (
  <div className="grid h-full grid-cols-2 gap-4">
    <Surface tone="primaryContainer" rounded="sm" className="p-4">
      <Typography variant="titleMedium" className="text-on-primary-container mb-2">
        Primary container
      </Typography>
      <Typography variant="bodySmall" className="text-on-primary-container">
        Calls attention to key actions and highlights.
      </Typography>
    </Surface>
    <Surface tone="secondaryContainer" rounded="sm" className="p-4">
      <Typography variant="titleMedium" className="text-on-secondary-container mb-2">
        Secondary container
      </Typography>
      <Typography variant="bodySmall" className="text-on-secondary-container">
        Supports less dominant supportive emphasis.
      </Typography>
    </Surface>
    <Surface tone="tertiaryContainer" rounded="sm" className="p-4">
      <Typography variant="titleMedium" className="text-on-tertiary-container mb-2">
        Tertiary container
      </Typography>
      <Typography variant="bodySmall" className="text-on-tertiary-container">
        Adds variety without breaking the semantic system.
      </Typography>
    </Surface>
    <Surface tone="surfaceContainerHigh" rounded="sm" className="p-4">
      <Typography variant="titleMedium" className="mb-2">
        Surface container
      </Typography>
      <Typography variant="bodySmall" className="text-on-surface-variant">
        Nested surfaces for cards, menus, panels, and grouped regions.
      </Typography>
    </Surface>
  </div>
);

export const colorsFoundationPage: FoundationPageDoc = {
  ...meta,
  heroVisual,
  heroPreview: { tone: 'surfaceContainerLow', minHeight: 'md', padding: 'md' },
  sections: [
    {
      type: 'prose',
      id: 'roles',
      title: 'Semantic color roles',
      body: (
        <div className="space-y-4">
          <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
            Unisane uses semantic roles rather than one-off swatches. Surface roles define
            background hierarchy, while primary, secondary, tertiary, and error define emphasis and
            status.
          </Typography>
          <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
            In practice, the most important decision is choosing the correct role, not the exact
            shade. The theme system handles the actual tone mapping.
          </Typography>
        </div>
      ),
    },
    {
      type: 'grid',
      id: 'core-roles',
      title: 'Core roles',
      columns: 2,
      items: [
        {
          title: 'Surface',
          description: 'Base canvas for pages and default cards.',
          icon: 'crop_square',
        },
        {
          title: 'Surface container',
          description: 'Nested panels and grouped regions inside the canvas.',
          icon: 'dashboard',
        },
        {
          title: 'Primary / primary container',
          description: 'High-emphasis actions and key feature highlights.',
          icon: 'bolt',
        },
        {
          title: 'Secondary / tertiary containers',
          description: 'Supportive and decorative emphasis that still stays in-system.',
          icon: 'auto_awesome',
        },
        {
          title: 'Outline / outline variant',
          description: 'Borders, dividers, and structural strokes.',
          icon: 'border_style',
        },
        {
          title: 'Error / error container',
          description: 'Critical validation, destructive actions, and blocking states.',
          icon: 'error',
        },
      ],
    },
    {
      type: 'do-dont',
      id: 'guidance',
      title: 'Color guidance',
      dos: [
        'Use surface and surface-container roles to define hierarchy.',
        'Reserve primary emphasis for the most important actions.',
        'Use semantic roles consistently across similar components.',
      ],
      donts: [
        'Do not invent custom shades for individual components.',
        'Do not use alpha overlays to fake missing semantic roles.',
        'Do not use too many accented roles in the same small area.',
      ],
    },
  ],
  related: [
    {
      title: 'Design Tokens',
      href: '/docs/foundations/design-tokens',
      description: 'See how colors fit into the broader token system.',
      icon: 'hexagon',
    },
    {
      title: 'Theming',
      href: '/docs/getting-started/theming',
      description: 'Understand how color themes and contrast modes change the roles.',
      icon: 'style',
    },
  ],
};
