// ─── TYPES INDEX ─────────────────────────────────────────────────────────────
// Central export for all data-table types.
// Organized by domain for better discoverability.

// ─── CORE TYPES ──────────────────────────────────────────────────────────────
// Fundamental types: sort, filter, pagination, display variants

export type {
  // Branded types
  Brand,
  NonEmptyArray,
  // Sort
  SortDirection,
  SortSource,
  SortItem,
  MultiSortState,
  // Filter (typed discriminated unions)
  TextFilterValue,
  NumberFilterValue,
  NumberRangeFilterValue,
  DateFilterValue,
  DateRangeFilterValue,
  SelectFilterValue,
  MultiSelectFilterValue,
  BooleanFilterValue,
  TypedFilterValue,
  TypedFilterState,
  // Filter (legacy)
  FilterValue,
  FilterState,
  FilterType,
  FilterOption,
  FilterRendererProps,
  // Pin
  PinPosition,
  ColumnPinState,
  // Display
  TableVariant,
  Density,
  // Pagination
  PaginationState,
  CursorPagination,
} from '@/components/ui/data-table/types/core';

// Branded type utilities
export { isNonEmpty, asNonEmpty, toNonEmpty } from '@/components/ui/data-table/types/core';

// ─── COLUMN TYPES ────────────────────────────────────────────────────────────
// Column definitions and utilities

export type { CellContext, Column, ColumnGroup, ColumnMeta, ColumnMetaMap } from '@/components/ui/data-table/types/column';

// Column utility functions
export { isColumnGroup, flattenColumns, hasColumnGroups } from '@/components/ui/data-table/types/column';

// ─── FEATURE TYPES ───────────────────────────────────────────────────────────
// Advanced features: grouping, selection, editing, context menu, bulk actions

export type {
  // Row Grouping
  GroupAggregation,
  RowGroupingConfig,
  GroupHeaderProps,
  RowGroup,
  GroupedRow,
  RowGroupingState,
  // Cell Selection
  CellPosition,
  CellRange,
  CellSelectionState,
  CellSelectionContext,
  // Inline Editing
  EditActivationMode,
  EditingCell,
  InlineEditingController,
  // Context Menu
  RowContextMenuItem,
  RowContextMenuSeparator,
  RowContextMenuItemOrSeparator,
  RowContextMenuRenderProps,
  // Bulk Actions
  BulkAction,
  // Tree Data
  TreeDataConfig,
  TreeExpanderProps,
  FlattenedTreeRow,
  TreeDataState,
  TreeSelectionMode,
  TreeRowContext,
  // Sparse Selection
  SparseSelectionMode,
  SparseSelectionState,
  SparseSelectionController,
} from '@/components/ui/data-table/types/features';

// ─── COMPONENT PROPS ─────────────────────────────────────────────────────────
// Props for DataTable and render callbacks

export type {
  DataTableErrorConfig,
  RowActivationEvent,
  DataTableHeaderRenderProps,
  DataTableToolbarRenderProps,
  RemoteDataTableProps,
} from '@/components/ui/data-table/types/props';

// ─── HOOK TYPES ──────────────────────────────────────────────────────────────
// Options and return types for custom hooks

export type {
  // Inline Editing
  UseInlineEditingOptions,
  // Cell Selection
  UseCellSelectionOptions,
  UseCellSelectionReturn,
  // Keyboard Navigation
  UseKeyboardNavigationOptions,
  UseKeyboardNavigationReturn,
  // Remote Data
  ListParamsLike,
  QueryLike,
  StatsQueryLike,
  UseRemoteDataTableOptions,
  UseRemoteDataTableReturn,
  // Virtualization
  VirtualRow,
  UseVirtualizedRowsOptions,
  UseVirtualizedRowsReturn,
} from '@/components/ui/data-table/types/hooks';

// ─── CONFIGURATION TYPES ──────────────────────────────────────────────────────
// Grouped configuration for simplified API

export type {
  // Feature groups
  FeaturesConfig,
  VirtualizationConfig,
  PaginationConfig,
  EditingConfig,
  StylingConfig,
  CallbacksConfig,
  ColumnMenuAction,
  ColumnMenuActionContext,
  DataTableContextMenuAction,
  DataTableCellPasteContext,
  DataTableContextMenuContext,
  DataTableContextMenuTarget,
  ControlledStateConfig,
  // Loading
  LoadingVariant,
  // Presets
  DataTablePreset,
  // Column helpers
  SimpleColumn,
  SimpleBulkAction,
} from '@/components/ui/data-table/types/config';

// Configuration utilities
export { getPresetConfig, defineColumns, defineBulkActions } from '@/components/ui/data-table/types/config';
