'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';
import { DocLayout, DocSection } from '@/features/docs-page';
import {
  CATEGORY_META,
  getComponentBySlug,
  getAdjacentComponents,
} from '@/lib/docs/registry/selectors';
import {
  PropsTable,
  ChoosingTable,
  HierarchyGrid,
  PlacementExamples,
  AccessibilityInfo,
  RelatedComponents,
  CodeBlock,
  CliCommand,
  SubComponentsSection,
  PageNavigation,
  ExampleGrid,
} from '@/features/docs-page';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';

interface ComponentPageProps {
  params: Promise<{ slug: string }>;
}

export default function ComponentPage({ params }: ComponentPageProps) {
  const { slug } = use(params);
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  const { previous, next } = getAdjacentComponents(slug);
  const categoryMeta = CATEGORY_META.find((item) => item.id === component.category);
  const statusTone =
    component.status === 'stable'
      ? 'primaryContainer'
      : component.status === 'beta'
        ? 'secondaryContainer'
        : component.status === 'experimental'
          ? 'tertiaryContainer'
          : 'errorContainer';
  const statusTextClass =
    component.status === 'stable'
      ? 'text-on-primary-container'
      : component.status === 'beta'
        ? 'text-on-secondary-container'
        : component.status === 'experimental'
          ? 'text-on-tertiary-container'
          : 'text-on-error-container';
  const importLine =
    component.importPath && component.exports?.length
      ? `import { ${component.exports[0]} } from "${component.importPath}"`
      : component.importPath
        ? `import { ${component.name} } from "${component.importPath}"`
        : null;
  const exampleHero = component.examples?.[0];
  const choosingHero = component.choosing?.rows[0];
  const hierarchyHero = component.hierarchy?.items[0];
  const placementHero = component.placement?.examples[0];
  const fallbackHeroContent =
    exampleHero?.component ??
    choosingHero?.component ??
    hierarchyHero?.component ??
    placementHero?.visual;
  const heroContent = component.heroVisual ?? fallbackHeroContent;
  const fallbackHeroPreview = exampleHero
    ? (exampleHero.preview ?? component.examplesPreview)
    : !choosingHero && !hierarchyHero && placementHero
      ? (placementHero.preview ?? component.placement?.previewDefaults)
      : undefined;
  const heroPreview = component.heroPreview ?? fallbackHeroPreview;
  const showChoosing = Boolean(component.choosing) && !component.docsLayout?.hideChoosing;
  const showPlacement = Boolean(component.placement) && !component.docsLayout?.hidePlacement;

  // Build table of contents based on available sections
  // Order: Installation → Usage → Design guidance → API → Accessibility → Related
  const toc: Array<{ id: string; label: string }> = [];

  // Installation first - how to add to project
  toc.push({ id: 'installation', label: 'Installation' });
  // Interactive examples
  if (component.examples?.length) {
    toc.push({ id: 'examples', label: 'Examples' });
  }
  // Usage - code example
  if (component.implementation) {
    toc.push({ id: 'usage', label: 'Usage' });
  }
  // Design guidance sections
  if (showChoosing) {
    toc.push({ id: 'choosing', label: `Choosing ${component.name.toLowerCase()}` });
  }
  if (component.hierarchy) {
    toc.push({ id: 'hierarchy', label: 'Hierarchy' });
  }
  if (showPlacement) {
    toc.push({ id: 'placement', label: 'Placement' });
  }
  // API documentation
  if (component.props?.length) {
    toc.push({ id: 'api', label: 'API Reference' });
  }
  if (component.subComponents?.length) {
    toc.push({ id: 'sub-components', label: 'Sub-components' });
  }
  // Accessibility
  if (component.accessibility) {
    toc.push({ id: 'accessibility', label: 'Accessibility' });
  }
  // Related components last
  if (component.related?.length) {
    toc.push({ id: 'related', label: 'Related' });
  }

  return (
    <DocLayout
      title={component.name}
      description={component.description}
      toc={toc}
      heroContent={heroContent}
      heroPreview={heroPreview}
      heroEyebrow={
        <>
          {categoryMeta ? (
            <Surface
              tone="surfaceContainerHigh"
              rounded="full"
              className="inline-flex items-center gap-2 px-3 py-1.5"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                {categoryMeta.icon}
              </span>
              <Typography variant="labelMedium" component="span" className="text-on-surface">
                {categoryMeta.label}
              </Typography>
            </Surface>
          ) : null}
          <Surface
            tone={statusTone}
            rounded="full"
            className="inline-flex items-center px-3 py-1.5"
          >
            <Typography
              variant="labelMedium"
              component="span"
              className={`capitalize ${statusTextClass}`}
            >
              {component.status}
            </Typography>
          </Surface>
        </>
      }
      heroMeta={
        <Surface tone="surfaceContainerLow" rounded="sm" className="p-5">
          <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @2xl:gap-5">
            {importLine ? (
              <div className="space-y-2 @md:col-span-2">
                <Typography
                  variant="labelSmall"
                  component="div"
                  className="text-on-surface-variant tracking-wide uppercase"
                >
                  Import
                </Typography>
                <code className="text-body-small @2xl:text-body-medium text-on-surface block font-mono wrap-break-word">
                  {importLine}
                </code>
              </div>
            ) : null}
            {component.exports?.length ? (
              <div className="space-y-2">
                <Typography
                  variant="labelSmall"
                  component="div"
                  className="text-on-surface-variant tracking-wide uppercase"
                >
                  Exports
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {component.exports.slice(0, 4).map((entry) => (
                    <Surface
                      key={entry}
                      tone="surfaceContainerHigh"
                      rounded="full"
                      className="px-2.5 py-1"
                    >
                      <Typography variant="labelSmall" component="span" className="text-on-surface">
                        {entry}
                      </Typography>
                    </Surface>
                  ))}
                  {component.exports.length > 4 ? (
                    <Surface tone="surfaceContainerHigh" rounded="full" className="px-2.5 py-1">
                      <Typography
                        variant="labelSmall"
                        component="span"
                        className="text-on-surface-variant"
                      >
                        +{component.exports.length - 4} more
                      </Typography>
                    </Surface>
                  ) : null}
                </div>
              </div>
            ) : null}
            {categoryMeta ? (
              <div className="space-y-2">
                <Typography
                  variant="labelSmall"
                  component="div"
                  className="text-on-surface-variant tracking-wide uppercase"
                >
                  Use when
                </Typography>
                <Typography
                  variant="bodySmall"
                  component="p"
                  className="text-on-surface-variant leading-relaxed"
                >
                  {categoryMeta.description}
                </Typography>
              </div>
            ) : null}
          </div>
        </Surface>
      }
    >
      {/* ─── INSTALLATION SECTION ───────────────────────────────────────────────── */}
      <DocSection
        id="installation"
        title="Installation"
        description="Add this component to your project using the CLI."
      >
        <CliCommand command={`@unisane/cli add ${slug}`} />
      </DocSection>

      {/* ─── EXAMPLES SECTION ──────────────────────────────────────────────────────── */}
      {component.examples?.length ? (
        <DocSection
          id="examples"
          title="Examples"
          description="Interactive examples to explore the component."
        >
          <ExampleGrid examples={component.examples} previewDefaults={component.examplesPreview} />
        </DocSection>
      ) : null}

      {/* ─── USAGE SECTION ───────────────────────────────────────────────────────── */}
      {component.implementation && (
        <DocSection id="usage" title="Usage" description={component.implementation.description}>
          <CodeBlock code={component.implementation.code} language="tsx" />
        </DocSection>
      )}

      {/* ─── CHOOSING SECTION ───────────────────────────────────────────────────── */}
      {showChoosing && component.choosing && (
        <DocSection
          id="choosing"
          title={`Choosing ${component.name.toLowerCase()}`}
          description={component.choosing.description}
        >
          <ChoosingTable choosing={component.choosing} />
        </DocSection>
      )}

      {/* ─── HIERARCHY SECTION ──────────────────────────────────────────────────── */}
      {component.hierarchy && (
        <DocSection id="hierarchy" title="Hierarchy" description={component.hierarchy.description}>
          <HierarchyGrid hierarchy={component.hierarchy} />
        </DocSection>
      )}

      {/* ─── PLACEMENT SECTION ──────────────────────────────────────────────────── */}
      {showPlacement && component.placement && (
        <DocSection id="placement" title="Placement" description={component.placement.description}>
          <PlacementExamples placement={component.placement} />
        </DocSection>
      )}

      {/* ─── API REFERENCE ──────────────────────────────────────────────────────── */}
      {component.props?.length ? (
        <DocSection
          id="api"
          title="API Reference"
          description="Properties for this component. All standard HTML attributes are also supported."
        >
          <PropsTable props={component.props} />
        </DocSection>
      ) : null}

      {/* ─── SUB-COMPONENTS ─────────────────────────────────────────────────────── */}
      {component.subComponents?.length && (
        <DocSection
          id="sub-components"
          title="Sub-components"
          description="Additional components for building structured layouts."
        >
          <SubComponentsSection subComponents={component.subComponents} />
        </DocSection>
      )}

      {/* ─── ACCESSIBILITY ──────────────────────────────────────────────────────── */}
      {component.accessibility && (
        <DocSection id="accessibility" title="Accessibility">
          <AccessibilityInfo accessibility={component.accessibility} />
        </DocSection>
      )}

      {/* ─── RELATED COMPONENTS ─────────────────────────────────────────────────── */}
      {component.related?.length && (
        <DocSection
          id="related"
          title="Related Components"
          description="Other components that work well with this one."
        >
          <RelatedComponents related={component.related} />
        </DocSection>
      )}

      {/* ─── NAVIGATION ─────────────────────────────────────────────────────────── */}
      <PageNavigation previous={previous} next={next} className="pt-8" />
    </DocLayout>
  );
}
