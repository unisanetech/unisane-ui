'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  Button,
  IconButton,
} from '@unisane/ui';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const DropdownMenuHeroVisual = () => (
  <HeroBackground tone="tertiary" align="start" justify="end">
    {/* Profile Menu Demo */}
    <div className="relative">
      <div className="relative">
        {/* Avatar trigger */}
        <div className="bg-primary text-on-primary text-title-medium ring-focus-ring flex h-10 w-10 cursor-pointer items-center justify-center rounded-full ring-2">
          JD
        </div>
        {/* Simulated profile menu */}
        <div className="bg-surface shadow-4 border-outline-variant absolute top-[calc(100%+4px)] right-0 min-w-56 rounded-sm border py-2">
          {/* Profile header */}
          <div className="border-outline-variant mb-1 flex items-center gap-3 border-b px-4 py-3">
            <div className="bg-secondary-container text-on-secondary-container text-title-medium flex h-10 w-10 items-center justify-center rounded-full">
              JD
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-body-medium text-on-surface truncate font-medium">John Doe</div>
              <div className="text-body-small text-on-surface-variant truncate">
                john@example.com
              </div>
            </div>
          </div>
          {/* Menu items */}
          <div className="text-body-medium text-on-surface hover:bg-state-hover mx-1 flex cursor-pointer items-center gap-3 rounded-md px-3 py-2">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              person
            </span>
            View profile
          </div>
          <div className="text-body-medium text-on-surface hover:bg-state-hover mx-1 flex cursor-pointer items-center gap-3 rounded-md px-3 py-2">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              settings
            </span>
            Settings
          </div>
          <div className="text-body-medium text-on-surface hover:bg-state-hover mx-1 flex cursor-pointer items-center gap-3 rounded-md px-3 py-2">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              help
            </span>
            Help & support
          </div>
          <div className="bg-outline-muted my-1 h-px" />
          <div className="text-body-medium text-on-surface hover:bg-state-hover mx-1 flex cursor-pointer items-center gap-3 rounded-md px-3 py-2">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              logout
            </span>
            Sign out
          </div>
        </div>
      </div>
    </div>
  </HeroBackground>
);

export const dropdownMenuDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'dropdown-menu',
  name: 'Dropdown Menu',
  description: 'Dropdown menus display a list of choices on a temporary surface.',
  category: 'containment',
  status: 'stable',
  icon: 'menu',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@unisane/ui',
  exports: [
    'DropdownMenu',
    'DropdownMenuTrigger',
    'DropdownMenuContent',
    'DropdownMenuItem',
    'DropdownMenuSeparator',
    'DropdownMenuCheckboxItem',
    'DropdownMenuRadioItem',
    'DropdownMenuSub',
    'DropdownMenuSubTrigger',
    'DropdownMenuSubContent',
  ],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <DropdownMenuHeroVisual />,
  examplesPreview: {
    overflow: 'visible',
    minHeight: 'lg',
  },

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Dropdown menus can contain various item types for different interactions.',
    columns: {
      emphasis: 'Item Type',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Action Item',
        component: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outlined" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        rationale: 'Standard menu items that perform actions.',
        examples: 'Edit, Delete, Share, Copy',
      },
      {
        emphasis: 'Checkbox Item',
        component: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outlined" size="sm">
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem checked>Show Grid</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Compact Mode</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        rationale: 'Toggle options on/off.',
        examples: 'Settings toggles, View options',
      },
      {
        emphasis: 'Separator',
        component: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outlined" size="sm">
                File
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        rationale: 'Group related items visually.',
        examples: 'Before destructive actions, Section breaks',
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description: 'Menus can be aligned to different edges of the trigger.',
    items: [
      {
        component: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outlined" size="sm">
                Start
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        title: 'Start Aligned',
        subtitle: 'Opens to the left',
      },
      {
        component: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outlined" size="sm">
                End
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        title: 'End Aligned',
        subtitle: 'Opens to the right',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Dropdown menus are commonly used for contextual actions and settings.',
    previewDefaults: {
      overflow: 'visible',
      minHeight: 'xl',
      align: 'start',
      justify: 'start',
    },
    examples: [
      {
        title: 'Actions menu',
        visual: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                variant="tonal"
                aria-label="More options"
                icon={<span className="material-symbols-outlined">more_vert</span>}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        caption: 'Menu with action items and separator',
      },
      {
        title: 'Button with menu',
        visual: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="filled"
                trailingIcon={
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                }
              >
                Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>New File</DropdownMenuItem>
              <DropdownMenuItem>New Folder</DropdownMenuItem>
              <DropdownMenuItem>Import</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        caption: 'Button that opens a dropdown menu',
      },
      {
        title: 'Custom styling with submenu',
        visual: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="tonal">File</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-sm px-2">
              <DropdownMenuItem
                className="rounded-md"
                icon={<span className="material-symbols-outlined text-[20px]">content_copy</span>}
              >
                Make a copy
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className="rounded-md"
                  icon={<span className="material-symbols-outlined text-[20px]">add</span>}
                >
                  Create
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="rounded-sm px-2">
                  <DropdownMenuItem
                    className="rounded-md"
                    icon={
                      <span className="material-symbols-outlined text-[20px]">description</span>
                    }
                  >
                    Document
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-md"
                    icon={<span className="material-symbols-outlined text-[20px]">image</span>}
                  >
                    Image
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-md"
                    icon={<span className="material-symbols-outlined text-[20px]">slideshow</span>}
                  >
                    Slides
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-md"
                selected
                icon={<span className="material-symbols-outlined text-[20px]">cloud_off</span>}
              >
                Offline mode
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-md"
                icon={<span className="material-symbols-outlined text-[20px]">share</span>}
              >
                Share
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-md"
                icon={<span className="material-symbols-outlined text-[20px]">download</span>}
              >
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        caption: "Hover on 'Create' to see the submenu with nested items",
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'DropdownMenuTrigger and DropdownMenuContent components.',
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'Controlled open state.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: '"false"',
      description: 'Initial open state when the menu is uncontrolled.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Callback when the root menu requests an open-state change.',
    },
  ],

  // ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────
  subComponents: [
    {
      name: 'DropdownMenuTrigger',
      description: 'The element that opens the menu.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          required: true,
          description: 'Trigger element (button, icon button, etc.).',
        },
        { name: 'asChild', type: 'boolean', description: 'Use child as trigger element.' },
      ],
    },
    {
      name: 'DropdownMenuContent',
      description: 'Container for menu items.',
      props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Menu items.' },
        {
          name: 'align',
          type: '"start" | "center" | "end"',
          default: '"start"',
          description: 'Alignment relative to trigger.',
        },
        {
          name: 'side',
          type: '"top" | "bottom" | "left" | "right"',
          default: '"bottom"',
          description: 'Preferred side for the menu.',
        },
        {
          name: 'portal',
          type: 'boolean',
          default: 'true',
          description:
            'Render the menu into document.body for safer layering. Set false only when local inline containment is required.',
        },
        {
          name: 'closeOnSelect',
          type: 'boolean',
          default: 'false',
          description: 'Close the menu after selecting a menu item.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Custom classes for padding, radius, etc.',
        },
      ],
    },
    {
      name: 'DropdownMenuItem',
      description: 'A clickable menu item.',
      props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Item content.' },
        { name: 'onClick', type: '() => void', description: 'Click handler.' },
        { name: 'disabled', type: 'boolean', description: 'Disable the item.' },
        { name: 'className', type: 'string', description: 'Custom classes for padding, styling.' },
      ],
    },
    {
      name: 'DropdownMenuSeparator',
      description: 'Visual divider between menu items.',
      props: [],
    },
    {
      name: 'DropdownMenuSub',
      description: 'Container for a submenu.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          required: true,
          description: 'SubTrigger and SubContent components.',
        },
        { name: 'open', type: 'boolean', description: 'Controlled open state for the submenu.' },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: '"false"',
          description: 'Initial open state when the submenu is uncontrolled.',
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          description: 'Callback when the submenu requests an open-state change.',
        },
      ],
    },
    {
      name: 'DropdownMenuSubTrigger',
      description: 'Menu item that opens a submenu on hover.',
      props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Trigger label.' },
        { name: 'icon', type: 'ReactNode', description: 'Leading icon.' },
        { name: 'disabled', type: 'boolean', description: 'Disable the trigger.' },
        { name: 'className', type: 'string', description: 'Custom classes for styling.' },
      ],
    },
    {
      name: 'DropdownMenuSubContent',
      description: 'Container for submenu items.',
      props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Submenu items.' },
        {
          name: 'className',
          type: 'string',
          description: 'Custom classes for padding, radius, etc.',
        },
      ],
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "Trigger has aria-expanded and aria-haspopup='menu'.",
      "Menu content has role='menu' with proper structure.",
      "Items have role='menuitem' for proper navigation.",
    ],
    keyboard: [
      { key: 'Enter / Space', description: 'Opens menu or activates item' },
      { key: 'Arrow Down', description: 'Opens menu or moves to next item' },
      { key: 'Arrow Up', description: 'Moves to previous item' },
      { key: 'Escape', description: 'Closes the menu' },
    ],
    focus: [
      'Focus moves to first item when menu opens.',
      'Focus returns to trigger when menu closes.',
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description:
      'Compose dropdown menus with trigger and content components. Use className for custom styling.',
    code: `import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  IconButton,
} from "@unisane/ui";

function ItemActions({ onEdit, onDuplicate, onDelete }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          icon={<span className="material-symbols-outlined">more_vert</span>}
          aria-label="Item options"
        />
      </DropdownMenuTrigger>
      {/* px-2 adds horizontal padding, rounded-sm for container */}
      <DropdownMenuContent align="end" className="rounded-sm px-2">
        <DropdownMenuItem className="rounded-md" onClick={onEdit}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-md" onClick={onDuplicate}>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-md" onClick={onDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'popover',
      reason: 'Use for rich content, not just menu items.',
    },
    {
      slug: 'select',
      reason: 'Use for form value selection.',
    },
    {
      slug: 'icon-button',
      reason: 'Common trigger for dropdown menus.',
    },
  ],
};
