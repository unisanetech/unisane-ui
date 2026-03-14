// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toast, Toaster } from "../../src/components/toast";

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
  };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

function getStatusToasts() {
  return Array.from(document.querySelectorAll('[role="status"]')) as HTMLDivElement[];
}

function getAlertToasts() {
  return Array.from(document.querySelectorAll('[role="alert"]')) as HTMLDivElement[];
}

describe("Toast", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = "";
    toast.dismissAll();
  });

  it("renders success toasts from the imperative API with polite status semantics", async () => {
    const rendered = await render(<Toaster />);

    await act(async () => {
      toast.success("Saved changes", { description: "Your profile was updated." });
    });

    const [statusToast] = getStatusToasts();
    expect(statusToast).not.toBeUndefined();
    expect(statusToast.getAttribute("aria-live")).toBe("polite");
    expect(statusToast.textContent).toContain("Saved changes");
    expect(statusToast.textContent).toContain("Your profile was updated.");

    await cleanup(rendered.root, rendered.container);
  });

  it("uses alert semantics for error toasts", async () => {
    const rendered = await render(<Toaster />);

    await act(async () => {
      toast.error("Sync failed");
    });

    const [alertToast] = getAlertToasts();
    expect(alertToast).not.toBeUndefined();
    expect(alertToast.getAttribute("aria-live")).toBe("assertive");
    expect(alertToast.textContent).toContain("Sync failed");

    await cleanup(rendered.root, rendered.container);
  });

  it("runs toast actions and dismisses the toast after the action completes", async () => {
    const onUndo = vi.fn();
    const rendered = await render(<Toaster />);

    await act(async () => {
      toast.show({
        message: "Message archived",
        action: {
          label: "Undo",
          onClick: onUndo,
        },
        duration: 0,
      });
    });

    const actionButton = Array.from(document.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Undo",
    );

    expect(actionButton).toBeDefined();

    await act(async () => {
      actionButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(getStatusToasts()).toHaveLength(0);

    await cleanup(rendered.root, rendered.container);
  });

  it("auto-dismisses after the configured duration and supports dismissAll with maxToasts", async () => {
    const rendered = await render(<Toaster maxToasts={2} />);

    await act(async () => {
      toast.show({ message: "First", duration: 0 });
      toast.show({ message: "Second", duration: 0 });
      toast.show({ message: "Third", duration: 50 });
    });

    expect(getStatusToasts()).toHaveLength(2);
    expect(document.body.textContent).not.toContain("First");
    expect(document.body.textContent).toContain("Second");
    expect(document.body.textContent).toContain("Third");

    await act(async () => {
      vi.advanceTimersByTime(50);
    });

    expect(document.body.textContent).not.toContain("Third");

    await act(async () => {
      toast.dismissAll();
    });

    expect(getStatusToasts()).toHaveLength(0);

    await cleanup(rendered.root, rendered.container);
  });
});
