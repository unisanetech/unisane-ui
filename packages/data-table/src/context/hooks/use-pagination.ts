"use client";

import { useCallback } from "react";
import {
  useDataTableControlledState,
  useDataTablePaginationSlice,
  useDataTableRuntime,
} from "../provider";

/**
 * Hook for pagination functionality
 */
export function usePagination() {
  const { dispatch, callbacks } = useDataTableRuntime();
  const controlled = useDataTableControlledState();
  const { pagination: internalPagination } = useDataTablePaginationSlice();
  const { onPaginationChange } = callbacks;
  const pagination = controlled.pagination ?? internalPagination;

  const setPage = useCallback(
    (page: number) => {
      if (controlled.pagination === undefined) {
        dispatch({ type: "SET_PAGE", page });
      }
      onPaginationChange?.(page, pagination.pageSize);
    },
    [controlled.pagination, dispatch, onPaginationChange, pagination.pageSize]
  );

  const setPageSize = useCallback(
    (pageSize: number) => {
      if (controlled.pagination === undefined) {
        dispatch({ type: "SET_PAGE_SIZE", pageSize });
      }
      // Page resets to 1 when page size changes
      onPaginationChange?.(1, pageSize);
    },
    [controlled.pagination, dispatch, onPaginationChange]
  );

  const nextPage = useCallback(() => {
    const newPage = pagination.page + 1;
    if (controlled.pagination === undefined) {
      dispatch({ type: "NEXT_PAGE" });
    }
    onPaginationChange?.(newPage, pagination.pageSize);
  }, [controlled.pagination, dispatch, onPaginationChange, pagination.page, pagination.pageSize]);

  const prevPage = useCallback(() => {
    const newPage = Math.max(1, pagination.page - 1);
    if (controlled.pagination === undefined) {
      dispatch({ type: "PREV_PAGE" });
    }
    onPaginationChange?.(newPage, pagination.pageSize);
  }, [controlled.pagination, dispatch, onPaginationChange, pagination.page, pagination.pageSize]);

  /**
   * Reset pagination to page 1 and notify parent.
   * Call this when sort/filter changes reset the page.
   */
  const resetPage = useCallback(() => {
    if (controlled.pagination === undefined) {
      dispatch({ type: "SET_PAGE", page: 1 });
    }
    onPaginationChange?.(1, pagination.pageSize);
  }, [controlled.pagination, dispatch, onPaginationChange, pagination.pageSize]);

  return {
    page: pagination.page,
    pageSize: pagination.pageSize,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    resetPage,
  };
}
