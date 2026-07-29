'use client';

import React, { memo } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@unisane/ui/utils';
import { Icon } from '@unisane/ui/icon';
import type { Column, PinPosition, ColumnMetaMap } from '../types/index';
import {
  DENSITY_ICON_TEXT_STYLES,
  DENSITY_STYLES,
  DENSITY_UTILITY_COLUMN_WIDTHS,
  type Density,
} from '../constants/index';
import { useI18n } from '../i18n';
import { getNestedValue } from '../utils/get-nested-value';

// ─── SUMMARY TYPES ───────────────────────────────────────────────────────────

export type SummaryCalculation = 'sum' | 'average' | 'count' | 'min' | 'max';

export interface SummaryValue {
  value: number | string | null;
  formattedValue: string;
  type: SummaryCalculation | 'custom';
}

// ─── UTILITY FUNCTIONS ───────────────────────────────────────────────────────

/**
 * Calculate a summary value for a column
 */
export function calculateSummary<T extends object>(
  data: T[],
  columnKey: string,
  calculation: SummaryCalculation,
): number | null {
  const values = data
    .map((row) => {
      const val = getNestedValue(row, columnKey);
      return typeof val === 'number' ? val : null;
    })
    .filter((v): v is number => v !== null);

  if (values.length === 0) return null;

  switch (calculation) {
    case 'sum':
      return values.reduce((acc, v) => acc + v, 0);
    case 'average':
      return values.reduce((acc, v) => acc + v, 0) / values.length;
    case 'count':
      return values.length;
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
    default:
      return null;
  }
}

/**
 * Format a summary value for display
 * Note: For locale-aware formatting, use the formatNumber from useI18n hook
 */
export function formatSummaryValue(
  value: number | null,
  calculation: SummaryCalculation,
  formatNumber?: (value: number) => string,
): string {
  if (value === null) return '—';

  const formatter = formatNumber ?? ((v: number) => v.toLocaleString());

  switch (calculation) {
    case 'count':
      return formatter(value);
    case 'average':
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    case 'sum':
    case 'min':
    case 'max':
    default:
      return value.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      });
  }
}

/**
 * Get i18n key for summary type label
 */
function getSummaryLabelKey(
  type: SummaryCalculation,
): 'summaryTotal' | 'summaryAverage' | 'summaryCount' | 'summaryMin' | 'summaryMax' {
  switch (type) {
    case 'sum':
      return 'summaryTotal';
    case 'average':
      return 'summaryAverage';
    case 'count':
      return 'summaryCount';
    case 'min':
      return 'summaryMin';
    case 'max':
      return 'summaryMax';
  }
}

// ─── SUMMARY ROW PROPS ───────────────────────────────────────────────────────

export interface SummaryRowProps<T extends object> {
  /** Data to calculate summaries from */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Column metadata for positioning */
  columnMeta: ColumnMetaMap;
  /** Get effective pin position for a column */
  getEffectivePinPosition: (col: Column<T>) => PinPosition;
  /** Whether selection checkbox column is shown */
  selectable: boolean;
  /** Whether expansion column is shown */
  enableExpansion: boolean;
  /** Whether to show column borders */
  showColumnBorders: boolean;
  /** Row density */
  density?: Density;
  /** Label for the summary row (defaults to "Summary") */
  label?: string;
  /** Whether this is the last pinned left column */
  lastPinnedLeftKey?: string | null;
  /** Whether this is the first pinned right column */
  firstPinnedRightKey?: string | null;
  /** Custom summary renderer for specific columns */
  customSummaryRenderer?: Record<string, (data: T[]) => ReactNode>;
  /** Whether row reordering is enabled (adds drag handle column) */
  reorderableRows?: boolean;
}

// ─── SUMMARY CELL ────────────────────────────────────────────────────────────

interface SummaryCellProps<T extends object> {
  column: Column<T>;
  data: T[];
  meta: ColumnMetaMap[string] | undefined;
  pinPosition: PinPosition;
  paddingClass: string;
  showColumnBorders: boolean;
  isLastColumn: boolean;
  isLastPinnedLeft: boolean;
  isFirstPinnedRight: boolean;
  customRenderer?: (data: T[]) => ReactNode;
}

function SummaryCell<T extends object>({
  column,
  data,
  meta,
  pinPosition,
  paddingClass,
  showColumnBorders,
  isLastColumn,
  isLastPinnedLeft,
  isFirstPinnedRight,
  customRenderer,
}: SummaryCellProps<T>) {
  const { t, formatNumber } = useI18n();
  const summaryType = column.summary;
  const columnKey = String(column.key);

  // Render content
  let content: ReactNode = null;

  if (customRenderer) {
    // Use custom renderer if provided
    content = customRenderer(data);
  } else if (typeof summaryType === 'function') {
    // Use column-defined custom function
    content = summaryType(data);
  } else if (summaryType) {
    // Use built-in calculation
    const value = calculateSummary(data, columnKey, summaryType);
    const formatted = formatSummaryValue(value, summaryType, formatNumber);
    const label = t(getSummaryLabelKey(summaryType));

    content = (
      <div className="flex items-center gap-1.5">
        <span className="text-label-small text-on-surface-variant">{label}:</span>
        <span className="text-label-small text-on-surface font-semibold">{formatted}</span>
      </div>
    );
  }

  return (
    <td
      className={cn(
        'bg-surface-container-low border-outline-medium border-t-2',
        'text-on-surface whitespace-nowrap',
        paddingClass,
        column.align === 'center' && 'text-center',
        column.align === 'end' && 'text-right',
        column.align !== 'center' && column.align !== 'end' && 'text-left',
        // Pinned styling
        pinPosition ? 'sticky isolate z-10' : 'z-0',
        // Column borders
        showColumnBorders && !isLastColumn && !pinPosition && 'border-outline-weak border-r',
        showColumnBorders && isLastPinnedLeft && 'border-outline-weak border-r',
        showColumnBorders && isFirstPinnedRight && 'border-outline-weak border-l',
      )}
      style={{
        width: meta?.width,
        minWidth: meta?.width,
        maxWidth: meta?.width,
        left: pinPosition === 'left' ? meta?.left : undefined,
        right: pinPosition === 'right' ? meta?.right : undefined,
        boxShadow:
          pinPosition === 'left'
            ? '4px 0 8px -3px rgb(0 0 0 / var(--data-table-pin-shadow-left-alpha, 0))'
            : pinPosition === 'right'
              ? '-4px 0 8px -3px rgb(0 0 0 / var(--data-table-pin-shadow-right-alpha, 0))'
              : undefined,
      }}
    >
      {content}
    </td>
  );
}

// ─── SUMMARY ROW COMPONENT ───────────────────────────────────────────────────

function SummaryRowInner<T extends { id: string }>({
  data,
  columns,
  columnMeta,
  getEffectivePinPosition,
  selectable,
  enableExpansion,
  showColumnBorders,
  density = 'standard',
  label,
  lastPinnedLeftKey,
  firstPinnedRightKey,
  customSummaryRenderer = {},
  reorderableRows = false,
}: SummaryRowProps<T>) {
  const { t } = useI18n();
  const paddingClass = DENSITY_STYLES[density];
  const iconTextClass = DENSITY_ICON_TEXT_STYLES[density];
  const utilityColumnWidths = DENSITY_UTILITY_COLUMN_WIDTHS[density];
  const effectiveLabel = label ?? t('summary');

  // Check if any column has summary defined
  const hasSummary = columns.some((col) => col.summary || customSummaryRenderer[String(col.key)]);

  if (!hasSummary || data.length === 0) {
    return null;
  }

  // Calculate sticky offsets for drag handle, checkbox and expander columns
  const dragHandleWidth = reorderableRows ? utilityColumnWidths.dragHandle : 0;
  const checkboxWidth = selectable ? utilityColumnWidths.checkbox : 0;

  // Determine which cell should show the icon
  // Priority: drag handle > checkbox > expander
  // Only the first available cell shows the icon
  const showIconInDragHandle = reorderableRows;
  const showIconInCheckbox = selectable && !reorderableRows;
  const showIconInExpander = enableExpansion && !selectable && !reorderableRows;

  return (
    <tr className="bg-surface-container-low">
      {/* Drag handle placeholder */}
      {reorderableRows && (
        <td
          className={cn(
            'bg-surface-container-low border-outline-medium border-t-2',
            'sticky left-0 isolate z-10',
          )}
          style={{
            width: utilityColumnWidths.dragHandle,
            minWidth: utilityColumnWidths.dragHandle,
            maxWidth: utilityColumnWidths.dragHandle,
          }}
        >
          {showIconInDragHandle && (
            <div className="flex h-full items-center justify-center">
              <Icon symbol="functions" className={cn('text-primary', iconTextClass)} />
            </div>
          )}
        </td>
      )}

      {/* Checkbox placeholder */}
      {selectable && (
        <td
          className={cn(
            'bg-surface-container-low border-outline-medium border-t-2',
            'sticky isolate z-10',
            showColumnBorders && 'border-outline-weak border-r',
          )}
          style={{
            width: utilityColumnWidths.checkbox,
            minWidth: utilityColumnWidths.checkbox,
            maxWidth: utilityColumnWidths.checkbox,
            left: dragHandleWidth,
          }}
        >
          {showIconInCheckbox && (
            <div className="flex h-full items-center justify-center">
              <Icon symbol="functions" className={cn('text-primary', iconTextClass)} />
            </div>
          )}
        </td>
      )}

      {/* Expander placeholder */}
      {enableExpansion && (
        <td
          className={cn(
            'bg-surface-container-low border-outline-medium border-t-2',
            'sticky isolate z-10',
            showColumnBorders && 'border-outline-weak border-r',
          )}
          style={{
            width: utilityColumnWidths.expander,
            minWidth: utilityColumnWidths.expander,
            maxWidth: utilityColumnWidths.expander,
            left: dragHandleWidth + checkboxWidth,
          }}
        >
          {showIconInExpander && (
            <div className="flex h-full items-center justify-center">
              <Icon symbol="functions" className={cn('text-primary', iconTextClass)} />
            </div>
          )}
        </td>
      )}

      {/* Data columns */}
      {columns.map((col, index) => {
        const key = String(col.key);
        const meta = columnMeta[key];
        const pinPosition = getEffectivePinPosition(col);
        const isLastColumn = index === columns.length - 1;

        // Check for custom renderer
        const customRenderer = customSummaryRenderer[key];

        // Show label in first data column that doesn't have a summary
        // The icon is shown in checkbox/expander cells, so we only need the text label here
        const isFirstColumn = index === 0;
        const hasNoSummary = !col.summary && !customRenderer;
        const needsLabelInFirstCol = isFirstColumn && hasNoSummary;

        // If this is the first column and it has no summary, show the label
        if (needsLabelInFirstCol) {
          return (
            <td
              key={key}
              className={cn(
                'bg-surface-container-low border-outline-medium border-t-2',
                paddingClass,
                pinPosition ? 'sticky isolate z-10' : 'z-0',
                showColumnBorders &&
                  !isLastColumn &&
                  !pinPosition &&
                  'border-outline-weak border-r',
                showColumnBorders && key === lastPinnedLeftKey && 'border-outline-weak border-r',
                showColumnBorders && key === firstPinnedRightKey && 'border-outline-weak border-l',
              )}
              style={{
                width: meta?.width,
                minWidth: meta?.width,
                maxWidth: meta?.width,
                left: pinPosition === 'left' ? meta?.left : undefined,
                right: pinPosition === 'right' ? meta?.right : undefined,
                boxShadow:
                  pinPosition === 'left'
                    ? '4px 0 8px -3px rgb(0 0 0 / var(--data-table-pin-shadow-left-alpha, 0))'
                    : pinPosition === 'right'
                      ? '-4px 0 8px -3px rgb(0 0 0 / var(--data-table-pin-shadow-right-alpha, 0))'
                      : undefined,
              }}
            >
              <span className="text-label-small text-on-surface font-semibold">
                {effectiveLabel}
              </span>
            </td>
          );
        }

        return (
          <SummaryCell
            key={key}
            column={col}
            data={data}
            meta={meta}
            pinPosition={pinPosition}
            paddingClass={paddingClass}
            showColumnBorders={showColumnBorders}
            isLastColumn={isLastColumn}
            isLastPinnedLeft={key === lastPinnedLeftKey}
            isFirstPinnedRight={key === firstPinnedRightKey}
            customRenderer={customRenderer}
          />
        );
      })}
    </tr>
  );
}

export const SummaryRow = memo(SummaryRowInner) as typeof SummaryRowInner;
