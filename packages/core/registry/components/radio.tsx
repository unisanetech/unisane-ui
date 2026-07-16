'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  type SelectionControlSize,
  selectionControlSizeClasses,
} from '@/lib/selection-control-size';
import { Ripple } from '@/components/ui/ripple';

export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  invalid?: boolean;
  label?: React.ReactNode;
  size?: SelectionControlSize;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      'aria-invalid': ariaInvalid,
      className,
      disabled = false,
      id: providedId,
      invalid = false,
      label,
      size = 'md',
      ...inputProps
    },
    forwardedRef,
  ) => {
    const generatedId = React.useId();
    const id = providedId ?? generatedId;
    const sizeClasses = selectionControlSizeClasses[size];
    const resolvedInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true';

    return (
      <label
        htmlFor={id}
        className={cn(
          'group relative inline-flex cursor-pointer items-center gap-3 select-none',
          disabled && 'cursor-not-allowed opacity-38',
          className,
        )}
      >
        <span
          className={cn('relative flex shrink-0 items-center justify-center', sizeClasses.frame)}
        >
          <span
            aria-hidden="true"
            className={cn(
              'absolute inset-0 z-0 overflow-hidden rounded-full transition-colors',
              'group-hover:bg-state-hover',
              resolvedInvalid && 'group-hover:bg-state-error',
            )}
          >
            <Ripple
              center
              disabled={disabled}
              className={resolvedInvalid ? 'text-error' : 'text-primary'}
            />
          </span>

          <input
            {...inputProps}
            ref={forwardedRef}
            id={id}
            type="radio"
            disabled={disabled}
            aria-invalid={resolvedInvalid || undefined}
            className="peer sr-only"
          />

          <span
            aria-hidden="true"
            className={cn(
              'bg-surface relative z-10 flex items-center justify-center rounded-full border-2',
              sizeClasses.control,
              'duration-snappy ease-emphasized transition-colors',
              resolvedInvalid
                ? 'border-error peer-checked:border-error'
                : 'border-outline group-hover:border-on-surface peer-checked:border-primary',
              'peer-focus-visible:ring-focus-ring peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
              "after:duration-snappy after:ease-emphasized after:block after:scale-0 after:rounded-full after:transition-transform after:content-['']",
              sizeClasses.radioDot,
              resolvedInvalid
                ? 'after:bg-error peer-checked:after:scale-100'
                : 'after:bg-primary peer-checked:after:scale-100',
            )}
          />
        </span>

        {label !== undefined && label !== null ? (
          <span className="text-body-medium text-on-surface leading-none font-medium">{label}</span>
        ) : null}
      </label>
    );
  },
);

Radio.displayName = 'Radio';
