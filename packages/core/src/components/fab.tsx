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
import { cn, Slot } from '../lib/utils';
import { fabSizeClasses } from '../lib/action-size';
import { Ripple } from './ripple';
import {
  ActionSpinner,
  ActionStateLayer,
  actionInteractiveClass,
  getActionAsChildAttributes,
  getActionDisabledState,
  getActionStateAttributes,
} from '../lib/action-control';

const fabVariants = cva(
  `relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-fab transition-all duration-medium ease-emphasized z-30 ${actionInteractiveClass}`,
  {
    variants: {
      variant: {
        primary: 'bg-primary-container text-on-primary-container',
        surface: 'bg-surface text-primary border border-outline-soft',
        secondary: 'bg-secondary-container text-on-secondary-container',
        tertiary: 'bg-tertiary-container text-on-tertiary-container',
      },
      elevation: {
        raised: '',
        flat: 'shadow-none hover:shadow-none [box-shadow:none] hover:[box-shadow:none]',
      },
      size: {
        sm: fabSizeClasses.sm,
        md: fabSizeClasses.md,
        lg: fabSizeClasses.lg,
        extended: fabSizeClasses.extended,
      },
    },
    compoundVariants: [
      {
        variant: 'surface',
        elevation: 'raised',
        className: 'shadow-1 hover:shadow-2',
      },
      {
        variant: 'primary',
        elevation: 'raised',
        className: 'shadow-3 hover:shadow-4',
      },
      {
        variant: 'secondary',
        elevation: 'raised',
        className: 'shadow-3 hover:shadow-4',
      },
      {
        variant: 'tertiary',
        elevation: 'raised',
        className: 'shadow-3 hover:shadow-4',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      elevation: 'raised',
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
      elevation,
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
    const isDisabled = getActionDisabledState(disabled, loading);
    const canRenderAsChild = asChild && isValidElement(children);
    const finalSize = label && (size === 'md' || size === undefined) ? 'extended' : (size ?? 'md');
    const iconSizeClasses = {
      sm: 'size-icon-sm',
      md: 'size-icon-md',
      lg: 'size-icon-lg',
      extended: 'size-icon-md',
    } as const;
    const renderContent = (labelContent: ReactNode, extraContent?: ReactNode) => (
      <>
        <ActionStateLayer className="duration-medium ease-emphasized" />
        <Ripple disabled={isDisabled} />
        <div className="pointer-events-none relative z-10 flex items-center justify-center gap-3">
          {loading ? (
            <ActionSpinner className={iconSizeClasses[finalSize]} />
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
                <span className="text-label-large leading-none font-medium">{labelContent}</span>
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
          className={cn(fabVariants({ variant, elevation, size: finalSize }), className)}
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
        className={cn(fabVariants({ variant, elevation, size: finalSize }), className)}
        disabled={isDisabled}
        {...getActionStateAttributes(isDisabled, loading)}
        {...props}
      >
        {renderContent(label, children)}
      </button>
    );
  },
);

Fab.displayName = 'Fab';
