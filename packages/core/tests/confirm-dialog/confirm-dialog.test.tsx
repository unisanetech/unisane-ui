// @vitest-environment happy-dom

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from '../../src/components/confirm-dialog';

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

function getAlertDialog() {
  return document.querySelector('[role="alertdialog"]') as HTMLDivElement | null;
}

function getButton(label: string) {
  return Array.from(document.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement | undefined;
}

async function click(button: HTMLButtonElement | undefined) {
  await act(async () => {
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

describe('ConfirmDialog', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('renders an alert dialog without a generic close action and focuses cancel first', async () => {
    const rendered = await render(
      <ConfirmDialog
        defaultOpen
        title="Delete project?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => undefined}
      />,
    );

    await act(async () => {
      vi.runAllTimers();
    });

    expect(getAlertDialog()).not.toBeNull();
    expect(document.querySelector('[aria-label="Close dialog"]')).toBeNull();
    expect(document.activeElement).toBe(getButton('Cancel'));

    await cleanup(rendered.root, rendered.container);
  });

  it('always closes after cancellation and reports the state change', async () => {
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    const rendered = await render(
      <ConfirmDialog
        defaultOpen
        onOpenChange={onOpenChange}
        title="Discard changes?"
        onCancel={onCancel}
        onConfirm={() => undefined}
      />,
    );

    await click(getButton('Cancel'));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getAlertDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('closes after success and remains open when confirmation returns false', async () => {
    const successful = await render(
      <ConfirmDialog defaultOpen title="Publish?" onConfirm={() => true} />,
    );

    await click(getButton('Confirm'));
    expect(getAlertDialog()).toBeNull();
    await cleanup(successful.root, successful.container);

    const declined = await render(
      <ConfirmDialog defaultOpen title="Publish?" onConfirm={() => false} />,
    );

    await click(getButton('Confirm'));
    expect(getAlertDialog()).not.toBeNull();
    await cleanup(declined.root, declined.container);
  });

  it('owns promise pending state and blocks dismissal until success settles', async () => {
    let resolveConfirm!: (value: void) => void;
    const pending = new Promise<void>((resolve) => {
      resolveConfirm = resolve;
    });
    const onOpenChange = vi.fn();
    const rendered = await render(
      <ConfirmDialog
        defaultOpen
        onOpenChange={onOpenChange}
        title="Archive item?"
        onConfirm={() => pending}
      />,
    );

    await click(getButton('Confirm'));
    expect(getButton('Cancel')?.disabled).toBe(true);
    expect(getButton('Confirm')?.disabled).toBe(true);

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(getAlertDialog()).not.toBeNull();

    await act(async () => {
      resolveConfirm();
      await pending;
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getAlertDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('keeps the dialog open and routes rejected confirmation to onConfirmError', async () => {
    const error = new Error('request failed');
    const onConfirmError = vi.fn();
    const rendered = await render(
      <ConfirmDialog
        defaultOpen
        title="Remove member?"
        onConfirm={() => Promise.reject(error)}
        onConfirmError={onConfirmError}
      />,
    );

    await click(getButton('Confirm'));

    expect(onConfirmError).toHaveBeenCalledWith(error);
    expect(getAlertDialog()).not.toBeNull();
    expect(getButton('Confirm')?.disabled).toBe(false);

    await cleanup(rendered.root, rendered.container);
  });

  it('honors external loading and confirmDisabled without exposing dismissal races', async () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    const rendered = await render(
      <ConfirmDialog
        defaultOpen
        loading
        confirmDisabled
        onOpenChange={onOpenChange}
        title="Remove access?"
        onConfirm={onConfirm}
      />,
    );

    await click(getButton('Confirm'));
    await click(getButton('Cancel'));
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(getAlertDialog()).not.toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('applies semantic tone styling and forwards the dialog surface ref', async () => {
    const ref = createRef<HTMLDivElement>();
    const rendered = await render(
      <ConfirmDialog
        ref={ref}
        defaultOpen
        tone="danger"
        title="Delete workspace?"
        confirmLabel="Delete"
        onConfirm={() => undefined}
      />,
    );

    expect(ref.current).toBe(getAlertDialog());
    expect(getButton('Delete')?.className).toContain('bg-error');
    expect(document.querySelector('.text-error')).not.toBeNull();

    await cleanup(rendered.root, rendered.container);
  });
});
