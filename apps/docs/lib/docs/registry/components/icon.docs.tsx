'use client';

import type { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Icon } from '@unisane/ui/icon';

const IconHeroVisual = () => (
  <HeroBackground tone="surface">
    <div className="bg-surface border-outline-variant flex items-center gap-5 rounded-xl border p-6 shadow-xl">
      <Icon symbol="favorite" size="lg" filled className="text-primary" />
      <Icon symbol="settings" size="lg" className="text-on-surface" />
      <Icon symbol="check_circle" size="lg" className="text-success" />
    </div>
  </HeroBackground>
);

export const iconDoc: ComponentDoc = {
  slug: 'icon',
  name: 'Icon',
  description: 'Icons render a symbol or custom SVG through one accessible, size-aware leaf API.',
  category: 'foundations',
  status: 'stable',
  icon: 'symbols',
  importPath: '@/components/ui/icon',
  exports: ['Icon', 'IconProps'],
  heroVisual: <IconHeroVisual />,
  hierarchy: {
    description:
      'Use the shared scale for normal UI icons and numeric sizes for exceptional artwork.',
    items: [
      {
        component: <Icon symbol="info" size="sm" />,
        title: 'Small',
        subtitle: 'Compact controls and metadata',
      },
      {
        component: <Icon symbol="info" size="md" />,
        title: 'Medium',
        subtitle: 'Default actions and navigation',
      },
      {
        component: <Icon symbol="info" size="lg" />,
        title: 'Large',
        subtitle: 'Prominent status and empty states',
      },
    ],
  },
  props: [
    {
      name: 'symbol',
      type: 'string',
      description: 'Symbol name rendered through the configured project icon font.',
    },
    {
      name: 'size',
      type: 'number | "xs" | "sm" | "md" | "lg" | "xl"',
      default: '"md"',
      description: 'Shared icon scale or an explicit pixel size.',
    },
    {
      name: 'filled',
      type: 'boolean',
      default: 'false',
      description: 'Uses the filled symbol variation when rendering a symbol.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Custom SVG path content when no symbol is supplied.',
    },
    {
      name: 'aria-label',
      type: 'string',
      description: 'Accessible name when the icon conveys information independently.',
    },
  ],
  accessibility: {
    screenReader: [
      'Icons are aria-hidden by default because most icons accompany accessible text or controls.',
      'Provide both aria-label and role="img" when an icon independently communicates meaning.',
      'IconButton owns the accessible action name; its nested Icon normally stays decorative.',
    ],
  },
  implementation: {
    description: 'Install the local source and use the shared scale for normal interface icons.',
    code: `import { Icon } from "@/components/ui/icon";

export function StatusIcon() {
  return <Icon symbol="check_circle" size="md" className="text-success" />;
}`,
  },
  related: [
    { slug: 'icon-button', reason: 'Use IconButton when the icon triggers an action.' },
    { slug: 'button', reason: 'Use leadingIcon or trailingIcon when text labels the action.' },
  ],
};
