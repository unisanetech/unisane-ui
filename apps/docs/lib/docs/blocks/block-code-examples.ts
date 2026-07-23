import type { DocsBlockCodeExample } from './types';

function createSingleFileCodeExample(
  path: string,
  language: string,
  code: string,
): DocsBlockCodeExample {
  return {
    entryFile: path,
    files: [
      {
        path,
        language,
        code,
      },
    ],
  };
}

export function getCodeExampleEntryCode(codeExample: DocsBlockCodeExample): string {
  const entryFile = codeExample.entryFile;
  if (!entryFile) {
    return codeExample.files[0]?.code ?? '';
  }

  return (
    codeExample.files.find((file) => file.path === entryFile)?.code ??
    codeExample.files[0]?.code ??
    ''
  );
}

export const APP_SHELL_CODE_EXAMPLE: DocsBlockCodeExample = {
  entryFile: 'blocks/app-shell/app-shell-block.tsx',
  files: [
    {
      path: 'blocks/app-shell/app-shell-block.tsx',
      language: 'tsx',
      code: `import { SearchBar } from "@/components/ui/search-bar";
import { TopAppBar } from "@/components/ui/top-app-bar";
import {
  Sidebar,
  SidebarDrawer,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { navigationItems } from "./navigation-items";
import { WorkspaceContent } from "./workspace-content";

export function AppShellBlock() {
  return (
    <SidebarProvider
      items={navigationItems}
      defaultValue="overview"
      defaultExpanded
      persist={false}
      containerMode="contained"
      mobileInsetOffset={0}
    >
      <div className="h-full w-full overflow-hidden rounded-sm border border-outline-soft">
        <Sidebar className="h-full">
          <SidebarRail aria-label="App navigation" />
          <SidebarDrawer aria-label="App navigation" overlayHeadline="Navigation" />

          <SidebarInset className="h-full">
            <TopAppBar
              variant="small"
              title="App shell"
              actions={
                <div className="hidden min-w-[20rem] medium:block">
                  <SearchBar
                    placeholder="Search records"
                    className="border-0"
                    size="sm"
                  />
                </div>
              }
            />
            <WorkspaceContent />
          </SidebarInset>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}`,
    },
    {
      path: 'blocks/app-shell/navigation-items.ts',
      language: 'ts',
      code: `import type { NavigationItem } from "@/types/navigation";

export const navigationItems: NavigationItem[] = [
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
];`,
    },
    {
      path: 'blocks/app-shell/workspace-content.tsx',
      language: 'tsx',
      code: `import { Surface } from "@/components/ui/surface";

export function WorkspaceContent() {
  return (
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
  );
}`,
    },
  ],
};

export const SUPPORTING_PANE_CODE_EXAMPLE = createSingleFileCodeExample(
  'blocks/supporting-pane/supporting-pane-block.tsx',
  'tsx',
  `import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { Typography } from "@/components/ui/typography";

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
);

export const AUTH_SPLIT_CODE_EXAMPLE = createSingleFileCodeExample(
  'blocks/auth/auth-split-block.tsx',
  'tsx',
  `import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Surface } from "@/components/ui/surface";
import { TextField } from "@/components/ui/text-field";
import { Typography } from "@/components/ui/typography";

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
);

export const AUTH_CENTERED_CODE_EXAMPLE = createSingleFileCodeExample(
  'blocks/auth/auth-centered-block.tsx',
  'tsx',
  `import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Surface } from "@/components/ui/surface";
import { TextField } from "@/components/ui/text-field";
import { Typography } from "@/components/ui/typography";

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
);

export const REVIEW_QUEUE_CODE_EXAMPLE = createSingleFileCodeExample(
  'blocks/review-queue/review-queue-block.tsx',
  'tsx',
  `import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Surface } from '@/components/ui/surface';
import { Typography } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';

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
);

export const AI_CHAT_WORKSPACE_CODE_EXAMPLE = createSingleFileCodeExample(
  'blocks/ai-chat-workspace/ai-chat-workspace-block.tsx',
  'tsx',
  `import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { TextField } from "@/components/ui/text-field";
import { Typography } from "@/components/ui/typography";

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
);
