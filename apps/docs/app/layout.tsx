import './globals.css';
// Material Symbols - using lighter font-400 package (456KB vs 3.7MB full package)
// This provides offline capability while keeping bundle size reasonable
import '@material-symbols/font-400/outlined.css';
import type { Metadata } from 'next';
import { AppearanceProvider, AppearanceScript } from '@unisane/ui/appearance-provider';
import { Toaster } from '@unisane/ui/toast';
import { ShellRouteLayout } from '@/features/shell';
import {
  DOCS_APPEARANCE_AXES,
  DOCS_APPEARANCE_COOKIE,
  DOCS_DEFAULT_APPEARANCE,
} from '@/features/shell/lib/appearance-persistence';

export const metadata: Metadata = {
  title: 'Unisane UI - React Component Library',
  description:
    'Production-ready React components with sophisticated theming, accessibility, and exceptional developer experience.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-density={DOCS_DEFAULT_APPEARANCE.density}
      data-radius={DOCS_DEFAULT_APPEARANCE.radius}
      data-action-shape={DOCS_DEFAULT_APPEARANCE.actionShape}
      data-contrast={DOCS_DEFAULT_APPEARANCE.contrast}
      data-elevation={DOCS_DEFAULT_APPEARANCE.elevation}
      data-theme-mode={DOCS_DEFAULT_APPEARANCE.mode}
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
          <ShellRouteLayout>{children}</ShellRouteLayout>
          <Toaster position="bottom-right" />
        </AppearanceProvider>
      </body>
    </html>
  );
}
