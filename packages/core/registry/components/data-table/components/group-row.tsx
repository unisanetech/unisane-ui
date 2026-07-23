'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Checkbox } from '@/components/ui/checkbox';
import type { RowGroup, GroupHeaderProps, Column } from '@/components/ui/data-table/types/index';
import {
  DENSITY_CELL_TEXT_STYLES,
  DENSITY_ICON_TEXT_STYLES,
  DENSITY_STYLES,
  type Density,
} from '@/components/ui/data-table/constants/index';
import { useI18n } from '@/components/ui/data-table/i18n';

// ─── GROUP ROW PROPS ─────────────────────────────────────────────────────────

export interface GroupRowProps<T extends { id: string }> {
  /** The group data */
  group: RowGroup<T>;
  /** Column definitions for calculating colSpan */
  columns: Column<T>[];
  /** Whether selection is enabled (adds checkbox column) */
  selectable: boolean;
  /** Whether expansion is enabled (adds expand column) */
  enableExpansion: boolean;
  /** Toggle group expand/collapse */
  onToggle: () => void;
  /** Row density */
  density?: Density;
  /** Custom group header renderer */
  renderGroupHeader?: (props: GroupHeaderProps<T>) => React.ReactNode;
  /** Style for virtualized positioning */
  style?: React.CSSProperties;
  /** Whether this is the last group */
  isLastGroup?: boolean;
  /** Currently selected row IDs (for group selection state) */
  selectedRows?: Set<string>;
  /** Callback to select/deselect rows in this group */
  onSelectGroup?: (rowIds: string[], selected: boolean) => void;
}

// ─── DEFAULT GROUP HEADER ────────────────────────────────────────────────────

function DefaultGroupHeader<T>({
  groupLabel,
  rowCount,
  isExpanded,
  aggregations,
  depth,
}: GroupHeaderProps<T> & { groupByKey?: string }) {
  const { t, formatNumber } = useI18n();
  // Handle empty group case
  const isEmpty = rowCount === 0;

  return (
    <div className="flex items-center gap-3">
      {/* Group label */}
      <span
        className={cn(
          'text-on-surface font-semibold',
          depth > 0 && 'text-body-medium',
          isEmpty && 'text-on-surface-variant italic',
        )}
      >
        {groupLabel}
      </span>

      {/* Row count badge */}
      <span
        className={cn(
          'text-label-small rounded-full px-2 py-0.5',
          isEmpty
            ? 'bg-surface-container-low text-on-surface-variant'
            : 'bg-surface-container text-on-surface-variant',
        )}
      >
        {isEmpty
          ? t('groupEmpty')
          : rowCount === 1
            ? `1 ${t('groupItemSingular')}`
            : t('groupItemPlural', { count: formatNumber(rowCount) })}
      </span>

      {/* Aggregations (if any and not empty) */}
      {!isEmpty && aggregations && Object.keys(aggregations).length > 0 && (
        <div className="text-label-small text-on-surface-variant ml-4 flex items-center gap-2">
          {Object.entries(aggregations).map(([key, value]) => (
            <span key={key} className="flex items-center gap-1">
              <span className="opacity-60">{key}:</span>
              <span className="font-medium">
                {typeof value === 'number' ? formatNumber(value) : String(value ?? '-')}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Expand indicator text - only show if there are items to expand */}
      {!isEmpty && (
        <span className="text-label-small text-on-surface-variant ml-auto">
          {isExpanded ? t('collapseGroup') : t('expandGroup')}
        </span>
      )}
    </div>
  );
}

// ─── GROUP ROW COMPONENT ─────────────────────────────────────────────dont────

export function GroupRow<T extends { id: string }>({
  group,
  columns,
  selectable,
  enableExpansion,
  onToggle,
  density = 'standard',
  renderGroupHeader,
  style,
  isLastGroup = false,
  selectedRows,
  onSelectGroup,
}: GroupRowProps<T>) {
  const { t } = useI18n();
  const paddingClass = DENSITY_STYLES[density];
  const cellTextClass = DENSITY_CELL_TEXT_STYLES[density];
  const iconTextClass = DENSITY_ICON_TEXT_STYLES[density];

  // Calculate total colSpan
  // +1 for checkbox if selectable, +1 for expand if enableExpansion
  const totalColumns = columns.length + (selectable ? 1 : 0) + (enableExpansion ? 1 : 0);

  // Calculate group selection state
  const groupRowIds = group.rows.map((row) => row.id);
  const selectedCount = selectedRows ? groupRowIds.filter((id) => selectedRows.has(id)).length : 0;
  const allSelected = selectedCount === group.rows.length && group.rows.length > 0;
  const someSelected = selectedCount > 0 && selectedCount < group.rows.length;

  // Handle group checkbox click
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger row expand/collapse
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelectGroup?.(groupRowIds, e.target.checked);
  };

  // Build props for custom renderer
  const headerProps: GroupHeaderProps<T> = {
    groupValue: group.groupValue,
    groupLabel: group.groupLabel,
    rowCount: group.rows.length,
    isExpanded: group.isExpanded,
    onToggle,
    rows: group.rows,
    aggregations: group.aggregations,
    depth: group.depth,
  };

  // Calculate left padding based on depth (16px base + 24px per level)
  const depthPadding = 16 + group.depth * 24;

  return (
    <tr
      className={cn(
        'group duration-snappy cursor-pointer transition-colors',
        group.depth === 0
          ? 'bg-surface-container-low hover:bg-surface-container'
          : 'bg-surface-container-lowest hover:bg-surface-container-low',
        !isLastGroup && 'border-outline-subtle border-b',
      )}
      style={style}
      onClick={onToggle}
      role="row"
      aria-expanded={group.isExpanded}
    >
      <td
        colSpan={totalColumns}
        className={cn('text-left', paddingClass, cellTextClass)}
        style={{ paddingLeft: depthPadding }}
      >
        <div className="flex items-center gap-2">
          {/* Group selection checkbox */}
          {selectable && onSelectGroup && (
            <div onClick={handleCheckboxClick}>
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={handleCheckboxChange}
                aria-label={t('selectGroupRows', {
                  count: group.rows.length,
                  label: group.groupLabel,
                })}
                size="sm"
              />
            </div>
          )}

          {/* Expand/collapse icon */}
          <span
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full',
              'text-on-surface-variant duration-snappy transition-transform',
              group.isExpanded && 'rotate-90',
            )}
          >
            <Icon symbol="chevron_right" className={iconTextClass} />
          </span>

          {/* Group header content */}
          <div className="min-w-0 flex-1">
            {renderGroupHeader ? (
              renderGroupHeader(headerProps)
            ) : (
              <DefaultGroupHeader {...headerProps} />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default GroupRow;
