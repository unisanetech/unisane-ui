'use client';

import { type InputHTMLAttributes, useId, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/primitives/icon';

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
              icons
                ? 'size-icon-md left-[var(--unit)] peer-checked:left-[calc(var(--unit)*13-var(--icon-md)-var(--unit))]'
                : 'size-icon-xs peer-checked:size-icon-md left-[calc(var(--unit)*2)] peer-checked:left-[calc(var(--unit)*13-var(--icon-md)-var(--unit))]',
            )}
          />

          {icons && (
            <>
              <Icon
                symbol="close"
                size="xs"
                className="text-surface-container-highest duration-snappy ease-standard absolute top-1/2 left-[calc(var(--unit)+var(--icon-md)/2)] z-20 -translate-x-1/2 -translate-y-1/2 opacity-100 transition-opacity peer-checked:opacity-0"
              />

              <Icon
                symbol="check"
                size="xs"
                className="text-primary duration-snappy ease-standard absolute top-1/2 left-[calc(var(--unit)*13-var(--icon-md)/2-var(--unit))] z-20 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity peer-checked:opacity-100"
              />
            </>
          )}
        </div>
        {label && (
          <span className="text-body-medium text-on-surface leading-none font-medium">{label}</span>
        )}
      </label>
    );
  },
);

Switch.displayName = 'Switch';
