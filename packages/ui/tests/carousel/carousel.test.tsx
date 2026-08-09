// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Carousel, CarouselSlide } from '../../src/components/carousel';

async function render(ui: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(ui);
  });

  return {
    root,
    container,
    async rerender(nextUi: React.ReactNode) {
      await act(async () => {
        root.render(nextUi);
      });
    },
  };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

function getTabs(container: HTMLElement) {
  return Array.from(container.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];
}

function getPanels(container: HTMLElement) {
  return Array.from(container.querySelectorAll('[role="tabpanel"]')) as HTMLDivElement[];
}

async function click(element: Element) {
  await act(async () => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

async function press(element: Element, key: string) {
  await act(async () => {
    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }));
  });
}

function dispatchPointer(
  element: Element,
  type: 'pointerdown' | 'pointerup',
  { clientX, clientY, pointerId = 1 }: { clientX: number; clientY: number; pointerId?: number },
) {
  const event = new Event(type, { bubbles: true }) as PointerEvent;
  Object.defineProperties(event, {
    button: { value: 0 },
    clientX: { value: clientX },
    clientY: { value: clientY },
    isPrimary: { value: true },
    pointerId: { value: pointerId },
  });
  element.dispatchEvent(event);
}

function slides() {
  return [
    <CarouselSlide key="first" aria-label="First slide">
      First
    </CarouselSlide>,
    <CarouselSlide key="second" aria-label="Second slide">
      Second
    </CarouselSlide>,
    <CarouselSlide key="third" aria-label="Third slide">
      Third
    </CarouselSlide>,
  ];
}

describe('Carousel', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.removeAttribute('dir');
    document.body.innerHTML = '';
  });

  it('provides complete tab and panel semantics while making inactive slides inert', async () => {
    const rootRef = React.createRef<HTMLDivElement>();
    const slideRef = React.createRef<HTMLDivElement>();
    const rendered = await render(
      <Carousel aria-label="Featured work" data-testid="carousel" ref={rootRef}>
        <CarouselSlide aria-label="First slide" ref={slideRef} data-slide="first">
          First
        </CarouselSlide>
        <CarouselSlide aria-label="Second slide">
          <button type="button">Hidden action</button>
        </CarouselSlide>
      </Carousel>,
    );

    const carousel = rendered.container.querySelector('[data-testid="carousel"]');
    const tabs = getTabs(rendered.container);
    const panels = getPanels(rendered.container);

    expect(rootRef.current).toBe(carousel);
    expect(carousel?.getAttribute('aria-label')).toBe('Featured work');
    expect(carousel?.getAttribute('aria-roledescription')).toBe('carousel');
    expect(tabs).toHaveLength(2);
    expect(panels).toHaveLength(2);
    expect(tabs[0]?.getAttribute('aria-controls')).toBe(panels[0]?.id);
    expect(panels[0]?.getAttribute('aria-labelledby')).toBe(tabs[0]?.id);
    expect(slideRef.current).toBe(panels[0]);
    expect(panels[0]?.getAttribute('data-slide')).toBe('first');
    expect(panels[0]?.getAttribute('aria-hidden')).toBe('false');
    expect(panels[0]?.hasAttribute('inert')).toBe(false);
    expect(panels[1]?.getAttribute('aria-hidden')).toBe('true');
    expect(panels[1]?.hasAttribute('inert')).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });

  it('supports bounded uncontrolled navigation and reconciles an out-of-range default', async () => {
    const onIndexChange = vi.fn();
    const rendered = await render(
      <Carousel
        aria-label="Setup steps"
        defaultIndex={20}
        loop={false}
        onIndexChange={onIndexChange}
      >
        {slides()}
      </Carousel>,
    );

    const tabs = getTabs(rendered.container);
    const previous = rendered.container.querySelector('[aria-label="Previous slide"]')!;
    const next = rendered.container.querySelector('[aria-label="Next slide"]') as HTMLButtonElement;

    expect(tabs[2]?.getAttribute('aria-selected')).toBe('true');
    expect(next.disabled).toBe(true);

    await click(previous);

    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');
    expect(next.disabled).toBe(false);

    await cleanup(rendered.root, rendered.container);
  });

  it('reports controlled changes without mutating the active slide until rerendered', async () => {
    const onIndexChange = vi.fn();
    const rendered = await render(
      <Carousel aria-label="Release highlights" index={0} onIndexChange={onIndexChange}>
        {slides()}
      </Carousel>,
    );

    await click(rendered.container.querySelector('[aria-label="Next slide"]')!);

    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(getTabs(rendered.container)[0]?.getAttribute('aria-selected')).toBe('true');

    await rendered.rerender(
      <Carousel aria-label="Release highlights" index={1} onIndexChange={onIndexChange}>
        {slides()}
      </Carousel>,
    );

    expect(getTabs(rendered.container)[1]?.getAttribute('aria-selected')).toBe('true');

    await cleanup(rendered.root, rendered.container);
  });

  it('keeps empty, single-slide, shrinking, and non-indicator collections deterministic', async () => {
    const rendered = await render(
      <Carousel aria-label="Minimal gallery" defaultIndex={2} showIndicators={false}>
        {slides()}
      </Carousel>,
    );

    let groupedSlides = Array.from(
      rendered.container.querySelectorAll('[aria-roledescription="slide"]'),
    );
    expect(groupedSlides).toHaveLength(3);
    expect(groupedSlides[2]?.getAttribute('aria-hidden')).toBe('false');
    expect(rendered.container.querySelector('[role="tablist"]')).toBeNull();

    await rendered.rerender(
      <Carousel aria-label="Minimal gallery" showIndicators={false}>
        <CarouselSlide>Only slide</CarouselSlide>
      </Carousel>,
    );

    groupedSlides = Array.from(
      rendered.container.querySelectorAll('[aria-roledescription="slide"]'),
    );
    expect(groupedSlides).toHaveLength(1);
    expect(groupedSlides[0]?.getAttribute('aria-label')).toBe('1 of 1');
    expect(groupedSlides[0]?.getAttribute('aria-hidden')).toBe('false');
    expect(rendered.container.querySelector('[aria-label="Next slide"]')).toBeNull();

    await rendered.rerender(
      <Carousel aria-label="Empty gallery" showIndicators={false}>
        {[]}
      </Carousel>,
    );

    expect(rendered.container.querySelector('[aria-roledescription="slide"]')).toBeNull();
    expect(rendered.container.querySelector('[aria-label="Next slide"]')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('uses orientation-aware and direction-aware tab keyboard navigation', async () => {
    const rendered = await render(
      <div dir="rtl">
        <Carousel aria-label="RTL gallery">{slides()}</Carousel>
      </div>,
    );

    let tabs = getTabs(rendered.container);
    tabs[0]?.focus();
    await press(tabs[0]!, 'ArrowLeft');
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');

    await rendered.rerender(
      <Carousel aria-label="Vertical gallery" orientation="vertical">
        {slides()}
      </Carousel>,
    );

    tabs = getTabs(rendered.container);
    tabs[0]?.focus();
    await press(tabs[0]!, 'ArrowDown');
    expect(document.activeElement).toBe(tabs[1]);
    await press(tabs[1]!, 'End');
    expect(document.activeElement).toBe(tabs[2]);
    expect(tabs[2]?.getAttribute('aria-selected')).toBe('true');

    await cleanup(rendered.root, rendered.container);
  });

  it('stops automatic rotation on focus and exposes explicit stop and start controls', async () => {
    vi.useFakeTimers();
    const rendered = await render(
      <Carousel aria-label="News" autoPlay autoPlayInterval={1000}>
        {slides()}
      </Carousel>,
    );

    const liveRegion = rendered.container.querySelector('[aria-live]')!;
    const carousel = rendered.container.querySelector('[aria-roledescription="carousel"]')!;
    expect(liveRegion.getAttribute('aria-live')).toBe('off');

    await act(async () => {
      carousel.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    });
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(liveRegion.getAttribute('aria-live')).toBe('polite');
    expect(getTabs(rendered.container)[0]?.getAttribute('aria-selected')).toBe('true');

    await act(async () => {
      carousel.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    });
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(liveRegion.getAttribute('aria-live')).toBe('off');
    expect(getTabs(rendered.container)[1]?.getAttribute('aria-selected')).toBe('true');

    const stop = rendered.container.querySelector(
      '[aria-label="Stop automatic slide rotation"]',
    ) as HTMLButtonElement;
    await act(async () => {
      stop.focus();
    });

    expect(liveRegion.getAttribute('aria-live')).toBe('polite');
    expect(
      rendered.container.querySelector('[aria-label="Start automatic slide rotation"]'),
    ).not.toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(getTabs(rendered.container)[1]?.getAttribute('aria-selected')).toBe('true');

    await click(rendered.container.querySelector('[aria-label="Start automatic slide rotation"]')!);
    expect(liveRegion.getAttribute('aria-live')).toBe('off');

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(getTabs(rendered.container)[2]?.getAttribute('aria-selected')).toBe('true');

    await cleanup(rendered.root, rendered.container);
  });

  it('does not start automatic rotation when reduced motion is requested', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const rendered = await render(
      <Carousel aria-label="Motion-sensitive gallery" autoPlay>
        {slides()}
      </Carousel>,
    );

    expect(rendered.container.querySelector('[aria-live]')?.getAttribute('aria-live')).toBe(
      'polite',
    );
    expect(
      rendered.container.querySelector('[aria-label="Start automatic slide rotation"]'),
    ).not.toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('supports logical horizontal and vertical pointer swipes', async () => {
    const rendered = await render(<Carousel aria-label="Swipe gallery">{slides()}</Carousel>);
    let carousel = rendered.container.querySelector('[aria-roledescription="carousel"]')!;

    await act(async () => {
      dispatchPointer(carousel, 'pointerdown', { clientX: 100, clientY: 20 });
      dispatchPointer(carousel, 'pointerup', { clientX: 20, clientY: 20 });
    });
    expect(getTabs(rendered.container)[1]?.getAttribute('aria-selected')).toBe('true');

    await rendered.rerender(
      <div dir="rtl">
        <Carousel aria-label="RTL swipe gallery">{slides()}</Carousel>
      </div>,
    );
    carousel = rendered.container.querySelector('[aria-roledescription="carousel"]')!;
    await act(async () => {
      dispatchPointer(carousel, 'pointerdown', { clientX: 20, clientY: 20 });
      dispatchPointer(carousel, 'pointerup', { clientX: 100, clientY: 20 });
    });
    expect(getTabs(rendered.container)[1]?.getAttribute('aria-selected')).toBe('true');

    await rendered.rerender(
      <Carousel aria-label="Vertical swipe gallery" orientation="vertical">
        {slides()}
      </Carousel>,
    );
    carousel = rendered.container.querySelector('[aria-roledescription="carousel"]')!;
    await act(async () => {
      dispatchPointer(carousel, 'pointerdown', { clientX: 20, clientY: 100 });
      dispatchPointer(carousel, 'pointerup', { clientX: 20, clientY: 20 });
    });
    expect(getTabs(rendered.container)[1]?.getAttribute('aria-selected')).toBe('true');

    await cleanup(rendered.root, rendered.container);
  });
});
