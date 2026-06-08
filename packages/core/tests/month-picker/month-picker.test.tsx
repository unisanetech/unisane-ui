// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MonthPicker } from "../../src/components/month-picker";

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

function getMonthDialog() {
  return document.querySelector('[role="dialog"][aria-label="Choose month"]') as HTMLDivElement | null;
}

function getInput(container: HTMLElement) {
  const input = container.querySelector("input") as HTMLInputElement | null;
  if (!input) {
    throw new Error("Expected month picker input to exist");
  }
  return input;
}

describe("MonthPicker", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("opens the month picker and closes on Escape", async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <MonthPicker label="Start" defaultValue="2026-03" onOpenChange={onOpenChange} />,
    );

    const pickerButton = rendered.container.querySelector(
      'button[aria-label="Open month picker"]',
    ) as HTMLButtonElement | null;

    expect(pickerButton).not.toBeNull();
    expect(getMonthDialog()).toBeNull();

    await act(async () => {
      pickerButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(getMonthDialog()).not.toBeNull();

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getMonthDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it("selects a month and stores YYYY-MM", async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <MonthPicker label="Start" defaultValue="2026-03" onValueChange={onValueChange} />,
    );

    const pickerButton = rendered.container.querySelector(
      'button[aria-label="Open month picker"]',
    ) as HTMLButtonElement | null;

    await act(async () => {
      pickerButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const juneButton = document.querySelector(
      'button[aria-label="June 2026"]',
    ) as HTMLButtonElement | null;

    expect(juneButton).not.toBeNull();

    await act(async () => {
      juneButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith("2026-06");
    expect(getMonthDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it("supports controlled value and open state contracts", async () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    const rendered = await render(
      <MonthPicker
        label="Start"
        value="2026-03"
        open
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />,
    );

    expect(getMonthDialog()).not.toBeNull();
    expect(getInput(rendered.container).value).toBe("Mar 2026");

    const aprilButton = document.querySelector(
      'button[aria-label="April 2026"]',
    ) as HTMLButtonElement | null;

    await act(async () => {
      aprilButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith("2026-04");
    expect(onOpenChange).toHaveBeenCalledWith(false);

    await rendered.rerender(
      <MonthPicker
        label="Start"
        value="2026-04"
        open={false}
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />,
    );

    expect(getMonthDialog()).toBeNull();
    expect(getInput(rendered.container).value).toBe("Apr 2026");

    await cleanup(rendered.root, rendered.container);
  });
});
