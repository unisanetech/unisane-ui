'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Typography } from '@unisane/ui/typography';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const TypographyHeroVisual = () => (
  <HeroBackground tone="surface">
    {/* Mock Typography Scale */}
    <div className="bg-surface border-outline-variant relative w-80 overflow-hidden rounded-sm border p-6 shadow-xl">
      <div className="space-y-4">
        <div className="text-display-small text-on-surface">Display</div>
        <div className="text-headline-medium text-on-surface">Headline</div>
        <div className="text-title-large text-on-surface">Title Large</div>
        <div className="text-title-medium text-on-surface">Title Medium</div>
        <div className="text-body-large text-on-surface-variant">
          Body text for paragraphs and longer content.
        </div>
        <div className="text-label-medium text-on-surface-variant">LABEL TEXT</div>
      </div>
    </div>
  </HeroBackground>
);

// ─── EXAMPLES ────────────────────────────────────────────────────────────────
const TypographyScaleExample = () => (
  <div className="w-full max-w-sm space-y-4">
    <Typography variant="displaySmall">Display Small</Typography>
    <Typography variant="headlineMedium">Headline Medium</Typography>
    <Typography variant="titleLarge">Title Large</Typography>
    <Typography variant="bodyLarge">Body Large - for longer paragraphs.</Typography>
    <Typography variant="labelMedium">Label Medium</Typography>
  </div>
);

export const typographyDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'typography',
  name: 'Typography',
  description: 'Typography component provides semantic text styles with a complete type scale.',
  category: 'foundations',
  status: 'stable',
  icon: 'text_fields',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/typography',
  exports: ['Typography'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <TypographyHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Choose typography variant based on content hierarchy and purpose.',
    columns: {
      emphasis: 'Category',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Display',
        component: <Typography variant="displaySmall">Display</Typography>,
        rationale: 'Largest text for hero sections and landing pages.',
        examples: 'Hero headlines, Marketing pages',
      },
      {
        emphasis: 'Headline',
        component: <Typography variant="headlineSmall">Headline</Typography>,
        rationale: 'Section headers and important content.',
        examples: 'Page titles, Section headers',
      },
      {
        emphasis: 'Title',
        component: <Typography variant="titleMedium">Title Medium</Typography>,
        rationale: 'Subsections and card headers.',
        examples: 'Card titles, Dialog headers, List headers',
      },
      {
        emphasis: 'Body',
        component: <Typography variant="bodyMedium">Body text for content</Typography>,
        rationale: 'Primary content and paragraphs.',
        examples: 'Paragraphs, Descriptions, Content',
      },
      {
        emphasis: 'Label',
        component: <Typography variant="labelMedium">LABEL</Typography>,
        rationale: 'UI labels and metadata.',
        examples: 'Buttons, Form labels, Chips',
      },
      {
        emphasis: 'Semantic role',
        component: <Typography variant="pageTitle">Page title</Typography>,
        rationale: 'Stable application hierarchy that can adapt through the token system.',
        examples: 'Hero, page, section, panel, and card titles',
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description: 'Typography scale provides consistent hierarchy across your app.',
    items: [
      {
        component: <Typography variant="displaySmall">Display</Typography>,
        title: 'Display',
        subtitle: '57-45-36px',
      },
      {
        component: <Typography variant="headlineSmall">Headline</Typography>,
        title: 'Headline',
        subtitle: '32-28-24px',
      },
      {
        component: <Typography variant="titleMedium">Title</Typography>,
        title: 'Title',
        subtitle: '22-16-14px',
      },
      {
        component: <Typography variant="bodyMedium">Body</Typography>,
        title: 'Body',
        subtitle: '16-14-12px',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Use consistent typography throughout your application.',
    examples: [
      {
        title: 'Type scale',
        visual: <TypographyScaleExample />,
        caption: 'Common typography variants',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'variant',
      type: 'TypographyVariant',
      default: '"bodyLarge"',
      description:
        'One selector for scale values and semantic roles such as pageTitle or sectionLead.',
    },
    {
      name: 'component',
      type: 'ElementType',
      description: 'HTML element to render (p, h1, span, etc.).',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Text content to display.',
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
      'Semantic HTML elements provide proper document structure.',
      'Heading hierarchy should be maintained (h1 > h2 > h3).',
    ],
    keyboard: [],
    focus: [],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Use variant prop to apply type styles.',
    code: `import { Typography } from "@/components/ui/typography";

function ArticlePage() {
  return (
    <article>
      <Typography variant="pageTitle">
        Article Title
      </Typography>

      <Typography variant="sectionTitle">
        Section Header
      </Typography>

      <Typography variant="bodyLarge" component="p">
        This is the main content of the article. Body large is
        used for comfortable reading of longer text passages.
      </Typography>

      <Typography variant="labelMedium" component="span">
        Published: Dec 2024
      </Typography>
    </article>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'button',
      reason: 'Buttons use label typography internally.',
    },
    {
      slug: 'card',
      reason: 'Cards often contain multiple typography levels.',
    },
  ],
};
