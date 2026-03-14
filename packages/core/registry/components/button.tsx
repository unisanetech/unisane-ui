'use client';

import {
  type ReactNode,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type Ref,
  forwardRef,
  isValidElement,
  cloneElement,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Ripple } from './ripple';
import { cn, Slot } from '@/lib/utils';
import {
  ActionSpinner,
  ActionStateLayer,
  actionInteractiveClass,
  getActionDisabledState,
  getActionStateAttributes,
  getActionAsChildAttributes,
} from '@/lib/action-control';

const buttonVariants = cva(
  `relative inline-flex items-center justify-center gap-2 rounded-button whitespace-nowrap font-medium leading-none transition-all duration-short ease-standard ${actionInteractiveClass}`,
  {
    variants: {
      variant: {
        filled: 'bg-primary text-on-primary',
        tonal: 'bg-secondary-container text-on-secondary-container',
        outlined:
          'border border-outline-variant text-on-surface bg-transparent focus-visible:border-primary',
        text: 'text-primary bg-transparent',
        elevated: 'bg-surface-container-low text-primary shadow-1',
      },
      size: {
        sm: 'h-8 px-4 text-label-medium',
        md: 'h-10 px-6 text-label-large',
        lg: 'h-12 px-8 text-label-large',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: ReactNode;
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'filled',
      size = 'md',
      disabled = false,
      loading = false,
      icon,
      trailingIcon,
      className = '',
      type = 'button',
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const iconSizeClass = 'size-icon-sm';
    const isDisabled = getActionDisabledState(disabled, loading);
    const canRenderAsChild = asChild && isValidElement(children);
    const buttonClasses = cn(buttonVariants({ variant, size }), className);

    const renderContent = (content: ReactNode) => (
      <>
        <ActionStateLayer className="duration-snappy" />
        <Ripple disabled={isDisabled} />
        {loading && (
          <ActionSpinner className={`${iconSizeClass} relative z-10`} />
        )}

        {!loading && icon && (
          <span
            className={`${iconSizeClass} pointer-events-none relative z-10 flex shrink-0 items-center justify-center`}
          >
            {icon}
          </span>
        )}

        <span
          className={cn(
            'pointer-events-none relative z-10 inline-flex items-center justify-center gap-2',
            loading ? 'opacity-0' : 'opacity-100',
          )}
        >
          {content}
        </span>

        {!loading && trailingIcon && (
          <span
            className={`${iconSizeClass} pointer-events-none relative z-10 flex shrink-0 items-center justify-center`}
          >
            {trailingIcon}
          </span>
        )}
      </>
    );

    if (canRenderAsChild) {
      const childElement = children as ReactElement<Record<string, unknown>>;
      const childProps = childElement.props as {
        children?: ReactNode;
        onClick?: (event: MouseEvent<HTMLElement>) => void;
        tabIndex?: number;
      };
      const forwardedChildProps = getActionAsChildAttributes(
        isDisabled,
        loading,
        props as Record<string, unknown> & {
          onClick?: ((event: MouseEvent<HTMLElement>) => void) | undefined;
          tabIndex?: number | undefined;
        },
        childProps,
      );

      return (
        <Slot
          ref={ref as Ref<HTMLElement>}
          className={buttonClasses}
        >
          {cloneElement(childElement, forwardedChildProps, renderContent(childProps.children))}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={isDisabled}
        {...getActionStateAttributes(isDisabled, loading)}
        {...props}
      >
        {renderContent(children)}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { buttonVariants };
