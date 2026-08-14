'use client';

import { CliCommand, DocLayout, DocSection } from '@/features/docs-page';
import { ColorThemePreviewGrid } from '@/features/docs-page/components/color-theme-preview-grid';
import { Button } from '@unisane/ui/button';
import { Card } from '@unisane/ui/card';
import { Typography } from '@unisane/ui/typography';
import { useAppearancePreference, useDensity, useMode } from '@unisane/ui/appearance-provider';

const TOC_ITEMS = [
  { id: 'color-themes', label: 'Project Color Theme' },
  { id: 'runtime-preferences', label: 'Runtime Preferences' },
  { id: 'color-modes', label: 'Light & Dark Mode' },
  { id: 'radius-styles', label: 'Border Radius' },
  { id: 'density', label: 'Density' },
  { id: 'programmatic', label: 'Preference Control' },
];

export default function ThemingPage() {
  return (
    <DocLayout
      title="Theming"
      description="Choose a generated project color theme, then opt into only the runtime preferences your product needs."
      toc={TOC_ITEMS}
    >
      <DocSection
        id="color-themes"
        title="Project Color Theme"
        description="Color themes replace the managed semantic color region in your project's globals.css."
      >
        <div className="space-y-8">
          <Typography variant="bodyMedium" className="text-on-surface-variant max-w-2xl">
            Choose the theme during initialization or replace it later with the CLI. Components
            continue to consume the same semantic color roles, and your CSS outside the managed
            region is preserved.
          </Typography>

          <div className="space-y-6">
            <div className="space-y-3">
              <Typography variant="labelLarge">New setup</Typography>
              <CliCommand command="@unisane/ui-cli@latest init --theme blue" />
            </div>
            <div className="space-y-3">
              <Typography variant="labelLarge">Change it later</Typography>
              <CliCommand command="@unisane/ui-cli@latest theme green" />
            </div>
            <div className="space-y-3">
              <Typography variant="labelLarge">Preview without writing</Typography>
              <CliCommand command="@unisane/ui-cli@latest theme purple --dry-run" />
            </div>
          </div>

          <InfoCard icon="verified_user" variant="info">
            Theme replacement creates a{' '}
            <code className="bg-surface-container text-body-small mx-1 rounded px-1.5 py-0.5">
              globals.css.backup
            </code>{' '}
            and changes only the region between the Unisane theme markers.
          </InfoCard>

          <Typography variant="titleMedium">Available themes</Typography>
          <ColorThemePreviewGrid />
          <Typography variant="bodySmall" className="text-on-surface-variant max-w-2xl">
            This grid is an interactive documentation preview. Applications select one of these
            themes with the CLI; they do not ship every color preset or a runtime color-theme
            selector.
          </Typography>
        </div>
      </DocSection>

      {/* Runtime preferences */}
      <DocSection
        id="runtime-preferences"
        title="Runtime Preferences"
        description="The generated CSS works without a provider. Add one only when users need runtime preferences."
      >
        <div className="space-y-8">
          <Typography variant="bodyMedium" className="text-on-surface-variant max-w-2xl">
            Components need no provider for their default appearance. Install the appearance
            provider component when your application needs a user-controlled light/dark mode,
            contrast, density, radius, action shape, or elevation.
          </Typography>

          <div className="space-y-3">
            <Typography variant="labelLarge">
              Enable only the preferences your product exposes
            </Typography>
            <CliCommand command="@unisane/ui-cli@latest appearance enable --axes mode,density,contrast --persistence localStorage" />
          </div>

          <CodeBlock
            title="app/layout.tsx"
            code={`import {
  AppearanceProvider,
  AppearanceScript,
} from "@/components/ui/appearance-provider";

const appearanceAxes = ["mode", "density", "contrast"] as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <AppearanceScript
          enabledAxes={appearanceAxes}
          persistence="localStorage"
        />
      </head>
      <body>
        <AppearanceProvider
          enabledAxes={appearanceAxes}
          persistence="localStorage"
        >
          {children}
        </AppearanceProvider>
      </body>
    </html>
  );
}`}
          />

          <InfoCard icon="info" variant="info">
            Add{' '}
            <code className="bg-surface-container text-body-small mx-1 rounded px-1.5 py-0.5">
              suppressHydrationWarning
            </code>{' '}
            to your html tag to prevent hydration warnings when theme is applied.
          </InfoCard>
        </div>
      </DocSection>

      {/* Color Modes */}
      <DocSection
        id="color-modes"
        title="Light & Dark Mode"
        description="Support light, dark, and system-based color modes out of the box."
      >
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 @md:grid-cols-3">
            <ModeCard
              icon="light_mode"
              title="Light Mode"
              description="Bright interface optimized for well-lit environments."
            />
            <ModeCard
              icon="dark_mode"
              title="Dark Mode"
              description="Reduced eye strain for low-light conditions."
            />
            <ModeCard
              icon="contrast"
              title="System"
              description="Automatically matches device preferences."
            />
          </div>

          <ModeSwitcherDemo />

          <CodeBlock
            title="Using the focused mode hook"
            code={`import { useMode } from "@/components/ui/appearance-provider";

function ThemeToggle() {
  const { mode, setMode, resolvedMode } = useMode();

  return (
    <button onClick={() => setMode(
      mode === "light" ? "dark" : "light"
    )}>
      Current: {resolvedMode}
    </button>
  );
}`}
          />
        </div>
      </DocSection>

      {/* Radius Styles */}
      <DocSection
        id="radius-styles"
        title="Border Radius"
        description="Adjust the roundness of components to match your design language."
      >
        <div className="space-y-8">
          <RadiusDemo />

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-outline-variant border-b">
                  <th className="text-label-large text-on-surface py-3 pr-4">Style</th>
                  <th className="text-label-large text-on-surface py-3 pr-4">Value</th>
                  <th className="text-label-large text-on-surface py-3">Best for</th>
                </tr>
              </thead>
              <tbody className="text-body-medium text-on-surface-variant">
                <tr className="border-outline-variant border-b">
                  <td className="text-primary py-3 pr-4 font-mono">none</td>
                  <td className="py-3 pr-4">0px</td>
                  <td className="py-3">Sharp, modern interfaces</td>
                </tr>
                <tr className="border-outline-variant border-b">
                  <td className="text-primary py-3 pr-4 font-mono">minimal</td>
                  <td className="py-3 pr-4">2px</td>
                  <td className="py-3">Subtle softness</td>
                </tr>
                <tr className="border-outline-variant border-b">
                  <td className="text-primary py-3 pr-4 font-mono">sharp</td>
                  <td className="py-3 pr-4">4px</td>
                  <td className="py-3">Professional, technical apps</td>
                </tr>
                <tr className="border-outline-variant border-b">
                  <td className="text-primary py-3 pr-4 font-mono">standard</td>
                  <td className="py-3 pr-4">8px</td>
                  <td className="py-3">Balanced, default setting</td>
                </tr>
                <tr>
                  <td className="text-primary py-3 pr-4 font-mono">soft</td>
                  <td className="py-3 pr-4">16px</td>
                  <td className="py-3">Friendly, approachable feel</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </DocSection>

      {/* Density */}
      <DocSection
        id="density"
        title="Density"
        description="Control spacing and sizing to accommodate different use cases."
      >
        <div className="space-y-8">
          <DensityDemo />

          <div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
            <Card variant="outlined" className="p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">density_small</span>
                <Typography variant="titleMedium">Compact / Dense</Typography>
              </div>
              <Typography variant="bodySmall" className="text-on-surface-variant">
                Tighter spacing for data-dense interfaces like dashboards and tables.
              </Typography>
            </Card>
            <Card variant="outlined" className="p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">density_medium</span>
                <Typography variant="titleMedium">Standard</Typography>
              </div>
              <Typography variant="bodySmall" className="text-on-surface-variant">
                Default spacing for most applications. Balances readability and density.
              </Typography>
            </Card>
            <Card variant="outlined" className="p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">density_large</span>
                <Typography variant="titleMedium">Comfortable</Typography>
              </div>
              <Typography variant="bodySmall" className="text-on-surface-variant">
                Generous spacing for touch interfaces and accessibility needs.
              </Typography>
            </Card>
          </div>
        </div>
      </DocSection>

      {/* Preference Control */}
      <DocSection
        id="programmatic"
        title="Preference Control"
        description="Use focused local hooks for the runtime preferences your application exposes."
      >
        <div className="space-y-8">
          <CodeBlock
            title="Focused runtime preferences"
            code={`import {
  useMode,
  useDensity,
} from "@/components/ui/appearance-provider";

function AppearanceSettings() {
  const { setMode, resolvedMode } = useMode();
  const { density, setDensity } = useDensity();

  return (
    <>
      <button onClick={() => setMode("system")}>{resolvedMode}</button>
      <button onClick={() => setDensity("compact")}>{density}</button>
    </>
  );
}`}
          />

          <InfoCard icon="lightbulb" variant="tip">
            The persistence policy is explicit. With{' '}
            <code className="bg-surface-container text-body-small mx-1 rounded px-1.5 py-0.5">
              localStorage
            </code>
            , enabled preferences use the{' '}
            <code className="bg-surface-container text-body-small mx-1 rounded px-1.5 py-0.5">
              unisane-appearance
            </code>{' '}
            key by default.
          </InfoCard>

          <Typography variant="titleMedium" className="mt-8">
            Focused Hooks
          </Typography>
          <div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
            <Card variant="filled" className="p-4">
              <Typography variant="labelLarge" className="text-primary mb-2 font-mono">
                useMode()
              </Typography>
              <Typography variant="bodySmall" className="text-on-surface-variant">
                Focused access to light/dark mode only.
              </Typography>
            </Card>
            <Card variant="filled" className="p-4">
              <Typography variant="labelLarge" className="text-primary mb-2 font-mono">
                useDensity()
              </Typography>
              <Typography variant="bodySmall" className="text-on-surface-variant">
                Focused access to density settings only.
              </Typography>
            </Card>
          </div>
        </div>
      </DocSection>
    </DocLayout>
  );
}

// ─── DEMO COMPONENTS ───────────────────────────────────────────────────────────

function ModeSwitcherDemo() {
  const { mode, setMode, resolvedMode } = useMode();

  return (
    <Card variant="outlined" className="p-6">
      <Typography variant="titleMedium" className="mb-4">
        Try it out
      </Typography>
      <div className="mb-4 flex flex-wrap gap-3">
        <Button variant={mode === 'light' ? 'filled' : 'outlined'} onClick={() => setMode('light')}>
          <span className="material-symbols-outlined mr-2 text-[18px]">light_mode</span>
          Light
        </Button>
        <Button variant={mode === 'dark' ? 'filled' : 'outlined'} onClick={() => setMode('dark')}>
          <span className="material-symbols-outlined mr-2 text-[18px]">dark_mode</span>
          Dark
        </Button>
        <Button
          variant={mode === 'system' ? 'filled' : 'outlined'}
          onClick={() => setMode('system')}
        >
          <span className="material-symbols-outlined mr-2 text-[18px]">contrast</span>
          System
        </Button>
      </div>
      <Typography variant="bodySmall" className="text-on-surface-variant">
        Current mode: <span className="text-primary font-medium">{mode}</span> → Resolved:{' '}
        <span className="text-primary font-medium">{resolvedMode}</span>
      </Typography>
    </Card>
  );
}

function RadiusDemo() {
  const { value: radius, setValue: setRadius } = useAppearancePreference('radius');

  const radiusOptions: Array<{ value: typeof radius; label: string }> = [
    { value: 'none', label: 'None' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'sharp', label: 'Sharp' },
    { value: 'standard', label: 'Standard' },
    { value: 'soft', label: 'Soft' },
  ];

  return (
    <Card variant="outlined" className="p-6">
      <Typography variant="titleMedium" className="mb-4">
        Border Radius Preview
      </Typography>
      <div className="mb-6 flex flex-wrap gap-2">
        {radiusOptions.map((r) => (
          <Button
            key={r.value}
            variant={radius === r.value ? 'filled' : 'outlined'}
            size="sm"
            onClick={() => setRadius(r.value)}
          >
            {r.label}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="bg-primary-container flex h-24 w-24 items-center justify-center rounded-sm">
          <Typography variant="labelSmall" className="text-on-primary-container">
            Card
          </Typography>
        </div>
        <Button variant="filled">Button</Button>
        <Button variant="tonal">Tonal</Button>
        <div className="bg-secondary-container flex h-12 w-12 items-center justify-center rounded-full">
          <span className="material-symbols-outlined text-on-secondary-container">favorite</span>
        </div>
      </div>
    </Card>
  );
}

function DensityDemo() {
  const { density, setDensity } = useDensity();

  const densityOptions: Array<{ value: typeof density; label: string }> = [
    { value: 'compact', label: 'Compact' },
    { value: 'dense', label: 'Dense' },
    { value: 'standard', label: 'Standard' },
    { value: 'comfortable', label: 'Comfortable' },
  ];

  return (
    <Card variant="outlined" className="p-6">
      <Typography variant="titleMedium" className="mb-4">
        Density Preview
      </Typography>
      <div className="mb-6 flex flex-wrap gap-2">
        {densityOptions.map((d) => (
          <Button
            key={d.value}
            variant={density === d.value ? 'filled' : 'outlined'}
            size="sm"
            onClick={() => setDensity(d.value)}
          >
            {d.label}
          </Button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Button variant="filled">Filled</Button>
          <Button variant="tonal">Tonal</Button>
          <Button variant="outlined">Outlined</Button>
        </div>
        <Typography variant="bodySmall" className="text-on-surface-variant">
          Current density: <span className="text-primary font-medium">{density}</span>
        </Typography>
      </div>
    </Card>
  );
}

// ─── HELPER COMPONENTS ─────────────────────────────────────────────────────────

function ModeCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Card variant="outlined" className="p-5">
      <div className="bg-primary-container mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
        <span className="material-symbols-outlined text-on-primary-container text-[20px]">
          {icon}
        </span>
      </div>
      <Typography variant="titleMedium" className="mb-1">
        {title}
      </Typography>
      <Typography variant="bodySmall" className="text-on-surface-variant">
        {description}
      </Typography>
    </Card>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="border-outline-variant overflow-hidden rounded-lg border">
      <div className="bg-surface-container border-outline-variant border-b px-4 py-2">
        <Typography variant="labelMedium" className="text-on-surface-variant font-mono">
          {title}
        </Typography>
      </div>
      <div className="bg-surface-container-low">
        <pre className="overflow-x-auto p-4">
          <code className="text-body-small text-on-surface font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  variant,
  children,
}: {
  icon: string;
  variant: 'info' | 'tip';
  children: React.ReactNode;
}) {
  const styles = {
    info: 'bg-primary-container border-primary',
    tip: 'bg-tertiary-container border-tertiary',
  };
  const iconColor = variant === 'info' ? 'text-primary' : 'text-tertiary';

  return (
    <div className={`rounded-lg border p-4 ${styles[variant]}`}>
      <div className="flex gap-3">
        <span className={`material-symbols-outlined ${iconColor} shrink-0`}>{icon}</span>
        <Typography variant="bodySmall" className="text-on-surface-variant">
          {children}
        </Typography>
      </div>
    </div>
  );
}
