// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Divider } from '../../src/components/divider';

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

describe('Divider', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('is decorative by default', async () => {
    const rendered = await render(<Divider />);
    const divider = rendered.container.firstElementChild;

    expect(divider?.getAttribute('role')).toBe('none');
    expect(divider?.getAttribute('aria-hidden')).toBe('true');
    expect(divider?.getAttribute('aria-orientation')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('publishes explicit semantic orientation', async () => {
    const rendered = await render(
      <Divider decorative={false} orientation="vertical" role="presentation" aria-hidden />,
    );
    const divider = rendered.container.firstElementChild;

    expect(divider?.getAttribute('role')).toBe('separator');
    expect(divider?.getAttribute('aria-hidden')).toBeNull();
    expect(divider?.getAttribute('aria-orientation')).toBe('vertical');
    expect(divider?.classList.contains('h-full')).toBe(true);
    expect(divider?.classList.contains('w-px')).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });

  it('uses logical start and symmetric inset classes', async () => {
    const rendered = await render(<Divider inset="start" />);
    const divider = rendered.container.firstElementChild;

    expect(divider?.classList.contains('ms-16')).toBe(true);
    expect(divider?.classList.contains('ml-16')).toBe(false);

    await act(async () => rendered.root.render(<Divider orientation="vertical" inset="both" />));
    expect(divider?.classList.contains('my-16')).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });

  it('forwards native props, classes, and refs', async () => {
    const ref = createRef<HTMLDivElement>();
    const rendered = await render(
      <Divider ref={ref} className="custom-divider" data-testid="rule" />,
    );

    expect(ref.current).toBe(rendered.container.firstElementChild);
    expect(ref.current?.classList.contains('custom-divider')).toBe(true);
    expect(ref.current?.dataset.testid).toBe('rule');

    await cleanup(rendered.root, rendered.container);
  });
});
