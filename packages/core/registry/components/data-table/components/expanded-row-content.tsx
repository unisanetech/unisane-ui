import React, { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface DataTableExpandedContentProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  metadata?: ReactNode;
  actions?: ReactNode;
}

export const DataTableExpandedContent = forwardRef<HTMLElement, DataTableExpandedContentProps>(
  ({ title, description, metadata, actions, children, className, ...props }, ref) => (
    <section ref={ref} className={cn('min-w-0', className)} {...props}>
      <div className="flex min-w-0 flex-col gap-3 @lg:flex-row @lg:items-start @lg:justify-between">
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="text-title-medium text-on-surface min-w-0 font-semibold wrap-break-word">
              {title}
            </h3>
            {metadata && <div className="flex flex-wrap items-center gap-1.5">{metadata}</div>}
          </div>
          {description && (
            <div className="text-body-medium text-on-surface-variant mt-1 max-w-prose leading-relaxed wrap-break-word">
              {description}
            </div>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 @lg:justify-end">
            {actions}
          </div>
        )}
      </div>
      {children && <div className="mt-4 min-w-0">{children}</div>}
    </section>
  ),
);
DataTableExpandedContent.displayName = 'DataTableExpandedContent';

export type DataTableExpandedGridColumns = 1 | 2 | 3 | 4;

export interface DataTableExpandedGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: DataTableExpandedGridColumns;
}

const GRID_COLUMNS: Record<DataTableExpandedGridColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 @lg:grid-cols-2',
  3: 'grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3',
  4: 'grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-4',
};

export const DataTableExpandedGrid = forwardRef<HTMLDivElement, DataTableExpandedGridProps>(
  ({ columns = 2, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid min-w-0 gap-4', GRID_COLUMNS[columns], className)}
      {...props}
    />
  ),
);
DataTableExpandedGrid.displayName = 'DataTableExpandedGrid';

export interface DataTableExpandedSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
}

export const DataTableExpandedSection = forwardRef<HTMLElement, DataTableExpandedSectionProps>(
  ({ title, description, children, className, ...props }, ref) => (
    <section ref={ref} className={cn('min-w-0', className)} {...props}>
      {title && <h4 className="text-label-large text-on-surface font-semibold">{title}</h4>}
      {description && (
        <div className="text-body-small text-on-surface-variant mt-1 leading-relaxed wrap-break-word">
          {description}
        </div>
      )}
      {children && (
        <div className={cn((title || description) && 'mt-2', 'min-w-0')}>{children}</div>
      )}
    </section>
  ),
);
DataTableExpandedSection.displayName = 'DataTableExpandedSection';

export interface DataTableExpandedFieldsProps extends HTMLAttributes<HTMLDListElement> {
  columns?: DataTableExpandedGridColumns;
}

export const DataTableExpandedFields = forwardRef<HTMLDListElement, DataTableExpandedFieldsProps>(
  ({ columns = 2, className, ...props }, ref) => (
    <dl
      ref={ref}
      className={cn('grid min-w-0 gap-x-4 gap-y-3', GRID_COLUMNS[columns], className)}
      {...props}
    />
  ),
);
DataTableExpandedFields.displayName = 'DataTableExpandedFields';

export interface DataTableExpandedFieldProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
}

export const DataTableExpandedField = forwardRef<HTMLDivElement, DataTableExpandedFieldProps>(
  ({ label, value, className, ...props }, ref) => (
    <div ref={ref} className={cn('min-w-0', className)} {...props}>
      <dt className="text-label-medium text-on-surface-variant">{label}</dt>
      <dd className="text-body-medium text-on-surface mt-0.5 wrap-break-word">{value}</dd>
    </div>
  ),
);
DataTableExpandedField.displayName = 'DataTableExpandedField';
