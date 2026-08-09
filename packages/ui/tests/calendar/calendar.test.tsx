// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Calendar } from '../../src/components/calendar';

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

describe('Calendar', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a localized grid with truthful selected and current-date semantics', async () => {
    const selectedDate = new Date(2024, 11, 15);
    const rendered = await render(
      <Calendar selectedDate={selectedDate} locale="fr-FR" weekStartsOn={1} />,
    );
    const grid = rendered.container.querySelector('[role="grid"]');
    const headers = Array.from(
      rendered.container.querySelectorAll<HTMLElement>('[role="columnheader"]'),
    );
    const selected = rendered.container.querySelector<HTMLButtonElement>(
      '[role="gridcell"][aria-selected="true"]',
    );

    expect(grid?.getAttribute('aria-label')).toContain('décembre 2024');
    expect(headers[0]?.getAttribute('aria-label')).toMatch(/^lun/i);
    expect(selected?.getAttribute('aria-label')).toContain('15 décembre 2024');
    expect(rendered.container.querySelector('[role="application"]')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('moves roving focus across month boundaries with arrow keys', async () => {
    const rendered = await render(
      <Calendar selectedDate={new Date(2026, 2, 31)} locale="en-US" autoFocus />,
    );
    const march31 = rendered.container.querySelector<HTMLButtonElement>(
      '[aria-label^="March 31, 2026"]',
    );

    expect(document.activeElement).toBe(march31);
    await act(async () => {
      march31?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    });

    const april1 = rendered.container.querySelector<HTMLButtonElement>(
      '[aria-label^="April 1, 2026"]',
    );
    expect(rendered.container.textContent).toContain('April 2026');
    expect(document.activeElement).toBe(april1);
    expect(april1?.tabIndex).toBe(0);

    await cleanup(rendered.root, rendered.container);
  });

  it('enforces day bounds and disables month navigation beyond them', async () => {
    const rendered = await render(
      <Calendar
        selectedDate={new Date(2026, 2, 13)}
        min={new Date(2026, 2, 10, 18)}
        max={new Date(2026, 2, 20, 8)}
      />,
    );
    const previous = rendered.container.querySelector<HTMLButtonElement>(
      'button[aria-label="Previous month"]',
    );
    const next = rendered.container.querySelector<HTMLButtonElement>(
      'button[aria-label="Next month"]',
    );
    const march9 = rendered.container.querySelector<HTMLButtonElement>(
      '[aria-label^="March 9, 2026"]',
    );
    const march10 = rendered.container.querySelector<HTMLButtonElement>(
      '[aria-label^="March 10, 2026"]',
    );

    expect(previous?.disabled).toBe(true);
    expect(next?.disabled).toBe(true);
    expect(march9?.disabled).toBe(true);
    expect(march10?.disabled).toBe(false);

    await cleanup(rendered.root, rendered.container);
  });

  it('selects enabled dates and exposes today through aria-current', async () => {
    const onDateSelect = vi.fn();
    const today = new Date();
    const rendered = await render(
      <Calendar selectedDate={today} onDateSelect={onDateSelect} locale="en-US" />,
    );
    const todayButton = rendered.container.querySelector<HTMLButtonElement>(
      '[role="gridcell"][aria-current="date"]',
    );

    await act(async () => todayButton?.click());

    expect(todayButton?.getAttribute('aria-selected')).toBe('true');
    expect(onDateSelect).toHaveBeenCalledTimes(1);
    expect((onDateSelect.mock.calls[0]?.[0] as Date).getDate()).toBe(today.getDate());

    await cleanup(rendered.root, rendered.container);
  });
});
