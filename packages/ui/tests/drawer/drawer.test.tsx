// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Drawer } from '../../src/components/drawer';

async function render(ui: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(ui);
  });

  return {
    root,
    container,
  };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

function getDrawer() {
  return document.querySelector('[role="dialog"]') as HTMLDivElement | null;
}

describe('Drawer', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('renders as a bottom drawer with a themed handle', async () => {
    const rendered = await render(
      <Drawer defaultOpen title="Filters">
        Body
      </Drawer>,
    );

    const drawer = getDrawer();

    expect(drawer).not.toBeNull();
    expect(drawer?.className).toContain('rounded-t-lg');
    expect(drawer?.getAttribute('data-vaul-drawer-direction')).toBe('bottom');
    expect(document.querySelector('[data-vaul-handle]')).not.toBeNull();
    expect(document.querySelector('button[aria-label="Close drawer"]')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('requests close from the optional close button', async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <Drawer defaultOpen title="Filters" showCloseButton onOpenChange={onOpenChange}>
        Body
      </Drawer>,
    );
    const closeButton = document.querySelector('button[aria-label="Close drawer"]');

    expect(closeButton).not.toBeNull();

    await act(async () => {
      closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);

    await cleanup(rendered.root, rendered.container);
  });
});
