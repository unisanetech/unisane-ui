// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Dialog } from '../../src/components/dialog';

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

function getDialog() {
  return document.querySelector('[role="dialog"]') as HTMLDivElement | null;
}

describe('Dialog', () => {
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

  it('renders from defaultOpen with the expected ARIA wiring and scroll lock', async () => {
    const rendered = await render(
      <Dialog
        defaultOpen
        title="Delete item"
        description="This action cannot be undone."
        actions={<button type="button">Confirm</button>}
      >
        Dialog body
      </Dialog>,
    );

    const dialog = getDialog();
    const title = document.getElementById(dialog?.getAttribute('aria-labelledby') ?? '');
    const description = document.getElementById(dialog?.getAttribute('aria-describedby') ?? '');

    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(title?.textContent).toContain('Delete item');
    expect(description?.textContent).toContain('This action cannot be undone.');
    expect(document.body.style.overflow).toBe('hidden');

    await cleanup(rendered.root, rendered.container);
  });

  it('focuses the first focusable element and restores the previous active element on close', async () => {
    const opener = document.createElement('button');
    opener.textContent = 'Open';
    document.body.appendChild(opener);
    opener.focus();

    const rendered = await render(
      <Dialog
        defaultOpen
        title="Preferences"
        actions={
          <>
            <button type="button">Cancel</button>
            <button type="button">Save</button>
          </>
        }
      >
        Body
      </Dialog>,
    );

    await act(async () => {
      vi.runAllTimers();
    });

    expect((document.activeElement as HTMLElement | null)?.getAttribute('aria-label')).toBe(
      'Close dialog',
    );

    await rendered.rerender(
      <Dialog
        open={false}
        title="Preferences"
        actions={
          <>
            <button type="button">Cancel</button>
            <button type="button">Save</button>
          </>
        }
      >
        Body
      </Dialog>,
    );

    expect(getDialog()).toBeNull();
    expect(document.activeElement).toBe(opener);

    opener.remove();
    await cleanup(rendered.root, rendered.container);
  });

  it('closes through Escape via onOpenChange', async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <Dialog defaultOpen onOpenChange={onOpenChange} title="Dialog title">
        Body
      </Dialog>,
    );

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('closes through backdrop click via onOpenChange', async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <Dialog defaultOpen onOpenChange={onOpenChange} title="Dialog title">
        Body
      </Dialog>,
    );

    const backdrop = document.querySelector('.bg-scrim') as HTMLDivElement | null;
    expect(backdrop).not.toBeNull();

    await act(async () => {
      backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it('makes the background inert while open and restores it on close', async () => {
    const rendered = await render(
      <Dialog defaultOpen title="Modal settings">
        Body
      </Dialog>,
    );

    expect(rendered.container.hasAttribute('inert')).toBe(true);
    expect(rendered.container.getAttribute('aria-hidden')).toBe('true');

    await rendered.rerender(
      <Dialog open={false} title="Modal settings">
        Body
      </Dialog>,
    );

    expect(rendered.container.hasAttribute('inert')).toBe(false);
    expect(rendered.container.hasAttribute('aria-hidden')).toBe(false);

    await cleanup(rendered.root, rendered.container);
  });

  it('contains forward and reverse Tab focus within the modal', async () => {
    const rendered = await render(
      <Dialog defaultOpen title="Keyboard settings" actions={<button type="button">Save</button>}>
        Body
      </Dialog>,
    );

    await act(async () => {
      vi.runAllTimers();
    });

    const close = document.querySelector('[aria-label="Close dialog"]') as HTMLButtonElement;
    const save = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent === 'Save',
    ) as HTMLButtonElement;

    save.focus();
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    });
    expect(document.activeElement).toBe(close);

    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }),
      );
    });
    expect(document.activeElement).toBe(save);

    await cleanup(rendered.root, rendered.container);
  });

  it('does not flatten complex body content into aria-describedby', async () => {
    const rendered = await render(
      <Dialog defaultOpen title="Profile">
        <button type="button">Focusable body action</button>
      </Dialog>,
    );

    const dialog = getDialog();
    expect(dialog?.hasAttribute('aria-describedby')).toBe(false);

    await cleanup(rendered.root, rendered.container);
  });

  it('supports an explicit accessible label, role, and merged description references', async () => {
    const externalDescription = document.createElement('p');
    externalDescription.id = 'external-dialog-description';
    externalDescription.textContent = 'External context';
    document.body.appendChild(externalDescription);

    const rendered = await render(
      <Dialog
        defaultOpen
        aria-label="Session warning"
        aria-describedby="external-dialog-description"
        description="Unsaved work will be lost."
        role="alertdialog"
      />,
    );

    const dialog = document.querySelector('[role="alertdialog"]') as HTMLDivElement | null;
    const describedBy = dialog?.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(dialog?.getAttribute('aria-label')).toBe('Session warning');
    expect(dialog?.hasAttribute('aria-labelledby')).toBe(false);
    expect(describedBy).toContain('external-dialog-description');
    expect(describedBy).toHaveLength(2);
    expect(describedBy.map((id) => document.getElementById(id)?.textContent)).toContain(
      'Unsaved work will be lost.',
    );

    externalDescription.remove();
    await cleanup(rendered.root, rendered.container);
  });
});
