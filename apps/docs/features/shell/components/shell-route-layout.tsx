"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { DocsShell } from "./docs-shell";
import type { SidebarViewport } from "@unisane/ui";

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
  const isHome = pathname === "/";

  return (
    <DocsShell
      initialViewport={initialViewport}
      initialExpanded={initialExpanded}
      showHeader={!isHome}
      contentWidth={isHome ? "fluid" : "constrained"}
      contentInset={isHome ? "none" : "normal"}
    >
      {children}
    </DocsShell>
  );
}
