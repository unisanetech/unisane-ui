'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Fab } from '@unisane/ui/fab';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const FabHeroVisual = () => (
  <HeroBackground tone="primary">
    {/* Mock Email App */}
    <div className="bg-surface border-outline-variant h-96 w-80 overflow-hidden rounded-xl border shadow-xl">
      {/* App Bar */}
      <div className="bg-surface border-outline-variant flex h-14 items-center border-b px-4">
        <span className="material-symbols-outlined text-on-surface-variant mr-3">menu</span>
        <span className="text-title-medium text-on-surface">Inbox</span>
      </div>
      {/* Email List */}
      <div className="space-y-1 p-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="hover:bg-surface-container-low flex items-center gap-3 rounded-xl p-3"
          >
            <div className="bg-primary-container h-10 w-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <div className="bg-outline-weak mb-2 h-3 w-24 rounded" />
              <div className="bg-state-hover h-2.5 w-full rounded" />
            </div>
          </div>
        ))}
      </div>
      {/* FAB */}
      <div className="absolute right-4 bottom-4">
        <Fab
          variant="primary"
          size="md"
          icon={<span className="material-symbols-outlined">edit</span>}
          label="Compose"
        />
      </div>
    </div>
  </HeroBackground>
);

export const fabDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'fab',
  name: 'FAB',
  description: 'Floating action buttons represent the primary action of a screen.',
  category: 'actions',
  status: 'stable',
  icon: 'add_circle',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/fab',
  exports: ['Fab'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <FabHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      'FABs come in four color variants. Choose based on the visual hierarchy and context.',
    columns: {
      emphasis: 'Variant',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Primary',
        component: (
          <Fab
            variant="primary"
            aria-label="Create item"
            icon={<span className="material-symbols-outlined">add</span>}
            className="pointer-events-none"
          />
        ),
        rationale: 'The default and most prominent variant. Use for the main action on a screen.',
        examples: 'Compose, Create, Add',
      },
      {
        emphasis: 'Surface',
        component: (
          <Fab
            variant="surface"
            aria-label="Edit item"
            icon={<span className="material-symbols-outlined">edit</span>}
            className="pointer-events-none"
          />
        ),
        rationale:
          "A subtle variant that blends with the surface. Good when the FAB shouldn't dominate.",
        examples: 'Edit, Modify, Adjust',
      },
      {
        emphasis: 'Secondary',
        component: (
          <Fab
            variant="secondary"
            aria-label="Share item"
            icon={<span className="material-symbols-outlined">share</span>}
            className="pointer-events-none"
          />
        ),
        rationale: 'Uses the secondary color. Provides an alternative emphasis level.',
        examples: 'Share, Export, Send',
      },
      {
        emphasis: 'Tertiary',
        component: (
          <Fab
            variant="tertiary"
            aria-label="Favorite item"
            icon={<span className="material-symbols-outlined">favorite</span>}
            className="pointer-events-none"
          />
        ),
        rationale: 'Uses the tertiary color. Good for complementary actions.',
        examples: 'Favorite, Like, Save',
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description: 'FAB sizes determine prominence and available space for content.',
    items: [
      {
        component: (
          <Fab
            variant="primary"
            size="lg"
            aria-label="Create item"
            icon={<span className="material-symbols-outlined text-[36px]">add</span>}
          />
        ),
        title: 'Large',
        subtitle: '96px, prominent',
      },
      {
        component: (
          <Fab
            variant="primary"
            size="md"
            aria-label="Create item"
            icon={<span className="material-symbols-outlined">add</span>}
          />
        ),
        title: 'Medium',
        subtitle: '56px, default',
      },
      {
        component: (
          <Fab
            variant="primary"
            size="sm"
            aria-label="Create item"
            icon={<span className="material-symbols-outlined">add</span>}
          />
        ),
        title: 'Small',
        subtitle: '40px, compact',
      },
      {
        component: (
          <Fab
            variant="primary"
            icon={<span className="material-symbols-outlined">add</span>}
            label="Create"
          />
        ),
        title: 'Extended',
        subtitle: 'With label',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      'FABs are typically positioned in the bottom-right corner, floating above content.',
    examples: [
      {
        title: 'Standard placement',
        visual: (
          <div className="bg-surface-container border-outline-variant relative mx-auto h-48 max-w-80 rounded-xl border">
            <div className="absolute right-4 bottom-4">
              <Fab
                variant="primary"
                aria-label="Add item"
                icon={<span className="material-symbols-outlined">add</span>}
              />
            </div>
            <div className="text-body-small text-on-surface-variant p-4">Main content area</div>
          </div>
        ),
        caption: 'Bottom-right corner with 16px margin from edges',
      },
      {
        title: 'Extended FAB',
        visual: (
          <div className="bg-surface-container border-outline-variant relative mx-auto h-48 max-w-80 rounded-xl border">
            <div className="absolute right-4 bottom-4">
              <Fab
                variant="primary"
                icon={<span className="material-symbols-outlined">edit</span>}
                label="Compose"
              />
            </div>
            <div className="text-body-small text-on-surface-variant p-4">
              Content with extended FAB
            </div>
          </div>
        ),
        caption: 'Extended FAB with icon and label for clarity',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'The icon element to display in the FAB.',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Optional text label for extended FAB variant.',
    },
    {
      name: '"aria-label"',
      type: 'string',
      description: 'Accessible label for icon-only FAB usage.',
    },
    {
      name: 'variant',
      type: '"primary" | "surface" | "secondary" | "tertiary"',
      default: '"primary"',
      description: 'The color variant of the FAB.',
    },
    {
      name: 'size',
      type: '"sm" | "md" | "lg" | "extended"',
      default: '"md"',
      description: 'The size of the FAB. Automatically becomes extended when label is provided.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'If true, the FAB is disabled and cannot be clicked.',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'If true, shows a loading spinner and disables the FAB.',
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Callback fired when the FAB is clicked.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the FAB.',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      description: 'When true, applies FAB styling to the provided child element.',
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'FABs should have a clear aria-label when using icon-only variants.',
      'The label prop provides accessible text for extended FABs.',
      'FABs maintain a minimum touch target of 48x48 pixels.',
      'Focus states are clearly visible with elevation changes.',
    ],
    keyboard: [
      { key: 'Enter / Space', description: 'Activates the FAB' },
      { key: 'Tab', description: 'Moves focus to the FAB' },
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Import the component and position it in your layout.',
    code: `import { Fab } from "@/components/ui/fab";

function EmailApp() {
  return (
    <div className="relative min-h-screen">
      {/* Main content */}
      <main className="pb-20">
        {/* Email list... */}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 z-fab">
        <Fab
          variant="primary"
          icon={<span className="material-symbols-outlined">edit</span>}
          label="Compose"
          onClick={() => openComposer()}
        />
      </div>
    </div>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'fab-menu',
      reason: 'Use when you need multiple related actions from a FAB.',
    },
    {
      slug: 'button',
      reason: 'Use for inline actions within content.',
    },
    {
      slug: 'icon-button',
      reason: 'Use for compact actions in toolbars.',
    },
  ],
};
