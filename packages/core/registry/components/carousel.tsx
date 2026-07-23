'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useControllableState } from '@/lib/use-controllable-state';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Ripple } from '@/components/ui/ripple';

export type CarouselOrientation = 'horizontal' | 'vertical';

export interface CarouselLabels {
  previous: string;
  next: string;
  startAutoPlay: string;
  stopAutoPlay: string;
  indicators: string;
  slide: (index: number, total: number) => string;
  indicator: (index: number, total: number) => string;
}

const DEFAULT_LABELS: CarouselLabels = {
  previous: 'Previous slide',
  next: 'Next slide',
  startAutoPlay: 'Start automatic slide rotation',
  stopAutoPlay: 'Stop automatic slide rotation',
  indicators: 'Choose slide to display',
  slide: (index, total) => `${index} of ${total}`,
  indicator: (index) => `Slide ${index}`,
};

type AccessibleCarouselName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

type CarouselBaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'defaultValue' | 'onChange' | 'role'
> & {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  children: React.ReactNode;
  defaultIndex?: number;
  index?: number;
  labels?: Partial<CarouselLabels>;
  loop?: boolean;
  onIndexChange?: (index: number) => void;
  orientation?: CarouselOrientation;
  role?: 'group' | 'region';
  showControls?: boolean;
  showIndicators?: boolean;
};

export type CarouselProps = CarouselBaseProps & AccessibleCarouselName;

export type CarouselSlideProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'aria-hidden' | 'id' | 'role'
> & {
  children: React.ReactNode;
};

interface CarouselSlideContextValue {
  active: boolean;
  index: number;
  slideId: string;
  tabId: string;
  tabbed: boolean;
  total: number;
  labels: CarouselLabels;
}

const CarouselSlideContext = React.createContext<CarouselSlideContextValue | null>(null);

export const CarouselSlide = React.forwardRef<HTMLDivElement, CarouselSlideProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-roledescription': ariaRoleDescription = 'slide',
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const context = React.useContext(CarouselSlideContext);
    if (!context) {
      throw new Error('CarouselSlide must be used within Carousel');
    }

    const fallbackLabel = context.labels.slide(context.index + 1, context.total);
    const resolvedLabel = ariaLabelledBy ? undefined : (ariaLabel ?? fallbackLabel);

    return (
      <div
        {...props}
        ref={ref}
        id={context.slideId}
        role={context.tabbed ? 'tabpanel' : 'group'}
        aria-labelledby={context.tabbed ? context.tabId : ariaLabelledBy}
        aria-label={context.tabbed ? undefined : resolvedLabel}
        aria-roledescription={context.tabbed ? undefined : ariaRoleDescription}
        aria-hidden={!context.active}
        inert={!context.active}
        className={cn(
          'duration-long ease-emphasized absolute inset-0 h-full w-full transition-opacity',
          context.active ? 'opacity-100' : 'pointer-events-none opacity-0',
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

CarouselSlide.displayName = 'CarouselSlide';

function isCarouselSlideElement(
  node: React.ReactNode,
): node is React.ReactElement<CarouselSlideProps> {
  return React.isValidElement<CarouselSlideProps>(node) && node.type === CarouselSlide;
}

function normalizeIndex(index: number, total: number, loop: boolean): number {
  if (total === 0) return 0;
  const wholeIndex = Number.isFinite(index) ? Math.trunc(index) : 0;
  if (!loop) return Math.min(Math.max(wholeIndex, 0), total - 1);
  return ((wholeIndex % total) + total) % total;
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest('a, button, input, select, textarea, [contenteditable="true"]') !== null
  );
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-roledescription': ariaRoleDescription = 'carousel',
      autoPlay = false,
      autoPlayInterval = 5000,
      children,
      className,
      defaultIndex = 0,
      index,
      labels,
      loop = true,
      onFocusCapture,
      onIndexChange,
      onMouseEnter,
      onMouseLeave,
      onPointerCancel,
      onPointerDown,
      onPointerUp,
      orientation = 'horizontal',
      role = 'group',
      showControls = true,
      showIndicators = true,
      ...props
    },
    ref,
  ) => {
    const childNodes = React.Children.toArray(children);
    const slides = childNodes.filter(isCarouselSlideElement);
    if (slides.length !== childNodes.length) {
      throw new Error('Carousel children must be CarouselSlide elements');
    }

    const total = slides.length;
    const [storedIndex = 0, setStoredIndex] = useControllableState<number>({
      value: index,
      defaultValue: defaultIndex,
      onChange: onIndexChange,
    });
    const currentIndex = normalizeIndex(storedIndex, total, loop);
    const baseId = React.useId();
    const indicatorRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
    const pointerStartRef = React.useRef<{
      pointerId: number;
      x: number;
      y: number;
    } | null>(null);
    const [isHovered, setIsHovered] = React.useState(false);
    const [rotationRequested, setRotationRequested] = React.useState(false);
    const resolvedLabels: CarouselLabels = { ...DEFAULT_LABELS, ...labels };
    const canNavigate = total > 1;
    const canAutoPlay = autoPlay && canNavigate;
    const isRotating = canAutoPlay && rotationRequested && !isHovered;
    const resolvedInterval =
      Number.isFinite(autoPlayInterval) && autoPlayInterval >= 1000 ? autoPlayInterval : 5000;

    const setIndex = React.useCallback(
      (nextIndex: number) => {
        const normalized = normalizeIndex(nextIndex, total, loop);
        if (total === 0 || normalized === currentIndex) return;
        setStoredIndex(normalized);
      },
      [currentIndex, loop, setStoredIndex, total],
    );

    const previous = React.useCallback(() => setIndex(currentIndex - 1), [currentIndex, setIndex]);
    const next = React.useCallback(() => {
      if (!loop && currentIndex === total - 1) {
        setRotationRequested(false);
        return;
      }
      setIndex(currentIndex + 1);
    }, [currentIndex, loop, setIndex, total]);

    React.useEffect(() => {
      const normalized = normalizeIndex(storedIndex, total, loop);
      if (normalized !== storedIndex) {
        setStoredIndex(normalized);
      }
    }, [loop, setStoredIndex, storedIndex, total]);

    React.useEffect(() => {
      if (!autoPlay) {
        setRotationRequested(false);
        return;
      }

      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setRotationRequested(!media.matches);
      const handleChange = (event: MediaQueryListEvent) => {
        if (event.matches) setRotationRequested(false);
      };
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }, [autoPlay]);

    React.useEffect(() => {
      if (!isRotating) return;
      const timer = window.setTimeout(next, resolvedInterval);
      return () => window.clearTimeout(timer);
    }, [isRotating, next, resolvedInterval]);

    const moveIndicator = (nextIndex: number) => {
      const normalized = normalizeIndex(nextIndex, total, loop);
      setIndex(normalized);
      indicatorRefs.current[normalized]?.focus();
    };

    const handleIndicatorKeyDown = (
      event: React.KeyboardEvent<HTMLButtonElement>,
      indicatorIndex: number,
    ) => {
      let nextIndex: number | null = null;
      const isRtl =
        event.currentTarget.closest('[dir="rtl"]') !== null ||
        document.documentElement.getAttribute('dir') === 'rtl';

      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = total - 1;
      if (orientation === 'horizontal' && event.key === 'ArrowRight') {
        nextIndex = indicatorIndex + (isRtl ? -1 : 1);
      }
      if (orientation === 'horizontal' && event.key === 'ArrowLeft') {
        nextIndex = indicatorIndex + (isRtl ? 1 : -1);
      }
      if (orientation === 'vertical' && event.key === 'ArrowDown') nextIndex = indicatorIndex + 1;
      if (orientation === 'vertical' && event.key === 'ArrowUp') nextIndex = indicatorIndex - 1;

      if (nextIndex === null) return;
      event.preventDefault();
      moveIndicator(nextIndex);
    };

    const completePointerGesture = (event: React.PointerEvent<HTMLDivElement>) => {
      const start = pointerStartRef.current;
      pointerStartRef.current = null;
      if (!start || start.pointerId !== event.pointerId || !canNavigate) return;

      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;
      const delta = orientation === 'horizontal' ? deltaX : deltaY;
      if (Math.abs(delta) < 40) return;

      if (orientation === 'vertical') {
        if (delta < 0) next();
        else previous();
        return;
      }

      const isRtl =
        event.currentTarget.closest('[dir="rtl"]') !== null ||
        document.documentElement.getAttribute('dir') === 'rtl';
      const movedTowardNext = isRtl ? delta > 0 : delta < 0;
      if (movedTowardNext) next();
      else previous();
    };

    const previousDisabled = !loop && currentIndex === 0;
    const nextDisabled = !loop && currentIndex === total - 1;

    return (
      <div
        {...props}
        ref={ref}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-roledescription={ariaRoleDescription}
        data-orientation={orientation}
        className={cn(
          'relative w-full overflow-hidden',
          orientation === 'horizontal' ? 'touch-pan-y' : 'touch-pan-x',
          className,
        )}
        onFocusCapture={(event) => {
          onFocusCapture?.(event);
          if (!event.defaultPrevented) setRotationRequested(false);
        }}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          if (!event.defaultPrevented) setIsHovered(true);
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);
          if (!event.defaultPrevented) setIsHovered(false);
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          if (
            event.defaultPrevented ||
            !event.isPrimary ||
            event.button !== 0 ||
            isInteractiveTarget(event.target)
          ) {
            return;
          }
          pointerStartRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          };
        }}
        onPointerUp={(event) => {
          onPointerUp?.(event);
          if (!event.defaultPrevented) completePointerGesture(event);
        }}
        onPointerCancel={(event) => {
          onPointerCancel?.(event);
          pointerStartRef.current = null;
        }}
      >
        {canAutoPlay && (
          <IconButton
            aria-label={
              rotationRequested ? resolvedLabels.stopAutoPlay : resolvedLabels.startAutoPlay
            }
            icon={<Icon symbol={rotationRequested ? 'pause' : 'play_arrow'} />}
            onClick={() => setRotationRequested((requested) => !requested)}
            className="bg-surface-container-low absolute start-4 top-4 z-20 backdrop-blur-sm"
          />
        )}

        {showControls && canNavigate && (
          <>
            <IconButton
              aria-label={resolvedLabels.previous}
              icon={
                <Icon
                  symbol={orientation === 'horizontal' ? 'chevron_left' : 'keyboard_arrow_up'}
                  className={orientation === 'horizontal' ? 'rtl:rotate-180' : undefined}
                />
              }
              disabled={previousDisabled}
              onClick={previous}
              className={cn(
                'bg-surface-container-low absolute z-20 backdrop-blur-sm',
                orientation === 'horizontal'
                  ? 'start-4 top-1/2 -translate-y-1/2'
                  : 'start-1/2 top-4 -translate-x-1/2',
              )}
            />
            <IconButton
              aria-label={resolvedLabels.next}
              icon={
                <Icon
                  symbol={orientation === 'horizontal' ? 'chevron_right' : 'keyboard_arrow_down'}
                  className={orientation === 'horizontal' ? 'rtl:rotate-180' : undefined}
                />
              }
              disabled={nextDisabled}
              onClick={next}
              className={cn(
                'bg-surface-container-low absolute z-20 backdrop-blur-sm',
                orientation === 'horizontal'
                  ? 'end-4 top-1/2 -translate-y-1/2'
                  : 'start-1/2 bottom-4 -translate-x-1/2',
              )}
            />
          </>
        )}

        {showIndicators && canNavigate && (
          <div
            role="tablist"
            aria-label={resolvedLabels.indicators}
            aria-orientation={orientation}
            className={cn(
              'absolute z-20 flex gap-2',
              orientation === 'horizontal'
                ? 'start-1/2 bottom-4 -translate-x-1/2'
                : 'end-4 top-1/2 -translate-y-1/2 flex-col',
            )}
          >
            {slides.map((slide, slideIndex) => {
              const slideId = `${baseId}-slide-${slideIndex}`;
              const tabId = `${baseId}-tab-${slideIndex}`;
              const slideLabel =
                slide.props['aria-label'] ??
                resolvedLabels.indicator(slideIndex + 1, slides.length);
              return (
                <button
                  key={slide.key ?? slideIndex}
                  ref={(node) => {
                    indicatorRefs.current[slideIndex] = node;
                  }}
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-label={slideLabel}
                  aria-controls={slideId}
                  aria-selected={slideIndex === currentIndex}
                  tabIndex={slideIndex === currentIndex ? 0 : -1}
                  onClick={() => setIndex(slideIndex)}
                  onKeyDown={(event) => handleIndicatorKeyDown(event, slideIndex)}
                  className={cn(
                    'duration-short ease-standard relative size-2 overflow-hidden rounded-full transition-colors',
                    'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    slideIndex === currentIndex
                      ? 'bg-primary'
                      : 'bg-outline-medium hover:bg-outline-strong',
                  )}
                >
                  <Ripple center />
                </button>
              );
            })}
          </div>
        )}

        <div
          className="relative h-full w-full"
          aria-live={isRotating ? 'off' : 'polite'}
          aria-atomic="false"
        >
          {slides.map((slide, slideIndex) => {
            const slideId = `${baseId}-slide-${slideIndex}`;
            const tabId = `${baseId}-tab-${slideIndex}`;
            return (
              <CarouselSlideContext.Provider
                key={slide.key ?? slideIndex}
                value={{
                  active: slideIndex === currentIndex,
                  index: slideIndex,
                  slideId,
                  tabId,
                  tabbed: showIndicators && canNavigate,
                  total,
                  labels: resolvedLabels,
                }}
              >
                {slide}
              </CarouselSlideContext.Provider>
            );
          })}
        </div>
      </div>
    );
  },
);

Carousel.displayName = 'Carousel';
