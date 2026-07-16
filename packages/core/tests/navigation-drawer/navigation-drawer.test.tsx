// @vitest-environment happy-dom

import React, { act, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NavigationDrawer } from '../../src/components/navigation-drawer';
import type { NavigationItem } from '../../src/types/navigation';

const items: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: 'home', href: '/home' },
  { id: 'reports', label: 'Reports', icon: 'bar_chart' },
  { id: 'hidden', label: 'Hidden', hidden: true },
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

function ModalFixture({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={triggerRef}>Open navigation</button>
      <NavigationDrawer
        aria-label="Workspace navigation"
        items={items}
        variant="modal"
        defaultOpen
        triggerRef={triggerRef}
        onOpenChange={onOpenChange}
      />
    </>
  );
}

describe('NavigationDrawer', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a persistent named presentation with shared item selection', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <NavigationDrawer
        aria-label="Workspace navigation"
        items={items}
        headline="Workspace"
        header={<span>Brand</span>}
        footer={<span>Profile</span>}
        defaultValue="home"
        onValueChange={onValueChange}
      />,
    );
    const nav = rendered.container.querySelector('nav[aria-label="Workspace navigation"]');
    expect(nav?.textContent).toContain('Workspace');
    expect(nav?.textContent).toContain('Brand');
    expect(nav?.textContent).toContain('Profile');
    expect(nav?.textContent).not.toContain('Hidden');

    const reports = Array.from(nav?.querySelectorAll('button') ?? []).find((button) =>
      button.textContent?.includes('Reports'),
    );
    await act(async () => reports?.click());
    expect(onValueChange).toHaveBeenCalledWith('reports');

    await cleanup(rendered.root, rendered.container);
  });

  it('implements modal focus entry, Escape dismissal, restoration, and portal rendering', async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(<ModalFixture onOpenChange={onOpenChange} />);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
    expect(dialog).not.toBeNull();
    expect(rendered.container.contains(dialog)).toBe(false);
    expect(document.activeElement?.textContent).toContain('Home');

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement?.textContent).toBe('Open navigation');

    await cleanup(rendered.root, rendered.container);
  });

  it('closes a modal presentation after selecting an item', async () => {
    const onOpenChange = vi.fn();
    const onItemSelect = vi.fn();
    const rendered = await render(
      <NavigationDrawer
        aria-label="Workspace navigation"
        items={items}
        variant="modal"
        defaultOpen
        onOpenChange={onOpenChange}
        onItemSelect={onItemSelect}
      />,
    );
    const reports = Array.from(document.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Reports'),
    );
    await act(async () => reports?.click());

    expect(onItemSelect).toHaveBeenCalledWith(items[1]);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('renders safely during server-side rendering', () => {
    expect(() =>
      renderToString(
        <NavigationDrawer aria-label="Workspace navigation" items={items} variant="persistent" />,
      ),
    ).not.toThrow();
    expect(() =>
      renderToString(
        <NavigationDrawer aria-label="Workspace navigation" items={items} variant="modal" open />,
      ),
    ).not.toThrow();
  });
});
