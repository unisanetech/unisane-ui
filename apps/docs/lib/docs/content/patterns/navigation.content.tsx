import { Badge, IconButton, Surface, Typography } from '@unisane/ui';
import type { PatternPageDoc } from './types';
import { navigationPatternMeta as meta } from './pattern-page-meta';

const heroVisual = (
  <div className="grid h-full grid-cols-[88px_minmax(0,1fr)] gap-4">
    <Surface tone="surface" rounded="sm" className="flex flex-col gap-3 p-3">
      <div className="bg-primary-container h-10 rounded-full" />
      <div className="bg-surface-container-high h-10 rounded-full" />
      <div className="bg-surface-container-high h-10 rounded-full" />
    </Surface>
    <Surface tone="surface" rounded="sm" className="p-4">
      <div className="bg-surface-container-high mb-3 h-10 rounded-sm" />
      <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-3">
        <div className="space-y-2">
          <div className="bg-primary-container h-10 rounded-sm" />
          <div className="bg-surface-container-low h-10 rounded-sm" />
          <div className="bg-surface-container-low h-10 rounded-sm" />
        </div>
        <div className="space-y-3">
          <div className="bg-surface-container-low h-16 rounded-sm" />
          <div className="bg-surface-container-low h-20 rounded-sm" />
        </div>
      </div>
    </Surface>
  </div>
);

export const navigationPatternPage: PatternPageDoc = {
  ...meta,
  heroVisual,
  heroPreview: { tone: 'surfaceContainerLow', minHeight: 'md', padding: 'md' },
  sections: [
    {
      type: 'blocks',
      id: 'blocks',
      title: 'Navigation blocks',
      description: 'Navigation building blocks for shell, header, and task flow entry points.',
      previewDefaults: {
        tone: 'surfaceContainerLow',
        minHeight: 'xl',
        padding: 'md',
      },
      examples: [
        {
          id: 'rail-shell-block',
          title: 'Rail shell',
          description: 'A desktop shell with persistent rail destinations and a content header.',
          component: (
            <Surface
              tone="surface"
              rounded="sm"
              className="border-outline-soft w-full max-w-[44rem] overflow-hidden border"
            >
              <div className="grid grid-cols-[84px_minmax(0,1fr)]">
                <Surface tone="surfaceContainerLow" className="space-y-3 p-3">
                  {['home', 'rocket_launch', 'widgets'].map((icon, index) => (
                    <Surface
                      key={icon}
                      tone={index === 0 ? 'primaryContainer' : 'surface'}
                      rounded="full"
                      className="flex h-11 items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </Surface>
                  ))}
                </Surface>
                <div className="space-y-4 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Typography variant="titleLarge">Workspace</Typography>
                    <div className="flex gap-2">
                      <IconButton size="sm" aria-label="Search">
                        <span className="material-symbols-outlined text-[18px]">search</span>
                      </IconButton>
                      <IconButton size="sm" aria-label="Notifications">
                        <span className="material-symbols-outlined text-[18px]">notifications</span>
                      </IconButton>
                    </div>
                  </div>
                  <div className="bg-surface-container-low h-24 rounded-sm" />
                </div>
              </div>
            </Surface>
          ),
          code: `import { IconButton, Surface, Typography } from "@unisane/ui";

export function RailShellBlock() {
  return (
    <Surface tone="surface" rounded="sm" className="overflow-hidden border border-outline-soft">
      <div className="grid grid-cols-[84px_minmax(0,1fr)]">
        <Surface tone="surfaceContainerLow" className="space-y-3 p-3">
          {["home", "rocket_launch", "widgets"].map((icon, index) => (
            <Surface
              key={icon}
              tone={index === 0 ? "primaryContainer" : "surface"}
              rounded="full"
              className="flex h-11 items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
            </Surface>
          ))}
        </Surface>
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <Typography variant="titleLarge">Workspace</Typography>
            <div className="flex gap-2">
              <IconButton size="sm" aria-label="Search">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </IconButton>
              <IconButton size="sm" aria-label="Notifications">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
              </IconButton>
            </div>
          </div>
          <div className="h-24 rounded-sm bg-surface-container-low" />
        </div>
      </div>
    </Surface>
  );
}`,
        },
        {
          id: 'context-menu-header',
          title: 'Context header',
          description: 'A compact top bar for page identity, state, and secondary actions.',
          component: (
            <Surface
              tone="surface"
              rounded="sm"
              className="border-outline-soft w-full max-w-[38rem] overflow-hidden border p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Typography variant="titleLarge">Billing review</Typography>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="tonal">In review</Badge>
                    <Typography variant="bodySmall" className="text-on-surface-variant">
                      12 open items
                    </Typography>
                  </div>
                </div>
                <div className="flex gap-2">
                  <IconButton size="sm" aria-label="Search">
                    <span className="material-symbols-outlined text-[18px]">search</span>
                  </IconButton>
                  <IconButton size="sm" aria-label="More">
                    <span className="material-symbols-outlined text-[18px]">more_vert</span>
                  </IconButton>
                </div>
              </div>
            </Surface>
          ),
          code: `import { Badge, IconButton, Surface, Typography } from "@unisane/ui";

export function ContextHeader() {
  return (
    <Surface tone="surface" rounded="sm" className="overflow-hidden border border-outline-soft p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Typography variant="titleLarge">Billing review</Typography>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="tonal">In review</Badge>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              12 open items
            </Typography>
          </div>
        </div>
        <div className="flex gap-2">
          <IconButton size="sm" aria-label="Search">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </IconButton>
          <IconButton size="sm" aria-label="More">
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
          </IconButton>
        </div>
      </div>
    </Surface>
  );
}`,
        },
      ],
    },
    {
      type: 'checklist',
      id: 'rules',
      title: 'Navigation rules',
      items: [
        'Use one shell system per app and let rail, drawer, and mobile views adapt from it.',
        'Keep destination labels stable across navigation surfaces.',
        'Reserve pills and active accents for the current destination, not every row.',
      ],
    },
    {
      type: 'links',
      id: 'components',
      title: 'Navigation components',
      items: [
        {
          title: 'Sidebar',
          href: '/docs/components/sidebar',
          description: 'Shell-level rail, drawer, inset, and responsive behavior.',
          icon: 'view_sidebar',
        },
        {
          title: 'Navigation Rail',
          href: '/docs/components/navigation-rail',
          description: 'Standalone rail for product and marketing navigation moments.',
          icon: 'dock_to_left',
        },
        {
          title: 'Top App Bar',
          href: '/docs/components/top-app-bar',
          description: 'Header actions, search, and page identity.',
          icon: 'web_asset',
        },
      ],
    },
  ],
};
