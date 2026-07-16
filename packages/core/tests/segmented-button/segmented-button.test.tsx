// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SegmentedButton } from '../../src/components/segmented-button';

const OPTIONS = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: <strong>List</strong>, disabled: true },
  { value: 'table', label: 'Table' },
] as const;

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

function getOptions(container: HTMLElement) {
  return Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];
}

async function press(element: HTMLElement, key: string) {
  await act(async () =>
    element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })),
  );
}

describe('SegmentedButton', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renders a named single-selection radiogroup with one roving tab stop', async () => {
    const rendered = await render(
      <SegmentedButton aria-label="View" options={OPTIONS} defaultValue="grid" />,
    );
    const group = rendered.container.querySelector('[role="radiogroup"]');
    const options = getOptions(rendered.container);

    expect(group?.getAttribute('aria-label')).toBe('View');
    expect(options.map((option) => option.getAttribute('role'))).toEqual([
      'radio',
      'radio',
      'radio',
    ]);
    expect(options.map((option) => option.tabIndex)).toEqual([0, -1, -1]);
    expect(options[0]?.getAttribute('aria-checked')).toBe('true');
    expect(options[1]?.disabled).toBe(true);
    expect(options[1]?.querySelector('strong')?.textContent).toBe('List');

    await cleanup(rendered.root, rendered.container);
  });

  it('supports controlled selection, disabled options, native group props, and refs', async () => {
    const ref = createRef<HTMLDivElement>();
    const onValueChange = vi.fn();
    const rendered = await render(
      <SegmentedButton
        ref={ref}
        aria-labelledby="view-label"
        data-testid="view"
        options={OPTIONS}
        value="grid"
        onValueChange={onValueChange}
      />,
    );
    const options = getOptions(rendered.container);

    expect(ref.current?.dataset.testid).toBe('view');
    expect(ref.current?.getAttribute('aria-labelledby')).toBe('view-label');
    await act(async () => options[1]?.click());
    expect(onValueChange).not.toHaveBeenCalled();
    await act(async () => options[2]?.click());
    expect(onValueChange).toHaveBeenCalledWith('table');

    await act(async () =>
      rendered.root.render(
        <SegmentedButton
          ref={ref}
          aria-labelledby="view-label"
          data-testid="view"
          options={OPTIONS}
          value="table"
          onValueChange={onValueChange}
        />,
      ),
    );
    expect(getOptions(rendered.container).map((option) => option.tabIndex)).toEqual([-1, -1, 0]);

    await cleanup(rendered.root, rendered.container);
  });

  it('supports an explicit controlled no-selection state', async () => {
    const rendered = await render(
      <SegmentedButton aria-label="View" options={OPTIONS} value={null} />,
    );
    const options = getOptions(rendered.container);

    expect(options.map((option) => option.getAttribute('aria-checked'))).toEqual([
      'false',
      'false',
      'false',
    ]);
    expect(options.map((option) => option.tabIndex)).toEqual([0, -1, -1]);

    await cleanup(rendered.root, rendered.container);
  });

  it('skips disabled options and follows single selection with arrow, Home, and End keys', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <SegmentedButton
        aria-label="View"
        options={OPTIONS}
        defaultValue="grid"
        onValueChange={onValueChange}
      />,
    );
    const options = getOptions(rendered.container);

    options[0]?.focus();
    await press(options[0]!, 'ArrowRight');
    expect(document.activeElement).toBe(options[2]);
    expect(options[2]?.getAttribute('aria-checked')).toBe('true');
    expect(onValueChange).toHaveBeenLastCalledWith('table');

    await press(options[2]!, 'Home');
    expect(document.activeElement).toBe(options[0]);
    await press(options[0]!, 'End');
    expect(document.activeElement).toBe(options[2]);

    await cleanup(rendered.root, rendered.container);
  });

  it('reverses horizontal arrow direction in RTL', async () => {
    const rendered = await render(
      <SegmentedButton dir="rtl" aria-label="View" options={OPTIONS} defaultValue="grid" />,
    );
    const options = getOptions(rendered.container);

    options[0]?.focus();
    await press(options[0]!, 'ArrowRight');
    expect(document.activeElement).toBe(options[2]);

    await cleanup(rendered.root, rendered.container);
  });

  it('uses checkbox-group semantics and activation-only toggling for multiple selection', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <SegmentedButton
        selectionMode="multiple"
        aria-label="Formatting"
        options={[
          { value: 'bold', label: 'Bold' },
          { value: 'italic', label: 'Italic' },
        ]}
        defaultValue={['bold']}
        onValueChange={onValueChange}
      />,
    );
    const group = rendered.container.querySelector('[role="group"]');
    const options = getOptions(rendered.container);

    expect(group?.getAttribute('aria-label')).toBe('Formatting');
    expect(options.map((option) => option.getAttribute('role'))).toEqual(['checkbox', 'checkbox']);
    await press(options[0]!, 'ArrowRight');
    expect(onValueChange).not.toHaveBeenCalled();
    await press(options[1]!, ' ');
    expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'italic']);

    await cleanup(rendered.root, rendered.container);
  });
});
