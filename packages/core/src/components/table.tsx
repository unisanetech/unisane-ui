import React from 'react';
import { cn } from '../lib/utils';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  className,
  children,
  ...props
}) => (
  <table
    className={cn('text-body-small w-full min-w-max caption-bottom border-collapse', className)}
    {...props}
  >
    {children}
  </table>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  ...props
}) => (
  <thead
    className={cn(
      'bg-surface-container-low border-outline-weak sticky top-0 z-10 border-b',
      className,
    )}
    {...props}
  />
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  ...props
}) => <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className,
  ...props
}) => (
  <tr
    className={cn(
      'border-outline-weak hover:bg-surface-container-low border-b transition-colors',
      className,
    )}
    {...props}
  />
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  scope = 'col',
  ...props
}) => (
  <th
    scope={scope}
    className={cn(
      'text-label-medium text-on-surface-variant h-11 px-6 text-left align-middle font-medium whitespace-nowrap select-none',
      className,
    )}
    {...props}
  />
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  ...props
}) => (
  <td
    className={cn('text-on-surface px-6 py-4 align-middle font-medium tabular-nums', className)}
    {...props}
  />
);
