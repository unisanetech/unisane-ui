// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ThemeProvider,
  useTheme,
} from "../../src/layout/theme-provider";

type MatchMediaController = {
  setMatches: (nextMatches: boolean) => void;
};

function installMatchMedia(initialMatches = false): MatchMediaController {
  let matches = initialMatches;
  const listeners = new Set<() => void>();

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: () => ({
      get matches() {
        return matches;
      },
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addEventListener: (_event: string, listener: () => void) => {
        listeners.add(listener);
      },
      removeEventListener: (_event: string, listener: () => void) => {
        listeners.delete(listener);
      },
      addListener: (listener: () => void) => {
        listeners.add(listener);
      },
      removeListener: (listener: () => void) => {
        listeners.delete(listener);
      },
      dispatchEvent: () => true,
    }),
  });

  return {
    setMatches(nextMatches) {
      matches = nextMatches;
      listeners.forEach((listener) => listener());
    },
  };
}

function setHtmlAttributes(attrs: Record<string, string>) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(attrs)) {
    root.setAttribute(key, value);
  }
}

function resetHtmlAttributes() {
  const root = document.documentElement;
  for (const name of [
    "data-density",
    "data-radius",
    "data-action-shape",
    "data-scheme",
    "data-contrast",
    "data-color-theme",
    "data-theme-mode",
    "data-elevation",
  ]) {
    root.removeAttribute(name);
  }
  root.classList.remove("dark", "light");
  root.style.colorScheme = "";
}

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
  });
}

async function renderThemeProvider({
  storageKey = false,
}: {
  storageKey?: string | false;
} = {}) {
  let capturedTheme: ReturnType<typeof useTheme> | undefined;
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  function Probe() {
    capturedTheme = useTheme();
    return null;
  }

  await act(async () => {
    root.render(
      <ThemeProvider storageKey={storageKey}>
        <Probe />
      </ThemeProvider>,
    );
  });

  await flushEffects();

  return {
    container,
    root,
    getTheme() {
      if (!capturedTheme) {
        throw new Error("Theme context was not captured");
      }
      return capturedTheme;
    },
  };
}

async function cleanupRoot(root: Root, container: HTMLElement) {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    resetHtmlAttributes();
    localStorage.clear();
    installMatchMedia(false);
  });

  afterEach(() => {
    resetHtmlAttributes();
    localStorage.clear();
  });

  it("bootstraps theme state from HTML attributes", async () => {
    setHtmlAttributes({
      "data-density": "compact",
      "data-radius": "soft",
      "data-action-shape": "full",
      "data-scheme": "neutral",
      "data-contrast": "high",
      "data-color-theme": "green",
      "data-theme-mode": "dark",
      "data-elevation": "pronounced",
    });

    const rendered = await renderThemeProvider();
    const theme = rendered.getTheme();

    expect(theme.density).toBe("compact");
    expect(theme.radius).toBe("soft");
    expect(theme.actionShape).toBe("full");
    expect(theme.scheme).toBe("neutral");
    expect(theme.contrast).toBe("high");
    expect(theme.colorTheme).toBe("green");
    expect(theme.theme).toBe("dark");
    expect(theme.elevation).toBe("pronounced");
    expect(theme.resolvedTheme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");

    await cleanupRoot(rendered.root, rendered.container);
  });

  it("prefers valid localStorage values over HTML defaults", async () => {
    setHtmlAttributes({
      "data-density": "standard",
      "data-color-theme": "blue",
      "data-theme-mode": "light",
    });
    localStorage.setItem(
      "theme-provider-storage",
      JSON.stringify({
        density: "comfortable",
        colorTheme: "purple",
        theme: "dark",
        contrast: "medium",
      }),
    );

    const rendered = await renderThemeProvider({ storageKey: "theme-provider-storage" });
    const theme = rendered.getTheme();

    expect(theme.density).toBe("comfortable");
    expect(theme.colorTheme).toBe("purple");
    expect(theme.theme).toBe("dark");
    expect(theme.contrast).toBe("medium");
    expect(document.documentElement.getAttribute("data-density")).toBe("comfortable");
    expect(document.documentElement.getAttribute("data-color-theme")).toBe("purple");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await cleanupRoot(rendered.root, rendered.container);
  });

  it("ignores invalid stored values and falls back to HTML attributes", async () => {
    setHtmlAttributes({
      "data-density": "dense",
      "data-color-theme": "cyan",
      "data-theme-mode": "light",
    });
    localStorage.setItem(
      "theme-provider-invalid",
      JSON.stringify({
        density: "invalid-density",
        colorTheme: "invalid-color",
        theme: "invalid-theme",
      }),
    );

    const rendered = await renderThemeProvider({ storageKey: "theme-provider-invalid" });
    const theme = rendered.getTheme();

    expect(theme.density).toBe("dense");
    expect(theme.colorTheme).toBe("cyan");
    expect(theme.theme).toBe("light");

    await cleanupRoot(rendered.root, rendered.container);
  });

  it("does not persist when storageKey is false", async () => {
    setHtmlAttributes({
      "data-density": "standard",
      "data-color-theme": "blue",
      "data-theme-mode": "light",
    });

    const rendered = await renderThemeProvider({ storageKey: false });

    await act(async () => {
      rendered.getTheme().setDensity("compact");
      rendered.getTheme().setColorTheme("green");
      rendered.getTheme().setTheme("dark");
    });
    await flushEffects();

    expect(localStorage.length).toBe(0);
    expect(document.documentElement.getAttribute("data-density")).toBe("compact");
    expect(document.documentElement.getAttribute("data-color-theme")).toBe("green");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await cleanupRoot(rendered.root, rendered.container);
  });

  it("reacts to system color-scheme changes when theme is system", async () => {
    const matchMedia = installMatchMedia(false);
    setHtmlAttributes({
      "data-theme-mode": "system",
      "data-color-theme": "blue",
    });

    const rendered = await renderThemeProvider();

    expect(rendered.getTheme().theme).toBe("system");
    expect(rendered.getTheme().resolvedTheme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    await act(async () => {
      matchMedia.setMatches(true);
    });
    await flushEffects();

    expect(rendered.getTheme().resolvedTheme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");

    await cleanupRoot(rendered.root, rendered.container);
  });
});
