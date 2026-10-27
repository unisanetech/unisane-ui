import type React from 'react';

const MODAL_LAYER_SELECTOR =
  '[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"]';

// Keep floating controls in the modal's accessible subtree. Shared modals put
// this boundary outside their animated/clipped panel so fixed coordinates stay
// viewport-relative, including in fullscreen and bottom-sheet presentations.
export function getPortalContainer(anchor: HTMLElement | null): HTMLElement {
  const modal = anchor?.closest<HTMLElement>(MODAL_LAYER_SELECTOR);
  return modal?.hasAttribute('data-unisane-modal-root') ? modal : document.body;
}

/** Follow an opening panel without a permanent per-frame positioning loop. */
export function observePortalAnchorMotion(anchor: HTMLElement | null, update: () => void) {
  let frame: number | undefined;
  const ancestors: HTMLElement[] = [];
  for (let node = anchor; node; node = node.parentElement) ancestors.push(node);
  const tick = () => {
    frame = undefined;
    update();
    if (
      ancestors.some((node) =>
        node.getAnimations?.().some((animation) => animation.playState === 'running'),
      )
    ) {
      frame = window.requestAnimationFrame(tick);
    }
  };
  const onMotion = (event: Event) => {
    if (!(event.target instanceof HTMLElement) || !ancestors.includes(event.target)) return;
    if (frame !== undefined) window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(tick);
  };
  const events = [
    'animationstart',
    'animationend',
    'animationcancel',
    'transitionrun',
    'transitionend',
    'transitioncancel',
  ];
  events.forEach((event) => window.addEventListener(event, onMotion, true));
  frame = window.requestAnimationFrame(tick);
  return () => {
    if (frame !== undefined) window.cancelAnimationFrame(frame);
    events.forEach((event) => window.removeEventListener(event, onMotion, true));
  };
}

export function getPortalLayerStyle(anchor: HTMLElement | null): React.CSSProperties | undefined {
  if (!anchor) {
    return undefined;
  }

  if (anchor.closest(MODAL_LAYER_SELECTOR)) {
    return {
      zIndex: 'calc(var(--z-modal, 3000) + 10)',
    };
  }

  return undefined;
}
