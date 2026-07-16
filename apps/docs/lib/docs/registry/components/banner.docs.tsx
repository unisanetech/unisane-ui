'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Banner } from '@unisane/ui/banner';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const BannerHeroVisual = () => (
  <HeroBackground tone="error">
    {/* Mock App with Banner */}
    <div className="bg-surface border-outline-variant relative w-80 overflow-hidden rounded-sm border shadow-xl">
      {/* Banner */}
      <div className="border-outline-variant bg-surface flex items-start gap-3 border-b p-4">
        <span className="material-symbols-outlined text-primary mt-0.5">info</span>
        <div className="flex-1">
          <div className="text-title-small text-on-surface mb-1">Update Available</div>
          <div className="text-body-small text-on-surface-variant">
            A new version is ready to install.
          </div>
          <div className="mt-3 flex gap-2">
            <span className="text-label-medium text-primary cursor-pointer font-medium">
              Update Now
            </span>
            <span className="text-label-medium text-primary cursor-pointer font-medium">Later</span>
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer text-[18px]">
          close
        </span>
      </div>
      {/* Content */}
      <div className="space-y-3 p-5">
        <div className="bg-surface-container-high h-4 w-full rounded-sm" />
        <div className="bg-surface-container-high h-4 w-3/4 rounded-sm" />
        <div className="bg-surface-container-high h-4 w-1/2 rounded-sm" />
      </div>
    </div>
  </HeroBackground>
);

// ─── PLACEMENT VISUALS ────────────────────────────────────────────────────────
const BannerDefaultVisual = () => (
  <div className="mx-auto w-72">
    <Banner onDismiss={() => {}} dismissLabel="Hide feature announcement">
      New features are now available.
    </Banner>
  </div>
);

const BannerWarningVisual = () => (
  <div className="mx-auto w-72">
    <Banner variant="warning">Your session expires in 5 minutes.</Banner>
  </div>
);

export const bannerDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'banner',
  name: 'Banner',
  description: 'Banners display important, succinct messages with optional actions.',
  category: 'communication',
  status: 'stable',
  icon: 'campaign',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/banner',
  exports: ['Banner', 'BannerAction'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <BannerHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Banners come in different variants for different message types.',
    columns: {
      emphasis: 'Variant',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Default',
        component: <Banner>Info message</Banner>,
        rationale: 'General information or announcements.',
        examples: 'Updates, Tips, Announcements',
      },
      {
        emphasis: 'Warning',
        component: <Banner variant="warning">Warning message</Banner>,
        rationale: 'Caution or attention needed.',
        examples: 'Session expiry, Data limits, Deprecation',
      },
      {
        emphasis: 'Error',
        component: <Banner variant="error">Error message</Banner>,
        rationale: 'Critical issues requiring action.',
        examples: 'Connection lost, Sync failed, Access denied',
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description: 'Banners can include icons, titles, messages, and action buttons.',
    items: [
      {
        component: <Banner>Simple message</Banner>,
        title: 'Simple',
        subtitle: 'Message only',
      },
      {
        component: <Banner icon="lightbulb">With custom icon</Banner>,
        title: 'With Icon',
        subtitle: 'Visual indicator',
      },
      {
        component: <Banner title="Title">Message</Banner>,
        title: 'With Title',
        subtitle: 'Title + message',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Banners appear at the top of content areas, below app bars.',
    examples: [
      {
        title: 'Default banner',
        visual: <BannerDefaultVisual />,
        caption: 'Information banner with close button',
      },
      {
        title: 'Warning banner',
        visual: <BannerWarningVisual />,
        caption: 'Warning banner for important alerts',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'open',
      type: 'boolean',
      default: 'true',
      description: 'Optionally controls whether the banner is visible.',
    },
    {
      name: 'onDismiss',
      type: '() => void',
      description: 'Shows the dismiss button and runs when it is activated.',
    },
    {
      name: 'dismissLabel',
      type: 'string',
      default: '"Dismiss banner"',
      description: 'Accessible label for the optional dismiss button.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'The main banner content.',
    },
    {
      name: 'title',
      type: 'ReactNode',
      description: 'Optional rich title displayed above the content.',
    },
    {
      name: 'variant',
      type: '"default" | "info" | "success" | "warning" | "error"',
      default: '"default"',
      description: 'The visual style of the banner.',
    },
    {
      name: 'icon',
      type: 'ReactNode | string | false',
      description: 'Overrides the semantic icon, or suppresses it with false.',
    },
    {
      name: 'actions',
      type: 'BannerAction[]',
      description: 'Stable-id action buttons with rich labels and optional disabled state.',
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "Uses role='status' or role='alert' based on variant.",
      'aria-live announces banner content dynamically.',
      'Error and warning are assertive; default, info, and success are polite.',
      'Native role and aria-live props override the semantic defaults when needed.',
      'The optional dismiss button has a consumer-owned accessible label.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Moves focus to actions and close button' },
      { key: 'Enter / Space', description: 'Activates focused action' },
    ],
    focus: [
      'Focus is not automatically moved to banners.',
      'Action buttons and close have visible focus states.',
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Render a persistent banner or opt into controlled visibility and dismissal.',
    code: `import { Banner } from "@/components/ui/banner";
import { useState } from "react";

function UpdateNotification() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <Banner
      open={showBanner}
      onDismiss={() => setShowBanner(false)}
      title="Update Available"
      icon="system_update"
      actions={[
        { id: "update", label: "Update Now", onClick: () => handleUpdate() },
        { id: "later", label: "Later", onClick: () => setShowBanner(false) },
      ]}
    >
      A new version of the app is ready to install.
    </Banner>
  );
}

function SessionWarning({ expiresIn }) {
  const [dismissed, setDismissed] = useState(false);

  if (expiresIn > 300) return null; // Only show when < 5 min

  return (
    <Banner
      open={!dismissed}
      onDismiss={() => setDismissed(true)}
      variant="warning"
      icon="timer"
      actions={[
        { id: "extend", label: "Extend Session", onClick: () => extendSession() },
      ]}
    >
      {\`Your session expires in \${Math.floor(expiresIn / 60)} minutes.\`}
    </Banner>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'alert',
      reason: 'Use for inline status messages.',
    },
    {
      slug: 'snackbar',
      reason: 'Use for temporary, non-blocking notifications.',
    },
    {
      slug: 'dialog',
      reason: 'Use when user acknowledgment is required.',
    },
  ],
};
