'use client';

import * as React from 'react';

export type AnchoredOverlaySide = 'top' | 'bottom';

export interface UseAnchoredOverlayPositionOptions {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  portal?: boolean;
  minimumWidth?: number;
  estimatedHeight?: number;
  sideOffset?: number;
  collisionPadding?: number;
}

export interface AnchoredOverlayPosition {
  top: number;
  left: number;
  width: number;
  side: AnchoredOverlaySide;
  positioned: boolean;
}

export function useAnchoredOverlayPosition({
  open,
  anchorRef,
  contentRef,
  portal = true,
  minimumWidth = 320,
  estimatedHeight = 360,
  sideOffset = 8,
  collisionPadding = 8,
}: UseAnchoredOverlayPositionOptions): AnchoredOverlayPosition {
  const [position, setPosition] = React.useState<AnchoredOverlayPosition>({
    top: 0,
    left: 0,
    width: minimumWidth,
    side: 'bottom',
    positioned: !portal,
  });

  const updatePosition = React.useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor || typeof window === 'undefined') return;

    const rect = anchor.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const availableWidth = Math.max(0, viewportWidth - collisionPadding * 2);
    const width = Math.min(Math.max(rect.width, minimumWidth), availableWidth);
    const left = Math.min(
      Math.max(collisionPadding, rect.left),
      Math.max(collisionPadding, viewportWidth - width - collisionPadding),
    );
    const contentHeight = contentRef.current?.offsetHeight || estimatedHeight;
    const spaceBelow = viewportHeight - rect.bottom - collisionPadding;
    const spaceAbove = rect.top - collisionPadding;
    const side: AnchoredOverlaySide =
      spaceBelow < contentHeight + sideOffset && spaceAbove > spaceBelow ? 'top' : 'bottom';
    const preferredTop =
      side === 'top' ? rect.top - contentHeight - sideOffset : rect.bottom + sideOffset;
    const top = Math.min(
      Math.max(collisionPadding, preferredTop),
      Math.max(collisionPadding, viewportHeight - contentHeight - collisionPadding),
    );

    setPosition({ top, left, width, side, positioned: true });
  }, [anchorRef, collisionPadding, contentRef, estimatedHeight, minimumWidth, sideOffset]);

  React.useLayoutEffect(() => {
    if (!portal) {
      setPosition((current) => ({ ...current, positioned: true }));
      return;
    }
    if (!open) {
      setPosition((current) => ({ ...current, positioned: false }));
      return;
    }

    updatePosition();
    const frame = window.requestAnimationFrame(updatePosition);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, portal, updatePosition]);

  return position;
}
