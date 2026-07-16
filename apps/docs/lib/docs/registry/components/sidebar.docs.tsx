'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarDrawer,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@unisane/ui/sidebar';
import type { NavigationItem } from '@unisane/ui/navigation';
import { HeroBackground } from '../../runtime/hero-background';
import { DesktopPreviewFrame } from '../../runtime/desktop-preview-frame';
import type { ComponentDoc } from '../types';

const items: NavigationItem[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    icon: 'space_dashboard',
    items: [
      { id: 'overview', label: 'Overview', icon: 'dashboard' },
      {
        id: 'operations',
        label: 'Operations',
        items: [
          { id: 'approvals', label: 'Approvals' },
          { id: 'handoffs', label: 'Handoffs' },
        ],
      },
      { id: 'team', label: 'Team', icon: 'group' },
    ],
  },
  { id: 'queue', label: 'Queue', icon: 'inbox', badge: 3 },
  { id: 'reports', label: 'Reports', icon: 'bar_chart' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

function SidebarExample({ viewport = 'desktop' }: { viewport?: 'mobile' | 'tablet' | 'desktop' }) {
  const [value, setValue] = useState<string | null>('approvals');
  return (
    <DesktopPreviewFrame designWidth={920} designHeight={520} className="max-w-3xl">
      <div className="border-outline-variant bg-surface relative h-full w-full overflow-hidden rounded-sm border">
        <SidebarProvider
          items={items}
          value={value}
          onValueChange={setValue}
          defaultExpanded={viewport === 'desktop'}
          forceViewport={viewport}
          containerMode="contained"
          railWidth={80}
          drawerWidth={208}
          mobileInsetOffset={0}
        >
          <Sidebar className="h-full">
            <SidebarRail aria-label="Workspace navigation" />
            <SidebarDrawer
              aria-label="Workspace navigation"
              overlayHeadline="Main navigation"
              header={<span className="text-label-large">Product workspace</span>}
            />
            <SidebarInset className="bg-surface-container-low overflow-hidden">
              <div className="border-outline-variant flex items-center gap-3 border-b p-3">
                <SidebarTrigger aria-label="Toggle navigation" visibility="mobile" />
                <span className="text-title-small">{value ?? 'Workspace'}</span>
              </div>
              <div className="grid flex-1 gap-3 p-4 sm:grid-cols-2">
                <div className="bg-surface border-outline-variant rounded-sm border" />
                <div className="bg-surface border-outline-variant rounded-sm border" />
              </div>
            </SidebarInset>
          </Sidebar>
        </SidebarProvider>
      </div>
    </DesktopPreviewFrame>
  );
}

export const sidebarDoc: ComponentDoc = {
  slug: 'sidebar',
  name: 'Sidebar',
  description:
    'A responsive application-shell recipe that renders a rail, contextual desktop drawer, complete nested overlay drawer, and content inset from one navigation catalog.',
  category: 'navigation',
  status: 'stable',
  icon: 'left_panel_open',
  importPath: '@/components/ui/sidebar',
  exports: [
    'SidebarProvider',
    'Sidebar',
    'SidebarRail',
    'SidebarDrawer',
    'SidebarInset',
    'SidebarTrigger',
    'useSidebar',
  ],
  heroVisual: (
    <HeroBackground tone="surface" padding="sm">
      <SidebarExample />
    </HeroBackground>
  ),
  heroPreview: { minHeight: '2xl' },
  choosing: {
    description:
      'Use Sidebar for application-shell orchestration. Use NavigationRail or NavigationDrawer directly when responsive persistence, hover disclosure, and content inset are not needed.',
    columns: {
      emphasis: 'Viewport',
      component: 'Preview',
      rationale: 'Behavior',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Desktop',
        component: <SidebarExample />,
        rationale: 'Rail plus contextual inset drawer.',
        examples: 'Workspaces, admin consoles',
      },
      {
        emphasis: 'Mobile',
        component: <SidebarExample viewport="mobile" />,
        rationale: 'Named modal drawer with the complete nested tree.',
        examples: 'Responsive application shells',
      },
    ],
  },
  placement: {
    description:
      'Place Sidebar at the application-shell boundary and keep route content inside SidebarInset.',
    previewDefaults: { tone: 'surfaceContainerLow', minHeight: '2xl', padding: 'none' },
    examples: [
      {
        title: 'Array-driven shell',
        visual: <SidebarExample />,
        caption: 'Rail and drawer share one item, selection, activation, and link contract.',
      },
    ],
  },
  props: [
    {
      name: 'items',
      type: 'NavigationItem[]',
      required: true,
      description: 'One nested navigation catalog.',
    },
    { name: 'value', type: 'string | null', description: 'Controlled selected item id.' },
    {
      name: 'defaultValue',
      type: 'string | null',
      description: 'Initial uncontrolled selected item id.',
    },
    {
      name: 'onValueChange',
      type: '(id: string | null) => void',
      description: 'Selection callback.',
    },
    {
      name: 'onItemSelect',
      type: '(item: NavigationItem) => void',
      description: 'Destination activation callback.',
    },
    {
      name: 'renderLink',
      type: 'NavigationLinkRenderer',
      description: 'Framework-link renderer shared by rail and drawer.',
    },
    { name: 'expanded', type: 'boolean', description: 'Controlled desktop drawer expansion.' },
    { name: 'mobileOpen', type: 'boolean', description: 'Controlled overlay drawer state.' },
    {
      name: 'mode',
      type: 'SidebarMode',
      default: '"rail-drawer"',
      description: 'Rail/drawer layout capability.',
    },
    {
      name: 'behavior',
      type: 'SidebarBehavior | SidebarResponsiveBehavior',
      description: 'Fixed or per-viewport overlay/inset policy.',
    },
    {
      name: 'persist',
      type: 'boolean',
      default: 'false',
      description: 'Persist uncontrolled selection, expansion, and nested groups.',
    },
    {
      name: 'aria-label',
      type: 'string',
      required: true,
      description: 'Required on SidebarDrawer and SidebarRail.',
    },
  ],
  accessibility: {
    screenReader: [
      'Rail and drawer are independently named navigation landmarks.',
      'Selected destinations expose aria-current="page".',
      'The overlay drawer is a named modal dialog and hides the inset while open.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Move through destinations, disclosures, and shell actions.' },
      { key: 'Enter / Space', description: 'Activate destinations and nested disclosures.' },
      { key: 'Escape', description: 'Close the overlay drawer and restore focus.' },
    ],
    focus: [
      'The shared overlay foundation contains focus, dismisses the topmost layer, and restores focus.',
    ],
  },
  implementation: {
    description:
      'Install Sidebar locally, declare navigation once, and use the same controlled state and framework-link seam as the other navigation presentations.',
    code: `import Link from "next/link";
import {
  Sidebar,
  SidebarDrawer,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { NavigationItem } from "@/types/navigation";

const items: NavigationItem[] = [
  {
    id: "workspace",
    label: "Workspace",
    icon: "space_dashboard",
    items: [
      { id: "overview", label: "Overview", href: "/overview" },
      { id: "team", label: "Team", href: "/team" },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider items={items} renderLink={(_item, props) => <Link {...props} />}>
      <Sidebar>
        <SidebarRail aria-label="Primary navigation" />
        <SidebarDrawer aria-label="Primary navigation" overlayHeadline="Navigation" />
        <SidebarInset>{children}</SidebarInset>
      </Sidebar>
    </SidebarProvider>
  );
}`,
  },
  guidelines: [
    {
      type: 'do',
      text: 'Map the navigation catalog once and control route selection at the provider.',
    },
    {
      type: 'do',
      text: 'Use global semantic tokens and appearance axes for theme, density, and contrast.',
    },
    {
      type: 'dont',
      text: 'Do not rebuild rail items, drawer items, nested groups, or modal behavior in the app shell.',
    },
  ],
  related: [
    { slug: 'navigation-rail', reason: 'Standalone compact vertical presentation.' },
    { slug: 'navigation-drawer', reason: 'Standalone persistent or modal drawer.' },
    { slug: 'navigation-bar', reason: 'Bottom navigation presentation.' },
  ],
};
