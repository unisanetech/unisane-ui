import Link from 'next/link';
import { Surface, Typography } from '@unisane/ui';
import type {
  StaticDocGridItem,
  StaticDocLinkItem,
  StaticDocPage,
  StaticDocSection,
} from '@/lib/docs/content/types';
import { DocLayout, DocSection, type TocItem } from './doc-page-layout';
import { ExampleGrid } from './example-preview';

function StaticDocCard({ item }: { item: StaticDocGridItem | StaticDocLinkItem }) {
  const visual = 'visual' in item ? item.visual : undefined;
  const href = 'href' in item ? item.href : undefined;
  const content = (
    <Surface
      tone="surfaceContainerLow"
      rounded="sm"
      className="hover:bg-surface-container h-full p-5 transition-colors"
    >
      {'eyebrow' in item && item.eyebrow ? (
        <Typography
          variant="labelSmall"
          className="text-on-surface-variant mb-2 tracking-wide uppercase"
        >
          {item.eyebrow}
        </Typography>
      ) : null}
      {visual ? <div className="mb-4">{visual}</div> : null}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {item.icon ? (
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              {item.icon}
            </span>
          ) : null}
          <Typography variant="titleMedium" component="h3">
            {item.title}
          </Typography>
        </div>
        {item.description ? (
          <Typography variant="bodyMedium" className="text-on-surface-variant leading-relaxed">
            {item.description}
          </Typography>
        ) : null}
      </div>
    </Surface>
  );

  return href ? (
    <Link href={href} className="group block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}

function renderStaticDocSection(section: StaticDocSection) {
  switch (section.type) {
    case 'prose':
      return (
        <Surface tone="surfaceContainerLow" rounded="sm" className="p-5 @2xl:p-6">
          <div className="prose prose-neutral text-on-surface-variant max-w-none">
            {section.body}
          </div>
        </Surface>
      );

    case 'grid':
      return (
        <div
          className={`grid grid-cols-1 gap-4 ${
            section.columns === 3
              ? '@2xl:grid-cols-2 @4xl:grid-cols-3'
              : section.columns === 2
                ? '@2xl:grid-cols-2'
                : ''
          }`}
        >
          {section.items.map((item) => (
            <StaticDocCard key={item.href ?? item.title} item={item} />
          ))}
        </div>
      );

    case 'blocks':
      return <ExampleGrid examples={section.examples} previewDefaults={section.previewDefaults} />;

    case 'checklist':
      return (
        <Surface tone="surfaceContainerLow" rounded="sm" className="p-5 @2xl:p-6">
          <div className="space-y-3">
            {section.items.map((item) => (
              <div key={item} className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  check_circle
                </span>
                <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
                  {item}
                </Typography>
              </div>
            ))}
          </div>
        </Surface>
      );

    case 'do-dont':
      return (
        <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
          <Surface tone="secondaryContainer" rounded="sm" className="p-5 @2xl:p-6">
            <Typography
              variant="titleMedium"
              component="h3"
              className="text-on-secondary-container mb-4"
            >
              Do
            </Typography>
            <div className="space-y-3">
              {section.dos.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="material-symbols-outlined text-on-secondary-container text-[18px]">
                    check
                  </span>
                  <Typography
                    variant="bodyMedium"
                    className="text-on-secondary-container/90 leading-relaxed"
                  >
                    {item}
                  </Typography>
                </div>
              ))}
            </div>
          </Surface>
          <Surface tone="errorContainer" rounded="sm" className="p-5 @2xl:p-6">
            <Typography
              variant="titleMedium"
              component="h3"
              className="text-on-error-container mb-4"
            >
              Avoid
            </Typography>
            <div className="space-y-3">
              {section.donts.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="material-symbols-outlined text-on-error-container text-[18px]">
                    close
                  </span>
                  <Typography
                    variant="bodyMedium"
                    className="text-on-error-container/90 leading-relaxed"
                  >
                    {item}
                  </Typography>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      );

    case 'showcase':
      return (
        <Surface tone="surfaceContainerLow" rounded="sm" className="overflow-hidden p-5 @2xl:p-6">
          {section.content}
        </Surface>
      );

    case 'links':
      return (
        <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
          {section.items.map((item) => (
            <StaticDocCard key={item.href} item={item} />
          ))}
        </div>
      );
  }
}

export function StaticDocPageLayout({ doc }: { doc: StaticDocPage }) {
  const toc: TocItem[] = doc.sections.map((section) => ({
    id: section.id,
    label: section.tocLabel ?? section.title,
  }));

  return (
    <DocLayout
      title={doc.title}
      description={doc.description}
      heroContent={doc.heroVisual}
      heroPreview={doc.heroPreview}
      toc={toc}
    >
      {doc.sections.map((section) => (
        <DocSection
          key={section.id}
          id={section.id}
          title={section.title}
          description={section.description}
        >
          {renderStaticDocSection(section)}
        </DocSection>
      ))}

      {doc.related && doc.related.length > 0 ? (
        <DocSection
          id="related"
          title="Related"
          description="Explore adjacent docs and deeper implementation references."
        >
          <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
            {doc.related.map((item) => (
              <StaticDocCard key={item.href} item={item} />
            ))}
          </div>
        </DocSection>
      ) : null}
    </DocLayout>
  );
}
