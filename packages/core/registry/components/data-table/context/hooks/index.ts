// ─── SPECIALIZED HOOKS ──────────────────────────────────────────────────────
// These hooks provide focused APIs for specific DataTable functionality.
// They subscribe only to the state slices they consume.

export { useSelection } from "@/components/ui/data-table/context/hooks/use-selection";
export { useSorting } from "@/components/ui/data-table/context/hooks/use-sorting";
export { useFiltering } from "@/components/ui/data-table/context/hooks/use-filtering";
export { usePagination } from "@/components/ui/data-table/context/hooks/use-pagination";
export { useColumns } from "@/components/ui/data-table/context/hooks/use-columns";
export { useGrouping } from "@/components/ui/data-table/context/hooks/use-grouping";
export { useTableUI } from "@/components/ui/data-table/context/hooks/use-table-ui";

// ─── UTILITY HOOKS ──────────────────────────────────────────────────────────
// These hooks provide reusable patterns for state management.

export {
  useControlledState,
  useControlledSet,
  type UseControlledStateOptions,
  type UseControlledStateReturn,
  type UseControlledSetOptions,
  type UseControlledSetReturn,
} from "@/components/ui/data-table/context/hooks/use-controlled-state";
