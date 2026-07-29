// ─── FEATURE HOOKS ───────────────────────────────────────────────────────────
// Hooks for advanced features: inline editing, virtualization, tree data, infinite scroll.

export { useInlineEditing } from "@/components/ui/data-table/hooks/features/use-inline-editing";
export { useVirtualizedRows } from "@/components/ui/data-table/hooks/features/use-virtualized-rows";
export { useVirtualizedColumns } from "@/components/ui/data-table/hooks/features/use-virtualized-columns";
export { useVirtualizedGroupedRows } from "@/components/ui/data-table/hooks/features/use-virtualized-grouped-rows";
export { useTreeData } from "@/components/ui/data-table/hooks/features/use-tree-data";
export { useInfiniteScroll } from "@/components/ui/data-table/hooks/features/use-infinite-scroll";
export { useSelectionPersistence } from "@/components/ui/data-table/hooks/features/use-selection-persistence";
export { useClipboardPaste } from "@/components/ui/data-table/hooks/features/use-clipboard-paste";
export { useEditHistory } from "@/components/ui/data-table/hooks/features/use-edit-history";
export { useInlineEditingWithHistory } from "@/components/ui/data-table/hooks/features/use-inline-editing-with-history";
export { useFilterPresets } from "@/components/ui/data-table/hooks/features/use-filter-presets";
export { useCompoundFilters } from "@/components/ui/data-table/hooks/features/use-compound-filters";
export { useColumnSpan } from "@/components/ui/data-table/hooks/features/use-column-span";
export { useStickyGroupHeaders } from "@/components/ui/data-table/hooks/features/use-sticky-group-headers";
export { useSparseSelection } from "@/components/ui/data-table/hooks/features/use-sparse-selection";

// Re-export types
export type { VirtualRow } from "@/components/ui/data-table/hooks/features/use-virtualized-rows";
export type {
  VirtualColumn,
  UseVirtualizedColumnsOptions,
  UseVirtualizedColumnsReturn,
} from "@/components/ui/data-table/hooks/features/use-virtualized-columns";
export type {
  VirtualizedGroupItem,
  VirtualGroupedRow,
  UseVirtualizedGroupedRowsOptions,
  UseVirtualizedGroupedRowsReturn,
} from "@/components/ui/data-table/hooks/features/use-virtualized-grouped-rows";
export type {
  UseTreeDataOptions,
  UseTreeDataReturn,
} from "@/components/ui/data-table/hooks/features/use-tree-data";
export type {
  UseInfiniteScrollOptions,
  UseInfiniteScrollReturn,
} from "@/components/ui/data-table/hooks/features/use-infinite-scroll";
export type {
  UseSelectionPersistenceOptions,
  UseSelectionPersistenceReturn,
} from "@/components/ui/data-table/hooks/features/use-selection-persistence";
export type {
  ParsedClipboardData,
  PasteCellUpdate,
  PasteValidationResult,
  PasteResult,
  UseClipboardPasteOptions,
  UseClipboardPasteReturn,
} from "@/components/ui/data-table/hooks/features/use-clipboard-paste";
export type {
  EditHistoryEntry,
  EditChange,
  UndoRedoResult,
  UseEditHistoryOptions,
  UseEditHistoryReturn,
} from "@/components/ui/data-table/hooks/features/use-edit-history";
export type {
  UseInlineEditingWithHistoryOptions,
  UseInlineEditingWithHistoryReturn,
} from "@/components/ui/data-table/hooks/features/use-inline-editing-with-history";
export type {
  FilterPreset,
  FilterPresetInput,
  UseFilterPresetsOptions,
  UseFilterPresetsReturn,
} from "@/components/ui/data-table/hooks/features/use-filter-presets";
export type {
  FilterLogicOperator,
  FilterComparisonOperator,
  FilterCondition,
  CompoundFilterValue,
  FilterGroup,
  CompoundFilter,
  UseCompoundFiltersOptions,
  UseCompoundFiltersReturn,
} from "@/components/ui/data-table/hooks/features/use-compound-filters";
export type {
  ColumnSpan,
  CellSpanInfo,
  ColumnSpanFn,
  UseColumnSpanOptions,
  UseColumnSpanReturn,
} from "@/components/ui/data-table/hooks/features/use-column-span";
export type {
  StickyGroupHeader,
  GroupPosition,
  UseStickyGroupHeadersOptions,
  UseStickyGroupHeadersReturn,
} from "@/components/ui/data-table/hooks/features/use-sticky-group-headers";
export type {
  SparseSelectionMode,
  SparseSelectionState,
  UseSparseSelectionOptions,
  UseSparseSelectionReturn,
} from "@/components/ui/data-table/hooks/features/use-sparse-selection";
