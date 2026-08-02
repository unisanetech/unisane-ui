'use client';

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import type { Column, ColumnGroup } from '@/components/ui/data-table/types/column';
import type { BulkAction } from '@/components/ui/data-table/types/features';
import type { DataTableErrorConfig, RowActivationEvent } from '@/components/ui/data-table/types/props';
import type {
  FeaturesConfig,
  LayoutConfig,
  VirtualizationConfig,
  PaginationConfig,
  EditingConfig,
  StylingConfig,
  CallbacksConfig,
  ControlledStateConfig,
  DataTablePreset,
  ExpandedRowConfig,
} from '@/components/ui/data-table/types/config';
import { getPresetConfig } from '@/components/ui/data-table/types/config';
import { DataTableProvider } from '@/components/ui/data-table/context/provider';
import { DataTableInner } from '@/components/ui/data-table/components/data-table-inner';
import { FeedbackProvider } from '@/components/ui/data-table/feedback';
import { useInlineEditing } from '@/components/ui/data-table/hooks/features/use-inline-editing';

// ─── DATA TABLE PROPS ─────────────────────────────────────────────────────────

/**
 * DataTable component props with grouped configuration objects.
 */
export interface DataTableProps<T extends { id: string }> {
  // ─── Required ───
  /** Data rows to display */
  data: T[];

  /**
   * Column definitions.
   *
   * **Performance Note:** Memoize your columns array to prevent unnecessary re-renders:
   * ```tsx
   * const columns = useMemo(() => [...], []);
   * ```
   */
  columns: Array<Column<T> | ColumnGroup<T>>;

  // ─── Preset ───
  /**
   * Preset configuration for common use cases.
   * Sets sensible defaults that can be overridden.
   *
   * - `"simple"`: Basic read-only table
   * - `"interactive"`: Selection, search, sorting (default)
   * - `"editable"`: Inline editing with validation
   * - `"spreadsheet"`: Cell selection, copy/paste, grid layout
   * - `"server"`: Remote data with cursor pagination
   * - `"dashboard"`: Compact, minimal UI
   *
   * @default "interactive"
   */
  preset?: DataTablePreset;

  // ─── Grouped Configuration ───
  /**
   * Feature toggles.
   * @example
   * ```tsx
   * features={{ selection: true, search: true, export: ["csv"] }}
   * ```
   */
  features?: FeaturesConfig;

  /**
   * Scroll ownership and sticky positioning.
   * Defaults to page-owned vertical scrolling.
   */
  layout?: LayoutConfig;

  /**
   * Virtualization settings for large datasets.
   * @example
   * ```tsx
   * virtualization={{ rows: true, rowThreshold: 100 }}
   * ```
   */
  virtualization?: VirtualizationConfig;

  /**
   * Pagination configuration.
   * @example
   * ```tsx
   * pagination={{ mode: "offset", pageSize: 25 }}
   * ```
   */
  pagination?: PaginationConfig;

  /**
   * Inline editing configuration.
   * @example
   * ```tsx
   * editing={{
   *   enabled: true,
   *   onSave: async (rowId, col, value) => api.update(rowId, { [col]: value }),
   *   onValidate: (rowId, col, value) => col === "email" && !value.includes("@") ? "Invalid" : null,
   * }}
   * ```
   */
  editing?: EditingConfig<T>;

  /**
   * Visual styling configuration.
   * @example
   * ```tsx
   * styling={{ variant: "grid", density: "compact", zebra: true }}
   * ```
   */
  styling?: StylingConfig;

  /** Error reporting, recovery, and validation configuration. */
  errorConfig?: DataTableErrorConfig;

  /**
   * Event callbacks.
   * @example
   * ```tsx
   * callbacks={{
   *   onRowClick: (row) => navigate(`/users/${row.id}`),
   *   onSelectionChange: (ids) => setSelected(ids),
   * }}
   * ```
   */
  callbacks?: CallbacksConfig<T>;

  /**
   * Controlled state for fully-controlled mode.
   * @example
   * ```tsx
   * controlled={{ selectedIds, sortState }}
   * callbacks={{ onSelectionChange: setSelectedIds, onSortChange: setSortState }}
   * ```
   */
  controlled?: ControlledStateConfig;

  // ─── Bulk Actions ───
  /** Bulk action definitions */
  bulkActions?: BulkAction[];

  // ─── Row Expansion ───
  /** Render expanded row content */
  renderExpandedRow?: (row: T) => ReactNode;

  /** Presentation of content disclosed beneath a row. */
  expandedRow?: ExpandedRowConfig;

  /** Determine if row can expand */
  getRowCanExpand?: (row: T) => boolean;

  // ─── Row Styling ───
  /** Active/highlighted row ID */
  activeRowId?: string;

  /** Custom row class name function */
  rowClassName?: (row: T) => string;

  // ─── Container Styling ───
  /** Additional class name */
  className?: string;

  /** Inline styles */
  style?: CSSProperties;

  // ─── Empty State ───
  /** Custom empty message */
  emptyMessage?: string;

  /** Custom empty icon (Material Symbol name) */
  emptyIcon?: string;

  // ─── Loading State ───
  /** Loading state */
  loading?: boolean;

  /** Refreshing state (spinner while data exists) */
  refreshing?: boolean;

  /**
   * Loading display variant.
   * - "skeleton": Animated skeleton rows matching table structure (default)
   * - "spinner": Centered spinner with loading text
   * - "linear-progress": Subtle progress bar
   * @default "skeleton"
   */
  loadingVariant?: 'skeleton' | 'spinner' | 'linear-progress';

  /**
   * Number of skeleton rows to display during loading.
   * @default 5
   */
  skeletonRowCount?: number;

  /** Total count for pagination (remote mode) */
  totalCount?: number;

  /** Callback to refresh data */
  onRefresh?: () => void | Promise<void>;

  // ─── Identification ───
  /** Unique ID for localStorage persistence */
  tableId?: string;

  /** Table title for toolbar */
  title?: string;

  // ─── Feedback ───
  /**
   * Enable feedback notifications (toasts and ARIA announcements).
   * @default true
   */
  enableFeedback?: boolean;

  /**
   * Disable toast notifications (keeps ARIA announcements).
   * @default false
   */
  disableToasts?: boolean;

  /**
   * Disable ARIA announcements (keeps toasts).
   * @default false
   */
  disableAnnouncements?: boolean;

  // ─── RTL Support ───
  /**
   * Text direction for RTL language support.
   * @default "ltr"
   */
  dir?: 'ltr' | 'rtl';
}

// ─── INTERNAL EDITING WRAPPER ─────────────────────────────────────────────────

interface EditingWrapperProps<T extends { id: string }> {
  data: T[];
  editing?: EditingConfig<T>;
  children: (inlineEditing: ReturnType<typeof useInlineEditing<T>> | undefined) => ReactNode;
}

function EditingWrapper<T extends { id: string }>({
  data,
  editing,
  children,
}: EditingWrapperProps<T>) {
  const inlineEditing = useInlineEditing<T>({
    data,
    onCellChange: editing?.onSave
      ? async (rowId, columnKey, value) => {
          const row = data.find((r) => r.id === rowId);
          if (row) {
            await editing.onSave?.(rowId, columnKey, value, row);
          }
        }
      : undefined,
    validateCell: editing?.onValidate
      ? (rowId, columnKey, value) => {
          const row = data.find((r) => r.id === rowId);
          if (row) {
            return editing.onValidate?.(rowId, columnKey, value, row) ?? null;
          }
          return null;
        }
      : undefined,
    startEditOn: editing?.startEditOn,
  });

  return <>{children(editing?.enabled ? inlineEditing : undefined)}</>;
}

// ─── DATA TABLE COMPONENT ─────────────────────────────────────────────────────

/**
 * DataTable - Feature-rich, highly scalable data table component.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <DataTable
 *   data={users}
 *   columns={columns}
 * />
 *
 * // With features
 * <DataTable
 *   data={users}
 *   columns={columns}
 *   preset="interactive"
 *   features={{ selection: true, search: true }}
 *   callbacks={{ onRowClick: (row) => navigate(`/users/${row.id}`) }}
 * />
 *
 * // With inline editing
 * <DataTable
 *   data={users}
 *   columns={columns}
 *   editing={{
 *     enabled: true,
 *     onSave: async (rowId, col, value) => api.update(rowId, { [col]: value }),
 *   }}
 * />
 * ```
 */
export function DataTable<T extends { id: string }>({
  // Required
  data,
  columns,

  // Preset
  preset = 'interactive',

  // Grouped configs
  features: featuresOverride,
  layout: layoutOverride,
  virtualization: virtualizationOverride,
  pagination: paginationOverride,
  editing,
  styling: stylingOverride,
  errorConfig,
  callbacks,
  controlled,

  // Bulk actions
  bulkActions = [],

  // Row expansion
  renderExpandedRow,
  expandedRow,
  getRowCanExpand,

  // Row styling
  activeRowId,

  // Container styling
  className,
  style,

  // Empty state
  emptyMessage,
  emptyIcon,

  // Loading
  loading = false,
  refreshing = false,
  loadingVariant = 'skeleton',
  skeletonRowCount,
  totalCount,
  onRefresh,

  // Identification
  tableId,
  title,

  // Feedback
  enableFeedback = true,
  disableToasts = false,
  disableAnnouncements = false,
}: DataTableProps<T>) {
  // Get preset defaults
  const presetConfig = useMemo(() => getPresetConfig(preset), [preset]);

  // Merge configs with preset defaults
  const features = useMemo(
    () => ({ ...presetConfig.features, ...featuresOverride }),
    [presetConfig.features, featuresOverride],
  );

  const layout = useMemo<Required<LayoutConfig>>(
    () => ({
      verticalScroll: 'page',
      stickyHeader: true,
      stickyOffset: 'var(--app-header-height, 0px)',
      ...layoutOverride,
    }),
    [layoutOverride],
  );

  const virtualization = useMemo(
    () => ({
      ...presetConfig.virtualization,
      ...virtualizationOverride,
      rows:
        layout.verticalScroll === 'table'
          ? (virtualizationOverride?.rows ?? presetConfig.virtualization.rows)
          : false,
    }),
    [layout.verticalScroll, presetConfig.virtualization, virtualizationOverride],
  );

  const paginationConfig = useMemo(
    () => ({ ...presetConfig.pagination, ...paginationOverride }),
    [presetConfig.pagination, paginationOverride],
  );

  const styling = useMemo(
    () => ({ ...presetConfig.styling, ...stylingOverride }),
    [presetConfig.styling, stylingOverride],
  );

  // Determine effective settings
  const effectiveRowSelectionEnabled = features.selection ?? false;
  const effectiveShowColumnDividers = styling.columnDividers ?? styling.variant === 'grid';
  const enableExpansion = features.rowExpansion ?? !!renderExpandedRow;

  // Map callbacks to internal handlers
  const handleRowClick = useCallback(
    (row: T, activation: RowActivationEvent) => {
      callbacks?.onRowClick?.(row, { source: activation.source });
    },
    [callbacks],
  );

  const handleRowContextMenu = useCallback(
    (row: T, event: React.MouseEvent) => {
      callbacks?.onRowContextMenu?.(row, event);
    },
    [callbacks],
  );

  // Determine if toolbar should be shown
  const showToolbar = !!(
    title ||
    features.search ||
    (effectiveRowSelectionEnabled && bulkActions.length > 0) ||
    onRefresh
  );

  // Internal density state - allows user to change density via toolbar
  const initialDensity = styling.density ?? 'standard';
  const [internalDensity, setInternalDensity] = useState(initialDensity);

  useEffect(() => {
    setInternalDensity(styling.density ?? 'standard');
  }, [styling.density]);

  // Effective density (will be used for both toolbar and table)
  const effectiveDensity = internalDensity;

  const effectivePaginationMode = paginationConfig.mode ?? 'offset';
  const effectiveMode = effectivePaginationMode === 'cursor' ? 'remote' : 'local';

  // Build the table content
  const content = (
    <DataTableProvider
      tableId={tableId}
      columns={columns}
      mode={effectiveMode}
      paginationMode={effectivePaginationMode}
      variant={styling.variant ?? 'list'}
      rowSelectionEnabled={effectiveRowSelectionEnabled}
      showColumnDividers={effectiveShowColumnDividers}
      zebra={styling.zebra ?? false}
      verticalScroll={layout.verticalScroll}
      stickyHeader={layout.stickyHeader}
      stickyOffset={layout.stickyOffset}
      resizable={features.columnResize ?? true}
      pinnable={features.columnPinning ?? true}
      reorderable={features.columnReorder ?? false}
      columnVisibility={features.columnVisibility ?? true}
      initialPageSize={paginationConfig.pageSize ?? 25}
      errorConfig={errorConfig}
      // Controlled props - merged with top-level props
      sortState={controlled?.sortState}
      onSortChange={callbacks?.onSortChange}
      controlledFilters={controlled?.filters}
      onFilterChange={callbacks?.onFilterChange}
      searchValue={controlled?.searchValue}
      onSearchChange={callbacks?.onSearchChange}
      columnPinState={controlled?.columnPinState}
      onColumnPinChange={callbacks?.onColumnPinChange}
      columnOrder={controlled?.columnOrder}
      onColumnOrderChange={callbacks?.onColumnOrderChange}
      hiddenColumnKeys={controlled?.hiddenColumnKeys}
      onColumnVisibilityChange={callbacks?.onColumnVisibilityChange}
      getColumnMenuActions={callbacks?.getColumnMenuActions}
      getContextMenuActions={callbacks?.getContextMenuActions}
      selectedIds={controlled?.selectedIds}
      onSelectionChange={callbacks?.onSelectionChange}
    >
      <EditingWrapper data={data} editing={editing}>
        {(inlineEditing) => (
          <DataTableInner
            // Pass toolbar props to DataTableInner so it can render inside StickyZone
            toolbarProps={
              showToolbar
                ? {
                    title,
                    searchable: features.search ?? false,
                    bulkActions,
                    density: effectiveDensity,
                    onDensityChange: setInternalDensity,
                    showColumnToggle: features.columnVisibility ?? true,
                    showDensityToggle: true,
                    refreshing,
                    onRefresh,
                  }
                : undefined
            }
            data={data}
            isLoading={loading}
            loadingVariant={loadingVariant}
            skeletonRowCount={skeletonRowCount ?? paginationConfig.pageSize ?? 5}
            bulkActions={bulkActions}
            renderExpandedRow={enableExpansion ? renderExpandedRow : undefined}
            expandedRow={expandedRow}
            getRowCanExpand={getRowCanExpand}
            className={className}
            style={style}
            totalItems={totalCount}
            onRowClick={callbacks?.onRowClick ? handleRowClick : undefined}
            onRowContextMenu={callbacks?.onRowContextMenu ? handleRowContextMenu : undefined}
            activeRowId={activeRowId}
            density={effectiveDensity}
            virtualize={virtualization.rows ?? true}
            virtualizeThreshold={virtualization.rowThreshold ?? 50}
            virtualizeColumns={virtualization.columns ?? false}
            virtualizeColumnsThreshold={virtualization.columnThreshold ?? 20}
            emptyMessage={emptyMessage}
            emptyIcon={emptyIcon}
            estimateRowHeight={virtualization.estimatedRowHeight}
            reorderableRows={features.rowReorder ?? false}
            onRowReorder={callbacks?.onRowReorder}
            inlineEditing={inlineEditing}
            cellSelectionEnabled={features.cellSelection ?? false}
            contextMenuEnabled={features.contextMenu ?? Boolean(callbacks?.getContextMenuActions)}
            onCellActiveChange={callbacks?.onCellActiveChange}
            onCellSelectionChange={callbacks?.onCellSelectionChange}
            onCellPaste={callbacks?.onCellPaste}
            cursorPagination={paginationConfig.cursor}
            disableLocalProcessing={effectiveMode === 'remote'}
          />
        )}
      </EditingWrapper>
    </DataTableProvider>
  );

  // Wrap with FeedbackProvider if enabled
  if (enableFeedback) {
    return (
      <FeedbackProvider
        disabled={!enableFeedback}
        disableToasts={disableToasts}
        disableAnnouncements={disableAnnouncements}
      >
        {content}
      </FeedbackProvider>
    );
  }

  return content;
}

// ─── DISPLAY NAME ─────────────────────────────────────────────────────────────

DataTable.displayName = 'DataTable';

export default DataTable;
