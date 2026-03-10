import { Surface, Typography } from '@unisane/ui';
import type { FoundationPageDoc } from './types';
import { designTokensFoundationMeta as meta } from './foundation-page-meta';

const heroVisual = (
  <div className="grid h-full grid-cols-2 gap-4">
    {[
      ['Color roles', 'surface, primary, outline'],
      ['Type roles', 'display, title, body, label'],
      ['Space scale', 'unit, density, gaps, padding'],
      ['Motion + depth', 'duration, easing, elevation'],
    ].map(([title, subtitle]) => (
      <Surface
        key={title}
        tone="surface"
        rounded="sm"
        className="flex min-h-[120px] flex-col justify-between p-4"
      >
        <Typography variant="titleMedium">{title}</Typography>
        <Typography variant="bodySmall" className="text-on-surface-variant leading-relaxed">
          {subtitle}
        </Typography>
      </Surface>
    ))}
  </div>
);

export const designTokensFoundationPage: FoundationPageDoc = {
  ...meta,
  heroVisual,
  heroPreview: {
    tone: 'surfaceContainerLow',
    minHeight: 'md',
    padding: 'md',
  },
  sections: [
    {
      type: 'prose',
      id: 'overview',
      title: 'How tokens work',
      body: (
        <div className="space-y-4">
          <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
            Unisane UI is token-first. Components should consume semantic tokens like surface,
            primary, outline, label, and elevation rather than inventing local color or spacing
            values.
          </Typography>
          <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
            The same token system drives Tailwind utilities, theme switching, density, radius, and
            elevation. That keeps component styling stable while still allowing the theme to shift
            globally.
          </Typography>
        </div>
      ),
    },
    {
      type: 'grid',
      id: 'families',
      title: 'Token families',
      description: 'The core token groups that shape the system.',
      columns: 2,
      items: [
        {
          title: 'Color',
          description: 'Semantic roles for surfaces, content, emphasis, status, and containers.',
          icon: 'palette',
        },
        {
          title: 'Typography',
          description: 'Role-based text styles for display, headline, title, body, and label.',
          icon: 'text_fields',
        },
        {
          title: 'Spacing',
          description: 'A scalable spacing unit that responds to density and layout rhythm.',
          icon: 'space_bar',
        },
        {
          title: 'Radius',
          description: 'Consistent corner scale shared across cards, inputs, menus, and surfaces.',
          icon: 'rounded_corner',
        },
        {
          title: 'Elevation',
          description: 'Depth system used to separate surfaces without ad hoc shadows.',
          icon: 'layers',
        },
        {
          title: 'Motion',
          description: 'Named durations and easing curves for predictable transitions.',
          icon: 'animation',
        },
      ],
    },
    {
      type: 'checklist',
      id: 'rules',
      title: 'Token rules',
      items: [
        'Use semantic tokens first and alpha treatments second.',
        'Let theme, density, radius, and elevation flow from shared global controls.',
        'Do not introduce component-local color values when a semantic role already exists.',
        'Prefer tokens that describe meaning, not appearance.',
      ],
    },
  ],
  related: [
    {
      title: 'Colors',
      href: '/docs/foundations/colors',
      description: 'See how semantic color roles map to the visible UI.',
      icon: 'palette',
    },
    {
      title: 'Building Themes',
      href: '/docs/getting-started/theming',
      description: 'Learn how theme axes apply those tokens at runtime.',
      icon: 'style',
    },
  ],
};
