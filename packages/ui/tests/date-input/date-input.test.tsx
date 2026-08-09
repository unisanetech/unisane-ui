// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DateInput } from '../../src/components/date-input';

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

describe('DateInput', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('uses canonical field semantics and links every segment to the active message', async () => {
    const rendered = await render(
      <DateInput label="Birth date" required invalid errorMessage="Enter a valid birth date." />,
    );
    const segments = Array.from(
      rendered.container.querySelectorAll<HTMLInputElement>('[role="spinbutton"]'),
    );
    const error = rendered.container.querySelector('[role="alert"]');

    expect(segments).toHaveLength(3);
    expect(segments.map((segment) => segment.getAttribute('aria-label'))).toEqual([
      'Birth date, month',
      'Birth date, day',
      'Birth date, year',
    ]);
    expect(error?.textContent).toBe('Enter a valid birth date.');
    expect(segments.every((segment) => segment.getAttribute('aria-invalid') === 'true')).toBe(true);
    expect(segments.every((segment) => segment.getAttribute('aria-required') === 'true')).toBe(
      true,
    );
    expect(
      segments.every((segment) => segment.getAttribute('aria-describedby') === error?.id),
    ).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });

  it('resolves explicit format order and commits direct segmented input on field blur', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <DateInput label="Start date" format="dd.MM.yyyy" onValueChange={onValueChange} />,
    );
    const segments = Array.from(
      rendered.container.querySelectorAll<HTMLInputElement>('[role="spinbutton"]'),
    );
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    expect(segments.map((segment) => segment.getAttribute('aria-label'))).toEqual([
      'Start date, day',
      'Start date, month',
      'Start date, year',
    ]);

    const keys = [
      [segments[0], '1', '3'],
      [segments[1], '0', '7'],
      [segments[2], '2', '0', '2', '6'],
    ] as const;
    for (const [segment, ...digits] of keys) {
      await act(async () => segment?.focus());
      for (const key of digits) {
        await act(async () =>
          segment?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })),
        );
      }
    }
    await act(async () => outside.focus());

    const nextDate = onValueChange.mock.calls.at(-1)?.[0] as Date | undefined;
    expect(nextDate?.getFullYear()).toBe(2026);
    expect(nextDate?.getMonth()).toBe(6);
    expect(nextDate?.getDate()).toBe(13);

    outside.remove();
    await cleanup(rendered.root, rendered.container);
  });

  it('supports arrow adjustment, hidden labels, descriptions, and native form serialization', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <DateInput
        label="Invoice date"
        hideLabel
        name="invoiceDate"
        description="Uses your local calendar date."
        defaultValue={new Date(2026, 2, 13)}
        onValueChange={onValueChange}
      />,
    );
    const month = rendered.container.querySelector<HTMLInputElement>(
      '[aria-label="Invoice date, month"]',
    );
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    expect(rendered.container.querySelector('label')?.classList.contains('sr-only')).toBe(true);
    expect(rendered.container.querySelector<HTMLInputElement>('input[type="hidden"]')?.value).toBe(
      '2026-03-13',
    );

    await act(async () => {
      month?.focus();
      month?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      outside.focus();
    });

    const nextDate = onValueChange.mock.calls.at(-1)?.[0] as Date | undefined;
    expect(nextDate?.getMonth()).toBe(3);
    expect(nextDate?.getDate()).toBe(13);

    outside.remove();
    await cleanup(rendered.root, rendered.container);
  });

  it('rejects complete dates outside the allowed day range', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <DateInput
        label="Appointment"
        defaultValue={new Date(2026, 2, 13)}
        min={new Date(2026, 2, 10, 18)}
        max={new Date(2026, 2, 20, 8)}
        onValueChange={onValueChange}
      />,
    );
    const day = rendered.container.querySelector<HTMLInputElement>(
      '[aria-label="Appointment, day"]',
    );
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    await act(async () => {
      day?.focus();
      day?.dispatchEvent(new KeyboardEvent('keydown', { key: '0', bubbles: true }));
      day?.dispatchEvent(new KeyboardEvent('keydown', { key: '9', bubbles: true }));
      outside.focus();
    });

    expect(onValueChange).toHaveBeenLastCalledWith(undefined);

    outside.remove();
    await cleanup(rendered.root, rendered.container);
  });
});
