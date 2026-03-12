'use client';

import { type InputHTMLAttributes, useId, forwardRef, useEffect, useRef } from 'react';
import { Ripple } from './ripple';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: boolean;
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      disabled = false,
      indeterminate = false,
      error = false,
      className = '',
      id: providedId,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);

    const setInputRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <label
        htmlFor={id}
        className={cn(
          'group relative inline-flex cursor-pointer items-center gap-3 select-none',
          disabled && 'pointer-events-none cursor-not-allowed opacity-38',
          className,
        )}
      >
        {}
        <div className="relative flex h-10 w-10 items-center justify-center">
          {}
          <div
            className={cn(
              'absolute inset-0 z-0 overflow-hidden rounded-xs transition-colors',
              'group-hover:bg-state-hover',
              error && 'group-hover:bg-state-error',
            )}
          >
            <Ripple
              center
              disabled={disabled}
              className={cn(error ? 'text-error' : 'text-primary')}
            />
          </div>

          {}
          <input
            ref={setInputRef}
            type="checkbox"
            id={id}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />

          {}
          <div
            className={cn(
              'size-icon-sm bg-surface relative z-10 flex items-center justify-center overflow-hidden rounded-xs border-2',
              'duration-snappy ease-emphasized pointer-events-none transition-all',
              !error && 'border-outline group-hover:border-on-surface',
              error && 'border-error',
              !error && 'peer-checked:bg-primary peer-checked:border-primary',
              error && 'peer-checked:bg-error peer-checked:border-error',
              !error && 'peer-indeterminate:bg-primary peer-indeterminate:border-primary',
              error && 'peer-indeterminate:bg-error peer-indeterminate:border-error',
              'peer-focus-visible:ring-primary peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
            )}
          />

          {}
          <svg
            className={cn(
              'size-icon-sm duration-snappy ease-emphasized pointer-events-none absolute z-20 p-0.5 transition-all',
              error ? 'text-on-error' : 'text-on-primary',
              'scale-50 opacity-0',
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

          {}
          <svg
            className={cn(
              'size-icon-sm duration-snappy ease-emphasized pointer-events-none absolute z-20 p-0.5 transition-all',
              error ? 'text-on-error' : 'text-on-primary',
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
        </div>

        {label && (
          <span className="text-body-medium text-on-surface leading-none font-medium">{label}</span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
