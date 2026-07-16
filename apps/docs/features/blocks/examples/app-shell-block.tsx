'use client';

import { cn } from '@unisane/ui/lib/utils';
import { IconButton, SearchBar, TopAppBar, Surface } from '@unisane/ui';
import {
  Sidebar,
  SidebarDrawer,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@unisane/ui/sidebar';
import type { NavigationItem } from '@unisane/ui/navigation';
import type { DocsBlockViewport } from '@/lib/docs/blocks/types';

const navigationItems: NavigationItem[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    icon: 'space_dashboard',
    items: [
      { id: 'overview', label: 'Overview' },
      {
        id: 'operations',
        label: 'Operations',
        items: [
          { id: 'approvals', label: 'Approvals' },
          { id: 'handoffs', label: 'Handoffs' },
          { id: 'audit-log', label: 'Audit log' },
        ],
      },
      { id: 'team', label: 'Team' },
      { id: 'billing', label: 'Billing' },
      { id: 'settings', label: 'Settings' },
    ],
  },
  { id: 'queue', label: 'Queue', icon: 'inbox' },
  { id: 'reports', label: 'Reports', icon: 'bar_chart' },
  { id: 'settings-root', label: 'Settings', icon: 'settings' },
];

interface AppShellBlockProps {
  viewport?: DocsBlockViewport;
}

export function AppShellBlock({ viewport = 'desktop' }: AppShellBlockProps) {
  return (
    <SidebarProvider
      items={navigationItems}
      defaultValue="approvals"
      defaultExpanded={viewport === 'desktop'}
      defaultMobileOpen={false}
      forceViewport={viewport}
      persist={false}
      containerMode="contained"
      mobileInsetOffset={0}
    >
      <AppShellBlockContent viewport={viewport} />
    </SidebarProvider>
  );
}

function AppShellBlockContent({ viewport }: AppShellBlockProps) {
  const isDesktop = viewport === 'desktop';
  const isTablet = viewport === 'tablet';
  const isMobile = viewport === 'mobile';
  const showInlineSearch = isDesktop;
  const showCompactSearch = !isDesktop;

  return (
    <div className="border-outline-variant relative h-full w-full [transform:translateZ(0)] overflow-hidden rounded-sm border">
      <Sidebar className="h-full">
        <SidebarRail aria-label="App navigation" />
        <SidebarDrawer aria-label="App navigation" overlayHeadline="Main navigation" />

        <SidebarInset className="h-full">
          <TopAppBar
            variant="small"
            title="App shell"
            navigationIcon={
              <SidebarTrigger
                aria-label="Open navigation"
                visibility="mobile"
                className="text-on-surface-variant hover:bg-state-hover size-9 rounded-sm"
              >
                <span className="material-symbols-outlined text-[18px]">menu</span>
              </SidebarTrigger>
            }
            actions={
              <>
                <div className={cn('min-w-[16rem]', showInlineSearch ? 'block' : 'hidden')}>
                  <SearchBar
                    placeholder="Search records"
                    className="pointer-events-none border-0"
                    size="sm"
                  />
                </div>
                <IconButton
                  variant="standard"
                  size="sm"
                  aria-label="Search"
                  className={cn(
                    'pointer-events-none',
                    showCompactSearch ? 'inline-flex' : 'hidden',
                  )}
                  icon={<span className="material-symbols-outlined text-[18px]">search</span>}
                />
                <IconButton
                  variant="standard"
                  size="sm"
                  aria-label="More actions"
                  className="pointer-events-none"
                  icon={<span className="material-symbols-outlined text-[18px]">more_vert</span>}
                />
              </>
            }
          />

          <div
            className={cn(
              'bg-surface grid h-full gap-4 p-4',
              isDesktop && 'grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)]',
              isTablet && 'grid-cols-1 grid-rows-[88px_minmax(0,1fr)_200px]',
              isMobile && 'grid-cols-1 grid-rows-[72px_minmax(0,1fr)_160px]',
            )}
          >
            <div
              className={cn(
                'grid h-full gap-4',
                isDesktop && 'grid-rows-[88px_1fr]',
                isTablet && 'grid-rows-[88px_1fr]',
                isMobile && 'grid-rows-[72px_1fr]',
              )}
            >
              <Surface tone="surfaceContainerLow" rounded="sm" className="h-full" />
              <Surface tone="surfaceContainerLow" rounded="sm" className="h-full" />
            </div>
            <div
              className={cn(
                'grid h-full gap-4',
                isDesktop && 'grid-rows-[140px_1fr]',
                isTablet && 'grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]',
                isMobile && 'grid-rows-[88px_1fr]',
              )}
            >
              <Surface tone="primaryContainer" rounded="sm" className="h-full" />
              <Surface tone="surfaceContainerLow" rounded="sm" className="h-full" />
            </div>
          </div>
        </SidebarInset>
      </Sidebar>
    </div>
  );
}
