'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { Column, ColumnGroup } from '@/components/ui/data-table/types';
import { isColumnGroup } from '@/components/ui/data-table/types';
import {
  DENSITY_HEADER_TEXT_STYLES,
  DENSITY_UTILITY_COLUMN_WIDTHS,
  type Density,
} from '@/components/ui/data-table/constants';

export interface GroupHeaderRowProps<T> {
  columnDefinitions: Array<Column<T> | ColumnGroup<T>>;
  selectable: boolean;
  enableExpansion: boolean;
  showColumnBorders: boolean;
  paddingClass: string;
  hasPinnedLeftData: boolean;
  density?: Density;
}

export function GroupHeaderRow<T>({
  columnDefinitions,
  selectable,
  enableExpansion,
  showColumnBorders,
  paddingClass,
  hasPinnedLeftData,
  density = 'standard',
}: GroupHeaderRowProps<T>) {
  void hasPinnedLeftData;
  const headerTextClass = DENSITY_HEADER_TEXT_STYLES[density];
  const utilityColumnWidths = DENSITY_UTILITY_COLUMN_WIDTHS[density];

  return (
    <tr aria-rowindex={1}>
      {/* Checkbox placeholder */}
      {selectable && (
        <th
          className={cn(
            'bg-surface border-outline-weak border-b',
            // Sticky positioning with z-index for proper stacking (only on tablet+)
            'left-0 isolate z-30 @md:sticky',
            showColumnBorders && 'border-outline-weak border-r',
          )}
          style={{
            width: utilityColumnWidths.checkbox,
            minWidth: utilityColumnWidths.checkbox,
            maxWidth: utilityColumnWidths.checkbox,
          }}
          rowSpan={2}
        />
      )}

      {/* Expander placeholder */}
      {enableExpansion && (
        <th
          className={cn(
            'bg-surface border-outline-weak border-b',
            // Sticky positioning with z-index for proper stacking (only on tablet+)
            'isolate z-30 @md:sticky',
            showColumnBorders && 'border-outline-weak border-r',
          )}
          style={{
            width: utilityColumnWidths.expander,
            minWidth: utilityColumnWidths.expander,
            maxWidth: utilityColumnWidths.expander,
            // Position after checkbox if selectable, otherwise at 0
            left: selectable ? utilityColumnWidths.checkbox : 0,
          }}
          rowSpan={2}
        />
      )}

      {/* Group headers */}
      {columnDefinitions.map((def, idx) => {
        if (isColumnGroup(def)) {
          const isLastGroup = idx === columnDefinitions.length - 1;
          return (
            <th
              key={`group-${idx}`}
              colSpan={def.children.length}
              className={cn(
                'bg-surface border-outline-weak border-b',
                'text-on-surface-variant text-center align-middle font-semibold',
                headerTextClass,
                paddingClass,
                showColumnBorders && !isLastGroup && 'border-outline-weak border-r',
              )}
            >
              {def.header}
            </th>
          );
        } else {
          // Standalone column spans both rows
          const isLastColumn = idx === columnDefinitions.length - 1;
          return (
            <th
              key={String(def.key)}
              rowSpan={2}
              className={cn(
                'bg-surface border-outline-weak border-b',
                'text-on-surface-variant align-middle font-medium',
                headerTextClass,
                paddingClass,
                def.align === 'center' && 'text-center',
                def.align === 'end' && 'text-right',
                showColumnBorders && !isLastColumn && 'border-outline-weak border-r',
              )}
            >
              {def.header}
            </th>
          );
        }
      })}
    </tr>
  );
}
