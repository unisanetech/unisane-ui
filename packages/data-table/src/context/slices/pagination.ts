import { DEFAULT_PAGE_SIZE } from "../../constants/index";
import type { DataTableAction, PaginationSlice } from "../types";

export function createInitialPaginationState(options?: {
  pageSize?: number;
}): PaginationSlice {
  return {
    pagination: {
      page: 1,
      pageSize: options?.pageSize ?? DEFAULT_PAGE_SIZE,
    },
  };
}

export function reducePaginationState(
  state: PaginationSlice,
  action: DataTableAction
): PaginationSlice {
  switch (action.type) {
    case "SET_PAGE":
      return {
        pagination: { ...state.pagination, page: action.page },
      };

    case "SET_PAGE_SIZE":
      return {
        pagination: { page: 1, pageSize: action.pageSize },
      };

    case "NEXT_PAGE":
      return {
        pagination: { ...state.pagination, page: state.pagination.page + 1 },
      };

    case "PREV_PAGE":
      return {
        pagination: {
          ...state.pagination,
          page: Math.max(1, state.pagination.page - 1),
        },
      };

    case "SET_SORT":
    case "CYCLE_SORT":
    case "ADD_SORT":
    case "REMOVE_SORT":
    case "CLEAR_SORT":
    case "SET_SEARCH":
    case "SET_FILTER":
    case "REMOVE_FILTER":
    case "CLEAR_ALL_FILTERS":
      return {
        pagination: { ...state.pagination, page: 1 },
      };

    case "HYDRATE":
      if (action.state.pagination === undefined) {
        return state;
      }
      return { pagination: action.state.pagination };

    default:
      return state;
  }
}
