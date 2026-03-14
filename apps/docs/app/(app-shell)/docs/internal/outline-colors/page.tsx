import {
  Surface,
  Typography,
} from "@unisane/ui";
import type React from "react";

const outlineTokens = [
  "outline-weak",
  "outline-soft",
  "outline-muted",
  "outline-subtle",
  "outline-medium",
  "outline-strong",
  "outline",
  "outline-variant",
] as const;

const outlineTokenVars: Record<(typeof outlineTokens)[number], string> = {
  "outline-weak": "var(--color-outline-weak)",
  "outline-soft": "var(--color-outline-soft)",
  "outline-muted": "var(--color-outline-muted)",
  "outline-subtle": "var(--color-outline-subtle)",
  "outline-medium": "var(--color-outline-medium)",
  "outline-strong": "var(--color-outline-strong)",
  outline: "var(--color-outline)",
  "outline-variant": "var(--color-outline-variant)",
};

function TokenChip({ token }: { token: (typeof outlineTokens)[number] }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-outline-subtle bg-surface px-4 py-3">
      <div className="min-w-0">
        <Typography variant="labelLarge" component="div" className="text-on-surface">
          {token}
        </Typography>
        <Typography variant="bodySmall" component="div" className="text-on-surface-variant">
          border-{token}
        </Typography>
      </div>
      <div
        className="h-10 w-24 shrink-0 rounded-md border-2 bg-surface-container"
        style={{ borderColor: outlineTokenVars[token] }}
      />
    </div>
  );
}

function SidebarSeamDemo({
  token,
  className = "",
}: {
  token: (typeof outlineTokens)[number];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-xl border border-outline-subtle">
        <div className="flex h-[320px] w-full bg-surface">
          <div className="flex w-24 shrink-0 flex-col items-center gap-4 bg-surface-container py-6 text-on-surface">
            <div className="h-10 w-10 rounded-full bg-primary-container" />
            <div className="h-10 w-10 rounded-full bg-surface-container-high" />
            <div className="h-10 w-10 rounded-full bg-surface-container-high" />
          </div>
          <div
            className="w-px shrink-0"
            style={{ backgroundColor: outlineTokenVars[token] }}
          />
          <div className="min-w-0 flex-1 bg-surface-container px-5 py-6 text-on-surface">
            <Typography variant="titleMedium" component="h3">
              {token}
            </Typography>
            <Typography variant="bodyMedium" component="p" className="mt-2 max-w-md text-on-surface-variant">
              Rail and drawer surfaces use the same navigation family. This isolates the seam token only.
            </Typography>
            <div className="mt-6 space-y-3">
              <div className="h-11 rounded-lg bg-primary-container/60" />
              <div className="h-11 rounded-lg bg-surface-container-high" />
              <div className="h-11 rounded-lg bg-surface-container-high" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <Typography variant="titleLarge" component="h2" className="text-on-surface">
          {title}
        </Typography>
        <Typography variant="bodyMedium" component="p" className="max-w-3xl text-on-surface-variant">
          {description}
        </Typography>
      </div>
      {children}
    </section>
  );
}

export default function OutlineColorsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 lg:px-10">
      <div className="space-y-2">
        <Typography variant="headlineMedium" component="h1" className="text-on-surface">
          Outline Colors
        </Typography>
        <Typography variant="bodyLarge" component="p" className="max-w-3xl text-on-surface-variant">
          Temporary internal page for comparing the full outline token scale on plain cards and on a sidebar rail/drawer seam.
        </Typography>
      </div>

      <Section
        title="Token Swatches"
        description="Quick side-by-side border samples on a neutral surface."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {outlineTokens.map((token) => (
            <TokenChip key={token} token={token} />
          ))}
        </div>
      </Section>

      <Section
        title="Sidebar Seam"
        description="Compare how each outline token reads as the separator between adjacent rail and drawer surfaces."
      >
        <div className="grid gap-6 xl:grid-cols-2">
          {outlineTokens.map((token) => (
            <SidebarSeamDemo key={token} token={token} />
          ))}
        </div>
      </Section>

      <Section
        title="Dark Surface Check"
        description="The same seam check under a dark shell so light-mode choices do not break in dark mode."
      >
        <div className="dark rounded-2xl bg-surface p-3">
          <Surface tone="surfaceContainerLow" rounded="xl" className="space-y-6 border border-outline-subtle p-6">
            <div className="grid gap-6 xl:grid-cols-2">
              {outlineTokens.map((token) => (
                <SidebarSeamDemo key={`dark-${token}`} token={token} className="dark" />
              ))}
            </div>
          </Surface>
        </div>
      </Section>
    </div>
  );
}
