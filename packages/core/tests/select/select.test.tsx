// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../src/components/select';

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

function FruitSelect(
  props: Pick<
    React.ComponentProps<typeof Select>,
    'value' | 'defaultValue' | 'onValueChange' | 'open' | 'defaultOpen' | 'onOpenChange' | 'name'
  > = {},
) {
  return (
    <Select {...props}>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Choose a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana" disabled>
          Banana
        </SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  );
}

function getTrigger(container: HTMLElement) {
  const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement | null;
  if (!trigger) throw new Error('Expected a combobox trigger.');
  return trigger;
}

describe('Select', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('composes an explicitly named trigger, value, content, and arbitrary items', async () => {
    const rendered = await render(<FruitSelect />);
    const trigger = getTrigger(rendered.container);

    expect(trigger.getAttribute('aria-label')).toBe('Fruit');
    expect(trigger.textContent).toContain('Choose a fruit');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await act(async () => trigger.click());

    const listbox = document.querySelector('[role="listbox"]');
    expect(listbox?.hasAttribute('hidden')).toBe(false);
    expect(listbox?.querySelectorAll('[role="option"]')).toHaveLength(3);
    expect(trigger.getAttribute('aria-activedescendant')).toContain('select-item');

    await cleanup(rendered.root, rendered.container);
  });

  it('supports Arrow, Home, End, disabled-item skipping, and Enter selection', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(<FruitSelect onValueChange={onValueChange} />);
    const trigger = getTrigger(rendered.container);

    await act(async () => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    });
    await act(async () => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    });
    expect(trigger.getAttribute('aria-activedescendant')).toContain('select-item');
    expect(document.getElementById(trigger.getAttribute('aria-activedescendant') ?? '')?.textContent).toContain(
      'Cherry',
    );

    await act(async () => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    });
    expect(document.getElementById(trigger.getAttribute('aria-activedescendant') ?? '')?.textContent).toContain(
      'Apple',
    );

    await act(async () => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    });
    await act(async () => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith('cherry');
    expect(trigger.textContent).toContain('Cherry');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await cleanup(rendered.root, rendered.container);
  });

  it('supports typeahead without requiring an options array on the foundation', async () => {
    const rendered = await render(<FruitSelect defaultOpen />);
    const trigger = getTrigger(rendered.container);

    await act(async () => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', bubbles: true }));
    });

    expect(document.getElementById(trigger.getAttribute('aria-activedescendant') ?? '')?.textContent).toContain(
      'Cherry',
    );

    await cleanup(rendered.root, rendered.container);
  });

  it('supports controlled value and open state', async () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    const rendered = await render(
      <FruitSelect
        value="apple"
        open
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />,
    );
    const trigger = getTrigger(rendered.container);
    const cherry = Array.from(document.querySelectorAll('[role="option"]')).find((option) =>
      option.textContent?.includes('Cherry'),
    ) as HTMLElement | undefined;

    await act(async () => cherry?.click());

    expect(onValueChange).toHaveBeenCalledWith('cherry');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(trigger.textContent).toContain('Apple');

    await rendered.rerender(<FruitSelect value="cherry" open={false} />);
    expect(trigger.textContent).toContain('Cherry');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await cleanup(rendered.root, rendered.container);
  });

  it('dismisses on Escape and outside interaction while keeping focus on the trigger', async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(<FruitSelect defaultOpen onOpenChange={onOpenChange} />);
    const trigger = getTrigger(rendered.container);
    trigger.focus();

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(document.activeElement).toBe(trigger);

    await act(async () => trigger.click());
    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    await cleanup(rendered.root, rendered.container);
  });

  it('participates in form submission and forwards foundation refs', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const rendered = await render(
      <form>
        <Select ref={ref} name="fruit" defaultValue="apple">
          <SelectTrigger aria-label="Fruit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent portal={false}>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>
      </form>,
    );

    expect(ref.current).toBe(rendered.container.querySelector('[data-state="closed"]'));
    expect(new FormData(rendered.container.querySelector('form') ?? undefined).get('fruit')).toBe('apple');

    await cleanup(rendered.root, rendered.container);
  });
});
