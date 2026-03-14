// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TextField } from "../../src/components/text-field";

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

describe("TextField", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("keeps the label resting when empty and floats it after focus", async () => {
    const rendered = await render(<TextField label="Email" />);
    const input = rendered.container.querySelector("input");
    const label = rendered.container.querySelector("label");

    expect(input).not.toBeNull();
    expect(label).not.toBeNull();
    expect(label?.className).toContain("top-1/2");
    expect(label?.className).not.toContain("text-label-small");

    await act(async () => {
      input?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    });

    expect(label?.className).toContain("text-label-small");
    expect(label?.className).toContain("text-primary");
    expect(label?.className).not.toContain("top-1/2");

    await act(async () => {
      input?.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    });

    expect(label?.className).toContain("top-1/2");
    expect(label?.className).not.toContain("text-label-small");

    await cleanup(rendered.root, rendered.container);
  });

  it("floats the label when seeded with a value and keeps helper text in sync with error state", async () => {
    const rendered = await render(
      <TextField
        label="Email"
        defaultValue="alice@example.com"
        helperText="Email is required"
        error
      />,
    );
    const input = rendered.container.querySelector("input");
    const label = rendered.container.querySelector("label");
    const helper = rendered.container.querySelector("span:last-of-type");

    expect((input as HTMLInputElement | null)?.value).toBe("alice@example.com");
    expect(label?.className).toContain("text-label-small");
    expect(label?.className).toContain("text-error");
    expect(helper?.textContent).toContain("Email is required");
    expect(helper?.className).toContain("text-error");

    await cleanup(rendered.root, rendered.container);
  });

  it("updates controlled values and forwards native change events", async () => {
    const onChange = vi.fn();
    const rendered = await render(
      <TextField label="Name" value="Alice" onChange={onChange} />,
    );
    const input = rendered.container.querySelector("input") as HTMLInputElement | null;
    const label = rendered.container.querySelector("label");

    expect(input?.value).toBe("Alice");
    expect(label?.className).toContain("text-label-small");

    if (!input) {
      throw new Error("Expected input to exist");
    }

    await act(async () => {
      const valueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      valueSetter?.call(input, "Bob");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(onChange).toHaveBeenCalled();

    await rendered.rerender(<TextField label="Name" value="Bob" onChange={onChange} />);
    expect(input.value).toBe("Bob");
    expect(label?.className).toContain("text-label-small");

    await cleanup(rendered.root, rendered.container);
  });

  it("renders textarea semantics when multiline is enabled", async () => {
    const rendered = await render(
      <TextField
        label="Notes"
        multiline
        helperText="Add extra context"
        defaultValue="Initial notes"
      />,
    );
    const textarea = rendered.container.querySelector("textarea") as HTMLTextAreaElement | null;
    const input = rendered.container.querySelector("input");
    const label = rendered.container.querySelector("label");

    expect(input).toBeNull();
    expect(textarea).not.toBeNull();
    expect(textarea?.value).toBe("Initial notes");
    expect(textarea?.className).toContain("resize-none");
    expect(label?.getAttribute("for")).toBe(textarea?.id ?? null);
    expect(label?.className).toContain("text-label-small");

    await cleanup(rendered.root, rendered.container);
  });
});
