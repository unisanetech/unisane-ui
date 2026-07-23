'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TopAppBar } from '@unisane/ui/top-app-bar';
import { IconButton } from '@unisane/ui/icon-button';
import {
  SidebarProvider,
  Sidebar,
  useSidebar,
  SidebarRail,
  SidebarDrawer,
  SidebarInset,
} from '@unisane/ui/sidebar';
import { cn } from '@unisane/ui/utils';
import type { SidebarViewport } from '@unisane/ui/sidebar';
import { DOCS_NAVIGATION, getActiveNavigationId } from '@/lib/docs/runtime/navigation';
import { UnisaneLogo, UnisaneWordmark } from '@/features/branding';
import { DOCS_SIDEBAR_EXPANDED_COOKIE } from '../lib/sidebar-persistence';
import { AppHeader } from './app-header';
import { AppearanceSettings } from './appearance-settings';

interface DocsShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  contentWidth?: 'constrained' | 'fluid';
  contentInset?: 'normal' | 'none';
  initialViewport?: SidebarViewport;
  initialExpanded?: boolean;
}

function DocsShellContent({
  children,
  showHeader = true,
  contentWidth = 'constrained',
  contentInset = 'normal',
}: DocsShellProps) {
  const { toggleMobile, expanded, toggleExpanded } = useSidebar();

  return (
    <div className="bg-surface isolate flex h-screen w-full overflow-hidden">
      {showHeader ? (
        <TopAppBar
          className="expanded:hidden fixed top-0 right-0 left-0 z-50 flex"
          title={
            <span className="text-on-surface inline-flex items-center gap-1.5">
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
              icon={<span className="material-symbols-outlined">menu</span>}
            />
          }
          actions={
            <>
              <IconButton
                variant="standard"
                aria-label="Search"
                icon={<span className="material-symbols-outlined">search</span>}
              />
              <a
                href="https://github.com/anthropics/unisane-ui"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
              >
                <IconButton
                  variant="standard"
                  aria-label="GitHub"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  }
                />
              </a>
            </>
          }
        />
      ) : null}

      <Sidebar className="h-full w-full">
        <SidebarRail
          aria-label="Documentation navigation"
          header={
            <IconButton
              variant="standard"
              aria-label={expanded ? 'Close menu' : 'Open menu'}
              onClick={toggleExpanded}
              className="h-10 w-14"
              icon={
                <span className="material-symbols-outlined">{expanded ? 'menu_open' : 'menu'}</span>
              }
            />
          }
          footer={<AppearanceSettings />}
        />

        <SidebarDrawer
          aria-label="Documentation navigation"
          overlayHeadline="Unisane UI"
          emptyContent={
            <p className="text-body-medium text-on-surface-variant px-4">
              Select a category to view items.
            </p>
          }
        />

        <SidebarInset>
          {showHeader ? <AppHeader /> : null}

          <div
            className={cn(
              '@container flex-1',
              contentWidth === 'constrained' && 'container mx-auto max-w-[1600px]',
              contentWidth === 'fluid' && 'w-full',
              contentInset === 'normal' &&
                (contentWidth === 'constrained'
                  ? 'medium:px-6 expanded:px-12 expanded:py-6 px-4 py-4'
                  : 'medium:px-6 expanded:px-8 expanded:py-6 px-4 py-4'),
              contentInset === 'none' && 'p-0',
            )}
          >
            {children}
          </div>
        </SidebarInset>
      </Sidebar>
    </div>
  );
}

export function DocsShell({
  children,
  showHeader = true,
  contentWidth = 'constrained',
  contentInset = 'normal',
  initialViewport,
  initialExpanded = false,
}: DocsShellProps) {
  const pathname = usePathname();
  const activeNavigationId = getActiveNavigationId(pathname);

  return (
    <SidebarProvider
      items={DOCS_NAVIGATION}
      value={activeNavigationId}
      defaultExpanded={initialExpanded}
      initialViewport={initialViewport}
      railWidth={96}
      drawerWidth={220}
      persist={false}
      onExpandedChange={(expanded) => {
        document.cookie = `${DOCS_SIDEBAR_EXPANDED_COOKIE}=${expanded ? 'true' : 'false'}; path=/; max-age=31536000; samesite=lax`;
      }}
      renderLink={(_item, props) => <Link {...props} />}
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
