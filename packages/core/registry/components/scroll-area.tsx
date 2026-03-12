import React from 'react';
import { cn } from '@/lib/utils';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'both';
  scrollbarClassName?: string;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  className,
  orientation = 'vertical',
  scrollbarClassName,
  ...props
}) => {
  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      <div
        className={cn(
          'h-full w-full',
          orientation === 'vertical' && 'overflow-x-hidden overflow-y-auto',
          orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
          orientation === 'both' && 'overflow-auto',
          'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-outline-muted',
          '[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:bg-outline-medium [&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb]:hover:bg-outline-strong',

          scrollbarClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};
