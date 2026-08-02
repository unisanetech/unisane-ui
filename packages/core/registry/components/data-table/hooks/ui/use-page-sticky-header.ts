'use client';

import { useEffect } from 'react';
import type { RefObject } from 'react';
import { findVerticalScrollOwner } from '@/components/ui/data-table/utils/scroll-owner';

interface UsePageStickyHeaderOptions {
  enabled: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
  tableContainerRef: RefObject<HTMLDivElement | null>;
  headerRef: RefObject<HTMLTableSectionElement | null>;
  overlayElement: HTMLDivElement | null;
  stickyOffset: string;
}

function resolveCssLength(root: HTMLElement, value: string): number {
  const probe = document.createElement('span');
  probe.setAttribute('aria-hidden', 'true');
  Object.assign(probe.style, {
    position: 'fixed',
    top: value,
    left: '0',
    width: '0',
    height: '0',
    visibility: 'hidden',
    pointerEvents: 'none',
  });
  root.append(probe);
  const resolved = probe.getBoundingClientRect().top;
  probe.remove();
  return Number.isFinite(resolved) ? resolved : 0;
}

export function usePageStickyHeader({
  enabled,
  rootRef,
  tableContainerRef,
  headerRef,
  overlayElement,
  stickyOffset,
}: UsePageStickyHeaderOptions) {
  useEffect(() => {
    const root = rootRef.current;
    const container = tableContainerRef.current;
    const header = headerRef.current;
    const overlay = overlayElement;
    if (!enabled || !root || !container || !header || !overlay) return;

    const table = container.querySelector('table');
    if (!(table instanceof HTMLTableElement)) return;

    const scrollOwner = findVerticalScrollOwner(root);
    let animationFrame: number | null = null;
    let isSyncingHorizontalScroll = false;
    let isStuck = false;

    const setStuck = (nextStuck: boolean) => {
      if (isStuck === nextStuck) return;
      isStuck = nextStuck;
      overlay.hidden = !nextStuck;
      overlay.setAttribute('aria-hidden', String(!nextStuck));
      header.style.visibility = nextStuck ? 'hidden' : '';
      header.setAttribute('aria-hidden', String(nextStuck));
      header.inert = nextStuck;
      header.toggleAttribute('data-stuck', nextStuck);
    };

    const syncOverlayScroll = () => {
      if (isSyncingHorizontalScroll || overlay.scrollLeft === container.scrollLeft) return;
      isSyncingHorizontalScroll = true;
      overlay.scrollLeft = container.scrollLeft;
      isSyncingHorizontalScroll = false;
    };

    const syncContainerScroll = () => {
      if (isSyncingHorizontalScroll || container.scrollLeft === overlay.scrollLeft) return;
      isSyncingHorizontalScroll = true;
      container.scrollLeft = overlay.scrollLeft;
      isSyncingHorizontalScroll = false;
    };

    const update = () => {
      animationFrame = null;
      const containerRect = container.getBoundingClientRect();
      const tableRect = table.getBoundingClientRect();
      const headerHeight = header.offsetHeight;
      const scrollOwnerRect = scrollOwner?.getBoundingClientRect();
      const scrollOwnerTop = Math.max(0, scrollOwnerRect?.top ?? 0);
      const scrollOwnerLeft = Math.max(0, scrollOwnerRect?.left ?? 0);
      const scrollOwnerRight = Math.min(
        window.innerWidth,
        scrollOwnerRect?.right ?? window.innerWidth,
      );
      const toolbarHeight = Number.parseFloat(
        window.getComputedStyle(root).getPropertyValue('--data-table-header-offset'),
      );
      const targetTop =
        scrollOwnerTop +
        resolveCssLength(root, stickyOffset) +
        (Number.isFinite(toolbarHeight) ? toolbarHeight : 0);
      const overlayLeft = Math.max(containerRect.left, scrollOwnerLeft);
      const overlayRight = Math.min(containerRect.right, scrollOwnerRight);
      const shouldStick =
        containerRect.top < targetTop && tableRect.bottom > targetTop + headerHeight;

      overlay.style.top = `${targetTop}px`;
      overlay.style.left = `${overlayLeft}px`;
      overlay.style.width = `${Math.max(0, overlayRight - overlayLeft)}px`;
      overlay.style.height = `${headerHeight}px`;
      const overlayTable = overlay.querySelector('table');
      if (overlayTable instanceof HTMLTableElement) {
        overlayTable.style.width = `${table.scrollWidth}px`;
      }
      syncOverlayScroll();
      setStuck(shouldStick);
    };

    const scheduleUpdate = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(root);
    resizeObserver.observe(container);
    resizeObserver.observe(table);
    resizeObserver.observe(header);
    const mutationObserver = new MutationObserver(scheduleUpdate);
    mutationObserver.observe(root, { attributes: true, attributeFilter: ['style'] });
    container.addEventListener('scroll', syncOverlayScroll, { passive: true });
    overlay.addEventListener('scroll', syncContainerScroll, { passive: true });
    window.addEventListener('scroll', scheduleUpdate, true);
    window.addEventListener('resize', scheduleUpdate);
    scheduleUpdate();

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      container.removeEventListener('scroll', syncOverlayScroll);
      overlay.removeEventListener('scroll', syncContainerScroll);
      window.removeEventListener('scroll', scheduleUpdate, true);
      window.removeEventListener('resize', scheduleUpdate);
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      header.style.removeProperty('visibility');
      header.removeAttribute('aria-hidden');
      header.inert = false;
      header.removeAttribute('data-stuck');
    };
  }, [enabled, headerRef, overlayElement, rootRef, stickyOffset, tableContainerRef]);
}
