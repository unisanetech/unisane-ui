'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  type SelectionControlSize,
  selectionControlSizeClasses,
} from '@/lib/selection-control-size';
import { Ripple } from '@/components/ui/ripple';

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  indeterminate?: boolean;
  invalid?: boolean;
  label?: React.ReactNode;
  size?: SelectionControlSize;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      'aria-invalid': ariaInvalid,
      className,
      disabled = false,
      id: providedId,
      indeterminate = false,
      invalid = false,
      label,
      size = 'md',
      ...inputProps
    },
    forwardedRef,
  ) => {
    const generatedId = React.useId();
    const id = providedId ?? generatedId;
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const sizeClasses = selectionControlSizeClasses[size];
    const resolvedInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true';

    React.useLayoutEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const setInputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

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
              'absolute inset-0 z-0 overflow-hidden rounded-xs transition-colors',
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
            ref={setInputRef}
            id={id}
            type="checkbox"
            disabled={disabled}
            aria-checked={indeterminate ? 'mixed' : undefined}
            aria-invalid={resolvedInvalid || undefined}
            className="peer sr-only"
          />

          <span
            aria-hidden="true"
            className={cn(
              'bg-surface relative z-10 flex items-center justify-center overflow-hidden rounded-xs border-2',
              sizeClasses.control,
              'duration-snappy ease-emphasized pointer-events-none transition-all',
              resolvedInvalid
                ? 'border-error peer-checked:bg-error peer-checked:border-error peer-indeterminate:bg-error peer-indeterminate:border-error'
                : 'border-outline-medium group-hover:border-on-surface peer-checked:bg-primary peer-checked:border-primary peer-indeterminate:bg-primary peer-indeterminate:border-primary',
              'peer-focus-visible:ring-focus-ring peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
            )}
          />

          <svg
            className={cn(
              'duration-snappy ease-emphasized pointer-events-none absolute z-20 scale-50 opacity-0 transition-all',
              sizeClasses.icon,
              resolvedInvalid ? 'text-on-error' : 'text-on-primary',
              !indeterminate && 'peer-checked:scale-100 peer-checked:opacity-100',
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>

          <svg
            className={cn(
              'duration-snappy ease-emphasized pointer-events-none absolute z-20 transition-all',
              sizeClasses.icon,
              resolvedInvalid ? 'text-on-error' : 'text-on-primary',
              indeterminate ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0',
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>

        {label !== undefined && label !== null ? (
          <span className="text-body-medium text-on-surface leading-none font-medium">{label}</span>
        ) : null}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
