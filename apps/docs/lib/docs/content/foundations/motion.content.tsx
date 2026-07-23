import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import type { FoundationPageDoc } from './types';
import { motionFoundationMeta as meta } from './foundation-page-meta';

const heroVisual = (
  <div className="grid h-full gap-4">
    {[
      ['Short', 'snappy for feedback'],
      ['Medium', 'most UI state transitions'],
      ['Emphasized', 'feature surfaces and overlays'],
    ].map(([title, subtitle], index) => (
      <Surface
        key={title}
        tone={index === 2 ? 'primaryContainer' : 'surface'}
        rounded="sm"
        className="flex items-center justify-between px-4 py-3"
      >
        <Typography
          variant="titleMedium"
          className={index === 2 ? 'text-on-primary-container' : undefined}
        >
          {title}
        </Typography>
        <Typography
          variant="bodySmall"
          className={index === 2 ? 'text-on-primary-container' : 'text-on-surface-variant'}
        >
          {subtitle}
        </Typography>
      </Surface>
    ))}
  </div>
);

export const motionFoundationPage: FoundationPageDoc = {
  ...meta,
  heroVisual,
  heroPreview: { tone: 'surfaceContainerLow', minHeight: 'md', padding: 'md' },
  sections: [
    {
      type: 'grid',
      id: 'families',
      title: 'Motion families',
      columns: 2,
      items: [
        {
          title: 'Short / snappy',
          description: 'Ripple, pressed state, toggles, and micro feedback.',
          icon: 'speed',
        },
        {
          title: 'Medium',
          description: 'Most layout and component state transitions.',
          icon: 'sync',
        },
        {
          title: 'Emphasized',
          description: 'Dialogs, menus, sheets, and stronger attention shifts.',
          icon: 'flare',
        },
        {
          title: 'Shared easing',
          description: 'Named curves keep motion consistent across the library.',
          icon: 'timeline',
        },
      ],
    },
    {
      type: 'do-dont',
      id: 'guidance',
      title: 'Motion guidance',
      dos: [
        'Use named duration and easing tokens across components.',
        'Keep transitions short for direct feedback.',
        'Use emphasized motion only when hierarchy changes noticeably.',
      ],
      donts: [
        'Do not invent local duration names or bespoke curves.',
        'Do not animate every property if opacity or transform is enough.',
        'Do not add motion that competes with reading and task flow.',
      ],
    },
  ],
  related: [
    {
      title: 'Design Tokens',
      href: '/docs/foundations/design-tokens',
      description: 'Motion lives inside the same token system as color and spacing.',
      icon: 'hexagon',
    },
  ],
};
