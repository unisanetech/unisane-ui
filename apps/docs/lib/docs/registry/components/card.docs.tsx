'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Card } from '@unisane/ui/card';
import { Button } from '@unisane/ui/button';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const CardHeroVisual = () => (
  <HeroBackground tone="tertiary">
    {/* Hero Card Example */}
    <div className="transform transition-transform duration-500 ease-out hover:scale-[1.02]">
      <Card variant="elevated" padding="none" className="w-80 overflow-hidden shadow-xl">
        <div className="bg-surface-container-high relative h-44">
          <img
            src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Abstract art"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-headline-small text-on-surface mb-2">Glassmorphism</h3>
          <p className="text-body-medium text-on-surface-variant mb-5 leading-relaxed">
            A visual style that uses transparency and background blur to create a glass-like effect.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outlined" size="sm">
              Explore
            </Button>
            <Button variant="filled" size="sm">
              Learn
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </HeroBackground>
);

export const cardDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'card',
  name: 'Cards',
  description:
    'Cards contain content and actions about a single subject. They are flexible containers that can hold images, text, and buttons.',
  category: 'containment',
  status: 'stable',
  icon: 'dashboard',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/card',
  exports: ['Card'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <CardHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      'Three types of cards are available: elevated, filled, and outlined. Choose the type that best fits the hierarchy of your content.',
    columns: {
      emphasis: 'Card type',
      rationale: 'Usage',
      examples: 'Rationale',
    },
    rows: [
      {
        emphasis: 'Elevated',
        component: <Card variant="elevated" className="pointer-events-none h-16 w-24" />,
        rationale: 'Create hierarchy between content and the background.',
        examples:
          'Elevated cards have a drop shadow, providing more separation from the background than filled cards, but less than outlined cards.',
      },
      {
        emphasis: 'Filled',
        component: <Card variant="filled" className="pointer-events-none h-16 w-24" />,
        rationale: 'Provide a subtle visual separation.',
        examples:
          'Filled cards have a fill color but no shadow or outline. They are good for separating content without drawing too much attention.',
      },
      {
        emphasis: 'Outlined',
        component: <Card variant="outlined" className="pointer-events-none h-16 w-24" />,
        rationale: 'Group content with a visual border.',
        examples:
          'Outlined cards have a stroke and no fill or shadow. They are the most subtle card type and work well on white backgrounds.',
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description: 'Use different card types to create visual hierarchy and separation.',
    items: [
      {
        component: (
          <Card variant="elevated" className="flex min-h-36 w-full max-w-52 flex-col p-4">
            <div className="bg-outline-subtle mb-3 h-3 w-10 rounded" />
            <div className="bg-outline-subtle mb-2 h-3 w-3/4 rounded" />
            <div className="bg-outline-subtle h-3 w-1/2 rounded" />
          </Card>
        ),
        title: 'Elevated',
        subtitle: 'Lower elevation. Good for list items or dashboard widgets.',
      },
      {
        component: (
          <Card variant="filled" className="flex min-h-36 w-full max-w-52 flex-col p-4">
            <div className="bg-outline-weak mb-3 h-3 w-10 rounded" />
            <div className="bg-outline-weak mb-2 h-3 w-3/4 rounded" />
            <div className="bg-outline-weak h-3 w-1/2 rounded" />
          </Card>
        ),
        title: 'Filled',
        subtitle: 'Subtle background color. Provides good separation from white backgrounds.',
      },
      {
        component: (
          <Card variant="outlined" className="flex min-h-36 w-full max-w-52 flex-col p-4">
            <div className="bg-outline-subtle mb-3 h-3 w-10 rounded" />
            <div className="bg-outline-subtle mb-2 h-3 w-3/4 rounded" />
            <div className="bg-outline-subtle h-3 w-1/2 rounded" />
          </Card>
        ),
        title: 'Outlined',
        subtitle: 'Has a border stroke. Good for high information density.',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'variant',
      type: '"elevated" | "filled" | "outlined" | "low" | "high"',
      default: '"filled"',
      description: 'The visual style of the card.',
    },
    {
      name: 'padding',
      type: '"none" | "sm" | "md" | "lg"',
      default: '"none"',
      description: 'The internal padding of the card.',
    },
    {
      name: 'interactive',
      type: 'boolean',
      default: 'false',
      description:
        'Adds interactive affordances like hover and ripple treatment. With onClick, the card renders as a semantic button.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'The content to display inside the card.',
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Click handler for interactive cards.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the card container.',
    },
  ],

  // ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────
  subComponents: [
    {
      name: 'Card.Header',
      description: 'Header section for title, subtitle, and action button.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          required: true,
          description: 'Header content.',
        },
        {
          name: 'className',
          type: 'string',
          default: "''",
          description: 'Additional styles.',
        },
      ],
    },
    {
      name: 'Card.Title',
      description: 'Title text styled with titleMedium typography.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          required: true,
          description: 'Title text.',
        },
        {
          name: 'className',
          type: 'string',
          default: "''",
          description: 'Additional styles.',
        },
      ],
    },
    {
      name: 'Card.Content',
      description: 'Main content area of the card.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          required: true,
          description: 'Content to display.',
        },
        {
          name: 'className',
          type: 'string',
          default: "''",
          description: 'Additional styles.',
        },
      ],
    },
    {
      name: 'Card.Media',
      description: 'Image or media content.',
      props: [
        {
          name: 'src',
          type: 'string',
          required: true,
          description: 'Image source URL.',
        },
        {
          name: 'alt',
          type: 'string',
          required: true,
          description: 'Alt text for accessibility.',
        },
        {
          name: 'className',
          type: 'string',
          default: "''",
          description: 'Additional styles.',
        },
      ],
    },
    {
      name: 'Card.Footer',
      description: 'Footer section for actions and supplementary info.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          required: true,
          description: 'Footer content, typically buttons.',
        },
        {
          name: 'className',
          type: 'string',
          default: "''",
          description: 'Additional styles.',
        },
      ],
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'Cards are generic containers. If a card is interactive (clickable), ensure it follows the following guidelines:',
      'If the entire card is clickable, prefer a semantic button or link root.',
      'Avoid "card within a card" accessibility issues where multiple actions exist in a clickable card. It is better to place actions in the card footer.',
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Cards are versatile containers.',
    code: `import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ArticleCard() {
  return (
    <Card variant="elevated" padding="none" className="max-w-sm overflow-hidden">
      <Card.Media src="/image.jpg" alt="Description" />
      <div className="p-6">
        <Card.Title>Title</Card.Title>
        <Card.Content>
          <p className="text-body-medium text-on-surface-variant">
            Description text...
          </p>
        </Card.Content>
        <Card.Footer>
          <Button variant="text">Read more</Button>
        </Card.Footer>
      </div>
    </Card>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'list',
      reason: 'Use for simpler, repeated items without rich content.',
    },
    {
      slug: 'dialog',
      reason: 'Use for modal content that requires user attention.',
    },
    {
      slug: 'accordion',
      reason: 'Use when content should be expandable/collapsible.',
    },
  ],
};
