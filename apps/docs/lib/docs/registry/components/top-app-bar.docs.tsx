'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { TopAppBar } from '@unisane/ui/top-app-bar';
import { IconButton } from '@unisane/ui/icon-button';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const TopAppBarHeroVisual = () => (
  <HeroBackground tone="surface">
    {/* Mock App with Top Bar */}
    <div className="bg-surface border-outline-variant relative h-60 w-80 overflow-hidden rounded-sm border shadow-xl">
      {/* Top App Bar */}
      <div className="border-outline-variant bg-surface flex h-16 items-center justify-between border-b px-4">
        <span className="material-symbols-outlined text-on-surface">menu</span>
        <span className="text-title-large text-primary">My App</span>
        <div className="flex gap-2">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
        </div>
      </div>
      {/* Content */}
      <div className="space-y-3 p-4">
        <div className="bg-surface-container-high h-4 w-full rounded-sm" />
        <div className="bg-surface-container-high h-4 w-3/4 rounded-sm" />
        <div className="bg-surface-container-high h-4 w-1/2 rounded-sm" />
      </div>
    </div>
  </HeroBackground>
);

// ─── EXAMPLES ────────────────────────────────────────────────────────────────
const TopAppBarSmallExample = () => (
  <div className="w-full max-w-sm">
    <TopAppBar
      variant="small"
      title="Page Title"
      navigationIcon={
        <IconButton
          variant="standard"
          icon={<span className="material-symbols-outlined">menu</span>}
          aria-label="Open menu"
        />
      }
      actions={
        <>
          <IconButton
            variant="standard"
            icon={<span className="material-symbols-outlined">search</span>}
            aria-label="Search"
          />
          <IconButton
            variant="standard"
            icon={<span className="material-symbols-outlined">more_vert</span>}
            aria-label="More options"
          />
        </>
      }
    />
  </div>
);

const TopAppBarCenterExample = () => (
  <div className="w-full max-w-sm">
    <TopAppBar
      variant="center"
      title="Centered Title"
      navigationIcon={
        <IconButton
          variant="standard"
          icon={<span className="material-symbols-outlined">arrow_back</span>}
          aria-label="Go back"
        />
      }
      actions={
        <IconButton
          variant="standard"
          icon={<span className="material-symbols-outlined">share</span>}
          aria-label="Share"
        />
      }
    />
  </div>
);

export const topAppBarDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'top-app-bar',
  name: 'Top App Bar',
  description: 'Top app bars display navigation, branding, and actions at the top of screens.',
  category: 'navigation',
  status: 'stable',
  icon: 'web_asset',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/top-app-bar',
  exports: ['TopAppBar'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <TopAppBarHeroVisual />,
  examplesPreview: {
    minHeight: 'sm',
    align: 'start',
    justify: 'start',
    padding: 'none',
  },

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Choose the app bar variant based on screen hierarchy and content.',
    columns: {
      emphasis: 'Variant',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Small',
        component: (
          <div className="border-outline-variant w-64 overflow-hidden rounded-sm border">
            <TopAppBar
              variant="small"
              title="Title"
              navigationIcon={
                <IconButton
                  variant="standard"
                  icon={<span className="material-symbols-outlined">menu</span>}
                  aria-label="Menu"
                />
              }
              actions={
                <IconButton
                  variant="standard"
                  icon={<span className="material-symbols-outlined">more_vert</span>}
                  aria-label="More"
                />
              }
            />
          </div>
        ),
        rationale: 'Default variant for most screens.',
        examples: 'Main screens, List views',
      },
      {
        emphasis: 'Center',
        component: (
          <div className="border-outline-variant w-64 overflow-hidden rounded-sm border">
            <TopAppBar
              variant="center"
              title="Title"
              navigationIcon={
                <IconButton
                  variant="standard"
                  icon={<span className="material-symbols-outlined">arrow_back</span>}
                  aria-label="Back"
                />
              }
              actions={
                <IconButton
                  variant="standard"
                  icon={<span className="material-symbols-outlined">share</span>}
                  aria-label="Share"
                />
              }
            />
          </div>
        ),
        rationale: 'For focused, single-purpose screens.',
        examples: 'Detail views, Modal screens',
      },
      {
        emphasis: 'Medium',
        component: (
          <div className="border-outline-variant w-64 overflow-hidden rounded-sm border">
            <TopAppBar
              variant="medium"
              title="Section Title"
              navigationIcon={
                <IconButton
                  variant="standard"
                  icon={<span className="material-symbols-outlined">menu</span>}
                  aria-label="Menu"
                />
              }
            />
          </div>
        ),
        rationale: 'More prominent title display.',
        examples: 'Section headers, Feature screens',
      },
      {
        emphasis: 'Large',
        component: (
          <div className="border-outline-variant w-64 overflow-hidden rounded-sm border">
            <TopAppBar
              variant="large"
              title="Large Title"
              navigationIcon={
                <IconButton
                  variant="standard"
                  icon={<span className="material-symbols-outlined">menu</span>}
                  aria-label="Menu"
                />
              }
            />
          </div>
        ),
        rationale: 'Maximum title prominence.',
        examples: 'Landing pages, Dashboard headers',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Top app bars are fixed at the top of the screen and may respond to scrolling.',
    examples: [
      {
        title: 'Small app bar',
        visual: <TopAppBarSmallExample />,
        caption: 'Standard top bar with navigation and actions',
      },
      {
        title: 'Centered title',
        visual: <TopAppBarCenterExample />,
        caption: 'Center-aligned title for focused screens',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'title',
      type: 'ReactNode',
      required: true,
      description: 'The title content to display.',
    },
    {
      name: 'variant',
      type: '"small" | "center" | "medium" | "large"',
      default: '"small"',
      description: 'Visual style and layout of the app bar.',
    },
    {
      name: 'navigationIcon',
      type: 'ReactNode',
      description: 'Navigation element (menu or back button).',
    },
    {
      name: 'actions',
      type: 'ReactNode',
      description: 'Action buttons displayed on the right.',
    },
    {
      name: 'scrolled',
      type: 'boolean',
      default: 'false',
      description: 'Applies scrolled style with elevation.',
    },
    {
      name: 'aria-label',
      type: 'string',
      description: 'Accessible label for the header when the title is not plain text.',
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'Uses semantic <header> element.',
      'Title is announced via aria-label.',
      'Navigation and action buttons have aria-labels.',
    ],
    keyboard: [{ key: 'Tab', description: 'Navigate between interactive elements' }],
    focus: [
      'Focus visible on all interactive elements.',
      'Logical tab order from navigation to actions.',
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Place at the top of your layout.',
    code: `import { TopAppBar } from "@/components/ui/top-app-bar";
import { IconButton } from "@/components/ui/icon-button";

function AppHeader() {
  return (
    <TopAppBar
      variant="small"
      title="Dashboard"
      navigationIcon={
        <IconButton
          icon={<span className="material-symbols-outlined">menu</span>}
          onClick={openDrawer}
          aria-label="Open menu"
        />
      }
      actions={
        <>
          <IconButton
            icon={<span className="material-symbols-outlined">search</span>}
            aria-label="Search"
          />
          <IconButton
            icon={<span className="material-symbols-outlined">account_circle</span>}
            aria-label="Account"
          />
        </>
      }
    />
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'bottom-app-bar',
      reason: 'Use for actions at bottom of screen.',
    },
    {
      slug: 'navigation-drawer',
      reason: 'Often triggered from top app bar.',
    },
    {
      slug: 'search-bar',
      reason: 'Use for search functionality in app bar.',
    },
  ],
};
