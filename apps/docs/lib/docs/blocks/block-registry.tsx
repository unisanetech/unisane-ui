'use client';

import type { DocsBlock } from './types';
import { BLOCK_META } from './block-meta';
import {
  AiChatWorkspaceBlock,
  AppShellBlock,
  AuthCenteredBlock,
  AuthSplitBlock,
  ReviewQueueBlock,
  SupportingPaneBlock,
} from '@/features/blocks/examples';

export const BLOCK_REGISTRY: DocsBlock[] = [
  {
    ...BLOCK_META.find((block) => block.slug === 'app-shell')!,
    preview: <AppShellBlock />,
    previewShell: {
      canvasHeight: 'screen-max',
      canvasInset: 'md',
      defaultViewport: 'desktop',
      viewportOptions: ['desktop', 'tablet', 'mobile'],
      viewportWidths: {
        desktop: 1320,
        tablet: 900,
        mobile: 390,
      },
    },
    previewConfig: {
      tone: 'surfaceContainerLow',
      minHeight: 'screen',
      padding: 'none',
      justify: 'start',
      align: 'start',
    },
    code: `import {
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
} from "@unisane/ui";
import type { NavigationItem } from "@unisane/ui";

const navigationItems: NavigationItem[] = [
  {
    id: "workspace",
    label: "Workspace",
    icon: "space_dashboard",
    items: [
      { id: "overview", label: "Overview" },
      { id: "team", label: "Team" },
      { id: "billing", label: "Billing" },
      { id: "settings", label: "Settings" },
    ],
  },
  { id: "queue", label: "Queue", icon: "inbox" },
  { id: "reports", label: "Reports", icon: "bar_chart" },
  { id: "settings-root", label: "Settings", icon: "settings" },
];

const workspaceChildIds = ["overview", "team", "billing", "settings"];

export function AppShellBlock() {
  return (
    <SidebarProvider items={navigationItems} defaultActiveId="overview" defaultExpanded persist={false} containerMode="contained" mobileInsetOffset={0}>
      <div className="h-full w-full overflow-hidden rounded-sm border border-outline-soft">
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
          <SidebarInset className="h-full">
            <TopAppBar
              variant="small"
              title="App shell"
              actions={
                <div className="hidden min-w-[20rem] medium:block">
                  <SearchBar placeholder="Search records" className="border-0" size="sm" />
                </div>
              }
            />
            <div className="grid h-full grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)] gap-4 bg-surface p-4">
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
}`,
    usedComponents: [
      { title: 'Sidebar', href: '/docs/components/sidebar' },
      { title: 'Top App Bar', href: '/docs/components/top-app-bar' },
      { title: 'Search Bar', href: '/docs/components/search-bar' },
    ],
  },
  {
    ...BLOCK_META.find((block) => block.slug === 'supporting-pane')!,
    preview: <SupportingPaneBlock />,
    previewShell: {
      canvasHeight: 'screen-tall',
      canvasInset: 'md',
      defaultViewport: 'desktop',
      viewportOptions: ['desktop', 'tablet', 'mobile'],
      viewportWidths: {
        desktop: 1220,
        tablet: 860,
        mobile: 390,
      },
    },
    previewConfig: {
      tone: 'surfaceContainerLow',
      minHeight: 'screen',
      padding: 'none',
      justify: 'start',
      align: 'start',
    },
    code: `import { Button, Surface, Typography } from "@unisane/ui";

export function SupportingPaneBlock() {
  return (
    <Surface tone="surface" rounded="sm" className="overflow-hidden border border-outline-soft">
      <div className="grid grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <Typography variant="titleLarge">Document review</Typography>
            <Button variant="tonal" size="sm">Add comment</Button>
          </div>
        </div>
        <Surface tone="surfaceContainerLow" className="border-l border-outline-weak p-4">
          <Typography variant="titleMedium">Properties</Typography>
        </Surface>
      </div>
    </Surface>
  );
}`,
    usedComponents: [
      { title: 'Canonical Layouts', href: '/docs/components/canonical-layouts' },
      { title: 'Pane Group', href: '/docs/components/pane-group' },
      { title: 'Button', href: '/docs/components/button' },
    ],
  },
  {
    ...BLOCK_META.find((block) => block.slug === 'auth-split')!,
    preview: <AuthSplitBlock />,
    previewShell: {
      canvasHeight: 'xl',
      canvasInset: 'md',
      defaultViewport: 'desktop',
      viewportOptions: ['desktop', 'tablet', 'mobile'],
    },
    previewConfig: {
      tone: 'surfaceContainerLow',
      minHeight: 'screen',
      padding: 'none',
      justify: 'start',
      align: 'start',
    },
    code: `import { Button, Checkbox, Surface, TextField, Typography } from "@unisane/ui";

export function AuthSplitBlock() {
  return (
    <Surface tone="surface" rounded="sm" className="overflow-hidden border border-outline-soft">
      <div className="grid @3xl:grid-cols-[minmax(0,1.1fr)_420px]">
        <Surface tone="primaryContainer" className="p-8">
          <Typography variant="displaySmall">Welcome back.</Typography>
        </Surface>
        <div className="p-8">
          <TextField id="email" label="Email" placeholder="ops@northstar.so" size="sm" />
          <TextField id="password" label="Password" placeholder="Enter password" size="sm" type="password" />
          <Checkbox id="remember" label="Remember me" defaultChecked />
          <Button>Sign in</Button>
        </div>
      </div>
    </Surface>
  );
}`,
    usedComponents: [
      { title: 'Text Field', href: '/docs/components/text-field' },
      { title: 'Checkbox', href: '/docs/components/checkbox' },
      { title: 'Button', href: '/docs/components/button' },
    ],
  },
  {
    ...BLOCK_META.find((block) => block.slug === 'auth-centered')!,
    preview: <AuthCenteredBlock />,
    previewShell: {
      canvasHeight: 'lg',
      canvasInset: 'md',
      defaultViewport: 'mobile',
      viewportOptions: ['mobile', 'tablet', 'desktop'],
    },
    previewConfig: {
      tone: 'surfaceContainerLow',
      minHeight: 'screen',
      padding: 'md',
      justify: 'center',
      align: 'center',
    },
    code: `import { Button, Checkbox, Surface, TextField, Typography } from "@unisane/ui";

export function AuthCenteredBlock() {
  return (
    <Surface tone="surfaceContainerLow" rounded="sm" className="flex items-center justify-center p-8">
      <Surface tone="surface" rounded="sm" className="w-full max-w-[26rem] border border-outline-soft p-6 shadow-1">
        <Typography variant="headlineSmall">Create account</Typography>
        <TextField id="email" label="Email" placeholder="estelle@northstar.so" size="sm" />
        <TextField id="password" label="Password" placeholder="Create password" size="sm" type="password" />
        <Checkbox id="terms" label="I agree to the platform terms" defaultChecked />
        <Button>Create account</Button>
      </Surface>
    </Surface>
  );
}`,
    usedComponents: [
      { title: 'Text Field', href: '/docs/components/text-field' },
      { title: 'Checkbox', href: '/docs/components/checkbox' },
      { title: 'Button', href: '/docs/components/button' },
    ],
  },
  {
    ...BLOCK_META.find((block) => block.slug === 'review-queue')!,
    preview: <ReviewQueueBlock />,
    previewShell: {
      canvasHeight: 'xl',
      canvasInset: 'sm',
      defaultViewport: 'desktop',
      viewportOptions: ['desktop', 'tablet'],
    },
    previewConfig: {
      tone: 'surfaceContainerLow',
      minHeight: 'screen',
      padding: 'none',
      justify: 'start',
      align: 'start',
    },
    code: `import { Badge, Button, Card, Pagination, Surface, Typography } from "@unisane/ui";

export function ReviewQueueBlock() {
  return (
    <Card variant="outlined">
      <Card.Header>
        <Card.Title>Review queue</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-3">
        {[
          ["Invoice review", "Ready", "Ops"],
          ["Billing handoff", "Blocked", "Finance"],
        ].map(([name, status, owner]) => (
          <Surface key={name} tone="surfaceContainerLow" rounded="sm" className="grid grid-cols-[minmax(0,1.6fr)_100px_80px] items-center gap-3 p-3">
            <Typography variant="bodyMedium">{name}</Typography>
            <Badge variant="tonal">{status}</Badge>
            <Typography variant="bodySmall" className="text-on-surface-variant">{owner}</Typography>
          </Surface>
        ))}
      </Card.Content>
      <Card.Footer className="justify-between">
        <Pagination currentPage={2} totalPages={8} onPageChange={() => {}} />
        <Button variant="tonal" size="sm">Open table</Button>
      </Card.Footer>
    </Card>
  );
}`,
    usedComponents: [
      { title: 'Table', href: '/docs/components/table' },
      { title: 'Pagination', href: '/docs/components/pagination' },
      { title: 'Badge', href: '/docs/components/badge' },
    ],
  },
  {
    ...BLOCK_META.find((block) => block.slug === 'ai-chat-workspace')!,
    preview: <AiChatWorkspaceBlock />,
    previewShell: {
      canvasHeight: 'xl',
      canvasInset: 'sm',
      defaultViewport: 'desktop',
      viewportOptions: ['desktop', 'tablet', 'mobile'],
    },
    previewConfig: {
      tone: 'surfaceContainerLow',
      minHeight: 'screen',
      padding: 'none',
      justify: 'start',
      align: 'start',
    },
    code: `import { Button, Surface, TextField, Typography } from "@unisane/ui";

export function AiChatWorkspaceBlock() {
  return (
    <Surface tone="surface" rounded="sm" className="overflow-hidden border border-outline-soft">
      <div className="flex min-h-[420px] flex-col justify-between p-5">
        <div className="space-y-4">
          <Surface tone="surfaceContainerLow" rounded="sm" className="ml-auto max-w-[75%] p-3">
            <Typography variant="bodyMedium">Turn this review queue into a cleaner triage flow.</Typography>
          </Surface>
          <Surface tone="primaryContainer" rounded="sm" className="max-w-[82%] p-3.5">
            <Typography variant="bodyMedium" className="text-on-primary-container">
              I can scaffold a review workspace with list-detail layout and a supporting pane.
            </Typography>
          </Surface>
        </div>
        <Surface tone="surfaceContainerLow" rounded="sm" className="p-3">
          <TextField id="chat" label="Ask anything" placeholder="Describe the app interface you need" size="sm" />
          <div className="mt-3 flex items-center justify-end">
            <Button size="sm">Send</Button>
          </div>
        </Surface>
      </div>
    </Surface>
  );
}`,
    usedComponents: [
      { title: 'Text Field', href: '/docs/components/text-field' },
      { title: 'Button', href: '/docs/components/button' },
      { title: 'Card', href: '/docs/components/card' },
    ],
  },
];

export function getRegisteredBlockBySlug(slug: string): DocsBlock | undefined {
  return BLOCK_REGISTRY.find((block) => block.slug === slug);
}
