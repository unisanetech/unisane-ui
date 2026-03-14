import "./globals.css";
// Material Symbols - using lighter font-400 package (456KB vs 3.7MB full package)
// This provides offline capability while keeping bundle size reasonable
import "@material-symbols/font-400/outlined.css";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Script from "next/script";
import { Inter, Sora } from "next/font/google";
import { ThemeProvider, Toaster } from "@unisane/ui";
import type { SidebarViewport } from "@unisane/ui";
import { ShellRouteLayout, ThemeCookieSync } from "@/features/shell";
import { DOCS_SIDEBAR_EXPANDED_COOKIE } from "@/features/shell/lib/sidebar-persistence";
import {
  DOCS_THEME_COOKIE,
  getThemeBootstrapScript,
  resolveDocsThemeState,
} from "@/features/shell/lib/theme-persistence";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Unisane UI - React Component Library",
  description:
    "Production-ready React components with sophisticated theming, accessibility, and exceptional developer experience.",
};

const SIDEBAR_BREAKPOINTS = {
  mobile: 600,
  desktop: 840,
} as const;

function resolveViewportFromWidth(width: number): SidebarViewport {
  if (width < SIDEBAR_BREAKPOINTS.mobile) {
    return "mobile";
  }

  if (width >= SIDEBAR_BREAKPOINTS.desktop) {
    return "desktop";
  }

  return "tablet";
}

function resolveInitialViewport(
  requestHeaders: Headers,
): SidebarViewport {
  const widthHeader =
    requestHeaders.get("sec-ch-viewport-width") ??
    requestHeaders.get("viewport-width");

  if (widthHeader) {
    const parsedWidth = Number.parseInt(widthHeader, 10);
    if (Number.isFinite(parsedWidth)) {
      return resolveViewportFromWidth(parsedWidth);
    }
  }

  const userAgent = requestHeaders.get("user-agent") ?? "";

  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent)) {
    return "tablet";
  }

  if (/Mobi|Android.+Mobile|iPhone|iPod|Windows Phone/i.test(userAgent)) {
    return "mobile";
  }

  return "desktop";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const cookieStore = await cookies();
  const initialViewport = resolveInitialViewport(requestHeaders);
  const initialExpanded =
    cookieStore.get(DOCS_SIDEBAR_EXPANDED_COOKIE)?.value === "true";
  const initialTheme = resolveDocsThemeState(
    cookieStore.get(DOCS_THEME_COOKIE)?.value,
  );
  const rootThemeClass =
    initialTheme.theme === "dark"
      ? "dark"
      : initialTheme.theme === "light"
        ? ""
        : undefined;
  const rootColorScheme =
    initialTheme.theme === "system" ? undefined : initialTheme.theme;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable}${rootThemeClass ? ` ${rootThemeClass}` : ""}`}
      suppressHydrationWarning
      data-density={initialTheme.density}
      data-radius={initialTheme.radius}
      data-action-shape={initialTheme.actionShape}
      data-scheme={initialTheme.scheme}
      data-contrast={initialTheme.contrast}
      data-elevation={initialTheme.elevation}
      data-color-theme={initialTheme.colorTheme}
      data-theme-mode={initialTheme.theme}
      style={rootColorScheme ? { colorScheme: rootColorScheme } : undefined}
    >
      <head>
        {initialTheme.theme === "system" ? (
          <Script
            id="docs-theme-mode"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: getThemeBootstrapScript() }}
          />
        ) : null}
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider storageKey={false}>
          <ThemeCookieSync />
          <ShellRouteLayout
            initialViewport={initialViewport}
            initialExpanded={initialExpanded}
          >
            {children}
          </ShellRouteLayout>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
