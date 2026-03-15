"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  useSidebar,
  SidebarRail,
  SidebarRailItem,
  SidebarDrawer,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarNavItem,
  SidebarCollapsibleGroup,
  SidebarBackdrop,
  SidebarInset,
  TopAppBar,
  IconButton,
} from "@unisane/ui";
import { cn } from "@unisane/ui";
import type { SidebarViewport } from "@unisane/ui";
import { DOCS_NAVIGATION, getActiveNavigationId } from "@/lib/docs/runtime/navigation";
import { UnisaneLogo, UnisaneWordmark } from "@/features/branding";
import { DOCS_SIDEBAR_EXPANDED_COOKIE } from "../lib/sidebar-persistence";
import { AppHeader } from "./app-header";
import { ThemeSettings } from "./theme-settings";
import type { NavigationItem } from "@/lib/docs/runtime/navigation";

interface DocsShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  contentWidth?: "constrained" | "fluid";
  contentInset?: "normal" | "none";
  initialViewport?: SidebarViewport;
  initialExpanded?: boolean;
}

function collectNavigationIds(items?: NavigationItem[]): string[] {
  if (!items || items.length === 0) return [];

  return items.flatMap((item) => [
    item.id,
    ...collectNavigationIds(item.items),
  ]);
}

function DocsShellContent({
  children,
  showHeader = true,
  contentWidth = "constrained",
  contentInset = "normal",
}: DocsShellProps) {
  const {
    activeId,
    effectiveItem,
    mobileOpen,
    toggleMobile,
    expanded,
    toggleExpanded,
  } = useSidebar();

  const renderNavigationTree = (items: NavigationItem[]) =>
    items.map((item) => {
      const hasChildren = !!item.items?.length;

      if (hasChildren) {
        return (
          <SidebarCollapsibleGroup
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            childIds={collectNavigationIds(item.items)}
            defaultOpen={activeId === item.id}
          >
            <SidebarMenu>{renderNavigationTree(item.items ?? [])}</SidebarMenu>
          </SidebarCollapsibleGroup>
        );
      }

      return (
        <SidebarNavItem key={item.id} id={item.id} icon={item.icon} label={item.label} asChild>
          <Link href={item.href || "#"} />
        </SidebarNavItem>
      );
    });

  return (
    <div className="isolate flex h-screen w-full overflow-hidden bg-surface">
      {showHeader ? (
        <TopAppBar
          className="fixed top-0 left-0 right-0 z-50 flex expanded:hidden"
          title={
            <span className="inline-flex items-center gap-1.5 text-on-surface">
              <UnisaneLogo size={24} />
              <UnisaneWordmark size="sm" />
            </span>
          }
          variant="small"
          navigationIcon={
            <IconButton
              variant="standard"
              aria-label="Open menu"
              onClick={toggleMobile}
            >
              <span className="material-symbols-outlined">menu</span>
            </IconButton>
          }
          actions={
            <>
              <IconButton variant="standard" aria-label="Search">
                <span className="material-symbols-outlined">search</span>
              </IconButton>
              <a
                href="https://github.com/anthropics/unisane-ui"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
              >
                <IconButton variant="standard" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </IconButton>
              </a>
            </>
          }
        />
      ) : null}

      <Sidebar
        className="h-full w-full"
      >
        <SidebarRail>
          <div className="flex w-full flex-col items-center pt-3 pb-2">
            <IconButton
              variant="standard"
              aria-label={expanded ? "Close menu" : "Open menu"}
              onClick={toggleExpanded}
              className="h-10 w-14"
            >
              <span className="material-symbols-outlined">
                {expanded ? "menu_open" : "menu"}
              </span>
            </IconButton>
          </div>

          <div className="flex w-full flex-1 flex-col items-center gap-3 pt-2">
            {DOCS_NAVIGATION.map((item) => (
              <SidebarRailItem
                key={item.id}
                id={item.id}
                label={item.label}
                icon={item.icon || "circle"}
                childIds={collectNavigationIds(item.items)}
                asChild
              >
                <Link href={item.href || "#"} />
              </SidebarRailItem>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 pb-4">
            <ThemeSettings />
          </div>
        </SidebarRail>

        <SidebarDrawer>
          {mobileOpen ? (
            <SidebarContent className="pb-24">
              <SidebarGroupLabel>Unisane UI</SidebarGroupLabel>
              <SidebarMenu>
                {renderNavigationTree(DOCS_NAVIGATION)}
              </SidebarMenu>
            </SidebarContent>
          ) : effectiveItem && effectiveItem.items && effectiveItem.items.length > 0 ? (
            <SidebarContent
              className="animate-content-enter pt-4 pb-20"
              key={effectiveItem.id}
            >
              <SidebarGroupLabel>{effectiveItem.label}</SidebarGroupLabel>
              <SidebarMenu>{renderNavigationTree(effectiveItem.items)}</SidebarMenu>
            </SidebarContent>
          ) : (
            <SidebarContent className="animate-content-enter pt-4">
              <p className="px-4 text-body-medium text-on-surface-variant">
                Select a category to view items.
              </p>
            </SidebarContent>
          )}
        </SidebarDrawer>

        <SidebarInset>
          {showHeader ? <AppHeader /> : null}

          <div
            className={cn(
              "flex-1 @container",
              contentWidth === "constrained" && "container mx-auto max-w-[1600px]",
              contentWidth === "fluid" && "w-full",
              contentInset === "normal" &&
                (contentWidth === "constrained"
                  ? "px-4 py-4 medium:px-6 expanded:px-12 expanded:py-6"
                  : "px-4 py-4 medium:px-6 expanded:px-8 expanded:py-6"),
              contentInset === "none" && "p-0"
            )}
          >
            {children}
          </div>
        </SidebarInset>

        <SidebarBackdrop />
      </Sidebar>
    </div>
  );
}

export function DocsShell({
  children,
  showHeader = true,
  contentWidth = "constrained",
  contentInset = "normal",
  initialViewport,
  initialExpanded = false,
}: DocsShellProps) {
  const pathname = usePathname();
  const defaultActiveId = getActiveNavigationId(pathname);

  return (
    <SidebarProvider
      items={DOCS_NAVIGATION}
      defaultActiveId={defaultActiveId}
      defaultExpanded={initialExpanded}
      initialViewport={initialViewport}
      railWidth={96}
      drawerWidth={220}
      persist={false}
      onExpandedChange={(expanded) => {
        document.cookie = `${DOCS_SIDEBAR_EXPANDED_COOKIE}=${expanded ? "true" : "false"}; path=/; max-age=31536000; samesite=lax`;
      }}
    >
      <DocsShellContent
        showHeader={showHeader}
        contentWidth={contentWidth}
        contentInset={contentInset}
      >
        {children}
      </DocsShellContent>
    </SidebarProvider>
  );
}
