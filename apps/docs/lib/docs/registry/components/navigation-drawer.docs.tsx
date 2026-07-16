'use client';

import { useState } from 'react';
import { NavigationDrawer } from '@unisane/ui/navigation-drawer';
import type { NavigationItem } from '@unisane/ui/navigation';
import { HeroBackground } from '../../runtime/hero-background';
import { DesktopPreviewFrame } from '../../runtime/desktop-preview-frame';
import type { ComponentDoc } from '../types';

const items: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: 'home', href: '/' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 24, href: '/inbox' },
  { id: 'sent', label: 'Sent', icon: 'send', href: '/sent' },
  { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' },
];

function NavigationDrawerExample() {
  const [value, setValue] = useState<string | null>('home');
  return (
    <div className="bg-surface flex h-72 w-full max-w-xl overflow-hidden rounded-sm border border-outline-variant">
      <NavigationDrawer
        aria-label="Workspace navigation"
        items={items}
        value={value}
        onValueChange={setValue}
        headline="Workspace"
        header={<div className="text-title-medium text-on-surface">My app</div>}
        className="w-64 max-w-64"
      />
      <div className="bg-surface-container-low flex-1 p-5">
        <div className="text-title-medium text-on-surface mb-4">{value ?? 'Workspace'}</div>
        <div className="space-y-3">
          <div className="bg-surface h-3 rounded-sm" />
          <div className="bg-surface h-3 w-3/4 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export const navigationDrawerDoc: ComponentDoc = {
  slug: 'navigation-drawer',
  name: 'Navigation Drawer',
  description:
    'The labeled persistent or modal presentation of the shared navigation item and selection contract.',
  category: 'navigation',
  status: 'stable',
  icon: 'menu',
  importPath: '@/components/ui/navigation-drawer',
  exports: ['NavigationDrawer'],
  heroVisual: (
    <HeroBackground tone="surface" padding="sm">
      <DesktopPreviewFrame designWidth={900} designHeight={520} className="max-w-3xl">
        <NavigationDrawerExample />
      </DesktopPreviewFrame>
    </HeroBackground>
  ),
  heroPreview: { minHeight: 'xl' },
  choosing: {
    description:
      'Use persistent mode inside a wide layout. Use modal mode on compact screens when navigation must overlay and isolate the current page.',
    columns: {
      emphasis: 'Variant',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Persistent',
        component: <NavigationDrawerExample />,
        rationale: 'The drawer participates in the normal app-shell layout.',
        examples: 'Desktop workspaces, admin apps',
      },
    ],
  },
  placement: {
    description: 'Persistent drawers sit in layout; modal drawers portal to the viewport start or end edge.',
    previewDefaults: { tone: 'surfaceContainerLow', minHeight: '2xl', padding: 'none' },
    examples: [
      {
        title: 'Persistent drawer',
        visual: <NavigationDrawerExample />,
        caption: 'The same selected id and items can be handed to Bar or Rail.',
      },
    ],
  },
  props: [
    { name: 'items', type: 'NavigationItem[]', required: true, description: 'Shared destination collection.' },
    { name: 'value', type: 'string | null', description: 'Controlled selected item id.' },
    { name: 'defaultValue', type: 'string | null', description: 'Initial uncontrolled selected id.' },
    { name: 'onValueChange', type: '(id: string | null) => void', description: 'Selection callback.' },
    { name: 'onItemSelect', type: '(item: NavigationItem) => void', description: 'Activation callback.' },
    { name: 'renderLink', type: 'NavigationLinkRenderer', description: 'Framework-link renderer.' },
    { name: 'aria-label', type: 'string', required: true, description: 'Navigation and modal accessible name.' },
    { name: 'open', type: 'boolean', description: 'Controlled visibility.' },
    { name: 'defaultOpen', type: 'boolean', default: 'true', description: 'Initial uncontrolled visibility.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Visibility callback.' },
    { name: 'variant', type: '"persistent" | "modal"', default: '"persistent"', description: 'Layout or modal presentation.' },
    { name: 'side', type: '"start" | "end"', default: '"start"', description: 'Viewport or layout edge.' },
    { name: 'triggerRef', type: 'RefObject<HTMLElement>', description: 'Focus-return owner for modal usage.' },
    { name: 'headline', type: 'ReactNode', description: 'Optional destination-section heading.' },
    { name: 'header', type: 'ReactNode', description: 'Content above the destination list.' },
    { name: 'footer', type: 'ReactNode', description: 'Content below the destination list.' },
  ],
  accessibility: {
    screenReader: [
      'Persistent mode is a named navigation landmark.',
      'Modal mode uses a named modal dialog containing the navigation landmark.',
      'The selected destination exposes aria-current="page".',
    ],
    keyboard: [
      { key: 'Tab / Shift+Tab', description: 'Move through items; modal mode contains focus.' },
      { key: 'Enter / Space', description: 'Activate the focused destination.' },
      { key: 'Escape', description: 'Dismiss modal mode and restore trigger focus.' },
    ],
    focus: [
      'Modal mode enters the first enabled destination, isolates background content, and restores trigger focus.',
      'Persistent mode leaves normal page focus order unchanged.',
    ],
  },
  implementation: {
    description:
      'The local modal presentation includes the shared overlay, scroll-lock, item, and action dependencies.',
    code: `import { NavigationDrawer } from "@/components/ui/navigation-drawer";
import type { NavigationItem } from "@/types/navigation";

const items: NavigationItem[] = [
  { id: "home", label: "Home", icon: "home", href: "/" },
  { id: "settings", label: "Settings", icon: "settings", href: "/settings" },
];

export function DesktopNavigation() {
  return (
    <NavigationDrawer
      aria-label="Primary navigation"
      items={items}
      headline="Workspace"
      defaultValue="home"
    />
  );
}`,
  },
  guidelines: [
    { type: 'do', text: 'Use modal mode only when focus isolation and page blocking are intended.' },
    { type: 'do', text: 'Pass the opening trigger ref so modal dismissal restores focus predictably.' },
    { type: 'dont', text: 'Do not use Drawer for arbitrary non-navigation panels; use Sheet.' },
  ],
  related: [
    { slug: 'navigation-rail', reason: 'Compact vertical presentation.' },
    { slug: 'navigation-bar', reason: 'Mobile bottom presentation.' },
    { slug: 'sidebar', reason: 'Responsive application-shell orchestration.' },
    { slug: 'sheet', reason: 'Modal panels that are not navigation.' },
  ],
};
