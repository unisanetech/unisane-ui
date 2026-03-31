import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { Surface } from '../primitives/surface';
import { Text } from '../primitives/text';
import { Button } from './button';
import { IconButton } from './icon-button';
import { Icon } from '../primitives/icon';

const bannerVariants = cva(
  'relative w-full flex items-start gap-4 p-4 border-b border-outline-subtle transition-all duration-medium ease-standard',
  {
    variants: {
      variant: {
        default: 'bg-surface text-on-surface',
        info: 'bg-info-container text-on-info-container',
        warning: 'bg-warning-container text-on-warning-container',
        error: 'bg-error-container text-on-error-container',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BannerProps = VariantProps<typeof bannerVariants> & {
  open: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  title?: string;
  message: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
  className?: string;
};

export const Banner: React.FC<BannerProps> = ({
  open,
  onClose,
  icon,
  title,
  message,
  actions,
  className,
  variant = 'default',
}) => {
  if (!open) return null;

  const role = variant === 'error' ? 'alert' : variant === 'warning' ? 'alert' : 'status';
  const isDefaultVariant = variant === 'default';

  return (
    <Surface
      tone="surface"
      className={cn(bannerVariants({ variant, className }))}
      role={role}
      aria-live={variant === 'error' || variant === 'warning' ? 'assertive' : 'polite'}
    >
      {icon && (
        <div
          className={cn(
            'size-icon-sm mt-0.5 flex shrink-0 items-center justify-center',
            isDefaultVariant ? 'text-primary' : 'text-inherit',
          )}
        >
          {icon}
        </div>
      )}

      <div className="min-w-0 flex-1">
        {title && (
          <Text
            variant="titleSmall"
            className={cn('mb-1', isDefaultVariant ? 'text-on-surface' : 'text-inherit')}
          >
            {title}
          </Text>
        )}
        <div
          className={cn(
            'text-body-small leading-relaxed',
            isDefaultVariant ? 'text-on-surface-variant' : 'text-inherit opacity-90',
          )}
        >
          {message}
        </div>

        {actions && actions.length > 0 && (
          <div className="mt-4 flex gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="text"
                size="sm"
                onClick={action.onClick}
                className={cn('font-medium', isDefaultVariant ? 'text-primary' : 'text-inherit')}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      <IconButton
        icon={<Icon symbol="close" size="sm" />}
        onClick={onClose}
        className={cn(
          'hover:bg-state-hover ml-2 shrink-0',
          isDefaultVariant
            ? 'text-on-surface-variant'
            : 'text-inherit opacity-80 hover:opacity-100',
        )}
        aria-label="Close banner"
      />
    </Surface>
  );
};
