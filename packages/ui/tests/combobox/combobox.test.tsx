// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Combobox } from '../../src/components/combobox';
import { Dialog } from '../../src/components/dialog';
import { Sheet } from '../../src/components/sheet';

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', disabled: true },
];

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
    async rerender(nextUi: React.ReactNode) {
      await act(async () => {
        root.render(nextUi);
      });
    },
  };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

describe('Combobox', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it.each([Dialog, Sheet])(
    'keeps choices inside the modal without moving them into its clipped panel (%s)',
    async (Modal) => {
      const selected = vi.fn();
      const dismissed = vi.fn();
      const rendered = await render(
        <Modal defaultOpen title="Choose item" onOpenChange={dismissed}>
          <Combobox label="Fruit" options={OPTIONS} onValueChange={selected} />
        </Modal>,
      );
      const modal = document.querySelector('[aria-modal="true"]')!;
      const input = modal.querySelector<HTMLInputElement>('[role="combobox"]')!;
      await act(async () => input.focus());
      const list = document.getElementById(input.getAttribute('aria-controls')!)!;
      expect(list.closest('[aria-modal="true"]')).toBe(modal);
      expect(list.closest('[inert], [aria-hidden="true"]')).toBeNull();
      expect(modal.querySelector('.overflow-y-auto')?.contains(list)).toBe(false);
      expect(modal.classList.contains('transform-gpu')).toBe(false);
      await act(async () =>
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })),
      );
      expect(
        modal.contains(document.getElementById(input.getAttribute('aria-activedescendant')!)),
      ).toBe(true);
      await act(async () =>
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })),
      );
      expect(selected).toHaveBeenCalledWith('apple');
      expect(dismissed).not.toHaveBeenCalled();
    await act(async () => input.click());
    expect(input.getAttribute('aria-expanded')).toBe('true');
      await act(async () =>
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })),
      );
      expect(input.getAttribute('aria-expanded')).toBe('false');
      expect(dismissed).not.toHaveBeenCalled();
      expect(rendered.container.hasAttribute('inert')).toBe(true);
      await cleanup(rendered.root, rendered.container);
      expect(rendered.container.hasAttribute('inert')).toBe(false);
    },
  );

  it('opens from focus in searchable mode and filters options from typed input', async () => {
    const onSearchChange = vi.fn();
    const rendered = await render(
      <Combobox label="Fruit" options={OPTIONS} onSearchChange={onSearchChange} />,
    );

    const input = rendered.container.querySelector(
      'input[role="combobox"]',
    ) as HTMLInputElement | null;
    expect(input).not.toBeNull();

    await act(async () => {
      input?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    });

    expect(input?.getAttribute('aria-expanded')).toBe('true');

    await act(async () => {
      const valueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      valueSetter?.call(input, 'ap');
      input?.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(onSearchChange).toHaveBeenCalledWith('ap');
    expect(document.body.textContent).toContain('Apple');
    expect(document.body.textContent).not.toContain('Banana');

    await cleanup(rendered.root, rendered.container);
  });

  it('selects highlighted options from keyboard and closes on Escape', async () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    const rendered = await render(
      <Combobox
        label="Fruit"
        options={OPTIONS}
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />,
    );

    const input = rendered.container.querySelector(
      'input[role="combobox"]',
    ) as HTMLInputElement | null;
    expect(input).not.toBeNull();

    await act(async () => {
      input?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    });

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    });

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    });

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith('banana');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(input?.value).toBe('Banana');

    await act(async () => {
      input?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    });
    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(input?.getAttribute('aria-expanded')).toBe('false');

    await cleanup(rendered.root, rendered.container);
  });

  it('supports non-searchable trigger mode with combobox semantics', async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <Combobox
        options={OPTIONS}
        placeholder="Choose fruit"
        searchable={false}
        onOpenChange={onOpenChange}
      />,
    );

    const trigger = rendered.container.querySelector('[role="combobox"]') as HTMLDivElement | null;
    expect(trigger).not.toBeNull();
    expect(trigger?.textContent).toContain('Choose fruit');

    await act(async () => {
      trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    await cleanup(rendered.root, rendered.container);
  });

  it('keeps server matches and pagination inside the open popup', async () => {
    const load = vi.fn();
    const rendered = await render(
      <Combobox label="Item" options={OPTIONS} filterOptions={false} hasMore onLoadMore={load} />,
    );
    expect(document.body.textContent).not.toContain('Load more results');
    const input = rendered.container.querySelector('input')!;
    await act(async () => {
      input.focus();
    });
    await act(async () => {
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set?.call(
        input,
        'barcode-123',
      );
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(3);
    const more = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent === 'Load more results',
    )!;
    expect(more.closest('[role="listbox"]')).toBeNull();
    await act(async () => {
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
      );
    });
    expect(document.activeElement).toBe(more);
    await act(async () => {
      more.click();
    });
    expect(load).toHaveBeenCalledTimes(1);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    await act(async () => {
      more.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
    });
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('barcode-123');
    await act(async () => {
      more.focus();
      more.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    });
    expect(input.getAttribute('aria-expanded')).toBe('false');
    // Synthetic events do not perform native Tab navigation. The browser
    // continues from the trigger to the next form field.
    expect(document.activeElement).toBe(input);
    await cleanup(rendered.root, rendered.container);
  });

  it('distinguishes loading and failure from an empty result and supports retry', async () => {
    const retry = vi.fn();
    const rendered = await render(<Combobox label="Item" options={[]} defaultOpen loading />);
    expect(document.querySelector('[role="listbox"]')?.getAttribute('aria-busy')).toBe('true');
    expect(document.body.textContent).toContain('Loading results');
    expect(document.body.textContent).not.toContain('No results found');
    await rendered.rerender(
      <Combobox
        label="Item"
        options={[]}
        defaultOpen
        error="Could not load items"
        onRetry={retry}
      />,
    );
    expect(document.querySelector('[role="alert"]')?.textContent).toBe('Could not load items');
    const button = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent === 'Try again',
    )!;
    await act(async () => {
      button.click();
    });
    expect(retry).toHaveBeenCalledTimes(1);
    await rendered.rerender(
      <Combobox label="Item" options={[]} defaultOpen emptyText="No matching items" />,
    );
    expect(document.body.textContent).toContain('No matching items');
    await cleanup(rendered.root, rendered.container);
  });

  it('returns focus to the input when the final page removes its paging button', async () => {
    const rendered = await render(
      <Combobox label="Item" options={OPTIONS} defaultOpen hasMore onLoadMore={() => {}} />,
    );
    const more = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent === 'Load more results',
    )!;
    await act(async () => more.focus());
    await rendered.rerender(<Combobox label="Item" options={OPTIONS} defaultOpen />);
    expect(document.activeElement).toBe(rendered.container.querySelector('input'));
    await cleanup(rendered.root, rendered.container);
  });
});
