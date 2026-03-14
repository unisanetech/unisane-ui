// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Input } from "../../src/primitives/input";

async function render(ui: React.ReactNode) {
  const container = document.createElement("div");
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

describe("Input", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders native input semantics without floating-field behavior", async () => {
    const rendered = await render(<Input placeholder="Search" defaultValue="Alpha" />);
    const input = rendered.container.querySelector("input") as HTMLInputElement | null;
    const label = rendered.container.querySelector("label");

    expect(input).not.toBeNull();
    expect(input?.placeholder).toBe("Search");
    expect(input?.value).toBe("Alpha");
    expect(label).toBeNull();
    expect(input?.className).toContain("rounded-sm");

    await cleanup(rendered.root, rendered.container);
  });

  it("applies the shared field size rhythm and disabled semantics", async () => {
    const rendered = await render(<Input size="lg" disabled />);
    const input = rendered.container.querySelector("input") as HTMLInputElement | null;

    expect(input).not.toBeNull();
    expect(input?.disabled).toBe(true);
    expect(input?.className).toContain("h-12");
    expect(input?.className).toContain("disabled:opacity-50");

    await cleanup(rendered.root, rendered.container);
  });
});
