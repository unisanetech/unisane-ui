'use client';

import { useState } from 'react';
import { Fab } from '@unisane/ui/fab';
import { NavigationRail } from '@unisane/ui/navigation-rail';
import type { NavigationItem } from '@unisane/ui/navigation';
import { HeroBackground } from '../../runtime/hero-background';
import type { ComponentDoc } from '../types';

const items: NavigationItem[] = [
  { id: 'inbox', label: 'Inbox', icon: 'inbox', activeIcon: 'inbox', badge: 3 },
  { id: 'sent', label: 'Sent', icon: 'send' },
  { id: 'drafts', label: 'Drafts', icon: 'drafts' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

function NavigationRailExample({
  labels = 'always',
}: {
  labels?: 'always' | 'selected' | 'hidden';
}) {
  const [value, setValue] = useState<string | null>('inbox');
  return (
    <div className="bg-surface border-outline-variant flex h-80 w-full max-w-lg overflow-hidden rounded-sm border">
      <NavigationRail
        aria-label="Mailbox navigation"
        items={items}
        value={value}
        onValueChange={setValue}
        labelVisibility={labels}
        header={<Fab size="md" variant="tertiary" icon="edit" aria-label="Compose" />}
      />
      <div className="bg-surface-container-low flex-1 p-5">
        <div className="text-title-medium text-on-surface mb-4">{value ?? 'Mailbox'}</div>
        <div className="space-y-3">
          <div className="bg-surface border-outline-variant h-12 rounded-sm border" />
          <div className="bg-surface border-outline-variant h-12 rounded-sm border" />
        </div>
      </div>
    </div>
  );
}

export const navigationRailDoc: ComponentDoc = {
  slug: 'navigation-rail',
  name: 'Navigation Rail',
  description:
    'The compact vertical presentation of the shared navigation item and selection contract.',
  category: 'navigation',
  status: 'stable',
  icon: 'view_sidebar',
  importPath: '@/components/ui/navigation-rail',
  exports: ['NavigationRail'],
  heroVisual: (
    <HeroBackground tone="surface">
      <NavigationRailExample />
    </HeroBackground>
  ),
  heroPreview: { minHeight: '2xl' },
  choosing: {
    description:
      'Use the Rail when destinations fit a compact vertical surface and the shell does not need Sidebar orchestration.',
    columns: {
      emphasis: 'Labels',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Always visible',
        component: <NavigationRailExample />,
        rationale: 'Destination names should remain visible.',
        examples: 'Tablet workspaces, admin tools',
      },
      {
        emphasis: 'Icon only',
        component: <NavigationRailExample labels="hidden" />,
        rationale: 'Space is constrained and every item has an accessible name and tooltip.',
        examples: 'Dense desktop shells',
      },
    ],
  },
  placement: {
    description: 'Place the Rail at the start edge of the app-shell content region.',
    previewDefaults: { tone: 'surfaceContainerLow', minHeight: '2xl', padding: 'none' },
    examples: [
      {
        title: 'Rail with header action',
        visual: <NavigationRailExample />,
        caption: 'Selection uses the same item ids as Bar and Drawer.',
      },
    ],
  },
  props: [
    {
      name: 'items',
      type: 'NavigationItem[]',
      required: true,
      description: 'Shared destination collection.',
    },
    { name: 'value', type: 'string | null', description: 'Controlled selected item id.' },
    {
      name: 'defaultValue',
      type: 'string | null',
      description: 'Initial uncontrolled selected id.',
    },
    {
      name: 'onValueChange',
      type: '(id: string | null) => void',
      description: 'Selection callback.',
    },
    {
      name: 'onItemSelect',
      type: '(item: NavigationItem) => void',
      description: 'Activation callback.',
    },
    { name: 'renderLink', type: 'NavigationLinkRenderer', description: 'Framework-link renderer.' },
    {
      name: 'aria-label',
      type: 'string',
      required: true,
      description: 'Navigation landmark name.',
    },
    {
      name: 'labelVisibility',
      type: '"always" | "selected" | "hidden"',
      default: '"always"',
      description: 'Label visibility policy.',
    },
    {
      name: 'alignment',
      type: '"start" | "center" | "end"',
      default: '"start"',
      description: 'Vertical item alignment.',
    },
    {
      name: 'onItemHover',
      type: '(id: string) => void',
      description: 'Optional presentation hover signal.',
    },
    { name: 'header', type: 'ReactNode', description: 'Content above destinations.' },
    { name: 'footer', type: 'ReactNode', description: 'Content below destinations.' },
  ],
  accessibility: {
    screenReader: [
      'Uses a named navigation landmark.',
      'Hidden visual labels become action aria-labels and native tooltips.',
      'The selected destination exposes aria-current="page".',
    ],
    keyboard: [
      { key: 'Tab', description: 'Move among enabled destinations.' },
      { key: 'Enter / Space', description: 'Activate the focused destination.' },
    ],
    focus: ['Native links and buttons retain visible focus and disabled semantics.'],
  },
  implementation: {
    description: 'Use the same local item collection used by other responsive presentations.',
    code: `import { NavigationRail } from "@/components/ui/navigation-rail";
import type { NavigationItem } from "@/types/navigation";

const items: NavigationItem[] = [
  { id: "home", label: "Home", icon: "home", href: "/" },
  { id: "inbox", label: "Inbox", icon: "inbox", href: "/inbox", badge: 5 },
];

export function DesktopNavigation() {
  return <NavigationRail aria-label="Primary navigation" items={items} defaultValue="home" />;
}`,
  },
  guidelines: [
    { type: 'do', text: 'Provide aria-label whenever visual labels are hidden.' },
    { type: 'do', text: 'Keep destination identity stable across Bar, Rail, and Drawer.' },
    { type: 'dont', text: 'Do not put app-shell persistence or drawer orchestration in Rail.' },
  ],
  related: [
    { slug: 'navigation-bar', reason: 'Mobile bottom presentation.' },
    { slug: 'navigation-drawer', reason: 'Labeled vertical presentation.' },
    { slug: 'sidebar', reason: 'Responsive application-shell orchestration.' },
  ],
};
