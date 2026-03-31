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
import { Ripple } from '@/components/ui/ripple';
import { cn, Slot } from '@/lib/utils';
import { iconButtonSizeClasses } from '@/lib/action-size';
import {
  ActionSpinner,
  ActionStateLayer,
  actionInteractiveClass,
  getActionAsChildAttributes,
  getActionDisabledState,
  getActionStateAttributes,
} from '@/lib/action-control';

const iconButtonVariants = cva(
  `relative inline-flex items-center justify-center rounded-icon-button transition-all duration-snappy ease-emphasized ${actionInteractiveClass}`,
  {
    variants: {
      variant: {
        filled: 'bg-primary text-on-primary',
        tonal: 'bg-secondary-container text-on-secondary-container',
        outlined: 'bg-transparent border border-outline-variant text-on-surface-variant',
        standard: 'bg-transparent text-on-surface-variant',
      },
      size: {
        sm: iconButtonSizeClasses.sm,
        md: iconButtonSizeClasses.md,
        lg: iconButtonSizeClasses.lg,
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
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>,
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
    const isDisabled = getActionDisabledState(disabled, loading);
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
          <ActionStateLayer className="z-0" />
          <Ripple center disabled={isDisabled} />
          {loading ? (
            <ActionSpinner className={cn('relative z-10', sizeClass)} />
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
          className={cn(iconButtonVariants({ variant, size, selected }), className)}
          aria-label={ariaLabel}
        >
          {cloneElement(
            childElement,
            forwardedChildProps,
            renderContent(childProps.children ?? icon),
          )}
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
        {...getActionStateAttributes(isDisabled, loading)}
        {...props}
      >
        {renderContent(resolvedContent)}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
