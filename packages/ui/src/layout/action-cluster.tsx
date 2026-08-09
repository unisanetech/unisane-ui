import React from 'react';
import { cn } from '../lib/utils';

export interface ActionClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end' | 'stretch';
  collapse?: 'sm' | 'md' | 'never';
}

const alignClasses = {
  start: 'items-start justify-start',
  center: 'items-center justify-center',
  end: 'items-end justify-end',
  stretch: 'items-stretch justify-start',
} as const;

const collapseClasses = {
  sm: 'flex-col sm:flex-row [&>*]:w-full sm:[&>*]:w-auto',
  md: 'flex-col md:flex-row [&>*]:w-full md:[&>*]:w-auto',
  never: 'flex-row flex-wrap',
} as const;

export const ActionCluster = React.forwardRef<HTMLDivElement, ActionClusterProps>(
  ({ align = 'start', collapse = 'sm', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'gap-layout-cluster-gap flex min-w-0',
          alignClasses[align],
          collapseClasses[collapse],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
ActionCluster.displayName = 'ActionCluster';
