// ─── HOOKS INDEX ─────────────────────────────────────────────────────────────
// Central export for all data-table hooks.
// Organized by domain: data, ui, features, utilities.

// ─── DATA HOOKS ──────────────────────────────────────────────────────────────
// Data processing, remote data, row grouping

export { useProcessedData } from '@/components/ui/data-table/hooks/data/use-processed-data';
export {
  useRemoteDataTable,
  type ListParamsLike,
  type QueryLike,
  type StatsQueryLike,
  type UseRemoteDataTableOptions,
  type UseRemoteDataTableReturn,
} from '@/components/ui/data-table/hooks/data/use-remote-data-table';
export {
  useRowGrouping,
  type UseRowGroupingOptions,
  type UseRowGroupingReturn,
} from '@/components/ui/data-table/hooks/data/use-row-grouping';

// ─── UI HOOKS ────────────────────────────────────────────────────────────────
// Cell selection, keyboard navigation, column drag, density

export { useCellSelection } from '@/components/ui/data-table/hooks/ui/use-cell-selection';
export {
  useKeyboardNavigation,
  type UseKeyboardNavigationOptions,
  type UseKeyboardNavigationReturn,
} from '@/components/ui/data-table/hooks/ui/use-keyboard-navigation';
export {
  useColumnDrag,
  type DragState,
  type UseColumnDragOptions,
  type UseColumnDragReturn,
} from '@/components/ui/data-table/hooks/ui/use-column-drag';
export { useDensityScale, getDensityScale, DENSITY_SCALE_MAP } from '@/components/ui/data-table/hooks/ui/use-density-scale';
export {
  useResponsiveDensity,
  type UseResponsiveDensityOptions,
  type UseResponsiveDensityReturn,
} from '@/components/ui/data-table/hooks/ui/use-responsive-density';
export {
  useRTL,
  useRTLContext,
  RTLProvider,
  arrowKeyToLogical,
  arrowKeyToPhysical,
  tabToLogical,
  type Direction,
  type LogicalDirection,
  type PhysicalDirection,
  type LogicalPinPosition,
  type RTLContextValue,
  type UseRTLOptions,
  type UseRTLReturn,
  type RTLProviderProps,
} from '@/components/ui/data-table/hooks/ui/use-rtl';

// ─── FEATURE HOOKS ───────────────────────────────────────────────────────────
// Inline editing, virtualization, tree data

export { useInlineEditing } from '@/components/ui/data-table/hooks/features/use-inline-editing';
export {
  useInlineEditingWithHistory,
  type UseInlineEditingWithHistoryOptions,
  type UseInlineEditingWithHistoryReturn,
} from '@/components/ui/data-table/hooks/features/use-inline-editing-with-history';
export {
  useInlineEditingWithFeedback,
  type UseInlineEditingWithFeedbackOptions,
  type UseInlineEditingWithFeedbackReturn,
} from '@/components/ui/data-table/hooks/features/use-inline-editing-with-feedback';
export {
  useVirtualizedRows,
  type UseVirtualizedRowsOptions,
  type UseVirtualizedRowsReturn,
  type VirtualRow,
} from '@/components/ui/data-table/hooks/features/use-virtualized-rows';
export {
  useVirtualizedGroupedRows,
  type VirtualizedGroupItem,
  type VirtualGroupedRow,
  type UseVirtualizedGroupedRowsOptions,
  type UseVirtualizedGroupedRowsReturn,
} from '@/components/ui/data-table/hooks/features/use-virtualized-grouped-rows';
export {
  useTreeData,
  type UseTreeDataOptions,
  type UseTreeDataReturn,
} from '@/components/ui/data-table/hooks/features/use-tree-data';
export {
  useInfiniteScroll,
  type UseInfiniteScrollOptions,
  type UseInfiniteScrollReturn,
} from '@/components/ui/data-table/hooks/features/use-infinite-scroll';
export {
  useSelectionPersistence,
  type UseSelectionPersistenceOptions,
  type UseSelectionPersistenceReturn,
} from '@/components/ui/data-table/hooks/features/use-selection-persistence';
export {
  useClipboardPaste,
  type ParsedClipboardData,
  type PasteCellUpdate,
  type PasteValidationResult,
  type PasteResult,
  type UseClipboardPasteOptions,
  type UseClipboardPasteReturn,
} from '@/components/ui/data-table/hooks/features/use-clipboard-paste';
export {
  useClipboardPasteWithFeedback,
  type UseClipboardPasteWithFeedbackOptions,
  type UseClipboardPasteWithFeedbackReturn,
} from '@/components/ui/data-table/hooks/features/use-clipboard-paste-with-feedback';
export {
  useEditHistory,
  type EditHistoryEntry,
  type EditChange,
  type UndoRedoResult,
  type UseEditHistoryOptions,
  type UseEditHistoryReturn,
} from '@/components/ui/data-table/hooks/features/use-edit-history';
export {
  useEditHistoryWithFeedback,
  type UseEditHistoryWithFeedbackOptions,
  type UseEditHistoryWithFeedbackReturn,
} from '@/components/ui/data-table/hooks/features/use-edit-history-with-feedback';
export {
  useFilterPresets,
  type FilterPreset,
  type FilterPresetInput,
  type UseFilterPresetsOptions,
  type UseFilterPresetsReturn,
} from '@/components/ui/data-table/hooks/features/use-filter-presets';
export {
  useFilterPresetsWithFeedback,
  type UseFilterPresetsWithFeedbackOptions,
  type UseFilterPresetsWithFeedbackReturn,
} from '@/components/ui/data-table/hooks/features/use-filter-presets-with-feedback';
export {
  useCompoundFilters,
  type FilterLogicOperator,
  type FilterComparisonOperator,
  type FilterCondition,
  type FilterGroup,
  type CompoundFilter,
  type UseCompoundFiltersOptions,
  type UseCompoundFiltersReturn,
} from '@/components/ui/data-table/hooks/features/use-compound-filters';
export {
  useColumnSpan,
  type ColumnSpan,
  type CellSpanInfo,
  type ColumnSpanFn,
  type UseColumnSpanOptions,
  type UseColumnSpanReturn,
} from '@/components/ui/data-table/hooks/features/use-column-span';
export {
  useStickyGroupHeaders,
  type StickyGroupHeader,
  type GroupPosition,
  type UseStickyGroupHeadersOptions,
  type UseStickyGroupHeadersReturn,
} from '@/components/ui/data-table/hooks/features/use-sticky-group-headers';
export {
  useRowNumbers,
  ROW_NUMBER_COLUMN_KEY,
  type UseRowNumbersOptions,
  type UseRowNumbersReturn,
} from '@/components/ui/data-table/hooks/features/use-row-numbers';

// ─── UTILITY HOOKS ───────────────────────────────────────────────────────────
// General-purpose utilities

export { useDebounce, useDebouncedCallback } from '@/components/ui/data-table/hooks/utilities/use-debounce';
export {
  useSafeRAF,
  useRAFThrottle,
  useRAFCallback,
  type UseSafeRAFReturn,
  type UseRAFThrottleReturn,
} from '@/components/ui/data-table/hooks/use-safe-raf';

// ─── ACTION DIALOG HOOKS ─────────────────────────────────────────────────────
// Dialog state management for row-level actions

export {
  useActionDialog,
  useConfirmAction,
  type ActionDialogType,
  type ActionDialogState,
  type UseActionDialogOptions,
  type UseActionDialogReturn,
  type ConfirmActionOptions,
  type UseConfirmActionReturn,
} from '@/components/ui/data-table/hooks/use-action-dialog';

// ─── ERROR HANDLING HOOKS ─────────────────────────────────────────────────────
// Error hub access and error state management

export {
  useErrorHub,
  useErrorListener,
  useSeverityListener,
  useLastError,
  type UseErrorHubReturn,
  type UseErrorHubOptions,
} from '@/components/ui/data-table/hooks/use-error-hub';
