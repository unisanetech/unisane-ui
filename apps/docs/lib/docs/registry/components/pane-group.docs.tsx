"use client";

import { ComponentDoc } from "../types";
import { HeroBackground } from "../../runtime/hero-background";
import { ListDetailLayout, PaneGroup } from "@unisane/ui";

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const PaneGroupHeroVisual = () => (
  <HeroBackground tone="surface">
    <div className="relative isolate h-56 w-80 overflow-hidden rounded-sm border border-outline-variant bg-surface shadow-xl">
      <PaneGroup
        isRoot
        list={
          <div className="space-y-2 p-3">
            <div className="text-label-small text-on-surface-variant">Mailboxes</div>
            <div className="rounded-sm bg-secondary-container p-2 text-label-small text-primary">
              Inbox
            </div>
            <div className="rounded-sm bg-surface-container-high p-2 text-label-small text-on-surface">
              Sent
            </div>
            <div className="rounded-sm bg-surface-container-high p-2 text-label-small text-on-surface">
              Drafts
            </div>
          </div>
        }
        detail={
          <div className="space-y-3 p-4">
            <div className="text-title-small text-on-surface">Inbox</div>
            <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface">
              Welcome to your new workspace.
            </div>
            <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface-variant">
              Team update posted 2h ago.
            </div>
          </div>
        }
      />
    </div>
  </HeroBackground>
);

// ─── EXAMPLES ────────────────────────────────────────────────────────────────
const BasicPaneGroupExample = () => (
  <div className="relative isolate h-full w-full overflow-hidden rounded-sm border border-outline-variant bg-surface">
    <PaneGroup
      isRoot
      list={
        <div className="space-y-2 p-3">
          <div className="text-label-small text-on-surface-variant">Folders</div>
          <div className="rounded-sm bg-secondary-container p-2 text-label-medium text-primary">
            Inbox
          </div>
          <div className="rounded-sm p-2 text-label-medium text-on-surface-variant">Sent</div>
          <div className="rounded-sm p-2 text-label-medium text-on-surface-variant">Drafts</div>
          <div className="rounded-sm p-2 text-label-medium text-on-surface-variant">Trash</div>
        </div>
      }
      detail={
        <div className="space-y-2 p-4">
          <div className="text-title-medium text-on-surface">Inbox</div>
          <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface">
            Welcome to your inbox
          </div>
          <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface">
            New message from Alice
          </div>
        </div>
      }
    />
  </div>
);

const ResponsivePaneGroupExample = () => (
  <div className="w-full space-y-4">
    <div className="relative isolate h-44 w-full overflow-hidden rounded-sm border border-outline-variant bg-surface">
      <PaneGroup
        isRoot
        list={
          <div className="space-y-1 p-2">
            <div className="text-label-small text-on-surface-variant">Desktop</div>
            <div className="h-6 rounded-md bg-secondary-container" />
            <div className="h-6 rounded-md bg-surface-container-high" />
            <div className="h-6 rounded-md bg-surface-container-high" />
          </div>
        }
        detail={
          <div className="space-y-1 p-3">
            <div className="h-3 w-1/3 rounded-sm bg-outline-muted" />
            <div className="h-2 rounded-sm bg-surface-container-high" />
            <div className="h-2 w-3/4 rounded-sm bg-surface-container-high" />
          </div>
        }
      />
    </div>
    <div className="relative isolate h-36 w-56 max-w-full overflow-hidden rounded-sm border border-outline-variant bg-surface">
      <ListDetailLayout
        isRoot
        showDetailMobile={false}
        list={
          <div className="space-y-1 p-2">
            <div className="text-label-small text-on-surface-variant">Mobile list</div>
            <div className="h-8 rounded-md bg-secondary-container" />
            <div className="h-8 rounded-md bg-surface-container-high" />
            <div className="h-8 rounded-md bg-surface-container-high" />
          </div>
        }
        detail={<div className="p-2 text-body-small text-on-surface-variant">Detail</div>}
      />
    </div>
  </div>
);

export const paneGroupDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: "pane-group",
  name: "Pane Group",
  description:
    "A simple two-pane layout component for list/detail patterns. Automatically handles responsive behavior with mobile-first approach.",
  category: "layout",
  status: "stable",
  icon: "view_sidebar",

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: "@unisane/ui",
  exports: ["PaneGroup"],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <PaneGroupHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      "Choose between PaneGroup and Canonical Layouts based on your needs.",
    columns: {
      emphasis: "Component",
      component: "Preview",
      rationale: "When to use",
      examples: "Common uses",
    },
    rows: [
      {
        emphasis: "PaneGroup",
        component: (
          <div className="relative isolate h-32 w-60 overflow-hidden rounded-sm border border-outline-variant bg-surface">
            <PaneGroup
              isRoot
              list={
                <div className="space-y-2 p-2">
                  <div className="h-6 rounded-sm bg-secondary-container" />
                  <div className="h-6 rounded-sm bg-surface-container-high" />
                </div>
              }
              detail={
                <div className="space-y-2 p-3">
                  <div className="h-2 rounded-sm bg-surface-container-high" />
                  <div className="h-2 w-3/4 rounded-sm bg-surface-container-high" />
                </div>
              }
            />
          </div>
        ),
        rationale: "Simple two-pane layout with basic responsive behavior.",
        examples: "Settings, Simple sidebar",
      },
      {
        emphasis: "ListDetailLayout",
        component: (
          <div className="relative isolate h-32 w-60 overflow-hidden rounded-sm border border-outline-variant bg-surface">
            <ListDetailLayout
              isRoot
              list={
                <div className="space-y-2 p-2">
                  <div className="h-6 rounded-sm bg-secondary-container" />
                  <div className="h-6 rounded-sm bg-surface-container-high" />
                </div>
              }
              detail={
                <div className="space-y-2 p-3">
                  <div className="h-2 rounded-sm bg-surface-container-high" />
                  <div className="h-2 w-3/4 rounded-sm bg-surface-container-high" />
                </div>
              }
            />
          </div>
        ),
        rationale: "Full-featured layout with back button and mobile transitions.",
        examples: "Email, Chat, File explorer",
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      "PaneGroup works best as a content container within your app shell. It handles the list/detail split automatically.",
    previewDefaults: {
      tone: "surfaceContainerLow",
      minHeight: "xl",
      padding: "none",
      align: "start",
      justify: "start",
    },
    examples: [
      {
        title: "Basic two-pane layout",
        visual: <BasicPaneGroupExample />,
        caption: "List pane with navigation and detail content area",
      },
      {
        title: "Responsive behavior",
        visual: <ResponsivePaneGroupExample />,
        caption: "Shows list or detail based on screen size and showDetailMobile prop",
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: "list",
      type: "ReactNode",
      required: true,
      description: "Content for the list pane.",
    },
    {
      name: "detail",
      type: "ReactNode",
      required: true,
      description: "Content for the detail/main pane.",
    },
    {
      name: "showDetailMobile",
      type: "boolean",
      default: "false",
      description: "On mobile, shows detail pane instead of list when true.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes for the container.",
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "Uses semantic div structure for layout.",
      "Content in each pane maintains proper heading hierarchy.",
      "Hidden panes are visually hidden but accessible to screen readers on mobile.",
    ],
    keyboard: [
      { key: "Tab", description: "Navigate between interactive elements in visible pane" },
    ],
    focus: [
      "Focus remains in the visible pane on mobile.",
      "Transitions include duration for smooth animation.",
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: "Use PaneGroup with state to control mobile detail visibility.",
    code: `import { PaneGroup } from "@unisane/ui";
import { useState } from "react";

function SettingsPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  return (
    <PaneGroup
      list={
        <nav className="p-4 space-y-2">
          <h2 className="text-title-medium mb-4">Settings</h2>
          <button
            onClick={() => setSelectedSection("account")}
            className="w-full text-left p-3 rounded-sm hover:bg-surface-container-high"
          >
            Account
          </button>
          <button
            onClick={() => setSelectedSection("privacy")}
            className="w-full text-left p-3 rounded-sm hover:bg-surface-container-high"
          >
            Privacy
          </button>
          <button
            onClick={() => setSelectedSection("notifications")}
            className="w-full text-left p-3 rounded-sm hover:bg-surface-container-high"
          >
            Notifications
          </button>
        </nav>
      }
      detail={
        <div className="p-4">
          {selectedSection === "account" && <AccountSettings />}
          {selectedSection === "privacy" && <PrivacySettings />}
          {selectedSection === "notifications" && <NotificationSettings />}
          {!selectedSection && (
            <p className="text-on-surface-variant">Select a section</p>
          )}
        </div>
      }
      showDetailMobile={!!selectedSection}
      className="h-screen"
    />
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: "canonical-layouts",
      reason: "More feature-rich layouts with back buttons and mobile transitions.",
    },
    {
      slug: "sidebar",
      reason: "App-level navigation sidebar with rail and drawer patterns.",
    },
    {
      slug: "navigation-drawer",
      reason: "Use for modal navigation overlay patterns.",
    },
  ],
};
