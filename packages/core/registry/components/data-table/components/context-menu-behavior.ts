'use client';

import { useEffect, type KeyboardEvent, type RefObject } from 'react';
import { useOverlayBehavior } from '@/lib/utils';

export function useContextMenuBehavior({
  open,
  menuRef,
  onClose,
}: {
  open: boolean;
  menuRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  useOverlayBehavior({
    open,
    contentRef: menuRef,
    onDismiss: onClose,
    modal: false,
    dismissOnEscape: true,
    dismissOnInteractOutside: true,
    initialFocus: true,
    restoreFocus: true,
  });

  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', onClose, true);
    return () => window.removeEventListener('scroll', onClose, true);
  }, [onClose, open]);

  return (event: KeyboardEvent<HTMLElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      ),
    );
    if (items.length === 0) return;
    event.preventDefault();
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : event.key === 'ArrowUp'
            ? (currentIndex - 1 + items.length) % items.length
            : (currentIndex + 1) % items.length;
    items[nextIndex]?.focus();
  };
}
