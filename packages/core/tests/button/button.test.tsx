// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "../../src/components/button";

function installMatchMedia(initialMatches = false) {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: () => ({
      get matches() {
        return matches;
      },
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener);
      },
      removeEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener);
      },
      addListener: (listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener);
      },
      removeListener: (listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener);
      },
      dispatchEvent: () => true,
    }),
  });

  return {
    setMatches(nextMatches: boolean) {
      matches = nextMatches;
      const event = { matches } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

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

describe("Button", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    installMatchMedia(false);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders a native button with the expected default semantics", async () => {
    const onClick = vi.fn();
    const rendered = await render(<Button onClick={onClick}>Save</Button>);
    const button = rendered.container.querySelector("button");

    expect(button).not.toBeNull();
    expect(button?.getAttribute("type")).toBe("button");
    expect(button?.textContent).toContain("Save");

    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);

    await cleanup(rendered.root, rendered.container);
  });

  it("treats loading as disabled and exposes aria-busy", async () => {
    const onClick = vi.fn();
    const rendered = await render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = rendered.container.querySelector("button");

    expect(button?.disabled).toBe(true);
    expect(button?.getAttribute("aria-busy")).toBe("true");
    expect(button?.getAttribute("data-disabled")).toBe("true");

    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(0);

    await cleanup(rendered.root, rendered.container);
  });

  it("renders asChild without losing the composed click behavior", async () => {
    const buttonClick = vi.fn();
    const childClick = vi.fn();
    const rendered = await render(
      <Button asChild onClick={buttonClick}>
        <a href="/docs" onClick={childClick}>
          Docs
        </a>
      </Button>,
    );
    const link = rendered.container.querySelector("a");

    expect(link).not.toBeNull();
    expect(link?.getAttribute("aria-disabled")).toBeNull();
    expect(link?.textContent).toContain("Docs");

    link?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(buttonClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);

    await cleanup(rendered.root, rendered.container);
  });

  it("blocks composed child clicks when disabled in asChild mode", async () => {
    const buttonClick = vi.fn();
    const childClick = vi.fn();
    const rendered = await render(
      <Button asChild disabled onClick={buttonClick}>
        <a href="/docs" onClick={childClick}>
          Docs
        </a>
      </Button>,
    );
    const link = rendered.container.querySelector("a");

    expect(link?.getAttribute("aria-disabled")).toBe("true");
    expect(link?.getAttribute("data-disabled")).toBe("true");
    expect(link?.getAttribute("tabindex")).toBe("-1");

    const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
    link?.dispatchEvent(clickEvent);
    expect(clickEvent.defaultPrevented).toBe(true);
    expect(buttonClick).toHaveBeenCalledTimes(0);
    expect(childClick).toHaveBeenCalledTimes(0);

    await cleanup(rendered.root, rendered.container);
  });
});
