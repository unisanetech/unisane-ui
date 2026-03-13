"use client";

import { useState } from "react";
import { ComponentDoc } from "../types";
import { HeroBackground } from "../../runtime/hero-background";
import { NavigationRail, Fab, NavigationDrawer, NavigationDrawerHeadline, NavigationDrawerItem, NavigationBar } from "@unisane/ui";

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const NavigationRailHeroVisual = () => (
  <HeroBackground tone="surface">
    <div className="relative isolate h-full min-h-64 w-full max-w-3xl overflow-hidden rounded-sm border border-outline-variant bg-surface shadow-xl">
      <div className="flex h-full w-full">
        <NavigationRail
          items={[
            { value: "inbox", label: "Inbox", icon: "inbox", activeIcon: "inbox", badge: 3 },
            { value: "sent", label: "Sent", icon: "send", activeIcon: "send" },
            { value: "drafts", label: "Drafts", icon: "drafts", activeIcon: "drafts" },
          ]}
          value="inbox"
          className="h-full !w-20"
          header={
            <Fab
              size="md"
              variant="tertiary"
              icon={<span className="material-symbols-outlined">edit</span>}
              aria-label="Compose"
            />
          }
        />
        <div className="flex min-w-0 flex-1 flex-col bg-surface-container-lowest">
          <div className="border-outline-variant border-b px-4 py-3">
            <div className="text-title-small text-on-surface">Inbox</div>
            <div className="text-body-small text-on-surface-variant">3 unread messages</div>
          </div>
          <div className="space-y-3 p-4">
            <div className="rounded-sm border border-outline-variant bg-surface p-3">
              <div className="mb-1 h-2 w-2/3 rounded-sm bg-surface-container-high" />
              <div className="h-2 w-5/6 rounded-sm bg-surface-container-high" />
            </div>
            <div className="rounded-sm border border-outline-variant bg-surface p-3">
              <div className="mb-1 h-2 w-1/2 rounded-sm bg-surface-container-high" />
              <div className="h-2 w-3/4 rounded-sm bg-surface-container-high" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </HeroBackground>
);

// ─── INTERACTIVE EXAMPLES ────────────────────────────────────────────────────
const NavigationRailBasicExample = () => {
  const [active, setActive] = useState("inbox");

  return (
    <div className="relative isolate flex h-full w-full overflow-hidden rounded-sm border border-outline-variant bg-surface">
      <NavigationRail
        items={[
          { value: "inbox", label: "Inbox", icon: "inbox", activeIcon: "inbox", badge: 3 },
          { value: "sent", label: "Sent", icon: "send", activeIcon: "send" },
          { value: "drafts", label: "Drafts", icon: "drafts", activeIcon: "drafts" },
          { value: "trash", label: "Trash", icon: "delete", activeIcon: "delete" },
        ]}
        value={active}
        onValueChange={setActive}
        header={
          <Fab
            size="md"
            variant="tertiary"
            icon={<span className="material-symbols-outlined">edit</span>}
            aria-label="Compose"
          />
        }
        className="h-full"
      />
      <div className="flex min-w-0 flex-1 flex-col bg-surface-container-lowest">
        <div className="border-outline-variant border-b px-4 py-3">
          <div className="text-title-small text-on-surface">Mail workspace</div>
          <div className="text-body-small text-on-surface-variant">
            Selected: <span className="font-medium text-on-surface">{active}</span>
          </div>
        </div>
        <div className="space-y-2 p-4">
          <div className="h-3 rounded-sm bg-surface-container-high" />
          <div className="h-3 w-3/4 rounded-sm bg-surface-container-high" />
          <div className="h-3 w-1/2 rounded-sm bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
};

const NavigationRailIconOnlyExample = () => {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="relative isolate flex h-full w-full overflow-hidden rounded-sm border border-outline-variant bg-surface">
      <NavigationRail
        items={[
          { value: "dashboard", label: "Dashboard", icon: "dashboard", activeIcon: "dashboard", tooltip: "Dashboard" },
          { value: "analytics", label: "Analytics", icon: "insights", activeIcon: "insights", tooltip: "Analytics" },
          { value: "customers", label: "Customers", icon: "group", activeIcon: "group", tooltip: "Customers" },
          { value: "settings", label: "Settings", icon: "settings", activeIcon: "settings", tooltip: "Settings" },
        ]}
        value={active}
        onValueChange={setActive}
        labelVisibility="hidden"
        className="h-full"
      />
      <div className="flex min-w-0 flex-1 flex-col bg-surface-container-lowest">
        <div className="border-outline-variant border-b px-4 py-3">
          <div className="text-title-small text-on-surface">Icon-only rail</div>
          <div className="text-body-small text-on-surface-variant">Hover icons to see tooltips.</div>
        </div>
        <div className="space-y-2 p-4">
          <div className="h-3 rounded-sm bg-surface-container-high" />
          <div className="h-3 w-3/4 rounded-sm bg-surface-container-high" />
          <div className="h-3 w-1/2 rounded-sm bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
};

export const navigationRailDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: "navigation-rail",
  name: "Navigation Rail",
  description:
    "Navigation rail provides compact standalone vertical navigation for tablet and desktop screens.",
  category: "navigation",
  status: "stable",
  icon: "view_sidebar",

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: "@unisane/ui",
  exports: ["NavigationRail"],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <NavigationRailHeroVisual />,
  heroPreview: {
    minHeight: "xl",
  },
  examplesPreview: {
    tone: "surfaceContainerLow",
    minHeight: "xl",
    padding: "none",
    align: "start",
    justify: "start",
  },

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      "Choose navigation based on whether you need a standalone widget or a full app-shell system.",
    columns: {
      emphasis: "Component",
      component: "Preview",
      rationale: "When to use",
      examples: "Common uses",
    },
    rows: [
      {
        emphasis: "Navigation Rail",
        component: (
          <div className="relative isolate h-36 w-28 overflow-hidden rounded-sm border border-outline-variant bg-surface">
            <NavigationRail
              items={[
                { value: "inbox", label: "Inbox", icon: "inbox", activeIcon: "inbox" },
                { value: "sent", label: "Sent", icon: "send", activeIcon: "send" },
              ]}
              value="inbox"
              header={
                <Fab
                  size="sm"
                  variant="tertiary"
                  icon={<span className="material-symbols-outlined">edit</span>}
                  aria-label="Compose"
                />
              }
              className="h-full !w-full !border-r-0"
            />
          </div>
        ),
        rationale: "Compact standalone vertical navigation for larger screens.",
        examples: "Desktop apps, Tablet apps, Admin panels",
      },
      {
        emphasis: "Navigation Drawer",
        component: (
          <div className="relative isolate h-36 w-56 overflow-hidden rounded-sm border border-outline-variant bg-surface">
            <NavigationDrawer
              open
              modal={false}
              className="!absolute !inset-y-0 !left-0 !z-10 !h-full !w-44 !border-r !border-outline-variant !shadow-none"
            >
              <NavigationDrawerHeadline>Main</NavigationDrawerHeadline>
              <NavigationDrawerItem icon="home" active>Home</NavigationDrawerItem>
              <NavigationDrawerItem icon="inbox">Inbox</NavigationDrawerItem>
            </NavigationDrawer>
            <div className="ml-44 space-y-2 p-3">
              <div className="h-2 rounded-sm bg-surface-container-high" />
              <div className="h-2 w-3/4 rounded-sm bg-surface-container-high" />
            </div>
          </div>
        ),
        rationale: "Standalone drawer navigation with labels always visible.",
        examples: "Complex apps, Many destinations",
      },
      {
        emphasis: "Navigation Bar",
        component: (
          <div className="relative isolate h-24 w-56 overflow-hidden rounded-sm border border-outline-variant bg-surface-container-lowest">
            <div className="space-y-2 p-3">
              <div className="h-2 rounded-sm bg-surface-container-high" />
              <div className="h-2 w-3/4 rounded-sm bg-surface-container-high" />
            </div>
            <NavigationBar className="absolute inset-x-0 bottom-0">
              <NavigationBar.Item icon={<span className="material-symbols-outlined">home</span>} label="Home" active />
              <NavigationBar.Item icon={<span className="material-symbols-outlined">search</span>} label="Search" />
              <NavigationBar.Item icon={<span className="material-symbols-outlined">person</span>} label="Profile" />
            </NavigationBar>
          </div>
        ),
        rationale: "Bottom navigation for mobile screens.",
        examples: "Mobile apps, Phone interfaces",
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      "Navigation rails are placed at the left edge of the screen on larger devices.",
    previewDefaults: {
      tone: "surfaceContainerLow",
      minHeight: "2xl",
      padding: "none",
      align: "start",
      justify: "start",
    },
    examples: [
      {
        title: "With header FAB",
        visual: <NavigationRailBasicExample />,
        caption: "Click items to navigate",
      },
      {
        title: "Icon-only with tooltip",
        visual: <NavigationRailIconOnlyExample />,
        caption: "Use labelVisibility='hidden' and per-item tooltip for compact rails.",
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: "items",
      type: "RailItem[]",
      required: true,
      description: "Array of navigation items.",
    },
    {
      name: "value",
      type: "string",
      description: "Currently active item value.",
    },
    {
      name: "defaultValue",
      type: "string",
      description: "Initial active item for uncontrolled usage.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: "Callback when active item changes.",
    },
    {
      name: "header",
      type: "ReactNode",
      description: "Content at top of rail (usually a FAB).",
    },
    {
      name: "footer",
      type: "ReactNode",
      description: "Content at bottom of rail.",
    },
    {
      name: "alignment",
      type: '"start" | "center" | "end"',
      default: '"start"',
      description: "Vertical alignment of items.",
    },
    {
      name: "labelVisibility",
      type: '"always" | "selected" | "hidden"',
      default: '"always"',
      description: "Controls rail label display for all items.",
    },
    {
      name: "onItemHover",
      type: "(value: string) => void",
      description: "Callback when item is hovered.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes for the rail container.",
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "Uses semantic <nav> element with aria-label.",
      "Active item indicated via aria-current.",
      "Badges are announced for notifications.",
    ],
    keyboard: [
      { key: "Tab", description: "Navigate between items" },
      { key: "Enter/Space", description: "Activate focused item" },
    ],
    focus: [
      "Focus ring visible on rail items.",
      "Active state clearly distinguished.",
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: "Use with controlled state or router.",
    code: `import { NavigationRail, Fab } from "@unisane/ui";
import { usePathname, useRouter } from "next/navigation";

function SideNav() {
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    { value: "/", label: "Home", icon: "home", activeIcon: "home" },
    { value: "/inbox", label: "Inbox", icon: "inbox", badge: 12 },
    { value: "/sent", label: "Sent", icon: "send" },
    { value: "/settings", label: "Settings", icon: "settings" },
  ];

  return (
    <NavigationRail
      items={items}
      value={pathname}
      onValueChange={(path) => router.push(path)}
      header={
        <Fab
          icon={<span className="material-symbols-outlined">edit</span>}
          onClick={() => router.push("/compose")}
          aria-label="Compose"
        />
      }
    />
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: "sidebar",
      reason: "Use for full app-shell navigation with responsive rail, drawer, and content inset behavior.",
    },
    {
      slug: "navigation-drawer",
      reason: "Use for standalone drawer navigation with labels always visible.",
    },
    {
      slug: "navigation-bar",
      reason: "Use for mobile bottom navigation.",
    },
    {
      slug: "fab",
      reason: "Often placed in rail header.",
    },
  ],
};
