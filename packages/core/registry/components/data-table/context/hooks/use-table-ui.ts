"use client";

import { useCallback } from "react";
import { useDataTableColumnSlice, useDataTableRuntime } from "@/components/ui/data-table/context/provider";

/**
 * Hook for table UI state and configuration
 */
export function useTableUI() {
  const { dispatch, config, errorHub } = useDataTableRuntime();
  const { columnPinState, columnWidths, hiddenColumns } = useDataTableColumnSlice();

  const resetAll = useCallback(
    () => dispatch({ type: "RESET_ALL" }),
    [dispatch]
  );

  return {
    config,
    errorHub,
    resetAll,
    hasCustomizations:
      Object.keys(columnPinState).length > 0 ||
      Object.keys(columnWidths).length > 0 ||
      hiddenColumns.size > 0,
  };
}
