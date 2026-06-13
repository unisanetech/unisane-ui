'use client';

import React, { useRef, useEffect, useId, useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getPortalLayerStyle } from '@/lib/portal-layer';
import { cn } from '@/lib/utils';
import { useControllableState } from '@/lib/use-controllable-state';

type PopoverAlign = 'start' | 'center' | 'end';
type PopoverSide = 'top' | 'bottom' | 'left' | 'right';

export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: PopoverAlign;
  side?: PopoverSide;
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  portal?: boolean;
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
  sideOffset = 8,
  alignOffset = 0,
  avoidCollisions = true,
  collisionPadding = 8,
  portal = true,
  className,
}) => {
  const [isOpen = false, setIsOpen] = useControllableState<boolean>({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [computedPlacement, setComputedPlacement] = useState({ side, align });
  const [isPositioned, setIsPositioned] = useState(!portal);
  const popoverId = useId();

  const normalizedPadding = useMemo(() => {
    if (typeof collisionPadding === 'number') {
      return {
        top: collisionPadding,
        right: collisionPadding,
        bottom: collisionPadding,
        left: collisionPadding,
      };
    }
    return {
      top: collisionPadding.top ?? 8,
      right: collisionPadding.right ?? 8,
      bottom: collisionPadding.bottom ?? 8,
      left: collisionPadding.left ?? 8,
    };
  }, [collisionPadding]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setIsOpen(newOpen);
    },
    [setIsOpen],
  );

  useLayoutEffect(() => {
    if (!isOpen) {
      setIsPositioned(!portal);
      return;
    }

    if (!triggerRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentWidth = contentRef.current?.offsetWidth || 200;
      const contentHeight = contentRef.current?.offsetHeight || 160;

      const result = computePopoverPosition(
        triggerRect,
        { width: contentWidth, height: contentHeight },
        {
          side,
          align,
          sideOffset,
          alignOffset,
          avoidCollisions,
          collisionPadding: normalizedPadding,
        },
      );

      setPosition({ top: result.top, left: result.left });
      setComputedPlacement({ side: result.actualSide, align: result.actualAlign });
      setIsPositioned(true);
    };

    if (portal) {
      setIsPositioned(false);
    }

    updatePosition();

    if (!portal) return;

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [
    align,
    alignOffset,
    avoidCollisions,
    isOpen,
    normalizedPadding,
    portal,
    side,
    sideOffset,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      handleOpenChange(false);
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

      {isOpen ? renderPopoverContent({
        align,
        className,
        computedPlacement,
        content,
        contentRef,
        id: popoverId,
        isPositioned,
        portal,
        position,
        side,
        trigger: triggerRef.current,
      }) : null}
    </div>
  );
};

function renderPopoverContent({
  align,
  className,
  computedPlacement,
  content,
  contentRef,
  id,
  isPositioned,
  portal,
  position,
  side,
  trigger,
}: {
  align: PopoverAlign;
  className?: string;
  computedPlacement: { side: PopoverSide; align: PopoverAlign };
  content: React.ReactNode;
  contentRef: React.RefObject<HTMLDivElement | null>;
  id: string;
  isPositioned: boolean;
  portal: boolean;
  position: { top: number; left: number };
  side: PopoverSide;
  trigger: HTMLElement | null;
}) {
  const wrapperClassName = portal
    ? 'fixed z-[var(--z-popover,2000)]'
    : cn(
        'absolute z-[var(--z-popover,2000)]',
        side === 'bottom' && 'top-[calc(100%+var(--spacing-2))]',
        side === 'top' && 'bottom-[calc(100%+var(--spacing-2))]',
        side === 'left' && 'right-[calc(100%+var(--spacing-2))]',
        side === 'right' && 'left-[calc(100%+var(--spacing-2))]',
        (side === 'top' || side === 'bottom') && align === 'center' && 'left-1/2 -translate-x-1/2',
        (side === 'top' || side === 'bottom') && align === 'start' && 'left-0',
        (side === 'top' || side === 'bottom') && align === 'end' && 'right-0',
        (side === 'left' || side === 'right') &&
          align === 'center' &&
          'top-1/2 -translate-y-1/2',
        (side === 'left' || side === 'right') && align === 'start' && 'top-0',
        (side === 'left' || side === 'right') && align === 'end' && 'bottom-0',
      );

  const popover = (
    <div
      ref={contentRef}
      id={id}
      role="dialog"
      aria-modal="true"
      data-side={computedPlacement.side}
      data-align={computedPlacement.align}
      className={wrapperClassName}
      style={
        portal
          ? {
              top: position.top,
              left: position.left,
              visibility: isPositioned ? 'visible' : 'hidden',
              ...getPortalLayerStyle(trigger),
            }
          : undefined
      }
    >
      <div
        className={cn(
          'animate-surface-enter bg-surface shadow-2 border-outline-soft min-w-40 rounded-sm border py-1',
          className,
        )}
      >
        {content}
      </div>
    </div>
  );

  if (portal && typeof document !== 'undefined') {
    return createPortal(popover, document.body);
  }

  return popover;
}

function computePopoverPosition(
  triggerRect: DOMRect,
  contentRect: { width: number; height: number },
  options: {
    side: PopoverSide;
    align: PopoverAlign;
    sideOffset: number;
    alignOffset: number;
    avoidCollisions: boolean;
    collisionPadding: { top: number; right: number; bottom: number; left: number };
  },
): { top: number; left: number; actualSide: PopoverSide; actualAlign: PopoverAlign } {
  const { side, align, sideOffset, alignOffset, avoidCollisions, collisionPadding } = options;
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const space = {
    top: triggerRect.top - collisionPadding.top,
    bottom: viewport.height - triggerRect.bottom - collisionPadding.bottom,
    left: triggerRect.left - collisionPadding.left,
    right: viewport.width - triggerRect.right - collisionPadding.right,
  };

  let actualSide = side;
  const neededSpace = {
    top: contentRect.height + sideOffset,
    bottom: contentRect.height + sideOffset,
    left: contentRect.width + sideOffset,
    right: contentRect.width + sideOffset,
  };

  if (avoidCollisions && space[side] < neededSpace[side]) {
    const oppositeSide: Record<PopoverSide, PopoverSide> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    };
    const opposite = oppositeSide[side];
    if (space[opposite] > space[side]) {
      actualSide = opposite;
    }
  }

  let top = 0;
  let left = 0;

  if (actualSide === 'top') {
    top = triggerRect.top - contentRect.height - sideOffset;
  } else if (actualSide === 'bottom') {
    top = triggerRect.bottom + sideOffset;
  } else if (actualSide === 'left') {
    left = triggerRect.left - contentRect.width - sideOffset;
  } else {
    left = triggerRect.right + sideOffset;
  }

  let actualAlign = align;
  if (actualSide === 'top' || actualSide === 'bottom') {
    if (align === 'start') {
      left = triggerRect.left + alignOffset;
    } else if (align === 'center') {
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2 + alignOffset;
    } else {
      left = triggerRect.right - contentRect.width - alignOffset;
    }

    if (avoidCollisions) {
      const minLeft = collisionPadding.left;
      const maxLeft = viewport.width - contentRect.width - collisionPadding.right;
      if (left < minLeft) {
        left = minLeft;
        actualAlign = 'start';
      } else if (left > maxLeft) {
        left = maxLeft;
        actualAlign = 'end';
      }
    }
  } else {
    if (align === 'start') {
      top = triggerRect.top + alignOffset;
    } else if (align === 'center') {
      top = triggerRect.top + (triggerRect.height - contentRect.height) / 2 + alignOffset;
    } else {
      top = triggerRect.bottom - contentRect.height - alignOffset;
    }

    if (avoidCollisions) {
      const minTop = collisionPadding.top;
      const maxTop = viewport.height - contentRect.height - collisionPadding.bottom;
      if (top < minTop) {
        top = minTop;
        actualAlign = 'start';
      } else if (top > maxTop) {
        top = maxTop;
        actualAlign = 'end';
      }
    }
  }

  return { top, left, actualSide, actualAlign };
}
