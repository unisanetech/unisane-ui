"use client";

import React from "react";
import { cn } from "@/lib/utils";

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
        "relative isolate flex h-screen min-h-0 w-full flex-col overflow-hidden bg-surface text-on-surface",
        className
      )}
    >
      {mobileNavigation}

      {topBar && <div className="z-30 shrink-0 relative">{topBar}</div>}

      <div className="relative z-0 flex min-h-0 flex-1 overflow-hidden">
        {navigation && (
          <div className="z-40 shrink-0 relative hidden medium:flex">
            {navigation}
          </div>
        )}

        {secondaryNavigation && (
          <div className="z-10 shrink-0 relative hidden expanded:block">
            {secondaryNavigation}
          </div>
        )}

        <main
          ref={mainRef as React.RefObject<HTMLElement>}
          className={cn(
            "relative z-0 flex min-h-0 min-w-0 flex-1 flex-col bg-surface",
            disableScroll ? "overflow-hidden" : "overflow-y-auto scroll-smooth"
          )}
        >
          <div
            className={cn(
              "flex-1",
              disableScroll ? "overflow-hidden flex flex-col" : ""
            )}
          >
            {children}
          </div>

          {fab && (
            <div
              className={cn(
                "z-40 pointer-events-auto",
                "fixed bottom-6 right-4 large:bottom-6 large:right-6",
                disableScroll
                  ? "absolute"
                  : "medium:sticky medium:float-right medium:mr-6 medium:mb-6"
              )}
            >
              {fab}
            </div>
          )}
        </main>
      </div>

      {bottomBar && <div className="z-30 shrink-0 relative">{bottomBar}</div>}
    </div>
  );
};
