"use client";

import type { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Button } from '@unisane/ui/button';
import { Toast, toast } from '@unisane/ui/toast';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const ToastHeroVisual = () => (
  <HeroBackground tone="error">
    {/* Mock App Interface */}
    <div className="relative bg-surface w-80 h-56 rounded-sm shadow-xl overflow-hidden border border-outline-variant">
      {/* App Bar */}
      <div className="h-14 flex items-center px-4 bg-surface border-b border-outline-variant">
        <span className="text-title-medium text-on-surface">Dashboard</span>
      </div>
      {/* Content */}
      <div className="p-4 text-body-medium text-on-surface-variant">
        Your content here...
      </div>
      <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
        <Toast message="Changes saved" tone="success" duration={0} dismissible={false} />
        <Toast message="New message received" duration={0} dismissible={false} />
      </div>
    </div>
  </HeroBackground>
);

// ─── INTERACTIVE EXAMPLES ────────────────────────────────────────────────────
const ToastDefaultExample = () => (
  <Button variant="tonal" onClick={() => toast.show({ message: "This is a default toast" })}>
    Show Default Toast
  </Button>
);

const ToastSuccessExample = () => (
  <Button variant="tonal" onClick={() => toast.success("Changes saved successfully")}>
    Show Success Toast
  </Button>
);

const ToastErrorExample = () => (
  <Button variant="tonal" onClick={() => toast.error("Failed to save changes")}>
    Show Error Toast
  </Button>
);

const ToastWarningExample = () => (
  <Button variant="tonal" onClick={() => toast.warning("Your session will expire soon")}>
    Show Warning Toast
  </Button>
);

const ToastInfoExample = () => (
  <Button variant="tonal" onClick={() => toast.info("New features available")}>
    Show Info Toast
  </Button>
);

const ToastWithActionExample = () => (
  <Button
    variant="tonal"
    onClick={() =>
      toast.show({
        message: "Item deleted",
        action: {
          label: "Undo",
          onClick: () => toast.success("Item restored"),
        },
      })
    }
  >
    Show Toast with Action
  </Button>
);

const ToastWithDescriptionExample = () => (
  <Button
    variant="tonal"
    onClick={() =>
      toast.success("File uploaded", {
        description: "document.pdf has been uploaded successfully",
      })
    }
  >
    Show Toast with Description
  </Button>
);

const ToastPersistentExample = () => (
  <Button
    variant="tonal"
    onClick={() =>
      toast.info("This toast won't auto-dismiss", {
        duration: 0,
        dismissible: true,
      })
    }
  >
    Show Persistent Toast
  </Button>
);

export const toastDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: "toast",
  name: "Toast",
  description:
    "Toasts display brief, temporary notifications that stack and auto-dismiss.",
  category: "communication",
  status: "stable",
  icon: "notifications",

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/toast',
  exports: ['Toast', 'Toaster', 'toast'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <ToastHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      'Choose the toast tone based on the meaning of the message.',
    columns: {
      emphasis: 'Tone',
      component: "Preview",
      rationale: "When to use",
      examples: "Common uses",
    },
    rows: [
      {
        emphasis: 'Neutral',
        component: <ToastDefaultExample />,
        rationale: "General informational messages.",
        examples: "Status updates, Confirmations",
      },
      {
        emphasis: "Success",
        component: <ToastSuccessExample />,
        rationale: "Positive outcomes and completed actions.",
        examples: "Save complete, Upload done",
      },
      {
        emphasis: 'Danger',
        component: <ToastErrorExample />,
        rationale: "Failed operations or errors.",
        examples: "Save failed, Network error",
      },
      {
        emphasis: "Warning",
        component: <ToastWarningExample />,
        rationale: "Cautionary messages or potential issues.",
        examples: "Session expiring, Unsaved changes",
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      'Click the buttons below to see different toast tones in action. Toasts stack when multiple are shown.',
    examples: [
      {
        title: 'Neutral toast',
        visual: <ToastDefaultExample />,
        caption: "Basic message toast",
      },
      {
        title: "Success toast",
        visual: <ToastSuccessExample />,
        caption: "For completed actions",
      },
      {
        title: 'Danger toast',
        visual: <ToastErrorExample />,
        caption: "For failed operations",
      },
      {
        title: "Warning toast",
        visual: <ToastWarningExample />,
        caption: "For cautionary messages",
      },
      {
        title: "Info toast",
        visual: <ToastInfoExample />,
        caption: "For informational messages",
      },
      {
        title: "With action",
        visual: <ToastWithActionExample />,
        caption: "Includes an action button",
      },
      {
        title: "With description",
        visual: <ToastWithDescriptionExample />,
        caption: "Additional context below message",
      },
      {
        title: "Persistent",
        visual: <ToastPersistentExample />,
        caption: "Requires manual dismiss",
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: "message",
      type: 'ReactNode',
      required: true,
      description: "The main message to display.",
    },
    {
      name: "description",
      type: 'ReactNode',
      description: "Optional description text below the message.",
    },
    {
      name: 'tone',
      type: '"neutral" | "success" | "danger" | "warning" | "info"',
      default: '"neutral"',
      description: 'The semantic visual tone of the toast.',
    },
    {
      name: 'priority',
      type: '"polite" | "assertive"',
      description: 'Announcement priority. Defaults to assertive for danger and polite otherwise.',
    },
    {
      name: "icon",
      type: "ReactNode",
      description: 'Custom icon. Defaults to a tone-specific icon.',
    },
    {
      name: "action",
      type: "{ label: string; onClick: () => void }",
      description: "Optional action button configuration.",
    },
    {
      name: "duration",
      type: "number",
      default: "5000",
      description: "Auto-dismiss duration in ms. Set to 0 for persistent.",
    },
    {
      name: "dismissible",
      type: "boolean",
      default: "true",
      description: "Shows a close button to dismiss the toast.",
    },
  ],

  // ─── SUBCOMPONENTS ─────────────────────────────────────────────────────────
  subComponents: [
    {
      name: "Toaster",
      description: "Renders the toast container. Add once to your app root.",
      props: [
        {
          name: "position",
          type: '"bottom-right" | "bottom-left" | "bottom-center" | "top-right" | "top-left" | "top-center"',
          default: '"bottom-right"',
          description: "Position of the toast container.",
        },
        {
          name: "maxToasts",
          type: "number",
          default: "5",
          description: "Maximum number of visible toasts.",
        },
      ],
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'Uses a polite status by default and an assertive alert for danger.',
      'Each notification is announced atomically.',
      "Action buttons are focusable and announced.",
    ],
    keyboard: [
      { key: "Tab", description: "Moves focus to action/close button" },
      { key: "Enter / Space", description: "Activates focused button" },
    ],
    focus: [
      "Focus is not automatically moved to avoid disruption.",
      "Action and close buttons receive visible focus states.",
      'Auto-dismiss pauses while a notification is hovered or contains focus.',
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: "Add Toaster to your app root, then use the toast API anywhere.",
    code: `// 1. Add Toaster to your app layout
import { Toaster } from "@/components/ui/toast";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}

// 2. Use the toast API in any component
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

function SaveButton() {
  const handleSave = async () => {
    try {
      await saveData();
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes", {
        description: error.message,
        action: {
          label: "Retry",
          onClick: handleSave,
        },
      });
    }
  };

  return <Button onClick={handleSave}>Save</Button>;
}

// Available methods:
toast.show({ message: "...", tone: "neutral" });
toast.success("Success message");
toast.error("Error message");
toast.warning("Warning message");
toast.info("Info message");
toast.dismiss(toastId);
toast.dismissAll();`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: "dialog",
      reason: "Use for important messages requiring user confirmation.",
    },
    {
      slug: "banner",
      reason: "Use for persistent messages at the top of content.",
    },
    {
      slug: "alert",
      reason: "Use for inline contextual messages.",
    },
  ],
};
