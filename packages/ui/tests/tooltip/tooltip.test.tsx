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

  it('keeps default sizing equivalent to explicit medium sizing', async () => {
    const rendered = await render(<>
      <Tooltip label="Default"><button type="button">Default</button></Tooltip>
      <Tooltip label="Medium" size="md"><button type="button">Medium</button></Tooltip>
    </>);
    const tooltips = document.body.querySelectorAll('[role="tooltip"]');
    expect(tooltips[0]?.className).toBe(tooltips[1]?.className);
    expect(tooltips[0]?.className).toContain('py-1.5');
    await cleanup(rendered.root, rendered.container);
  });

  it('supports compact plain and rich hints without changing trigger semantics', async () => {
    const rendered = await render(<>
      <Tooltip label="Unpin" size="sm"><button type="button" aria-label="Unpin invoice">Unpin</button></Tooltip>
      <Tooltip label="Saved filters" subhead="Personal" variant="rich" size="sm"><button type="button">View</button></Tooltip>
    </>);
    const tooltips = document.body.querySelectorAll('[role="tooltip"]');
    expect(tooltips[0]?.className).toContain('text-label-small');
    expect(tooltips[0]?.className).toContain('py-1');
    expect(tooltips[0]?.className).not.toContain('py-1.5');
    expect(tooltips[1]?.className).toContain('min-w-40');
    expect(tooltips[1]?.className).toContain('p-3');
    expect(tooltips[1]?.textContent).toBe('PersonalSaved filters');
    const trigger = rendered.container.querySelector('button');
    expect(trigger?.getAttribute('aria-label')).toBe('Unpin invoice');
    expect(trigger?.getAttribute('aria-describedby')).toBe(tooltips[0]?.id);
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
