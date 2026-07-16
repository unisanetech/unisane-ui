// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Alert } from '../../src/components/alert';

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

describe('Alert', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('uses polite status semantics for informational and success content', async () => {
    const rendered = await render(<Alert title="Saved">Your changes are available.</Alert>);
    const alert = rendered.container.firstElementChild;

    expect(alert?.getAttribute('role')).toBe('status');
    expect(alert?.getAttribute('aria-live')).toBe('polite');
    expect(alert?.getAttribute('aria-atomic')).toBe('true');
    expect(alert?.textContent).toContain('Saved');
    expect(alert?.textContent).toContain('Your changes are available.');
    expect(alert?.querySelector('.material-symbols-outlined')?.textContent).toBe('info');

    await cleanup(rendered.root, rendered.container);
  });

  it('uses assertive alert semantics for warning and error content', async () => {
    const rendered = await render(<Alert variant="warning">Review this change.</Alert>);
    const alert = rendered.container.firstElementChild;

    expect(alert?.getAttribute('role')).toBe('alert');
    expect(alert?.getAttribute('aria-live')).toBe('assertive');
    expect(alert?.querySelector('.material-symbols-outlined')?.textContent).toBe('warning');

    await cleanup(rendered.root, rendered.container);
  });

  it('allows native live-region overrides', async () => {
    const rendered = await render(
      <Alert variant="error" role="status" aria-live="polite" aria-atomic={false}>
        Deferred error summary
      </Alert>,
    );
    const alert = rendered.container.firstElementChild;

    expect(alert?.getAttribute('role')).toBe('status');
    expect(alert?.getAttribute('aria-live')).toBe('polite');
    expect(alert?.getAttribute('aria-atomic')).toBe('false');

    await cleanup(rendered.root, rendered.container);
  });

  it('supports rich titles, icon suppression, native props, and refs', async () => {
    const ref = createRef<HTMLDivElement>();
    const rendered = await render(
      <Alert ref={ref} icon={false} title={<strong>Account notice</strong>} data-testid="notice">
        Verify your email.
      </Alert>,
    );

    expect(ref.current).toBe(rendered.container.firstElementChild);
    expect(ref.current?.dataset.testid).toBe('notice');
    expect(ref.current?.querySelector('strong')?.textContent).toBe('Account notice');
    expect(ref.current?.querySelector('.material-symbols-outlined')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });
});
