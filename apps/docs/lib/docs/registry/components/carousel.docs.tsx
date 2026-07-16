'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Carousel, CarouselSlide, IconButton } from '@unisane/ui';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const CarouselHeroVisual = () => (
  <HeroBackground tone="tertiary">
    {/* Mock Carousel */}
    <div className="bg-surface border-outline-variant relative w-80 overflow-hidden rounded-sm border shadow-xl">
      <div className="bg-surface-container-high relative h-44">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[48px]">
            image
          </span>
        </div>
        {/* Navigation Arrows */}
        <IconButton
          variant="filled"
          size="md"
          aria-label="Previous slide"
          className="bg-surface-container-low absolute top-1/2 left-3 -translate-y-1/2"
          icon={<span className="material-symbols-outlined text-on-surface">chevron_left</span>}
        />
        <IconButton
          variant="filled"
          size="md"
          aria-label="Next slide"
          className="bg-surface-container-low absolute top-1/2 right-3 -translate-y-1/2"
          icon={<span className="material-symbols-outlined text-on-surface">chevron_right</span>}
        />
        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          <div className="bg-primary h-2 w-2 rounded-full" />
          <div className="bg-outline-medium h-2 w-2 rounded-full" />
          <div className="bg-outline-medium h-2 w-2 rounded-full" />
        </div>
      </div>
    </div>
  </HeroBackground>
);

// ─── INTERACTIVE EXAMPLES ────────────────────────────────────────────────────
const CarouselBasicExample = () => (
  <div className="h-52 w-full max-w-xs">
    <Carousel showControls showIndicators>
      <CarouselSlide>
        <div className="bg-primary-container flex h-full w-full items-center justify-center rounded-sm">
          <span className="text-title-large text-on-primary-container">Slide 1</span>
        </div>
      </CarouselSlide>
      <CarouselSlide>
        <div className="bg-secondary-container flex h-full w-full items-center justify-center rounded-sm">
          <span className="text-title-large text-on-secondary-container">Slide 2</span>
        </div>
      </CarouselSlide>
      <CarouselSlide>
        <div className="bg-tertiary-container flex h-full w-full items-center justify-center rounded-sm">
          <span className="text-title-large text-on-tertiary-container">Slide 3</span>
        </div>
      </CarouselSlide>
    </Carousel>
  </div>
);

const CarouselAutoPlayExample = () => (
  <div className="h-52 w-full max-w-xs">
    <Carousel autoPlay interval={3000} showIndicators>
      <CarouselSlide>
        <div className="bg-tertiary-container flex h-full w-full items-center justify-center rounded-sm">
          <span className="text-title-large text-on-tertiary-container">Auto 1</span>
        </div>
      </CarouselSlide>
      <CarouselSlide>
        <div className="bg-primary-container flex h-full w-full items-center justify-center rounded-sm">
          <span className="text-title-large text-on-primary-container">Auto 2</span>
        </div>
      </CarouselSlide>
      <CarouselSlide>
        <div className="bg-secondary-container flex h-full w-full items-center justify-center rounded-sm">
          <span className="text-title-large text-on-secondary-container">Auto 3</span>
        </div>
      </CarouselSlide>
    </Carousel>
  </div>
);

const CarouselMinimalExample = () => (
  <div className="h-52 w-full max-w-xs">
    <Carousel showControls={false} showIndicators={false}>
      <CarouselSlide>
        <div className="bg-surface-container border-outline-variant flex h-full w-full items-center justify-center rounded-sm border">
          <span className="text-title-large text-on-surface">Minimal</span>
        </div>
      </CarouselSlide>
      <CarouselSlide>
        <div className="bg-surface-container border-outline-variant flex h-full w-full items-center justify-center rounded-sm border">
          <span className="text-title-large text-on-surface">Swipe</span>
        </div>
      </CarouselSlide>
    </Carousel>
  </div>
);

export const carouselDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'carousel',
  name: 'Carousel',
  description:
    'Carousels display a collection of items that can be navigated through horizontally.',
  category: 'containment',
  status: 'stable',
  icon: 'view_carousel',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@unisane/ui',
  exports: ['Carousel', 'CarouselSlide'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <CarouselHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Choose carousel configuration based on content and interaction needs.',
    columns: {
      emphasis: 'Feature',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'With Controls',
        component: (
          <div className="h-24 w-44">
            <Carousel showControls showIndicators={false}>
              <CarouselSlide>
                <div className="bg-primary-container h-full w-full rounded-sm" />
              </CarouselSlide>
              <CarouselSlide>
                <div className="bg-secondary-container h-full w-full rounded-sm" />
              </CarouselSlide>
            </Carousel>
          </div>
        ),
        rationale: 'When manual navigation is needed.',
        examples: 'Image galleries, Product showcases',
      },
      {
        emphasis: 'Auto-play',
        component: (
          <div className="h-24 w-44">
            <Carousel autoPlay interval={3000} showControls={false} showIndicators>
              <CarouselSlide>
                <div className="bg-secondary-container h-full w-full rounded-sm" />
              </CarouselSlide>
              <CarouselSlide>
                <div className="bg-tertiary-container h-full w-full rounded-sm" />
              </CarouselSlide>
            </Carousel>
          </div>
        ),
        rationale: 'For passive viewing experiences.',
        examples: 'Hero banners, Testimonials, Promotions',
      },
      {
        emphasis: 'Minimal',
        component: (
          <div className="h-24 w-44">
            <Carousel showControls={false} showIndicators={false}>
              <CarouselSlide>
                <div className="bg-surface-container border-outline-variant h-full w-full rounded-sm border" />
              </CarouselSlide>
              <CarouselSlide>
                <div className="bg-surface-container border-outline-variant h-full w-full rounded-sm border" />
              </CarouselSlide>
            </Carousel>
          </div>
        ),
        rationale: 'For clean, swipe-only interfaces.',
        examples: 'Onboarding, Mobile galleries',
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description: 'Carousel configurations vary by level of interactivity and visual prominence.',
    items: [
      {
        component: (
          <div className="h-24 w-44">
            <Carousel showControls showIndicators>
              <CarouselSlide>
                <div className="bg-primary-container h-full w-full rounded-sm" />
              </CarouselSlide>
              <CarouselSlide>
                <div className="bg-secondary-container h-full w-full rounded-sm" />
              </CarouselSlide>
              <CarouselSlide>
                <div className="bg-tertiary-container h-full w-full rounded-sm" />
              </CarouselSlide>
            </Carousel>
          </div>
        ),
        title: 'Full controls',
        subtitle: 'Arrows + Indicators',
      },
      {
        component: (
          <div className="h-24 w-44">
            <Carousel showControls={false} showIndicators>
              <CarouselSlide>
                <div className="bg-secondary-container h-full w-full rounded-sm" />
              </CarouselSlide>
              <CarouselSlide>
                <div className="bg-primary-container h-full w-full rounded-sm" />
              </CarouselSlide>
            </Carousel>
          </div>
        ),
        title: 'Indicators only',
        subtitle: 'Auto-play friendly',
      },
      {
        component: (
          <div className="h-24 w-44">
            <Carousel showControls={false} showIndicators={false}>
              <CarouselSlide>
                <div className="bg-surface-container border-outline-variant h-full w-full rounded-sm border" />
              </CarouselSlide>
              <CarouselSlide>
                <div className="bg-surface-container border-outline-variant h-full w-full rounded-sm border" />
              </CarouselSlide>
            </Carousel>
          </div>
        ),
        title: 'Minimal',
        subtitle: 'Swipe/touch only',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      'Carousels are typically used for featured content, image galleries, and promotional banners.',
    examples: [
      {
        title: 'With controls',
        visual: <CarouselBasicExample />,
        caption: 'Use arrow keys or click controls to navigate',
      },
      {
        title: 'Auto-play',
        visual: <CarouselAutoPlayExample />,
        caption: 'Automatically advances slides, pauses on hover',
      },
      {
        title: 'Minimal (swipe only)',
        visual: <CarouselMinimalExample />,
        caption: 'Clean interface for touch/swipe navigation',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'CarouselSlide components to display.',
    },
    {
      name: 'autoPlay',
      type: 'boolean',
      default: 'false',
      description: 'Automatically advance slides.',
    },
    {
      name: 'interval',
      type: 'number',
      default: '5000',
      description: 'Auto-play interval in milliseconds.',
    },
    {
      name: 'showControls',
      type: 'boolean',
      default: 'true',
      description: 'Show navigation arrow buttons.',
    },
    {
      name: 'showIndicators',
      type: 'boolean',
      default: 'true',
      description: 'Show dot indicators for slides.',
    },
    {
      name: 'aria-label',
      type: 'string',
      default: '"Image carousel"',
      description: 'Accessible label for the carousel.',
    },
  ],

  // ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────
  subComponents: [
    {
      name: 'CarouselSlide',
      description: 'Container for individual slide content.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          required: true,
          description: 'Content to display in the slide.',
        },
        { name: 'className', type: 'string', description: 'Additional CSS classes.' },
      ],
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "Uses role='region' with aria-roledescription='carousel'.",
      'Current slide position announced via aria-live.',
      "Each slide has proper role='tabpanel' semantics.",
    ],
    keyboard: [
      { key: 'Arrow Left', description: 'Go to previous slide' },
      { key: 'Arrow Right', description: 'Go to next slide' },
      { key: 'Home', description: 'Go to first slide' },
      { key: 'End', description: 'Go to last slide' },
    ],
    focus: [
      'Carousel is focusable for keyboard navigation.',
      'Auto-play pauses on hover for accessibility.',
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Wrap content in CarouselSlide components.',
    code: `import { Carousel, CarouselSlide } from "@unisane/ui";

function ImageGallery() {
  return (
    <Carousel autoPlay interval={4000}>
      <CarouselSlide>
        <img src="/image1.jpg" alt="Gallery image 1" />
      </CarouselSlide>
      <CarouselSlide>
        <img src="/image2.jpg" alt="Gallery image 2" />
      </CarouselSlide>
      <CarouselSlide>
        <img src="/image3.jpg" alt="Gallery image 3" />
      </CarouselSlide>
    </Carousel>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'tabs',
      reason: 'Use for content that should be navigated by category.',
    },
    {
      slug: 'card',
      reason: 'Use for individual content items within slides.',
    },
  ],
};
