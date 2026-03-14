'use client';

import {
  Button,
  Surface,
  Typography,
} from "@unisane/ui";
import { buttonDoc } from "@/lib/docs/registry/components/button.docs";
import { dateInputDoc } from "@/lib/docs/registry/components/date-input.docs";
import { selectDoc } from "@/lib/docs/registry/components/select.docs";
import { tabsDoc } from "@/lib/docs/registry/components/tabs.docs";
import { textFieldDoc } from "@/lib/docs/registry/components/text-field.docs";

const themeAxes = [
  {
    title: "Default tonal",
    attrs: {
      "data-color-theme": "blue",
      "data-scheme": "tonal",
      "data-contrast": "standard",
      "data-density": "standard",
      "data-radius": "standard",
      "data-elevation": "subtle",
    },
    className: "",
  },
  {
    title: "High contrast dark",
    attrs: {
      "data-color-theme": "green",
      "data-scheme": "tonal",
      "data-contrast": "high",
      "data-density": "comfortable",
      "data-radius": "soft",
      "data-elevation": "pronounced",
    },
    className: "dark",
  },
  {
    title: "Monochrome compact",
    attrs: {
      "data-color-theme": "black",
      "data-scheme": "monochrome",
      "data-contrast": "medium",
      "data-density": "compact",
      "data-radius": "none",
      "data-elevation": "flat",
    },
    className: "",
  },
] as const;

const buttonFixtures = [
  ...(buttonDoc.choosing?.rows.slice(0, 4).map((row) => row.component) ?? []),
  <Button key="visual-button-elevated" variant="elevated">Elevated</Button>,
  <Button key="visual-button-disabled" disabled>Disabled</Button>,
] as const;

const fieldFixtures = [
  ...(textFieldDoc.hierarchy?.items.map((item) => item.component) ?? []),
  textFieldDoc.choosing?.rows[3]?.component,
  selectDoc.choosing?.rows[2]?.component,
  dateInputDoc.choosing?.rows[0]?.component,
  tabsDoc.choosing?.rows[0]?.component,
].filter(Boolean);

function FixtureSection({
  title,
  description,
  testId,
  children,
}: {
  title: string;
  description: string;
  testId: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4" data-testid={testId}>
      <div className="space-y-1">
        <Typography variant="titleLarge" component="h2" className="text-on-surface">
          {title}
        </Typography>
        <Typography variant="bodyMedium" component="p" className="text-on-surface-variant">
          {description}
        </Typography>
      </div>
      {children}
    </section>
  );
}

function CoreFixtures() {
  return (
    <div className="space-y-8">
      <FixtureSection
        title="Surface hierarchy"
        description="Surface containers and semantic status tones should remain visually distinct."
        testId="surface-hierarchy"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Surface
            tone="surface"
            rounded="lg"
            className="space-y-2 border border-outline-subtle p-5"
            data-testid="surface-card-base"
          >
            <Typography variant="titleMedium">Surface</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              Base canvas with outline subtle border.
            </Typography>
          </Surface>
          <Surface
            tone="surfaceContainerLow"
            rounded="lg"
            className="space-y-2 p-5"
            data-testid="surface-card-low"
          >
            <Typography variant="titleMedium">Container low</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              Lower emphasis nested container.
            </Typography>
          </Surface>
          <Surface
            tone="primaryContainer"
            rounded="lg"
            className="space-y-2 p-5"
            data-testid="surface-card-primary"
          >
            <Typography variant="titleMedium" className="text-on-primary-container">
              Primary container
            </Typography>
            <Typography variant="bodySmall" className="text-on-primary-container opacity-80">
              Status and action emphasis sample.
            </Typography>
          </Surface>
          <Surface
            tone="errorContainer"
            rounded="lg"
            className="space-y-2 p-5"
            data-testid="surface-card-error"
          >
            <Typography variant="titleMedium" className="text-on-error-container">
              Error container
            </Typography>
            <Typography variant="bodySmall" className="text-on-error-container opacity-80">
              Error tone baseline.
            </Typography>
          </Surface>
        </div>
      </FixtureSection>

      <FixtureSection
        title="Border semantics"
        description="Outline utilities should preserve clear hierarchy from subtle to strong."
        testId="border-semantics"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Surface tone="surface" rounded="lg" className="border border-outline-weak p-5" data-testid="border-weak">
            <Typography variant="titleMedium">Outline weak</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              Lowest edge emphasis.
            </Typography>
          </Surface>
          <Surface tone="surface" rounded="lg" className="border border-outline-subtle p-5" data-testid="border-subtle">
            <Typography variant="titleMedium">Outline subtle</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              Default contained border.
            </Typography>
          </Surface>
          <Surface tone="surface" rounded="lg" className="border border-outline-medium p-5" data-testid="border-medium">
            <Typography variant="titleMedium">Outline medium</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              Stronger structural edge.
            </Typography>
          </Surface>
          <Surface tone="surface" rounded="lg" className="border-2 border-outline-strong p-5" data-testid="border-strong">
            <Typography variant="titleMedium">Outline strong</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              Highest non-error border contrast.
            </Typography>
          </Surface>
        </div>
      </FixtureSection>

      <FixtureSection
        title="Buttons"
        description="Button variants, disabled state, and hierarchy should stay aligned across themes."
        testId="button-variants"
      >
        <div className="flex flex-wrap gap-3" data-testid="button-row">
          {buttonFixtures.map((fixture, index) => (
            <div key={`button-fixture-${index}`} className="shrink-0">
              {fixture}
            </div>
          ))}
        </div>
      </FixtureSection>

      <FixtureSection
        title="Fields"
        description="Shared field-family chrome should match the registry examples used in the docs."
        testId="field-variants"
      >
        <div className="grid gap-4 lg:grid-cols-2" data-testid="field-grid">
          {fieldFixtures.map((fixture, index) => (
            <div
              key={`field-fixture-${index}`}
              className="min-w-0"
              data-testid={`field-fixture-${index + 1}`}
            >
              {fixture}
            </div>
          ))}
        </div>
      </FixtureSection>
    </div>
  );
}

export default function VisualRegressionFixturesPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
      <div className="space-y-2">
        <Typography variant="headlineMedium" component="h1" className="text-on-surface">
          Visual Regression Fixtures
        </Typography>
        <Typography variant="bodyLarge" component="p" className="max-w-3xl text-on-surface-variant">
          Hidden fixture page for stable screenshot baselines. Use these sections to compare theme axes,
          surface hierarchy, button variants, and field-family chrome without relying on docs prose layouts.
        </Typography>
      </div>

      <div className="grid gap-8">
        {themeAxes.map((axis) => (
          <div
            key={axis.title}
            className={axis.className}
            data-testid={`axis-${axis.title.toLowerCase().replace(/\s+/g, "-")}`}
            {...axis.attrs}
          >
            <Surface tone="surfaceContainerLow" rounded="xl" className="space-y-6 border border-outline-subtle p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <Typography variant="titleLarge" component="h2" className="text-on-surface">
                    {axis.title}
                  </Typography>
                  <Typography variant="bodySmall" component="p" className="text-on-surface-variant">
                    {Object.entries(axis.attrs)
                      .map(([key, value]) => `${key}=${value}`)
                      .join(" · ")}
                    {axis.className ? ` · class=${axis.className}` : ""}
                  </Typography>
                </div>
              </div>
              <CoreFixtures />
            </Surface>
          </div>
        ))}
      </div>
    </div>
  );
}
