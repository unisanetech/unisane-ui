// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Dialog } from '../../src/components/dialog';
import { Popover } from '../../src/components/popover';

async function render(ui: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(ui);
  });

  return { root, container };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

describe('Popover', () => {
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

  it('uses non-modal dialog semantics and dismisses outside', async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <Popover
        defaultOpen
        onOpenChange={onOpenChange}
        trigger="Open filters"
        content={<button type="button">Apply</button>}
      />,
    );

    const popover = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(popover).not.toBeNull();
    expect(popover.hasAttribute('aria-modal')).toBe(false);
    expect(document.body.innerHTML).not.toContain('data-unisane-');

    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('dismisses only the topmost layer on Escape', async () => {
    const onDialogChange = vi.fn();
    const onPopoverChange = vi.fn();
    const rendered = await render(
      <Dialog defaultOpen onOpenChange={onDialogChange} title="Preferences">
        <Popover
          defaultOpen
          onOpenChange={onPopoverChange}
          trigger="More options"
          content={<button type="button">Nested action</button>}
        />
      </Dialog>,
    );

    const nestedPopover = document.querySelector(
      '[role="dialog"]:not([aria-modal])',
    ) as HTMLElement;
    expect(nestedPopover.hasAttribute('inert')).toBe(false);

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(onPopoverChange).toHaveBeenCalledWith(false);
    expect(onDialogChange).not.toHaveBeenCalled();
    expect(document.querySelector('[aria-modal="true"]')).not.toBeNull();
    expect(document.activeElement?.textContent).toContain('More options');

    await cleanup(rendered.root, rendered.container);
  });

  it('uses an interactive element trigger without nesting another button', async () => {
    const rendered = await render(
      <Popover
        trigger={<button type="button">Open details</button>}
        content={<button type="button">Apply</button>}
      />,
    );
    const trigger = rendered.container.querySelector(
      'button[aria-haspopup="dialog"]',
    ) as HTMLButtonElement | null;

    expect(trigger).not.toBeNull();
    expect(trigger?.querySelector('button')).toBeNull();

    await act(async () => {
      trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    await cleanup(rendered.root, rendered.container);
  });
});
