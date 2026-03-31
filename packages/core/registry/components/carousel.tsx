'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/icon-button';
import { Ripple } from '@/components/ui/ripple';

const carouselVariants = cva('relative w-full overflow-hidden', {
  variants: {
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type CarouselProps = VariantProps<typeof carouselVariants> & {
  children: React.ReactNode;
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
  'aria-label'?: string;
};

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = false,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  className,
  'aria-label': ariaLabel = 'Image carousel',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const childrenArray = React.Children.toArray(children);
  const autoPlayRef = useRef<number | null>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback(
    (index: number) => {
      const newIndex = (index + childrenArray.length) % childrenArray.length;
      setCurrentIndex(newIndex);
    },
    [childrenArray.length],
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(childrenArray.length - 1);
          break;
      }
    },
    [prevSlide, nextSlide, goToSlide, childrenArray.length],
  );

  useEffect(() => {
    if (autoPlay && !isHovered) {
      autoPlayRef.current = window.setInterval(nextSlide, interval);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, interval, isHovered, nextSlide]);

  return (
    <div
      className={cn(carouselVariants({ className }))}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <div ref={liveRegionRef} aria-live="polite" aria-atomic="true" className="sr-only">
        Slide {currentIndex + 1} of {childrenArray.length}
      </div>

      <div className="relative h-full w-full" role="group" aria-roledescription="slide">
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className={cn(
              'duration-long ease-emphasized absolute inset-0 h-full w-full transition-opacity',
              index === currentIndex ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            aria-hidden={index !== currentIndex}
            role="tabpanel"
            aria-label={`Slide ${index + 1} of ${childrenArray.length}`}
          >
            {child}
          </div>
        ))}
      </div>

      {showControls && childrenArray.length > 1 && (
        <>
          <IconButton
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            }
            onClick={prevSlide}
            aria-label="Previous slide"
            className="bg-surface-container-low absolute top-1/2 left-4 -translate-y-1/2 backdrop-blur-sm"
          />
          <IconButton
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            }
            onClick={nextSlide}
            aria-label="Next slide"
            className="bg-surface-container-low absolute top-1/2 right-4 -translate-y-1/2 backdrop-blur-sm"
          />
        </>
      )}

      {showIndicators && childrenArray.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2"
          role="tablist"
          aria-label="Carousel navigation"
        >
          {childrenArray.map((_, index) => (
            <button
              key={index}
              className={cn(
                'duration-short ease-standard relative h-2 w-2 overflow-hidden rounded-full transition-colors',
                'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                index === currentIndex ? 'bg-primary' : 'bg-outline-medium hover:bg-outline-strong',
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
              tabIndex={index === currentIndex ? 0 : -1}
            >
              <Ripple center />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export type CarouselSlideProps = {
  children: React.ReactNode;
  className?: string;
};

export const CarouselSlide: React.FC<CarouselSlideProps> = ({ children, className }) => {
  return <div className={cn('h-full w-full', className)}>{children}</div>;
};
