'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { getFieldSizeStyles, type FieldSize } from '../lib/field-size';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: FieldSize;
};

/**
 * Input primitive - a basic styled input element.
 *
 * For most cases, use TextField which includes the canonical label and validation contract.
 * Use this Input primitive when you need lower-level control or custom compositions.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size = 'md', ...props }, ref) => {
    const fieldSize = getFieldSizeStyles(size);

    return (
      <input
        type={type}
        className={cn(
          'border-control-outline bg-surface text-on-surface ring-offset-surface file:text-body-small file:text-on-surface placeholder:text-on-surface-variant focus-visible:ring-focus-ring flex w-full rounded-sm border file:border-0 file:bg-transparent file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-38',
          fieldSize.containerHeight,
          fieldSize.horizontalPadding,
          fieldSize.valueText,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
