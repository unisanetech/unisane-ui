// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchBar } from '../../src/components/search-bar';

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

describe('SearchBar', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders search semantics with the default search input type', async () => {
    const rendered = await render(<SearchBar placeholder="Search docs" />);
    const wrapper = rendered.container.querySelector('[role="search"]');
    const input = rendered.container.querySelector('input[type="search"]');

    expect(wrapper).not.toBeNull();
    expect(input).not.toBeNull();
    expect((input as HTMLInputElement | null)?.placeholder).toBe('Search docs');

    await cleanup(rendered.root, rendered.container);
  });

  it('shows the default clear action and dispatches input changes when clearing', async () => {
    const onChange = vi.fn();
    const rendered = await render(<SearchBar defaultValue="Invoices" onChange={onChange} />);

    const input = rendered.container.querySelector(
      'input[type="search"]',
    ) as HTMLInputElement | null;
    const clearButton = Array.from(rendered.container.querySelectorAll('button')).find(
      (button) => button.getAttribute('aria-label') === 'Clear search',
    );

    expect(input?.value).toBe('Invoices');
    expect(clearButton).toBeDefined();

    await act(async () => {
      clearButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(input?.value).toBe('');
    expect(onChange).toHaveBeenCalled();
    expect(document.activeElement).toBe(input);

    await cleanup(rendered.root, rendered.container);
  });

  it('uses a custom trailing action when provided', async () => {
    const onTrailingIconClick = vi.fn();
    const rendered = await render(
      <SearchBar trailingIcon={<span>Go</span>} onTrailingIconClick={onTrailingIconClick} />,
    );

    const actionButton = Array.from(rendered.container.querySelectorAll('button')).find(
      (button) => button.getAttribute('aria-label') === 'Search action',
    );

    expect(actionButton?.textContent).toContain('Go');

    await act(async () => {
      actionButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onTrailingIconClick).toHaveBeenCalledTimes(1);

    await cleanup(rendered.root, rendered.container);
  });
});
