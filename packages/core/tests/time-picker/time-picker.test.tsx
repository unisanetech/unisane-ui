// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TimePicker } from "../../src/components/time-picker";

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

describe("TimePicker", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders from defaultOpen and advances the dial from hour selection to minute selection", async () => {
    const rendered = await render(<TimePicker defaultOpen defaultValue="09:15" />);

    expect(getDialog()).not.toBeNull();

    const hourOption = Array.from(document.querySelectorAll('[role="option"]')).find(
      (option) => option.textContent?.trim() === "3",
    ) as HTMLDivElement | undefined;

    expect(hourOption).toBeDefined();
    expect(document.querySelector('[role="listbox"]')?.getAttribute("aria-label")).toBe(
      "Select hour",
    );

    await act(async () => {
      hourOption?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const minutesButton = Array.from(document.querySelectorAll('[role="button"]')).find(
      (button) => button.getAttribute("aria-label") === "Minutes: 15",
    ) as HTMLDivElement | undefined;

    expect(minutesButton?.getAttribute("aria-pressed")).toBe("true");
    expect(document.querySelector('[role="listbox"]')?.getAttribute("aria-label")).toBe(
      "Select minute",
    );

    await cleanup(rendered.root, rendered.container);
  });

  it("supports keyboard entry mode and saves a formatted time", async () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    const rendered = await render(
      <TimePicker
        defaultOpen
        defaultValue="09:15"
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />,
    );

    const switchButton = document.querySelector(
      'button[aria-label="Switch to keyboard"]',
    ) as HTMLButtonElement | null;

    expect(switchButton).not.toBeNull();

    await act(async () => {
      switchButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const hourInput = document.getElementById(
      document.querySelector('label[for]')?.getAttribute("for") ?? "",
    ) as HTMLInputElement | null;
    const minuteInput = document.querySelectorAll('input[type="number"]')[1] as
      | HTMLInputElement
      | undefined;

    expect(hourInput?.value).toBe("9");
    expect(minuteInput?.value).toBe("15");

    const pmButton = Array.from(document.querySelectorAll('[role="radio"]')).find(
      (radio) => radio.textContent?.trim() === "PM",
    ) as HTMLButtonElement | undefined;
    const okButton = Array.from(document.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "OK",
    ) as HTMLButtonElement | undefined;

    await act(async () => {
      pmButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    await act(async () => {
      okButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith("21:15");
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it("supports controlled open state contracts", async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(<TimePicker open onOpenChange={onOpenChange} value="14:30" />);

    expect(getDialog()).not.toBeNull();

    await rendered.rerender(
      <TimePicker open={false} onOpenChange={onOpenChange} value="14:30" />,
    );

    expect(getDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it("requests close on Escape", async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <TimePicker defaultOpen onOpenChange={onOpenChange} defaultValue="14:30" />,
    );

    expect(getDialog()).not.toBeNull();

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });
});
