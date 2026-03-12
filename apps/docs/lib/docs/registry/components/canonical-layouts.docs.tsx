"use client";

import { ComponentDoc } from "../types";
import { HeroBackground } from "../../runtime/hero-background";
import { FeedLayout, ListDetailLayout, SupportingPaneLayout } from "@unisane/ui";

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const CanonicalLayoutsHeroVisual = () => (
  <HeroBackground tone="surface">
    <div className="relative isolate h-56 w-80 overflow-hidden rounded-sm border border-outline-variant bg-surface shadow-xl">
      <ListDetailLayout
        isRoot
        list={
          <div className="space-y-2 p-3">
            <div className="text-label-small text-on-surface-variant">Conversations</div>
            <div className="rounded-sm bg-secondary-container p-2 text-label-small text-primary">
              Design review
            </div>
            <div className="rounded-sm bg-surface-container-high p-2 text-label-small text-on-surface">
              Product sync
            </div>
            <div className="rounded-sm bg-surface-container-high p-2 text-label-small text-on-surface">
              Engineering
            </div>
          </div>
        }
        detail={
          <div className="space-y-3 p-4">
            <div className="text-title-small text-on-surface">Design review</div>
            <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface">
              Updated canonical layout blocks are ready for QA.
            </div>
            <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface-variant">
              Ship preview refinements before release.
            </div>
          </div>
        }
      />
    </div>
  </HeroBackground>
);

// ─── EXAMPLES ────────────────────────────────────────────────────────────────
const LayoutListPane = () => (
  <div className="space-y-2 p-3">
    <div className="rounded-sm bg-secondary-container p-2 text-label-small text-primary">Alice</div>
    <div className="rounded-sm bg-surface-container-high p-2 text-label-small text-on-surface">Bob</div>
    <div className="rounded-sm bg-surface-container-high p-2 text-label-small text-on-surface">Carol</div>
  </div>
);

const LayoutDetailPane = () => (
  <div className="space-y-2 p-3">
    <div className="text-title-small text-on-surface">Conversation</div>
    <div className="h-2 rounded-sm bg-surface-container-high" />
    <div className="h-2 w-3/4 rounded-sm bg-surface-container-high" />
    <div className="h-2 w-5/6 rounded-sm bg-surface-container-high" />
  </div>
);

const SupportingMainPane = () => (
  <div className="space-y-2 p-4">
    <div className="text-title-small text-on-surface">Editor</div>
    <div className="h-2 rounded-sm bg-surface-container-high" />
    <div className="h-2 rounded-sm bg-surface-container-high" />
    <div className="h-2 w-2/3 rounded-sm bg-surface-container-high" />
  </div>
);

const SupportingPaneContent = () => (
  <div className="space-y-2 p-4">
    <div className="text-label-small text-primary">Properties</div>
    <div className="h-2 rounded-sm bg-surface-container-high" />
    <div className="h-2 rounded-sm bg-surface-container-high" />
    <div className="h-2 rounded-sm bg-surface-container-high" />
  </div>
);

const FeedCards = () => (
  <>
    <div className="rounded-sm border border-outline-variant bg-surface p-3">
      <div className="mb-2 h-10 rounded-sm bg-surface-container-high" />
      <div className="h-2 w-4/5 rounded-sm bg-outline-muted" />
    </div>
    <div className="rounded-sm border border-outline-variant bg-surface p-3">
      <div className="mb-2 h-10 rounded-sm bg-surface-container-high" />
      <div className="h-2 w-3/4 rounded-sm bg-outline-muted" />
    </div>
    <div className="rounded-sm border border-outline-variant bg-surface p-3">
      <div className="mb-2 h-10 rounded-sm bg-surface-container-high" />
      <div className="h-2 w-2/3 rounded-sm bg-outline-muted" />
    </div>
  </>
);

const ListDetailExample = () => (
  <div className="relative isolate h-full w-full overflow-hidden rounded-sm border border-outline-variant bg-surface">
    <ListDetailLayout isRoot list={<LayoutListPane />} detail={<LayoutDetailPane />} />
  </div>
);

const SupportingPaneExample = () => (
  <div className="relative isolate h-full w-full overflow-hidden rounded-sm border border-outline-variant bg-surface">
    <SupportingPaneLayout
      open
      title="Properties"
      main={<SupportingMainPane />}
      supporting={<SupportingPaneContent />}
      isRoot
    />
  </div>
);

const FeedLayoutExample = () => (
  <div className="relative isolate h-full w-full overflow-hidden rounded-sm border border-outline-variant bg-surface">
    <FeedLayout isRoot>
      <FeedCards />
    </FeedLayout>
  </div>
);

export const canonicalLayoutsDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: "canonical-layouts",
  name: "Canonical Layouts",
  description:
    "Canonical layouts provide responsive, adaptive patterns for common app structures. These layouts automatically adjust to different screen sizes following Material Design 3 guidelines.",
  category: "layout",
  status: "stable",
  icon: "dashboard",

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: "@unisane/ui",
  exports: ["ListDetailLayout", "SupportingPaneLayout", "FeedLayout"],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <CanonicalLayoutsHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      "Choose the layout pattern based on your content structure and user interaction patterns.",
    columns: {
      emphasis: "Layout",
      component: "Preview",
      rationale: "When to use",
      examples: "Common uses",
    },
    rows: [
      {
        emphasis: "List-Detail",
        component: (
          <div className="relative isolate h-32 w-56 overflow-hidden rounded-sm border border-outline-variant bg-surface">
            <ListDetailLayout isRoot list={<LayoutListPane />} detail={<LayoutDetailPane />} />
          </div>
        ),
        rationale: "List on one side, detail view on the other.",
        examples: "Email, Chat, File browser",
      },
      {
        emphasis: "Supporting Pane",
        component: (
          <div className="relative isolate h-32 w-56 overflow-hidden rounded-sm border border-outline-variant bg-surface">
            <SupportingPaneLayout
              open
              title="Properties"
              main={<SupportingMainPane />}
              supporting={<SupportingPaneContent />}
              isRoot
            />
          </div>
        ),
        rationale: "Main content with collapsible side panel.",
        examples: "Document properties, Settings panel",
      },
      {
        emphasis: "Feed",
        component: (
          <div className="relative isolate h-32 w-56 overflow-hidden rounded-sm border border-outline-variant bg-surface">
            <FeedLayout isRoot>
              <FeedCards />
            </FeedLayout>
          </div>
        ),
        rationale: "Grid of cards that reflows responsively.",
        examples: "Gallery, News feed, Dashboard",
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      "Canonical layouts adapt to screen size. On compact screens, they typically stack or show one pane at a time.",
    previewDefaults: {
      tone: "surfaceContainerLow",
      minHeight: "2xl",
      padding: "none",
      align: "start",
      justify: "start",
    },
    examples: [
      {
        title: "List-Detail Layout",
        visual: <ListDetailExample />,
        caption: "Two-pane layout with list and detail views",
      },
      {
        title: "Supporting Pane Layout",
        visual: <SupportingPaneExample />,
        caption: "Main content with collapsible supporting panel",
      },
      {
        title: "Feed Layout",
        visual: <FeedLayoutExample />,
        caption: "Responsive grid that adapts to available width",
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes for the layout container.",
    },
    {
      name: "isRoot",
      type: "boolean",
      default: "false",
      description: "When true, removes default border and rounded corners for root-level usage.",
    },
  ],

  // ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────
  subComponents: [
    {
      name: "ListDetailLayout",
      description: "Two-pane layout with a list on one side and detail view on the other.",
      props: [
        { name: "list", type: "ReactNode", required: true, description: "Content for the list pane." },
        { name: "detail", type: "ReactNode", required: true, description: "Content for the detail pane." },
        { name: "showDetailMobile", type: "boolean", default: "false", description: "Show detail pane on mobile (hides list)." },
        { name: "onBackClick", type: "() => void", description: "Callback for back button on mobile detail view." },
      ],
    },
    {
      name: "SupportingPaneLayout",
      description: "Main content area with a collapsible supporting side panel.",
      props: [
        { name: "main", type: "ReactNode", required: true, description: "Main content area." },
        { name: "supporting", type: "ReactNode", required: true, description: "Content for the supporting pane." },
        { name: "open", type: "boolean", description: "Controls supporting pane visibility." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Initial supporting-pane visibility when uncontrolled." },
        { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when the pane requests an open-state change." },
        { name: "title", type: "string", default: '"Audit Protocol"', description: "Title shown in the supporting pane header." },
        { name: "mainRef", type: "RefObject<HTMLDivElement>", description: "Ref for the main content container." },
      ],
    },
    {
      name: "FeedLayout",
      description: "Responsive grid layout for card-based content.",
      props: [
        { name: "children", type: "ReactNode", required: true, description: "Grid items to display." },
      ],
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "List pane uses role=\"list\" for proper semantics.",
      "Main content area uses role=\"main\".",
      "Supporting pane uses <aside> element.",
      "Back button includes aria-label on mobile.",
    ],
    keyboard: [
      { key: "Tab", description: "Navigate between panes and interactive elements" },
      { key: "Escape", description: "Close supporting pane on mobile" },
    ],
    focus: [
      "Back and close actions remain reachable in the visible pane.",
      "The supporting pane keeps a visible close affordance on mobile.",
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: "Use layouts with state management for responsive behavior.",
    code: `import { ListDetailLayout, SupportingPaneLayout, FeedLayout } from "@unisane/ui";
import { useState } from "react";

// List-Detail Example (Email-like)
function EmailApp() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const showDetail = selectedId !== null;

  return (
    <ListDetailLayout
      list={
        <EmailList
          onSelect={setSelectedId}
          selectedId={selectedId}
        />
      }
      detail={
        selectedId ? (
          <EmailDetail id={selectedId} />
        ) : (
          <EmptyState message="Select an email" />
        )
      }
      showDetailMobile={showDetail}
      onBackClick={() => setSelectedId(null)}
      isRoot
    />
  );
}

// Supporting Pane Example (Document properties)
function DocumentEditor() {
  const [showProperties, setShowProperties] = useState(false);

  return (
    <SupportingPaneLayout
      main={<Editor />}
      supporting={<DocumentProperties />}
      open={showProperties}
      onOpenChange={setShowProperties}
      title="Properties"
      isRoot
    />
  );
}

// Feed Example (Gallery)
function Gallery() {
  return (
    <FeedLayout isRoot>
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </FeedLayout>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: "pane-group",
      reason: "Simpler two-pane layout without built-in mobile behavior.",
    },
    {
      slug: "sidebar",
      reason: "Use for app-level navigation alongside layouts.",
    },
    {
      slug: "card",
      reason: "Common content container within Feed layouts.",
    },
  ],
};
