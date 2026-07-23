import type { DataTableAction, GroupingSlice } from "@/components/ui/data-table/context/types";

export function createInitialGroupingState(): GroupingSlice {
  return {
    groupBy: null,
    expandedGroups: new Set(),
  };
}

export function reduceGroupingState(
  state: GroupingSlice,
  action: DataTableAction
): GroupingSlice {
  switch (action.type) {
    case "SET_GROUP_BY":
      return {
        groupBy: action.key,
        expandedGroups: new Set(),
      };

    case "ADD_GROUP_BY": {
      const currentGroupBy = state.groupBy;
      let nextGroupBy: string[];

      if (currentGroupBy === null) {
        nextGroupBy = [action.key];
      } else if (Array.isArray(currentGroupBy)) {
        if (currentGroupBy.includes(action.key)) {
          return state;
        }
        nextGroupBy = [...currentGroupBy, action.key];
      } else {
        if (currentGroupBy === action.key) {
          return state;
        }
        nextGroupBy = [currentGroupBy, action.key];
      }

      return {
        groupBy: nextGroupBy,
        expandedGroups: new Set(),
      };
    }

    case "REMOVE_GROUP_BY": {
      const currentGroupBy = state.groupBy;

      if (currentGroupBy === null) {
        return state;
      }

      if (Array.isArray(currentGroupBy)) {
        const nextGroupBy = currentGroupBy.filter((key) => key !== action.key);
        return {
          groupBy:
            nextGroupBy.length === 0
              ? null
              : nextGroupBy.length === 1
                ? nextGroupBy[0]!
                : nextGroupBy,
          expandedGroups: new Set(),
        };
      }

      if (currentGroupBy === action.key) {
        return {
          groupBy: null,
          expandedGroups: new Set(),
        };
      }

      return state;
    }

    case "TOGGLE_GROUP_EXPAND": {
      const next = new Set(state.expandedGroups);
      if (next.has(action.groupId)) {
        next.delete(action.groupId);
      } else {
        next.add(action.groupId);
      }
      return { ...state, expandedGroups: next };
    }

    case "EXPAND_ALL_GROUPS":
      return { ...state, expandedGroups: new Set(action.groupIds) };

    case "COLLAPSE_ALL_GROUPS":
      return { ...state, expandedGroups: new Set() };

    case "HYDRATE":
      if (
        action.state.groupBy === undefined &&
        action.state.expandedGroups === undefined
      ) {
        return state;
      }
      return {
        groupBy: action.state.groupBy ?? state.groupBy,
        expandedGroups: action.state.expandedGroups ?? state.expandedGroups,
      };

    default:
      return state;
  }
}
