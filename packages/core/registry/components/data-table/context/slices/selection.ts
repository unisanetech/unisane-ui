import type { DataTableAction, SelectionSlice } from "@/components/ui/data-table/context/types";

export function createInitialSelectionState(): SelectionSlice {
  return {
    selectedRows: new Set(),
    expandedRows: new Set(),
  };
}

export function reduceSelectionState(
  state: SelectionSlice,
  action: DataTableAction
): SelectionSlice {
  switch (action.type) {
    case "SELECT_ROW": {
      const next = new Set(state.selectedRows);
      next.add(action.id);
      return { ...state, selectedRows: next };
    }

    case "DESELECT_ROW": {
      const next = new Set(state.selectedRows);
      next.delete(action.id);
      return { ...state, selectedRows: next };
    }

    case "TOGGLE_SELECT": {
      const next = new Set(state.selectedRows);
      if (next.has(action.id)) {
        next.delete(action.id);
      } else {
        next.add(action.id);
      }
      return { ...state, selectedRows: next };
    }

    case "SELECT_ALL":
      return { ...state, selectedRows: new Set(action.ids) };

    case "DESELECT_ALL":
      return { ...state, selectedRows: new Set() };

    case "TOGGLE_EXPAND": {
      const next = new Set(state.expandedRows);
      if (next.has(action.id)) {
        next.delete(action.id);
      } else {
        next.add(action.id);
      }
      return { ...state, expandedRows: next };
    }

    case "EXPAND_ROW": {
      const next = new Set(state.expandedRows);
      next.add(action.id);
      return { ...state, expandedRows: next };
    }

    case "COLLAPSE_ROW": {
      const next = new Set(state.expandedRows);
      next.delete(action.id);
      return { ...state, expandedRows: next };
    }

    case "HYDRATE":
      if (
        action.state.selectedRows === undefined &&
        action.state.expandedRows === undefined
      ) {
        return state;
      }
      return {
        selectedRows: action.state.selectedRows ?? state.selectedRows,
        expandedRows: action.state.expandedRows ?? state.expandedRows,
      };

    default:
      return state;
  }
}
