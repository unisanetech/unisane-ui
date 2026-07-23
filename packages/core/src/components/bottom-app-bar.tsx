import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing } from '../lib/utils';
import { Surface } from '../primitives/surface';
import { Ripple } from './ripple';

const bottomAppBarVariants = cva(
  'fixed bottom-0 left-0 right-0 h-20 flex items-center justify-between px-4 z-20',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BottomAppBarProps = VariantProps<typeof bottomAppBarVariants> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    children: React.ReactNode;
    fab?: React.ReactNode;
  };

export const BottomAppBar = forwardRef<HTMLDivElement, BottomAppBarProps>(
  (
    { children, fab, className, variant, ['aria-label']: ariaLabel = 'Bottom actions', ...props },
    ref,
  ) => (
    <Surface
      ref={ref}
      tone="surface"
      elevation={3}
      className={cn(bottomAppBarVariants({ variant, className }))}
      role="toolbar"
      aria-label={ariaLabel}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2">{children}</div>

      {fab && <div className="absolute -top-8 left-1/2 -translate-x-1/2">{fab}</div>}
    </Surface>
  ),
);

BottomAppBar.displayName = 'BottomAppBar';

const bottomAppBarActionVariants = cva(
  'relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-icon-button select-none transition-colors duration-short disabled:pointer-events-none disabled:opacity-38',
  {
    variants: {
      active: {
        true: 'text-primary',
        false: 'text-on-surface-variant hover:text-primary',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export type BottomAppBarActionProps = VariantProps<typeof bottomAppBarActionVariants> & {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export const BottomAppBarAction = forwardRef<HTMLButtonElement, BottomAppBarActionProps>(
  ({ icon, label, active, className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(bottomAppBarActionVariants({ active, className }), focusRing)}
      aria-label={props['aria-label'] ?? label}
      aria-pressed={active}
      {...props}
    >
      <Ripple />
      <div className="size-icon-sm relative z-10 flex items-center justify-center">{icon}</div>
    </button>
  ),
);

BottomAppBarAction.displayName = 'BottomAppBarAction';
