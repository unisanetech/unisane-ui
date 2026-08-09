// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NavigationRail } from '../../src/components/navigation-rail';
import type { NavigationItem } from '../../src/types/navigation';

const items: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: 'home', activeIcon: 'home_filled', badge: 3 },
  { id: 'reports', label: 'Reports', icon: 'bar_chart' },
  { id: 'disabled', label: 'Disabled', icon: 'block', disabled: true },
];

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

describe('NavigationRail', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('shares id-based selection and item callbacks with the other presentations', async () => {
    const onValueChange = vi.fn();
    const onItemSelect = vi.fn();
    const rendered = await render(
      <NavigationRail
        aria-label="Workspace navigation"
        items={items}
        defaultValue="home"
        onValueChange={onValueChange}
        onItemSelect={onItemSelect}
      />,
    );
    const reports = Array.from(rendered.container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Reports'),
    );
    await act(async () => reports?.click());

    expect(onValueChange).toHaveBeenCalledWith('reports');
    expect(onItemSelect).toHaveBeenCalledWith(items[1]);
    expect(reports?.getAttribute('aria-current')).toBe('page');

    await cleanup(rendered.root, rendered.container);
  });

  it('supports hidden labels, accessible names, hover, badges, and disabled items', async () => {
    const onItemHover = vi.fn();
    const onValueChange = vi.fn();
    const rendered = await render(
      <NavigationRail
        aria-label="Workspace navigation"
        items={items}
        labelVisibility="hidden"
        onItemHover={onItemHover}
        onValueChange={onValueChange}
      />,
    );
    const home = rendered.container.querySelector<HTMLElement>('[aria-label="Home"]');
    expect(home?.getAttribute('title')).toBe('Home');
    expect(rendered.container.querySelector('[role="status"]')?.textContent).toBe('3');

    await act(async () => {
      home?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    });
    expect(onItemHover).toHaveBeenCalledWith('home');

    const disabled = rendered.container.querySelector<HTMLButtonElement>('button[disabled]');
    await act(async () => disabled?.click());
    expect(onValueChange).not.toHaveBeenCalledWith('disabled');

    await cleanup(rendered.root, rendered.container);
  });

  it('renders header and footer composition slots', async () => {
    const rendered = await render(
      <NavigationRail
        aria-label="Workspace navigation"
        items={items}
        header={<span>Brand</span>}
        footer={<span>Profile</span>}
      />,
    );
    expect(rendered.container.textContent).toContain('Brand');
    expect(rendered.container.textContent).toContain('Profile');
    await cleanup(rendered.root, rendered.container);
  });

  it('renders safely during server-side rendering', () => {
    expect(() =>
      renderToString(<NavigationRail aria-label="Workspace navigation" items={items} />),
    ).not.toThrow();
  });
});
