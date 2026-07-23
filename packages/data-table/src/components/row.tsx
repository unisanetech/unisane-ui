'use client';

import React, {
  memo,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { cn } from '@unisane/ui/utils';
import { Icon } from '@unisane/ui/icon';
import { Checkbox } from '@unisane/ui/checkbox';
import { IconButton } from '@unisane/ui/icon-button';
import type {
  Column,
  PinPosition,
  ColumnMetaMap,
  CellContext,
  InlineEditingController,
  CellSelectionContext,
  RowActivationEvent,
} from '../types/index';
import type { RowDragProps } from '../hooks/ui/use-row-drag';
import { getNestedValue } from '../utils/get-nested-value';
import { first, last } from '../utils/type-guards';
import {
  DENSITY_CELL_TEXT_STYLES,
  DENSITY_ICON_TEXT_STYLES,
  DENSITY_STYLES,
  DENSITY_UTILITY_COLUMN_WIDTHS,
  type Density,
  createCellId,
} from '../constants/index';
import { useI18n } from '../i18n';
import { DragHandle } from './drag-handle';
import { HighlightedText } from './highlighted-text';
import { getRowBackgroundClass } from './row-state';

// ─── ROW PROPS ──────────────────────────────────────────────────────────────

interface DataTableRowProps<T> {
  row: T;
  rowIndex: number;
  columns: Column<T>[];
  columnMeta: ColumnMetaMap;
  getEffectivePinPosition: (col: Column<T>) => PinPosition;
  isSelected: boolean;
  isExpanded: boolean;
  isActive: boolean;
  isLastRow: boolean;
  selectable: boolean;
  showColumnBorders: boolean;
  zebra: boolean;
  enableExpansion: boolean;
  canExpand: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onToggleExpand: (id: string) => void;
  onRowClick?: (row: T, activation: RowActivationEvent) => void;
  /** Callback when row is right-clicked (context menu) */
  onRowContextMenu?: (row: T, event: React.MouseEvent) => void;
  /** Callback when a cell is right-clicked (context menu) */
  onCellContextMenu?: (
    row: T,
    rowIndex: number,
    column: Column<T>,
    columnKey: string,
    value: unknown,
    event: React.MouseEvent,
  ) => void;
  onRowHover?: (row: T | null) => void;
  density?: Density;
  /** Virtualization: inline styles for absolute positioning */
  style?: CSSProperties;
  /** Virtualization: data-index for measurement */
  'data-index'?: number;
  /** Virtualization: ref callback for dynamic row measurement */
  rowRef?: (node: HTMLTableRowElement | null) => void;
  /** Keyboard navigation: whether this row is focused */
  isFocused?: boolean;
  /** Inline editing controller */
  inlineEditing?: InlineEditingController<T>;
  /** Depth level for row indentation in grouped data (used for visual hierarchy) */
  groupDepth?: number;
  /** Cell selection: whether cell selection is enabled */
  cellSelectionEnabled?: boolean;
  /** Cell selection: get cell selection context for a specific cell */
  getCellSelectionContext?: (rowId: string, columnKey: string) => CellSelectionContext;
  /** Cell selection: handle cell click */
  onCellClick?: (rowId: string, columnKey: string, event: React.MouseEvent) => void;
  /** Cell selection: handle keyboard navigation */
  onCellKeyDown?: (event: React.KeyboardEvent) => void;
  /** Row reordering: whether drag-to-reorder is enabled */
  reorderableRows?: boolean;
  /** Row reordering: whether this row is being dragged */
  isDragging?: boolean;
  /** Row reordering: whether this row is a drop target */
  isDropTarget?: boolean;
  /** Row reordering: drop position relative to this row */
  dropPosition?: 'before' | 'after' | null;
  /** Row reordering: drag props for the row element */
  rowDragProps?: RowDragProps;
  /** Row reordering: drag handle props */
  dragHandleProps?: {
    onMouseDown: (e: React.MouseEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    tabIndex: number;
    role: string;
    'aria-label': string;
    'aria-grabbed': boolean | undefined;
  };
  /** Search text for highlighting matching content */
  searchText?: string;
}

// ─── ROW COMPONENT ──────────────────────────────────────────────────────────

function DataTableRowInner<T extends { id: string }>({
  row,
  rowIndex,
  columns,
  columnMeta,
  getEffectivePinPosition,
  isSelected,
  isExpanded,
  isActive,
  isLastRow,
  selectable,
  showColumnBorders,
  zebra,
  enableExpansion,
  canExpand,
  onSelect,
  onToggleExpand,
  onRowClick,
  onRowContextMenu,
  onCellContextMenu,
  onRowHover,
  density = 'standard',
  style,
  'data-index': dataIndex,
  rowRef,
  isFocused = false,
  inlineEditing,
  groupDepth = 0,
  cellSelectionEnabled = false,
  getCellSelectionContext,
  onCellClick,
  onCellKeyDown,
  reorderableRows = false,
  isDragging = false,
  isDropTarget = false,
  dropPosition = null,
  rowDragProps,
  dragHandleProps,
  searchText,
}: DataTableRowProps<T>) {
  void groupDepth;
  const { t } = useI18n();
  const isOddRow = rowIndex % 2 === 1;
  const paddingClass = DENSITY_STYLES[density];
  const cellTextClass = DENSITY_CELL_TEXT_STYLES[density];
  const iconTextClass = DENSITY_ICON_TEXT_STYLES[density];
  const utilityColumnWidths = DENSITY_UTILITY_COLUMN_WIDTHS[density];

  // State for showing "not editable" tooltip on non-editable cells
  const [notEditableCell, setNotEditableCell] = useState<string | null>(null);

  // Clear the tooltip after a delay
  useEffect(() => {
    if (notEditableCell) {
      const timer = setTimeout(() => setNotEditableCell(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [notEditableCell]);

  // Show "not editable" feedback when user tries to edit a non-editable cell
  const showNotEditableFeedback = useCallback((columnKey: string) => {
    setNotEditableCell(columnKey);
  }, []);

  // Determine pinned column info for border logic
  const pinnedLeftColumns = columns.filter((col) => getEffectivePinPosition(col) === 'left');
  const pinnedRightColumns = columns.filter((col) => getEffectivePinPosition(col) === 'right');
  const lastPinnedLeft = last(pinnedLeftColumns);
  const lastPinnedLeftKey = lastPinnedLeft ? String(lastPinnedLeft.key) : null;
  const firstPinnedRight = first(pinnedRightColumns);
  const firstPinnedRightKey = firstPinnedRight ? String(firstPinnedRight.key) : null;

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target;
    // Don't trigger row click if clicking on interactive elements
    if (target instanceof HTMLElement) {
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('[role="checkbox"]')
      ) {
        return;
      }
    }
    onRowClick?.(row, { source: 'mouse', event: e });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (onRowContextMenu) {
      e.preventDefault();
      onRowContextMenu(row, e);
    }
  };

  const bgClass = getRowBackgroundClass({
    isSelected,
    isActive,
    isFocused,
    zebra,
    isOddRow,
  });

  // Sticky cell background - includes drop target state
  const getStickyBgClass = () => {
    if (isDropTarget) return 'bg-state-selected';
    return bgClass;
  };
  const stickyBgClass = getStickyBgClass();

  return (
    <>
      <tr
        ref={rowRef}
        onClick={onRowClick ? handleRowClick : undefined}
        onContextMenu={onRowContextMenu ? handleContextMenu : undefined}
        onMouseEnter={onRowHover ? () => onRowHover(row) : undefined}
        onMouseLeave={onRowHover ? () => onRowHover(null) : undefined}
        className={cn(
          'group/row group duration-snappy transition-colors',
          bgClass,
          onRowClick && 'cursor-pointer',
          !isSelected && !isActive && 'hover:bg-surface-container-low',
          // Elevate row slightly on hover so tooltips appear above other rows
          // z-[5] is lower than sticky header (z-20) so row won't overlap header
          'hover:z-[5]',
          isFocused && 'ring-focus-ring ring-1 ring-inset',
          // Drag state styling
          isDragging && 'scale-[0.98] opacity-50',
          // Drop target highlight
          isDropTarget && 'bg-state-selected',
        )}
        style={style}
        data-index={dataIndex}
        aria-selected={isSelected || isFocused}
        aria-rowindex={rowIndex + 2}
        id={`data-table-row-${row.id}`}
        {...rowDragProps}
      >
        {/* Drag handle column - fixed utility width, scrolls with content */}
        {reorderableRows && (
          <td
            className={cn(
              'relative',
              bgClass,
              !isSelected && !isActive && !isDropTarget && 'group-hover:bg-surface-container-low',
              'transition-colors',
              !isLastRow && 'border-outline-subtle border-b',
              showColumnBorders && 'border-outline-subtle border-r',
            )}
            style={{
              width: utilityColumnWidths.dragHandle,
              minWidth: utilityColumnWidths.dragHandle,
              maxWidth: utilityColumnWidths.dragHandle,
            }}
          >
            {/* Drop indicator line - spans full table width */}
            {isDropTarget && dropPosition && (
              <div
                className={cn(
                  'pointer-events-none absolute left-0 z-50',
                  'bg-primary h-0.5',
                  dropPosition === 'before' ? 'top-0 -translate-y-1/2' : 'bottom-0 translate-y-1/2',
                )}
                style={{ width: 'calc(100vw - var(--scrollbar-width, 0px))', maxWidth: '9999px' }}
                aria-hidden="true"
              >
                {/* Circle indicator at the start */}
                <div className="bg-primary border-surface absolute top-1/2 left-0 h-2 w-2 -translate-y-1/2 rounded-full border-2" />
              </div>
            )}
            <div className="flex h-full items-center justify-center">
              <DragHandle size="sm" isDragging={isDragging} {...dragHandleProps} />
            </div>
          </td>
        )}

        {/* Checkbox column - NO padding, fixed utility width */}
        {selectable && (
          <td
            className={cn(
              // z-[15] to stay above pinned data columns (z-10) but below sticky header (z-20)
              'left-0 isolate z-[15] @md:sticky',
              stickyBgClass,
              !isSelected && !isActive && !isDropTarget && 'group-hover:bg-surface-container-low',
              'transition-colors',
              !isLastRow && 'border-outline-subtle border-b',
              showColumnBorders && 'border-outline-subtle border-r',
            )}
            style={{
              width: utilityColumnWidths.checkbox,
              minWidth: utilityColumnWidths.checkbox,
              maxWidth: utilityColumnWidths.checkbox,
            }}
          >
            <div className="flex h-full items-center justify-center">
              <Checkbox
                checked={isSelected}
                onChange={() => onSelect(row.id, !isSelected)}
                aria-label={t('selectRowLabel', { id: row.id })}
                size="sm"
              />
            </div>
          </td>
        )}

        {/* Expander column - NO padding, fixed utility width */}
        {enableExpansion && (
          <td
            className={cn(
              // z-[15] to stay above pinned data columns (z-10) but below sticky header (z-20)
              'isolate z-[15] text-center @md:sticky',
              stickyBgClass,
              !isSelected && !isActive && !isDropTarget && 'group-hover:bg-surface-container-low',
              'transition-colors',
              !isLastRow && 'border-outline-subtle border-b',
              showColumnBorders && 'border-outline-subtle border-r',
            )}
            style={{
              width: utilityColumnWidths.expander,
              minWidth: utilityColumnWidths.expander,
              maxWidth: utilityColumnWidths.expander,
              // Position after checkbox if selectable, otherwise at 0
              left: selectable ? utilityColumnWidths.checkbox : 0,
            }}
          >
            {canExpand && (
              <IconButton
                onClick={() => onToggleExpand(row.id)}
                variant="standard"
                size="sm"
                selected={isExpanded}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? t('collapseRow') : t('expandRow')}
                icon={
                  <Icon
                    symbol={isExpanded ? 'expand_less' : 'expand_more'}
                    className={cn(iconTextClass, 'transition-transform')}
                  />
                }
              />
            )}
          </td>
        )}

        {/* Data cells */}
        {columns.map((col, colIndex) => {
          const key = String(col.key);
          const meta = columnMeta[key];
          const pinPosition = getEffectivePinPosition(col);
          const isLastColumn = colIndex === columns.length - 1;

          // Get cell value
          const rawValue = getNestedValue(row, key);

          // Create cell context
          const cellContext: CellContext<T> = {
            row,
            rowIndex,
            columnKey: key,
            value: rawValue,
            isSelected,
            isExpanded,
          };

          // Check if this cell is editable and currently being edited
          const isEditable = col.editable && inlineEditing;
          const isEditing = isEditable && inlineEditing?.isCellEditing(row.id, key);

          // Check if this is an actions column (needs overflow-visible for dropdown)
          const isActionsColumn = key.startsWith('__actions');
          const editProps = isEditable
            ? inlineEditing?.getCellEditProps(row.id, key, rawValue)
            : null;

          // Get cell selection context if enabled
          const cellSelectionCtx =
            cellSelectionEnabled && getCellSelectionContext
              ? getCellSelectionContext(row.id, key)
              : null;

          // Render content
          let content: ReactNode;
          if (isEditing && inlineEditing) {
            const inputProps = inlineEditing.getInputProps();
            const inputType = col.inputType ?? 'text';
            content = (
              <>
                <input
                  {...inputProps}
                  type={inputType}
                  step={inputType === 'number' ? 'any' : undefined}
                  className={cn(
                    'absolute inset-0 h-full w-full',
                    cellTextClass,
                    'bg-surface text-on-surface border-2',
                    'focus:outline-none',
                    col.align === 'center' && 'text-center',
                    col.align === 'end' && 'pr-4 text-right',
                    col.align !== 'center' && col.align !== 'end' && 'pl-4 text-left',
                    inlineEditing.validationError ? 'border-error' : 'border-primary',
                  )}
                />
                {inlineEditing.validationError && (
                  <div
                    id={inlineEditing.getErrorMessageId()}
                    role="alert"
                    className="text-label-small text-error bg-error-container absolute top-full left-0 z-[5] mt-1 rounded px-2 py-0.5 whitespace-nowrap"
                  >
                    {inlineEditing.validationError}
                  </div>
                )}
              </>
            );
          } else {
            // Render cell content with optional search highlighting
            const renderContent = col.render
              ? col.render(row, cellContext)
              : (rawValue as ReactNode);

            // Apply search highlighting to string content when searchText is provided
            // Only highlight if there's no custom render (custom renders handle their own highlighting)
            if (searchText && !col.render && typeof rawValue === 'string' && rawValue.length > 0) {
              content = <HighlightedText text={rawValue} searchTerm={searchText} enabled={true} />;
            } else {
              content = renderContent;
            }
          }

          // Handle cell click for cell selection
          const handleCellClick = (e: React.MouseEvent) => {
            const wasCellActive = Boolean(cellSelectionCtx?.isActive);
            const wasCellSelected = Boolean(cellSelectionCtx?.isSelected);

            if (cellSelectionEnabled && onCellClick) {
              e.stopPropagation(); // Prevent row click
              onCellClick(row.id, key, e);
            }

            if (isEditable) {
              editProps?.onClick?.({
                isCellActive: wasCellActive,
                isCellSelected: wasCellSelected,
              });
            }
          };

          // Combined keyboard handler: cell selection takes priority, then inline editing
          const handleCellKeyDown = (e: React.KeyboardEvent) => {
            // Cell selection keyboard handler takes priority
            if (cellSelectionEnabled && onCellKeyDown) {
              onCellKeyDown(e);
              // If cell selection handled it (e.g., navigation keys), don't pass to inline editing
              if (e.defaultPrevented) return;
            }
            // Then inline editing (Enter to start edit, etc.)
            if (isEditable) {
              editProps?.onKeyDown?.(e);
            } else if (inlineEditing && !col.editable) {
              // Show "not editable" feedback when user tries to edit a non-editable cell
              const isEditAttempt =
                e.key === 'Enter' ||
                e.key === 'F2' ||
                ((e.metaKey || e.ctrlKey) && e.key === 'e') ||
                (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey);
              if (isEditAttempt) {
                showNotEditableFeedback(key);
              }
            }
          };

          // Handle double-click for non-editable cells
          const handleDoubleClick = () => {
            if (isEditable) {
              editProps?.onDoubleClick?.();
            } else if (inlineEditing && !col.editable) {
              // Show feedback when user tries to edit a non-editable cell
              showNotEditableFeedback(key);
            }
          };

          // Check if this cell should show the "not editable" tooltip
          const showNotEditableTooltip = notEditableCell === key;

          // Width is handled by colgroup - only set left/right for pinned columns
          return (
            <td
              key={key}
              className={cn(
                'text-on-surface whitespace-nowrap',
                cellTextClass,
                // Actions columns need overflow-visible for dropdown, others use overflow-hidden
                // Use group-hover/row to allow overflow on hover for tooltips
                isActionsColumn
                  ? 'overflow-visible'
                  : 'overflow-hidden text-ellipsis group-hover/row:overflow-visible',
                // Pinned cells use stickyBgClass for drop target state, others use bgClass
                pinPosition ? stickyBgClass : bgClass,
                !isSelected && !isActive && !isDropTarget && 'group-hover:bg-surface-container-low',
                'transition-colors',
                !isLastRow && 'border-outline-subtle border-b',
                col.align === 'center' && 'text-center',
                col.align === 'end' && 'text-right',
                col.align !== 'center' && col.align !== 'end' && 'text-left',
                // Pinned columns: sticky with z-10 (below header z-20) (shadow applied via inline style)
                // Only enable sticky on tablet+ (≥768px container width) - mobile scrolls everything together
                // Actions columns skip 'isolate' to allow dropdown to escape stacking context
                pinPosition && !isActionsColumn && 'isolate z-10 @md:sticky',
                pinPosition && isActionsColumn && 'z-10 @md:sticky',
                // Column borders: show on non-pinned columns (except last), and on last pinned-left column
                showColumnBorders &&
                  !isLastColumn &&
                  !pinPosition &&
                  'border-outline-subtle border-r',
                showColumnBorders &&
                  pinPosition === 'left' &&
                  key === lastPinnedLeftKey &&
                  'border-outline-subtle border-r',
                showColumnBorders &&
                  pinPosition === 'right' &&
                  key === firstPinnedRightKey &&
                  'border-outline-subtle border-l',
                paddingClass,
                isEditable && !isEditing && 'cursor-cell',
                isEditing && 'relative z-[3] overflow-visible !p-0',
                !isEditing && isActionsColumn && 'z-[3] overflow-visible',
                showNotEditableTooltip && 'relative overflow-visible',
                // Cell selection styling
                cellSelectionEnabled && 'cursor-cell select-none',
                cellSelectionCtx?.isSelected &&
                  'bg-secondary-container text-on-secondary-container',
                cellSelectionCtx?.isActive &&
                  'bg-primary-container text-on-primary-container ring-focus-ring ring-1 ring-inset',
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
              onClick={cellSelectionEnabled || isEditable ? handleCellClick : undefined}
              onDoubleClick={inlineEditing || editProps ? handleDoubleClick : undefined}
              onContextMenu={
                onCellContextMenu
                  ? (event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onCellContextMenu(row, rowIndex, col, key, rawValue, event);
                    }
                  : undefined
              }
              onKeyDown={
                cellSelectionEnabled || isEditable || inlineEditing ? handleCellKeyDown : undefined
              }
              tabIndex={isEditable || cellSelectionEnabled ? 0 : undefined}
              data-cell-id={
                cellSelectionEnabled || isEditable ? createCellId(row.id, key) : undefined
              }
            >
              {content}
              {/* "Not editable" tooltip */}
              {showNotEditableTooltip && (
                <div
                  role="tooltip"
                  className="text-label-small text-on-surface-variant bg-surface-container-high shadow-1 animate-in fade-in slide-in-from-top-1 absolute top-full left-1/2 z-50 mt-1 -translate-x-1/2 rounded px-2 py-1 whitespace-nowrap duration-150"
                >
                  {t('cellNotEditable')}
                </div>
              )}
            </td>
          );
        })}
      </tr>
    </>
  );
}

interface DataTableExpandedRowProps<T> {
  row: T;
  columns: Column<T>[];
  selectable: boolean;
  showColumnBorders: boolean;
  enableExpansion: boolean;
  density?: Density;
  reorderableRows?: boolean;
  isLastRow?: boolean;
  rowRef?: (node: HTMLTableRowElement | null) => void;
  'data-index'?: number;
  renderExpandedRow: (row: T) => ReactNode;
}

function DataTableExpandedRowInner<T extends { id: string }>({
  row,
  columns,
  selectable,
  showColumnBorders,
  enableExpansion,
  density = 'standard',
  reorderableRows = false,
  isLastRow = false,
  rowRef,
  'data-index': dataIndex,
  renderExpandedRow,
}: DataTableExpandedRowProps<T>) {
  const utilityColumnWidths = DENSITY_UTILITY_COLUMN_WIDTHS[density];

  return (
    <tr
      ref={rowRef}
      className="bg-surface-container-lowest animate-in slide-in-from-top-1 duration-snappy"
      data-index={dataIndex}
    >
      {reorderableRows && (
        <td
          className={cn(
            'bg-surface-container-lowest',
            !isLastRow && 'border-outline-subtle border-b',
          )}
          style={{
            width: utilityColumnWidths.dragHandle,
            minWidth: utilityColumnWidths.dragHandle,
            maxWidth: utilityColumnWidths.dragHandle,
          }}
        />
      )}
      {selectable && (
        <td
          className={cn(
            'bg-surface-container-lowest left-0 isolate z-10 @md:sticky',
            !isLastRow && 'border-outline-subtle border-b',
            showColumnBorders && 'border-outline-subtle border-r',
          )}
          style={{
            width: utilityColumnWidths.checkbox,
            minWidth: utilityColumnWidths.checkbox,
            maxWidth: utilityColumnWidths.checkbox,
          }}
        />
      )}
      {enableExpansion && (
        <td
          className={cn(
            'bg-surface-container-lowest isolate z-10 @md:sticky',
            !isLastRow && 'border-outline-subtle border-b',
            showColumnBorders && 'border-outline-subtle border-r',
          )}
          style={{
            left: selectable ? utilityColumnWidths.checkbox : 0,
            width: utilityColumnWidths.expander,
            minWidth: utilityColumnWidths.expander,
            maxWidth: utilityColumnWidths.expander,
          }}
        />
      )}
      <td
        colSpan={columns.length}
        className={cn('p-0', !isLastRow && 'border-outline-subtle border-b')}
      >
        <div className="border-primary bg-surface border-l-4 p-4">{renderExpandedRow(row)}</div>
      </td>
    </tr>
  );
}

/**
 * Memoized row component with optimized comparison.
 *
 * We compare:
 * 1. Row data and state (must re-render if changed)
 * 2. Visual config props (density, zebra, etc.)
 * 3. Structural props (columns, columnMeta)
 *
 * We intentionally skip comparing callback props (onSelect, onRowClick, etc.)
 * because:
 * - They should be stable references from parent (via useCallback)
 * - If parent re-renders, row will re-render anyway
 * - Comparing function references is cheap (===) but often causes false negatives
 */
export const DataTableRow = memo(DataTableRowInner, (prev, next) => {
  // Fast path: if row data changed, definitely re-render
  if (prev.row !== next.row) return false;

  // Row state changes
  if (
    prev.isSelected !== next.isSelected ||
    prev.isExpanded !== next.isExpanded ||
    prev.isActive !== next.isActive ||
    prev.isFocused !== next.isFocused
  ) {
    return false;
  }

  // Position and index changes
  if (
    prev.rowIndex !== next.rowIndex ||
    prev.isLastRow !== next.isLastRow ||
    prev['data-index'] !== next['data-index']
  ) {
    return false;
  }

  // Visual configuration changes
  if (
    prev.density !== next.density ||
    prev.zebra !== next.zebra ||
    prev.selectable !== next.selectable ||
    prev.showColumnBorders !== next.showColumnBorders ||
    prev.cellSelectionEnabled !== next.cellSelectionEnabled ||
    prev.reorderableRows !== next.reorderableRows ||
    prev.groupDepth !== next.groupDepth
  ) {
    return false;
  }

  // Drag state changes (high-frequency updates during drag)
  if (
    prev.isDragging !== next.isDragging ||
    prev.isDropTarget !== next.isDropTarget ||
    prev.dropPosition !== next.dropPosition
  ) {
    return false;
  }

  // Structural changes (reference equality is intentional - parent should memoize)
  if (
    prev.columns !== next.columns ||
    prev.columnMeta !== next.columnMeta ||
    prev.style !== next.style
  ) {
    return false;
  }

  // Inline editing controller change (reference check)
  if (prev.inlineEditing !== next.inlineEditing) {
    return false;
  }

  // Cell selection handlers/context changes must re-render so selected/active
  // cell visuals and click-to-edit state stay in sync.
  if (
    prev.getCellSelectionContext !== next.getCellSelectionContext ||
    prev.onCellClick !== next.onCellClick ||
    prev.onCellKeyDown !== next.onCellKeyDown
  ) {
    return false;
  }

  // All checks passed - props are equal
  return true;
}) as typeof DataTableRowInner;

export const DataTableExpandedRow = memo(
  DataTableExpandedRowInner,
) as typeof DataTableExpandedRowInner;
