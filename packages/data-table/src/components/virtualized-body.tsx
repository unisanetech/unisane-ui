'use client';

import React from 'react';
import type { ReactNode } from 'react';
import { Icon } from '@unisane/ui';
import type {
  Column,
  PinPosition,
  ColumnMetaMap,
  InlineEditingController,
  RowActivationEvent,
  CellSelectionContext,
} from '../types/index';
import { DataTableExpandedRow, DataTableRow } from './row';
import type { VirtualRow } from '../hooks';
import type { Density } from '../constants/index';
import { useI18n } from '../i18n';

export type VirtualizedBodyItem<T extends { id: string }> =
  | { id: string; kind: 'row'; row: T; rowIndex: number }
  | { id: string; kind: 'expanded'; row: T; rowIndex: number };

interface VirtualizedBodyProps<T extends { id: string }> {
  isLoading: boolean;
  isEmpty: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  totalHeight: number;
  virtualRows: Array<VirtualRow<VirtualizedBodyItem<T>>>;
  columns: Column<T>[];
  columnMeta: ColumnMetaMap;
  getEffectivePinPosition: (col: Column<T>) => PinPosition;
  selectedRows: Set<string>;
  expandedRows: Set<string>;
  activeRowId?: string;
  focusedIndex: number | null;
  selectable: boolean;
  showColumnBorders: boolean;
  zebra: boolean;
  enableExpansion: boolean;
  getRowCanExpand?: (row: T) => boolean;
  renderExpandedRow?: (row: T) => ReactNode;
  onSelect: (id: string, checked: boolean) => void;
  onToggleExpand: (id: string) => void;
  onRowClick?: (row: T, activation: RowActivationEvent) => void;
  onRowContextMenu?: (row: T, event: React.MouseEvent) => void;
  onCellContextMenu?: (
    row: T,
    rowIndex: number,
    column: Column<T>,
    columnKey: string,
    value: unknown,
    event: React.MouseEvent,
  ) => void;
  onRowHover?: (row: T | null) => void;
  density?: Density;
  measureElement?: (element: HTMLElement | null) => void;
  inlineEditing?: InlineEditingController<T>;
  cellSelectionEnabled?: boolean;
  getCellSelectionContext?: (rowId: string, columnKey: string) => CellSelectionContext;
  onCellClick?: (rowId: string, columnKey: string, event: React.MouseEvent) => void;
  onCellKeyDown?: (event: React.KeyboardEvent) => void;
}

function LoadingState({ colSpan }: { colSpan: number }) {
  const { t } = useI18n();
  const loadingText = t('loading');

  return (
    <tbody className="bg-surface">
      <tr role="row">
        <td
          colSpan={colSpan}
          className="text-on-surface-variant px-4 py-20 text-center"
          role="cell"
        >
          <div
            className="flex flex-col items-center justify-center gap-3"
            role="status"
            aria-live="polite"
          >
            <div
              className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
              aria-hidden="true"
            />
            <span className="text-body-medium">{loadingText}</span>
          </div>
        </td>
      </tr>
    </tbody>
  );
}

function EmptyState({
  colSpan,
  message,
  icon = 'search_off',
}: {
  colSpan: number;
  message?: string;
  icon?: string;
}) {
  const { t } = useI18n();
  const emptyMessage = message ?? t('noResults');
  const hintMessage = t('noResultsHint');

  return (
    <tbody className="bg-surface">
      <tr role="row">
        <td
          colSpan={colSpan}
          className="text-on-surface-variant px-4 py-16 text-center"
          role="cell"
        >
          <div
            className="flex flex-col items-center justify-center py-12 text-center"
            role="status"
          >
            <Icon
              symbol={icon}
              className="text-on-surface-variant mb-2 h-8 w-8"
              aria-hidden="true"
            />
            <span className="text-title-medium text-on-surface">{emptyMessage}</span>
            <span className="text-body-small text-on-surface-variant mt-1">{hintMessage}</span>
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export function VirtualizedBody<T extends { id: string }>({
  isLoading,
  isEmpty,
  emptyMessage,
  emptyIcon,
  totalHeight,
  virtualRows,
  columns,
  columnMeta,
  getEffectivePinPosition,
  selectedRows,
  expandedRows,
  activeRowId,
  focusedIndex,
  selectable,
  showColumnBorders,
  zebra,
  enableExpansion,
  getRowCanExpand,
  renderExpandedRow,
  onSelect,
  onToggleExpand,
  onRowClick,
  onRowContextMenu,
  onCellContextMenu,
  onRowHover,
  density = 'standard',
  measureElement,
  inlineEditing,
  cellSelectionEnabled = false,
  getCellSelectionContext,
  onCellClick,
  onCellKeyDown,
}: VirtualizedBodyProps<T>) {
  const colSpan = columns.length + (selectable ? 1 : 0) + (enableExpansion ? 1 : 0);
  const firstVirtualRow = virtualRows[0];
  const lastVirtualRow = virtualRows[virtualRows.length - 1];
  const topSpacerHeight = Math.max(0, firstVirtualRow?.start ?? 0);
  const bottomSpacerHeight = Math.max(
    0,
    totalHeight - ((lastVirtualRow?.start ?? 0) + (lastVirtualRow?.size ?? 0)),
  );

  if (isLoading) {
    return <LoadingState colSpan={colSpan} />;
  }

  if (isEmpty) {
    return <EmptyState colSpan={colSpan} message={emptyMessage} icon={emptyIcon} />;
  }

  return (
    <tbody className="bg-surface">
      {topSpacerHeight > 0 ? (
        <tr aria-hidden="true" className="pointer-events-none">
          <td
            colSpan={colSpan}
            className="border-0 p-0"
            style={{ height: `${topSpacerHeight}px` }}
          />
        </tr>
      ) : null}
      {virtualRows.map((vRow, idx) =>
        vRow.data.kind === 'expanded' ? (
          <DataTableExpandedRow
            key={vRow.key}
            row={vRow.data.row}
            columns={columns}
            selectable={selectable}
            showColumnBorders={showColumnBorders}
            enableExpansion={enableExpansion}
            density={density}
            isLastRow={idx === virtualRows.length - 1 && bottomSpacerHeight === 0}
            rowRef={measureElement}
            data-index={vRow.index}
            renderExpandedRow={renderExpandedRow ?? (() => null)}
          />
        ) : (
          <DataTableRow
            key={vRow.key}
            row={vRow.data.row}
            rowIndex={vRow.data.rowIndex}
            columns={columns}
            columnMeta={columnMeta}
            getEffectivePinPosition={getEffectivePinPosition}
            isSelected={selectedRows.has(vRow.data.row.id)}
            isExpanded={expandedRows.has(vRow.data.row.id)}
            isActive={activeRowId === vRow.data.row.id}
            isFocused={focusedIndex === vRow.data.rowIndex}
            isLastRow={idx === virtualRows.length - 1 && bottomSpacerHeight === 0}
            selectable={selectable}
            showColumnBorders={showColumnBorders}
            zebra={zebra}
            enableExpansion={enableExpansion}
            canExpand={getRowCanExpand ? getRowCanExpand(vRow.data.row) : !!renderExpandedRow}
            onSelect={onSelect}
            onToggleExpand={onToggleExpand}
            onRowClick={onRowClick}
            onRowContextMenu={onRowContextMenu}
            onCellContextMenu={onCellContextMenu}
            onRowHover={onRowHover}
            density={density}
            data-index={vRow.index}
            inlineEditing={inlineEditing}
            cellSelectionEnabled={cellSelectionEnabled}
            getCellSelectionContext={getCellSelectionContext}
            onCellClick={onCellClick}
            onCellKeyDown={onCellKeyDown}
          />
        ),
      )}
      {bottomSpacerHeight > 0 ? (
        <tr aria-hidden="true" className="pointer-events-none">
          <td
            colSpan={colSpan}
            className="border-0 p-0"
            style={{ height: `${bottomSpacerHeight}px` }}
          />
        </tr>
      ) : null}
    </tbody>
  );
}

export default VirtualizedBody;
