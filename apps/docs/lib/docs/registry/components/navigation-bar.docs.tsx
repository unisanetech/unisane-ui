'use client';

import { useState } from 'react';
import { NavigationBar } from '@unisane/ui/navigation-bar';
import type { NavigationItem } from '@unisane/ui/navigation';
import { HeroBackground } from '../../runtime/hero-background';
import type { ComponentDoc } from '../types';

const items: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: 'home', activeIcon: 'home' },
  { id: 'explore', label: 'Explore', icon: 'explore' },
  { id: 'saved', label: 'Saved', icon: 'bookmark', badge: 2 },
  { id: 'profile', label: 'Profile', icon: 'person' },
];

function NavigationBarExample() {
  const [value, setValue] = useState<string | null>('home');
  return (
    <div className="bg-surface-container-low relative h-48 w-full max-w-sm overflow-hidden rounded-sm border border-outline-variant">
      <div className="space-y-3 p-5">
        <div className="bg-surface-container-high h-3 w-full rounded-sm" />
        <div className="bg-surface-container-high h-3 w-3/4 rounded-sm" />
      </div>
      <NavigationBar
        aria-label="Primary navigation"
        items={items}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

export const navigationBarDoc: ComponentDoc = {
  slug: 'navigation-bar',
  name: 'Navigation Bar',
  description:
    'The mobile bottom presentation of the shared navigation item and selection contract.',
  category: 'navigation',
  status: 'stable',
  icon: 'bottom_navigation',
  importPath: '@/components/ui/navigation-bar',
  exports: ['NavigationBar'],
  heroVisual: (
    <HeroBackground tone="surface">
      <NavigationBarExample />
    </HeroBackground>
  ),
  choosing: {
    description:
      'Use NavigationBar for three to five primary destinations on compact screens. The same items can move to NavigationRail or NavigationDrawer at wider breakpoints.',
    columns: {
      emphasis: 'Presentation',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Bottom bar',
        component: <NavigationBarExample />,
        rationale: 'Primary compact-screen destinations remain visible near the thumb zone.',
        examples: 'Mobile workspaces, consumer apps',
      },
    ],
  },
  placement: {
    description: 'Place it at the bottom edge of the compact app shell.',
    previewDefaults: { tone: 'surfaceContainerLow', minHeight: 'lg', padding: 'none' },
    examples: [
      {
        title: 'Controlled destinations',
        visual: <NavigationBarExample />,
        caption: 'One item collection and one selected id drive the presentation.',
      },
    ],
  },
  props: [
    { name: 'items', type: 'NavigationItem[]', required: true, description: 'Shared destination collection.' },
    { name: 'value', type: 'string | null', description: 'Controlled selected item id.' },
    { name: 'defaultValue', type: 'string | null', description: 'Initial uncontrolled selected id.' },
    { name: 'onValueChange', type: '(id: string | null) => void', description: 'Selection callback.' },
    { name: 'onItemSelect', type: '(item: NavigationItem) => void', description: 'Activation callback with the selected item.' },
    { name: 'renderLink', type: 'NavigationLinkRenderer', description: 'Framework-link renderer used for href items.' },
    { name: 'aria-label', type: 'string', required: true, description: 'Accessible name for the navigation landmark.' },
    { name: 'itemClassName', type: 'string', description: 'Presentation-wide item layout override.' },
    { name: 'className', type: 'string', description: 'Container layout classes.' },
  ],
  accessibility: {
    screenReader: [
      'Uses a named navigation landmark.',
      'The selected destination exposes aria-current="page".',
      'Disabled items remain unavailable without toggle-button semantics.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Move among visible destinations.' },
      { key: 'Enter / Space', description: 'Activate the focused destination.' },
    ],
    focus: ['Every enabled item uses native link or button focus behavior and a visible focus ring.'],
  },
  implementation: {
    description:
      'Registry-installed projects import the local presentation and shared local navigation type.',
    code: `import { NavigationBar } from "@/components/ui/navigation-bar";
import type { NavigationItem } from "@/types/navigation";

const items: NavigationItem[] = [
  { id: "home", label: "Home", icon: "home", href: "/" },
  { id: "search", label: "Search", icon: "search", href: "/search" },
  { id: "profile", label: "Profile", icon: "person", href: "/profile" },
];

export function MobileNavigation({ pathname }: { pathname: string }) {
  return (
    <NavigationBar
      aria-label="Primary navigation"
      items={items}
      value={items.find((item) => item.href === pathname)?.id ?? null}
    />
  );
}`,
  },
  guidelines: [
    { type: 'do', text: 'Reuse the same item ids when the presentation changes at a breakpoint.' },
    { type: 'do', text: 'Use href for destinations and onItemSelect for app actions without a URL.' },
    { type: 'dont', text: 'Do not model destinations as pressed toggle buttons.' },
  ],
  related: [
    { slug: 'navigation-rail', reason: 'Compact vertical presentation for larger screens.' },
    { slug: 'navigation-drawer', reason: 'Labeled persistent or modal presentation.' },
    { slug: 'sidebar', reason: 'Application-shell orchestration across responsive presentations.' },
  ],
};
