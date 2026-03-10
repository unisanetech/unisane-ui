import { Badge, Button, Surface, Typography } from '@unisane/ui';
import type { PatternPageDoc } from './types';
import { layoutsPatternMeta as meta } from './pattern-page-meta';

const heroVisual = (
  <div className="grid h-full grid-cols-[96px_minmax(0,1fr)] gap-4">
    <Surface tone="surface" rounded="sm" className="p-3">
      <div className="space-y-3">
        <div className="bg-primary-container h-10 rounded-sm" />
        <div className="bg-surface-container-high h-10 rounded-sm" />
        <div className="bg-surface-container-high h-10 rounded-sm" />
      </div>
    </Surface>
    <Surface tone="surface" rounded="sm" className="p-4">
      <div className="space-y-3">
        <div className="bg-surface-container-high h-10 rounded-sm" />
        <div className="grid grid-cols-[minmax(0,1fr)_220px] gap-3">
          <div className="space-y-3">
            <div className="bg-surface-container-low h-20 rounded-sm" />
            <div className="bg-surface-container-low h-16 rounded-sm" />
          </div>
          <div className="bg-secondary-container h-[108px] rounded-sm" />
        </div>
      </div>
    </Surface>
  </div>
);

export const layoutsPatternPage: PatternPageDoc = {
  ...meta,
  heroVisual,
  heroPreview: { tone: 'surfaceContainerLow', minHeight: 'md', padding: 'md' },
  sections: [
    {
      type: 'blocks',
      id: 'blocks',
      title: 'Layout blocks',
      description: 'Use real layout compositions as reusable starting points for product screens.',
      previewDefaults: {
        tone: 'surfaceContainerLowest',
        minHeight: 'xl',
        padding: 'md',
      },
      examples: [
        {
          id: 'list-detail-layout',
          title: 'List-detail workspace',
          description: 'A queue on the left with selected-record detail on the right.',
          component: (
            <Surface
              tone="surface"
              rounded="sm"
              className="border-outline-variant/15 w-full max-w-[44rem] overflow-hidden border"
            >
              <div className="grid grid-cols-[220px_minmax(0,1fr)]">
                <Surface tone="surfaceContainerLow" className="space-y-2 p-3">
                  {['Invoice review', 'Billing handoff', 'Access issue'].map((item, index) => (
                    <Surface
                      key={item}
                      tone={index === 0 ? 'primaryContainer' : 'surface'}
                      rounded="sm"
                      className="p-3"
                    >
                      <Typography
                        variant="bodyMedium"
                        className={index === 0 ? 'text-on-primary-container' : undefined}
                      >
                        {item}
                      </Typography>
                    </Surface>
                  ))}
                </Surface>
                <div className="space-y-4 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Typography variant="titleLarge">Acme Co</Typography>
                    <Badge variant="tonal">Review</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-outline-variant/15 h-3 w-3/4 rounded-sm" />
                    <div className="bg-outline-variant/15 h-3 rounded-sm" />
                    <div className="bg-outline-variant/15 h-3 w-2/3 rounded-sm" />
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm">Approve</Button>
                    <Button variant="tonal" size="sm">
                      Ask for changes
                    </Button>
                  </div>
                </div>
              </div>
            </Surface>
          ),
          code: `import { Badge, Button, Surface, Typography } from "@unisane/ui";

export function ListDetailWorkspace() {
  return (
    <Surface tone="surface" rounded="sm" className="overflow-hidden border border-outline-variant/15">
      <div className="grid grid-cols-[220px_minmax(0,1fr)]">
        <Surface tone="surfaceContainerLow" className="space-y-2 p-3">
          {["Invoice review", "Billing handoff", "Access issue"].map((item, index) => (
            <Surface
              key={item}
              tone={index === 0 ? "primaryContainer" : "surface"}
              rounded="sm"
              className="p-3"
            >
              <Typography
                variant="bodyMedium"
                className={index === 0 ? "text-on-primary-container" : undefined}
              >
                {item}
              </Typography>
            </Surface>
          ))}
        </Surface>
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <Typography variant="titleLarge">Acme Co</Typography>
            <Badge variant="tonal">Review</Badge>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-3/4 rounded-sm bg-outline-variant/15" />
            <div className="h-3 rounded-sm bg-outline-variant/15" />
            <div className="h-3 w-2/3 rounded-sm bg-outline-variant/15" />
          </div>
          <div className="flex gap-3">
            <Button size="sm">Approve</Button>
            <Button variant="tonal" size="sm">Ask for changes</Button>
          </div>
        </div>
      </div>
    </Surface>
  );
}`,
        },
        {
          id: 'supporting-pane-layout',
          title: 'Supporting pane layout',
          description:
            'Main content stays central while contextual controls live in a supporting side pane.',
          component: (
            <Surface
              tone="surface"
              rounded="sm"
              className="border-outline-variant/15 w-full max-w-[44rem] overflow-hidden border"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_220px]">
                <div className="space-y-4 p-4">
                  <div className="bg-surface-container-low h-10 rounded-sm" />
                  <div className="bg-surface-container-low h-28 rounded-sm" />
                  <div className="bg-surface-container-low h-20 rounded-sm" />
                </div>
                <Surface tone="surfaceContainerLow" className="space-y-3 p-4">
                  <Typography variant="titleMedium">Properties</Typography>
                  <Surface tone="surface" rounded="sm" className="p-3">
                    <Typography variant="labelMedium">Owner</Typography>
                    <Typography variant="bodyMedium" className="text-on-surface-variant mt-1">
                      Operations
                    </Typography>
                  </Surface>
                  <Surface tone="surface" rounded="sm" className="p-3">
                    <Typography variant="labelMedium">Priority</Typography>
                    <Typography variant="bodyMedium" className="text-on-surface-variant mt-1">
                      Medium
                    </Typography>
                  </Surface>
                </Surface>
              </div>
            </Surface>
          ),
          code: `import { Surface, Typography } from "@unisane/ui";

export function SupportingPaneLayout() {
  return (
    <Surface tone="surface" rounded="sm" className="overflow-hidden border border-outline-variant/15">
      <div className="grid grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-4 p-4">
          <div className="h-10 rounded-sm bg-surface-container-low" />
          <div className="h-28 rounded-sm bg-surface-container-low" />
          <div className="h-20 rounded-sm bg-surface-container-low" />
        </div>
        <Surface tone="surfaceContainerLow" className="space-y-3 p-4">
          <Typography variant="titleMedium">Properties</Typography>
          <Surface tone="surface" rounded="sm" className="p-3">
            <Typography variant="labelMedium">Owner</Typography>
            <Typography variant="bodyMedium" className="mt-1 text-on-surface-variant">
              Operations
            </Typography>
          </Surface>
          <Surface tone="surface" rounded="sm" className="p-3">
            <Typography variant="labelMedium">Priority</Typography>
            <Typography variant="bodyMedium" className="mt-1 text-on-surface-variant">
              Medium
            </Typography>
          </Surface>
        </Surface>
      </div>
    </Surface>
  );
}`,
        },
      ],
    },
    {
      type: 'grid',
      id: 'patterns',
      title: 'Core layout patterns',
      columns: 2,
      items: [
        {
          title: 'List-detail',
          description: 'Browse a list on one side and inspect a focused record on the other.',
          icon: 'splitscreen',
        },
        {
          title: 'Supporting pane',
          description:
            'Keep the main task visible while exposing contextual controls alongside it.',
          icon: 'view_sidebar',
        },
        {
          title: 'Dashboard shell',
          description: 'Top-level navigation with grouped cards and operational surfaces.',
          icon: 'dashboard',
        },
        {
          title: 'Document workspace',
          description: 'Use a larger content pane with supportive tools, properties, or comments.',
          icon: 'article',
        },
      ],
    },
    {
      type: 'links',
      id: 'components',
      title: 'Components used in these patterns',
      items: [
        {
          title: 'Canonical Layouts',
          href: '/docs/components/canonical-layouts',
          description: 'Prebuilt layout compositions for common app structures.',
          icon: 'grid_view',
        },
        {
          title: 'Pane Group',
          href: '/docs/components/pane-group',
          description: 'Resizable panes for workspaces and data-heavy layouts.',
          icon: 'vertical_split',
        },
        {
          title: 'Sidebar',
          href: '/docs/components/sidebar',
          description: 'Shared shell for rail, drawer, inset, and content composition.',
          icon: 'view_sidebar',
        },
      ],
    },
  ],
};
