import type React from 'react';

const MODAL_LAYER_SELECTOR = '[role="dialog"][aria-modal="true"]';

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
