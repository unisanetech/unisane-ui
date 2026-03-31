'use client';

import { type InputHTMLAttributes, useId, forwardRef } from 'react';
import { cn } from '../lib/utils';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  disabled?: boolean;
  icons?: boolean;
  className?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, disabled = false, icons = false, className = '', id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    return (
      <label
        htmlFor={id}
        className={cn(
          'group relative inline-flex min-h-8 cursor-pointer items-center gap-3 select-none',
          disabled && 'pointer-events-none cursor-not-allowed opacity-38',
          className,
        )}
      >
        <div className="group/switch relative h-[calc(var(--unit)*8)] w-[calc(var(--unit)*13)] shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            role="switch"
            className="peer sr-only"
            disabled={disabled}
            {...props}
          />

          <div
            className={cn(
              'duration-medium ease-standard absolute inset-0 rounded-full border-2 transition-colors',
              'border-outline bg-surface-container-highest',
              'peer-checked:bg-primary peer-checked:border-primary',
              'peer-focus-visible:ring-focus-ring peer-focus-visible:ring-2',
            )}
          />

          <div
            className={cn(
              'duration-emphasized ease-emphasized absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full transition-all',
              'bg-outline group-hover:bg-on-surface-variant peer-checked:bg-on-primary',
              'relative overflow-hidden',
              icons && [
                '[&_.switch-icon-off]:opacity-100',
                'peer-checked:[&_.switch-icon-off]:opacity-0',
                '[&_.switch-icon-on]:opacity-0',
                'peer-checked:[&_.switch-icon-on]:opacity-100',
              ],
              icons
                ? 'size-icon-md left-[var(--unit)] peer-checked:left-[calc(var(--unit)*13-var(--icon-md)-var(--unit))]'
                : 'size-icon-xs peer-checked:size-icon-md left-[calc(var(--unit)*2)] peer-checked:left-[calc(var(--unit)*13-var(--icon-md)-var(--unit))]',
            )}
          >
            {icons && (
              <>
                <span
                  aria-hidden="true"
                  className="switch-icon-off text-on-primary duration-snappy ease-standard pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity"
                >
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

                <span
                  aria-hidden="true"
                  className="switch-icon-on text-primary duration-snappy ease-standard pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity"
                >
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
            )}
          </div>
        </div>
        {label && (
          <span className="text-body-medium text-on-surface leading-none font-medium">{label}</span>
        )}
      </label>
    );
  },
);

Switch.displayName = 'Switch';
