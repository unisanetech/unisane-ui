import type { MultiSortState } from "../../types/index";
import type { DataTableAction, SortSlice } from "../types";

function cycleSortState(
  currentState: MultiSortState,
  newKey: string
): MultiSortState {
  const existing = currentState.find((item) => item.key === newKey);

  if (!existing) {
    return [{ key: newKey, direction: "asc" }];
  }

  switch (existing.direction) {
    case "asc":
      return [{ key: newKey, direction: "desc" }];
    case "desc":
      return [];
    default:
      return [{ key: newKey, direction: "asc" }];
  }
}

function addOrCycleSortColumn(
  currentState: MultiSortState,
  key: string,
  maxColumns: number
): MultiSortState {
  const existingIndex = currentState.findIndex((item) => item.key === key);

  if (existingIndex === -1) {
    const next = [...currentState, { key, direction: "asc" as const }];
    return next.length > maxColumns ? next.slice(-maxColumns) : next;
  }

  const existing = currentState[existingIndex]!;

  if (existing.direction === "asc") {
    const next = [...currentState];
    next[existingIndex] = { key, direction: "desc" };
    return next;
  }

  return currentState.filter((_, index) => index !== existingIndex);
}

export function createInitialSortState(): SortSlice {
  return {
    sortState: [],
  };
}

export function reduceSortState(
  state: SortSlice,
  action: DataTableAction
): SortSlice {
  switch (action.type) {
    case "SET_SORT":
      return { sortState: action.sortState };

    case "CYCLE_SORT":
      return { sortState: cycleSortState(state.sortState, action.key) };

    case "ADD_SORT":
      return {
        sortState: addOrCycleSortColumn(
          state.sortState,
          action.key,
          action.maxColumns ?? 3
        ),
      };

    case "REMOVE_SORT":
      return {
        sortState: state.sortState.filter((item) => item.key !== action.key),
      };

    case "CLEAR_SORT":
      return { sortState: [] };

    case "HYDRATE":
      if (action.state.sortState === undefined) {
        return state;
      }
      return { sortState: action.state.sortState };

    default:
      return state;
  }
}
