// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollArea } from '../../src/components/scroll-area';

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

describe('ScrollArea', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('uses one element for the public root and native scrolling viewport', async () => {
    const ref = createRef<HTMLDivElement>();
    const rendered = await render(
      <ScrollArea ref={ref} data-testid="viewport">
        <span>Scrollable content</span>
      </ScrollArea>,
    );
    const viewport = rendered.container.firstElementChild as HTMLDivElement;

    expect(rendered.container.childElementCount).toBe(1);
    expect(ref.current).toBe(viewport);
    expect(viewport.dataset.testid).toBe('viewport');
    expect(viewport.querySelector('span')?.textContent).toBe('Scrollable content');
    expect(viewport.classList.contains('overflow-x-hidden')).toBe(true);
    expect(viewport.classList.contains('overflow-y-auto')).toBe(true);
    expect(viewport.tabIndex).toBe(0);

    await cleanup(rendered.root, rendered.container);
  });

  it.each([
    ['horizontal', ['overflow-x-auto', 'overflow-y-hidden']],
    ['both', ['overflow-auto']],
  ] as const)('maps %s orientation to the viewport overflow', async (orientation, classes) => {
    const rendered = await render(<ScrollArea orientation={orientation}>Content</ScrollArea>);
    const viewport = rendered.container.firstElementChild as HTMLDivElement;

    for (const className of classes) {
      expect(viewport.classList.contains(className)).toBe(true);
    }

    await cleanup(rendered.root, rendered.container);
  });

  it('preserves native attributes, explicit semantics, local classes, and tab index overrides', async () => {
    const rendered = await render(
      <ScrollArea
        role="region"
        aria-label="Activity history"
        tabIndex={-1}
        title="Recent activity"
        className="max-h-64 rounded-sm"
      >
        Content
      </ScrollArea>,
    );
    const viewport = rendered.container.firstElementChild as HTMLDivElement;

    expect(viewport.getAttribute('role')).toBe('region');
    expect(viewport.getAttribute('aria-label')).toBe('Activity history');
    expect(viewport.title).toBe('Recent activity');
    expect(viewport.tabIndex).toBe(-1);
    expect(viewport.classList.contains('max-h-64')).toBe(true);
    expect(viewport.classList.contains('rounded-sm')).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });

  it('does not force landmark semantics', async () => {
    const rendered = await render(<ScrollArea>Content</ScrollArea>);
    const viewport = rendered.container.firstElementChild as HTMLDivElement;

    expect(viewport.getAttribute('role')).toBeNull();
    expect(viewport.getAttribute('aria-label')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('dispatches native scroll events from the forwarded viewport', async () => {
    const ref = createRef<HTMLDivElement>();
    const onScroll = vi.fn((event: React.UIEvent<HTMLDivElement>) => ({
      top: event.currentTarget.scrollTop,
      left: event.currentTarget.scrollLeft,
    }));
    const rendered = await render(
      <ScrollArea ref={ref} onScroll={onScroll}>
        Content
      </ScrollArea>,
    );
    const viewport = rendered.container.firstElementChild as HTMLDivElement;

    viewport.scrollTop = 48;
    viewport.scrollLeft = 24;
    await act(async () => {
      viewport.dispatchEvent(new Event('scroll', { bubbles: false }));
    });

    expect(ref.current?.scrollTop).toBe(48);
    expect(ref.current?.scrollLeft).toBe(24);
    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(onScroll.mock.results[0]?.value).toEqual({ top: 48, left: 24 });

    await cleanup(rendered.root, rendered.container);
  });
});
