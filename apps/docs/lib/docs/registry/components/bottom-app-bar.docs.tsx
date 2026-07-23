'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { BottomAppBar, BottomAppBarAction } from '@unisane/ui/bottom-app-bar';
import { Fab } from '@unisane/ui/fab';
import { NavigationBar } from '@unisane/ui/navigation-bar';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const BottomAppBarHeroVisual = () => (
  <HeroBackground tone="surface">
    {/* Mock App with Bottom Bar */}
    <div className="bg-surface border-outline-variant relative h-60 w-80 overflow-hidden rounded-sm border shadow-xl">
      {/* Content */}
      <div className="space-y-3 p-4">
        <div className="bg-surface-container-high h-4 w-full rounded-sm" />
        <div className="bg-surface-container-high h-4 w-3/4 rounded-sm" />
        <div className="bg-surface-container-high h-4 w-1/2 rounded-sm" />
        <div className="bg-surface-container-high h-4 w-2/3 rounded-sm" />
      </div>
      {/* Bottom App Bar */}
      <div className="bg-surface-container absolute right-0 bottom-0 left-0 flex h-20 items-center justify-between px-4">
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-on-surface-variant">menu</span>
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <span className="material-symbols-outlined text-on-surface-variant">delete</span>
        </div>
        {/* FAB */}
        <div className="bg-primary-container shadow-2 absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-lg">
          <span className="material-symbols-outlined text-on-primary-container">add</span>
        </div>
      </div>
    </div>
  </HeroBackground>
);

// ─── EXAMPLES ────────────────────────────────────────────────────────────────
const BottomAppBarBasicExample = () => (
  <div className="bg-surface-container-low relative h-full min-h-[160px] w-full overflow-hidden rounded-sm">
    <div className="space-y-3 p-4">
      <div className="bg-outline-soft h-3 w-1/2 rounded-sm" />
      <div className="bg-surface-container-high h-3 w-full rounded-sm" />
      <div className="bg-surface-container-high h-3 w-5/6 rounded-sm" />
    </div>
    <BottomAppBar
      className="absolute inset-x-0 bottom-0"
      fab={
        <Fab
          icon={<span className="material-symbols-outlined">add</span>}
          aria-label="Add new item"
        />
      }
    >
      <BottomAppBarAction
        icon={<span className="material-symbols-outlined">menu</span>}
        label="Menu"
      />
      <BottomAppBarAction
        icon={<span className="material-symbols-outlined">search</span>}
        label="Search"
      />
      <BottomAppBarAction
        icon={<span className="material-symbols-outlined">archive</span>}
        label="Archive"
      />
    </BottomAppBar>
  </div>
);

export const bottomAppBarDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'bottom-app-bar',
  name: 'Bottom App Bar',
  description:
    'Bottom app bars display navigation and key actions at the bottom of mobile screens.',
  category: 'navigation',
  status: 'stable',
  icon: 'dock_to_bottom',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/bottom-app-bar',
  exports: ['BottomAppBar', 'BottomAppBarAction'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <BottomAppBarHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Choose between bottom app bar and navigation bar based on your needs.',
    columns: {
      emphasis: 'Component',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Bottom App Bar',
        component: (
          <div className="border-outline-variant relative h-20 w-44 overflow-hidden rounded-sm border">
            <BottomAppBar
              className="absolute inset-x-0 bottom-0"
              fab={
                <Fab
                  icon={<span className="material-symbols-outlined">add</span>}
                  aria-label="Add"
                />
              }
            >
              <BottomAppBarAction
                icon={<span className="material-symbols-outlined">menu</span>}
                label="Menu"
              />
              <BottomAppBarAction
                icon={<span className="material-symbols-outlined">search</span>}
                label="Search"
              />
            </BottomAppBar>
          </div>
        ),
        rationale: 'For contextual actions with a primary FAB.',
        examples: 'Email app, Document editor, Note taking',
      },
      {
        emphasis: 'Navigation Bar',
        component: (
          <div className="border-outline-variant relative h-20 w-44 overflow-hidden rounded-sm border">
            <NavigationBar
              aria-label="Primary navigation"
              className="absolute inset-x-0 bottom-0"
              items={[
                { id: 'home', icon: 'home', label: 'Home' },
                { id: 'search', icon: 'search', label: 'Search' },
              ]}
              defaultValue="home"
            />
          </div>
        ),
        rationale: 'For primary navigation between sections.',
        examples: 'Social apps, Shopping apps, Content apps',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Bottom app bar is fixed at the bottom of the viewport on mobile screens.',
    previewDefaults: {
      tone: 'surfaceContainerLow',
      minHeight: 'sm',
      padding: 'none',
      align: 'end',
      justify: 'start',
    },
    examples: [
      {
        title: 'With FAB',
        visual: <BottomAppBarBasicExample />,
        caption: 'Bottom bar with centered floating action button',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'BottomAppBarAction components.',
    },
    {
      name: 'fab',
      type: 'ReactNode',
      description: 'Floating action button to display.',
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
      name: 'BottomAppBarAction',
      description: 'Action button within the bottom app bar.',
      props: [
        { name: 'icon', type: 'ReactNode', required: true, description: 'Icon to display.' },
        {
          name: 'label',
          type: 'string',
          required: true,
          description: 'Accessible label for the action.',
        },
        { name: 'active', type: 'boolean', description: 'Whether the action is active.' },
        { name: 'disabled', type: 'boolean', description: 'Disables the action.' },
        { name: 'onClick', type: '() => void', description: 'Click handler.' },
      ],
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "Uses role='toolbar' for proper semantics.",
      'Each action has aria-label for context.',
      'Active state indicated via aria-pressed.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Navigate between actions' },
      { key: 'Enter/Space', description: 'Activate focused action' },
    ],
    focus: ['Focus ring visible on all actions.', 'FAB is reachable in tab order.'],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Place at the bottom of your mobile layout.',
    code: `import { BottomAppBar, BottomAppBarAction } from "@/components/ui/bottom-app-bar";
import { Fab } from "@/components/ui/fab";

function MobileLayout() {
  return (
    <div className="relative min-h-screen pb-20">
      {/* Page content */}

      <BottomAppBar
        fab={
          <Fab
            icon={<span className="material-symbols-outlined">add</span>}
            onClick={handleCreate}
            aria-label="Create new"
          />
        }
      >
        <BottomAppBarAction
          icon={<span className="material-symbols-outlined">menu</span>}
          label="Menu"
          onClick={openMenu}
        />
        <BottomAppBarAction
          icon={<span className="material-symbols-outlined">search</span>}
          label="Search"
          onClick={openSearch}
        />
      </BottomAppBar>
    </div>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'navigation-bar',
      reason: 'Use for primary app navigation.',
    },
    {
      slug: 'fab',
      reason: 'Primary action button for the bottom bar.',
    },
    {
      slug: 'top-app-bar',
      reason: 'Use for header navigation and actions.',
    },
  ],
};
