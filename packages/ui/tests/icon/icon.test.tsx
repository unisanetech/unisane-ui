// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Icon } from '../../src/components/icon';

async function render(ui: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(ui);
  });

  return { root, container };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

describe('Icon', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders symbol icons as decorative by default', async () => {
    const rendered = await render(<Icon symbol="check" size="sm" />);
    const icon = rendered.container.querySelector('span');

    expect(icon?.textContent).toBe('check');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.classList.contains('size-icon-sm')).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });

  it('preserves an explicit accessible name and role', async () => {
    const rendered = await render(<Icon symbol="warning" filled role="img" aria-label="Warning" />);
    const icon = rendered.container.querySelector('[role="img"]');

    expect(icon?.getAttribute('aria-label')).toBe('Warning');
    expect(icon?.hasAttribute('aria-hidden')).toBe(false);
    expect((icon as HTMLElement | null)?.style.fontVariationSettings).toContain("'FILL' 1");

    await cleanup(rendered.root, rendered.container);
  });

  it('renders custom svg content with numeric size and viewBox', async () => {
    const rendered = await render(
      <Icon size={32} viewBox="0 0 20 20">
        <path data-testid="shape" d="M1 1h18v18H1z" />
      </Icon>,
    );
    const icon = rendered.container.querySelector('svg');

    expect(icon?.getAttribute('width')).toBe('32');
    expect(icon?.getAttribute('height')).toBe('32');
    expect(icon?.getAttribute('viewBox')).toBe('0 0 20 20');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.querySelector('[data-testid="shape"]')).not.toBeNull();

    await cleanup(rendered.root, rendered.container);
  });
});
