// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { List, ListDivider, ListItem, ListSubheader } from '../../src/components/list';

function installMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: () => ({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => true,
    }),
  });
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

describe('List', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    installMatchMedia();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('uses native collection semantics and one rich structured content model', async () => {
    const rendered = await render(
      <List aria-label="Deployments">
        <ListSubheader>Production</ListSubheader>
        <ListItem
          headline={<strong>API</strong>}
          supportingText="Healthy"
          leading={<span data-slot="leading">A</span>}
          trailingText="2m"
          trailing={<span data-slot="trailing">Open</span>}
        />
      </List>,
    );
    const list = rendered.container.querySelector('ul');
    const items = list?.querySelectorAll(':scope > li');

    expect(list?.getAttribute('role')).toBeNull();
    expect(list?.getAttribute('aria-label')).toBe('Deployments');
    expect(items).toHaveLength(2);
    expect(items?.[0]?.getAttribute('role')).toBe('presentation');
    expect(items?.[1]?.querySelector('strong')?.textContent).toBe('API');
    expect(items?.[1]?.textContent).toContain('Healthy');
    expect(items?.[1]?.textContent).toContain('2m');
    expect(items?.[1]?.querySelector('[data-slot="leading"]')).not.toBeNull();
    expect(items?.[1]?.querySelector('[data-slot="trailing"]')).not.toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('keeps inset dividers inside a presentational list child', async () => {
    const ref = createRef<HTMLDivElement>();
    const rendered = await render(
      <List>
        <ListItem headline="First" />
        <ListDivider ref={ref} inset="start" />
        <ListItem headline="Second" />
      </List>,
    );
    const children = rendered.container.querySelector('ul')?.children;

    expect(children).toHaveLength(3);
    expect(children?.[1]?.tagName).toBe('LI');
    expect(children?.[1]?.getAttribute('role')).toBe('presentation');
    expect(ref.current?.classList.contains('ms-16')).toBe(true);
    expect(ref.current?.getAttribute('role')).toBe('none');

    await cleanup(rendered.root, rendered.container);
  });

  it('renders a native button mode with disabled behavior and a stable item ref', async () => {
    const ref = createRef<HTMLLIElement>();
    const onClick = vi.fn();
    const rendered = await render(
      <List>
        <ListItem ref={ref} headline="Retry" onClick={onClick} data-testid="retry" />
      </List>,
    );
    const button = rendered.container.querySelector('button');

    expect(ref.current).toBe(rendered.container.querySelector('li'));
    expect(button?.type).toBe('button');
    expect(button?.dataset.testid).toBe('retry');
    await act(async () => button?.click());
    expect(onClick).toHaveBeenCalledTimes(1);

    await act(async () =>
      rendered.root.render(
        <List>
          <ListItem ref={ref} headline="Retry" onClick={onClick} disabled />
        </List>,
      ),
    );
    expect(button?.disabled).toBe(true);
    await act(async () => button?.click());
    expect(onClick).toHaveBeenCalledTimes(1);

    await cleanup(rendered.root, rendered.container);
  });

  it('renders default links and blocks disabled link activation', async () => {
    const onClick = vi.fn();
    const rendered = await render(
      <List>
        <ListItem headline="Details" href="/details" onClick={onClick} />
      </List>,
    );
    const link = rendered.container.querySelector('a');

    expect(link?.getAttribute('href')).toBe('/details');
    link?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(onClick).toHaveBeenCalledTimes(1);

    await act(async () =>
      rendered.root.render(
        <List>
          <ListItem headline="Details" href="/details" onClick={onClick} disabled />
        </List>,
      ),
    );
    const disabledEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    link?.dispatchEvent(disabledEvent);
    expect(disabledEvent.defaultPrevented).toBe(true);
    expect(link?.getAttribute('aria-disabled')).toBe('true');
    expect(link?.getAttribute('tabindex')).toBe('-1');
    expect(onClick).toHaveBeenCalledTimes(1);

    await cleanup(rendered.root, rendered.container);
  });

  it('provides one explicit framework-link rendering extension', async () => {
    const renderLink = vi.fn(({ children, ...props }) => (
      <a {...props} data-router-link="true">
        {children}
      </a>
    ));
    const rendered = await render(
      <List>
        <ListItem headline="Workspace" href="/workspace" renderLink={renderLink} />
      </List>,
    );
    const link = rendered.container.querySelector('a');

    expect(renderLink).toHaveBeenCalledTimes(1);
    expect(link?.dataset.routerLink).toBe('true');
    expect(link?.getAttribute('href')).toBe('/workspace');
    expect(link?.textContent).toContain('Workspace');

    await cleanup(rendered.root, rendered.container);
  });

  it('keeps selected and disabled styling on static items without fake interactivity', async () => {
    const rendered = await render(
      <List>
        <ListItem headline="Archived" selected disabled aria-disabled={false} />
      </List>,
    );
    const item = rendered.container.querySelector('li');

    expect(item?.getAttribute('aria-disabled')).toBe('true');
    expect(item?.classList.contains('bg-state-selected')).toBe(true);
    expect(item?.classList.contains('hover:bg-state-hover')).toBe(false);
    expect(item?.querySelector('button, a')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });
});
