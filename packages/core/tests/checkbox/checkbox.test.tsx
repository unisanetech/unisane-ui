// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../../src/components/checkbox';

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

describe('Checkbox', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('keeps native input semantics while supporting rich labels, root classes, props, and refs', async () => {
    const ref = createRef<HTMLInputElement>();
    const rendered = await render(
      <Checkbox
        ref={ref}
        name="updates"
        value="email"
        label={<strong>Email updates</strong>}
        className="control-root"
        data-testid="updates"
      />,
    );
    const input = rendered.container.querySelector('input');
    const label = rendered.container.querySelector('label');

    expect(ref.current).toBe(input);
    expect(input?.type).toBe('checkbox');
    expect(input?.name).toBe('updates');
    expect(input?.value).toBe('email');
    expect(input?.dataset.testid).toBe('updates');
    expect(label?.getAttribute('for')).toBe(input?.id);
    expect(label?.classList.contains('control-root')).toBe(true);
    expect(label?.querySelector('strong')?.textContent).toBe('Email updates');

    await cleanup(rendered.root, rendered.container);
  });

  it('publishes indeterminate and invalid semantics', async () => {
    const rendered = await render(
      <Checkbox aria-label="Select all" indeterminate invalid size="sm" />,
    );
    const input = rendered.container.querySelector('input');

    expect(input?.indeterminate).toBe(true);
    expect(input?.getAttribute('aria-checked')).toBe('mixed');
    expect(input?.getAttribute('aria-invalid')).toBe('true');

    await cleanup(rendered.root, rendered.container);
  });

  it('forwards native controlled change behavior and disabled state', async () => {
    const onChange = vi.fn();
    const rendered = await render(
      <Checkbox aria-label="Enabled" checked={false} onChange={onChange} />,
    );
    const input = rendered.container.querySelector('input') as HTMLInputElement;

    await act(async () => input.click());
    expect(onChange).toHaveBeenCalledTimes(1);

    await act(async () =>
      rendered.root.render(
        <Checkbox aria-label="Enabled" checked={false} disabled onChange={onChange} />,
      ),
    );
    await act(async () => input.click());
    expect(onChange).toHaveBeenCalledTimes(1);

    await cleanup(rendered.root, rendered.container);
  });
});
