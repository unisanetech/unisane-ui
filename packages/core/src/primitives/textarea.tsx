'use client';

import * as React from 'react';
import { cn } from '@ui/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Textarea primitive - a basic styled textarea element.
 *
 * For most cases, use TextField with multiline={true} which includes a label
 * and follows Material 3 guidelines.
 * Use this Textarea primitive when you need lower-level control or custom compositions.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'border-outline-variant bg-surface text-body-medium text-on-surface ring-offset-surface placeholder:text-on-surface-variant focus-visible:ring-primary flex min-h-[80px] w-full rounded-sm border px-4 py-3 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
