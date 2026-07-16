// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NavigationBar } from '../../src/components/navigation-bar';
import type { NavigationItem } from '../../src/types/navigation';

const items: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: 'home', href: '/home' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'hidden', label: 'Hidden', hidden: true },
  { id: 'disabled', label: 'Disabled', disabled: true },
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

describe('NavigationBar', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('uses the canonical item identity and uncontrolled selection contract', async () => {
    const onValueChange = vi.fn();
    const onItemSelect = vi.fn();
    const rendered = await render(
      <NavigationBar
        aria-label="Primary navigation"
        items={items}
        defaultValue="home"
        onValueChange={onValueChange}
        onItemSelect={onItemSelect}
      />,
    );

    expect(rendered.container.querySelector('[aria-current="page"]')?.textContent).toContain(
      'Home',
    );
    expect(rendered.container.textContent).not.toContain('Hidden');

    const search = Array.from(rendered.container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Search'),
    );
    await act(async () => search?.click());

    expect(onValueChange).toHaveBeenCalledWith('search');
    expect(onItemSelect).toHaveBeenCalledWith(items[1]);
    expect(search?.getAttribute('aria-current')).toBe('page');

    await cleanup(rendered.root, rendered.container);
  });

  it('renders native, external, disabled, and framework links consistently', async () => {
    const renderLink = vi.fn(
      (
        item: NavigationItem,
        props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string },
      ) => <a {...props} data-router-link={item.id} />,
    );
    const rendered = await render(
      <NavigationBar
        aria-label="Primary navigation"
        items={[{ ...items[0]!, external: true }, items[3]!]}
        renderLink={renderLink}
      />,
    );

    const link = rendered.container.querySelector<HTMLAnchorElement>('[data-router-link="home"]');
    expect(link?.getAttribute('href')).toBe('/home');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(renderLink).toHaveBeenCalledOnce();

    const disabled = rendered.container.querySelector<HTMLButtonElement>('button[disabled]');
    expect(disabled?.getAttribute('aria-disabled')).toBe('true');

    await cleanup(rendered.root, rendered.container);
  });

  it('keeps controlled selection owned by the caller', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <NavigationBar
        aria-label="Primary navigation"
        items={items}
        value="home"
        onValueChange={onValueChange}
      />,
    );
    const search = Array.from(rendered.container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Search'),
    );
    await act(async () => search?.click());

    expect(onValueChange).toHaveBeenCalledWith('search');
    expect(rendered.container.querySelector('[aria-current="page"]')?.textContent).toContain(
      'Home',
    );

    await cleanup(rendered.root, rendered.container);
  });

  it('renders safely during server-side rendering', () => {
    expect(() =>
      renderToString(<NavigationBar aria-label="Primary navigation" items={items} />),
    ).not.toThrow();
  });
});
