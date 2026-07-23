'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Card } from '@unisane/ui/card';
import { IconButton } from '@unisane/ui/icon-button';
import { Badge } from '@unisane/ui/badge';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const BadgeHeroVisual = () => (
  <HeroBackground tone="surface">
    {/* Mock Notification Panel */}
    <div className="bg-surface border-outline-variant relative w-72 overflow-hidden rounded-sm border shadow-xl">
      <div className="border-outline-variant flex items-center justify-between border-b px-5 py-4">
        <span className="text-title-medium text-on-surface">Dashboard</span>
        <div className="relative">
          <IconButton
            variant="standard"
            aria-label="Notifications"
            icon={<span className="material-symbols-outlined">notifications</span>}
          />
          <div className="absolute -top-1 -right-1">
            <Badge color="error" size="sm">
              3
            </Badge>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <Badge color="success">Active</Badge>
          <span className="text-body-small text-on-surface-variant">Server Status</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge color="error" variant="tonal">
            5 Critical
          </Badge>
          <span className="text-body-small text-on-surface-variant">Issues</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge color="primary" variant="outlined">
            v2.1.0
          </Badge>
          <span className="text-body-small text-on-surface-variant">Version</span>
        </div>
      </div>
    </div>
  </HeroBackground>
);

export const badgeDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'badge',
  name: 'Badge',
  description: 'Badges convey dynamic information, such as counts or status indicators.',
  category: 'communication',
  status: 'stable',
  icon: 'new_releases',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/badge',
  exports: ['Badge'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <BadgeHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      'Badges come in different variants and colors. Choose based on the visual hierarchy needed.',
    columns: {
      emphasis: 'Variant',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Filled',
        component: (
          <Badge variant="filled" color="primary">
            New
          </Badge>
        ),
        rationale: 'High emphasis for important status information.',
        examples: 'Notifications, New items, Important counts',
      },
      {
        emphasis: 'Tonal',
        component: (
          <Badge variant="tonal" color="primary">
            Active
          </Badge>
        ),
        rationale: 'Medium emphasis that blends with the UI.',
        examples: 'Status labels, Categories, Tags',
      },
      {
        emphasis: 'Outlined',
        component: (
          <Badge variant="outlined" color="primary">
            v1.0
          </Badge>
        ),
        rationale: 'Low emphasis for supplementary information.',
        examples: 'Version numbers, Secondary status, Metadata',
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description: 'Badges support multiple colors for different semantic meanings.',
    items: [
      {
        component: <Badge color="primary">Primary</Badge>,
        title: 'Primary',
        subtitle: 'Default actions',
      },
      {
        component: <Badge color="error">Error</Badge>,
        title: 'Error',
        subtitle: 'Alerts & warnings',
      },
      {
        component: <Badge color="success">Success</Badge>,
        title: 'Success',
        subtitle: 'Positive status',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Badges are commonly used for notification counts, status indicators, and labels.',
    examples: [
      {
        title: 'Notification badge',
        visual: (
          <Card variant="outlined" padding="lg" className="mx-auto max-w-52">
            <div className="flex items-center justify-center gap-6">
              <div className="relative">
                <IconButton
                  variant="standard"
                  aria-label="Mail"
                  icon={<span className="material-symbols-outlined">mail</span>}
                />
                <div className="absolute -top-1 -right-1">
                  <Badge color="error" size="sm">
                    12
                  </Badge>
                </div>
              </div>
              <div className="relative">
                <IconButton
                  variant="standard"
                  aria-label="Notifications"
                  icon={<span className="material-symbols-outlined">notifications</span>}
                />
                <div className="absolute -top-1 -right-1">
                  <Badge color="error" size="sm">
                    3
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ),
        caption: 'Badges on icon buttons for notification counts',
      },
      {
        title: 'Status labels',
        visual: (
          <Card variant="outlined" padding="md" className="mx-auto max-w-72">
            <div className="text-title-small text-on-surface mb-4">Orders</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-body-medium text-on-surface">Order #1234</span>
                <Badge color="success" variant="tonal">
                  Delivered
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-medium text-on-surface">Order #1235</span>
                <Badge color="primary" variant="tonal">
                  Shipping
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-medium text-on-surface">Order #1236</span>
                <Badge color="secondary" variant="tonal">
                  Processing
                </Badge>
              </div>
            </div>
          </Card>
        ),
        caption: 'Status badges in a list',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'The content displayed inside the badge.',
    },
    {
      name: 'variant',
      type: '"filled" | "tonal" | "outlined"',
      default: '"filled"',
      description: 'The visual style of the badge.',
    },
    {
      name: 'color',
      type: '"primary" | "secondary" | "tertiary" | "error" | "success" | "warning" | "info"',
      default: '"primary"',
      description: 'The color of the badge.',
    },
    {
      name: 'size',
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: 'The size of the badge.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply.',
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'Badges are passive text by default and do not create unexpected live-region announcements.',
      "Add role='status' and aria-live only when a dynamic update must be announced.",
      'Use visible text or an accessible label when the visual content alone is ambiguous.',
    ],
    keyboard: [{ key: 'N/A', description: 'Badges are not interactive' }],
    focus: ['Badges do not receive focus.', 'When used on buttons, the button receives focus.'],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Use badges to display counts and status information.',
    code: `import { Badge } from "@/components/ui/badge";

function NotificationBell({ count }: { count: number }) {
  return (
    <div className="relative inline-flex">
      <button className="p-2 rounded-full hover:bg-surface-variant">
        <span className="material-symbols-outlined">notifications</span>
      </button>
      {count > 0 && (
        <Badge
          color="error"
          size="sm"
          className="absolute -top-1 -right-1"
        >
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    active: "success",
    pending: "primary",
    error: "error",
  } as const;

  return (
    <Badge
      variant="tonal"
      color={colors[status as keyof typeof colors] || "primary"}
    >
      {status}
    </Badge>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'chip',
      reason: 'Use for interactive labels and filters.',
    },
    {
      slug: 'icon-button',
      reason: 'Often combined with badges for notifications.',
    },
    {
      slug: 'avatar',
      reason: 'Can include status badges.',
    },
  ],
};
