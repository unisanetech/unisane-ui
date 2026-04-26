// @vitest-environment happy-dom

import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Tooltip } from '../../src/components/tooltip';

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

describe('Tooltip', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('attaches aria-describedby directly to an element child', async () => {
    const rendered = await render(
      <Tooltip label="Save changes">
        <button type="button">Save</button>
      </Tooltip>,
    );
    const trigger = rendered.container.querySelector('button');
    const tooltip = document.body.querySelector('[role="tooltip"]') as HTMLDivElement | null;

    expect(trigger).not.toBeNull();
    expect(tooltip).not.toBeNull();
    expect(trigger?.getAttribute('aria-describedby')).toBe(tooltip?.id ?? null);
    expect(tooltip?.textContent).toContain('Save changes');

    await cleanup(rendered.root, rendered.container);
  });

  it('preserves an existing aria-describedby while appending the tooltip id', async () => {
    const rendered = await render(
      <Tooltip label="Tooltip text">
        <button type="button" aria-describedby="existing-description">
          Trigger
        </button>
      </Tooltip>,
    );
    const trigger = rendered.container.querySelector('button');
    const tooltip = document.body.querySelector('[role="tooltip"]') as HTMLDivElement | null;

    expect(trigger?.getAttribute('aria-describedby')).toBe(`existing-description ${tooltip?.id}`);

    await cleanup(rendered.root, rendered.container);
  });

  it('wraps non-element children in a span trigger with the tooltip relationship', async () => {
    const rendered = await render(<Tooltip label="Helpful hint">Plain text</Tooltip>);
    const wrapper = rendered.container.querySelector('span[aria-describedby]');
    const tooltip = document.body.querySelector('[role="tooltip"]') as HTMLDivElement | null;

    expect(wrapper).not.toBeNull();
    expect(wrapper?.textContent).toContain('Plain text');
    expect(wrapper?.getAttribute('aria-describedby')).toBe(tooltip?.id ?? null);

    await cleanup(rendered.root, rendered.container);
  });

  it('renders rich variant metadata and side classes', async () => {
    const rendered = await render(
      <Tooltip label="Permanent action" subhead="Warning" variant="rich" side="right">
        <button type="button">Delete</button>
      </Tooltip>,
    );
    const tooltip = document.body.querySelector('[role="tooltip"]') as HTMLDivElement | null;

    expect(tooltip).not.toBeNull();
    expect(tooltip?.textContent).toContain('Warning');
    expect(tooltip?.textContent).toContain('Permanent action');
    expect(tooltip?.dataset.side).toBe('right');
    expect(tooltip?.className).toContain('min-w-50');

    await cleanup(rendered.root, rendered.container);
  });
});
