// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Radio } from '../../src/components/radio';

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

describe('Radio', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('keeps native grouping, values, and rich label association', async () => {
    const rendered = await render(
      <div>
        <Radio name="plan" value="basic" label={<strong>Basic</strong>} defaultChecked />
        <Radio name="plan" value="pro" label="Pro" />
      </div>,
    );
    const inputs = Array.from(rendered.container.querySelectorAll('input'));

    expect(inputs[0]?.type).toBe('radio');
    expect(inputs[0]?.checked).toBe(true);
    await act(async () => inputs[1]?.click());
    expect(inputs[0]?.checked).toBe(false);
    expect(inputs[1]?.checked).toBe(true);
    expect(rendered.container.querySelector('strong')?.textContent).toBe('Basic');

    await cleanup(rendered.root, rendered.container);
  });

  it('publishes invalid semantics and forwards root classes, native props, and refs', async () => {
    const ref = createRef<HTMLInputElement>();
    const rendered = await render(
      <Radio
        ref={ref}
        aria-label="Plan"
        invalid
        required
        size="sm"
        className="control-root"
        data-testid="plan"
      />,
    );
    const input = rendered.container.querySelector('input');

    expect(ref.current).toBe(input);
    expect(input?.required).toBe(true);
    expect(input?.dataset.testid).toBe('plan');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(rendered.container.querySelector('label')?.classList.contains('control-root')).toBe(
      true,
    );

    await cleanup(rendered.root, rendered.container);
  });

  it('honors disabled native interaction', async () => {
    const onChange = vi.fn();
    const rendered = await render(
      <Radio aria-label="Unavailable plan" disabled onChange={onChange} />,
    );
    const input = rendered.container.querySelector('input') as HTMLInputElement;

    await act(async () => input.click());
    expect(input.checked).toBe(false);
    expect(onChange).not.toHaveBeenCalled();

    await cleanup(rendered.root, rendered.container);
  });
});
