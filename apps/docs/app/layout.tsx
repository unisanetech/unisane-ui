import './globals.css';
// Material Symbols - using lighter font-400 package (456KB vs 3.7MB full package)
// This provides offline capability while keeping bundle size reasonable
import '@material-symbols/font-400/outlined.css';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { Inter, Sora } from 'next/font/google';
import { AppearanceProvider, AppearanceScript } from '@unisane/ui/appearance-provider';
import { Toaster } from '@unisane/ui/toast';
import type { SidebarViewport } from '@unisane/ui/sidebar';
import { ShellRouteLayout } from '@/features/shell';
import { DOCS_SIDEBAR_EXPANDED_COOKIE } from '@/features/shell/lib/sidebar-persistence';
import {
  DOCS_APPEARANCE_AXES,
  DOCS_APPEARANCE_COOKIE,
  DOCS_DEFAULT_APPEARANCE,
  resolveDocsAppearance,
} from '@/features/shell/lib/appearance-persistence';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
});

export const metadata: Metadata = {
  title: 'Unisane UI - React Component Library',
  description:
    'Production-ready React components with sophisticated theming, accessibility, and exceptional developer experience.',
};

const SIDEBAR_BREAKPOINTS = {
  mobile: 600,
  desktop: 840,
} as const;

function resolveViewportFromWidth(width: number): SidebarViewport {
  if (width < SIDEBAR_BREAKPOINTS.mobile) {
    return 'mobile';
  }

  if (width >= SIDEBAR_BREAKPOINTS.desktop) {
    return 'desktop';
  }

  return 'tablet';
}

function resolveInitialViewport(requestHeaders: Headers): SidebarViewport {
  const widthHeader =
    requestHeaders.get('sec-ch-viewport-width') ?? requestHeaders.get('viewport-width');

  if (widthHeader) {
    const parsedWidth = Number.parseInt(widthHeader, 10);
    if (Number.isFinite(parsedWidth)) {
      return resolveViewportFromWidth(parsedWidth);
    }
  }

  const userAgent = requestHeaders.get('user-agent') ?? '';

  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent)) {
    return 'tablet';
  }

  if (/Mobi|Android.+Mobile|iPhone|iPod|Windows Phone/i.test(userAgent)) {
    return 'mobile';
  }

  return 'desktop';
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const cookieStore = await cookies();
  const initialViewport = resolveInitialViewport(requestHeaders);
  const initialExpanded = cookieStore.get(DOCS_SIDEBAR_EXPANDED_COOKIE)?.value === 'true';
  const initialAppearance = resolveDocsAppearance(cookieStore.get(DOCS_APPEARANCE_COOKIE)?.value);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable}`}
      suppressHydrationWarning
      data-density={initialAppearance.density}
      data-radius={initialAppearance.radius}
      data-action-shape={initialAppearance.actionShape}
      data-contrast={initialAppearance.contrast}
      data-elevation={initialAppearance.elevation}
      data-theme-mode={initialAppearance.mode}
    >
      <head>
        <AppearanceScript
          enabledAxes={DOCS_APPEARANCE_AXES}
          defaults={DOCS_DEFAULT_APPEARANCE}
          persistence="cookie"
          persistenceKey={DOCS_APPEARANCE_COOKIE}
        />
      </head>
      <body suppressHydrationWarning>
        <AppearanceProvider
          enabledAxes={DOCS_APPEARANCE_AXES}
          defaults={DOCS_DEFAULT_APPEARANCE}
          persistence="cookie"
          persistenceKey={DOCS_APPEARANCE_COOKIE}
        >
          <ShellRouteLayout initialViewport={initialViewport} initialExpanded={initialExpanded}>
            {children}
          </ShellRouteLayout>
          <Toaster position="bottom-right" />
        </AppearanceProvider>
      </body>
    </html>
  );
}
