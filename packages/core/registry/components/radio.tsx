'use client';

import { type InputHTMLAttributes, useId, forwardRef } from 'react';
import { Ripple } from '@/components/ui/ripple';
import { cn } from '@/lib/utils';
import { type SelectionControlSize, selectionControlSizeClasses } from '@/lib/selection-control-size';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  disabled?: boolean;
  error?: boolean;
  size?: SelectionControlSize;
  className?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    { label, disabled = false, error = false, size = 'md', className = '', id: providedId, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const sizeClasses = selectionControlSizeClasses[size];

    return (
      <label
        htmlFor={id}
        className={cn(
          'group relative inline-flex cursor-pointer items-center gap-3 select-none',
          disabled && 'pointer-events-none cursor-not-allowed opacity-38',
          className,
        )}
      >
        <div className={cn('relative flex items-center justify-center', sizeClasses.frame)}>
          <div
            className={cn(
              'absolute inset-0 z-0 overflow-hidden rounded-full transition-colors',
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

          <input
            ref={ref}
            type="radio"
            id={id}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />

          <div
            className={cn(
              'bg-surface relative z-10 rounded-full border-2',
              sizeClasses.control,
              'duration-snappy ease-emphasized flex items-center justify-center transition-colors',
              !error && 'border-outline group-hover:border-on-surface',
              !error && 'peer-checked:border-primary',
              error && 'border-error peer-checked:border-error',
              'peer-focus-visible:ring-primary peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
              "after:duration-snappy after:ease-emphasized after:block after:scale-0 after:rounded-full after:transition-transform after:content-['']",
              sizeClasses.radioDot,
              !error && 'after:bg-primary peer-checked:after:scale-100',
              error && 'after:bg-error peer-checked:after:scale-100',
            )}
          />
        </div>

        {label && (
          <span className="text-body-small text-on-surface pt-0.5 leading-none font-medium">
            {label}
          </span>
        )}
      </label>
    );
  },
);

Radio.displayName = 'Radio';
