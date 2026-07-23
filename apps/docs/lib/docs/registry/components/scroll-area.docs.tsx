'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { ScrollArea } from '@unisane/ui/scroll-area';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const ScrollAreaHeroVisual = () => (
  <HeroBackground tone="tertiary">
    <ScrollArea
      role="region"
      aria-label="Recent items"
      className="bg-surface border-outline-variant h-52 w-72 rounded-sm border shadow-xl"
    >
      <div className="space-y-3 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="bg-surface-container-high size-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1">
              <div className="bg-surface-container-high h-3 w-2/3 rounded-sm" />
              <div className="bg-surface-container-high h-2 w-1/2 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  </HeroBackground>
);

// ─── EXAMPLES ────────────────────────────────────────────────────────────────
const ScrollAreaVerticalExample = () => (
  <ScrollArea className="border-outline-variant bg-surface h-full w-full rounded-sm border">
    <div className="space-y-4 p-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-surface-container flex items-center gap-3 rounded-sm p-3">
          <div className="bg-primary-container flex h-10 w-10 items-center justify-center rounded-full">
            <span className="text-label-medium text-on-primary-container">{i + 1}</span>
          </div>
          <div>
            <div className="text-body-medium text-on-surface">Item {i + 1}</div>
            <div className="text-body-small text-on-surface-variant">Description text</div>
          </div>
        </div>
      ))}
    </div>
  </ScrollArea>
);

const ScrollAreaHorizontalExample = () => (
  <ScrollArea orientation="horizontal" className="bg-surface w-full rounded-sm">
    <div className="flex gap-4 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-container border-outline-variant flex h-24 w-32 shrink-0 items-center justify-center rounded-sm border"
        >
          <span className="text-title-medium text-on-surface">Card {i + 1}</span>
        </div>
      ))}
    </div>
  </ScrollArea>
);

export const scrollAreaDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'scroll-area',
  name: 'Scroll Area',
  description: 'Scroll area provides one native overflow viewport with shared themed scrollbars.',
  category: 'containment',
  status: 'stable',
  icon: 'unfold_more',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/scroll-area',
  exports: ['ScrollArea'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <ScrollAreaHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Choose scroll orientation based on content layout.',
    columns: {
      emphasis: 'Orientation',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Vertical',
        component: (
          <ScrollArea className="border-outline-variant bg-surface h-20 w-40 rounded-sm border">
            <div className="space-y-2 p-2">
              <div className="bg-surface-container-high h-6 rounded-sm" />
              <div className="bg-surface-container-high h-6 rounded-sm" />
              <div className="bg-surface-container-high h-6 rounded-sm" />
            </div>
          </ScrollArea>
        ),
        rationale: 'Default for lists and long content.',
        examples: 'Lists, Chat messages, Feeds',
      },
      {
        emphasis: 'Horizontal',
        component: (
          <ScrollArea
            orientation="horizontal"
            className="border-outline-variant bg-surface h-20 w-40 rounded-sm border"
          >
            <div className="flex gap-2 p-2">
              <div className="bg-surface-container-high h-12 w-20 shrink-0 rounded-sm" />
              <div className="bg-surface-container-high h-12 w-20 shrink-0 rounded-sm" />
              <div className="bg-surface-container-high h-12 w-20 shrink-0 rounded-sm" />
            </div>
          </ScrollArea>
        ),
        rationale: 'For horizontally scrolling content.',
        examples: 'Carousels, Tabs overflow, Chip groups',
      },
      {
        emphasis: 'Both',
        component: (
          <ScrollArea
            orientation="both"
            className="border-outline-variant bg-surface h-20 w-40 rounded-sm border"
          >
            <div className="bg-surface-container-high h-28 w-56 rounded-sm p-2" />
          </ScrollArea>
        ),
        rationale: 'For 2D scrollable content.',
        examples: 'Code blocks, Large tables, Canvases',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Scroll areas contain content that exceeds the visible container.',
    previewDefaults: {
      tone: 'surfaceContainerLow',
      minHeight: 'lg',
      padding: 'none',
      align: 'start',
      justify: 'start',
    },
    examples: [
      {
        title: 'Vertical scroll',
        visual: <ScrollAreaVerticalExample />,
        caption: 'Scroll down to see more items',
      },
      {
        title: 'Horizontal scroll',
        visual: <ScrollAreaHorizontalExample />,
        caption: 'Scroll horizontally through cards',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Content to display in the scroll area.',
    },
    {
      name: 'orientation',
      type: '"vertical" | "horizontal" | "both"',
      default: '"vertical"',
      description: 'Scroll direction.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Classes applied to the native scrolling viewport.',
    },
    {
      name: 'tabIndex',
      type: 'number',
      default: '0',
      description: 'Sequential focus position; override with native div semantics when needed.',
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'The root is the native scrolling viewport, so role, accessible name, and scroll state describe the same element.',
      'Use role="region" with aria-label or aria-labelledby only when the content deserves a named landmark.',
    ],
    keyboard: [
      { key: 'Arrow Keys', description: 'Scroll content when focused' },
      { key: 'Page Up/Down', description: 'Scroll by page' },
      { key: 'Home/End', description: 'Scroll to start/end' },
    ],
    focus: [
      'The viewport has tabIndex=0 by default so keyboard users can reach native scrolling controls.',
      'Focusable descendants remain reachable in normal document order; override tabIndex only when another reliable focus path exists.',
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Wrap content that may overflow.',
    code: `import { ScrollArea } from "@/components/ui/scroll-area";

function ChatMessages({ messages }) {
  return (
    <ScrollArea role="region" aria-label="Chat messages" className="h-96">
      <div className="p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="p-3 bg-surface-container rounded-sm">
            <p className="font-medium">{message.sender}</p>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'list',
      reason: 'Often used within scroll areas.',
    },
    {
      slug: 'table',
      reason: 'Tables may need horizontal scrolling.',
    },
  ],
};
