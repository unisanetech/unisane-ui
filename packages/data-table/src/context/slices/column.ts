import type { DataTableAction, ColumnSlice } from "../types";

export function createInitialColumnState(): ColumnSlice {
  return {
    hiddenColumns: new Set(),
    columnWidths: {},
    columnPinState: {},
    columnOrder: [],
  };
}

export function reduceColumnState(
  state: ColumnSlice,
  action: DataTableAction
): ColumnSlice {
  switch (action.type) {
    case "TOGGLE_COLUMN_VISIBILITY": {
      const next = new Set(state.hiddenColumns);
      if (next.has(action.key)) {
        next.delete(action.key);
      } else {
        next.add(action.key);
      }
      return { ...state, hiddenColumns: next };
    }

    case "HIDE_COLUMN": {
      const next = new Set(state.hiddenColumns);
      next.add(action.key);
      return { ...state, hiddenColumns: next };
    }

    case "SHOW_ALL_COLUMNS":
      return { ...state, hiddenColumns: new Set() };

    case "SET_COLUMN_WIDTH":
      return {
        ...state,
        columnWidths: { ...state.columnWidths, [action.key]: action.width },
      };

    case "RESET_COLUMN_WIDTHS":
      return { ...state, columnWidths: {} };

    case "SET_COLUMN_PIN":
      return {
        ...state,
        columnPinState: { ...state.columnPinState, [action.key]: action.position },
      };

    case "RESET_COLUMN_PINS":
      return { ...state, columnPinState: {} };

    case "SET_COLUMN_ORDER":
      return { ...state, columnOrder: action.order };

    case "HYDRATE":
      if (
        action.state.hiddenColumns === undefined &&
        action.state.columnWidths === undefined &&
        action.state.columnPinState === undefined &&
        action.state.columnOrder === undefined
      ) {
        return state;
      }
      return {
        hiddenColumns: action.state.hiddenColumns ?? state.hiddenColumns,
        columnWidths: action.state.columnWidths ?? state.columnWidths,
        columnPinState: action.state.columnPinState ?? state.columnPinState,
        columnOrder: action.state.columnOrder ?? state.columnOrder,
      };

    default:
      return state;
  }
}
