// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Sheet } from '../../src/components/sheet';

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

function getSheet() {
  return document.querySelector('[role="dialog"]') as HTMLDivElement | null;
}

describe('Sheet', () => {
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

  it('uses square edges for the default right sheet', async () => {
    const rendered = await render(
      <Sheet defaultOpen title="Edit profile">
        Body
      </Sheet>,
    );

    const sheet = getSheet();

    expect(sheet).not.toBeNull();
    expect(sheet?.className).toContain('rounded-none');
    expect(sheet?.className).not.toContain('rounded-l-lg');

    await cleanup(rendered.root, rendered.container);
  });

  it('keeps top radius for bottom sheets', async () => {
    const rendered = await render(
      <Sheet defaultOpen placement="bottom" title="Filters">
        Body
      </Sheet>,
    );

    const sheet = getSheet();

    expect(sheet).not.toBeNull();
    expect(sheet?.className).toContain('rounded-t-lg');
    expect(sheet?.className).toContain('rounded-b-none');

    await cleanup(rendered.root, rendered.container);
  });

  it('uses shared modal dismissal and background inertness', async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <Sheet defaultOpen onOpenChange={onOpenChange} title="Account settings">
        Body
      </Sheet>,
    );

    expect(rendered.container.hasAttribute('inert')).toBe(true);

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(rendered.container.hasAttribute('inert')).toBe(false);

    await cleanup(rendered.root, rendered.container);
  });
});
