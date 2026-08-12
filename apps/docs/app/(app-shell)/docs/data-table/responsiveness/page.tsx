import { CodeBlock, DocLayout, DocSection } from '@/features/docs-page';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';

const toc = [
  { id: 'model', label: 'Responsive model' },
  { id: 'columns', label: 'Column visibility' },
  { id: 'scrolling', label: 'Scrolling and pinning' },
  { id: 'touch-accessibility', label: 'Touch and accessibility' },
  { id: 'testing', label: 'Testing' },
];

const responsiveRows = [
  {
    area: 'Table and toolbar',
    owner: 'Container width',
    behavior: 'Adapts to the space where the table is placed, including panels and split views.',
  },
  {
    area: 'Pinned columns',
    owner: '768px table container',
    behavior: 'Scrolls as one surface below the threshold and becomes sticky at wider sizes.',
  },
  {
    area: 'Horizontal scrollbar',
    owner: 'Input context',
    behavior:
      'Uses native touch scrolling on small screens and the package scrollbar on wider screens.',
  },
  {
    area: 'Column visibility',
    owner: 'Observed table width',
    behavior: 'Hides a column below its declared minVisibleWidth without relying on viewport size.',
  },
];

export default function DataTableResponsivenessPage() {
  return (
    <DocLayout
      title="Adaptive DataTable"
      description="Design tables around their available container, preserve essential data, and keep interaction usable across touch, keyboard, and wide-screen layouts."
      toc={toc}
    >
      <DocSection
        id="model"
        title="Responsive model"
        description="DataTable is container-first because the same table can appear full-width, inside a panel, or beside other content."
      >
        <div className="space-y-5">
          <div className="overflow-x-auto">
            <table className="border-outline-soft w-full min-w-[44rem] border-collapse overflow-hidden rounded border text-left">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="text-label-large px-4 py-3">Area</th>
                  <th className="text-label-large px-4 py-3">Responsive owner</th>
                  <th className="text-label-large px-4 py-3">Contract</th>
                </tr>
              </thead>
              <tbody>
                {responsiveRows.map((row) => (
                  <tr key={row.area} className="border-outline-weak border-t">
                    <td className="text-body-medium px-4 py-3 font-medium">{row.area}</td>
                    <td className="text-body-medium text-on-surface-variant px-4 py-3">
                      {row.owner}
                    </td>
                    <td className="text-body-medium text-on-surface-variant px-4 py-3">
                      {row.behavior}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Surface tone="surfaceContainerLow" rounded="sm" className="p-5">
            <Typography variant="bodyMedium" className="text-on-surface-variant leading-relaxed">
              Avoid page-specific media-query overrides for table internals. Application layout can
              respond to the viewport, but the reusable table responds to the width it actually
              receives.
            </Typography>
          </Surface>
        </div>
      </DocSection>

      <DocSection
        id="columns"
        title="Column visibility"
        description="Keep identity and primary actions available, then progressively reveal supporting columns as space grows."
      >
        <div className="space-y-5">
          <CodeBlock
            language="tsx"
            code={`const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email', minVisibleWidth: 600 },
  { key: 'role', header: 'Role', minVisibleWidth: 800 },
  { key: 'status', header: 'Status', minVisibleWidth: 1000 },
];`}
          />
          <Typography variant="bodyLarge" className="text-on-surface-variant leading-relaxed">
            <code>minVisibleWidth</code> is measured against the DataTable container. Do not hide a
            column only because of a device label, and do not remove information that is required to
            understand or operate on a row. Provide another accessible presentation when hidden data
            remains necessary.
          </Typography>
        </div>
      </DocSection>

      <DocSection
        id="scrolling"
        title="Scrolling and pinning"
        description="Horizontal overflow is expected for dense data; preserve one clear scroll owner and avoid trapping page scroll."
      >
        <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
          <Surface tone="surfaceContainerLow" rounded="sm" className="p-5">
            <Typography variant="titleMedium" component="h3" className="mb-2">
              Small containers
            </Typography>
            <Typography variant="bodyMedium" className="text-on-surface-variant leading-relaxed">
              Pinned cells scroll with the table so they do not consume most of the available width.
              Native horizontal scrolling remains available for touch discovery and momentum.
            </Typography>
          </Surface>
          <Surface tone="surfaceContainerLow" rounded="sm" className="p-5">
            <Typography variant="titleMedium" component="h3" className="mb-2">
              Wider containers
            </Typography>
            <Typography variant="bodyMedium" className="text-on-surface-variant leading-relaxed">
              Declared left and right pinned columns become sticky from the medium container
              threshold. The package-owned scrollbar stays synchronized with the table body.
            </Typography>
          </Surface>
        </div>
      </DocSection>

      <DocSection
        id="touch-accessibility"
        title="Touch and accessibility"
        description="Responsive presentation must retain the same operations and understandable relationships."
      >
        <ul className="text-body-large text-on-surface-variant list-disc space-y-3 pl-6 leading-relaxed">
          <li>Keep interactive targets at least 44 by 44 CSS pixels in touch layouts.</li>
          <li>Do not make hover the only way to discover row actions or supporting information.</li>
          <li>
            Preserve header and cell relationships, accessible names, and keyboard navigation.
          </li>
          <li>
            Keep selected, expanded, loading, empty, and error states perceivable at every width.
          </li>
          <li>
            When responsive hiding removes a column, ensure required information has another path.
          </li>
        </ul>
      </DocSection>

      <DocSection
        id="testing"
        title="Testing responsive behavior"
        description="Prove the component in constrained containers as well as common viewport sizes."
      >
        <ol className="text-body-large text-on-surface-variant list-decimal space-y-3 pl-6 leading-relaxed">
          <li>Exercise narrow phone-sized and embedded-panel containers.</li>
          <li>Cross the 768px container threshold with pinned columns enabled.</li>
          <li>
            Verify touch scrolling, keyboard operation, focus visibility, and screen-reader names.
          </li>
          <li>
            Check local and remote data, empty and error states, long content, and translated text.
          </li>
          <li>Run the DataTable package tests and the docs application browser/visual proof.</li>
        </ol>
      </DocSection>
    </DocLayout>
  );
}
