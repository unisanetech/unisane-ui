"use client";

import { ComponentDoc } from "../types";
import { HeroBackground } from "../../runtime/hero-background";
import { Divider, Card, List, ListItem } from "@unisane/ui";

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const DividerHeroVisual = () => (
  <HeroBackground tone="surface">
    {/* Mock Card with Dividers */}
    <div className="relative bg-surface w-72 rounded-sm shadow-xl overflow-hidden border border-outline-variant">
      <div className="px-5 py-4">
        <div className="text-title-medium text-on-surface">Section One</div>
        <div className="text-body-small text-on-surface-variant mt-1">Content for the first section.</div>
      </div>
      <div className="h-px bg-outline-variant w-full" />
      <div className="px-5 py-4">
        <div className="text-title-medium text-on-surface">Section Two</div>
        <div className="text-body-small text-on-surface-variant mt-1">Content for the second section.</div>
      </div>
      <div className="h-px bg-outline-variant mx-4" />
      <div className="px-5 py-4">
        <div className="text-title-medium text-on-surface">Section Three</div>
        <div className="text-body-small text-on-surface-variant mt-1">Content for the third section.</div>
      </div>
    </div>
  </HeroBackground>
);

export const dividerDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: "divider",
  name: "Divider",
  description:
    "Dividers are thin lines that separate content into clear groups.",
  category: "layout",
  status: "stable",
  icon: "horizontal_rule",

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: "@unisane/ui",
  exports: ["Divider"],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <DividerHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      "Dividers come in different variants for different separation needs.",
    columns: {
      emphasis: "Variant",
      component: "Example",
      rationale: "When to use",
      examples: "Common uses",
    },
    rows: [
      {
        emphasis: "Full bleed",
        component: (
          <Card variant="outlined" padding="none" className="w-52 overflow-hidden">
            <div className="px-3 py-2 text-label-small text-on-surface">Item 1</div>
            <Divider variant="full-bleed" />
            <div className="px-3 py-2 text-label-small text-on-surface">Item 2</div>
          </Card>
        ),
        rationale:
          "Edge-to-edge separation.",
        examples: "Lists, Cards, Sections",
      },
      {
        emphasis: "Inset",
        component: (
          <Card variant="outlined" padding="none" className="w-52 overflow-hidden">
            <div className="px-3 py-2 text-label-small text-on-surface">Item 1</div>
            <Divider variant="inset" />
            <div className="px-3 py-2 text-label-small text-on-surface">Item 2</div>
          </Card>
        ),
        rationale:
          "Aligned with content inset.",
        examples: "List items with icons, Settings",
      },
      {
        emphasis: "Middle",
        component: (
          <Card variant="outlined" padding="none" className="w-52 overflow-hidden">
            <div className="px-3 py-2 text-label-small text-on-surface">Item 1</div>
            <Divider variant="middle" />
            <div className="px-3 py-2 text-label-small text-on-surface">Item 2</div>
          </Card>
        ),
        rationale:
          "Centered with margins on both sides.",
        examples: "Subtle separation, Inline content",
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description:
      "Dividers can be horizontal or vertical.",
    items: [
      {
        component: (
          <div className="w-32">
            <Divider />
          </div>
        ),
        title: "Horizontal",
        subtitle: "Default orientation",
      },
      {
        component: (
          <div className="flex h-16 items-center justify-center">
            <Divider orientation="vertical" />
          </div>
        ),
        title: "Vertical",
        subtitle: "Side-by-side content",
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      "Dividers are used to separate content within lists, cards, and layouts.",
    examples: [
      {
        title: "In lists",
        visual: (
          <Card variant="outlined" padding="none" className="max-w-72 mx-auto overflow-hidden">
            <List>
              <ListItem headline="First item" />
              <Divider variant="inset" />
              <ListItem headline="Second item" />
              <Divider variant="inset" />
              <ListItem headline="Third item" />
            </List>
          </Card>
        ),
        caption: "Inset dividers between list items",
      },
      {
        title: "Between sections",
        visual: (
          <Card variant="outlined" padding="md" className="max-w-72 mx-auto">
            <div className="text-body-medium text-on-surface">Section A content</div>
            <Divider className="my-4" />
            <div className="text-body-medium text-on-surface">Section B content</div>
          </Card>
        ),
        caption: "Full-bleed divider between card sections",
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: "The direction of the divider.",
    },
    {
      name: "variant",
      type: '"full-bleed" | "inset" | "middle"',
      default: '"full-bleed"',
      description: "The spacing variant of the divider.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes.",
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "Uses role='separator' for semantic meaning.",
      "Screen readers understand it as a content boundary.",
      "Does not interrupt content reading flow.",
    ],
    keyboard: [
      { key: "N/A", description: "Dividers are not interactive" },
    ],
    focus: [
      "Dividers do not receive focus.",
      "They serve as visual separators only.",
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: "Use dividers to visually separate content.",
    code: `import { Divider, List, ListItem, Card } from "@unisane/ui";

function SettingsList() {
  return (
    <Card>
      <List>
        <ListItem
          headline="Account"
          leadingIcon={<Icon symbol="person" />}
        />
        <Divider variant="inset" />
        <ListItem
          headline="Privacy"
          leadingIcon={<Icon symbol="lock" />}
        />
        <Divider variant="inset" />
        <ListItem
          headline="Notifications"
          leadingIcon={<Icon symbol="notifications" />}
        />
      </List>

      <Divider className="my-4" />

      <div className="px-4 py-2">
        <span className="text-label-small text-on-surface-variant">
          Version 1.0.0
        </span>
      </div>
    </Card>
  );
}

function SplitView() {
  return (
    <div className="flex h-64">
      <div className="flex-1 p-4">Left panel</div>
      <Divider orientation="vertical" />
      <div className="flex-1 p-4">Right panel</div>
    </div>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: "list",
      reason: "Dividers commonly used between list items.",
    },
    {
      slug: "card",
      reason: "Use to separate sections within cards.",
    },
    {
      slug: "pane-group",
      reason: "Use for resizable panel separation.",
    },
  ],
};
