"use client";

import { ComponentDoc } from "../types";
import { HeroBackground } from "../../runtime/hero-background";
import { DesktopPreviewFrame } from "../../runtime/desktop-preview-frame";
import {
  NavigationDrawer,
  NavigationDrawerHeadline,
  NavigationDrawerItem,
  NavigationRail,
  Sidebar,
  SidebarBackdrop,
  SidebarCollapsibleGroup,
  SidebarContent,
  SidebarDrawer,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarNavItem,
  SidebarProvider,
  SidebarRail,
  SidebarRailItem,
  SidebarTrigger,
} from "@unisane/ui";

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const SidebarHeroVisual = () => (
  <HeroBackground tone="surface" padding="sm">
    <DesktopPreviewFrame designWidth={960} designHeight={560} className="max-w-3xl">
      <div className="relative isolate h-full w-full overflow-hidden rounded-sm border border-outline-variant bg-surface shadow-xl">
        <SidebarProvider
          containerMode="contained"
          forceViewport="desktop"
          defaultExpanded
          railWidth={72}
          drawerWidth={168}
          items={[
            {
              id: "ops",
              label: "Operations",
              icon: "monitoring",
              items: [
                { id: "ops-overview", label: "Overview" },
                { id: "ops-alerts", label: "Alerts" },
                { id: "ops-incidents", label: "Incidents" },
              ],
            },
            {
              id: "customers",
              label: "Customers",
              icon: "group",
              items: [
                { id: "accounts", label: "Accounts" },
                { id: "support", label: "Support" },
              ],
            },
            {
              id: "platform",
              label: "Platform",
              icon: "settings",
              items: [{ id: "deployments", label: "Deployments" }],
            },
          ]}
          defaultActiveId="ops-incidents"
        >
          <Sidebar className="relative h-full w-full">
            <SidebarRail>
              <SidebarRailItem id="ops" label="Operations" icon="monitoring" />
              <SidebarRailItem id="customers" label="Customers" icon="group" />
              <SidebarRailItem id="platform" label="Platform" icon="settings" />
            </SidebarRail>
            <SidebarDrawer className="shadow-none">
              <SidebarHeader>
                <div className="text-label-medium text-on-surface">Ops console</div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarCollapsibleGroup id="ops" label="Operations" icon="monitoring" defaultOpen>
                    <SidebarNavItem id="ops-overview" label="Overview" icon="dashboard" />
                    <SidebarNavItem id="ops-alerts" label="Alerts" icon="notifications" />
                    <SidebarNavItem id="ops-incidents" label="Incidents" icon="warning" />
                  </SidebarCollapsibleGroup>
                  <SidebarNavItem id="accounts" label="Accounts" icon="group" />
                  <SidebarNavItem id="support" label="Support queue" icon="support_agent" />
                  <SidebarNavItem id="deployments" label="Deployments" icon="rocket_launch" />
                </SidebarMenu>
              </SidebarContent>
            </SidebarDrawer>
            <SidebarBackdrop />
            <SidebarInset className="overflow-hidden bg-surface-container-lowest">
              <div className="space-y-2 p-4">
                <div className="text-title-small text-on-surface">Overview</div>
                <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface">
                  Revenue report updated.
                </div>
                <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface-variant">
                  Pending approvals: 3
                </div>
              </div>
            </SidebarInset>
          </Sidebar>
        </SidebarProvider>
      </div>
    </DesktopPreviewFrame>
  </HeroBackground>
);

// ─── EXAMPLES ────────────────────────────────────────────────────────────────
const RailOnlyExample = () => (
  <div className="relative isolate flex h-full w-full overflow-hidden rounded-sm border border-outline-variant bg-surface">
    <NavigationRail
      items={[
        { value: "home", label: "Home", icon: "home", activeIcon: "home" },
        { value: "search", label: "Search", icon: "search", activeIcon: "search" },
        { value: "alerts", label: "Alerts", icon: "notifications", activeIcon: "notifications", badge: "3" },
      ]}
      value="home"
    />
    <div className="flex-1 space-y-2 bg-surface-container-lowest p-4">
      <div className="h-4 bg-outline-soft rounded-sm w-1/2 mb-4" />
      <div className="h-3 bg-surface-container-high rounded-sm w-full" />
      <div className="h-3 bg-surface-container-high rounded-sm w-3/4" />
    </div>
  </div>
);

const ExpandedSidebarExample = () => (
  <div className="relative isolate h-full w-full overflow-hidden rounded-sm border border-outline-variant bg-surface">
    <SidebarProvider
      containerMode="contained"
      forceViewport="desktop"
      defaultExpanded
      railWidth={72}
      drawerWidth={168}
      items={[
        {
          id: "workspace",
          label: "Workspace",
          icon: "workspaces",
          items: [
            { id: "home", label: "Home" },
            { id: "projects", label: "Projects" },
            { id: "tasks", label: "Tasks" },
          ],
        },
        {
          id: "reports",
          label: "Reports",
          icon: "bar_chart",
          items: [{ id: "insights", label: "Insights" }],
        },
        {
          id: "admin",
          label: "Admin",
          icon: "admin_panel_settings",
          items: [{ id: "members", label: "Members" }],
        },
      ]}
      defaultActiveId="projects"
    >
      <Sidebar className="relative h-full w-full">
        <SidebarRail>
          <SidebarRailItem id="workspace" label="Workspace" icon="workspaces" />
          <SidebarRailItem id="reports" label="Reports" icon="bar_chart" />
          <SidebarRailItem id="admin" label="Admin" icon="admin_panel_settings" />
        </SidebarRail>
        <SidebarDrawer className="shadow-none">
          <SidebarHeader>
            <div className="text-label-medium text-on-surface">Product suite</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarCollapsibleGroup id="workspace" label="Workspace" icon="workspaces" defaultOpen>
                <SidebarNavItem id="home" label="Home" icon="home" />
                <SidebarNavItem id="projects" label="Projects" icon="folder" />
                <SidebarNavItem id="tasks" label="Tasks" icon="checklist" />
              </SidebarCollapsibleGroup>
              <SidebarNavItem id="insights" label="Insights" icon="insights" />
              <SidebarNavItem id="members" label="Members" icon="group" />
            </SidebarMenu>
          </SidebarContent>
        </SidebarDrawer>
        <SidebarBackdrop />
        <SidebarInset className="overflow-hidden bg-surface-container-lowest">
          <div className="space-y-2 p-4">
            <div className="text-title-medium text-on-surface">Documents</div>
            <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface">
              Report.pdf
            </div>
            <div className="rounded-sm border border-outline-variant bg-surface p-2 text-body-small text-on-surface">
              Notes.txt
            </div>
          </div>
        </SidebarInset>
      </Sidebar>
    </SidebarProvider>
  </div>
);

const SidebarSystemPreview = () => (
  <div className="relative isolate h-40 w-72 overflow-hidden rounded-sm border border-outline-variant bg-surface">
    <SidebarProvider
      containerMode="contained"
      forceViewport="desktop"
      defaultExpanded
      railWidth={64}
      drawerWidth={156}
      items={[
        {
          id: "workspace",
          label: "Workspace",
          icon: "workspaces",
          items: [
            { id: "overview", label: "Overview" },
            { id: "tasks", label: "Tasks" },
          ],
        },
        {
          id: "admin",
          label: "Admin",
          icon: "admin_panel_settings",
          items: [{ id: "members", label: "Members" }],
        },
      ]}
      defaultActiveId="tasks"
    >
      <Sidebar className="relative h-full w-full">
        <SidebarRail>
          <SidebarRailItem id="workspace" label="Workspace" icon="workspaces" />
          <SidebarRailItem id="admin" label="Admin" icon="admin_panel_settings" />
        </SidebarRail>
        <SidebarDrawer className="shadow-none">
          <SidebarHeader>
            <div className="text-label-medium text-on-surface">Workspace</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarCollapsibleGroup id="workspace" label="Team space" icon="workspaces" defaultOpen>
                <SidebarNavItem id="overview" label="Overview" icon="dashboard" />
                <SidebarNavItem id="tasks" label="Tasks" icon="checklist" />
              </SidebarCollapsibleGroup>
              <SidebarNavItem id="members" label="Members" icon="group" />
            </SidebarMenu>
          </SidebarContent>
        </SidebarDrawer>
        <SidebarBackdrop />
        <SidebarInset className="overflow-hidden bg-surface-container-lowest">
          <div className="space-y-2 p-3">
            <div className="h-2 rounded-sm bg-surface-container-high" />
            <div className="h-2 w-3/4 rounded-sm bg-surface-container-high" />
          </div>
        </SidebarInset>
      </Sidebar>
    </SidebarProvider>
  </div>
);

const SidebarRailPreview = () => (
  <div className="relative isolate h-40 w-28 overflow-hidden rounded-sm border border-outline-variant bg-surface">
    <NavigationRail
      items={[
        { value: "home", label: "Home", icon: "home", activeIcon: "home" },
        { value: "inbox", label: "Inbox", icon: "inbox", activeIcon: "inbox" },
      ]}
      value="home"
    />
  </div>
);

const SidebarMobileDrawerPreview = () => (
  <div className="relative isolate h-40 w-60 overflow-hidden rounded-sm border border-outline-variant bg-surface-container-lowest">
    <NavigationDrawer open modal className="absolute inset-y-0 left-0 h-full w-44 max-w-none">
      <NavigationDrawerHeadline>Main</NavigationDrawerHeadline>
      <NavigationDrawerItem icon="home" active>Home</NavigationDrawerItem>
      <NavigationDrawerItem icon="inbox">Inbox</NavigationDrawerItem>
      <NavigationDrawerItem icon="settings">Settings</NavigationDrawerItem>
    </NavigationDrawer>
    <div className="ml-44 space-y-2 p-3">
      <div className="h-2 rounded-sm bg-surface-container-high" />
      <div className="h-2 w-3/4 rounded-sm bg-surface-container-high" />
    </div>
  </div>
);

const RecipeCanvas = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative isolate h-[290px] w-full overflow-hidden rounded-sm border border-outline-variant bg-surface shadow-xl @2xl:h-[330px] ${className}`.trim()}
  >
    {children}
  </div>
);

const AdminDashboardRecipe = () => (
  <RecipeCanvas className="h-[310px] @2xl:h-[350px]">
    <SidebarProvider
      containerMode="contained"
      forceViewport="desktop"
      mode="rail-drawer"
      behavior="inset"
      defaultExpanded
      defaultActiveId="incidents"
      items={[
        {
          id: "operations",
          label: "Operations",
          icon: "monitoring",
          items: [
            { id: "overview", label: "Overview" },
            { id: "incidents", label: "Incidents" },
            { id: "alerts", label: "Alerts" },
            { id: "runbooks", label: "Runbooks" },
          ],
        },
        {
          id: "customers",
          label: "Customers",
          icon: "groups",
          items: [
            { id: "accounts", label: "Accounts" },
            { id: "subscriptions", label: "Subscriptions" },
            { id: "support-queue", label: "Support queue" },
          ],
        },
        {
          id: "platform",
          label: "Platform",
          icon: "dns",
          items: [
            { id: "deployments", label: "Deployments" },
            { id: "audit-log", label: "Audit log" },
          ],
        },
      ]}
    >
      <Sidebar className="h-full w-full">
        <SidebarRail>
          <SidebarRailItem id="operations" label="Operations" icon="monitoring" />
          <SidebarRailItem id="customers" label="Customers" icon="groups" />
          <SidebarRailItem id="platform" label="Platform" icon="dns" />
        </SidebarRail>
        <SidebarDrawer>
          <SidebarHeader>
            <div className="text-label-medium text-on-surface-variant">Control center</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Operations</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarCollapsibleGroup id="operations" label="Live operations" icon="monitoring" defaultOpen>
                  <SidebarNavItem id="overview" label="Overview" icon="dashboard" />
                  <SidebarNavItem id="incidents" label="Incidents" icon="warning" />
                  <SidebarNavItem id="alerts" label="Alerts" icon="notifications" />
                  <SidebarNavItem id="runbooks" label="Runbooks" icon="library_books" />
                </SidebarCollapsibleGroup>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Customer success</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarCollapsibleGroup id="customers" label="Accounts" icon="groups">
                  <SidebarNavItem id="accounts" label="Accounts" icon="group" />
                  <SidebarNavItem id="subscriptions" label="Subscriptions" icon="payments" />
                  <SidebarNavItem id="support-queue" label="Support queue" icon="support_agent" />
                </SidebarCollapsibleGroup>
                <SidebarNavItem id="deployments" label="Deployments" icon="rocket_launch" />
                <SidebarNavItem id="audit-log" label="Audit log" icon="history" />
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </SidebarDrawer>
        <SidebarInset className="overflow-hidden bg-surface-container-lowest">
          <div className="h-full p-3">
            <div className="h-full rounded-sm border border-outline-variant bg-surface p-3">
              <div className="text-label-medium text-on-surface">Main content area</div>
              <div className="mt-2 space-y-2">
                <div className="h-2 w-2/3 rounded-sm bg-surface-container-high" />
                <div className="h-2 w-1/2 rounded-sm bg-surface-container-high" />
                <div className="h-2 w-4/5 rounded-sm bg-surface-container-high" />
              </div>
            </div>
          </div>
        </SidebarInset>
      </Sidebar>
    </SidebarProvider>
  </RecipeCanvas>
);

const MailSectionsRecipe = () => (
  <RecipeCanvas className="h-[280px] @2xl:h-[320px]">
    <SidebarProvider
      containerMode="contained"
      forceViewport="desktop"
      mode="drawer-only"
      behavior="inset"
      defaultExpanded
      defaultActiveId="inbox-personal"
      visualPreset="compact"
      items={[
        {
          id: "mailboxes",
          label: "Mailboxes",
          items: [
            { id: "inbox-personal", label: "Inbox" },
            { id: "priority", label: "Priority" },
            { id: "sent", label: "Sent" },
            { id: "drafts", label: "Drafts" },
          ],
        },
        {
          id: "shared",
          label: "Shared channels",
          items: [
            { id: "design-team", label: "Design team" },
            { id: "engineering-team", label: "Engineering" },
            { id: "support-team", label: "Support" },
          ],
        },
        {
          id: "automation",
          label: "Automation",
          items: [
            { id: "rules", label: "Rules" },
            { id: "templates", label: "Templates" },
          ],
        },
      ]}
    >
      <Sidebar className="h-full w-full">
        <SidebarDrawer>
          <SidebarHeader>
            <div className="text-label-medium text-on-surface-variant">Inbox workspace</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Mailboxes</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarCollapsibleGroup id="mailboxes" label="Primary" icon="inbox" defaultOpen>
                  <SidebarMenuItem><SidebarNavItem id="inbox-personal" label="Inbox" icon="mail" /></SidebarMenuItem>
                  <SidebarMenuItem><SidebarNavItem id="priority" label="Priority" icon="priority_high" /></SidebarMenuItem>
                  <SidebarMenuItem><SidebarNavItem id="sent" label="Sent" icon="send" /></SidebarMenuItem>
                  <SidebarMenuItem><SidebarNavItem id="drafts" label="Drafts" icon="draft" /></SidebarMenuItem>
                </SidebarCollapsibleGroup>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Shared</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarCollapsibleGroup id="shared" label="Team channels" icon="forum">
                  <SidebarNavItem id="design-team" label="Design team" icon="palette" />
                  <SidebarNavItem id="engineering-team" label="Engineering" icon="code" />
                  <SidebarNavItem id="support-team" label="Support" icon="support_agent" />
                </SidebarCollapsibleGroup>
                <SidebarCollapsibleGroup id="automation" label="Automation" icon="bolt">
                  <SidebarNavItem id="rules" label="Rules" icon="rule" />
                  <SidebarNavItem id="templates" label="Templates" icon="description" />
                </SidebarCollapsibleGroup>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </SidebarDrawer>
        <SidebarInset className="overflow-hidden bg-surface-container-lowest">
          <div className="h-full p-3">
            <div className="h-full rounded-sm border border-outline-variant bg-surface p-3">
              <div className="text-label-medium text-on-surface">Conversation pane</div>
              <div className="mt-2 space-y-2">
                <div className="h-8 rounded-sm bg-surface-container-high" />
                <div className="h-8 rounded-sm bg-surface-container-high" />
                <div className="h-8 rounded-sm bg-surface-container-high" />
              </div>
            </div>
          </div>
        </SidebarInset>
      </Sidebar>
    </SidebarProvider>
  </RecipeCanvas>
);

const SettingsRecipe = () => (
  <RecipeCanvas className="h-[270px] @2xl:h-[300px]">
    <SidebarProvider
      containerMode="contained"
      forceViewport="desktop"
      mode="rail-only"
      defaultActiveId="authentication"
      items={[
        { id: "account", label: "Account", icon: "person" },
        { id: "authentication", label: "Authentication", icon: "shield_lock" },
        { id: "access", label: "Access", icon: "manage_accounts" },
        { id: "audit", label: "Audit", icon: "history" },
      ]}
    >
      <Sidebar className="h-full w-full">
        <SidebarRail>
          <SidebarRailItem id="account" label="Account" icon="person" labelVisibility="hidden" tooltip="Account" />
          <SidebarRailItem id="authentication" label="Authentication" icon="shield_lock" labelVisibility="hidden" tooltip="Authentication" />
          <SidebarRailItem id="access" label="Access" icon="manage_accounts" labelVisibility="hidden" tooltip="Access control" />
          <SidebarRailItem id="audit" label="Audit" icon="history" labelVisibility="hidden" tooltip="Audit log" />
        </SidebarRail>
        <SidebarInset className="overflow-hidden bg-surface-container-lowest">
          <div className="h-full p-3">
            <div className="h-full rounded-sm border border-outline-variant bg-surface p-3">
              <div className="text-label-medium text-on-surface">Settings panel content</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="h-12 rounded-sm bg-surface-container-high" />
                <div className="h-12 rounded-sm bg-surface-container-high" />
                <div className="h-12 rounded-sm bg-surface-container-high" />
                <div className="h-12 rounded-sm bg-surface-container-high" />
              </div>
            </div>
          </div>
        </SidebarInset>
      </Sidebar>
    </SidebarProvider>
  </RecipeCanvas>
);

const ProjectWorkspaceRecipe = () => (
  <RecipeCanvas className="h-[300px] @2xl:h-[340px]">
    <SidebarProvider
      containerMode="contained"
      forceViewport="desktop"
      mode="rail-drawer"
      behavior="inset"
      defaultExpanded
      defaultActiveId="board"
      items={[
        {
          id: "projects",
          label: "Projects",
          icon: "folder",
          items: [
            { id: "board", label: "Board" },
            { id: "timeline", label: "Timeline" },
            { id: "backlog", label: "Backlog" },
          ],
        },
        {
          id: "release",
          label: "Release",
          icon: "rocket_launch",
          items: [
            { id: "roadmap", label: "Roadmap" },
            { id: "milestones", label: "Milestones" },
          ],
        },
        {
          id: "resources",
          label: "Resources",
          icon: "book_2",
          items: [
            { id: "docs", label: "Docs" },
            { id: "api", label: "API specs" },
          ],
        },
      ]}
    >
      <Sidebar className="h-full w-full">
        <SidebarRail>
          <SidebarRailItem id="projects" label="Projects" icon="folder" />
          <SidebarRailItem id="release" label="Release" icon="rocket_launch" />
          <SidebarRailItem id="resources" label="Resources" icon="book_2" />
        </SidebarRail>
        <SidebarDrawer>
          <SidebarHeader>
            <div className="text-label-medium text-on-surface-variant">Workspace</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Delivery</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarCollapsibleGroup id="projects" label="Project alpha" icon="folder" defaultOpen>
                  <SidebarNavItem id="board" label="Board" />
                  <SidebarNavItem id="timeline" label="Timeline" />
                  <SidebarNavItem id="backlog" label="Backlog" />
                </SidebarCollapsibleGroup>
                <SidebarCollapsibleGroup id="release" label="Release planning" icon="rocket_launch">
                  <SidebarNavItem id="roadmap" label="Roadmap" />
                  <SidebarNavItem id="milestones" label="Milestones" />
                </SidebarCollapsibleGroup>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Reference</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarCollapsibleGroup id="resources" label="Resources" icon="book_2">
                  <SidebarNavItem id="docs" label="Docs" />
                  <SidebarNavItem id="api" label="API specs" />
                </SidebarCollapsibleGroup>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </SidebarDrawer>
        <SidebarInset className="overflow-hidden bg-surface-container-lowest">
          <div className="h-full p-3">
            <div className="h-full rounded-sm border border-outline-variant bg-surface p-3">
              <div className="text-label-medium text-on-surface">Workspace content</div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="h-24 rounded-sm bg-surface-container-high" />
                <div className="h-24 rounded-sm bg-surface-container-high" />
                <div className="h-24 rounded-sm bg-surface-container-high" />
              </div>
            </div>
          </div>
        </SidebarInset>
      </Sidebar>
    </SidebarProvider>
  </RecipeCanvas>
);

const CompactTabletRecipe = () => (
  <RecipeCanvas className="h-[280px] @2xl:h-[320px]">
    <SidebarProvider
      containerMode="contained"
      forceViewport="tablet"
      mode="rail-drawer"
      behavior="adaptive"
      defaultMobileOpen
      defaultActiveId="mentions"
      triggerVisibility="mobile"
      items={[
        {
          id: "workspace",
          label: "Workspace",
          icon: "inbox",
          items: [
            { id: "mentions", label: "Mentions" },
            { id: "tasks", label: "My tasks" },
          ],
        },
        {
          id: "planning",
          label: "Planning",
          icon: "calendar_month",
          items: [
            { id: "calendar", label: "Calendar" },
            { id: "milestones", label: "Milestones" },
          ],
        },
      ]}
    >
      <Sidebar className="h-full w-full">
        <SidebarRail>
          <SidebarRailItem id="workspace" label="Workspace" icon="inbox" />
          <SidebarRailItem id="planning" label="Planning" icon="calendar_month" />
        </SidebarRail>
        <SidebarDrawer>
          <SidebarHeader>
            <div className="text-label-medium text-on-surface-variant">Tablet nav</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarCollapsibleGroup id="workspace" label="Workspace" icon="inbox" defaultOpen>
                <SidebarNavItem id="mentions" label="Mentions" icon="alternate_email" />
                <SidebarNavItem id="tasks" label="My tasks" icon="checklist" />
              </SidebarCollapsibleGroup>
              <SidebarCollapsibleGroup id="planning" label="Planning" icon="calendar_month">
                <SidebarNavItem id="calendar" label="Calendar" icon="event" />
                <SidebarNavItem id="milestones" label="Milestones" icon="flag" />
              </SidebarCollapsibleGroup>
            </SidebarMenu>
          </SidebarContent>
        </SidebarDrawer>
        <SidebarBackdrop />
        <SidebarInset className="overflow-hidden bg-surface-container-lowest">
          <div className="flex items-center gap-2 border-b border-outline-variant px-3 py-2">
            <SidebarTrigger visibility="mobile" />
            <div className="text-label-large text-on-surface">Mentions</div>
          </div>
          <div className="space-y-2 p-3">
            <div className="rounded-sm border border-outline-variant bg-surface p-2">
              <div className="text-label-medium text-on-surface">Tablet content area</div>
            </div>
            <div className="h-10 rounded-sm bg-surface-container-high" />
            <div className="h-10 rounded-sm bg-surface-container-high" />
            <div className="h-10 rounded-sm bg-surface-container-high" />
          </div>
        </SidebarInset>
      </Sidebar>
    </SidebarProvider>
  </RecipeCanvas>
);

const RightContextRecipe = () => (
  <RecipeCanvas className="h-[290px] @2xl:h-[330px]">
    <SidebarProvider
      containerMode="contained"
      forceViewport="desktop"
      side="right"
      mode="drawer-only"
      behavior="inset"
      defaultExpanded
      visualPreset="elevated"
      defaultActiveId="timeline"
      items={[
        {
          id: "issue",
          label: "Issue details",
          icon: "bug_report",
          items: [
            { id: "timeline", label: "Timeline" },
            { id: "activity", label: "Activity" },
            { id: "files", label: "Attachments" },
          ],
        },
        {
          id: "people",
          label: "People",
          icon: "group",
          items: [
            { id: "assignees", label: "Assignees" },
            { id: "watchers", label: "Watchers" },
          ],
        },
      ]}
    >
      <Sidebar className="h-full w-full">
        <SidebarDrawer>
          <SidebarHeader>
            <div className="text-label-medium text-on-surface-variant">Context</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Issue</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarCollapsibleGroup id="issue" label="Issue details" icon="bug_report" defaultOpen>
                  <SidebarNavItem id="timeline" label="Timeline" icon="schedule" />
                  <SidebarNavItem id="activity" label="Activity" icon="history" />
                  <SidebarNavItem id="files" label="Attachments" icon="attach_file" />
                </SidebarCollapsibleGroup>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Collaboration</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarCollapsibleGroup id="people" label="Participants" icon="group">
                  <SidebarNavItem id="assignees" label="Assignees" icon="person" />
                  <SidebarNavItem id="watchers" label="Watchers" icon="visibility" />
                </SidebarCollapsibleGroup>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </SidebarDrawer>
        <SidebarInset className="overflow-hidden bg-surface-container-lowest">
          <div className="h-full p-3">
            <div className="h-full rounded-sm border border-outline-variant bg-surface p-3">
              <div className="text-label-medium text-on-surface">Context target pane</div>
              <div className="mt-2 space-y-2">
                <div className="h-2 w-2/3 rounded-sm bg-surface-container-high" />
                <div className="h-2 w-1/2 rounded-sm bg-surface-container-high" />
                <div className="h-2 w-3/4 rounded-sm bg-surface-container-high" />
              </div>
            </div>
          </div>
        </SidebarInset>
      </Sidebar>
    </SidebarProvider>
  </RecipeCanvas>
);

export const sidebarDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: "sidebar",
  name: "Sidebar",
  description:
    "A comprehensive app-shell navigation system with a collapsible rail, coordinated drawer, backdrop, and content inset. Use it when navigation behavior has to manage the whole application layout.",
  category: "navigation",
  status: "stable",
  icon: "dock_to_left",

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: "@unisane/ui",
  exports: [
    "Sidebar",
    "SidebarProvider",
    "SidebarRail",
    "SidebarRailItem",
    "SidebarDrawer",
    "SidebarHeader",
    "SidebarFooter",
    "SidebarContent",
    "SidebarGroup",
    "SidebarGroupLabel",
    "SidebarMenu",
    "SidebarMenuItem",
    "SidebarNavItem",
    "SidebarMenuButton",
    "SidebarTrigger",
    "SidebarBackdrop",
    "SidebarInset",
    "SidebarCollapsibleGroup",
    "useSidebar",
  ],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <SidebarHeroVisual />,
  heroPreview: {
    minHeight: "xl",
  },
  examplesPreview: {
    tone: "surfaceContainerLow",
    minHeight: "xl",
    padding: "none",
    align: "start",
    justify: "start",
  },
  examples: [
    {
      id: "admin-dashboard-sidebar",
      title: "Admin dashboard sidebar",
      description: "Rail + drawer with inset content for dense operational dashboards.",
      component: <AdminDashboardRecipe />,
    },
    {
      id: "mail-sections-sidebar",
      title: "Mail sidebar with sections",
      description: "Drawer-only pattern for mailbox-heavy navigation.",
      component: <MailSectionsRecipe />,
    },
    {
      id: "settings-sidebar",
      title: "Settings sidebar",
      description: "Rail-only pattern when compact settings navigation is enough.",
      component: <SettingsRecipe />,
    },
    {
      id: "project-workspace-sidebar",
      title: "Project workspace sidebar",
      description: "Nested groups using collapsible items from the canonical sidebar APIs.",
      component: <ProjectWorkspaceRecipe />,
    },
    {
      id: "compact-tablet-sidebar",
      title: "Compact tablet sidebar",
      description: "Adaptive overlay behavior with explicit mobile trigger visibility.",
      component: <CompactTabletRecipe />,
    },
    {
      id: "right-context-sidebar",
      title: "Right-side contextual sidebar",
      description: "Right-anchored contextual panel using the same provider contract.",
      component: <RightContextRecipe />,
    },
  ],
  docsLayout: {
    hideChoosing: true,
    hidePlacement: true,
  },

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      "Choose between a full app-shell sidebar and simpler standalone navigation widgets based on how much layout behavior you need.",
    columns: {
      emphasis: "Pattern",
      component: "Preview",
      rationale: "When to use",
      examples: "Common uses",
    },
    rows: [
      {
        emphasis: "Rail + Drawer",
        component: <SidebarSystemPreview />,
        rationale: "App-shell navigation that coordinates rail, drawer, and content layout together.",
        examples: "Admin dashboards, Complex apps",
      },
      {
        emphasis: "Rail Only",
        component: <SidebarRailPreview />,
        rationale: "Use NavigationRail instead when you only need a standalone compact nav surface.",
        examples: "Simple apps, Limited nav items",
      },
      {
        emphasis: "Mobile Drawer",
        component: <SidebarMobileDrawerPreview />,
        rationale: "Use NavigationDrawer instead when you only need a standalone drawer surface.",
        examples: "Mobile views, Tablet compact",
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      "Sidebar adapts to screen size automatically. Rail shows on expanded screens, overlay drawer on mobile/tablet.",
    previewDefaults: {
      tone: "surfaceContainerLow",
      minHeight: "xl",
      padding: "none",
      align: "start",
      justify: "start",
    },
    examples: [
      {
        title: "Rail navigation",
        visual: <RailOnlyExample />,
        caption: "Icon-based rail with labels, badges, and active states",
      },
      {
        title: "Expanded with drawer",
        visual: <ExpandedSidebarExample />,
        caption: "Rail plus drawer showing full navigation menu",
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: "items",
      type: "NavigationItem[]",
      description: "Navigation items configuration for the SidebarProvider.",
    },
    {
      name: "activeId",
      type: "string | null",
      description: "Controlled active item ID.",
    },
    {
      name: "defaultActiveId",
      type: "string | null",
      default: "null",
      description: "Initially active navigation item ID.",
    },
    {
      name: "expanded",
      type: "boolean",
      description: "Controlled desktop expanded state.",
    },
    {
      name: "defaultExpanded",
      type: "boolean",
      default: "false",
      description: "Whether drawer is expanded by default on desktop.",
    },
    {
      name: "mobileOpen",
      type: "boolean",
      description: "Controlled overlay drawer open state.",
    },
    {
      name: "defaultMobileOpen",
      type: "boolean",
      default: "false",
      description: "Initial overlay drawer open state.",
    },
    {
      name: "side",
      type: '"left" | "right"',
      default: '"left"',
      description: "Places the sidebar system on the left or right edge.",
    },
    {
      name: "mode",
      type: '"rail-drawer" | "drawer-only" | "rail-only"',
      default: '"rail-drawer"',
      description: "Chooses which sidebar surfaces are rendered.",
    },
    {
      name: "behavior",
      type: '"overlay" | "inset" | "adaptive"',
      default: '"adaptive"',
      description: "Canonical behaviors are overlay and inset. adaptive is a compatibility alias that maps by viewport.",
    },
    {
      name: "containerMode",
      type: '"viewport" | "contained"',
      default: '"viewport"',
      description: "Use contained mode for embedded canvases and previews.",
    },
    {
      name: "triggerVisibility",
      type: '"auto" | "always" | "desktop" | "mobile" | "hidden"',
      default: '"auto"',
      description: "Default visibility policy for SidebarTrigger.",
    },
    {
      name: "visualPreset",
      type: '"default" | "compact" | "elevated" | "minimal"',
      default: '"default"',
      description: "Applies token-driven sidebar styling presets without custom CSS.",
    },
    {
      name: "tokens",
      type: "Partial<SidebarVisualTokens>",
      description: "Optional CSS-token overrides for rail/drawer colors, radius, shadow, and motion.",
    },
    {
      name: "persist",
      type: "boolean",
      default: "false",
      description: "Persist sidebar state to localStorage.",
    },
    {
      name: "storageKey",
      type: "string",
      default: '"unisane-sidebar"',
      description: "Key for localStorage persistence.",
    },
    {
      name: "hoverDelay",
      type: "number",
      default: "150",
      description: "Delay before showing drawer on hover (ms).",
    },
    {
      name: "exitDelay",
      type: "number",
      default: "300",
      description: "Delay before hiding drawer after mouse leaves (ms).",
    },
    {
      name: "railWidth",
      type: "number",
      default: "96",
      description: "Width of the rail in pixels.",
    },
    {
      name: "drawerWidth",
      type: "number",
      default: "220",
      description: "Width of the drawer in pixels.",
    },
    {
      name: "mobileDrawerWidth",
      type: "number",
      default: "280",
      description: "Width of the drawer on mobile in pixels.",
    },
    {
      name: "mobileInsetOffset",
      type: "number",
      default: "64",
      description: "Top offset applied to SidebarInset while in overlay mode.",
    },
    {
      name: "onActiveIdChange",
      type: "(id: string | null) => void",
      description: "Callback when active item changes.",
    },
    {
      name: "onExpandedChange",
      type: "(expanded: boolean) => void",
      description: "Callback when drawer expanded state changes.",
    },
    {
      name: "onMobileOpenChange",
      type: "(open: boolean) => void",
      description: "Callback when overlay drawer open state changes.",
    },
  ],

  // ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────
  subComponents: [
    {
      name: "SidebarProvider",
      description: "Context provider that manages sidebar state. Wrap your app layout with this.",
      props: [
        { name: "children", type: "ReactNode", required: true, description: "App content." },
        { name: "items", type: "NavigationItem[]", description: "Navigation items for state management." },
        { name: "behavior", type: '"overlay" | "inset" | "adaptive"', description: "Selects overlay/inset behavior. adaptive maps by viewport." },
        { name: "containerMode", type: '"viewport" | "contained"', description: "Use contained in embedded canvases/previews." },
        { name: "visualPreset", type: '"default" | "compact" | "elevated" | "minimal"', description: "Applies token-driven style preset." },
      ],
    },
    {
      name: "SidebarRail",
      description: "Vertical icon navigation bar on the left side.",
      props: [
        { name: "children", type: "ReactNode", description: "Rail items." },
      ],
    },
    {
      name: "SidebarRailItem",
      description: "Individual navigation item in the rail.",
      props: [
        { name: "id", type: "string", required: true, description: "Unique identifier." },
        { name: "label", type: "string", required: true, description: "Text label below icon." },
        { name: "icon", type: "ReactNode | string", required: true, description: "Icon to display." },
        { name: "activeIcon", type: "ReactNode | string", description: "Icon when active." },
        { name: "badge", type: "string | number", description: "Badge content." },
        { name: "disabled", type: "boolean", description: "Disable the item." },
        { name: "href", type: "string", description: "Link URL." },
        { name: "asChild", type: "boolean", description: "Render as child element." },
        { name: "childIds", type: "string[]", description: "IDs of child items for active state." },
      ],
    },
    {
      name: "SidebarDrawer",
      description: "Expandable navigation panel that slides out from the rail.",
      props: [
        { name: "children", type: "ReactNode", description: "Drawer content." },
      ],
    },
    {
      name: "SidebarNavItem",
      description: "Props-based navigation item within the drawer menu.",
      props: [
        { name: "id", type: "string", description: "Unique identifier for state management." },
        { name: "label", type: "string", required: true, description: "Item text." },
        { name: "icon", type: "ReactNode | string", description: "Leading icon." },
        { name: "activeIcon", type: "ReactNode | string", description: "Optional active icon." },
        { name: "badge", type: "string | number | ReactNode", description: "Optional trailing badge." },
        { name: "active", type: "boolean", description: "Controlled active state." },
        { name: "disabled", type: "boolean", description: "Disable the item." },
        { name: "href", type: "string", description: "Link URL." },
        { name: "onClick", type: "() => void", description: "Click handler." },
        { name: "asChild", type: "boolean", description: "Render as child element." },
      ],
    },
    {
      name: "SidebarCollapsibleGroup",
      description: "Collapsible group of menu items with expand/collapse behavior.",
      props: [
        { name: "id", type: "string", required: true, description: "Unique group identifier." },
        { name: "label", type: "string", required: true, description: "Group heading text." },
        { name: "icon", type: "ReactNode | string", description: "Leading icon." },
        { name: "defaultOpen", type: "boolean", description: "Initially expanded." },
        { name: "childIds", type: "string[]", description: "IDs of child items." },
      ],
    },
    {
      name: "SidebarInset",
      description: "Main content area that adjusts margin based on sidebar state.",
      props: [
        { name: "children", type: "ReactNode", required: true, description: "Page content." },
      ],
    },
    {
      name: "SidebarTrigger",
      description: "Button to toggle sidebar open/closed state.",
      props: [
        { name: "children", type: "ReactNode", description: "Custom trigger content." },
        { name: "visibility", type: '"auto" | "always" | "desktop" | "mobile" | "hidden"', description: "Per-trigger visibility override." },
      ],
    },
    {
      name: "SidebarBackdrop",
      description: "Overlay backdrop for mobile drawer.",
      props: [],
    },
    {
      name: "useSidebar",
      description: "Hook to access sidebar state and methods.",
      props: [],
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "Rail uses nav element with aria-label.",
      "Active items marked with aria-current=\"page\".",
      "Disabled items have aria-disabled attribute.",
      "Drawer hidden state communicated via aria-hidden.",
      "Collapsible groups use aria-expanded and aria-controls.",
    ],
    keyboard: [
      { key: "Tab", description: "Navigate between rail items and menu items" },
      { key: "Enter/Space", description: "Activate focused item" },
      { key: "Escape", description: "Close overlay drawer" },
    ],
    focus: [
      "Focus visible ring on all interactive items.",
      "Focus is trapped while overlay drawer is open.",
      "Drawer respects prefers-reduced-motion.",
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: "Wrap your app with SidebarProvider and compose the sidebar structure.",
    code: `import {
  Sidebar,
  SidebarProvider,
  SidebarRail,
  SidebarRailItem,
  SidebarDrawer,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarNavItem,
  SidebarTrigger,
  SidebarBackdrop,
  SidebarInset,
} from "@unisane/ui";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { id: "home", label: "Home", icon: "home", href: "/" },
  { id: "inbox", label: "Inbox", icon: "inbox", href: "/inbox" },
  { id: "settings", label: "Settings", icon: "settings", href: "/settings" },
];

function AppLayout({ children }) {
  const pathname = usePathname();
  const activeId = navItems.find(item => item.href === pathname)?.id || null;

  return (
    <SidebarProvider defaultActiveId={activeId} persist behavior="adaptive" visualPreset="default">
      <Sidebar>
        <SidebarRail>
          {navItems.map((item) => (
            <SidebarRailItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </SidebarRailItem>
          ))}
        </SidebarRail>

        <SidebarDrawer>
          <SidebarHeader>
            <h2 className="text-title-medium">My App</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  href={item.href}
                  asChild
                >
                  <Link href={item.href}>{item.label}</Link>
                </SidebarNavItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarDrawer>

        <SidebarBackdrop />
      </Sidebar>

      <SidebarInset>
        <header className="flex items-center gap-2 border-b border-outline-variant px-4 py-3">
          <SidebarTrigger visibility="mobile" />
          <h1 className="text-title-medium">Dashboard</h1>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: "navigation-drawer",
      reason: "Use for standalone drawer navigation without app-shell state orchestration.",
    },
    {
      slug: "navigation-rail",
      reason: "Use for standalone rail navigation without coordinated drawer behavior.",
    },
    {
      slug: "navigation-bar",
      reason: "Bottom navigation for mobile primary destinations.",
    },
  ],
};
