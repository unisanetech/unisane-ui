"use client";

import type { ChoosingTableDef } from "@/lib/docs/registry/types";
import { Surface, Typography } from "@unisane/ui";
import { cn } from "@unisane/ui/lib/utils";

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
    emphasis: choosing.columns?.emphasis || "Level of emphasis",
    component: choosing.columns?.component || "Component",
    rationale: choosing.columns?.rationale || "Rationale",
    examples: choosing.columns?.examples || "Example actions",
  };

  const hasExamples = choosing.rows.some((row) => row.examples);

  return (
    <div className={cn("w-full", className)}>
      <Surface
        tone="surfaceContainerLowest"
        rounded="sm"
        className="@2xl:hidden overflow-hidden"
      >
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
        tone="surfaceContainerLowest"
        rounded="sm"
        className="hidden @2xl:block overflow-x-auto"
      >
        <table className="w-full text-body-medium">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-5 py-4 text-left text-label-medium font-semibold text-on-surface">
                {columns.emphasis}
              </th>
              <th className="px-5 py-4 text-left text-label-medium font-semibold text-on-surface">
                {columns.component}
              </th>
              <th className="px-5 py-4 text-left text-label-medium font-semibold text-on-surface">
                {columns.rationale}
              </th>
              {hasExamples && (
                <th className="px-5 py-4 text-left text-label-medium font-semibold text-on-surface">
                  {columns.examples}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {choosing.rows.map((row, index) => (
              <tr
                key={index}
                className="border-b border-outline-variant last:border-none hover:bg-surface-container-low/50 transition-colors"
              >
                <td className="px-5 py-4 text-body-medium font-medium text-on-surface">
                  {row.emphasis}
                </td>
                <td className="px-5 py-4">{row.component}</td>
                <td className="px-5 py-4 text-body-small text-on-surface-variant leading-relaxed">
                  {row.rationale}
                </td>
                {hasExamples && (
                  <td className="px-5 py-4 text-body-small text-on-surface-variant font-medium">
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
    <div
      className={cn(
        "py-4 @sm:px-5 @sm:py-5",
        !isLast && "border-b border-outline-variant"
      )}
    >
      <div className="mb-3 @sm:mb-4">
        <Typography variant="labelSmall" component="p" className="text-on-surface-variant">
          {columns.emphasis}
        </Typography>
        <Typography
          variant="titleSmall"
          component="p"
          className="mt-1 text-primary"
        >
          {row.emphasis}
        </Typography>
      </div>

      <div className="mb-3 @sm:mb-4">
        <Typography variant="labelSmall" component="p" className="text-on-surface-variant">
          {columns.component}
        </Typography>
        <div className="mt-1 text-body-medium text-on-surface">{row.component}</div>
      </div>

      <div className={hasExamples && row.examples ? "mb-3 @sm:mb-4" : ""}>
        <Typography variant="labelSmall" component="p" className="text-on-surface-variant">
          {columns.rationale}
        </Typography>
        <Typography
          variant="bodySmall"
          component="p"
          className="mt-1 text-on-surface-variant leading-relaxed"
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
            className="mt-1 text-on-surface-variant font-medium"
          >
            {row.examples}
          </Typography>
        </div>
      )}
    </div>
  );
}
