import { Badge, Button, Card, Pagination, Surface, Typography } from '@unisane/ui';
import type { PatternPageDoc } from './types';
import { dataPatternMeta as meta } from './pattern-page-meta';

const heroVisual = (
  <Surface tone="surface" rounded="sm" className="h-full p-4">
    <div className="grid gap-3">
      <div className="border-outline-soft text-label-medium text-on-surface-variant grid grid-cols-[minmax(0,1.6fr)_120px_100px] gap-3 border-b pb-2">
        <span>Queue</span>
        <span>Status</span>
        <span>Owner</span>
      </div>
      {[
        ['Invoice review', 'Ready', 'Ops'],
        ['Billing handoff', 'Blocked', 'Finance'],
        ['Access issue', 'Review', 'Support'],
      ].map(([name, status, owner]) => (
        <div
          key={name}
          className="border-outline-weak grid grid-cols-[minmax(0,1.6fr)_120px_100px] items-center gap-3 border-b pb-3"
        >
          <Typography variant="bodyMedium">{name}</Typography>
          <Surface
            tone={
              status === 'Ready'
                ? 'primaryContainer'
                : status === 'Blocked'
                  ? 'errorContainer'
                  : 'surfaceContainerHigh'
            }
            rounded="full"
            className="inline-flex w-fit px-2.5 py-1"
          >
            <Typography
              variant="labelMedium"
              className={
                status === 'Ready'
                  ? 'text-on-primary-container'
                  : status === 'Blocked'
                    ? 'text-on-error-container'
                    : 'text-on-surface'
              }
            >
              {status}
            </Typography>
          </Surface>
          <Typography variant="bodySmall" className="text-on-surface-variant">
            {owner}
          </Typography>
        </div>
      ))}
    </div>
  </Surface>
);

export const dataPatternPage: PatternPageDoc = {
  ...meta,
  heroVisual,
  heroPreview: { tone: 'surfaceContainerLow', minHeight: 'md', padding: 'md' },
  sections: [
    {
      type: 'blocks',
      id: 'blocks',
      title: 'Data blocks',
      description: 'Reusable data-heavy blocks for queues, review flows, and compact dashboards.',
      previewDefaults: {
        tone: 'surfaceContainerLowest',
        minHeight: 'xl',
        padding: 'md',
      },
      examples: [
        {
          id: 'review-queue-block',
          title: 'Review queue',
          description: 'A compact queue with status, owner, and lightweight next actions.',
          component: (
            <Card variant="outlined" className="w-full max-w-[40rem]">
              <Card.Header>
                <Card.Title>Review queue</Card.Title>
                <Card.Description>
                  Prioritized work ready for handoff and approval.
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-3">
                {[
                  ['Invoice review', 'Ready', 'Ops'],
                  ['Billing handoff', 'Blocked', 'Finance'],
                  ['Access issue', 'Review', 'Support'],
                ].map(([name, status, owner]) => (
                  <Surface
                    key={name}
                    tone="surfaceContainerLow"
                    rounded="sm"
                    className="grid grid-cols-[minmax(0,1.6fr)_100px_80px] items-center gap-3 p-3"
                  >
                    <Typography variant="bodyMedium">{name}</Typography>
                    <Badge variant="tonal">{status}</Badge>
                    <Typography variant="bodySmall" className="text-on-surface-variant">
                      {owner}
                    </Typography>
                  </Surface>
                ))}
              </Card.Content>
              <Card.Footer className="justify-between">
                <Pagination currentPage={2} totalPages={8} onPageChange={() => {}} />
                <Button variant="tonal" size="sm">
                  Open table
                </Button>
              </Card.Footer>
            </Card>
          ),
          code: `import { Badge, Button, Card, Pagination, Surface, Typography } from "@unisane/ui";

export function ReviewQueueBlock() {
  return (
    <Card variant="outlined">
      <Card.Header>
        <Card.Title>Review queue</Card.Title>
        <Card.Description>Prioritized work ready for handoff and approval.</Card.Description>
      </Card.Header>
      <Card.Content className="space-y-3">
        {[
          ["Invoice review", "Ready", "Ops"],
          ["Billing handoff", "Blocked", "Finance"],
          ["Access issue", "Review", "Support"],
        ].map(([name, status, owner]) => (
          <Surface
            key={name}
            tone="surfaceContainerLow"
            rounded="sm"
            className="grid grid-cols-[minmax(0,1.6fr)_100px_80px] items-center gap-3 p-3"
          >
            <Typography variant="bodyMedium">{name}</Typography>
            <Badge variant="tonal">{status}</Badge>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              {owner}
            </Typography>
          </Surface>
        ))}
      </Card.Content>
      <Card.Footer className="justify-between">
        <Pagination currentPage={2} totalPages={8} />
        <Button variant="tonal" size="sm">Open table</Button>
      </Card.Footer>
    </Card>
  );
}`,
        },
        {
          id: 'summary-card-blocks',
          title: 'Summary card cluster',
          description: 'High-signal metrics that sit above tables or task lists.',
          component: (
            <div className="grid w-full max-w-[36rem] grid-cols-3 gap-3">
              {[
                ['24', 'Ready'],
                ['8', 'Review'],
                ['3', 'Blocked'],
              ].map(([value, label], index) => (
                <Card key={label} variant={index === 0 ? 'high' : 'filled'} className="h-full">
                  <Card.Content className="space-y-2 py-5 text-center">
                    <Typography variant="headlineMedium">{value}</Typography>
                    <Typography variant="bodyMedium" className="text-on-surface-variant">
                      {label}
                    </Typography>
                  </Card.Content>
                </Card>
              ))}
            </div>
          ),
          code: `import { Card, Typography } from "@unisane/ui";

export function SummaryCardCluster() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        ["24", "Ready"],
        ["8", "Review"],
        ["3", "Blocked"],
      ].map(([value, label], index) => (
        <Card key={label} variant={index === 0 ? "high" : "filled"} className="h-full">
          <Card.Content className="space-y-2 py-5 text-center">
            <Typography variant="headlineMedium">{value}</Typography>
            <Typography variant="bodyMedium" className="text-on-surface-variant">
              {label}
            </Typography>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
}`,
        },
      ],
    },
    {
      type: 'grid',
      id: 'patterns',
      title: 'Common data surfaces',
      columns: 2,
      items: [
        {
          title: 'List + status',
          description: 'Fast scan surfaces for queues, inboxes, and review flows.',
          icon: 'view_list',
        },
        {
          title: 'Table',
          description: 'High-density structured data with sorting, selection, and actions.',
          icon: 'table_rows',
        },
        {
          title: 'Summary cards',
          description: 'KPI surfaces for overviews, metrics, and lightweight dashboards.',
          icon: 'dashboard',
        },
        {
          title: 'Detail pane',
          description: 'Focused contextual drill-down without leaving the current workflow.',
          icon: 'article',
        },
      ],
    },
    {
      type: 'links',
      id: 'components',
      title: 'Components and surfaces',
      items: [
        {
          title: 'Table',
          href: '/docs/components/table',
          description: 'Core table usage for standard product data surfaces.',
          icon: 'table_rows',
        },
        {
          title: 'List',
          href: '/docs/components/list',
          description: 'Queue and item surfaces for lighter structured data.',
          icon: 'view_list',
        },
        {
          title: 'Data Table Playground',
          href: '/datatable',
          description: 'Advanced dense data workflows and higher-complexity table patterns.',
          icon: 'table_chart',
        },
      ],
    },
  ],
};
