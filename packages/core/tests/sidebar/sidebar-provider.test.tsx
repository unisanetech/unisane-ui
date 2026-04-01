// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  Sidebar,
  SidebarBackdrop,
  SidebarDrawer,
  SidebarProvider,
  useSidebar,
} from "../../src/components/sidebar";
import type { NavigationItem } from "../../src/types/navigation";

const ITEMS: NavigationItem[] = [
  {
    id: "components",
    label: "Components",
    href: "/docs/components",
    items: [
      { id: "button", label: "Button", href: "/docs/components/button" },
      { id: "card", label: "Card", href: "/docs/components/card" },
    ],
  },
  {
    id: "home",
    label: "Home",
    href: "/",
    items: [],
  },
];

function SidebarProbe() {
  const { activeId, expanded, effectiveItem, handleClick, isMobile, isDesktop } = useSidebar();

  return (
    <div>
      <div data-testid="active">{activeId ?? ""}</div>
      <div data-testid="expanded">{String(expanded)}</div>
      <div data-testid="effective">{effectiveItem?.id ?? ""}</div>
      <div data-testid="mobile">{String(isMobile)}</div>
      <div data-testid="desktop">{String(isDesktop)}</div>
      <button type="button" onClick={() => handleClick("components")}>
        click-components
      </button>
      <button type="button" onClick={() => handleClick("home")}>
        click-home
      </button>
    </div>
  );
}

function SidebarStackingProbe() {
  return (
    <Sidebar data-testid="sidebar-root">
      <div />
    </Sidebar>
  );
}

function SidebarLayoutProbe() {
  return (
    <Sidebar>
      <SidebarDrawer data-testid="sidebar-drawer">
        <div />
      </SidebarDrawer>
      <SidebarBackdrop data-testid="sidebar-backdrop" />
    </Sidebar>
  );
}

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

function getText(container: HTMLElement, testId: string) {
  return container.querySelector(`[data-testid="${testId}"]`)?.textContent ?? "";
}

describe("SidebarProvider", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("keeps the rail collapsed when route sync activates a top-level group item", async () => {
    const rendered = await render(
      <SidebarProvider items={ITEMS} defaultActiveId="home" persist={false}>
        <SidebarProbe />
      </SidebarProvider>,
    );

    await rendered.rerender(
      <SidebarProvider items={ITEMS} defaultActiveId="components" persist={false}>
        <SidebarProbe />
      </SidebarProvider>,
    );

    expect(getText(rendered.container, "active")).toBe("components");
    expect(getText(rendered.container, "expanded")).toBe("false");
    expect(getText(rendered.container, "effective")).toBe("components");

    await cleanup(rendered.root, rendered.container);
  });

  it("auto-opens the drawer when route sync activates a descendant item by default", async () => {
    const initial = await render(
      <SidebarProvider items={ITEMS} defaultActiveId="card" persist={false}>
        <SidebarProbe />
      </SidebarProvider>,
    );

    expect(getText(initial.container, "active")).toBe("card");
    expect(getText(initial.container, "expanded")).toBe("true");
    expect(getText(initial.container, "effective")).toBe("components");

    await cleanup(initial.root, initial.container);

    const rendered = await render(
      <SidebarProvider items={ITEMS} defaultActiveId="home" persist={false}>
        <SidebarProbe />
      </SidebarProvider>,
    );

    await rendered.rerender(
      <SidebarProvider items={ITEMS} defaultActiveId="card" persist={false}>
        <SidebarProbe />
      </SidebarProvider>,
    );

    expect(getText(rendered.container, "active")).toBe("card");
    expect(getText(rendered.container, "expanded")).toBe("true");
    expect(getText(rendered.container, "effective")).toBe("components");

    await cleanup(rendered.root, rendered.container);
  });

  it("can keep the drawer collapsed when active descendant auto-open is disabled", async () => {
    const rendered = await render(
      <SidebarProvider items={ITEMS} defaultActiveId="home" persist={false}>
        <SidebarProbe />
      </SidebarProvider>,
    );

    await rendered.rerender(
      <SidebarProvider
        items={ITEMS}
        defaultActiveId="card"
        persist={false}
        activeDescendantDrawerBehavior="closed"
      >
        <SidebarProbe />
      </SidebarProvider>,
    );

    expect(getText(rendered.container, "active")).toBe("card");
    expect(getText(rendered.container, "expanded")).toBe("false");
    expect(getText(rendered.container, "effective")).toBe("components");

    await cleanup(rendered.root, rendered.container);
  });

  it("opens the drawer when clicking a rail item with children", async () => {
    const rendered = await render(
      <SidebarProvider items={ITEMS} defaultActiveId="home" persist={false}>
        <SidebarProbe />
      </SidebarProvider>,
    );

    const [componentsButton, homeButton] = Array.from(
      rendered.container.querySelectorAll("button"),
    ) as HTMLButtonElement[];

    await act(async () => {
      componentsButton?.click();
    });

    expect(getText(rendered.container, "active")).toBe("components");
    expect(getText(rendered.container, "expanded")).toBe("true");
    expect(getText(rendered.container, "effective")).toBe("components");

    await act(async () => {
      homeButton?.click();
    });

    expect(getText(rendered.container, "active")).toBe("home");
    expect(getText(rendered.container, "expanded")).toBe("false");

    await cleanup(rendered.root, rendered.container);
  });

  it("uses the explicit initial viewport during server render", () => {
    const markup = renderToStaticMarkup(
      <SidebarProvider
        items={ITEMS}
        defaultActiveId="home"
        initialViewport="mobile"
        persist={false}
      >
        <SidebarProbe />
      </SidebarProvider>,
    );

    expect(markup).toContain('data-testid="mobile">true<');
    expect(markup).toContain('data-testid="desktop">false<');
  });

  it("raises the sidebar stacking context when the overlay drawer is open", async () => {
    const rendered = await render(
      <SidebarProvider
        items={ITEMS}
        persist={false}
        forceViewport="mobile"
        defaultMobileOpen
      >
        <SidebarStackingProbe />
      </SidebarProvider>,
    );

    const sidebarRoot = rendered.container.querySelector(
      '[data-testid="sidebar-root"]',
    ) as HTMLElement | null;

    expect(sidebarRoot?.className).toContain("z-[var(--z-drawer,1500)]");

    await cleanup(rendered.root, rendered.container);
  });

  it("anchors desktop inset drawer and backdrop to the sidebar root", async () => {
    const rendered = await render(
      <SidebarProvider items={ITEMS} persist={false} forceViewport="desktop">
        <SidebarLayoutProbe />
      </SidebarProvider>,
    );

    const drawer = rendered.container.querySelector(
      '[data-testid="sidebar-drawer"]',
    ) as HTMLElement | null;

    expect(drawer?.className).toContain("absolute");
    expect(drawer?.className).not.toContain("fixed");

    await cleanup(rendered.root, rendered.container);
  });
});
