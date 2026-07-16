'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { IconButton } from '@unisane/ui/icon-button';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const IconButtonHeroVisual = () => (
  <HeroBackground tone="primary">
    {/* Mock App Bar */}
    <div className="bg-surface border-outline-variant w-80 overflow-hidden rounded-sm border shadow-xl">
      {/* Top App Bar */}
      <div className="bg-surface border-outline-variant flex h-16 items-center justify-between border-b px-4">
        <IconButton
          variant="standard"
          aria-label="Menu"
          icon={<span className="material-symbols-outlined">menu</span>}
        />
        <span className="text-title-medium text-on-surface">Photo Gallery</span>
        <div className="flex gap-1">
          <IconButton
            variant="standard"
            aria-label="Search"
            icon={<span className="material-symbols-outlined">search</span>}
          />
          <IconButton
            variant="standard"
            aria-label="More options"
            icon={<span className="material-symbols-outlined">more_vert</span>}
          />
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-surface-container-high group relative aspect-square rounded-sm"
            >
              <div className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100">
                <IconButton
                  variant="filled"
                  size="sm"
                  aria-label="Favorite"
                  icon={<span className="material-symbols-outlined text-[16px]">favorite</span>}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </HeroBackground>
);

export const iconButtonDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'icon-button',
  name: 'Icon Button',
  description:
    'Icon buttons display actions in a compact form, often used in toolbars and app bars.',
  category: 'actions',
  status: 'stable',
  icon: 'touch_app',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/icon-button',
  exports: ['IconButton'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <IconButtonHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      'Icon buttons come in four variants. Choose based on the level of emphasis needed for the action.',
    columns: {
      emphasis: 'Variant',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Filled',
        component: (
          <IconButton
            variant="filled"
            aria-label="Add"
            className="pointer-events-none"
            icon={<span className="material-symbols-outlined">add</span>}
          />
        ),
        rationale:
          'High emphasis for primary actions. Use sparingly as the main action in a group.',
        examples: 'Primary action, Featured toggle',
      },
      {
        emphasis: 'Tonal',
        component: (
          <IconButton
            variant="tonal"
            aria-label="Bookmark"
            className="pointer-events-none"
            icon={<span className="material-symbols-outlined">bookmark</span>}
          />
        ),
        rationale:
          'Medium emphasis with a softer appearance. Good for secondary actions that still need visibility.',
        examples: 'Bookmark, Share, Download',
      },
      {
        emphasis: 'Outlined',
        component: (
          <IconButton
            variant="outlined"
            aria-label="Edit"
            className="pointer-events-none"
            icon={<span className="material-symbols-outlined">edit</span>}
          />
        ),
        rationale:
          'Medium-low emphasis with a clear boundary. Works well in dense UIs where definition helps.',
        examples: 'Edit, Settings, Refresh',
      },
      {
        emphasis: 'Standard',
        component: (
          <IconButton
            variant="standard"
            aria-label="Close"
            className="pointer-events-none"
            icon={<span className="material-symbols-outlined">close</span>}
          />
        ),
        rationale:
          'Lowest emphasis for utility actions. The most common variant for toolbars and app bars.',
        examples: 'Close, Menu, Navigation',
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description:
      'Icon button sizes help establish visual hierarchy and adapt to different contexts.',
    items: [
      {
        component: (
          <IconButton
            variant="filled"
            size="lg"
            aria-label="Add"
            icon={<span className="material-symbols-outlined">add</span>}
          />
        ),
        title: 'Large',
        subtitle: '48px touch target',
      },
      {
        component: (
          <IconButton
            variant="filled"
            size="md"
            aria-label="Add"
            icon={<span className="material-symbols-outlined">add</span>}
          />
        ),
        title: 'Medium',
        subtitle: '40px touch target',
      },
      {
        component: (
          <IconButton
            variant="filled"
            size="sm"
            aria-label="Add"
            icon={<span className="material-symbols-outlined">add</span>}
          />
        ),
        title: 'Small',
        subtitle: '32px touch target',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Icon buttons are commonly placed in app bars, toolbars, and alongside content.',
    examples: [
      {
        title: 'App bar actions',
        visual: (
          <div className="bg-surface border-outline-variant mx-auto max-w-80 overflow-hidden rounded-sm border">
            <div className="flex h-14 items-center justify-between px-4">
              <IconButton
                variant="standard"
                aria-label="Back"
                icon={<span className="material-symbols-outlined">arrow_back</span>}
              />
              <span className="text-title-medium text-on-surface">Settings</span>
              <IconButton
                variant="standard"
                aria-label="Help"
                icon={<span className="material-symbols-outlined">help</span>}
              />
            </div>
          </div>
        ),
        caption: 'Standard icon buttons in app bar for navigation and help',
      },
      {
        title: 'Content actions',
        visual: (
          <div className="border-outline-variant bg-surface flex w-full max-w-xs items-start gap-3 rounded-sm border p-4">
            <div className="bg-primary-container h-12 w-12 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <div className="text-title-small text-on-surface">John Doe</div>
              <div className="text-body-small text-on-surface-variant truncate">
                Just shared a new photo with you
              </div>
            </div>
            <IconButton
              variant="standard"
              aria-label="More options"
              icon={<span className="material-symbols-outlined">more_vert</span>}
            />
          </div>
        ),
        caption: 'Standard icon button for overflow menu in list items',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: '"aria-label"',
      type: 'string',
      required: true,
      description: 'Accessible label for the button (required for icon-only buttons).',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: true,
      description: 'The single icon role displayed by a normal icon button.',
    },
    {
      name: 'variant',
      type: '"filled" | "tonal" | "outlined" | "standard"',
      default: '"standard"',
      description: 'The visual style of the icon button.',
    },
    {
      name: 'size',
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: 'The size of the icon button.',
    },
    {
      name: 'selected',
      type: 'boolean',
      description: 'When supplied, exposes aria-pressed and the corresponding toggle state.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'If true, the button is disabled and cannot be clicked.',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'If true, shows a loading spinner and disables the button.',
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Callback fired when the button is clicked.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the button.',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      description: 'When true, applies icon button styling to the provided child element.',
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'The aria-label prop is required and provides the accessible name for screen readers.',
      'Icons are treated as decorative; the aria-label describes the button action.',
      'Supplying selected exposes aria-pressed for toggle buttons; ordinary actions omit it.',
      'Native disabled buttons use disabled; disabled asChild elements use aria-disabled.',
      'Focus states are clearly visible with an outline ring.',
    ],
    keyboard: [
      { key: 'Enter / Space', description: 'Activates the button' },
      { key: 'Tab', description: 'Moves focus to the next focusable element' },
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Import the component and provide an aria-label for accessibility.',
    code: `import { IconButton } from "@/components/ui/icon-button";
import { Icon } from "@/components/ui/icon";

function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <IconButton
        variant="standard"
        aria-label="Go back"
        onClick={() => navigate(-1)}
        icon={<Icon symbol="arrow_back" />}
      />

      <IconButton
        variant="filled"
        aria-label="Add new item"
        onClick={() => setOpen(true)}
        icon={<Icon symbol="add" />}
      />

      <IconButton
        variant="tonal"
        aria-label="Toggle favorite"
        selected={isFavorite}
        onClick={() => setFavorite(!isFavorite)}
        icon={<Icon symbol={isFavorite ? "favorite" : "favorite_border"} />}
      />
    </div>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'button',
      reason: 'Use when you need a text label with the action.',
    },
    {
      slug: 'fab',
      reason: 'Use for the primary floating action on a screen.',
    },
    {
      slug: 'dropdown-menu',
      reason: 'Combine with icon button for menu triggers.',
    },
  ],
};
