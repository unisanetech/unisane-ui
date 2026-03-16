'use client';

import type { ReactNode } from 'react';
import { cn } from '@unisane/ui';

interface BlocksPageLayoutProps {
  hero?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}

export function BlocksPageLayout({
  hero,
  children,
  contentClassName,
}: BlocksPageLayoutProps) {
  return (
    <div className="w-full overflow-x-clip pb-14 @3xl:pb-24">
      {hero ? (
        <section className="px-1.5 medium:px-2 expanded:px-3">
          {hero}
        </section>
      ) : null}
      <div
        className={cn(
          'px-4 py-8 medium:px-6 expanded:px-12 @3xl:py-10',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
