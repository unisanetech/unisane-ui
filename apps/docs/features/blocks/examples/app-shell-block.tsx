'use client';

import {
  IconButton,
  SearchBar,
  Sidebar,
  SidebarContent,
  SidebarDrawer,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarNavItem,
  SidebarProvider,
  SidebarRail,
  SidebarRailItem,
  TopAppBar,
  Typography,
  Surface,
} from '@unisane/ui';
import type { NavigationItem } from '@unisane/ui';

const navigationItems: NavigationItem[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    icon: 'space_dashboard',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'team', label: 'Team' },
      { id: 'billing', label: 'Billing' },
      { id: 'settings', label: 'Settings' },
    ],
  },
  { id: 'queue', label: 'Queue', icon: 'inbox' },
  { id: 'reports', label: 'Reports', icon: 'bar_chart' },
  { id: 'settings-root', label: 'Settings', icon: 'settings' },
];

const workspaceChildIds = ['overview', 'team', 'billing', 'settings'];

export function AppShellBlock() {
  return (
    <SidebarProvider
      items={navigationItems}
      defaultActiveId="overview"
      defaultExpanded
      persist={false}
    >
      <div className="border-outline-variant/15 relative h-full w-full [transform:translateZ(0)] overflow-hidden rounded-sm border">
        <Sidebar className="h-full">
          <SidebarRail>
            <SidebarRailItem
              id="workspace"
              label="Workspace"
              icon="space_dashboard"
              childIds={workspaceChildIds}
            />
            <SidebarRailItem id="queue" label="Queue" icon="inbox" />
            <SidebarRailItem id="reports" label="Reports" icon="bar_chart" />
            <SidebarRailItem id="settings-root" label="Settings" icon="settings" />
          </SidebarRail>

          <SidebarDrawer>
            <SidebarHeader>
              <Typography variant="labelLarge" className="text-on-surface-variant">
                Workspace
              </Typography>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {workspaceChildIds.map((id) => (
                  <SidebarMenuItem key={id}>
                    <SidebarNavItem id={id} label={id.charAt(0).toUpperCase() + id.slice(1)} />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </SidebarDrawer>

          <SidebarInset className="!mt-0 !h-full">
            <TopAppBar
              variant="small"
              title="App shell"
              actions={
                <>
                  <div className="medium:block hidden min-w-[20rem]">
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
                    className="medium:hidden pointer-events-none"
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

            <div className="bg-surface grid h-full grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)] gap-4 p-4">
              <div className="grid h-full grid-rows-[88px_1fr] gap-4">
                <Surface tone="surfaceContainerLow" rounded="sm" className="h-full" />
                <Surface tone="surfaceContainerLow" rounded="sm" className="h-full" />
              </div>
              <div className="grid h-full grid-rows-[140px_1fr] gap-4">
                <Surface tone="primaryContainer" rounded="sm" className="h-full" />
                <Surface tone="surfaceContainerLow" rounded="sm" className="h-full" />
              </div>
            </div>
          </SidebarInset>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}
