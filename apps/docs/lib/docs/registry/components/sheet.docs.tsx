"use client";

import { useState } from "react";
import { ComponentDoc } from "../types";
import { HeroBackground } from "../../runtime/hero-background";
import { Sheet, Button } from "@unisane/ui";

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const SheetHeroVisual = () => (
  <HeroBackground tone="tertiary" padding="none">
    {/* Mock App with Sheet */}
    <div className="bg-surface border-outline-variant relative flex h-full min-h-64 w-full max-w-3xl overflow-hidden rounded-sm border shadow-xl">
      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="text-title-small text-on-surface mb-3">Dashboard</div>
        <div className="space-y-2">
          <div className="h-4 bg-surface-container-high rounded-sm w-full" />
          <div className="h-4 bg-surface-container-high rounded-sm w-3/4" />
          <div className="h-4 bg-surface-container-high rounded-sm w-1/2" />
        </div>
      </div>
      {/* Sheet Panel */}
      <div className="w-40 bg-surface border-l border-outline-variant shadow-4 rounded-l-lg overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-outline-variant bg-surface-container-low flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-title-small text-on-surface block">Details</span>
            <span className="text-body-small text-on-surface-variant block">Inspect the selected record.</span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">close</span>
        </div>
        <div className="px-4 pt-4 pb-5 space-y-3">
          <div className="h-3 bg-surface-container-high rounded-sm w-full" />
          <div className="h-3 bg-surface-container-high rounded-sm w-3/4" />
          <div className="h-8 bg-primary-container rounded-sm w-full" />
        </div>
      </div>
    </div>
  </HeroBackground>
);

// ─── INTERACTIVE PLACEMENT EXAMPLES ────────────────────────────────────────────
const SheetBasicExample = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="tonal" onClick={() => setOpen(true)}>
        Open Sheet
      </Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Details"
        description="Review the selected item without leaving the current page."
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-body-medium text-on-surface">
            This is a basic sheet with a header and content area.
          </div>
          <div className="h-3 bg-surface-container-high rounded-sm w-full" />
          <div className="h-3 bg-surface-container-high rounded-sm w-3/4" />
        </div>
      </Sheet>
    </>
  );
};

const SheetWithFooterExample = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="filled" onClick={() => setOpen(true)}>
        Edit Item
      </Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Edit Item"
        description="Adjust the item settings and save the changes when you are done."
        size="md"
        footerRight={
          <div className="flex gap-2">
            <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="filled" onClick={() => setOpen(false)}>Save</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="text-body-medium text-on-surface">
            Edit the item details below. Changes will be saved when you click Save.
          </div>
          <div className="space-y-3">
          <div className="h-10 bg-surface-container-high rounded-sm w-full" />
          <div className="h-10 bg-surface-container-high rounded-sm w-full" />
          <div className="h-20 bg-surface-container-high rounded-sm w-full" />
          </div>
        </div>
      </Sheet>
    </>
  );
};

const SheetSmallPreview = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" size="sm" onClick={() => setOpen(true)}>Open sm</Button>
      <Sheet open={open} onOpenChange={setOpen} title="Small sheet" size="sm">
        <div className="text-body-small text-on-surface-variant">Quick actions.</div>
      </Sheet>
    </>
  );
};

const SheetMediumPreview = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" size="sm" onClick={() => setOpen(true)}>Open md</Button>
      <Sheet open={open} onOpenChange={setOpen} title="Medium sheet" size="md">
        <div className="text-body-small text-on-surface-variant">Default detail panel.</div>
      </Sheet>
    </>
  );
};

const SheetLargePreview = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" size="sm" onClick={() => setOpen(true)}>Open lg</Button>
      <Sheet open={open} onOpenChange={setOpen} title="Large sheet" size="lg">
        <div className="text-body-small text-on-surface-variant">Complex form or rich content.</div>
      </Sheet>
    </>
  );
};

const SheetBasicHierarchyPreview = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" size="sm" onClick={() => setOpen(true)}>Header + body</Button>
      <Sheet open={open} onOpenChange={setOpen} title="Details" description="Inspect current item.">
        <div className="text-body-small text-on-surface-variant">Body content.</div>
      </Sheet>
    </>
  );
};

const SheetFooterHierarchyPreview = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" size="sm" onClick={() => setOpen(true)}>With footer</Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Edit item"
        footerRight={
          <div className="flex gap-2">
            <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="filled" onClick={() => setOpen(false)}>Save</Button>
          </div>
        }
      >
        <div className="text-body-small text-on-surface-variant">Editable content.</div>
      </Sheet>
    </>
  );
};

export const sheetDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: "sheet",
  name: "Sheet",
  description:
    "Sheets are surfaces containing supplementary content anchored to the edge of the screen.",
  category: "containment",
  status: "stable",
  icon: "view_sidebar",

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: "@unisane/ui",
  exports: ["Sheet"],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <SheetHeroVisual />,
  heroPreview: {
    minHeight: "xl",
  },

  // ─── INTERACTIVE EXAMPLES ─────────────────────────────────────────────────
  examples: [
    {
      id: "basic",
      title: "Basic sheet",
      description: "Open a supplementary panel without leaving the current page.",
      component: <SheetBasicExample />,
    },
    {
      id: "with-footer",
      title: "Sheet with footer actions",
      description: "Use footer actions for form flows and confirm/cancel decisions.",
      component: <SheetWithFooterExample />,
    },
  ],

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      "Sheets come in different sizes for various content needs.",
    columns: {
      emphasis: "Size",
      component: "Example",
      rationale: "When to use",
      examples: "Common uses",
    },
    rows: [
      {
        emphasis: "Small (sm)",
        component: <SheetSmallPreview />,
        rationale:
          "Minimal content like quick actions or simple forms.",
        examples: "Filters, Quick edit, Settings toggle",
      },
      {
        emphasis: "Medium (md)",
        component: <SheetMediumPreview />,
        rationale:
          "Default size for most detail views and forms.",
        examples: "Item details, Edit forms, Preview panels",
      },
      {
        emphasis: "Large (lg)",
        component: <SheetLargePreview />,
        rationale:
          "Complex forms or rich content requiring more space.",
        examples: "Complex forms, Rich editors, Data tables",
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description:
      "Sheets slide in from the edge and can include headers, content, and footers.",
    items: [
      {
        component: <SheetBasicHierarchyPreview />,
        title: "Basic",
        subtitle: "Header and content",
      },
      {
        component: <SheetFooterHierarchyPreview />,
        title: "With Footer",
        subtitle: "Actions at bottom",
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      "Sheets slide in from the right edge of the screen, overlaying the main content.",
    previewDefaults: {
      tone: "surfaceContainerLow",
      minHeight: "2xl",
      padding: "none",
      align: "start",
      justify: "start",
    },
    examples: [
      {
        title: "Basic sheet",
        visual: <SheetBasicExample />,
        caption: "A supporting sheet anchored to the right edge of the workspace.",
      },
      {
        title: "Sheet with footer",
        visual: <SheetWithFooterExample />,
        caption: "A larger editing sheet with persistent footer actions.",
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: "open",
      type: "boolean",
      description: "Controlled open state.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      default: "false",
      description: "Initial open state when the sheet is uncontrolled.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Callback fired when the sheet requests an open-state change.",
    },
    {
      name: "title",
      type: "ReactNode",
      description: "Primary heading displayed in the sheet header.",
    },
    {
      name: "description",
      type: "ReactNode",
      description: "Optional supporting copy shown below the title.",
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "Content to display in the sheet body.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl" | "full"',
      default: '"md"',
      description: "Width of the sheet panel.",
    },
    {
      name: "icon",
      type: "ReactNode",
      description: "Icon displayed in the header.",
    },
    {
      name: "contentClassName",
      type: "string",
      description: "Additional CSS classes for the padded sheet body container.",
    },
    {
      name: "headerClassName",
      type: "string",
      description: "Additional CSS classes for the sheet header container.",
    },
    {
      name: "footerClassName",
      type: "string",
      description: "Additional CSS classes for the sheet footer container.",
    },
    {
      name: "footer",
      type: "ReactNode",
      description: "Optional custom footer content. When provided, it replaces footerLeft/footerRight layout.",
    },
    {
      name: "footerLeft",
      type: "ReactNode",
      description: "Content for the left side of the footer.",
    },
    {
      name: "footerRight",
      type: "ReactNode",
      description: "Content for the right side of the footer (typically actions).",
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "Uses role='dialog' with aria-modal for modal behavior.",
      "Sheet title is announced when opened.",
      "Focus is trapped within the sheet while open.",
    ],
    keyboard: [
      { key: "Escape", description: "Closes the sheet" },
      { key: "Tab", description: "Moves focus within the sheet" },
    ],
    focus: [
      "Focus is moved to the sheet when opened.",
      "Focus returns to trigger element when closed.",
      "Close button has clear focus indication.",
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: "Use controlled state to manage sheet visibility.",
    code: `import { Sheet, Button } from "@unisane/ui";
import { useState } from "react";

function ItemDetails() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        View Details
      </Button>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Item Details"
        description="Inspect and update the current record from a side panel."
        size="md"
        icon={<span className="material-symbols-outlined">info</span>}
        footerRight={
          <>
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>
              Save
            </Button>
          </>
        }
      >
        <div>
          <h3 className="text-lg font-medium mb-4">Item Information</h3>
          <p className="text-on-surface-variant">
            This is the content of your sheet. You can put any
            content here including forms, details, or other UI.
          </p>
        </div>
      </Sheet>
    </>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: "dialog",
      reason: "Use for focused modal content requiring attention.",
    },
    {
      slug: "navigation-drawer",
      reason: "Use for navigation links instead of content.",
    },
    {
      slug: "card",
      reason: "Use for inline content containers.",
    },
  ],
};
