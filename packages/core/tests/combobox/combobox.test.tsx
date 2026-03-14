// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Combobox } from "../../src/components/combobox";

const OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", disabled: true },
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

describe("Combobox", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("opens from focus in searchable mode and filters options from typed input", async () => {
    const onSearchChange = vi.fn();
    const rendered = await render(
      <Combobox
        label="Fruit"
        options={OPTIONS}
        onSearchChange={onSearchChange}
      />,
    );

    const input = rendered.container.querySelector('input[role="combobox"]') as HTMLInputElement | null;
    expect(input).not.toBeNull();

    await act(async () => {
      input?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    });

    expect(input?.getAttribute("aria-expanded")).toBe("true");

    await act(async () => {
      const valueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      valueSetter?.call(input, "ap");
      input?.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(onSearchChange).toHaveBeenCalledWith("ap");
    expect(document.body.textContent).toContain("Apple");
    expect(document.body.textContent).not.toContain("Banana");

    await cleanup(rendered.root, rendered.container);
  });

  it("selects highlighted options from keyboard and closes on Escape", async () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    const rendered = await render(
      <Combobox
        label="Fruit"
        options={OPTIONS}
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />,
    );

    const input = rendered.container.querySelector('input[role="combobox"]') as HTMLInputElement | null;
    expect(input).not.toBeNull();

    await act(async () => {
      input?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    });

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    });

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    });

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(input?.value).toBe("Banana");

    await act(async () => {
      input?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(input?.getAttribute("aria-expanded")).toBe("false");

    await cleanup(rendered.root, rendered.container);
  });

  it("supports non-searchable trigger mode with combobox semantics", async () => {
    const onOpenChange = vi.fn();
    const rendered = await render(
      <Combobox
        options={OPTIONS}
        placeholder="Choose fruit"
        searchable={false}
        onOpenChange={onOpenChange}
      />,
    );

    const trigger = rendered.container.querySelector('[role="combobox"]') as HTMLDivElement | null;
    expect(trigger).not.toBeNull();
    expect(trigger?.textContent).toContain("Choose fruit");

    await act(async () => {
      trigger?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");

    await cleanup(rendered.root, rendered.container);
  });
});
