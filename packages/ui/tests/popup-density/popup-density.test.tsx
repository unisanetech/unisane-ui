// @vitest-environment happy-dom
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { PopupDensityProvider } from '../../src/layout/popup-density-provider';
import { SelectField } from '../../src/components/select-field';
import { Combobox } from '../../src/components/combobox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../src/components/dropdown-menu';

let root: Root;
let host: HTMLDivElement;
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
});
const options = [
  { value: 'one', label: 'First option' },
  { value: 'two', label: 'Second option', disabled: true },
];

it.each(['select', 'combobox'] as const)(
  'keeps %s input sizing independent while its portal inherits compact density',
  async (kind) => {
    const changed = vi.fn();
    const field =
      kind === 'select' ? (
        <SelectField label="Choice" size="lg" options={options} onValueChange={changed} />
      ) : (
        <Combobox label="Choice" size="lg" options={options} onValueChange={changed} />
      );
    await act(async () =>
      root.render(<PopupDensityProvider density="compact">{field}</PopupDensityProvider>),
    );
    const trigger = host.querySelector<HTMLElement>('[role="combobox"]')!;
    const geometry = (element: HTMLElement) =>
      element.className
        .split(' ')
        .filter((value) => value.startsWith('h-[') || value.startsWith('text-body-'));
    const originalClasses = geometry(trigger);
    await act(async () => trigger.click());
    const option = document.querySelector<HTMLElement>('[role="option"]')!;
    expect(host.contains(option)).toBe(false);
    expect(option.className).toContain('text-body-medium');
    expect(option.className).not.toContain('text-body-large');
    expect(option.className).toContain('pointer:coarse');
    expect(geometry(trigger)).toEqual(originalClasses);
    expect(document.querySelector('[role="option"][aria-disabled="true"]')).not.toBeNull();
    await act(async () => option.click());
    expect(changed).toHaveBeenCalledWith('one');
  },
);

it('supports nested opt-out without changing the surrounding compact provider', async () => {
  await act(async () =>
    root.render(
      <PopupDensityProvider density="compact">
        <PopupDensityProvider>
          <SelectField label="Legacy choice" size="md" defaultOpen options={options} />
        </PopupDensityProvider>
      </PopupDensityProvider>,
    ),
  );
  expect(document.querySelector('[role="option"]')?.className).toContain('text-body-large');
});

it('updates portal rows when density changes without resetting the selected value', async () => {
  const field = <SelectField label="Choice" defaultValue="one" defaultOpen options={options} />;
  await act(async () =>
    root.render(<PopupDensityProvider density="compact">{field}</PopupDensityProvider>),
  );
  await act(async () =>
    root.render(<PopupDensityProvider density="comfortable">{field}</PopupDensityProvider>),
  );
  const selected = document.querySelector('[role="option"][aria-selected="true"]')!;
  expect(selected.textContent).toContain('First option');
  expect(selected.className).toContain('--size-action-md');
});

it('applies the same compact recipe to a portalled dropdown despite its larger menu size', async () => {
  await act(async () =>
    root.render(
      <PopupDensityProvider density="compact">
        <DropdownMenu>
          <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
          <DropdownMenuContent size="lg">
            <DropdownMenuItem>Review</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PopupDensityProvider>,
    ),
  );
  await act(async () => host.querySelector<HTMLButtonElement>('button')!.click());
  const row = document.querySelector('[role="menuitem"]')!;
  expect(host.contains(row)).toBe(false);
  expect(row.className).toContain('--size-action-sm');
  expect(row.className).not.toContain('--size-action-lg');
});
