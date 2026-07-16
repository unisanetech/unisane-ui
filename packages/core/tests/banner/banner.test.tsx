// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Banner } from '../../src/components/banner';

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

describe('Banner', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders persistent children with polite status semantics by default', async () => {
    const ref = createRef<HTMLDivElement>();
    const rendered = await render(
      <Banner ref={ref} title={<strong>Update available</strong>} data-testid="update-banner">
        Refresh when convenient.
      </Banner>,
    );

    expect(ref.current).toBe(rendered.container.firstElementChild);
    expect(ref.current?.getAttribute('role')).toBe('status');
    expect(ref.current?.getAttribute('aria-live')).toBe('polite');
    expect(ref.current?.getAttribute('aria-atomic')).toBe('true');
    expect(ref.current?.textContent).toContain('Update available');
    expect(ref.current?.textContent).toContain('Refresh when convenient.');
    expect(ref.current?.querySelector('button[aria-label]')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('does not render when controlled closed', async () => {
    const rendered = await render(<Banner open={false}>Hidden banner</Banner>);

    expect(rendered.container.firstElementChild).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('maps warning and error variants to assertive semantics while allowing overrides', async () => {
    const rendered = await render(
      <Banner variant="warning" role="status" aria-live="polite">
        Session expires soon.
      </Banner>,
    );
    const banner = rendered.container.firstElementChild;

    expect(banner?.getAttribute('role')).toBe('status');
    expect(banner?.getAttribute('aria-live')).toBe('polite');
    expect(banner?.querySelector('.material-symbols-outlined')?.textContent).toBe('warning');

    await cleanup(rendered.root, rendered.container);
  });

  it('renders stable rich actions and respects disabled state', async () => {
    const enabledClick = vi.fn();
    const disabledClick = vi.fn();
    const rendered = await render(
      <Banner
        actions={[
          { id: 'refresh', label: <span>Refresh now</span>, onClick: enabledClick },
          { id: 'later', label: 'Later', onClick: disabledClick, disabled: true },
        ]}
      >
        A new version is ready.
      </Banner>,
    );
    const buttons = rendered.container.querySelectorAll('button');

    expect(buttons).toHaveLength(2);
    expect(buttons[0]?.textContent).toContain('Refresh now');
    expect(buttons[1]?.disabled).toBe(true);

    buttons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    buttons[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(enabledClick).toHaveBeenCalledTimes(1);
    expect(disabledClick).toHaveBeenCalledTimes(0);

    await cleanup(rendered.root, rendered.container);
  });

  it('renders optional dismissal with a consumer-owned label and supports icon suppression', async () => {
    const onDismiss = vi.fn();
    const rendered = await render(
      <Banner icon={false} onDismiss={onDismiss} dismissLabel="Hide maintenance notice">
        Maintenance is complete.
      </Banner>,
    );
    const dismissButton = rendered.container.querySelector(
      'button[aria-label="Hide maintenance notice"]',
    );

    expect(rendered.container.querySelector('.material-symbols-outlined')?.textContent).toBe(
      'close',
    );
    dismissButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onDismiss).toHaveBeenCalledTimes(1);

    await cleanup(rendered.root, rendered.container);
  });
});
