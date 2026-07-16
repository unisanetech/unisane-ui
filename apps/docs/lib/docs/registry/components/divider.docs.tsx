'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Card } from '@unisane/ui';
import { Divider } from '@unisane/ui/divider';
import { List, ListDivider, ListItem } from '@unisane/ui/list';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const DividerHeroVisual = () => (
  <HeroBackground tone="surface">
    {/* Mock Card with Dividers */}
    <div className="bg-surface border-outline-variant relative w-72 overflow-hidden rounded-sm border shadow-xl">
      <div className="px-5 py-4">
        <div className="text-title-medium text-on-surface">Section One</div>
        <div className="text-body-small text-on-surface-variant mt-1">
          Content for the first section.
        </div>
      </div>
      <div className="bg-outline-variant h-px w-full" />
      <div className="px-5 py-4">
        <div className="text-title-medium text-on-surface">Section Two</div>
        <div className="text-body-small text-on-surface-variant mt-1">
          Content for the second section.
        </div>
      </div>
      <div className="bg-outline-variant mx-4 h-px" />
      <div className="px-5 py-4">
        <div className="text-title-medium text-on-surface">Section Three</div>
        <div className="text-body-small text-on-surface-variant mt-1">
          Content for the third section.
        </div>
      </div>
    </div>
  </HeroBackground>
);

export const dividerDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'divider',
  name: 'Divider',
  description: 'Dividers are thin lines that separate content into clear groups.',
  category: 'layout',
  status: 'stable',
  icon: 'horizontal_rule',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/divider',
  exports: ['Divider'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <DividerHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Dividers come in different variants for different separation needs.',
    columns: {
      emphasis: 'Variant',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Full bleed',
        component: (
          <Card variant="outlined" padding="none" className="w-52 overflow-hidden">
            <div className="text-label-small text-on-surface px-3 py-2">Item 1</div>
            <Divider />
            <div className="text-label-small text-on-surface px-3 py-2">Item 2</div>
          </Card>
        ),
        rationale: 'Edge-to-edge separation.',
        examples: 'Lists, Cards, Sections',
      },
      {
        emphasis: 'Inset',
        component: (
          <Card variant="outlined" padding="none" className="w-52 overflow-hidden">
            <div className="text-label-small text-on-surface px-3 py-2">Item 1</div>
            <Divider inset="start" />
            <div className="text-label-small text-on-surface px-3 py-2">Item 2</div>
          </Card>
        ),
        rationale: 'Aligned with content inset.',
        examples: 'List items with icons, Settings',
      },
      {
        emphasis: 'Middle',
        component: (
          <Card variant="outlined" padding="none" className="w-52 overflow-hidden">
            <div className="text-label-small text-on-surface px-3 py-2">Item 1</div>
            <Divider inset="both" />
            <div className="text-label-small text-on-surface px-3 py-2">Item 2</div>
          </Card>
        ),
        rationale: 'Centered with margins on both sides.',
        examples: 'Subtle separation, Inline content',
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description: 'Dividers can be horizontal or vertical.',
    items: [
      {
        component: (
          <div className="w-32">
            <Divider />
          </div>
        ),
        title: 'Horizontal',
        subtitle: 'Default orientation',
      },
      {
        component: (
          <div className="flex h-16 items-center justify-center">
            <Divider orientation="vertical" />
          </div>
        ),
        title: 'Vertical',
        subtitle: 'Side-by-side content',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Dividers are used to separate content within lists, cards, and layouts.',
    examples: [
      {
        title: 'In lists',
        visual: (
          <Card variant="outlined" padding="none" className="mx-auto max-w-72 overflow-hidden">
            <List>
              <ListItem headline="First item" />
              <ListDivider inset="start" />
              <ListItem headline="Second item" />
              <ListDivider inset="start" />
              <ListItem headline="Third item" />
            </List>
          </Card>
        ),
        caption: 'Inset dividers between list items',
      },
      {
        title: 'Between sections',
        visual: (
          <Card variant="outlined" padding="md" className="mx-auto max-w-72">
            <div className="text-body-medium text-on-surface">Section A content</div>
            <Divider className="my-4" />
            <div className="text-body-medium text-on-surface">Section B content</div>
          </Card>
        ),
        caption: 'Full-bleed divider between card sections',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'orientation',
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: 'The direction of the divider.',
    },
    {
      name: 'inset',
      type: '"none" | "start" | "both"',
      default: '"none"',
      description: 'Whether spacing is applied at the logical start or both ends.',
    },
    {
      name: 'decorative',
      type: 'boolean',
      default: 'true',
      description: 'Use false only when the divider represents a meaningful content boundary.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes.',
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'Decorative dividers are hidden from assistive technology by default.',
      "Set decorative={false} to publish role='separator' and the chosen orientation.",
      'Use semantic separators only for meaningful content boundaries.',
    ],
    keyboard: [{ key: 'N/A', description: 'Dividers are not interactive' }],
    focus: ['Dividers do not receive focus.', 'They serve as visual separators only.'],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Use dividers to visually separate content.',
    code: `import { Divider } from "@/components/ui/divider";
import { List, ListDivider, ListItem } from "@/components/ui/list";
import { Card } from "@/components/ui/card";

function SettingsList() {
  return (
    <Card>
      <List>
        <ListItem
          headline="Account"
          leading={<Icon symbol="person" />}
        />
        <ListDivider inset="start" />
        <ListItem
          headline="Privacy"
          leading={<Icon symbol="lock" />}
        />
        <ListDivider inset="start" />
        <ListItem
          headline="Notifications"
          leading={<Icon symbol="notifications" />}
        />
      </List>

      <Divider className="my-4" />

      <div className="px-4 py-2">
        <span className="text-label-small text-on-surface-variant">
          Version 1.0.0
        </span>
      </div>
    </Card>
  );
}

function SplitView() {
  return (
    <div className="flex h-64">
      <div className="flex-1 p-4">Left panel</div>
      <Divider orientation="vertical" />
      <div className="flex-1 p-4">Right panel</div>
    </div>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'list',
      reason: 'Dividers commonly used between list items.',
    },
    {
      slug: 'card',
      reason: 'Use to separate sections within cards.',
    },
    {
      slug: 'pane-group',
      reason: 'Use for resizable panel separation.',
    },
  ],
};
