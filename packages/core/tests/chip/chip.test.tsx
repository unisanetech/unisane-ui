// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Chip } from '../../src/components/chip';

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

describe('Chip', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('uses neutral container tokens and compact delete affordance for input chips', async () => {
    const rendered = await render(<Chip variant="input" label="React" onDelete={() => {}} />);
    const chip = rendered.container.firstElementChild as HTMLElement | null;
    const removeButton = rendered.container.querySelector('button[aria-label="Remove React"]');
    const removeIcon = removeButton?.querySelector('.material-symbols-outlined') as
      | HTMLElement
      | null;

    expect(chip?.className).toContain('bg-surface-container-high');
    expect(chip?.className).toContain('hover:bg-surface-container-highest');
    expect(chip?.className).toContain('border-outline-subtle');
    expect(chip?.className).toContain('hover:border-outline-soft');
    expect(chip?.className).toContain('text-on-surface');
    expect(removeButton?.className).toContain('text-on-surface-variant');
    expect(removeButton?.className).toContain('hover:text-on-surface');
    expect(removeButton?.className).toContain('h-5');
    expect(removeButton?.className).toContain('w-5');
    expect(removeIcon?.style.fontSize).toBe('14px');
    expect(removeIcon?.style.width).toBe('14px');
    expect(removeIcon?.style.height).toBe('14px');

    await cleanup(rendered.root, rendered.container);
  });
});
