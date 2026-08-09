// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Toast, toast, Toaster } from '../../src/components/toast';

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

function getStatusToasts() {
  return Array.from(document.querySelectorAll<HTMLDivElement>('[role="status"]'));
}

function getAlertToasts() {
  return Array.from(document.querySelectorAll<HTMLDivElement>('[role="alert"]'));
}

describe('Toast', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    toast.dismissAll();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
    toast.dismissAll();
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  });

  it('queues notifications before the host mounts and returns monotonic IDs', async () => {
    const firstId = toast.info('Queued before mount', { duration: 0 });
    const secondId = toast.info('Queued second', { duration: 0 });

    expect(firstId).toMatch(/^toast-\d+$/);
    expect(Number(secondId.replace('toast-', ''))).toBeGreaterThan(
      Number(firstId.replace('toast-', '')),
    );

    const rendered = await render(<Toaster />);
    expect(document.body.textContent).toContain('Queued before mount');
    expect(document.body.textContent).toContain('Queued second');

    await cleanup(rendered.root, rendered.container);
  });

  it('renders semantic tones with atomic announcement defaults', async () => {
    const rendered = await render(<Toaster />);

    await act(async () => {
      toast.success('Saved changes', { description: 'Your profile was updated.' });
      toast.warning('Session ending');
      toast.error('Sync failed');
    });

    expect(getStatusToasts()).toHaveLength(2);
    expect(getStatusToasts()[0]?.getAttribute('aria-live')).toBe('polite');
    expect(getStatusToasts()[1]?.getAttribute('aria-live')).toBe('polite');
    expect(getAlertToasts()).toHaveLength(1);
    expect(getAlertToasts()[0]?.getAttribute('aria-live')).toBe('assertive');
    expect(getAlertToasts()[0]?.getAttribute('aria-atomic')).toBe('true');

    await cleanup(rendered.root, rendered.container);
  });

  it('renders the public recipe directly and dismisses through its close action', async () => {
    const onDismiss = vi.fn();
    const rendered = await render(
      <Toast message="Declarative notification" duration={0} onDismiss={onDismiss} />,
    );

    const closeButton = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Dismiss notification"]',
    );
    expect(closeButton).not.toBeNull();

    await act(async () => {
      closeButton?.click();
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);

    await cleanup(rendered.root, rendered.container);
  });

  it('runs an action and removes its stored notification', async () => {
    const onUndo = vi.fn();
    const rendered = await render(<Toaster />);

    await act(async () => {
      toast.show({
        message: 'Message archived',
        action: { label: 'Undo', onClick: onUndo },
        duration: 0,
      });
    });

    const actionButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Undo',
    );
    await act(async () => {
      actionButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(getStatusToasts()).toHaveLength(0);

    await cleanup(rendered.root, rendered.container);
  });

  it('dismisses one notification by ID without removing its siblings', async () => {
    const rendered = await render(<Toaster />);
    let firstId = '';

    await act(async () => {
      firstId = toast.show({ message: 'First', duration: 0 });
      toast.show({ message: 'Second', duration: 0 });
    });
    await act(async () => {
      toast.dismiss(firstId);
    });

    expect(document.body.textContent).not.toContain('First');
    expect(document.body.textContent).toContain('Second');

    await cleanup(rendered.root, rendered.container);
  });

  it('limits visible notifications and treats a zero maximum as empty', async () => {
    const rendered = await render(<Toaster maxToasts={2} />);

    await act(async () => {
      toast.show({ message: 'First', duration: 0 });
      toast.show({ message: 'Second', duration: 0 });
      toast.show({ message: 'Third', duration: 0 });
    });

    expect(getStatusToasts()).toHaveLength(2);
    expect(document.body.textContent).not.toContain('First');

    await act(async () => {
      rendered.root.render(<Toaster maxToasts={0} />);
    });
    expect(getStatusToasts()).toHaveLength(0);

    await cleanup(rendered.root, rendered.container);
  });

  it('pauses auto-dismiss while the pointer is over the notification', async () => {
    const rendered = await render(<Toaster />);
    await act(async () => {
      toast.show({ message: 'Hover me', duration: 100 });
    });

    const item = getStatusToasts()[0];
    await act(async () => {
      vi.advanceTimersByTime(40);
      item?.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
      vi.advanceTimersByTime(200);
    });
    expect(document.body.textContent).toContain('Hover me');

    await act(async () => {
      item?.dispatchEvent(new PointerEvent('pointerout', { bubbles: true }));
      vi.advanceTimersByTime(60);
    });
    expect(document.body.textContent).not.toContain('Hover me');

    await cleanup(rendered.root, rendered.container);
  });

  it('pauses auto-dismiss while an action retains keyboard focus', async () => {
    const rendered = await render(<Toaster />);
    await act(async () => {
      toast.show({
        message: 'Focused notification',
        action: { label: 'Review', onClick: vi.fn() },
        duration: 100,
      });
    });

    const action = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.trim() === 'Review',
    );
    await act(async () => {
      vi.advanceTimersByTime(40);
      action?.focus();
      vi.advanceTimersByTime(200);
    });
    expect(document.body.textContent).toContain('Focused notification');

    await act(async () => {
      action?.blur();
      vi.advanceTimersByTime(60);
    });
    expect(document.body.textContent).not.toContain('Focused notification');

    await cleanup(rendered.root, rendered.container);
  });

  it('pauses auto-dismiss while the page is hidden', async () => {
    const rendered = await render(<Toaster />);
    await act(async () => {
      toast.show({ message: 'Hidden page', duration: 100 });
    });
    await act(async () => {
      vi.advanceTimersByTime(40);
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
      vi.advanceTimersByTime(200);
    });
    expect(document.body.textContent).toContain('Hidden page');

    await act(async () => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: false });
      document.dispatchEvent(new Event('visibilitychange'));
      vi.advanceTimersByTime(61);
    });
    expect(document.body.textContent).not.toContain('Hidden page');

    await cleanup(rendered.root, rendered.container);
  });

  it('renders no portal markup during server rendering', () => {
    expect(renderToString(<Toaster />)).toBe('');
  });
});
