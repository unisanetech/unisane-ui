'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

/**
 * Label component for form accessibility.
 *
 * For most cases, use TextField which includes a built-in label.
 * Use this Label component when you need standalone label functionality.
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-label-large text-on-surface leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-38',
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="text-error ml-1">
          *
        </span>
      )}
    </label>
  ),
);
Label.displayName = 'Label';
