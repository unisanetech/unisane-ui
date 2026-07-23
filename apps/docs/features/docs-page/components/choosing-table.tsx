'use client';

import type { ChoosingTableDef } from '@/lib/docs/registry/types';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';

interface ChoosingTableProps {
  choosing: ChoosingTableDef;
  className?: string;
}

interface ChoosingRow {
  emphasis: string;
  component: React.ReactNode;
  rationale: string;
  examples?: string;
}

interface ColumnLabels {
  emphasis: string;
  component: string;
  rationale: string;
  examples: string;
}

/**
 * Responsive choosing table that displays as:
 * - Cards on mobile (< @2xl / 672px)
 * - Traditional table on larger screens
 */
export function ChoosingTable({ choosing, className }: ChoosingTableProps) {
  const columns: ColumnLabels = {
    emphasis: choosing.columns?.emphasis || 'Level of emphasis',
    component: choosing.columns?.component || 'Component',
    rationale: choosing.columns?.rationale || 'Rationale',
    examples: choosing.columns?.examples || 'Example actions',
  };

  const hasExamples = choosing.rows.some((row) => row.examples);

  return (
    <div className={cn('w-full', className)}>
      <Surface tone="surfaceContainerLow" rounded="sm" className="overflow-visible @2xl:hidden">
        {choosing.rows.map((row, index) => (
          <ChoosingCard
            key={index}
            row={row}
            columns={columns}
            hasExamples={hasExamples}
            isLast={index === choosing.rows.length - 1}
          />
        ))}
      </Surface>

      {/* ─── Desktop: Table Layout ───────────────────────────────────────────── */}
      <Surface
        tone="surfaceContainerLow"
        rounded="sm"
        className="hidden overflow-visible @2xl:block"
      >
        <table className="text-body-medium w-full">
          <thead>
            <tr className="bg-surface-container-low border-outline-variant border-b">
              <th className="text-label-medium text-on-surface px-5 py-4 text-left font-semibold">
                {columns.emphasis}
              </th>
              <th className="text-label-medium text-on-surface px-5 py-4 text-left font-semibold">
                {columns.component}
              </th>
              <th className="text-label-medium text-on-surface px-5 py-4 text-left font-semibold">
                {columns.rationale}
              </th>
              {hasExamples && (
                <th className="text-label-medium text-on-surface px-5 py-4 text-left font-semibold">
                  {columns.examples}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {choosing.rows.map((row, index) => (
              <tr
                key={index}
                className="border-outline-variant hover:bg-surface-container-low border-b transition-colors last:border-none"
              >
                <td className="text-body-medium text-on-surface px-5 py-4 font-medium">
                  {row.emphasis}
                </td>
                <td className="px-5 py-4">
                  <div className="max-w-full overflow-visible">{row.component}</div>
                </td>
                <td className="text-body-small text-on-surface-variant px-5 py-4 leading-relaxed">
                  {row.rationale}
                </td>
                {hasExamples && (
                  <td className="text-body-small text-on-surface-variant px-5 py-4 font-medium">
                    {row.examples}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Surface>
    </div>
  );
}

/**
 * Individual choosing card for mobile view
 */
function ChoosingCard({
  row,
  columns,
  hasExamples,
  isLast,
}: {
  row: ChoosingRow;
  columns: ColumnLabels;
  hasExamples: boolean;
  isLast: boolean;
}) {
  return (
    <div className={cn('py-4 @sm:px-5 @sm:py-5', !isLast && 'border-outline-variant border-b')}>
      <div className="mb-3 @sm:mb-4">
        <Typography variant="labelSmall" component="p" className="text-on-surface-variant">
          {columns.emphasis}
        </Typography>
        <Typography variant="titleSmall" component="p" className="text-primary mt-1">
          {row.emphasis}
        </Typography>
      </div>

      <div className="mb-3 @sm:mb-4">
        <Typography variant="labelSmall" component="p" className="text-on-surface-variant">
          {columns.component}
        </Typography>
        <div className="text-body-medium text-on-surface mt-1 max-w-full overflow-visible">
          {row.component}
        </div>
      </div>

      <div className={hasExamples && row.examples ? 'mb-3 @sm:mb-4' : ''}>
        <Typography variant="labelSmall" component="p" className="text-on-surface-variant">
          {columns.rationale}
        </Typography>
        <Typography
          variant="bodySmall"
          component="p"
          className="text-on-surface-variant mt-1 leading-relaxed"
        >
          {row.rationale}
        </Typography>
      </div>

      {hasExamples && row.examples && (
        <div>
          <Typography variant="labelSmall" component="p" className="text-on-surface-variant">
            {columns.examples}
          </Typography>
          <Typography
            variant="bodySmall"
            component="p"
            className="text-on-surface-variant mt-1 font-medium"
          >
            {row.examples}
          </Typography>
        </div>
      )}
    </div>
  );
}
