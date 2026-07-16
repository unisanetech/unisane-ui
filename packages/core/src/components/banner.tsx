import React, { forwardRef, type MouseEventHandler, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { Surface } from '../primitives/surface';
import { Text } from '../primitives/text';
import { Button } from './button';
import { IconButton } from './icon-button';
import { Icon } from './icon';

const bannerVariants = cva(
  'relative flex w-full items-start gap-4 border-b border-outline-subtle p-4 transition-all duration-medium ease-standard',
  {
    variants: {
      variant: {
        default: 'bg-surface text-on-surface',
        info: 'bg-info-container text-on-info-container',
        success: 'bg-success-container text-on-success-container',
        warning: 'bg-warning-container text-on-warning-container',
        error: 'bg-error-container text-on-error-container',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BannerVariant = NonNullable<VariantProps<typeof bannerVariants>['variant']>;

export interface BannerAction {
  id: string;
  label: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export interface BannerProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'title'>,
    VariantProps<typeof bannerVariants> {
  children: ReactNode;
  open?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
  icon?: ReactNode | string | false;
  title?: ReactNode;
  actions?: BannerAction[];
}

const DEFAULT_ICONS: Record<BannerVariant, string> = {
  default: 'info',
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
};

export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      children,
      open = true,
      onDismiss,
      dismissLabel = 'Dismiss banner',
      icon,
      title,
      actions,
      className,
      variant = 'default',
      role,
      'aria-live': ariaLive,
      'aria-atomic': ariaAtomic,
      ...props
    },
    ref,
  ) => {
    if (!open) return null;

    const resolvedVariant = variant ?? 'default';
    const isAssertive = resolvedVariant === 'error' || resolvedVariant === 'warning';
    const isDefaultVariant = resolvedVariant === 'default';
    const iconNode =
      icon === false ? null : typeof icon === 'string' || icon === undefined ? (
        <Icon symbol={icon ?? DEFAULT_ICONS[resolvedVariant]} size="sm" />
      ) : (
        icon
      );

    return (
      <Surface
        ref={ref}
        tone="surface"
        className={cn(bannerVariants({ variant: resolvedVariant, className }))}
        role={role ?? (isAssertive ? 'alert' : 'status')}
        aria-live={ariaLive ?? (isAssertive ? 'assertive' : 'polite')}
        aria-atomic={ariaAtomic ?? true}
        {...props}
      >
        {iconNode ? (
          <div
            aria-hidden="true"
            className={cn(
              'size-icon-sm mt-0.5 flex shrink-0 items-center justify-center',
              isDefaultVariant ? 'text-primary' : 'text-inherit',
            )}
          >
            {iconNode}
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          {title ? (
            <Text
              variant="titleSmall"
              className={cn('mb-1', isDefaultVariant ? 'text-on-surface' : 'text-inherit')}
            >
              {title}
            </Text>
          ) : null}
          <div
            className={cn(
              'text-body-small leading-relaxed',
              isDefaultVariant ? 'text-on-surface-variant' : 'text-inherit opacity-90',
            )}
          >
            {children}
          </div>

          {actions?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant="text"
                  size="sm"
                  disabled={action.disabled}
                  onClick={action.onClick}
                  className={cn('font-medium', isDefaultVariant ? 'text-primary' : 'text-inherit')}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        {onDismiss ? (
          <IconButton
            icon={<Icon symbol="close" size="sm" />}
            onClick={onDismiss}
            className={cn(
              'hover:bg-state-hover ml-2 shrink-0',
              isDefaultVariant
                ? 'text-on-surface-variant'
                : 'text-inherit opacity-80 hover:opacity-100',
            )}
            aria-label={dismissLabel}
          />
        ) : null}
      </Surface>
    );
  },
);

Banner.displayName = 'Banner';
