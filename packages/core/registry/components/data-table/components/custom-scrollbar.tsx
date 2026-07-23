'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useSafeRAF } from '@/components/ui/data-table/hooks/use-safe-raf';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const SCROLLBAR_HEIGHT = 10;
const MIN_THUMB_WIDTH = 30;

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface CustomScrollbarProps {
  /** Ref to the table container element */
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  /** Width of left-pinned columns (scrollbar track starts after this) */
  pinnedLeftWidth: number;
  /** Width of right-pinned columns (scrollbar track ends before this) */
  pinnedRightWidth: number;
  /** Dependencies that should trigger scrollbar recalculation */
  dependencies?: unknown[];
  /** Additional class names */
  className?: string;
  /** Ref to the DataTable root container for sticky positioning */
  dataTableRef?: React.RefObject<HTMLDivElement | null>;
  /** When false, keep the scrollbar anchored to the table shell instead of the viewport */
  allowViewportSticky?: boolean;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  tableContainerRef,
  pinnedLeftWidth,
  pinnedRightWidth,
  dependencies = [],
  className = '',
  dataTableRef,
  allowViewportSticky = true,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const scrollbarRef = useRef<HTMLDivElement | null>(null);

  // State
  const [thumbWidth, setThumbWidth] = useState(0);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [trackInsets, setTrackInsets] = useState({
    left: pinnedLeftWidth,
    right: pinnedRightWidth,
  });
  const [isSticky, setIsSticky] = useState(false);
  const [stickyPosition, setStickyPosition] = useState<{ left: number; width: number } | null>(
    null,
  );

  // Drag refs
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const thumbWidthRef = useRef(thumbWidth);

  // Safe RAF for DOM operations
  const { requestFrame } = useSafeRAF();

  const measureTrackInsets = useCallback(
    (container: HTMLDivElement) => {
      if (typeof window === 'undefined') {
        return { left: pinnedLeftWidth, right: pinnedRightWidth };
      }

      const fallback = { left: pinnedLeftWidth, right: pinnedRightWidth };
      const containerRect = container.getBoundingClientRect();
      const table = container.querySelector('table');
      if (!(table instanceof HTMLElement)) {
        return fallback;
      }

      const headerCells = Array.from(table.querySelectorAll('thead tr:last-child > th'));
      if (headerCells.length === 0) {
        return fallback;
      }

      const leftStickyCells = headerCells.filter((cell) => {
        const style = window.getComputedStyle(cell);
        return style.position === 'sticky' && style.left !== 'auto';
      });
      const rightStickyCells = headerCells.filter((cell) => {
        const style = window.getComputedStyle(cell);
        return style.position === 'sticky' && style.right !== 'auto';
      });

      const clampInset = (value: number) =>
        Math.max(0, Math.min(container.clientWidth, Math.round(value)));

      const leftInset =
        leftStickyCells.length > 0
          ? clampInset(
              Math.max(
                ...leftStickyCells.map((cell) => {
                  const rect = cell.getBoundingClientRect();
                  return rect.right - containerRect.left;
                }),
              ),
            )
          : 0;
      const rightInset =
        rightStickyCells.length > 0
          ? clampInset(
              Math.max(
                ...rightStickyCells.map((cell) => {
                  const rect = cell.getBoundingClientRect();
                  return containerRect.right - rect.left;
                }),
              ),
            )
          : 0;

      if (leftInset + rightInset > container.clientWidth) {
        return {
          left: clampInset(fallback.left),
          right: clampInset(fallback.right),
        };
      }

      return {
        left: Number.isFinite(leftInset) ? leftInset : fallback.left,
        right: Number.isFinite(rightInset) ? rightInset : fallback.right,
      };
    },
    [pinnedLeftWidth, pinnedRightWidth],
  );

  useEffect(() => {
    thumbWidthRef.current = thumbWidth;
  }, [thumbWidth]);

  // Update scrollbar dimensions
  const updateScrollbar = useCallback(() => {
    const container = tableContainerRef.current;
    const track = trackRef.current;

    if (!container) return;

    setTrackInsets(measureTrackInsets(container));

    const { scrollWidth, clientWidth, scrollLeft } = container;
    const overflow = scrollWidth > clientWidth;

    setHasOverflow(overflow);

    if (!overflow || !track) return;

    const trackWidth = track.clientWidth;
    if (trackWidth <= 0) return;

    const ratio = clientWidth / scrollWidth;
    const newThumbWidth = Math.max(ratio * trackWidth, MIN_THUMB_WIDTH);
    const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);
    const maxThumbLeft = Math.max(0, trackWidth - newThumbWidth);
    const newThumbLeft = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * maxThumbLeft : 0;

    setThumbWidth(newThumbWidth);
    setThumbLeft(newThumbLeft);
  }, [tableContainerRef, measureTrackInsets]);

  // Setup listeners
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    // Initial update after a frame to ensure DOM is ready
    requestFrame(updateScrollbar);

    container.addEventListener('scroll', updateScrollbar, { passive: true });
    window.addEventListener('resize', updateScrollbar);

    const observer = new ResizeObserver(updateScrollbar);
    observer.observe(container);

    return () => {
      container.removeEventListener('scroll', updateScrollbar);
      window.removeEventListener('resize', updateScrollbar);
      observer.disconnect();
    };
  }, [tableContainerRef, updateScrollbar, requestFrame]);

  // Re-run when dependencies change
  // Using JSON.stringify for stable dependency comparison to avoid issues with array spread
  const dependenciesKey = useMemo(() => JSON.stringify(dependencies), [dependencies]);
  useEffect(() => {
    requestFrame(updateScrollbar);
  }, [pinnedLeftWidth, pinnedRightWidth, dependenciesKey, requestFrame, updateScrollbar]);

  // ─── STICKY POSITION LOGIC ────────────────────────────────────────────────────
  // Scrollbar sticks to viewport bottom until table bottom comes into view

  const updateStickyState = useCallback(() => {
    const dataTable = dataTableRef?.current;

    if (!allowViewportSticky || !dataTable || !hasOverflow) {
      setIsSticky(false);
      setStickyPosition(null);
      return;
    }

    const dataTableRect = dataTable.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // The scrollbar's natural position is at the bottom of the DataTable
    // We need to check if that natural position is visible in the viewport

    // When NOT sticky, the scrollbar sits at the bottom of the DataTable
    // When the table bottom comes into viewport (with room for scrollbar), unstick
    const scrollbarNaturalBottom = dataTableRect.bottom;
    const scrollbarNaturalTop = scrollbarNaturalBottom - SCROLLBAR_HEIGHT;

    // Scrollbar should be sticky when its natural position is below the viewport
    // i.e., when you'd have to scroll down to see it
    const naturalPositionBelowViewport = scrollbarNaturalTop > viewportHeight;

    // Also check if the table top is still visible (table hasn't scrolled completely out)
    // The table should still be partially visible for the scrollbar to be useful
    const tableStillVisible = dataTableRect.top < viewportHeight;

    // Be sticky when natural scrollbar position is below viewport AND table is visible
    const shouldBeSticky = naturalPositionBelowViewport && tableStillVisible;

    setIsSticky(shouldBeSticky);

    // Update position for fixed positioning (needs to track horizontal position)
    if (shouldBeSticky) {
      setStickyPosition({
        left: dataTableRect.left,
        width: dataTableRect.width,
      });
    } else {
      setStickyPosition(null);
    }
  }, [allowViewportSticky, dataTableRef, hasOverflow]);

  // Listen for scroll and resize to update sticky state
  // Consolidated: Use requestAnimationFrame to throttle updates and prevent excessive calls
  useEffect(() => {
    if (!allowViewportSticky || !dataTableRef?.current) {
      setIsSticky(false);
      setStickyPosition(null);
      return;
    }

    let scheduled = false;

    // Throttled update using requestAnimationFrame
    const throttledUpdate = () => {
      if (scheduled) return; // Already scheduled
      scheduled = true;
      requestFrame(() => {
        scheduled = false;
        updateStickyState();
      });
    };

    // Initial check
    throttledUpdate();

    // Single scroll listener on window with capture to catch all scrolls
    // This handles both window scroll and parent container scrolls
    window.addEventListener('scroll', throttledUpdate, { passive: true, capture: true });
    window.addEventListener('resize', throttledUpdate, { passive: true });

    // ResizeObserver for DataTable size changes
    const resizeObserver = new ResizeObserver(throttledUpdate);
    resizeObserver.observe(dataTableRef.current);

    // IntersectionObserver for visibility changes (minimal thresholds)
    const intersectionObserver = new IntersectionObserver(throttledUpdate, {
      threshold: [0, 1],
    });
    intersectionObserver.observe(dataTableRef.current);

    return () => {
      const scrollListenerOptions: EventListenerOptions = { capture: true };
      window.removeEventListener('scroll', throttledUpdate, scrollListenerOptions);
      window.removeEventListener('resize', throttledUpdate);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [allowViewportSticky, dataTableRef, updateStickyState, requestFrame]);

  // Update sticky when hasOverflow changes
  useEffect(() => {
    if (hasOverflow) {
      // Small delay to ensure DOM has updated
      requestFrame(updateStickyState);
    } else {
      setIsSticky(false);
      setStickyPosition(null);
    }
  }, [hasOverflow, updateStickyState, requestFrame]);

  // Drag handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const container = tableContainerRef.current;
      if (!container) return;

      setIsDragging(true);
      startXRef.current = e.clientX;
      startScrollLeftRef.current = container.scrollLeft;

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    },
    [tableContainerRef],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = tableContainerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const deltaX = e.clientX - startXRef.current;
      const trackWidth = track.clientWidth;
      const currentThumbWidth = thumbWidthRef.current;
      const maxThumbLeft = Math.max(0, trackWidth - currentThumbWidth);
      const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);

      if (maxThumbLeft === 0 || maxScrollLeft === 0) return;

      const ratio = maxScrollLeft / maxThumbLeft;
      const newScrollLeft = Math.max(
        0,
        Math.min(maxScrollLeft, startScrollLeftRef.current + deltaX * ratio),
      );

      container.scrollLeft = newScrollLeft;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.removeProperty('user-select');
      document.body.style.removeProperty('cursor');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, tableContainerRef]);

  // Track click handler
  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      const container = tableContainerRef.current;
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!container || !track || !thumb) return;

      // Don't handle if clicking on thumb
      if (e.target === thumb) return;

      const trackRect = track.getBoundingClientRect();
      const clickX = e.clientX - trackRect.left;
      const trackWidth = track.clientWidth;
      const currentThumbWidth = thumbWidthRef.current;
      const maxThumbLeft = Math.max(0, trackWidth - currentThumbWidth);
      const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);

      // Center the thumb on the click position
      const targetThumbLeft = Math.max(0, Math.min(maxThumbLeft, clickX - currentThumbWidth / 2));

      if (maxThumbLeft > 0) {
        const newScrollLeft = (targetThumbLeft / maxThumbLeft) * maxScrollLeft;
        container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      }
    },
    [tableContainerRef],
  );

  // Render scrollbar container - hidden on mobile where native touch scrollbar is used
  // When sticky, the scrollbar is fixed to viewport bottom with same horizontal bounds as table
  return (
    <>
      {/* Placeholder to maintain layout space when scrollbar is fixed */}
      {allowViewportSticky && isSticky && (
        <div
          className="hidden @md:block"
          style={{ height: `${SCROLLBAR_HEIGHT}px` }}
          aria-hidden="true"
        />
      )}
      <div
        ref={scrollbarRef}
        data-datatable-custom-scrollbar="true"
        className={cn(
          'bg-surface overflow-hidden',
          // Hide on mobile (< @md) - native scrollbar used for touch usability
          'hidden @md:block',
          // Sticky positioning when table bottom is below viewport
          isSticky ? 'fixed bottom-0 z-50' : 'relative w-full',
          className,
        )}
        style={{
          height: `${SCROLLBAR_HEIGHT}px`,
          // When sticky, use tracked position for horizontal alignment
          ...(isSticky && stickyPosition
            ? {
                left: stickyPosition.left,
                width: stickyPosition.width,
              }
            : {}),
        }}
      >
        {/* Track - only show contents when there's overflow */}
        <div
          ref={trackRef}
          onClick={hasOverflow ? handleTrackClick : undefined}
          className={cn(
            'absolute top-0 bottom-0 transition-colors',
            hasOverflow && 'cursor-pointer',
            hasOverflow &&
              (isDragging ? 'bg-outline-soft' : 'bg-outline-subtle hover:bg-outline-soft'),
          )}
          style={{
            left: trackInsets.left,
            right: trackInsets.right,
          }}
        >
          {/* Thumb - only render when there's overflow */}
          {hasOverflow && thumbWidth > 0 && (
            <div
              ref={thumbRef}
              className={cn(
                'absolute top-0 bottom-0 transition-colors',
                isDragging ? 'bg-primary' : 'bg-outline-medium hover:bg-outline-strong',
              )}
              style={{
                width: thumbWidth,
                transform: `translateX(${thumbLeft}px)`,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              onMouseDown={handleMouseDown}
            />
          )}
        </div>
      </div>
    </>
  );
};

CustomScrollbar.displayName = 'CustomScrollbar';
