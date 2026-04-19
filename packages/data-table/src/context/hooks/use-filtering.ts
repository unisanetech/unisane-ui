"use client";

import { useCallback } from "react";
import {
  useDataTableControlledState,
  useDataTableFilterSlice,
  useDataTableRuntime,
} from "../provider";
import type { FilterValue } from "../../types";

/**
 * Hook for filtering functionality
 */
export function useFiltering() {
  const { dispatch, callbacks } = useDataTableRuntime();
  const controlled = useDataTableControlledState();
  const { searchText: internalSearchText, columnFilters: internalColumnFilters } =
    useDataTableFilterSlice();
  const { onFilterChange, onSearchChange } = callbacks;

  const searchText = controlled.search ?? internalSearchText;
  const columnFilters = controlled.filters ?? internalColumnFilters;

  const setSearch = useCallback(
    (value: string) => {
      if (controlled.search !== undefined) {
        onSearchChange?.(value);
      } else {
        dispatch({ type: "SET_SEARCH", value });
        onSearchChange?.(value);
      }
    },
    [controlled.search, onSearchChange, dispatch]
  );

  const setFilter = useCallback(
    (key: string, value: FilterValue) => {
      if (controlled.filters) {
        const next = { ...controlled.filters };
        if (
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          delete next[key];
        } else {
          next[key] = value;
        }
        onFilterChange?.(next);
      } else {
        dispatch({ type: "SET_FILTER", key, value });
        const next = { ...internalColumnFilters };
        if (
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          delete next[key];
        } else {
          next[key] = value;
        }
        onFilterChange?.(next);
      }
    },
    [controlled.filters, onFilterChange, dispatch, internalColumnFilters]
  );

  const removeFilter = useCallback(
    (key: string) => {
      if (controlled.filters) {
        const next = { ...controlled.filters };
        delete next[key];
        onFilterChange?.(next);
      } else {
        dispatch({ type: "REMOVE_FILTER", key });
        const next = { ...internalColumnFilters };
        delete next[key];
        onFilterChange?.(next);
      }
    },
    [controlled.filters, onFilterChange, dispatch, internalColumnFilters]
  );

  const clearAllFilters = useCallback(() => {
    dispatch({ type: "CLEAR_ALL_FILTERS" });
    onSearchChange?.("");
    onFilterChange?.({});
  }, [dispatch, onSearchChange, onFilterChange]);

  const activeFiltersCount =
    Object.keys(columnFilters).length + (searchText ? 1 : 0);

  return {
    searchText,
    columnFilters,
    setSearch,
    setFilter,
    removeFilter,
    clearAllFilters,
    activeFiltersCount,
    hasActiveFilters: activeFiltersCount > 0,
  };
}
