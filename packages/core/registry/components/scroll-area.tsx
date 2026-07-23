import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'both';
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, className, orientation = 'vertical', tabIndex = 0, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      tabIndex={tabIndex}
      className={cn(
        orientation === 'vertical' && 'overflow-x-hidden overflow-y-auto',
        orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
        orientation === 'both' && 'overflow-auto',
        className,
      )}
    >
      {children}
    </div>
  ),
);

ScrollArea.displayName = 'ScrollArea';
