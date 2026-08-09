// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../src/components/dropdown-menu';

async function render(ui: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(ui);
  });

  return {
    root,
    container,
    async rerender(nextUi: React.ReactNode) {
      await act(async () => {
        root.render(nextUi);
      });
    },
  };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

function getTrigger(container: HTMLElement) {
  const trigger = container.querySelector(
    'button[aria-haspopup="menu"]',
  ) as HTMLButtonElement | null;
  if (!trigger) {
    throw new Error('Expected dropdown trigger to exist');
  }
  return trigger;
}

function getMenus() {
  return Array.from(
    document.querySelectorAll('[role="menu"][aria-orientation="vertical"]'),
  ) as HTMLDivElement[];
}

describe('DropdownMenu', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('opens from keyboard with the expected trigger ARIA wiring and closes on outside click', async () => {
    const rendered = await render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const trigger = getTrigger(rendered.container);

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(getMenus()).toHaveLength(0);

    await act(async () => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    });

    const [menu] = getMenus();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(menu?.id);
    expect(menu?.getAttribute('aria-orientation')).toBe('vertical');

    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(getMenus()).toHaveLength(0);

    await cleanup(rendered.root, rendered.container);
  });

  it('uses the actual asChild trigger and supports focus entry, arrow navigation, typeahead, and restoration', async () => {
    const rendered = await render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button">Open actions</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Archive</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem>Rename</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const trigger = getTrigger(rendered.container);

    expect(trigger.parentElement).toBe(rendered.container.firstElementChild);
    trigger.focus();
    await act(async () => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    });
    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(document.activeElement?.textContent).toContain('Archive');

    await act(async () => {
      document.activeElement?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
      );
    });
    expect(document.activeElement?.textContent).toContain('Duplicate');

    await act(async () => {
      document.activeElement?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'r', bubbles: true }),
      );
    });
    expect(document.activeElement?.textContent).toContain('Rename');

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(getMenus()).toHaveLength(0);
    expect(document.activeElement).toBe(trigger);

    await cleanup(rendered.root, rendered.container);
  });

  it('supports controlled open state and reports Escape closes through onOpenChange', async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <DropdownMenu open onOpenChange={onOpenChange}>
        <DropdownMenuTrigger>More</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Rename</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const trigger = getTrigger(rendered.container);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(getMenus()).toHaveLength(1);

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getMenus()).toHaveLength(1);

    await rendered.rerender(
      <DropdownMenu open={false} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger>More</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Rename</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(getMenus()).toHaveLength(0);

    await cleanup(rendered.root, rendered.container);
  });

  it('closes after selecting an item when closeOnSelect is enabled', async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <DropdownMenu defaultOpen onOpenChange={onOpenChange}>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent closeOnSelect>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const item = document.querySelector('[role="menuitem"]') as HTMLButtonElement | null;
    expect(item?.textContent).toContain('Edit');

    await act(async () => {
      item?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getMenus()).toHaveLength(0);

    await cleanup(rendered.root, rendered.container);
  });

  it('opens and closes submenus from hover state', async () => {
    const rendered = await render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>PDF</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const subTrigger = document.querySelector(
      '[aria-haspopup="menu"][role="menuitem"]',
    ) as HTMLButtonElement | null;

    expect(getMenus()).toHaveLength(1);
    expect(subTrigger?.getAttribute('aria-expanded')).toBe('false');

    await act(async () => {
      subTrigger?.dispatchEvent(
        new MouseEvent('mouseover', { bubbles: true, relatedTarget: null }),
      );
    });

    expect(getMenus()).toHaveLength(2);
    expect(subTrigger?.getAttribute('aria-expanded')).toBe('true');

    await act(async () => {
      subTrigger?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: null }));
      vi.advanceTimersByTime(149);
    });

    expect(getMenus()).toHaveLength(2);

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(getMenus()).toHaveLength(1);
    expect(subTrigger?.getAttribute('aria-expanded')).toBe('false');

    await cleanup(rendered.root, rendered.container);
  });
});
