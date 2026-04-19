'use client';

import React, { forwardRef } from 'react';
import { cn } from '@unisane/ui';
import { getRowInteractionBackgroundClass } from './row-state';

// ─── TABLE ──────────────────────────────────────────────────────────────────

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  /** Accessible label for the table (required for screen readers) */
  'aria-label'?: string;
  /** ID of element that labels this table */
  'aria-labelledby'?: string;
  /** ID of element that describes this table */
  'aria-describedby'?: string;
  /** Total row count for virtual scrolling accessibility */
  'aria-rowcount'?: number;
  /** Total column count for accessibility */
  'aria-colcount'?: number;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      children,
      className,
      'aria-label': ariaLabel,
      'aria-rowcount': rowCount,
      'aria-colcount': colCount,
      ...props
    },
    ref,
  ) => (
    <table
      ref={ref}
      role="grid"
      aria-label={ariaLabel}
      aria-rowcount={rowCount}
      aria-colcount={colCount}
      className={cn('w-full table-fixed border-separate border-spacing-0', className)}
      {...props}
    >
      {children}
    </table>
  ),
);
Table.displayName = 'Table';

// ─── TABLE SCROLL CONTAINER ─────────────────────────────────────────────────
// This container wraps the entire table and handles horizontal scrolling.
// The sticky header positioning is handled via CSS variable --data-table-header-offset.
//
// Layout Architecture:
// - This container has overflow-x: auto for horizontal scroll
// - The thead inside uses position: sticky with top offset from CSS variable
// - Consumers wrap this in a parent that sets the CSS variable based on toolbar height

interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
  ({ children, className, style, ...props }, ref) => (
    <div
      ref={ref}
      data-datatable-scroll="body"
      className={cn(
        'bg-surface @container relative min-h-0 flex-1',
        // Horizontal scroll is always owned here.
        // Vertical scroll activates automatically when the DataTable root is height-constrained.
        'overflow-x-auto overflow-y-auto',
        className,
      )}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        touchAction: 'pan-x pan-y',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  ),
);
TableContainer.displayName = 'TableContainer';

// ─── TABLE HEAD ─────────────────────────────────────────────────────────────

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  ({ children, className, ...props }, ref) => (
    <thead ref={ref} className={cn('', className)} {...props}>
      {children}
    </thead>
  ),
);
TableHead.displayName = 'TableHead';

// ─── TABLE BODY ─────────────────────────────────────────────────────────────

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, ...props }, ref) => (
    <tbody ref={ref} className={cn('', className)} {...props}>
      {children}
    </tbody>
  ),
);
TableBody.displayName = 'TableBody';

// ─── TABLE ROW ──────────────────────────────────────────────────────────────

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  selected?: boolean;
  active?: boolean;
  clickable?: boolean;
  /** Row index for accessibility (1-based) */
  'aria-rowindex'?: number;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    { children, className, selected, active, clickable, 'aria-rowindex': rowIndex, ...props },
    ref,
  ) => (
    <tr
      ref={ref}
      role="row"
      aria-selected={selected}
      aria-rowindex={rowIndex}
      className={cn(
        'group duration-snappy transition-colors',
        getRowInteractionBackgroundClass({ isSelected: selected, isActive: active }),
        clickable && 'cursor-pointer',
        !selected && !active && 'hover:bg-surface-container-low',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  ),
);
TableRow.displayName = 'TableRow';

// ─── TABLE HEADER CELL ──────────────────────────────────────────────────────

interface TableHeaderCellProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  children?: React.ReactNode;
  sortable?: boolean;
  /** Current sort direction */
  sortDirection?: 'asc' | 'desc' | null;
  align?: 'start' | 'center' | 'end';
  pinned?: 'left' | 'right' | null;
  /** Column index for accessibility (1-based) */
  'aria-colindex'?: number;
}

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  (
    {
      children,
      className,
      sortable,
      sortDirection,
      align = 'start',
      pinned,
      'aria-colindex': colIndex,
      ...props
    },
    ref,
  ) => (
    <th
      ref={ref}
      role="columnheader"
      scope="col"
      aria-colindex={colIndex}
      aria-sort={
        sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : undefined
      }
      className={cn(
        'text-label-large text-on-surface-variant font-medium whitespace-nowrap',
        'bg-surface-container-low border-outline-subtle border-b',
        sortable && 'hover:bg-surface-container cursor-pointer select-none',
        align === 'start' && 'text-left',
        align === 'center' && 'text-center',
        align === 'end' && 'text-right',
        // z-20 matches header cells for consistent stacking
        // Only enable sticky on tablet+ (≥768px container width) - mobile scrolls everything together
        pinned === 'left' && 'isolate z-20 @md:sticky',
        pinned === 'right' && 'isolate z-20 @md:sticky',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  ),
);
TableHeaderCell.displayName = 'TableHeaderCell';

// ─── TABLE CELL ─────────────────────────────────────────────────────────────

interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  children?: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  pinned?: 'left' | 'right' | null;
  /** Column index for accessibility (1-based) */
  'aria-colindex'?: number;
  /** Whether this cell is selected */
  'aria-selected'?: boolean;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    {
      children,
      className,
      align = 'start',
      pinned,
      'aria-colindex': colIndex,
      'aria-selected': selected,
      ...props
    },
    ref,
  ) => (
    <td
      ref={ref}
      role="gridcell"
      aria-colindex={colIndex}
      aria-selected={selected}
      className={cn(
        'text-body-medium text-on-surface overflow-hidden text-ellipsis whitespace-nowrap',
        'bg-surface border-outline-subtle border-b',
        'group-hover:bg-surface-container-low transition-colors',
        align === 'start' && 'text-left',
        align === 'center' && 'text-center',
        align === 'end' && 'text-right',
        // z-20 matches header cells for consistent stacking
        // Only enable sticky on tablet+ (≥768px container width) - mobile scrolls everything together
        pinned === 'left' && 'isolate z-20 @md:sticky',
        pinned === 'right' && 'isolate z-20 @md:sticky',
        className,
      )}
      {...props}
    >
      {children}
    </td>
  ),
);
TableCell.displayName = 'TableCell';
