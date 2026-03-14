// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Dialog } from "../../src/components/dialog";

async function render(ui: React.ReactNode) {
  const container = document.createElement("div");
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

describe("Dialog", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = "";
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  });

  it("renders from defaultOpen with the expected ARIA wiring and scroll lock", async () => {
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
    const title = document.getElementById(dialog?.getAttribute("aria-labelledby") ?? "");
    const description = document.getElementById(dialog?.getAttribute("aria-describedby") ?? "");

    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(title?.textContent).toContain("Delete item");
    expect(description?.textContent).toContain("This action cannot be undone.");
    expect(document.body.style.overflow).toBe("hidden");

    await cleanup(rendered.root, rendered.container);
  });

  it("focuses the first focusable element and restores the previous active element on close", async () => {
    const opener = document.createElement("button");
    opener.textContent = "Open";
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

    expect((document.activeElement as HTMLElement | null)?.getAttribute("aria-label")).toBe(
      "Close dialog",
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

  it("closes through Escape via onOpenChange", async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <Dialog defaultOpen onOpenChange={onOpenChange} title="Dialog title">
        Body
      </Dialog>,
    );

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it("closes through backdrop click via onOpenChange", async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <Dialog defaultOpen onOpenChange={onOpenChange} title="Dialog title">
        Body
      </Dialog>,
    );

    const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLDivElement | null;
    expect(backdrop).not.toBeNull();

    await act(async () => {
      backdrop?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it("uses body content as aria-describedby when no description prop is provided", async () => {
    const rendered = await render(
      <Dialog defaultOpen title="Profile">
        <button type="button">Focusable body action</button>
      </Dialog>,
    );

    const dialog = getDialog();
    const bodyDescription = document.getElementById(dialog?.getAttribute("aria-describedby") ?? "");

    expect(bodyDescription).not.toBeNull();
    expect(bodyDescription?.textContent).toContain("Focusable body action");

    await cleanup(rendered.root, rendered.container);
  });
});
