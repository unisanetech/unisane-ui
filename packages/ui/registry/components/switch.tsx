'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  invalid?: boolean;
  label?: React.ReactNode;
  showIcons?: boolean;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      'aria-invalid': ariaInvalid,
      className,
      disabled = false,
      id: providedId,
      invalid = false,
      label,
      showIcons = false,
      ...inputProps
    },
    forwardedRef,
  ) => {
    const generatedId = React.useId();
    const id = providedId ?? generatedId;
    const resolvedInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true';

    return (
      <label
        htmlFor={id}
        className={cn(
          'group relative inline-flex min-h-8 cursor-pointer items-center gap-3 select-none',
          disabled && 'cursor-not-allowed opacity-38',
          className,
        )}
      >
        <span className="group/switch relative h-[calc(var(--unit)*8)] w-[calc(var(--unit)*13)] shrink-0">
          <input
            {...inputProps}
            ref={forwardedRef}
            id={id}
            type="checkbox"
            role="switch"
            disabled={disabled}
            aria-invalid={resolvedInvalid || undefined}
            className="peer sr-only"
          />

          <span
            aria-hidden="true"
            className={cn(
              'duration-medium ease-standard absolute inset-0 rounded-full border-2 transition-colors',
              resolvedInvalid
                ? 'border-error bg-error-container peer-checked:bg-error peer-checked:border-error'
                : 'border-control-outline bg-surface-container-highest peer-checked:bg-primary peer-checked:border-primary',
              'peer-focus-visible:ring-focus-ring peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
            )}
          />

          <span
            aria-hidden="true"
            className={cn(
              'duration-emphasized ease-emphasized absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center overflow-hidden rounded-full transition-all',
              resolvedInvalid
                ? 'bg-error peer-checked:bg-on-error'
                : 'bg-control-outline group-hover:bg-on-surface-variant peer-checked:bg-on-primary',
              showIcons && [
                '[&_.switch-icon-off]:opacity-100',
                'peer-checked:[&_.switch-icon-off]:opacity-0',
                '[&_.switch-icon-on]:opacity-0',
                'peer-checked:[&_.switch-icon-on]:opacity-100',
              ],
              showIcons
                ? 'size-icon-md left-[var(--unit)] peer-checked:left-[calc(var(--unit)*13-var(--icon-md)-var(--unit))]'
                : 'size-icon-xs peer-checked:size-icon-md left-[calc(var(--unit)*2)] peer-checked:left-[calc(var(--unit)*13-var(--icon-md)-var(--unit))]',
            )}
          >
            {showIcons ? (
              <>
                <span className="switch-icon-off duration-snappy ease-standard pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity">
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    className="size-icon-xs"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <path d="M3 3L9 9M9 3L3 9" />
                  </svg>
                </span>
                <span className="switch-icon-on duration-snappy ease-standard pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity">
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    className="size-icon-xs"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.5 6.5L4.8 8.8L9.5 4" />
                  </svg>
                </span>
              </>
            ) : null}
          </span>
        </span>

        {label !== undefined && label !== null ? (
          <span className="text-body-medium text-on-surface leading-none font-medium">{label}</span>
        ) : null}
      </label>
    );
  },
);

Switch.displayName = 'Switch';
