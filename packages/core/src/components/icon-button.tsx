import {
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  cloneElement,
  forwardRef,
  isValidElement,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Ripple } from './ripple';
import { cn, Slot, composeAsChildClickHandler } from '@ui/lib/utils';

const iconButtonVariants = cva(
  'relative inline-flex items-center justify-center rounded-icon-button transition-all duration-snappy ease-emphasized overflow-hidden disabled:opacity-38 disabled:cursor-not-allowed data-[disabled=true]:opacity-38 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:pointer-events-none group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary select-none',
  {
    variants: {
      variant: {
        filled: 'bg-primary text-on-primary',
        tonal: 'bg-secondary-container text-on-secondary-container',
        outlined: 'bg-transparent border border-outline-variant text-on-surface-variant',
        standard: 'bg-transparent text-on-surface-variant',
      },
      size: {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
      },
      selected: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'tonal',
        selected: true,
        className: 'bg-secondary-container text-on-secondary-container',
      },
      {
        variant: 'outlined',
        selected: true,
        className: 'bg-state-selected border-primary text-primary',
      },
      { variant: 'standard', selected: true, className: 'text-primary' },
    ],
    defaultVariants: {
      variant: 'standard',
      size: 'md',
      selected: false,
    },
  },
);

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>,
    VariantProps<typeof iconButtonVariants> {
  'aria-label': string;
  icon?: ReactNode;
  loading?: boolean;
  asChild?: boolean;
  children?: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      children,
      variant = 'standard',
      size = 'md',
      selected = false,
      disabled = false,
      loading = false,
      asChild = false,
      'aria-label': ariaLabel,
      className = '',
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const canRenderAsChild = asChild && isValidElement(children);
    const iconSizeClasses = {
      sm: 'size-icon-sm',
      md: 'size-icon-md',
      lg: 'size-icon-md',
    };
    const resolvedContent = children ?? icon;
    const renderContent = (content: ReactNode) => {
      const sizeClass = iconSizeClasses[size || 'md'];

      return (
        <>
          <div className="group-hover:opacity-hover group-focus-visible:opacity-focus group-active:opacity-pressed pointer-events-none absolute inset-0 z-0 bg-current opacity-0 transition-opacity" />
          <Ripple center disabled={isDisabled} />
          {loading ? (
            <svg
              className={cn('relative z-10 animate-spin', sizeClass)}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <span className={cn('relative z-10 flex items-center justify-center', sizeClass)}>
              {content}
            </span>
          )}
        </>
      );
    };

    if (canRenderAsChild) {
      const childElement = children as ReactElement<Record<string, unknown>>;
      const childProps = childElement.props as {
        children?: ReactNode;
        onClick?: (event: MouseEvent<HTMLElement>) => void;
        tabIndex?: number;
      };
      const forwardedChildProps: Record<string, unknown> = {
        ...props,
        onClick: composeAsChildClickHandler(
          isDisabled,
          props.onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined,
          childProps.onClick,
        ),
        tabIndex: isDisabled ? -1 : childProps.tabIndex ?? props.tabIndex,
      };

      return (
        <Slot
          ref={ref as Ref<HTMLElement>}
          className={cn(iconButtonVariants({ variant, size, selected }), className)}
          aria-label={ariaLabel}
          aria-busy={loading || undefined}
          aria-disabled={isDisabled || undefined}
          data-disabled={isDisabled ? 'true' : undefined}
        >
          {cloneElement(childElement, forwardedChildProps, renderContent(childProps.children ?? icon))}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={cn(iconButtonVariants({ variant, size, selected }), className)}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        data-disabled={isDisabled ? 'true' : undefined}
        {...props}
      >
        {renderContent(resolvedContent)}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
