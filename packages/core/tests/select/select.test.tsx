// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Select, type SelectOption } from "../../src/components/select";

const OPTIONS: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana", disabled: true },
  { value: "cherry", label: "Cherry" },
];

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

function getTrigger(container: HTMLElement) {
  const trigger = container.querySelector('button[role="combobox"]') as HTMLButtonElement | null;
  if (!trigger) {
    throw new Error("Expected combobox trigger to exist");
  }
  return trigger;
}

function getListbox() {
  return document.querySelector('[role="listbox"]') as HTMLElement | null;
}

describe("Select", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders placeholder semantics for unlabeled selects", async () => {
    const rendered = await render(
      <Select options={OPTIONS} placeholder="Choose a fruit" />,
    );
    const trigger = getTrigger(rendered.container);

    expect(trigger.getAttribute("aria-label")).toBe("Choose a fruit");
    expect(trigger.textContent).toContain("Choose a fruit");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    await cleanup(rendered.root, rendered.container);
  });

  it("opens from keyboard, skips disabled options, and selects via Enter", async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <Select label="Fruit" options={OPTIONS} onValueChange={onValueChange} />,
    );
    const trigger = getTrigger(rendered.container);

    await act(async () => {
      trigger.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
      );
    });

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const listbox = getListbox();
    expect(listbox).not.toBeNull();
    expect(trigger.getAttribute("aria-activedescendant")).toContain("option-0");

    await act(async () => {
      trigger.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
      );
    });

    expect(trigger.getAttribute("aria-activedescendant")).toContain("option-2");

    await act(async () => {
      trigger.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
    });

    expect(onValueChange).toHaveBeenCalledWith("cherry");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.textContent).toContain("Cherry");

    await cleanup(rendered.root, rendered.container);
  });

  it("supports controlled value and open state contracts", async () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    const rendered = await render(
      <Select
        label="Fruit"
        options={OPTIONS}
        value="apple"
        open
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />,
    );
    const trigger = getTrigger(rendered.container);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.textContent).toContain("Apple");

    const cherryOption = document.getElementById(
      `${trigger.getAttribute("aria-controls")}-option-2`,
    );

    await act(async () => {
      cherryOption?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith("cherry");
    expect(onOpenChange).toHaveBeenCalledWith(false);

    await rendered.rerender(
      <Select
        label="Fruit"
        options={OPTIONS}
        value="cherry"
        open={false}
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />,
    );

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.textContent).toContain("Cherry");

    await cleanup(rendered.root, rendered.container);
  });

  it("closes on Escape when open", async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <Select label="Fruit" options={OPTIONS} defaultOpen onOpenChange={onOpenChange} />,
    );
    const trigger = getTrigger(rendered.container);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    await act(async () => {
      trigger.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(getListbox()).toBeNull();

    await cleanup(rendered.root, rendered.container);
  });
});
