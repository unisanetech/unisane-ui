// Main components
export { DataTable, type DataTableProps } from '@/components/ui/data-table/components/data-table';
export { DataTableInner, type DataTableInnerProps } from '@/components/ui/data-table/components/data-table-inner';

// Layout components used by the active render path
export { DataTableLayout, StickyZone } from '@/components/ui/data-table/components/layout';

// Table primitives
export {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '@/components/ui/data-table/components/table';
export { DataTableHeader, type DataTableHeaderProps } from '@/components/ui/data-table/components/header/index';
export { DataTableRow } from '@/components/ui/data-table/components/row';
export { DataTableBody } from '@/components/ui/data-table/components/body';
export { DataTableFooter, type DataTableFooterProps } from '@/components/ui/data-table/components/footer';
export {
  SummaryRow,
  type SummaryRowProps,
  calculateSummary,
  formatSummaryValue,
} from '@/components/ui/data-table/components/summary-row';
export {
  RowContextMenu,
  useRowContextMenu,
  useDefaultContextMenuItems,
  type RowContextMenuProps,
  type ContextMenuState,
  type UseRowContextMenuOptions,
  type UseRowContextMenuReturn,
} from '@/components/ui/data-table/components/row-context-menu';
export { DataTableContextMenu, type DataTableContextMenuState } from '@/components/ui/data-table/components/context-menu';
export { VirtualizedBody } from '@/components/ui/data-table/components/virtualized-body';
export { DataTableErrorBoundary, DataTableErrorDisplay } from '@/components/ui/data-table/components/error-boundary';
export { DragHandle, type DragHandleProps } from '@/components/ui/data-table/components/drag-handle';
export { CustomScrollbar, type CustomScrollbarProps } from '@/components/ui/data-table/components/custom-scrollbar';
export {
  ActionsCell,
  createActionsColumn,
  type ActionsCellProps,
  type CreateActionsColumnOptions,
} from '@/components/ui/data-table/components/actions-cell';
export { TreeExpander, type TreeExpanderProps } from '@/components/ui/data-table/components/tree-expander';
export { InfiniteScrollLoader, type InfiniteScrollLoaderProps } from '@/components/ui/data-table/components/infinite-scroll-loader';
export {
  HighlightedText,
  splitTextBySearch,
  type HighlightedTextProps,
  type HighlightedSpan,
} from '@/components/ui/data-table/components/highlighted-text';
export { DataTableToolbar, ExportDropdown, type ExportDropdownProps } from '@/components/ui/data-table/components/toolbar/index';
export {
  GroupingPillsBar,
  FrozenColumnsIndicator,
  type ToolbarAction,
  type ToolbarDropdown,
  type ToolbarDropdownOption,
  type ToolbarIconAction,
  type DataTableToolbarProps,
  type ExportHandler,
  type PrintHandler,
  type GroupingPillsBarProps,
  type FrozenColumnsIndicatorProps,
} from '@/components/ui/data-table/components/toolbar/index';
export { DataTablePagination } from '@/components/ui/data-table/components/pagination';
