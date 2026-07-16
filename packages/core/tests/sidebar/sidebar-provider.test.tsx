// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  Sidebar,
  SidebarDrawer,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '../../src/components/sidebar';
import type { NavigationItem } from '../../src/types/navigation';

const ITEMS: NavigationItem[] = [
  {
    id: 'components',
    label: 'Components',
    href: '/docs/components',
    items: [
      { id: 'button', label: 'Button', href: '/docs/components/button' },
      { id: 'card', label: 'Card', href: '/docs/components/card' },
    ],
  },
  { id: 'home', label: 'Home', href: '/' },
];

function Probe() {
  const sidebar = useSidebar();
  return (
    <div>
      <div data-testid="value">{sidebar.value ?? ''}</div>
      <div data-testid="expanded">{String(sidebar.expanded)}</div>
      <div data-testid="effective">{sidebar.effectiveItem?.id ?? ''}</div>
      <div data-testid="viewport">{sidebar.viewport}</div>
      <button type="button" onClick={() => sidebar.selectItem(ITEMS[0]!, 'rail')}>
        components
      </button>
      <button type="button" onClick={() => sidebar.selectItem(ITEMS[1]!, 'rail')}>
        home
      </button>
    </div>
  );
}

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

function text(container: HTMLElement, testId: string) {
  return container.querySelector(`[data-testid="${testId}"]`)?.textContent ?? '';
}

describe('SidebarProvider', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('derives the contextual drawer from a controlled descendant value', async () => {
    const rendered = await render(
      <SidebarProvider items={ITEMS} value="card" persist={false}>
        <Probe />
      </SidebarProvider>,
    );
    expect(text(rendered.container, 'value')).toBe('card');
    expect(text(rendered.container, 'expanded')).toBe('true');
    expect(text(rendered.container, 'effective')).toBe('components');
    await cleanup(rendered.root, rendered.container);
  });

  it('can keep a route-selected descendant collapsed', async () => {
    const rendered = await render(
      <SidebarProvider items={ITEMS} value="card" openOnChildSelection={false} persist={false}>
        <Probe />
      </SidebarProvider>,
    );
    expect(text(rendered.container, 'expanded')).toBe('false');
    expect(text(rendered.container, 'effective')).toBe('components');
    await cleanup(rendered.root, rendered.container);
  });

  it('opens a rail category and closes for a leaf destination', async () => {
    const rendered = await render(
      <SidebarProvider items={ITEMS} defaultValue="home" persist={false}>
        <Probe />
      </SidebarProvider>,
    );
    const buttons = Array.from(rendered.container.querySelectorAll('button'));
    await act(async () => buttons[0]?.click());
    expect(text(rendered.container, 'value')).toBe('components');
    expect(text(rendered.container, 'expanded')).toBe('true');
    await act(async () => buttons[1]?.click());
    expect(text(rendered.container, 'value')).toBe('home');
    expect(text(rendered.container, 'expanded')).toBe('false');
    await cleanup(rendered.root, rendered.container);
  });

  it('uses the explicit viewport during server rendering', () => {
    const markup = renderToStaticMarkup(
      <SidebarProvider items={ITEMS} initialViewport="mobile" persist={false}>
        <Probe />
      </SidebarProvider>,
    );
    expect(markup).toContain('data-testid="viewport">mobile<');
  });

  it('uses neutral root state markers and owns the overlay backdrop', async () => {
    const rendered = await render(
      <SidebarProvider items={ITEMS} forceViewport="mobile" defaultMobileOpen persist={false}>
        <Sidebar data-testid="root">
          <SidebarDrawer aria-label="Primary navigation" />
        </Sidebar>
      </SidebarProvider>,
    );
    const root = rendered.container.querySelector('[data-testid="root"]');
    expect(root?.getAttribute('data-slot')).toBe('sidebar');
    expect(root?.outerHTML).not.toContain(['unisane', 'sidebar'].join('-'));
    expect(rendered.container.querySelector('[role="dialog"]')).not.toBeNull();
    expect(rendered.container.querySelector('.bg-scrim')).not.toBeNull();
    await cleanup(rendered.root, rendered.container);
  });

  it('dismisses the overlay with Escape and restores the trigger focus', async () => {
    const rendered = await render(
      <SidebarProvider items={ITEMS} forceViewport="mobile" persist={false}>
        <Sidebar>
          <SidebarTrigger aria-label="Open primary navigation" />
          <SidebarDrawer aria-label="Primary navigation" />
          <SidebarInset data-testid="inset">Content</SidebarInset>
        </Sidebar>
      </SidebarProvider>,
    );
    const trigger = rendered.container.querySelector(
      'button[aria-label="Open primary navigation"]',
    ) as HTMLButtonElement;
    trigger.focus();
    await act(async () => trigger.click());
    expect(rendered.container.querySelector('[role="dialog"]')).not.toBeNull();
    expect(rendered.container.querySelector('[data-testid="inset"]')?.hasAttribute('inert')).toBe(
      true,
    );
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(rendered.container.querySelector('[role="dialog"]')).toBeNull();
    expect(rendered.container.querySelector('[data-testid="inset"]')?.hasAttribute('inert')).toBe(
      false,
    );
    expect(document.activeElement).toBe(trigger);
    await cleanup(rendered.root, rendered.container);
  });
});
