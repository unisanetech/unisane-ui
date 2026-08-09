// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatePicker } from '../../src/components/date-picker';

async function render(ui: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => root.render(ui));
  return {
    root,
    container,
    async rerender(nextUi: React.ReactNode) {
      await act(async () => root.render(nextUi));
    },
  };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => root.unmount());
  container.remove();
}

function getCalendarDialog() {
  return document.querySelector<HTMLDivElement>('[role="dialog"][aria-label="Choose date"]');
}

describe('DatePicker', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('opens a non-modal calendar from a keyboard-reachable trigger and restores focus on Escape', async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <DatePicker label="Date" defaultValue={new Date(2026, 2, 13)} onOpenChange={onOpenChange} />,
    );
    const trigger = rendered.container.querySelector<HTMLButtonElement>(
      'button[aria-label="Open calendar"]',
    );

    expect(trigger?.tabIndex).toBe(0);
    await act(async () => {
      trigger?.focus();
      trigger?.click();
    });

    const dialog = getCalendarDialog();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(dialog).not.toBeNull();
    expect(dialog?.hasAttribute('aria-modal')).toBe(false);
    expect(document.activeElement?.getAttribute('aria-label')).toContain('March 13, 2026');

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getCalendarDialog()).toBeNull();
    expect(document.activeElement).toBe(trigger);

    await cleanup(rendered.root, rendered.container);
  });

  it('selects a date, closes the popover, and keeps locale consistent across input and calendar', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <DatePicker
        label="Date"
        locale="fr-FR"
        defaultValue={new Date(2026, 2, 13)}
        onValueChange={onValueChange}
      />,
    );
    const trigger = rendered.container.querySelector<HTMLButtonElement>(
      'button[aria-label="Open calendar"]',
    );
    await act(async () => trigger?.click());

    expect(getCalendarDialog()?.textContent).toContain('mars 2026');
    const day = document.querySelector<HTMLButtonElement>('[aria-label^="20 mars 2026"]');
    await act(async () => day?.click());

    const selectedDate = onValueChange.mock.calls[0]?.[0] as Date | undefined;
    expect(selectedDate?.getFullYear()).toBe(2026);
    expect(selectedDate?.getMonth()).toBe(2);
    expect(selectedDate?.getDate()).toBe(20);
    expect(getCalendarDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('opens with Alt+ArrowDown when the calendar button is intentionally hidden', async () => {
    const rendered = await render(
      <DatePicker label="Date" showCalendarButton={false} defaultValue={new Date(2026, 2, 13)} />,
    );
    const month = rendered.container.querySelector<HTMLInputElement>('[aria-label="Date, month"]');

    expect(rendered.container.querySelector('button[aria-label="Open calendar"]')).toBeNull();
    await act(async () => {
      month?.focus();
      month?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true, bubbles: true }),
      );
    });

    expect(getCalendarDialog()).not.toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('supports non-portal rendering and outside dismissal', async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <DatePicker label="Date" defaultOpen portal={false} onOpenChange={onOpenChange} />,
    );
    const dialog = rendered.container.querySelector<HTMLDivElement>('[role="dialog"]');

    expect(dialog).not.toBeNull();
    expect(dialog?.classList.contains('absolute')).toBe(true);
    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(rendered.container.querySelector('[role="dialog"]')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('supports controlled open state without mutating the controlled source of truth', async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <DatePicker label="Date" value={new Date(2026, 2, 13)} open onOpenChange={onOpenChange} />,
    );

    expect(getCalendarDialog()).not.toBeNull();
    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getCalendarDialog()).not.toBeNull();

    await rendered.rerender(
      <DatePicker
        label="Date"
        value={new Date(2026, 2, 13)}
        open={false}
        onOpenChange={onOpenChange}
      />,
    );
    expect(getCalendarDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('renders safely during server-side rendering', () => {
    expect(() =>
      renderToString(<DatePicker label="Date" defaultValue={new Date(2026, 2, 13)} />),
    ).not.toThrow();
  });
});
