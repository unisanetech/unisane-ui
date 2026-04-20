import type { DataTableAction, FilterSlice } from "../types";

export function createInitialFilterState(): FilterSlice {
  return {
    searchText: "",
    columnFilters: {},
  };
}

export function reduceFilterState(
  state: FilterSlice,
  action: DataTableAction
): FilterSlice {
  switch (action.type) {
    case "SET_SEARCH":
      return {
        ...state,
        searchText: action.value,
      };

    case "SET_FILTER": {
      const next = { ...state.columnFilters };
      const value = action.value;

      if (
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        delete next[action.key];
      } else {
        next[action.key] = value;
      }

      return {
        ...state,
        columnFilters: next,
      };
    }

    case "REMOVE_FILTER": {
      const next = { ...state.columnFilters };
      delete next[action.key];
      return {
        ...state,
        columnFilters: next,
      };
    }

    case "CLEAR_ALL_FILTERS":
      return {
        searchText: "",
        columnFilters: {},
      };

    case "HYDRATE":
      if (
        action.state.searchText === undefined &&
        action.state.columnFilters === undefined
      ) {
        return state;
      }
      return {
        searchText: action.state.searchText ?? state.searchText,
        columnFilters: action.state.columnFilters ?? state.columnFilters,
      };

    default:
      return state;
  }
}
