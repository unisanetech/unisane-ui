'use client';

import React, { useId } from 'react';
import { cn } from '@unisane/ui/utils';
import { Icon } from '@unisane/ui/icon';
import type {
  Column,
  SortDirection,
  PinPosition,
  ColumnMetaMap,
  ColumnMenuAction,
  ColumnMenuActionContext,
  FilterValue,
} from '../../types';
import { ResizeHandle } from './resize-handle';
import { ColumnMenu } from './column-menu';
import { SortControl } from './sort-control';
import { useI18n } from '../../i18n';
import {
  DENSITY_HEADER_ACTION_GROUP_STYLES,
  DENSITY_HEADER_TEXT_STYLES,
  type Density,
} from '../../constants';
import { formatFilterValue } from '../../utils/filter-value';

export interface HeaderCellProps<T> {
  column: Column<T>;
  meta: ColumnMetaMap[string] | undefined;
  isSorted: boolean;
  sortDirection: SortDirection;
  /** Sort priority for multi-sort (1, 2, 3...) or null if single-sort or not sorted */
  sortPriority?: number | null;
  isSortable: boolean;
  pinPosition: PinPosition;
  isLastColumn: boolean;
  paddingClass: string;
  showColumnBorders: boolean;
  resizable: boolean;
  pinnable: boolean;
  columnVisibility: boolean;
  onSort: (e: React.MouseEvent) => void;
  onPin: (position: PinPosition) => void;
  onResize: (key: string, width: number) => void;
  onHide: () => void;
  onFilter?: (value: FilterValue | null) => void;
  getColumnMenuActions?: (context: ColumnMenuActionContext<T>) => ColumnMenuAction<T>[];
  currentFilter?: FilterValue;
  /** Whether this is the last pinned-left column */
  isLastPinnedLeft?: boolean;
  /** Whether this is the first pinned-right column */
  isFirstPinnedRight?: boolean;
  /** Drag props for column reordering */
  dragProps?: {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  /** Whether this column is currently being dragged */
  isDragging?: boolean;
  /** Whether this column is a drop target */
  isDropTarget?: boolean;
  /** Drop position indicator */
  dropPosition?: 'before' | 'after' | null;
  /** Whether grouping is enabled */
  groupingEnabled?: boolean;
  /** Current column(s) being grouped by */
  groupBy?: string | string[] | null;
  /** Normalized array of groupBy keys */
  groupByArray?: string[];
  /** Callback to set groupBy column(s) */
  onGroupBy?: (key: string | string[] | null) => void;
  /** Callback to add a column to multi-level grouping */
  onAddGroupBy?: (key: string) => void;
  /** Whether row drag-to-reorder is enabled (affects sticky positioning) */
  reorderableRows?: boolean;
  /** Table density for text and control sizing */
  density?: Density;
}

export function HeaderCell<T>({
  column,
  meta,
  isSorted,
  sortDirection,
  sortPriority,
  isSortable,
  pinPosition,
  isLastColumn,
  paddingClass,
  showColumnBorders,
  resizable,
  pinnable,
  columnVisibility,
  onSort,
  onPin,
  onResize,
  onHide,
  onFilter,
  getColumnMenuActions,
  currentFilter,
  isLastPinnedLeft = false,
  isFirstPinnedRight = false,
  dragProps,
  isDragging = false,
  isDropTarget = false,
  dropPosition = null,
  groupingEnabled = false,
  groupBy,
  groupByArray = [],
  onGroupBy,
  onAddGroupBy,
  reorderableRows = false,
  density = 'standard',
}: HeaderCellProps<T>) {
  void reorderableRows;
  const { t } = useI18n();
  const headerTextClass = DENSITY_HEADER_TEXT_STYLES[density];
  const filterDescriptionId = useId();
  const columnKey = String(column.key);
  const columnMenuActionContext: ColumnMenuActionContext<T> = {
    column,
    columnKey,
    header: String(column.header),
    pinPosition,
  };
  const columnMenuActions =
    getColumnMenuActions?.(columnMenuActionContext).filter((action) => !action.hidden) ?? [];
  const hasFilterOptions = column.filterable !== false;
  const isHideable = columnVisibility && column.hideable !== false;
  // Grouping is only available for columns with explicit groupable: true OR columns with select filter (categorical data)
  const isGroupable =
    column.groupable === true || (column.groupable !== false && column.filterType === 'select');
  const hasMenu =
    hasFilterOptions ||
    (pinnable && column.pinnable !== false) ||
    isHideable ||
    (groupingEnabled && isGroupable) ||
    columnMenuActions.length > 0;

  const hasActiveFilter = currentFilter !== undefined;

  // Generate filter description for screen readers
  const filterDescription = hasActiveFilter
    ? t('filterBy', { column: String(column.header) }) + `: ${formatFilterValue(currentFilter)}`
    : undefined;

  return (
    <th
      className={cn(
        'group bg-surface border-outline-weak border-b',
        'text-on-surface-variant font-medium whitespace-nowrap',
        headerTextClass,
        'duration-snappy transition-colors',
        // Relative positioning is needed for the resize handle (absolute positioned)
        'relative align-middle',
        paddingClass,
        column.align === 'center' && 'text-center',
        column.align === 'end' && 'text-right',
        column.align !== 'center' && column.align !== 'end' && 'text-left',
        isSortable && 'hover:bg-surface-container-low select-none',
        // Draggable cursor when reorderable
        dragProps?.draggable && 'cursor-grab active:cursor-grabbing',
        // Pinned columns: sticky positioning with higher z-index to stay above non-pinned (only on tablet+)
        // Non-pinned columns get z-0 to ensure they stack below pinned columns (z-20)
        // Pinned columns use isolate to create proper stacking context
        pinPosition ? 'isolate z-20 @md:sticky' : 'z-0',
        // Column borders: show on non-pinned columns (except last), and on last pinned-left / first pinned-right
        showColumnBorders && !isLastColumn && !pinPosition && 'border-outline-weak border-r',
        showColumnBorders && isLastPinnedLeft && 'border-outline-weak border-r',
        showColumnBorders && isFirstPinnedRight && 'border-outline-weak border-l',
        // Drag state styling
        isDragging && 'opacity-50',
        isDropTarget && 'bg-state-selected',
      )}
      style={{
        left: pinPosition === 'left' ? meta?.left : undefined,
        right: pinPosition === 'right' ? meta?.right : undefined,
        // Pinned column elevation shadow
        boxShadow:
          pinPosition === 'left'
            ? '4px 0 6px -2px rgb(0 0 0 / var(--data-table-pin-shadow-left-alpha, 0))'
            : pinPosition === 'right'
              ? '-4px 0 6px -2px rgb(0 0 0 / var(--data-table-pin-shadow-right-alpha, 0))'
              : undefined,
      }}
      scope="col"
      aria-sort={isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
      aria-describedby={hasActiveFilter ? filterDescriptionId : undefined}
      // Use suppressHydrationWarning for draggable attribute since it changes post-hydration
      suppressHydrationWarning
      draggable={dragProps?.draggable || undefined}
      onDragStart={dragProps?.onDragStart}
      onDragEnd={dragProps?.onDragEnd}
      onDragOver={dragProps?.onDragOver}
      onDragEnter={dragProps?.onDragEnter}
      onDragLeave={dragProps?.onDragLeave}
      onDrop={dragProps?.onDrop}
    >
      {/* Hidden filter description for screen readers */}
      {hasActiveFilter && (
        <span id={filterDescriptionId} className="sr-only">
          {filterDescription}
        </span>
      )}
      {/* Main content area - text uses full width */}
      <div
        className={cn(
          'flex min-w-0 items-center gap-1.5',
          column.align === 'center' && 'justify-center',
          column.align === 'end' && 'justify-end',
        )}
      >
        {/* Header text - full width, no truncation by icons */}
        {column.headerRender ? (
          column.headerRender()
        ) : (
          <span className="truncate">{column.header}</span>
        )}

        {/* Persistent state indicators (always visible when active) */}
        <div className="flex shrink-0 items-center gap-0.5">
          {/* Filter active indicator */}
          {hasActiveFilter && (
            <span className="inline-flex h-[16px] w-[16px] items-center justify-center">
              <Icon symbol="filter_alt" className="text-primary text-[14px]" />
            </span>
          )}

          {/* Pin indicator */}
          {pinPosition && (
            <span className="inline-flex h-[14px] w-[14px] items-center justify-center">
              <Icon
                symbol="push_pin"
                className={cn(
                  'text-primary text-[12px]',
                  pinPosition === 'left' ? '-rotate-45' : 'rotate-45',
                )}
              />
            </span>
          )}
        </div>
      </div>

      {/* Hover actions - absolute positioned on right, uses surface-container-low for subtle elevation */}
      <div
        className={cn(
          'absolute top-1/2 flex -translate-y-1/2 items-center',
          DENSITY_HEADER_ACTION_GROUP_STYLES[density],
          'bg-surface-container rounded-sm',
          isSorted
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-auto opacity-0 group-focus-within:opacity-100 group-hover:opacity-100',
          'transition-opacity duration-150',
        )}
      >
        {/* Sort action button (only sort trigger) */}
        {isSortable && (
          <SortControl
            variant="action"
            density={density}
            isSorted={isSorted}
            sortDirection={sortDirection}
            sortPriority={sortPriority}
            onClick={onSort}
            ariaLabel={
              isSorted
                ? sortDirection === 'asc'
                  ? t('sortDescending')
                  : t('clearSort')
                : t('sortColumn')
            }
          />
        )}

        {/* Column menu trigger */}
        {hasMenu && (
          <ColumnMenu
            column={column}
            pinPosition={pinPosition}
            pinnable={pinnable}
            hideable={isHideable}
            currentFilter={currentFilter}
            hasActiveFilter={hasActiveFilter}
            onPin={onPin}
            onHide={onHide}
            onFilter={onFilter}
            actionContext={columnMenuActionContext}
            actions={columnMenuActions}
            groupingEnabled={groupingEnabled}
            groupBy={groupBy}
            groupByArray={groupByArray}
            onGroupBy={onGroupBy}
            onAddGroupBy={onAddGroupBy}
            density={density}
          />
        )}
      </div>

      {/* Resize handle */}
      {resizable && (
        <ResizeHandle
          columnKey={String(column.key)}
          currentWidth={meta?.width ?? 150}
          minWidth={column.minWidth}
          maxWidth={column.maxWidth}
          onResize={onResize}
        />
      )}

      {/* Drop position indicator */}
      {isDropTarget && dropPosition && (
        <div
          className={cn(
            'bg-primary absolute top-0 bottom-0 z-30 w-0.5',
            dropPosition === 'before' ? 'left-0' : 'right-0',
          )}
        />
      )}
    </th>
  );
}
