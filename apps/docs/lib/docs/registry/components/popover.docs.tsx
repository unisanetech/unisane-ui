'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Popover } from '@unisane/ui/popover';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const PopoverHeroVisual = () => (
  <HeroBackground tone="tertiary">
    {/* Mock Popover Demo */}
    <div className="relative">
      <div className="relative">
        <span className="bg-primary text-on-primary text-label-large inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-6 font-medium">
          More Info
        </span>
        {/* Simulated popover */}
        <div className="bg-surface shadow-4 border-outline-variant absolute top-[calc(100%+8px)] left-1/2 min-w-52 -translate-x-1/2 rounded-sm border p-4">
          <div className="text-title-small text-on-surface mb-2">Account Details</div>
          <div className="text-body-small text-on-surface-variant mb-3">
            View and manage your account settings here.
          </div>
          <div className="flex gap-2">
            <span className="text-label-medium text-primary cursor-pointer hover:underline">
              Learn More
            </span>
          </div>
        </div>
      </div>
    </div>
  </HeroBackground>
);

export const popoverDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'popover',
  name: 'Popover',
  description: 'Popovers display rich content in a portal that appears above other content.',
  category: 'containment',
  status: 'stable',
  icon: 'info',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/popover',
  exports: ['Popover'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <PopoverHeroVisual />,
  examplesPreview: {
    overflow: 'visible',
    minHeight: 'lg',
  },

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Popovers can be positioned on different sides and aligned in different ways.',
    columns: {
      emphasis: 'Position',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Bottom',
        component: (
          <Popover
            trigger={
              <span className="border-outline text-label-large text-on-surface hover:bg-state-hover inline-flex h-9 items-center justify-center rounded-full border px-4">
                Bottom
              </span>
            }
            content={<div className="text-body-small">Popover content</div>}
            side="bottom"
          />
        ),
        rationale: 'Default position, content appears below trigger.',
        examples: 'Dropdowns, Tooltips, Menus',
      },
      {
        emphasis: 'Top',
        component: (
          <Popover
            trigger={
              <span className="border-outline text-label-large text-on-surface hover:bg-state-hover inline-flex h-9 items-center justify-center rounded-full border px-4">
                Top
              </span>
            }
            content={<div className="text-body-small">Popover content</div>}
            side="top"
          />
        ),
        rationale: "When there's more space above the trigger.",
        examples: 'Bottom toolbars, Footer elements',
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description: 'Popovers can be aligned to different edges of the trigger.',
    items: [
      {
        component: (
          <Popover
            trigger={
              <span className="bg-secondary-container text-on-secondary-container text-label-large hover:bg-secondary-container inline-flex h-9 items-center justify-center rounded-full px-4">
                Start
              </span>
            }
            content={<div className="text-body-small w-24">Left aligned</div>}
            align="start"
          />
        ),
        title: 'Start Aligned',
        subtitle: 'Left edge alignment',
      },
      {
        component: (
          <Popover
            trigger={
              <span className="bg-secondary-container text-on-secondary-container text-label-large hover:bg-secondary-container inline-flex h-9 items-center justify-center rounded-full px-4">
                Center
              </span>
            }
            content={<div className="text-body-small w-24">Centered</div>}
            align="center"
          />
        ),
        title: 'Center Aligned',
        subtitle: 'Default alignment',
      },
      {
        component: (
          <Popover
            trigger={
              <span className="bg-secondary-container text-on-secondary-container text-label-large hover:bg-secondary-container inline-flex h-9 items-center justify-center rounded-full px-4">
                End
              </span>
            }
            content={<div className="text-body-small w-24">Right aligned</div>}
            align="end"
          />
        ),
        title: 'End Aligned',
        subtitle: 'Right edge alignment',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      'Popovers are commonly used for additional information, forms, or interactive content.',
    previewDefaults: {
      overflow: 'visible',
      minHeight: 'xl',
      align: 'start',
      justify: 'start',
    },
    examples: [
      {
        title: 'Info popover',
        visual: (
          <Popover
            trigger={
              <span className="bg-secondary-container text-on-secondary-container text-label-large hover:bg-secondary-container inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-6 font-medium">
                View Details
              </span>
            }
            content={
              <div className="w-44">
                <div className="text-title-small text-on-surface mb-2">Item Details</div>
                <div className="text-body-small text-on-surface-variant">
                  Additional information about this item appears here.
                </div>
              </div>
            }
          />
        ),
        caption: 'Popover showing additional details',
      },
      {
        title: 'Action popover',
        visual: (
          <Popover
            trigger={
              <span className="bg-primary text-on-primary text-label-large hover:bg-primary inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-6 font-medium">
                Share
              </span>
            }
            content={
              <div className="w-40">
                <div className="text-label-medium text-on-surface mb-3">Share via</div>
                <div className="space-y-2">
                  <div className="text-body-small text-on-surface-variant hover:text-on-surface cursor-pointer">
                    Email
                  </div>
                  <div className="text-body-small text-on-surface-variant hover:text-on-surface cursor-pointer">
                    Copy Link
                  </div>
                  <div className="text-body-small text-on-surface-variant hover:text-on-surface cursor-pointer">
                    Twitter
                  </div>
                </div>
              </div>
            }
          />
        ),
        caption: 'Popover with action options',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'trigger',
      type: 'ReactNode',
      required: true,
      description: 'The element that triggers the popover.',
    },
    {
      name: 'content',
      type: 'ReactNode',
      required: true,
      description: 'The content displayed inside the popover.',
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
      description: 'Initial open state when the popover is uncontrolled.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Callback when open state changes.',
    },
    {
      name: 'side',
      type: '"top" | "bottom" | "left" | "right"',
      default: '"bottom"',
      description: 'Which side of the trigger to display the popover.',
    },
    {
      name: 'align',
      type: '"start" | "center" | "end"',
      default: '"center"',
      description: 'How to align the popover with the trigger.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes for the popover content.',
    },
    {
      name: 'portal',
      type: 'boolean',
      default: '"true"',
      description:
        'Render the popover into document.body for safer layering. Set false only when local inline containment is required.',
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'Trigger has aria-expanded and aria-haspopup attributes.',
      "Popover content has role='dialog' for screen readers.",
      'aria-controls links trigger to popover content.',
    ],
    keyboard: [
      { key: 'Enter / Space', description: 'Opens the popover' },
      { key: 'Escape', description: 'Closes the popover' },
      { key: 'Tab', description: 'Moves focus within popover content' },
    ],
    focus: [
      'Focus returns to trigger when popover closes.',
      'Clicking outside the popover closes it.',
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description:
      'Use Popover for rich interactive content. The trigger is wrapped in a button, so use spans or divs for trigger content.',
    code: `import { Popover } from "@/components/ui/popover";
import { useState } from "react";

function SharePopover() {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={
        <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary text-on-primary font-medium">
          Share
        </span>
      }
      content={
        <div className="w-48">
          <div className="text-lg font-medium mb-2">Share via</div>
          <div className="space-y-2">
            <div
              className="w-full text-left p-2 hover:bg-surface-container-highest rounded cursor-pointer"
              onClick={() => {
                copyLink();
                setOpen(false);
              }}
            >
              Copy Link
            </div>
            <div
              className="w-full text-left p-2 hover:bg-surface-container-highest rounded cursor-pointer"
              onClick={() => shareEmail()}
            >
              Email
            </div>
          </div>
        </div>
      }
      side="bottom"
      align="end"
    />
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'tooltip',
      reason: 'Use for simple text hints without interaction.',
    },
    {
      slug: 'dropdown-menu',
      reason: 'Use for action menus with structured items.',
    },
    {
      slug: 'dialog',
      reason: 'Use for modal content requiring focus.',
    },
  ],
};
