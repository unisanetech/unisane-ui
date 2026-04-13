'use client';

import React, { useRef, useEffect, useId, useCallback } from 'react';
import { cn } from '../lib/utils';
import { useControllableState } from '../lib/use-controllable-state';

export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  align = 'center',
  side = 'bottom',
  className,
}) => {
  const [isOpen = false, setIsOpen] = useControllableState<boolean>({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setIsOpen(newOpen);
    },
    [setIsOpen],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleOpenChange(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleOpenChange(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleOpenChange]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpenChange(!isOpen);
    } else if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault();
      handleOpenChange(true);
    }
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => handleOpenChange(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={isOpen ? popoverId : undefined}
        className="inline-flex"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          id={popoverId}
          role="dialog"
          aria-modal="true"
          className={cn(
            'bg-surface shadow-2 animate-in fade-in zoom-in-95 duration-short ease-standard border-outline-soft absolute z-[var(--z-popover,2000)] min-w-40 rounded-sm border py-1',
            side === 'bottom' && 'top-[calc(100%+var(--spacing-2))]',
            side === 'top' && 'bottom-[calc(100%+var(--spacing-2))]',
            side === 'left' && 'right-[calc(100%+var(--spacing-2))]',
            side === 'right' && 'left-[calc(100%+var(--spacing-2))]',
            (side === 'top' || side === 'bottom') &&
              align === 'center' &&
              'left-1/2 -translate-x-1/2',
            (side === 'top' || side === 'bottom') && align === 'start' && 'left-0',
            (side === 'top' || side === 'bottom') && align === 'end' && 'right-0',
            (side === 'left' || side === 'right') &&
              align === 'center' &&
              'top-1/2 -translate-y-1/2',
            (side === 'left' || side === 'right') && align === 'start' && 'top-0',
            (side === 'left' || side === 'right') && align === 'end' && 'bottom-0',
            className,
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
