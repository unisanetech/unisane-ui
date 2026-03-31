'use client';

import React from 'react';
import { cn } from '@unisane/ui';
import type { Column, ColumnGroup } from '../../types';
import { isColumnGroup } from '../../types';
import { COLUMN_WIDTHS } from '../../constants';

export interface GroupHeaderRowProps<T> {
  columnDefinitions: Array<Column<T> | ColumnGroup<T>>;
  selectable: boolean;
  enableExpansion: boolean;
  showColumnBorders: boolean;
  paddingClass: string;
  hasPinnedLeftData: boolean;
}

export function GroupHeaderRow<T>({
  columnDefinitions,
  selectable,
  enableExpansion,
  showColumnBorders,
  paddingClass,
  hasPinnedLeftData,
}: GroupHeaderRowProps<T>) {
  void hasPinnedLeftData;
  return (
    <tr aria-rowindex={1}>
      {/* Checkbox placeholder */}
      {selectable && (
        <th
          className={cn(
            'bg-surface border-outline-variant border-b',
            // Sticky positioning with z-index for proper stacking (only on tablet+)
            'left-0 isolate z-30 @md:sticky',
            showColumnBorders && 'border-outline-variant border-r',
          )}
          style={{
            width: COLUMN_WIDTHS.CHECKBOX,
            minWidth: COLUMN_WIDTHS.CHECKBOX,
            maxWidth: COLUMN_WIDTHS.CHECKBOX,
          }}
          rowSpan={2}
        />
      )}

      {/* Expander placeholder */}
      {enableExpansion && (
        <th
          className={cn(
            'bg-surface border-outline-variant border-b',
            // Sticky positioning with z-index for proper stacking (only on tablet+)
            'isolate z-30 @md:sticky',
            showColumnBorders && 'border-outline-variant border-r',
          )}
          style={{
            width: COLUMN_WIDTHS.EXPANDER,
            minWidth: COLUMN_WIDTHS.EXPANDER,
            maxWidth: COLUMN_WIDTHS.EXPANDER,
            // Position after checkbox if selectable, otherwise at 0
            left: selectable ? COLUMN_WIDTHS.CHECKBOX : 0,
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
                'bg-surface border-outline-variant border-b',
                'text-label-medium text-on-surface-variant text-center align-middle font-semibold',
                paddingClass,
                showColumnBorders && !isLastGroup && 'border-outline-variant border-r',
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
                'bg-surface border-outline-variant border-b',
                'text-label-large text-on-surface-variant align-middle font-medium',
                paddingClass,
                def.align === 'center' && 'text-center',
                def.align === 'end' && 'text-right',
                showColumnBorders && !isLastColumn && 'border-outline-variant border-r',
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
