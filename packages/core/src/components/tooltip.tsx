import React, { Fragment, cloneElement, isValidElement, useId } from 'react';
import { cn } from '../lib/utils';

export interface TooltipProps {
  label: string;
  subhead?: string;
  children: React.ReactNode;
  variant?: 'plain' | 'rich';
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  label,
  subhead,
  children,
  variant = 'plain',
  className,
  side = 'top',
}) => {
  const tooltipId = useId();
  const trigger =
    isValidElement<{ 'aria-describedby'?: string }>(children) && children.type !== Fragment ? (
      cloneElement(children, {
        'aria-describedby': [children.props['aria-describedby'], tooltipId]
          .filter(Boolean)
          .join(' '),
      })
    ) : (
      <span aria-describedby={tooltipId}>{children}</span>
    );

  return (
    <div className="group relative inline-flex">
      {trigger}

      <div
        id={tooltipId}
        role="tooltip"
        className={cn(
          'duration-snappy ease-emphasized pointer-events-none absolute z-[var(--z-popover,2000)] scale-95 whitespace-nowrap opacity-0 transition-all group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100',
          side === 'top' && 'bottom-[calc(100%+(var(--unit)*2))] left-1/2 -translate-x-1/2',
          side === 'bottom' && 'top-[calc(100%+(var(--unit)*2))] left-1/2 -translate-x-1/2',
          side === 'left' && 'top-1/2 right-[calc(100%+(var(--unit)*2))] -translate-y-1/2',
          side === 'right' && 'top-1/2 left-[calc(100%+(var(--unit)*2))] -translate-y-1/2',
          variant === 'plain'
            ? 'bg-inverse-surface text-inverse-on-surface text-label-medium shadow-2 rounded-sm px-2 py-1.5 font-medium'
            : 'bg-surface-container text-on-surface shadow-2 border-outline-soft flex min-w-50 flex-col gap-1 rounded-sm border p-4 whitespace-normal',
          className,
        )}
      >
        {variant === 'rich' && subhead && (
          <span className="text-primary text-label-small font-medium opacity-70">{subhead}</span>
        )}
        <span
          className={cn(variant === 'rich' ? 'text-body-small font-medium' : 'whitespace-nowrap')}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
