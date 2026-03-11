import {
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type ReactElement,
  type Ref,
  cloneElement,
  forwardRef,
  isValidElement,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, Slot, composeAsChildClickHandler } from '@/lib/utils';
import { Ripple } from './ripple';

const fabVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-fab transition-all duration-medium ease-emphasized group cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-38 disabled:cursor-not-allowed data-[disabled=true]:opacity-38 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:pointer-events-none z-30',
  {
    variants: {
      variant: {
        primary: 'bg-primary-container text-on-primary-container shadow-3 hover:shadow-4',
        surface: 'bg-surface text-primary border border-outline-subtle shadow-1 hover:shadow-2',
        secondary: 'bg-secondary-container text-on-secondary-container shadow-3 hover:shadow-4',
        tertiary: 'bg-tertiary-container text-on-tertiary-container shadow-3 hover:shadow-4',
      },
      size: {
        sm: 'h-10 w-10',
        md: 'h-14 w-14',
        lg: 'h-24 w-24',
        extended: 'h-14 w-auto min-w-20 px-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type FabProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof fabVariants> & {
    icon?: ReactNode;
    label?: string;
    loading?: boolean;
    asChild?: boolean;
  };

export const Fab = forwardRef<HTMLButtonElement, FabProps>(
  (
    {
      variant,
      size,
      className,
      icon,
      label,
      loading = false,
      asChild = false,
      children,
      disabled = false,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const canRenderAsChild = asChild && isValidElement(children);
    const finalSize = label && (size === 'md' || size === undefined) ? 'extended' : size ?? 'md';
    const iconSizeClasses = {
      sm: 'size-icon-sm',
      md: 'size-icon-md',
      lg: 'size-icon-lg',
      extended: 'size-icon-md',
    } as const;
    const renderContent = (labelContent: ReactNode, extraContent?: ReactNode) => (
      <>
        <span className="duration-medium ease-emphasized group-hover:opacity-hover group-focus-visible:opacity-focus group-active:opacity-pressed pointer-events-none absolute inset-0 bg-current opacity-0 transition-opacity" />
        <Ripple disabled={isDisabled} />
        <div className="relative z-10 flex items-center justify-center gap-3 pointer-events-none">
          {loading ? (
            <svg
              className={cn('animate-spin', iconSizeClasses[finalSize])}
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
            <>
              {icon ? (
                <span
                  className={cn(
                    'flex items-center justify-center transition-transform',
                    iconSizeClasses[finalSize],
                  )}
                >
                  {icon}
                </span>
              ) : null}
              {labelContent ? (
                <span className="text-label-large font-medium leading-none">{labelContent}</span>
              ) : null}
              {extraContent}
            </>
          )}
        </div>
      </>
    );

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
          className={cn(fabVariants({ variant, size: finalSize }), className)}
          aria-busy={loading || undefined}
          aria-disabled={isDisabled || undefined}
          data-disabled={isDisabled ? 'true' : undefined}
        >
          {cloneElement(
            childElement,
            forwardedChildProps,
            renderContent(label ?? childProps.children, label ? childProps.children : null),
          )}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={cn(fabVariants({ variant, size: finalSize }), className)}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-disabled={isDisabled ? 'true' : undefined}
        {...props}
      >
        {renderContent(label, children)}
      </button>
    );
  },
);

Fab.displayName = 'Fab';
