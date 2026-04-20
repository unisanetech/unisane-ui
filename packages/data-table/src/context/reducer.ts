import type { DataTableAction, DataTableState } from "./types";
import {
  createInitialColumnState,
  createInitialFilterState,
  createInitialGroupingState,
  createInitialPaginationState,
  createInitialSelectionState,
  createInitialSortState,
  reduceColumnState,
  reduceFilterState,
  reduceGroupingState,
  reducePaginationState,
  reduceSelectionState,
  reduceSortState,
} from "./slices";

export function createInitialState(options?: {
  pageSize?: number;
}): DataTableState {
  return {
    ...createInitialSelectionState(),
    ...createInitialSortState(),
    ...createInitialFilterState(),
    ...createInitialPaginationState(options),
    ...createInitialColumnState(),
    ...createInitialGroupingState(),
  };
}

export function dataTableReducer(
  state: DataTableState,
  action: DataTableAction
): DataTableState {
  if (action.type === "RESET_ALL") {
    return createInitialState({ pageSize: state.pagination.pageSize });
  }

  const nextSelection = reduceSelectionState(
    {
      selectedRows: state.selectedRows,
      expandedRows: state.expandedRows,
    },
    action
  );

  const nextSort = reduceSortState(
    {
      sortState: state.sortState,
    },
    action
  );

  const nextFilter = reduceFilterState(
    {
      searchText: state.searchText,
      columnFilters: state.columnFilters,
    },
    action
  );

  const nextPagination = reducePaginationState(
    {
      pagination: state.pagination,
    },
    action
  );

  const nextColumn = reduceColumnState(
    {
      hiddenColumns: state.hiddenColumns,
      columnWidths: state.columnWidths,
      columnPinState: state.columnPinState,
      columnOrder: state.columnOrder,
    },
    action
  );

  const nextGrouping = reduceGroupingState(
    {
      groupBy: state.groupBy,
      expandedGroups: state.expandedGroups,
    },
    action
  );

  if (
    nextSelection.selectedRows === state.selectedRows &&
    nextSelection.expandedRows === state.expandedRows &&
    nextSort.sortState === state.sortState &&
    nextFilter.searchText === state.searchText &&
    nextFilter.columnFilters === state.columnFilters &&
    nextPagination.pagination === state.pagination &&
    nextColumn.hiddenColumns === state.hiddenColumns &&
    nextColumn.columnWidths === state.columnWidths &&
    nextColumn.columnPinState === state.columnPinState &&
    nextColumn.columnOrder === state.columnOrder &&
    nextGrouping.groupBy === state.groupBy &&
    nextGrouping.expandedGroups === state.expandedGroups
  ) {
    return state;
  }

  return {
    selectedRows: nextSelection.selectedRows,
    expandedRows: nextSelection.expandedRows,
    sortState: nextSort.sortState,
    searchText: nextFilter.searchText,
    columnFilters: nextFilter.columnFilters,
    pagination: nextPagination.pagination,
    hiddenColumns: nextColumn.hiddenColumns,
    columnWidths: nextColumn.columnWidths,
    columnPinState: nextColumn.columnPinState,
    columnOrder: nextColumn.columnOrder,
    groupBy: nextGrouping.groupBy,
    expandedGroups: nextGrouping.expandedGroups,
  };
}
