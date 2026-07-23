'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Fab } from '@unisane/ui/fab';
import { FabMenu } from '@unisane/ui/fab-menu';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const FabMenuHeroVisual = () => (
  <HeroBackground tone="tertiary">
    {/* Mock FAB Menu */}
    <div className="bg-surface border-outline-variant relative h-60 w-72 overflow-hidden rounded-xl border shadow-xl">
      {/* Content */}
      <div className="space-y-3 p-4">
        <div className="bg-surface-container-high h-4 w-full rounded-sm" />
        <div className="bg-surface-container-high h-4 w-3/4 rounded-sm" />
        <div className="bg-surface-container-high h-4 w-1/2 rounded-sm" />
      </div>
      {/* FAB Menu */}
      <div className="absolute right-6 bottom-6 flex flex-col items-end gap-3">
        {/* Mini FABs */}
        <div className="flex items-center gap-2">
          <span className="bg-inverse-surface text-inverse-on-surface text-label-small rounded-sm px-2 py-1">
            Edit
          </span>
          <div className="bg-secondary-container flex h-10 w-10 items-center justify-center rounded-xl">
            <span className="material-symbols-outlined text-on-secondary-container text-[20px]">
              edit
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-inverse-surface text-inverse-on-surface text-label-small rounded-sm px-2 py-1">
            Share
          </span>
          <div className="bg-secondary-container flex h-10 w-10 items-center justify-center rounded-xl">
            <span className="material-symbols-outlined text-on-secondary-container text-[20px]">
              share
            </span>
          </div>
        </div>
        {/* Main FAB */}
        <div className="bg-tertiary-container shadow-2 flex h-14 w-14 items-center justify-center rounded-lg">
          <span className="material-symbols-outlined text-on-tertiary-container rotate-45">
            add
          </span>
        </div>
      </div>
    </div>
  </HeroBackground>
);

// ─── INTERACTIVE EXAMPLES ────────────────────────────────────────────────────
const FabMenuBasicExample = () => (
  <div className="relative flex h-52 items-end justify-end p-4">
    <FabMenu
      actions={[
        {
          label: 'Edit',
          icon: <span className="material-symbols-outlined">edit</span>,
          onClick: () => console.log('Edit clicked'),
        },
        {
          label: 'Share',
          icon: <span className="material-symbols-outlined">share</span>,
          onClick: () => console.log('Share clicked'),
        },
        {
          label: 'Delete',
          icon: <span className="material-symbols-outlined">delete</span>,
          onClick: () => console.log('Delete clicked'),
        },
      ]}
    />
  </div>
);

export const fabMenuDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'fab-menu',
  name: 'FAB Menu',
  description: 'FAB menu expands from a floating action button to reveal additional actions.',
  category: 'actions',
  status: 'stable',
  icon: 'add_circle',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/fab-menu',
  exports: ['FabMenu'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <FabMenuHeroVisual />,
  examplesPreview: {
    overflow: 'visible',
    minHeight: 'lg',
    align: 'end',
    justify: 'end',
    padding: 'lg',
  },

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Choose between FAB and FAB menu based on the number of actions.',
    columns: {
      emphasis: 'Component',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'FAB',
        component: (
          <Fab icon={<span className="material-symbols-outlined">add</span>} aria-label="Create" />
        ),
        rationale: 'Single primary action.',
        examples: 'Create new, Compose, Add item',
      },
      {
        emphasis: 'FAB Menu',
        component: (
          <div className="h-36 w-36">
            <FabMenu
              defaultOpen
              actions={[
                {
                  label: 'Edit',
                  icon: <span className="material-symbols-outlined">edit</span>,
                  onClick: () => {},
                },
                {
                  label: 'Share',
                  icon: <span className="material-symbols-outlined">share</span>,
                  onClick: () => {},
                },
              ]}
            />
          </div>
        ),
        rationale: 'Multiple related actions.',
        examples: 'Create options, Quick actions, Context menu',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'FAB menus are typically positioned at the bottom right of the screen.',
    examples: [
      {
        title: 'Expandable menu',
        visual: <FabMenuBasicExample />,
        caption: 'Click the FAB to reveal actions',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'actions',
      type: 'FabAction[]',
      required: true,
      description: 'Array of actions with label, icon, and onClick.',
    },
    {
      name: 'mainIcon',
      type: 'ReactNode',
      default: '<Icon symbol="add" />',
      description: 'Icon for the main FAB button.',
    },
    {
      name: 'activeIcon',
      type: 'ReactNode',
      default: '<Icon symbol="close" />',
      description: 'Icon shown when menu is open.',
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'Controlled open state for the menu.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'false',
      description: 'Initial open state for uncontrolled usage.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Callback fired when the menu opens or closes.',
    },
    {
      name: 'aria-label',
      type: 'string',
      default: '"Actions menu"',
      description: 'Accessible label for the menu.',
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
      'Main FAB has aria-haspopup and aria-expanded.',
      "Menu uses role='menu' with menuitem roles.",
      'Action labels are announced.',
    ],
    keyboard: [
      { key: 'Enter/Space', description: 'Toggle menu open/close' },
      { key: 'Escape', description: 'Close menu' },
      { key: 'Tab', description: 'Navigate between actions' },
    ],
    focus: ['Focus visible on FAB and action buttons.', 'Focus managed when menu opens/closes.'],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description:
      'Define actions array with icons and handlers, or control the open state when needed.',
    code: `import { FabMenu } from "@/components/ui/fab-menu";

function ContentActions() {
  return (
    <FabMenu
      actions={[
        {
          label: "New document",
          icon: <span className="material-symbols-outlined">description</span>,
          onClick: () => createDocument(),
        },
        {
          label: "Upload file",
          icon: <span className="material-symbols-outlined">upload</span>,
          onClick: () => openUpload(),
        },
        {
          label: "New folder",
          icon: <span className="material-symbols-outlined">create_new_folder</span>,
          onClick: () => createFolder(),
        },
      ]}
      aria-label="Create new item"
    />
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'fab',
      reason: 'Use for single action.',
    },
    {
      slug: 'dropdown-menu',
      reason: 'Use for button-triggered menus.',
    },
    {
      slug: 'bottom-app-bar',
      reason: 'Often contains FAB buttons.',
    },
  ],
};
