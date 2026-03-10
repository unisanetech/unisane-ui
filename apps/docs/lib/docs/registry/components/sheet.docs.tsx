"use client";

import { useState } from "react";
import { ComponentDoc } from "../types";
import { HeroBackground } from "../../runtime/hero-background";
import { Sheet, Button } from "@unisane/ui";

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const SheetHeroVisual = () => (
  <HeroBackground tone="tertiary">
    {/* Mock App with Sheet */}
    <div className="bg-surface w-84 h-56 rounded-sm shadow-xl overflow-hidden border border-outline-variant flex">
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
      <div className="w-40 bg-surface border-l border-outline-variant shadow-4 rounded-l-[24px] overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-outline-variant bg-surface-container-lowest flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-title-small text-on-surface block">Details</span>
            <span className="text-body-small text-on-surface-variant block">Inspect the selected record.</span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">close</span>
        </div>
        <div className="px-4 pt-4 pb-5 space-y-3">
          <div className="h-3 bg-surface-container-high rounded-sm w-full" />
          <div className="h-3 bg-surface-container-high rounded-sm w-3/4" />
          <div className="h-8 bg-primary/20 rounded-sm w-full" />
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

const SheetPlacementBasicVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-sm bg-surface-container-low">
    <div className="absolute inset-0 bg-surface-container-lowest/80" />
    <div className="absolute left-0 top-0 bottom-0 w-[42%] border-r border-outline-variant bg-surface-container-lowest p-4">
      <div className="h-3 w-1/2 rounded-sm bg-on-surface/15 mb-4" />
      <div className="space-y-3">
        <div className="h-10 rounded-sm bg-surface-container" />
        <div className="h-10 rounded-sm bg-surface-container" />
        <div className="h-10 rounded-sm bg-surface-container" />
      </div>
    </div>
    <div className="absolute inset-y-0 right-0 w-[min(360px,58%)] border-l border-outline-variant bg-surface flex flex-col">
      <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-lowest">
        <div className="text-title-medium text-on-surface">Details</div>
        <div className="mt-1 text-body-small text-on-surface-variant">
          Review the selected record without leaving the page.
        </div>
      </div>
      <div className="flex-1 px-5 py-4 space-y-3">
        <div className="h-3 rounded-sm bg-surface-container-high w-full" />
        <div className="h-3 rounded-sm bg-surface-container-high w-4/5" />
        <div className="h-20 rounded-sm bg-surface-container w-full" />
      </div>
    </div>
  </div>
);

const SheetPlacementFooterVisual = () => (
  <div className="relative h-full w-full overflow-hidden rounded-sm bg-surface-container-low">
    <div className="absolute inset-0 bg-surface-container-lowest/80" />
    <div className="absolute left-0 top-0 bottom-0 w-[38%] border-r border-outline-variant bg-surface-container-lowest p-4">
      <div className="h-3 w-2/3 rounded-sm bg-on-surface/15 mb-4" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 rounded-sm bg-surface-container" />
        <div className="h-20 rounded-sm bg-surface-container" />
      </div>
    </div>
    <div className="absolute inset-y-0 right-0 w-[min(400px,62%)] border-l border-outline-variant bg-surface flex flex-col">
      <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-lowest">
        <div className="text-title-medium text-on-surface">Edit item</div>
        <div className="mt-1 text-body-small text-on-surface-variant">
          Update properties and confirm from the footer actions.
        </div>
      </div>
      <div className="flex-1 px-5 py-4 space-y-3">
        <div className="h-10 rounded-sm bg-surface-container w-full" />
        <div className="h-10 rounded-sm bg-surface-container w-full" />
        <div className="h-24 rounded-sm bg-surface-container w-full" />
      </div>
      <div className="px-5 py-3 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-end gap-2">
        <div className="h-10 w-20 rounded-full bg-surface-container-high" />
        <div className="h-10 w-24 rounded-full bg-primary/20" />
      </div>
    </div>
  </div>
);

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
        component: (
          <div className="w-32 h-20 bg-surface-container rounded-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-surface shadow-2 p-1">
              <div className="h-1 bg-surface-container-high rounded-full w-full mb-1" />
              <div className="h-1 bg-surface-container-high rounded-full w-3/4" />
            </div>
          </div>
        ),
        rationale:
          "Minimal content like quick actions or simple forms.",
        examples: "Filters, Quick edit, Settings toggle",
      },
      {
        emphasis: "Medium (md)",
        component: (
          <div className="w-32 h-20 bg-surface-container rounded-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-surface shadow-2 p-1">
              <div className="h-1 bg-surface-container-high rounded-full w-full mb-1" />
              <div className="h-1 bg-surface-container-high rounded-full w-3/4" />
            </div>
          </div>
        ),
        rationale:
          "Default size for most detail views and forms.",
        examples: "Item details, Edit forms, Preview panels",
      },
      {
        emphasis: "Large (lg)",
        component: (
          <div className="w-32 h-20 bg-surface-container rounded-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-surface shadow-2 p-1">
              <div className="h-1 bg-surface-container-high rounded-full w-full mb-1" />
              <div className="h-1 bg-surface-container-high rounded-full w-3/4" />
            </div>
          </div>
        ),
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
        component: (
          <div className="w-24 h-16 bg-surface-container rounded-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-surface shadow-2 p-1">
              <div className="h-1 bg-on-surface/10 rounded-full w-full mb-1" />
            </div>
          </div>
        ),
        title: "Basic",
        subtitle: "Header and content",
      },
      {
        component: (
          <div className="w-24 h-16 bg-surface-container rounded-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-surface shadow-2 p-1 flex flex-col">
              <div className="h-2 border-b border-outline-variant" />
              <div className="flex-1" />
              <div className="h-2 border-t border-outline-variant" />
            </div>
          </div>
        ),
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
        visual: <SheetPlacementBasicVisual />,
        caption: "A supporting sheet anchored to the right edge of the workspace.",
      },
      {
        title: "Sheet with footer",
        visual: <SheetPlacementFooterVisual />,
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
          <p className="text-gray-600">
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
