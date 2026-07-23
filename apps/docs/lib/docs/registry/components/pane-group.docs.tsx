'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { DesktopPreviewFrame } from '../../runtime/desktop-preview-frame';
import { ListDetailLayout } from '@unisane/ui/canonical-layouts';
import { PaneGroup } from '@unisane/ui/pane-group';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const PaneGroupHeroVisual = () => (
  <HeroBackground tone="surface" padding="sm">
    <DesktopPreviewFrame designWidth={960} designHeight={560} className="max-w-3xl">
      <div className="border-outline-variant bg-surface relative isolate h-full w-full overflow-hidden rounded-sm border shadow-xl">
        <div className="flex h-full w-full">
          <div className="border-outline-variant bg-surface w-72 shrink-0 border-r">
            <div className="space-y-2 p-3">
              <div className="text-label-small text-on-surface-variant">Mailboxes</div>
              <div className="bg-secondary-container text-label-small text-primary rounded-sm p-2">
                Inbox
              </div>
              <div className="bg-surface-container-high text-label-small text-on-surface rounded-sm p-2">
                Sent
              </div>
              <div className="bg-surface-container-high text-label-small text-on-surface rounded-sm p-2">
                Drafts
              </div>
            </div>
          </div>
          <div className="bg-surface-container-low min-w-0 flex-1">
            <div className="space-y-3 p-4">
              <div className="text-title-small text-on-surface">Inbox</div>
              <div className="border-outline-variant bg-surface text-body-small text-on-surface rounded-sm border p-2">
                Welcome to your new workspace.
              </div>
              <div className="border-outline-variant bg-surface text-body-small text-on-surface-variant rounded-sm border p-2">
                Team update posted 2h ago.
              </div>
            </div>
          </div>
        </div>
      </div>
    </DesktopPreviewFrame>
  </HeroBackground>
);

// ─── EXAMPLES ────────────────────────────────────────────────────────────────
const BasicPaneGroupExample = () => (
  <div className="border-outline-variant bg-surface relative isolate h-full w-full overflow-hidden rounded-sm border">
    <PaneGroup
      sidebar={
        <div className="space-y-2 p-3">
          <div className="text-label-small text-on-surface-variant">Folders</div>
          <div className="bg-secondary-container text-label-medium text-primary rounded-sm p-2">
            Inbox
          </div>
          <div className="text-label-medium text-on-surface-variant rounded-sm p-2">Sent</div>
          <div className="text-label-medium text-on-surface-variant rounded-sm p-2">Drafts</div>
          <div className="text-label-medium text-on-surface-variant rounded-sm p-2">Trash</div>
        </div>
      }
      detail={
        <div className="space-y-2 p-4">
          <div className="text-title-medium text-on-surface">Inbox</div>
          <div className="border-outline-variant bg-surface text-body-small text-on-surface rounded-sm border p-2">
            Welcome to your inbox
          </div>
          <div className="border-outline-variant bg-surface text-body-small text-on-surface rounded-sm border p-2">
            New message from Alice
          </div>
        </div>
      }
    />
  </div>
);

const ResponsivePaneGroupExample = () => (
  <div className="w-full space-y-4">
    <div className="border-outline-variant bg-surface relative isolate h-44 w-full overflow-hidden rounded-sm border">
      <PaneGroup
        sidebar={
          <div className="space-y-1 p-2">
            <div className="text-label-small text-on-surface-variant">Desktop</div>
            <div className="bg-secondary-container h-6 rounded-md" />
            <div className="bg-surface-container-high h-6 rounded-md" />
            <div className="bg-surface-container-high h-6 rounded-md" />
          </div>
        }
        detail={
          <div className="space-y-1 p-3">
            <div className="bg-outline-muted h-3 w-1/3 rounded-sm" />
            <div className="bg-surface-container-high h-2 rounded-sm" />
            <div className="bg-surface-container-high h-2 w-3/4 rounded-sm" />
          </div>
        }
      />
    </div>
    <div className="border-outline-variant bg-surface relative isolate h-36 w-56 max-w-full overflow-hidden rounded-sm border">
      <ListDetailLayout
        isRoot
        showDetailMobile={false}
        list={
          <div className="space-y-1 p-2">
            <div className="text-label-small text-on-surface-variant">Mobile list</div>
            <div className="bg-secondary-container h-8 rounded-md" />
            <div className="bg-surface-container-high h-8 rounded-md" />
            <div className="bg-surface-container-high h-8 rounded-md" />
          </div>
        }
        detail={<div className="text-body-small text-on-surface-variant p-2">Detail</div>}
      />
    </div>
  </div>
);

export const paneGroupDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'pane-group',
  name: 'Pane Group',
  description:
    'A simple two-pane layout component for list/detail patterns. Automatically handles responsive behavior with mobile-first approach.',
  category: 'layout',
  status: 'stable',
  icon: 'view_sidebar',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/pane-group',
  exports: ['PaneGroup'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <PaneGroupHeroVisual />,
  heroPreview: {
    minHeight: 'xl',
  },
  docsLayout: {
    hideChoosing: true,
    hidePlacement: true,
  },

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Choose between PaneGroup and Canonical Layouts based on your needs.',
    columns: {
      emphasis: 'Component',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'PaneGroup',
        component: (
          <div className="border-outline-variant bg-surface relative isolate h-32 w-60 overflow-hidden rounded-sm border">
            <PaneGroup
              sidebar={
                <div className="space-y-2 p-2">
                  <div className="bg-secondary-container h-6 rounded-sm" />
                  <div className="bg-surface-container-high h-6 rounded-sm" />
                </div>
              }
              detail={
                <div className="space-y-2 p-3">
                  <div className="bg-surface-container-high h-2 rounded-sm" />
                  <div className="bg-surface-container-high h-2 w-3/4 rounded-sm" />
                </div>
              }
            />
          </div>
        ),
        rationale: 'Simple two-pane layout with basic responsive behavior.',
        examples: 'Settings, Simple sidebar',
      },
      {
        emphasis: 'ListDetailLayout',
        component: (
          <div className="border-outline-variant bg-surface relative isolate h-32 w-60 overflow-hidden rounded-sm border">
            <ListDetailLayout
              isRoot
              list={
                <div className="space-y-2 p-2">
                  <div className="bg-secondary-container h-6 rounded-sm" />
                  <div className="bg-surface-container-high h-6 rounded-sm" />
                </div>
              }
              detail={
                <div className="space-y-2 p-3">
                  <div className="bg-surface-container-high h-2 rounded-sm" />
                  <div className="bg-surface-container-high h-2 w-3/4 rounded-sm" />
                </div>
              }
            />
          </div>
        ),
        rationale: 'Full-featured layout with back button and mobile transitions.',
        examples: 'Email, Chat, File explorer',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      'PaneGroup works best as a content container within your app shell. It handles the list/detail split automatically.',
    previewDefaults: {
      tone: 'surfaceContainerLow',
      minHeight: 'xl',
      padding: 'none',
      align: 'start',
      justify: 'start',
    },
    examples: [
      {
        title: 'Basic two-pane layout',
        visual: <BasicPaneGroupExample />,
        caption: 'List pane with navigation and detail content area',
      },
      {
        title: 'Responsive behavior',
        visual: <ResponsivePaneGroupExample />,
        caption: 'Shows list or detail based on screen size and showDetailMobile prop',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'sidebar',
      type: 'ReactNode',
      required: true,
      description: 'Content for the list pane.',
    },
    {
      name: 'detail',
      type: 'ReactNode',
      required: true,
      description: 'Content for the detail/main pane.',
    },
    {
      name: 'showDetail',
      type: 'boolean',
      default: 'false',
      description: 'On mobile, shows detail pane instead of list when true.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes for the container.',
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'Uses semantic div structure for layout.',
      'Content in each pane maintains proper heading hierarchy.',
      'Hidden panes are visually hidden but accessible to screen readers on mobile.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Navigate between interactive elements in visible pane' },
    ],
    focus: [
      'Focus remains in the visible pane on mobile.',
      'Transitions include duration for smooth animation.',
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Use PaneGroup with state to control the mobile detail visibility.',
    code: `import { PaneGroup } from "@/components/ui/pane-group";
import { useState } from "react";

function SettingsPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  return (
    <PaneGroup
      sidebar={
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
      showDetail={!!selectedSection}
      className="h-screen"
    />
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'canonical-layouts',
      reason: 'More feature-rich layouts with back buttons and mobile transitions.',
    },
    {
      slug: 'sidebar',
      reason: 'App-level navigation sidebar with rail and drawer patterns.',
    },
    {
      slug: 'navigation-drawer',
      reason: 'Use for modal navigation overlay patterns.',
    },
  ],
};
