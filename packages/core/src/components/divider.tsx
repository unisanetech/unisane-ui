import React from 'react';
import { cn } from '../lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'full-bleed' | 'inset' | 'middle';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'full-bleed',
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-outline-soft shrink-0',
        orientation === 'horizontal' && 'h-px w-full',
        orientation === 'vertical' && 'h-full w-px',
        variant === 'inset' && orientation === 'horizontal' && 'ml-16',
        variant === 'inset' && orientation === 'vertical' && 'mt-16',
        variant === 'middle' && orientation === 'horizontal' && 'mx-16',
        variant === 'middle' && orientation === 'vertical' && 'my-16',
        className,
      )}
      role="separator"
      {...props}
    />
  );
};
