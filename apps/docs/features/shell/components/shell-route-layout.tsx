'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { DocsShell } from './docs-shell';

export function ShellRouteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTestFixture = pathname.startsWith('/test-fixtures/');
  const isHome = pathname === '/';
  const isBlocks = pathname.startsWith('/docs/blocks');

  if (isTestFixture) {
    return children;
  }

  return (
    <DocsShell
      showHeader={!isHome}
      contentWidth={isHome ? 'fluid' : 'constrained'}
      contentInset={isHome || isBlocks ? 'none' : 'normal'}
    >
      {children}
    </DocsShell>
  );
}
