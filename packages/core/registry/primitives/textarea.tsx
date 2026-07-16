'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { getFieldSizeStyles, type FieldSize } from '@/lib/field-size';

export type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> & {
  size?: FieldSize;
};

/**
 * Textarea primitive - a basic styled textarea element.
 *
 * For most cases, use TextField with multiline which includes the canonical
 * label and validation contract.
 * Use this Textarea primitive when you need lower-level control or custom compositions.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const fieldSize = getFieldSizeStyles(size);

    return (
      <textarea
        className={cn(
          'border-outline-variant bg-surface text-on-surface ring-offset-surface placeholder:text-on-surface-variant focus-visible:ring-primary flex w-full rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          fieldSize.textareaMinHeight,
          fieldSize.horizontalPadding,
          fieldSize.textareaPaddingY,
          fieldSize.valueText,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
