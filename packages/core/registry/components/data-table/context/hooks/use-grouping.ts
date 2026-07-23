"use client";

import { useCallback, useMemo } from "react";
import {
  useDataTableControlledState,
  useDataTableGroupingSlice,
  useDataTableRuntime,
} from "@/components/ui/data-table/context/provider";

/**
 * Hook for grouping functionality
 */
export function useGrouping() {
  const { dispatch, config, callbacks } = useDataTableRuntime();
  const controlled = useDataTableControlledState();
  const { groupBy: internalGroupBy, expandedGroups } = useDataTableGroupingSlice();
  const { onGroupByChange } = callbacks;

  const groupBy = controlled.groupBy !== undefined ? controlled.groupBy : internalGroupBy;

  // Normalize groupBy to array for internal use
  const groupByArray = useMemo((): string[] => {
    if (groupBy === null) return [];
    if (Array.isArray(groupBy)) return groupBy;
    return [groupBy];
  }, [groupBy]);

  const setGroupBy = useCallback(
    (key: string | string[] | null) => {
      if (controlled.groupBy !== undefined) {
        onGroupByChange?.(key);
      } else {
        dispatch({ type: "SET_GROUP_BY", key });
        onGroupByChange?.(key);
      }
    },
    [controlled.groupBy, onGroupByChange, dispatch]
  );

  // Add a column to multi-level grouping
  const addGroupBy = useCallback(
    (key: string) => {
      if (controlled.groupBy !== undefined) {
        // For controlled mode, compute new value and call callback
        const current = controlled.groupBy;
        let newGroupBy: string | string[];
        if (current === null) {
          newGroupBy = key;
        } else if (Array.isArray(current)) {
          if (current.includes(key)) return;
          newGroupBy = [...current, key];
        } else {
          if (current === key) return;
          newGroupBy = [current, key];
        }
        onGroupByChange?.(newGroupBy);
      } else {
        dispatch({ type: "ADD_GROUP_BY", key });
        // Notify with updated value
        const current = internalGroupBy;
        let newGroupBy: string | string[];
        if (current === null) {
          newGroupBy = key;
        } else if (Array.isArray(current)) {
          newGroupBy = [...current, key];
        } else {
          newGroupBy = [current, key];
        }
        onGroupByChange?.(newGroupBy);
      }
    },
    [controlled.groupBy, onGroupByChange, dispatch, internalGroupBy]
  );

  // Remove a column from multi-level grouping
  const removeGroupBy = useCallback(
    (key: string) => {
      if (controlled.groupBy !== undefined) {
        const current = controlled.groupBy;
        if (current === null) return;
        if (Array.isArray(current)) {
          const newGroupBy = current.filter((k) => k !== key);
          onGroupByChange?.(newGroupBy.length === 0 ? null : newGroupBy.length === 1 ? newGroupBy[0]! : newGroupBy);
        } else if (current === key) {
          onGroupByChange?.(null);
        }
      } else {
        dispatch({ type: "REMOVE_GROUP_BY", key });
      }
    },
    [controlled.groupBy, onGroupByChange, dispatch]
  );

  const toggleGroupExpand = useCallback(
    (groupId: string) => dispatch({ type: "TOGGLE_GROUP_EXPAND", groupId }),
    [dispatch]
  );

  const expandAllGroups = useCallback(
    (groupIds: string[]) => dispatch({ type: "EXPAND_ALL_GROUPS", groupIds }),
    [dispatch]
  );

  const collapseAllGroups = useCallback(
    () => dispatch({ type: "COLLAPSE_ALL_GROUPS" }),
    [dispatch]
  );

  const isGroupExpanded = useCallback(
    (groupId: string) => expandedGroups.has(groupId),
    [expandedGroups]
  );

  // Get columns that can be grouped (exclude actions columns, etc.)
  const groupableColumns = useMemo(
    () => config.columns.filter((col) => col.sortable !== false),
    [config.columns]
  );

  // Check if a column is already being grouped by
  const isColumnGrouped = useCallback(
    (key: string) => groupByArray.includes(key),
    [groupByArray]
  );

  // Get the grouping level (depth) count
  const groupingLevels = groupByArray.length;

  return {
    groupBy,
    groupByArray, // Normalized array form
    setGroupBy,
    addGroupBy,
    removeGroupBy,
    expandedGroups,
    toggleGroupExpand,
    expandAllGroups,
    collapseAllGroups,
    isGroupExpanded,
    isGrouped: groupBy !== null,
    isMultiLevel: groupByArray.length > 1,
    groupingLevels,
    groupableColumns,
    isColumnGrouped,
  };
}
