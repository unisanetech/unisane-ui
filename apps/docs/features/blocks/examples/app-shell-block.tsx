'use client';

import { cn } from '@unisane/ui/lib/utils';
import {
  IconButton,
  SearchBar,
  Sidebar,
  SidebarBackdrop,
  SidebarCollapsibleGroup,
  SidebarContent,
  SidebarDrawer,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarNavItem,
  SidebarProvider,
  SidebarRail,
  SidebarRailItem,
  SidebarTrigger,
  TopAppBar,
  Typography,
  Surface,
  useSidebar,
} from '@unisane/ui';
import type { NavigationItem } from '@unisane/ui';
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

function renderNestedMenu(
  items: NavigationItem[],
  showRootIcons: boolean,
  level = 0,
) {
  return items.map((item) => {
    const hasChildren = Boolean(item.items && item.items.length > 0);
    if (!hasChildren) {
      return (
        <SidebarNavItem
          key={item.id}
          id={item.id}
          icon={level === 0 && showRootIcons ? item.icon : undefined}
          label={item.label}
        />
      );
    }

    return (
      <SidebarCollapsibleGroup
        key={item.id}
        id={item.id}
        label={item.label}
        icon={level === 0 && showRootIcons ? item.icon : undefined}
      >
        <SidebarMenu>{renderNestedMenu(item.items || [], false, level + 1)}</SidebarMenu>
      </SidebarCollapsibleGroup>
    );
  });
}

interface AppShellBlockProps {
  viewport?: DocsBlockViewport;
}

export function AppShellBlock({ viewport = 'desktop' }: AppShellBlockProps) {
  return (
    <SidebarProvider
      items={navigationItems}
      defaultActiveId="approvals"
      defaultExpanded={viewport === 'desktop'}
      defaultMobileOpen={false}
      forceViewport={viewport}
      persist={false}
    >
      <AppShellBlockContent viewport={viewport} />
    </SidebarProvider>
  );
}

function AppShellBlockContent({ viewport }: AppShellBlockProps) {
  const { mobileOpen, effectiveItem } = useSidebar();
  const isDesktop = viewport === 'desktop';
  const isTablet = viewport === 'tablet';
  const isMobile = viewport === 'mobile';

  return (
    <div className="border-outline-variant relative h-full w-full [transform:translateZ(0)] overflow-hidden rounded-sm border">
      <Sidebar className="h-full">
        <SidebarRail className={cn(!isDesktop && '!hidden')}>
          <SidebarRailItem id="workspace" label="Workspace" icon="space_dashboard" />
          <SidebarRailItem id="queue" label="Queue" icon="inbox" />
          <SidebarRailItem id="reports" label="Reports" icon="bar_chart" />
          <SidebarRailItem id="settings-root" label="Settings" icon="settings" />
        </SidebarRail>

        <SidebarDrawer>
          {mobileOpen ? (
            <SidebarContent className="pt-3 pb-14">
              <SidebarGroupLabel>Main navigation</SidebarGroupLabel>
              <SidebarMenu>{renderNestedMenu(navigationItems, true)}</SidebarMenu>
            </SidebarContent>
          ) : (
            <>
              <SidebarHeader>
                <Typography variant="labelLarge" className="text-on-surface-variant">
                  {effectiveItem?.label ?? 'Workspace'}
                </Typography>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  {renderNestedMenu(
                    effectiveItem?.items && effectiveItem.items.length > 0
                      ? effectiveItem.items
                      : navigationItems[0]?.items || [],
                    false,
                  )}
                </SidebarMenu>
              </SidebarContent>
            </>
          )}
        </SidebarDrawer>
        <SidebarBackdrop />

        <SidebarInset className="!mt-0 !h-full">
          <TopAppBar
            variant="small"
            title="App shell"
            navigationIcon={
              !isDesktop ? (
                <SidebarTrigger className="size-9 rounded-sm text-on-surface-variant hover:bg-state-hover">
                  <span className="material-symbols-outlined text-[18px]">menu</span>
                </SidebarTrigger>
              ) : undefined
            }
            actions={
              <>
                <div className={cn('min-w-[16rem]', isMobile ? 'hidden' : 'block')}>
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
                  className={cn('pointer-events-none', isMobile ? 'inline-flex' : 'hidden')}
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                </IconButton>
                <IconButton
                  variant="standard"
                  size="sm"
                  aria-label="More actions"
                  className="pointer-events-none"
                >
                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </IconButton>
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
