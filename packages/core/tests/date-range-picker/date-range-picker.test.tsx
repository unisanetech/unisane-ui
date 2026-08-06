// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DateRangePicker } from '../../src/components/date-range-picker';

async function render(ui: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => root.render(ui));
  return { root, container };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => root.unmount());
  container.remove();
}

async function click(element: Element | null | undefined) {
  await act(async () => element?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
}

describe('DateRangePicker', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    window.requestAnimationFrame = (callback) => {
      callback(0);
      return 1;
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps calendar selections as a draft until Apply is chosen', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <DateRangePicker
        label="Reporting period"
        value={{ start: new Date(2026, 2, 1), end: new Date(2026, 2, 7) }}
        onValueChange={onValueChange}
      />,
    );

    await click(rendered.container.querySelector('button[aria-haspopup="dialog"]'));
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    await click(document.querySelector('button[aria-label="March 10, 2026"]'));
    expect(document.querySelector('button[disabled]')?.textContent).toContain('Apply');
    expect(onValueChange).not.toHaveBeenCalled();

    await click(document.querySelector('button[aria-label="March 20, 2026"]'));
    await click(
      Array.from(document.querySelectorAll('button')).find(
        (button) => button.textContent === 'Apply',
      ),
    );

    const next = onValueChange.mock.calls[0]?.[0];
    expect(next.start.getDate()).toBe(10);
    expect(next.end.getDate()).toBe(20);
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('discards draft selection when Cancel is chosen', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <DateRangePicker
        value={{ start: new Date(2026, 2, 1), end: new Date(2026, 2, 7) }}
        onValueChange={onValueChange}
      />,
    );

    await click(rendered.container.querySelector('button[aria-haspopup="dialog"]'));
    await click(document.querySelector('button[aria-label="March 10, 2026"]'));
    await click(
      Array.from(document.querySelectorAll('button')).find(
        (button) => button.textContent === 'Cancel',
      ),
    );

    expect(onValueChange).not.toHaveBeenCalled();
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('exposes exact range context even when the visible trigger label is compact', async () => {
    const rendered = await render(
      <DateRangePicker
        label="Reporting period"
        triggerLabel="Custom"
        value={{ start: new Date(2026, 2, 1), end: new Date(2026, 2, 7) }}
      />,
    );
    const trigger = rendered.container.querySelector('button');

    expect(trigger?.textContent).toContain('Custom');
    expect(trigger?.getAttribute('aria-label')).toContain('Mar 1, 2026 – Mar 7, 2026');

    await cleanup(rendered.root, rendered.container);
  });

  it('moves the roving calendar focus with arrow keys', async () => {
    const rendered = await render(
      <DateRangePicker value={{ start: new Date(2026, 2, 1), end: new Date(2026, 2, 7) }} />,
    );

    await click(rendered.container.querySelector('button[aria-haspopup="dialog"]'));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const day = document.querySelector<HTMLButtonElement>('button[aria-label="March 7, 2026"]');
    expect(day).not.toBeNull();
    await act(async () => {
      day?.focus();
      day?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    });

    expect(document.activeElement?.getAttribute('aria-label')).toBe('March 8, 2026');

    await cleanup(rendered.root, rendered.container);
  });

  it('renders safely during server-side rendering', () => {
    expect(() =>
      renderToString(
        <DateRangePicker value={{ start: new Date(2026, 2, 1), end: new Date(2026, 2, 7) }} />,
      ),
    ).not.toThrow();
  });
});
