// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SelectField } from '../../src/components/select-field';

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', disabled: true },
  { value: 'cherry', label: <span>Cherry</span>, textValue: 'Cherry' },
];

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

function getTrigger(container: HTMLElement) {
  const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement | null;
  if (!trigger) throw new Error('Expected a SelectField trigger.');
  return trigger;
}

describe('SelectField', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('owns the options-array recipe with visible label and description semantics', async () => {
    const rendered = await render(
      <SelectField
        label="Fruit"
        description="Choose one fruit."
        options={OPTIONS}
        defaultValue="apple"
      />,
    );
    const trigger = getTrigger(rendered.container);
    const label = rendered.container.querySelector('label');
    const description = rendered.container.querySelector('p');

    expect(label?.getAttribute('for')).toBe(trigger.id);
    expect(trigger.getAttribute('aria-labelledby')).toBe(label?.id);
    expect(trigger.getAttribute('aria-describedby')).toBe(description?.id);
    expect(trigger.textContent).toContain('Apple');

    await cleanup(rendered.root, rendered.container);
  });

  it('requires an explicit accessible name when no visible label is used', async () => {
    const rendered = await render(
      <SelectField aria-label="Sort order" options={OPTIONS} placeholder="Choose order" />,
    );
    const trigger = getTrigger(rendered.container);

    expect(trigger.getAttribute('aria-label')).toBe('Sort order');
    expect(trigger.textContent).toContain('Choose order');
    expect(rendered.container.querySelector('label')).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('publishes invalid and error relationships without replacing consumer descriptions', async () => {
    const rendered = await render(
      <SelectField
        label="Fruit"
        options={OPTIONS}
        errorMessage="Fruit is required."
        aria-describedby="external-help"
      />,
    );
    const trigger = getTrigger(rendered.container);
    const error = rendered.container.querySelector('[role="alert"]');

    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(trigger.getAttribute('aria-describedby')).toBe(`external-help ${error?.id}`);
    expect(error?.textContent).toBe('Fruit is required.');

    await cleanup(rendered.root, rendered.container);
  });

  it('retains controlled state, disabled options, portal control, and forwarded trigger refs', async () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onValueChange = vi.fn();
    const rendered = await render(
      <SelectField
        ref={ref}
        label="Fruit"
        options={OPTIONS}
        value="apple"
        onValueChange={onValueChange}
        portal={false}
      />,
    );
    const trigger = getTrigger(rendered.container);

    expect(ref.current).toBe(trigger);
    await act(async () => trigger.click());
    const banana = Array.from(rendered.container.querySelectorAll('[role="option"]')).find((item) =>
      item.textContent?.includes('Banana'),
    ) as HTMLElement | undefined;
    const cherry = Array.from(rendered.container.querySelectorAll('[role="option"]')).find((item) =>
      item.textContent?.includes('Cherry'),
    ) as HTMLElement | undefined;

    await act(async () => banana?.click());
    expect(onValueChange).not.toHaveBeenCalled();
    await act(async () => cherry?.click());
    expect(onValueChange).toHaveBeenCalledWith('cherry');
    expect(trigger.textContent).toContain('Apple');

    await cleanup(rendered.root, rendered.container);
  });
});
