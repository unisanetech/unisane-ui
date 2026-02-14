import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Ripple } from './ripple';
import { cn } from '@/lib/utils';
import { useScrollLock } from '@/hooks/use-scroll-lock';

export type SheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  className?: string;
  size?: SheetSize;
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  icon,
  footerLeft,
  footerRight,
  className,
  size = 'md',
}: SheetProps) {
  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  const OPEN_DURATION = 600;
  const CLOSE_DURATION = 250;

  // Lock body scroll while preventing layout shift
  useScrollLock(open);

  useEffect(() => {
    if (open) {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      timerRef.current = window.setTimeout(() => {
        setShouldRender(false);
      }, CLOSE_DURATION);
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!shouldRender) return null;
  if (typeof document === 'undefined') return null;

  const sizeClasses = {
    sm: 'max-w-100',
    md: 'max-w-150',
    lg: 'max-w-210',
    xl: 'max-w-280',
    full: 'max-w-[calc(100vw-var(--spacing-14))]',
  };

  return createPortal(
    <div className="z-modal fixed inset-0 flex justify-end overflow-hidden" role="presentation">
      <div
        className={cn(
          'bg-scrim absolute inset-0 backdrop-blur-[calc(var(--unit)/2)] transition-opacity',
          isVisible ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          transitionDuration: `${isVisible ? OPEN_DURATION : CLOSE_DURATION}ms`,
          transitionTimingFunction: isVisible
            ? 'cubic-bezier(0.05, 0.7, 0.1, 1.0)'
            : 'cubic-bezier(0.3, 0, 1, 1)',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'bg-surface shadow-5 border-outline-variant relative flex h-full w-full transform-gpu flex-col border-l transition-all',
          sizeClasses[size],
          isVisible
            ? 'translate-x-0 scale-100 opacity-100'
            : 'translate-x-full scale-[0.98] opacity-0',
          className,
        )}
        style={{
          transitionDuration: `${isVisible ? OPEN_DURATION : CLOSE_DURATION}ms`,
          transitionTimingFunction: isVisible
            ? 'cubic-bezier(0.05, 0.7, 0.1, 1.0)'
            : 'cubic-bezier(0.3, 0, 1, 1)',
        }}
        role="dialog"
        aria-modal="true"
      >
        <header className="border-outline-variant bg-surface z-20 flex shrink-0 items-center justify-between border-b px-6 py-6">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="bg-inverse-surface text-inverse-on-surface duration-short flex h-10 w-10 shrink-0 items-center justify-center rounded-sm transition-all">
                {icon}
              </div>
            )}
            <div className="flex flex-col">
              <h2 className="text-title-medium text-on-surface leading-none">{title}</h2>
              <div className="text-on-surface-variant text-label-small mt-1 flex items-center gap-1.5 font-medium">
                <span className="bg-primary h-1 w-1 animate-pulse rounded-full" />
                Active Instance
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm transition-all"
            aria-label="Close sheet"
          >
            <Ripple />
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="no-scrollbar bg-surface relative z-10 flex-1 overflow-y-auto">
          {children}
        </div>

        {(footerLeft || footerRight) && (
          <footer className="border-outline-variant bg-surface-container-low z-20 shrink-0 border-t px-6 py-6">
            <div className="medium:flex-row flex flex-col items-center justify-between gap-4">
              <div className="medium:w-auto w-full min-w-0 flex-1">{footerLeft}</div>
              <div className="medium:w-auto flex w-full shrink-0 items-center justify-end gap-2">
                {footerRight}
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
