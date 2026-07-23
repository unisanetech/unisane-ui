'use client';

import { DocLayout, DocSection } from '@/features/docs-page';
import { Card } from '@unisane/ui/card';
import { Typography } from '@unisane/ui/typography';
import { Button } from '@unisane/ui/button';

const TOC_ITEMS = [
  { id: 'tailwind-classes', label: 'Tailwind Classes' },
  { id: 'design-tokens', label: 'Design Tokens' },
  { id: 'component-variants', label: 'Component Variants' },
  { id: 'responsive-design', label: 'Responsive Design' },
  { id: 'dark-mode', label: 'Dark Mode' },
];

export default function StylingPage() {
  return (
    <DocLayout
      title="Styling"
      description="Learn how to customize Unisane UI components using Tailwind CSS classes and design tokens."
      toc={TOC_ITEMS}
    >
      {/* Tailwind Classes */}
      <DocSection
        id="tailwind-classes"
        title="Using Tailwind Classes"
        description="Every component accepts a className prop, allowing you to add Tailwind CSS classes for customization."
      >
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2">
            <CodeBlock
              title="Adding custom styles"
              code={`import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Add spacing, sizing, and colors
<Button className="px-8 py-4">
  Wide Button
</Button>

// Override default styles
<Card className="bg-primary-container p-8">
  Custom background card
</Card>

// Combine with responsive classes
<Button className="w-full md:w-auto">
  Responsive Button
</Button>`}
            />
            <PreviewCard>
              <div className="w-full max-w-sm space-y-4">
                <Button className="px-8" variant="filled">
                  Wide Button
                </Button>
                <Card className="bg-primary-container p-4">
                  <Typography variant="bodyMedium" className="text-on-primary-container">
                    Custom background card
                  </Typography>
                </Card>
                <Button className="w-full" variant="outlined">
                  Responsive Button
                </Button>
              </div>
            </PreviewCard>
          </div>

          <InfoCard icon="info" variant="info">
            Tailwind classes you add will be merged intelligently with component defaults using
            <code className="bg-surface-container text-body-small mx-1 rounded px-1.5 py-0.5">
              tailwind-merge
            </code>
            . Conflicting classes will be resolved in favor of your custom classes.
          </InfoCard>
        </div>
      </DocSection>

      {/* Design Tokens */}
      <DocSection
        id="design-tokens"
        title="Design Tokens"
        description="Unisane UI uses semantic color tokens that automatically adapt to light and dark modes."
      >
        <div className="space-y-8">
          <Typography variant="titleMedium" className="mb-4">
            Surface Colors
          </Typography>
          <div className="grid grid-cols-2 gap-3 @md:grid-cols-4">
            <TokenSwatch name="surface" className="bg-surface" textClass="text-on-surface" />
            <TokenSwatch
              name="surface-container"
              className="bg-surface-container"
              textClass="text-on-surface"
            />
            <TokenSwatch
              name="surface-container-high"
              className="bg-surface-container-high"
              textClass="text-on-surface"
            />
            <TokenSwatch
              name="surface-container-highest"
              className="bg-surface-container-highest"
              textClass="text-on-surface"
            />
          </div>

          <Typography variant="titleMedium" className="mb-4">
            Primary Colors
          </Typography>
          <div className="grid grid-cols-2 gap-3 @md:grid-cols-4">
            <TokenSwatch name="primary" className="bg-primary" textClass="text-on-primary" />
            <TokenSwatch
              name="primary-container"
              className="bg-primary-container"
              textClass="text-on-primary-container"
            />
            <TokenSwatch name="secondary" className="bg-secondary" textClass="text-on-secondary" />
            <TokenSwatch
              name="secondary-container"
              className="bg-secondary-container"
              textClass="text-on-secondary-container"
            />
          </div>

          <Typography variant="titleMedium" className="mb-4">
            Semantic Colors
          </Typography>
          <div className="grid grid-cols-2 gap-3 @md:grid-cols-4">
            <TokenSwatch name="error" className="bg-error" textClass="text-on-error" />
            <TokenSwatch
              name="error-container"
              className="bg-error-container"
              textClass="text-on-error-container"
            />
            <TokenSwatch name="success" className="bg-success" textClass="text-on-success" />
            <TokenSwatch name="warning" className="bg-warning" textClass="text-on-warning" />
          </div>

          <CodeBlock
            title="Using tokens in Tailwind"
            code={`// Background colors
<div className="bg-surface-container">...</div>
<div className="bg-primary-container">...</div>

// Text colors
<p className="text-on-surface">Primary text</p>
<p className="text-on-surface-variant">Secondary text</p>

// Border colors
<div className="border border-outline">...</div>
<div className="border border-outline-variant">...</div>`}
          />

          <Typography variant="titleMedium" className="mb-4">
            Layout Tokens
          </Typography>
          <CodeBlock
            title="Overriding layout tokens"
            code={`/* Global override */
:root {
  --layout-navigation-drawer: 20rem;
  --layout-command-list-max-height: 22rem;
}

/* Per-instance override without global CSS */
<NavigationDrawer className="[--layout-navigation-drawer:18rem]" />
<CommandList className="[--layout-command-list-max-height:18rem]" />`}
          />
        </div>
      </DocSection>

      {/* Component Variants */}
      <DocSection
        id="component-variants"
        title="Component Variants"
        description="Most components come with built-in variants for different use cases."
      >
        <div className="space-y-8">
          <Typography variant="titleMedium">Button Variants</Typography>
          <div className="flex flex-wrap gap-4">
            <Button variant="filled">Filled</Button>
            <Button variant="tonal">Tonal</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
            <Button variant="elevated">Elevated</Button>
          </div>

          <CodeBlock
            title="Using variants"
            code={`import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Button variants
<Button variant="filled">Filled action</Button>
<Button variant="tonal">Tonal action</Button>
<Button variant="outlined">Outlined action</Button>
<Button variant="text">Low emphasis</Button>

// Card variants
<Card variant="elevated">Elevated card</Card>
<Card variant="filled">Filled card</Card>
<Card variant="outlined">Outlined card</Card>

// Size variants
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
          />

          <Typography variant="titleMedium">Card Variants</Typography>
          <div className="grid grid-cols-1 gap-4 @md:grid-cols-3">
            <Card variant="elevated" className="p-4">
              <Typography variant="titleSmall">Elevated</Typography>
              <Typography variant="bodySmall" className="text-on-surface-variant">
                With shadow
              </Typography>
            </Card>
            <Card variant="filled" className="p-4">
              <Typography variant="titleSmall">Filled</Typography>
              <Typography variant="bodySmall" className="text-on-surface-variant">
                Background color
              </Typography>
            </Card>
            <Card variant="outlined" className="p-4">
              <Typography variant="titleSmall">Outlined</Typography>
              <Typography variant="bodySmall" className="text-on-surface-variant">
                With border
              </Typography>
            </Card>
          </div>
        </div>
      </DocSection>

      {/* Responsive Design */}
      <DocSection
        id="responsive-design"
        title="Responsive Design"
        description="Use Tailwind's responsive prefixes to create adaptive layouts."
      >
        <div className="space-y-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-outline-variant border-b">
                  <th className="text-label-large text-on-surface py-3 pr-4">Prefix</th>
                  <th className="text-label-large text-on-surface py-3 pr-4">Min Width</th>
                  <th className="text-label-large text-on-surface py-3">CSS</th>
                </tr>
              </thead>
              <tbody className="text-body-medium text-on-surface-variant">
                <tr className="border-outline-variant border-b">
                  <td className="text-primary py-3 pr-4 font-mono">sm:</td>
                  <td className="py-3 pr-4">640px</td>
                  <td className="text-body-small py-3 font-mono">@media (min-width: 640px)</td>
                </tr>
                <tr className="border-outline-variant border-b">
                  <td className="text-primary py-3 pr-4 font-mono">md:</td>
                  <td className="py-3 pr-4">768px</td>
                  <td className="text-body-small py-3 font-mono">@media (min-width: 768px)</td>
                </tr>
                <tr className="border-outline-variant border-b">
                  <td className="text-primary py-3 pr-4 font-mono">lg:</td>
                  <td className="py-3 pr-4">1024px</td>
                  <td className="text-body-small py-3 font-mono">@media (min-width: 1024px)</td>
                </tr>
                <tr className="border-outline-variant border-b">
                  <td className="text-primary py-3 pr-4 font-mono">xl:</td>
                  <td className="py-3 pr-4">1280px</td>
                  <td className="text-body-small py-3 font-mono">@media (min-width: 1280px)</td>
                </tr>
                <tr>
                  <td className="text-primary py-3 pr-4 font-mono">2xl:</td>
                  <td className="py-3 pr-4">1536px</td>
                  <td className="text-body-small py-3 font-mono">@media (min-width: 1536px)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <CodeBlock
            title="Responsive examples"
            code={`// Responsive button width
<Button className="w-full md:w-auto">
  Full on mobile, auto on desktop
</Button>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>

// Responsive text
<Typography className="text-body-medium md:text-body-large">
  Responsive text
</Typography>`}
          />
        </div>
      </DocSection>

      {/* Dark Mode */}
      <DocSection
        id="dark-mode"
        title="Dark Mode"
        description="The generated semantic colors support dark mode; a local AppearanceProvider is optional for user-controlled switching."
      >
        <div className="space-y-8">
          <Typography variant="bodyMedium" className="text-on-surface-variant max-w-2xl">
            All color tokens automatically adjust when dark mode is active. You don&apos;t need to
            add any dark: prefixes — the theme system handles everything.
          </Typography>

          <CodeBlock
            title="AppearanceProvider setup"
            code={`import { AppearanceProvider } from "@/components/ui/appearance-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppearanceProvider enabledAxes={["mode"]}>
          {children}
        </AppearanceProvider>
      </body>
    </html>
  );
}`}
          />

          <div className="grid grid-cols-1 gap-6 @md:grid-cols-2">
            <Card variant="outlined" className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">light_mode</span>
                <Typography variant="titleMedium">Light Mode</Typography>
              </div>
              <Typography variant="bodySmall" className="text-on-surface-variant">
                Clean, bright interface with high contrast. Optimal for well-lit environments.
              </Typography>
            </Card>
            <Card variant="outlined" className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">dark_mode</span>
                <Typography variant="titleMedium">Dark Mode</Typography>
              </div>
              <Typography variant="bodySmall" className="text-on-surface-variant">
                Reduced eye strain in low-light. Energy efficient on OLED displays.
              </Typography>
            </Card>
          </div>

          <InfoCard icon="lightbulb" variant="tip">
            Learn more about creating custom themes in the{' '}
            <a href="/docs/getting-started/theming" className="text-primary hover:underline">
              Building Themes
            </a>{' '}
            guide.
          </InfoCard>
        </div>
      </DocSection>
    </DocLayout>
  );
}

// Helper Components

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

function PreviewCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-outline-variant overflow-hidden rounded-lg border">
      <div className="bg-surface-container border-outline-variant border-b px-4 py-2">
        <Typography variant="labelMedium" className="text-on-surface-variant">
          Preview
        </Typography>
      </div>
      <div className="bg-surface-container-low flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}

function TokenSwatch({
  name,
  className,
  textClass,
}: {
  name: string;
  className: string;
  textClass: string;
}) {
  return (
    <div className={`${className} flex min-h-24 flex-col justify-end rounded-lg p-4`}>
      <Typography variant="labelSmall" className={textClass}>
        {name}
      </Typography>
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
