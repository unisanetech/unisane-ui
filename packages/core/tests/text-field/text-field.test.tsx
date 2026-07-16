// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TextField } from '../../src/components/text-field';

async function render(ui: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => root.render(ui));

  return {
    root,
    container,
    async rerender(nextUi: React.ReactNode) {
      await act(async () => root.render(nextUi));
    },
  };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => root.unmount());
  container.remove();
}

function setNativeValue(control: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const prototype =
    control instanceof HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(control, value);
}

describe('TextField', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('associates the label and floats it for focus and value state', async () => {
    const rendered = await render(<TextField label="Email" />);
    const input = rendered.container.querySelector('input');
    const label = rendered.container.querySelector('label');

    expect(label?.getAttribute('for')).toBe(input?.id ?? null);
    expect(label?.className).toContain('top-1/2');

    await act(async () => input?.dispatchEvent(new FocusEvent('focusin', { bubbles: true })));
    expect(label?.className).toContain('text-label-small');
    expect(label?.className).toContain('text-primary');

    await act(async () => input?.dispatchEvent(new FocusEvent('focusout', { bubbles: true })));
    expect(label?.className).toContain('top-1/2');

    await cleanup(rendered.root, rendered.container);
  });

  it('keeps placeholders readable without overlapping a resting label', async () => {
    const rendered = await render(<TextField label="Email" placeholder="name@example.com" />);
    const input = rendered.container.querySelector('input');
    const label = rendered.container.querySelector('label');

    expect(input?.getAttribute('placeholder')).toBe('name@example.com');
    expect(label?.className).toContain('text-label-small');
    expect(label?.className).not.toContain('top-1/2');

    await cleanup(rendered.root, rendered.container);
  });

  it('links error content, merges external descriptions, and exposes invalid state', async () => {
    const rendered = await render(
      <TextField
        aria-describedby="external-guidance"
        defaultValue="invalid"
        errorMessage="Enter a valid email."
        label="Email"
        required
      />,
    );
    const input = rendered.container.querySelector('input');
    const label = rendered.container.querySelector('label');
    const error = rendered.container.querySelector('[role="alert"]');

    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-describedby')).toBe(`external-guidance ${error?.id}`);
    expect(label?.className).toContain('text-error');
    expect(label?.querySelector('[aria-hidden="true"]')?.textContent).toBe('*');
    expect(error?.textContent).toBe('Enter a valid email.');

    await cleanup(rendered.root, rendered.container);
  });

  it('links non-error descriptions without marking the control invalid', async () => {
    const rendered = await render(<TextField description="Use your work address." label="Email" />);
    const input = rendered.container.querySelector('input');
    const description = rendered.container.querySelector('p');

    expect(input?.hasAttribute('aria-invalid')).toBe(false);
    expect(input?.getAttribute('aria-describedby')).toBe(description?.id ?? null);
    expect(description?.getAttribute('role')).toBeNull();
    expect(description?.textContent).toBe('Use your work address.');

    await cleanup(rendered.root, rendered.container);
  });

  it('uses one string value callback for controlled updates', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <TextField label="Name" value="Alice" onValueChange={onValueChange} />,
    );
    const input = rendered.container.querySelector('input') as HTMLInputElement;

    await act(async () => {
      setNativeValue(input, 'Bob');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith('Bob');
    await rendered.rerender(<TextField label="Name" value="Bob" onValueChange={onValueChange} />);
    expect(input.value).toBe('Bob');

    await cleanup(rendered.root, rendered.container);
  });

  it('preserves numeric controlled values including zero', async () => {
    const rendered = await render(<TextField label="Quantity" type="number" value={0} />);
    const input = rendered.container.querySelector('input') as HTMLInputElement;
    const label = rendered.container.querySelector('label');

    expect(input.value).toBe('0');
    expect(label?.className).toContain('text-label-small');

    await cleanup(rendered.root, rendered.container);
  });

  it('tracks uncontrolled values without changing the native ownership model', async () => {
    const rendered = await render(<TextField defaultValue="Alice" label="Name" />);
    const input = rendered.container.querySelector('input') as HTMLInputElement;
    const label = rendered.container.querySelector('label');

    expect(input.value).toBe('Alice');
    expect(label?.className).toContain('text-label-small');

    await act(async () => {
      setNativeValue(input, '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(label?.className).toContain('top-1/2');

    await cleanup(rendered.root, rendered.container);
  });

  it('supports multiline auto-resize and forwards the real textarea ref', async () => {
    const ref = createRef<HTMLInputElement | HTMLTextAreaElement>();
    const rendered = await render(
      <TextField ref={ref} autoResize autoResizeMaxHeight={80} label="Notes" multiline rows={3} />,
    );
    const textarea = rendered.container.querySelector('textarea') as HTMLTextAreaElement;
    Object.defineProperty(textarea, 'scrollHeight', { configurable: true, value: 120 });

    await act(async () => {
      setNativeValue(textarea, 'Several lines of notes');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(ref.current).toBe(textarea);
    expect(textarea.getAttribute('rows')).toBe('3');
    expect(textarea.style.height).toBe('80px');
    expect(textarea.style.overflowY).toBe('auto');

    await cleanup(rendered.root, rendered.container);
  });

  it('visually hides labels while preserving names and native disabled state', async () => {
    const rendered = await render(
      <TextField disabled hideLabel label="Search projects" placeholder="Search" />,
    );
    const input = rendered.container.querySelector('input');
    const label = rendered.container.querySelector('label');

    expect(input?.hasAttribute('disabled')).toBe(true);
    expect(label?.className).toContain('sr-only');
    expect(label?.getAttribute('for')).toBe(input?.id ?? null);

    await cleanup(rendered.root, rendered.container);
  });
});
