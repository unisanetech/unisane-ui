// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Badge } from '../../src/components/badge';

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

describe('Badge', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('is passive by default while preserving rich content', async () => {
    const rendered = await render(
      <Badge>
        <strong>Ready</strong>
      </Badge>,
    );
    const badge = rendered.container.querySelector('span');

    expect(badge?.getAttribute('role')).toBeNull();
    expect(badge?.getAttribute('aria-live')).toBeNull();
    expect(badge?.querySelector('strong')?.textContent).toBe('Ready');

    await cleanup(rendered.root, rendered.container);
  });

  it('accepts explicit live-region semantics for dynamic updates', async () => {
    const rendered = await render(
      <Badge role="status" aria-live="polite">
        3 updates
      </Badge>,
    );
    const badge = rendered.container.querySelector('span');

    expect(badge?.getAttribute('role')).toBe('status');
    expect(badge?.getAttribute('aria-live')).toBe('polite');

    await cleanup(rendered.root, rendered.container);
  });

  it('retains semantic colors, variants, sizes, native props, and refs', async () => {
    const ref = createRef<HTMLSpanElement>();
    const rendered = await render(
      <Badge
        ref={ref}
        variant="tonal"
        color="success"
        size="lg"
        title="Deployment status"
        data-testid="deployment"
      >
        Healthy
      </Badge>,
    );

    expect(ref.current).toBe(rendered.container.firstElementChild);
    expect(ref.current?.dataset.testid).toBe('deployment');
    expect(ref.current?.title).toBe('Deployment status');
    expect(ref.current?.classList.contains('bg-success-container')).toBe(true);
    expect(ref.current?.classList.contains('text-on-success-container')).toBe(true);
    expect(ref.current?.classList.contains('text-body-small')).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });
});
