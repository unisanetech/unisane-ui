'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Input primitive - a basic styled input element.
 *
 * For most cases, use TextField which includes a label and follows Material 3 guidelines.
 * Use this Input primitive when you need lower-level control or custom compositions.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'border-outline-variant bg-surface text-body-medium text-on-surface ring-offset-surface file:text-body-small file:text-on-surface placeholder:text-on-surface-variant focus-visible:ring-primary flex h-10 w-full rounded-sm border px-4 file:border-0 file:bg-transparent file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
