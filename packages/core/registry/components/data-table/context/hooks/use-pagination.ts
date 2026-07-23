"use client";

import { useCallback } from "react";
import { useDataTablePaginationSlice, useDataTableRuntime } from "@/components/ui/data-table/context/provider";

/**
 * Hook for pagination functionality
 */
export function usePagination() {
  const { dispatch, callbacks } = useDataTableRuntime();
  const { pagination } = useDataTablePaginationSlice();
  const { onPaginationChange } = callbacks;

  const setPage = useCallback(
    (page: number) => {
      dispatch({ type: "SET_PAGE", page });
      onPaginationChange?.(page, pagination.pageSize);
    },
    [dispatch, onPaginationChange, pagination.pageSize]
  );

  const setPageSize = useCallback(
    (pageSize: number) => {
      dispatch({ type: "SET_PAGE_SIZE", pageSize });
      // Page resets to 1 when page size changes
      onPaginationChange?.(1, pageSize);
    },
    [dispatch, onPaginationChange]
  );

  const nextPage = useCallback(() => {
    const newPage = pagination.page + 1;
    dispatch({ type: "NEXT_PAGE" });
    onPaginationChange?.(newPage, pagination.pageSize);
  }, [dispatch, onPaginationChange, pagination.page, pagination.pageSize]);

  const prevPage = useCallback(() => {
    const newPage = Math.max(1, pagination.page - 1);
    dispatch({ type: "PREV_PAGE" });
    onPaginationChange?.(newPage, pagination.pageSize);
  }, [dispatch, onPaginationChange, pagination.page, pagination.pageSize]);

  /**
   * Reset pagination to page 1 and notify parent.
   * Call this when sort/filter changes reset the page.
   */
  const resetPage = useCallback(() => {
    dispatch({ type: "SET_PAGE", page: 1 });
    onPaginationChange?.(1, pagination.pageSize);
  }, [dispatch, onPaginationChange, pagination.pageSize]);

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
