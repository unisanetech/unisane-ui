// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Sidebar, SidebarDrawer, SidebarProvider, SidebarRail } from '../../src/components/sidebar';
import type { NavigationItem } from '../../src/types/navigation';

const items: NavigationItem[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    icon: 'workspaces',
    items: [
      { id: 'overview', label: 'Overview', href: '/overview' },
      {
        id: 'operations',
        label: 'Operations',
        items: [{ id: 'approvals', label: 'Approvals', href: '/approvals' }],
      },
    ],
  },
  { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' },
];

describe('Sidebar navigation', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders rail and contextual nested drawer from one item collection', async () => {
    const onValueChange = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <SidebarProvider
          items={items}
          defaultValue="approvals"
          defaultExpanded
          forceViewport="desktop"
          onValueChange={onValueChange}
          renderLink={(item, props) => <a data-framework-link={item.id} {...props} />}
        >
          <Sidebar>
            <SidebarRail aria-label="Primary navigation" />
            <SidebarDrawer aria-label="Primary navigation" />
          </Sidebar>
        </SidebarProvider>,
      );
    });
    expect(container.querySelectorAll('nav[aria-label="Primary navigation"]')).toHaveLength(2);
    expect(container.textContent).toContain('Operations');
    expect(container.textContent).toContain('Approvals');
    expect(container.querySelector('[data-framework-link="approvals"]')).not.toBeNull();
    const operationsDisclosure = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button[aria-expanded]'),
    ).find((button) => button.textContent?.includes('Operations'));
    expect(operationsDisclosure?.getAttribute('aria-expanded')).toBe('true');
    await act(async () => operationsDisclosure?.click());
    expect(operationsDisclosure?.getAttribute('aria-expanded')).toBe('false');
    const approvals = Array.from(container.querySelectorAll('a')).find((anchor) =>
      anchor.textContent?.includes('Approvals'),
    );
    await act(async () => approvals?.click());
    expect(onValueChange).toHaveBeenCalledWith('approvals');
    await act(async () => root.unmount());
  });

  it('renders the complete nested tree in the overlay drawer', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <SidebarProvider items={items} forceViewport="mobile" defaultMobileOpen>
          <Sidebar>
            <SidebarDrawer aria-label="Primary navigation" overlayHeadline="Navigation" />
          </Sidebar>
        </SidebarProvider>,
      );
    });
    expect(container.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe(
      'Primary navigation',
    );
    expect(container.textContent).toContain('Workspace');
    expect(container.textContent).toContain('Settings');
    expect(container.textContent).toContain('Approvals');
    await act(async () => root.unmount());
  });
});
