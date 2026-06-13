// @vitest-environment happy-dom

import React, { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TokenField, splitTokenFieldInput } from '../../src/components/token-field';

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

function setInputValue(input: HTMLInputElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  )?.set;
  valueSetter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('TokenField', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('normalizes pasted token lists', () => {
    expect(splitTokenFieldInput('React, TypeScript\nMongoDB ;  AI   Workflows ')).toEqual([
      'React',
      'TypeScript',
      'MongoDB',
      'AI Workflows',
    ]);
  });

  it('adds tokens with separator keys and ignores duplicate values by default', async () => {
    function Harness() {
      const [value, setValue] = useState<string[]>([]);
      return <TokenField label="Skills" value={value} onValueChange={setValue} />;
    }

    const rendered = await render(<Harness />);
    const input = rendered.container.querySelector('input') as HTMLInputElement | null;
    expect(input).not.toBeNull();

    await act(async () => {
      setInputValue(input as HTMLInputElement, 'React');
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });
    expect(rendered.container.textContent).toContain('React');
    expect(input?.value).toBe('');

    await act(async () => {
      setInputValue(input as HTMLInputElement, 'react');
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: ',', bubbles: true }));
    });

    expect(rendered.container.querySelectorAll('[role="listitem"]')).toHaveLength(1);

    await cleanup(rendered.root, rendered.container);
  });

  it('uses compact token-field padding for the default single-row height', async () => {
    const rendered = await render(<TokenField label="Skills" />);
    const shell = rendered.container.querySelector('.min-h-10');
    const content = rendered.container.querySelector('.flex-wrap');

    expect(shell).not.toBeNull();
    expect(content?.className).toContain('py-1');
    expect(content?.className).not.toContain('py-4');

    await cleanup(rendered.root, rendered.container);
  });

  it('clears the floating label when filled token fields contain chips', async () => {
    const rendered = await render(
      <TokenField label="Skills" value={['React', 'TypeScript']} variant="filled" />,
    );
    const content = rendered.container.querySelector('.flex-wrap');

    expect(content?.className).toContain('pt-6');
    expect(content?.className).toContain('pb-2');

    await cleanup(rendered.root, rendered.container);
  });

  it('splits pasted multi-token content and removes the last token with Backspace', async () => {
    const onValueChange = vi.fn();
    function Harness() {
      const [value, setValue] = useState<string[]>([]);
      return (
        <TokenField
          label="Guests"
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue);
          }}
        />
      );
    }

    const rendered = await render(<Harness />);
    const input = rendered.container.querySelector('input') as HTMLInputElement | null;
    expect(input).not.toBeNull();

    await act(async () => {
      const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: {
          getData: () => 'kevin@example.com, markus@example.com\nlena@example.com',
        },
      });
      input?.dispatchEvent(pasteEvent);
    });

    expect(onValueChange).toHaveBeenLastCalledWith([
      'kevin@example.com',
      'markus@example.com',
      'lena@example.com',
    ]);
    expect(rendered.container.querySelectorAll('[role="listitem"]')).toHaveLength(3);

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    });

    expect(onValueChange).toHaveBeenLastCalledWith(['kevin@example.com', 'markus@example.com']);

    await cleanup(rendered.root, rendered.container);
  });

  it('keeps chip delete controls out of tab order and supports arrow-key chip deletion', async () => {
    const onValueChange = vi.fn();
    function Harness() {
      const [value, setValue] = useState<string[]>(['React', 'TypeScript']);
      return (
        <TokenField
          label="Skills"
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue);
          }}
        />
      );
    }

    const rendered = await render(<Harness />);
    const input = rendered.container.querySelector('input') as HTMLInputElement | null;
    const firstChip = rendered.container.querySelector('[aria-label="React. Press Delete to remove."]');
    const secondChip = rendered.container.querySelector(
      '[aria-label="TypeScript. Press Delete to remove."]',
    );
    const removeButtons = rendered.container.querySelectorAll('button[aria-label^="Remove "]');

    expect(firstChip?.getAttribute('tabindex')).toBe('-1');
    expect(secondChip?.getAttribute('tabindex')).toBe('-1');
    expect(removeButtons[0]?.getAttribute('tabindex')).toBe('-1');
    expect(removeButtons[1]?.getAttribute('tabindex')).toBe('-1');

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    });

    expect(document.activeElement).toBe(secondChip);
    expect(secondChip?.getAttribute('tabindex')).toBe('0');

    await act(async () => {
      secondChip?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    });

    expect(onValueChange).toHaveBeenLastCalledWith(['React']);
    expect(document.activeElement?.getAttribute('aria-label')).toBe('React. Press Delete to remove.');

    await act(async () => {
      document.activeElement?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
      );
    });

    expect(document.activeElement).toBe(input);

    await cleanup(rendered.root, rendered.container);
  });

  it('shows validation feedback and does not add invalid tokens', async () => {
    function Harness() {
      const [value, setValue] = useState<string[]>([]);
      return (
        <TokenField
          label="Invite guests"
          value={value}
          onValueChange={setValue}
          validateToken={(token) =>
            token.includes('@') ? null : 'Enter a valid email address.'
          }
        />
      );
    }

    const rendered = await render(<Harness />);
    const input = rendered.container.querySelector('input') as HTMLInputElement | null;

    await act(async () => {
      setInputValue(input as HTMLInputElement, 'not-an-email');
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });

    const helper = rendered.container.querySelector('span:last-of-type');
    expect(rendered.container.textContent).toContain('Enter a valid email address.');
    expect(rendered.container.querySelectorAll('[role="listitem"]')).toHaveLength(0);
    expect(helper?.className).toContain('text-error');

    await cleanup(rendered.root, rendered.container);
  });
});
