'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface AppLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  topBar?: React.ReactNode;
  bottomBar?: React.ReactNode;
  fab?: React.ReactNode;
  navigation?: React.ReactNode;
  secondaryNavigation?: React.ReactNode;
  mobileNavigation?: React.ReactNode;
  children: React.ReactNode;
  mainRef?: React.RefObject<HTMLElement | null>;
  disableScroll?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  topBar,
  bottomBar,
  fab,
  navigation,
  secondaryNavigation,
  mobileNavigation,
  children,
  className,
  mainRef,
  disableScroll = false,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        'bg-surface text-on-surface relative isolate flex h-screen min-h-0 w-full flex-col overflow-hidden',
        className,
      )}
    >
      {mobileNavigation}

      {topBar && <div className="relative z-30 shrink-0">{topBar}</div>}

      <div className="relative z-0 flex min-h-0 flex-1 overflow-hidden">
        {navigation && (
          <div className="medium:flex relative z-40 hidden shrink-0">{navigation}</div>
        )}

        {secondaryNavigation && (
          <div className="expanded:block relative z-10 hidden shrink-0">{secondaryNavigation}</div>
        )}

        <main
          ref={mainRef as React.RefObject<HTMLElement>}
          className={cn(
            'bg-surface relative z-0 flex min-h-0 min-w-0 flex-1 flex-col',
            disableScroll ? 'overflow-hidden' : 'overflow-y-auto scroll-smooth',
          )}
        >
          <div className={cn('flex-1', disableScroll ? 'flex flex-col overflow-hidden' : '')}>
            {children}
          </div>

          {fab && (
            <div
              className={cn(
                'pointer-events-auto z-40',
                'large:bottom-6 large:right-6 fixed right-4 bottom-6',
                disableScroll
                  ? 'absolute'
                  : 'medium:sticky medium:float-right medium:mr-6 medium:mb-6',
              )}
            >
              {fab}
            </div>
          )}
        </main>
      </div>

      {bottomBar && <div className="relative z-30 shrink-0">{bottomBar}</div>}
    </div>
  );
};
