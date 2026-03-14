// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Fab } from "../../src/components/fab";

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

describe("Fab", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders a native button with its label and default type", async () => {
    const onClick = vi.fn();
    const rendered = await render(
      <Fab label="Create" icon={<span aria-hidden="true">+</span>} onClick={onClick} />,
    );
    const button = rendered.container.querySelector("button");

    expect(button).not.toBeNull();
    expect(button?.getAttribute("type")).toBe("button");
    expect(button?.textContent).toContain("Create");

    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);

    await cleanup(rendered.root, rendered.container);
  });

  it("treats loading as disabled and exposes aria-busy", async () => {
    const onClick = vi.fn();
    const rendered = await render(
      <Fab loading label="Create" icon={<span aria-hidden="true">+</span>} onClick={onClick} />,
    );
    const button = rendered.container.querySelector("button");

    expect(button?.disabled).toBe(true);
    expect(button?.getAttribute("aria-busy")).toBe("true");
    expect(button?.getAttribute("data-disabled")).toBe("true");

    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(0);

    await cleanup(rendered.root, rendered.container);
  });

  it("blocks composed child clicks when disabled in asChild mode", async () => {
    const fabClick = vi.fn();
    const childClick = vi.fn();
    const rendered = await render(
      <Fab asChild disabled label="Create" onClick={fabClick}>
        <a href="/create" onClick={childClick}>
          New item
        </a>
      </Fab>,
    );
    const link = rendered.container.querySelector("a");

    expect(link?.getAttribute("aria-disabled")).toBe("true");
    expect(link?.getAttribute("data-disabled")).toBe("true");
    expect(link?.getAttribute("tabindex")).toBe("-1");

    const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
    link?.dispatchEvent(clickEvent);
    expect(clickEvent.defaultPrevented).toBe(true);
    expect(fabClick).toHaveBeenCalledTimes(0);
    expect(childClick).toHaveBeenCalledTimes(0);

    await cleanup(rendered.root, rendered.container);
  });
});
