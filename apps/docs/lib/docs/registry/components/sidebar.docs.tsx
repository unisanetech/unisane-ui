"use client";

import { ComponentDoc } from "../types";
import { HeroBackground } from "../../runtime/hero-background";
import { DesktopPreviewFrame } from "../../runtime/desktop-preview-frame";
import {
  NavigationDrawer,
  NavigationDrawerHeadline,
  NavigationDrawerItem,
  NavigationRail,
  Sidebar,
  SidebarBackdrop,
  SidebarContent,
  SidebarDrawer,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarNavItem,
  SidebarProvider,
  SidebarRail,
  SidebarRailItem,
} from "@unisane/ui";

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const SidebarHeroVisual = () => (
  <HeroBackground tone="surface" padding="sm">
    <DesktopPreviewFrame designWidth={960} designHeight={560} className="max-w-3xl">
      <div className="relative isolate h-full w-full overflow-hidden rounded-sm border border-outline-variant bg-surface shadow-xl">
        <SidebarProvider
          containerMode="contained"
          forceViewport="desktop"
          defaultExpanded
          railWidth={72}
          drawerWidth={168}
          items={[
            { id: "home", label: "Home", icon: "home" },
            { id: "inbox", label: "Inbox", icon: "inbox" },
            { id: "settings", label: "Settings", icon: "settings" },
          ]}
          defaultActiveId="home"
        >
          <Sidebar className="relative h-full w-full">
            <SidebarRail>
              <SidebarRailItem id="home" label="Home" icon="home" />
              <SidebarRailItem id="inbox" label="Inbox" icon="inbox" />
              <SidebarRailItem id="settings" label="Settings" icon="settings" />
            </SidebarRail>
            <SidebarDrawer className="shadow-none">
              <SidebarHeader>
                <div className="text-label-medium text-on-surface">Dashboard</div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarNavItem id="home" label="Overview" icon="home" />
                  <SidebarNavItem id="inbox" label="Messages" icon="inbox" />
                  <SidebarNavItem id="settings" label="Settings" icon="settings" />
                </SidebarMenu>
              </SidebarContent>
            </SidebarDrawer>
            <SidebarBackdrop />
            <SidebarInset className="overflow-hidden bg-surface-container-lowest">
              <div className="space-y-2 p-4">
                <div className="text-title-small text-on-surface">Overview</div>
                <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface">
                  Revenue report updated.
                </div>
                <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface-variant">
                  Pending approvals: 3
                </div>
              </div>
            </SidebarInset>
          </Sidebar>
        </SidebarProvider>
      </div>
    </DesktopPreviewFrame>
  </HeroBackground>
);

// ─── EXAMPLES ────────────────────────────────────────────────────────────────
const RailOnlyExample = () => (
  <div className="relative isolate flex h-full w-full overflow-hidden rounded-sm border border-outline-variant bg-surface">
    <NavigationRail
      items={[
        { value: "home", label: "Home", icon: "home", activeIcon: "home" },
        { value: "search", label: "Search", icon: "search", activeIcon: "search" },
        { value: "alerts", label: "Alerts", icon: "notifications", activeIcon: "notifications", badge: "3" },
      ]}
      value="home"
    />
    <div className="flex-1 space-y-2 bg-surface-container-lowest p-4">
      <div className="h-4 bg-outline-soft rounded-sm w-1/2 mb-4" />
      <div className="h-3 bg-surface-container-high rounded-sm w-full" />
      <div className="h-3 bg-surface-container-high rounded-sm w-3/4" />
    </div>
  </div>
);

const ExpandedSidebarExample = () => (
  <div className="relative isolate h-full w-full overflow-hidden rounded-sm border border-outline-variant bg-surface">
    <SidebarProvider
      containerMode="contained"
      forceViewport="desktop"
      defaultExpanded
      railWidth={72}
      drawerWidth={168}
      items={[
        { id: "files", label: "Files", icon: "folder" },
        { id: "starred", label: "Starred", icon: "star" },
        { id: "shared", label: "Shared", icon: "group" },
      ]}
      defaultActiveId="files"
    >
      <Sidebar className="relative h-full w-full">
        <SidebarRail>
          <SidebarRailItem id="files" label="Files" icon="folder" />
          <SidebarRailItem id="starred" label="Starred" icon="star" />
          <SidebarRailItem id="shared" label="Shared" icon="group" />
        </SidebarRail>
        <SidebarDrawer className="shadow-none">
          <SidebarHeader>
            <div className="text-label-medium text-on-surface">Library</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarNavItem id="files" label="Documents" icon="description" />
              <SidebarNavItem id="starred" label="Images" icon="image" />
            <SidebarNavItem id="shared" label="Downloads" icon="download" />
          </SidebarMenu>
        </SidebarContent>
        </SidebarDrawer>
        <SidebarBackdrop />
        <SidebarInset className="overflow-hidden bg-surface-container-lowest">
          <div className="space-y-2 p-4">
            <div className="text-title-medium text-on-surface">Documents</div>
            <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface">
              Report.pdf
            </div>
            <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface">
              Notes.txt
            </div>
          </div>
        </SidebarInset>
      </Sidebar>
    </SidebarProvider>
  </div>
);

const SidebarSystemPreview = () => (
  <div className="relative isolate h-40 w-72 overflow-hidden rounded-sm border border-outline-variant bg-surface">
    <SidebarProvider
      containerMode="contained"
      forceViewport="desktop"
      defaultExpanded
      railWidth={64}
      drawerWidth={156}
      items={[
        { id: "home", label: "Home", icon: "home" },
        { id: "inbox", label: "Inbox", icon: "inbox" },
      ]}
      defaultActiveId="home"
    >
      <Sidebar className="relative h-full w-full">
        <SidebarRail>
          <SidebarRailItem id="home" label="Home" icon="home" />
          <SidebarRailItem id="inbox" label="Inbox" icon="inbox" />
        </SidebarRail>
        <SidebarDrawer className="shadow-none">
          <SidebarHeader>
            <div className="text-label-medium text-on-surface">Workspace</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarNavItem id="home" label="Home" icon="home" />
              <SidebarNavItem id="inbox" label="Inbox" icon="inbox" />
            </SidebarMenu>
          </SidebarContent>
        </SidebarDrawer>
        <SidebarBackdrop />
        <SidebarInset className="overflow-hidden bg-surface-container-lowest">
          <div className="space-y-2 p-3">
            <div className="h-2 rounded-sm bg-surface-container-high" />
            <div className="h-2 w-3/4 rounded-sm bg-surface-container-high" />
          </div>
        </SidebarInset>
      </Sidebar>
    </SidebarProvider>
  </div>
);

const SidebarRailPreview = () => (
  <div className="relative isolate h-40 w-28 overflow-hidden rounded-sm border border-outline-variant bg-surface">
    <NavigationRail
      items={[
        { value: "home", label: "Home", icon: "home", activeIcon: "home" },
        { value: "inbox", label: "Inbox", icon: "inbox", activeIcon: "inbox" },
      ]}
      value="home"
    />
  </div>
);

const SidebarMobileDrawerPreview = () => (
  <div className="relative isolate h-40 w-60 overflow-hidden rounded-sm border border-outline-variant bg-surface-container-lowest">
    <NavigationDrawer open modal className="absolute inset-y-0 left-0 h-full w-44 max-w-none">
      <NavigationDrawerHeadline>Main</NavigationDrawerHeadline>
      <NavigationDrawerItem icon="home" active>Home</NavigationDrawerItem>
      <NavigationDrawerItem icon="inbox">Inbox</NavigationDrawerItem>
      <NavigationDrawerItem icon="settings">Settings</NavigationDrawerItem>
    </NavigationDrawer>
    <div className="ml-44 space-y-2 p-3">
      <div className="h-2 rounded-sm bg-surface-container-high" />
      <div className="h-2 w-3/4 rounded-sm bg-surface-container-high" />
    </div>
  </div>
);

export const sidebarDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: "sidebar",
  name: "Sidebar",
  description:
    "A comprehensive app-shell navigation system with a collapsible rail, coordinated drawer, backdrop, and content inset. Use it when navigation behavior has to manage the whole application layout.",
  category: "navigation",
  status: "stable",
  icon: "dock_to_left",

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: "@unisane/ui",
  exports: [
    "Sidebar",
    "SidebarProvider",
    "SidebarRail",
    "SidebarRailItem",
    "SidebarDrawer",
    "SidebarHeader",
    "SidebarFooter",
    "SidebarContent",
    "SidebarGroup",
    "SidebarGroupLabel",
    "SidebarMenu",
    "SidebarMenuItem",
    "SidebarNavItem",
    "SidebarMenuButton",
    "SidebarTrigger",
    "SidebarBackdrop",
    "SidebarInset",
    "SidebarCollapsibleGroup",
    "useSidebar",
  ],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <SidebarHeroVisual />,
  heroPreview: {
    minHeight: "xl",
  },
  docsLayout: {
    hideChoosing: true,
    hidePlacement: true,
  },

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      "Choose between a full app-shell sidebar and simpler standalone navigation widgets based on how much layout behavior you need.",
    columns: {
      emphasis: "Pattern",
      component: "Preview",
      rationale: "When to use",
      examples: "Common uses",
    },
    rows: [
      {
        emphasis: "Rail + Drawer",
        component: <SidebarSystemPreview />,
        rationale: "App-shell navigation that coordinates rail, drawer, and content layout together.",
        examples: "Admin dashboards, Complex apps",
      },
      {
        emphasis: "Rail Only",
        component: <SidebarRailPreview />,
        rationale: "Use NavigationRail instead when you only need a standalone compact nav surface.",
        examples: "Simple apps, Limited nav items",
      },
      {
        emphasis: "Mobile Drawer",
        component: <SidebarMobileDrawerPreview />,
        rationale: "Use NavigationDrawer instead when you only need a standalone drawer surface.",
        examples: "Mobile views, Tablet compact",
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      "Sidebar adapts to screen size automatically. Rail shows on expanded screens, overlay drawer on mobile/tablet.",
    previewDefaults: {
      tone: "surfaceContainerLow",
      minHeight: "2xl",
      padding: "none",
      align: "start",
      justify: "start",
    },
    examples: [
      {
        title: "Rail navigation",
        visual: <RailOnlyExample />,
        caption: "Icon-based rail with labels, badges, and active states",
      },
      {
        title: "Expanded with drawer",
        visual: <ExpandedSidebarExample />,
        caption: "Rail plus drawer showing full navigation menu",
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: "items",
      type: "NavigationItem[]",
      description: "Navigation items configuration for the SidebarProvider.",
    },
    {
      name: "activeId",
      type: "string | null",
      description: "Controlled active item ID.",
    },
    {
      name: "defaultActiveId",
      type: "string | null",
      default: "null",
      description: "Initially active navigation item ID.",
    },
    {
      name: "expanded",
      type: "boolean",
      description: "Controlled desktop expanded state.",
    },
    {
      name: "defaultExpanded",
      type: "boolean",
      default: "false",
      description: "Whether drawer is expanded by default on desktop.",
    },
    {
      name: "mobileOpen",
      type: "boolean",
      description: "Controlled overlay drawer open state.",
    },
    {
      name: "defaultMobileOpen",
      type: "boolean",
      default: "false",
      description: "Initial overlay drawer open state.",
    },
    {
      name: "side",
      type: '"left" | "right"',
      default: '"left"',
      description: "Places the sidebar system on the left or right edge.",
    },
    {
      name: "mode",
      type: '"rail-drawer" | "drawer-only" | "rail-only"',
      default: '"rail-drawer"',
      description: "Chooses which sidebar surfaces are rendered.",
    },
    {
      name: "behavior",
      type: '"adaptive" | "overlay" | "inset"',
      default: '"adaptive"',
      description: "Controls when drawer overlays content versus pushing layout.",
    },
    {
      name: "containerMode",
      type: '"viewport" | "contained"',
      default: '"viewport"',
      description: "Use contained mode for embedded canvases and previews.",
    },
    {
      name: "triggerVisibility",
      type: '"auto" | "always" | "desktop" | "mobile" | "hidden"',
      default: '"auto"',
      description: "Default visibility policy for SidebarTrigger.",
    },
    {
      name: "persist",
      type: "boolean",
      default: "false",
      description: "Persist sidebar state to localStorage.",
    },
    {
      name: "storageKey",
      type: "string",
      default: '"unisane-sidebar"',
      description: "Key for localStorage persistence.",
    },
    {
      name: "hoverDelay",
      type: "number",
      default: "150",
      description: "Delay before showing drawer on hover (ms).",
    },
    {
      name: "exitDelay",
      type: "number",
      default: "300",
      description: "Delay before hiding drawer after mouse leaves (ms).",
    },
    {
      name: "railWidth",
      type: "number",
      default: "96",
      description: "Width of the rail in pixels.",
    },
    {
      name: "drawerWidth",
      type: "number",
      default: "220",
      description: "Width of the drawer in pixels.",
    },
    {
      name: "mobileDrawerWidth",
      type: "number",
      default: "280",
      description: "Width of the drawer on mobile in pixels.",
    },
    {
      name: "mobileInsetOffset",
      type: "number",
      default: "64",
      description: "Top offset applied to SidebarInset while in overlay mode.",
    },
    {
      name: "onActiveIdChange",
      type: "(id: string | null) => void",
      description: "Callback when active item changes.",
    },
    {
      name: "onExpandedChange",
      type: "(expanded: boolean) => void",
      description: "Callback when drawer expanded state changes.",
    },
    {
      name: "onMobileOpenChange",
      type: "(open: boolean) => void",
      description: "Callback when overlay drawer open state changes.",
    },
  ],

  // ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────
  subComponents: [
    {
      name: "SidebarProvider",
      description: "Context provider that manages sidebar state. Wrap your app layout with this.",
      props: [
        { name: "children", type: "ReactNode", required: true, description: "App content." },
        { name: "items", type: "NavigationItem[]", description: "Navigation items for state management." },
      ],
    },
    {
      name: "SidebarRail",
      description: "Vertical icon navigation bar on the left side.",
      props: [
        { name: "children", type: "ReactNode", description: "Rail items." },
      ],
    },
    {
      name: "SidebarRailItem",
      description: "Individual navigation item in the rail.",
      props: [
        { name: "id", type: "string", required: true, description: "Unique identifier." },
        { name: "label", type: "string", required: true, description: "Text label below icon." },
        { name: "icon", type: "ReactNode | string", required: true, description: "Icon to display." },
        { name: "activeIcon", type: "ReactNode | string", description: "Icon when active." },
        { name: "badge", type: "string | number", description: "Badge content." },
        { name: "disabled", type: "boolean", description: "Disable the item." },
        { name: "href", type: "string", description: "Link URL." },
        { name: "asChild", type: "boolean", description: "Render as child element." },
        { name: "childIds", type: "string[]", description: "IDs of child items for active state." },
      ],
    },
    {
      name: "SidebarDrawer",
      description: "Expandable navigation panel that slides out from the rail.",
      props: [
        { name: "children", type: "ReactNode", description: "Drawer content." },
      ],
    },
    {
      name: "SidebarNavItem",
      description: "Props-based navigation item within the drawer menu.",
      props: [
        { name: "id", type: "string", description: "Unique identifier for state management." },
        { name: "label", type: "string", required: true, description: "Item text." },
        { name: "icon", type: "ReactNode | string", description: "Leading icon." },
        { name: "activeIcon", type: "ReactNode | string", description: "Optional active icon." },
        { name: "badge", type: "string | number | ReactNode", description: "Optional trailing badge." },
        { name: "active", type: "boolean", description: "Controlled active state." },
        { name: "disabled", type: "boolean", description: "Disable the item." },
        { name: "href", type: "string", description: "Link URL." },
        { name: "onClick", type: "() => void", description: "Click handler." },
        { name: "asChild", type: "boolean", description: "Render as child element." },
      ],
    },
    {
      name: "SidebarCollapsibleGroup",
      description: "Collapsible group of menu items with expand/collapse behavior.",
      props: [
        { name: "id", type: "string", required: true, description: "Unique group identifier." },
        { name: "label", type: "string", required: true, description: "Group heading text." },
        { name: "icon", type: "ReactNode | string", description: "Leading icon." },
        { name: "defaultOpen", type: "boolean", description: "Initially expanded." },
        { name: "childIds", type: "string[]", description: "IDs of child items." },
      ],
    },
    {
      name: "SidebarInset",
      description: "Main content area that adjusts margin based on sidebar state.",
      props: [
        { name: "children", type: "ReactNode", required: true, description: "Page content." },
      ],
    },
    {
      name: "SidebarTrigger",
      description: "Button to toggle sidebar open/closed state.",
      props: [
        { name: "children", type: "ReactNode", description: "Custom trigger content." },
        { name: "visibility", type: '"auto" | "always" | "desktop" | "mobile" | "hidden"', description: "Per-trigger visibility override." },
      ],
    },
    {
      name: "SidebarBackdrop",
      description: "Overlay backdrop for mobile drawer.",
      props: [],
    },
    {
      name: "useSidebar",
      description: "Hook to access sidebar state and methods.",
      props: [],
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "Rail uses nav element with aria-label.",
      "Active items marked with aria-current=\"page\".",
      "Disabled items have aria-disabled attribute.",
      "Drawer hidden state communicated via aria-hidden.",
      "Collapsible groups use aria-expanded and aria-controls.",
    ],
    keyboard: [
      { key: "Tab", description: "Navigate between rail items and menu items" },
      { key: "Enter/Space", description: "Activate focused item" },
      { key: "Escape", description: "Close overlay drawer" },
    ],
    focus: [
      "Focus visible ring on all interactive items.",
      "Focus is trapped while overlay drawer is open.",
      "Drawer respects prefers-reduced-motion.",
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: "Wrap your app with SidebarProvider and compose the sidebar structure.",
    code: `import {
  Sidebar,
  SidebarProvider,
  SidebarRail,
  SidebarRailItem,
  SidebarDrawer,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarNavItem,
  SidebarTrigger,
  SidebarBackdrop,
  SidebarInset,
} from "@unisane/ui";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { id: "home", label: "Home", icon: "home", href: "/" },
  { id: "inbox", label: "Inbox", icon: "inbox", href: "/inbox" },
  { id: "settings", label: "Settings", icon: "settings", href: "/settings" },
];

function AppLayout({ children }) {
  const pathname = usePathname();
  const activeId = navItems.find(item => item.href === pathname)?.id || null;

  return (
    <SidebarProvider defaultActiveId={activeId} persist>
      <Sidebar>
        <SidebarRail>
          {navItems.map((item) => (
            <SidebarRailItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </SidebarRailItem>
          ))}
        </SidebarRail>

        <SidebarDrawer>
          <SidebarHeader>
            <h2 className="text-title-medium">My App</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  href={item.href}
                  asChild
                >
                  <Link href={item.href}>{item.label}</Link>
                </SidebarNavItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarDrawer>

        <SidebarBackdrop />
      </Sidebar>

      <SidebarInset>
        <header className="flex items-center gap-2 border-b border-outline-variant px-4 py-3">
          <SidebarTrigger visibility="mobile" />
          <h1 className="text-title-medium">Dashboard</h1>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: "navigation-drawer",
      reason: "Use for standalone drawer navigation without app-shell state orchestration.",
    },
    {
      slug: "navigation-rail",
      reason: "Use for standalone rail navigation without coordinated drawer behavior.",
    },
    {
      slug: "navigation-bar",
      reason: "Bottom navigation for mobile primary destinations.",
    },
  ],
};
