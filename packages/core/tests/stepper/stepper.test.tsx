// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Stepper } from '../../src/components/stepper';

const steps = [
  { value: 'account', label: 'Account', description: 'Create your login' },
  { value: 'profile', label: 'Profile', description: 'Add your details' },
  { value: 'confirm', label: 'Confirm', description: 'Review and finish' },
];

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

async function click(element: Element) {
  await act(async () => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

function listItems(container: HTMLElement) {
  return Array.from(container.querySelectorAll('li')) as HTMLLIElement[];
}

describe('Stepper', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders nothing for an empty collection', async () => {
    const rendered = await render(<Stepper steps={[]} value="missing" />);

    expect(rendered.container.firstElementChild).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('uses a passive ordered-list boundary with exactly one current step', async () => {
    const rendered = await render(<Stepper steps={steps} value="profile" />);
    const root = rendered.container.querySelector('ol');
    const items = listItems(rendered.container);

    expect(root).not.toBeNull();
    expect(items).toHaveLength(3);
    expect(rendered.container.querySelectorAll('button')).toHaveLength(0);
    expect(rendered.container.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
    expect(rendered.container.querySelector('[aria-current="step"]')?.textContent).toContain(
      'Profile',
    );
    expect(items[0]?.textContent).toContain('Step 1 of 3, Completed.');
    expect(items[1]?.textContent).toContain('Step 2 of 3.');

    await cleanup(rendered.root, rendered.container);
  });

  it('resolves missing and disabled current values to the first available step', async () => {
    const rendered = await render(
      <Stepper steps={[{ ...steps[0]!, disabled: true }, steps[1]!, steps[2]!]} value="missing" />,
    );

    expect(rendered.container.querySelector('[aria-current="step"]')?.textContent).toContain(
      'Profile',
    );

    await rendered.rerender(
      <Stepper steps={[{ ...steps[0]!, disabled: true }, steps[1]!, steps[2]!]} value="account" />,
    );
    expect(rendered.container.querySelector('[aria-current="step"]')?.textContent).toContain(
      'Profile',
    );

    await cleanup(rendered.root, rendered.container);
  });

  it('derives completion by order while honoring non-conflicting overrides', async () => {
    const rendered = await render(
      <Stepper
        steps={[
          { ...steps[0]!, completed: false },
          { ...steps[1]!, completed: true },
          { ...steps[2]!, completed: true },
        ]}
        value="profile"
      />,
    );
    const items = listItems(rendered.container);

    expect(items[0]?.textContent).not.toContain('Completed');
    expect(items[1]?.textContent).not.toContain('Completed');
    expect(items[1]?.querySelector('[aria-current="step"]')).not.toBeNull();
    expect(items[2]?.textContent).toContain('Completed');

    await cleanup(rendered.root, rendered.container);
  });

  it('uses native buttons only when step selection is enabled', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <Stepper
        steps={[steps[0]!, steps[1]!, { ...steps[2]!, disabled: true }]}
        value="profile"
        onValueChange={onValueChange}
      />,
    );
    const buttons = Array.from(rendered.container.querySelectorAll('button'));

    expect(buttons).toHaveLength(3);
    expect((buttons[2] as HTMLButtonElement).disabled).toBe(true);

    await click(buttons[0]!);
    await click(buttons[1]!);
    await click(buttons[2]!);

    expect(onValueChange.mock.calls).toEqual([['account']]);

    await cleanup(rendered.root, rendered.container);
  });

  it('makes orientation own the sequence and connector geometry', async () => {
    const rendered = await render(<Stepper steps={steps} value="profile" />);
    let root = rendered.container.querySelector('ol')!;
    let connector = rendered.container.querySelector('li > [aria-hidden="true"]')!;

    expect(root.classList.contains('items-start')).toBe(true);
    expect(connector.classList.contains('h-0.5')).toBe(true);
    expect(connector.classList.contains('w-full')).toBe(true);

    await rendered.rerender(<Stepper steps={steps} value="profile" orientation="vertical" />);
    root = rendered.container.querySelector('ol')!;
    connector = rendered.container.querySelector('li > [aria-hidden="true"]')!;

    expect(root.classList.contains('flex-col')).toBe(true);
    expect(connector.classList.contains('w-0.5')).toBe(true);
    expect(connector.classList.contains('bottom-0')).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });

  it('forwards native list attributes and localizes progress status', async () => {
    const ref = createRef<HTMLOListElement>();
    const rendered = await render(
      <Stepper
        ref={ref}
        steps={steps}
        value="profile"
        aria-label="Account setup progress"
        data-testid="setup-steps"
        className="max-w-xl"
        labels={{
          step: (position, total) => `Stage ${position} of ${total}`,
          completed: 'Finished',
        }}
      />,
    );
    const root = rendered.container.querySelector('ol');

    expect(ref.current).toBe(root);
    expect(root?.getAttribute('aria-label')).toBe('Account setup progress');
    expect(root?.dataset.testid).toBe('setup-steps');
    expect(root?.classList.contains('max-w-xl')).toBe(true);
    expect(listItems(rendered.container)[0]?.textContent).toContain('Stage 1 of 3, Finished.');

    await cleanup(rendered.root, rendered.container);
  });
});
