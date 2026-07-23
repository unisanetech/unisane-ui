// ─── UI HOOKS ────────────────────────────────────────────────────────────────
// Hooks for UI interactions: cell selection, keyboard navigation, column drag, row drag.

export { useCellSelection } from "@/components/ui/data-table/hooks/ui/use-cell-selection";
export { useKeyboardNavigation } from "@/components/ui/data-table/hooks/ui/use-keyboard-navigation";
export { useColumnDrag } from "@/components/ui/data-table/hooks/ui/use-column-drag";
export { useDensityScale } from "@/components/ui/data-table/hooks/ui/use-density-scale";
export {
  useResponsiveDensity,
  type UseResponsiveDensityOptions,
  type UseResponsiveDensityReturn,
} from "@/components/ui/data-table/hooks/ui/use-responsive-density";
export { useAnnouncer, type AnnouncementPriority, type UseAnnouncerReturn } from "@/components/ui/data-table/hooks/ui/use-announcer";
export {
  useRowDrag,
  type RowDragState,
  type UseRowDragOptions,
  type UseRowDragReturn,
  type RowDragProps,
} from "@/components/ui/data-table/hooks/ui/use-row-drag";
export {
  useAnnouncements,
  type UseAnnouncementsOptions,
  type UseAnnouncementsReturn,
} from "@/components/ui/data-table/hooks/ui/use-announcements";
export {
  useColumnLayout,
  type UseColumnLayoutOptions,
  type UseColumnLayoutReturn,
} from "@/components/ui/data-table/hooks/ui/use-column-layout";
export {
  useRTL,
  useRTLContext,
  RTLProvider,
  arrowKeyToLogical,
  arrowKeyToPhysical,
  tabToLogical,
  type Direction,
  type LogicalDirection,
  type PhysicalDirection,
  type LogicalPinPosition,
  type RTLContextValue,
  type UseRTLOptions,
  type UseRTLReturn,
  type RTLProviderProps,
} from "@/components/ui/data-table/hooks/ui/use-rtl";
export {
  useFocusRestore,
  type UseFocusRestoreOptions,
  type UseFocusRestoreReturn,
} from "@/components/ui/data-table/hooks/ui/use-focus-restore";
