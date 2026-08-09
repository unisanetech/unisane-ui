// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Switch } from '../../src/components/switch';

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

describe('Switch', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('uses native checkbox behavior with switch semantics and rich label association', async () => {
    const rendered = await render(
      <Switch name="notifications" label={<strong>Notifications</strong>} defaultChecked />,
    );
    const input = rendered.container.querySelector('input');
    const label = rendered.container.querySelector('label');

    expect(input?.type).toBe('checkbox');
    expect(input?.getAttribute('role')).toBe('switch');
    expect(input?.checked).toBe(true);
    expect(label?.getAttribute('for')).toBe(input?.id);
    expect(label?.querySelector('strong')?.textContent).toBe('Notifications');

    await cleanup(rendered.root, rendered.container);
  });

  it('retains optional state icons and publishes invalid semantics', async () => {
    const rendered = await render(<Switch aria-label="Sync" showIcons invalid />);
    const input = rendered.container.querySelector('input');

    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(rendered.container.querySelector('.switch-icon-on')).not.toBeNull();
    expect(rendered.container.querySelector('.switch-icon-off')).not.toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('forwards native props, root classes, refs, and controlled changes', async () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const rendered = await render(
      <Switch
        ref={ref}
        aria-label="Auto save"
        checked={false}
        onChange={onChange}
        className="control-root"
        data-testid="auto-save"
      />,
    );
    const input = rendered.container.querySelector('input') as HTMLInputElement;

    expect(ref.current).toBe(input);
    expect(input.dataset.testid).toBe('auto-save');
    expect(rendered.container.querySelector('label')?.classList.contains('control-root')).toBe(
      true,
    );
    await act(async () => input.click());
    expect(onChange).toHaveBeenCalledTimes(1);

    await cleanup(rendered.root, rendered.container);
  });

  it('honors disabled native interaction', async () => {
    const onChange = vi.fn();
    const rendered = await render(<Switch aria-label="Locked" disabled onChange={onChange} />);
    const input = rendered.container.querySelector('input') as HTMLInputElement;

    await act(async () => input.click());
    expect(onChange).not.toHaveBeenCalled();

    await cleanup(rendered.root, rendered.container);
  });
});
