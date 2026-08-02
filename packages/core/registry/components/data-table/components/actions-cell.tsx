'use client';

import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { RowContextMenuItem, RowContextMenuItemOrSeparator } from '@/components/ui/data-table/types/index';
import { useI18n } from '@/components/ui/data-table/i18n';
import type { Column } from '@/components/ui/data-table/types/index';

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface ActionsCellProps<T extends { id: string }> {
  /** The row data */
  row: T;
  /** Menu items to display */
  items: RowContextMenuItemOrSeparator<T>[];
  /** Size of the trigger button */
  size?: 'sm' | 'md';
  /** Alignment of the dropdown */
  align?: 'start' | 'end';
  /** Additional class name for the trigger button */
  className?: string;
  /** Whether the cell is disabled */
  disabled?: boolean;
}

// ─── HELPER ──────────────────────────────────────────────────────────────────

function isMenuItem<T>(item: RowContextMenuItemOrSeparator<T>): item is RowContextMenuItem<T> {
  return !('type' in item && item.type === 'separator');
}

// ─── ACTIONS CELL COMPONENT ──────────────────────────────────────────────────

/**
 * ActionsCell - A cell component that displays a vertical ellipsis button
 * which opens a dropdown menu with row-level actions.
 *
 * @example
 * ```tsx
 * <ActionsCell
 *   row={user}
 *   items={[
 *     { key: "edit", label: "Edit", icon: "edit", onClick: (row) => editUser(row) },
 *     { key: "delete", label: "Delete", icon: "delete", tone: "danger", onClick: (row) => deleteUser(row) },
 *   ]}
 * />
 * ```
 */
export function ActionsCell<T extends { id: string }>({
  row,
  items,
  size = 'sm',
  align = 'end',
  className,
  disabled = false,
}: ActionsCellProps<T>) {
  const { t } = useI18n();

  // Filter visible items
  const visibleItems = items.filter((item) => {
    if (!isMenuItem(item)) return true;
    if (item.visible === undefined) return true;
    if (typeof item.visible === 'function') return item.visible(row);
    return item.visible;
  });

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            disabled={disabled}
            variant="standard"
            size={size}
            aria-label={t('actions')}
            className={className}
            icon={<Icon symbol="more_vert" />}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent align={align} className="min-w-44" portal>
          {visibleItems.map((item, index) => {
            // Separator
            if (!isMenuItem(item)) {
              return <DropdownMenuSeparator key={item.key ?? `separator-${index}`} />;
            }

            // Menu item
            const isDisabled =
              typeof item.disabled === 'function' ? item.disabled(row) : item.disabled;

            const icon = item.icon;
            const iconElement =
              typeof icon === 'string' ? <Icon symbol={icon} className="h-4 w-4" /> : icon;

            return (
              <ActionMenuItem
                key={item.key}
                item={item}
                row={row}
                icon={iconElement}
                disabled={isDisabled}
              />
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ─── ACTION MENU ITEM ────────────────────────────────────────────────────────

interface ActionMenuItemProps<T extends { id: string }> {
  item: RowContextMenuItem<T>;
  row: T;
  icon: React.ReactNode;
  disabled?: boolean;
}

function ActionMenuItem<T extends { id: string }>({
  item,
  row,
  icon,
  disabled,
}: ActionMenuItemProps<T>) {
  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      await item.onClick(row, e);
    },
    [item, row, disabled],
  );

  return (
    <DropdownMenuItem
      icon={icon}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        item.tone === 'danger' &&
          'text-error hover:bg-state-error focus:bg-state-error [&>span:first-child]:text-error',
      )}
    >
      {item.label}
    </DropdownMenuItem>
  );
}

// ─── CREATE ACTIONS COLUMN HELPER ────────────────────────────────────────────

export interface CreateActionsColumnOptions<T extends { id: string }> {
  /** Menu items to display */
  items: RowContextMenuItemOrSeparator<T>[];
  /** Column header (defaults to empty) */
  header?: string;
  /** Column width (defaults to 48) */
  width?: number;
  /** Pin position */
  pinned?: 'left' | 'right' | null;
  /** Size of the trigger button */
  size?: 'sm' | 'md';
  /** Alignment of the dropdown */
  align?: 'start' | 'end';
  /** Whether the column is hideable */
  hideable?: boolean;
  /** Custom column key (defaults to "__actions") */
  key?: string;
}

/**
 * Creates a column definition for an actions cell with dropdown menu.
 *
 * @example
 * ```tsx
 * const columns: Column<User>[] = [
 *   { key: "name", header: "Name", ... },
 *   { key: "email", header: "Email", ... },
 *   createActionsColumn<User>({
 *     items: [
 *       { key: "edit", label: "Edit", icon: "edit", onClick: (row) => editUser(row) },
 *       { type: "separator" },
 *       { key: "delete", label: "Delete", icon: "delete", tone: "danger", onClick: (row) => deleteUser(row) },
 *     ],
 *     pinned: "right",
 *   }),
 * ];
 * ```
 */
export function createActionsColumn<T extends { id: string }>({
  items,
  header = '',
  width = 48,
  pinned = null,
  size = 'sm',
  align = 'end',
  hideable = false,
  key = '__actions',
}: CreateActionsColumnOptions<T>): Column<T> {
  return {
    key: key as keyof T & string,
    header,
    width,
    minWidth: width,
    maxWidth: width,
    sortable: false,
    filterable: false,
    reorderable: false,
    hideable,
    pinnable: false,
    pinned: pinned ?? undefined,
    align: 'center',
    printable: false, // Actions column should not be included in print output
    render: (row: T) => <ActionsCell<T> row={row} items={items} size={size} align={align} />,
  };
}

export default ActionsCell;
