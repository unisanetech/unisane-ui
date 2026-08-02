'use client';

import React, { memo } from 'react';
import type { RefObject } from 'react';
import { cn } from '@unisane/ui/utils';
import { Checkbox } from '@unisane/ui/checkbox';
import type {
  Column,
  ColumnGroup,
  SortDirection,
  MultiSortState,
  PinPosition,
  ColumnMetaMap,
  ColumnMenuAction,
  ColumnMenuActionContext,
  FilterValue,
} from '../../types';
import { isColumnGroup } from '../../types';
import {
  DENSITY_STYLES,
  DENSITY_UTILITY_COLUMN_WIDTHS,
  ROW_HEIGHT_BASE,
  type Density,
} from '../../constants';
import { useColumnDrag } from '../../hooks/ui/use-column-drag';
import { useI18n } from '../../i18n';
import { first, last, safeArrayAccess } from '../../utils/type-guards';
import { HeaderCell } from './header-cell';
import { GroupHeaderRow } from './group-header-row';

// Re-export sub-components for direct use
export { ResizeHandle } from './resize-handle';
export { ColumnMenu } from './column-menu';
export { HeaderCell } from './header-cell';
export { GroupHeaderRow } from './group-header-row';
export { SortControl } from './sort-control';

// ─── HEADER PROPS ───────────────────────────────────────────────────────────

export interface DataTableHeaderProps<T> {
  /** Flattened leaf columns for rendering cells */
  columns: Column<T>[];
  /** Original column definitions (may include groups) */
  columnDefinitions?: Array<Column<T> | ColumnGroup<T>>;
  /** Whether column groups exist */
  hasGroups?: boolean;
  /** Multi-sort state */
  sortState: MultiSortState;
  /** Sort handler - receives key and whether Shift was held (for multi-sort) */
  onSort: (key: string, addToMultiSort?: boolean) => void;
  columnMeta: ColumnMetaMap;
  getEffectivePinPosition: (col: Column<T>) => PinPosition;
  selectable: boolean;
  allSelected: boolean;
  indeterminate: boolean;
  onSelectAll: (checked: boolean) => void;
  showColumnBorders: boolean;
  enableExpansion: boolean;
  density?: Density;
  // Column features
  resizable?: boolean;
  pinnable?: boolean;
  reorderable?: boolean;
  columnVisibility?: boolean;
  onColumnPin?: (key: string, position: PinPosition) => void;
  onColumnResize?: (key: string, width: number) => void;
  onColumnHide?: (key: string) => void;
  onColumnFilter?: (key: string, value: FilterValue | null) => void;
  onColumnReorder?: (fromKey: string, toKey: string) => void;
  getColumnMenuActions?: (context: ColumnMenuActionContext<T>) => ColumnMenuAction<T>[];
  columnFilters?: Record<string, FilterValue>;
  /** Whether grouping is enabled */
  groupingEnabled?: boolean;
  /** Current column(s) being grouped by (supports multi-level) */
  groupBy?: string | string[] | null;
  /** Normalized array of groupBy keys */
  groupByArray?: string[];
  /** Callback to set groupBy column(s) - replaces current grouping */
  onGroupBy?: (key: string | string[] | null) => void;
  /** Callback to add a column to multi-level grouping */
  onAddGroupBy?: (key: string) => void;
  /** Whether row drag-to-reorder is enabled */
  reorderableRows?: boolean;
  /** Whether the header should stick while the page scrolls */
  sticky?: boolean;
  /** Top offset for sticky positioning */
  stickyOffset?: string;
  /** Header participates in page-owned sticky overlay positioning. */
  pageSticky?: boolean;
  /** Header element used by page-owned sticky positioning. */
  headerRef?: RefObject<HTMLTableSectionElement | null>;
}

// ─── HEADER COMPONENT ───────────────────────────────────────────────────────

function DataTableHeaderInner<T extends { id: string }>({
  columns,
  columnDefinitions,
  hasGroups = false,
  sortState,
  onSort,
  columnMeta,
  getEffectivePinPosition,
  selectable,
  allSelected,
  indeterminate,
  onSelectAll,
  showColumnBorders,
  enableExpansion,
  density = 'standard',
  resizable = false,
  pinnable = false,
  reorderable = false,
  columnVisibility = true,
  onColumnPin,
  onColumnResize,
  onColumnHide,
  onColumnFilter,
  onColumnReorder,
  getColumnMenuActions,
  columnFilters = {},
  groupingEnabled = false,
  groupBy,
  groupByArray = [],
  onGroupBy,
  onAddGroupBy,
  reorderableRows = false,
  sticky = false,
  stickyOffset = '0px',
  pageSticky = false,
  headerRef,
}: DataTableHeaderProps<T>) {
  const { t } = useI18n();
  const paddingClass = DENSITY_STYLES[density];
  const utilityColumnWidths = DENSITY_UTILITY_COLUMN_WIDTHS[density];

  // Column drag-to-reorder
  const { getDragProps, isDraggingColumn, isDropTarget, getDropPosition } = useColumnDrag({
    enabled: reorderable,
    onReorder: (fromKey, toKey) => onColumnReorder?.(fromKey, toKey),
  });

  // Helper to get sort info from sortState
  const getSortInfo = (
    key: string,
  ): {
    isSorted: boolean;
    direction: SortDirection;
    priority: number | null;
  } => {
    const index = sortState.findIndex((s) => s.key === key);
    const sortItem = safeArrayAccess(sortState, index);
    if (!sortItem) {
      return { isSorted: false, direction: null, priority: null };
    }
    return {
      isSorted: true,
      direction: sortItem.direction,
      priority: sortState.length > 1 ? index + 1 : null,
    };
  };

  // Get columns that are children of groups (for second row when groups exist)
  const groupChildColumns =
    hasGroups && columnDefinitions
      ? columnDefinitions.flatMap((def) => (isColumnGroup(def) ? def.children : []))
      : [];

  // Determine pinned column info for border logic
  const columnsToRender = hasGroups ? groupChildColumns : columns;
  const pinnedLeftColumns = columnsToRender.filter(
    (col) => getEffectivePinPosition(col) === 'left',
  );
  const pinnedRightColumns = columnsToRender.filter(
    (col) => getEffectivePinPosition(col) === 'right',
  );
  const hasPinnedLeftData = pinnedLeftColumns.length > 0;
  const lastPinnedLeft = last(pinnedLeftColumns);
  const lastPinnedLeftKey = lastPinnedLeft ? String(lastPinnedLeft.key) : null;
  const firstPinnedRight = first(pinnedRightColumns);
  const firstPinnedRightKey = firstPinnedRight ? String(firstPinnedRight.key) : null;

  return (
    <thead
      ref={headerRef}
      className={cn('bg-surface', sticky && 'sticky z-30', pageSticky && 'relative z-30')}
      data-page-sticky={pageSticky || undefined}
      style={sticky ? { top: stickyOffset } : undefined}
    >
      {/* Group header row (only if groups exist) */}
      {hasGroups && columnDefinitions && (
        <GroupHeaderRow
          columnDefinitions={columnDefinitions}
          selectable={selectable}
          enableExpansion={enableExpansion}
          showColumnBorders={showColumnBorders}
          paddingClass={paddingClass}
          hasPinnedLeftData={hasPinnedLeftData}
          density={density}
        />
      )}

      {/* Main header row (or child columns row if groups exist) */}
      <tr aria-rowindex={hasGroups ? 2 : 1} style={{ height: ROW_HEIGHT_BASE[density] }}>
        {/* Drag handle column - scrolls with content, not sticky */}
        {reorderableRows && (
          <th
            className={cn(
              'bg-surface border-outline-weak border-b',
              showColumnBorders && 'border-outline-weak border-r',
            )}
            style={{
              width: utilityColumnWidths.dragHandle,
              minWidth: utilityColumnWidths.dragHandle,
              maxWidth: utilityColumnWidths.dragHandle,
            }}
          >
            <span className="sr-only">Reorder rows</span>
          </th>
        )}

        {/* Checkbox column - only render if no groups (groups use rowSpan) */}
        {selectable && !hasGroups && (
          <th
            className={cn(
              'bg-surface border-outline-weak border-b',
              // Sticky positioning with z-index for proper stacking (only on tablet+)
              'left-0 isolate z-30 @md:sticky',
              showColumnBorders && 'border-outline-weak border-r',
            )}
            style={{
              width: utilityColumnWidths.checkbox,
              minWidth: utilityColumnWidths.checkbox,
              maxWidth: utilityColumnWidths.checkbox,
            }}
          >
            <div className="flex h-full items-center justify-center">
              <Checkbox
                checked={allSelected}
                indeterminate={indeterminate}
                onChange={(e) => onSelectAll(e.target.checked)}
                aria-label={t('selectAll')}
                size="sm"
              />
            </div>
          </th>
        )}

        {/* Checkbox for group mode (needs to be in second row too for proper alignment) */}
        {selectable && hasGroups && (
          <th
            className={cn(
              'bg-surface border-outline-weak border-b',
              // Sticky positioning with z-index for proper stacking (only on tablet+)
              'left-0 isolate z-30 @md:sticky',
              showColumnBorders && 'border-outline-weak border-r',
            )}
            style={{
              width: utilityColumnWidths.checkbox,
              minWidth: utilityColumnWidths.checkbox,
              maxWidth: utilityColumnWidths.checkbox,
            }}
          >
            <div className="flex h-full items-center justify-center">
              <Checkbox
                checked={allSelected}
                indeterminate={indeterminate}
                onChange={(e) => onSelectAll(e.target.checked)}
                aria-label={t('selectAll')}
                size="sm"
              />
            </div>
          </th>
        )}

        {/* Expander column - only render if no groups */}
        {enableExpansion && !hasGroups && (
          <th
            className={cn(
              'bg-surface border-outline-weak border-b',
              // Sticky positioning with z-index for proper stacking (only on tablet+)
              'isolate z-30 @md:sticky',
              showColumnBorders && 'border-outline-weak border-r',
            )}
            style={{
              width: utilityColumnWidths.expander,
              minWidth: utilityColumnWidths.expander,
              maxWidth: utilityColumnWidths.expander,
              // Position after checkbox if selectable, otherwise at 0
              left: selectable ? utilityColumnWidths.checkbox : 0,
            }}
          >
            <span className="sr-only">Expand row</span>
          </th>
        )}

        {/* Data columns - render group children if groups exist, otherwise all columns */}
        {(hasGroups ? groupChildColumns : columns).map((col, index) => {
          const key = String(col.key);
          const meta = columnMeta[key];
          const sortInfo = getSortInfo(key);
          const isSortable = col.sortable !== false;
          const pinPosition = getEffectivePinPosition(col);
          const columnsToCheck = hasGroups ? groupChildColumns : columns;
          const isLastColumn = index === columnsToCheck.length - 1;

          // Only allow reordering non-pinned columns
          const canReorder = reorderable && col.reorderable !== false && !pinPosition;

          return (
            <HeaderCell
              key={key}
              column={col}
              meta={meta}
              isSorted={sortInfo.isSorted}
              sortDirection={sortInfo.direction}
              sortPriority={sortInfo.priority}
              isSortable={isSortable}
              pinPosition={pinPosition}
              isLastColumn={isLastColumn}
              paddingClass={paddingClass}
              showColumnBorders={showColumnBorders}
              resizable={resizable}
              pinnable={pinnable}
              columnVisibility={columnVisibility}
              onSort={(e) => onSort(key, e.shiftKey)}
              onPin={(position) => onColumnPin?.(key, position)}
              onResize={(colKey, width) => onColumnResize?.(colKey, width)}
              onHide={() => onColumnHide?.(key)}
              onFilter={(value) => onColumnFilter?.(key, value)}
              getColumnMenuActions={getColumnMenuActions}
              currentFilter={columnFilters[key]}
              isLastPinnedLeft={key === lastPinnedLeftKey}
              isFirstPinnedRight={key === firstPinnedRightKey}
              dragProps={canReorder ? getDragProps(key) : undefined}
              isDragging={canReorder && isDraggingColumn(key)}
              isDropTarget={canReorder && isDropTarget(key)}
              dropPosition={canReorder ? getDropPosition(key) : null}
              groupingEnabled={groupingEnabled}
              groupBy={groupBy}
              groupByArray={groupByArray}
              onGroupBy={onGroupBy}
              onAddGroupBy={onAddGroupBy}
              reorderableRows={reorderableRows}
              density={density}
            />
          );
        })}
      </tr>
    </thead>
  );
}

export const DataTableHeader = memo(DataTableHeaderInner) as typeof DataTableHeaderInner;
