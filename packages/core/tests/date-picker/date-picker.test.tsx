// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DatePicker } from "../../src/components/date-picker";

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

function getCalendarDialog() {
  return document.querySelector('[role="dialog"][aria-label="Choose date"]') as HTMLDivElement | null;
}

describe("DatePicker", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("opens the calendar popover from the calendar button and closes on Escape", async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <DatePicker
        label="Date"
        defaultValue={new Date(2026, 2, 13)}
        onOpenChange={onOpenChange}
      />,
    );

    const calendarButton = rendered.container.querySelector(
      'button[aria-label="Open calendar"]',
    ) as HTMLButtonElement | null;

    expect(calendarButton).not.toBeNull();
    expect(getCalendarDialog()).toBeNull();

    await act(async () => {
      calendarButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(getCalendarDialog()).not.toBeNull();

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getCalendarDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it("selects a date from the calendar and closes the popover", async () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    const rendered = await render(
      <DatePicker
        label="Date"
        defaultValue={new Date(2026, 2, 13)}
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />,
    );

    const calendarButton = rendered.container.querySelector(
      'button[aria-label="Open calendar"]',
    ) as HTMLButtonElement | null;

    await act(async () => {
      calendarButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const dayButton = Array.from(
      document.querySelectorAll('button[aria-label*="March 20, 2026"]'),
    )[0] as HTMLButtonElement | undefined;

    expect(dayButton).toBeDefined();

    await act(async () => {
      dayButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalled();
    const selectedDate = onValueChange.mock.calls[0]?.[0] as Date | undefined;
    expect(selectedDate?.getFullYear()).toBe(2026);
    expect(selectedDate?.getMonth()).toBe(2);
    expect(selectedDate?.getDate()).toBe(20);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getCalendarDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });

  it("supports controlled open state contracts", async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <DatePicker
        label="Date"
        value={new Date(2026, 2, 13)}
        open
        onOpenChange={onOpenChange}
      />,
    );

    expect(getCalendarDialog()).not.toBeNull();

    await act(async () => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);

    await rendered.rerender(
      <DatePicker
        label="Date"
        value={new Date(2026, 2, 13)}
        open={false}
        onOpenChange={onOpenChange}
      />,
    );

    expect(getCalendarDialog()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });
});
