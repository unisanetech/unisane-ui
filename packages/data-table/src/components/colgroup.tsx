'use client';

import type { Column, ColumnMetaMap, PinPosition } from '../types/index';
import { COLUMN_WIDTHS, DENSITY_UTILITY_COLUMN_WIDTHS, type Density } from '../constants/index';

// ─── COLGROUP PROPS ───────────────────────────────────────────────────────

interface TableColgroupProps<T> {
  columns: Column<T>[];
  columnMeta: ColumnMetaMap;
  selectable: boolean;
  enableExpansion: boolean;
  /** Function to get effective pin position for a column */
  getEffectivePinPosition?: (col: Column<T>) => PinPosition;
  /** Whether row reordering is enabled */
  reorderableRows?: boolean;
  /** Table density for utility column sizing */
  density?: Density;
}

// ─── COLGROUP COMPONENT ───────────────────────────────────────────────────

export function TableColgroup<T>({
  columns,
  columnMeta,
  selectable,
  enableExpansion,
  getEffectivePinPosition,
  reorderableRows = false,
  density = 'standard',
}: TableColgroupProps<T>) {
  const utilityColumnWidths = DENSITY_UTILITY_COLUMN_WIDTHS[density];
  // Find the last non-pinned column to make it flexible
  const lastNonPinnedIndex = getEffectivePinPosition
    ? columns.reduce((lastIdx, col, idx) => {
        const pin = getEffectivePinPosition(col);
        return !pin ? idx : lastIdx;
      }, -1)
    : columns.length - 1;

  return (
    <colgroup>
      {/* Drag handle column - fixed width */}
      {reorderableRows && (
        <col
          style={{
            minWidth: utilityColumnWidths.dragHandle,
            maxWidth: utilityColumnWidths.dragHandle,
            width: utilityColumnWidths.dragHandle,
          }}
        />
      )}

      {/* Checkbox column - fixed width */}
      {selectable && (
        <col
          style={{
            width: utilityColumnWidths.checkbox,
            minWidth: utilityColumnWidths.checkbox,
            maxWidth: utilityColumnWidths.checkbox,
          }}
        />
      )}

      {/* Expander column - fixed width */}
      {enableExpansion && (
        <col
          style={{
            width: utilityColumnWidths.expander,
            minWidth: utilityColumnWidths.expander,
            maxWidth: utilityColumnWidths.expander,
          }}
        />
      )}

      {/* Data columns */}
      {columns.map((col, idx) => {
        const key = String(col.key);
        const meta = columnMeta[key];
        const width =
          meta?.width ?? (typeof col.width === 'number' ? col.width : COLUMN_WIDTHS.DEFAULT);
        const isPinned = getEffectivePinPosition ? !!getEffectivePinPosition(col) : false;
        const isLastNonPinned = idx === lastNonPinnedIndex;

        // Pinned columns get fixed width, last non-pinned column gets flexible width
        // Other columns use minWidth to allow growth
        return (
          <col
            key={key}
            style={{
              width: isPinned ? `${width}px` : isLastNonPinned ? 'auto' : `${width}px`,
              minWidth: `${col.minWidth ?? width}px`,
            }}
          />
        );
      })}
    </colgroup>
  );
}

export default TableColgroup;
