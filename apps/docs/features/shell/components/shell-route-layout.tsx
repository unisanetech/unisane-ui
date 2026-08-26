'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import type { SidebarViewport } from '@unisane/ui/sidebar';
import { DocsShell } from './docs-shell';

export function ShellRouteLayout({
  children,
  initialViewport,
  initialExpanded,
}: {
  children: React.ReactNode;
  initialViewport?: SidebarViewport;
  initialExpanded?: boolean;
}) {
  const pathname = usePathname();
  const isTestFixture = pathname.startsWith('/test-fixtures/');
  const isHome = pathname === '/';
  const isBlocks = pathname.startsWith('/docs/blocks');

  if (isTestFixture) {
    return children;
  }

  if (isHome) {
    return <>{children}</>;
  }

  return (
    <DocsShell
      initialViewport={initialViewport}
      initialExpanded={initialExpanded}
      showHeader
      contentWidth="constrained"
      contentInset={isBlocks ? 'none' : 'normal'}
    >
      {children}
    </DocsShell>
  );
}
