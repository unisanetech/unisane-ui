"use client";

import { ComponentDoc } from "../types";
import { HeroBackground } from "../../runtime/hero-background";
import { Button, Dialog } from "@unisane/ui";
import { useState } from "react";

// ─── INTERACTIVE EXAMPLE ─────────────────────────────────────────────────────
const DialogInteractiveExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete item?"
        description="This action cannot be undone. Are you sure you want to permanently delete this item?"
        icon={<span className="material-symbols-outlined text-error">delete</span>}
        actions={
          <>
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="filled" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </>
        }
      />
    </>
  );
};

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
interface DialogSurfacePreviewProps {
  title: string;
  description: string;
  icon: string;
  iconTone?: "error" | "primary" | "secondary";
  primaryAction: string;
  secondaryAction?: string;
  compact?: boolean;
  showBody?: boolean;
}

const DialogSurfacePreview = ({
  title,
  description,
  icon,
  iconTone = "primary",
  primaryAction,
  secondaryAction = "Cancel",
  compact = false,
  showBody = true,
}: DialogSurfacePreviewProps) => (
  <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface shadow-lg">
    <div
      className={`border-outline-variant bg-surface-container-lowest flex items-start border-b ${
        compact ? "gap-2 px-3 py-2.5" : "gap-3 px-5 py-4"
      }`}
    >
      <div
        className={`flex shrink-0 items-center justify-center rounded-md border border-outline-variant ${
          compact ? "h-8 w-8" : "h-10 w-10"
        } ${
          iconTone === "error"
            ? "bg-error-container text-on-error-container"
            : iconTone === "secondary"
              ? "bg-secondary-container text-on-secondary-container"
              : "bg-primary-container text-on-primary-container"
        }`}
      >
        <span className={`material-symbols-outlined ${compact ? "text-[18px]" : ""}`}>
          {icon}
        </span>
      </div>
      <div className="min-w-0 space-y-1">
        <div className={compact ? "text-title-small text-on-surface" : "text-title-medium text-on-surface"}>
          {title}
        </div>
        <div className={compact ? "truncate text-label-small text-on-surface-variant" : "text-body-small text-on-surface-variant"}>
          {description}
        </div>
      </div>
    </div>
    {showBody ? (
      <div className={`min-h-0 flex-1 ${compact ? "px-3 py-2" : "px-5 py-4"}`}>
        <div className="h-2 rounded-sm bg-surface-container-high" />
        <div className="mt-2 h-2 w-4/5 rounded-sm bg-surface-container-high" />
        <div className="mt-2 h-2 w-3/5 rounded-sm bg-surface-container-high" />
      </div>
    ) : null}
    <div className={`border-outline-variant bg-surface-container-lowest flex justify-end gap-2 border-t ${compact ? "px-3 py-2" : "px-5 py-3"}`}>
      <Button variant="text" size="sm">{secondaryAction}</Button>
      <Button variant="filled" size="sm">{primaryAction}</Button>
    </div>
  </div>
);

const DialogHeroVisual = () => (
  <HeroBackground tone="tertiary">
    <div className="relative isolate h-56 w-84 overflow-hidden rounded-sm border border-outline-variant bg-surface-container-high">
      <div className="bg-scrim absolute inset-0" />
      <div className="relative z-10 flex h-full items-center justify-center p-4">
        <div className="w-full max-w-[19rem]">
          <DialogSurfacePreview
            title="Delete file?"
            description="This action cannot be undone."
            icon="delete"
            iconTone="error"
            primaryAction="Delete"
          />
        </div>
      </div>
    </div>
  </HeroBackground>
);

// ─── PLACEMENT VISUALS ─────────────────────────────────────────────────────────
const DialogPlacementBasic = () => (
  <div className="relative isolate mx-auto h-56 w-80 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high">
    <div className="bg-scrim absolute inset-0" />
    <div className="relative z-10 flex h-full items-center justify-center p-3">
      <div className="w-full max-w-[18rem]">
        <DialogSurfacePreview
          title="Publish changes?"
          description="Your updates will be visible to all workspace members."
          icon="publish"
          iconTone="primary"
          primaryAction="Publish"
        />
      </div>
    </div>
  </div>
);

const DialogPlacementWithIcon = () => (
  <div className="relative isolate mx-auto h-56 w-80 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high">
    <div className="bg-scrim absolute inset-0" />
    <div className="relative z-10 flex h-full items-center justify-center p-3">
      <div className="w-full max-w-[18rem]">
        <DialogSurfacePreview
          title="Warning"
          description="This action updates live workspace data."
          icon="warning"
          iconTone="error"
          primaryAction="Continue"
        />
      </div>
    </div>
  </div>
);

// ─── CHOOSING VISUALS ─────────────────────────────────────────────────────────
const AlertDialogPreview = () => (
  <div className="relative isolate h-44 w-64 overflow-hidden rounded-sm border border-outline-variant bg-surface-container-high">
    <div className="bg-scrim absolute inset-0" />
    <div className="relative z-10 flex h-full items-center justify-center p-2">
      <div className="w-full max-w-[15rem]">
        <DialogSurfacePreview
          title="Delete file?"
          description="This action cannot be undone."
          icon="warning"
          iconTone="error"
          primaryAction="Delete"
          compact
          showBody={false}
        />
      </div>
    </div>
  </div>
);

const ConfirmDialogPreview = () => (
  <div className="relative isolate h-44 w-64 overflow-hidden rounded-sm border border-outline-variant bg-surface-container-high">
    <div className="bg-scrim absolute inset-0" />
    <div className="relative z-10 flex h-full items-center justify-center p-2">
      <div className="w-full max-w-[15rem]">
        <DialogSurfacePreview
          title="Save changes?"
          description="You have unsaved edits. Save before leaving?"
          icon="save"
          iconTone="primary"
          primaryAction="Save"
          secondaryAction="Discard"
          compact
          showBody={false}
        />
      </div>
    </div>
  </div>
);

const FormDialogPreview = () => (
  <div className="relative isolate h-44 w-64 overflow-hidden rounded-sm border border-outline-variant bg-surface-container-high">
    <div className="bg-scrim absolute inset-0" />
    <div className="relative z-10 flex h-full items-center justify-center p-2">
      <div className="w-full max-w-[15rem]">
        <DialogSurfacePreview
          title="New project"
          description="Add core details before creating the project."
          icon="folder_open"
          iconTone="secondary"
          primaryAction="Create"
          compact
          showBody={false}
        />
      </div>
    </div>
  </div>
);

export const dialogDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: "dialog",
  name: "Dialog",
  description:
    "Dialogs provide important prompts in a user flow, requiring user input or confirmation.",
  category: "containment",
  status: "stable",
  icon: "chat_bubble",

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: "@unisane/ui",
  exports: ["Dialog"],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <DialogHeroVisual />,

  // ─── INTERACTIVE EXAMPLES ─────────────────────────────────────────────────
  examples: [
    {
      id: "basic",
      title: "Basic Dialog",
      description: "Click the button to open an interactive dialog.",
      component: <DialogInteractiveExample />,
      code: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Dialog</Button>

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Delete item?"
  description="This action cannot be undone. Are you sure you want to permanently delete this item?"
  icon={<span className="material-symbols-outlined">delete</span>}
  actions={
    <>
      <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="filled" onClick={() => setOpen(false)}>Delete</Button>
    </>
  }
/>`,
    },
  ],

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      "Dialogs interrupt the user experience to deliver important information or request input. Use them sparingly for critical moments.",
    columns: {
      emphasis: "Type",
      component: "Visual",
      rationale: "When to use",
      examples: "Common uses",
    },
    rows: [
      {
        emphasis: "Alert Dialog",
        component: <AlertDialogPreview />,
        rationale:
          "Requires immediate attention and acknowledgment. User must respond before continuing.",
        examples: "Delete confirmation, Error messages, Permission requests",
      },
      {
        emphasis: "Confirmation Dialog",
        component: <ConfirmDialogPreview />,
        rationale:
          "Asks user to confirm an action. Provides cancel and confirm options.",
        examples: "Save changes, Discard draft, Log out",
      },
      {
        emphasis: "Form Dialog",
        component: <FormDialogPreview />,
        rationale:
          "Collects user input in a focused context. Use when input is required before proceeding.",
        examples: "Create item, Edit details, Add comment",
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      "Dialogs appear centered on the screen with a scrim overlay that dims the background content.",
    examples: [
      {
        title: "Basic dialog",
        visual: <DialogPlacementBasic />,
        caption: "Centered with scrim overlay blocking interaction with background",
      },
      {
        title: "With icon",
        visual: <DialogPlacementWithIcon />,
        caption: "Icon in header emphasizes the dialog's purpose",
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
      description: "Initial open state when the dialog is uncontrolled.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Callback fired when the dialog requests an open-state change.",
    },
    {
      name: "title",
      type: "ReactNode",
      description: "The primary heading displayed in the dialog header.",
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
      description: "The content displayed in the dialog body.",
    },
    {
      name: "actions",
      type: "ReactNode",
      description: "Action buttons displayed in the dialog footer.",
    },
    {
      name: "icon",
      type: "ReactNode",
      description: "Icon displayed next to the title in the header.",
    },
    {
      name: "contentClassName",
      type: "string",
      description: "Additional CSS classes for the padded dialog body container.",
    },
    {
      name: "headerClassName",
      type: "string",
      description: "Additional CSS classes for the dialog header container.",
    },
    {
      name: "footerClassName",
      type: "string",
      description: "Additional CSS classes for the dialog footer container.",
    },
    {
      name: "showCloseButton",
      type: "boolean",
      default: "auto",
      description: "Controls whether the close button appears in the header.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes for the dialog surface.",
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "Dialog uses role=\"dialog\" and aria-modal=\"true\" for proper screen reader announcement.",
      "Title is linked with aria-labelledby and content with aria-describedby.",
      "Focus is trapped within the dialog while open.",
      "Pressing Escape closes the dialog.",
    ],
    keyboard: [
      { key: "Escape", description: "Closes the dialog" },
      { key: "Tab", description: "Moves focus to next focusable element within dialog" },
      { key: "Shift + Tab", description: "Moves focus to previous focusable element within dialog" },
    ],
    focus: [
      "Focus is automatically moved to the first focusable element when dialog opens.",
      "Focus is restored to the previously focused element when dialog closes.",
      "Focus is trapped within the dialog (Tab cycles through dialog elements only).",
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: "Control the dialog with React state and provide action handlers.",
    code: `import { Dialog, Button } from "@unisane/ui";
import { useState } from "react";

function DeleteConfirmation() {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    // Perform delete action
    deleteItem();
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Delete
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete item?"
        description="This action cannot be undone. Are you sure you want to permanently delete this item?"
        icon={<span className="material-symbols-outlined">delete</span>}
        actions={
          <>
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="filled" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      />
    </>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: "sheet",
      reason: "Use for supplementary content that slides in from the edge.",
    },
    {
      slug: "snackbar",
      reason: "Use for brief, non-blocking notifications.",
    },
    {
      slug: "popover",
      reason: "Use for contextual information without blocking the page.",
    },
  ],
};
