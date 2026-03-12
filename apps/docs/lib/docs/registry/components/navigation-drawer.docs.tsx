'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { DesktopPreviewFrame } from '../../runtime/desktop-preview-frame';
import {
  NavigationDrawer,
  NavigationDrawerItem,
  NavigationDrawerHeadline,
  NavigationDrawerDivider,
} from '@unisane/ui';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const NavigationDrawerHeroVisual = () => (
  <HeroBackground tone="surface" padding="sm">
    <DesktopPreviewFrame designWidth={960} designHeight={560} className="max-w-3xl">
      <div className="bg-surface border-outline-variant relative flex h-full w-full overflow-hidden rounded-sm border shadow-xl">
        <div className="bg-surface-container border-outline-variant w-36 border-r p-3">
          <div className="text-label-small text-on-surface-variant mb-3 px-2">Navigation</div>
          <div className="space-y-1">
            <div className="bg-secondary-container flex items-center gap-2 rounded-full px-3 py-2">
              <span className="material-symbols-outlined text-primary text-[20px]">home</span>
              <span className="text-label-medium text-primary">Home</span>
            </div>
            <div className="text-on-surface-variant flex items-center gap-2 rounded-full px-3 py-2">
              <span className="material-symbols-outlined text-[20px]">inbox</span>
              <span className="text-label-medium">Inbox</span>
            </div>
            <div className="text-on-surface-variant flex items-center gap-2 rounded-full px-3 py-2">
              <span className="material-symbols-outlined text-[20px]">send</span>
              <span className="text-label-medium">Sent</span>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-3">
            <div className="bg-surface-container-high h-4 w-full rounded-sm" />
            <div className="bg-surface-container-high h-4 w-3/4 rounded-sm" />
            <div className="bg-surface-container-high h-4 w-1/2 rounded-sm" />
          </div>
        </div>
      </div>
    </DesktopPreviewFrame>
  </HeroBackground>
);

// ─── EXAMPLES ────────────────────────────────────────────────────────────────
const NavigationDrawerBasicExample = () => (
  <div className="bg-surface-container-low relative isolate h-full w-full overflow-hidden rounded-sm">
    <div className="absolute inset-0 bg-surface-container-lowest" />
    <div className="absolute inset-y-0 left-0 w-[min(320px,100%)] border-r border-outline-variant" />
    <div className="absolute inset-y-0 right-0 w-[max(0px,calc(100%-min(320px,100%)))] p-4">
      <div className="space-y-2">
        <div className="h-2 rounded-sm bg-surface-container-high" />
        <div className="h-2 w-4/5 rounded-sm bg-surface-container-high" />
        <div className="h-2 w-3/5 rounded-sm bg-surface-container-high" />
      </div>
    </div>
    <NavigationDrawer
      open
      modal={false}
      className="!absolute !inset-y-0 !left-0 !h-full !w-[min(320px,100%)] !max-w-[85vw]"
    >
      <div className="p-4">
        <div className="text-title-medium text-on-surface mb-4">My App</div>
      </div>
      <NavigationDrawerHeadline>Main</NavigationDrawerHeadline>
      <NavigationDrawerItem icon="home" active>
        Home
      </NavigationDrawerItem>
      <NavigationDrawerItem icon="inbox" badge="24">
        Inbox
      </NavigationDrawerItem>
      <NavigationDrawerItem icon="send">Sent</NavigationDrawerItem>
      <NavigationDrawerDivider />
      <NavigationDrawerHeadline>Labels</NavigationDrawerHeadline>
      <NavigationDrawerItem icon="label">Important</NavigationDrawerItem>
      <NavigationDrawerItem icon="label">Work</NavigationDrawerItem>
    </NavigationDrawer>
  </div>
);

export const navigationDrawerDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'navigation-drawer',
  name: 'Navigation Drawer',
  description:
    'Navigation drawers provide standalone drawer-style access to destinations and app functionality in a sliding panel.',
  category: 'navigation',
  status: 'stable',
  icon: 'menu',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@unisane/ui',
  exports: [
    'NavigationDrawer',
    'NavigationDrawerItem',
    'NavigationDrawerHeadline',
    'NavigationDrawerDivider',
  ],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <NavigationDrawerHeroVisual />,
  heroPreview: {
    minHeight: 'xl',
  },
  docsLayout: {
    hideChoosing: true,
    hidePlacement: true,
  },

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      'Choose drawer type based on screen size and whether you need a standalone nav surface or a full app-shell layout.',
    columns: {
      emphasis: 'Type',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Standard',
        component: (
          <div className="relative isolate h-32 w-52 overflow-hidden rounded-sm border border-outline-variant bg-surface-container-lowest">
            <div className="absolute inset-y-0 right-0 w-8 bg-surface-container-low" />
            <NavigationDrawer open modal={false} className="!absolute !inset-y-0 !left-0 !h-full !w-44 !max-w-none !border-r-0">
              <NavigationDrawerHeadline>Main</NavigationDrawerHeadline>
              <NavigationDrawerItem icon="home" active>Home</NavigationDrawerItem>
              <NavigationDrawerItem icon="inbox">Inbox</NavigationDrawerItem>
            </NavigationDrawer>
          </div>
        ),
        rationale: 'Standalone persistent navigation on large screens.',
        examples: 'Desktop apps, Admin dashboards',
      },
      {
        emphasis: 'Modal',
        component: (
          <div className="relative isolate h-32 w-52 overflow-hidden rounded-sm border border-outline-variant bg-surface-container-lowest">
            <div className="bg-scrim/35 absolute inset-0" />
            <NavigationDrawer open modal className="!absolute !inset-y-0 !left-0 !h-full !w-44 !max-w-none">
              <NavigationDrawerHeadline>Main</NavigationDrawerHeadline>
              <NavigationDrawerItem icon="home" active>Home</NavigationDrawerItem>
              <NavigationDrawerItem icon="settings">Settings</NavigationDrawerItem>
            </NavigationDrawer>
          </div>
        ),
        rationale: 'Standalone overlay navigation on mobile.',
        examples: 'Mobile apps, Compact screens',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Navigation drawers appear from the left edge of the screen.',
    previewDefaults: {
      tone: 'surfaceContainerLow',
      minHeight: '2xl',
      padding: 'none',
      align: 'start',
      justify: 'start',
    },
    examples: [
      {
        title: 'Standard drawer',
        visual: <NavigationDrawerBasicExample />,
        caption: 'Navigation drawer with items and sections',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'open',
      type: 'boolean',
      default: 'true',
      description: 'Controls drawer visibility.',
    },
    {
      name: 'modal',
      type: 'boolean',
      default: 'false',
      description: 'Whether drawer overlays content.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'true',
      description: 'Initial open state for uncontrolled usage.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Called whenever drawer open state changes.',
    },
    {
      name: 'onClose',
      type: '() => void',
      description: 'Optional callback when drawer closes via Escape.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Navigation items and content.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes.',
    },
  ],

  // ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────
  subComponents: [
    {
      name: 'NavigationDrawerItem',
      description: 'Navigation item within the drawer.',
      props: [
        { name: 'icon', type: 'ReactNode | string', description: 'Icon to display.' },
        { name: 'active', type: 'boolean', description: 'Whether item is active.' },
        { name: 'badge', type: 'string | number', description: 'Badge content.' },
        { name: 'href', type: 'string', description: 'Link URL.' },
        { name: 'asChild', type: 'boolean', description: 'Render as child element.' },
      ],
    },
    {
      name: 'NavigationDrawerHeadline',
      description: 'Section headline within the drawer.',
      props: [{ name: 'children', type: 'ReactNode', description: 'Headline text.' }],
    },
    {
      name: 'NavigationDrawerDivider',
      description: 'Visual divider between sections.',
      props: [],
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'Uses semantic <aside> element.',
      'Active item indicated via aria-current.',
      'Modal drawer manages focus properly.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Navigate between items' },
      { key: 'Enter/Space', description: 'Activate focused item' },
      { key: 'Escape', description: 'Close modal drawer' },
    ],
    focus: ['Focus visible on navigation items.', 'Focus trapped in modal drawer.'],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Use with state or router for navigation.',
    code: `import {
  NavigationDrawer,
  NavigationDrawerItem,
  NavigationDrawerHeadline,
} from "@unisane/ui";
import { usePathname } from "next/navigation";
import Link from "next/link";

function AppNavigation() {
  const pathname = usePathname();

  return (
    <NavigationDrawer>
      <NavigationDrawerHeadline>Main</NavigationDrawerHeadline>

      <NavigationDrawerItem
        icon="home"
        active={pathname === "/"}
        asChild
      >
        <Link href="/">Home</Link>
      </NavigationDrawerItem>

      <NavigationDrawerItem
        icon="inbox"
        badge={5}
        active={pathname === "/inbox"}
        asChild
      >
        <Link href="/inbox">Inbox</Link>
      </NavigationDrawerItem>

      <NavigationDrawerItem
        icon="settings"
        active={pathname === "/settings"}
        asChild
      >
        <Link href="/settings">Settings</Link>
      </NavigationDrawerItem>
    </NavigationDrawer>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'sidebar',
      reason:
        'Use for full app-shell navigation that coordinates rail, drawer, backdrop, and content inset together.',
    },
    {
      slug: 'navigation-rail',
      reason: 'Use for compact standalone vertical navigation on larger screens.',
    },
    {
      slug: 'navigation-bar',
      reason: 'Bottom navigation for mobile.',
    },
    {
      slug: 'sheet',
      reason: 'Use for non-navigation content panels.',
    },
  ],
};
