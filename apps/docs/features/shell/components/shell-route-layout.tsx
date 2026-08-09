'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { DocsShell } from './docs-shell';
import type { SidebarViewport } from '@unisane/ui/sidebar';

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

  return (
    <DocsShell
      initialViewport={initialViewport}
      initialExpanded={initialExpanded}
      showHeader={!isHome}
      contentWidth={isHome ? 'fluid' : 'constrained'}
      contentInset={isHome || isBlocks ? 'none' : 'normal'}
    >
      {children}
    </DocsShell>
  );
}
