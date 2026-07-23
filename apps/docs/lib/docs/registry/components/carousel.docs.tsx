'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Carousel, CarouselSlide } from '@unisane/ui/carousel';
import { IconButton } from '@unisane/ui/icon-button';

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
    <Carousel aria-label="Featured slides" showControls showIndicators>
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
    <Carousel
      aria-label="Automatically rotating featured slides"
      autoPlay
      autoPlayInterval={3000}
      showIndicators
    >
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
    <Carousel aria-label="Swipeable gallery" showControls={false} showIndicators={false}>
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
    'Carousels present a controlled or uncontrolled sequence with accessible controls, orientation-aware navigation, and pointer gestures.',
  category: 'containment',
  status: 'stable',
  icon: 'view_carousel',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/carousel',
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
            <Carousel aria-label="Manual feature preview" showControls showIndicators={false}>
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
            <Carousel
              aria-label="Automatic feature preview"
              autoPlay
              autoPlayInterval={3000}
              showControls={false}
              showIndicators
            >
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
            <Carousel
              aria-label="Minimal feature preview"
              showControls={false}
              showIndicators={false}
            >
              <CarouselSlide>
                <div className="bg-surface-container border-outline-variant h-full w-full rounded-sm border" />
              </CarouselSlide>
              <CarouselSlide>
                <div className="bg-surface-container border-outline-variant h-full w-full rounded-sm border" />
              </CarouselSlide>
            </Carousel>
          </div>
        ),
        rationale: 'For clean interfaces that use pointer gestures or external navigation.',
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
            <Carousel aria-label="Full controls preview" showControls showIndicators>
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
            <Carousel aria-label="Indicators preview" showControls={false} showIndicators>
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
            <Carousel
              aria-label="Pointer gesture preview"
              showControls={false}
              showIndicators={false}
            >
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
        subtitle: 'Pointer gestures or external state',
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
        caption: 'Use the tab indicators, pointer gestures, or arrow controls to navigate',
      },
      {
        title: 'Auto-play',
        visual: <CarouselAutoPlayExample />,
        caption: 'Includes explicit rotation control and stops when keyboard focus enters',
      },
      {
        title: 'Minimal',
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
      description: 'Offer automatic rotation with an explicit start/stop control.',
    },
    {
      name: 'autoPlayInterval',
      type: 'number',
      default: '5000',
      description: 'Delay between automatic rotations in milliseconds (minimum 1000).',
    },
    {
      name: 'index',
      type: 'number',
      description: 'Controlled active slide index.',
    },
    {
      name: 'defaultIndex',
      type: 'number',
      default: '0',
      description: 'Initial active slide for uncontrolled usage.',
    },
    {
      name: 'onIndexChange',
      type: '(index: number) => void',
      description: 'Called when navigation requests a different active slide.',
    },
    {
      name: 'orientation',
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: 'Sets layout, keyboard navigation, and pointer gesture direction.',
    },
    {
      name: 'loop',
      type: 'boolean',
      default: 'true',
      description: 'Wrap navigation from the last slide to the first and vice versa.',
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
      name: 'labels',
      type: 'Partial<CarouselLabels>',
      description: 'Localizes controls, indicator list, slides, and indicator names.',
    },
    {
      name: 'role',
      type: '"group" | "region"',
      default: '"group"',
      description: 'Use region when the carousel is an important page landmark.',
    },
    {
      name: 'aria-label',
      type: 'string',
      required: true,
      description:
        'Accessible carousel name; use aria-labelledby instead when visible text exists.',
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'References a visible accessible name instead of aria-label.',
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
        {
          name: 'aria-label',
          type: 'string',
          description: 'Optional slide name; a localized positional label is used by default.',
        },
        { name: 'className', type: 'string', description: 'Additional CSS classes.' },
      ],
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "Uses role='group' or role='region' with aria-roledescription='carousel' and a required accessible name.",
      'Uses a polite live region only while automatic rotation is stopped.',
      'Uses complete tab/tabpanel wiring with indicators and grouped slide semantics without them.',
    ],
    keyboard: [
      { key: 'Arrow Left / Right', description: 'Move between horizontal indicators' },
      { key: 'Arrow Up / Down', description: 'Move between vertical indicators' },
      { key: 'Home', description: 'Move to the first indicator' },
      { key: 'End', description: 'Move to the last indicator' },
    ],
    focus: [
      'Indicators use one tab stop; inactive slides are hidden and inert.',
      'Automatic rotation stops when focus enters and pauses while the pointer hovers.',
      'Reduced-motion preference prevents automatic rotation from starting.',
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Wrap content in CarouselSlide components.',
    code: `import { Carousel, CarouselSlide } from "@/components/ui/carousel";

function ImageGallery() {
  return (
    <Carousel aria-label="Portfolio gallery" autoPlay autoPlayInterval={4000}>
      <CarouselSlide aria-label="Project one">
        <img src="/image1.jpg" alt="Gallery image 1" />
      </CarouselSlide>
      <CarouselSlide aria-label="Project two">
        <img src="/image2.jpg" alt="Gallery image 2" />
      </CarouselSlide>
      <CarouselSlide aria-label="Project three">
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
